/**
 * PostgreSQL Database Configuration
 * Manages connection pool for Connect 2.0 database using pg library
 */

import pkg from 'pg';
const { Pool } = pkg;

// Database configuration from environment variables
// Note: Environment variables are validated at startup by validateEnvironment()
// No fallback defaults are provided - all required vars must be set in .env
const dbConfig = {
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!, 10),
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,

  // Connection pool settings
  max: parseInt(process.env.DB_POOL_MAX || '20', 10), // Maximum pool size (optional, defaults to 20)
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if no connection available

  // Schema search path
  options: `-c search_path=${process.env.DB_SCHEMA},public`,
};

// Create the connection pool
export const pool = new Pool(dbConfig);

/**
 * Log error with context for debugging
 */
function logError(errorId: string, context: any) {
  console.error(JSON.stringify({
    level: 'ERROR',
    errorId,
    timestamp: new Date().toISOString(),
    ...context
  }, null, 2));
}

/**
 * Generate unique error ID for tracking
 */
function generateErrorId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

// Log pool errors - don't exit immediately, implement circuit breaker pattern
pool.on('error', (err: any) => {
  const errorId = generateErrorId('DB_POOL');

  logError(errorId, {
    message: 'Database pool error - connection lost',
    error: err.message,
    code: err.code,
    host: dbConfig.host,
    database: dbConfig.database,
    severity: 'CRITICAL'
  });

  console.error(`
[CRITICAL] DATABASE POOL ERROR

An unexpected error occurred with an idle database client.
This usually indicates network connectivity issues or database server problems.

Error: ${err.message}
Code: ${err.code || 'N/A'}
Host: ${dbConfig.host}:${dbConfig.port}
Database: ${dbConfig.database}

Error ID: ${errorId}

The application will continue running but database operations may fail.
Check your database connection and network connectivity.
  `);

  // Don't exit immediately - allow graceful degradation
  // Process manager (PM2, Kubernetes) will restart if health checks fail
});

// Test the connection on startup
pool.query('SELECT NOW()', (err: Error & { code?: string }, res) => {
  if (err) {
    const errorId = generateErrorId('DB_STARTUP');

    logError(errorId, {
      message: 'Database connection failed at startup',
      error: err.message,
      code: err.code,
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user
    });

    console.error(`
[FATAL] DATABASE CONNECTION FAILED

Unable to connect to PostgreSQL database at startup.

Connection Details:
  Host: ${dbConfig.host}:${dbConfig.port}
  Database: ${dbConfig.database}
  User: ${dbConfig.user}

Error: ${err.message}
Error Code: ${err.code || 'N/A'}

Troubleshooting Steps:
  1. Verify PostgreSQL is running: sudo systemctl status postgresql
  2. Check connection credentials in .env file
  3. Verify network connectivity: telnet ${dbConfig.host} ${dbConfig.port}
  4. Check PostgreSQL logs for authentication failures
  5. Ensure database "${dbConfig.database}" exists: psql -l
  6. Verify schema "connect2" exists in database

Error ID: ${errorId}
    `);

    process.exit(1); // Exit with standard error code
  } else {
    console.log('✅ Database connected:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      timestamp: res.rows[0].now,
    });
  }
});

/**
 * Execute a query with connection from pool
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters (parameterized queries for security)
 * @returns {Promise} Query result
 */
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('🔍 Query executed', {
      duration: `${duration}ms`,
      rows: res.rowCount,
      query: text.substring(0, 100) + (text.length > 100 ? '...' : '')
    });
    return res;
  } catch (error: any) {
    const duration = Date.now() - start;
    const errorId = generateErrorId('DB_QUERY');

    logError(errorId, {
      message: 'Database query failed',
      query: text.substring(0, 500),
      params: params ? JSON.stringify(params).substring(0, 200) : null,
      errorCode: error.code,
      errorMessage: error.message,
      constraint: error.constraint,
      table: error.table,
      column: error.column,
      duration
    });

    // Translate PostgreSQL errors to user-friendly messages
    if (error.code === '23505') { // Unique violation
      const message = `A record with this ${error.column || 'value'} already exists. Please use a different value or update the existing record.`;
      const err: any = new Error(message);
      err.code = error.code;
      err.errorId = errorId;
      throw err;
    } else if (error.code === '23503') { // Foreign key violation
      const message = `Cannot complete operation - referenced record does not exist. Please ensure all related records exist first.`;
      const err: any = new Error(message);
      err.code = error.code;
      err.errorId = errorId;
      throw err;
    } else if (error.code === '57014') { // Query timeout
      const message = `Database query timeout - operation took too long. This may indicate a performance issue. Error ID: ${errorId}`;
      const err: any = new Error(message);
      err.code = error.code;
      err.errorId = errorId;
      throw err;
    } else {
      // Generic error with helpful context
      const err: any = new Error(`Database operation failed: ${error.message} (Error ID: ${errorId})`);
      err.code = error.code;
      err.errorId = errorId;
      err.originalError = error;
      throw err;
    }
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Database client
 */
export const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  // Set a timeout for client checkout
  const timeout = setTimeout(() => {
    console.error('❌ Client checkout timeout - client has been checked out for more than 5 seconds!');
  }, 5000);

  // Monkey patch the release method to clear timeout
  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
};

/**
 * Execute a transaction with automatic rollback on error
 * @param {Function} callback - Transaction callback function
 * @param {string} transactionName - Optional name for logging
 * @returns {Promise} Transaction result
 */
export const transaction = async (callback: (client: any) => Promise<any>, transactionName: string = 'unnamed') => {
  const client = await getClient();
  const transactionId = generateErrorId('TXN');
  const startTime = Date.now();

  console.log(`[TRANSACTION START] ${transactionName} (ID: ${transactionId})`);

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');

    const duration = Date.now() - startTime;
    console.log(`[TRANSACTION COMMIT] ${transactionName} (ID: ${transactionId}, Duration: ${duration}ms)`);

    return result;
  } catch (error: any) {
    await client.query('ROLLBACK');

    const duration = Date.now() - startTime;
    const errorId = generateErrorId('TXN_ROLLBACK');

    logError(errorId, {
      message: `Transaction "${transactionName}" rolled back`,
      transactionId,
      transactionName,
      duration,
      error: error.message,
      stack: error.stack
    });

    console.error(`
[TRANSACTION ROLLBACK] ${transactionName}

Transaction failed and was rolled back. All changes have been reverted.

Transaction ID: ${transactionId}
Error: ${error.message}
Duration: ${duration}ms
Error ID: ${errorId}

Please review the error and try again.
    `);

    const err: any = new Error(`Transaction "${transactionName}" failed: ${error.message} (Error ID: ${errorId})`);
    err.transactionId = transactionId;
    err.errorId = errorId;
    err.originalError = error;
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Gracefully close all connections in the pool
 */
export const closePool = async () => {
  await pool.end();
  console.log('🔌 Database pool closed');
};

export default {
  pool,
  query,
  getClient,
  transaction,
  closePool,
};
