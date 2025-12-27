# Connect 2.0 API

FastAPI backend for the Connect 2.0 platform.

## Tech Stack

- **Framework:** FastAPI (Python 3.12)
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Infrastructure:** AWS (ECS Fargate, RDS, ElastiCache)
- **IaC:** Terraform
- **CI/CD:** GitHub Actions
- **Package Manager:** uv

## Quick Start

### Prerequisites

- Python 3.12+
- Docker & Docker Compose
- uv (Python package manager)

### Local Development

```bash
# Install dependencies
uv sync

# Start local services (PostgreSQL, Redis)
docker compose up -d

# Run database migrations
uv run alembic upgrade head

# Start development server
uv run uvicorn app.main:app --reload --port 8000
```

### API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI spec: http://localhost:8000/openapi.json

## Project Structure

```
.
├── app/                    # Application code
│   ├── api/               # API routes
│   ├── core/              # Core configuration
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic schemas
│   ├── services/          # Business logic
│   └── main.py            # Application entry point
├── tests/                  # Test suite
├── alembic/               # Database migrations
├── infrastructure/        # Infrastructure as code
│   ├── docker/           # Docker configuration
│   └── terraform/        # Terraform modules
├── docs/                  # Documentation
│   ├── technical/        # Technical docs
│   └── runbooks/         # Operational runbooks
└── .github/workflows/     # CI/CD pipelines
```

## Development

### Running Tests

```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=app --cov-report=html

# Run specific test file
uv run pytest tests/test_users.py -v
```

### Code Quality

```bash
# Lint
uv run ruff check .

# Format
uv run ruff format .

# Type check
uv run mypy app
```

### Database Migrations

```bash
# Create migration
uv run alembic revision --autogenerate -m "Description"

# Apply migrations
uv run alembic upgrade head

# Rollback one migration
uv run alembic downgrade -1
```

## Deployment

### Environments

| Environment | Branch | URL |
|-------------|--------|-----|
| Development | `development` | `https://api-dev.example.com` |
| Staging | `staging` | `https://api-staging.example.com` |
| Production | `main` | `https://api.example.com` |

### Branch Strategy

```
feature/* → development → staging → main
```

1. Create feature branch from `development`
2. Create PR to `development` → deploys to Dev
3. Merge `development` to `staging` → deploys to Staging
4. Merge `staging` to `main` → deploys to Production

### Infrastructure

See [docs/technical/INFRASTRUCTURE.md](docs/technical/INFRASTRUCTURE.md) for:
- Architecture diagram
- Terraform modules
- AWS resources
- Initial setup

### CI/CD

See [docs/technical/GITHUB_ACTIONS.md](docs/technical/GITHUB_ACTIONS.md) for:
- Workflow documentation
- Deployment process
- Required secrets

## PR Guidelines

### ⚠️ Important: Separate Infrastructure and Code PRs

**Never mix infrastructure changes and application code in the same PR.**

| PR Type | Contains | Example |
|---------|----------|---------|
| **Code PR** | Routes, models, services, tests | `feat: add user endpoint` |
| **Infra PR** | Terraform, Docker, GitHub Actions | `infra: add Redis cache` |

**Why?**
- Clean rollbacks
- Easier reviews
- Simpler debugging

### Commit Message Format

```
feat: add user authentication endpoint
fix: resolve database timeout issue
infra: add ElastiCache Redis cluster
docs: update API documentation
test: add user service tests
chore: upgrade dependencies
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `ENVIRONMENT` | Environment name | Yes |
| `LOG_LEVEL` | Logging level | No |
| `SECRET_KEY` | JWT secret key | Yes |

## Documentation

- [Infrastructure](docs/technical/INFRASTRUCTURE.md)
- [GitHub Actions](docs/technical/GITHUB_ACTIONS.md)
- [Deployment Runbook](docs/runbooks/DEPLOYMENT.md)
- [Rollback Runbook](docs/runbooks/ROLLBACK.md)

## License

Proprietary - All rights reserved.
