/** Página única: navegação por scroll (URL só `/`, sem hash na barra). */
export const portfolioPaths = {
  home: '/',
} as const

/** IDs dos elementos `<section>` na página inicial (âncoras). */
export const PORTFOLIO_SECTION_IDS = {
  home: 'home',
  projects: 'projetos',
  skills: 'skills',
  architecture: 'arquitetura',
  about: 'sobre',
  contact: 'contato',
} as const

export type PortfolioNavKey = keyof typeof PORTFOLIO_SECTION_IDS

export const PORTFOLIO_NAV: readonly { sectionId: (typeof PORTFOLIO_SECTION_IDS)[PortfolioNavKey]; key: PortfolioNavKey }[] =
  [
    { sectionId: PORTFOLIO_SECTION_IDS.home, key: 'home' },
    { sectionId: PORTFOLIO_SECTION_IDS.projects, key: 'projects' },
    { sectionId: PORTFOLIO_SECTION_IDS.skills, key: 'skills' },
    { sectionId: PORTFOLIO_SECTION_IDS.architecture, key: 'architecture' },
    { sectionId: PORTFOLIO_SECTION_IDS.about, key: 'about' },
    { sectionId: PORTFOLIO_SECTION_IDS.contact, key: 'contact' },
  ] as const

