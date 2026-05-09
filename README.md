# Portfolio

Single-page portfolio site with a dark SaaS-style theme, **Portuguese and English** locales, an in-browser editing panel, and automatic **PT → EN** translation when you save.

## Features

- **Sections**: Hero, projects, skills, architecture / stack, about, contact, and footer.
- **i18n**: PT/EN toggle in the header; page metadata (`DocumentMeta`) per language.
- **Admin**: Sign in at `/admin/login` with credentials from `.env`; after login you are redirected to `/?edit=1` with the side editor.
- **Visual editor**: Forms for configuration (links, profile photo), Portuguese copy, and Portuguese projects. The dock action **Salvar tudo + gerar inglês** persists changes to the browser `localStorage` and generates the English version via the translation API (MyMemory).
- **Raw JSON**: `/admin/json` to edit the same data as JSON (admin session required).
- **Profile photo**: Thumbnail in the navbar; click opens a larger image in a modal (not shown in the hero).

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/) for routes (`/`, `/admin`, `/admin/login`, `/admin/json`)
- CSS Modules and global styles in `src/index.css`

## Requirements

- [Node.js](https://nodejs.org/) (recommended: current LTS)

## Getting started

```bash
npm install
```

Copy the environment file and adjust the values:

```bash
copy .env.example .env
```

On macOS or Linux:

```bash
cp .env.example .env
```

```bash
npm run dev
```

Open the URL printed in the terminal (default `http://localhost:5173`).

## Environment variables

Set these in `.env` (the `VITE_` prefix is exposed to the client at build time). **Restart the dev server** after changing the file.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_ADMIN_USERNAME` | Yes (for admin login) | Admin username. |
| `VITE_ADMIN_PASSWORD` | Yes (for admin login) | Admin password. |
| `VITE_TRANSLATION_EMAIL` | No | Optional email to raise the free MyMemory API quota for PT→EN translation. |

## npm scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload. |
| `npm run build` | `tsc` + production build into `dist/`. |
| `npm run preview` | Serve `dist/` locally to verify the build. |

## Content location

Default data lives in `src/site/`:

| File | Contents |
|------|----------|
| `config.json` | Name, links, profile photo (URL or data URL), etc. |
| `content.pt.json` / `content.en.json` | Site copy per language. |
| `projects.pt.json` / `projects.en.json` | Project list per language. |

In **edit mode**, saved changes are stored in **`localStorage`** (keys like `portfolio-override-*`) and override those JSON files **only in your browser**—handy for customizing without touching the repo. To version content in Git, copy the values you want into the files under `src/site/` or export from the editor according to your workflow.

## In-site editor

1. Set `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD` in `.env` and restart `npm run dev`.
2. Go to `/admin/login` and sign in with those credentials.
3. The site opens with `?edit=1` and the **side panel** (dock). You can open or close it; the `edit=1` query controls visibility.
4. Click **Salvar tudo + gerar inglês** in the dock to persist in the browser and generate EN from PT.

## Production build

```bash
npm run build
```

Output goes to `dist/`. Deploy that folder to any static host (GitHub Pages, Netlify, Vercel, etc.). Configure `VITE_*` variables in your platform’s build environment.

### Admin login not working after deploy?

Vite **inlines** `import.meta.env.VITE_*` when `vite build` runs. Environment variables you add only on the **running** container or static host **runtime** settings **do not** reach the compiled JS — the admin password in the browser stays whatever it was at build time (often empty).

**Fix:** Set `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD` in the **build** step (CI “build environment”, Docker `ARG`/`--build-arg`, Netlify/Vercel “Environment variables” scoped to **Build**, etc.), then **rebuild and redeploy**. Verify with `npm run build && npm run preview` locally while your shell exports the same `VITE_*` values.

## Docker

The repo includes a **multi-stage** `Dockerfile` (Node build + `nginx` serving `dist/` with SPA fallback for client-side routes).

- **Path to set in your host:** `Dockerfile` (repository root)

Build locally (pass the same `VITE_*` values you use in production):

```bash
docker build \
  --build-arg VITE_ADMIN_USERNAME=your_user \
  --build-arg VITE_ADMIN_PASSWORD=your_password \
  -t portfolio:local .
docker run --rm -p 8080:80 portfolio:local
```

Open `http://localhost:8080`. On your hosting platform, configure **build arguments** or environment for `VITE_*` at image build time; do not commit real credentials in the repo.

---

Private project—update this README when you add routes, integrations, or deployment steps.
