import { useEffect, useState } from 'react'
import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import styles from './BackToTop.module.css'

export function BackToTop() {
  const { content } = usePortfolioDisplay()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={content.backToTop}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 5l7 7h-4v7H9v-7H5l7-7z"
          fill="currentColor"
          opacity="0.95"
        />
      </svg>
    </button>
  )
}
