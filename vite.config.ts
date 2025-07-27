import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [
    svelte({
      configFile: path.resolve(__dirname, 'svelte.config.cjs'),
    }),
  ],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
},
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    }
  }
});
