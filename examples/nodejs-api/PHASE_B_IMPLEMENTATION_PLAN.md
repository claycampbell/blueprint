# Phase B & C Implementation Plan - Core Data Model
## Repository Pattern & API Routes

### Overview
This document outlines the implementation plan for Phase B (Data Access Layer) and Phase C (Complete API Surface) of the Connect 2.0 Core Data Model (Epic DP01-22).

**Branch**: `clay/dp01-22-core-data-model-phase-b`
**Timeline**: 20 hours total (Phase B: 9h, Phase C: 11h)

---

## Phase B: Data Access Layer (9 hours)

### DP01-162: Repository Pattern Implementation (5h)
**Priority**: HIGH - This is the foundation for all API routes
**Autonomy**: MEDIUM

#### Architecture Design
```
src/repositories/
├── BaseRepository.ts         # Generic base with CRUD + pagination
├── ProjectRepository.ts      # Project-specific queries
├── LoanRepository.ts        # Loan with guarantor support
├── ContactRepository.ts     # Contact with search
├── TaskRepository.ts        # Task management queries
├── DocumentRepository.ts    # Document queries
├── FeasibilityRepository.ts # Feasibility operations
├── EntitlementRepository.ts # Entitlement operations
├── DrawRepository.ts        # Draw management
├── UserRepository.ts        # User queries
├── AuditLogRepository.ts   # Audit trail
└── index.ts                # Export singleton instances
```

#### BaseRepository<T> Interface
```typescript
interface BaseRepository<T extends BaseEntity> {
  // Core CRUD
  findAll(options?: FindOptions<T>): Promise<PaginatedResult<T>>
  findById(id: string): Promise<T | null>
  findOne(conditions: FindOneOptions<T>): Promise<T | null>
  create(data: DeepPartial<T>): Promise<T>
  update(id: string, data: DeepPartial<T>): Promise<T>
  delete(id: string): Promise<void>
  softDelete(id: string): Promise<void>

  // Advanced
  transaction<R>(work: (em: EntityManager) => Promise<R>): Promise<R>
  exists(conditions: FindConditions<T>): Promise<boolean>
  count(conditions?: FindConditions<T>): Promise<number>

  // Pagination helper
  paginate(queryBuilder: SelectQueryBuilder<T>, options: PaginationOptions): Promise<PaginatedResult<T>>
}
```

#### Custom Repository Methods

**ProjectRepository**:
- `findByStatus(status: ProjectStatus): Promise<Project[]>`
- `findByCity(city: string): Promise<Project[]>`
- `findAssignedTo(userId: string): Promise<Project[]>`
- `transitionStatus(id: string, newStatus: ProjectStatus): Promise<Project>`
- `searchByName(query: string): Promise<Project[]>`

**LoanRepository**:
- `findByProject(projectId: string): Promise<Loan[]>`
- `findByBorrower(contactId: string): Promise<Loan[]>`
- `createWithGuarantors(data: CreateLoanDto, guarantorIds: string[]): Promise<Loan>`
- `findOverdue(): Promise<Loan[]>`
- `calculateTotalDraws(loanId: string): Promise<number>`

**ContactRepository**:
- `findByType(type: ContactType): Promise<Contact[]>`
- `findByEmail(email: string): Promise<Contact | null>`
- `search(query: string): Promise<Contact[]>` // Fuzzy search
- `findDuplicates(email: string, phone?: string): Promise<Contact[]>`

**TaskRepository**:
- `findByAssignee(userId: string): Promise<Task[]>`
- `findOverdue(): Promise<Task[]>`
- `findByPriority(priority: TaskPriority): Promise<Task[]>`
- `findByProject(projectId: string): Promise<Task[]>`
- `reassignTask(taskId: string, newAssigneeId: string): Promise<Task>`

**DocumentRepository**:
- `findByProject(projectId: string): Promise<Document[]>`
- `findByLoan(loanId: string): Promise<Document[]>`
- `findByType(type: DocumentType): Promise<Document[]>`
- `findPendingExtraction(): Promise<Document[]>`

### DP01-163: API Routes - Projects Module (4h)
**Priority**: HIGH - Core functionality
**Autonomy**: MEDIUM

#### Implementation Steps

