import type { SiteRuntimeManifest } from './types'

const RUNTIME_MANIFEST = 'site-runtime.json'

export function resolveSiteRuntimeJsonHref(): string {
  const envBase = import.meta.env.BASE_URL ?? '/'
  const joined = `${envBase.endsWith('/') ? envBase : `${envBase}/`}uploads/${RUNTIME_MANIFEST}`.replace(/\/{2,}/g, '/')

  if (typeof window === 'undefined') {
    return joined.startsWith('/') ? joined : joined.replace(/^\.\//, '/')
  }

  try {
    return new URL(joined, window.location.href).href
  } catch {
    return joined.startsWith('/') ? `${window.location.origin}${joined}` : joined
  }
}

export async function fetchSiteRuntimeManifest(): Promise<SiteRuntimeManifest | null> {
  try {
    const r = await fetch(resolveSiteRuntimeJsonHref(), { credentials: 'omit', cache: 'no-store' })
    if (!r.ok) return null
    return (await r.json()) as SiteRuntimeManifest
  } catch {
    return null
  }
}

/** Dispara novo fetch do manifesto no SiteProvider (após upload bem-sucedido). */
export function notifySiteRuntimeManifestStale(): void {
  window.dispatchEvent(new Event('portfolio-runtime-manifest-stale'))
}
