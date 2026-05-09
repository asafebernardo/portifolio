import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { resolveContactLinksFromContent } from '../../site/contactLinks'
import { PortfolioSectionLink } from '../PortfolioSectionLink/PortfolioSectionLink'
import { PORTFOLIO_SECTION_IDS } from '../../site/portfolioPaths'
import { Reveal } from '../Reveal/Reveal'
import styles from './Hero.module.css'

/** Alinha-se aos passos intro | rest do wizard */
export type HeroPreviewScope = 'intro' | 'rest'

type HeroProps = {
  /** Wizard: mostrar só a zona editada neste passo */
  previewScope?: HeroPreviewScope
}

export function Hero({ previewScope }: HeroProps) {
  const { config, content } = usePortfolioDisplay()
  const { hero } = content
  const displayName = hero.title.trim() || config.brandName
  const contactLinks = resolveContactLinksFromContent(content, config)

  const showIntro = previewScope !== 'rest'
  const showRest = previewScope !== 'intro'
  const showGhostLinks = previewScope !== 'intro'

  const innerClass =
    previewScope === 'intro'
      ? `${styles.inner} ${styles.innerPreviewIntroOnly}`
      : previewScope === 'rest'
        ? `${styles.inner} ${styles.innerPreviewRestOnly}`
        : styles.inner

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.bg}>
        <div className={styles.orb} />
        <div className={styles.grid} aria-hidden="true" />
      </div>

      <div className={innerClass}>
        {showIntro ? (
          <Reveal className={styles.copy}>
            <p className={styles.kicker}>{hero.kicker}</p>
            <h1 className={styles.name}>{displayName}</h1>
            <p className={styles.title}>{hero.role}</p>
            <p className={styles.desc}>{hero.description}</p>
            <div className={styles.actions}>
              <PortfolioSectionLink sectionId={PORTFOLIO_SECTION_IDS.projects} className={styles.primary}>
                {hero.ctaProjects}
              </PortfolioSectionLink>
              {showGhostLinks ? (
                <>
                  <a href={contactLinks.github} target="_blank" rel="noreferrer noopener" className={styles.ghost}>
                    {hero.github}
                  </a>
                  <a href={contactLinks.linkedin} target="_blank" rel="noreferrer noopener" className={styles.ghost}>
                    {hero.linkedin}
                  </a>
                </>
              ) : null}
            </div>
          </Reveal>
        ) : null}

        {showRest ? (
          <Reveal className={styles.visual}>
            <div className={styles.mock}>
            <div className={styles.mockHeader}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.mockTitle}>{hero.mockTitle}</span>
            </div>
            <div className={styles.mockBody}>
              <aside className={styles.sidebar}>
                <span className={styles.sideItem} />
                <span className={styles.sideItem} />
                <span className={styles.sideItem} />
              </aside>
              <div className={styles.chartArea}>
                <div className={styles.chartHead}>
                  <span>{hero.chartLabel}</span>
                  <span className={styles.badge}>{hero.badgeLive}</span>
                </div>
                <div className={styles.bars}>
                  {[72, 48, 88, 56, 92, 64].map((h, i) => (
                    <div key={i} className={styles.bar} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
            <div className={`${styles.float} ${styles.floatApi}`}>
              <span className={styles.floatIcon} aria-hidden="true">
                {'{ }'}
              </span>
              <span className={styles.floatLabel}>{hero.floatApi.label}</span>
              <span className={styles.floatSub}>{hero.floatApi.sub}</span>
            </div>
            <div className={`${styles.float} ${styles.floatFe}`}>
              <span className={styles.floatIcon} aria-hidden="true">
                ◇
              </span>
              <span className={styles.floatLabel}>{hero.floatFe.label}</span>
              <span className={styles.floatSub}>{hero.floatFe.sub}</span>
            </div>
            <div className={`${styles.float} ${styles.floatDb}`}>
              <span className={styles.floatIcon} aria-hidden="true">
                ◫
              </span>
              <span className={styles.floatLabel}>{hero.floatDb.label}</span>
              <span className={styles.floatSub}>{hero.floatDb.sub}</span>
            </div>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
