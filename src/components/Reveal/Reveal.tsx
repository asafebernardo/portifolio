import type { ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'
import styles from './Reveal.module.css'

type Props = {
  children: ReactNode
  className?: string
  /** No fade — use on section headers to avoid overlapping the previous section. */
  instant?: boolean
}

export function Reveal({ children, className = '', instant = false }: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const show = instant || visible
  return (
    <div ref={ref} className={`${styles.wrap} ${show ? styles.visible : ''} ${className}`.trim()}>
      {children}
    </div>
  )
}
