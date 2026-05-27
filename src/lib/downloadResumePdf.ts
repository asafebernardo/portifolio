import { jsPDF } from 'jspdf'
import { resolveContactLinksFromContent } from '../site/contactLinks'
import { resolveProfilePhoto } from '../site/profilePhoto'
import type { ProjectEntry, SiteConfig, SiteContent } from '../site/types'

const PAGE = { w: 210, h: 297, margin: 18, footer: 12 }
const COLORS = {
  text: '#111827',
  muted: '#4b5563',
  accent: '#8b1a1a',
  rule: '#d1d5db',
}

type ResumeInput = {
  config: SiteConfig
  content: SiteContent
  projects: ProjectEntry[]
}

type Layout = {
  doc: jsPDF
  y: number
}

function contentWidth() {
  return PAGE.w - PAGE.margin * 2
}

function ensureSpace(layout: Layout, height: number) {
  if (layout.y + height <= PAGE.h - PAGE.footer) return
  layout.doc.addPage()
  layout.y = PAGE.margin
}

function addRule(layout: Layout) {
  ensureSpace(layout, 4)
  layout.doc.setDrawColor(COLORS.rule)
  layout.doc.setLineWidth(0.3)
  layout.doc.line(PAGE.margin, layout.y, PAGE.w - PAGE.margin, layout.y)
  layout.y += 4
}

function addSectionTitle(layout: Layout, title: string) {
  ensureSpace(layout, 12)
  layout.y += 6
  layout.doc.setFont('helvetica', 'bold')
  layout.doc.setFontSize(11)
  layout.doc.setTextColor(COLORS.accent)
  layout.doc.text(title.toUpperCase(), PAGE.margin, layout.y)
  layout.y += 2
  addRule(layout)
  layout.y += 4
}

function addParagraph(layout: Layout, text: string, fontSize = 10) {
  const lines = layout.doc.splitTextToSize(text, contentWidth())
  ensureSpace(layout, lines.length * fontSize * 0.42 + 2)
  layout.doc.setFont('helvetica', 'normal')
  layout.doc.setFontSize(fontSize)
  layout.doc.setTextColor(COLORS.text)
  layout.doc.text(lines, PAGE.margin, layout.y)
  layout.y += lines.length * fontSize * 0.42 + 3
}

function addBulletList(layout: Layout, items: string[], maxItems = 6) {
  const slice = items.slice(0, maxItems)
  layout.doc.setFont('helvetica', 'normal')
  layout.doc.setFontSize(9.5)
  layout.doc.setTextColor(COLORS.text)

  for (const item of slice) {
    const bullet = `\u2022 ${item}`
    const lines = layout.doc.splitTextToSize(bullet, contentWidth() - 2)
    ensureSpace(layout, lines.length * 4.2 + 1)
    layout.doc.text(lines, PAGE.margin + 1, layout.y)
    layout.y += lines.length * 4.2 + 1
  }
  layout.y += 2
}

