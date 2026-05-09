import { portfolioUploadUrl } from './uploadEndpoint'

/**
 * Grava JPEG em `public/uploads/` via servidor Vite (dev/preview) e devolve o caminho público.
 */
export async function saveImageToProject(
  jpegDataUrl: string,
  prefix: 'profile' | 'project',
): Promise<string> {
  const comma = jpegDataUrl.indexOf(',')
  const base64 = comma >= 0 ? jpegDataUrl.slice(comma + 1) : jpegDataUrl

  const res = await fetch(portfolioUploadUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix, base64 }),
  })

  const text = await res.text()
  let message = 'Não foi possível gravar a imagem em public/uploads/. Use npm run dev ou npm run preview.'
  try {
    const j = JSON.parse(text) as { url?: string; error?: string }
    if (res.ok && j.url) return j.url
    if (j.error) message = j.error
  } catch {
    if (!res.ok) {
      /* keep default */
    }
  }

  throw new Error(message)
}
