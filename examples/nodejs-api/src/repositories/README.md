# Repository Layer - Connect 2.0 API

This directory contains the data access layer using the **Repository Pattern**.

## Architecture

```
┌─────────────────────────────────────────┐
│         Service Layer                   │
│  (Business Logic)                       │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│       Repository Layer                  │
│  ┌────────────────────────────────┐    │
│  │   BaseRepository<T>            │    │
│  │  - findAll()                   │    │
│  │  - findById()                  │    │
│  │  - create()                    │    │
│  │  - update()                    │    │
│  │  - delete()                    │    │
│  │  - softDelete()                │    │
│  │  - transaction()               │    │
│  └────────────────────────────────┘    │
│         ▲                               │
│         │ extends                       │
│  ┌──────┴────────┬──────────────┐      │
│  │ Project       │ Loan         │ ...  │
│  │ Repository    │ Repository   │      │
│  └───────────────┴──────────────┘      │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│         PostgreSQL Database             │
│  Schema: connect2                       │
└─────────────────────────────────────────┘
```

## BaseRepository

The `BaseRepository<T>` class provides common CRUD operations for all entities.

### Core Methods

```typescript
// Find all with pagination
const results = await repo.findAll({
  page: 1,
  limit: 20,
  sortBy: 'created_at',
  sortOrder: 'DESC'
})

// Find by ID
const entity = await repo.findById('uuid-here')

// Find one by conditions
const user = await repo.findOne({
  where: { email: 'user@example.com' }
})

// Create
const newEntity = await repo.create({
  name: 'Example',
  status: 'ACTIVE'
})

// Update
const updated = await repo.update('uuid-here', {
  status: 'COMPLETED'
})

// Soft delete (sets deleted_at timestamp)
await repo.softDelete('uuid-here')

// Hard delete (permanent)
await repo.delete('uuid-here')

// Restore soft-deleted
const restored = await repo.restore('uuid-here')
```

### Helper Methods

```typescript
// Check existence
const exists = await repo.exists({ email: 'user@example.com' })

// Count records
const total = await repo.count({
  where: { status: 'ACTIVE' }
})

// Find by conditions (no pagination)
const activeProjects = await repo.findByConditions({
  status: 'ACTIVE',
  city: 'Seattle'
})
```

### Transactions

Execute multiple operations within a single transaction:

```typescript
const result = await repo.transaction(async (client) => {
  // All queries use the same transaction
  const project = await client.query(
    'INSERT INTO connect2.projects (address, city) VALUES ($1, $2) RETURNING *',
    ['123 Main St', 'Seattle']
  )

  const feasibility = await client.query(
    'INSERT INTO connect2.feasibility (project_id) VALUES ($1) RETURNING *',
    [project.rows[0].id]
  )

  return project.rows[0]
})
```

## Creating Custom Repositories

Extend `BaseRepository` to create entity-specific repositories:

```typescript
import { BaseRepository } from './BaseRepository';
import { Project, ProjectStatus } from '../types';

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super('projects', 'connect2');
  }

  /**
   * Find projects by status
   */
  async findByStatus(status: ProjectStatus): Promise<Project[]> {
    return this.findByConditions({ status });
  }

  /**
   * Find projects in a specific city
   */
  async findByCity(city: string): Promise<Project[]> {
    return this.findByConditions({ city });
  }

  /**
   * Transition project status with validation
   */
  async transitionStatus(
    id: string,
    newStatus: ProjectStatus
  ): Promise<Project> {
    const project = await this.findById(id);
    if (!project) {
      throw new NotFoundException('Project', id);
    }

    // Add business logic validation here
    // e.g., validate allowed status transitions

    return this.update(id, { status: newStatus });
  }

  /**
   * Search projects by name (custom query)
   */
  async searchByName(query: string): Promise<Project[]> {
    const sql = `
      SELECT *
      FROM ${this.fullTableName}
      WHERE address ILIKE $1
      AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await this.executeQuery(sql, [`%${query}%`]);
    return result.rows as Project[];
  }
}
```

## Pagination

All `findAll()` calls return paginated results:

```typescript
interface PaginatedResult<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
```

Example response:
```json
{
  "items": [...],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 145,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

## Soft Deletes

By default, all queries **exclude soft-deleted records** (where `deleted_at IS NOT NULL`).

To include deleted records:
```typescript
// Find by ID including deleted
const entity = await repo.findById('uuid', true)

// Find all including deleted
const results = await repo.findAll({ includeDeleted: true })

// Count including deleted
const total = await repo.count({ includeDeleted: true })
```

To soft delete and restore:
```typescript
// Soft delete (sets deleted_at = CURRENT_TIMESTAMP)
await repo.softDelete('uuid')

// Restore (sets deleted_at = NULL)
await repo.restore('uuid')
```

## Error Handling

The repository layer throws typed exceptions:

```typescript
import {
  NotFoundException,
  ValidationException,
  DatabaseException
} from '../exceptions';

try {
  const project = await projectRepo.findById('invalid-uuid')
} catch (error) {
  if (error instanceof NotFoundException) {
    // 404 - Entity not found
    res.status(404).json({ error: error.message })
  } else if (error instanceof ValidationException) {
    // 400 - Invalid input
    res.status(400).json({ error: error.message })
  } else if (error instanceof DatabaseException) {
    // 500 - Database error
    res.status(500).json({ error: error.message })
  }
}
```

## Type Safety

All repository methods are fully typed:

```typescript
class ProjectRepository extends BaseRepository<Project> {
  // TypeScript knows the return type is Project
  async findById(id: string): Promise<Project | null>

  // TypeScript validates data matches Project shape
  async create(data: Partial<Project>): Promise<Project>

  // PaginatedResult is typed with Project
  async findAll(): Promise<PaginatedResult<Project>>
}
```

## Best Practices

1. **Keep repositories thin** - Only data access logic, no business rules
2. **Business logic in services** - Status transitions, validation, etc.
3. **Use transactions** - For multi-step operations that must succeed or fail together
4. **Soft delete by default** - Preserve audit trail unless data must be purged
5. **Paginate list queries** - Use `findAll()` with pagination, not `findByConditions()`
6. **Validate column names** - BaseRepository sanitizes all column names to prevent SQL injection
7. **Use parameterized queries** - All queries use `$1, $2` placeholders for safety

## Next Steps (Phase B)

Create entity-specific repositories:

- [ ] `ProjectRepository.ts` - Project-specific queries
- [ ] `LoanRepository.ts` - Loan with guarantor support
- [ ] `ContactRepository.ts` - Contact search
- [ ] `TaskRepository.ts` - Task management
- [ ] `DocumentRepository.ts` - Document operations
- [ ] `FeasibilityRepository.ts` - Feasibility operations
- [ ] `EntitlementRepository.ts` - Entitlement operations
- [ ] `DrawRepository.ts` - Draw management
- [ ] `UserRepository.ts` - User authentication
- [ ] `AuditLogRepository.ts` - Audit trail

See [PHASE_B_IMPLEMENTATION_PLAN.md](../../PHASE_B_IMPLEMENTATION_PLAN.md) for details.

---

**Implementation Status**: ✅ Phase B-1 Complete (BaseRepository + Types + Exceptions)

**Next**: Phase B-2 (Create entity-specific repositories - DP01-162)
