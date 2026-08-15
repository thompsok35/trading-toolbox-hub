import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDb } from './api/db/connection.js';
import { config } from './api/config/env.js';
import apiRouter from './api/routes/index.js';
import { errorHandler } from './api/middleware/error.middleware.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize Database & Migrations
initDb().catch(err => console.error('[Server] DB init error:', err));

// Global Body Parsers
app.use(express.json());

// Mount API Gateway
app.use('/api', apiRouter);

// Health check for Railway load balancer
app.get('/health', (req, res) => res.status(200).send('OK'));

// Serve Static Frontend Assets
app.use(express.static(join(__dirname, 'dist')));

// Fallback to Single Page Application routing
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Centralized Error Boundary
app.use(errorHandler);

// Start Server
app.listen(config.port, () => {
  console.log(`🚀 MyTradingToolbox Suite Hub API running on port ${config.port}`);
});
