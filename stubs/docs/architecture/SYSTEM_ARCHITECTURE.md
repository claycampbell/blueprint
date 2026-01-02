# Connect 2.0 System Architecture

**Version:** 2.0
**Last Updated:** January 2026
**Status:** Active
**Authoritative Tech Stack:** [TECH_STACK_DECISIONS.md](./TECH_STACK_DECISIONS.md)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [System Components](#system-components)
3. [Infrastructure](#infrastructure)
4. [Integration Layer](#integration-layer)
5. [Security Architecture](#security-architecture)
6. [Scalability & Performance](#scalability--performance)
7. [Disaster Recovery](#disaster-recovery)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │    Web App    │  │  Mobile Web   │  │   iPad App    │               │
│  │ (React + TS)  │  │ (Responsive)  │  │ (Inspections) │               │
│  │  app.domain   │  │  app.domain   │  │  Bi-directional│               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
│         │                  │                  │                          │
└─────────┼──────────────────┼──────────────────┼──────────────────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────────┐
│                       API GATEWAY (ALB)                                  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ • Rate Limiting  • SSL/TLS  • Request Routing  • Health Checks    │  │
│  │ • CORS          • API Versioning (/v1/)  • Access Logging        │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────────┐
│                      APPLICATION LAYER                                   │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   Lead &    │  │ Feasibility  │  │ Entitlement  │  │   Lending   │  │
│  │   Project   │  │   Service    │  │   Service    │  │   Service   │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │  Servicing  │  │   Document   │  │   Contact    │  │    Task     │  │
│  │   Service   │  │   Service    │  │   Service    │  │   Service   │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │
│                                                                          │
│  FastAPI (Python 3.12+) • SQLAlchemy 2.0 • Pydantic v2                  │
└──────────────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────────┐
│                      INTEGRATION LAYER                                   │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  BPO Legacy  │  │   DocuSign   │  │   AWS        │  │   iPad     │  │
│  │  (Firebase)  │  │  (E-Sign)    │  │   Textract   │  │  Sync API  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │  AWS SES     │  │   Twilio     │  │  Accounting  │                   │
│  │   (Email)    │  │   (SMS)      │  │   System     │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
└──────────────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────────┐
│                         DATA LAYER                                       │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │  PostgreSQL  │  │    Redis     │  │      S3      │                   │
│  │  (RDS)       │  │ (ElastiCache)│  │  (Documents) │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
└──────────────────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Modular Monolith**
   - Start with modular monolith (services as modules within single deployment)
   - Clear module boundaries enable future service extraction if needed
   - Shared database with logical separation by domain

2. **API-First Design**
   - All functionality exposed via REST APIs
   - OpenAPI specification auto-generated from FastAPI
   - External integrations use versioned public API

3. **Event-Driven Where Appropriate**
   - Async processing for document AI, email notifications
   - Background workers for long-running tasks (Celery/ARQ)
   - Workflow state changes can trigger events

4. **Cloud-Native on AWS**
   - Containerized applications (Docker + ECS Fargate)
   - Stateless application servers (horizontal scaling)
   - Managed services for data layer (RDS, ElastiCache, S3)

5. **Security by Design**
   - JWT authentication at API layer
   - RBAC authorization in application layer
   - Encryption in transit (TLS) and at rest
   - Audit logging for all data changes

---

## System Components

### Web Application (React)

- **Technology**: React 18+, TypeScript, Vite
- **Domain**: `app.connect2.com`
- **Deployment**: ECS Fargate behind ALB
- **Features**:
  - Responsive design (mobile-friendly)
  - TanStack Query for server state
  - Zustand for client state
  - Role-based UI rendering

### API Backend (FastAPI)

- **Technology**: Python 3.12+, FastAPI, SQLAlchemy 2.0
- **Domain**: `api.connect2.com`
- **Deployment**: ECS Fargate behind ALB
- **Features**:
  - Auto-generated OpenAPI documentation
  - Pydantic v2 request/response validation
  - Async database operations (asyncpg)
  - Dependency injection for services

### iPad Inspection App

- **Technology**: Native iOS (existing app)
- **Integration**: Bi-directional REST API
- **Sync**: Nightly batch sync + real-time draw requests
- **Features**:
  - Offline-capable inspection forms
  - Photo capture and upload
  - Construction progress tracking
  - Draw request submission

---

## Infrastructure

### AWS Architecture

See [infrastructure/docs/OVERVIEW.md](../../infrastructure/docs/OVERVIEW.md) for detailed infrastructure documentation.

#### Shared Infrastructure
- **VPC**: 3 AZs, public/private subnets, NAT Gateway
- **ECS Cluster**: Fargate capacity provider
- **Route53**: DNS management
- **SNS**: Alert topics (critical, warning, info)

#### Per-Service Resources
- **API**: ALB, ECS Service, RDS PostgreSQL, ElastiCache Redis, ECR
- **Web**: ALB, ECS Service, ECR

### Environment Strategy

| Environment | Branch | Database | Features |
|-------------|--------|----------|----------|
| **Dev** | `development` | RDS (t3.micro) | Debug logging, seed data |
| **Staging** | `staging` | RDS (t3.small) | Production-like, UAT |
| **Production** | `main` | RDS (Multi-AZ) | High availability, backups |

### Container Configuration

```yaml
# Example ECS Task Definition
task_cpu: 512        # 0.5 vCPU
task_memory: 1024    # 1 GB RAM
desired_count: 2     # Minimum tasks
max_capacity: 10     # Auto-scale ceiling
```

---

## Integration Layer

### BPO (Blueprint Online) - Legacy

**Current State**: Firebase-based lead intake system
**Integration**: Temporary API during Days 1-90, then migrated into Connect 2.0

```
BPO Firebase → Cloud Function → Connect 2.0 API
                                   ↓
                            Project created
```

### iPad Inspection App

**Sync Pattern**: Bi-directional REST API

```
┌────────────────┐     ┌─────────────────┐
│   iPad App     │     │  Connect 2.0    │
│                │     │     API         │
│  - Inspections │ ←─→ │                 │
│  - Photos      │     │  /v1/inspections│
│  - Draw Status │     │  /v1/draws      │
└────────────────┘     └─────────────────┘
        │
        │ Nightly Sync
        ↓
┌────────────────┐
│   S3 Bucket    │
│  (Photo Store) │
└────────────────┘
```

### DocuSign / Authentisign

**Pattern**: Outbound API + Inbound Webhook

```
Connect 2.0 → DocuSign API (send envelope)
DocuSign → Connect 2.0 Webhook (signed event)
```

### AWS Textract (Document Intelligence)

**Use Cases**:
- Survey document extraction
- Title report parsing
- Arborist report extraction

**Pattern**: Async processing

```
Document Upload → S3 → Textract Job → SQS → Worker → Database
```

---

## Security Architecture

### Authentication & Authorization

**OAuth 2.0 + JWT Flow**:

```
1. Login: POST /auth/token (credentials)
2. Server validates, returns JWT + refresh token
3. Client sends: Authorization: Bearer {token}
4. API validates JWT, extracts user context
5. RBAC middleware checks permissions
```

**JWT Payload**:
```json
{
  "sub": "user_uuid",
  "email": "user@blueprint.com",
  "role": "acquisitions",
  "permissions": ["read:projects", "write:projects"],
  "iat": 1699200000,
  "exp": 1699203600
}
```

### RBAC Matrix

| Resource | Admin | Acquisitions | Design | Entitlement | Servicing | Builder |
|----------|-------|--------------|--------|-------------|-----------|---------|
| Projects (Read) | ✓ | ✓ | ✓ | ✓ | ✓ | Own |
| Projects (Write) | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Loans (Read) | ✓ | ✓ | ✗ | ✗ | ✓ | Own |
| Loans (Write) | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ |
| Draws (Request) | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ |
| Draws (Approve) | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ |

### Data Security

- **In Transit**: TLS 1.3 for all connections
- **At Rest**: RDS encryption, S3 SSE-S3
- **Secrets**: AWS Secrets Manager
- **PII**: Encrypted sensitive fields, audit logging

---

## Scalability & Performance

### Horizontal Scaling

```
Auto-Scaling Configuration:
- Min tasks: 2 (dev: 1)
- Max tasks: 10 (prod: 20)
- Target CPU: 70%
- Scale-out cooldown: 60s
- Scale-in cooldown: 300s
```

### Caching Strategy

| Cache Type | Technology | Use Case | TTL |
|------------|------------|----------|-----|
| Session | Redis | JWT verification | 15 min |
| Application | Redis | Frequently accessed data | 5-60 min |
| CDN | CloudFront | Static assets | 24 hours |

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response (p95) | < 200ms | CloudWatch |
| API Response (p99) | < 500ms | CloudWatch |
| Database Query (p95) | < 50ms | RDS metrics |
| Page Load (FCP) | < 1.5s | Lighthouse |
| Uptime (SLA) | ≥ 99.5% | CloudWatch |

---

## Disaster Recovery

### Backup Strategy

| Resource | Frequency | Retention | Cross-Region |
|----------|-----------|-----------|--------------|
| RDS Snapshots | Daily | 30 days | Yes (DR) |
| S3 Documents | Continuous | Versioned | Yes |
| Redis | No backup | In-memory | N/A |

### Recovery Objectives

- **RPO** (Recovery Point Objective): < 15 minutes
- **RTO** (Recovery Time Objective): < 2 hours

### Failover Procedures

1. **Database Failure**: RDS Multi-AZ automatic failover (~60 seconds)
2. **AZ Failure**: ALB routes to healthy AZs automatically
3. **Region Failure**: Manual DNS failover to DR region

### Health Checks

```
GET /health → 200 OK
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "version": "1.0.0"
}
```

---

## Related Documents

- [TECH_STACK_DECISIONS.md](./TECH_STACK_DECISIONS.md) - Authoritative tech stack decisions
- [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md) - Repository organization
- [infrastructure/docs/OVERVIEW.md](../../infrastructure/docs/OVERVIEW.md) - Infrastructure details
- [api/docs/DATABASE_SCHEMA.md](../../api/docs/DATABASE_SCHEMA.md) - Database schema
- [api/docs/API_SPECIFICATION.md](../../api/docs/API_SPECIFICATION.md) - API reference

---

## Change Log

| Date | Version | Change |
|------|---------|--------|
| January 2026 | 2.0 | Updated for AWS infrastructure, Python/FastAPI stack |
| November 2025 | 1.0 | Initial architecture document |
