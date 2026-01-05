# Connect 2.0 Development Guide

**Version:** 2.0
**Last Updated:** January 2026
**Status:** Active

---

## Overview

This guide covers everything developers need to know to contribute to Connect 2.0. It consolidates the development workflow, quality standards, and documentation requirements across both services (API and Web).

---

## Quick Links

| Service | Quickstart | Architecture | Spec |
|---------|------------|--------------|------|
| **API** | [API Quickstart](../api/docs/technical/API_QUICKSTART.md) | [FastAPI Standards](../api/docs/technical/FASTAPI_PROJECT_STANDARDS.md) | [API Specification](../api/docs/technical/API_SPECIFICATION.md) |
| **Web** | [Web Quickstart](../web/docs/technical/APP_QUICKSTART.md) | [Frontend Architecture](../web/docs/technical/FRONTEND_ARCHITECTURE.md) | N/A |
| **Infrastructure** | [API Infrastructure](../api/docs/technical/INFRASTRUCTURE.md) | [System Architecture](architecture/SYSTEM_ARCHITECTURE.md) | N/A |

---

## Repository Structure

Connect 2.0 is composed of **two independent applications**, each designed to be a standalone repository. See [REPOSITORY_STRUCTURE.md](../architecture/REPOSITORY_STRUCTURE.md) for detailed documentation.

### Independent Repositories

API and Web are developed and deployed independently. They communicate via HTTPS and have no shared infrastructure dependencies.

| Repository | Tech Stack | Domain | VPC CIDR |
|------------|-----------|--------|----------|
| **connect2-api** | FastAPI + PostgreSQL + Redis | api.connect.com | 10.1.0.0/16 |
| **connect2-web** | React + Nginx | app.connect.com | 10.2.0.0/16 |

### Initial Discovery Structure

During initial discovery, both applications exist in a shared `stubs/` directory but are already structured for extraction:

```
stubs/
├── api/                          # → Future: connect2-api repository
│   ├── app/                      # Application code
│   ├── tests/                    # Test suite
│   ├── docs/                     # API documentation
│   ├── infrastructure/           # Complete API infrastructure
│   │   └── terraform/
│   │       ├── environments/     # dev, staging, prod
│   │       └── modules/          # VPC, ECS, RDS, Redis, etc.
│   ├── scripts/                  # Utility scripts (rollback, etc.)
│   ├── .github/                  # CI/CD workflows
│   └── README.md                 # Standalone repo documentation
│
├── web/                          # → Future: connect2-web repository
│   ├── src/                      # Application code
│   ├── docs/                     # Web documentation
│   ├── infrastructure/           # Complete Web infrastructure
│   │   └── terraform/
│   │       ├── environments/     # dev, staging, prod
│   │       └── modules/          # VPC, ECS, ECR, etc.
│   ├── scripts/                  # Utility scripts (rollback, etc.)
│   ├── .github/                  # CI/CD workflows
│   └── README.md                 # Standalone repo documentation
│
└── docs/                         # Overarching documentation
    ├── architecture/             # System architecture, repository structure
    ├── development/              # This guide, developer tools
    └── standards/                # Coding and process standards
```

### Key Design Principles

1. **No shared infrastructure** — Each application owns its VPC, ECS cluster, and all AWS resources
2. **Independent deployment** — Deploy API or Web without coordinating with the other
3. **Cloud provider flexibility** — Either service can be migrated to a different cloud
4. **Self-contained repositories** — Each directory has everything needed to operate alone
5. **HTTPS communication** — Web connects to API via public endpoints, not internal networking

### Working on a Single Service

When working on just the API or Web:

```bash
# API development (everything you need is in api/)
cd stubs/api
uv sync --all-extras
cp .env.example .env
uv run uvicorn app.main:app --reload

# Web development (everything you need is in web/)
cd stubs/web
npm install
cp .env.example .env.local
npm run dev
```

Each application is self-contained. You don't need to set up the other service unless you need to test integration.

---

