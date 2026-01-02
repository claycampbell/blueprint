# Connect 2.0 Platform

This directory contains the source code for the Connect 2.0 platform - a unified system for real estate development project management, loan origination, and servicing.

## Repository Structure

```
stubs/
├── api/                    # FastAPI backend service
├── web/                    # React frontend application
├── docs/                   # Shared documentation
├── infrastructure/         # Shared infrastructure modules
└── scripts/                # Shared utility scripts
```

## Services

| Service | Tech Stack | Description |
|---------|------------|-------------|
| **[api/](api/)** | FastAPI, Python 3.12, PostgreSQL | REST API backend |
| **[web/](web/)** | React, TypeScript, Vite | Web frontend application |

## Quick Start

### Prerequisites

- **Python 3.12+** - For API development
- **Node.js 20+** - For Web development
- **uv** - Python package manager (`pip install uv`)
- **Git** - Version control

### API Setup

```bash
cd api

# Install dependencies
uv sync --all-extras

# Start development server
uv run uvicorn app.main:app --reload --port 8000

# Run tests
uv run pytest
```

**API Documentation:** http://localhost:8000/docs (when running)

### Web Setup

```bash
cd web

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test
```

**Web App:** http://localhost:5173 (when running)

## Documentation

### Getting Started
- [Development Guide](docs/DEVELOPMENT_GUIDE.md) - Complete development workflow
- [Developer Tools Setup](docs/DEVELOPER_TOOLS_SETUP.md) - Jira, Everhour integration setup

### API Documentation
- [API Quickstart](api/docs/technical/API_QUICKSTART.md) - API setup and testing
- [FastAPI Standards](api/docs/technical/FASTAPI_PROJECT_STANDARDS.md) - Code conventions
- [API Specification](api/docs/technical/API_SPECIFICATION.md) - REST endpoints and schemas
- [Database Schema](api/docs/technical/DATABASE_SCHEMA.md) - Data model

### Web Documentation
- [Web Quickstart](web/docs/technical/APP_QUICKSTART.md) - Web setup guide
- [Frontend Architecture](web/docs/technical/FRONTEND_ARCHITECTURE.md) - React patterns and conventions

### Infrastructure
- [API Infrastructure](api/docs/technical/INFRASTRUCTURE.md) - API AWS deployment
- [Web Infrastructure](web/docs/technical/INFRASTRUCTURE.md) - Web AWS deployment
- [GitHub Actions](api/docs/technical/GITHUB_ACTIONS.md) - CI/CD workflows

### Project Planning
- [Product Requirements](docs/PRODUCT_REQUIREMENTS_DOCUMENT.md) - Full PRD
- [Cost of Ownership](docs/COST_OF_OWNERSHIP.md) - Infrastructure cost analysis

## Development Workflow

### Branch Strategy

```
feature/* --> development --> staging --> main
```

1. Create feature branch from `development`
2. Open PR to `development` - deploys to Dev environment
3. Merge to `staging` - deploys to Staging environment
4. Merge to `main` - deploys to Production

### Code Quality

**API (Python):**
```bash
cd api
uv run ruff check . --fix    # Lint
uv run ruff format .         # Format
uv run mypy app              # Type check
uv run pytest                # Test
```

**Web (TypeScript):**
```bash
cd web
npm run lint -- --fix        # Lint
npx tsc --noEmit             # Type check
npm run test -- --run        # Test
```

### PR Guidelines

**Important:** Keep infrastructure and code changes in separate PRs.

| PR Type | Contains |
|---------|----------|
| **Code PR** | Routes, components, services, tests |
| **Infra PR** | Terraform, Docker, GitHub Actions |

## Environments

| Environment | API URL | Web URL | Branch |
|-------------|---------|---------|--------|
| Development | `api-dev.example.com` | `app-dev.example.com` | `development` |
| Staging | `api-staging.example.com` | `app-staging.example.com` | `staging` |
| Production | `api.example.com` | `app.example.com` | `main` |

## Tech Stack

### Backend (API)
- **Framework:** FastAPI
- **Language:** Python 3.12
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Package Manager:** uv

### Frontend (Web)
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **State:** TanStack Query + Zustand
- **Styling:** Tailwind CSS

### Infrastructure
- **Cloud:** AWS
- **Compute:** ECS Fargate
- **IaC:** Terraform
- **CI/CD:** GitHub Actions

## Getting Help

- **Development questions:** See [Development Guide](docs/DEVELOPMENT_GUIDE.md)
- **Tool setup:** See [Developer Tools Setup](docs/DEVELOPER_TOOLS_SETUP.md)
- **API issues:** Check [API Quickstart](api/docs/technical/API_QUICKSTART.md)
- **Web issues:** Check [Web Quickstart](web/docs/technical/APP_QUICKSTART.md)

## License

Proprietary - All rights reserved.
