import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BackToTop } from '../../components/BackToTop/BackToTop'
import { EditorWizardFab } from '../../components/EditorWizardFab/EditorWizardFab'
import { Footer } from '../../components/Footer/Footer'
import { Header } from '../../components/Header/Header'
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen'
import { DocumentMeta } from '../../i18n/DocumentMeta'
import { scrollToPortfolioSection } from '../../site/portfolioNavigation'
import layout from './PortfolioLayout.module.css'

export function PortfolioLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const onLoaded = useCallback(() => setLoading(false), [])
  const prevPathname = useRef<string | null>(null)

  /** Links antigos com `#secção` ou `?query`: faz scroll e remove hash/query da barra (só `/`). */
  useLayoutEffect(() => {
    if (location.pathname !== '/') return

    const fragment = location.hash.replace(/^#/, '')
    const hasSearch = location.search.length > 0

    if (fragment) {
      const scroll = () => scrollToPortfolioSection(fragment)
      scroll()
      requestAnimationFrame(scroll)
      window.setTimeout(scroll, 120)
      window.setTimeout(scroll, 320)
    }

    if (location.hash || hasSearch) {
      navigate('/', { replace: true })
    }
  }, [location.pathname, location.hash, location.search, navigate])

  useLayoutEffect(() => {
    if (prevPathname.current === null) {
      prevPathname.current = location.pathname
      return
    }
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname
      if (location.pathname === '/' && !location.hash && !location.search) {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    }
  }, [location.pathname, location.hash, location.search])

  return (
    <>
      <DocumentMeta />
      {loading ? <LoadingScreen onDone={onLoaded} /> : null}
      <Header />
      <main className={layout.main}>
        <div className={layout.contentLane}>
          <Outlet />
        </div>
      </main>
      <Footer />
      <EditorWizardFab />
      <BackToTop />
    </>
  )
}
