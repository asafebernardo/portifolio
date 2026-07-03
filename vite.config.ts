import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** GitHub Pages project site: https://<user>.github.io/<repo>/ */
const GITHUB_PAGES_BASE = '/portifolio/'

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? GITHUB_PAGES_BASE : '/',
  plugins: [react()],
})
