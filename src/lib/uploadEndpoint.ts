/** Rota interna do plugin Vite `vite-plugin-portfolio-upload.ts`. */
const PATH = '__portfolio-upload'

export function portfolioUploadUrl(): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '')
  return `${base}/${PATH}`
}
