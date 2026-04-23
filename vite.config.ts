import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  server: {
    // Perfil estricto de desarrollo: solo loopback y hosts permitidos explícitos.
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    cors: false,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "v30nhy-ip-177-254-59-197.tunnelmole.net",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
});
