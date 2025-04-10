import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import polyfillNode from 'rollup-plugin-polyfill-node'
// import fragmentShader from "../shaders/tunnel.frag?raw";

export default defineConfig({
  plugins: [react()],
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
    global: {}, // 👈 Vite will replace "global" with "globalThis"
  },
  optimizeDeps: {
    include: ['hydra-synth'],
  },
  build: {
    rollupOptions: {
      plugins: [polyfillNode()], // 👈 inject polyfills during build
    },
  },
});
