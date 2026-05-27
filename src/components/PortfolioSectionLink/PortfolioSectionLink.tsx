import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { scrollToPortfolioNav } from '../../lib/portfolioScroll'
import { portfolioSectionLinkTo, type PortfolioNavKey } from '../../site/portfolioPaths'

type Props = {
  navKey: PortfolioNavKey
  className?: string
  children: ReactNode
  /** Called after navigation (e.g. close mobile menu). */
  onNavigate?: () => void
}

export function PortfolioSectionLink({ navKey, className, children, onNavigate }: Props) {
  return (
    <Link
      to={portfolioSectionLinkTo(navKey)}
      className={className}
      onClick={() => {
        if (navKey === 'home') {
          requestAnimationFrame(() => scrollToPortfolioNav('home', 'smooth'))
        }
        onNavigate?.()
      }}
    >
      {children}
    </Link>
  )
}
