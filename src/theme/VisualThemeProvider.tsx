import { useLayoutEffect, type ReactNode } from 'react'
import { applyVisualTheme } from './visualTheme'

/** Mantém sempre o visual Pro (sem alternativa XP). */
export function VisualThemeProvider({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    applyVisualTheme('pro')
  }, [])

  return <>{children}</>
}
