/** Rota interna do plugin Vite `vite-plugin-portfolio-upload.ts` (deve coincidir com `uploadRoutePath`). */
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
