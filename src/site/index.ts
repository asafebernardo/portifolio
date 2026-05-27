import type { ProjectEntry, SiteConfig, SiteContent } from './types'
import config from './config.json'
import contentEn from './content.en.json'
import projectsEn from './projects.en.json'

export const SITE_LOCALE = 'en' as const

export const siteConfig = config as SiteConfig

export function getContent(): SiteContent {
  return contentEn as SiteContent
}

export function getProjects(): ProjectEntry[] {
  return projectsEn as ProjectEntry[]
}
