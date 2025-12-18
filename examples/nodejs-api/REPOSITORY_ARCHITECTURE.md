# Repository Pattern Architecture - Connect 2.0

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      API Routes Layer                        │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ ┌─────────┐            │
│  │Projects │ │  Loans  │ │ Tasks  │ │Documents│            │
│  └────┬────┘ └────┬────┘ └────┬───┘ └────┬────┘            │
│       │           │           │           │                  │
├───────┼───────────┼───────────┼───────────┼─────────────────┤
│       ▼           ▼           ▼           ▼                  │
│                   Service Layer (Business Logic)             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Project │ │   Loan   │ │   Task   │ │ Document │       │
│  │  Service │ │  Service │ │ Service  │ │ Service  │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       │            │            │            │               │
├───────┼────────────┼────────────┼────────────┼──────────────┤
│       ▼            ▼            ▼            ▼               │
│              Repository Layer (Data Access)                  │
│  ┌──────────────────────────────────────────────────┐       │
│  │              BaseRepository<T>                   │       │
│  │  ┌──────────────────────────────────────────┐   │       │
│  │  │ • findAll()  • create()  • update()      │   │       │
│  │  │ • findById() • delete()  • transaction() │   │       │
│  │  └──────────────────────────────────────────┘   │       │
│  └─────────────────────┬────────────────────────────┘       │
│                        │                                     │
│  ┌──────────┐ ┌───────┼────────┐ ┌──────────┐              │
│  │ Project  │ │   Loan│Repo    │ │   Task   │              │
│  │   Repo   │ │       ▼        │ │   Repo   │              │
│  └────┬─────┘ └────────────────┘ └────┬─────┘              │
│       │                                │                     │
├───────┼────────────────────────────────┼─────────────────────┤
│       ▼                                ▼                     │
│                    TypeORM Entity Layer                      │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ ┌─────────┐            │
│  │ Project │ │  Loan   │ │  Task  │ │Document │            │
│  │ Entity  │ │ Entity  │ │ Entity │ │ Entity  │            │
│  └────┬────┘ └────┬────┘ └────┬───┘ └────┬────┘            │
│       │           │           │           │                  │
├───────┼───────────┼───────────┼───────────┼─────────────────┤
│       ▼           ▼           ▼           ▼                  │
│                  PostgreSQL Database                         │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Schema: connect2                                 │       │
│  │ Tables: projects, loans, tasks, documents, etc. │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Example: Create Loan with Guarantors

```
1. POST /api/v1/loans
        │
        ▼
2. LoanRoute.create()
   - Validate CreateLoanDTO
   - Check authorization
        │
        ▼
3. LoanService.createLoanWithGuarantors()
   - Business validation
   - Start transaction
        │
        ▼
4. LoanRepository.transaction()
   - Create loan entity
   - Create guarantor relations
   - Commit transaction
        │
        ▼
5. Return created loan with relations
```

## Repository Method Patterns

### Basic CRUD (Inherited from BaseRepository)
```typescript
// All repositories get these for free
projectRepo.findAll({ page: 1, limit: 20 })
projectRepo.findById('uuid')
projectRepo.create({ name: 'New Project' })
projectRepo.update('uuid', { status: 'ACTIVE' })
projectRepo.delete('uuid')
```

### Custom Query Methods
```typescript
// ProjectRepository specific
projectRepo.findByStatus(ProjectStatus.FEASIBILITY)
projectRepo.findByCity('Seattle')
projectRepo.searchByName('Downtown')
projectRepo.transitionStatus('uuid', ProjectStatus.LOAN_ORIGINATION)

// LoanRepository specific
loanRepo.findByProject('project-uuid')
loanRepo.createWithGuarantors(loanData, ['contact-1', 'contact-2'])
loanRepo.calculateTotalDraws('loan-uuid')

// TaskRepository specific
taskRepo.findOverdue()
taskRepo.findByAssignee('user-uuid')
taskRepo.reassignTask('task-uuid', 'new-user-uuid')
```

## Transaction Support

