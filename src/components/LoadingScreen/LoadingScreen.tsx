import { useEffect, useState } from 'react'
import { useSite } from '../../i18n/SiteProvider'
import styles from './LoadingScreen.module.css'

type Props = {
  onDone: () => void
}

export function LoadingScreen({ onDone }: Props) {
  const { config, content } = useSite()
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter')

  useEffect(() => {
    const t = window.setTimeout(() => setPhase('exit'), 900)
    const done = window.setTimeout(onDone, 1400)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(done)
    }
  }, [onDone])

  return (
    <div className={`${styles.overlay} ${phase === 'exit' ? styles.exit : ''}`} aria-hidden="true">
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.dot} />
          <span className={styles.ring} />
        </div>
        <div className={styles.meta}>
          <span className={styles.name}>{config.brandName}</span>
          <span className={styles.role}>{content.loading.role}</span>
        </div>
        <div className={styles.bar}>
          <div className={styles.barInner} />
        </div>
      </div>
    </div>
  )
}
