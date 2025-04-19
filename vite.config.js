import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/', // important for correct asset resolution in Amplify
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      plugins: [polyfillNode()] // ✅ correct place for this plugin
    }
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@hydra_presets': path.resolve(__dirname, 'src/hydra_presets'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@components': path.resolve(__dirname, 'src/components')
    },
  },
  define: {
    global: {}, // for packages that expect a Node.js-like global
  },
  optimizeDeps: {
    include: ['hydra-synth'], // pre-bundles this package for dev
  },
});
