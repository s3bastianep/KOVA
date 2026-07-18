import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  cacheDir: path.resolve(__dirname, '.vite-cache'),
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/portal': { target: 'http://localhost:3001', changeOrigin: true },
      '/postular': { target: 'http://localhost:3001', changeOrigin: true },
      '/_next': { target: 'http://localhost:3001', changeOrigin: true },
      '/api/auth': { target: 'http://localhost:3001', changeOrigin: true },
      '/api/portal': { target: 'http://localhost:3001', changeOrigin: true },
      '/api/registro': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('gsap') || id.includes('/lenis/')) return 'motion-scroll';
          if (id.includes('framer-motion')) return 'framer';
          if (id.includes('react-day-picker') || id.includes('date-fns')) return 'calendar';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
  },
})
