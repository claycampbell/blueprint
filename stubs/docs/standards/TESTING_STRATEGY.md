# Testing Strategy and Quality Assurance

**Version:** 2.0
**Last Updated:** January 2026
**Status:** Active
**Related Documents:** [SYSTEM_ARCHITECTURE.md](../architecture/SYSTEM_ARCHITECTURE.md), [TECH_STACK_DECISIONS.md](../architecture/TECH_STACK_DECISIONS.md)

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
| **Pytest** | Unit & integration testing (backend) | https://pytest.org |
| **Vitest** | Unit testing (frontend) | https://vitest.dev |
| **HTTPX** | Async API testing | https://www.python-httpx.org |
| **Playwright** | E2E testing | https://playwright.dev |
| **k6** | Load/performance testing | https://k6.io |
| **OWASP ZAP** | Security testing | https://www.zaproxy.org |
| **Ruff** | Code quality (linting) | https://docs.astral.sh/ruff |
| **MyPy** | Type checking | https://mypy.readthedocs.io |

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

### 4.1 Backend Unit Tests (Pytest)

**Setup:**
```python
# tests/conftest.py
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

@pytest.fixture
def anyio_backend():
    return "asyncio"

@pytest.fixture
async def test_db():
    """Create a test database session."""
    engine = create_async_engine(
        "postgresql+asyncpg://postgres:postgres@localhost:5432/test_db",
        echo=False
    )
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session
```

**Example: Testing Business Logic**
```python
# tests/unit/services/test_payment_calculator.py
import pytest
from decimal import Decimal
from app.services.payment_calculator import PaymentCalculator

class TestPaymentCalculator:
    def setup_method(self):
        self.calculator = PaymentCalculator()

    def test_calculate_monthly_payment_standard_loan(self):
        """Should calculate correct monthly payment for standard loan."""
        result = self.calculator.calculate_monthly_payment(
            principal=Decimal("1000000"),
            annual_rate=Decimal("0.08"),
            term_months=24
        )

        assert result.monthly_payment == pytest.approx(Decimal("45207.57"), rel=1e-2)
        assert result.total_interest == pytest.approx(Decimal("84981.68"), rel=1e-2)

    def test_calculate_monthly_payment_zero_interest(self):
        """Should handle zero interest rate."""
        result = self.calculator.calculate_monthly_payment(
            principal=Decimal("1000000"),
            annual_rate=Decimal("0"),
            term_months=24
        )

        assert result.monthly_payment == pytest.approx(Decimal("41666.67"), rel=1e-2)
        assert result.total_interest == Decimal("0")

    def test_calculate_monthly_payment_negative_principal_raises(self):
        """Should raise error for negative principal."""
        with pytest.raises(ValueError, match="Principal must be positive"):
            self.calculator.calculate_monthly_payment(
                principal=Decimal("-1000"),
                annual_rate=Decimal("0.08"),
                term_months=24
            )

    def test_calculate_monthly_payment_zero_term_raises(self):
        """Should raise error for term less than 1 month."""
        with pytest.raises(ValueError, match="Term must be at least 1 month"):
            self.calculator.calculate_monthly_payment(
                principal=Decimal("1000000"),
                annual_rate=Decimal("0.08"),
                term_months=0
            )
```

**Example: Testing Service Layer with Mocks**
```python
# tests/unit/services/test_project_service.py
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.project_service import ProjectService
from app.repositories.project_repository import ProjectRepository
from app.events.event_bus import EventBus

class TestProjectService:
    @pytest.fixture
    def mock_repository(self):
        return AsyncMock(spec=ProjectRepository)

    @pytest.fixture
    def mock_event_bus(self):
        return AsyncMock(spec=EventBus)

    @pytest.fixture
    def service(self, mock_repository, mock_event_bus):
        return ProjectService(mock_repository, mock_event_bus)

    async def test_transition_status_lead_to_feasibility(
        self, service, mock_repository, mock_event_bus
    ):
        """Should transition project from LEAD to FEASIBILITY."""
        project = MagicMock(id="proj_123", status="LEAD", address="123 Main St")
        mock_repository.find_by_id.return_value = project
        mock_repository.update.return_value = MagicMock(
            **{**project.__dict__, "status": "FEASIBILITY"}
        )

        result = await service.transition_status("proj_123", "FEASIBILITY", "user_456")

        assert result.status == "FEASIBILITY"
        mock_event_bus.publish.assert_called_once_with(
            "project.status_changed",
            {
                "project_id": "proj_123",
                "from": "LEAD",
                "to": "FEASIBILITY",
                "changed_by": "user_456"
            }
        )

    async def test_transition_status_invalid_raises(self, service, mock_repository):
        """Should raise error for invalid transition."""
        project = MagicMock(id="proj_123", status="LEAD")
        mock_repository.find_by_id.return_value = project

        with pytest.raises(ValueError, match="Invalid status transition: LEAD -> CLOSED"):
            await service.transition_status("proj_123", "CLOSED", "user_456")
```

