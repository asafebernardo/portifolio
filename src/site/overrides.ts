import { normalizeContactLinkSegments } from './contactLinks'
import { resolveProfilePhoto } from './profilePhoto'
import type { ProjectEntry, SiteConfig, SiteContent } from './types'
import configDefault from './config.json'
import contentEnDefault from './content.en.json'
import projectsEnDefault from './projects.en.json'

export const OVERRIDE_STORAGE = {
  config: 'portfolio-override-config',
  contentEn: 'portfolio-override-content-en',
  projectsEn: 'portfolio-override-projects-en',
} as const

export type OverrideFile = keyof typeof OVERRIDE_STORAGE

const defaults = {
  config: configDefault as SiteConfig,
  contentEn: contentEnDefault as SiteContent,
  projectsEn: projectsEnDefault as ProjectEntry[],
}

export function notifyOverridesChanged(): void {
  window.dispatchEvent(new Event('portfolio-overrides-changed'))
}

export function saveOverride(file: OverrideFile, parsed: unknown): void {
  localStorage.setItem(OVERRIDE_STORAGE[file], JSON.stringify(parsed))
  notifyOverridesChanged()
}

export function removeOverride(file: OverrideFile): void {
  localStorage.removeItem(OVERRIDE_STORAGE[file])
  notifyOverridesChanged()
}

export function clearAllOverrides(): void {
  for (const key of Object.values(OVERRIDE_STORAGE)) {
    localStorage.removeItem(key)
  }
  notifyOverridesChanged()
}

function readOverride<T>(file: OverrideFile, fallback: T): T {
  try {
    const raw = localStorage.getItem(OVERRIDE_STORAGE[file])
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function getMergedConfig(): SiteConfig {
  const config = readOverride('config', defaults.config)
  return {
    ...config,
    siteTitle: config.siteTitle?.trim() || defaults.config.siteTitle,
    profilePhoto: resolveProfilePhoto(config.profilePhoto ?? defaults.config.profilePhoto),
  }
}

export function getMergedContent(): SiteContent {
  const c = readOverride('contentEn', defaults.contentEn)
  return {
    ...c,
    contact: {
      ...c.contact,
      linkSegments: normalizeContactLinkSegments(c.contact?.linkSegments),
    },
  }
}

export function getMergedProjects(): ProjectEntry[] {
  return readOverride('projectsEn', defaults.projectsEn)
}

export function getDefaultJson(file: OverrideFile): string {
  return JSON.stringify(defaults[file], null, 2)
}

export function getEffectiveJson(file: OverrideFile): string {
  try {
    const raw = localStorage.getItem(OVERRIDE_STORAGE[file])
    if (raw) return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    /* fall through */
  }
  return getDefaultJson(file)
}
