import { useEffect, useState } from 'react'
import { imageAnonymousProps } from '../../lib/imageLoadProps'
import styles from './Projects.module.css'

const ROTATE_MS = 4500

type ProjectCardMediaProps = {
  images: string[]
  alt: string
}

export function ProjectCardMedia({ images, alt }: ProjectCardMediaProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = images.length
  const multi = count > 1

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
    <div
      className={styles.cardMedia}
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
          {...imageAnonymousProps(src)}
        />
      ))}
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
  )
}
