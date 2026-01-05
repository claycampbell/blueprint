# Connect 2.0 API

FastAPI-based backend service for the Connect 2.0 platform.

## Quick Start

```bash
# Install dependencies
uv sync --all-extras

# Copy environment file
cp .env.example .env

# Start development server
uv run uvicorn app.main:app --reload

# Run tests
uv run pytest

# Run linter
uv run ruff check .
```

The API runs at http://localhost:8000. API docs available at http://localhost:8000/docs.

## Tech Stack

- **Framework:** FastAPI + Python 3.12+
- **ORM:** SQLAlchemy 2.0 (async)
- **Validation:** Pydantic v2
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Testing:** pytest + pytest-asyncio
- **Linting:** Ruff + MyPy

## Project Structure

```
app/
├── api/               # API routes
│   └── v1/            # API version 1
├── core/              # Core config, security
├── db/                # Database setup, repositories
├── models/            # SQLAlchemy models
├── schemas/           # Pydantic schemas
├── services/          # Business logic
└── main.py            # Application entry point

infrastructure/
└── terraform/
    ├── environments/  # dev, staging, prod configs
    │   ├── dev/
    │   ├── staging/
    │   └── prod/
    └── modules/       # Terraform modules
        ├── networking/      # VPC, subnets, NAT
        ├── ecs-cluster/     # Fargate cluster
        ├── ecs-service/     # ECS service
        ├── alb/             # Load balancer
        ├── rds/             # PostgreSQL
        ├── elasticache/     # Redis
        ├── ecr/             # Container registry
        ├── acm/             # SSL certificates
        ├── dns-record/      # Route53 records
        ├── route53-zone/    # DNS zone
        ├── bastion/         # DB access host
        └── sns-alerts/      # Alerting

migrations/            # Alembic migrations
tests/                 # Test suite
scripts/               # Utility scripts
```

## Infrastructure

This repository includes its own complete AWS infrastructure:

| Resource | Description |
|----------|-------------|
| VPC | 10.1.0.0/16 with public/private subnets |
| ECS Cluster | Fargate capacity provider |
| ALB | Load balancer for api.connect.com |
| RDS PostgreSQL | Primary database |
| ElastiCache Redis | Caching and sessions |
| ECR | Container registry |
| Route53 | DNS management |

### Environments

| Environment | State Bucket | Domain |
|-------------|--------------|--------|
| dev | `connect2-api-terraform-state-dev` | api-dev.connect.com |
| staging | `connect2-api-terraform-state-staging` | api-staging.connect.com |
| prod | `connect2-api-terraform-state-prod` | api.connect.com |

### Deploying Infrastructure

```bash
cd infrastructure/terraform/environments/dev

# Initialize
terraform init

# Plan
terraform plan -var-file=dev.tfvars

# Apply
terraform apply -var-file=dev.tfvars
```

## Contributing

### Branch Strategy

```
development  →  Dev environment
staging      →  Staging environment
main         →  Production environment
```

### PR Guidelines

#### Keep Infrastructure and Code Separate

**Never mix infrastructure changes and application code in the same PR.**

| PR Type | Contains | Examples |
|---------|----------|----------|
| **Code PR** | Python code, tests, migrations | `feat: add user authentication` |
| **Infrastructure PR** | Terraform, Docker, GitHub Actions | `infra: increase RDS instance size` |

**Why?**
- Clean rollbacks - revert one without affecting the other
- Easier reviews - focus on one type of change
- Simpler debugging - know exactly what changed

**Example - Adding a feature that needs new infrastructure:**

```
1. PR #1: "infra: Add ElastiCache Redis" → merge, wait for deploy
2. PR #2: "feat: Add session caching with Redis" → merge
```

### Workflow

1. Create feature branch from `development`
2. Make changes, write tests
3. Run pre-commit checks: `uv run ruff check . && uv run mypy app && uv run pytest`
4. Create PR to `development`
5. Wait for CI (lint, type-check, test, build)
6. Get code review
7. Merge → auto-deploys to Dev

To promote to staging/production:
- Create PR from `development` → `staging` → `main`

## Scripts

| Command | Description |
|---------|-------------|
| `uv run uvicorn app.main:app --reload` | Start dev server |
| `uv run pytest` | Run tests |
| `uv run pytest --cov=app` | Run tests with coverage |
| `uv run ruff check .` | Run linter |
| `uv run ruff check . --fix` | Fix linting issues |
| `uv run ruff format .` | Format code |
| `uv run mypy app` | Run type checker |
| `uv run alembic upgrade head` | Run migrations |
| `uv run alembic revision --autogenerate -m "message"` | Create migration |

## Database Migrations

```bash
# Create a new migration
uv run alembic revision --autogenerate -m "Add user preferences table"

# Run migrations
uv run alembic upgrade head

# Rollback one migration
uv run alembic downgrade -1

# View migration status
uv run alembic current
```

## Documentation

- [API Quickstart](docs/technical/API_QUICKSTART.md) - Setup and development guide
- [FastAPI Standards](docs/technical/FASTAPI_PROJECT_STANDARDS.md) - Code conventions
- [API Specification](docs/technical/API_SPECIFICATION.md) - API reference
- [Infrastructure](docs/technical/INFRASTRUCTURE.md) - AWS infrastructure details
- [GitHub Actions](docs/technical/GITHUB_ACTIONS.md) - CI/CD workflows
- [Deployment Runbook](docs/runbooks/DEPLOYMENT.md) - Deployment procedures
- [Rollback Runbook](docs/runbooks/ROLLBACK.md) - Rollback procedures

## Environment Variables

Key environment variables (see `.env.example` for full list):

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/connect2

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# AWS (for S3 document storage)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=connect2-documents
```

## Rollback

To rollback the API service:

```bash
./scripts/rollback.sh prod
```

This reverts to the previous ECS task definition.

## License

Proprietary - Blueprint Capital
