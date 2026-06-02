import type { CSSProperties } from 'react'
import { SkillIcon } from '../Skills/SkillIcon'
import { getStackTechColor, getStackTechId } from '../../lib/stackTech'
import styles from './Projects.module.css'

type StackTagProps = {
  name: string
  size?: 'sm' | 'md'
}

export function StackTag({ name, size = 'sm' }: StackTagProps) {
  const techId = getStackTechId(name)
  const brand = getStackTechColor(name)
  const className = size === 'md' ? styles.stackTag : styles.stackTagSm
  const iconClass = size === 'md' ? styles.stackTagIconMd : styles.stackTagIcon

  return (
    <li
      className={className}
      data-tech={techId}
      style={brand ? ({ '--stack-brand': brand } as CSSProperties) : undefined}
    >
      <SkillIcon name={name} className={iconClass} />
      <span className={styles.stackTagLabel}>{name}</span>
    </li>
  )
}
