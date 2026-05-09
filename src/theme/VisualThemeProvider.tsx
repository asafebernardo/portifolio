import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { applyVisualTheme, getStoredVisualTheme, storeVisualTheme, type VisualTheme } from './visualTheme'

type VisualThemeContextValue = {
  theme: VisualTheme
  setTheme: (t: VisualTheme) => void
  toggleTheme: () => void
}

const VisualThemeContext = createContext<VisualThemeContextValue | null>(null)

export function VisualThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<VisualTheme>(() => getStoredVisualTheme())

  useLayoutEffect(() => {
    applyVisualTheme(theme)
  }, [theme])

  const setTheme = useCallback((t: VisualTheme) => {
    setThemeState(t)
    storeVisualTheme(t)
    applyVisualTheme(t)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'pro' ? 'xp' : 'pro')
  }, [theme, setTheme])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  )

  return <VisualThemeContext.Provider value={value}>{children}</VisualThemeContext.Provider>
}

export function useVisualTheme() {
  const ctx = useContext(VisualThemeContext)
  if (!ctx) {
    throw new Error('useVisualTheme must be used within VisualThemeProvider')
  }
  return ctx
}