1. **Create DTOs** (`src/dto/project/`)
   ```typescript
   // CreateProjectDTO.ts
   class CreateProjectDTO {
     @IsNotEmpty() @IsString() name: string
     @IsNotEmpty() @IsString() city: string
     @IsOptional() @IsString() address?: string
     @IsOptional() @IsNumber() estimated_budget?: number
     @IsEnum(ProjectStatus) status: ProjectStatus
     @IsUUID() assigned_to?: string
   }

   // UpdateProjectDTO.ts
   class UpdateProjectDTO {
     @IsOptional() @IsString() name?: string
     @IsOptional() @IsString() city?: string
     @IsOptional() @IsNumber() estimated_budget?: number
     @IsOptional() @IsEnum(ProjectStatus) status?: ProjectStatus
   }

   // TransitionProjectDTO.ts
   class TransitionProjectDTO {
     @IsEnum(ProjectStatus) status: ProjectStatus
     @IsOptional() @IsString() notes?: string
   }
   ```

2. **Refactor Routes** (`src/routes/projects.ts`)
   ```typescript
   // Replace raw SQL with repository
   router.get('/projects', async (req, res) => {
     const options = buildPaginationOptions(req.query)
     const filters = buildFilters(req.query)
     const result = await projectRepository.findAll({ ...options, where: filters })
     return res.json(ApiResponse.success(result))
   })

   router.post('/projects', validateBody(CreateProjectDTO), async (req, res) => {
     const project = await projectRepository.create(req.body)
     return res.status(201).json(ApiResponse.created(project))
   })

   router.patch('/projects/:id/transition',
     validateBody(TransitionProjectDTO),
     async (req, res) => {
       const project = await projectRepository.transitionStatus(req.params.id, req.body.status)
       await auditLog('PROJECT_STATUS_CHANGE', req.user, project)
       return res.json(ApiResponse.success(project))
     })
   ```

3. **Add Feasibility Routes** (`src/routes/feasibility.ts`)
   - GET /api/v1/projects/:projectId/feasibility
   - POST /api/v1/projects/:projectId/feasibility
   - PATCH /api/v1/projects/:projectId/feasibility
   - POST /api/v1/projects/:projectId/feasibility/consultant-tasks

4. **Add Entitlement Routes** (`src/routes/entitlement.ts`)
   - GET /api/v1/projects/:projectId/entitlement
   - POST /api/v1/projects/:projectId/entitlement
   - PATCH /api/v1/projects/:projectId/entitlement
   - POST /api/v1/projects/:projectId/entitlement/corrections

---

## Phase C: Complete API Surface (11 hours)

### DP01-164: API Routes - Loans & Draws Module (4h)
**Priority**: HIGH - Core lending functionality
**Autonomy**: MEDIUM

#### Service Layer (`src/services/loan.service.ts`)
```typescript
class LoanService {
  async createLoanWithGuarantors(
    loanData: CreateLoanDto,
    guarantorIds: string[]
  ): Promise<Loan> {
    return this.loanRepository.transaction(async (em) => {
      const loan = await em.save(Loan, loanData)
      await em.save(LoanGuarantor, guarantorIds.map(id => ({ loan, contact_id: id })))
      return loan
    })
  }

  async approveDraw(drawId: string, approvedAmount: number): Promise<Draw> {
    const draw = await this.drawRepository.findById(drawId)
    if (!draw) throw new NotFoundError('Draw not found')
    if (draw.status !== DrawStatus.PENDING) throw new ValidationError('Draw not pending')

    draw.approved_amount = approvedAmount
    draw.status = DrawStatus.APPROVED
    draw.approval_date = new Date()

    return this.drawRepository.update(drawId, draw)
  }

  async calculateLoanBalance(loanId: string): Promise<LoanBalance> {
    const draws = await this.drawRepository.findByLoan(loanId)
    const totalDrawn = draws
      .filter(d => d.status === DrawStatus.PAID)
      .reduce((sum, d) => sum + d.paid_amount, 0)

    const loan = await this.loanRepository.findById(loanId)
    return {
      loan_amount: loan.amount,
      total_drawn: totalDrawn,
      available: loan.amount - totalDrawn
    }
  }
}
```

#### Routes Implementation
- Loans CRUD with guarantor management
- Draw workflow (create → approve → pay)
- Balance calculations
- Transaction support for multi-step operations

### DP01-165: API Routes - Contacts & Tasks Module (3h)
**Priority**: MEDIUM
**Autonomy**: HIGH

#### Key Features
- Fuzzy search for contacts using pg_trgm
- Task filtering by multiple criteria
- Overdue task detection
- Task reassignment workflow

### DP01-166: API Routes - Documents Module (4h)
**Priority**: MEDIUM - Depends on S3 integration
**Autonomy**: MEDIUM

