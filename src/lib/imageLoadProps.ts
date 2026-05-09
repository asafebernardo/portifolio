/**
 * Pedidos de imagem sem credenciais (útil para não enviar cookies em pedidos
 * que suportam modo CORS anonymous).
 */
export function imageAnonymousProps(src: string | undefined): { crossOrigin?: 'anonymous' } {
  const s = src?.trim()
  if (!s || s.startsWith('data:')) return {}
  return { crossOrigin: 'anonymous' as const }
}
