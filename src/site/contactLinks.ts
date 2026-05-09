import type { ContactLinkSegments, SiteConfig, SiteContent } from './types'

/** URLs fixas; o editor só guarda o segmento que vem a seguir a cada base. */
export const CONTACT_URL_BASE = {
  github: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/in/',
  whatsapp: 'https://wa.me/',
} as const

export function normalizeContactLinkSegments(seg?: Partial<ContactLinkSegments> | null): ContactLinkSegments {
  const empty: ContactLinkSegments = { email: '', github: '', linkedin: '', whatsapp: '' }
  if (!seg) return empty
  return { ...empty, ...seg }
}

export function resolveGithubHref(segment: string | undefined, fallback: string): string {
  const s = segment?.trim()
  if (!s) return fallback
  return `${CONTACT_URL_BASE.github}${s.replace(/^\/+/, '')}`
}

export function resolveLinkedinHref(segment: string | undefined, fallback: string): string {
  const s = segment?.trim()
  if (!s) return fallback
  const clean = s.replace(/^\/+/, '').replace(/^in\//i, '')
  return `${CONTACT_URL_BASE.linkedin}${clean}`
}

export function resolveWhatsappHref(segment: string | undefined, fallback: string): string {
  const s = segment?.trim()
  if (!s) return fallback
  const digits = s.replace(/\D/g, '')
  if (!digits) return fallback
  return `${CONTACT_URL_BASE.whatsapp}${digits}`
}

export function resolveMailtoHref(segment: string | undefined, fallback: string): string {
  const s = segment?.trim()
  if (!s) return fallback
  if (s.startsWith('mailto:')) return s
  return `mailto:${s}`
}

export function displayChannelValue(segment: string | undefined, fallbackDisplay: string): string {
  const s = segment?.trim()
  return s || fallbackDisplay
}

export type ResolvedContactLinks = {
  mailto: string
  github: string
  linkedin: string
  whatsapp: string
  mailtoDisplay: string
  githubDisplay: string
  linkedinDisplay: string
  whatsappDisplay: string
}

/** Combina segmentos do conteúdo com URLs base; se segmento vazio, usa `config.links`. */
export function resolveContactLinksFromContent(content: SiteContent, config: SiteConfig): ResolvedContactLinks {
  const links = config.links
  const seg = normalizeContactLinkSegments(content.contact.linkSegments)

  return {
    mailto: resolveMailtoHref(seg.email, links.email),
    github: resolveGithubHref(seg.github, links.github),
    linkedin: resolveLinkedinHref(seg.linkedin, links.linkedin),
    whatsapp: resolveWhatsappHref(seg.whatsapp, links.whatsapp),
    mailtoDisplay: displayChannelValue(seg.email, links.emailDisplay),
    githubDisplay: displayChannelValue(seg.github, links.githubDisplay),
    linkedinDisplay: displayChannelValue(seg.linkedin, links.linkedinDisplay),
    whatsappDisplay: displayChannelValue(seg.whatsapp, links.whatsappDisplay),
  }
}
