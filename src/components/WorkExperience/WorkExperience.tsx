import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { Reveal } from '../Reveal/Reveal'
import styles from './WorkExperience.module.css'

function experienceDateTime(startDate: string, endDate: string | null): string {
  if (endDate) return `${startDate}/${endDate}`
  return `${startDate}/`
}

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
                  <span className={`${styles.dot} ${item.featured ? styles.dotFeatured : ''}`} />
                  {index < experience.items.length - 1 ? <span className={styles.line} /> : null}
                </div>

                <article className={`${styles.card} ${item.featured ? styles.cardFeatured : ''}`}>
                  <time className={styles.period} dateTime={experienceDateTime(item.startDate, item.endDate)}>
                    {item.period}
                  </time>
                  <h3 className={styles.role}>{item.role}</h3>
                  <p className={styles.company}>
                    {item.company}
                    {item.location ? <span className={styles.location}> · {item.location}</span> : null}
                  </p>
                  {item.relevance ? <p className={styles.relevance}>{item.relevance}</p> : null}
                  <p className={styles.description}>{item.description}</p>
                  {item.skills.length > 0 ? (
                    <ul className={styles.skillTags} aria-label="Tecnologias e práticas">
                      {item.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  ) : null}
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
