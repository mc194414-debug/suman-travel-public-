import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { requestLogger, logger } from './middlewares/logger';
import router from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate Limiter: 100 requests per minute general
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_ERROR',
      message: 'Too many requests, please try again later.'
    }
  }
});
app.use(limiter);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Register API Router
app.use('/api/v1', router);

// Root API Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Suman Travels Backend API',
    health: '/health',
    api: '/api/v1',
    version: '1.0.0'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy', timestamp: new Date() });
});

// Start Server
app.listen(PORT, () => {
  logger.info(`Suman Travels backend listening on port ${PORT}`);
});
