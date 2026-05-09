import { Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from './admin/AdminDashboard'
import AdminJsonEditor from './admin/AdminJsonEditor'
import AdminLogin from './admin/AdminLogin'
import { AdminRoute } from './admin/AdminRoute'
import { PortfolioLayout } from './pages/portfolio/PortfolioLayout'
import {
  AboutPage,
  ArchitecturePage,
  ContactPage,
  HomePage,
  ProjectsPage,
  SkillsPage,
} from './pages/portfolio/SectionPages'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projetos" element={<ProjectsPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="arquitetura" element={<ArchitecturePage />} />
        <Route path="sobre" element={<AboutPage />} />
        <Route path="contato" element={<ContactPage />} />
      </Route>
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
