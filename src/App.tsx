import { Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from './admin/AdminDashboard'
import AdminJsonEditor from './admin/AdminJsonEditor'
import AdminLogin from './admin/AdminLogin'
import { AdminRoute } from './admin/AdminRoute'
import PortfolioPage from './pages/PortfolioPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/json"
        element={
          <AdminRoute>
            <AdminJsonEditor />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
