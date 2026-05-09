import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAdminPasswordConfigured, isAdminSession, login } from './session'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAdminSession()) navigate('/?edit=1', { replace: true })
  }, [navigate])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!isAdminPasswordConfigured()) {
      setError(
        'VITE_ADMIN_PASSWORD não está no bundle do site. No deploy, essa variável precisa existir na etapa de BUILD (npm run build / Docker build-args), não só nas variáveis de runtime do painel. Em desenvolvimento: .env + reiniciar npm run dev.',
      )
      return
    }
    if (!login(user, pass)) {
      setError('Usuário ou senha incorretos.')
      return
    }
    navigate('/?edit=1', { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.kicker}>Área restrita</p>
        <h1 className={styles.title}>Editor do site</h1>
        <p className={styles.hint}>
          
        </p>
        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.field}>
            <span>Usuário</span>
            <input
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </label>
          <label className={styles.field}>
            <span>Senha</span>
            <input
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </label>
          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className={styles.submit}>
            Entrar
          </button>
        </form>
        <Link className={styles.back} to="/">
          ← Voltar ao site
        </Link>
      </div>
    </div>
  )
}
