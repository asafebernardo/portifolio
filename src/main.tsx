import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SiteProvider } from './i18n/SiteProvider'
import { VisualThemeProvider } from './theme/VisualThemeProvider'
import { ColorSchemeProvider } from './theme/ColorSchemeProvider'
import './index.css'
import './styles/portfolioSections.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VisualThemeProvider>
      <ColorSchemeProvider>
        <BrowserRouter>
          <SiteProvider>
            <App />
          </SiteProvider>
        </BrowserRouter>
      </ColorSchemeProvider>
    </VisualThemeProvider>
  </StrictMode>,
)
