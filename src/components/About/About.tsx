import { imageAnonymousProps } from '../../lib/imageLoadProps'
import { resolveProfilePhoto } from '../../site/profilePhoto'
import { usePortfolioDisplay } from '../../pages/portfolio/PortfolioDraftContext'
import { Reveal } from '../Reveal/Reveal'
import styles from './About.module.css'

export function About() {
  const { config, content } = usePortfolioDisplay()
  const { about } = content
  const profilePhoto = resolveProfilePhoto(config.profilePhoto)

  return (
    <section id="home" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <Reveal className={styles.copyCol} instant>
            <div className={styles.copy}>
              <p className={styles.kicker}>{about.kicker}</p>
              <h1 className={styles.name}>{config.brandName}</h1>
              <p className={styles.role}>{about.title}</p>
              <p className={styles.lead}>{about.lead}</p>
              <p className={styles.para}>{about.para}</p>
            </div>
          </Reveal>

          <Reveal className={styles.photoCol} instant>
            <figure className={styles.photoFrame}>
              <img
                src={profilePhoto}
                alt={`Photo of ${config.brandName}`}
                className={styles.photo}
                width={480}
                height={560}
                decoding="async"
                {...imageAnonymousProps(profilePhoto)}
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
