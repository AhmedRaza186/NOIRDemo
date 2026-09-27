import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The three.js chunk (~970 kB) is lazy-loaded only when the 360° Sippin' Bag view opens
    chunkSizeWarningLimit: 1000,
  },
})
