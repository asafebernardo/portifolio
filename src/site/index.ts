import { normalizeContactLinkSegments } from './contactLinks'
import { resolveProfilePhoto } from './profilePhoto'
import type { ProjectEntry, SiteConfig, SiteContent } from './types'
import config from './config.json'
import contentEn from './content.en.json'
import projectsEn from './projects.en.json'

export const SITE_LOCALE = 'en' as const

const defaultConfig = config as SiteConfig
const defaultContent = contentEn as SiteContent
const defaultProjects = projectsEn as ProjectEntry[]

export function getSiteConfig(): SiteConfig {
  return {
    ...defaultConfig,
    siteTitle: defaultConfig.siteTitle?.trim() || defaultConfig.siteTitle,
    profilePhoto: resolveProfilePhoto(defaultConfig.profilePhoto),
  }
}

export function getSiteContent(): SiteContent {
  return {
    ...defaultContent,
    contact: {
      ...defaultContent.contact,
      linkSegments: normalizeContactLinkSegments(defaultContent.contact?.linkSegments),
    },
  }
}

export function getSiteProjects(): ProjectEntry[] {
  return defaultProjects
}
