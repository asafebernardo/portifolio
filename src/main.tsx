import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SiteProvider } from './i18n/SiteProvider'
import { VisualThemeProvider } from './theme/VisualThemeProvider'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VisualThemeProvider>
      <BrowserRouter>
        <SiteProvider>
          <App />
        </SiteProvider>
      </BrowserRouter>
    </VisualThemeProvider>
  </StrictMode>,
)
