# Repository Implementation Summary
## Entity-Specific Repositories for Connect 2.0 API

**Created**: December 18, 2025
**Branch**: `clay/dp01-22-core-data-model-phase-b`
**Related Epic**: DP01-22 (Core API Development)
**Related Task**: DP01-162 (Repository Pattern Implementation)

---

## Overview

This document summarizes the implementation of five entity-specific repository classes that extend the BaseRepository pattern. Each repository provides domain-specific query methods and business logic for its entity type.

---

## Files Created

### 1. ProjectRepository.ts
**Location**: `src/repositories/ProjectRepository.ts`
**Entity**: `Project`
**Lines of Code**: 237

#### Key Methods
- `findByStatus(status: ProjectStatus)` - Filter projects by status
- `findActiveProjects()` - Find all non-terminal projects (LEAD, FEASIBILITY, GO)
- `updateStatus(id, newStatus)` - Status transitions with validation
- `findWithRelations(id)` - Load project with feasibility, loans, and documents
- `findByCity(city)` - Case-insensitive city search
- `searchByAddress(query)` - Fuzzy address search using ILIKE

#### Business Logic
Enforces valid status transition workflows:
- **LEAD** → FEASIBILITY or PASS
- **FEASIBILITY** → GO or PASS
- **GO** → CLOSED
- **PASS** and **CLOSED** are terminal (no further transitions)

#### Example Usage
```typescript
import { projectRepository } from './repositories';

// Find all active projects
const active = await projectRepository.findActiveProjects();

// Transition status with validation
const project = await projectRepository.updateStatus(id, ProjectStatus.GO);

// Load with all relations
const full = await projectRepository.findWithRelations(id);
console.log(full.feasibility);
console.log(full.loans);
console.log(full.documents);
```

---

### 2. LoanRepository.ts
**Location**: `src/repositories/LoanRepository.ts`
**Entity**: `Loan`
**Lines of Code**: 207

#### Key Methods
- `findByBorrower(borrowerId)` - Find all loans for a borrower
- `findByProject(projectId)` - Find all loans for a project
- `createWithGuarantors(loanData, guarantorIds)` - Create loan with guarantors in transaction
- `calculateBalance(loanId)` - Calculate remaining principal balance
- `findOverdueLoans()` - Find loans past maturity date still in SERVICING status
- `updateStatus(id, newStatus)` - Update loan status with validation

#### Business Logic
- **Transaction Support**: Atomic creation of loan + guarantor relationships
- **Balance Calculation**: loan_amount - SUM(approved draws) - SUM(paid draws)
- **Status Validation**: Cannot transition from PAID_OFF or DEFAULT (terminal statuses)

#### Example Usage
```typescript
import { loanRepository } from './repositories';

// Create loan with guarantors atomically
const loan = await loanRepository.createWithGuarantors(
  {
    loan_number: 'L-2025-001',
    borrower_id: 'borrower-uuid',
    loan_amount: 500000,
    interest_rate: 8.5,
    term_months: 24
  },
  ['guarantor1-uuid', 'guarantor2-uuid']
);

// Calculate remaining balance
const balance = await loanRepository.calculateBalance(loanId);
console.log(`Remaining: $${balance}`);

// Find overdue loans
const overdue = await loanRepository.findOverdueLoans();
```

---

### 3. ContactRepository.ts
**Location**: `src/repositories/ContactRepository.ts`
**Entity**: `Contact`
**Lines of Code**: 254

#### Key Methods
- `search(query)` - Fuzzy search using PostgreSQL pg_trgm extension
- `findByType(type)` - Filter by contact type (AGENT, BUILDER, etc.)
- `findDuplicates(email?, phone?)` - Detect duplicate contacts
- `mergeContacts(sourceId, targetId)` - Merge duplicates in transaction
- `findByCompany(companyName)` - Case-insensitive company search
- `findByEmail(email)` - Exact email match

#### Business Logic
- **Fuzzy Search**: Uses trigram similarity matching across first_name, last_name, company_name, email
- **Duplicate Detection**: Matches on email (case-insensitive) or phone (strips formatting)
- **Contact Merging**: Transactional operation that:
  1. Updates all foreign key references from source to target
  2. Merges notes from source into target
  3. Soft-deletes source contact

#### Example Usage
```typescript
import { contactRepository } from './repositories';

// Fuzzy search across all name fields
const contacts = await contactRepository.search('john doe');
// Finds: "John Doe", "Jon Dougherty", "Johnny Doane", etc.

// Find duplicates by email
const dupes = await contactRepository.findDuplicates('john@example.com');

// Merge duplicate contacts
const merged = await contactRepository.mergeContacts(
  'duplicate-uuid',
  'primary-uuid'
);
```

