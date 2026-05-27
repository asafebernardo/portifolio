import { PORTFOLIO_SECTION_IDS, portfolioPaths, type PortfolioNavKey } from '../site/portfolioPaths'

/** Scroll root for the portfolio (html when zoom is on the document). */
export function getPortfolioScrollRoot(): HTMLElement {
  return (
    document.querySelector<HTMLElement>('[data-portfolio-scroll]') ?? document.documentElement
  )
}

export function scrollPortfolioTo(top: number, behavior: ScrollBehavior = 'smooth') {
  getPortfolioScrollRoot().scrollTo({ top, behavior })
}

export function scrollToPortfolioSection(sectionId: string, behavior: ScrollBehavior = 'smooth') {
  const el = document.getElementById(sectionId)
  if (!el) {
    scrollPortfolioTo(0, behavior)
    return
  }
  el.scrollIntoView({ behavior, block: 'start' })
}

export function scrollToPortfolioNav(navKey: PortfolioNavKey, behavior: ScrollBehavior = 'smooth') {
  if (navKey === 'home') {
    scrollToPortfolioSection(PORTFOLIO_SECTION_IDS.home, behavior)
    return
  }
  scrollToPortfolioSection(PORTFOLIO_SECTION_IDS[navKey], behavior)
}

export function isPortfolioHomePath(pathname: string): boolean {
  return pathname.replace(/\/+$/, '') === portfolioPaths.home
}
