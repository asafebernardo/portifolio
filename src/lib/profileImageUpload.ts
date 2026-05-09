const MAX_EDGE = 720
const JPEG_QUALITY = 0.82
const MAX_INPUT_BYTES = 12 * 1024 * 1024

/**
 * Lê um arquivo de imagem, redimensiona e exporta JPEG para caber no localStorage.
 */
export async function fileToProfilePhotoDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Escolha um arquivo de imagem (JPG, PNG, WebP…).')
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('Imagem muito grande. Use até ~12 MB.')
  }

  const bitmap = await createImageBitmap(file)
  let w = bitmap.width
  let h = bitmap.height

  if (w > MAX_EDGE || h > MAX_EDGE) {
    const scale = MAX_EDGE / Math.max(w, h)
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
