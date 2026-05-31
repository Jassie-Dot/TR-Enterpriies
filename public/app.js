const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const initialsFor = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const telHref = (phone = "") => `tel:${String(phone).replace(/[^\d+]/g, "")}`;

const quoteMessage = (brand) => `Hello ${brand.name || "TR-Enterpriies"}, I want a free quote.`;

const whatsappHref = (brand, message = quoteMessage(brand)) =>
  `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;

const PAGE_SECTIONS = {
  home: ["about", "services", "cta"],
  about: ["about", "leadership", "clients", "cta"],
  services: ["services", "why", "cta"],
  leadership: ["leadership", "cta"],
  projects: ["projects", "clients", "cta"],
  "social-impact": ["safety", "cta"],
  gallery: ["gallery", "cta"],
  contact: ["contact"]
};

const getPageKey = () => {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/index.html") return "home";
  if (path === "/about" || path === "/company") return "about";
  if (path === "/services" || path === "/product-services") return "services";
  if (path === "/leadership") return "leadership";
  if (path === "/projects" || path === "/reference-project") return "projects";
  if (path === "/social-impact" || path === "/safety") return "social-impact";
  if (path === "/gallery") return "gallery";
  if (path === "/contact") return "contact";
  return "home";
};

const setText = (selector, value) => {
  const node = $(selector);
  if (node && value !== undefined) node.textContent = value;
};

const setHref = (selector, value) => {
  const node = $(selector);
  if (node && value) node.href = value;
};

const setupScrollControls = () => {
  const progress = $("[data-scroll-progress]");
  const toTop = $("[data-to-top]");
  let frame = 0;
  let isToTopVisible = !toTop?.classList.contains("hidden");

  const update = () => {
    frame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;

    if (toTop) {
      const shouldShowToTop = window.scrollY >= 640;
      if (shouldShowToTop !== isToTopVisible) {
        isToTopVisible = shouldShowToTop;
        toTop.classList.toggle("hidden", !shouldShowToTop);
      }
    }
  };

  const scheduleUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  update();
};

const setupMenu = () => {
  const toggle = $("[data-menu-toggle]");
  const nav = $("[data-mobile-nav]");

  toggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  $$("[data-mobile-nav] a").forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.add("hidden");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });
};

const setupReveal = () => {
  const items = $$(".reveal");
  const skipMotion =
    window.matchMedia("(max-width: 767px)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (skipMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 10, 70)}ms`;
    observer.observe(item);
  });
};

