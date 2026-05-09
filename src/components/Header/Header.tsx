import { useEffect, useMemo, useState } from 'react'
import { PORTFOLIO_NAV, PORTFOLIO_SECTION_IDS } from '../../site/portfolioPaths'
import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { usePortfolioSectionSpy } from '../../hooks/usePortfolioSectionSpy'
import { PortfolioSectionLink } from '../PortfolioSectionLink/PortfolioSectionLink'
import styles from './Header.module.css'

const SECTION_IDS = PORTFOLIO_NAV.map((i) => i.sectionId)

export function Header() {
  const { config, content } = usePortfolioDisplay()
  const profilePhoto = config.profilePhoto?.trim()
  const { nav } = content
  const sectionIds = useMemo(() => SECTION_IDS, [])
  const activeSectionId = usePortfolioSectionSpy(sectionIds)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [photoModalOpen, setPhotoModalOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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

  function navActive(sectionId: string): boolean {
    if (sectionId === PORTFOLIO_SECTION_IDS.home) {
      return activeSectionId === PORTFOLIO_SECTION_IDS.home
    }
    return activeSectionId === sectionId
  }

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <div className={styles.brand}>
            {profilePhoto ? (
              <button
                type="button"
                className={styles.brandAvatarBtn}
                onClick={() => setPhotoModalOpen(true)}
                aria-label="Ampliar foto de perfil"
                aria-haspopup="dialog"
                aria-expanded={photoModalOpen}
              >
                <img
                  src={profilePhoto}
                  alt=""
                  className={styles.brandAvatar}
                  width={36}
                  height={36}
                  decoding="async"
                />
              </button>
            ) : (
              <PortfolioSectionLink
                sectionId={PORTFOLIO_SECTION_IDS.home}
                className={styles.brandMarkLink}
                onNavigate={() => setOpen(false)}
              >
                <span className={styles.brandMark} aria-hidden="true" />
              </PortfolioSectionLink>
            )}
            <PortfolioSectionLink
              sectionId={PORTFOLIO_SECTION_IDS.home}
              className={styles.brandNameLink}
              onNavigate={() => setOpen(false)}
            >
              <span className={styles.brandText}>{config.brandName}</span>
            </PortfolioSectionLink>
          </div>

          <nav
            id="site-nav"
            className={`${styles.nav} ${open ? styles.navOpen : ''}`}
            aria-label={nav.ariaMain}
          >
            <ul className={styles.list}>
              {PORTFOLIO_NAV.map((item) => (
                <li key={item.sectionId}>
                  <PortfolioSectionLink
                    sectionId={item.sectionId}
                    className={`${styles.link} ${navActive(item.sectionId) ? styles.linkActive : ''}`}
                    onNavigate={() => setOpen(false)}
                  >
                    {nav[item.key]}
                  </PortfolioSectionLink>
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <PortfolioSectionLink
                sectionId={PORTFOLIO_SECTION_IDS.projects}
                className={styles.cta}
                onNavigate={() => setOpen(false)}
              >
                {nav.ctaProjects}
              </PortfolioSectionLink>
            </div>
          </nav>

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
                alt={`Foto de ${config.brandName}`}
                className={styles.photoModalImg}
                decoding="async"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
