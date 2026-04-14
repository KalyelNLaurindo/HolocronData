import { defineConfig } from 'vite';

export default defineConfig({
  // Garante que o Vite sirva o index.html da raiz do projeto
  root: '.',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
