import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { Reveal } from '../Reveal/Reveal'
import styles from './Skills.module.css'

export function Skills() {
  const { content } = usePortfolioDisplay()
  const { skills } = content

  return (
    <section id="skills" className={styles.section}>
      <div className={styles.container}>
        <Reveal>
          <header className={styles.head}>
            <p className={styles.kicker}>{skills.kicker}</p>
            <h2 className={styles.title}>{skills.title}</h2>
            <p className={styles.sub}>{skills.sub}</p>
          </header>
        </Reveal>

        <div className={styles.grid}>
          {skills.groups.map((g, gi) => (
            <Reveal key={`${gi}-${g.title}`}>
              <article className={styles.card}>
                <h3 className={styles.cardTitle}>{g.title}</h3>
                <ul className={styles.list}>
                  {g.items.map((item) => (
                    <li key={item} className={styles.item}>
                      <span className={styles.dot} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
