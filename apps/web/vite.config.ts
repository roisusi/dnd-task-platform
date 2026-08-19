import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@infrastructure': fileURLToPath(
        new URL('./src/infrastructure', import.meta.url),
      ),
      '@model': fileURLToPath(new URL('./src/model', import.meta.url)),
      '@providers': fileURLToPath(new URL('./src/providers', import.meta.url)),
      '@routes': fileURLToPath(new URL('./src/routes', import.meta.url)),
      '@theme': fileURLToPath(new URL('./src/theme', import.meta.url)),
    },
  },
})
