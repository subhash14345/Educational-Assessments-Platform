import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // base: '/exam-final',
  
  server: {
    host: '0.0.0.0',  // for network --host access
    port: 5173,
  }
});
