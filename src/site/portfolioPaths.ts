/** Rotas públicas do portfólio (um path por seção). */
export const portfolioPaths = {
  home: '/',
  projects: '/projetos',
  skills: '/skills',
  architecture: '/arquitetura',
  about: '/sobre',
  contact: '/contato',
} as const

export type PortfolioNavKey = keyof typeof portfolioPaths

export const PORTFOLIO_NAV: readonly { path: string; key: PortfolioNavKey }[] = [
  { path: portfolioPaths.home, key: 'home' },
  { path: portfolioPaths.projects, key: 'projects' },
  { path: portfolioPaths.skills, key: 'skills' },
  { path: portfolioPaths.architecture, key: 'architecture' },
  { path: portfolioPaths.about, key: 'about' },
  { path: portfolioPaths.contact, key: 'contact' },
] as const
