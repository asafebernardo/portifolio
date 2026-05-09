import { portfolioPaths } from '../site/portfolioPaths'
import type { ContentPtSectionId } from './contentPtSections'

/** Textos editáveis na home (hero + meta navegação global + rodapé). */
const HOME_CONTENT_SECTIONS: ContentPtSectionId[] = ['hero', 'seo', 'nav', 'footer']

export function normalizePortfolioPathname(pathname: string): string {
  const p = pathname.trim()
  if (!p || p === '/') return portfolioPaths.home
  return p.replace(/\/+$/, '') || portfolioPaths.home
}

/** Quais blocos de `content.pt.json` podem ser editados nesta rota. */
export function getEditorContentSectionIds(pathname: string): ContentPtSectionId[] {
  const p = normalizePortfolioPathname(pathname)
  if (p === portfolioPaths.home) return [...HOME_CONTENT_SECTIONS]
  if (p === portfolioPaths.projects) return ['projects']
  if (p === portfolioPaths.skills) return ['skills']
  if (p === portfolioPaths.architecture) return ['architecture']
  if (p === portfolioPaths.about) return ['about']
  if (p === portfolioPaths.contact) return ['contact']
  return [...HOME_CONTENT_SECTIONS]
}

export function editorAllowsConfigTab(pathname: string): boolean {
  return normalizePortfolioPathname(pathname) === portfolioPaths.home
}

export function editorAllowsProjectsTab(pathname: string): boolean {
  return normalizePortfolioPathname(pathname) === portfolioPaths.projects
}

export function pickContentSectionForPath(
  pathname: string,
  preferred: ContentPtSectionId | null | undefined,
): ContentPtSectionId {
  const allowed = getEditorContentSectionIds(pathname)
  if (preferred && allowed.includes(preferred)) return preferred
  return allowed[0]!
}

/** Rótulo curto da página no editor (PT). */
export function getEditorPathLabel(pathname: string): string {
  const p = normalizePortfolioPathname(pathname)
  const labels: Record<string, string> = {
    [portfolioPaths.home]: 'Home',
    [portfolioPaths.projects]: 'Projetos',
    [portfolioPaths.skills]: 'Skills',
    [portfolioPaths.architecture]: 'Arquitetura',
    [portfolioPaths.about]: 'Sobre',
    [portfolioPaths.contact]: 'Contato',
  }
  return labels[p] ?? p
}
