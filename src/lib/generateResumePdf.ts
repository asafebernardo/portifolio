import { jsPDF } from 'jspdf'
import { getSkillGroupsForDisplay } from '../site/skillsCatalog'
import type { ProjectEntry, SiteConfig, SiteContent } from '../site/types'

const MARGIN = 16
const PAGE_W = 210
const CONTENT_W = PAGE_W - MARGIN * 2
const ACCENT: [number, number, number] = [45, 212, 191]
const INK: [number, number, number] = [15, 23, 42]
const MUTED: [number, number, number] = [71, 85, 105]
const LINE = 4.8

export type ResumePdfInput = {
  config: SiteConfig
  content: SiteContent
  projects: ProjectEntry[]
}

type Cursor = { doc: jsPDF; y: number }

function ensureSpace(cursor: Cursor, needed: number) {
  const pageH = cursor.doc.internal.pageSize.getHeight()
  if (cursor.y + needed > pageH - MARGIN) {
    cursor.doc.addPage()
    cursor.y = MARGIN
  }
}

function wrapText(doc: jsPDF, text: string, x: number, y: number, maxW: number, lineH: number): number {
  const lines = doc.splitTextToSize(text, maxW) as string[]
  doc.text(lines, x, y)
  return y + lines.length * lineH
}

function sectionTitle(cursor: Cursor, label: string) {
  ensureSpace(cursor, 14)
  cursor.doc.setFont('helvetica', 'bold')
  cursor.doc.setFontSize(11)
  cursor.doc.setTextColor(...ACCENT)
  cursor.y = wrapText(cursor.doc, label.toUpperCase(), MARGIN, cursor.y, CONTENT_W, LINE)
  cursor.doc.setDrawColor(...ACCENT)
  cursor.doc.setLineWidth(0.4)
  cursor.doc.line(MARGIN, cursor.y + 1, PAGE_W - MARGIN, cursor.y + 1)
  cursor.y += 6
}

function bodyText(cursor: Cursor, text: string, opts?: { bold?: boolean; size?: number; color?: [number, number, number] }) {
  cursor.doc.setFont('helvetica', opts?.bold ? 'bold' : 'normal')
  cursor.doc.setFontSize(opts?.size ?? 9.5)
  cursor.doc.setTextColor(...(opts?.color ?? INK))
  ensureSpace(cursor, LINE * 2)
  cursor.y = wrapText(cursor.doc, text, MARGIN, cursor.y, CONTENT_W, LINE)
  cursor.y += 1.5
}

function bulletList(cursor: Cursor, items: string[]) {
  cursor.doc.setFont('helvetica', 'normal')
  cursor.doc.setFontSize(9)
  cursor.doc.setTextColor(...INK)
  for (const item of items) {
    const bullet = `\u2022 ${item}`
    const lines = cursor.doc.splitTextToSize(bullet, CONTENT_W - 4) as string[]
    ensureSpace(cursor, lines.length * LINE + 1)
    cursor.y = wrapText(cursor.doc, lines.join('\n'), MARGIN + 2, cursor.y, CONTENT_W - 4, LINE)
    cursor.y += 0.8
  }
  cursor.y += 1
}

