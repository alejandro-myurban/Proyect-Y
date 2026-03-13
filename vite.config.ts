import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/wowhead-api': {
        target: 'https://www.wowhead.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wowhead-api/, '/tbc'),
      },
    },
  },
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
