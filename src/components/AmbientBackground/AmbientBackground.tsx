import styles from './AmbientBackground.module.css'

/** Fixed background layer (does not block interaction). */
export function AmbientBackground() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.solid} />
    </div>
  )
}
