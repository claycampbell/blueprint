# FastAPI Project Standards

This document defines the standard structure and patterns for FastAPI projects.

---

## Project Structure

```
project-name/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # Lint, test, type-check on PR
│   │   ├── cd.yml                  # Deploy to AWS on merge to main
│   │   └── security.yml            # Dependency scanning, SAST
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
│
├── infrastructure/
│   └── docker/
│       ├── Dockerfile
│       └── docker-compose.yml      # Local dev with RDS-compatible Postgres
│
├── app/
│   ├── __init__.py
│   ├── main.py                     # FastAPI app factory, lifespan
│   ├── config.py                   # Pydantic Settings, env loading
│   ├── dependencies.py             # Shared FastAPI dependencies
│   ├── types.py                    # Shared type aliases and custom types
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── router.py               # Aggregates all route modules
│   │   ├── health.py               # Liveness, readiness probes (unversioned)
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── users.py
│   │   │   └── items.py
│   │   └── middleware/
│   │       ├── __init__.py
│   │       ├── cors.py
│   │       ├── logging.py          # Request/response logging
│   │       └── tracing.py          # AWS X-Ray / OpenTelemetry
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py             # Auth, JWT, API keys
│   │   ├── exceptions.py           # Custom exceptions, handlers
│   │   └── logging.py              # Structured logging setup
│   │
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py              # SQLAlchemy async engine, session
│   │   ├── base.py                 # Declarative base
│   │   └── repositories/           # Database access layer
│   │       ├── __init__.py
│   │       ├── base.py             # Generic CRUD repository
│   │       └── users.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                 # SQLAlchemy ORM models
│   │   └── item.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py                 # Pydantic request/response schemas
│   │   ├── item.py
│   │   └── common.py               # Shared schemas (pagination, errors)
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── user_service.py         # Business logic layer
│   │   └── item_service.py
│   │
│   ├── interfaces/                 # Abstract base classes (dependency inversion)
│   │   ├── __init__.py
│   │   ├── auth.py                 # IAuthProvider
│   │   └── storage.py              # IStorageProvider
│   │
│   ├── providers/                  # Concrete implementations + external APIs
│   │   ├── __init__.py
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── cognito.py          # AWS Cognito implementation
│   │   │   └── mock.py             # Mock for testing
│   │   ├── storage/
│   │   │   ├── __init__.py
│   │   │   ├── s3.py               # S3 implementation
│   │   │   └── local.py            # Local filesystem for dev
│   │   └── external/               # External API clients
│   │       ├── __init__.py
│   │       ├── stripe.py           # Payment provider
│   │       └── sendgrid.py         # Email provider
│   │
│   ├── workers/                    # Background tasks (Celery/ARQ)
│   │   ├── __init__.py
│   │   └── tasks.py
│   │
│   └── cli/
│       ├── __init__.py             # Click group, main entry point
│       ├── db.py                   # seed, reset, migrate commands
│       ├── openapi.py              # generate, validate spec
│       └── dev.py                  # setup, check, lint commands
│
├── migrations/
│   ├── env.py                      # Alembic config
│   └── versions/
│       └── 001_initial.py
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py                 # Fixtures: test client, db, factories
│   ├── factories/                  # Test data factories (factory_boy)
│   │   ├── __init__.py
│   │   └── user.py
│   ├── unit/
│   │   ├── __init__.py
│   │   ├── services/
│   │   └── repositories/
│   └── integration/
│       ├── __init__.py
│       └── api/
│           └── test_users.py
│
├── docs/
│   ├── adr/                        # Architecture Decision Records
│   │   ├── 001-use-fastapi.md
│   │   ├── 002-repository-pattern.md
│   │   └── template.md
│   ├── runbooks/
│   │   ├── deployment.md
│   │   ├── incident-response.md
│   │   └── database-operations.md
│   └── api/
│       └── openapi.json            # Generated OpenAPI spec
│
├── .env.example                    # Template for local env vars
├── .gitignore
├── .pre-commit-config.yaml         # Hooks: ruff, mypy, gitleaks
├── CLAUDE.md                       # AI context for the repo
├── README.md
├── pyproject.toml                  # uv/Python config, dependencies
└── uv.lock                         # Lockfile
```

---

## Key Files Explained

### `pyproject.toml`

Replace `{{APP}}` with your app name (e.g.) `pilot`. Then all your scripts and cli commands are accessible on the command-line: `pilot seed`, `pilot migrate`, etc.

```toml
[project]
name = "project-name"
version = "0.1.0"
description = "FastAPI backend for [product]"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.32.0",
    "pydantic>=2.9.0",
    "pydantic-settings>=2.6.0",
    "sqlalchemy[asyncio]>=2.0.36",
    "asyncpg>=0.30.0",
    "alembic>=1.14.0",
    "httpx>=0.28.0",
    "structlog>=24.4.0",
    "aws-xray-sdk>=2.14.0",
    "click>=8.1.0",
    "rich>=13.9.0",
]

[project.scripts]
{{APP}} = "app.cli:main"

[project.optional-dependencies]
dev = [
    "pytest>=8.3.0",
    "pytest-asyncio>=0.24.0",
    "pytest-cov>=6.0.0",
    "factory-boy>=3.3.0",
    "ruff>=0.8.0",
    "mypy>=1.13.0",
    "pre-commit>=4.0.0",
]

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "UP", "B", "A", "C4", "SIM"]

[tool.mypy]
python_version = "3.12"
strict = true
plugins = ["pydantic.mypy"]

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
addopts = "-v --cov=app --cov-report=term-missing"
```

