import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `` // No additional imports or variables
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  server: {
    port: 3000, // Change the port if needed
    open: true // Automatically open the app in the browser
  },
  build: {
    outDir: 'dist', // Output directory for build files
    sourcemap: true, // Enable source maps for debugging
    minify: 'terser' // Minification strategy
  }
});
