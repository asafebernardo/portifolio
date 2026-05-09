import { portfolioUploadUrl } from './uploadEndpoint'

/**
 * Grava JPEG em `public/uploads/` via servidor Vite (dev/preview) e devolve o caminho público.
 * Se o pedido HTTP falhar por rede (sem servidor), usa o data URL para não bloquear o editor.
 */
export async function saveImageToProject(
  jpegDataUrl: string,
  prefix: 'profile' | 'project',
): Promise<string> {
  const comma = jpegDataUrl.indexOf(',')
  const base64 = comma >= 0 ? jpegDataUrl.slice(comma + 1) : jpegDataUrl
  const uploadUrl = portfolioUploadUrl()

  let res: Response
  try {
    res = await fetch(uploadUrl, {
      method: 'POST',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix, base64 }),
    })
  } catch {
    return jpegDataUrl
  }

  const text = await res.text()

  let parsed: { url?: string; error?: string }
  try {
    parsed = JSON.parse(text) as { url?: string; error?: string }
  } catch {
    throw new Error(
      `Resposta inválida do servidor de upload (${uploadUrl}, HTTP ${res.status}). Confirme que corre \`npm run dev\` ou \`npm run preview\` na raiz do projeto Portfolio.`,
    )
  }

  if (res.ok && parsed.url) return parsed.url

  if (parsed.error) {
    throw new Error(parsed.error)
  }

  throw new Error(
    `Não foi possível gravar em public/uploads/ (HTTP ${res.status}). Pedido: ${uploadUrl}. Use npm run dev ou npm run preview.`,
  )
}
