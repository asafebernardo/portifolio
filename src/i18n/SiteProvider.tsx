import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Locale, ProjectEntry, SiteConfig, SiteContent } from '../site/types'
import { getMergedConfig, getMergedContent, getMergedProjects } from '../site/overrides'

const STORAGE_KEY = 'portfolio-locale'

function readInitialLocale(): Locale {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s === 'pt' || s === 'en') return s
  } catch {
    /* private mode */
  }
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('pt')) return 'pt'
  return 'en'
}

type SiteContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  config: SiteConfig
  content: SiteContent
  projects: ProjectEntry[]
}

const SiteContext = createContext<SiteContextValue | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)
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

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const config = useMemo(() => getMergedConfig(), [revision])
  const content = useMemo(() => getMergedContent(locale), [revision, locale])
  const projects = useMemo(() => getMergedProjects(locale), [revision, locale])

  const value = useMemo<SiteContextValue>(
    () => ({
      locale,
      setLocale,
      config,
      content,
      projects,
    }),
    [locale, setLocale, config, content, projects],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
