import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import routes from './routes/index.js';

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Catch-all route
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
  console.log('Environment loaded:', {
    API_KEY: config.API_KEY ? 'Present' : 'Missing',
    API_BASE_URL: config.API_BASE_URL
  });
});