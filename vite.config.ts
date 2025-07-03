
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    hmr: {
      clientPort: 443
    },
    watch: {
      usePolling: true
    },
    allowedHosts: ['fd152430-66c7-49ac-b4a5-e9c75ca7ab94-00-1he7lcrprv7b7.janeway.replit.dev', 'all']
  }
});
