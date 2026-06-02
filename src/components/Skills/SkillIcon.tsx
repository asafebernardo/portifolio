import { useEffect, useState } from 'react'
import { getSkillIconSlug, skillIconUrl } from '../../site/skillIcons'
import { useColorScheme } from '../../theme/ColorSchemeProvider'
import styles from './Skills.module.css'

type SkillIconProps = {
  name: string
  className?: string
}

/** Generic stack icon for skills without a brand mapping. */
export function GenericSkillIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `${styles.genericIcon} ${className}` : styles.genericIcon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 2 2 7l10 5 10-5-10-5Zm0 7.4L4.24 7.5 12 4.1l7.76 3.4L12 9.4ZM2 12l10 5 10-5-10-5v1.2L12 17.6 4 13.2V12Zm0 4.8 10 5 10-5v1.2l-10 5-10-5v-1.2Z"
      />
    </svg>
  )
}

export function SkillIcon({ name, className }: SkillIconProps) {
  const { resolved } = useColorScheme()
  const slug = getSkillIconSlug(name)
  const [imgFailed, setImgFailed] = useState(false)
  const iconClass = className ? `${styles.skillIcon} ${className}` : styles.skillIcon

  useEffect(() => {
    setImgFailed(false)
  }, [name, resolved])

  if (!slug || imgFailed) {
    return <GenericSkillIcon className={className} />
  }

  return (
    <img
      className={iconClass}
      src={skillIconUrl(slug, resolved)}
      alt=""
      width={18}
      height={18}
      loading="lazy"
      decoding="async"
      onError={() => setImgFailed(true)}
    />
  )
}
