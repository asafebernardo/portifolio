import { Navigate, Route, Routes } from 'react-router-dom'
import { PortfolioPage } from './pages/portfolio/PortfolioPage'
import { AmbientBackground } from './components/AmbientBackground/AmbientBackground'
import { useViewportScale } from './hooks/useViewportScale'
import { PortfolioLayout } from './pages/portfolio/PortfolioLayout'
import appStyles from './App.module.css'

export default function App() {
  useViewportScale()

  return (
    <div className={appStyles.shell}>
      <AmbientBackground />
      <div className={appStyles.routes}>
        <Routes>
          <Route path="/" element={<PortfolioLayout />}>
            <Route index element={<PortfolioPage />} />
            <Route path="projects" element={<Navigate to="/#projects" replace />} />
            <Route path="projetos" element={<Navigate to="/#projects" replace />} />
            <Route path="skills" element={<Navigate to="/#skills" replace />} />
            <Route path="experience" element={<Navigate to="/#experience" replace />} />
            <Route path="experiencias" element={<Navigate to="/#experience" replace />} />
            <Route path="arquitetura" element={<Navigate to="/#experience" replace />} />
            <Route path="about" element={<Navigate to="/" replace />} />
            <Route path="sobre" element={<Navigate to="/" replace />} />
            <Route path="contact" element={<Navigate to="/#contact" replace />} />
            <Route path="contato" element={<Navigate to="/#contact" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}