## Development Workflow

### 1. Before You Start Coding

- [ ] **Understand the task** - Read the Jira ticket thoroughly
- [ ] **Check existing code** - Search for similar patterns in the codebase
- [ ] **Review architecture docs** - Ensure your approach aligns with standards
- [ ] **Ask questions early** - Clarify requirements before investing time

**Using Claude Code for Jira:** You can interact with Jira directly through Claude Code. Ask naturally about searching issues, creating bugs, updating statuses, or linking related stories. See [Developer Tools Setup](DEVELOPER_TOOLS_SETUP.md#real-world-workflow-examples) for detailed examples.

### 2. While Coding

**For API work:**
- [ ] Follow [FastAPI Standards](../api/docs/technical/FASTAPI_PROJECT_STANDARDS.md)
- [ ] Write tests as you go - Don't leave testing for the end
- [ ] Run pre-commit checks: `uv run ruff check . && uv run mypy app && uv run pytest`

**For Web work:**
- [ ] Follow [Frontend Architecture](../web/docs/technical/FRONTEND_ARCHITECTURE.md)
- [ ] Write tests as you go - Don't leave testing for the end
- [ ] Run pre-commit checks: `npm run lint && npx tsc --noEmit && npm run test -- --run`

**For Both:**
- [ ] Commit frequently - Small, focused commits with clear messages
- [ ] Keep infrastructure PRs separate from code PRs

### 3. Before Opening a PR

Use the service-specific PR template checklist. Key items for all PRs:

#### Code Quality
- [ ] All pre-commit hooks pass
- [ ] New code has test coverage (target: 80%+ for new code)
- [ ] No hardcoded secrets, URLs, or environment-specific values
- [ ] Error handling is appropriate (not swallowing exceptions)

#### Documentation
- [ ] **Code comments** - Complex logic is explained
- [ ] **Docstrings/TypeScript types** - Public functions are documented
- [ ] **README updates** - If you changed how to run/configure something

#### Runbooks (for significant changes)
- [ ] **Deployment impact** - Does this change require special deployment steps?
- [ ] **Rollback plan** - How do we undo this if it breaks?
- [ ] **Monitoring** - What should we watch after deployment?

---

## Quality Gates

### Automated (Pre-commit Hooks)

These run automatically before every commit:

**API (Python/FastAPI):**

| Check | Tool | Blocking? |
|-------|------|-----------|
| Linting | Ruff | Yes |
| Formatting | Ruff | Yes |
| Type checking | MyPy | Warnings only |
| Tests | Pytest | Yes |

**Web (TypeScript/React):**

| Check | Tool | Blocking? |
|-------|------|-----------|
| Linting | ESLint | Yes |
| Formatting | Prettier | Yes |
| Type checking | TypeScript | Yes |
| Tests | Vitest | Yes |

**Run manually:**
```bash
# API
cd stubs/api
uv run ruff check . --fix && uv run ruff format . && uv run mypy app && uv run pytest

# Web
cd stubs/web
npm run lint -- --fix && npx tsc --noEmit && npm run test -- --run
```

### CI Pipeline (GitHub Actions)

These run on every PR:

| Check | API | Web | Required to Merge? |
|-------|-----|-----|-------------------|
| Lint + Format | `ruff check` | `eslint` | Yes |
| Type Check | `mypy` | `tsc` | Yes |
| Unit Tests | `pytest` | `vitest` | Yes |
| Build | Docker | Docker | Yes |

### Human Review

PR reviewers should verify:

- [ ] Code is readable and maintainable
- [ ] Approach makes sense for the problem
- [ ] Tests cover happy path AND edge cases
- [ ] Documentation is updated
- [ ] No security concerns
- [ ] **Infrastructure and code are in separate PRs**

---

## Separate Infrastructure and Code PRs

**Never mix infrastructure changes and application code in the same PR.**

| PR Type | Contains | Examples |
|---------|----------|----------|
| **Code PR** | Application code, tests, styles | `feat: add user authentication` |
| **Infrastructure PR** | Terraform, Docker, GitHub Actions | `infra: add Redis cache` |

**Why?**
- **Clean rollbacks** - Revert code without affecting infrastructure
- **Easier reviews** - Reviewers can focus on one type of change
- **Simpler debugging** - Know exactly what changed if issues arise
- **Independent timing** - Infrastructure may need to deploy before code

**When a feature needs both:**
```
1. PR #1: "infra: Add ElastiCache Redis cluster" → merge, wait for deploy
2. PR #2: "feat: Use Redis for session caching" → merge
```

---

## Documentation Requirements

### When to Update Documentation

| Change Type | Required Documentation |
|-------------|----------------------|
| **New API endpoint** | API spec auto-updates; verify in `/docs` |
| **New UI feature** | Update component documentation if complex |
| **Config change** | Update `.env.example` and quickstart |
| **Breaking change** | Update migration guide, add to changelog |
| **Infrastructure** | Update INFRASTRUCTURE.md (API or Web) |
| **Deployment process** | Update runbook |

### Runbook Requirements

For significant changes, create or update a runbook in `docs/runbooks/`:

**Runbook Template:**
```markdown
# [Feature/Change Name] Runbook

## Overview
Brief description of what this covers.

## Prerequisites
- What needs to be in place before deployment

## Deployment Steps
1. Step-by-step deployment process
2. Include specific commands

## Verification
- How to verify the deployment succeeded
- Health checks, smoke tests

## Rollback
- How to undo if something goes wrong
- Specific rollback commands

## Monitoring
- What to watch after deployment
- Expected metrics/logs

## Troubleshooting
- Common issues and solutions
```

---

## Git Workflow

### Branch Naming

```
<type>/<short-description>

Examples:
feature/add-user-authentication
bugfix/fix-draw-calculation
infra/add-redis-cache
docs/update-api-spec
```

### Commit Messages

```
<type>: <subject>

<body - what and why>

Closes: DP01-XXX
Related: DP01-YYY

Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `infra`

### PR Process

1. Create feature branch from `development`
2. Make changes, commit frequently
3. Push branch, create PR
4. Fill out PR template checklist
5. Request review
6. Address feedback
7. Merge after approval

---

## Environment Setup

### Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Python | 3.12+ | API development |
| uv | Latest | Python package management |
| Node.js | 20+ | Web development |
| npm | 10+ | Node package management |
| Docker | Latest | Local services, deployment |
| Git | Latest | Version control |
| Terraform | 1.0+ | Infrastructure management |

### First-Time Setup

```bash
# Clone the repository
git clone https://github.com/your-org/connect2.git
cd connect2

# API setup
cd stubs/api
uv sync --all-extras
cp .env.example .env

# Web setup
cd ../web
npm install
cp .env.example .env.local

# Start local services (PostgreSQL, Redis)
cd ../..
docker compose up -d

# Verify API
cd stubs/api
uv run uvicorn app.main:app --reload
# Visit http://localhost:8000/docs

# Verify Web (in separate terminal)
cd stubs/web
npm run dev
# Visit http://localhost:3000
```

---

## Testing Standards

### Test Coverage Targets

| Type | Target | Critical Modules |
|------|--------|-----------------|
| Unit | 80% | Business logic, services, utilities |
| Integration | 70% | API endpoints, components |
| E2E | 60% | Critical user flows |

### What to Test

**DO test:**
- Business logic and calculations
- API endpoint behavior
- Component rendering and interaction
- Error handling
- Edge cases
- Security controls

**DON'T test:**
- Third-party libraries
- Framework internals
- Simple getters/setters

### Unit Testing

Unit tests are the foundation of our testing strategy. Every PR must include unit tests for new or modified code.

**API Unit Tests (Pytest):**

```
stubs/api/tests/
├── unit/                      # Unit tests (isolated, fast)
│   ├── test_services/         # Service layer tests
│   ├── test_schemas/          # Pydantic validation tests
│   └── test_utils/            # Utility function tests
├── integration/               # Integration tests (with DB)
│   └── test_api/              # Endpoint tests
└── conftest.py                # Shared fixtures
```

**Example API Unit Test:**
```python
# tests/unit/test_services/test_project_service.py
import pytest
from app.services.project_service import calculate_project_roi

class TestCalculateProjectROI:
    def test_positive_roi(self):
        """ROI calculation with profit returns positive percentage."""
        result = calculate_project_roi(revenue=150000, cost=100000)
        assert result == 50.0

    def test_zero_cost_raises_error(self):
        """Division by zero is handled gracefully."""
        with pytest.raises(ValueError, match="Cost cannot be zero"):
            calculate_project_roi(revenue=100000, cost=0)

    def test_negative_roi(self):
        """Loss scenario returns negative percentage."""
        result = calculate_project_roi(revenue=80000, cost=100000)
        assert result == -20.0
```

**Web Unit Tests (Vitest + React Testing Library):**

```
stubs/web/src/
├── api/users/
│   ├── queries.ts
│   └── queries.test.ts        # Co-located test
├── features/dashboard/
│   ├── components/
│   │   ├── StatsCard.tsx
│   │   └── StatsCard.test.tsx # Co-located test
│   └── hooks/
│       ├── useMetrics.ts
│       └── useMetrics.test.ts # Co-located test
└── lib/
    ├── utils.ts
    └── utils.test.ts          # Co-located test
```

**Example Web Unit Test:**
```typescript
// src/features/dashboard/components/StatsCard.test.tsx
import { render, screen } from '@testing-library/react';
import { StatsCard } from './StatsCard';

describe('StatsCard', () => {
  it('renders title and value', () => {
    render(<StatsCard title="Total Projects" value={42} />);

    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    render(<StatsCard title="Total Projects" value={0} loading />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('formats large numbers with commas', () => {
    render(<StatsCard title="Revenue" value={1234567} />);

    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });
});
```

**Unit Test Best Practices:**
- **Arrange-Act-Assert pattern** - Clear test structure
- **One assertion per test** (when practical) - Easier debugging
- **Descriptive test names** - `test_<what>_<condition>_<expected>`
- **Test edge cases** - Null, empty, boundary values
- **Mock external dependencies** - Isolate the unit under test
- **Fast execution** - Unit tests should run in milliseconds

### Running Tests

```bash
# API
cd stubs/api
uv run pytest                          # All tests
uv run pytest -v                       # Verbose
uv run pytest --cov=app                # With coverage
uv run pytest -k "test_user"           # Specific tests
uv run pytest tests/unit/              # Unit tests only
uv run pytest tests/unit/test_services # Specific directory
uv run pytest -x                       # Stop on first failure

# Web
cd stubs/web
npm run test                           # Watch mode
npm run test -- --run                  # Single run (CI)
npm run test:coverage                  # With coverage
npm run test -- Button.test.tsx        # Specific file
npm run test -- --reporter=verbose     # Verbose output
```

### Test Requirements for PRs

Before opening a PR, ensure:

- [ ] **Unit tests pass** - `uv run pytest tests/unit/` or `npm run test -- --run`
- [ ] **New code has tests** - Every new function/component has corresponding tests
- [ ] **Coverage meets threshold** - 80% for new code
- [ ] **Tests are meaningful** - Not just coverage padding, but actual behavior verification
- [ ] **Edge cases covered** - Null, empty, error conditions tested

---

## Common Patterns

### Adding a New API Endpoint

1. Create Pydantic schemas in `app/schemas/`
2. Create/update SQLAlchemy model in `app/models/`
3. Create repository methods in `app/db/repositories/`
4. Create service layer in `app/services/`
5. Create route in `app/api/v1/`
6. Add route to router in `app/api/router.py`
7. Write tests
8. Verify in Swagger UI (`/docs`)

### Adding a New Web Feature

1. Create API hooks in `src/api/[domain]/`
2. Create Zustand store if needed in `src/stores/` (shared) or `src/features/*/store.ts` (private)
3. Create components in `src/features/[feature]/components/`
4. Create page in `src/pages/`
5. Add route in `src/app/routes.tsx`
6. Write tests
7. Verify in browser

### Adding a Database Migration

```bash
cd stubs/api

# Create migration
uv run alembic revision --autogenerate -m "Add user preferences table"

# Review the generated file in migrations/versions/
# Edit if needed (especially downgrade function)

# Apply migration
uv run alembic upgrade head

# Test rollback
uv run alembic downgrade -1
uv run alembic upgrade head
```

### Adding Infrastructure

1. Determine which application needs the infrastructure change
2. Create/update Terraform module in the appropriate application's location:
   - API infrastructure: `api/infrastructure/terraform/modules/`
   - Web infrastructure: `web/infrastructure/terraform/modules/`
3. Create **separate PR** (not mixed with code)
4. Run `terraform plan` and review
5. Get approval before `terraform apply`

**Note:** API and Web have completely independent infrastructure. Changes to one do not affect the other.

---

## Troubleshooting

### Pre-commit Hooks Failing

**API:**
```bash
# Run checks manually to see detailed errors
uv run ruff check .
uv run mypy app
uv run pytest -v

# Auto-fix linting issues
uv run ruff check . --fix
uv run ruff format .
```

**Web:**
```bash
# Run checks manually
npm run lint
npx tsc --noEmit
npm run test -- --run

# Auto-fix linting
npm run lint -- --fix
```

### Tests Failing in CI but Passing Locally

- Check for environment-specific code
- Verify all dependencies are in `pyproject.toml` or `package.json`
- Check for race conditions in async tests
- Ensure database/state is clean between tests

### Can't Connect to Database

```bash
# Check Docker is running
docker ps

# Check PostgreSQL container
docker compose logs db

# Verify connection string in .env
# DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/connect2
```

---

## Getting Help

- **Technical questions:** Post in `#connect2-dev` Slack channel
- **Architecture decisions:** Check [ADR docs](../api/docs/adr/) or ask tech lead
- **Stuck on a bug:** Pair with a teammate or use Claude Code
- **Process questions:** Ask your manager or scrum master

---

## Related Documentation

### Overarching
- [CLAUDE.md](../../CLAUDE.md) - AI assistant context
- [System Architecture](../architecture/SYSTEM_ARCHITECTURE.md) - High-level design
- [Repository Structure](../architecture/REPOSITORY_STRUCTURE.md) - Independent repository design
- [Tech Stack Decisions](../architecture/TECH_STACK_DECISIONS.md) - Why we chose what
- [Testing Strategy](standards/TESTING_STRATEGY.md) - Testing approach
- [Git Standards](standards/git-standards.md) - Branch naming, commits, PRs
- [CI/CD & Release](standards/cicd-and-release.md) - Pipeline and deployment
- [Developer Tools Setup](DEVELOPER_TOOLS_SETUP.md) - Jira and Everhour integration

### API-Specific
- [API Quickstart](../api/docs/technical/API_QUICKSTART.md) - API setup guide
- [FastAPI Standards](../api/docs/technical/FASTAPI_PROJECT_STANDARDS.md) - Code conventions
- [API Infrastructure](../api/docs/technical/INFRASTRUCTURE.md) - AWS deployment
- [API GitHub Actions](../api/docs/technical/GITHUB_ACTIONS.md) - CI/CD workflows

### Web-Specific
- [Web Quickstart](../web/docs/technical/APP_QUICKSTART.md) - Web setup guide
- [Frontend Architecture](../web/docs/technical/FRONTEND_ARCHITECTURE.md) - Code conventions
- [Web Infrastructure](../web/docs/technical/INFRASTRUCTURE.md) - AWS deployment
- [Web GitHub Actions](../web/docs/technical/GITHUB_ACTIONS.md) - CI/CD workflows
