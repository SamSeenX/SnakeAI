import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    hmr: false
  },
  esbuild: {
    target: 'es2022',
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  build: {
    target: 'es2022',
    sourcemap: false
  }
})