async function loadImageDataUrl(src: string): Promise<string | null> {
  try {
    const url = src.startsWith('http') ? src : new URL(src, window.location.origin).href
    const response = await fetch(url)
    if (!response.ok) return null
    const blob = await response.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function imageFormat(dataUrl: string): 'PNG' | 'JPEG' {
  return dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG'
}

function buildHeader(layout: Layout, input: ResumeInput, photoDataUrl: string | null) {
  const { config, content } = input
  const contact = resolveContactLinksFromContent(content, config)
  const photoSize = 28
  const textX = photoDataUrl ? PAGE.margin + photoSize + 8 : PAGE.margin
  const textWidth = contentWidth() - (photoDataUrl ? photoSize + 8 : 0)

  if (photoDataUrl) {
    layout.doc.addImage(photoDataUrl, imageFormat(photoDataUrl), PAGE.margin, layout.y - 2, photoSize, photoSize)
  }

  layout.doc.setFont('helvetica', 'bold')
  layout.doc.setFontSize(22)
  layout.doc.setTextColor(COLORS.text)
  layout.doc.text(config.brandName, textX, layout.y + 8, { maxWidth: textWidth })

  layout.doc.setFont('helvetica', 'normal')
  layout.doc.setFontSize(12)
  layout.doc.setTextColor(COLORS.accent)
  layout.doc.text(content.about.title, textX, layout.y + 16, { maxWidth: textWidth })

  const contactParts = [
    contact.mailtoDisplay,
    contact.whatsappDisplay,
    contact.linkedinDisplay,
    contact.githubDisplay,
  ].filter(Boolean)

  layout.doc.setFontSize(9)
  layout.doc.setTextColor(COLORS.muted)
  const contactLine = contactParts.join('  |  ')
  const contactLines = layout.doc.splitTextToSize(contactLine, textWidth)
  layout.doc.text(contactLines, textX, layout.y + 22)

  layout.y += photoDataUrl ? photoSize + 6 : 28
  addRule(layout)
  layout.y += 2
}

function buildSummary(layout: Layout, content: SiteContent) {
  addSectionTitle(layout, 'Professional Summary')
  const summary = [content.about.lead, content.about.para].filter(Boolean).join('\n\n')
  addParagraph(layout, summary)
}

function buildExperience(layout: Layout, content: SiteContent) {
  addSectionTitle(layout, content.experience.title)

  for (const item of content.experience.items) {
    ensureSpace(layout, 28)
    layout.doc.setFont('helvetica', 'bold')
    layout.doc.setFontSize(10.5)
    layout.doc.setTextColor(COLORS.text)
    layout.doc.text(item.role, PAGE.margin, layout.y)

    layout.doc.setFont('helvetica', 'normal')
    layout.doc.setFontSize(9.5)
    layout.doc.setTextColor(COLORS.muted)
    const periodWidth = layout.doc.getTextWidth(item.period)
    layout.doc.text(item.period, PAGE.w - PAGE.margin - periodWidth, layout.y)
    layout.y += 5

    layout.doc.setFont('helvetica', 'bold')
    layout.doc.setFontSize(10)
    layout.doc.setTextColor(COLORS.text)
    layout.doc.text(item.company, PAGE.margin, layout.y)

    layout.doc.setFont('helvetica', 'normal')
    layout.doc.setFontSize(9)
    layout.doc.setTextColor(COLORS.muted)
    layout.doc.text(item.location, PAGE.margin, layout.y + 4.5)
    layout.y += 10

    addParagraph(layout, item.description, 9.5)
    if (item.highlights.length) {
      addBulletList(layout, item.highlights, 5)
    }
    layout.y += 2
  }
}

function buildSkills(layout: Layout, content: SiteContent) {
  addSectionTitle(layout, content.skills.title)

  for (const group of content.skills.groups) {
    ensureSpace(layout, 10)
    layout.doc.setFont('helvetica', 'bold')
    layout.doc.setFontSize(10)
    layout.doc.setTextColor(COLORS.text)
    layout.doc.text(`${group.title}:`, PAGE.margin, layout.y)

    layout.doc.setFont('helvetica', 'normal')
    layout.doc.setFontSize(9.5)
    layout.doc.setTextColor(COLORS.muted)
    const skillsLine = group.items.join(' · ')
    const lines = layout.doc.splitTextToSize(skillsLine, contentWidth() - 4)
    layout.doc.text(lines, PAGE.margin + 2, layout.y + 5)
    layout.y += 5 + lines.length * 4.2 + 3
  }
}

function buildProjects(layout: Layout, content: SiteContent, projects: ProjectEntry[]) {
  const visible = projects.filter((p) => !p.inDevelopment)
  if (!visible.length) return

  addSectionTitle(layout, content.projects.title)

  for (const project of visible) {
    ensureSpace(layout, 22)
    layout.doc.setFont('helvetica', 'bold')
    layout.doc.setFontSize(10.5)
    layout.doc.setTextColor(COLORS.text)
    layout.doc.text(project.title, PAGE.margin, layout.y)

    layout.doc.setFont('helvetica', 'normal')
    layout.doc.setFontSize(9)
    layout.doc.setTextColor(COLORS.muted)
    const stack = project.stack.join(' · ')
    layout.doc.text(stack, PAGE.margin, layout.y + 5)
    layout.y += 10

    addParagraph(layout, project.description, 9.5)

    const links: string[] = []
    if (project.demoUrl && project.demoUrl !== '#') links.push(`Demo: ${project.demoUrl}`)
    if (project.codeUrl) links.push(`Code: ${project.codeUrl}`)
    if (links.length) addParagraph(layout, links.join('  ·  '), 8.5)

    layout.y += 1
  }
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function downloadResumePdf(input: ResumeInput): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const photoSrc = resolveProfilePhoto(input.config.profilePhoto)
  const photoDataUrl = await loadImageDataUrl(photoSrc)

  const layout: Layout = { doc, y: PAGE.margin }
  buildHeader(layout, input, photoDataUrl)
  buildSummary(layout, input.content)
  buildExperience(layout, input.content)
  buildSkills(layout, input.content)
  buildProjects(layout, input.content, input.projects)

  doc.save(`${slugify(input.config.brandName) || 'resume'}-cv.pdf`)
}