---

### `CLAUDE.md`

```markdown
# CLAUDE.md

## Project Overview
FastAPI backend serving [product] React frontend. Deployed on AWS ECS, connected to RDS PostgreSQL.

## Commands

### Setup
uv sync                     # Install dependencies
uv run cli dev setup        # Setup git hooks, create .env

### Development
uv run uvicorn app.main:app --reload    # Dev server on :8000
uv run cli dev check                    # Lint + type check + test

### Testing
uv run pytest                           # Run all tests
uv run pytest -k test_users             # Run specific tests
uv run pytest --cov --cov-report=html   # With coverage report

### Linting & Formatting
uv run cli dev lint                     # Lint and format
uv run cli dev lint --check             # Check only, no fixes
uv run mypy app                         # Type check

### Database
uv run cli db migrate                   # Apply migrations
uv run cli db migrate --new "description"  # Create new migration
uv run cli db seed                      # Seed dev data
uv run cli db reset                     # Reset database (with confirmation)

### Docker (local Postgres)
docker compose -f infrastructure/docker/docker-compose.yml up -d   # Start
docker compose -f infrastructure/docker/docker-compose.yml down    # Stop

### OpenAPI
uv run cli openapi generate             # Generate spec to docs/api/openapi.json
uv run cli openapi validate             # Validate current spec

### All CLI Commands
uv run cli --help                       # Show all commands
uv run cli db --help                    # Show db subcommands
uv run cli dev --help                   # Show dev subcommands
uv run cli openapi --help               # Show openapi subcommands

## Architecture
- **API Layer** (`app/api/`) - FastAPI routes, request validation
- **Service Layer** (`app/services/`) - Business logic, orchestration
- **Repository Layer** (`app/db/repositories/`) - Database access, queries
- **Interfaces** (`app/interfaces/`) - Abstract base classes for dependency inversion
- **Providers** (`app/providers/`) - Concrete implementations, external API clients
- **Workers** (`app/workers/`) - Background tasks (Celery/ARQ)
- **Models** (`app/models/`) - SQLAlchemy ORM models
- **Schemas** (`app/schemas/`) - Pydantic DTOs
- **Types** (`app/types.py`) - Shared type aliases and custom types

## Conventions
- API endpoints versioned under `/api/v1/`, health checks at `/health` (unversioned)
- Use dependency injection for services, repositories, and providers
- Async everywhere - no sync database calls
- Structured logging with correlation IDs
- Feature flags via environment variables: `FF_<FEATURE>_ENABLED`

## Database
- PostgreSQL 15 on RDS
- Migrations via Alembic
- Never edit migration files after merge to main

## Environment Variables
See `.env.example` for required vars. Key ones:
- `DATABASE_URL` - Async PostgreSQL connection string
- `AWS_REGION` - AWS region for services
- `LOG_LEVEL` - Logging verbosity (DEBUG/INFO/WARNING/ERROR)
- `CORS_ORIGINS` - Comma-separated allowed origins

## Testing
- Unit tests mock the repository layer
- Integration tests use a real test database
- Run `uv run pytest` before pushing

## Common Patterns
[Add patterns specific to your codebase as it evolves]
```

---

### `docker-compose.yml` (Local Dev)

```yaml
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: project_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 5s
      timeout: 5s
      retries: 5

  api:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://dev:dev@db:5432/project_dev
      LOG_LEVEL: DEBUG
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ../../app:/code/app:ro
    command: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

volumes:
  postgres_data:
```

---

## Bootstrap a New Repo

```bash
# Create repo and init uv
mkdir project-name && cd project-name
git init
uv init

# Create structure
mkdir -p .github/workflows infrastructure/docker \
         app/{api/v1,api/middleware,core,db/repositories,models,schemas,services,cli} \
         app/{interfaces,providers/auth,providers/storage,providers/external,workers} \
         migrations/versions tests/{unit,integration,factories} \
         docs/{adr,runbooks,api}

# Add dependencies
uv add fastapi uvicorn pydantic pydantic-settings sqlalchemy asyncpg alembic httpx structlog click rich
uv add --group dev pytest pytest-asyncio pytest-cov ruff mypy pre-commit factory-boy

# Install and setup
uv sync
uv run pre-commit install
cp .env.example .env
```

---

## Frontend Integration

Export OpenAPI spec for the React frontend to generate typed clients:

```bash
uv run cli openapi generate
# Output: docs/api/openapi.json
```

Frontend can use `openapi-typescript-codegen` or `orval` to generate API client:

