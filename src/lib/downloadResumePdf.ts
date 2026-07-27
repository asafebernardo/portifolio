import type { ProjectEntry, SiteConfig, SiteContent } from '../site/types'
import { downloadGeneratedResumePdf } from './generateResumePdf'

type ResumeInput = {
  config: SiteConfig
  content: SiteContent
  projects: ProjectEntry[]
}

/** Generates and downloads a PDF aligned with current site content. */
export async function downloadResumePdf(input: ResumeInput): Promise<void> {
  downloadGeneratedResumePdf(input)
}
