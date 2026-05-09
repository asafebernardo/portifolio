/** Rota interna do plugin Vite `vite-plugin-portfolio-upload.ts` (dev sem API Node). */
export function portfolioUploadUrl(): string {
  const envBase = import.meta.env.BASE_URL ?? '/'
  const joined = `${envBase.endsWith('/') ? envBase : `${envBase}/`}__portfolio-upload`.replace(/\/{2,}/g, '/')

  if (typeof window === 'undefined') {
    return joined.startsWith('/') ? joined : joined.replace(/^\.\//, '/')
  }

  try {
    return new URL(joined, window.location.href).href
  } catch {
    return joined.startsWith('/') ? `${window.location.origin}${joined}` : joined
  }
}

/**
 * POST para API Express em produção / quando `npm run dev:full`.
 * `VITE_UPLOAD_POST_URL` sobrepõe (URL absoluta para API externa).
 */
export function resolveApiUploadUrl(): string {
  const custom = import.meta.env.VITE_UPLOAD_POST_URL?.trim()
  if (custom) return custom

  const envBase = import.meta.env.BASE_URL ?? '/'
  const joined = `${envBase.endsWith('/') ? envBase : `${envBase}/`}api/upload`.replace(/\/{2,}/g, '/')

  if (typeof window === 'undefined') {
    return joined.startsWith('/') ? joined : joined.replace(/^\.\//, '/')
  }

  try {
    return new URL(joined, window.location.href).href
  } catch {
    return joined.startsWith('/') ? `${window.location.origin}${joined}` : joined
  }
}
