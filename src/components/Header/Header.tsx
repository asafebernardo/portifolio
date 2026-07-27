import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PORTFOLIO_NAV, portfolioNavKeyFromLocation } from '../../site/portfolioPaths'
import { resolveProfilePhoto } from '../../site/profilePhoto'
import { useColorScheme } from '../../theme/ColorSchemeProvider'
import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { PortfolioSectionLink } from '../PortfolioSectionLink/PortfolioSectionLink'
import { imageAnonymousProps } from '../../lib/imageLoadProps'
import { getPortfolioScrollRoot } from '../../lib/portfolioScroll'
import styles from './Header.module.css'

function IconSun({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="none">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconMoon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="none">
      <path
        d="M21 13.2A8.5 8.5 0 1110.8 3a6.5 6.5 0 0010.2 10.2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconDownload({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="none">
      <path
        d="M12 3v12m0 0l4-4m-4 4l-4-4M4 21h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Header() {
  const { pathname, hash } = useLocation()
  const { config, content, projects } = usePortfolioDisplay()
  const profilePhoto = resolveProfilePhoto(config.profilePhoto)
  const { nav } = content
  const activeNavKey = portfolioNavKeyFromLocation(pathname, hash)
  const { resolved, setPreference } = useColorScheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)

  const handleDownloadResume = useCallback(async () => {
    if (downloadingPdf) return
    setDownloadingPdf(true)
    try {
      const { downloadResumePdf } = await import('../../lib/downloadResumePdf')
      await downloadResumePdf({ config, content, projects })
      setOpen(false)
    } catch {
      window.alert('Não foi possível gerar o PDF. Tente novamente.')
    } finally {
      setDownloadingPdf(false)
    }
  }, [config, content, projects, downloadingPdf])

  useEffect(() => {
    const scrollRoot = getPortfolioScrollRoot()
    if (!scrollRoot) return
    const onScroll = () => setScrolled(scrollRoot.scrollTop > 12)
    onScroll()
    scrollRoot.addEventListener('scroll', onScroll, { passive: true })
    return () => scrollRoot.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open || photoModalOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, photoModalOpen])

  useEffect(() => {
    if (!photoModalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhotoModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photoModalOpen])

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <PortfolioSectionLink
            navKey="home"
            className={styles.brand}
            onNavigate={() => setOpen(false)}
          >
            <span className={styles.brandText}>{config.siteTitle}</span>
          </PortfolioSectionLink>

          <nav
            id="site-nav"
            className={`${styles.nav} ${open ? styles.navOpen : ''}`}
            aria-label={nav.ariaMain}
          >
            <div className={styles.navSection}>
              <p className={styles.navSectionLabel}>Menu</p>
              <ul className={styles.list}>
                {PORTFOLIO_NAV.map((item) => (
                  <li key={item.key}>
                    <PortfolioSectionLink
                      navKey={item.key}
                      className={`${styles.link} ${activeNavKey === item.key ? styles.linkActive : ''}`}
                      onNavigate={() => setOpen(false)}
                    >
                      {nav[item.key]}
                    </PortfolioSectionLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${styles.navSection} ${styles.navSectionTools}`}>
              <p className={styles.navSectionLabel}>Tema</p>
              <div className={styles.themeSwitch}>
                <button
                  type="button"
                  className={styles.themeToggleBtn}
                  onClick={() => setPreference(resolved === 'dark' ? 'light' : 'dark')}
                  aria-label={resolved === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                >
                  {resolved === 'dark' ? (
                    <IconMoon className={styles.themeIcon} />
                  ) : (
                    <IconSun className={styles.themeIcon} />
                  )}
                </button>
              </div>
            </div>
          </nav>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => void handleDownloadResume()}
              disabled={downloadingPdf}
              aria-label={nav.downloadResumeAria}
              title={nav.downloadResume}
            >
              <IconDownload className={styles.headerIcon} />
            </button>
            <div className={styles.themeSwitchDesktop}>
              <button
                type="button"
                className={styles.themeToggleBtn}
                onClick={() => setPreference(resolved === 'dark' ? 'light' : 'dark')}
                aria-label={resolved === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              >
                {resolved === 'dark' ? (
                  <IconMoon className={styles.themeIcon} />
                ) : (
                  <IconSun className={styles.themeIcon} />
                )}
              </button>
            </div>
            <button
              type="button"
              className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
              aria-expanded={open}
              aria-controls="site-nav"
              aria-label={open ? nav.menuClose : nav.menuOpen}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        {open ? (
          <button type="button" className={styles.scrim} aria-label={nav.scrimClose} onClick={() => setOpen(false)} />
        ) : null}
      </header>

      {photoModalOpen && profilePhoto ? (
        <div
          className={styles.photoModalRoot}
          role="dialog"
          aria-modal="true"
          aria-labelledby="photo-modal-title"
        >
          <button
            type="button"
            className={styles.photoModalBackdrop}
            aria-label="Fechar"
            onClick={() => setPhotoModalOpen(false)}
          />
          <div className={styles.photoModalSheet}>
            <h2 id="photo-modal-title" className={styles.photoModalSrOnly}>
              {config.brandName}
            </h2>
            <button
              type="button"
              className={styles.photoModalClose}
              aria-label="Fechar"
              onClick={() => setPhotoModalOpen(false)}
            >
              ×
            </button>
            <div className={styles.photoModalFrame}>
              <img
                src={profilePhoto}
                alt={`Photo of ${config.brandName}`}
                className={styles.photoModalImg}
                decoding="async"
                {...imageAnonymousProps(profilePhoto)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
