# Connect 2.0 API Testing Documentation

## Overview

This document provides a comprehensive overview of the testing infrastructure for the Connect 2.0 Node.js API, including both **integration tests** (testing with real services) and **unit tests** (testing with mocked dependencies).

## Test Statistics

| Metric | Value |
|--------|-------|
| **Total Test Files** | 9 |
| **Integration Tests** | 3 files (~60 tests) |
| **Unit Tests** | 3 files (~80 tests) |
| **Total Tests** | ~140 tests |
| **Coverage Target** | 70% (all metrics) |
| **Execution Time** | 20-35 seconds (full suite) |

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run only unit tests (fast, no Docker needed)
npm run test:unit

# Run only integration tests (requires Docker)
npm run test:integration

# Watch mode for TDD
npm run test:watch
```

## Test Infrastructure

### Testing Stack

| Tool | Purpose | Version |
|------|---------|---------|
| **Jest** | Test framework and runner | 29.7.0 |
| **ts-jest** | TypeScript support for Jest | 29.1.1 |
| **Supertest** | HTTP endpoint testing | 6.3.3 |
| **aws-sdk-client-mock** | Mock AWS SDK calls | 3.0.1 |
| **@faker-js/faker** | Generate random test data | 8.3.1 |

### Test Environment

Tests run against:
- **Test Database**: `connect2_test` (PostgreSQL)
- **LocalStack**: Mock AWS services (S3, SQS, SNS)
- **Test Port**: 3001 (vs. 3000 for dev)

Configuration: [.env.test](examples/nodejs-api/.env.test)

## Integration Tests

Integration tests verify the **entire system** working together with **real dependencies**.

### Files

1. **[tests/integration/projects.test.ts](examples/nodejs-api/tests/integration/projects.test.ts)** - 427 lines
   - Tests all 8 project API endpoints
   - Real database transactions
   - Full request/response cycle

2. **[tests/integration/s3.test.ts](examples/nodejs-api/tests/integration/s3.test.ts)** - 378 lines
   - Tests document upload/download with LocalStack
   - Presigned URL generation
   - Archive operations

3. **[tests/integration/sqs.test.ts](examples/nodejs-api/tests/integration/sqs.test.ts)** - 419 lines
   - Tests message sending/receiving
   - Queue processing with handlers
   - Batch operations

### Integration Test Coverage

#### Project API Endpoints (8 endpoints tested)

| Endpoint | Method | Tested Scenarios |
|----------|--------|------------------|
| `/api/v1/projects` | GET | Empty list, pagination, filtering by status |
| `/api/v1/projects` | POST | Minimal fields, complete fields, auto-numbering, validation |
| `/api/v1/projects/:id` | GET | Retrieve by ID, 404 handling, UUID validation |
| `/api/v1/projects/:id` | PATCH | Update fields, timestamp updates, immutable fields |
| `/api/v1/projects/:id/transition` | POST | Status transitions, validation, state machine |
| `/api/v1/projects/:id` | DELETE | Soft delete, 404 handling |
| `/api/v1/projects/:id/documents` | POST | File upload, S3 storage, SQS notification |
| `/api/v1/projects/:id/documents/:docId/download` | GET | Presigned URL generation |

**Total: 25+ test cases for project endpoints**

#### S3 Operations (6 functions tested)

| Function | Tested Scenarios |
|----------|------------------|
| `uploadDocument()` | Upload to S3, metadata, unique keys, large files, special chars |
| `getPresignedUrl()` | URL generation, expiration, non-existent files |
| `downloadDocument()` | Download, binary content, metadata, errors |
| `listDocuments()` | List all, empty bucket, prefix filtering, pagination |
| `deleteDocument()` | Delete, idempotent deletes, concurrent deletes |
| `archiveDocument()` | Archive workflow, content preservation, errors |

**Total: 30+ test cases for S3 operations**

#### SQS Operations (6 functions tested)

| Function | Tested Scenarios |
|----------|------------------|
| `sendMessage()` | Send to queue, object/string bodies, delays, large messages |
| `receiveMessages()` | Receive, empty queue, visibility timeout, pagination |
| `processQueue()` | Custom handler, delete on success, error handling |
| `getQueueUrl()` | Retrieve by name, non-existent queue |
| `batchSendToQueue()` | Batch send, max 10 messages, partial failures |
| `getQueueStats()` | Queue attributes, empty queue, missing attributes |

**Total: 35+ test cases for SQS operations**

## Unit Tests

Unit tests verify **business logic in isolation** with **mocked dependencies**.

### Files

1. **[tests/unit/services/project.service.test.ts](examples/nodejs-api/tests/unit/services/project.service.test.ts)** - 485 lines
   - Tests project service logic
   - Mocked database queries
   - Edge cases and validation

2. **[tests/unit/services/s3.service.test.ts](examples/nodejs-api/tests/unit/services/s3.service.test.ts)** - 406 lines
   - Tests S3 service logic
   - Mocked AWS SDK calls
   - Error scenarios

3. **[tests/unit/services/sqs.service.test.ts](examples/nodejs-api/tests/unit/services/sqs.service.test.ts)** - 597 lines
   - Tests SQS service logic
   - Mocked SDK calls
   - Message processing logic

### Unit Test Coverage

#### Project Service Functions (8 functions tested)

| Function | Tested Scenarios |
|----------|------------------|
| `getAllProjects()` | Return all, pagination, filtering, empty results, errors |
| `getProjectById()` | Retrieve by ID, not found, invalid UUID, soft-deleted |
| `createProject()` | Create minimal, auto-numbering, sequential numbers, validation |
| `updateProject()` | Update fields, timestamp, not found, immutable fields |
| `deleteProject()` | Soft delete, not found, no hard delete |
| `getProjectStats()` | Statistics, zero projects |
| `searchProjectsByAddress()` | Search, case insensitive, no matches |
| Edge cases | Null values, long strings, concurrent creates |

**Total: 35+ test cases for project service**

#### S3 Service Functions (6 functions tested)

| Function | Tested Scenarios |
|----------|------------------|
| `uploadDocument()` | Upload, unique keys, metadata, errors, size calculation |
| `getPresignedUrl()` | URL generation, expiration, key formats |
| `downloadDocument()` | Download, binary, not found, metadata |
| `listDocuments()` | List all, empty, prefix, pagination |
| `deleteDocument()` | Delete, idempotent, errors |
| `archiveDocument()` | Archive workflow, content preservation, rollback |

**Total: 30+ test cases for S3 service**

#### SQS Service Functions (6 functions tested)

| Function | Tested Scenarios |
|----------|------------------|
| `sendMessage()` | Send, stringify, delay, errors |
| `receiveMessages()` | Receive, empty, visibility, long polling |
| `processQueue()` | Handler, delete on success, error handling |
| `getQueueUrl()` | Retrieve, not found, queue name |
| `batchSendToQueue()` | Batch send, max 10, partial failures, empty |
| `getQueueStats()` | Stats parsing, empty queue, missing attributes |

**Total: 35+ test cases for SQS service**

## Test Fixtures

Reusable test data and factories:

### [tests/fixtures/projects.ts](examples/nodejs-api/tests/fixtures/projects.ts) - 177 lines

```typescript
// Valid test projects
testProjects.minimal       // Required fields only
testProjects.complete      // All fields populated
testProjects.highValue     // Edge case: expensive property
testProjects.lowValue      // Edge case: cheap property
testProjects.specialChars  // Edge case: special characters

