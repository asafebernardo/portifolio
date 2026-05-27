import type { ProjectEntry } from '../site/types'

/** Whether the project has a usable live demo URL. */
export function isDemoAvailable(demoUrl: string | undefined): boolean {
  const url = demoUrl?.trim() ?? ''
  return url.length > 0 && url !== '#'
}

/** Live demo and external links are disabled until the project ships. */
export function isProjectInDevelopment(proj: ProjectEntry): boolean {
  if (proj.inDevelopment === true) return true
  if (proj.inDevelopment === false) return false
  return !isDemoAvailable(proj.demoUrl)
}