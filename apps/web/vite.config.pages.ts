import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pagesEntry } from '../../scripts/pages-entry.mjs'

export default defineConfig({
  base: '/zhong-art/',
  plugins: [react(), pagesEntry()],
  resolve: { tsconfigPaths: true },
  build: { outDir: '../../pages-dist', emptyOutDir: true },
})
