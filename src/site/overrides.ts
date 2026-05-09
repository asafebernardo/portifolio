import { normalizeContactLinkSegments } from './contactLinks'
import type { Locale, ProjectEntry, SiteConfig, SiteContent } from './types'
import configDefault from './config.json'
import contentEnDefault from './content.en.json'
import contentPtDefault from './content.pt.json'
import projectsEnDefault from './projects.en.json'
import projectsPtDefault from './projects.pt.json'

export const OVERRIDE_STORAGE = {
  config: 'portfolio-override-config',
  contentPt: 'portfolio-override-content-pt',
  contentEn: 'portfolio-override-content-en',
  projectsPt: 'portfolio-override-projects-pt',
  projectsEn: 'portfolio-override-projects-en',
} as const

export type OverrideFile = keyof typeof OVERRIDE_STORAGE

const defaults = {
  config: configDefault as SiteConfig,
  contentPt: contentPtDefault as SiteContent,
  contentEn: contentEnDefault as SiteContent,
  projectsPt: projectsPtDefault as ProjectEntry[],
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
  return readOverride('config', defaults.config)
}

export function getMergedContent(locale: Locale): SiteContent {
  const file = locale === 'pt' ? 'contentPt' : 'contentEn'
  const c = readOverride(file, defaults[file])
  return {
    ...c,
    contact: {
      ...c.contact,
      linkSegments: normalizeContactLinkSegments(c.contact?.linkSegments),
    },
  }
}

export function getMergedProjects(locale: Locale): ProjectEntry[] {
  const file = locale === 'pt' ? 'projectsPt' : 'projectsEn'
  return readOverride(file, defaults[file])
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
