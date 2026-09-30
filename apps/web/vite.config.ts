import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tanstackStart(), viteReact()],
  resolve: { tsconfigPaths: true },
  cacheDir: '.vite',
  server: { port: 3000, strictPort: true },
})