#### Database Requirements
Requires PostgreSQL `pg_trgm` extension for fuzzy search:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

---

### 4. TaskRepository.ts
**Location**: `src/repositories/TaskRepository.ts`
**Entity**: `Task`
**Lines of Code**: 215

#### Key Methods
- `findByAssignee(assigneeId)` - Find tasks assigned to a user
- `findOverdueTasks()` - Find tasks past due date and not completed/cancelled
- `reassignTask(taskId, newAssigneeId)` - Reassign task to different user
- `findByProject(projectId)` - Find all tasks for a project
- `updateProgress(taskId, newStatus)` - Update task status with validation
- `findByStatus(status)` - Filter by task status
- `findByPriority(priority)` - Filter by priority level
- `findDueInRange(startDate, endDate)` - Find tasks due within date range
- `findByContact(contactId)` - Find tasks assigned to external contacts

#### Business Logic
- **Status Transitions**:
  - PENDING → IN_PROGRESS (automatic on assignment)
  - IN_PROGRESS → COMPLETED (requires validation)
  - Cannot modify COMPLETED or CANCELLED tasks
- **Overdue Detection**: due_date < CURRENT_DATE AND status NOT IN (COMPLETED, CANCELLED)

#### Example Usage
```typescript
import { taskRepository } from './repositories';

// Find my assigned tasks
const myTasks = await taskRepository.findByAssignee(userId);

// Find overdue tasks
const overdue = await taskRepository.findOverdueTasks();
for (const task of overdue) {
  console.log(`Task "${task.title}" is overdue`);
}

// Reassign task (auto-transitions PENDING → IN_PROGRESS)
const task = await taskRepository.reassignTask('task-uuid', 'new-user-uuid');

// Find tasks due this week
const thisWeek = await taskRepository.findDueInRange(
  new Date(),
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
);
```

---

### 5. DocumentRepository.ts
**Location**: `src/repositories/DocumentRepository.ts`
**Entity**: `Document`
**Lines of Code**: 228

#### Key Methods
- `findByProject(projectId)` - Find all documents for a project
- `findByLoan(loanId)` - Find all documents for a loan
- `findByType(type)` - Filter by document type (SURVEY, TITLE, etc.)
- `markExtracted(documentId, extractedData, summary?)` - Store AI-extracted data
- `getRecentDocuments(limit)` - Get recently uploaded documents
- `findByConsultantTask(consultantTaskId)` - Find consultant-delivered documents
- `findUnprocessed()` - Find documents pending AI extraction
- `searchByFilename(query)` - Case-insensitive filename search
- `getStorageStats()` - Aggregate storage usage statistics

#### Business Logic
- **AI Integration**: Tracks extracted data from Azure Document Intelligence
- **Storage Metrics**: Calculates total count, total size, average size
- **Processing Queue**: Identifies unprocessed documents (extracted_data IS NULL)

#### Example Usage
```typescript
import { documentRepository } from './repositories';

// Find all project documents
const projectDocs = await documentRepository.findByProject('project-uuid');

// Mark document as extracted with AI data
const doc = await documentRepository.markExtracted(
  'doc-uuid',
  {
    parcel_number: '123456789',
    lot_size: 7500,
    zoning: 'R-5'
  },
  'Single family residential lot, 7500 sq ft, zoned R-5'
);

// Find unprocessed documents for background job
const unprocessed = await documentRepository.findUnprocessed();
for (const doc of unprocessed) {
  await aiService.extractData(doc);
}

// Get storage statistics
const stats = await documentRepository.getStorageStats();
console.log(`Total documents: ${stats.count}`);
console.log(`Total size: ${stats.totalSize} bytes`);
```

---

## Central Export (index.ts)

**Location**: `src/repositories/index.ts`

Provides centralized exports for all repositories:

```typescript
// Import singleton instances (recommended)
import {
  projectRepository,
  loanRepository,
  contactRepository,
  taskRepository,
  documentRepository
} from './repositories';

// Import classes for dependency injection
import {
  ProjectRepository,
  LoanRepository,
  ContactRepository,
  TaskRepository,
  DocumentRepository
} from './repositories';
```

---

## Implementation Summary

### Total Deliverables
- **5 repository classes** with complete implementations
- **39 custom methods** beyond base CRUD operations
- **1,141 lines** of production TypeScript code
- **Full JSDoc comments** for all public methods
- **Transaction support** for complex operations
- **Business logic validation** for state transitions

### Custom Methods Per Repository
- **ProjectRepository**: 6 methods (status transitions, relations, search)
- **LoanRepository**: 7 methods (guarantors, balance, overdue)
- **ContactRepository**: 7 methods (fuzzy search, duplicates, merging)
- **TaskRepository**: 9 methods (assignment, overdue, filtering)
- **DocumentRepository**: 10 methods (AI extraction, storage, search)

