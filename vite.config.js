import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@hydra_presets': path.resolve(__dirname, 'src/hydra_presets'),
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
  },
});