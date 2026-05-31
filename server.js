const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const initialSite = require("./data/site");

let imageManifest = {};

try {
  imageManifest = require("./data/image-manifest.json");
} catch {
  imageManifest = {};
}

const PORT = Number(process.env.PORT || 3000);
const IS_PRODUCTION = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
const ALLOW_VERCEL_LIVE = Boolean(process.env.VERCEL) && process.env.DISABLE_VERCEL_LIVE !== "1";
const REDIS_REST_URL = String(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/+$/, "");
const REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const HAS_REMOTE_STORAGE = Boolean(REDIS_REST_URL && REDIS_REST_TOKEN);
const INQUIRIES_STORAGE_KEY = process.env.INQUIRIES_STORAGE_KEY || "tr:inquiries";
const CAN_PERSIST_DATA = !process.env.VERCEL;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const ASSETS_DIR = path.join(ROOT, "assets");
const DATA_DIR = path.join(ROOT, "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const MAX_BODY_BYTES = 1024 * 512;
const PUBLIC_SITE_PLACEHOLDER = "__TR_SITE_DATA__";
const PUBLIC_PRELOAD_PLACEHOLDER = "<!-- __TR_PRELOAD_LINKS__ -->";
const INQUIRY_LIMIT = { limit: 8, windowMs: 60 * 60 * 1000 };
const siteState = initialSite;
const rateLimitStore = new Map();

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".avif", "image/avif"],
  [".svg", "image/svg+xml"],
  [".ico", "image/x-icon"]
]);

const immutableStaticExtensions = new Set([
  ".avif",
  ".css",
  ".gif",
  ".ico",
  ".jpg",
  ".jpeg",
  ".js",
  ".png",
  ".svg",
  ".webp"
]);

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  ...(IS_PRODUCTION ? { "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload" } : {}),
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "img-src 'self' data:",
    "font-src 'self' https://fonts.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "script-src 'self'",
    `script-src-elem 'self'${ALLOW_VERCEL_LIVE ? " https://vercel.live" : ""}`,
    `connect-src 'self'${ALLOW_VERCEL_LIVE ? " https://vercel.live" : ""}`,
    `frame-src 'self'${ALLOW_VERCEL_LIVE ? " https://vercel.live" : ""}`,
    ...(IS_PRODUCTION ? ["upgrade-insecure-requests"] : [])
  ].join("; ")
};

const send = (res, status, body, headers = {}, method = "GET") => {
  res.writeHead(status, {
    ...securityHeaders,
    ...headers
  });
  res.end(method === "HEAD" ? undefined : body);
};

const sendJson = (res, status, payload, headers = {}) => {
  send(res, status, JSON.stringify(payload), {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
};

const getHeader = (req, name) => {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value || "";
};

const getClientIp = (req) =>
  getHeader(req, "x-forwarded-for").split(",")[0].trim() ||
  req.socket?.remoteAddress ||
  "unknown";

const isRateLimited = (req, bucket, { limit, windowMs }) => {
  const now = Date.now();
  const key = `${bucket}:${getClientIp(req)}`;
  const hits = (rateLimitStore.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
  hits.push(now);
  rateLimitStore.set(key, hits);
  return hits.length > limit;
};

const isSameOriginRequest = (req) => {
  const host = getHeader(req, "host");
  const origin = getHeader(req, "origin");
  const referer = getHeader(req, "referer");

  try {
    if (origin) return new URL(origin).host === host;
    if (referer) return new URL(referer).host === host;
  } catch {
    return false;
  }

  return false;
};

const rejectCrossOriginMutation = (req, res) => {
  if (isSameOriginRequest(req)) return false;

  sendJson(res, 403, {
    ok: false,
    message: "Cross-origin requests are not allowed."
  });
  return true;
};

const rejectNonJsonRequest = (req, res) => {
  const contentType = getHeader(req, "content-type").split(";")[0].trim().toLowerCase();
  if (contentType === "application/json") return false;

  sendJson(res, 415, {
    ok: false,
    message: "Content-Type must be application/json."
  });
  return true;
};

const normalizePathname = (pathname) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    let bodyTooLarge = false;

    req.on("data", (chunk) => {
      if (bodyTooLarge) return;

      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        bodyTooLarge = true;
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON payload."));
      }
    });

    req.on("error", reject);
  });