### Key Features Implemented
1. **Status Validation**: Enforced workflows for Projects and Loans
2. **Transaction Support**: Atomic multi-step operations (guarantors, merging)
3. **Fuzzy Search**: PostgreSQL pg_trgm for contact search
4. **Relationship Loading**: Efficient JOIN queries for related entities
5. **Business Calculations**: Loan balances, storage statistics
6. **Soft Deletes**: All queries respect deleted_at timestamps
7. **Error Handling**: Custom exceptions (NotFoundException, ValidationException)

---

## Testing Recommendations

### Unit Tests
```typescript
describe('ProjectRepository', () => {
  it('should enforce status transitions', async () => {
    const project = await projectRepository.create({ status: ProjectStatus.CLOSED });
    await expect(
      projectRepository.updateStatus(project.id, ProjectStatus.GO)
    ).rejects.toThrow(ValidationException);
  });
});
```

### Integration Tests
```typescript
describe('LoanRepository', () => {
  it('should create loan with guarantors atomically', async () => {
    const loan = await loanRepository.createWithGuarantors(
      loanData,
      [guarantor1.id, guarantor2.id]
    );

    const guarantors = await db.query('SELECT * FROM loan_guarantors WHERE loan_id = $1', [loan.id]);
    expect(guarantors.rows).toHaveLength(2);
  });
});
```

---

## Next Steps

### Immediate (Phase B Completion)
1. ✅ All 5 entity repositories implemented
2. ⏳ Create remaining repositories (Feasibility, Entitlement, Draw, User, AuditLog)
3. ⏳ Update API routes to use repositories (DP01-163)
4. ⏳ Add DTO validation with class-validator

### Phase C (API Surface)
1. Implement service layer for complex business logic
2. Complete all CRUD endpoints using repositories
3. Add S3 document upload integration
4. Implement search and filtering across all entities

---

## Patterns & Best Practices

### Singleton Pattern
```typescript
// Export singleton instance for convenience
export const projectRepository = new ProjectRepository();

// Use in routes/services
import { projectRepository } from './repositories';
const projects = await projectRepository.findAll();
```

### Transaction Pattern
```typescript
// Use for multi-step atomic operations
return this.transaction(async (client) => {
  const loan = await client.query('INSERT INTO loans...');
  const guarantors = await client.query('INSERT INTO loan_guarantors...');
  return loan.rows[0];
});
```

### Error Handling Pattern
```typescript
// Custom exceptions with context
if (!entity) {
  throw new NotFoundException('Entity', id);
}

if (invalidTransition) {
  throw new ValidationException('Invalid transition', {
    currentStatus,
    attemptedStatus,
    allowedStatuses
  });
}
```

---

## Performance Considerations

1. **Indexes Required**:
   - `projects(status)` - for findByStatus queries
   - `loans(borrower_id)` - for findByBorrower queries
   - `tasks(assigned_to)` - for findByAssignee queries
   - `documents(project_id, loan_id)` - for findByProject/findByLoan

2. **pg_trgm Extension**:
   - Required for ContactRepository.search()
   - Creates GIN or GIST indexes on text columns

3. **Query Optimization**:
   - All queries use parameterized statements (SQL injection safe)
   - WHERE clauses filter on indexed columns
   - LIMIT clauses prevent unbounded result sets

---

## Database Schema Alignment

All repositories assume the database schema from `scripts/init-db.sql`:
- Schema: `connect2`
- Soft deletes: `deleted_at` timestamp column
- Audit columns: `created_at`, `updated_at` timestamps
- UUIDs: Primary keys use UUID type

---

## Documentation

- **Inline JSDoc**: All public methods have complete JSDoc comments
- **Examples**: Each method includes usage examples
- **Type Safety**: Full TypeScript types for all parameters and returns
- **Error Documentation**: Throws clauses document all possible exceptions

---

## Success Metrics

✅ **All Deliverables Complete**:
- 5 repository files created
- 39+ custom methods implemented
- Transaction support added
- Business logic validation included
- JSDoc comments on all methods
- Singleton exports configured

✅ **Code Quality**:
- TypeScript compilation: ✅ PASS (no errors in repository code)
- Naming conventions: ✅ Consistent
- Error handling: ✅ Comprehensive
- Documentation: ✅ Complete

---

## Related Documentation

- [BaseRepository API Reference](src/repositories/API_REFERENCE.md)
- [Repository Quick Start](src/repositories/QUICK_START.md)
- [Phase B Implementation Plan](PHASE_B_IMPLEMENTATION_PLAN.md)
- [Database Schema](scripts/init-db.sql)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
