import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { portfolioUploadPlugin } from './vite-plugin-portfolio-upload'

export default defineConfig({
  plugins: [portfolioUploadPlugin(), react()],
})
