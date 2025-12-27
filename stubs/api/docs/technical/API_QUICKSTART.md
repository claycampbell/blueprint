# Connect 2.0 API - Developer Quickstart Guide

**Version:** 1.0.0
**Last Updated:** December 26, 2025

---

## Overview

This guide covers how to set up, run, and test the Connect 2.0 API locally.

---

## Prerequisites

### Required Software

| Software | Version | Installation |
|----------|---------|--------------|
| **Python** | 3.12+ | [python.org](https://www.python.org/downloads/) or via pyenv |
| **uv** | Latest | `pip install uv` |
| **Git** | Latest | [git-scm.com](https://git-scm.com/downloads) |

### Optional (for full stack development)

| Software | Version | Purpose |
|----------|---------|---------|
| **Docker Desktop** | Latest | Running PostgreSQL, Redis, LocalStack |
| **Postman** | Latest | Manual API testing |

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/connect2-api.git
cd connect2-api
```

### 2. Install uv (if not already installed)

```bash
pip install uv
```

### 3. Install Dependencies

```bash
# Install all dependencies including dev tools
uv sync --all-extras
```

This creates a virtual environment in `.venv/` and installs:
- Runtime dependencies (FastAPI, SQLAlchemy, etc.)
- Dev dependencies (pytest, ruff, mypy)

---

## Running the API

### Development Server (with hot reload)

```bash
uv run uvicorn app.main:app --reload --port 8000
```

### With Debug Mode (enables Swagger docs)

```powershell
# PowerShell
$env:DEBUG="true"; uv run uvicorn app.main:app --reload --port 8000

# Bash
DEBUG=true uv run uvicorn app.main:app --reload --port 8000
```

### Verify It's Running

```bash
curl http://localhost:8000/health/live
# Expected: {"status":"ok"}
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Readiness probe - checks DB + Redis connectivity |
| `/health/live` | GET | Liveness probe - simple OK response |

### API Documentation

When running with `DEBUG=true`:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## Testing

### Test Framework

We use **pytest** with **anyio** for async test support.

### Running Tests

```bash
# Run all tests
uv run pytest

# Run with verbose output
uv run pytest -v

# Run specific test file
uv run pytest tests/api/test_health.py

# Run specific test
uv run pytest tests/api/test_health.py::test_liveness_probe_returns_ok

# Run with coverage report
uv run pytest --cov=app --cov-report=term-missing

# Run with HTML coverage report
uv run pytest --cov=app --cov-report=html
# Open htmlcov/index.html in browser
```

### Test Structure

```
tests/
├── __init__.py
├── conftest.py              # Shared fixtures (test client, etc.)
├── api/
│   ├── __init__.py
│   └── test_health.py       # Health endpoint tests
├── services/                # Service layer tests (future)
└── repositories/            # Database tests (future)
```

### Writing Tests

Tests use the async client fixture from `conftest.py`:

```python
import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_example(client: AsyncClient) -> None:
    """Example test using the async client fixture."""
    response = await client.get("/health/live")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
```

### Test Conventions

- Test files: `test_<module>.py`
- Test functions: `test_<description>()`
- Use descriptive names: `test_health_check_returns_expected_fields`
- One assertion concept per test
- Use `@pytest.mark.anyio` for async tests

---

## Code Quality

### Linting with Ruff

```bash
# Check for issues
uv run ruff check .

# Auto-fix issues
uv run ruff check . --fix

# Format code
uv run ruff format .

# Check formatting without changes
uv run ruff format . --check
```

### Type Checking with MyPy

```bash
uv run mypy app
```

### Run All Checks

```bash
# Lint + Format + Type Check + Tests
uv run ruff check . && uv run ruff format --check . && uv run mypy app && uv run pytest
```

---

## Project Structure

```
api/
├── app/                        # Application source code
│   ├── __init__.py
│   ├── main.py                 # FastAPI app factory
│   ├── config.py               # Settings (env variables)
│   ├── dependencies.py         # Shared dependencies
│   ├── types.py                # Type aliases
│   ├── api/
│   │   ├── router.py           # Route aggregation
│   │   ├── health.py           # Health endpoints
│   │   ├── v1/                 # Versioned routes
│   │   └── middleware/
│   ├── core/                   # Security, exceptions
│   ├── db/                     # Database layer
│   │   └── repositories/
│   ├── models/                 # SQLAlchemy models
│   ├── schemas/                # Pydantic schemas
│   ├── services/               # Business logic
│   ├── providers/              # External services (S3, etc.)
│   ├── workers/                # Background tasks
│   └── cli/                    # CLI commands
├── tests/                      # Test suite
│   ├── conftest.py
│   └── api/
│       └── test_health.py
├── docs/
│   └── technical/
├── infrastructure/
├── Dockerfile
├── pyproject.toml
└── CLAUDE.md
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Application
APP_NAME=Connect 2.0 API
DEBUG=true
ENVIRONMENT=development

# Database (requires PostgreSQL)
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/connect2

# Redis (requires Redis)
REDIS_URL=redis://localhost:6379/0

# AWS/LocalStack
AWS_ENDPOINT_URL=http://localhost:4566
AWS_REGION=us-west-2
S3_BUCKET_DOCUMENTS=connect2-documents-dev

# Security
SECRET_KEY=change-me-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Troubleshooting

### "uv is not recognized"

Install uv:
```bash
pip install uv
```

### "Unable to determine which files to ship inside the wheel"

Ensure `pyproject.toml` has:
```toml
[tool.hatch.build.targets.wheel]
packages = ["app"]
```

### Port 8000 already in use

```bash
# Use different port
uv run uvicorn app.main:app --reload --port 8001
```

### Tests failing with import errors

Ensure you installed dev dependencies:
```bash
uv sync --all-extras
```

### Health endpoint returns "unhealthy"

This is expected without PostgreSQL/Redis running. Use `/health/live` for basic testing.

---

## Next Steps

After completing setup:

1. **Run the test suite** to verify everything works
2. **Explore the codebase** starting with `app/main.py`
3. **Read the architecture docs** in `docs/technical/`
4. **Set up Docker** for PostgreSQL and Redis (see infrastructure/)

---

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - AI assistant context
- [Backend Architecture](./backend_fastapi_architecture.md) - Full architecture spec