```typescript
// Example: Complex operation with transaction
async createProjectWithFeasibility(
  projectData: CreateProjectDto,
  feasibilityData: CreateFeasibilityDto
): Promise<Project> {
  return this.projectRepository.transaction(async (manager) => {
    // All operations use same transaction
    const project = await manager.save(Project, projectData)

    const feasibility = await manager.save(Feasibility, {
      ...feasibilityData,
      project_id: project.id
    })

    const auditLog = await manager.save(AuditLog, {
      entity_type: 'PROJECT',
      entity_id: project.id,
      action: 'CREATE',
      user_id: currentUser.id,
      changes: { created: projectData }
    })

    return project
  })
}
```

## Error Handling Pattern

```typescript
// Repository throws typed errors
async findById(id: string): Promise<Project> {
  const project = await this.repository.findOne({ where: { id } })

  if (!project) {
    throw new NotFoundError(`Project ${id} not found`)
  }

  return project
}

// Service catches and handles
async getProject(id: string): Promise<ProjectDto> {
  try {
    const project = await this.projectRepo.findById(id)
    return this.mapToDto(project)
  } catch (error) {
    if (error instanceof NotFoundError) {
      // Log and re-throw with context
      logger.warn(`Project lookup failed: ${id}`)
      throw error
    }
    // Unexpected errors
    logger.error('Unexpected error in getProject', error)
    throw new InternalServerError('Failed to retrieve project')
  }
}

// Route returns appropriate HTTP response
router.get('/projects/:id', async (req, res, next) => {
  try {
    const project = await projectService.getProject(req.params.id)
    res.json(ApiResponse.success(project))
  } catch (error) {
    next(error) // Global error handler converts to HTTP response
  }
})
```

## Pagination Pattern

```typescript
// Request: GET /api/v1/projects?page=2&limit=20&sortBy=created_at&sortOrder=DESC

// Repository method
async findAll(options: PaginationOptions): Promise<PaginatedResult<Project>> {
  const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'DESC' } = options

  const [items, total] = await this.repository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
    order: { [sortBy]: sortOrder }
  })

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

// Response format
{
  "success": true,
  "data": {
    "items": [...],
    "meta": {
      "page": 2,
      "limit": 20,
      "total": 145,
      "totalPages": 8
    }
  }
}
```

## Relationship Loading Pattern

```typescript
// Selective relationship loading via query params
// GET /api/v1/projects/:id?include=feasibility,loans,tasks

async findByIdWithRelations(
  id: string,
  relations?: string[]
): Promise<Project> {
  const validRelations = ['feasibility', 'loans', 'tasks', 'documents']
  const includedRelations = relations?.filter(r => validRelations.includes(r)) || []

  return this.repository.findOne({
    where: { id },
    relations: includedRelations
  })
}
```

## Search Pattern (PostgreSQL Full-Text)

```typescript
// ContactRepository fuzzy search using pg_trgm
async search(query: string): Promise<Contact[]> {
  return this.repository
    .createQueryBuilder('contact')
    .where(
      `(
        contact.name % :query OR
        contact.email % :query OR
        contact.company % :query OR
        contact.phone % :query
      )`,
      { query }
    )
    .orderBy('similarity(contact.name, :query)', 'DESC')
    .limit(20)
    .getMany()
}
```

## Audit Trail Pattern

```typescript
// Automatic audit logging via repository
async update(id: string, data: UpdateProjectDto): Promise<Project> {
  const before = await this.findById(id)
  const after = await super.update(id, data)

  await this.auditLogRepo.create({
    entity_type: 'PROJECT',
    entity_id: id,
    action: 'UPDATE',
    user_id: this.currentUser.id,
    changes: {
      before: before,
      after: after
    }
  })

  return after
}
```

---

## Key Decisions

1. **Repository Pattern**: Clean separation of data access from business logic
2. **Service Layer**: All business logic in services, not in routes or repositories
3. **DTOs**: Separate objects for request/response vs database entities
4. **Transactions**: Explicit transaction management for multi-step operations
5. **Error Types**: Custom error classes with HTTP status codes
6. **Pagination**: Consistent pagination across all list endpoints
7. **Soft Deletes**: Never hard delete, use deleted_at timestamp

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>