import { normalizeContactLinkSegments } from './contactLinks'
import type { Locale, ProjectEntry, SiteConfig, SiteContent, SiteRuntimeManifest } from './types'
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

/**
 * Ordem: defaults JSON → manifest no servidor (`uploads/site-runtime.json`) → localStorage.
 * Assim, limpar dados do site remove só o override local; fotos em disco continuam visíveis.
 */
export function getMergedConfig(manifest: SiteRuntimeManifest | null = null): SiteConfig {
  let c = { ...defaults.config }
  if (manifest?.profilePhoto?.trim()) {
    c = { ...c, profilePhoto: manifest.profilePhoto.trim() }
  }
  try {
    const raw = localStorage.getItem(OVERRIDE_STORAGE.config)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SiteConfig>
      c = { ...c, ...parsed }
    }
  } catch {
    /* ignore */
  }
  return c
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

export function getMergedProjects(
  locale: Locale,
  manifest: SiteRuntimeManifest | null = null,
): ProjectEntry[] {
  const file = locale === 'pt' ? 'projectsPt' : 'projectsEn'
  const baseList = defaults[file]
  let projects = baseList.map((p) => ({ ...p }))
  if (manifest?.projectImages) {
    const map = manifest.projectImages
    projects = projects.map((p) => {
      const url = map[p.id]?.trim()
      return url ? { ...p, image: url } : p
    })
  }
  try {
    const raw = localStorage.getItem(OVERRIDE_STORAGE[file])
    if (raw) {
      return JSON.parse(raw) as ProjectEntry[]
    }
  } catch {
    /* ignore */
  }
  return projects
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
