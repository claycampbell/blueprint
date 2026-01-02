# Connect 2.0 Tech Stack Decisions

**Version:** 1.0
**Date:** December 2024
**Status:** Implemented

---

## Executive Summary

This document captures the **actual technology decisions** implemented in Connect 2.0, as reflected in the `stubs/api` (backend) and `stubs/app` (frontend) codebases. These decisions deviate from some original recommendations in favor of what best suits the project's requirements and team expertise.

### Implemented Stack (At-a-Glance)

| Component | Decision | Rationale |
|-----------|----------|-----------|
| **Backend Language** | Python 3.12+ | AI/ML ecosystem, data processing strengths |
| **Backend Framework** | FastAPI | Async-first, auto OpenAPI docs, Pydantic integration |
| **Backend Testing** | Pytest + pytest-anyio | Async support, mature ecosystem, excellent DX |
| **Frontend Framework** | React 18+ (TypeScript) | Team expertise, ecosystem maturity |
| **Frontend Build** | Vite 6+ | Fast HMR, modern ESM, excellent DX |
| **Frontend Testing** | Vitest + Testing Library | Vite-native, fast, React best practices |
| **ORM** | SQLAlchemy 2.0 (async) | Industry standard, flexible, mature |
| **Database** | PostgreSQL 15+ (asyncpg) | Relational + JSONB, proven reliability |
| **Server State** | TanStack Query v5 | Cache management, optimistic updates |
| **Client State** | Zustand | Minimal boilerplate, surgical stores |
| **Styling** | CSS Modules | Zero runtime, scoped by default |
| **Package Management** | uv (Python) / npm (JS) | Fast, modern tooling |

---

## Backend Stack

### Language: Python 3.12+

**Why Python over Node.js (original recommendation):**

1. **AI/ML Integration**: Native access to AI libraries (LangChain, OpenAI SDK) without service boundaries
2. **Data Processing**: Pandas, NumPy for analytics, financial calculations, and reporting
3. **Type Safety**: Modern Python with type hints + mypy provides compile-time checking
4. **Async Support**: Python 3.12 has mature async/await with excellent performance

**Configuration:**
```toml
# pyproject.toml
[project]
requires-python = ">=3.12"
```

### Framework: FastAPI 0.115+

**Why FastAPI over Fastify (original recommendation):**

1. **Automatic OpenAPI**: Schema generation from Pydantic models
2. **Async-Native**: Built for async from the ground up
3. **Dependency Injection**: First-class DI system for services, repositories
4. **Validation**: Pydantic v2 integration with 2x performance improvement
5. **Documentation**: Auto-generated Swagger UI and ReDoc

**Key Dependencies:**
```toml
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.32.0",
    "pydantic>=2.9.0",
    "pydantic-settings>=2.6.0",
]
```

### ORM: SQLAlchemy 2.0 (Async)

**Why SQLAlchemy over Prisma (original recommendation):**

1. **Python Native**: First-class Python ORM vs. code generation
2. **Async Support**: Full async/await with asyncpg driver
3. **Flexibility**: Raw SQL when needed, complex queries, CTEs
4. **Maturity**: Battle-tested, extensive documentation
5. **Migration Ecosystem**: Alembic for schema migrations

**Configuration:**
```toml
dependencies = [
    "sqlalchemy[asyncio]>=2.0.0",
    "asyncpg>=0.30.0",
]
```

### Database Driver: asyncpg

PostgreSQL async driver for high-performance database operations:
- Connection pooling built-in
- Prepared statement caching
- Native PostgreSQL type support (UUID, JSONB, arrays)

### Code Quality Tools

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **Ruff** | Linting + formatting | 100 char line length, Python 3.12 target |
| **MyPy** | Static type checking | Strict mode enabled |
| **Pytest** | Testing framework | Async support via pytest-anyio |

```toml
[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP", "B", "C4", "SIM"]

[tool.mypy]
python_version = "3.12"
strict = true
```

