# Deploying the portfolio (Angular) to Hostinger

This is the public static site. It is built into plain HTML/CSS/JS and uploaded
to your domain's web root via the Hostinger File Manager. It is deployed
independently of `portfolio-api` (the NestJS backend).

Deploy the **API first** so its URL exists, then build and upload this site.

## 1. Confirm the production config

`src/environments/environment.prod.ts` must point at the live API:

```ts
export const environment = {
  production: true,
  apiUrl: './email',                       // public contact form endpoint
  adminApiUrl: 'https://api.marcelluna.com' // the deployed NestJS API
};
```

The `adminApiUrl` must match the origin the API accepts in its `CORS_ORIGIN`.

> CORS note: the site is reachable at both `https://marcelluna.com` and
> `https://www.marcelluna.com`. The API's `CORS_ORIGIN` must therefore list
> **both**, comma-separated:
> `CORS_ORIGIN=https://marcelluna.com,https://www.marcelluna.com`

## 2. Build

From this repo:

```bash
npm ci
npm run build-portfolio      # == ng build --configuration production
```

The build is emitted to **`dist/browser/`** (Angular's application builder puts
the browser artifacts in a `browser/` subfolder). A production build also
enables the service worker (`ngsw-config.json`) and output hashing.

> Optional sanity check before uploading:
> `npx ng test --no-watch` and confirm the build produced `dist/browser/index.html`.

## 3. Upload to the web root

In hPanel → File Manager, upload the **contents of `dist/browser/`** (not the
`dist` or `dist/browser` folder itself — its *contents*) into your domain's web
root (usually `public_html`).

Files that must land in the web root:
- `index.html`, the hashed `*.js` / `*.css`, `assets/`, `favicon.ico`
- `manifest.webmanifest`, `ngsw-worker.js`, `ngsw.json` (service worker)
- **`.htaccess`** — required for the SPA. It routes every unknown path back to
  `index.html` so deep links (e.g. `/admin`, `/pt`) work on refresh. It is a
  hidden file; make sure File Manager shows hidden files and that it uploads.

Replace the previous deploy's files. Clear old hashed bundles to avoid clutter.

## 4. HTTPS & domain

- Ensure SSL is enabled for `marcelluna.com` (and `www`) in hPanel.
- Both `marcelluna.com` and `www.marcelluna.com` should resolve to this site.

## 5. Verify

- Open `https://marcelluna.com` — the site loads with the blue theme.
- Hard-refresh a deep link like `https://marcelluna.com/pt` — it must load the
  app (not a 404), proving the `.htaccess` SPA fallback works.
- Scroll to **Projects** — the cards are fetched from the API. If the section
  shows "Projects coming soon." but you created projects, check:
  - the API is up at `https://api.marcelluna.com/projects` (returns JSON), and
  - the API `CORS_ORIGIN` includes the exact origin you opened the site on
    (with vs without `www`).
- `/admin` → sign in with the seeded admin credentials, add a project, and
  confirm it appears on the public Projects section.

## Notes

- Content for About / Experience / Education / Proficiency is static in the
  app (`src/app/services/data/data.service.ts`) — changing it means editing the
  code and re-deploying this site. Only **Projects** are managed via `/admin`.
- The service worker caches aggressively. After a deploy, a hard refresh
  (Ctrl/Cmd+Shift+R) ensures you see the new bundles immediately.