export function generateResumePdf(input: ResumePdfInput): jsPDF {
  const { config, content, projects } = input
  const { about, experience, education } = content
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const cursor: Cursor = { doc, y: MARGIN }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...INK)
  doc.text(config.brandName, MARGIN, cursor.y)
  cursor.y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(...ACCENT)
  cursor.y = wrapText(doc, about.title, MARGIN, cursor.y, CONTENT_W, 5.5)
  cursor.y += 2

  const contact = [
    config.links.emailDisplay,
    config.links.whatsappDisplay,
    config.links.linkedinDisplay,
    config.links.githubDisplay,
    config.portfolioUrl,
    config.location,
  ]
    .filter(Boolean)
    .join('  ·  ')

  doc.setFontSize(8.5)
  doc.setTextColor(...MUTED)
  cursor.y = wrapText(doc, contact, MARGIN, cursor.y, CONTENT_W, 4.2)
  cursor.y += 3

  bodyText(cursor, `${about.availabilityStatus} — ${about.availabilityModes}`, { size: 8.5, color: MUTED })
  bodyText(cursor, about.availabilityNote, { size: 8.5 })

  sectionTitle(cursor, 'Resumo')
  bodyText(cursor, about.lead.replace(/\n+/g, ' '))
  bodyText(cursor, about.para)

  sectionTitle(cursor, content.skills.title)
  for (const group of getSkillGroupsForDisplay()) {
    bodyText(cursor, `${group.title}: ${group.items.join(', ')}`, { size: 9 })
  }

  sectionTitle(cursor, experience.title)
  bodyText(cursor, experience.sub, { size: 8.5, color: MUTED })

  for (const item of experience.items) {
    ensureSpace(cursor, 20)
    bodyText(cursor, `${item.role} — ${item.company}`, { bold: true, size: 10 })
    bodyText(cursor, item.period, { size: 8.5, color: ACCENT })
    if (item.relevance) bodyText(cursor, item.relevance, { size: 8.5, color: MUTED })
    if (item.skills?.length) bodyText(cursor, item.skills.join(' · '), { size: 8.5, color: MUTED })
    bodyText(cursor, item.description, { size: 9 })
    bulletList(cursor, item.highlights)
    cursor.y += 1
  }

  sectionTitle(cursor, content.projects.title)
  for (const proj of projects) {
    ensureSpace(cursor, 18)
    bodyText(cursor, proj.title, { bold: true, size: 10 })
    bodyText(cursor, proj.stack.join(' · '), { size: 8.5, color: ACCENT })
    bodyText(cursor, proj.description, { size: 9 })
    if (proj.impact?.trim()) bodyText(cursor, `Resultado: ${proj.impact}`, { size: 8.5 })
    if (proj.role?.trim()) bodyText(cursor, `Papel: ${proj.role}`, { size: 8.5, color: MUTED })
    if (proj.technicalHighlights?.length) bulletList(cursor, proj.technicalHighlights)
    const links = [proj.demoUrl?.trim() && `Demo: ${proj.demoUrl}`, proj.codeUrl && `GitHub: ${proj.codeUrl}`].filter(Boolean)
    if (links.length) bodyText(cursor, links.join('  ·  '), { size: 8, color: MUTED })
    cursor.y += 1
  }

  sectionTitle(cursor, education.title)
  for (const item of education.items) {
    bodyText(cursor, `${item.degree} — ${item.institution}`, { bold: true, size: 9.5 })
    bodyText(cursor, item.period, { size: 8.5, color: MUTED })
    if (item.details) bodyText(cursor, item.details, { size: 8.5, color: MUTED })
  }

  if (education.courses.length) {
    cursor.y += 1
    bodyText(cursor, education.coursesTitle, { bold: true, size: 9.5 })
    for (const course of education.courses) {
      bodyText(
        cursor,
        `${course.name} — ${course.institution}${course.period ? ` (${course.period})` : ''} · ${course.status}`,
        { size: 9 },
      )
    }
  }

  if (education.certifications.length) {
    cursor.y += 1
    bodyText(cursor, education.certificationsTitle, { bold: true, size: 9.5 })
    bulletList(
      cursor,
      education.certifications.map((c) => c.name),
    )
  }

  if (education.languages.length) {
    bodyText(cursor, education.languagesTitle, { bold: true, size: 9.5 })
    bodyText(
      cursor,
      education.languages.map((l) => `${l.name} (${l.level})`).join(' · '),
      { size: 9 },
    )
  }

  return doc
}

export function downloadGeneratedResumePdf(input: ResumePdfInput, filename = 'asafe-bernardo-cv.pdf'): void {
  generateResumePdf(input).save(filename)
}
