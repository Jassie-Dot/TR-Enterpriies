# TR-Enterprises Website

Professional, lightweight full-stack website for TR-Enterprises. This repository contains the Node.js server, Tailwind-based frontend, and site content used by the public pages and contact form.

**Project Summary**
- **Purpose:** Static public site with a small server for rendering content and handling contact inquiries.
- **Primary files:** [server.js](server.js), [data/site.js](data/site.js), [public/index.html](public/index.html), [package.json](package.json).

**Stack**
- **Runtime:** Node.js
- **Frontend:** Tailwind CSS (compiled to `public/styles.css`)
- **Storage:** Local JSON (development) or Redis REST (production via environment variables)

**Prerequisites**
- Install Node.js (LTS recommended)

**Local Setup**
1. Install dependencies and build assets:

```bash
npm install
npm run build
```

2. Start the server:

```bash
npm start
```

Open `http://127.0.0.1:3000` in your browser.

**Common Scripts**
- **`npm run build`**: Build CSS/JS and production assets.
- **`npm run build:css`**: Compile Tailwind CSS.
- **`npm run watch:css`**: Watch and rebuild CSS during development.
- **`npm start`**: Start the Node.js server.

**Configuration / Environment**
- `KV_REST_API_URL` / `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`): Redis REST endpoint and auth for production storage.
- `INQUIRIES_STORAGE_KEY` (optional): Key used to store inquiry objects.
- `ENABLE_HEALTHCHECK=1` (optional): Enable `GET /api/health` for health checks.

**Deployment Notes**
- Vercel (or similar serverless platforms) do not provide writable, persistent filesystem storage. To persist contact form submissions in production, configure a Redis REST-compatible store (e.g., Upstash) and set the variables above.

**Security & Privacy**
- The contact endpoint accepts JSON and includes same-origin checks and rate limiting. Validate environment secrets before deploying.

**Where to Edit Site Content**
- Public content is controlled in [data/site.js](data/site.js). Frontend markup is in [public/index.html](public/index.html).

If you want, I can also:
- Update `data/site.js` with clearer content structure.
- Add a CONTRIBUTING section or GitHub workflow for deployment.

---
If you'd like any wording adjusted or more details added (contributing guide, deployment steps, or badges), tell me which sections to expand.
