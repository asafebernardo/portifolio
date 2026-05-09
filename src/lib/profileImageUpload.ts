const PROFILE_MAX_EDGE = 720
const PROJECT_IMAGE_MAX_EDGE = 960
const JPEG_QUALITY = 0.82
const MAX_INPUT_BYTES = 12 * 1024 * 1024

/**
 * Lê um arquivo de imagem, redimensiona e exporta JPEG para caber no localStorage.
 * @param maxEdge maior lado em px após redimensionar
 */
export async function fileToJpegDataUrl(file: File, maxEdge: number): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Escolha um arquivo de imagem (JPG, PNG, WebP…).')
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('Imagem muito grande. Use até ~12 MB.')
  }

  const bitmap = await createImageBitmap(file)
  let w = bitmap.width
  let h = bitmap.height

  if (w > maxEdge || h > maxEdge) {
    const scale = maxEdge / Math.max(w, h)
    w = Math.round(w * scale)
    h = Math.round(h * scale)
  }

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Não foi possível processar a imagem.')

  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}

/** Foto de perfil / favicon — lado máximo 720px. */
export async function fileToProfilePhotoDataUrl(file: File): Promise<string> {
  return fileToJpegDataUrl(file, PROFILE_MAX_EDGE)
}

/** Imagem de card de projeto — lado máximo 960px. */
export async function fileToProjectImageDataUrl(file: File): Promise<string> {
  return fileToJpegDataUrl(file, PROJECT_IMAGE_MAX_EDGE)
}
