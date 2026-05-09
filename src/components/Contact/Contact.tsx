import type { FormEvent } from 'react'
import { useState } from 'react'
import { useSite } from '../../i18n/SiteProvider'
import { Reveal } from '../Reveal/Reveal'
import styles from './Contact.module.css'

export function Contact() {
  const { config, content } = useSite()
  const { contact } = content
  const { links } = config
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
    window.setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contato" className={styles.section}>
      <div className={styles.container}>
        <Reveal>
          <header className={styles.head}>
            <p className={styles.kicker}>{contact.kicker}</p>
            <h2 className={styles.title}>{contact.title}</h2>
            <p className={styles.sub}>{contact.sub}</p>
          </header>
        </Reveal>

        <div className={styles.grid}>
          <Reveal>
            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.field}>
                <span>{contact.name}</span>
                <input name="name" type="text" autoComplete="name" placeholder={contact.namePlaceholder} required />
              </label>
              <label className={styles.field}>
                <span>{contact.email}</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={contact.emailPlaceholder}
                  required
                />
              </label>
              <label className={styles.field}>
                <span>{contact.message}</span>
                <textarea name="message" rows={4} placeholder={contact.messagePlaceholder} required />
              </label>
              <button type="submit" className={styles.submit}>
                {contact.submit}
              </button>
              {sent ? (
                <p className={styles.feedback} role="status">
                  {contact.feedback}
                </p>
              ) : null}
            </form>
          </Reveal>

          <Reveal>
            <aside className={styles.aside}>
              <p className={styles.asideTitle}>{contact.channelsTitle}</p>
              <ul className={styles.channels}>
                <li>
                  <a href={links.email} className={styles.channel}>
                    <span className={styles.channelIcon} aria-hidden="true">
                      @
                    </span>
                    <span>
                      <span className={styles.channelLabel}>{contact.channelLabels.email}</span>
                      <span className={styles.channelValue}>{links.emailDisplay}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={links.github} target="_blank" rel="noreferrer noopener" className={styles.channel}>
                    <span className={styles.channelIcon} aria-hidden="true">
                      gh
                    </span>
                    <span>
                      <span className={styles.channelLabel}>{contact.channelLabels.github}</span>
                      <span className={styles.channelValue}>{links.githubDisplay}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={links.linkedin} target="_blank" rel="noreferrer noopener" className={styles.channel}>
                    <span className={styles.channelIcon} aria-hidden="true">
                      in
                    </span>
                    <span>
                      <span className={styles.channelLabel}>{contact.channelLabels.linkedin}</span>
                      <span className={styles.channelValue}>{links.linkedinDisplay}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={links.whatsapp} target="_blank" rel="noreferrer noopener" className={styles.channel}>
                    <span className={styles.channelIcon} aria-hidden="true">
                      wa
                    </span>
                    <span>
                      <span className={styles.channelLabel}>{contact.channelLabels.whatsapp}</span>
                      <span className={styles.channelValue}>{links.whatsappDisplay}</span>
                    </span>
                  </a>
                </li>
              </ul>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
