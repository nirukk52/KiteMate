import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to Encore backend during development
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});

