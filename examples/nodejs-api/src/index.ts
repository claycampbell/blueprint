/**
 * Connect 2.0 API - Express Application Entry Point
 *
 * Main application server with middleware configuration, route mounting,
 * error handling, and graceful shutdown.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js';
import { closePool } from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// ====================
// MIDDLEWARE
// ====================

// Security middleware - sets various HTTP headers
app.use(helmet());

// CORS middleware - allows cross-origin requests
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (NODE_ENV === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });
}

// ====================
// HEALTH CHECK
// ====================

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      uptime: process.uptime(),
    },
  });
});

// ====================
// API ROUTES
// ====================

app.use('/api/v1/projects', projectRoutes);

// ====================
// 404 HANDLER
// ====================

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// ====================
// ERROR HANDLING
// ====================

interface ErrorWithStatus extends Error {
  status?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Unhandled error:', err);

  const status = err.status || 500;
  const message = NODE_ENV === 'production' ? 'Internal Server Error' : err.message;

  res.status(status).json({
    success: false,
    error: message,
    ...(NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// ====================
// SERVER STARTUP
// ====================

const server = app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('  Connect 2.0 API Server');
  console.log('========================================');
  console.log(`Environment:  ${NODE_ENV}`);
  console.log(`Port:         ${PORT}`);
  console.log(`URL:          http://localhost:${PORT}`);
  console.log(`Health:       http://localhost:${PORT}/health`);
  console.log(`API Base:     http://localhost:${PORT}/api/v1`);
  console.log('========================================');
  console.log('');
  console.log('✅ Server started successfully');
  console.log('');
});

// ====================
// GRACEFUL SHUTDOWN
// ====================

const shutdown = async () => {
  console.log('');
  console.log('⚠️  Shutting down gracefully...');

  // Close HTTP server
  server.close(() => {
    console.log('🔌 HTTP server closed');
  });

  // Close database pool
  try {
    await closePool();
  } catch (error) {
    console.error('❌ Error closing database pool:', error);
  }

  console.log('✅ Shutdown complete');
  process.exit(0);
};

// Handle shutdown signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  shutdown();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown();
});

export default app;
