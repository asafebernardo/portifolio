import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { ProjectEntry, SiteConfig, SiteContent } from '../site/types'
import { getSiteConfig, getSiteContent, getSiteProjects, SITE_LOCALE } from '../site'

type SiteContextValue = {
  locale: typeof SITE_LOCALE
  config: SiteConfig
  content: SiteContent
  projects: ProjectEntry[]
}

const SiteContext = createContext<SiteContextValue | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const value = useMemo<SiteContextValue>(
    () => ({
      locale: SITE_LOCALE,
      config: getSiteConfig(),
      content: getSiteContent(),
      projects: getSiteProjects(),
    }),
    [],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
