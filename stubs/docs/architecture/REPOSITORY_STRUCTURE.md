# Repository Structure

**Version:** 2.0
**Last Updated:** January 2026
**Related Documents:** [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md), [DEVELOPMENT_GUIDE.md](../development/DEVELOPMENT_GUIDE.md)

---

## Overview

Connect 2.0 is composed of **two independent applications**, each designed to be a standalone repository with its own complete infrastructure. This architecture enables:

- **Independent deployment** — Deploy API or Web without coordinating with the other
- **Cloud provider flexibility** — Move one service to a different cloud without affecting the other
- **Team autonomy** — Different teams can own each repository
- **Isolated blast radius** — Infrastructure issues in one service don't cascade
- **Clear ownership** — All resources for a service live in its repository

---

## Repository Separation

### Current State (Monorepo for Development)

During initial discovery, both applications exist in a shared `stubs/` directory:

```
stubs/
├── api/                    # Connect 2.0 API (standalone)
└── web/                    # Connect 2.0 Web (standalone)
```

### Target State (Separate Repositories)

Each application will be extracted to its own repository:

| Repository | Purpose | Domain |
|------------|---------|--------|
| `connect2-api` | FastAPI backend service | api.connect.com |
| `connect2-web` | React frontend application | app.connect.com |

**Extraction is straightforward** — Each directory is already self-contained with all code, infrastructure, documentation, and CI/CD workflows needed to operate independently.

---

## API Repository Structure

The API repository contains a FastAPI backend with PostgreSQL and Redis.

```
connect2-api/
├── app/                          # Application code
│   ├── api/                      # API routes
│   │   └── v1/                   # Versioned endpoints
│   ├── core/                     # Core config, security
│   ├── db/                       # Database setup, repositories
│   ├── models/                   # SQLAlchemy models
│   ├── schemas/                  # Pydantic schemas
│   ├── services/                 # Business logic
│   └── main.py                   # Application entry point
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile            # Multi-stage Python build
│   │   └── .dockerignore
│   └── terraform/
│       ├── modules/              # Reusable Terraform modules
│       │   ├── networking/       # VPC, subnets, NAT gateway
│       │   ├── ecs-cluster/      # Fargate cluster
│       │   ├── ecs-service/      # ECS service definition
│       │   ├── alb/              # Application Load Balancer
│       │   ├── rds/              # PostgreSQL database
│       │   ├── elasticache/      # Redis cache
│       │   ├── ecr/              # Container registry
│       │   ├── acm/              # SSL certificates
│       │   ├── dns-record/       # Route53 records
│       │   ├── route53-zone/     # DNS hosted zone
│       │   ├── bastion/          # DB access host
│       │   └── sns-alerts/       # Alerting
│       └── environments/         # Per-environment configs
│           ├── dev/
│           ├── staging/
│           └── prod/
│
├── migrations/                   # Alembic database migrations
├── tests/                        # Test suite
├── scripts/                      # Utility scripts
│   └── rollback.sh               # ECS rollback
│
├── docs/
│   ├── technical/
│   │   ├── API_QUICKSTART.md
│   │   ├── API_SPECIFICATION.md
│   │   ├── FASTAPI_PROJECT_STANDARDS.md
│   │   ├── INFRASTRUCTURE.md
│   │   └── GITHUB_ACTIONS.md
│   └── runbooks/
│       ├── DEPLOYMENT.md
│       └── ROLLBACK.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml                # Lint, test, type-check
│       ├── deploy-dev.yml        # Deploy to dev
│       ├── deploy-staging.yml    # Deploy to staging
│       ├── deploy-prod.yml       # Deploy to production
│       └── terraform.yml         # Infrastructure changes
│
├── .env.example
├── pyproject.toml
└── README.md
```

### API Infrastructure Summary

| Resource | Description | CIDR/Domain |
|----------|-------------|-------------|
| **VPC** | Dedicated API network | `10.1.0.0/16` |
| **ECS Cluster** | Fargate capacity provider | `connect2-api-cluster-{env}` |
| **ALB** | HTTPS load balancer | `api.connect.com` |
| **RDS PostgreSQL** | Primary database | Multi-AZ in prod |
| **ElastiCache Redis** | Caching and sessions | Cluster mode in prod |
| **ECR** | Container registry | `connect2-api-{env}` |
| **Terraform State** | S3 backend | `connect2-api-terraform-state-{env}` |

---

## Web Repository Structure

