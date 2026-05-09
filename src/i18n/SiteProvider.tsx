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

/** Resolve pt | en from the browser's preferred languages (no manual selector). */
export function localeFromNavigator(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  const list =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language || 'en']
  for (const raw of list) {
    const primary = raw.toLowerCase().split('-')[0] ?? ''
    if (primary === 'pt') return 'pt'
    if (primary === 'en') return 'en'
  }
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
  const [locale, setLocaleState] = useState<Locale>(() => localeFromNavigator())
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

  useEffect(() => {
    const sync = () => setLocaleState(localeFromNavigator())
    window.addEventListener('languagechange', sync)
    return () => window.removeEventListener('languagechange', sync)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
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
