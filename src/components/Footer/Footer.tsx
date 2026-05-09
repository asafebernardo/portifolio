import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { PortfolioSectionLink } from '../PortfolioSectionLink/PortfolioSectionLink'
import { PORTFOLIO_SECTION_IDS } from '../../site/portfolioPaths'
import styles from './Footer.module.css'

export function Footer() {
  const { config, content } = usePortfolioDisplay()
  const { footer } = content
  const year = new Date().getFullYear()
  const note = footer.note.replace('{{year}}', String(year)).replace('{{brand}}', config.brandName)

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>{note}</p>
        <nav className={styles.nav} aria-label={footer.aria}>
          <PortfolioSectionLink sectionId={PORTFOLIO_SECTION_IDS.home}>{footer.top}</PortfolioSectionLink>
          <PortfolioSectionLink sectionId={PORTFOLIO_SECTION_IDS.projects}>{footer.projects}</PortfolioSectionLink>
          <PortfolioSectionLink sectionId={PORTFOLIO_SECTION_IDS.contact}>{footer.contact}</PortfolioSectionLink>
        </nav>
      </div>
    </footer>
  )
}
