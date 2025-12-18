/**
 * BaseRepository
 *
 * Generic base repository class providing common CRUD operations, pagination,
 * and transaction support for all entity repositories.
 *
 * This class uses the pg (node-postgres) library directly for maximum control
 * and performance, while providing a clean abstraction layer similar to TypeORM.
 *
 * @template T - The entity type this repository manages (must extend BaseEntity)
 *
 * @example
 * class ProjectRepository extends BaseRepository<Project> {
 *   constructor() {
 *     super('projects', 'connect2'); // table name, schema
 *   }
 *
 *   async findByStatus(status: ProjectStatus): Promise<Project[]> {
 *     return this.findByConditions({ status });
 *   }
 * }
 */

import { Pool, PoolClient, QueryResult } from 'pg';
import { pool, getClient } from '../config/database';
import {
  BaseEntity,
  PaginatedResult,
  PaginationMeta,
  FindOptions,
  FindOneOptions,
  CountOptions,
  FilterConditions,
  TransactionCallback,
  WhereClause,
  SortOrder,
} from '../types/repository.types';
import {
  NotFoundException,
  ValidationException,
  DatabaseException,
} from '../exceptions';

export abstract class BaseRepository<T extends BaseEntity> {
  protected pool: Pool;
  protected tableName: string;
  protected schema: string;
  protected fullTableName: string;

  /**
   * Create a BaseRepository
   * @param tableName - The database table name (e.g., 'projects', 'loans')
   * @param schema - The database schema name (defaults to 'connect2')
   */
  constructor(tableName: string, schema: string = 'connect2') {
    this.pool = pool;
    this.tableName = tableName;
    this.schema = schema;
    this.fullTableName = `${schema}.${tableName}`;
  }

