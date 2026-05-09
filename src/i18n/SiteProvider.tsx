import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ProjectEntry, SiteConfig, SiteContent, SiteRuntimeManifest } from '../site/types'
import { fetchSiteRuntimeManifest } from '../site/siteRuntime'
import { getMergedConfig, getMergedContent, getMergedProjects } from '../site/overrides'

type SiteContextValue = {
  locale: 'pt'
  config: SiteConfig
  content: SiteContent
  projects: ProjectEntry[]
}

const SiteContext = createContext<SiteContextValue | null>(null)

export const SiteManifestContext = createContext<SiteRuntimeManifest | null>(null)

export function useSiteManifest(): SiteRuntimeManifest | null {
  return useContext(SiteManifestContext)
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [revision, setRevision] = useState(0)
  const [manifest, setManifest] = useState<SiteRuntimeManifest | null>(null)

  useEffect(() => {
    let cancelled = false
    void fetchSiteRuntimeManifest().then((m) => {
      if (!cancelled) {
        setManifest(m)
        setRevision((n) => n + 1)
      }
    })
    const bump = () => setRevision((n) => n + 1)
    const reloadManifest = () => {
      void fetchSiteRuntimeManifest().then((m) => {
        setManifest(m)
        setRevision((n) => n + 1)
      })
    }
    window.addEventListener('portfolio-overrides-changed', bump)
    window.addEventListener('portfolio-runtime-manifest-stale', reloadManifest)
    window.addEventListener('storage', bump)
    return () => {
      cancelled = true
      window.removeEventListener('portfolio-overrides-changed', bump)
      window.removeEventListener('portfolio-runtime-manifest-stale', reloadManifest)
      window.removeEventListener('storage', bump)
    }
  }, [])

  const config = useMemo(() => getMergedConfig(manifest), [revision, manifest])
  const content = useMemo(() => getMergedContent('pt'), [revision])
  const projects = useMemo(() => getMergedProjects('pt', manifest), [revision, manifest])

  const value = useMemo<SiteContextValue>(
    () => ({
      locale: 'pt',
      config,
      content,
      projects,
    }),
    [config, content, projects],
  )

  return (
    <SiteManifestContext.Provider value={manifest}>
      <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
    </SiteManifestContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
