# Test Suite Documentation

This directory contains comprehensive integration and unit tests for the Connect 2.0 API.

## Test Structure

```
tests/
├── integration/          # Integration tests (real database, LocalStack)
│   ├── projects.test.ts  # Project API endpoint tests
│   ├── s3.test.ts        # S3 service integration tests
│   └── sqs.test.ts       # SQS service integration tests
├── unit/                 # Unit tests (mocked dependencies)
│   └── services/
│       ├── project.service.test.ts  # Project service logic tests
│       ├── s3.service.test.ts       # S3 service logic tests
│       └── sqs.service.test.ts      # SQS service logic tests
├── fixtures/             # Test data and factories
│   └── projects.ts       # Project test fixtures
├── helpers/              # Test utilities
│   └── database.ts       # Database test helpers
└── setup.ts              # Global test setup

```

## Running Tests

### Prerequisites

Before running tests, ensure you have:

1. **Docker running** - Required for integration tests (PostgreSQL, LocalStack)
2. **Dependencies installed**:
   ```bash
   npm install
   ```

3. **Environment configured**:
   - `.env.test` file exists (created automatically)
   - LocalStack containers running: `docker-compose up -d`

### Test Commands

```bash
# Run all tests (unit + integration) with coverage
npm test

# Run only unit tests (fast, no external dependencies)
npm run test:unit

# Run only integration tests (requires Docker)
npm run test:integration

# Watch mode for development
npm run test:watch

# CI mode (for GitHub Actions)
npm run test:ci
```

### Test Output

Tests generate coverage reports in multiple formats:
- **Terminal**: Summary shown after test run
- **HTML**: Open `coverage/lcov-report/index.html` in browser
- **JSON**: `coverage/coverage-final.json` for CI tools
- **LCOV**: `coverage/lcov.info` for external services

## Test Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Branches | 70% | TBD |
| Functions | 70% | TBD |
| Lines | 70% | TBD |
| Statements | 70% | TBD |

*Run `npm test` to see current coverage*

## Integration Tests

### What They Test

Integration tests verify the entire request/response flow with **real dependencies**:

- **Database**: Actual PostgreSQL queries and transactions
- **LocalStack**: Real S3 uploads/downloads, SQS messaging
- **API Endpoints**: Full Express routing with middleware

### Prerequisites

Integration tests require:
- PostgreSQL running on `localhost:5432`
- LocalStack running on `localhost:4566`
- Test database: `connect2_test`

### Running Integration Tests

```bash
# Start Docker services
docker-compose up -d

# Run integration tests only
npm run test:integration

# Run specific integration test file
npx jest tests/integration/projects.test.ts
```

### Integration Test Scenarios

#### Project API Tests ([projects.test.ts](integration/projects.test.ts))
- ✅ Create project with minimal/complete fields
- ✅ Auto-generate project numbers (PROJ-YYYY-NNN)
- ✅ List projects with pagination and filtering
- ✅ Update project fields
- ✅ Transition project status
- ✅ Soft delete projects
- ✅ Error handling (404, 400, 500)

#### S3 Integration Tests ([s3.test.ts](integration/s3.test.ts))
- ✅ Upload documents to LocalStack S3
- ✅ Generate presigned download URLs
- ✅ Download documents
- ✅ List documents with prefix filtering
- ✅ Delete documents
- ✅ Archive documents (copy + delete)
- ✅ Handle large files (5MB+)
- ✅ Concurrent uploads/downloads

#### SQS Integration Tests ([sqs.test.ts](integration/sqs.test.ts))
- ✅ Send messages to queue
- ✅ Receive messages with visibility timeout
- ✅ Process messages with custom handler
- ✅ Batch send up to 10 messages
- ✅ Get queue statistics
- ✅ Message delay functionality
- ✅ Error handling and retries

## Unit Tests

### What They Test

Unit tests verify business logic in **isolation** with **mocked dependencies**:

- **No database**: Database queries are mocked
- **No AWS**: S3/SQS SDK calls are mocked
- **Fast execution**: Entire suite runs in <5 seconds
- **Pure logic**: Focus on function behavior and edge cases

### Running Unit Tests

```bash
# Run unit tests only (no Docker required)
npm run test:unit

# Run specific unit test file
npx jest tests/unit/services/project.service.test.ts

# Watch mode for TDD
npm run test:watch
```

### Unit Test Scenarios

#### Project Service Tests ([project.service.test.ts](unit/services/project.service.test.ts))
- ✅ CRUD operations with mocked database
- ✅ Project number generation logic
- ✅ Validation rules
- ✅ Soft delete behavior
- ✅ Search and filtering
- ✅ Statistics aggregation
- ✅ Edge cases (null values, long strings, concurrent creates)

#### S3 Service Tests ([s3.service.test.ts](unit/services/s3.service.test.ts))
- ✅ Upload logic with mocked S3 client
- ✅ Presigned URL generation
- ✅ Download with stream handling
- ✅ List operations
- ✅ Delete operations
- ✅ Archive workflow (copy → delete)
- ✅ Error handling (NoSuchKey, AccessDenied)
- ✅ Concurrent operations

#### SQS Service Tests ([sqs.service.test.ts](unit/services/sqs.service.test.ts))
- ✅ Send message logic
- ✅ Receive message parsing
- ✅ Process queue with handler
- ✅ Batch send validation
- ✅ Queue statistics parsing
- ✅ Delay and visibility timeout logic
- ✅ Error handling (throttling, invalid queue)

