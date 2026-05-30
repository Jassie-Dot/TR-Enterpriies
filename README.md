# TR-Enterpriies Premium Full-Stack Website

Modern Node.js + Tailwind website for TR-Enterpriies.

## Stack

- Node.js backend using the built-in `http` module
- Tailwind CSS frontend compiled to `public/styles.css`
- Server-rendered public content from `data/site.js`, local JSON, or Redis REST storage on Vercel
- Admin editor served from `public/admin.html`
- Inquiry submissions stored in local JSON or Redis REST storage on Vercel

## Run Locally

```bash
npm install
npm run build:css
npm start
```

For admin access in PowerShell, set secrets before starting:

```powershell
$env:ADMIN_PASSWORD = "replace-with-a-long-password"
$env:ADMIN_TOKEN_SECRET = "replace-with-a-long-random-secret"
npm start
```

Open:

```text
http://127.0.0.1:3000
```

## Useful Scripts

```bash
npm run build:css
npm run watch:css
npm run check
npm start
```

## Separate Admin Website

The `admin-site/` folder is a separate deployable admin website. It connects back to this public website API and edits `/api/site`.

Public website environment:

```text
ADMIN_PASSWORD=replace-with-password
ADMIN_TOKEN_SECRET=replace-with-long-random-secret
ADMIN_ORIGINS=https://your-admin-website.com
KV_REST_API_URL=from-vercel-upstash-storage
KV_REST_API_TOKEN=from-vercel-upstash-storage
```

Admin website environment:

```text
MAIN_SITE_URL=https://your-main-website.com
```

For local testing, run the public site on `http://127.0.0.1:3000` and the admin site on `http://127.0.0.1:4000`, with `ADMIN_ORIGINS=http://127.0.0.1:4000`.

## Vercel Persistence

Vercel deployments do not provide persistent writable files for admin edits. Add an Upstash Redis / KV store to the main Vercel website project and set:

```text
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
SITE_CONTENT_STORAGE_KEY=tr:site-content
INQUIRIES_STORAGE_KEY=tr:inquiries
```

`SITE_CONTENT_STORAGE_KEY` and `INQUIRIES_STORAGE_KEY` are optional, but setting them keeps the production data names explicit. If your provider uses Upstash variable names instead, the server also accepts `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

Only set these storage variables on the main website deployment. The separate admin website only needs `MAIN_SITE_URL`.

## Security

- Set `ADMIN_PASSWORD` and `ADMIN_TOKEN_SECRET` in production. Admin login is disabled when either secret is missing.
- Use a long admin password and a high-entropy token secret.
- Same-origin admin sessions use `HttpOnly`, same-site cookies. The separate remote admin site uses a temporary signed bearer token stored in browser session storage.
- Remote admin deployments are allowed only when their exact origin is listed in `ADMIN_ORIGINS`.
- On Vercel, admin edits persist only when Redis REST storage variables are configured on the main website deployment.
- Public page content is embedded server-side. The public frontend does not fetch `/api/site`.
- `GET /api/site` and `PUT /api/site` require an authenticated admin session.
- `POST /api/inquiries` remains public because the contact form needs it, but it is same-origin checked, JSON-only, and rate-limited.
- `GET /api/health` is disabled unless `ENABLE_HEALTHCHECK=1`.

The site API loads editable content from Redis REST storage when configured, otherwise from `data/site-content.json`, and falls back to `data/site.js`.
The inquiry API validates company name, contact number, email, and work requirement, saves the request where storage is available, and returns a WhatsApp continuation URL.
