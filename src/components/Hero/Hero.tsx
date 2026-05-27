import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { resolveContactLinksFromContent } from '../../site/contactLinks'
import { PortfolioSectionLink } from '../PortfolioSectionLink/PortfolioSectionLink'
import { Reveal } from '../Reveal/Reveal'
import styles from './Hero.module.css'

type HeroProps = {
  /** Editor wizard: oculta GitHub/LinkedIn na pré-visualização do passo de texto */
  hideGhostLinks?: boolean
}

export function Hero({ hideGhostLinks = false }: HeroProps) {
  const { config, content } = usePortfolioDisplay()
  const { hero } = content
  const displayName = hero.title.trim() || config.brandName
  const contactLinks = resolveContactLinksFromContent(content, config)

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
            <PortfolioSectionLink navKey="projects" className={styles.primary}>
              {hero.ctaProjects}
            </PortfolioSectionLink>
            {!hideGhostLinks ? (
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
      </div>
    </section>
  )
}
