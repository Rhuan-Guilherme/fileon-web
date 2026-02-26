import path from 'path';
import fs from 'fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: 'empresa1.lvh.me', // importante para subdomínio
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/lvh.me+1-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/lvh.me+1.pem')),
    },
  },
});
