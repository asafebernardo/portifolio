import { useEffect, useState, type KeyboardEvent } from 'react'
import { imageAnonymousProps } from '../../lib/imageLoadProps'
import { ProjectImageModal, type ProjectImageModalLabels } from './ProjectImageModal'
import styles from './Projects.module.css'

const ROTATE_MS = 4500

type ProjectCardMediaProps = {
  images: string[]
  alt: string
  viewImageAria: string
  imageModal: ProjectImageModalLabels
}

export function ProjectCardMedia({ images, alt, viewImageAria, imageModal }: ProjectCardMediaProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)
  const count = images.length
  const multi = count > 1

  const openModal = () => {
    setModalIndex(index)
    setModalOpen(true)
  }

  const onMediaKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openModal()
    }
  }

  useEffect(() => {
    setIndex(0)
  }, [images])

  useEffect(() => {
    if (!multi || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, ROTATE_MS)

    return () => window.clearInterval(id)
  }, [count, multi, paused, images])

  return (
    <>
      <div
        className={styles.cardMedia}
        role="button"
        tabIndex={0}
        aria-label={viewImageAria}
        onClick={openModal}
        onKeyDown={onMediaKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={multi ? `${alt} (${i + 1}/${count})` : alt}
            className={`${styles.cardMediaSlide} ${i === index ? styles.cardMediaSlideActive : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            {...imageAnonymousProps(src)}
          />
        ))}
        <span className={styles.cardMediaExpand} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
            <path
              fill="currentColor"
              d="M15 3h6v6h-2V6.41l-7.29 7.3-1.42-1.42 7.3-7.29H15V3ZM5 5h5V3H3v7h2V5Zm14 14h-5v2h7v-7h-2v5Zm-14 0v-5H3v7h7v-2H5Z"
            />
          </svg>
        </span>
        {multi ? (
          <div className={styles.cardMediaDots} aria-hidden="true">
            {images.map((src, i) => (
              <span
                key={src}
                className={`${styles.cardMediaDot} ${i === index ? styles.cardMediaDotActive : ''}`}
              />
            ))}
          </div>
        ) : null}
      </div>
      <ProjectImageModal
        open={modalOpen}
        images={images}
        index={modalIndex}
        alt={alt}
        labels={imageModal}
        onClose={() => setModalOpen(false)}
        onIndexChange={setModalIndex}
      />
    </>
  )
}
