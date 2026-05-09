import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAdminSession } from '../../admin/useAdminSession'
import type { ProjectEntry, SiteConfig, SiteContent } from '../../site/types'
import { useSite } from '../../i18n/SiteProvider'
import { getMergedConfig, getMergedContent, getMergedProjects, saveOverride } from '../../site/overrides'

export type PortfolioDraftApi = {
  active: true
  config: SiteConfig
  content: SiteContent
  projects: ProjectEntry[]
  patchContent: (u: ((c: SiteContent) => SiteContent) | Partial<SiteContent>) => void
  patchConfig: (u: ((c: SiteConfig) => SiteConfig) | Partial<SiteConfig>) => void
  setProjects: (u: ProjectEntry[] | ((p: ProjectEntry[]) => ProjectEntry[])) => void
  patchProject: (id: string, partial: Partial<ProjectEntry>) => void
  save: () => void
  discard: () => void
  dirty: boolean
}

const PortfolioDraftContext = createContext<PortfolioDraftApi | null>(null)

/** Quando ativo, `usePortfolioDisplay` usa estes dados (pré-visualização do rascunho no editor). */
type PortfolioPreviewValue = {
  config: SiteConfig
  content: SiteContent
  projects: ProjectEntry[]
}

const PortfolioPreviewContext = createContext<PortfolioPreviewValue | null>(null)

function readPtBaseline() {
  return {
    config: getMergedConfig(),
    content: getMergedContent('pt'),
    projects: getMergedProjects('pt'),
  }
}

export function PortfolioDraftProvider({ children }: { children: ReactNode }) {
  const admin = useAdminSession()
  const [{ config, content, projects }, setAll] = useState(readPtBaseline)

  const reload = useCallback(() => {
    const b = readPtBaseline()
    setAll({ config: b.config, content: b.content, projects: b.projects })
  }, [])

  useEffect(() => {
    reload()
    window.addEventListener('portfolio-overrides-changed', reload)
    return () => window.removeEventListener('portfolio-overrides-changed', reload)
  }, [reload])

  const patchContent = useCallback((u: ((c: SiteContent) => SiteContent) | Partial<SiteContent>) => {
    setAll((prev) => ({
      ...prev,
      content: typeof u === 'function' ? (u as (c: SiteContent) => SiteContent)(prev.content) : { ...prev.content, ...u },
    }))
  }, [])

  const patchConfig = useCallback((u: ((c: SiteConfig) => SiteConfig) | Partial<SiteConfig>) => {
    setAll((prev) => ({
      ...prev,
      config: typeof u === 'function' ? (u as (c: SiteConfig) => SiteConfig)(prev.config) : { ...prev.config, ...u },
    }))
  }, [])

  const setProjects = useCallback((u: ProjectEntry[] | ((p: ProjectEntry[]) => ProjectEntry[])) => {
    setAll((prev) => ({
      ...prev,
      projects: typeof u === 'function' ? (u as (p: ProjectEntry[]) => ProjectEntry[])(prev.projects) : u,
    }))
  }, [])

  const patchProject = useCallback((id: string, partial: Partial<ProjectEntry>) => {
    setAll((prev) => ({
      ...prev,
      projects: prev.projects.map((x) => (x.id === id ? { ...x, ...partial } : x)),
    }))
  }, [])

  const baseline = readPtBaseline()
  const discard = useCallback(() => {
    const b = readPtBaseline()
    setAll({ config: b.config, content: b.content, projects: b.projects })
  }, [])

  const save = useCallback(() => {
    saveOverride('config', config)
    saveOverride('contentPt', content)
    saveOverride('projectsPt', projects)
  }, [config, content, projects])

  const dirty = useMemo(
    () =>
      JSON.stringify(config) !== JSON.stringify(baseline.config) ||
      JSON.stringify(content) !== JSON.stringify(baseline.content) ||
      JSON.stringify(projects) !== JSON.stringify(baseline.projects),
    [config, content, projects, baseline.config, baseline.content, baseline.projects],
  )

  const value = useMemo<PortfolioDraftApi | null>(() => {
    if (!admin) return null
    return {
      active: true,
      config,
      content,
      projects,
      patchContent,
      patchConfig,
      setProjects,
      patchProject,
      save,
      discard,
      dirty,
    }
  }, [
    admin,
    config,
    content,
    projects,
    patchContent,
    patchConfig,
    setProjects,
    patchProject,
    save,
    discard,
    dirty,
  ])

  return <PortfolioDraftContext.Provider value={value}>{children}</PortfolioDraftContext.Provider>
}

export function usePortfolioDraft(): PortfolioDraftApi | null {
  return useContext(PortfolioDraftContext)
}

/** Envolve a pré-visualização no assistente: as secções leem o rascunho via `usePortfolioDisplay`. */
export function PortfolioDraftPreviewProvider({ children }: { children: ReactNode }) {
  const d = usePortfolioDraft()
  const value = useMemo<PortfolioPreviewValue | null>(() => {
    if (!d?.active) return null
    return { config: d.config, content: d.content, projects: d.projects }
  }, [d])

  if (!value) return <>{children}</>
  return <PortfolioPreviewContext.Provider value={value}>{children}</PortfolioPreviewContext.Provider>
}

/** Conteúdo público do site (sempre PT; edição só no assistente `/editar`). */
export function usePortfolioDisplay() {
  const preview = useContext(PortfolioPreviewContext)
  if (preview) {
    return {
      config: preview.config,
      content: preview.content,
      projects: preview.projects,
      edit: false as const,
      draft: null as PortfolioDraftApi | null,
    }
  }
  const base = useSite()
  return {
    config: base.config,
    content: base.content,
    projects: base.projects,
    edit: false as const,
    draft: null as PortfolioDraftApi | null,
  }
}
