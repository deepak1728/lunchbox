import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/lunchbox/", // Important for GitHub Pages
  build: {
    outDir: "dist",
    sourcemap: true, // For better debugging
  },
});
