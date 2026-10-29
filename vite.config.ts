import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Rutas relativas: la web funciona en GitHub Pages (/Sevora/), Vercel o Netlify.
  base: "./",
  plugins: [react()],
});
