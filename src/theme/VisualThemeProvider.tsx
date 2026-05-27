import { useLayoutEffect, type ReactNode } from 'react'
import { applyVisualTheme, getStoredVisualTheme } from './visualTheme'

/** Applies the persisted visual theme (Pro/XP). */
export function VisualThemeProvider({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    applyVisualTheme(getStoredVisualTheme())
  }, [])

  return <>{children}</>
}
