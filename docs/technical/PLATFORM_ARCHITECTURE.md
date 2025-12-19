# Connect 2.0 Platform Architecture

**Version:** 1.0.0
**Last Updated:** December 19, 2025
**Status:** Approved

---

## Executive Summary

This document is the **single source of truth** for Connect 2.0's technology stack, architecture patterns, and infrastructure decisions. It consolidates decisions from multiple planning documents into one authoritative reference.

### Technology Stack At-a-Glance

| Layer | Technology | Status |
|-------|------------|--------|
| **Cloud Provider** | AWS | Approved |
| **Backend Language** | Python 3.12+ (FastAPI) | Approved |
| **Frontend Framework** | React 18+ (TypeScript) | Approved |
| **Database** | PostgreSQL 15+ (RDS) | Approved |
| **Cache** | Redis 7+ (ElastiCache) | Approved |
| **Infrastructure** | Terraform + Fargate | Approved |
| **CI/CD** | GitHub Actions | Approved |
| **Containerization** | Docker | Approved |

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Cloud Infrastructure (AWS)](#2-cloud-infrastructure-aws)
3. [Backend Architecture (FastAPI)](#3-backend-architecture-fastapi)
4. [Frontend Architecture (React)](#4-frontend-architecture-react)
5. [Data Layer](#5-data-layer)
6. [DevOps & CI/CD](#6-devops--cicd)
7. [Security Architecture](#7-security-architecture)
8. [Architecture Principles](#8-architecture-principles)
9. [Development Standards](#9-development-standards)
10. [Cost Analysis](#10-cost-analysis)

---

## 1. Architecture Overview

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Web App    │  │  Mobile Web  │  │   iPad App   │              │
│  │   (React)    │  │ (Responsive) │  │ (Inspections)│              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│         │                  │                  │                      │
└─────────┼──────────────────┼──────────────────┼─────────────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                     AWS INFRASTRUCTURE                               │
├────────────────────────────┼────────────────────────────────────────┤
│                             │                                        │
│     ┌───────────────────────┴───────────────────────┐               │
│     │           Application Load Balancer            │               │
│     │         (TLS termination, health checks)       │               │
│     └───────────────────────┬───────────────────────┘               │
│                             │                                        │
│     ┌───────────────────────┼───────────────────────┐               │
│     │              ECS Fargate Cluster               │               │
│     │  ┌─────────┐  ┌─────────┐  ┌─────────┐       │               │
│     │  │ API-1   │  │ API-2   │  │ API-3   │       │               │
│     │  │ FastAPI │  │ FastAPI │  │ FastAPI │       │               │
│     │  └─────────┘  └─────────┘  └─────────┘       │               │
│     │  ┌─────────────────────────────────────┐      │               │
│     │  │           Worker Containers          │      │               │
│     │  │    (Background jobs, queue consumers)│      │               │
│     │  └─────────────────────────────────────┘      │               │
│     └───────────────────────────────────────────────┘               │
│                             │                                        │
│     ┌───────────────────────┼───────────────────────┐               │
│     │              DATA LAYER                        │               │
│     │  ┌─────────────┐  ┌─────────────┐  ┌────────┐│               │
│     │  │RDS Postgres │  │ ElastiCache │  │   S3   ││               │
│     │  │  (Primary)  │  │   (Redis)   │  │  Docs  ││               │
│     │  └─────────────┘  └─────────────┘  └────────┘│               │
│     │  ┌─────────────┐  ┌─────────────┐            │               │
│     │  │     SQS     │  │     SNS     │            │               │
│     │  │  (Queues)   │  │ (Pub/Sub)   │            │               │
│     │  └─────────────┘  └─────────────┘            │               │
│     └───────────────────────────────────────────────┘               │
│                                                                      │
│     ┌────────────────────────────────────────────────────────────┐  │
│     │              AI/ML & EXTERNAL SERVICES                      │  │
│     │  ┌────────┐  ┌─────────┐  ┌────────┐  ┌────────┐  ┌──────┐│  │
│     │  │Bedrock │  │Textract │  │DocuSign│  │ Twilio │  │ SES  ││  │
│     │  │ (LLM)  │  │ (OCR)   │  │(E-Sign)│  │ (SMS)  │  │(Email)│  │
│     │  └────────┘  └─────────┘  └────────┘  └────────┘  └──────┘│  │
│     └────────────────────────────────────────────────────────────┘  │
│                                                                      │
│     ┌────────────────────────────────────────────────────────────┐  │
│     │              MONITORING & SECURITY                          │  │
│     │  ┌───────────┐  ┌──────────┐  ┌─────────┐  ┌────────────┐ │  │
│     │  │CloudWatch │  │  X-Ray   │  │ Secrets │  │    WAF     │ │  │
│     │  │(Logs/Alarms│  │(Tracing) │  │ Manager │  │ (Firewall) │ │  │
│     │  └───────────┘  └──────────┘  └─────────┘  └────────────┘ │  │
│     └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Cloud Infrastructure (AWS)

### 2.1 Why AWS?

| Criterion | AWS Score | Rationale |
|-----------|-----------|-----------|
| **AI/ML Services** | ⭐⭐⭐⭐ | Bedrock (Claude, GPT-4), Textract for document extraction |
| **Cost** | ⭐⭐⭐⭐⭐ | ~$61K/year estimated (30% less than Azure) |
| **Managed Services** | ⭐⭐⭐⭐⭐ | RDS, ElastiCache, ECS Fargate - battle-tested |
| **Ecosystem** | ⭐⭐⭐⭐⭐ | Largest third-party integration library |

### 2.2 AWS Services Stack

| Component | AWS Service | Purpose |
|-----------|-------------|---------|
| **Compute** | ECS Fargate | Serverless containers (no EC2 management) |
| **Load Balancing** | Application Load Balancer | Traffic distribution, TLS termination |
| **Database** | RDS PostgreSQL 15+ | Managed relational database with Multi-AZ |
| **Cache** | ElastiCache (Redis 7+) | Session cache, query cache, rate limiting |
| **Object Storage** | S3 | Document storage with versioning |
| **Message Queue** | SQS | Async task processing |
| **Pub/Sub** | SNS | Event notifications |
| **AI/ML** | Bedrock + Textract | LLM and document extraction |
| **Secrets** | Secrets Manager | Credential management with rotation |
| **Monitoring** | CloudWatch + X-Ray | Logs, metrics, distributed tracing |
| **CDN** | CloudFront | Static asset delivery |
| **DNS** | Route 53 | DNS management with health checks |
| **Certificates** | ACM | SSL/TLS certificates (free) |
| **Firewall** | WAF | Web application firewall |

### 2.3 Infrastructure as Code (Terraform)

All infrastructure is managed via Terraform with the following module structure:

```
infrastructure/
├── terraform/
│   ├── environments/
│   │   ├── dev/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── terraform.tfvars
│   │   ├── staging/
│   │   └── prod/
│   ├── modules/
│   │   ├── networking/      # VPC, subnets, security groups
│   │   ├── ecs/             # Fargate cluster, services, tasks
│   │   ├── rds/             # PostgreSQL with Multi-AZ
│   │   ├── elasticache/     # Redis cluster
│   │   ├── s3/              # Buckets with policies
│   │   ├── sqs/             # Queues and DLQs
│   │   ├── alb/             # Load balancer, listeners, targets
│   │   ├── cloudwatch/      # Dashboards, alarms
│   │   ├── secrets/         # Secrets Manager resources
│   │   └── bedrock/         # AI model access
│   └── backend.tf           # S3 backend for state
```

### 2.4 Network Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VPC (10.0.0.0/16)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Public Subnets (10.0.1.0/24, 10.0.2.0/24)    │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐        │  │
│  │  │    NAT Gateway      │  │   Load Balancer     │        │  │
│  │  │     (AZ-1)          │  │   (Multi-AZ)        │        │  │
│  │  └─────────────────────┘  └─────────────────────┘        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Private Subnets (10.0.10.0/24, 10.0.11.0/24)   │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐        │  │
│  │  │   ECS Tasks (AZ-1)  │  │   ECS Tasks (AZ-2)  │        │  │
│  │  └─────────────────────┘  └─────────────────────┘        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Isolated Subnets (10.0.20.0/24, 10.0.21.0/24)   │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐        │  │
│  │  │   RDS Primary       │  │   RDS Standby       │        │  │
│  │  │   ElastiCache       │  │   (Multi-AZ)        │        │  │
│  │  └─────────────────────┘  └─────────────────────┘        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Backend Architecture (FastAPI)

### 3.1 Technology Stack

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

### 3.2 Project Structure

```
app/
├── __init__.py
├── main.py                     # FastAPI app factory, lifespan
├── config.py                   # Pydantic Settings, env loading
├── dependencies.py             # Shared FastAPI dependencies
├── types.py                    # Shared type aliases
│
├── api/
│   ├── __init__.py
│   ├── router.py               # Aggregates all route modules
│   ├── health.py               # Liveness, readiness probes
│   ├── v1/
│   │   ├── __init__.py
│   │   ├── projects.py
│   │   ├── loans.py
│   │   ├── contacts.py
│   │   ├── documents.py
│   │   └── tasks.py
│   └── middleware/
│       ├── __init__.py
│       ├── cors.py
│       ├── logging.py          # Request/response logging
│       └── tracing.py          # AWS X-Ray
│
├── core/
│   ├── __init__.py
│   ├── security.py             # Auth, JWT, API keys
│   ├── exceptions.py           # Custom exceptions, handlers
│   └── logging.py              # Structured logging setup
│
├── db/
│   ├── __init__.py
│   ├── session.py              # SQLAlchemy async engine
│   ├── base.py                 # Declarative base
│   └── repositories/           # Database access layer
│       ├── __init__.py
│       ├── base.py             # Generic CRUD repository
│       ├── projects.py
│       ├── loans.py
│       └── contacts.py
│
├── models/                     # SQLAlchemy ORM models
│   ├── __init__.py
│   ├── project.py
│   ├── loan.py
│   ├── contact.py
│   └── document.py
│
├── schemas/                    # Pydantic request/response schemas
│   ├── __init__.py
│   ├── project.py
│   ├── loan.py
│   ├── contact.py
│   └── common.py               # Pagination, errors
│
├── services/                   # Business logic layer
│   ├── __init__.py
│   ├── project_service.py
│   ├── loan_service.py
│   └── document_service.py
│
├── providers/                  # External integrations
│   ├── __init__.py
│   ├── s3.py                   # S3 document storage
│   ├── sqs.py                  # Queue operations
│   ├── bedrock.py              # AI/ML operations
│   ├── textract.py             # Document extraction
│   └── docusign.py             # E-signature
│
├── workers/                    # Background tasks
│   ├── __init__.py
│   └── tasks.py
│
└── cli/                        # CLI utilities
    ├── __init__.py
    ├── db.py                   # seed, reset, migrate
    └── dev.py                  # setup, check, lint
```

### 3.3 Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (api/)                        │
│    FastAPI routes, request validation, response formatting   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│                    Service Layer (services/)                 │
│         Business logic, orchestration, validation            │
└──────────────────────────────┬──────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
┌────────┴────────┐   ┌───────┴───────┐   ┌────────┴────────┐
│ Repository Layer│   │ Provider Layer │   │  Models Layer   │
│    (db/repos/)  │   │  (providers/)  │   │   (models/)     │
│                 │   │                │   │                 │
│ Database access │   │ External APIs  │   │ SQLAlchemy ORM  │
│ Query building  │   │ AWS services   │   │ Entity definitions│
└─────────────────┘   └────────────────┘   └─────────────────┘
```

### 3.4 API Design Standards

**Versioning:** All endpoints versioned under `/api/v1/`

**Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20
  }
}
```

**Error Format:**
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

**Health Check:**
```
GET /health → 200 OK
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "uptime": 3600
}
```

---

## 4. Frontend Architecture (React)

### 4.1 Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Framework** | React | 18.x |
| **Language** | TypeScript | 5.5+ (strict) |
| **Build** | Vite | Latest stable |
| **Styling** | CSS Modules | Co-located |
| **Server State** | TanStack Query | 5.x |
| **Client State** | Zustand | 4.x |
| **Routing** | React Router | 6.x |
| **HTTP Client** | Axios | 1.x |
| **Forms** | React Hook Form + Zod | Latest |
| **Testing** | Vitest + RTL + Playwright | Latest |

### 4.2 Project Structure

```
src/
├── app/                    # Application shell
│   ├── App.tsx
│   ├── routes.tsx          # Route definitions
│   └── providers.tsx       # QueryClientProvider
│
├── pages/                  # Route entry points
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProjectsPage.tsx
│   ├── LoansPage.tsx
│   └── index.ts
│
├── api/                    # Shared server state (TanStack Query)
│   ├── projects/
│   │   ├── queries.ts      # useProjects, useProject
│   │   ├── mutations.ts    # useCreateProject, etc.
│   │   ├── keys.ts         # Query key factory
│   │   ├── types.ts        # Domain types
│   │   └── index.ts
│   ├── loans/
│   ├── contacts/
│   └── documents/
│
├── stores/                 # Shared client state (Zustand)
│   ├── auth.store.ts       # User session, permissions
│   ├── ui.store.ts         # Theme, sidebar, modals
│   ├── toast.store.ts      # Toast notifications
│   └── index.ts
│
├── features/               # UI features (isolated)
│   ├── project-management/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store.ts        # PRIVATE feature state
│   │   └── index.ts        # Export components only
│   ├── loan-management/
│   └── document-viewer/
│
├── components/             # Shared UI components
│   ├── ui/                 # Primitives (Button, Input)
│   └── common/             # Composed (DataTable, SearchBar)
│
├── hooks/                  # Shared custom hooks
├── lib/                    # Utilities
│   ├── api-client.ts       # Configured HTTP client
│   ├── constants.ts
│   └── utils.ts
│
├── styles/                 # Global styles
│   ├── variables.css       # CSS custom properties
│   └── global.css
│
├── types/                  # Shared TypeScript types
│   └── common.ts
│
└── main.tsx                # Entry point
```

### 4.3 State Management Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            pages/                                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌────────────────┐   ┌────────────────┐   ┌────────────────┐
│     api/       │   │    stores/     │   │   features/    │
│ ────────────── │   │ ────────────── │   │ ────────────── │
│ Shared SERVER  │   │ Shared CLIENT  │   │   Private UI   │
│    state       │   │    state       │   │    state       │
│ (TanStack Q)   │   │   (Zustand)    │   │   (Zustand)    │
└────────────────┘   └────────────────┘   └────────────────┘
   useProjects()       useAuthStore()      (not exported)
```

**Key Principle:** Features NEVER import from other features. They share data through `api/` and `stores/`.

### 4.4 Import Rules

| Layer | Can Import From | Cannot Import From |
|-------|-----------------|-------------------|
| `api/*` | `lib/`, `types/` | `features/*`, `pages/*`, `stores/*` |
| `stores/*` | `lib/`, `types/` | `features/*`, `pages/*`, `api/*` |
| `features/*` | `api/*`, `stores/*`, `lib/`, `components/*` | Other `features/*` |
| `pages/*` | Everything | — |

---

## 5. Data Layer

### 5.1 PostgreSQL (RDS)

**Configuration:**
- Instance: `db.r6g.xlarge` (4 vCPU, 32GB RAM)
- Multi-AZ deployment with automatic failover
- Automated backups (30-day retention)
- Point-in-time recovery enabled
- Encrypted at rest (KMS)

**Schema:** See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for complete schema definition.

### 5.2 Redis (ElastiCache)

**Use Cases:**
- Session storage (JWT validation cache)
- Query result caching (hot data)
- Rate limiting counters
- Background job queue (optional)

**Configuration:**
- Instance: `cache.r6g.large` (2 vCPU, 13GB RAM)
- Cluster mode enabled for scaling
- TTL-based expiration policies

### 5.3 S3 (Object Storage)

**Buckets:**
- `connect2-documents-{env}` - Project/loan documents
- `connect2-assets-{env}` - Static assets
- `connect2-backups-{env}` - Database backups

**Features:**
- Versioning enabled
- Server-side encryption (SSE-S3)
- Lifecycle policies (archive after 1 year)
- Cross-region replication (DR)

### 5.4 SQS (Message Queues)

**Queues:**
- `document-processing` - Document extraction jobs
- `notifications` - Email/SMS notifications
- `sync-tasks` - External system sync

**Configuration:**
- Dead Letter Queues (DLQ) for failed messages
- Visibility timeout: 5 minutes
- Message retention: 14 days

---

## 6. DevOps & CI/CD

### 6.1 Repository Structure (Monorepo)

```
blueprint/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint, test, type-check on PR
│       ├── cd-dev.yml          # Deploy to dev on merge
│       ├── cd-staging.yml      # Deploy to staging
│       ├── cd-prod.yml         # Deploy to prod (manual)
│       └── security.yml        # Dependency scanning
│
├── apps/
│   ├── api/                    # FastAPI backend
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   └── app/
│   └── web/                    # React frontend
│       ├── Dockerfile
│       ├── package.json
│       └── src/
│
├── infrastructure/
│   ├── terraform/
│   └── docker/
│       ├── docker-compose.yml
│       └── docker-compose.localstack.yml
│
├── docs/
│   ├── technical/
│   ├── decisions/
│   └── runbooks/
│
├── scripts/
│   ├── setup-dev.sh
│   └── deploy.sh
│
└── CLAUDE.md
```

### 6.2 GitHub Actions Pipeline

```yaml
# Simplified CI/CD Flow
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   PR Open   │────▶│    CI       │────▶│  PR Review  │
└─────────────┘     │ - Lint      │     └─────────────┘
                    │ - Test      │            │
                    │ - Type Check│            │
                    │ - Build     │            │
                    └─────────────┘            │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Merge     │────▶│  CD (Dev)   │────▶│   Dev Env   │
│   to main   │     │ - Build     │     │  deployed   │
└─────────────┘     │ - Push ECR  │     └─────────────┘
                    │ - Deploy ECS│
                    └─────────────┘
```

### 6.3 Docker Configuration

**API Dockerfile:**
```dockerfile
FROM python:3.12-slim AS builder

WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync --frozen --no-dev

FROM python:3.12-slim

WORKDIR /app
COPY --from=builder /app/.venv /app/.venv
COPY app ./app

ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Web Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 6.4 Local Development (LocalStack)

See [LOCAL_DEVELOPMENT_PLAN.md](../../LOCAL_DEVELOPMENT_PLAN.md) for complete LocalStack setup.

**Savings:** ~$95K/year by avoiding AWS dev accounts.

```bash
# Start local environment
docker-compose -f infrastructure/docker/docker-compose.localstack.yml up -d

# Services available locally:
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
# - LocalStack (S3, SQS, etc.): localhost:4566
# - API: localhost:8000
# - Web: localhost:3000
```

---

## 7. Security Architecture

### 7.1 Authentication & Authorization

**OAuth 2.0 + JWT Flow:**
```
1. Login: POST /auth/token (credentials) → JWT access + refresh tokens
2. API Request: Authorization: Bearer {token} → Verify + RBAC check
3. Refresh: POST /auth/token (refresh_token) → New access token
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

### 7.2 RBAC Matrix

| Resource | Admin | Acquisitions | Design | Servicing | Agent | Builder |
|----------|-------|--------------|--------|-----------|-------|---------|
| Projects (Read) | ✓ | ✓ | ✓ | ✓ | Own | Own |
| Projects (Write) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Loans (Read) | ✓ | ✓ | ✗ | ✓ | ✗ | Own |
| Loans (Write) | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Draws (Request) | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ |
| Draws (Approve) | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |

### 7.3 Data Security

| Layer | Protection |
|-------|------------|
| **In Transit** | TLS 1.3 for all connections |
| **At Rest** | RDS encryption (KMS), S3 SSE |
| **Secrets** | AWS Secrets Manager with auto-rotation |
| **Firewall** | WAF with OWASP rules |
| **Network** | Private subnets for data layer |
| **Audit** | CloudTrail for all AWS API calls |

---

## 8. Architecture Principles

### 8.1 Core Principles

1. **API-First Design**
   - All functionality exposed via REST APIs
   - OpenAPI spec as contract between frontend/backend
   - Internal modules communicate via APIs

2. **Event-Driven Processing**
   - Async processing for long-running tasks
   - SQS/SNS for cross-module communication
   - Workflow state changes trigger events

3. **Cloud-Native**
   - Containerized applications (Docker)
   - Stateless application servers
   - Managed cloud services for data layer

4. **Security by Design**
   - Authentication at API gateway
   - Authorization at application layer (RBAC)
   - Encryption everywhere
   - Audit logging for all changes

5. **Observability**
   - Structured logging (JSON)
   - Distributed tracing (X-Ray)
   - Metrics and alerting (CloudWatch)
   - Correlation IDs across requests

6. **Infrastructure as Code**
   - All infrastructure defined in Terraform
   - Version-controlled, reviewed, tested
   - Consistent across environments

### 8.2 Modular Monolith Strategy

Start with a modular monolith for simpler deployment, with clear module boundaries to enable future service extraction:

```
┌────────────────────────────────────────────────────────────┐
│                    MODULAR MONOLITH                         │
├────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Projects │  │ Loans    │  │ Documents│  │ Contacts │  │
│  │ Module   │  │ Module   │  │ Module   │  │ Module   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Shared Infrastructure                   │  │
│  │  (Database, Cache, Queue, Auth)                      │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 9. Development Standards

### 9.1 Code Quality

**Backend (Python):**
- Ruff for linting and formatting
- MyPy for type checking (strict mode)
- pytest with 80%+ coverage
- Pre-commit hooks enforced

**Frontend (TypeScript):**
- ESLint with strict rules
- Prettier for formatting
- TypeScript strict mode enabled
- Vitest with 70%+ coverage

### 9.2 Git Workflow

1. Branch from `main`: `<name>/<feature>`
2. Develop and commit with conventional commits
3. Open PR with description and Jira link
4. Pass CI checks (lint, test, build)
5. Get code review approval
6. Squash and merge

### 9.3 Documentation Requirements

Every component must have:
- README.md with setup instructions
- ARCHITECTURE.md for complex modules
- CLAUDE.md for AI context
- ADRs for significant decisions

---

## 10. Cost Analysis

### 10.1 Year 1 Estimates (MVP)

| Component | Monthly | Annual |
|-----------|---------|--------|
| **ECS Fargate** | $350 | $4,200 |
| **RDS PostgreSQL** | $250 | $3,000 |
| **ElastiCache Redis** | $80 | $960 |
| **S3 Storage** | $50 | $600 |
| **Data Transfer** | $100 | $1,200 |
| **AI/ML (Bedrock + Textract)** | $200 | $2,400 |
| **CloudWatch Logs** | $30 | $360 |
| **Other (SES, SNS, etc.)** | $50 | $600 |
| **Reserved Instance Savings** | -$350 | -$4,200 |
| **TOTAL** | **~$760** | **~$9,120** |

### 10.2 Scaling Projections

| Year | Users | Documents | API Requests/mo | Estimated Cost |
|------|-------|-----------|-----------------|----------------|
| 1 (MVP) | 50-500 | 10K | 100K | $9K |
| 2 | 500-2,000 | 50K | 500K | $15K |
| 3 | 2,000-5,000 | 150K | 1.5M | $25K |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Dec 19, 2025 | Engineering | Initial consolidated document |

---