// Invalid projects for error testing
invalidProjects.missingAddress
invalidProjects.invalidState
invalidProjects.negativePrices
invalidProjects.invalidUUID

// Random data generation with Faker
generateProjectDTO()              // Random project
generateProjectDTO({ city: 'Seattle' })  // Override fields
generateProjectDTOs(10)           // Generate 10 projects

// Update fixtures
projectUpdates.priceUpdate
projectUpdates.assignmentUpdate
projectUpdates.multipleFields

// Status transition fixtures
statusTransitions.toActive
statusTransitions.toOnHold
statusTransitions.toCompleted
statusTransitions.toCancelled
```

## Test Helpers

Utility functions for common test operations:

### [tests/helpers/database.ts](examples/nodejs-api/tests/helpers/database.ts) - 110 lines

```typescript
// Database cleanup
await clearAllTables()  // Truncate all tables
await closeDatabaseConnection()  // Close pool (prevent hanging)

// Test data seeding
const userIds = await seedTestUsers(3)
const contactIds = await seedTestContacts(2)

// Transaction management
const client = await beginTransaction()
// ... perform operations
await rollbackTransaction(client)

// Utility queries
const exists = await tableExists('projects')
const count = await getTableRowCount('projects')
```

## Configuration Files

### [jest.config.js](examples/nodejs-api/jest.config.js) - 68 lines

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,

  // Path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    // ...
  }
};
```

### [tests/setup.ts](examples/nodejs-api/tests/setup.ts) - 30 lines

Global test configuration:
- Load `.env.test` environment variables
- Set `NODE_ENV=test`
- Configure global timeout (10s)
- Global beforeAll/afterAll hooks

## Test Scripts

Defined in [package.json](examples/nodejs-api/package.json):

