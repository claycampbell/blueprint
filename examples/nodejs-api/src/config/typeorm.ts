import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

/**
 * TypeORM configuration for Connect 2.0 Platform API.
 *
 * This configuration is used for both runtime database connections
 * and TypeORM CLI operations (migrations, schema sync, etc.).
 *
 * Environment Variables:
 * - DB_HOST: Database host (default: localhost)
 * - DB_PORT: Database port (default: 5432)
 * - DB_USERNAME: Database username (default: postgres)
 * - DB_PASSWORD: Database password (default: postgres)
 * - DB_NAME: Database name (default: connect2_dev)
 * - DB_SCHEMA: Database schema (default: connect2)
 * - NODE_ENV: Environment (development, production, test)
 */

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'connect2_dev',
  schema: process.env.DB_SCHEMA || 'connect2',

  // Entity configuration
  entities: [path.join(__dirname, '..', 'entities', '**', '*.entity.{ts,js}')],

  // Migration configuration
  migrations: [path.join(__dirname, '..', '..', 'migrations', '**', '*.{ts,js}')],

  // Synchronization settings
  // WARNING: Never use synchronize in production - use migrations instead
  synchronize: false,

  // Logging configuration
  // Enable detailed logging in development for debugging
  logging: isDevelopment ? ['query', 'error', 'warn'] : ['error'],

  // Connection pool configuration
  poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),

  // Additional options
  extra: {
    // Connection timeout in milliseconds
    connectionTimeoutMillis: 5000,
    // Idle timeout in milliseconds (10 minutes)
    idleTimeoutMillis: 600000,
  },

  // SSL configuration for production
  ssl: isProduction
    ? {
        rejectUnauthorized: true,
      }
    : false,
};

/**
 * TypeORM DataSource instance for runtime database operations.
 *
 * Usage:
 * ```typescript
 * import { AppDataSource } from './config/typeorm';
 *
 * // Initialize the data source
 * await AppDataSource.initialize();
 *
 * // Get a repository
 * const userRepo = AppDataSource.getRepository(User);
 *
 * // Perform database operations
 * const users = await userRepo.find();
 * ```
 */
export const AppDataSource = new DataSource(dataSourceOptions);

/**
 * Initialize the TypeORM connection.
 *
 * This function should be called once during application startup.
 * It handles connection initialization and provides detailed error logging.
 *
 * @returns Promise that resolves when connection is established
 * @throws Error if connection fails
 */
export async function initializeDatabase(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connection initialized successfully');
      const host = process.env.DB_HOST || 'localhost';
      const port = process.env.DB_PORT || '5432';
      const database = process.env.DB_NAME || 'connect2_dev';
      const schema = process.env.DB_SCHEMA || 'connect2';
      console.log(`Connected to: ${host}:${port}/${database}`);
      console.log(`Schema: ${schema}`);
    }
  } catch (error) {
    console.error('Error initializing database connection:', error);
    throw error;
  }
}

/**
 * Close the TypeORM connection.
 *
 * This function should be called during application shutdown
 * to ensure proper cleanup of database connections.
 *
 * @returns Promise that resolves when connection is closed
 */
export async function closeDatabase(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed successfully');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
}
