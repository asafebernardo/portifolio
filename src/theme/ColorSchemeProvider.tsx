import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  applyResolvedColorScheme,
  DEFAULT_COLOR_SCHEME_PREFERENCE,
  resolveColorScheme,
  type ColorSchemePreference,
  type ResolvedColorScheme,
} from './colorScheme'

type ColorSchemeContextValue = {
  preference: ColorSchemePreference
  resolved: ResolvedColorScheme
  setPreference: (pref: ColorSchemePreference) => void
}

const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null)

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ColorSchemePreference>(
    DEFAULT_COLOR_SCHEME_PREFERENCE,
  )

  const resolved = useMemo(() => resolveColorScheme(preference), [preference])

  const setPreference = useCallback((pref: ColorSchemePreference) => {
    setPreferenceState(pref)
  }, [])

  useLayoutEffect(() => {
    applyResolvedColorScheme(resolveColorScheme(preference))
  }, [preference])

  useLayoutEffect(() => {
    if (preference !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => applyResolvedColorScheme(mq.matches ? 'dark' : 'light')
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [preference])

  const value = useMemo<ColorSchemeContextValue>(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  )

  return <ColorSchemeContext.Provider value={value}>{children}</ColorSchemeContext.Provider>
}

export function useColorScheme() {
  const ctx = useContext(ColorSchemeContext)
  if (!ctx) throw new Error('useColorScheme must be used within ColorSchemeProvider')
  return ctx
}
