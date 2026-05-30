# TR-Enterpriies Remote Admin

Separate deployable admin website for editing the TR-Enterpriies public website.

## Local Run

Start the public website API:

```powershell
$env:ADMIN_PASSWORD = "replace-with-password"
$env:ADMIN_TOKEN_SECRET = "replace-with-long-random-secret"
$env:ADMIN_ORIGINS = "http://127.0.0.1:4000"
npm start
```

Start the remote admin site from this folder:

```powershell
$env:MAIN_SITE_URL = "http://127.0.0.1:3000"
npm start
```

Open:

```text
http://127.0.0.1:4000
```

## Deployment

Deploy this `admin-site` folder separately from the public website.

Set these environment variables on the admin-site deployment:

```text
MAIN_SITE_URL=https://your-main-website.com
```

Set these environment variables on the public website deployment:

```text
ADMIN_PASSWORD=replace-with-password
ADMIN_TOKEN_SECRET=replace-with-long-random-secret
ADMIN_ORIGINS=https://your-admin-website.com
KV_REST_API_URL=from-vercel-upstash-storage
KV_REST_API_TOKEN=from-vercel-upstash-storage
```

`ADMIN_ORIGINS` can contain multiple comma-separated origins.

## Persistence Note

The admin site edits the public website through the public website API. Because the main website is deployed on Vercel, add an Upstash Redis / KV store to the main website project and keep the storage environment variables on that main deployment:

```text
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
SITE_CONTENT_STORAGE_KEY=tr:site-content
INQUIRIES_STORAGE_KEY=tr:inquiries
```

The server also accepts `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` if those are the names Vercel provides. Without these variables, admin changes on Vercel can update only the current runtime and may disappear after a redeploy or cold start.
