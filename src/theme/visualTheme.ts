export type VisualTheme = 'pro'

export const DEFAULT_VISUAL_THEME: VisualTheme = 'pro'

export function applyVisualTheme(theme: VisualTheme) {
  document.documentElement.dataset.visualTheme = theme
}
