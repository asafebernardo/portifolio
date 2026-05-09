/** Scroll até uma secção da página única (sem mudar a URL). */
export function scrollToPortfolioSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
