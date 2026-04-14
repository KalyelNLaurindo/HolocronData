import { defineConfig } from 'vite';

export default defineConfig({
  // Base path para GitHub Pages (nome do repositório)
  // Em desenvolvimento (npm run dev) não afeta nada.
  // Em produção (npm run build) gera caminhos /HolocronData/assets/...
  base: '/HolocronData/',

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
