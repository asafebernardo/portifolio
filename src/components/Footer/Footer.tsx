import { Link } from 'react-router-dom'
import { portfolioPaths } from '../../site/portfolioPaths'
import { useSite } from '../../i18n/SiteProvider'
import styles from './Footer.module.css'

export function Footer() {
  const { config, content } = useSite()
  const { footer } = content
  const year = new Date().getFullYear()
  const note = footer.note.replace('{{year}}', String(year)).replace('{{brand}}', config.brandName)

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>{note}</p>
        <nav className={styles.nav} aria-label={footer.aria}>
          <Link to={portfolioPaths.home}>{footer.top}</Link>
          <Link to={portfolioPaths.projects}>{footer.projects}</Link>
          <Link to={portfolioPaths.contact}>{footer.contact}</Link>
        </nav>
      </div>
    </footer>
  )
}
