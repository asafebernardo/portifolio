import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BackToTop } from '../../components/BackToTop/BackToTop'
import { Header } from '../../components/Header/Header'
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen'
import { DocumentMeta } from '../../i18n/DocumentMeta'
import {
  PORTFOLIO_SECTION_IDS,
  portfolioNavKeyFromPathname,
  portfolioNavKeyFromSectionId,
  portfolioPaths,
} from '../../site/portfolioPaths'
import {
  isPortfolioHomePath,
  scrollPortfolioTo,
  scrollToPortfolioNav,
  scrollToPortfolioSection,
} from '../../lib/portfolioScroll'
import layout from './PortfolioLayout.module.css'

export function PortfolioLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const onLoaded = useCallback(() => setLoading(false), [])
  const prevPathname = useRef<string | null>(null)

  /** Legacy paths (/projetos, …) or hash → single-page section anchor. */
  useLayoutEffect(() => {
    const normalizedPath = location.pathname.replace(/\/+$/, '') || portfolioPaths.home
    const legacyKey =
      normalizedPath !== portfolioPaths.home ? portfolioNavKeyFromPathname(normalizedPath) : undefined

    if (legacyKey && legacyKey !== 'home') {
      navigate(
        { pathname: portfolioPaths.home, hash: `#${PORTFOLIO_SECTION_IDS[legacyKey]}` },
        { replace: true },
      )
      return
    }

    const fragment = location.hash.replace(/^#/, '')
    if (!fragment) return

    const key = portfolioNavKeyFromSectionId(fragment)
    if (key && normalizedPath !== portfolioPaths.home) {
      navigate(
        { pathname: portfolioPaths.home, hash: `#${fragment}` },
        { replace: true },
      )
      return
    }

    if (key) {
      requestAnimationFrame(() => scrollToPortfolioSection(fragment, 'auto'))
    }
  }, [location.hash, location.pathname, navigate])

  useLayoutEffect(() => {
    const hashId = location.hash.replace(/^#/, '')
    const onHome = isPortfolioHomePath(location.pathname)

    if (hashId) {
      requestAnimationFrame(() => scrollToPortfolioSection(hashId, 'smooth'))
      return
    }

    if (onHome) {
      requestAnimationFrame(() => scrollToPortfolioNav('home', 'smooth'))
    }

    if (prevPathname.current === null) {
      prevPathname.current = location.pathname
      return
    }
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname
      scrollPortfolioTo(0, 'auto')
    }
  }, [location.pathname, location.hash])

  return (
    <div className={layout.page}>
      <DocumentMeta />
      {loading ? <LoadingScreen onDone={onLoaded} /> : null}
      <Header />
      <main className={layout.main}>
        <div className={layout.contentLane}>
          <Outlet />
        </div>
      </main>
      <BackToTop />
    </div>
  )
}
