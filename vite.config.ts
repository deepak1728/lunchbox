import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Replace "lunchbox" with your actual GitHub repo name
export default defineConfig({
  base: "/lunchbox/",
  plugins: [react()],
  server: {
    host: true, // Allows access from network (useful in local testing)
  },
});
