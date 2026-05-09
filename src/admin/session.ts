const SESSION_KEY = 'portfolio-admin-session'
const SESSION_MS = 8 * 60 * 60 * 1000

type SessionPayload = { until: number }

function envTrim(key: 'VITE_ADMIN_USERNAME' | 'VITE_ADMIN_PASSWORD'): string {
  const v = import.meta.env[key]
  return typeof v === 'string' ? v.trim() : ''
}

export function isAdminPasswordConfigured(): boolean {
  return envTrim('VITE_ADMIN_PASSWORD').length > 0
}

export function login(username: string, password: string): boolean {
  if (!isAdminPasswordConfigured()) return false
  const expectedUser = envTrim('VITE_ADMIN_USERNAME') || 'admin'
  const expectedPass = envTrim('VITE_ADMIN_PASSWORD')
  if (username !== expectedUser || password !== expectedPass) return false
  const payload: SessionPayload = { until: Date.now() + SESSION_MS }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload))
  window.dispatchEvent(new Event('admin-session-changed'))
  return true
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event('admin-session-changed'))
}

export function isAdminSession(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return false
    const { until } = JSON.parse(raw) as SessionPayload
    if (typeof until !== 'number' || Date.now() > until) {
      sessionStorage.removeItem(SESSION_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}
