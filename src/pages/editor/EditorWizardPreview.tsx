import type { ReactNode } from 'react'
import { About } from '../../components/About/About'
import { Architecture } from '../../components/Architecture/Architecture'
import { Contact } from '../../components/Contact/Contact'
import { Hero } from '../../components/Hero/Hero'
import { Projects } from '../../components/Projects/Projects'
import { Skills } from '../../components/Skills/Skills'
import { Footer } from '../../components/Footer/Footer'
import type { WizardStep } from './wizardTypes'

export function EditorWizardPreview({
  step,
  projectCardIndex,
}: {
  step: WizardStep
  /** Índice do projeto no passo «Projetos (cartões)» — prévia mostra só esse cartão. */
  projectCardIndex: number
}): ReactNode {
  if (step.kind === 'projectsData') {
    return <Projects previewProjectIndex={projectCardIndex} />
  }

  if (step.kind === 'content') {
    if (step.section === 'hero') {
      return <Hero previewScope={step.heroPart} />
    }
    switch (step.section) {
      case 'projects':
        return <Projects />
      case 'skills':
        return <Skills />
      case 'architecture':
        return <Architecture />
      case 'about':
        return <About />
      case 'contact':
        return <Contact />
      case 'footer':
        return <Footer />
      default:
        return null
    }
  }

  return null
}
