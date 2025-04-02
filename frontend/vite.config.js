import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Replace with your backend URL
        changeOrigin: true,
        secure: false, // For development, set to false if using HTTPS locally
      },
    },
  },
});