const writeJsonFile = async (filePath, payload) => {
  if (!CAN_PERSIST_DATA) {
    return false;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(payload, null, 2)}\n`);
  await fs.rename(tempPath, filePath);
  return true;
};

const runRedisCommand = async (command) => {
  if (!HAS_REMOTE_STORAGE) {
    throw new Error("Remote storage is not configured.");
  }

  const response = await fetch(REDIS_REST_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${REDIS_REST_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command)
  });

  const text = await response.text();
  let payload = {};

  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Remote storage returned an invalid response (${response.status}).`);
  }

  if (!response.ok || payload.error) {
    throw new Error(payload.error || `Remote storage request failed (${response.status}).`);
  }

  return payload.result;
};

const pickFields = (source = {}, keys = []) =>
  keys.reduce((result, key) => {
    if (source[key] !== undefined) result[key] = source[key];
    return result;
  }, {});

const getPublicImageManifest = () =>
  Object.fromEntries(
    Object.entries(imageManifest).map(([src, meta]) => [
      src,
      {
        width: meta.width,
        height: meta.height,
        placeholder: meta.placeholder,
        formats: {
          avif: (meta.formats?.avif || []).map((variant) => ({ src: variant.src, width: variant.width })),
          webp: (meta.formats?.webp || []).map((variant) => ({ src: variant.src, width: variant.width }))
        }
      }
    ])
  );

const getPublicSiteState = () => ({
  brand: pickFields(siteState.brand, ["name", "shortName", "phone", "whatsapp", "email", "location", "address", "workingHours", "mapUrl"]),
  hero: pickFields(siteState.hero, ["eyebrow", "title", "text", "image", "chips", "slides"]),
  sections: siteState.sections,
  metrics: siteState.metrics,
  whyChoose: siteState.whyChoose || [],
  trustedBy: siteState.trustedBy || [],
  services: siteState.services,
  projects: siteState.projects,
  leadership: siteState.leadership || [],
  process: siteState.process,
  testimonials: siteState.testimonials,
  gallery: siteState.gallery,
  images: getPublicImageManifest()
});

const serializeJsonForHtml = (payload) =>
  JSON.stringify(payload)
    .replaceAll("&", "\\u0026")
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");

const getPageKeyFromPathname = (pathname = "/") => {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  if (cleanPath === "/" || cleanPath === "/index.html") return "home";
  if (cleanPath === "/about" || cleanPath === "/company") return "about";
  if (cleanPath === "/services" || cleanPath === "/product-services") return "services";
  if (cleanPath === "/leadership") return "leadership";
  if (cleanPath === "/projects" || cleanPath === "/reference-project") return "projects";
  if (cleanPath === "/gallery") return "gallery";
  return "other";
};

const formatImageSrcset = (variants = []) =>
  variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ");

const preloadImage = (src, sizes, fetchPriority = "high") => {
  const meta = imageManifest[src];
  const variants = meta?.formats?.avif?.length ? meta.formats.avif : meta?.formats?.webp;
  if (!meta || !variants?.length) return "";

  const preferred = variants[Math.min(variants.length - 1, Math.max(0, variants.length - 2))];
  const type = meta.formats?.avif?.length ? "image/avif" : "image/webp";

  return `<link rel="preload" as="image" href="${preferred.src}" type="${type}" imagesrcset="${formatImageSrcset(variants)}" imagesizes="${sizes}" fetchpriority="${fetchPriority}">`;
};

