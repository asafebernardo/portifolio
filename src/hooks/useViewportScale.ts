import { useLayoutEffect } from 'react'

/** Largura de referência do layout (px). */
const DESIGN_WIDTH = 1440
/** Altura mínima confortável antes de reduzir mais o zoom (px). */
const DESIGN_HEIGHT = 820
const MIN_SCALE = 0.65
const MAX_SCALE = 1.15

function computeScale(width: number, height: number): number {
  const byWidth = width / DESIGN_WIDTH
  const byHeight = height / DESIGN_HEIGHT
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.min(byWidth, byHeight)))
}

function applyViewportScale() {
  const width = window.visualViewport?.width ?? window.innerWidth
  const height = window.visualViewport?.height ?? window.innerHeight
  const scale = computeScale(width, height)
  const root = document.documentElement

  root.style.setProperty('--site-scale', scale.toFixed(4))
  root.dataset.viewportScaled = 'true'

  if (typeof root.style.zoom !== 'undefined') {
    root.style.zoom = `${scale}`
  } else {
    root.style.fontSize = `${scale * 100}%`
  }
}

/** Escala o site inteiro conforme o tamanho da janela (zoom proporcional). */
export function useViewportScale() {
  useLayoutEffect(() => {
    applyViewportScale()

    window.addEventListener('resize', applyViewportScale, { passive: true })
    window.visualViewport?.addEventListener('resize', applyViewportScale)
    window.visualViewport?.addEventListener('scroll', applyViewportScale)

    return () => {
      window.removeEventListener('resize', applyViewportScale)
      window.visualViewport?.removeEventListener('resize', applyViewportScale)
      window.visualViewport?.removeEventListener('scroll', applyViewportScale)
      document.documentElement.style.removeProperty('--site-scale')
      document.documentElement.style.removeProperty('zoom')
      document.documentElement.style.removeProperty('font-size')
      delete document.documentElement.dataset.viewportScaled
    }
  }, [])
}
