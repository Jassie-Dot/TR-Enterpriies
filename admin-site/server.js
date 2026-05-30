const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const PORT = Number(process.env.PORT || 4000);
const ROOT = __dirname;
const MAIN_SITE_URL = String(process.env.MAIN_SITE_URL || "http://127.0.0.1:3000").replace(/\/+$/, "");

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".svg", "image/svg+xml"]
]);

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data:",
    "font-src 'self' https://fonts.gstatic.com",
    "style-src 'self' https://fonts.googleapis.com",
    "script-src 'self'",
    `connect-src 'self' ${MAIN_SITE_URL}`
  ].join("; ")
};

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, {
    ...securityHeaders,
    ...headers
  });
  res.end(body);
};

const isInsideRoot = (filePath) => {
  const relative = path.relative(ROOT, filePath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

const serveFile = async (req, res, pathname) => {
  if (pathname === "/config.js") {
    send(
      res,
      200,
      `window.TR_ADMIN_CONFIG = ${JSON.stringify({ apiBaseUrl: MAIN_SITE_URL })};\n`,
      { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-store" }
    );
    return;
  }

  const cleanPath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.resolve(ROOT, cleanPath);

  if (!isInsideRoot(filePath)) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    const content = await fs.readFile(filePath);
    send(res, 200, content, {
      "Content-Type": mimeTypes.get(ext) || "application/octet-stream",
      "Cache-Control": "no-store"
    });
  } catch {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
  }
};

const handleRequest = async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method not allowed", {
      "Allow": "GET, HEAD",
      "Content-Type": "text/plain; charset=utf-8"
    });
    return;
  }

  await serveFile(req, res, requestUrl.pathname);
};

http.createServer(handleRequest).listen(PORT, () => {
  console.log(`TR remote admin is running at http://127.0.0.1:${PORT}`);
  console.log(`Editing main site API: ${MAIN_SITE_URL}`);
});
