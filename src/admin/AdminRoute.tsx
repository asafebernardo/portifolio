import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isAdminSession } from './session'

export function AdminRoute({ children }: { children: ReactNode }) {
  if (!isAdminSession()) return <Navigate to="/login" replace />
  return <>{children}</>
}
