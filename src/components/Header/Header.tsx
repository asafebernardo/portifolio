import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { PORTFOLIO_NAV, portfolioPaths } from '../../site/portfolioPaths'
import { useSite } from '../../i18n/SiteProvider'
import { useVisualTheme } from '../../theme/VisualThemeProvider'
import styles from './Header.module.css'

export function Header() {
  const { config, content, locale } = useSite()
  const { theme, setTheme } = useVisualTheme()
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
              <Link to={portfolioPaths.home} className={styles.brandMarkLink} onClick={() => setOpen(false)}>
                <span className={styles.brandMark} aria-hidden="true" />
              </Link>
            )}
            <Link to={portfolioPaths.home} className={styles.brandNameLink} onClick={() => setOpen(false)}>
              <span className={styles.brandText}>{config.brandName}</span>
            </Link>
          </div>

          <nav
            id="site-nav"
            className={`${styles.nav} ${open ? styles.navOpen : ''}`}
            aria-label={nav.ariaMain}
          >
            <ul className={styles.list}>
              {PORTFOLIO_NAV.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === portfolioPaths.home}
                    className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    {nav[item.key]}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <div
                className={styles.themeSwitch}
                role="radiogroup"
                aria-label={locale === 'pt' ? 'Visual do site' : 'Site appearance'}
              >
                <div className={styles.themeSwitchTrack}>
                  <span
                    className={`${styles.themeSwitchThumb} ${theme === 'xp' ? styles.themeSwitchThumbRight : ''}`}
                    aria-hidden
                  />
                  <button
                    type="button"
                    role="radio"
                    aria-checked={theme === 'pro'}
                    className={`${styles.themeSwitchBtn} ${theme === 'pro' ? styles.themeSwitchBtnOn : ''}`}
                    onClick={() => setTheme('pro')}
                  >
                    Pro
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={theme === 'xp'}
                    className={`${styles.themeSwitchBtn} ${theme === 'xp' ? styles.themeSwitchBtnOn : ''}`}
                    onClick={() => setTheme('xp')}
                  >
                    XP
                  </button>
                </div>
              </div>
              <Link to={portfolioPaths.projects} className={styles.cta} onClick={() => setOpen(false)}>
                {nav.ctaProjects}
              </Link>
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
