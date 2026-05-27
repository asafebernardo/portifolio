# Portfolio

Single-page English portfolio with a dark/light theme, section-based navigation, and static content in `src/site/`.

## Features

- **Sections**: About (home), projects, skills, experience, and contact
- **Theme**: Light/dark toggle in the header
- **Content**: JSON files for copy and projects (`content.en.json`, `projects.en.json`, `config.json`)
- **Profile photo**: Shown in the About section (`public/profile-photo.png` by default)

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/) for legacy path redirects and hash navigation
- CSS Modules and global tokens in `src/index.css`

## Requirements

- [Node.js](https://nodejs.org/) (recommended: current LTS)

## Getting started

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (default `http://localhost:5173`).

## npm scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Typecheck + production build into `dist/` |
| `npm run preview` | Serve `dist/` locally to verify the build |

## Content

Default data lives in `src/site/`:

| File | Contents |
|------|----------|
| `config.json` | Brand name, navbar title, profile photo URL |
| `content.en.json` | Site copy (nav, sections, meta) |
| `projects.en.json` | Project cards |

## Production build

```bash
npm run build
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, etc.).

## Docker

Multi-stage `Dockerfile` (Node build + nginx with SPA fallback):

```bash
docker build -t portfolio:local .
docker run --rm -p 8080:80 portfolio:local
```

Or:

```bash
docker compose up --build
```

Open `http://localhost:8080`.

---

Private project—update this README when you add routes, integrations, or deployment steps.
