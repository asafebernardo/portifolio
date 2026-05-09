import { About } from '../../components/About/About'
import { Architecture } from '../../components/Architecture/Architecture'
import { Contact } from '../../components/Contact/Contact'
import { Hero } from '../../components/Hero/Hero'
import { Projects } from '../../components/Projects/Projects'
import { Skills } from '../../components/Skills/Skills'

/** Página única: todas as secções em sequência (navegação por âncoras). */
export function PortfolioHome() {
  return (
    <>
      <Hero />
      <Projects />
      <Skills />
      <Architecture />
      <About />
      <Contact />
    </>
  )
}