```json
{
  "scripts": {
    "test": "jest --coverage --detectOpenHandles",
    "test:unit": "jest --testPathPattern=tests/unit --coverage",
    "test:integration": "jest --testPathPattern=tests/integration --coverage --detectOpenHandles",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## Coverage Reports

After running `npm test`, coverage reports are generated:

- **Terminal**: Summary table showing coverage percentages
- **HTML**: `coverage/lcov-report/index.html` - Interactive browser report
- **LCOV**: `coverage/lcov.info` - For CI/CD tools
- **JSON**: `coverage/coverage-final.json` - Machine-readable format

### Coverage Target: 70%

| Metric | Target | Description |
|--------|--------|-------------|
| **Branches** | 70% | If/else, switch, ternary branches |
| **Functions** | 70% | Function definitions called |
| **Lines** | 70% | Lines of code executed |
| **Statements** | 70% | Individual statements executed |

## Running Tests in CI/CD

### GitHub Actions Example

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: connect2_test
          POSTGRES_USER: connect_user
          POSTGRES_PASSWORD: connect_dev_password

      localstack:
        image: localstack/localstack:latest
        env:
          SERVICES: s3,sqs,sns

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci
        env:
          NODE_ENV: test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Best Practices

### Writing Tests

1. **Arrange-Act-Assert** pattern:
   ```typescript
   it('should create project', async () => {
     // Arrange
     const projectData = testProjects.minimal;

     // Act
     const result = await createProject(projectData);

     // Assert
     expect(result).toHaveProperty('id');
     expect(result.address).toBe(projectData.address);
   });
   ```

2. **Descriptive test names**:
   ```typescript
   // Good
   it('should auto-generate project_number in PROJ-YYYY-NNN format')

   // Bad
   it('should work')
   ```

3. **Test one thing per test**:
   ```typescript
   // Good - separate tests
   it('should create project with minimal fields')
   it('should create project with all fields')

   // Bad - testing multiple scenarios
   it('should create projects')
   ```

4. **Clean up after tests**:
   ```typescript
   beforeEach(async () => {
     await clearAllTables();
   });

   afterAll(async () => {
     await closeDatabaseConnection();
   });
   ```

### Test Organization

- **Integration tests**: Test complete workflows end-to-end
- **Unit tests**: Test individual functions in isolation
- **Fixtures**: Reusable test data
- **Helpers**: Shared test utilities

### Performance

- **Run unit tests first** - Fast feedback (3-5s)
- **Use watch mode** - `npm run test:watch` during development
- **Parallel execution** - Jest runs tests in parallel by default
- **Mock external services** - Unit tests never hit real services

## Troubleshooting

### Jest Hangs After Tests

**Symptom**: Tests complete but process doesn't exit

**Solution**: Ensure database connections are closed:
```typescript
afterAll(async () => {
  await closeDatabaseConnection();
});
```

### LocalStack Connection Refused

**Symptom**: `ECONNREFUSED localhost:4566`

**Solution**:
```bash
docker ps | grep localstack  # Check if running
docker-compose up -d localstack  # Start if stopped
```

### Database Connection Errors

**Symptom**: `relation "connect2.projects" does not exist`

**Solution**:
```bash
# Recreate test database
docker-compose down -v
docker-compose up -d postgres
# Run database init script
docker exec -i blueprint-postgres-1 psql -U connect_user -d connect2_test < scripts/init-db.sql
```

### Mock Not Working

**Symptom**: Unit test calling real function instead of mock

**Solution**: Ensure mock declaration is before import:
```typescript
// CORRECT
jest.mock('../../../src/config/database');
import { myFunction } from '../../../src/services/my.service';

// WRONG
import { myFunction } from '../../../src/services/my.service';
jest.mock('../../../src/config/database');  // Too late!
```

## Test-Driven Development (TDD)

Recommended workflow:

```bash
# 1. Write failing test
npm run test:watch

# 2. Implement minimal code to pass test
# (auto-reruns on save)

# 3. Refactor while keeping tests green

# 4. Verify all tests pass
npm test

# 5. Check coverage
open coverage/lcov-report/index.html
```

## Summary

### What We've Built

- ✅ **140+ comprehensive tests** covering all API functionality
- ✅ **Integration tests** for projects, S3, and SQS with real services
- ✅ **Unit tests** for all service functions with mocked dependencies
- ✅ **Test fixtures** with Faker.js for random data generation
- ✅ **Test helpers** for database management and cleanup
- ✅ **Jest configuration** with 70% coverage thresholds
- ✅ **Multiple test modes**: all, unit, integration, watch, CI
- ✅ **Coverage reports** in terminal, HTML, LCOV, and JSON formats

### Test Execution

```bash
npm test              # All tests (~20-35s)
npm run test:unit     # Unit only (~3-5s)
npm run test:integration  # Integration only (~15-30s)
npm run test:watch    # Watch mode for TDD
npm run test:ci       # CI mode with constraints
```

### Coverage Target

All metrics target **70%** coverage:
- Branches
- Functions
- Lines
- Statements

Run `npm test` to see current coverage percentages.

---

**Documentation**: [tests/README.md](examples/nodejs-api/tests/README.md)
**Last Updated**: December 15, 2025
**Test Framework**: Jest 29.7.0 + TypeScript
