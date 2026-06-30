import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static-site build: relative asset paths so dist/ works at any URL
// (root, subdirectory, file://, S3, GitHub Pages, etc.)
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 5173
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    assetsInlineLimit: 4096
  }
});
