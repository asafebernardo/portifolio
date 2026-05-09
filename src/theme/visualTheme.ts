export type VisualTheme = 'pro' | 'xp'

export const VISUAL_THEME_STORAGE_KEY = 'portfolio-visual-theme'

export function getStoredVisualTheme(): VisualTheme {
  try {
    const v = localStorage.getItem(VISUAL_THEME_STORAGE_KEY)
    if (v === 'xp' || v === 'pro') return v
    if (v === 'classic') return 'pro'
  } catch {
    /* ignore */
  }
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
