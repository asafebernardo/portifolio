import { About } from '../../components/About/About'
import { Education } from '../../components/Education/Education'
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
      <Education />
    </>
  )
}
