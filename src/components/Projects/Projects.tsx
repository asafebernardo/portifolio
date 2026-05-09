import { useMemo, useState } from 'react'
import type { FilterId, ProjectEntry, SiteContent } from '../../site/types'
import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { Reveal } from '../Reveal/Reveal'
import styles from './Projects.module.css'

const FILTER_ORDER: FilterId[] = ['all', 'frontend', 'backend', 'fullstack']

export type ProjectsProps = {
  /** Pré-visualização do wizard: mostra só o cartão deste índice (sem filtros nem destaque em layout separado). */
  previewProjectIndex?: number
}

export function Projects({ previewProjectIndex }: ProjectsProps = {}) {
  const { content, projects } = usePortfolioDisplay()
  const { projects: p } = content
  const [active, setActive] = useState<FilterId>('all')

  const filtered = useMemo(() => {
    if (active === 'all') return projects
    return projects.filter((x) => x.category === active)
  }, [active, projects])

  const previewProj =
    previewProjectIndex !== undefined && projects.length > 0
      ? projects[Math.min(Math.max(0, previewProjectIndex), projects.length - 1)]
      : undefined

  if (previewProjectIndex !== undefined) {
    return (
      <section id="projetos" className={styles.section}>
        <div className={styles.container}>
          <Reveal>
            <header className={styles.head}>
              <p className={styles.kicker}>{p.kicker}</p>
              <h2 className={styles.title}>{p.title}</h2>
              <p className={styles.sub}>{p.sub}</p>
            </header>
          </Reveal>

          {previewProj ? (
            <div className={`${styles.grid} ${styles.gridPreviewOne}`}>
              <Reveal key={previewProj.id}>
                <article className={styles.card}>
                  <div className={styles.cardPad}>
                    <span className={`${styles.cat} ${styles.catInline}`}>
                      {p.categories[previewProj.category]}
                    </span>
                    <CardBody proj={previewProj} p={p} />
                  </div>
                </article>
              </Reveal>
            </div>
          ) : (
            <p className={styles.empty}>{p.empty}</p>
          )}
        </div>
      </section>
    )
  }

  const featured = filtered.find((x) => x.featured)
  const rest = filtered.filter((x) => !x.featured || active !== 'all')

  return (
    <section id="projetos" className={styles.section}>
      <div className={styles.container}>
        <Reveal>
          <header className={styles.head}>
            <p className={styles.kicker}>{p.kicker}</p>
            <h2 className={styles.title}>{p.title}</h2>
            <p className={styles.sub}>{p.sub}</p>
          </header>
        </Reveal>

        <Reveal>
          <div className={styles.filters} role="tablist" aria-label={p.filterAria}>
            {FILTER_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active === key}
                className={`${styles.filter} ${active === key ? styles.filterActive : ''}`}
                onClick={() => setActive(key)}
              >
                {p.filters[key]}
              </button>
            ))}
          </div>
        </Reveal>

        {featured && active === 'all' ? (
          <Reveal>
            <article className={`${styles.featured} ${styles.featuredNoImage}`}>
              <div className={styles.featuredBody}>
                <span className={styles.case}>{p.featuredCase}</span>
                <FeaturedBody proj={featured} p={p} />
              </div>
            </article>
          </Reveal>
        ) : null}

        <div className={styles.grid}>
          {rest.map((proj) => (
            <Reveal key={proj.id}>
              <article className={styles.card}>
                <div className={styles.cardPad}>
                  <span className={`${styles.cat} ${styles.catInline}`}>{p.categories[proj.category]}</span>
                  <CardBody proj={proj} p={p} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 ? <p className={styles.empty}>{p.empty}</p> : null}
      </div>
    </section>
  )
}

function FeaturedBody({ proj, p }: { proj: ProjectEntry; p: SiteContent['projects'] }) {
  return (
    <>
      <h3 className={styles.cardTitle}>{proj.title}</h3>
      <ul className={styles.stack}>
        {proj.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p className={styles.cardDesc}>{proj.description}</p>
      <div className={styles.challenges}>
        <span className={styles.chLabel}>{p.challenges}</span>
        <p>{proj.challenges}</p>
      </div>
      <div className={styles.links}>
        <a href={proj.demoUrl} className={styles.demo}>
          {p.demo}
        </a>
        <a href={proj.codeUrl} className={styles.code} target="_blank" rel="noreferrer noopener">
          {p.code}
        </a>
      </div>
    </>
  )
}

function CardBody({ proj, p }: { proj: ProjectEntry; p: SiteContent['projects'] }) {
  return (
    <>
      <h3 className={styles.cardTitleSm}>{proj.title}</h3>
      <ul className={styles.stackSm}>
        {proj.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p className={styles.cardDescSm}>{proj.description}</p>
      <div className={styles.challengesSm}>
        <span className={styles.chLabel}>{p.challengesShort}</span>
        <p>{proj.challenges}</p>
      </div>
      <div className={styles.linksSm}>
        <a href={proj.demoUrl} className={styles.demo}>
          {p.demo}
        </a>
        <a href={proj.codeUrl} className={styles.code} target="_blank" rel="noreferrer noopener">
          {p.code}
        </a>
      </div>
    </>
  )
}
