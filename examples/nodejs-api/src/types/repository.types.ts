/**
 * Repository Type Definitions
 *
 * Type definitions for the repository layer, including pagination,
 * sorting, and filtering options used across all repositories.
 */

import { PoolClient } from 'pg';

/**
 * Sort order for query results
 */
export type SortOrder = 'ASC' | 'DESC';

/**
 * Base entity interface - all database entities must have these fields
 */
export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

/**
 * Sorting options for queries
 *
 * @example
 * { field: 'created_at', order: 'DESC' }
 * { field: 'name', order: 'ASC' }
 */
export interface SortOptions {
  /** The field name to sort by (must be a valid column in the entity) */
  field: string;
  /** Sort order - ascending or descending */
  order: SortOrder;
}

/**
 * Pagination options for list queries
 *
 * @example
 * { page: 1, limit: 20 } // First page, 20 items
 * { page: 3, limit: 50 } // Third page, 50 items
 */
export interface PaginationOptions {
  /** Page number (1-indexed) */
  page: number;
  /** Number of items per page */
  limit: number;
}

/**
 * Combined find options including pagination and sorting
 *
 * @example
 * {
 *   page: 1,
 *   limit: 20,
 *   sortBy: 'created_at',
 *   sortOrder: 'DESC'
 * }
 */
export interface FindOptions {
  /** Page number (1-indexed), defaults to 1 */
  page?: number;
  /** Items per page, defaults to 20 */
  limit?: number;
  /** Field to sort by, defaults to 'created_at' */
  sortBy?: string;
  /** Sort order, defaults to 'DESC' */
  sortOrder?: SortOrder;
  /** Whether to include soft-deleted records, defaults to false */
  includeDeleted?: boolean;
}

/**
 * Pagination metadata returned with paginated results
 */
export interface PaginationMeta {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of items across all pages */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPreviousPage: boolean;
}

/**
 * Paginated result wrapper
 *
 * Contains the items for the current page plus pagination metadata.
 *
 * @template T - The entity type being paginated
 *
 * @example
 * const result: PaginatedResult<Project> = await projectRepo.findAll({ page: 1, limit: 20 })
 * console.log(result.items) // Array of Project entities
 * console.log(result.meta.total) // Total count
 */
export interface PaginatedResult<T> {
  /** Array of items for the current page */
  items: T[];
  /** Pagination metadata */
  meta: PaginationMeta;
}

/**
 * Generic filter conditions for WHERE clauses
 *
 * @example
 * { status: 'ACTIVE', city: 'Seattle' }
 * { assigned_to: userId, deleted_at: null }
 */
export type FilterConditions = Record<string, any>;

/**
 * Transaction callback function signature
 *
 * Used with the transaction() method to execute multiple operations
 * within a single database transaction.
 *
 * @template R - The return type of the transaction
 *
 * @example
 * const result = await repo.transaction(async (client) => {
 *   const project = await client.query('INSERT INTO projects...')
 *   const feasibility = await client.query('INSERT INTO feasibility...')
 *   return project.rows[0]
 * })
 */
export type TransactionCallback<R> = (client: PoolClient) => Promise<R>;

/**
 * Find one options for fetching a single record
 */
export interface FindOneOptions {
  /** Filter conditions for WHERE clause */
  where: FilterConditions;
  /** Whether to include soft-deleted records */
  includeDeleted?: boolean;
}

/**
 * Count options for counting records
 */
export interface CountOptions {
  /** Filter conditions for WHERE clause */
  where?: FilterConditions;
  /** Whether to include soft-deleted records */
  includeDeleted?: boolean;
}

/**
 * Query builder helper for constructing SQL WHERE clauses
 */
export interface WhereClause {
  /** SQL WHERE clause string (e.g., "status = $1 AND city = $2") */
  clause: string;
  /** Parameter values for the WHERE clause */
  params: any[];
}