  /**
   * Find all records with pagination and filtering
   *
   * @param options - Pagination, sorting, and filtering options
   * @param conditions - Additional WHERE clause conditions
   * @returns Paginated results
   *
   * @example
   * const results = await repo.findAll({
   *   page: 1,
   *   limit: 20,
   *   sortBy: 'created_at',
   *   sortOrder: 'DESC'
   * })
   */
  async findAll(
    options: FindOptions = {},
    conditions: FilterConditions = {}
  ): Promise<PaginatedResult<T>> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      includeDeleted = false,
    } = options;

    // Validate inputs
    if (page < 1) {
      throw new ValidationException('Page number must be >= 1');
    }
    if (limit < 1 || limit > 100) {
      throw new ValidationException('Limit must be between 1 and 100');
    }

    try {
      // Build WHERE clause
      const whereClause = this.buildWhereClause(conditions, includeDeleted);
      const offset = (page - 1) * limit;

      // Execute count query
      const countQuery = `
        SELECT COUNT(*) as total
        FROM ${this.fullTableName}
        ${whereClause.clause ? `WHERE ${whereClause.clause}` : ''}
      `;
      const countResult = await this.pool.query(countQuery, whereClause.params);
      const total = parseInt(countResult.rows[0].total, 10);

      // Execute data query with pagination
      const dataQuery = `
        SELECT *
        FROM ${this.fullTableName}
        ${whereClause.clause ? `WHERE ${whereClause.clause}` : ''}
        ORDER BY ${this.sanitizeColumnName(sortBy)} ${sortOrder}
        LIMIT $${whereClause.params.length + 1}
        OFFSET $${whereClause.params.length + 2}
      `;
      const dataResult = await this.pool.query(dataQuery, [
        ...whereClause.params,
        limit,
        offset,
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const meta: PaginationMeta = {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };

      return {
        items: dataResult.rows as T[],
        meta,
      };
    } catch (error) {
      throw new DatabaseException(
        `Failed to fetch ${this.tableName}`,
        error as Error,
        { page, limit, sortBy, sortOrder, conditions }
      );
    }
  }

  /**
   * Find a single record by ID
   *
   * @param id - The record ID (UUID)
   * @param includeDeleted - Whether to include soft-deleted records
   * @returns The entity or null if not found
   *
   * @example
   * const project = await repo.findById('123e4567-e89b-12d3-a456-426614174000')
   */
  async findById(id: string, includeDeleted: boolean = false): Promise<T | null> {
    try {
      const whereClause = this.buildWhereClause({ id }, includeDeleted);
      const query = `
        SELECT *
        FROM ${this.fullTableName}
        WHERE ${whereClause.clause}
        LIMIT 1
      `;
      const result = await this.pool.query(query, whereClause.params);

      return result.rows.length > 0 ? (result.rows[0] as T) : null;
    } catch (error) {
      throw new DatabaseException(
        `Failed to find ${this.tableName} by ID`,
        error as Error,
        { id }
      );
    }
  }

  /**
   * Find a single record matching conditions
   *
   * @param options - Find options with WHERE conditions
   * @returns The entity or null if not found
   *
   * @example
   * const user = await repo.findOne({ where: { email: 'user@example.com' } })
   */
  async findOne(options: FindOneOptions): Promise<T | null> {
    try {
      const { where, includeDeleted = false } = options;
      const whereClause = this.buildWhereClause(where, includeDeleted);

      const query = `
        SELECT *
        FROM ${this.fullTableName}
        WHERE ${whereClause.clause}
        LIMIT 1
      `;
      const result = await this.pool.query(query, whereClause.params);

      return result.rows.length > 0 ? (result.rows[0] as T) : null;
    } catch (error) {
      throw new DatabaseException(
        `Failed to find ${this.tableName}`,
        error as Error,
        { options }
      );
    }
  }

  /**
   * Find all records matching conditions (no pagination)
   *
   * @param conditions - Filter conditions
   * @param includeDeleted - Whether to include soft-deleted records
   * @returns Array of entities
   *
   * @example
   * const projects = await repo.findByConditions({ status: 'ACTIVE', city: 'Seattle' })
   */
  async findByConditions(
    conditions: FilterConditions,
    includeDeleted: boolean = false
  ): Promise<T[]> {
    try {
      const whereClause = this.buildWhereClause(conditions, includeDeleted);
      const query = `
        SELECT *
        FROM ${this.fullTableName}
        ${whereClause.clause ? `WHERE ${whereClause.clause}` : ''}
        ORDER BY created_at DESC
      `;
      const result = await this.pool.query(query, whereClause.params);

      return result.rows as T[];
    } catch (error) {
      throw new DatabaseException(
        `Failed to find ${this.tableName} by conditions`,
        error as Error,
        { conditions }
      );
    }
  }

  /**
   * Create a new record
   *
   * @param data - Partial entity data (id, created_at, updated_at auto-generated)
   * @returns The created entity
   *
   * @example
   * const project = await repo.create({
   *   address: '123 Main St',
   *   city: 'Seattle',
   *   status: ProjectStatus.LEAD
   * })
   */
  async create(data: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>): Promise<T> {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

      const query = `
        INSERT INTO ${this.fullTableName} (${columns.join(', ')})
        VALUES (${placeholders})
        RETURNING *
      `;
      const result = await this.pool.query(query, values);

      return result.rows[0] as T;
    } catch (error) {
      throw new DatabaseException(
        `Failed to create ${this.tableName}`,
        error as Error,
        { data }
      );
    }
  }

  /**
   * Update a record by ID
   *
   * @param id - The record ID
   * @param data - Partial entity data to update
   * @returns The updated entity
   * @throws NotFoundException if record not found
   *
   * @example
   * const updated = await repo.update('123...', { status: ProjectStatus.GO })
   */
  async update(
    id: string,
    data: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<T> {
    try {
      // Check if record exists
      const existing = await this.findById(id);
      if (!existing) {
        throw new NotFoundException(this.tableName, id);
      }

      // Build SET clause
      const columns = Object.keys(data);
      const values = Object.values(data);
      const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');

      const query = `
        UPDATE ${this.fullTableName}
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${columns.length + 1}
        RETURNING *
      `;
      const result = await this.pool.query(query, [...values, id]);

      return result.rows[0] as T;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new DatabaseException(
        `Failed to update ${this.tableName}`,
        error as Error,
        { id, data }
      );
    }
  }

  /**
   * Hard delete a record by ID
   *
   * WARNING: This permanently removes the record from the database.
   * Consider using softDelete() instead to maintain audit trail.
   *
   * @param id - The record ID
   * @throws NotFoundException if record not found
   *
   * @example
   * await repo.delete('123...') // Permanently removes record
   */
  async delete(id: string): Promise<void> {
    try {
      const query = `
        DELETE FROM ${this.fullTableName}
        WHERE id = $1
        RETURNING id
      `;
      const result = await this.pool.query(query, [id]);

      if (result.rowCount === 0) {
        throw new NotFoundException(this.tableName, id);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new DatabaseException(
        `Failed to delete ${this.tableName}`,
        error as Error,
        { id }
      );
    }
  }

  /**
   * Soft delete a record by ID (sets deleted_at timestamp)
   *
   * Soft-deleted records are excluded from queries by default,
   * but can be included with includeDeleted: true option.
   *
   * @param id - The record ID
   * @returns The soft-deleted entity
   * @throws NotFoundException if record not found
   *
   * @example
   * await repo.softDelete('123...') // Sets deleted_at to current timestamp
   */
  async softDelete(id: string): Promise<T> {
    try {
      const query = `
        UPDATE ${this.fullTableName}
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;
      const result = await this.pool.query(query, [id]);

      if (result.rowCount === 0) {
        throw new NotFoundException(this.tableName, id);
      }

      return result.rows[0] as T;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new DatabaseException(
        `Failed to soft delete ${this.tableName}`,
        error as Error,
        { id }
      );
    }
  }

  /**
   * Restore a soft-deleted record
   *
   * @param id - The record ID
   * @returns The restored entity
   * @throws NotFoundException if record not found or not deleted
   *
   * @example
   * await repo.restore('123...') // Sets deleted_at back to NULL
   */
  async restore(id: string): Promise<T> {
    try {
      const query = `
        UPDATE ${this.fullTableName}
        SET deleted_at = NULL, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NOT NULL
        RETURNING *
      `;
      const result = await this.pool.query(query, [id]);

      if (result.rowCount === 0) {
        throw new NotFoundException(`Deleted ${this.tableName}`, id);
      }

      return result.rows[0] as T;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new DatabaseException(
        `Failed to restore ${this.tableName}`,
        error as Error,
        { id }
      );
    }
  }

  /**
   * Check if a record exists matching conditions
   *
   * @param conditions - Filter conditions
   * @param includeDeleted - Whether to include soft-deleted records
   * @returns True if at least one matching record exists
   *
   * @example
   * const exists = await repo.exists({ email: 'user@example.com' })
   */
  async exists(
    conditions: FilterConditions,
    includeDeleted: boolean = false
  ): Promise<boolean> {
    try {
      const whereClause = this.buildWhereClause(conditions, includeDeleted);
      const query = `
        SELECT EXISTS (
          SELECT 1
          FROM ${this.fullTableName}
          WHERE ${whereClause.clause}
        ) as exists
      `;
      const result = await this.pool.query(query, whereClause.params);

      return result.rows[0].exists;
    } catch (error) {
      throw new DatabaseException(
        `Failed to check existence in ${this.tableName}`,
        error as Error,
        { conditions }
      );
    }
  }

  /**
   * Count records matching conditions
   *
   * @param options - Count options with optional WHERE conditions
   * @returns Number of matching records
   *
   * @example
   * const total = await repo.count({ where: { status: 'ACTIVE' } })
   */
  async count(options: CountOptions = {}): Promise<number> {
    try {
      const { where = {}, includeDeleted = false } = options;
      const whereClause = this.buildWhereClause(where, includeDeleted);

      const query = `
        SELECT COUNT(*) as total
        FROM ${this.fullTableName}
        ${whereClause.clause ? `WHERE ${whereClause.clause}` : ''}
      `;
      const result = await this.pool.query(query, whereClause.params);

      return parseInt(result.rows[0].total, 10);
    } catch (error) {
      throw new DatabaseException(
        `Failed to count ${this.tableName}`,
        error as Error,
        { options }
      );
    }
  }

  /**
   * Execute a callback function within a transaction
   *
   * Automatically handles BEGIN, COMMIT, and ROLLBACK.
   * All queries within the callback use the same database client.
   *
   * @template R - Return type of the transaction
   * @param callback - Function to execute within transaction
   * @returns Result of the callback
   *
   * @example
   * const result = await repo.transaction(async (client) => {
   *   const project = await client.query('INSERT INTO projects...')
   *   const feasibility = await client.query('INSERT INTO feasibility...')
   *   return project.rows[0]
   * })
   */
  async transaction<R>(callback: TransactionCallback<R>): Promise<R> {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new DatabaseException(
        `Transaction failed in ${this.tableName}`,
        error as Error
      );
    } finally {
      client.release();
    }
  }

  /**
   * Build a WHERE clause from filter conditions
   *
   * @private
   * @param conditions - Key-value pairs for WHERE clause
   * @param includeDeleted - Whether to include soft-deleted records
   * @returns WHERE clause string and parameter values
   */
  protected buildWhereClause(
    conditions: FilterConditions,
    includeDeleted: boolean = false
  ): WhereClause {
    const clauses: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Add filter conditions
    for (const [key, value] of Object.entries(conditions)) {
      if (value === null) {
        clauses.push(`${this.sanitizeColumnName(key)} IS NULL`);
      } else if (value === undefined) {
        // Skip undefined values
        continue;
      } else if (Array.isArray(value)) {
        // IN clause for arrays
        const placeholders = value.map(() => `$${paramIndex++}`).join(', ');
        clauses.push(`${this.sanitizeColumnName(key)} IN (${placeholders})`);
        params.push(...value);
      } else {
        clauses.push(`${this.sanitizeColumnName(key)} = $${paramIndex++}`);
        params.push(value);
      }
    }

    // Exclude soft-deleted records by default
    if (!includeDeleted) {
      clauses.push('deleted_at IS NULL');
    }

    return {
      clause: clauses.length > 0 ? clauses.join(' AND ') : '',
      params,
    };
  }

  /**
   * Sanitize column name to prevent SQL injection
   *
   * @private
   * @param columnName - The column name to sanitize
   * @returns Sanitized column name
   */
  protected sanitizeColumnName(columnName: string): string {
    // Only allow alphanumeric characters and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(columnName)) {
      throw new ValidationException(`Invalid column name: ${columnName}`);
    }
    return columnName;
  }

  /**
   * Execute a raw SQL query
   *
   * Use this for complex queries that don't fit the repository pattern.
   * Prefer using the type-safe methods above when possible.
   *
   * @protected
   * @param query - SQL query string
   * @param params - Query parameters
   * @returns Query result
   */
  protected async executeQuery(query: string, params: any[] = []): Promise<QueryResult> {
    try {
      return await this.pool.query(query, params);
    } catch (error) {
      throw new DatabaseException(
        `Query execution failed in ${this.tableName}`,
        error as Error,
        { query, params }
      );
    }
  }
}
