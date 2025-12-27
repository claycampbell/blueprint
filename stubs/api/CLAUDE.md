# CLAUDE.md - Connect 2.0 API

This file provides guidance to Claude Code when working with this repository.

## Repository Purpose

This is the **Connect 2.0 API** - a FastAPI backend service for the Connect 2.0 platform.

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Language** | Python | 3.12+ |
| **Framework** | FastAPI | 0.115+ |
| **ORM** | SQLAlchemy | 2.0+ (async) |
| **Validation** | Pydantic | 2.9+ |
| **Migrations** | Alembic | 1.14+ |
| **HTTP Client** | httpx | 0.28+ |
| **Logging** | structlog | 24.4+ |
| **Testing** | pytest | 8.3+ |

## Project Structure

```
api/
├── app/                        # Application source code
│   ├── main.py                 # FastAPI app factory, lifespan
│   ├── config.py               # Pydantic Settings, env loading
│   ├── dependencies.py         # Shared FastAPI dependencies
│   ├── types.py                # Shared type aliases
│   ├── api/                    # Route handlers
│   │   ├── router.py           # Aggregates all routes
│   │   ├── health.py           # Health check endpoints
│   │   ├── v1/                 # Versioned API routes
│   │   └── middleware/         # Request/response middleware
│   ├── core/                   # Security, exceptions, logging
│   ├── db/                     # Database session and repositories
│   ├── models/                 # SQLAlchemy ORM models
│   ├── schemas/                # Pydantic request/response schemas
│   ├── services/               # Business logic layer
│   ├── providers/              # External integrations (S3, SQS, etc.)
│   ├── workers/                # Background tasks
│   └── cli/                    # CLI utilities
├── docs/
│   ├── technical/              # Architecture documentation
│   ├── decisions/              # ADRs
│   └── runbooks/               # Operational runbooks
├── infrastructure/
│   ├── terraform/              # IaC for this service
│   └── docker/                 # Docker configurations
├── scripts/                    # Development scripts
├── Dockerfile
├── pyproject.toml
└── CLAUDE.md
```

## Quick Start

```bash
# Install dependencies
uv sync

# Run development server
uv run uvicorn app.main:app --reload --port 8000

# Run with debug mode (enables Swagger docs)
DEBUG=true uv run uvicorn app.main:app --reload --port 8000
```

## API Endpoints

- `GET /health` - Readiness probe (checks DB + Redis)
- `GET /health/live` - Liveness probe (simple OK)
- API docs at `/docs` when DEBUG=true

## Code Quality

- Ruff for linting and formatting
- MyPy for type checking (strict mode)
- pytest for testing

## Related Documentation

- [Backend Architecture](docs/technical/backend_fastapi_architecture.md)