The Web repository contains a React frontend served via Nginx.

```
connect2-web/
├── src/                          # Application code
│   ├── app/                      # App shell, routes, providers
│   ├── pages/                    # Route pages
│   ├── api/                      # TanStack Query hooks
│   ├── stores/                   # Zustand stores
│   ├── features/                 # Feature modules
│   ├── components/               # Shared components
│   │   ├── ui/                   # Primitives (Button, Input)
│   │   └── common/               # Composed (DataTable)
│   ├── hooks/                    # Shared hooks
│   ├── lib/                      # Utilities
│   ├── styles/                   # Global CSS
│   └── types/                    # TypeScript types
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile            # Multi-stage Node → Nginx build
│   │   ├── nginx.conf            # SPA routing, caching
│   │   └── .dockerignore
│   └── terraform/
│       ├── modules/              # Reusable Terraform modules
│       │   ├── networking/       # VPC, subnets, NAT gateway
│       │   ├── ecs-cluster/      # Fargate cluster
│       │   ├── ecs-service/      # ECS service definition
│       │   ├── alb/              # Application Load Balancer
│       │   ├── ecr/              # Container registry
│       │   ├── acm/              # SSL certificates
│       │   ├── dns-record/       # Route53 records
│       │   ├── route53-zone/     # DNS hosted zone
│       │   └── sns-alerts/       # Alerting
│       └── environments/         # Per-environment configs
│           ├── dev/
│           ├── staging/
│           └── prod/
│
├── tests/                        # Test suite
├── scripts/                      # Utility scripts
│   └── rollback.sh               # ECS rollback
│
├── docs/
│   ├── technical/
│   │   ├── APP_QUICKSTART.md
│   │   ├── FRONTEND_ARCHITECTURE.md
│   │   ├── INFRASTRUCTURE.md
│   │   └── GITHUB_ACTIONS.md
│   └── runbooks/
│       ├── DEPLOYMENT.md
│       └── ROLLBACK.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml                # Lint, test, type-check, build
│       ├── deploy-dev.yml        # Deploy to dev
│       ├── deploy-staging.yml    # Deploy to staging
│       ├── deploy-prod.yml       # Deploy to production
│       └── terraform.yml         # Infrastructure changes
│
├── .env.example
├── package.json
└── README.md
```

### Web Infrastructure Summary

| Resource | Description | CIDR/Domain |
|----------|-------------|-------------|
| **VPC** | Dedicated Web network | `10.2.0.0/16` |
| **ECS Cluster** | Fargate capacity provider | `connect2-web-cluster-{env}` |
| **ALB** | HTTPS load balancer | `app.connect.com` |
| **ECR** | Container registry | `connect2-web-{env}` |
| **Terraform State** | S3 backend | `connect2-web-terraform-state-{env}` |

---

## Key Design Decisions

### No Shared Infrastructure

Each repository contains **all infrastructure** needed to run independently:

| Aspect | API Repository | Web Repository |
|--------|----------------|----------------|
| **VPC** | Own VPC (10.1.0.0/16) | Own VPC (10.2.0.0/16) |
| **ECS Cluster** | Dedicated cluster | Dedicated cluster |
| **Terraform State** | Separate S3 bucket | Separate S3 bucket |
| **CI/CD Workflows** | Self-contained | Self-contained |
| **Documentation** | Complete for API | Complete for Web |

### No Remote State Dependencies

Unlike polyglot repository patterns, there are **no `terraform_remote_state` data sources** referencing external infrastructure. Each environment's `main.tf` creates everything it needs.

### Independent Deployment Pipelines

```
┌─────────────────────────────────────────────────────────────────────┐
│                         API REPOSITORY                               │
├─────────────────────────────────────────────────────────────────────┤
│  Push to development → CI → Deploy to Dev (api-dev.connect.com)     │
│  Push to staging     → CI → Deploy to Staging                        │
│  Push to main        → CI → Deploy to Production (api.connect.com)  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         WEB REPOSITORY                               │
├─────────────────────────────────────────────────────────────────────┤
│  Push to development → CI → Deploy to Dev (app-dev.connect.com)     │
│  Push to staging     → CI → Deploy to Staging                        │
│  Push to main        → CI → Deploy to Production (app.connect.com)  │
└─────────────────────────────────────────────────────────────────────┘
```

### Communication Between Services

The Web app communicates with the API via HTTPS:

