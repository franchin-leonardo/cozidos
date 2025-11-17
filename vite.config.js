import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss' // <-- 1. Importe o tailwind

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: { // <-- 2. Adicione este bloco 'css'
    postcss: {
      plugins: [tailwindcss()],
    },
  },
})