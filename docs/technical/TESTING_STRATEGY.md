# Testing Strategy and Quality Assurance

**Version:** 1.0
**Last Updated:** November 5, 2025
**Status:** Draft - Ready for Technical Review
**Related Documents:** [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md), [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Testing Philosophy](#2-testing-philosophy)
3. [Test Pyramid Strategy](#3-test-pyramid-strategy)
4. [Unit Testing](#4-unit-testing)
5. [Integration Testing](#5-integration-testing)
6. [End-to-End Testing](#6-end-to-end-testing)
7. [API Testing](#7-api-testing)
8. [Database Testing](#8-database-testing)
9. [Performance Testing](#9-performance-testing)
10. [Security Testing](#10-security-testing)
11. [User Acceptance Testing (UAT)](#11-user-acceptance-testing-uat)
12. [Test Data Management](#12-test-data-management)
13. [Continuous Integration](#13-continuous-integration)
14. [Quality Metrics](#14-quality-metrics)
15. [Bug Management](#15-bug-management)

---

## 1. Overview

### 1.1 Purpose

This document defines the testing strategy for Connect 2.0, ensuring:

- **High Code Quality**: Catch bugs before production
- **Regression Prevention**: Automated tests prevent breaking existing functionality
- **Confidence in Deployments**: Comprehensive test coverage enables frequent, safe releases
- **Documentation**: Tests serve as living documentation of expected behavior
- **Zero-Default Track Record**: Technology must maintain Blueprint's $3B+ zero-default record

### 1.2 Quality Goals

| Metric | Target | Critical? |
|--------|--------|-----------|
| **Unit Test Coverage** | ≥ 80% | Yes |
| **Integration Test Coverage** | ≥ 70% | Yes |
| **E2E Test Coverage** | ≥ 60% critical paths | Yes |
| **API Test Coverage** | 100% endpoints | Yes |
| **Performance (p95 latency)** | < 500ms | Yes |
| **Security Scan** | 0 critical vulnerabilities | Yes |
| **Uptime** | ≥ 99.5% | Yes |

### 1.3 Testing Tools

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **Jest** | Unit & integration testing (backend) | https://jestjs.io |
| **Vitest** | Unit testing (frontend) | https://vitest.dev |
| **Supertest** | API testing | https://github.com/visionmedia/supertest |
| **Playwright** | E2E testing | https://playwright.dev |
| **k6** | Load/performance testing | https://k6.io |
| **OWASP ZAP** | Security testing | https://www.zaproxy.org |
| **SonarQube** | Code quality analysis | https://www.sonarqube.org |

---

## 2. Testing Philosophy

### 2.1 Core Principles

1. **Test Early, Test Often**: Write tests alongside code, not after
2. **Fail Fast**: Tests should fail quickly and clearly when something breaks
3. **Independent Tests**: Each test should run independently (no shared state)
4. **Deterministic**: Tests should produce the same result every time
5. **Readable**: Tests are documentation; make them clear and concise
6. **Maintainable**: Avoid brittle tests that break with minor changes

### 2.2 What to Test

**DO Test:**
- Business logic and calculations (loan payments, draw approvals)
- API endpoints (request/response validation)
- Database operations (CRUD, transactions)
- Critical user workflows (loan origination, draw submission)
- Error handling and edge cases
- Security controls (authentication, authorization)

**DON'T Test:**
- Third-party libraries (assume they're tested)
- Framework internals
- Trivial getters/setters
- Generated code

### 2.3 Test-Driven Development (TDD)

**Recommended for:**
- Complex business logic (loan calculations, risk scoring)
- API endpoints
- Critical workflows (e.g., draw approval)

**TDD Workflow:**
```
1. Write failing test (Red)
2. Write minimal code to pass test (Green)
3. Refactor code while keeping tests green (Refactor)
4. Repeat
```

---

## 3. Test Pyramid Strategy

```
         /\
        /  \    E2E Tests (10%)
       /____\   - Critical user journeys
      /      \  - Browser-based scenarios
     /________\
    /          \ Integration Tests (30%)
   /____________\  - API endpoints
  /              \ - Database operations
 /________________\ - External integrations
/                  \
/    Unit Tests     \ Unit Tests (60%)
/      (60%)         \ - Business logic
/____________________\ - Utilities
                       - Isolated functions
```

### 3.1 Test Distribution

| Test Type | Percentage | Execution Time | Example Count |
|-----------|------------|----------------|---------------|
| **Unit** | 60% | < 5 minutes | ~1200 tests |
| **Integration** | 30% | 5-10 minutes | ~600 tests |
| **E2E** | 10% | 10-15 minutes | ~200 tests |

**Total Test Suite Target:** ~2000 tests
**Total Execution Time:** < 30 minutes

---

## 4. Unit Testing

### 4.1 Backend Unit Tests (Jest)

**Setup:**
```typescript
// backend/tests/setup.ts
import { beforeAll, afterAll } from '@jest/globals';

beforeAll(() => {
  // Setup test environment
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Cleanup
});
```

**Example: Testing Business Logic**
```typescript
// backend/src/modules/loans/services/payment-calculator.test.ts
import { PaymentCalculator } from './payment-calculator';

describe('PaymentCalculator', () => {
  let calculator: PaymentCalculator;

  beforeEach(() => {
    calculator = new PaymentCalculator();
  });

  describe('calculateMonthlyPayment', () => {
    it('should calculate correct monthly payment for standard loan', () => {
      const result = calculator.calculateMonthlyPayment({
        principal: 1000000,
        annualRate: 0.08,
        termMonths: 24
      });

      expect(result.monthlyPayment).toBeCloseTo(45207.57, 2);
      expect(result.totalInterest).toBeCloseTo(84981.68, 2);
    });

    it('should handle zero interest rate', () => {
      const result = calculator.calculateMonthlyPayment({
        principal: 1000000,
        annualRate: 0,
        termMonths: 24
      });

      expect(result.monthlyPayment).toBeCloseTo(41666.67, 2);
      expect(result.totalInterest).toBe(0);
    });

    it('should throw error for negative principal', () => {
      expect(() => {
        calculator.calculateMonthlyPayment({
          principal: -1000,
          annualRate: 0.08,
          termMonths: 24
        });
      }).toThrow('Principal must be positive');
    });

    it('should throw error for term less than 1 month', () => {
      expect(() => {
        calculator.calculateMonthlyPayment({
          principal: 1000000,
          annualRate: 0.08,
          termMonths: 0
        });
      }).toThrow('Term must be at least 1 month');
    });
  });

  describe('calculateAmortizationSchedule', () => {
    it('should generate correct amortization schedule', () => {
      const schedule = calculator.calculateAmortizationSchedule({
        principal: 100000,
        annualRate: 0.06,
        termMonths: 12
      });

      expect(schedule).toHaveLength(12);
      expect(schedule[0].principalPayment).toBeCloseTo(8067.07, 2);
      expect(schedule[0].interestPayment).toBeCloseTo(500.00, 2);
      expect(schedule[11].balance).toBeCloseTo(0, 2);
    });
  });
});
```

**Example: Testing Service Layer with Mocks**
```typescript
// backend/src/modules/projects/services/project-service.test.ts
import { ProjectService } from './project-service';
import { ProjectRepository } from '../repositories/project-repository';
import { EventBus } from '../../../shared/events/event-bus';

jest.mock('../repositories/project-repository');
jest.mock('../../../shared/events/event-bus');

describe('ProjectService', () => {
  let service: ProjectService;
  let mockRepository: jest.Mocked<ProjectRepository>;
  let mockEventBus: jest.Mocked<EventBus>;

  beforeEach(() => {
    mockRepository = new ProjectRepository() as jest.Mocked<ProjectRepository>;
    mockEventBus = new EventBus() as jest.Mocked<EventBus>;
    service = new ProjectService(mockRepository, mockEventBus);
  });

  describe('transitionStatus', () => {
    it('should transition project from LEAD to FEASIBILITY', async () => {
      const project = {
        id: 'proj_123',
        status: 'LEAD',
        address: '123 Main St'
      };

      mockRepository.findById.mockResolvedValue(project);
      mockRepository.update.mockResolvedValue({ ...project, status: 'FEASIBILITY' });

      const result = await service.transitionStatus('proj_123', 'FEASIBILITY', 'user_456');

      expect(result.status).toBe('FEASIBILITY');
      expect(mockEventBus.publish).toHaveBeenCalledWith('project.status_changed', {
        projectId: 'proj_123',
        from: 'LEAD',
        to: 'FEASIBILITY',
        changedBy: 'user_456'
      });
    });

    it('should throw error for invalid transition', async () => {
      const project = {
        id: 'proj_123',
        status: 'LEAD'
      };

      mockRepository.findById.mockResolvedValue(project);

      await expect(
        service.transitionStatus('proj_123', 'CLOSED', 'user_456')
      ).rejects.toThrow('Invalid status transition: LEAD -> CLOSED');
    });
  });
});
```

### 4.2 Frontend Unit Tests (Vitest)

**Example: Testing React Component**
```typescript
// frontend/src/components/LoanCalculator.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoanCalculator } from './LoanCalculator';

describe('LoanCalculator', () => {
  it('should render all input fields', () => {
    render(<LoanCalculator />);

    expect(screen.getByLabelText('Principal')).toBeInTheDocument();
    expect(screen.getByLabelText('Interest Rate (%)')).toBeInTheDocument();
    expect(screen.getByLabelText('Term (months)')).toBeInTheDocument();
  });

  it('should calculate monthly payment correctly', () => {
    render(<LoanCalculator />);

    fireEvent.change(screen.getByLabelText('Principal'), {
      target: { value: '1000000' }
    });
    fireEvent.change(screen.getByLabelText('Interest Rate (%)'), {
      target: { value: '8' }
    });
    fireEvent.change(screen.getByLabelText('Term (months)'), {
      target: { value: '24' }
    });

    fireEvent.click(screen.getByText('Calculate'));

    expect(screen.getByText('$45,207.57')).toBeInTheDocument();
  });

  it('should display error for invalid input', () => {
    render(<LoanCalculator />);

    fireEvent.change(screen.getByLabelText('Principal'), {
      target: { value: '-1000' }
    });
    fireEvent.click(screen.getByText('Calculate'));

    expect(screen.getByText('Principal must be positive')).toBeInTheDocument();
  });
});
```

**Example: Testing Custom Hook**
```typescript
// frontend/src/hooks/useProjects.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useProjects } from './useProjects';
import { api } from '../services/api';

jest.mock('../services/api');

describe('useProjects', () => {
  it('should fetch projects on mount', async () => {
    const mockProjects = [
      { id: 'proj_1', address: '123 Main St', status: 'LEAD' },
      { id: 'proj_2', address: '456 Elm St', status: 'FEASIBILITY' }
    ];

    (api.get as jest.Mock).mockResolvedValue({ data: mockProjects });

    const { result } = renderHook(() => useProjects());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.projects).toEqual(mockProjects);
  });

  it('should handle fetch error', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });
  });
});
```

### 4.3 Running Unit Tests

```bash
# Backend
cd backend
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage report
npm test payment-calculator # Run specific test file

# Frontend
cd frontend
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage report
npm test LoanCalculator     # Run specific test file
```

---

## 5. Integration Testing

### 5.1 API Integration Tests

**Example: Testing API Endpoint**
```typescript
// backend/tests/integration/projects.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { db } from '../../src/shared/database';

describe('Projects API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Setup test database
    await db.migrate.latest();
    await db.seed.run();

    // Get auth token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@blueprint.com', password: 'Admin123!' });

    authToken = res.body.access_token;
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('GET /api/v1/projects', () => {
    it('should return list of projects', async () => {
      const res = await request(app)
        .get('/api/v1/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.pagination).toHaveProperty('total');
    });

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/v1/projects?status=LEAD')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data.every(p => p.status === 'LEAD')).toBe(true);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/v1/projects')
        .expect(401);
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should create new project', async () => {
      const newProject = {
        address: '789 Oak St',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
        purchase_price: 500000
      };

      const res = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProject)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.address).toBe('789 Oak St');
      expect(res.body.status).toBe('LEAD');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ address: '123 Main St' }) // Missing required fields
        .expect(400);

      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toContainEqual(
        expect.objectContaining({ field: 'city' })
      );
    });
  });

  describe('PATCH /api/v1/projects/:id/transition', () => {
    it('should transition project status', async () => {
      // First, create a project
      const createRes = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          address: '999 Pine St',
          city: 'Seattle',
          state: 'WA',
          zip: '98101'
        });

      const projectId = createRes.body.id;

      // Then transition it
      const res = await request(app)
        .post(`/api/v1/projects/${projectId}/transition`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ to_status: 'FEASIBILITY' })
        .expect(200);

      expect(res.body.status).toBe('FEASIBILITY');
    });

    it('should reject invalid transitions', async () => {
      const createRes = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          address: '888 Maple St',
          city: 'Seattle',
          state: 'WA',
          zip: '98101'
        });

      const projectId = createRes.body.id;

      await request(app)
        .post(`/api/v1/projects/${projectId}/transition`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ to_status: 'CLOSED' }) // Invalid: LEAD -> CLOSED
        .expect(400);
    });
  });
});
```

### 5.2 Database Integration Tests

**Example: Testing Repository Layer**
```typescript
// backend/tests/integration/repositories/project-repository.test.ts
import { ProjectRepository } from '../../../src/modules/projects/repositories/project-repository';
import { db } from '../../../src/shared/database';

describe('ProjectRepository', () => {
  let repository: ProjectRepository;

  beforeAll(async () => {
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db('projects').del(); // Clear projects table
    repository = new ProjectRepository();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('create', () => {
    it('should create project with all fields', async () => {
      const project = await repository.create({
        address: '123 Main St',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
        status: 'LEAD',
        purchase_price: 500000
      });

      expect(project.id).toBeDefined();
      expect(project.created_at).toBeInstanceOf(Date);
      expect(project.updated_at).toBeInstanceOf(Date);
    });

    it('should set default status to LEAD', async () => {
      const project = await repository.create({
        address: '456 Elm St',
        city: 'Phoenix',
        state: 'AZ',
        zip: '85001'
      });

      expect(project.status).toBe('LEAD');
    });
  });

  describe('findById', () => {
    it('should find project by ID', async () => {
      const created = await repository.create({
        address: '789 Oak St',
        city: 'Seattle',
        state: 'WA',
        zip: '98101'
      });

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found.address).toBe('789 Oak St');
    });

    it('should return null for non-existent ID', async () => {
      const found = await repository.findById('proj_nonexistent');

      expect(found).toBeNull();
    });
  });

  describe('findByStatus', () => {
    beforeEach(async () => {
      await repository.create({ address: '1 A St', city: 'Seattle', state: 'WA', zip: '98101', status: 'LEAD' });
      await repository.create({ address: '2 B St', city: 'Seattle', state: 'WA', zip: '98101', status: 'FEASIBILITY' });
      await repository.create({ address: '3 C St', city: 'Seattle', state: 'WA', zip: '98101', status: 'LEAD' });
    });

    it('should find all projects with given status', async () => {
      const projects = await repository.findByStatus('LEAD');

      expect(projects).toHaveLength(2);
      expect(projects.every(p => p.status === 'LEAD')).toBe(true);
    });
  });

  describe('update', () => {
    it('should update project fields', async () => {
      const created = await repository.create({
        address: '123 Main St',
        city: 'Seattle',
        state: 'WA',
        zip: '98101'
      });

      const updated = await repository.update(created.id, {
        status: 'FEASIBILITY',
        purchase_price: 600000
      });

      expect(updated.status).toBe('FEASIBILITY');
      expect(updated.purchase_price).toBe(600000);
      expect(updated.updated_at.getTime()).toBeGreaterThan(created.updated_at.getTime());
    });
  });

  describe('softDelete', () => {
    it('should soft delete project', async () => {
      const created = await repository.create({
        address: '123 Main St',
        city: 'Seattle',
        state: 'WA',
        zip: '98101'
      });

      await repository.softDelete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull(); // Soft-deleted projects not returned by default

      // But still in database with deleted_at set
      const [row] = await db('projects').where({ id: created.id }).whereNotNull('deleted_at');
      expect(row).toBeDefined();
    });
  });
});
```

---

## 6. End-to-End Testing

### 6.1 E2E Test Framework (Playwright)

**Setup:**
```typescript
// frontend/tests/e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Example: Critical User Journey**
```typescript
// frontend/tests/e2e/loan-origination.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Loan Origination Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'loanofficer@blueprint.com');
    await page.fill('[name="password"]', 'LoanOfficer123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create loan from approved project', async ({ page }) => {
    // Navigate to projects
    await page.click('text=Projects');
    await expect(page).toHaveURL('/projects');

    // Filter for GO status
    await page.selectOption('[name="status"]', 'GO');
    await page.click('button:has-text("Apply Filters")');

    // Select first project
    await page.click('tr[data-project-row]:first-child');

    // Click "Create Loan"
    await page.click('button:has-text("Create Loan")');

    // Fill loan details
    await page.fill('[name="loan_amount"]', '1000000');
    await page.fill('[name="interest_rate"]', '8');
    await page.fill('[name="term_months"]', '24');
    await page.selectOption('[name="loan_type"]', 'CONSTRUCTION');

    // Add guarantor
    await page.click('button:has-text("Add Guarantor")');
    await page.fill('[name="guarantors[0].name"]', 'John Guarantor');
    await page.fill('[name="guarantors[0].email"]', 'guarantor@example.com');

    // Submit
    await page.click('button:has-text("Create Loan")');

    // Verify success
    await expect(page.locator('.toast-success')).toContainText('Loan created successfully');
    await expect(page).toHaveURL(/\/loans\/ln_/);

    // Verify loan details displayed
    await expect(page.locator('[data-testid="loan-amount"]')).toContainText('$1,000,000');
    await expect(page.locator('[data-testid="loan-status"]')).toContainText('Pending Approval');
  });

  test('should submit draw request', async ({ page }) => {
    // Navigate to loans
    await page.goto('/loans');

    // Select active loan
    await page.click('tr[data-loan-status="ACTIVE"]:first-child');

    // Click "Request Draw"
    await page.click('button:has-text("Request Draw")');

    // Fill draw request
    await page.fill('[name="amount"]', '150000');
    await page.fill('[name="description"]', 'Framing complete, electrical in progress');

    // Upload invoice
    const fileInput = page.locator('[name="invoice"]');
    await fileInput.setInputFiles('./tests/fixtures/sample-invoice.pdf');

    // Submit
    await page.click('button:has-text("Submit Draw Request")');

    // Verify success
    await expect(page.locator('.toast-success')).toContainText('Draw request submitted');
    await expect(page.locator('[data-testid="draw-status"]')).toContainText('Pending Inspection');
  });

  test('should approve draw after inspection', async ({ page }) => {
    // Login as inspector
    await page.goto('/logout');
    await page.goto('/login');
    await page.fill('[name="email"]', 'inspector@blueprint.com');
    await page.fill('[name="password"]', 'Inspector123!');
    await page.click('button[type="submit"]');

    // Navigate to draws
    await page.goto('/inspections');

    // Select pending draw
    await page.click('tr[data-draw-status="PENDING_INSPECTION"]:first-child');

    // Complete inspection
    await page.fill('[name="percentage_complete"]', '75');
    await page.fill('[name="notes"]', 'Work meets quality standards');

    // Upload photos
    const photoInput = page.locator('[name="photos"]');
    await photoInput.setInputFiles([
      './tests/fixtures/photo1.jpg',
      './tests/fixtures/photo2.jpg'
    ]);

    // Approve
    await page.click('button:has-text("Approve Draw")');

    // Verify approval
    await expect(page.locator('.toast-success')).toContainText('Draw approved');
    await expect(page.locator('[data-testid="draw-status"]')).toContainText('Approved');
  });
});
```

### 6.2 Running E2E Tests

```bash
cd frontend

# Run all E2E tests
npx playwright test

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test loan-origination.spec.ts

# Debug mode
npx playwright test --debug

# Run in specific browser
npx playwright test --project=chromium

# Generate report
npx playwright show-report
```

---

## 7. API Testing

### 7.1 Postman Collections

**Create Postman collection for all API endpoints:**

```json
{
  "info": {
    "name": "Connect 2.0 API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@blueprint.com\",\n  \"password\": \"Admin123!\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"Response contains access_token\", function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('access_token');",
                  "    pm.environment.set('access_token', jsonData.access_token);",
                  "});"
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### 7.2 Automated API Tests

```bash
# Run Postman collection via Newman
newman run connect-2.0-api.postman_collection.json \
  --environment dev.postman_environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export ./reports/api-tests.html
```

---

## 8. Database Testing

### 8.1 Migration Testing

```typescript
// backend/tests/migrations/migration.test.ts
import { db } from '../../src/shared/database';

describe('Database Migrations', () => {
  it('should run all migrations successfully', async () => {
    await db.migrate.rollback({}, true); // Rollback all
    await db.migrate.latest(); // Re-run all

    const [migrationStatus] = await db.migrate.list();
    expect(migrationStatus.every(m => m[1] === 1)).toBe(true); // All ran
  });

  it('should rollback all migrations successfully', async () => {
    await db.migrate.latest();
    await db.migrate.rollback({}, true);

    const [migrationStatus] = await db.migrate.list();
    expect(migrationStatus.every(m => m[1] === 0)).toBe(true); // All rolled back
  });
});
```

### 8.2 Data Integrity Tests

```typescript
describe('Data Integrity', () => {
  it('should enforce foreign key constraints', async () => {
    await expect(async () => {
      await db('loans').insert({
        project_id: 'proj_nonexistent', // Non-existent project
        amount: 1000000,
        status: 'PENDING'
      });
    }).rejects.toThrow(); // Foreign key violation
  });

  it('should enforce unique constraints', async () => {
    await db('users').insert({
      email: 'test@blueprint.com',
      password_hash: 'hash'
    });

    await expect(async () => {
      await db('users').insert({
        email: 'test@blueprint.com', // Duplicate email
        password_hash: 'hash2'
      });
    }).rejects.toThrow(); // Unique constraint violation
  });
});
```

---

## 9. Performance Testing

### 9.1 Load Testing with k6

**Example: API Load Test**
```javascript
// tests/performance/api-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users for 5 minutes
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% errors
  },
};

export default function () {
  // Login
  let loginRes = http.post('http://localhost:3000/api/v1/auth/login', JSON.stringify({
    email: 'test@blueprint.com',
    password: 'Test123!'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login returns token': (r) => r.json('access_token') !== '',
  });

  let token = loginRes.json('access_token');

  // Get projects
  let projectsRes = http.get('http://localhost:3000/api/v1/projects', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(projectsRes, {
    'projects status is 200': (r) => r.status === 200,
    'projects response time OK': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

**Run Load Test:**
```bash
k6 run tests/performance/api-load-test.js

# With Cloud Results
k6 run --out cloud tests/performance/api-load-test.js
```

### 9.2 Performance Benchmarks

| Operation | Target (p95) | Critical Threshold |
|-----------|--------------|---------------------|
| **GET /projects** | < 200ms | < 500ms |
| **POST /projects** | < 300ms | < 700ms |
| **GET /loans/:id** | < 150ms | < 400ms |
| **POST /draws** | < 400ms | < 1000ms |
| **Document Upload** | < 2s | < 5s |
| **PDF Generation** | < 3s | < 8s |

---

## 10. Security Testing

### 10.1 OWASP ZAP Automated Scan

```bash
# Run OWASP ZAP in headless mode
docker run -v $(pwd)/reports:/zap/wrk/:rw \
  -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000 \
  -r zap-report.html

# Review report in reports/zap-report.html
```

### 10.2 Security Test Checklist

**Manual Security Tests:**

- [ ] **Authentication**
  - [ ] Cannot access protected endpoints without token
  - [ ] Expired tokens are rejected
  - [ ] Invalid tokens are rejected
  - [ ] Password brute-force protection works

- [ ] **Authorization**
  - [ ] Users can only access their own data
  - [ ] Role-based access control enforced
  - [ ] Horizontal privilege escalation prevented
  - [ ] Vertical privilege escalation prevented

- [ ] **Input Validation**
  - [ ] SQL injection prevented
  - [ ] XSS attacks blocked
  - [ ] Command injection prevented
  - [ ] Path traversal prevented
  - [ ] File upload validation works

- [ ] **Session Management**
  - [ ] Sessions expire after inactivity
  - [ ] Logout invalidates session
  - [ ] Session fixation prevented

- [ ] **Data Protection**
  - [ ] Passwords are hashed (bcrypt)
  - [ ] Sensitive data encrypted at rest
  - [ ] HTTPS enforced
  - [ ] No sensitive data in logs

---

## 11. User Acceptance Testing (UAT)

### 11.1 UAT Process

**Phase 1: Internal UAT (Days 80-85)**
- Blueprint team tests Design & Entitlement module
- 5 entitlement team members participate
- Test real-world workflows with live data

**Phase 2: Pilot UAT (Days 85-90)**
- Full entitlement team (10 users) uses system
- Monitor for issues, gather feedback
- Daily stand-ups to triage bugs

**Phase 3: Full UAT (Days 175-180)**
- All Blueprint teams use full platform
- 30+ users across acquisitions, entitlement, servicing
- Final acceptance before go-live

### 11.2 UAT Test Cases

**Example: Entitlement Workflow**

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| **Submit Permit Application** | 1. Navigate to project<br>2. Click "Submit Permit"<br>3. Fill form<br>4. Attach documents<br>5. Submit | Permit record created, status = "SUBMITTED", email sent to jurisdiction |
| **Track Permit Corrections** | 1. Receive correction notice<br>2. Log correction in system<br>3. Upload revised plans<br>4. Mark as resubmitted | Correction logged, documents attached, status = "RESUBMITTED" |
| **Receive Permit Approval** | 1. Update status to "APPROVED"<br>2. Attach approval letter<br>3. Record expiration date | Status updated, documents attached, expiration reminder scheduled |

### 11.3 UAT Acceptance Criteria

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| **User Satisfaction** | ≥ 85% | Post-UAT survey |
| **Task Success Rate** | ≥ 90% | Observed task completion |
| **Critical Bugs** | 0 | Bug tracker |
| **Major Bugs** | < 5 | Bug tracker |
| **Performance** | < 3s page load | Monitoring |

---

## 12. Test Data Management

### 12.1 Seed Data Strategy

**Test Environments:**

| Environment | Data Source | Refresh Frequency |
|-------------|-------------|-------------------|
| **Local Dev** | Seed scripts | On-demand |
| **CI/CD** | Fresh seeds per test run | Every run |
| **Staging** | Sanitized production snapshot | Weekly |
| **UAT** | Curated realistic data | Monthly |

### 12.2 Seed Data Example

```typescript
// backend/seeds/01_users.ts
export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  await knex('users').insert([
    {
      id: 'usr_admin_01',
      email: 'admin@blueprint.com',
      password_hash: await bcrypt.hash('Admin123!', 10),
      role: 'ADMIN',
      first_name: 'Admin',
      last_name: 'User'
    },
    {
      id: 'usr_acq_01',
      email: 'acquisitions@blueprint.com',
      password_hash: await bcrypt.hash('Acq123!', 10),
      role: 'ACQUISITIONS',
      first_name: 'Sarah',
      last_name: 'Acquisitions'
    },
    {
      id: 'usr_ent_01',
      email: 'entitlement@blueprint.com',
      password_hash: await bcrypt.hash('Ent123!', 10),
      role: 'ENTITLEMENT',
      first_name: 'Mike',
      last_name: 'Entitlement'
    }
  ]);
}
```

### 12.3 Data Anonymization for Staging

```typescript
// scripts/anonymize-data.ts
async function anonymizeProductionData() {
  // Anonymize personal data
  await db('contacts').update({
    email: db.raw("CONCAT('user_', id, '@example.com')"),
    phone: '555-0100',
    first_name: 'Test',
    last_name: db.raw("CONCAT('User ', id)")
  });

  // Anonymize financial data
  await db('loans').update({
    amount: db.raw('FLOOR(RANDOM() * 2000000) + 500000')
  });

  console.log('Data anonymized successfully');
}
```

---

## 13. Continuous Integration

### 13.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: connect2_test
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: connect2_test
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run linter
        working-directory: backend
        run: npm run lint

      - name: Run tests
        working-directory: backend
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://connect2_test:test_password@localhost:5432/connect2_test
          REDIS_URL: redis://localhost:6379

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info

  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Run linter
        working-directory: frontend
        run: npm run lint

      - name: Run tests
        working-directory: frontend
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci

      - name: Install Playwright
        working-directory: frontend
        run: npx playwright install --with-deps

      - name: Run E2E tests
        working-directory: frontend
        run: npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

### 13.2 Pre-Commit Hooks

```bash
# Install Husky
npm install --save-dev husky

# Setup pre-commit hook
npx husky install
npx husky add .husky/pre-commit "npm test"
```

**.husky/pre-commit:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linter
npm run lint

# Run tests
npm test -- --bail --findRelatedTests
```

---

## 14. Quality Metrics

### 14.1 Code Coverage Dashboard

**Target Coverage:**
- **Backend**: ≥ 80% overall, ≥ 90% for business logic
- **Frontend**: ≥ 75% overall, ≥ 85% for critical components

**Tracking:**
- Use Codecov or SonarQube for coverage tracking
- Block PRs that decrease coverage below threshold

### 14.2 Test Health Metrics

| Metric | Target | Critical Threshold |
|--------|--------|---------------------|
| **Test Success Rate** | 100% | ≥ 98% |
| **Test Execution Time** | < 30 min | < 45 min |
| **Flaky Test Rate** | 0% | < 2% |
| **Defect Escape Rate** | < 5% | < 10% |

---

## 15. Bug Management

### 15.1 Bug Severity Levels

| Severity | Description | SLA | Example |
|----------|-------------|-----|---------|
| **Critical** | System down, data loss, security breach | Fix within 4 hours | Database corruption, unauthorized access |
| **High** | Major feature broken, blocking workflow | Fix within 1 day | Cannot create loans, draw approvals failing |
| **Medium** | Feature partially broken, workaround exists | Fix within 1 week | UI glitch, slow performance |
| **Low** | Minor issue, cosmetic | Fix in next sprint | Typo, minor UX improvement |

### 15.2 Bug Workflow

```
[New Bug] → [Triaged] → [In Progress] → [In Review] → [Verified] → [Closed]
                ↓
            [Deferred] (low priority, future release)
```

### 15.3 Bug Report Template

```markdown
**Summary:** Brief description of the bug

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** What should happen

**Actual Result:** What actually happens

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- URL: https://staging.connect2.blueprint.com/loans/ln_123

**Screenshots/Videos:** (attach if applicable)

**Console Errors:** (copy/paste any errors)
```

---

**End of Testing Strategy**
