import { resolveContactLinksFromContent } from '../../site/contactLinks'
import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { PortfolioSectionLink } from '../PortfolioSectionLink/PortfolioSectionLink'
import {
  IconEmail,
  IconGitHub,
  IconLinkedIn,
  IconWhatsApp,
} from '../Contact/ContactChannelIcons'
import { Reveal } from '../Reveal/Reveal'
import styles from './About.module.css'

export function About() {
  const { config, content } = usePortfolioDisplay()
  const { about: aboutContent, hero, contact } = content
  const contactLinks = resolveContactLinksFromContent(content, config)

  return (
    <section id="home" className={styles.section}>
      <div className={styles.container}>
        <Reveal className={styles.copy} instant>
          <p className={styles.kicker}>{aboutContent.kicker}</p>
          <div className={styles.availability} role="status">
            <span className={styles.availabilityBadge}>{aboutContent.availabilityStatus}</span>
            <span className={styles.availabilityModes}>{aboutContent.availabilityModes}</span>
          </div>
          <h1 className={styles.name}>{config.brandName}</h1>
          <p className={styles.role}>{aboutContent.title}</p>
          <p className={styles.lead}>{aboutContent.lead}</p>
          <p className={styles.para}>{aboutContent.para}</p>
          <p className={styles.availabilityNote}>{aboutContent.availabilityNote}</p>

          <div className={styles.actions}>
            <PortfolioSectionLink navKey="projects" className={styles.primary}>
              {hero.ctaProjects}
            </PortfolioSectionLink>
            <div className={styles.socialIcons} aria-label="Contato">
              <a
                href={contactLinks.mailto}
                className={styles.iconBtn}
                aria-label={contact.channelLabels.email}
                title={contactLinks.mailtoDisplay}
              >
                <IconEmail className={styles.actionIcon} />
              </a>
              <a
                href={contactLinks.github}
                className={styles.iconBtn}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={hero.github}
                title={hero.github}
              >
                <IconGitHub className={styles.actionIcon} />
              </a>
              <a
                href={contactLinks.linkedin}
                className={styles.iconBtn}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={hero.linkedin}
                title={hero.linkedin}
              >
                <IconLinkedIn className={styles.actionIcon} />
              </a>
              <a
                href={contactLinks.whatsapp}
                className={styles.iconBtn}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={contact.channelLabels.whatsapp}
                title={contact.channelLabels.whatsapp}
              >
                <IconWhatsApp className={styles.actionIcon} />
              </a>
            </div>
          </div>

          <ol className={styles.timeline}>
            {aboutContent.timeline.map((item) => (
              <li key={item.phase} className={styles.timelineItem}>
                <span className={styles.timelinePhase}>{item.phase}</span>
                <div className={styles.timelineBody}>
                  <strong className={styles.timelineTitle}>{item.title}</strong>
                  <p className={styles.timelineText}>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
