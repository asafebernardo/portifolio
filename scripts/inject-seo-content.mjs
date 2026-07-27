import { readFile, writeFile, copyFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distIndex = join(root, 'dist', 'index.html')

const SITE_ORIGIN = (process.env.SITE_URL ?? 'https://asafebernardo.github.io').replace(/\/$/, '')
const BASE = process.env.GITHUB_PAGES === 'true' ? '/portifolio/' : '/'

function publicUrl(path) {
  const normalized = path.startsWith('/') ? path.slice(1) : path
  if (BASE === '/') return `/${normalized}`
  return `${BASE}${normalized}`.replace(/\/+/g, '/')
}

function absoluteUrl(path = '/') {
  return `${SITE_ORIGIN}${publicUrl(path)}`
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function getSkillTerms(catalog) {
  const terms = new Set()
  for (const item of catalog.items) {
    terms.add(item.name)
    for (const alias of item.aliases) terms.add(alias)
  }
  return [...terms]
}

function getSkillsByCategory(catalog) {
  const grouped = {}
  for (const category of catalog.categoryOrder) {
    grouped[category] = catalog.items.filter((item) => item.category === category)
  }
  return grouped
}

function buildSkillsDetailed(catalog) {
  return catalog.items.map((item) => ({
    '@type': 'DefinedTerm',
    name: item.name,
    alternateName: item.aliases,
    termCode: item.id,
    inDefinedTermSet: catalog.categoryLabels[item.category],
    description: `${catalog.levelLabels[item.level]} — ${item.evidence.join('; ')}`,
  }))
}

function buildStructuredResume(content, config, projects, resumeBase, catalog) {
  const skillNames = catalog.items.map((item) => item.name)
  const skillTerms = getSkillTerms(catalog)

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.brandName,
    jobTitle: content.about.title,
    description: content.about.lead.replace(/\n+/g, ' '),
    url: config.portfolioUrl || absoluteUrl('/'),
    email: config.links.emailDisplay,
    telephone: config.links.whatsappDisplay,
    address: config.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: config.address,
          addressLocality: 'Chapecó',
          addressRegion: 'SC',
          addressCountry: 'BR',
        }
      : undefined,
    sameAs: [config.links.linkedin, config.links.github, config.portfolioUrl].filter(Boolean),
    knowsAbout: skillTerms,
    skillsDetailed: buildSkillsDetailed(catalog),
    knowsLanguage: content.education.languages.map((l) => ({
      '@type': 'Language',
      name: l.name,
      proficiencyLevel: l.level,
    })),
    hasCredential: content.education.certifications.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.name,
    })),
    alumniOf: content.education.items.map((e) => ({
      '@type': 'EducationalOrganization',
      name: e.institution,
    })),
    worksFor: content.experience.items[0]
      ? { '@type': 'Organization', name: content.experience.items[0].company }
      : undefined,
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Backend Developer',
      skills: skillNames.join(', '),
    },
    workExample: projects.map((p) => ({
      '@type': 'CreativeWork',
      name: p.title,
      description: p.description,
      keywords: p.stack.join(', '),
      url: p.demoUrl || p.codeUrl,
      codeRepository: p.codeUrl,
    })),
    subjectOf: {
      '@type': 'DigitalDocument',
      name: `${config.brandName} — Currículo PDF`,
      encodingFormat: 'application/pdf',
      url: absoluteUrl(resumeBase.pdfUrl || '/asafe-bernardo-cv.pdf'),
    },
  }
}

function buildSkillsSeoHtml(catalog) {
  const grouped = getSkillsByCategory(catalog)

  return catalog.categoryOrder
    .filter((category) => grouped[category]?.length)
    .map((category) => {
      const label = catalog.categoryLabels[category]
      const itemsHtml = grouped[category]
        .map((item) => {
          const aliases = item.aliases.length ? ` (${item.aliases.join(', ')})` : ''
          const evidence = item.evidence.map((e) => `<li>${escapeHtml(e)}</li>`).join('')
          return `<li data-skill-id="${escapeHtml(item.id)}" data-skill-category="${escapeHtml(item.category)}" data-skill-level="${escapeHtml(item.level)}">
        <strong>${escapeHtml(item.name)}</strong>${escapeHtml(aliases)} — ${escapeHtml(catalog.levelLabels[item.level])}
        <ul>${evidence}</ul>
      </li>`
        })
        .join('')

      return `<section data-skill-group="${escapeHtml(category)}">
      <h3>${escapeHtml(label)}</h3>
      <ul>${itemsHtml}</ul>
    </section>`
    })
    .join('')
}

