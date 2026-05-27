/**
 * Minimal HS256 JWT for the in-portfolio demo only.
 * Secret is public in the bundle — not security, just UX parity with a real JWT flow.
 */
const DEMO_SECRET = 'portfolio-jwt-demo-secret-not-for-production'

const STORAGE_KEY = 'portfolio-jwt-demo-token'

export function getStoredDemoToken(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredDemoToken(token: string) {
  sessionStorage.setItem(STORAGE_KEY, token)
}

export function clearStoredDemoToken() {
  sessionStorage.removeItem(STORAGE_KEY)
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let bin = ''
  bytes.forEach((b) => {
    bin += String.fromCharCode(b)
  })
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlEncodeUtf8(text: string): string {
  return base64UrlEncodeBytes(new TextEncoder().encode(text))
}

function base64UrlToUint8Array(b64url: string): Uint8Array {
  let b = b64url.replace(/-/g, '+').replace(/_/g, '/')
  while (b.length % 4) b += '='
  const bin = atob(b)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

export async function createDemoJwt(email: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = { sub: email, email, iat: now, exp: now + 3600 }
  const enc = new TextEncoder()
  const encodedHeader = base64UrlEncodeUtf8(JSON.stringify(header))
  const encodedPayload = base64UrlEncodeUtf8(JSON.stringify(payload))
  const signingInput = `${encodedHeader}.${encodedPayload}`

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(DEMO_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(signingInput))
  return `${signingInput}.${base64UrlEncodeBytes(new Uint8Array(sig))}`
}

export async function verifyDemoJwt(token: string): Promise<{ email: string } | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [eh, ep, sigPart] = parts
  const signingInput = `${eh}.${ep}`
  const enc = new TextEncoder()

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(DEMO_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )
  const sigView = base64UrlToUint8Array(sigPart)
  const signature = sigView.buffer.slice(
    sigView.byteOffset,
    sigView.byteOffset + sigView.byteLength,
  ) as ArrayBuffer
  const ok = await crypto.subtle.verify('HMAC', key, signature, enc.encode(signingInput))
  if (!ok) return null

  const json = new TextDecoder().decode(base64UrlToUint8Array(ep))
  const payload = JSON.parse(json) as { email?: string; sub?: string; exp?: number }
  if (typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) return null
  const email = typeof payload.email === 'string' ? payload.email : typeof payload.sub === 'string' ? payload.sub : null
  if (!email) return null
  return { email }
}
