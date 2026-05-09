import { useSite } from '../../i18n/SiteProvider'
import { Reveal } from '../Reveal/Reveal'
import styles from './About.module.css'

export function About() {
  const { content } = useSite()
  const { about } = content

  return (
    <section id="sobre" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <Reveal>
            <div className={styles.copy}>
              <p className={styles.kicker}>{about.kicker}</p>
              <h2 className={styles.title}>{about.title}</h2>
              <p className={styles.lead}>{about.lead}</p>
              <p className={styles.para}>{about.para}</p>
            </div>
          </Reveal>

          <Reveal>
            <ol className={styles.timeline}>
              {about.timeline.map((t, i) => (
                <li key={`${t.phase}-${t.title}`} className={styles.tItem}>
                  <span className={styles.marker} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.tBody}>
                    <span className={styles.phase}>{t.phase}</span>
                    <h3 className={styles.tTitle}>{t.title}</h3>
                    <p className={styles.tText}>{t.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
