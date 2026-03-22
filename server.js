import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static assets from the pre-built dist folder
app.use(express.static(join(__dirname, 'dist')));

// Fallback to index.html for Single Page Application routing
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
// Explicitly bind to '::' to support Railway's IPv6 internal ingress mesh proxy
app.listen(port, '::', () => {
  console.log(`Static asset server listening on port ${port} across all interfaces`);
});