/* Premium animations: parallax background and 3D card tilt */
const setupParallax = () => {
  const hero = document.querySelector('.hero-section');
  const heroImage = document.querySelector('.hero-background-image');
  if (!hero || !heroImage) return;

  heroImage.classList.add('parallax');

  const onPointer = (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const px = ((e.clientX || (e.touches && e.touches[0].clientX)) - cx) / rect.width;
    const py = ((e.clientY || (e.touches && e.touches[0].clientY)) - cy) / rect.height;
    const max = 12;
    const tx = -px * max;
    const ty = -py * (max * 0.6);
    heroImage.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.02)`;
  };

  const onScroll = () => {
    const scrolled = window.scrollY || window.pageYOffset;
    const offset = Math.min(Math.max(scrolled / 8, 0), 120);
    heroImage.style.transform = `translate3d(0, ${offset * 0.15}px, 0) scale(1.02)`;
  };

  // Pointer move for desktop-like devices
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
};

const setupCardTilt = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = Array.from(document.querySelectorAll('.service-card'));
  cards.forEach((card) => {
    // wrap contents in .card-inner if missing
    if (!card.querySelector('.card-inner')) {
      const inner = document.createElement('div');
      inner.className = 'card-inner';
      while (card.firstChild) inner.appendChild(card.firstChild);
      card.appendChild(inner);
    }

    const inner = card.querySelector('.card-inner');

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const px = ((e.clientX || (e.touches && e.touches[0].clientX)) - rect.left) / rect.width;
      const py = ((e.clientY || (e.touches && e.touches[0].clientY)) - rect.top) / rect.height;
      const rx = (py - 0.5) * 10; // rotateX
      const ry = (px - 0.5) * -12; // rotateY
      inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      card.classList.add('tilt-active');
    };

    const onLeave = () => {
      inner.style.transform = '';
      card.classList.remove('tilt-active');
    };

    card.addEventListener('pointermove', onMove, { passive: true });
    card.addEventListener('pointerleave', onLeave);
    card.addEventListener('pointerdown', () => card.classList.add('active'));
    card.addEventListener('pointerup', () => card.classList.remove('active'));
  });
};

const setupTheme = () => {
  const button = document.querySelector('[data-theme-toggle]');
  const html = document.documentElement;
  const storageKey = 'tr-theme';

  const updateButton = (theme) => {
    if (!button) return;
    const isLight = theme === 'light';
    button.setAttribute('aria-pressed', String(isLight));
    const sun = button.querySelector('.icon-sun');
    const moon = button.querySelector('.icon-moon');
    if (sun && moon) {
      // for inline SVG elements prefer visibility / opacity
      sun.style.display = isLight ? 'inline' : 'none';
      moon.style.display = isLight ? 'none' : 'inline';
    }
  };

  const getTheme = () => html.dataset.theme === 'light' ? 'light' : 'dark';

  const setTheme = (theme, persist = true) => {
    // add switching class for smooth CSS transitions
    html.classList.add('theme-switching');
    window.setTimeout(() => html.classList.remove('theme-switching'), 380);
    html.dataset.theme = theme === 'light' ? 'light' : 'dark';
    html.setAttribute('data-theme', html.dataset.theme);
    if (persist) {
      try { localStorage.setItem(storageKey, theme); } catch (e) {}
    }
    updateButton(theme);
  };

  if (!button) return;

  // initialize button state - if missing, read stored or system pref
  if (!html.dataset.theme) {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark') html.dataset.theme = stored;
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) html.dataset.theme = 'dark';
      else html.dataset.theme = 'light';
      html.setAttribute('data-theme', html.dataset.theme);
    } catch (e) {}
  }
  updateButton(getTheme());

  button.addEventListener('click', () => {
    const next = getTheme() === 'light' ? 'dark' : 'light';
    setTheme(next);
  });

  // respond to system preference changes only when user hasn't set an explicit theme
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const changeHandler = (e) => setTheme(e.matches ? 'dark' : 'light', false);
      if (mq.addEventListener) mq.addEventListener('change', changeHandler);
      else if (mq.addListener) mq.addListener(changeHandler);
    }
  } catch (e) {}
};

const renderBrand = ({ brand, services = [] }) => {
  setText("[data-brand-short]", brand.shortName);
  setText("[data-brand-name]", brand.name);
  setText("[data-top-location]", brand.location);
  setText("[data-top-phone]", brand.phone);
  setText("[data-top-email]", brand.email);

  setHref("[data-top-phone]", telHref(brand.phone));
  setHref("[data-top-email]", `mailto:${brand.email}`);
  setHref("[data-phone-link]", telHref(brand.phone));
  setHref("[data-floating-call]", telHref(brand.phone));
  setHref("[data-floating-whatsapp]", whatsappHref(brand));

  const navServices = $("[data-nav-services]");
  if (navServices) {
    navServices.innerHTML = services
      .map((service) => `<a href="#" data-open-service="${escapeHtml(service.id)}">${escapeHtml(service.title)}</a>`)
      .join("");
  }
};

const renderHero = ({ brand, hero = {}, metrics = [] }) => {
  setText("[data-hero-eyebrow]", hero.eyebrow);
  setText("[data-hero-title]", hero.title);
  setText("[data-hero-text]", hero.text);
  setHref("[data-hero-whatsapp]", whatsappHref(brand));

  const slides = hero.slides?.length ? hero.slides : [{ image: hero.image, title: hero.title }];
  const slider = $("[data-hero-slider]");
  const dots = $("[data-hero-dots]");

  if (slider) {
    slider.innerHTML = slides
      .map(
        (slide, index) => `
          <img
            class="hero-slide ${index === 0 ? "active" : ""}"
            src="${escapeHtml(slide.image)}"
            alt="${escapeHtml(slide.title || hero.title || brand.name)}"
            data-hero-slide="${index}"
            decoding="async"
            ${index === 0 ? 'fetchpriority="high"' : 'fetchpriority="low"'}
          />
        `
      )
      .join("");
  }

  if (dots) {
    dots.innerHTML = slides
      .map(
        (slide, index) => `
          <button class="${index === 0 ? "active" : ""}" type="button" aria-label="Show ${escapeHtml(slide.title || `slide ${index + 1}`)}" data-hero-dot="${index}"></button>
        `
      )
      .join("");
  }

  const setActiveSlide = (nextIndex) => {
    $$("[data-hero-slide]").forEach((slide) => slide.classList.toggle("active", Number(slide.dataset.heroSlide) === nextIndex));
    $$("[data-hero-dot]").forEach((dot) => dot.classList.toggle("active", Number(dot.dataset.heroDot) === nextIndex));
  };

  if (slides.length > 1) {
    let activeIndex = 0;
    let timer = window.setInterval(() => {
      activeIndex = (activeIndex + 1) % slides.length;
      setActiveSlide(activeIndex);
    }, 5200);

    $$("[data-hero-dot]").forEach((dot) => {
      dot.addEventListener("click", () => {
        activeIndex = Number(dot.dataset.heroDot);
        setActiveSlide(activeIndex);
        window.clearInterval(timer);
        timer = window.setInterval(() => {
          activeIndex = (activeIndex + 1) % slides.length;
          setActiveSlide(activeIndex);
        }, 5200);
      });
    });
  }

  const metricRoot = $("[data-hero-metrics]");
  if (metricRoot) {
    metricRoot.innerHTML = metrics
      .map(
        (metric) => `
          <div>
            <strong>${escapeHtml(metric.value)}</strong>
            <span>${escapeHtml(metric.label)}</span>
          </div>
        `
      )
      .join("");
  }
};

const renderStaticContent = (sections = {}) => {
  const marquee = sections.marquee || [];
  if (marquee.length) {
    $("[data-marquee-track]").innerHTML = [...marquee, ...marquee]
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");
  }

  setText("[data-about-eyebrow]", sections.about?.eyebrow);
  setText("[data-about-title]", sections.about?.title);
  setText("[data-about-text]", sections.about?.text);
  setText("[data-about-statement]", sections.about?.statement);
  setText("[data-about-director]", sections.about?.directorNote);
  setText("[data-services-eyebrow]", sections.services?.eyebrow);
  setText("[data-services-title]", sections.services?.title);
  setText("[data-services-text]", sections.services?.text);
  setText("[data-why-eyebrow]", sections.why?.eyebrow);
  setText("[data-why-title]", sections.why?.title);
  setText("[data-why-text]", sections.why?.text);
  setText("[data-projects-eyebrow]", sections.projects?.eyebrow);
  setText("[data-projects-title]", sections.projects?.title);
  setText("[data-projects-text]", sections.projects?.text);
  setText("[data-leadership-eyebrow]", sections.leadership?.eyebrow);
  setText("[data-leadership-title]", sections.leadership?.title);
  setText("[data-leadership-text]", sections.leadership?.text);
  setText("[data-safety-eyebrow]", sections.safety?.eyebrow);
  setText("[data-safety-title]", sections.safety?.title);
  setText("[data-safety-text]", sections.safety?.text);
  setText("[data-safety-medical]", sections.safety?.medical);
  setText("[data-safety-commitment]", sections.safety?.commitment);
  setText("[data-gallery-eyebrow]", sections.gallery?.eyebrow);
  setText("[data-gallery-title]", sections.gallery?.title);
  setText("[data-gallery-text]", sections.gallery?.text);
  setText("[data-trusted-eyebrow]", sections.trusted?.eyebrow);
  setText("[data-trusted-title]", sections.trusted?.title);
  setText("[data-trusted-text]", sections.trusted?.text);
  setText("[data-cta-eyebrow]", sections.cta?.eyebrow);
  setText("[data-cta-title]", sections.cta?.title);
  setText("[data-cta-text]", sections.cta?.text);
  setText("[data-cta-button]", sections.cta?.button);
  setText("[data-cta-whatsapp]", sections.cta?.whatsappButton);
  setText("[data-contact-eyebrow]", sections.contact?.eyebrow);
  setText("[data-contact-title]", sections.contact?.title);
  setText("[data-contact-form-eyebrow]", sections.contact?.formEyebrow);
  setText("[data-contact-form-title]", sections.contact?.formTitle);
  setText("[data-contact-submit]", sections.contact?.button);
  setText("[data-footer-tagline]", sections.footer?.tagline);
  setText("[data-footer-copyright]", sections.footer?.copyright);
};

const renderAbout = (about = {}) => {
  const root = $("[data-about-highlights]");
  if (!root) return;

  root.innerHTML = (about.highlights || [])
    .map(
      (item) => `
        <article>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.text)}</span>
        </article>
      `
    )
    .join("");
};

const renderServices = (services = []) => {
  const root = $("[data-services]");
  if (!root) return;

  root.innerHTML = services
    .map(
      (service) => `
        <article class="service-card reveal" id="${escapeHtml(service.id)}">
          <a href="#" data-open-service="${escapeHtml(service.id)}" aria-label="View details for ${escapeHtml(service.title)}">
            <img src="${escapeHtml(service.image)}" alt="${escapeHtml(service.title)}" decoding="async" />
            <div>
              <span>${escapeHtml(service.category)}</span>
              <h3>${escapeHtml(service.title)}</h3>
              <p>${escapeHtml(service.summary)}</p>
              <ul>
                ${(service.bullets || []).map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
              </ul>
            </div>
          </a>
        </article>
      `
    )
    .join("");
};

const renderWhyChoose = ({ whyChoose = [], trustedBy = [] }) => {
  const root = $("[data-why-choose]");
  if (root) {
    root.innerHTML = whyChoose
      .map(
        (item, index) => `
          <article>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.text)}</p>
          </article>
        `
      )
      .join("");
  }

  const trusted = $("[data-trusted-by]");
  if (trusted) {
    trusted.innerHTML = trustedBy
      .map((company) => `<span>${escapeHtml(company)}</span>`)
      .join("");
  }
};

const renderProjects = (projects = []) => {
  const root = $("[data-projects]");
  if (!root) return;

  root.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card reveal">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" decoding="async" />
          <div>
            <span>${escapeHtml(project.type)}</span>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.impact)}</p>
            <dl>
              <div><dt>Requirement</dt><dd>${escapeHtml(project.requirement)}</dd></div>
              <div><dt>Work done</dt><dd>${escapeHtml(project.workDone)}</dd></div>
              <div><dt>Result</dt><dd>${escapeHtml(project.result)}</dd></div>
            </dl>
          </div>
        </article>
      `
    )
    .join("");
};

