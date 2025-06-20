import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './', // ✅ Important for file:// loading in Electron
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // Local dev server port
  },
  build: {
    outDir: 'dist',        // Output folder
    emptyOutDir: true,     // Clean outDir before build
    sourcemap: true,       // ✅ Enable source maps for debugging production
  },
});