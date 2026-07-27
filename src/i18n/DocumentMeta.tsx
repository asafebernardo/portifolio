import { useEffect } from 'react'
import { resolvePublicUrl } from '../lib/publicUrl'
import { usePortfolioDisplay } from '../pages/portfolio/PortfolioDraftContext'
import { resolveProfilePhoto } from '../site/profilePhoto'

const OG_IMAGE_PATH = '/og-preview.svg'

function setFaviconLink(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = href
  if (href.startsWith('data:')) {
    link.removeAttribute('crossorigin')
  } else {
    link.crossOrigin = 'anonymous'
  }
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

function ensureMeta(property: string, attr: 'name' | 'property', content: string) {
  let el = document.querySelector(`meta[${attr}="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function DocumentMeta() {
  const { content, config } = usePortfolioDisplay()

  useEffect(() => {
    document.documentElement.lang = 'pt-BR'
    document.title = content.meta.title

    ensureMeta('description', 'name', content.meta.description)
    ensureMeta('og:title', 'property', content.meta.title)
    ensureMeta('og:description', 'property', content.meta.description)
    ensureMeta('og:image', 'property', resolvePublicUrl(OG_IMAGE_PATH))

    setFaviconLink(resolveProfilePhoto(config.profilePhoto))
  }, [content, config.profilePhoto])

  return null
}
