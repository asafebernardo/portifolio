import type { ProjectEntry, SiteContent } from '../../site/types'
import { getProjectImages } from '../../site/projectImages'
import { isDemoAvailable, isProjectInDevelopment } from '../../lib/projectDemo'
import { resolvePublicUrl } from '../../lib/publicUrl'
import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { Reveal } from '../Reveal/Reveal'
import { ProjectCardMedia } from './ProjectCardMedia'
import { ProjectGalaxyPlaceholder } from './ProjectGalaxyPlaceholder'
import { StackTag } from './StackTag'
import styles from './Projects.module.css'

export type ProjectsProps = {
  /** Wizard preview: show only the card at this index. */
  previewProjectIndex?: number
}

export function Projects({ previewProjectIndex }: ProjectsProps = {}) {
  const { content, projects } = usePortfolioDisplay()
  const { projects: p } = content

  const previewProj =
    previewProjectIndex !== undefined && projects.length > 0
      ? projects[Math.min(Math.max(0, previewProjectIndex), projects.length - 1)]
      : undefined

  if (previewProjectIndex !== undefined) {
    return (
      <section id="projects" className={styles.section}>
        <div className={styles.container}>
          <Reveal instant>
            <header className={styles.head}>
              <p className={styles.kicker}>{p.kicker}</p>
              <h2 className={styles.title}>{p.title}</h2>
              <p className={styles.sub}>{p.sub}</p>
            </header>
          </Reveal>

          {previewProj ? (
            <div className={`${styles.grid} ${styles.gridPreviewOne}`}>
              <Reveal key={previewProj.id}>
                <ProjectCard proj={previewProj} p={p} />
              </Reveal>
            </div>
          ) : (
            <p className={styles.empty}>{p.empty}</p>
          )}
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <Reveal instant>
          <header className={styles.head}>
            <p className={styles.kicker}>{p.kicker}</p>
            <h2 className={styles.title}>{p.title}</h2>
            <p className={styles.sub}>{p.sub}</p>
          </header>
        </Reveal>

        <div className={styles.grid}>
          {projects.map((proj) => (
            <Reveal key={proj.id}>
              <ProjectCard proj={proj} p={p} />
            </Reveal>
          ))}
        </div>

        {projects.length === 0 ? <p className={styles.empty}>{p.empty}</p> : null}
      </div>
    </section>
  )
}

function ProjectCard({ proj, p }: { proj: ProjectEntry; p: SiteContent['projects'] }) {
  const images = getProjectImages(proj)
  const hasImages = images.length > 0
  const inDevelopment = isProjectInDevelopment(proj)
  const showGalaxyPlaceholder = !hasImages
  const showDevOverlay = inDevelopment && hasImages
  const coverMedia = proj.id === 'icer' || proj.id === 'lumio'

  return (
    <article
      className={`${styles.card} ${showDevOverlay ? styles.cardInDevelopment : ''}`}
      aria-label={inDevelopment ? `${proj.title} — ${p.inDevelopment}` : proj.title}
      tabIndex={showDevOverlay ? 0 : undefined}
    >
      <div className={`${styles.cardBodyWrap} ${showDevOverlay ? styles.cardBodyWrapBlurred : ''}`}>
        {hasImages ? (
          <div className={`${styles.cardImg} ${coverMedia ? styles.cardImgCover : ''}`}>
            <ProjectCardMedia
              images={images}
              alt={proj.title}
              viewImageAria={p.viewImageAria.replace('{title}', proj.title)}
              imageModal={p.imageModal}
            />
            <span className={styles.cat} data-category={proj.category}>
              {p.categories[proj.category]}
            </span>
          </div>
        ) : showGalaxyPlaceholder ? (
          <div className={`${styles.cardImg} ${styles.cardImgGalaxy}`}>
            <ProjectGalaxyPlaceholder label={p.inDevelopment} />
            <span className={styles.cat} data-category={proj.category}>
              {p.categories[proj.category]}
            </span>
          </div>
        ) : null}
        <div className={styles.cardPad}>
          {!hasImages && !showGalaxyPlaceholder ? (
            <span className={`${styles.cat} ${styles.catInline}`} data-category={proj.category}>
              {p.categories[proj.category]}
            </span>
          ) : null}
          <CardBody proj={proj} p={p} inDevelopment={inDevelopment} />
        </div>
      </div>
      {showDevOverlay ? (
        <div className={styles.devDiagonalOverlay} aria-hidden="true">
          <span className={styles.devDiagonalText}>{p.inDevelopment}</span>
        </div>
      ) : null}
    </article>
  )
}

function CardBody({
  proj,
  p,
  inDevelopment,
}: {
  proj: ProjectEntry
  p: SiteContent['projects']
  inDevelopment: boolean
}) {
  const hasDemo = isDemoAvailable(proj.demoUrl)

  return (
    <>
      <h3 className={styles.cardTitleSm}>{proj.title}</h3>
      <ul className={styles.stackSm}>
        {proj.stack.map((s) => (
          <StackTag key={s} name={s} />
        ))}
      </ul>
      <p className={styles.cardDescSm}>{proj.description}</p>
      {proj.impact?.trim() ? (
        <div className={styles.impactSm}>
          <span className={styles.chLabel}>{p.impact}</span>
          <p>{proj.impact}</p>
        </div>
      ) : null}
      {proj.role?.trim() ? (
        <p className={styles.roleSm}>
          <span className={styles.chLabel}>{p.role}: </span>
          {proj.role}
        </p>
      ) : null}
      {proj.technicalHighlights && proj.technicalHighlights.length > 0 ? (
        <div className={styles.technicalSm}>
          <span className={styles.chLabel}>{p.technical}</span>
          <ul className={styles.technicalList}>
            {proj.technicalHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className={styles.challengesSm}>
        <span className={styles.chLabel}>{p.challengesShort}</span>
        <p>{proj.challenges}</p>
      </div>
      <div className={styles.linksSm}>
        {inDevelopment && isDemoAvailable(proj.demoUrl) ? null : (
          <>
            {!inDevelopment && hasDemo ? (
              proj.demoBlocked ? (
                <span
                  className={`${styles.demo} ${styles.demoBlocked}`}
                  role="status"
                  aria-disabled="true"
                  title="Beta — coming soon"
                >
                  {proj.demoLabel?.trim() || p.demo}
                </span>
              ) : (
                <a
                  href={resolvePublicUrl(proj.demoUrl.trim())}
                  className={styles.demo}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {proj.demoLabel?.trim() || p.demo}
                </a>
              )
            ) : null}
            <a href={proj.codeUrl} className={styles.code} target="_blank" rel="noreferrer noopener">
              {p.code}
            </a>
            {proj.postmanUrl?.trim() ? (
              <a
                href={proj.postmanUrl.trim()}
                className={styles.postman}
                target="_blank"
                rel="noreferrer noopener"
              >
                {p.postman}
              </a>
            ) : null}
          </>
        )}
      </div>
    </>
  )
}
