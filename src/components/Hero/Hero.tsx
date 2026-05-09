import { Link } from 'react-router-dom'
import { portfolioPaths } from '../../site/portfolioPaths'
import { useSite } from '../../i18n/SiteProvider'
import { Reveal } from '../Reveal/Reveal'
import styles from './Hero.module.css'

export function Hero() {
  const { config, content } = useSite()
  const { hero } = content
  const displayName = hero.title.trim() || config.brandName

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.bg}>
        <div className={styles.orb} />
        <div className={styles.grid} aria-hidden="true" />
      </div>

      <div className={styles.inner}>
        <Reveal className={styles.copy}>
          <p className={styles.kicker}>{hero.kicker}</p>
          <h1 className={styles.name}>{displayName}</h1>
          <p className={styles.title}>{hero.role}</p>
          <p className={styles.desc}>{hero.description}</p>
          <div className={styles.actions}>
            <Link to={portfolioPaths.projects} className={styles.primary}>
              {hero.ctaProjects}
            </Link>
            <a
              href={config.links.github}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.ghost}
            >
              {hero.github}
            </a>
            <a
              href={config.links.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.ghost}
            >
              {hero.linkedin}
            </a>
          </div>
        </Reveal>

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
      </div>
    </section>
  )
}
