import styles from './AmbientBackground.module.css'

/** Fundo fixo com gradientes animados (não bloqueia interação). */
export function AmbientBackground() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.blobA} />
      <div className={styles.blobB} />
      <div className={styles.blobC} />
      <div className={styles.grid} />
    </div>
  )
}
