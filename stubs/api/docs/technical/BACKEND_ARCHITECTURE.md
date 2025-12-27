# Connect 2.0 API - Backend Architecture

**Version:** 1.0.0
**Last Updated:** December 26, 2025
**Status:** Approved

---

## Executive Summary

This document defines the architecture for the Connect 2.0 API, a FastAPI-based backend service that powers the Connect 2.0 platform for real estate development lifecycle management.

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Project Structure](#2-project-structure)
3. [Architecture Layers](#3-architecture-layers)
4. [API Design Standards](#4-api-design-standards)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Database Architecture](#6-database-architecture)
7. [External Integrations](#7-external-integrations)
8. [Testing Strategy](#8-testing-strategy)
9. [Error Handling](#9-error-handling)
10. [Observability](#10-observability)
11. [Development Standards](#11-development-standards)

---

## 1. Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Language** | Python | 3.12+ | Type hints, performance improvements |
| **Framework** | FastAPI | 0.115+ | Async API framework with OpenAPI |
| **ORM** | SQLAlchemy | 2.0+ | Async database operations |
| **Validation** | Pydantic | 2.9+ | Request/response schemas |
| **Migrations** | Alembic | 1.14+ | Database schema migrations |
| **HTTP Client** | httpx | 0.28+ | Async HTTP requests |
| **Logging** | structlog | 24.4+ | Structured JSON logging |
| **Testing** | pytest + anyio | 8.3+ | Async test support |
| **Linting** | Ruff | 0.8+ | Fast Python linter/formatter |
| **Type Checking** | MyPy | 1.13+ | Static type analysis |

### Why These Choices?

- **FastAPI**: Native async support, automatic OpenAPI docs, Pydantic integration
- **SQLAlchemy 2.0**: Modern async patterns, better type hints
- **Pydantic v2**: 5-50x faster than v1, better validation
- **Ruff**: Replaces flake8, isort, black - 10-100x faster

---

## 2. Project Structure

```
api/
├── app/                           # Application source code
│   ├── __init__.py
│   ├── main.py                    # FastAPI app factory, lifespan events
│   ├── config.py                  # Pydantic Settings, environment config
│   ├── dependencies.py            # Shared FastAPI dependencies (DI)
│   ├── types.py                   # Shared type aliases
│   │
│   ├── api/                       # HTTP layer
│   │   ├── __init__.py
│   │   ├── router.py              # Aggregates all route modules
│   │   ├── health.py              # Health check endpoints
│   │   ├── v1/                    # Versioned API routes
│   │   │   ├── __init__.py
│   │   │   ├── projects.py        # Project CRUD endpoints
│   │   │   ├── loans.py           # Loan management endpoints
│   │   │   ├── contacts.py        # Contact endpoints
│   │   │   ├── documents.py       # Document upload/download
│   │   │   └── tasks.py           # Task management
│   │   └── middleware/            # Request/response middleware
│   │       ├── __init__.py
│   │       ├── cors.py            # CORS configuration
│   │       ├── logging.py         # Request/response logging
│   │       └── tracing.py         # AWS X-Ray integration
│   │
│   ├── core/                      # Core utilities
│   │   ├── __init__.py
│   │   ├── security.py            # JWT, API keys, auth helpers
│   │   ├── exceptions.py          # Custom exceptions, handlers
│   │   └── logging.py             # Structured logging setup
│   │
│   ├── db/                        # Database layer
│   │   ├── __init__.py
│   │   ├── session.py             # SQLAlchemy async engine/session
│   │   ├── base.py                # Declarative base class
│   │   └── repositories/          # Repository pattern implementations
│   │       ├── __init__.py
│   │       ├── base.py            # Generic CRUD repository
│   │       ├── projects.py
│   │       ├── loans.py
│   │       └── contacts.py
│   │
│   ├── models/                    # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── base.py                # Base model with common fields
│   │   ├── project.py
│   │   ├── loan.py
│   │   ├── contact.py
│   │   └── document.py
│   │
│   ├── schemas/                   # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── common.py              # Pagination, errors, responses
│   │   ├── project.py             # ProjectCreate, ProjectResponse, etc.
│   │   ├── loan.py
│   │   ├── contact.py
│   │   └── document.py
│   │
│   ├── services/                  # Business logic layer
│   │   ├── __init__.py
│   │   ├── project_service.py
│   │   ├── loan_service.py
│   │   └── document_service.py
│   │
│   ├── providers/                 # External service integrations
│   │   ├── __init__.py
│   │   ├── s3.py                  # AWS S3 document storage
│   │   ├── sqs.py                 # AWS SQS queue operations
│   │   ├── bedrock.py             # AWS Bedrock AI/ML
│   │   ├── textract.py            # AWS Textract OCR
│   │   └── docusign.py            # DocuSign e-signature
│   │
│   ├── workers/                   # Background task processing
│   │   ├── __init__.py
│   │   └── tasks.py
│   │
│   └── cli/                       # CLI utilities
│       ├── __init__.py
│       ├── db.py                  # Database seed, reset, migrate
│       └── dev.py                 # Dev setup, checks
│
├── tests/                         # Test suite
│   ├── __init__.py
│   ├── conftest.py                # Shared fixtures
│   ├── api/                       # API route tests
│   │   └── test_health.py
│   ├── services/                  # Service layer tests
│   └── repositories/              # Repository tests
│
├── docs/
│   └── technical/
│       ├── BACKEND_ARCHITECTURE.md
│       └── API_QUICKSTART.md
│
├── infrastructure/
│   ├── terraform/
│   └── docker/
│
├── Dockerfile
├── pyproject.toml
└── CLAUDE.md
```

---

## 3. Architecture Layers

### Layer Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Layer (api/)                          │
│     FastAPI routes, request validation, response formatting      │
│     - Thin layer: validate input, call service, format output    │
│     - No business logic here                                     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────┐
│                    Service Layer (services/)                     │
│          Business logic, orchestration, validation               │
│     - Domain rules and workflows                                 │
│     - Coordinates repositories and providers                     │
│     - Transaction boundaries                                     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐   ┌────────────────┐   ┌─────────────────┐
│ Repository Layer│   │ Provider Layer │   │  Schemas Layer  │
│   (db/repos/)   │   │  (providers/)  │   │   (schemas/)    │
│                 │   │                │   │                 │
│ Database access │   │ External APIs  │   │ Pydantic models │
│ Query building  │   │ AWS services   │   │ Validation      │
│ Data mapping    │   │ Third-party    │   │ Serialization   │
└─────────────────┘   └────────────────┘   └─────────────────┘
         │                     │
         ▼                     │
┌─────────────────┐            │
│  Models Layer   │            │
│   (models/)     │            │
│                 │            │
│ SQLAlchemy ORM  │◄───────────┘
│ Entity defs     │
│ Relationships   │
└─────────────────┘
```

### Layer Responsibilities

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **API** | HTTP handling, routing, auth | `POST /api/v1/projects` → validate → call service |
| **Service** | Business logic, orchestration | Create project + notify team + generate docs |
| **Repository** | Data access, queries | `get_projects_by_status(status)` |
| **Provider** | External integrations | Upload to S3, send to DocuSign |
| **Schema** | Data validation, serialization | `ProjectCreate`, `ProjectResponse` |
| **Model** | Database entities | SQLAlchemy `Project` class |

### Import Rules

| Layer | Can Import | Cannot Import |
|-------|------------|---------------|
| `api/` | `services/`, `schemas/`, `core/`, `dependencies` | `db/`, `models/`, `providers/` |
| `services/` | `db/repos/`, `providers/`, `schemas/`, `models/` | `api/` |
| `db/repos/` | `models/`, `schemas/` | `api/`, `services/`, `providers/` |
| `providers/` | `schemas/`, `core/` | `api/`, `services/`, `db/` |

---

## 4. API Design Standards

### Versioning

All endpoints are versioned under `/api/v1/`. Breaking changes require a new version (`/api/v2/`).

### URL Conventions

```
GET    /api/v1/projects              # List projects
POST   /api/v1/projects              # Create project
GET    /api/v1/projects/{id}         # Get project
PATCH  /api/v1/projects/{id}         # Update project
DELETE /api/v1/projects/{id}         # Delete project

GET    /api/v1/projects/{id}/loans   # Nested resources
POST   /api/v1/projects/{id}/loans
```

### Request/Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Project Name",
    "status": "feasibility"
  },
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Business rule violation |
| 500 | Internal Server Error | Unexpected errors |

### Pagination

```
GET /api/v1/projects?page=2&page_size=20&sort_by=created_at&sort_order=desc
```

Response includes `meta` with pagination info.

### Filtering

```
GET /api/v1/projects?status=feasibility&city=Seattle
```

---

## 5. Authentication & Authorization

### JWT Authentication

```
Authorization: Bearer <jwt_token>
```

**JWT Payload:**
```json
{
  "sub": "user_abc123",
  "email": "jane@blueprint.com",
  "role": "acquisitions",
  "permissions": ["read:projects", "write:projects"],
  "iat": 1699200000,
  "exp": 1699203600
}
```

### Auth Flow

```
1. POST /auth/token (email + password) → Access Token + Refresh Token
2. API Request with Authorization header → Verify JWT → Check permissions
3. POST /auth/refresh (refresh_token) → New Access Token
```

### RBAC (Role-Based Access Control)

| Resource | Admin | Acquisitions | Design | Servicing | Builder |
|----------|-------|--------------|--------|-----------|---------|
| Projects (Read) | ✓ | ✓ | ✓ | ✓ | Own |
| Projects (Write) | ✓ | ✓ | ✓ | ✗ | ✗ |
| Loans (Read) | ✓ | ✓ | ✗ | ✓ | Own |
| Loans (Write) | ✓ | ✓ | ✗ | ✓ | ✗ |
| Draws (Request) | ✓ | ✓ | ✗ | ✓ | ✓ |
| Draws (Approve) | ✓ | ✗ | ✗ | ✓ | ✗ |

---

## 6. Database Architecture

### ORM Models

```python
# app/models/base.py
class BaseModel(DeclarativeBase):
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    updated_at: Mapped[datetime] = mapped_column(onupdate=func.now())
```

### Repository Pattern

```python
# app/db/repositories/base.py
class BaseRepository[T]:
    async def get(self, id: UUID) -> T | None: ...
    async def get_all(self, skip: int, limit: int) -> list[T]: ...
    async def create(self, obj: T) -> T: ...
    async def update(self, id: UUID, data: dict) -> T: ...
    async def delete(self, id: UUID) -> bool: ...
```

### Async Session Management

```python
# app/db/session.py
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```

---

## 7. External Integrations

### AWS Services

| Service | Provider | Purpose |
|---------|----------|---------|
| **S3** | `providers/s3.py` | Document storage |
| **SQS** | `providers/sqs.py` | Async task queue |
| **Bedrock** | `providers/bedrock.py` | AI/ML (document analysis) |
| **Textract** | `providers/textract.py` | OCR, data extraction |

### Third-Party

| Service | Provider | Purpose |
|---------|----------|---------|
| **DocuSign** | `providers/docusign.py` | E-signatures |

### Provider Pattern

```python
# app/providers/s3.py
class S3Provider:
    def __init__(self, settings: Settings):
        self.client = boto3.client('s3', endpoint_url=settings.aws_endpoint_url)

    async def upload(self, key: str, data: bytes) -> str: ...
    async def download(self, key: str) -> bytes: ...
    async def get_presigned_url(self, key: str) -> str: ...
```

---

## 8. Testing Strategy

### Test Structure

```
tests/
├── conftest.py           # Shared fixtures
├── api/                  # API endpoint tests (integration)
│   └── test_health.py
├── services/             # Service layer tests (unit)
├── repositories/         # Repository tests (integration)
└── providers/            # Provider tests (mocked)
```

### Test Types

| Type | Location | Purpose | Database |
|------|----------|---------|----------|
| **Unit** | `services/`, `providers/` | Test business logic in isolation | Mocked |
| **Integration** | `api/`, `repositories/` | Test full request flow | Test DB |
| **E2E** | Separate suite | Full system tests | Test DB |

### Running Tests

```bash
# All tests
uv run pytest

# With coverage
uv run pytest --cov=app --cov-report=term-missing

# Specific file
uv run pytest tests/api/test_health.py -v

# Specific test
uv run pytest tests/api/test_health.py::test_liveness_probe_returns_ok
```

### Test Fixtures

```python
# tests/conftest.py
@pytest.fixture
async def client() -> AsyncClient:
    """Async test client for API tests."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
```

---

## 9. Error Handling

### Exception Hierarchy

```python
# app/core/exceptions.py
class AppException(Exception):
    """Base exception for application errors."""
    code: str
    status_code: int

class NotFoundError(AppException):
    code = "NOT_FOUND"
    status_code = 404

class ValidationError(AppException):
    code = "VALIDATION_ERROR"
    status_code = 400

class AuthorizationError(AppException):
    code = "FORBIDDEN"
    status_code = 403
```

### Exception Handlers

```python
# app/main.py
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.code,
                "message": str(exc),
            }
        }
    )
```

---

## 10. Observability

### Structured Logging

```python
# app/core/logging.py
import structlog

logger = structlog.get_logger()

# Usage
logger.info("project_created", project_id=project.id, user_id=user.id)
```

**Log Output (JSON):**
```json
{
  "event": "project_created",
  "project_id": "uuid-123",
  "user_id": "user-456",
  "timestamp": "2025-12-26T10:00:00Z",
  "level": "info"
}
```

### Request Logging Middleware

Logs every request with:
- Request ID (correlation)
- Method, path, status code
- Duration
- User ID (if authenticated)

### Health Checks

| Endpoint | Purpose | Checks |
|----------|---------|--------|
| `GET /health` | Readiness | DB, Redis, external services |
| `GET /health/live` | Liveness | Process is alive |

---

## 11. Development Standards

### Code Style

- **Formatter:** Ruff (100 char line length)
- **Linter:** Ruff (E, F, I, N, W, UP, B, C4, SIM rules)
- **Type Checker:** MyPy (strict mode)

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Files | snake_case | `project_service.py` |
| Classes | PascalCase | `ProjectService` |
| Functions | snake_case | `get_project_by_id()` |
| Constants | UPPER_SNAKE | `MAX_PAGE_SIZE` |
| Type aliases | PascalCase | `ProjectId = UUID` |

### Commit Messages

```
feat: Add project creation endpoint

- Implement POST /api/v1/projects
- Add ProjectCreate schema validation
- Add project_service.create_project()

Closes: DP01-123
```

### Pre-Commit Checks

```bash
# Run before every commit
uv run ruff check . --fix
uv run ruff format .
uv run mypy app
uv run pytest
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Dec 26, 2025 | Engineering | Initial document |
