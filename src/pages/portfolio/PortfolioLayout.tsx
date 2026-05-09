import { useCallback, useLayoutEffect, useState } from 'react'
import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useAdminSession } from '../../admin/useAdminSession'
import { BackToTop } from '../../components/BackToTop/BackToTop'
import { Footer } from '../../components/Footer/Footer'
import { Header } from '../../components/Header/Header'
import { LoadingScreen } from '../../components/LoadingScreen/LoadingScreen'
import { SiteEditorDock } from '../../editor/SiteEditorDock'
import { DocumentMeta } from '../../i18n/DocumentMeta'
import layout from './PortfolioLayout.module.css'

export function PortfolioLayout() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const admin = useAdminSession()
  const editOpen = Boolean(admin && searchParams.get('edit') === '1')
  const [loading, setLoading] = useState(true)
  const onLoaded = useCallback(() => setLoading(false), [])

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <>
      <DocumentMeta />
      {loading ? <LoadingScreen onDone={onLoaded} /> : null}
      <Header />
      <main className={editOpen ? layout.mainSplit : layout.main}>
        <div className={layout.contentLane}>
          {editOpen ? (
            <>
              <div className={layout.contentGrow}>
                <Outlet />
              </div>
              <Footer />
            </>
          ) : (
            <Outlet />
          )}
        </div>
        <SiteEditorDock />
      </main>
      {editOpen ? null : <Footer />}
      <BackToTop />
    </>
  )
}