### 4.2 Frontend Unit Tests (Vitest)

**Example: Testing React Component**
```typescript
// src/components/LoanCalculator.test.tsx
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

### 4.3 Running Unit Tests

```bash
# Backend (Python/FastAPI)
cd stubs/api
uv run pytest tests/unit -v                    # Run all unit tests
uv run pytest tests/unit -v --cov=app          # With coverage
uv run pytest tests/unit/test_payment.py -v    # Specific file

# Frontend (React/Vite)
cd stubs/web
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # With coverage
```

---

## 5. Integration Testing

### 5.1 API Integration Tests

**Example: Testing API Endpoint with TestClient**
```python
# tests/integration/test_projects_api.py
import pytest
from httpx import AsyncClient
from app.main import app

class TestProjectsAPI:
    @pytest.fixture
    async def client(self):
        async with AsyncClient(app=app, base_url="http://test") as client:
            yield client

    @pytest.fixture
    async def auth_token(self, client):
        response = await client.post(
            "/api/v1/auth/token",
            data={"username": "admin@blueprint.com", "password": "Admin123!"}
        )
        return response.json()["access_token"]

    async def test_list_projects(self, client, auth_token):
        """Should return list of projects."""
        response = await client.get(
            "/api/v1/projects",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "pagination" in data

    async def test_list_projects_filter_by_status(self, client, auth_token):
        """Should filter projects by status."""
        response = await client.get(
            "/api/v1/projects?status=LEAD",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert all(p["status"] == "LEAD" for p in data["data"])

    async def test_list_projects_requires_auth(self, client):
        """Should require authentication."""
        response = await client.get("/api/v1/projects")
        assert response.status_code == 401

    async def test_create_project(self, client, auth_token):
        """Should create new project."""
        new_project = {
            "address": "789 Oak St",
            "city": "Seattle",
            "state": "WA",
            "zip": "98101",
            "purchase_price": 500000
        }

        response = await client.post(
            "/api/v1/projects",
            json=new_project,
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["address"] == "789 Oak St"
        assert data["status"] == "LEAD"

    async def test_create_project_validates_fields(self, client, auth_token):
        """Should validate required fields."""
        response = await client.post(
            "/api/v1/projects",
            json={"address": "123 Main St"},  # Missing required fields
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
```

### 5.2 Database Integration Tests

**Example: Testing Repository Layer**
```python
# tests/integration/repositories/test_project_repository.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.project_repository import ProjectRepository
from app.models.project import Project

class TestProjectRepository:
    @pytest.fixture
    def repository(self, test_db: AsyncSession):
        return ProjectRepository(test_db)

    async def test_create_project(self, repository):
        """Should create project with all fields."""
        project = await repository.create(
            address="123 Main St",
            city="Seattle",
            state="WA",
            zip="98101",
            status="LEAD",
            purchase_price=500000
        )

        assert project.id is not None
        assert project.created_at is not None
        assert project.updated_at is not None

    async def test_create_project_default_status(self, repository):
        """Should set default status to LEAD."""
        project = await repository.create(
            address="456 Elm St",
            city="Phoenix",
            state="AZ",
            zip="85001"
        )

        assert project.status == "LEAD"

    async def test_find_by_id(self, repository):
        """Should find project by ID."""
        created = await repository.create(
            address="789 Oak St",
            city="Seattle",
            state="WA",
            zip="98101"
        )

        found = await repository.find_by_id(created.id)

        assert found is not None
        assert found.address == "789 Oak St"

    async def test_find_by_id_nonexistent(self, repository):
        """Should return None for non-existent ID."""
        found = await repository.find_by_id("proj_nonexistent")
        assert found is None

    async def test_soft_delete(self, repository):
        """Should soft delete project."""
        created = await repository.create(
            address="123 Main St",
            city="Seattle",
            state="WA",
            zip="98101"
        )

        await repository.soft_delete(created.id)

        found = await repository.find_by_id(created.id)
        assert found is None  # Soft-deleted not returned by default
```

---

## 6. End-to-End Testing

### 6.1 E2E Test Framework (Playwright)

**Setup:**
```typescript
// playwright.config.ts
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
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

**Example: Critical User Journey**
```typescript
// tests/e2e/loan-origination.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Loan Origination Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'loanofficer@blueprint.com');
    await page.fill('[name="password"]', 'LoanOfficer123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create loan from approved project', async ({ page }) => {
    await page.click('text=Projects');
    await expect(page).toHaveURL('/projects');

    await page.selectOption('[name="status"]', 'GO');
    await page.click('button:has-text("Apply Filters")');
    await page.click('tr[data-project-row]:first-child');
    await page.click('button:has-text("Create Loan")');

    await page.fill('[name="loan_amount"]', '1000000');
    await page.fill('[name="interest_rate"]', '8');
    await page.fill('[name="term_months"]', '24');
    await page.selectOption('[name="loan_type"]', 'CONSTRUCTION');

    await page.click('button:has-text("Create Loan")');

    await expect(page.locator('.toast-success')).toContainText('Loan created');
    await expect(page).toHaveURL(/\/loans\/ln_/);
  });
});
```

### 6.2 Running E2E Tests

```bash
cd stubs/web

npx playwright test                        # Run all E2E tests
npx playwright test --headed               # See browser
npx playwright test loan-origination.spec.ts  # Specific file
npx playwright test --debug                # Debug mode
npx playwright show-report                 # View report
```

---

## 7. API Testing

### 7.1 Automated API Tests via CI

The API is tested automatically in CI via pytest with HTTPX AsyncClient. See Section 5.1 for examples.

### 7.2 Performance Benchmarks

| Operation | Target (p95) | Critical Threshold |
|-----------|--------------|---------------------|
| **GET /projects** | < 200ms | < 500ms |
| **POST /projects** | < 300ms | < 700ms |
| **GET /loans/:id** | < 150ms | < 400ms |
| **POST /draws** | < 400ms | < 1000ms |
| **Document Upload** | < 2s | < 5s |
| **PDF Generation** | < 3s | < 8s |

---

## 8. Database Testing

### 8.1 Migration Testing

```python
# tests/migrations/test_migrations.py
import pytest
from alembic import command
from alembic.config import Config

class TestMigrations:
    @pytest.fixture
    def alembic_config(self):
        return Config("alembic.ini")

    def test_upgrade_to_head(self, alembic_config):
        """Should run all migrations successfully."""
        command.downgrade(alembic_config, "base")
        command.upgrade(alembic_config, "head")

    def test_downgrade_to_base(self, alembic_config):
        """Should rollback all migrations successfully."""
        command.upgrade(alembic_config, "head")
        command.downgrade(alembic_config, "base")
```

---

## 9. Performance Testing

### 9.1 Load Testing with k6

```javascript
// tests/performance/api-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  let loginRes = http.post('http://localhost:8000/api/v1/auth/token', {
    username: 'test@blueprint.com',
    password: 'Test123!'
  });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
  });

  let token = loginRes.json('access_token');

  let projectsRes = http.get('http://localhost:8000/api/v1/projects', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(projectsRes, {
    'projects status is 200': (r) => r.status === 200,
    'projects response time OK': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

---

## 10. Security Testing

### 10.1 Security Test Checklist

- [ ] **Authentication**: Cannot access protected endpoints without token
- [ ] **Authorization**: Users can only access their own data
- [ ] **Input Validation**: SQL injection, XSS, command injection prevented
- [ ] **Session Management**: Sessions expire, logout invalidates
- [ ] **Data Protection**: Passwords hashed, sensitive data encrypted

---

## 11. User Acceptance Testing (UAT)

### 11.1 UAT Process

**Phase 1: Internal UAT (Days 80-85)**
- Blueprint team tests Design & Entitlement module
- 5 entitlement team members participate

**Phase 2: Pilot UAT (Days 85-90)**
- Full entitlement team (10 users) uses system
- Daily stand-ups to triage bugs

**Phase 3: Full UAT (Days 175-180)**
- All Blueprint teams use full platform
- 30+ users across acquisitions, entitlement, servicing

---

## 12. Test Data Management

### 12.1 Seed Data Strategy

| Environment | Data Source | Refresh Frequency |
|-------------|-------------|-------------------|
| **Local Dev** | Seed scripts | On-demand |
| **CI/CD** | Fresh seeds per test run | Every run |
| **Staging** | Sanitized production snapshot | Weekly |
| **UAT** | Curated realistic data | Monthly |

---

## 13. Continuous Integration

### 13.1 GitHub Actions Workflow

See [deploy-prod.yml](../../api/.github/workflows/deploy-prod.yml) for the full CI/CD pipeline which includes:
- Ruff linting
- MyPy type checking
- Pytest with coverage
- Docker build and push
- ECS deployment

### 13.2 Pre-Commit Hooks

Pre-commit hooks are configured in `.claude/hooks/pre-commit.sh` and run:
- Ruff linter (auto-fix)
- Ruff formatter
- MyPy (warnings)
- Pytest (blocking)

---

## 14. Quality Metrics

### 14.1 Code Coverage Dashboard

**Target Coverage:**
- **Backend**: ≥ 80% overall, ≥ 90% for business logic
- **Frontend**: ≥ 75% overall, ≥ 85% for critical components

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
| **Critical** | System down, data loss, security breach | Fix within 4 hours | Database corruption |
| **High** | Major feature broken, blocking workflow | Fix within 1 day | Cannot create loans |
| **Medium** | Feature partially broken, workaround exists | Fix within 1 week | UI glitch |
| **Low** | Minor issue, cosmetic | Fix in next sprint | Typo |

---

## Change Log

| Date | Version | Change |
|------|---------|--------|
| January 2026 | 2.0 | Updated for Python/FastAPI stack, async testing patterns |
| November 2025 | 1.0 | Initial testing strategy document |
