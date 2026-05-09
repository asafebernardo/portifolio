export type VisualTheme = 'pro'

export const VISUAL_THEME_STORAGE_KEY = 'portfolio-visual-theme'

export function getStoredVisualTheme(): VisualTheme {
  return 'pro'
}

export function applyVisualTheme(theme: VisualTheme) {
  document.documentElement.dataset.visualTheme = theme
}

export function storeVisualTheme(theme: VisualTheme) {
  try {
    localStorage.setItem(VISUAL_THEME_STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}
