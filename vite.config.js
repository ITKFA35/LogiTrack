import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  server: {
  host: '0.0.0.0',
  port: 5173,
  allowedHosts: [
  'frontend',
  'localhost',
  '127.0.0.1',
  'logitracknas',
  'logitracknas.taildc027e.ts.net',
  '100.69.142.64'
],
  hmr: {
    host: "logitracknas",
    clientPort: 8080
  }
}
})