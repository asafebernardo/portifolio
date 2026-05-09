import { About } from '../../components/About/About'
import { Architecture } from '../../components/Architecture/Architecture'
import { Contact } from '../../components/Contact/Contact'
import { Hero } from '../../components/Hero/Hero'
import { Projects } from '../../components/Projects/Projects'
import { Skills } from '../../components/Skills/Skills'

export function HomePage() {
  return <Hero />
}

export function ProjectsPage() {
  return <Projects />
}

export function SkillsPage() {
  return <Skills />
}

export function ArchitecturePage() {
  return <Architecture />
}

export function AboutPage() {
  return <About />
}

export function ContactPage() {
  return <Contact />
}
