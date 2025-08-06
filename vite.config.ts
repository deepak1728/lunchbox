// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { resolve } from "path";
// import { copyFileSync } from "fs";

// // Custom plugin to copy index.html -> 404.html after build
// function copyIndexTo404() {
//   return {
//     name: "copy-index-to-404",
//     closeBundle: () => {
//       const indexPath = resolve(__dirname, "dist/index.html");
//       const notFoundPath = resolve(__dirname, "dist/404.html");
//       copyFileSync(indexPath, notFoundPath);
//       console.log("✅ Copied index.html to 404.html");
//     },
//   };
// }

// export default defineConfig({
//   plugins: [react(), copyIndexTo404()],
//   base: "/lunchbox/", // ✅ Required for GitHub Pages
//   build: {
//     outDir: "dist",
//     sourcemap: true,
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync } from "fs";

// 🔁 Custom plugin to copy index.html → 404.html
function copyIndexTo404() {
  return {
    name: "copy-index-to-404",
    closeBundle: () => {
      const indexPath = resolve(__dirname, "dist/index.html");
      const notFoundPath = resolve(__dirname, "dist/404.html");
      copyFileSync(indexPath, notFoundPath);
      console.log("✅ Copied index.html to 404.html");
    },
  };
}

export default defineConfig({
  plugins: [react(), copyIndexTo404()],
  base: "/lunchbox/", // GitHub Pages repo name
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
      },
      format: {
        comments: true,
      },
    } satisfies import("terser").MinifyOptions, // ✅ fix for TS in Vite 7
  },
});