function buildSeoArticle(content, config, projects, catalog) {
  const experienceHtml = content.experience.items
    .map(
      (item) => `
    <article${item.featured ? ' data-featured="true"' : ''}>
      <h3>${escapeHtml(item.role)} — ${escapeHtml(item.company)}</h3>
      <p><time datetime="${escapeHtml(item.startDate)}${item.endDate ? `/${item.endDate}` : '/'}">${escapeHtml(item.period)}</time>${item.location ? ` · ${escapeHtml(item.location)}` : ''}</p>
      ${item.relevance ? `<p><em>${escapeHtml(item.relevance)}</em></p>` : ''}
      <p>${escapeHtml(item.description)}</p>
      ${item.skills?.length ? `<p>Skills: ${escapeHtml(item.skills.join(', '))}</p><ul>${item.skills.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>` : ''}
      <ul>${item.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>
    </article>`,
    )
    .join('')

  const educationHtml = content.education.items
    .map(
      (item) => `
    <article>
      <h3>${escapeHtml(item.degree)}</h3>
      <p>${escapeHtml(item.institution)} · <time>${escapeHtml(item.period)}</time></p>
      ${item.details ? `<p>${escapeHtml(item.details)}</p>` : ''}
    </article>`,
    )
    .join('')

  const languagesHtml = content.education.languages
    .map((l) => `<li>${escapeHtml(l.name)} — ${escapeHtml(l.level)}</li>`)
    .join('')

  const certsHtml = content.education.certifications
    .map((c) => `<li>${escapeHtml(c.name)}</li>`)
    .join('')

  const coursesHtml = content.education.courses
    .map(
      (c) =>
        `<li><strong>${escapeHtml(c.name)}</strong> — ${escapeHtml(c.institution)}${c.period ? ` · ${escapeHtml(c.period)}` : ''} · ${escapeHtml(c.status)}</li>`,
    )
    .join('')

  const projectsHtml = projects
    .map(
      (p) => `
    <article>
      <h3>${escapeHtml(p.title)}</h3>
      <p>Stack: ${escapeHtml(p.stack.join(', '))}</p>
      <ul>${p.stack.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
      <p>${escapeHtml(p.description)}</p>
      ${p.impact ? `<p><strong>Resultado:</strong> ${escapeHtml(p.impact)}</p>` : ''}
      ${p.role ? `<p><strong>Papel:</strong> ${escapeHtml(p.role)}</p>` : ''}
      ${
        p.technicalHighlights?.length
          ? `<h4>Detalhes técnicos</h4><ul>${p.technicalHighlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>`
          : ''
      }
      ${p.challenges ? `<p>${escapeHtml(p.challenges)}</p>` : ''}
      ${p.codeUrl ? `<p><a href="${escapeHtml(p.codeUrl)}">GitHub</a></p>` : ''}
      ${p.postmanUrl ? `<p><a href="${escapeHtml(p.postmanUrl)}">Postman / API</a></p>` : ''}
      ${p.demoUrl ? `<p><a href="${escapeHtml(p.demoUrl)}">Demo</a></p>` : ''}
    </article>`,
    )
    .join('')

  const skillsHtml = buildSkillsSeoHtml(catalog)
  const flatSkillList = catalog.items.map((item) => `<li>${escapeHtml(item.name)}</li>`).join('')

  const contactBlock = [
    config.links.emailDisplay,
    config.links.whatsappDisplay,
    config.links.linkedinDisplay,
    config.links.githubDisplay,
    config.portfolioUrl,
    config.location,
    config.address,
  ]
    .filter(Boolean)
    .join(' · ')

  return `
<article id="seo-resume" class="seo-only" aria-label="Currículo completo em texto">
  <header>
    <h1>${escapeHtml(config.brandName)}</h1>
    <p>${escapeHtml(content.about.title)}</p>
    <p>${escapeHtml(content.meta.description)}</p>
    <p>${escapeHtml(contactBlock)}</p>
  </header>
  <section id="seo-about">
    <h2>${escapeHtml(content.about.kicker)}</h2>
    <p><strong>${escapeHtml(content.about.availabilityStatus)}</strong> · ${escapeHtml(content.about.availabilityModes)}</p>
    <p>${escapeHtml(content.about.availabilityNote)}</p>
    <p>${escapeHtml(content.about.lead.replace(/\n/g, ' '))}</p>
    <p>${escapeHtml(content.about.para)}</p>
  </section>
  <section id="seo-experience">
    <h2>${escapeHtml(content.experience.title)}</h2>
    ${experienceHtml}
  </section>
  <section id="seo-education">
    <h2>${escapeHtml(content.education.title)}</h2>
    ${educationHtml}
    <h3>${escapeHtml(content.education.languagesTitle)}</h3>
    <ul>${languagesHtml}</ul>
    ${coursesHtml ? `<h3>${escapeHtml(content.education.coursesTitle)}</h3><ul>${coursesHtml}</ul>` : ''}
    <h3>${escapeHtml(content.education.certificationsTitle)}</h3>
    <ul>${certsHtml}</ul>
  </section>
  <section id="seo-projects">
    <h2>${escapeHtml(content.projects.title)}</h2>
    ${projectsHtml}
  </section>
  <section id="seo-skills">
    <h2>${escapeHtml(content.skills.title)}</h2>
    <p>${escapeHtml(content.skills.sub)}</p>
    <h3>Lista canônica</h3>
    <ul>${flatSkillList}</ul>
    ${skillsHtml}
  </section>
</article>`
}

function buildSitemap() {
  const base = absoluteUrl('/').replace(/\/$/, '')
  const paths = ['', '#projects', '#skills', '#experience', '#education']
  const urls = paths
    .map(
      (p) => `  <url>
    <loc>${base}${p ? p : '/'}</loc>
    <changefreq>monthly</changefreq>
    <priority>${p ? '0.8' : '1.0'}</priority>
  </url>`,
    )
    .join('\n')

  const extra = `
  <url>
    <loc>${absoluteUrl('/resume.json')}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${absoluteUrl('/asafe-bernardo-cv.pdf')}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}${extra}
</urlset>
`
}

function buildRobots() {
  const sitemap = absoluteUrl('/sitemap.xml')
  return `User-agent: *
Allow: /

Sitemap: ${sitemap}
`
}

async function main() {
  const content = JSON.parse(await readFile(join(root, 'src/site/content.en.json'), 'utf8'))
  const projects = JSON.parse(await readFile(join(root, 'src/site/projects.en.json'), 'utf8'))
  const config = JSON.parse(await readFile(join(root, 'src/site/config.json'), 'utf8'))
  const resumeBase = JSON.parse(await readFile(join(root, 'src/site/resume.json'), 'utf8'))
  const catalog = JSON.parse(await readFile(join(root, 'src/site/skillsCatalog.json'), 'utf8'))

  const structuredResume = buildStructuredResume(content, config, projects, resumeBase, catalog)
  const skillsByCategory = getSkillsByCategory(catalog)

  const resumeJson = {
    ...resumeBase,
    generatedAt: new Date().toISOString(),
    source: 'portfolio',
    skills: catalog.items.map((item) => item.name),
    skillsDetailed: catalog.items,
    skillsByCategory: Object.fromEntries(
      catalog.categoryOrder
        .filter((category) => skillsByCategory[category]?.length)
        .map((category) => [category, skillsByCategory[category]]),
    ),
    skillTerms: getSkillTerms(catalog),
    person: structuredResume,
  }

  delete resumeJson.skillsCatalog

  let html = await readFile(distIndex, 'utf8')

  const seoBlock = buildSeoArticle(content, config, projects, catalog)
  const jsonLd = JSON.stringify(structuredResume)
  const resumeUrl = publicUrl('/resume.json')
  const pdfUrl = publicUrl('/asafe-bernardo-cv.pdf')

  const seoStyles = `<style>
.seo-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
</style>`

  const headExtras = [
    seoStyles,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n')

  const alternateLinks = [
    `<link rel="alternate" type="application/json" href="${escapeHtml(resumeUrl)}" title="Currículo estruturado (JSON)" />`,
    `<link rel="alternate" type="application/pdf" href="${escapeHtml(pdfUrl)}" title="Currículo PDF" />`,
  ]
    .filter((link) => !html.includes(link.split(' href="')[1]?.split('"')[0] ?? ''))
    .join('\n')

  const headBlock = alternateLinks ? `${alternateLinks}\n${headExtras}` : headExtras

  if (!html.includes('id="seo-resume"')) {
    html = html.replace('</head>', `${headBlock}\n</head>`)
    html = html.replace('</body>', `${seoBlock}\n</body>`)
  }

  if (!html.includes('property="og:image"')) {
    html = html.replace(
      '<meta property="og:type"',
      `<meta property="og:image" content="${escapeHtml(absoluteUrl('/og-preview.svg'))}" />\n    <meta property="og:type"`,
    )
  }

  await writeFile(distIndex, html, 'utf8')
  await writeFile(join(root, 'dist', 'resume.json'), JSON.stringify(resumeJson, null, 2), 'utf8')
  await writeFile(join(root, 'public', 'resume.json'), JSON.stringify(resumeJson, null, 2), 'utf8')
  await writeFile(join(root, 'dist', 'skillsCatalog.json'), JSON.stringify(catalog, null, 2), 'utf8')
  await writeFile(join(root, 'public', 'skillsCatalog.json'), JSON.stringify(catalog, null, 2), 'utf8')
  await writeFile(join(root, 'dist', 'sitemap.xml'), buildSitemap(), 'utf8')
  await writeFile(join(root, 'dist', 'robots.txt'), buildRobots(), 'utf8')

  try {
    await copyFile(join(root, 'public', 'asafe-bernardo-cv.pdf'), join(root, 'dist', 'asafe-bernardo-cv.pdf'))
  } catch {
    console.warn('Warning: run generate-resume-pdf.mjs if asafe-bernardo-cv.pdf is missing')
  }

  console.log('SEO content injected into dist/index.html')
  console.log('Generated dist/resume.json, skillsCatalog.json, dist/sitemap.xml and dist/robots.txt')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
