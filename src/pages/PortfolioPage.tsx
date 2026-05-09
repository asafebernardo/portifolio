import { useCallback, useState } from 'react'
import { About } from '../components/About/About'
import { Architecture } from '../components/Architecture/Architecture'
import { BackToTop } from '../components/BackToTop/BackToTop'
import { Contact } from '../components/Contact/Contact'
import { Footer } from '../components/Footer/Footer'
import { Header } from '../components/Header/Header'
import { Hero } from '../components/Hero/Hero'
import { LoadingScreen } from '../components/LoadingScreen/LoadingScreen'
import { Projects } from '../components/Projects/Projects'
import { Skills } from '../components/Skills/Skills'
import { DocumentMeta } from '../i18n/DocumentMeta'
import { SiteEditorDock } from '../editor/SiteEditorDock'

export default function PortfolioPage() {
  const [loading, setLoading] = useState(true)
  const onLoaded = useCallback(() => setLoading(false), [])

  return (
    <>
      <DocumentMeta />
      {loading ? <LoadingScreen onDone={onLoaded} /> : null}
      <Header />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Architecture />
        <About />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <SiteEditorDock />
    </>
  )
}
