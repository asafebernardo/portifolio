import { useEffect, useState } from 'react'
import { getSkillIconSlug, skillIconUrl } from '../../site/skillIcons'
import { useColorScheme } from '../../theme/ColorSchemeProvider'
import styles from './Skills.module.css'

type SkillIconProps = {
  name: string
}

/** Generic stack icon for skills without a brand mapping. */
export function GenericSkillIcon() {
  return (
    <svg
      className={styles.genericIcon}
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

export function SkillIcon({ name }: SkillIconProps) {
  const { resolved } = useColorScheme()
  const slug = getSkillIconSlug(name)
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    setImgFailed(false)
  }, [name, resolved])

  if (!slug || imgFailed) {
    return <GenericSkillIcon />
  }

  return (
    <img
      className={styles.skillIcon}
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
