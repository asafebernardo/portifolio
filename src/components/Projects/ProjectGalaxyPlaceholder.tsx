import styles from './Projects.module.css'

type ProjectGalaxyPlaceholderProps = {
  label: string
}

export function ProjectGalaxyPlaceholder({ label }: ProjectGalaxyPlaceholderProps) {
  return (
    <div className={styles.galaxyPlaceholder} aria-hidden="true">
      <div className={styles.galaxyStars} />
      <div className={styles.galaxyNebula} />
      <div className={styles.galaxyNebulaSecondary} />
      <p className={styles.galaxyLabel}>{label}</p>
    </div>
  )
}
