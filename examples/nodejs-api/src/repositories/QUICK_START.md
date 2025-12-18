# BaseRepository Quick Start Guide

## Installation Complete ✅

The repository pattern is now available in your project. Here's how to use it.

## Quick Example

```typescript
import { BaseRepository } from './repositories';
import { Project } from './types';

class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super('projects', 'connect2');
  }

  async findByCity(city: string): Promise<Project[]> {
    return this.findByConditions({ city });
  }
}

const projectRepo = new ProjectRepository();

// List projects with pagination
const results = await projectRepo.findAll({
  page: 1,
  limit: 20,
  sortBy: 'created_at',
  sortOrder: 'DESC'
});

// Get single project
const project = await projectRepo.findById('uuid-here');

// Create project
const newProject = await projectRepo.create({
  address: '123 Main St',
  city: 'Seattle',
  status: 'LEAD'
});

// Update project
const updated = await projectRepo.update('uuid-here', {
  status: 'FEASIBILITY'
});

// Soft delete (reversible)
await projectRepo.softDelete('uuid-here');

// Restore
await projectRepo.restore('uuid-here');
```

## Common Patterns

### Find with Filters
```typescript
// Find all active projects in Seattle
const projects = await repo.findByConditions({
  status: 'ACTIVE',
  city: 'Seattle'
});

// Find with IN clause
const projects = await repo.findByConditions({
  status: ['LEAD', 'FEASIBILITY', 'GO']
});
```

### Pagination
```typescript
const result = await repo.findAll({ page: 1, limit: 20 });

console.log(result.items);        // Array of entities
console.log(result.meta.total);   // Total count
console.log(result.meta.hasNextPage);  // true/false
```

### Transactions
```typescript
const result = await repo.transaction(async (client) => {
  const project = await client.query(
    'INSERT INTO projects (address) VALUES ($1) RETURNING *',
    ['123 Main St']
  );

  await client.query(
    'INSERT INTO feasibility (project_id) VALUES ($1)',
    [project.rows[0].id]
  );

  return project.rows[0];
});
```

### Error Handling
```typescript
import { NotFoundException, ValidationException } from './exceptions';

try {
  const project = await repo.findById('invalid-id');
} catch (error) {
  if (error instanceof NotFoundException) {
    res.status(404).json({ error: error.message });
  } else if (error instanceof ValidationException) {
    res.status(400).json({ error: error.message });
  }
}
```

## Available Files

```
src/
├── exceptions/
│   ├── NotFoundException.ts      - 404 errors
│   ├── ValidationException.ts    - 400 errors
│   ├── DatabaseException.ts      - 500 errors
│   └── index.ts
│
├── types/
│   └── repository.types.ts       - PaginatedResult, FindOptions, etc.
│
└── repositories/
    ├── BaseRepository.ts          - Generic base repository
    ├── index.ts                   - Exports
    ├── README.md                  - Full documentation
    ├── QUICK_START.md             - This file
    └── ProjectRepository.example.ts  - Working example
```

## Next Steps

1. **Create your entity repository** - Extend BaseRepository<YourEntity>
2. **Add custom methods** - Business-specific queries
3. **Use in services** - Import and use in service layer
4. **Handle errors** - Catch typed exceptions

## Need Help?

- **Full Documentation**: [README.md](./README.md)
- **Working Example**: [ProjectRepository.example.ts](./ProjectRepository.example.ts)
- **Implementation Plan**: [PHASE_B_IMPLEMENTATION_PLAN.md](../../PHASE_B_IMPLEMENTATION_PLAN.md)
- **Architecture Guide**: [REPOSITORY_ARCHITECTURE.md](../../REPOSITORY_ARCHITECTURE.md)