const getPreloadTargets = (pathname) => {
  const page = getPageKeyFromPathname(pathname);
  const serviceSizes = "(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw";
  const gallerySizes = "(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 25vw";
  const projectSizes = "(max-width: 760px) 100vw, 50vw";

  if (page === "services") {
    return (siteState.services || [])
      .slice(0, 4)
      .map((service) => ({ src: service.image, sizes: serviceSizes }));
  }

  if (page === "gallery") {
    return (siteState.gallery || [])
      .slice(0, 4)
      .map((item) => ({ src: item.image, sizes: gallerySizes }));
  }

  if (page === "projects") {
    return (siteState.projects || [])
      .slice(0, 2)
      .map((project) => ({ src: project.image, sizes: projectSizes }));
  }

  if (page === "leadership") {
    return (siteState.leadership || [])
      .filter((leader) => leader.image)
      .slice(0, 1)
      .map((leader) => ({ src: leader.image, sizes: "(max-width: 760px) 100vw, 50vw" }));
  }

  const firstHeroSlide = siteState.hero?.slides?.[0]?.image || siteState.hero?.image;
  return firstHeroSlide ? [{ src: firstHeroSlide, sizes: "100vw" }] : [];
};

const buildPreloadLinks = (pathname) =>
  getPreloadTargets(pathname)
    .map((target) => preloadImage(target.src, target.sizes))
    .filter(Boolean)
    .join("\n    ");

const injectPublicSiteData = (html, pathname = "/") =>
  html
    .replace(PUBLIC_SITE_PLACEHOLDER, serializeJsonForHtml(getPublicSiteState()))
    .replace(PUBLIC_PRELOAD_PLACEHOLDER, buildPreloadLinks(pathname));

const sanitize = (value) => String(value || "").trim().slice(0, 800);

const createWhatsAppMessage = (inquiry) =>
  [
    "Hello TR-Enterpriies, I want a free quote.",
    `Company: ${inquiry.companyName || inquiry.name}`,
    `Contact: ${inquiry.contactNumber || inquiry.phone}`,
    inquiry.email ? `Email: ${inquiry.email}` : "",
    `Work: ${inquiry.work || inquiry.service}`,
    inquiry.projectLocation || inquiry.location ? `Location: ${inquiry.projectLocation || inquiry.location}` : "",
    inquiry.message ? `Message: ${inquiry.message}` : ""
  ]
    .filter(Boolean)
    .join("\n");

const saveInquiry = async (inquiry) => {
  if (HAS_REMOTE_STORAGE) {
    try {
      await runRedisCommand(["LPUSH", INQUIRIES_STORAGE_KEY, JSON.stringify(inquiry)]);
      try {
        await runRedisCommand(["LTRIM", INQUIRIES_STORAGE_KEY, 0, 499]);
      } catch (error) {
        console.warn(`Unable to trim stored inquiries: ${error.message}`);
      }
      return true;
    } catch (error) {
      console.warn(`Unable to save inquiry remotely: ${error.message}`);
      return false;
    }
  }

  let existing = [];

  try {
    existing = JSON.parse(await fs.readFile(INQUIRIES_FILE, "utf8"));
  } catch {
    existing = [];
  }

  existing.unshift(inquiry);
  return writeJsonFile(INQUIRIES_FILE, existing);
};

const handleInquiry = async (req, res) => {
  try {
    const payload = await readJsonBody(req);
    const companyName = sanitize(payload.companyName || payload.name);
    const contactNumber = sanitize(payload.contactNumber || payload.phone);
    const work = sanitize(payload.work || payload.service);
    const projectLocation = sanitize(payload.projectLocation || payload.location);
    const inquiry = {
      id: crypto.randomUUID(),
      companyName,
      contactNumber,
      email: sanitize(payload.email),
      work,
      projectLocation,
      message: sanitize(payload.message),
      name: companyName,
      phone: contactNumber,
      service: work,
      location: projectLocation,
      createdAt: new Date().toISOString()
    };

    if (!inquiry.companyName || !inquiry.contactNumber || !inquiry.email || !inquiry.work) {
      sendJson(res, 400, {
        ok: false,
        message: "Company name, contact number, email, and work requirement are required."
      });
      return;
    }

    const persisted = await saveInquiry(inquiry);

    const whatsappText = createWhatsAppMessage(inquiry);
    const whatsappUrl = `https://wa.me/${siteState.brand.whatsapp}?text=${encodeURIComponent(whatsappText)}`;

    sendJson(res, 201, {
      ok: true,
      message: persisted ? "Inquiry saved successfully." : "Inquiry received. Continue on WhatsApp.",
      whatsappUrl
    });
  } catch (error) {
    sendJson(res, 400, {
      ok: false,
      message: error.message || "Unable to submit inquiry."
    });
  }
};

