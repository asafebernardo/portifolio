export type ColorSchemePreference = 'light' | 'dark' | 'system'

export type ResolvedColorScheme = 'light' | 'dark'

export const DEFAULT_COLOR_SCHEME_PREFERENCE: ColorSchemePreference = 'system'

export function resolveColorScheme(pref: ColorSchemePreference): ResolvedColorScheme {
  if (pref === 'light' || pref === 'dark') return pref
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Sets `data-color-scheme` on `<html>` for CSS (always resolved light | dark). */
export function applyResolvedColorScheme(scheme: ResolvedColorScheme) {
  document.documentElement.dataset.colorScheme = scheme
}
