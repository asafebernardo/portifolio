import { useLayoutEffect, type ReactNode } from 'react'
import { applyVisualTheme, DEFAULT_VISUAL_THEME } from './visualTheme'

/** Applies the default visual theme on mount. */
export function VisualThemeProvider({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    applyVisualTheme(DEFAULT_VISUAL_THEME)
  }, [])

  return <>{children}</>
}
