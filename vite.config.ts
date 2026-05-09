import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { portfolioUploadPlugin } from './vite-plugin-portfolio-upload'

export default defineConfig({
  plugins: [portfolioUploadPlugin(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
})
