import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl';
import express from 'express';
import os from 'os';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001', // Proxy requests to /api to the Express server
    },
    https: {
      key: fs.readFileSync('certificate/key.pem'),
      cert: fs.readFileSync('certificate/cert.pem')
    }
  },
})
