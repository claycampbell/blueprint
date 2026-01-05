import { DataSource } from 'typeorm';
import { dataSourceOptions } from './src/config/typeorm';
import * as dotenv from 'dotenv';

/**
 * TypeORM CLI Configuration
 *
 * This file exports the DataSource for TypeORM CLI commands.
 * It is used by migration generation, migration running, and schema operations.
 *
 * Usage:
 *   npm run typeorm migration:generate -- -n MigrationName
 *   npm run migration:run
 *   npm run migration:revert
 *   npm run schema:sync
 *
 * The CLI will automatically load this configuration file.
 */

// Load environment variables from .env file
dotenv.config();

// Export the DataSource for TypeORM CLI
export default new DataSource(dataSourceOptions);
