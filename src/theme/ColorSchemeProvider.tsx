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
  getStoredColorSchemePreference,
  resolveColorScheme,
  storeColorSchemePreference,
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
  const [preference, setPreferenceState] = useState<ColorSchemePreference>(() =>
    typeof window === 'undefined' ? 'system' : getStoredColorSchemePreference(),
  )

  const resolved = useMemo(() => resolveColorScheme(preference), [preference])

  const setPreference = useCallback((pref: ColorSchemePreference) => {
    storeColorSchemePreference(pref)
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

  // If user ever stored an invalid value, fall back to system.
  useLayoutEffect(() => {
    if (preference === 'light' || preference === 'dark' || preference === 'system') return
    setPreferenceState('system')
  }, [preference])

  useLayoutEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'portfolio-color-scheme') return
      setPreferenceState(getStoredColorSchemePreference())
    }
    const onCustom = () => setPreferenceState(getStoredColorSchemePreference())
    window.addEventListener('storage', onStorage)
    window.addEventListener('portfolio-color-scheme-changed', onCustom)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('portfolio-color-scheme-changed', onCustom)
    }
  }, [])

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
