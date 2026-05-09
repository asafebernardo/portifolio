import { useEffect, useState } from 'react'
import { isAdminSession } from './session'

export function useAdminSession(): boolean {
  const [active, setActive] = useState(() => isAdminSession())

  useEffect(() => {
    const sync = () => setActive(isAdminSession())
    sync()
    window.addEventListener('admin-session-changed', sync)
    window.addEventListener('focus', sync)
    return () => {
      window.removeEventListener('admin-session-changed', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])

  return active
}
