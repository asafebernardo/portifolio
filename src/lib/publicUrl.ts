const BASE = import.meta.env.BASE_URL

/** Resolve a site-relative path against Vite `base` (e.g. `/portifolio/` on GitHub Pages). */
export function resolvePublicUrl(path: string): string {
  const trimmed = path.trim()
  if (!trimmed) return BASE
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) return trimmed
  if (trimmed.startsWith(BASE)) return trimmed
  const normalized = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
  return `${BASE}${normalized}`
}

/** React Router basename (no trailing slash). */
export function routerBasename(): string {
  return BASE.replace(/\/$/, '') || '/'
}