const renderLeadership = (leadership = []) => {
  const root = $("[data-leadership]");
  if (!root) return;

  root.innerHTML = leadership
    .map(
      (leader) => `
        <article class="leader-card reveal">
          <div class="leader-photo" aria-label="${escapeHtml(leader.name)} portrait">
            <span>${escapeHtml(initialsFor(leader.name))}</span>
            ${
              leader.image
                ? `<img src="${escapeHtml(leader.image)}" alt="${escapeHtml(leader.name)}" decoding="async" data-leader-image />`
                : ""
            }
          </div>
          <div>
            <span>${escapeHtml(leader.role)}</span>
            <h3>${escapeHtml(leader.name)}</h3>
            ${leader.experience ? `<p>${escapeHtml(leader.experience)}</p>` : ""}
          </div>
        </article>
      `
    )
    .join("");

  $$("[data-leader-image]", root).forEach((image) => {
    image.addEventListener("error", () => image.remove());
  });
};

const renderSafety = (safety = {}) => {
  const training = $("[data-safety-training]");
  const equipment = $("[data-safety-equipment]");

  if (training) {
    training.innerHTML = (safety.training || [])
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");
  }

  if (equipment) {
    equipment.innerHTML = (safety.equipment || [])
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");
  }
};

const setupGallery = (gallery = []) => {
  const grid = $("[data-gallery]");
  const lightbox = $("[data-lightbox]");
  const image = $("[data-lightbox-image]");
  const caption = $("[data-lightbox-caption]");
  if (!grid || !lightbox || !image || !caption) return;

  grid.innerHTML = gallery
    .map(
      (item, index) => `
        <button class="gallery-item reveal ${index === 0 ? "gallery-hero-tile" : ""}" type="button" data-gallery-index="${index}">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" decoding="async" />
          <span>${escapeHtml(item.title)}</span>
        </button>
      `
    )
    .join("");

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-gallery-index]");
    if (!button) return;

    const item = gallery[Number(button.dataset.galleryIndex)];
    image.src = item.image;
    image.alt = item.title;
    caption.textContent = item.title;
    lightbox.classList.remove("hidden");
  });

  const close = () => lightbox.classList.add("hidden");
  $("[data-lightbox-close]")?.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
};

