import catalog from './skillsCatalog.json'
import type { SkillCatalog, SkillCatalogEntry, SkillCategoryId, SkillGroup, SkillLevel } from './types'

const data = catalog as SkillCatalog

export function getSkillsCatalog(): SkillCatalog {
  return data
}

export function getSkillCatalogItems(): SkillCatalogEntry[] {
  return data.items
}

export function getSkillGroupsForDisplay(): SkillGroup[] {
  const byCategory = new Map<SkillCategoryId, string[]>()

  for (const item of data.items) {
    const list = byCategory.get(item.category) ?? []
    list.push(item.name)
    byCategory.set(item.category, list)
  }

  return data.categoryOrder
    .filter((category) => byCategory.has(category))
    .map((category) => ({
      title: data.categoryLabels[category],
      items: byCategory.get(category) ?? [],
    }))
}

export function getSkillLevelLabel(level: SkillLevel): string {
  return data.levelLabels[level]
}

/** Canonical names for ATS / simple consumers. */
export function getSkillNames(): string[] {
  return data.items.map((item) => item.name)
}

/** All canonical names plus aliases (deduplicated). */
export function getSkillTerms(): string[] {
  const terms = new Set<string>()
  for (const item of data.items) {
    terms.add(item.name)
    for (const alias of item.aliases) terms.add(alias)
  }
  return [...terms]
}

export function getSkillsByCategory(): Record<SkillCategoryId, SkillCatalogEntry[]> {
  const grouped = {} as Record<SkillCategoryId, SkillCatalogEntry[]>
  for (const category of data.categoryOrder) {
    grouped[category] = data.items.filter((item) => item.category === category)
  }
  return grouped
}

export function findSkillByName(name: string): SkillCatalogEntry | undefined {
  const key = name.trim().toLowerCase()
  return data.items.find(
    (item) =>
      item.name.toLowerCase() === key ||
      item.aliases.some((alias) => alias.toLowerCase() === key),
  )
}