## Test Fixtures

Test fixtures provide reusable test data:

### Project Fixtures ([fixtures/projects.ts](fixtures/projects.ts))

```typescript
import { testProjects, invalidProjects } from '../fixtures/projects';

// Valid test projects
testProjects.minimal      // Only required fields
testProjects.complete     // All fields populated
testProjects.highValue    // Edge case: expensive property
testProjects.specialChars // Edge case: special characters

// Invalid test data for error testing
invalidProjects.missingAddress
invalidProjects.invalidState
invalidProjects.negativePrices
```

### Generating Random Data

Use Faker.js for random test data:

```typescript
import { generateProjectDTO } from '../fixtures/projects';

// Generate random project
const project = generateProjectDTO();

// Override specific fields
const customProject = generateProjectDTO({
  city: 'Seattle',
  state: 'WA'
});

// Generate multiple projects
const projects = generateProjectDTOs(10);
```

## Test Helpers

### Database Helpers ([helpers/database.ts](helpers/database.ts))

```typescript
import { clearAllTables, closeDatabaseConnection } from '../helpers/database';

describe('My Test Suite', () => {
  beforeEach(async () => {
    await clearAllTables(); // Clean database before each test
  });

  afterAll(async () => {
    await closeDatabaseConnection(); // Prevent Jest hanging
  });
});
```

Available helpers:
- `clearAllTables()` - Truncate all tables
- `closeDatabaseConnection()` - Close pool
- `seedTestUsers(count)` - Create test users
- `seedTestContacts(count)` - Create test contacts
- `beginTransaction()` - Start transaction
- `rollbackTransaction(client)` - Rollback changes

## Writing New Tests

### Integration Test Template

```typescript
import request from 'supertest';
import express from 'express';
import { clearAllTables, closeDatabaseConnection } from '../helpers/database';

const app = express();
// ... setup routes

describe('My Integration Test', () => {
  beforeEach(async () => {
    await clearAllTables();
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  it('should do something', async () => {
    const response = await request(app)
      .post('/api/v1/endpoint')
      .send({ data: 'test' })
      .expect(201);

    expect(response.body.success).toBe(true);
  });
});
```

### Unit Test Template

```typescript
import { myFunction } from '../../../src/services/my.service';
import * as db from '../../../src/config/database';

jest.mock('../../../src/config/database');

const mockQuery = db.query as jest.MockedFunction<typeof db.query>;

describe('My Service Unit Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do something', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1, name: 'test' }],
      rowCount: 1
    } as any);

    const result = await myFunction();

    expect(result).toBeDefined();
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
});
```

## Common Issues

### Jest Hangs After Tests

**Problem**: Tests complete but Jest doesn't exit

**Solution**: Ensure database connections are closed:
```typescript
afterAll(async () => {
  await closeDatabaseConnection();
});
```

### LocalStack Connection Refused

**Problem**: Integration tests fail with "ECONNREFUSED localhost:4566"

**Solution**:
```bash
# Check LocalStack is running
docker ps | grep localstack

# Restart if needed
docker-compose restart localstack
```

### Database Tests Failing

**Problem**: Integration tests fail with "relation does not exist"

**Solution**:
```bash
# Recreate test database
docker-compose down -v
docker-compose up -d
npm run db:migrate  # If you have migrations
```

### Mocked Functions Not Working

**Problem**: Unit tests calling real functions instead of mocks

**Solution**: Ensure mock is before import:
```typescript
jest.mock('../../../src/config/database');  // MUST be first

import { myFunction } from '../../../src/services/my.service';
```

## Continuous Integration

### GitHub Actions

Tests run automatically on:
- Every push to `main`
- Every pull request
- Scheduled nightly runs

CI configuration: `.github/workflows/test.yml`

```yaml
- name: Run tests
  run: npm run test:ci
  env:
    NODE_ENV: test
```

### Pre-commit Hooks

Tests are **not** run in pre-commit hooks (too slow).

Pre-commit checks:
- Linting (Ruff)
- Formatting (Ruff)
- Type checking (MyPy)

Run full tests manually before pushing:
```bash
npm test
```

## Performance

### Test Execution Times

| Test Suite | Count | Duration |
|------------|-------|----------|
| Unit Tests | ~80 | ~3-5s |
| Integration Tests | ~60 | ~15-30s |
| **Total** | **~140** | **~20-35s** |

### Optimization Tips

1. **Run unit tests first** - Fail fast on logic errors
2. **Use `test:watch`** - Run only changed tests during development
3. **Parallel execution** - Jest runs tests in parallel by default
4. **Mock external services** - Don't hit real AWS in unit tests

## Test-Driven Development (TDD)

Recommended workflow:

```bash
# 1. Write failing test
npm run test:watch

# 2. Implement feature
# (test auto-reruns on save)

# 3. Verify all tests pass
npm test

# 4. Check coverage
open coverage/lcov-report/index.html
```

## Additional Resources

- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **Supertest Documentation**: https://github.com/ladjs/supertest
- **Faker.js Documentation**: https://fakerjs.dev/
- **AWS SDK Mock**: https://github.com/m-radzikowski/aws-sdk-client-mock

---

**Last Updated**: December 15, 2025
**Test Framework**: Jest 29.7.0
**Coverage Target**: 70% (branches, functions, lines, statements)