const renderFooter = ({ brand, services = [] }) => {
  const serviceLinks = $("[data-footer-services]");
  if (serviceLinks) {
    serviceLinks.innerHTML = services
      .map((service) => `<a href="#" data-open-service="${escapeHtml(service.id)}">${escapeHtml(service.title)}</a>`)
      .join("");
  }

  setHref("[data-footer-phone]", telHref(brand.phone));
  setText("[data-footer-phone]", brand.phone);
  setHref("[data-footer-whatsapp]", whatsappHref(brand));
  setHref("[data-footer-email]", `mailto:${brand.email}`);
  setText("[data-footer-email]", brand.email);
  setText("[data-footer-address]", brand.address);
  setText("[data-footer-hours]", brand.workingHours || "Mon-Sat available");
};

const setupContact = ({ brand, services = [] }) => {
  setHref("[data-contact-phone]", telHref(brand.phone));
  setText("[data-contact-phone-text]", brand.phone);
  setHref("[data-contact-whatsapp]", whatsappHref(brand));
  setText("[data-contact-whatsapp-text]", brand.phone);
  setHref("[data-contact-email]", `mailto:${brand.email}`);
  setText("[data-contact-email-text]", brand.email);
  setHref("[data-contact-map]", brand.mapUrl);
  setText("[data-contact-address]", brand.address);
  setText("[data-contact-location]", brand.location);
  setText("[data-contact-hours]", brand.workingHours || "Mon-Sat available");
  setHref("[data-cta-whatsapp]", whatsappHref(brand));

  const select = $("[data-service-select]");
  if (select) {
    select.innerHTML = [
      '<option value="">Select work type</option>',
      ...services.map((service) => `<option>${escapeHtml(service.title)}</option>`)
    ].join("");
  }

  const form = $("[data-inquiry-form]");
  const note = $("[data-form-note]");
  const whatsappResult = $("[data-whatsapp-result]");
  if (!form || !note || !whatsappResult) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    note.textContent = "Sending...";
    note.className = "form-note";
    whatsappResult.classList.add("hidden");

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Unable to submit inquiry.");
      }

      note.textContent = "Enquiry saved. Continue on WhatsApp.";
      note.className = "form-note success";
      whatsappResult.href = result.whatsappUrl;
      whatsappResult.classList.remove("hidden");
      form.reset();
    } catch (error) {
      note.textContent = error.message || "Please try again.";
      note.className = "form-note error";
    }
  });
};

