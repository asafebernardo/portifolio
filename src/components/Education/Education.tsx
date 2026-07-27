import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { Reveal } from '../Reveal/Reveal'
import styles from './Education.module.css'

export function Education() {
  const { content } = usePortfolioDisplay()
  const { education: ed } = content

  return (
    <section id="education" className={styles.section}>
      <div className={styles.container}>
        <Reveal instant>
          <header className={styles.head}>
            <p className={styles.kicker}>{ed.kicker}</p>
            <h2 className={styles.title}>{ed.title}</h2>
            <p className={styles.sub}>{ed.sub}</p>
          </header>
        </Reveal>

        <Reveal instant>
          <ul className={styles.list}>
            {ed.items.map((item) => (
              <li key={item.id} className={styles.item}>
                <time className={styles.period} dateTime={item.period}>
                  {item.period}
                </time>
                <h3 className={styles.degree}>{item.degree}</h3>
                <p className={styles.institution}>{item.institution}</p>
                {item.details ? <p className={styles.details}>{item.details}</p> : null}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal instant>
          <div className={styles.credentials}>
            {ed.courses.length > 0 ? (
              <div className={styles.credentialBlock}>
                <h3 className={styles.credentialTitle}>{ed.coursesTitle}</h3>
                <ul className={styles.credentialList}>
                  {ed.courses.map((course) => (
                    <li key={`${course.institution}-${course.name}`}>
                      <strong>{course.name}</strong> — {course.institution}
                      {course.period ? ` · ${course.period}` : ''}
                      <span className={styles.courseStatus}> · {course.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className={styles.credentialBlock}>
              <h3 className={styles.credentialTitle}>{ed.languagesTitle}</h3>
              <ul className={styles.credentialList}>
                {ed.languages.map((lang) => (
                  <li key={lang.name}>
                    <strong>{lang.name}</strong> — {lang.level}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.credentialBlock}>
              <h3 className={styles.credentialTitle}>{ed.certificationsTitle}</h3>
              <ul className={styles.credentialList}>
                {ed.certifications.map((cert) => (
                  <li key={cert.name}>{cert.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
