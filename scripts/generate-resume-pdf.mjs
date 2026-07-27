import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { jsPDF } from 'jspdf'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const MARGIN = 16
const PAGE_W = 210
const CONTENT_W = PAGE_W - MARGIN * 2
const ACCENT = [45, 212, 191]
const INK = [15, 23, 42]
const MUTED = [71, 85, 105]
const LINE = 4.8

function ensureSpace(state, needed) {
  const pageH = state.doc.internal.pageSize.getHeight()
  if (state.y + needed > pageH - MARGIN) {
    state.doc.addPage()
    state.y = MARGIN
  }
}

function wrapText(doc, text, x, y, maxW, lineH) {
  const lines = doc.splitTextToSize(text, maxW)
  doc.text(lines, x, y)
  return y + lines.length * lineH
}

function sectionTitle(state, label) {
  ensureSpace(state, 14)
  state.doc.setFont('helvetica', 'bold')
  state.doc.setFontSize(11)
  state.doc.setTextColor(...ACCENT)
  state.y = wrapText(state.doc, label.toUpperCase(), MARGIN, state.y, CONTENT_W, LINE)
  state.doc.setDrawColor(...ACCENT)
  state.doc.setLineWidth(0.4)
  state.doc.line(MARGIN, state.y + 1, PAGE_W - MARGIN, state.y + 1)
  state.y += 6
}

function bodyText(state, text, opts = {}) {
  state.doc.setFont('helvetica', opts.bold ? 'bold' : 'normal')
  state.doc.setFontSize(opts.size ?? 9.5)
  state.doc.setTextColor(...(opts.color ?? INK))
  ensureSpace(state, LINE * 2)
  state.y = wrapText(state.doc, text, MARGIN, state.y, CONTENT_W, LINE)
  state.y += 1.5
}

function bulletList(state, items) {
  state.doc.setFont('helvetica', 'normal')
  state.doc.setFontSize(9)
  state.doc.setTextColor(...INK)
  for (const item of items) {
    const lines = state.doc.splitTextToSize(`\u2022 ${item}`, CONTENT_W - 4)
    ensureSpace(state, lines.length * LINE + 1)
    state.y = wrapText(state.doc, lines.join('\n'), MARGIN + 2, state.y, CONTENT_W - 4, LINE)
    state.y += 0.8
  }
  state.y += 1
}

function skillGroups(catalog) {
  const byCategory = new Map()
  for (const item of catalog.items) {
    const list = byCategory.get(item.category) ?? []
    list.push(item.name)
    byCategory.set(item.category, list)
  }
  return catalog.categoryOrder
    .filter((category) => byCategory.has(category))
    .map((category) => ({
      title: catalog.categoryLabels[category],
      items: byCategory.get(category),
    }))
}

function buildPdf(config, content, projects, catalog) {
  const { about, experience, education } = content
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const state = { doc, y: MARGIN }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...INK)
  doc.text(config.brandName, MARGIN, state.y)
  state.y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(...ACCENT)
  state.y = wrapText(doc, about.title, MARGIN, state.y, CONTENT_W, 5.5)
  state.y += 2

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
  state.y = wrapText(doc, contact, MARGIN, state.y, CONTENT_W, 4.2)
  state.y += 3

  bodyText(state, `${about.availabilityStatus} — ${about.availabilityModes}`, { size: 8.5, color: MUTED })
  bodyText(state, about.availabilityNote, { size: 8.5 })

  sectionTitle(state, 'Resumo')
  bodyText(state, about.lead.replace(/\n+/g, ' '))
  bodyText(state, about.para)

  sectionTitle(state, content.skills.title)
  for (const group of skillGroups(catalog)) {
    bodyText(state, `${group.title}: ${group.items.join(', ')}`, { size: 9 })
  }

  sectionTitle(state, experience.title)
  bodyText(state, experience.sub, { size: 8.5, color: MUTED })

  for (const item of experience.items) {
    ensureSpace(state, 20)
    bodyText(state, `${item.role} — ${item.company}`, { bold: true, size: 10 })
    bodyText(state, item.period, { size: 8.5, color: ACCENT })
    if (item.relevance) bodyText(state, item.relevance, { size: 8.5, color: MUTED })
    if (item.skills?.length) bodyText(state, item.skills.join(' · '), { size: 8.5, color: MUTED })
    bodyText(state, item.description, { size: 9 })
    bulletList(state, item.highlights)
    state.y += 1
  }

  sectionTitle(state, content.projects.title)
  for (const proj of projects) {
    ensureSpace(state, 18)
    bodyText(state, proj.title, { bold: true, size: 10 })
    bodyText(state, proj.stack.join(' · '), { size: 8.5, color: ACCENT })
    bodyText(state, proj.description, { size: 9 })
    if (proj.impact?.trim()) bodyText(state, `Resultado: ${proj.impact}`, { size: 8.5 })
    if (proj.role?.trim()) bodyText(state, `Papel: ${proj.role}`, { size: 8.5, color: MUTED })
    if (proj.technicalHighlights?.length) bulletList(state, proj.technicalHighlights)
    const links = [proj.demoUrl?.trim() && `Demo: ${proj.demoUrl}`, proj.codeUrl && `GitHub: ${proj.codeUrl}`].filter(Boolean)
    if (links.length) bodyText(state, links.join('  ·  '), { size: 8, color: MUTED })
    state.y += 1
  }

  sectionTitle(state, education.title)
  for (const item of education.items) {
    bodyText(state, `${item.degree} — ${item.institution}`, { bold: true, size: 9.5 })
    bodyText(state, item.period, { size: 8.5, color: MUTED })
    if (item.details) bodyText(state, item.details, { size: 8.5, color: MUTED })
  }

  if (education.courses?.length) {
    state.y += 1
    bodyText(state, education.coursesTitle, { bold: true, size: 9.5 })
    for (const course of education.courses) {
      bodyText(
        state,
        `${course.name} — ${course.institution}${course.period ? ` (${course.period})` : ''} · ${course.status}`,
        { size: 9 },
      )
    }
  }

  if (education.certifications?.length) {
    state.y += 1
    bodyText(state, education.certificationsTitle, { bold: true, size: 9.5 })
    bulletList(
      state,
      education.certifications.map((c) => c.name),
    )
  }

  if (education.languages?.length) {
    bodyText(state, education.languagesTitle, { bold: true, size: 9.5 })
    bodyText(state, education.languages.map((l) => `${l.name} (${l.level})`).join(' · '), { size: 9 })
  }

  return doc
}

async function main() {
  const config = JSON.parse(await readFile(join(root, 'src/site/config.json'), 'utf8'))
  const content = JSON.parse(await readFile(join(root, 'src/site/content.en.json'), 'utf8'))
  const projects = JSON.parse(await readFile(join(root, 'src/site/projects.en.json'), 'utf8'))
  const catalog = JSON.parse(await readFile(join(root, 'src/site/skillsCatalog.json'), 'utf8'))

  const pdf = buildPdf(config, content, projects, catalog)
  const buffer = Buffer.from(pdf.output('arraybuffer'))

  await writeFile(join(root, 'public', 'asafe-bernardo-cv.pdf'), buffer)
  await writeFile(join(root, 'dist', 'asafe-bernardo-cv.pdf'), buffer)

  console.log('Generated public/asafe-bernardo-cv.pdf and dist/asafe-bernardo-cv.pdf')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
