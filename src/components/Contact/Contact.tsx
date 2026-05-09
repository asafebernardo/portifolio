import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { resolveContactLinksFromContent } from '../../site/contactLinks'
import { Reveal } from '../Reveal/Reveal'
import { IconEmail, IconGitHub, IconLinkedIn, IconWhatsApp } from './ContactChannelIcons'
import styles from './Contact.module.css'

export function Contact() {
  const { config, content } = usePortfolioDisplay()
  const { contact } = content
  const links = resolveContactLinksFromContent(content, config)

  return (
    <section id="contato" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <Reveal>
            <header className={styles.head}>
              <p className={styles.kicker}>{contact.kicker}</p>
              <h2 className={styles.title}>{contact.title}</h2>
              <p className={styles.sub}>{contact.sub}</p>
            </header>
          </Reveal>

          <Reveal>
            <ul className={styles.channels}>
              <li>
                <a href={links.mailto} className={styles.channel}>
                  <span className={styles.channelMark} aria-hidden="true">
                    <IconEmail />
                  </span>
                  <span className={styles.channelText}>
                    <span className={styles.channelLabel}>{contact.channelLabels.email}</span>
                    <span className={styles.channelValue}>{links.mailtoDisplay}</span>
                  </span>
                </a>
              </li>
                <li>
                  <a href={links.github} target="_blank" rel="noreferrer noopener" className={styles.channel}>
                    <span className={styles.channelMark} aria-hidden="true">
                      <IconGitHub />
                    </span>
                    <span className={styles.channelText}>
                      <span className={styles.channelLabel}>{contact.channelLabels.github}</span>
                      <span className={styles.channelValue}>{links.githubDisplay}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={links.linkedin} target="_blank" rel="noreferrer noopener" className={styles.channel}>
                    <span className={styles.channelMark} aria-hidden="true">
                      <IconLinkedIn />
                    </span>
                    <span className={styles.channelText}>
                      <span className={styles.channelLabel}>{contact.channelLabels.linkedin}</span>
                      <span className={styles.channelValue}>{links.linkedinDisplay}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={links.whatsapp} target="_blank" rel="noreferrer noopener" className={styles.channel}>
                    <span className={styles.channelMark} aria-hidden="true">
                      <IconWhatsApp />
                    </span>
                    <span className={styles.channelText}>
                      <span className={styles.channelLabel}>{contact.channelLabels.whatsapp}</span>
                      <span className={styles.channelValue}>{links.whatsappDisplay}</span>
                    </span>
                  </a>
                </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
