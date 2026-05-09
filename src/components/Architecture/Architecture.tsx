import { useSite } from '../../i18n/SiteProvider'
import { Reveal } from '../Reveal/Reveal'
import styles from './Architecture.module.css'

export function Architecture() {
  const { content } = useSite()
  const { architecture: a } = content

  return (
    <section id="arquitetura" className={styles.section}>
      <div className={styles.container}>
        <Reveal>
          <header className={styles.head}>
            <p className={styles.kicker}>{a.kicker}</p>
            <h2 className={styles.title}>{a.title}</h2>
            <p className={styles.sub}>{a.sub}</p>
          </header>
        </Reveal>

        <Reveal>
          <div className={styles.flow}>
            <div className={styles.pipeline}>
              <span className={styles.step}>{a.pipeline.frontend}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
              <span className={styles.step}>{a.pipeline.api}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
              <span className={styles.step}>{a.pipeline.database}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
              <span className={styles.step}>{a.pipeline.deploy}</span>
            </div>

            <div className={styles.diagram} role="list">
              {a.nodes.map((n, i) => (
                <div key={n.key} className={styles.cluster} role="listitem">
                  {i > 0 ? <span className={styles.connector} aria-hidden="true" /> : null}
                  <div className={styles.node}>
                    <span className={styles.nodeBadge}>{n.label}</span>
                    <span className={styles.nodeSub}>{n.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
