import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [react() as PluginOption],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

