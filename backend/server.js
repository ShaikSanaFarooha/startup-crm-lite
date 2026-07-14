 import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

// Database & Utilities
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Load environment variables (supports .env and custom .env file names)
dotenv.config();
dotenv.config({ path: './.env file' });

/**
 * Validate that all required configuration variables are present in the environment on boot.
 * Shuts down the process if any variables are missing.
 */
const checkRequiredEnvVars = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('CRITICAL: Missing required environment variables on startup:', missing.join(', '));
    process.exit(1);
  }
};

// Run environment validations before initiating database connections
checkRequiredEnvVars();

// Initialize Express application
const app = express();

/**
 * Security & Request Processing Middleware
 */

// Secure Express applications by setting various HTTP response headers
app.use(helmet());

// Dynamic Request Logging: Use 'combined' format in production, 'dev' format in local development
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Configured CORS settings supporting dev defaults and production staging domains
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://startup-crm-lite-8avalq2ul-shaik-sana-farooha.vercel.app',
  'https://startup-crm-lite-six.vercel.app',
  'http://localhost:5173',
];

const corsOptions = {
  origin: (origin, callback) => {
    // In local development or server-to-server calls, origin might be undefined
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser: parse JSON bodies with a security size limit configuration
app.use(express.json({ limit: '10kb' }));

// URL-encoded body parser: parse application/x-www-form-urlencoded payloads
app.use(express.urlencoded({ extended: true }));

// Express 5 query getter override to allow express-mongo-sanitize to work on req.query
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

// Purge NoSQL injections: Sanitize req.body, req.query, and req.params
app.use(mongoSanitize());

/**
 * Rate Limiting Definitions
 */

// General Rate Limiter: 100 requests per 15 minutes window
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

// Stricter Auth Rate Limiter: 10 attempts per 15 minutes window on /api/auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many auth attempts.',
});

// Apply limiting rules to designated route groups
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

/**
 * Route Handlers
 */

// Application Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
  });
});

// Bind route handlers
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Register Global Error Handling Middleware last (after all routes)
app.use(errorHandler);

/**
 * Start Database connection and Boot Server
 */
const startServer = async () => {
  // Connect to database
  await connectDB();

 const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
};

startServer();

/**
 * Graceful Shutdown Handling
 */
const handleShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Server shutting down gracefully...`);
  try {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during Mongoose connection closure:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
