import { Link } from 'react-router-dom'
import { useAdminSession } from '../../admin/useAdminSession'
import styles from './EditorWizardFab.module.css'

/** Botão flutuante para o editor assistido (apenas com sessão admin). */
export function EditorWizardFab() {
  const admin = useAdminSession()
  if (!admin) return null

  return (
    <Link className={styles.fab} to="/editar" aria-label="Editar conteúdo (assistente)">
      Editar
    </Link>
  )
}
