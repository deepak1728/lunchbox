import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/lunchbox/", // for GitHub Pages or subpath deployment
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true, // helps with debugging production code
    manifest: true, // generates a manifest.json mapping original files to hashed versions
    rollupOptions: {
      output: {
        // filenames include hashes for cache busting (default behavior)
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
});
