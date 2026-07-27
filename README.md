# Portfólio — Asafe Bernardo

Portfólio single-page em português, posicionado para **vagas de Desenvolvedor Back-end (Node.js)**, com diferencial em **QA, integração de APIs e testes automatizados**.

## Destaques

- **Seções**: Sobre, projetos, habilidades, experiência e formação
- **Posicionamento**: Node.js, TypeScript, REST APIs, MongoDB, Docker, Postman, Cypress
- **Projetos**: ICER (site institucional em produção) e Lumio (projeção para igrejas)
- **Tema**: Claro/escuro no header
- **Conteúdo**: JSON em `src/site/` (`content.en.json`, `projects.en.json`, `config.json`, `resume.json`)
- **SEO/ATS/IAs**: HTML estático injetado no build, JSON-LD Schema.org, `resume.json` estruturado, `robots.txt` e `sitemap.xml`
- **Currículo PDF**: Gerado na hora pelo header — mesmo conteúdo do site (jsPDF)

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/) para redirects legados e navegação por hash
- CSS Modules e tokens globais em `src/index.css`

## Requisitos

- [Node.js](https://nodejs.org/) (LTS recomendado)

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra a URL exibida no terminal (padrão `http://localhost:5173`).

## Scripts npm

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Typecheck + build + injeção SEO em `dist/` |
| `npm run build:pages` | Build para GitHub Pages (`/portifolio/`) |
| `npm run preview` | Serve `dist/` localmente |

## Conteúdo

Arquivos em `src/site/`:

| Arquivo | Conteúdo |
|---------|----------|
| `config.json` | Nome, links, endereço, URL do PDF |
| `content.en.json` | Textos do site (PT), meta e SEO |
| `projects.en.json` | Cards de projetos (stack, impacto, papel) |
| `resume.json` | Currículo estruturado para IAs/ATS (gerado enriquecido no build) |
| `skillsCatalog.json` | Catálogo de habilidades com aliases, categoria, nível e evidências |

## Build e SEO

O build executa `scripts/inject-seo-content.mjs`, que:

1. Injeta um bloco HTML semântico (`#seo-resume`) legível por crawlers/ATS/IAs
2. Adiciona JSON-LD `Person` no `<head>` (experiência, formação, idiomas, certificações)
3. Gera `dist/resume.json` e `public/resume.json` com dados completos
4. Copia `asafe-bernardo-cv.pdf` para `dist/`
5. Gera `dist/sitemap.xml` e `dist/robots.txt`

Variável opcional para URL canônica:

```bash
SITE_URL=https://seu-dominio.com npm run build
```

## Deploy

```bash
npm run build
# ou para GitHub Pages:
npm run build:pages
```

Publique a pasta `dist/` em Netlify, Vercel, GitHub Pages, etc.

## Docker

```bash
docker build -t portfolio:local .
docker run --rm -p 8080:80 portfolio:local
```

Abra `http://localhost:8080`.
