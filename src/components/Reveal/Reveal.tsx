import type { ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'
import styles from './Reveal.module.css'

type Props = {
  children: ReactNode
  className?: string
}

export function Reveal({ children, className = '' }: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`${styles.wrap} ${visible ? styles.visible : ''} ${className}`.trim()}>
      {children}
    </div>
  )
}
