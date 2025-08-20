// vite.config.ts
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path" // standard Node 'path' only

export default defineConfig({
  plugins: [vue()],
  // 👇 EXACT repo name for GitHub Pages
  base: "/lightweight-menu/",
  resolve: {
    alias: {
      "@": path.resolve("src"),
      "~utils": path.resolve("src/utils"),
      "~components": path.resolve("src/components"),
      "~composables": path.resolve("src/composables"),
    },
  },
})