---

## Frontend Stack

### Framework: React 18.3+

**Aligned with original recommendation.** React remains the standard for:
- Team expertise (zero ramp-up time)
- Ecosystem maturity (component libraries, tooling)
- Hiring pool (largest talent availability)

**Key Dependencies:**
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

### Build Tool: Vite 6+

**Modern ESM-first build tool:**
- Sub-second HMR (Hot Module Replacement)
- Optimized production builds with Rollup
- Native TypeScript support
- Proxy configuration for API development

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

### TypeScript Configuration

Strict mode enabled with additional safety checks:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### State Management

**Server State: TanStack Query v5**
- Automatic caching and background refetching
- Optimistic updates for mutations
- Query key factory pattern for cache invalidation

**Client State: Zustand**
- Minimal boilerplate vs. Redux
- Surgical stores (auth, UI, feature-specific)
- Persistence middleware for local storage

```json
{
  "@tanstack/react-query": "^5.62.0",
  "zustand": "^4.5.0"
}
```

### Routing: React Router v6

```json
{
  "react-router-dom": "^6.28.0"
}
```

### Forms: React Hook Form + Zod

```json
{
  "react-hook-form": "^7.54.0",
  "zod": "^3.24.0"
}
```

### HTTP Client: Axios

```json
{
  "axios": "^1.7.0"
}
```

---

## Testing Stack

### Backend Testing (Python)

| Tool | Version | Purpose |
|------|---------|---------|
| **Pytest** | 8.3+ | Test framework and runner |
| **pytest-anyio** | 0.0.0+ | Async test support (trio/asyncio) |
| **pytest-cov** | 6.0+ | Code coverage reporting |

**Configuration:**
```toml
# pyproject.toml
[project.optional-dependencies]
dev = [
    "pytest>=8.3.0",
    "anyio[trio]>=4.7.0",
    "pytest-anyio>=0.0.0",
    "pytest-cov>=6.0.0",
]

[tool.pytest.ini_options]
testpaths = ["tests"]
```

**Test Commands:**
```bash
uv run pytest                    # Run all tests
uv run pytest -v                 # Verbose output
uv run pytest --cov              # With coverage
uv run pytest --cov --cov-report=html  # HTML coverage report
uv run pytest -k "test_gates"    # Run specific tests
```

**Test Structure:**
```
tests/
├── conftest.py           # Shared fixtures
├── unit/                 # Unit tests (mocked dependencies)
│   ├── services/
│   └── repositories/
└── integration/          # Integration tests (real database)
    └── api/
```

### Frontend Testing (TypeScript)

| Tool | Version | Purpose |
|------|---------|---------|
| **Vitest** | 2.1+ | Test framework (Vite-native, fast) |
| **@testing-library/react** | 16.1+ | React component testing |
| **@testing-library/jest-dom** | 6.6+ | Custom DOM matchers |
| **@testing-library/user-event** | 14.5+ | User interaction simulation |
| **jsdom** | 25.0+ | DOM environment for Node.js |

**Configuration:**
```json
// package.json
{
  "devDependencies": {
    "vitest": "^2.1.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/user-event": "^14.5.0",
    "jsdom": "^25.0.0"
  }
}
```

**Test Commands:**
```bash
npm run test              # Run tests in watch mode
npm run test:ui           # Open Vitest UI
npm run test:coverage     # Run with coverage report
```

**Test Structure:**
```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx    # Co-located unit tests
├── features/
│   └── task-management/
│       └── components/
│           └── TaskList.test.tsx
└── api/
    └── tasks/
        └── queries.test.ts    # Hook tests with MSW
```

### Testing Patterns

**Backend - Async Test Example:**
```python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.anyio
async def test_health_check():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
```

**Frontend - Component Test Example:**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskList } from './TaskList'

