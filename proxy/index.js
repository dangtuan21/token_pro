// Simple HTTPS proxy for backend API
// This solves the mixed content issue (HTTPS frontend -> HTTP backend)

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', proxy: 'backend-proxy', target: 'http://18.233.9.11:3010' });
});

// Proxy all GraphQL requests to the backend
app.use('/graphql', createProxyMiddleware({
  target: 'http://18.233.9.11:3010',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.path} -> http://18.233.9.11:3010${req.path}`);
  },
  onError: (err, req, res) => {
    console.error('[PROXY ERROR]', err.message);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: err.message,
      target: 'http://18.233.9.11:3010'
    });
  }
}));

// For development, use HTTP
const PORT = process.env.PORT || 3011;
app.listen(PORT, () => {
  console.log(`🔗 HTTPS Proxy running on port ${PORT}`);
  console.log(`🎯 Proxying to: http://18.233.9.11:3010`);
  console.log(`🌐 Access via: http://localhost:${PORT}/graphql`);
});