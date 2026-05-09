import { portfolioUploadUrl, resolveApiUploadUrl } from './uploadEndpoint'
import { notifySiteRuntimeManifestStale } from '../site/siteRuntime'

function uploadHeaders(): HeadersInit {
  const secret = import.meta.env.VITE_UPLOAD_SECRET?.trim()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (secret) headers.Authorization = `Bearer ${secret}`
  return headers
}

async function postUpload(url: string, body: string, headers: HeadersInit): Promise<Response | null> {
  try {
    return await fetch(url, {
      method: 'POST',
      credentials: 'omit',
      headers,
      body,
    })
  } catch {
    return null
  }
}

function completeUpload(url: string): string {
  if (!url.startsWith('data:')) {
    notifySiteRuntimeManifestStale()
  }
  return url
}

/**
 * 1) POST `/api/upload` (Express: Docker Compose ou proxy no Vite com `npm run dev:full`).
 * 2) Em dev, fallback para `__portfolio-upload` do plugin Vite (`npm run dev` sem API).
 * 3) Sem servidor: data URL (localStorage).
 */
export async function saveImageToProject(
  jpegDataUrl: string,
  prefix: 'profile' | 'project',
  projectId?: string,
): Promise<string> {
  const comma = jpegDataUrl.indexOf(',')
  const base64 = comma >= 0 ? jpegDataUrl.slice(comma + 1) : jpegDataUrl
  const bodyObj: { prefix: string; base64: string; projectId?: string } = { prefix, base64 }
  if (prefix === 'project' && projectId?.trim()) {
    bodyObj.projectId = projectId.trim()
  }
  const payload = JSON.stringify(bodyObj)
  const headers = uploadHeaders()

  const apiUrl = resolveApiUploadUrl()
  let res = await postUpload(apiUrl, payload, headers)

  if (import.meta.env.DEV) {
    const proxyDown =
      !res ||
      res.status >= 500 ||
      res.status === 502 ||
      res.status === 503 ||
      res.status === 504
    if (proxyDown) {
      const viteUrl = portfolioUploadUrl()
      if (viteUrl !== apiUrl) {
        const second = await postUpload(viteUrl, payload, headers)
        if (second) res = second
      }
    }
  }

  if (!res) return jpegDataUrl

  const text = await res.text()

  if (res.status === 404 || res.status === 405 || res.status === 501) {
    return jpegDataUrl
  }

  let parsed: { url?: string; error?: string }
  try {
    parsed = JSON.parse(text) as { url?: string; error?: string }
  } catch {
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error('Upload não autorizado. Confirme VITE_UPLOAD_SECRET e UPLOAD_SECRET no servidor.')
      }
      return jpegDataUrl
    }
    throw new Error(`Resposta inválida do servidor de upload (${apiUrl}).`)
  }

  if (res.ok && parsed.url) {
    return completeUpload(parsed.url)
  }

  if (parsed.error) {
    throw new Error(parsed.error)
  }

  if (!res.ok) return jpegDataUrl

  throw new Error(`Não foi possível gravar o upload. Pedido: ${apiUrl}`)
}