describe('TaskList', () => {
  it('renders tasks and handles click', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(<TaskList tasks={mockTasks} onSelect={onSelect} />)

    await user.click(screen.getByText('Task 1'))
    expect(onSelect).toHaveBeenCalledWith('task-1')
  })
})
```

### Coverage Requirements

| Layer | Backend | Frontend |
|-------|---------|----------|
| **Utilities/lib** | 90% | 90% |
| **Services/Hooks** | 80% | 80% |
| **Repositories/Components** | 70% | 70% |
| **Integration** | 60% | 60% |

---

## Project Architecture

### Backend Structure

```
stubs/api/
├── app/
│   ├── api/                    # API layer
│   │   ├── router.py           # Route aggregation
│   │   ├── health.py           # Health check endpoints
│   │   ├── v1/                 # Versioned API routes
│   │   └── middleware/         # CORS, logging, tracing
│   ├── core/                   # Core utilities
│   │   ├── security.py         # Auth, JWT
│   │   └── exceptions.py       # Custom exceptions
│   ├── db/                     # Database layer
│   │   ├── session.py          # SQLAlchemy async session
│   │   └── repositories/       # Repository pattern
│   ├── models/                 # SQLAlchemy ORM models
│   ├── schemas/                # Pydantic schemas
│   ├── services/               # Business logic
│   │   └── dependency_engine/  # Gate workflow engine
│   ├── providers/              # External integrations
│   ├── workers/                # Background tasks
│   ├── cli/                    # CLI commands
│   ├── config.py               # Settings management
│   ├── dependencies.py         # FastAPI dependencies
│   └── main.py                 # App factory
├── migrations/                 # Alembic migrations
├── scripts/                    # Seed scripts, utilities
├── tests/                      # Test suite
├── docs/                       # Documentation
└── pyproject.toml              # Project configuration
```

### Frontend Structure

```
stubs/app/
├── src/
│   ├── app/                    # Application shell
│   │   ├── App.tsx
│   │   ├── routes.tsx          # Route definitions
│   │   └── providers.tsx       # QueryClient, etc.
│   ├── pages/                  # Route entry points
│   ├── api/                    # Server state (TanStack Query)
│   │   └── [domain]/
│   │       ├── types.ts
│   │       ├── keys.ts
│   │       ├── queries.ts
│   │       └── mutations.ts
│   ├── stores/                 # Client state (Zustand)
│   │   ├── auth.store.ts
│   │   ├── ui.store.ts
│   │   └── user-context.store.ts
│   ├── features/               # Feature modules
│   │   ├── workflow-visualization/
│   │   ├── task-management/
│   │   └── gate-management/
│   ├── components/             # Shared components
│   │   ├── ui/                 # Design system primitives
│   │   ├── common/             # Composed components
│   │   └── layout/             # Layout components
│   ├── hooks/                  # Shared custom hooks
│   ├── lib/                    # Utilities
│   │   └── api-client.ts       # Configured Axios instance
│   ├── styles/                 # Global styles
│   │   └── variables.css       # CSS custom properties
│   └── types/                  # Shared TypeScript types
├── docs/                       # Documentation
└── package.json                # Dependencies
```

---

## Key Architectural Patterns

### Backend Patterns

**1. Repository Pattern**
- Database access abstracted through repository classes
- Async CRUD operations with eager loading support
- Type-safe query building

**2. Service Layer**
- Business logic isolated from API routes
- Dependency injection via FastAPI
- Transaction management

**3. Dependency Engine**
- Gate-based workflow management
- Directed acyclic graph (DAG) evaluation
- Status propagation and cascade unlocking

### Frontend Patterns

**1. Data Layer Separation**
- `api/` for server state (TanStack Query)
- `stores/` for shared client state (Zustand)
- Features never import from other features

**2. Query Key Factory**
```typescript
export const taskKeys = {
  all: ['tasks'] as const,
  myTasks: (userId: string, role: string) =>
    [...taskKeys.all, 'my', userId, role] as const,
  property: (propertyId: string) =>
    [...taskKeys.all, 'property', propertyId] as const,
}
```

**3. CSS Modules with Design Tokens**
- Component-scoped styles
- Global CSS custom properties for theming
- Zero runtime overhead

---

## Deviations from Original Recommendations

| Area | Original Recommendation | Actual Decision | Reason |
|------|------------------------|-----------------|--------|
| **Backend Language** | Node.js + TypeScript | Python 3.12+ | AI/ML ecosystem, data processing |
| **Backend Framework** | Fastify | FastAPI | Better Python ecosystem integration |
| **ORM** | Prisma | SQLAlchemy 2.0 | Python native, more flexibility |
| **UI Library** | Tailwind CSS | CSS Modules | Zero runtime, simpler setup |

### Why These Deviations?

**Python Backend:**
The decision to use Python was driven by:
1. **AI Integration**: Direct access to LangChain, OpenAI libraries for document extraction and AI-assisted workflows
2. **Financial Calculations**: NumPy/Pandas for proforma calculations and loan analytics
3. **Team Flexibility**: Easier to hire Python developers with data/AI experience
4. **Async Maturity**: Python's asyncio is now mature enough for high-performance APIs

**CSS Modules over Tailwind:**
1. **Simpler Setup**: No build configuration beyond Vite defaults
2. **CSS Expertise**: Team comfortable with traditional CSS
3. **Design System Control**: Custom properties provide sufficient design token support
4. **Zero Runtime**: No Tailwind CSS purging or JIT compilation needed

---

## Development Commands

### Backend

```bash
# Setup
cd stubs/api
uv sync                                      # Install dependencies

