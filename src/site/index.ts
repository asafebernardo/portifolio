import type { Locale, ProjectEntry, SiteConfig, SiteContent } from './types'
import config from './config.json'
import contentEn from './content.en.json'
import contentPt from './content.pt.json'
import projectsEn from './projects.en.json'
import projectsPt from './projects.pt.json'

export const siteConfig = config as SiteConfig

const contents: Record<Locale, SiteContent> = {
  pt: contentPt as SiteContent,
  en: contentEn as SiteContent,
}

export function getContent(locale: Locale): SiteContent {
  return contents[locale]
}

export function getProjects(locale: Locale): ProjectEntry[] {
  return (locale === 'en' ? projectsEn : projectsPt) as ProjectEntry[]
}
