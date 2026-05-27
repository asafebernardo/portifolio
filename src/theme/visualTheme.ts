export type VisualTheme = 'pro'

export const VISUAL_THEME_STORAGE_KEY = 'portfolio-visual-theme'

export function getStoredVisualTheme(): VisualTheme {
  try {
    const stored = localStorage.getItem(VISUAL_THEME_STORAGE_KEY) as VisualTheme | null
    return stored === 'pro' || stored === 'xp' ? stored : 'pro'
  } catch {
    return 'pro'
  }
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