# Development
uv run uvicorn app.main:app --reload         # Dev server on :8000

# Testing
uv run pytest                                # Run tests
uv run pytest --cov                          # With coverage

# Linting
uv run ruff check .                          # Lint
uv run ruff format .                         # Format
uv run mypy app                              # Type check

# Database
uv run python scripts/seed_vs4_gates.py      # Seed gate definitions
uv run python scripts/seed_demo_data.py      # Seed demo data
```

### Frontend

```bash
# Setup
cd stubs/app
npm install                                  # Install dependencies

# Development
npm run dev                                  # Dev server on :3000

# Testing
npm run test                                 # Run tests (watch mode)
npm run test:ui                              # Vitest UI
npm run test:coverage                        # Coverage report

# Build
npm run build                                # Production build
npm run preview                              # Preview build

# Linting
npm run lint                                 # ESLint
```

---

## Version Policy

| Technology | Current Version | Update Policy |
|------------|-----------------|---------------|
| Python | 3.12+ | Latest stable minor |
| FastAPI | 0.115+ | Latest stable |
| SQLAlchemy | 2.0+ | Latest 2.x |
| Pytest | 8.3+ | Latest stable |
| React | 18.3+ | Latest 18.x |
| TypeScript | 5.6+ | Latest stable |
| Vite | 6.0+ | Latest stable |
| Vitest | 2.1+ | Latest stable |
| TanStack Query | 5.x | Latest 5.x |
| Testing Library | 16.x | Latest stable |

---

## Related Documents

- [TECH_STACK_RECOMMENDATIONS.md](./TECH_STACK_RECOMMENDATIONS.md) - Original tech stack analysis and recommendations
- [BACKEND_ARCHITECTURE.md](../api/docs/technical/BACKEND_ARCHITECTURE.md) - FastAPI project standards
- [FRONTEND_ARCHITECTURE.md](../app/docs/technical/FRONTEND_ARCHITECTURE.md) - React frontend playbook
- [API_QUICKSTART.md](../api/docs/technical/API_QUICKSTART.md) - Backend quickstart guide
- [APP_QUICKSTART.md](../app/docs/technical/APP_QUICKSTART.md) - Frontend quickstart guide

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| December 2024 | Initial version documenting implemented stack | Engineering Team |
