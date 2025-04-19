import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensures correct asset resolution in Amplify
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      plugins: [polyfillNode()]
    }
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@hydra_presets': path.resolve(__dirname, 'src/hydra_presets'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@components': path.resolve(__dirname, 'src/components'),
      './runtimeConfig': './runtimeConfig.browser' // Resolves AWS SDK compatibility
    }
  },
  define: {
    global: {}, // For packages expecting a Node.js-like global
  },
  optimizeDeps: {
    include: ['hydra-synth'], // Pre-bundles this package for dev
  },
});
