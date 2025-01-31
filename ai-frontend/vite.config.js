import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows external access
    port: 3000, // Default port, change if needed
  },
  preview: {
    allowedHosts: ['ai-powered-transaction-analysis-system-1.onrender.com'], // Add your Render domain here
  },
});
