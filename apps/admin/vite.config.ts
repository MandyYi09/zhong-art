import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), tanstackStart(), tailwindcss(), react()],
  server: { port: 3001, strictPort: true },
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'] },
})
