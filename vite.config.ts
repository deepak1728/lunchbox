import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external access
    allowedHosts: [
      "c846d630df88.ngrok-free.app", // your ngrok subdomain
    ],
  },
});
