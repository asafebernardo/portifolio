/** Rota interna do plugin Vite `vite-plugin-portfolio-upload.ts` (deve coincidir com `uploadRoutePath`). */
export function portfolioUploadUrl(): string {
  const raw = import.meta.env.BASE_URL ?? '/'
  const base = raw.replace(/\/$/, '') || ''
  return base ? `${base}/__portfolio-upload` : '/__portfolio-upload'
}
