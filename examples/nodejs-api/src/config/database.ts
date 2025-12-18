/**
 * PostgreSQL Database Configuration
 * Manages connection pool for Connect 2.0 database using pg library
 */

import pkg, { PoolClient, QueryResult } from 'pg';
const { Pool } = pkg;

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'connect2_dev',
  user: process.env.DB_USER || 'connect_user',
  password: process.env.DB_PASSWORD || 'connect_dev_password',

  // Connection pool settings
  max: parseInt(process.env.DB_POOL_MAX || '20', 10), // Maximum pool size
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if no connection available

  // Schema search path
  options: '-c search_path=connect2,public',
};

// Create the connection pool
export const pool = new Pool(dbConfig);

// Log pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle database client', err);
  process.exit(-1);
});

// Test the connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(-1);
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
export const query = async (text: string, params?: unknown[]): Promise<QueryResult> => {
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
  } catch (error) {
    const err = error as Error;
    console.error('❌ Query error:', {
      query: text,
      error: err.message
    });
    throw error;
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
 * @returns {Promise} Transaction result
 */
export const transaction = async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
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