#### Document Service (`src/services/document.service.ts`)
```typescript
class DocumentService {
  async uploadDocument(
    file: Express.Multer.File,
    projectId?: string,
    loanId?: string
  ): Promise<Document> {
    // Validate at least one relationship
    if (!projectId && !loanId) {
      throw new ValidationError('Document must be linked to project or loan')
    }

    // Upload to S3
    const s3Result = await this.s3Service.uploadDocument(file)

    // Create database record
    const document = await this.documentRepository.create({
      name: file.originalname,
      type: this.detectDocumentType(file),
      size: file.size,
      mime_type: file.mimetype,
      storage_key: s3Result.key,
      project_id: projectId,
      loan_id: loanId
    })

    // Queue for AI extraction
    await this.queueForExtraction(document.id, document.type)

    return document
  }

  async getDownloadUrl(documentId: string): Promise<string> {
    const document = await this.documentRepository.findById(documentId)
    if (!document) throw new NotFoundError('Document not found')

    return this.s3Service.getSignedUrl(document.storage_key, 3600) // 1 hour
  }
}
```

---

## Implementation Order & Dependencies

### Week 1: Foundation (Phase B)
1. **Day 1-2**: BaseRepository + Core Repositories (DP01-162)
   - BaseRepository with generics
   - ProjectRepository, LoanRepository, ContactRepository

2. **Day 3**: Remaining Repositories (DP01-162)
   - TaskRepository, DocumentRepository, FeasibilityRepository
   - EntitlementRepository, DrawRepository, UserRepository

3. **Day 4-5**: Project API Routes (DP01-163)
   - DTOs and validation
   - Refactor existing routes
   - Add feasibility and entitlement endpoints

### Week 2: Complete API (Phase C)
1. **Day 6-7**: Loan & Draw APIs (DP01-164)
   - LoanService business logic
   - Full CRUD with transactions

2. **Day 8**: Contacts & Tasks (DP01-165)
   - Search implementation
   - Task workflows

3. **Day 9-10**: Documents (DP01-166)
   - S3 integration
   - AI extraction queue

---

## Common Patterns & Standards

### Error Handling
```typescript
// Custom exceptions
export class NotFoundError extends Error {
  statusCode = 404
}

export class ValidationError extends Error {
  statusCode = 400
}

export class UnauthorizedError extends Error {
  statusCode = 401
}

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err['statusCode'] || 500
  const message = err.message || 'Internal Server Error'

  logger.error({
    error: err,
    request: req.url,
    method: req.method,
    statusCode
  })

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
})
```

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    details?: any
  }
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### Pagination
```typescript
interface PaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

interface PaginatedResult<T> {
  items: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### Validation Middleware
```typescript
export const validateBody = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(dtoClass, req.body)
      const errors = await validate(dto)

      if (errors.length > 0) {
        const messages = errors.map(err =>
          Object.values(err.constraints || {}).join(', ')
        )
        throw new ValidationError(messages.join('; '))
      }

      req.body = dto
      next()
    } catch (error) {
      next(error)
    }
  }
}
```

---

## Testing Strategy (Phase D - Future)

### Unit Tests
- Repository methods
- Service layer business logic
- DTO validation

### Integration Tests
- API endpoint testing
- Database transactions
- S3 integration

### E2E Tests
- Complete workflows (project → feasibility → loan → draws)
- Error scenarios
- Performance testing

---

## Success Criteria

### Phase B Complete When:
- [ ] All repositories implemented with BaseRepository pattern
- [ ] Project module fully converted to TypeORM
- [ ] Feasibility and Entitlement endpoints working
- [ ] All DTOs with validation
- [ ] Error handling standardized

### Phase C Complete When:
- [ ] All CRUD endpoints for all entities
- [ ] Business logic in service layer
- [ ] S3 document integration working
- [ ] Search and filtering implemented
- [ ] Transaction support for complex operations

---

## Notes & Considerations

1. **TypeORM Version**: Using 0.3.x - be aware of decorator compatibility warnings
2. **Database**: PostgreSQL 16 with JSONB support
3. **Authentication**: JWT middleware already in place
4. **Existing Code**: Refactor `src/routes/projects.ts` carefully - it has working document upload
5. **S3 Service**: Already exists, enhance don't replace
6. **Audit Trail**: Use AuditLogRepository for all state changes
7. **Soft Deletes**: Implement via `deleted_at` timestamp, don't actually delete

---

## Jira Tasks Assignment

Once PR #15 is approved and Phase A is merged:

1. Self-assign DP01-162 (Repository Pattern)
2. Complete DP01-162
3. Self-assign DP01-163 (Project Routes)
4. Complete Phase B
5. Continue with Phase C tasks in order

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>