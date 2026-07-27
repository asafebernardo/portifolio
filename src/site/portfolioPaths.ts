export const portfolioPaths = {
  home: '/',
  projects: '/projects',
  skills: '/skills',
  experience: '/experience',
  education: '/education',
  contact: '/contact',
} as const

export type PortfolioNavKey = keyof typeof portfolioPaths

/** `<section>` element ids (anchors and accessibility). */
export const PORTFOLIO_SECTION_IDS: Record<PortfolioNavKey, string> = {
  home: 'home',
  projects: 'projects',
  skills: 'skills',
  experience: 'experience',
  education: 'education',
  contact: 'contact',
} as const

/** Legacy Portuguese paths and hash ids → nav key. */
const LEGACY_SECTION_IDS: Record<string, PortfolioNavKey> = {
  projetos: 'projects',
  experiencias: 'experience',
  contato: 'contact',
  sobre: 'home',
  arquitetura: 'experience',
}

const LEGACY_PATHS: Record<string, PortfolioNavKey> = {
  '/projetos': 'projects',
  '/experiencias': 'experience',
  '/contato': 'contact',
  '/sobre': 'home',
  '/arquitetura': 'experience',
}

export const PORTFOLIO_NAV: readonly { key: PortfolioNavKey; path: (typeof portfolioPaths)[PortfolioNavKey] }[] = [
  { key: 'home', path: portfolioPaths.home },
  { key: 'projects', path: portfolioPaths.projects },
  { key: 'skills', path: portfolioPaths.skills },
  { key: 'experience', path: portfolioPaths.experience },
  { key: 'education', path: portfolioPaths.education },
] as const

export function portfolioNavKeyFromSectionId(sectionId: string): PortfolioNavKey | undefined {
  const legacy = LEGACY_SECTION_IDS[sectionId]
  if (legacy) return legacy
  return (Object.entries(PORTFOLIO_SECTION_IDS) as [PortfolioNavKey, string][]).find(([, id]) => id === sectionId)?.[0]
}

export function portfolioNavKeyFromPathname(pathname: string): PortfolioNavKey {
  const normalized = pathname.replace(/\/+$/, '') || portfolioPaths.home
  const legacy = LEGACY_PATHS[normalized]
  if (legacy) return legacy
  const match = PORTFOLIO_NAV.find((item) => item.path === normalized)
  return match?.key ?? 'home'
}

/** React Router destination: single page with section anchors. */
export function portfolioSectionLinkTo(navKey: PortfolioNavKey): { pathname: string; hash?: string } {
  if (navKey === 'home') return { pathname: portfolioPaths.home, hash: '' }
  return { pathname: portfolioPaths.home, hash: `#${PORTFOLIO_SECTION_IDS[navKey]}` }
}

export function portfolioNavKeyFromLocation(pathname: string, hash: string): PortfolioNavKey {
  const sectionId = hash.replace(/^#/, '')
  if (sectionId) {
    const fromHash = portfolioNavKeyFromSectionId(sectionId)
    if (fromHash) return fromHash
  }
  if (pathname.replace(/\/+$/, '') === portfolioPaths.home) return 'home'
  return portfolioNavKeyFromPathname(pathname)
}