```
┌─────────────┐         HTTPS          ┌─────────────┐
│  Web App    │ ─────────────────────► │   API       │
│ app.connect │   api.connect.com/v1   │ api.connect │
└─────────────┘                        └─────────────┘
```

**Configuration:**
- Web app uses `VITE_API_URL` environment variable
- API provides CORS configuration for the Web domain

| Environment | Web Domain | API URL |
|-------------|------------|---------|
| Dev | app-dev.connect.com | https://api-dev.connect.com |
| Staging | app-staging.connect.com | https://api-staging.connect.com |
| Prod | app.connect.com | https://api.connect.com |

---

## Environment Configuration

### API Environments

| Environment | Terraform State Bucket | Domain | Resources |
|-------------|------------------------|--------|-----------|
| **Dev** | `connect2-api-terraform-state-dev` | api-dev.connect.com | Minimal, Spot instances |
| **Staging** | `connect2-api-terraform-state-staging` | api-staging.connect.com | Production-like, Spot |
| **Prod** | `connect2-api-terraform-state-prod` | api.connect.com | Full HA, Multi-AZ |

### Web Environments

| Environment | Terraform State Bucket | Domain | Resources |
|-------------|------------------------|--------|-----------|
| **Dev** | `connect2-web-terraform-state-dev` | app-dev.connect.com | Minimal, Spot instances |
| **Staging** | `connect2-web-terraform-state-staging` | app-staging.connect.com | Production-like, Spot |
| **Prod** | `connect2-web-terraform-state-prod` | app.connect.com | Full HA, no Spot |

---

## Benefits of This Structure

### 1. Cloud Provider Flexibility

Either repository can be migrated independently:

```
Example: Move API to Azure while Web stays on AWS

Before:
  API (AWS) ←── HTTPS ──→ Web (AWS)

After:
  API (Azure) ←── HTTPS ──→ Web (AWS)

Only change: Update VITE_API_URL in Web's environment config
```

### 2. Independent Scaling

Scale each service based on its specific needs:

- **API** might need more database capacity
- **Web** might need CDN or edge caching
- Neither affects the other's infrastructure

### 3. Team Autonomy

Different teams can own each repository:

- **Backend Team** → connect2-api repository
- **Frontend Team** → connect2-web repository
- No coordination needed for infrastructure changes

### 4. Simplified Rollbacks

Roll back one service without affecting the other:

```bash
# API had a bad deployment? Roll back API only
cd connect2-api
./scripts/rollback.sh prod

# Web is unaffected and continues serving users
```

### 5. Clear Blast Radius

Infrastructure issues are isolated:

- API VPC misconfiguration → Only API affected
- Web ECS cluster issue → Only Web affected
- No cascading failures between services

---

## Extracting to Separate Repositories

When ready to split into separate repositories:

### 1. Create New Repositories

```bash
# Create empty repositories
gh repo create your-org/connect2-api --private
gh repo create your-org/connect2-web --private
```

### 2. Extract API

```bash
# From the monorepo root
cd stubs/api

# Initialize new repo
git init
git remote add origin git@github.com:your-org/connect2-api.git

# Copy .gitignore, commit, push
git add .
git commit -m "Initial commit: Extract API from monorepo"
git push -u origin main
```

### 3. Extract Web

```bash
cd stubs/web

git init
git remote add origin git@github.com:your-org/connect2-web.git

git add .
git commit -m "Initial commit: Extract Web from monorepo"
git push -u origin main
```

### 4. Configure GitHub Secrets

For each repository, add these secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### 5. Deploy Infrastructure

```bash
# In each repository
cd infrastructure/terraform/environments/dev
terraform init
terraform apply -var-file=dev.tfvars
```

---

## Related Documentation

### API
- [API README](../../api/README.md) - Quick start guide
- [API Infrastructure](../../api/docs/technical/INFRASTRUCTURE.md) - Detailed infrastructure docs
- [API GitHub Actions](../../api/docs/technical/GITHUB_ACTIONS.md) - CI/CD workflows

### Web
- [Web README](../../web/README.md) - Quick start guide
- [Web Infrastructure](../../web/docs/technical/INFRASTRUCTURE.md) - Detailed infrastructure docs
- [Web GitHub Actions](../../web/docs/technical/GITHUB_ACTIONS.md) - CI/CD workflows

### Architecture
- [System Architecture](./SYSTEM_ARCHITECTURE.md) - High-level system design
- [Tech Stack Decisions](./TECH_STACK_DECISIONS.md) - Technology choices
