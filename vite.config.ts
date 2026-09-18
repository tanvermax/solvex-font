import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['react-hook-form', '@hookform/resolvers', 'zod'],
  },
  resolve: {
     alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react-hook-form', '@hookform/resolvers', 'zod', 'react', 'react-dom'],
  },

  server:{
    port:3000,
  }
})