const applyPageMode = (site) => {
  const page = getPageKey();
  const sections = new Set(PAGE_SECTIONS[page] || PAGE_SECTIONS.home);
  const isHome = page === "home";
  const pageMeta = {
    about: {
      eyebrow: "Company",
      title: "About TR-Enterpriies",
      text: site.sections.about?.text
    },
    services: {
      eyebrow: "Product & Services",
      title: "Product & Services",
      text: site.sections.services?.text
    },
    leadership: {
      eyebrow: "Leadership",
      title: "Leadership Team",
      text: site.sections.leadership?.text
    },
    projects: {
      eyebrow: "Reference Project",
      title: "Reference Projects",
      text: site.sections.projects?.text
    },
    "social-impact": {
      eyebrow: "Social Impact",
      title: "Safety & Social Impact",
      text: site.sections.safety?.text
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Gallery",
      text: site.sections.gallery?.text
    },
    contact: {
      eyebrow: "Contact",
      title: "Contact TR-Enterpriies",
      text: "Send your requirement and our team will respond quickly."
    }
  };
  const meta = pageMeta[page] || {};

  document.body.dataset.page = page;

  $$("[data-home-only]").forEach((node) => {
    node.classList.toggle("hidden", !isHome);
  });

  const banner = $("[data-page-banner]");
  if (banner) {
    banner.classList.toggle("hidden", isHome);
    setText("[data-page-eyebrow]", meta.eyebrow || "TR-Enterpriies");
    setText("[data-page-title]", meta.title || "TR-Enterpriies");
    setText("[data-page-text]", meta.text || "Reliable field teams for solar, industrial, and plant operations.");
  }

  $$("[data-page-section]").forEach((node) => {
    const key = node.dataset.pageSection;
    node.classList.toggle("hidden", !sections.has(key));
  });

  $$("[data-nav-page]").forEach((link) => {
    const navPage = link.dataset.navPage;
    const isActive =
      navPage === page ||
      (navPage === "about" && (page === "leadership" || page === "projects"));
    link.classList.toggle("active", isActive);
  });

  if (!isHome) {
    document.title = `${meta.title || "TR-Enterpriies"} | TR-Enterpriies`;
  }
};

