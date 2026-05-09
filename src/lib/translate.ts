import { normalizeContactLinkSegments } from '../site/contactLinks'
import type { ProjectEntry, SiteContent } from '../site/types'

const MYMEMORY = 'https://api.mymemory.translated.net/get'
const CHUNK = 420
const PAUSE_MS = 140

function delay(ms: number): Promise<void> {
  return new Promise((r) => window.setTimeout(r, ms))
}

function chunkText(text: string): string[] {
  if (text.length <= CHUNK) return [text]
  const parts: string[] = []
  let start = 0
  while (start < text.length) {
    let end = Math.min(start + CHUNK, text.length)
    if (end < text.length) {
      const slice = text.slice(start, end)
      const lastSentence = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('.\n'), slice.lastIndexOf('! '))
      if (lastSentence > 40) end = start + lastSentence + 1
    }
    parts.push(text.slice(start, end))
    start = end
  }
  return parts
}

/** Preserva trechos como {{year}} e {{brand}} ao traduzir o restante */
export async function translatePreservingPlaceholders(text: string): Promise<string> {
  if (!text.trim()) return text
  const segments = text.split(/(\{\{[^}]+\}\})/g)
  const out: string[] = []
  for (const seg of segments) {
    if (/^\{\{[^}]+\}\}$/.test(seg)) {
      out.push(seg)
      continue
    }
    if (!seg.trim()) {
      out.push(seg)
      continue
    }
    out.push(await translatePtToEnRaw(seg))
  }
  return out.join('')
}

async function translatePtToEnRaw(text: string): Promise<string> {
  const chunks = chunkText(text)
  const bits: string[] = []
  const email = import.meta.env.VITE_TRANSLATION_EMAIL
  for (let i = 0; i < chunks.length; i++) {
    const q = chunks[i]!
    const params = new URLSearchParams({ q, langpair: 'pt|en' })
    if (email) params.set('de', email)
    const res = await fetch(`${MYMEMORY}?${params.toString()}`)
    if (!res.ok) throw new Error(`Tradução HTTP ${res.status}`)
    const data = (await res.json()) as {
      responseData?: { translatedText?: string }
      responseStatus?: number
    }
    const t = data.responseData?.translatedText
    if (typeof t !== 'string') throw new Error('Resposta de tradução inválida')
    bits.push(t)
    if (i < chunks.length - 1) await delay(PAUSE_MS)
  }
  return bits.join('')
}

export async function translatePtToEn(text: string): Promise<string> {
  if (!text.trim()) return text
  if (text.includes('{{')) return translatePreservingPlaceholders(text)
  return translatePtToEnRaw(text)
}

async function walkTranslate(val: unknown): Promise<unknown> {
  if (typeof val === 'string') return translatePtToEn(val)
  if (Array.isArray(val)) return Promise.all(val.map((x) => walkTranslate(x)))
  if (val && typeof val === 'object') {
    const o = val as Record<string, unknown>
    const next: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(o)) {
      next[k] = await walkTranslate(v)
    }
    return next
  }
  return val
}

export async function translateSiteContentPtToEn(pt: SiteContent): Promise<SiteContent> {
  const clone = structuredClone(pt)
  const linkSegments = normalizeContactLinkSegments(clone.contact.linkSegments)
  const translated = (await walkTranslate(clone)) as SiteContent
  translated.contact.linkSegments = linkSegments
  return translated
}

export async function translateProjectsPtToEn(projects: ProjectEntry[]): Promise<ProjectEntry[]> {
  const out: ProjectEntry[] = []
  for (const p of projects) {
    out.push({
      ...p,
      title: await translatePtToEn(p.title),
      description: await translatePtToEn(p.description),
      challenges: await translatePtToEn(p.challenges),
    })
    await delay(PAUSE_MS)
  }
  return out
}
