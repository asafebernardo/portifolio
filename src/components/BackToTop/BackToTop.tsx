import { useEffect, useState } from 'react'
import { getPortfolioScrollRoot, scrollPortfolioTo } from '../../lib/portfolioScroll'
import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import styles from './BackToTop.module.css'

export function BackToTop() {
  const { content } = usePortfolioDisplay()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const scrollRoot = getPortfolioScrollRoot()
    if (!scrollRoot) return
    const onScroll = () => setShow(scrollRoot.scrollTop > 420)
    onScroll()
    scrollRoot.addEventListener('scroll', onScroll, { passive: true })
    return () => scrollRoot.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={() => scrollPortfolioTo(0, 'smooth')}
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
