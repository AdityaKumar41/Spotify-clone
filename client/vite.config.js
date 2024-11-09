// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: "buffer/",
      crypto: "crypto-browserify",
    },
  },
  define: {
    global: "window",
  },
  // server: {
  //   host: '0.0.0.0', // Expose on network
  //   // port: 3000,       // Specify your desired port, e.g., 3000
  // },
});