```bash
# In frontend repo
npx openapi-typescript-codegen --input ../backend/docs/api/openapi.json --output src/api
```

---

## CLI Reference

### `app/cli/__init__.py`

```python
import click
from rich.console import Console

console = Console()

@click.group()
@click.version_option()
def main():
    """Project CLI - development utilities."""
    pass

from app.cli import db, openapi, dev

main.add_command(db.db)
main.add_command(openapi.openapi)
main.add_command(dev.dev)
```

### `app/cli/db.py`

```python
import click
from rich.console import Console
import subprocess

console = Console()

@click.group()
def db():
    """Database operations."""
    pass

@db.command()
@click.option("--new", "message", help="Create new migration with message")
def migrate(message):
    """Apply migrations, or create new one with --new."""
    if message:
        console.print(f"[blue]Creating migration:[/blue] {message}")
        subprocess.run(["alembic", "revision", "--autogenerate", "-m", message], check=True)
    else:
        console.print("[blue]Applying migrations...[/blue]")
        subprocess.run(["alembic", "upgrade", "head"], check=True)
    console.print("[green]✓[/green] Done")

@db.command()
@click.option("--fresh", is_flag=True, help="Reset DB before seeding")
def seed(fresh):
    """Seed the database with dev data."""
    if fresh:
        console.print("[yellow]Resetting database first...[/yellow]")
        # reset logic here
    console.print("[blue]Seeding database...[/blue]")
    # seed logic here
    console.print("[green]✓[/green] Database seeded")
```

### `app/cli/dev.py`

```python
import click
from rich.console import Console
import subprocess
import shutil

console = Console()

@click.group()
def dev():
    """Development utilities."""
    pass

@dev.command()
def setup():
    """Initialize dev environment."""
    console.print("[blue]Installing pre-commit hooks...[/blue]")
    subprocess.run(["pre-commit", "install"], check=True)

    if not shutil.which("docker"):
        console.print("[yellow]⚠[/yellow] Docker not found")

    env_example = ".env.example"
    env_file = ".env"
    import os
    if not os.path.exists(env_file):
        shutil.copy(env_example, env_file)
        console.print(f"[green]✓[/green] Created {env_file}")
    else:
        console.print(f"[dim]{env_file} already exists[/dim]")

    console.print("[green]✓[/green] Dev environment ready")

@dev.command()
@click.option("--check", is_flag=True, help="Check only, don't fix")
def lint(check):
    """Run linting and formatting."""
    if check:
        console.print("[blue]Checking code...[/blue]")
        subprocess.run(["ruff", "check", "app", "tests"], check=True)
        subprocess.run(["ruff", "format", "--check", "app", "tests"], check=True)
    else:
        console.print("[blue]Fixing code...[/blue]")
        subprocess.run(["ruff", "check", "--fix", "app", "tests"])
        subprocess.run(["ruff", "format", "app", "tests"])
    console.print("[green]✓[/green] Linting complete")

@dev.command()
def check():
    """Run lint, type check, and tests."""
    console.print("[blue]Running full check...[/blue]\n")

    console.print("[bold]1/3 Linting[/bold]")
    subprocess.run(["ruff", "check", "app", "tests"], check=True)

    console.print("\n[bold]2/3 Type checking[/bold]")
    subprocess.run(["mypy", "app"], check=True)

    console.print("\n[bold]3/3 Tests[/bold]")
    subprocess.run(["pytest"], check=True)

    console.print("\n[green]✓[/green] All checks passed")
```

### `app/cli/openapi.py`

```python
import click
from rich.console import Console
import json
from pathlib import Path

console = Console()

OPENAPI_PATH = Path("docs/api/openapi.json")

@click.group()
def openapi():
    """OpenAPI spec operations."""
    pass

@openapi.command()
def generate():
    """Generate OpenAPI spec from FastAPI app."""
    console.print("[blue]Generating OpenAPI spec...[/blue]")

    from app.main import app
    spec = app.openapi()

    OPENAPI_PATH.parent.mkdir(parents=True, exist_ok=True)
    OPENAPI_PATH.write_text(json.dumps(spec, indent=2))

    console.print(f"[green]✓[/green] Written to {OPENAPI_PATH}")

@openapi.command()
def validate():
    """Validate the current OpenAPI spec."""
    if not OPENAPI_PATH.exists():
        console.print("[red]✗[/red] No spec found. Run 'cli openapi generate' first.")
        raise SystemExit(1)

    console.print("[blue]Validating spec...[/blue]")
    spec = json.loads(OPENAPI_PATH.read_text())

    # Basic validation
    required = ["openapi", "info", "paths"]
    for field in required:
        if field not in spec:
            console.print(f"[red]✗[/red] Missing required field: {field}")
            raise SystemExit(1)

    console.print(f"[green]✓[/green] Valid OpenAPI {spec['openapi']} spec")
    console.print(f"  Paths: {len(spec['paths'])}")
    console.print(f"  Schemas: {len(spec.get('components', {}).get('schemas', {}))}")
```