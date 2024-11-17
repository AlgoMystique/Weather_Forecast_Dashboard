import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const result = dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

if (result.error) {
  throw new Error(`Error loading .env file: ${result.error.message}`);
}

interface Config {
  API_KEY: string;
  API_BASE_URL: string;
  PORT: number;
}

const config: Config = {
  API_KEY: process.env.API_KEY || '',
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.openweathermap.org',
  PORT: parseInt(process.env.PORT || '3001', 10)
};

// Validate config
if (!config.API_KEY) {
  throw new Error('API_KEY is required in .env file');
}

if (!config.API_BASE_URL) {
  throw new Error('API_BASE_URL is required in .env file');
}

export default config;