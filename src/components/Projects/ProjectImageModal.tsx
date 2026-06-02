import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { imageAnonymousProps } from '../../lib/imageLoadProps'
import styles from './Projects.module.css'

export type ProjectImageModalLabels = {
  close: string
  prev: string
  next: string
}

type ProjectImageModalProps = {
  open: boolean
  images: string[]
  index: number
  alt: string
  labels: ProjectImageModalLabels
  onClose: () => void
  onIndexChange: (index: number) => void
}

export function ProjectImageModal({
  open,
  images,
  index,
  alt,
  labels,
  onClose,
  onIndexChange,
}: ProjectImageModalProps) {
  const count = images.length
  const multi = count > 1
  const safeIndex = count > 0 ? Math.min(Math.max(0, index), count - 1) : 0
  const src = images[safeIndex]

  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (!multi) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onIndexChange((safeIndex - 1 + count) % count)
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        onIndexChange((safeIndex + 1) % count)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, multi, count, safeIndex, onClose, onIndexChange])

  if (!open || !src) return null

  const titleId = 'project-image-modal-title'

  return createPortal(
    <div
      className={styles.imageModalRoot}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className={styles.imageModalBackdrop}
        aria-label={labels.close}
        onClick={onClose}
      />
      <div className={styles.imageModalSheet}>
        <h2 id={titleId} className={styles.imageModalSrOnly}>
          {multi ? `${alt} (${safeIndex + 1}/${count})` : alt}
        </h2>
        <button type="button" className={styles.imageModalClose} aria-label={labels.close} onClick={onClose}>
          ×
        </button>
        {multi ? (
          <>
            <button
              type="button"
              className={`${styles.imageModalNav} ${styles.imageModalNavPrev}`}
              aria-label={labels.prev}
              onClick={() => onIndexChange((safeIndex - 1 + count) % count)}
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.imageModalNav} ${styles.imageModalNavNext}`}
              aria-label={labels.next}
              onClick={() => onIndexChange((safeIndex + 1) % count)}
            >
              ›
            </button>
          </>
        ) : null}
        <div className={styles.imageModalFrame}>
          <img
            key={src}
            src={src}
            alt={multi ? `${alt} (${safeIndex + 1}/${count})` : alt}
            className={styles.imageModalImg}
            decoding="async"
            {...imageAnonymousProps(src)}
          />
        </div>
        {multi ? (
          <p className={styles.imageModalCounter} aria-live="polite">
            {safeIndex + 1} / {count}
          </p>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
