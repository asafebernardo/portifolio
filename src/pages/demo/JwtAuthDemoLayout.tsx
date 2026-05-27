import { Link, Outlet } from 'react-router-dom'
import styles from './JwtAuthDemo.module.css'

export function JwtAuthDemoLayout() {
  return (
    <div className={styles.shell}>
      <Link to="/" className={styles.back}>
        ← Back to portfolio
      </Link>
      <Outlet />
    </div>
  )
}
