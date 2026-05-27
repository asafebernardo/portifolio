import { About } from '../../components/About/About'
import { Contact } from '../../components/Contact/Contact'
import { Projects } from '../../components/Projects/Projects'
import { Skills } from '../../components/Skills/Skills'
import { WorkExperience } from '../../components/WorkExperience/WorkExperience'

/** Single page: each menu item maps to its own section id. */
export function PortfolioPage() {
  return (
    <>
      <About />
      <Projects />
      <Skills />
      <WorkExperience />
      <Contact />
    </>
  )
}