const isInsideDirectory = (filePath, directory) => {
  const relative = path.relative(directory, filePath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

const resolveFromDirectory = (directory, relativePath) => {
  const filePath = path.resolve(directory, relativePath);
  return isInsideDirectory(filePath, directory) ? filePath : null;
};

const resolveStaticPath = (urlPath) => {
  let decoded;

  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }

  const cleanPath = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");

  if (cleanPath === "favicon.ico") {
    return resolveFromDirectory(PUBLIC_DIR, "favicon.svg");
  }

  if (cleanPath.startsWith("assets/")) {
    return resolveFromDirectory(ASSETS_DIR, cleanPath.replace(/^assets\//, ""));
  }

  return resolveFromDirectory(PUBLIC_DIR, cleanPath);
};

const getStaticCacheControl = (filePath, ext) => {
  if (ext === ".html") return "no-store";
  if (isInsideDirectory(filePath, ASSETS_DIR)) return "public, max-age=31536000, immutable";
  if (immutableStaticExtensions.has(ext)) return "public, max-age=31536000, immutable";
  return "public, max-age=3600";
};

const serveStatic = async (req, res, urlPath, pagePath = urlPath) => {
  const filePath = resolveStaticPath(urlPath);

  if (!filePath) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" }, req.method);
    return;
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    let content = await fs.readFile(filePath);
    const responseHeaders = {
      "Content-Type": mimeTypes.get(ext) || "application/octet-stream",
      "Cache-Control": getStaticCacheControl(filePath, ext)
    };

    if (ext === ".html" && path.basename(filePath) === "index.html") {
      content = injectPublicSiteData(content.toString("utf8"), pagePath);
    }

    send(res, 200, content, responseHeaders, req.method);
  } catch {
    if (!path.extname(urlPath)) {
      await serveStatic(req, res, "/index.html", urlPath);
      return;
    }

    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" }, req.method);
  }
};

const handleRequest = async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const method = req.method || "GET";
  const pathname = normalizePathname(requestUrl.pathname);

  if (method === "GET" && pathname === "/api/health" && process.env.ENABLE_HEALTHCHECK === "1") {
    sendJson(res, 200, { ok: true, service: "TR-Enterpriies API", timestamp: new Date().toISOString() });
    return;
  }

  if (method === "POST" && pathname === "/api/inquiries") {
    if (rejectCrossOriginMutation(req, res)) return;
    if (rejectNonJsonRequest(req, res)) return;
    if (isRateLimited(req, "inquiry", INQUIRY_LIMIT)) {
      sendJson(res, 429, { ok: false, message: "Too many submissions. Please try again later." });
      return;
    }

    await handleInquiry(req, res);
    return;
  }

  if (pathname.startsWith("/api/")) {
    sendJson(res, 404, { ok: false, message: "API route not found." });
    return;
  }

  if (method !== "GET" && method !== "HEAD") {
    send(res, 405, "Method not allowed", {
      "Allow": "GET, HEAD",
      "Content-Type": "text/plain; charset=utf-8"
    }, method);
    return;
  }

  await serveStatic(req, res, pathname, pathname);
};

if (require.main === module) {
  http.createServer(handleRequest).listen(PORT, () => {
    console.log(`TR-Enterpriies is running at http://127.0.0.1:${PORT}`);
  });
}

module.exports = handleRequest;
