import type { ContentPtSectionId, HeroWizardPart } from '../../editor/contentPtSections'

export type { HeroWizardPart } from '../../editor/contentPtSections'

type WizardContentStep =
  | { kind: 'content'; section: Exclude<ContentPtSectionId, 'hero'> }
  | { kind: 'content'; section: 'hero'; heroPart: HeroWizardPart }

export type WizardStep =
  | { kind: 'config' }
  | WizardContentStep
  | { kind: 'projectsData' }
