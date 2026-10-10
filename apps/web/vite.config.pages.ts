import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/zhong-art/',
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  build: { outDir: '../../pages-dist', emptyOutDir: true },
})
