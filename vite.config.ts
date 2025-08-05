import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/lunchbox/", // ✅ critical for GitHub Pages
  server: {
    host: true,
  },
  build: {
    sourcemap: true,
  },
});
