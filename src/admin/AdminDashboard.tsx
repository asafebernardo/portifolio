import { Link, useNavigate } from 'react-router-dom'
import { logout } from './session'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.kicker}>Área administrativa</p>
        <h1 className={styles.title}>Como deseja editar?</h1>
        <p className={styles.lead}>
          O modo recomendado é no próprio portfólio: formulários em português e tradução automática para inglês ao salvar.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} to="/?edit=1">
            Abrir editor visual no site
          </Link>
          <Link className={styles.secondary} to="/admin/json">
            Editor JSON (avançado)
          </Link>
          <button type="button" className={styles.ghost} onClick={handleLogout}>
            Sair
          </button>
        </div>
        <p className={styles.hint}>
          Depois de logado, na página inicial aparece também o botão flutuante <strong>Editar site</strong>.
        </p>
      </div>
    </div>
  )
}
