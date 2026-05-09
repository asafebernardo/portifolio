import { useEffect } from 'react'
import { usePortfolioDisplay } from '../pages/portfolio/PortfolioDraftContext'

/** Shown in the browser tab and og:title. */
const TAB_BRAND_TITLE = 'Asafe Bernardo'

function setFaviconLink(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = href
  if (href.startsWith('data:image/jpeg') || href.startsWith('data:image/jpg')) {
    link.type = 'image/jpeg'
  } else if (href.startsWith('data:image/png')) {
    link.type = 'image/png'
  } else if (href.startsWith('data:image/webp')) {
    link.type = 'image/webp'
  } else if (href.startsWith('data:image/svg+xml') || href === '/favicon.svg' || href.endsWith('.svg')) {
    link.type = 'image/svg+xml'
  } else {
    link.removeAttribute('type')
  }
}

export function DocumentMeta() {
  const { content, config } = usePortfolioDisplay()

  useEffect(() => {
    document.documentElement.lang = 'pt-BR'
    document.title = TAB_BRAND_TITLE

    const apply = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute(attr, value)
    }

    apply('meta[name="description"]', 'content', content.meta.description)
    apply('meta[property="og:title"]', 'content', TAB_BRAND_TITLE)
    apply('meta[property="og:description"]', 'content', content.meta.description)

    const photo = config.profilePhoto?.trim()
    setFaviconLink(photo && photo.length > 0 ? photo : '/favicon.svg')
  }, [content, config.profilePhoto])

  return null
}
