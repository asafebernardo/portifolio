export type ColorSchemePreference = 'light' | 'dark' | 'system'

export type ResolvedColorScheme = 'light' | 'dark'

export const COLOR_SCHEME_STORAGE_KEY = 'portfolio-color-scheme'

export function parseStoredPreference(raw: string | null): ColorSchemePreference {
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  return 'system'
}

export function getStoredColorSchemePreference(): ColorSchemePreference {
  try {
    return parseStoredPreference(localStorage.getItem(COLOR_SCHEME_STORAGE_KEY))
  } catch {
    return 'system'
  }
}

export function resolveColorScheme(pref: ColorSchemePreference): ResolvedColorScheme {
  if (pref === 'light' || pref === 'dark') return pref
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Sets `data-color-scheme` on `<html>` for CSS (always resolved light | dark). */
export function applyResolvedColorScheme(scheme: ResolvedColorScheme) {
  document.documentElement.dataset.colorScheme = scheme
}

export function storeColorSchemePreference(pref: ColorSchemePreference) {
  try {
    localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, pref)
  } catch {
    /* ignore */
  }
  try {
    window.dispatchEvent(new Event('portfolio-color-scheme-changed'))
  } catch {
    /* ignore */
  }
}
