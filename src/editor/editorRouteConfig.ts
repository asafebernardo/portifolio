import { portfolioPaths } from '../site/portfolioPaths'
import type { ContentPtSectionId } from './contentPtSections'

/** Conteúdo editável na página única (referência para futuras extensões). */
const ALL_CONTENT_SECTIONS: ContentPtSectionId[] = [
  'seo',
  'hero',
  'projects',
  'skills',
  'architecture',
  'about',
  'contact',
  'footer',
]

export function normalizePortfolioPathname(pathname: string): string {
  const p = pathname.trim()
  if (!p || p === '/') return portfolioPaths.home
  return p.replace(/\/+$/, '') || portfolioPaths.home
}

export function getEditorContentSectionIds(_pathname: string): ContentPtSectionId[] {
  return [...ALL_CONTENT_SECTIONS]
}

export function editorAllowsConfigTab(_pathname: string): boolean {
  return true
}

export function editorAllowsProjectsTab(_pathname: string): boolean {
  return true
}

export function pickContentSectionForPath(
  pathname: string,
  preferred: ContentPtSectionId | null | undefined,
): ContentPtSectionId {
  const allowed = getEditorContentSectionIds(pathname)
  if (preferred && allowed.includes(preferred)) return preferred
  return allowed[0]!
}

export function getEditorPathLabel(_pathname: string): string {
  return 'Página única'
}
