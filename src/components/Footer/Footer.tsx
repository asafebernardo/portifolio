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
          <a href="#home">{footer.top}</a>
          <a href="#projetos">{footer.projects}</a>
          <a href="#contato">{footer.contact}</a>
        </nav>
      </div>
    </footer>
  )
}
