import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // In production the app is served from /ai-audio-analyzer/ on GitHub Pages.
  // During local dev (vite serve) keep the root so localhost:5173 works normally.
  base: command === 'serve' ? '/' : '/ai-audio-analyzer/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
          'motion-vendor': ['framer-motion'],
        },
      },
    },
  },
}));
