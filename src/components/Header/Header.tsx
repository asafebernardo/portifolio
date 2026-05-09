import { useEffect, useState } from 'react'
import type { Locale } from '../../site/types'
import { useSite } from '../../i18n/SiteProvider'
import styles from './Header.module.css'

const NAV = [
  { href: '#home', key: 'home' as const },
  { href: '#projetos', key: 'projects' as const },
  { href: '#skills', key: 'skills' as const },
  { href: '#arquitetura', key: 'architecture' as const },
  { href: '#sobre', key: 'about' as const },
  { href: '#contato', key: 'contact' as const },
]

export function Header() {
  const { config, content, locale, setLocale } = useSite()
  const profilePhoto = config.profilePhoto?.trim()
  const { nav } = content
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

  function pickLocale(next: Locale) {
    setLocale(next)
    setOpen(false)
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
              <a href="#home" className={styles.brandMarkLink} onClick={() => setOpen(false)}>
                <span className={styles.brandMark} aria-hidden="true" />
              </a>
            )}
            <a href="#home" className={styles.brandNameLink} onClick={() => setOpen(false)}>
              <span className={styles.brandText}>{config.brandName}</span>
            </a>
          </div>

          <nav
            id="site-nav"
            className={`${styles.nav} ${open ? styles.navOpen : ''}`}
            aria-label={nav.ariaMain}
          >
            <ul className={styles.list}>
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.link} onClick={() => setOpen(false)}>
                    {nav[item.key]}
                  </a>
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <div className={styles.lang} role="group" aria-label={nav.ariaLanguage}>
                <button
                  type="button"
                  className={`${styles.langBtn} ${locale === 'pt' ? styles.langActive : ''}`}
                  onClick={() => pickLocale('pt')}
                >
                  PT
                </button>
                <button
                  type="button"
                  className={`${styles.langBtn} ${locale === 'en' ? styles.langActive : ''}`}
                  onClick={() => pickLocale('en')}
                >
                  EN
                </button>
              </div>
              <a href="#projetos" className={styles.cta} onClick={() => setOpen(false)}>
                {nav.ctaProjects}
              </a>
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
