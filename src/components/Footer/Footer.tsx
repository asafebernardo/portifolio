import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import styles from './Footer.module.css'

export function Footer() {
  const { config, content } = usePortfolioDisplay()
  const { footer } = content
  const year = new Date().getFullYear()
  const note = footer.note.replace('{{year}}', String(year)).replace('{{brand}}', config.brandName)

  return (
    <footer className={styles.footer} aria-label={footer.aria}>
      <div className={styles.inner}>
        <p className={styles.copy}>{note}</p>
      </div>
    </footer>
  )
}
