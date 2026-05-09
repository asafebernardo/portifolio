import { useMemo, useState } from 'react'
import type { FilterId } from '../../site/types'
import { useSite } from '../../i18n/SiteProvider'
import { Reveal } from '../Reveal/Reveal'
import styles from './Projects.module.css'

const FILTER_ORDER: FilterId[] = ['all', 'frontend', 'backend', 'fullstack']

export function Projects() {
  const { content, projects } = useSite()
  const { projects: p } = content
  const [active, setActive] = useState<FilterId>('all')

  const filtered = useMemo(() => {
    if (active === 'all') return projects
    return projects.filter((x) => x.category === active)
  }, [active, projects])

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
            <article className={styles.featured}>
              <div className={styles.featuredImgWrap}>
                <img src={featured.image} alt="" className={styles.img} loading="lazy" decoding="async" />
                <div className={styles.featuredGlow} aria-hidden="true" />
              </div>
              <div className={styles.featuredBody}>
                <span className={styles.case}>{p.featuredCase}</span>
                <h3 className={styles.cardTitle}>{featured.title}</h3>
                <ul className={styles.stack}>
                  {featured.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className={styles.cardDesc}>{featured.description}</p>
                <div className={styles.challenges}>
                  <span className={styles.chLabel}>{p.challenges}</span>
                  <p>{featured.challenges}</p>
                </div>
                <div className={styles.links}>
                  <a href={featured.demoUrl} className={styles.demo}>
                    {p.demo}
                  </a>
                  <a href={featured.codeUrl} className={styles.code} target="_blank" rel="noreferrer noopener">
                    {p.code}
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        ) : null}

        <div className={styles.grid}>
          {rest.map((proj) => (
            <Reveal key={proj.id}>
              <article className={styles.card}>
                <div className={styles.cardImg}>
                  <img src={proj.image} alt="" loading="lazy" decoding="async" />
                  <span className={styles.cat}>{p.categories[proj.category]}</span>
                </div>
                <div className={styles.cardPad}>
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
