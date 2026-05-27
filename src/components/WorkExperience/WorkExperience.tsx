import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { Reveal } from '../Reveal/Reveal'
import styles from './WorkExperience.module.css'

export function WorkExperience() {
  const { content } = usePortfolioDisplay()
  const { experience } = content

  return (
    <section id="experience" className={styles.section}>
      <div className={styles.container}>
        <Reveal instant>
          <header className={styles.head}>
            <p className={styles.kicker}>{experience.kicker}</p>
            <h2 className={styles.title}>{experience.title}</h2>
            <p className={styles.sub}>{experience.sub}</p>
          </header>
        </Reveal>

        <Reveal instant>
          <ol className={styles.timeline}>
            {experience.items.map((item, index) => (
              <li key={item.id} className={styles.entry}>
                <div className={styles.rail} aria-hidden="true">
                  <span className={styles.dot} />
                  {index < experience.items.length - 1 ? <span className={styles.line} /> : null}
                </div>

                <article className={styles.card}>
                  <time className={styles.period} dateTime={item.period}>
                    {item.period}
                  </time>
                  <h3 className={styles.role}>{item.role}</h3>
                  <p className={styles.company}>
                    {item.company}
                    {item.location ? <span className={styles.location}> · {item.location}</span> : null}
                  </p>
                  <p className={styles.description}>{item.description}</p>
                  {item.highlights.length > 0 ? (
                    <ul className={styles.highlights}>
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
