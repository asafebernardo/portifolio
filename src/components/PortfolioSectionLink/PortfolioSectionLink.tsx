import type { MouseEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { scrollToPortfolioSection } from '../../site/portfolioNavigation'

type Props = {
  sectionId: string
  className?: string
  children: ReactNode
  /** Chamado depois do scroll (ex.: fechar menu mobile). */
  onNavigate?: () => void
}

/** Link interno que só faz scroll — mantém a URL em `/` sem `#` nem query. */
export function PortfolioSectionLink({ sectionId, className, children, onNavigate }: Props) {
  const navigate = useNavigate()

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    scrollToPortfolioSection(sectionId)
    navigate('/', { replace: true })
    onNavigate?.()
  }

  return (
    <a href="/" className={className} onClick={onClick}>
      {children}
    </a>
  )
}
