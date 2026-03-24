// vite.config.ts
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import tailwindcss from "@tailwindcss/vite"
import path from "path" // standard Node 'path' only

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  // 👇 EXACT repo name for GitHub Pages
  base: process.env.VITE_BASE || "/",
  resolve: {
    alias: {
      "@": path.resolve("src"),
    },
  },
})
