import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDemoJwt, setStoredDemoToken } from '../../lib/jwtDemoCrypto'
import styles from './JwtAuthDemo.module.css'

const DEMO_EMAIL = 'admin@email.com'
const DEMO_PASSWORD = 'admin123'

export function JwtAuthLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (!email.trim() || !password) {
        setError('Missing email or password')
        return
      }
      if (email.trim() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        setError('Invalid credentials')
        return
      }
      const token = await createDemoJwt(email.trim())
      setStoredDemoToken(token)
      navigate('/demo/jwt-auth/profile', { replace: true })
    } catch {
      setError('Could not sign in — try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.center}>
      <h1 className={styles.title}>Login</h1>
      <p className={styles.sub}>
        Live JWT demo running inside this portfolio (HS256 signed in the browser, token in{' '}
        <code>sessionStorage</code>).
      </p>

      <form className={styles.card} onSubmit={onSubmit} noValidate>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="jwt-demo-email">
            Email
          </label>
          <input
            id="jwt-demo-email"
            className={styles.input}
            type="email"
            autoComplete="username"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="jwt-demo-password">
            Password
          </label>
          <input
            id="jwt-demo-password"
            className={styles.input}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </div>

        <button className={styles.btn} type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <hr className={styles.hr} />
        <p className={styles.hint}>
          Test user
          <br />
          email: {DEMO_EMAIL}
          <br />
          password: {DEMO_PASSWORD}
        </p>
      </form>

      <p className={styles.note}>
        Mirrors the public <code>jwtUserAuth</code> sample credentials. Source for the standalone app lives on
        GitHub; this route is a self-contained SPA demo only.
      </p>
    </div>
  )
}
