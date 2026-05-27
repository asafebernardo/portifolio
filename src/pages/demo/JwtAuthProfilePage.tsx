import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearStoredDemoToken, getStoredDemoToken, verifyDemoJwt } from '../../lib/jwtDemoCrypto'
import styles from './JwtAuthDemo.module.css'

export function JwtAuthProfilePage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string | null>(null)

  const load = useCallback(async () => {
    const token = getStoredDemoToken()
    if (!token) {
      navigate('/demo/jwt-auth', { replace: true })
      return
    }
    const user = await verifyDemoJwt(token)
    if (!user) {
      clearStoredDemoToken()
      navigate('/demo/jwt-auth', { replace: true })
      return
    }
    setEmail(user.email)
  }, [navigate])

  useEffect(() => {
    void load()
  }, [load])

  function logout() {
    clearStoredDemoToken()
    navigate('/demo/jwt-auth', { replace: true })
  }

  if (!email) {
    return (
      <div className={styles.center}>
        <p className={styles.sub}>Checking session…</p>
      </div>
    )
  }

  const json = JSON.stringify({ user: { email } }, null, 2)

  return (
    <div className={styles.center}>
      <div className={styles.profileHeader}>
        <div>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.sub}>JWT-protected view (token verified with the same demo secret).</p>
        </div>
        <button type="button" className={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.panel}>
          <p className={styles.panelLabel}>Signed-in user</p>
          <pre className={styles.pre}>{json}</pre>
        </div>
      </div>
    </div>
  )
}
