import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static assets from the pre-built dist folder
app.use(express.static(join(__dirname, 'dist')));

// Ensure Railway health checks report 200 OK without touching the filesystem
app.get('/health', (req, res) => res.status(200).send('OK'));

// Fallback to index.html for Single Page Application routing
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
// Securely bind port dynamically (Node natively supports both IPv4 & IPv6 here without explicit strict strings)
app.listen(port, () => {
  console.log(`Static server dynamically bound and listening on port ${port}`);
});
  console.log(`Static asset server listening on port ${port} across all interfaces`);
});
