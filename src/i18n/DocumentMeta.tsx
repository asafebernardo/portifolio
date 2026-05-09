import { useEffect } from 'react'
import { useSite } from './SiteProvider'

export function DocumentMeta() {
  const { locale, content } = useSite()

  useEffect(() => {
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
    document.title = content.meta.title

    const apply = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute(attr, value)
    }

    apply('meta[name="description"]', 'content', content.meta.description)
    apply('meta[property="og:title"]', 'content', content.meta.title)
    apply('meta[property="og:description"]', 'content', content.meta.description)
  }, [locale, content])

  return null
}
