import { Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from './admin/AdminDashboard'
import AdminJsonEditor from './admin/AdminJsonEditor'
import AdminLogin from './admin/AdminLogin'
import { AdminRoute } from './admin/AdminRoute'
import { AmbientBackground } from './components/AmbientBackground/AmbientBackground'
import { EditorWizard } from './pages/editor/EditorWizard'
import { PortfolioLayout } from './pages/portfolio/PortfolioLayout'
import { PortfolioHome } from './pages/portfolio/PortfolioHome'
import { PortfolioDraftProvider } from './pages/portfolio/PortfolioDraftContext'
import appStyles from './App.module.css'

export default function App() {
  return (
    <div className={appStyles.shell}>
      <AmbientBackground />
      <div className={appStyles.routes}>
        <Routes>
          <Route path="/" element={<PortfolioLayout />}>
            <Route index element={<PortfolioHome />} />
          </Route>
          <Route
            path="/editar"
            element={
              <AdminRoute>
                <PortfolioDraftProvider>
                  <EditorWizard />
                </PortfolioDraftProvider>
              </AdminRoute>
            }
          />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
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
      </div>
    </div>
  )
}
