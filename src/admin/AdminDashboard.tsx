import { Link, useNavigate } from 'react-router-dom'
import { logout } from './session'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.kicker}>Área administrativa</p>
        <h1 className={styles.title}>Como deseja editar?</h1>
        <p className={styles.lead}>
          O modo recomendado é o assistente por etapas no site (textos em português).
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} to="/editar">
            Abrir editor assistido
          </Link>
          <Link className={styles.secondary} to="/admin/json">
            Editor JSON (avançado)
          </Link>
          <button type="button" className={styles.ghost} onClick={handleLogout}>
            Sair
          </button>
        </div>
        <p className={styles.hint}>
          Na página inicial também aparece o botão flutuante <strong>Editar</strong> enquanto estiver logado.
        </p>
      </div>
    </div>
  )
}
