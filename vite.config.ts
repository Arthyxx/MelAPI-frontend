/// <reference types="vitest/config" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,

    allowedHosts: [
      'luckless-attendee-spore.ngrok-free.dev',
    ],

    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },

  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',

    include: [
      'src/**/*.test.{ts,tsx}',
    ],

    exclude: [
      'e2e/**',
      'node_modules/**',
      'dist/**',
    ],
  },
});