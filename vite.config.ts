import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  server: {
    // Perfil estricto de desarrollo: solo loopback, sin túneles públicos versionados.
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    cors: false,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
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
