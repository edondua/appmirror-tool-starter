import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files with CORS headers (required for Module Federation)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files from dist
app.use(express.static(join(__dirname, 'dist')));

// Also serve from assets subfolder at root for remoteEntry.js
// This ensures /remoteEntry.js works in addition to /assets/remoteEntry.js
app.use(express.static(join(__dirname, 'dist/assets')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Tool server running on port ${PORT}`);
  console.log(`remoteEntry.js available at:`);
  console.log(`  - http://localhost:${PORT}/remoteEntry.js`);
  console.log(`  - http://localhost:${PORT}/assets/remoteEntry.js`);
});
