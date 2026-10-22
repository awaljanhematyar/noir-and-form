/** Vite integrates React, Tailwind v4, and the focused unit-test environment. */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { criticalImages } from './scripts/critical-images-plugin.mjs';

export default defineConfig({
  plugins: [react(), tailwindcss(), criticalImages()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
    restoreMocks: true,
    testTimeout: 15000,
    pool: 'threads',
    maxWorkers: 1,
    fileParallelism: false,
  },
});
