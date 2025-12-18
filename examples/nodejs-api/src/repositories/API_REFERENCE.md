# BaseRepository API Reference

Complete method reference for BaseRepository<T>.

## Table of Contents
- [Core Methods](#core-methods)
- [Helper Methods](#helper-methods)
- [Transaction Methods](#transaction-methods)
- [Type Definitions](#type-definitions)

---

## Core Methods

### `findAll(options?, conditions?)`

Find all records with pagination and filtering.

**Signature:**
```typescript
async findAll(
  options: FindOptions = {},
  conditions: FilterConditions = {}
): Promise<PaginatedResult<T>>
```

**Parameters:**
- `options.page` (number, default: 1) - Page number (1-indexed)
- `options.limit` (number, default: 20) - Items per page (max 100)
- `options.sortBy` (string, default: 'created_at') - Column to sort by
- `options.sortOrder` ('ASC' | 'DESC', default: 'DESC') - Sort direction
- `options.includeDeleted` (boolean, default: false) - Include soft-deleted records
- `conditions` (FilterConditions) - WHERE clause conditions

**Returns:** `Promise<PaginatedResult<T>>`
- `items`: T[] - Array of entities
- `meta.page`: number - Current page
- `meta.limit`: number - Items per page
- `meta.total`: number - Total item count
- `meta.totalPages`: number - Total page count
- `meta.hasNextPage`: boolean
- `meta.hasPreviousPage`: boolean

**Throws:**
- `ValidationException` - If page < 1 or limit not in [1, 100]
- `DatabaseException` - On query failure

**Example:**
```typescript
const results = await repo.findAll({
  page: 1,
  limit: 20,
  sortBy: 'created_at',
  sortOrder: 'DESC'
});

console.log(results.items);           // [Entity, Entity, ...]
console.log(results.meta.total);      // 145
console.log(results.meta.totalPages); // 8
```

---

### `findById(id, includeDeleted?)`

Find a single record by ID.

**Signature:**
```typescript
async findById(
  id: string,
  includeDeleted: boolean = false
): Promise<T | null>
```

**Parameters:**
- `id` (string) - Entity UUID
- `includeDeleted` (boolean, default: false) - Include soft-deleted records

**Returns:** `Promise<T | null>`
- The entity if found, null otherwise

**Throws:**
- `DatabaseException` - On query failure

**Example:**
```typescript
const project = await repo.findById('123e4567-e89b-12d3-a456-426614174000');

if (!project) {
  throw new NotFoundException('Project', id);
}
```

---

### `findOne(options)`

Find a single record matching conditions.

**Signature:**
```typescript
async findOne(options: FindOneOptions): Promise<T | null>
```

**Parameters:**
- `options.where` (FilterConditions) - Filter conditions
- `options.includeDeleted` (boolean, default: false) - Include soft-deleted records

**Returns:** `Promise<T | null>`
- The first matching entity, or null if none found

**Throws:**
- `DatabaseException` - On query failure

**Example:**
```typescript
const user = await repo.findOne({
  where: { email: 'user@example.com' }
});
```

---

### `findByConditions(conditions, includeDeleted?)`

Find all records matching conditions (no pagination).

**Signature:**
```typescript
async findByConditions(
  conditions: FilterConditions,
  includeDeleted: boolean = false
): Promise<T[]>
```

**Parameters:**
- `conditions` (FilterConditions) - Filter conditions
- `includeDeleted` (boolean, default: false) - Include soft-deleted records

**Returns:** `Promise<T[]>`
- Array of matching entities

**Throws:**
- `DatabaseException` - On query failure

**Example:**
```typescript
// Find all active projects in Seattle
const projects = await repo.findByConditions({
  status: 'ACTIVE',
  city: 'Seattle'
});

// Find with IN clause
const projects = await repo.findByConditions({
  status: ['LEAD', 'FEASIBILITY']
});
```

---

### `create(data)`

Create a new record.

**Signature:**
```typescript
async create(
  data: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>
): Promise<T>
```

**Parameters:**
- `data` (Partial<T>) - Entity data (id, timestamps auto-generated)

**Returns:** `Promise<T>`
- The created entity with generated id and timestamps

**Throws:**
- `DatabaseException` - On insert failure

**Example:**
```typescript
const project = await repo.create({
  address: '123 Main St',
  city: 'Seattle',
  status: ProjectStatus.LEAD
});

console.log(project.id);         // Auto-generated UUID
console.log(project.created_at); // Current timestamp
```

---

### `update(id, data)`

Update a record by ID.

**Signature:**
```typescript
async update(
  id: string,
  data: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>
): Promise<T>
```

**Parameters:**
- `id` (string) - Entity UUID
- `data` (Partial<T>) - Fields to update

**Returns:** `Promise<T>`
- The updated entity

**Throws:**
- `NotFoundException` - If entity not found
- `DatabaseException` - On update failure

**Example:**
```typescript
const updated = await repo.update('uuid-here', {
  status: ProjectStatus.GO,
  assigned_to: 'user-uuid'
});

console.log(updated.updated_at); // Auto-updated timestamp
```

---

### `delete(id)`

Hard delete a record (permanent).

**Signature:**
```typescript
async delete(id: string): Promise<void>
```

**Parameters:**
- `id` (string) - Entity UUID

**Returns:** `Promise<void>`

**Throws:**
- `NotFoundException` - If entity not found
- `DatabaseException` - On delete failure

**Warning:** This permanently removes the record. Use `softDelete()` for reversible deletes.

**Example:**
```typescript
await repo.delete('uuid-here'); // Permanent deletion
```

---

### `softDelete(id)`

Soft delete a record (sets deleted_at timestamp).

**Signature:**
```typescript
async softDelete(id: string): Promise<T>
```

**Parameters:**
- `id` (string) - Entity UUID

**Returns:** `Promise<T>`
- The soft-deleted entity

**Throws:**
- `NotFoundException` - If entity not found or already deleted
- `DatabaseException` - On update failure

**Example:**
```typescript
const deleted = await repo.softDelete('uuid-here');
console.log(deleted.deleted_at); // Current timestamp

// Entity now excluded from default queries
const found = await repo.findById('uuid-here'); // null

// But can be retrieved with includeDeleted flag
const found2 = await repo.findById('uuid-here', true); // Entity
```

---

### `restore(id)`

Restore a soft-deleted record.

**Signature:**
```typescript
async restore(id: string): Promise<T>
```

**Parameters:**
- `id` (string) - Entity UUID

**Returns:** `Promise<T>`
- The restored entity

**Throws:**
- `NotFoundException` - If entity not found or not deleted
- `DatabaseException` - On update failure

**Example:**
```typescript
await repo.softDelete('uuid-here');
// ... later ...
const restored = await repo.restore('uuid-here');
console.log(restored.deleted_at); // null
```

---

## Helper Methods

### `exists(conditions, includeDeleted?)`

Check if a record exists matching conditions.

**Signature:**
```typescript
async exists(
  conditions: FilterConditions,
  includeDeleted: boolean = false
): Promise<boolean>
```

**Parameters:**
- `conditions` (FilterConditions) - Filter conditions
- `includeDeleted` (boolean, default: false) - Include soft-deleted records

**Returns:** `Promise<boolean>`
- true if at least one matching record exists

**Throws:**
- `DatabaseException` - On query failure

**Example:**
```typescript
const exists = await repo.exists({ email: 'user@example.com' });
if (exists) {
  throw new ValidationException('Email already in use');
}
```

---

### `count(options?)`

Count records matching conditions.

**Signature:**
```typescript
async count(options: CountOptions = {}): Promise<number>
```

**Parameters:**
- `options.where` (FilterConditions) - Filter conditions
- `options.includeDeleted` (boolean, default: false) - Include soft-deleted records

**Returns:** `Promise<number>`
- Number of matching records

**Throws:**
- `DatabaseException` - On query failure

**Example:**
```typescript
const total = await repo.count();
const activeCount = await repo.count({
  where: { status: 'ACTIVE' }
});
```

---

## Transaction Methods

### `transaction(callback)`

Execute a callback within a database transaction.

**Signature:**
```typescript
async transaction<R>(
  callback: (client: PoolClient) => Promise<R>
): Promise<R>
```

**Parameters:**
- `callback` (function) - Function to execute within transaction
  - Receives `PoolClient` for executing queries
  - Must return Promise<R>

**Returns:** `Promise<R>`
- Result of the callback

**Throws:**
- `DatabaseException` - On transaction failure (auto ROLLBACK)

**Behavior:**
- Automatically executes BEGIN before callback
- Automatically executes COMMIT on success
- Automatically executes ROLLBACK on error
- Client released in finally block

**Example:**
```typescript
const result = await repo.transaction(async (client) => {
  // Create project
  const projectResult = await client.query(
    'INSERT INTO projects (address) VALUES ($1) RETURNING *',
    ['123 Main St']
  );
  const project = projectResult.rows[0];

  // Create feasibility
  await client.query(
    'INSERT INTO feasibility (project_id) VALUES ($1)',
    [project.id]
  );

  // Create audit log
  await client.query(
    'INSERT INTO audit_log (action, entity_id) VALUES ($1, $2)',
    ['PROJECT_CREATED', project.id]
  );

  return project;
  // Auto COMMIT if no error, ROLLBACK if any query fails
});
```

---

## Type Definitions

### `BaseEntity`

All entities must extend this interface.

```typescript
interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
```

---

### `PaginatedResult<T>`

Return type for paginated queries.

```typescript
interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

---

### `FindOptions`

Options for list queries.

```typescript
interface FindOptions {
  page?: number;           // Default: 1
  limit?: number;          // Default: 20, Max: 100
  sortBy?: string;         // Default: 'created_at'
  sortOrder?: SortOrder;   // Default: 'DESC'
  includeDeleted?: boolean; // Default: false
}
```

---

### `FilterConditions`

WHERE clause conditions.

```typescript
type FilterConditions = Record<string, any>

// Examples:
{ status: 'ACTIVE' }
{ status: 'ACTIVE', city: 'Seattle' }
{ id: ['uuid1', 'uuid2', 'uuid3'] } // IN clause
{ deleted_at: null }
```

---

## Protected Methods

These methods are available in derived repositories but not part of the public API.

### `buildWhereClause(conditions, includeDeleted)`

Build SQL WHERE clause from conditions.

**Returns:** `{ clause: string, params: any[] }`

---

### `sanitizeColumnName(columnName)`

Validate column name to prevent SQL injection.

**Throws:** `ValidationException` if invalid characters

---

### `executeQuery(query, params)`

Execute raw SQL query.

**Use in derived repositories for custom queries.**

**Example:**
```typescript
protected async searchByName(query: string): Promise<Project[]> {
  const sql = `
    SELECT * FROM ${this.fullTableName}
    WHERE address ILIKE $1
    AND deleted_at IS NULL
  `;
  const result = await this.executeQuery(sql, [`%${query}%`]);
  return result.rows as Project[];
}
```

---

## See Also

- [Quick Start Guide](./QUICK_START.md)
- [Full Documentation](./README.md)
- [Working Example](./ProjectRepository.example.ts)
- [Implementation Plan](../../PHASE_B_IMPLEMENTATION_PLAN.md)
