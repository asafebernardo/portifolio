import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ProjectEntry, SiteConfig, SiteContent } from '../site/types'
import { getMergedConfig, getMergedContent, getMergedProjects } from '../site/overrides'

type SiteContextValue = {
  locale: 'pt'
  config: SiteConfig
  content: SiteContent
  projects: ProjectEntry[]
}

const SiteContext = createContext<SiteContextValue | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const bump = () => setRevision((n) => n + 1)
    window.addEventListener('portfolio-overrides-changed', bump)
    window.addEventListener('storage', bump)
    return () => {
      window.removeEventListener('portfolio-overrides-changed', bump)
      window.removeEventListener('storage', bump)
    }
  }, [])

  const config = useMemo(() => getMergedConfig(), [revision])
  const content = useMemo(() => getMergedContent('pt'), [revision])
  const projects = useMemo(() => getMergedProjects('pt'), [revision])

  const value = useMemo<SiteContextValue>(
    () => ({
      locale: 'pt',
      config,
      content,
      projects,
    }),
    [config, content, projects],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
