import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['@wowserhq/scene', '@wowserhq/format', '@wowserhq/io'],
  },
  build: {
    sourcemap: false,
  },
  css: {
    devSourcemap: false,
  },
})
