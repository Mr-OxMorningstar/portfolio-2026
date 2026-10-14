import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // three.js ships as one lazy-loaded chunk for The Office scene.
  build: { chunkSizeWarningLimit: 650 },
});
