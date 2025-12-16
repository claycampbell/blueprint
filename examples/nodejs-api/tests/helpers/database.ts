/**
 * Database test helpers
 * Provides utilities for setting up and tearing down test data
 */

import { pool, query } from '../../src/config/database';

/**
 * Clear all data from test database tables
 * Use this in beforeEach/afterEach hooks to ensure clean test state
 */
export async function clearAllTables(): Promise<void> {
  await query('TRUNCATE TABLE connect2.projects CASCADE');
  await query('TRUNCATE TABLE connect2.contacts CASCADE');
  await query('TRUNCATE TABLE connect2.users CASCADE');
  await query('TRUNCATE TABLE connect2.documents CASCADE');
  await query('TRUNCATE TABLE connect2.tasks CASCADE');
  await query('TRUNCATE TABLE connect2.audit_log CASCADE');
}

/**
 * Close database connection pool
 * Use this in afterAll hooks to prevent Jest from hanging
 */
export async function closeDatabaseConnection(): Promise<void> {
  await pool.end();
}

/**
 * Begin a database transaction for testing
 * Returns a client that can be used for transactional tests
 */
export async function beginTransaction() {
  const client = await pool.connect();
  await client.query('BEGIN');
  return client;
}

/**
 * Rollback a database transaction
 * Use this to undo changes made during a test
 */
export async function rollbackTransaction(client: any): Promise<void> {
  await client.query('ROLLBACK');
  client.release();
}

/**
 * Seed test users into the database
 * Returns array of created user IDs
 */
export async function seedTestUsers(count: number = 3): Promise<string[]> {
  const userIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const result = await query(
      `INSERT INTO connect2.users (email, first_name, last_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [
        `testuser${i}@example.com`,
        `Test${i}`,
        `User${i}`,
        i === 0 ? 'admin' : 'user'
      ]
    );
    userIds.push(result.rows[0].id);
  }

  return userIds;
}

/**
 * Seed test contacts into the database
 * Returns array of created contact IDs
 */
export async function seedTestContacts(count: number = 2): Promise<string[]> {
  const contactIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const result = await query(
      `INSERT INTO connect2.contacts (first_name, last_name, email, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [
        `Contact${i}`,
        `LastName${i}`,
        `contact${i}@example.com`,
        `555-010${i}`
      ]
    );
    contactIds.push(result.rows[0].id);
  }

  return contactIds;
}

/**
 * Check if a table exists in the database
 */
export async function tableExists(tableName: string): Promise<boolean> {
  const result = await query(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'connect2'
      AND table_name = $1
    )`,
    [tableName]
  );
  return result.rows[0].exists;
}

/**
 * Get row count for a table
 */
export async function getTableRowCount(tableName: string): Promise<number> {
  const result = await query(`SELECT COUNT(*) FROM connect2.${tableName}`);
  return parseInt(result.rows[0].count);
}