const loadSite = () => {
  const dataNode = $("[data-site-data]");
  if (!dataNode) throw new Error("Site data was not embedded by the server.");

  const raw = (dataNode.content?.textContent || dataNode.textContent || "{}").trim();
  const site = JSON.parse(raw);
  if (!site.brand || !site.hero || !site.sections) {
    throw new Error("Site data is incomplete.");
  }
  return site;
};

const renderServiceMedia = (service) => {
  const images = [
    { title: service.title, image: service.image },
    ...(service.gallery || [])
  ].filter((item) => item?.image);

  if (!images.length) return "";

  const [primary, ...supporting] = images;
  const supportingMarkup = supporting.length
    ? `
      <div class="service-modal-gallery">
        ${supporting
          .map(
            (item) => `
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title || service.title)}" decoding="async" />
            `
          )
          .join("")}
      </div>
    `
    : "";

  return `
    <div class="service-modal-media">
      <img src="${escapeHtml(primary.image)}" alt="${escapeHtml(primary.title || service.title)}" decoding="async" fetchpriority="high" />
      ${supportingMarkup}
    </div>
  `;
};

const setupServiceModal = (services = []) => {
  const modal = $("[data-service-modal]");
  const body = $("[data-service-modal-body]");
  const closeBtn = $("[data-service-close]");
  if (!modal || !body) return;

  const close = () => modal.classList.add("hidden");
  closeBtn?.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  document.body.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open-service]");
    if (trigger) {
      e.preventDefault();
      const serviceId = trigger.dataset.openService;
      const service = services.find(s => s.id === serviceId);
      if (service) {
        body.innerHTML = `
          <h2>${escapeHtml(service.title)}</h2>
          ${renderServiceMedia(service)}
          <p><strong>What:</strong> ${escapeHtml(service.detail?.what || service.summary)}</p>
          ${service.detail?.for ? `<p><strong>For:</strong> ${escapeHtml(service.detail.for)}</p>` : ''}
          
          ${service.detail?.process?.length ? `
            <h3>Process</h3>
            <ul>
              ${service.detail.process.map(p => `<li>${escapeHtml(p)}</li>`).join("")}
            </ul>
          ` : ''}
          
          ${service.detail?.benefits?.length ? `
            <h3>Benefits</h3>
            <ul>
              ${service.detail.benefits.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
          ` : ''}
          
          ${service.detail?.safety?.length ? `
            <h3>Safety Equipment</h3>
            <ul>
              ${service.detail.safety.map(s => `<li>${escapeHtml(s)}</li>`).join("")}
            </ul>
          ` : ''}
          
          <div style="margin-top:2rem;">
            <a class="btn-primary" href="/contact">Request Quote</a>
          </div>
        `;
        modal.classList.remove("hidden");
      }
      
      // Close mobile menu if it was open
      const mobileNav = $("[data-mobile-nav]");
      const toggle = $("[data-menu-toggle]");
      if (mobileNav && !mobileNav.classList.contains("hidden")) {
        mobileNav.classList.add("hidden");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    }
  });
};

const boot = () => {
  setupMenu();
  setupScrollControls();

  try {
    const site = loadSite();
    renderBrand(site);
    renderStaticContent(site.sections);
    renderHero(site);
    renderAbout(site.sections.about);
    renderServices(site.services);
    renderWhyChoose(site);
    renderProjects(site.projects);
    renderLeadership(site.leadership);
    renderSafety(site.sections.safety);
    setupGallery(site.gallery);
    renderFooter(site);
    setupContact(site);
    applyPageMode(site);
    setupServiceModal(site.services);
    setupTheme();
    setupParallax();
    setupCardTilt();
    setupReveal();
  } catch (error) {
    const note = document.createElement("div");
    note.className = "boot-error";
    note.textContent = error.message || "Unable to load website.";
    document.body.appendChild(note);
  }
};

boot();
