# Infrastructure Architecture

**Version:** 2.0
**Last Updated:** January 2026
**Related Documents:** [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md), [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)

---

## Overview

Connect 2.0 uses a split infrastructure approach optimized for each application's needs:

| Application | Hosting | Why |
|-------------|---------|-----|
| **API** | ECS Fargate | Server-side processing, database connections, stateful operations |
| **Web** | S3 + CloudFront | Static SPA, no SSR, global edge caching, cost-effective |

This architecture provides:
- **Optimal cost efficiency** — Static hosting for frontend (~$5-20/month vs $50-150/month on Fargate)
- **Global performance** — CloudFront edge locations for sub-100ms response times
- **Simplified operations** — No container management for frontend
- **Independent scaling** — Each layer scales based on its specific needs

---

## Environment Strategy

### Three-Environment Model

| Environment | Purpose | API | Web | Lifecycle |
|-------------|---------|-----|-----|-----------|
| **PR Preview** | QA testing | Uses Staging API | Ephemeral S3/CloudFront | Auto-created on PR, auto-destroyed on merge |
| **Staging** | Client UAT | Dedicated Fargate | Dedicated S3/CloudFront | Persistent |
| **Production** | Live users | Dedicated Fargate | Dedicated S3/CloudFront | Persistent |

### Why This Model?

1. **PR Previews replace Dev environment**
   - QA tests features in isolated environments
   - No persistent dev infrastructure to maintain
   - Fresh environment for each feature branch
   - Automatically cleaned up after merge

2. **Staging for Client UAT**
   - Stable environment for client review
   - Production-like configuration
   - Safe space for upcoming feature demos

3. **Production for Live Users**
   - Full high-availability configuration
   - Multi-AZ deployments
   - No Spot instances

---

## API Infrastructure

The API runs on ECS Fargate with full AWS managed services.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API INFRASTRUCTURE                                  │
│                              (VPC: 10.1.0.0/16)                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                              Route 53                                    │    │
│  │                    api.connect.com (Production)                          │    │
│  │                    api-staging.connect.com (Staging)                     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │              Application Load Balancer (HTTPS)                           │    │
│  │                    SSL/TLS termination, health checks                    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         VPC (2-3 AZs)                                    │    │
│  │  Public Subnets: ALB, NAT Gateway                                        │    │
│  │  Private Subnets: ECS Tasks, RDS, ElastiCache                           │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                          │
│  ┌───────────────────────────────────┼───────────────────────────────────┐      │
│  │                    ECS Fargate Cluster                                 │      │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                    │      │
│  │  │   Task 1    │  │   Task 2    │  │   Task N    │  (Auto-scaling)    │      │
│  │  │  (FastAPI)  │  │  (FastAPI)  │  │  (FastAPI)  │                    │      │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                    │      │
│  └───────────────────────────────────────────────────────────────────────┘      │
│                          │                       │                              │
│           ┌──────────────┴───────────┐          │                              │
│           ▼                          ▼          ▼                              │
│  ┌─────────────────┐      ┌─────────────────┐  ┌─────────────────┐            │
│  │  RDS PostgreSQL │      │ ElastiCache     │  │      ECR        │            │
│  │   (Multi-AZ     │      │    Redis        │  │  (Container     │            │
│  │    in prod)     │      │  (Sessions,     │  │   Registry)     │            │
│  │                 │      │   Caching)      │  │                 │            │
│  └─────────────────┘      └─────────────────┘  └─────────────────┘            │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### API Resources by Environment

| Resource | Staging | Production |
|----------|---------|------------|
| **Fargate Tasks** | 2 | 3-20 (auto-scaling) |
| **CPU/Memory** | 256/512 | 512/1024 |
| **Spot Instances** | Yes | No |
| **RDS Instance** | db.t3.small | db.r6g.large |
| **RDS Multi-AZ** | No | Yes |
| **Redis Node** | cache.t3.micro | cache.r6g.large |
| **Redis Cluster** | No | Yes |
| **Log Retention** | 14 days | 90 days |

### API Terraform Modules

```
infrastructure/terraform/modules/
├── networking/          # VPC, subnets, NAT gateway
├── ecs-cluster/         # Fargate cluster
├── ecs-service/         # ECS service + task definition
├── alb/                 # Application Load Balancer
├── rds/                 # PostgreSQL database
├── elasticache/         # Redis cache
├── ecr/                 # Container registry
├── acm/                 # SSL certificates
├── dns-record/          # Route53 records
└── sns-alerts/          # Alerting
```

---

## Web Infrastructure

The Web app is deployed as a static SPA to S3 with CloudFront CDN.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              WEB INFRASTRUCTURE                                  │
│                              (No VPC Required)                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                              Route 53                                    │    │
│  │                    app.connect.com (Production)                          │    │
│  │                    app-staging.connect.com (Staging)                     │    │
│  │                    pr-{number}.app.connect.com (PR Preview)              │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                      CloudFront Distribution                             │    │
│  │                                                                          │    │
│  │  • Global edge locations (200+ PoPs)                                    │    │
│  │  • HTTPS with ACM certificate (us-east-1)                               │    │
│  │  • Gzip/Brotli compression                                              │    │
│  │  • Cache behaviors:                                                      │    │
│  │    - /index.html: no-cache (always fresh)                               │    │
│  │    - /assets/*: 1 year cache (hashed filenames)                         │    │
│  │  • Custom error responses: 403/404 → /index.html (SPA routing)          │    │
│  │  • Security headers via response headers policy                          │    │
│  │                                                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           S3 Bucket                                      │    │
│  │                                                                          │    │
│  │  • Origin for CloudFront (OAC - Origin Access Control)                  │    │
│  │  • Block all public access (CloudFront only)                            │    │
│  │  • Static website hosting disabled (use CloudFront)                     │    │
│  │  • Versioning enabled                                                    │    │
│  │  • Lifecycle rules for old versions                                     │    │
│  │                                                                          │    │
│  │  Contents:                                                               │    │
│  │  ├── index.html                                                         │    │
│  │  ├── assets/                                                            │    │
│  │  │   ├── main.[hash].js                                                 │    │
│  │  │   ├── main.[hash].css                                                │    │
│  │  │   └── images/                                                        │    │
│  │  └── favicon.ico                                                        │    │
│  │                                                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Web Resources by Environment

| Resource | PR Preview | Staging | Production |
|----------|------------|---------|------------|
| **S3 Bucket** | pr-{number}-connect2-web | connect2-web-staging | connect2-web-prod |
| **CloudFront** | Dedicated distribution | Dedicated distribution | Dedicated distribution |
| **Domain** | pr-{number}.app.connect.com | app-staging.connect.com | app.connect.com |
| **API URL** | api-staging.connect.com | api-staging.connect.com | api.connect.com |
| **Lifecycle** | Ephemeral (auto-cleanup) | Persistent | Persistent |
| **Price Class** | PriceClass_100 | PriceClass_100 | PriceClass_All |

### Web Terraform Modules

```
infrastructure/terraform/modules/
├── s3-website/          # S3 bucket with OAC policy
├── cloudfront/          # CloudFront distribution
├── acm/                 # SSL certificate (us-east-1)
├── dns-record/          # Route53 records
└── pr-preview/          # PR preview infrastructure
```

### ACM Certificate Requirement

**Important:** CloudFront requires ACM certificates in `us-east-1` regardless of where other resources are deployed.

```hcl
# Certificate must be in us-east-1 for CloudFront
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

module "acm_certificate" {
  source = "../modules/acm"
  providers = {
    aws = aws.us_east_1
  }
  domain_name = "app.connect.com"
}
```

---

## PR Preview Infrastructure

PR previews provide ephemeral environments for QA testing.

### How It Works

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           PR PREVIEW WORKFLOW                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  1. Developer opens PR                                                        │
│     │                                                                         │
│     ▼                                                                         │
│  2. GitHub Action triggers (deploy-pr-preview.yml)                           │
│     │                                                                         │
│     ├──► Build React app with VITE_API_URL=https://api-staging.connect.com  │
│     │                                                                         │
│     ├──► Create S3 bucket: pr-{PR_NUMBER}-connect2-web                       │
│     │                                                                         │
│     ├──► Create CloudFront distribution                                       │
│     │                                                                         │
│     ├──► Create DNS record: pr-{PR_NUMBER}.app.connect.com                   │
│     │                                                                         │
│     └──► Comment on PR with preview URL                                       │
│                                                                               │
│  3. QA tests against preview environment                                      │
│     • Frontend: pr-{PR_NUMBER}.app.connect.com                               │
│     • API: api-staging.connect.com (shared)                                  │
│                                                                               │
│  4. PR merged or closed                                                       │
│     │                                                                         │
│     ▼                                                                         │
│  5. Cleanup workflow triggers (cleanup-pr-preview.yml)                        │
│     │                                                                         │
│     ├──► Delete S3 bucket and contents                                       │
│     │                                                                         │
│     ├──► Delete CloudFront distribution                                       │
│     │                                                                         │
│     └──► Delete DNS record                                                    │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### PR Preview Configuration

| Setting | Value |
|---------|-------|
| **Bucket naming** | `pr-{PR_NUMBER}-connect2-web` |
| **Domain** | `pr-{PR_NUMBER}.app.connect.com` |
| **API endpoint** | `https://api-staging.connect.com` |
| **Auto-cleanup** | On PR merge or close |
| **CloudFront price class** | `PriceClass_100` (US, Canada, Europe only) |
| **Cache invalidation** | On each push to PR branch |

### Why PR Previews Use Staging API

PR preview environments are **frontend-only**. They connect to the staging API because:

1. **Cost efficiency** — No need for separate API infrastructure per PR
2. **Shared test data** — QA can use consistent staging data
3. **Faster setup** — No database provisioning delay
4. **Simpler cleanup** — Only static assets to remove

**Note:** PR previews share the staging database. QA should be aware that test data may be modified by multiple PR previews simultaneously.

---

## Communication Between Services

```
┌─────────────────────┐                     ┌─────────────────────┐
│      Web App        │                     │        API          │
│                     │                     │                     │
│  app.connect.com    │────── HTTPS ───────►│  api.connect.com    │
│                     │                     │                     │
│  (S3 + CloudFront)  │                     │  (ECS Fargate)      │
└─────────────────────┘                     └─────────────────────┘
```

### Environment URL Mapping

| Environment | Web URL | API URL |
|-------------|---------|---------|
| PR Preview | pr-{number}.app.connect.com | api-staging.connect.com |
| Staging | app-staging.connect.com | api-staging.connect.com |
| Production | app.connect.com | api.connect.com |

### CORS Configuration

The API must allow requests from all Web domains:

```python
# FastAPI CORS configuration
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "https://app.connect.com",
    "https://app-staging.connect.com",
    "https://*.app.connect.com",  # PR previews
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## CI/CD Pipelines

### API Pipeline

```
Push to staging ──► CI (lint, test, type-check) ──► Build Docker ──► Push ECR ──► Update ECS
Push to main    ──► CI (lint, test, type-check) ──► Build Docker ──► Push ECR ──► Update ECS
```

### Web Pipeline

```
Push to staging ──► CI (lint, test, build) ──► Upload S3 ──► Invalidate CloudFront
Push to main    ──► CI (lint, test, build) ──► Upload S3 ──► Invalidate CloudFront
Open PR         ──► CI (lint, test, build) ──► Create S3/CloudFront ──► Comment URL
Close/Merge PR  ──► Cleanup S3/CloudFront/DNS
```

### GitHub Actions Workflows

**API Workflows:**
```
.github/workflows/
├── ci.yml                  # Lint, test, type-check
├── deploy-staging.yml      # Deploy to staging ECS
├── deploy-prod.yml         # Deploy to production ECS
└── terraform.yml           # Infrastructure changes
```

**Web Workflows:**
```
.github/workflows/
├── ci.yml                  # Lint, test, build
├── deploy-staging.yml      # Deploy to staging S3/CloudFront
├── deploy-prod.yml         # Deploy to production S3/CloudFront
├── deploy-pr-preview.yml   # Create PR preview environment
├── cleanup-pr-preview.yml  # Destroy PR preview on close
└── terraform.yml           # Infrastructure changes
```

---

## Cost Comparison

### Web Hosting: S3 + CloudFront vs ECS Fargate

| Cost Factor | S3 + CloudFront | ECS Fargate |
|-------------|-----------------|-------------|
| **Compute** | $0 | ~$30-100/month |
| **Storage** | ~$0.50/month | Included |
| **Data Transfer** | ~$5-15/month | ~$10-30/month |
| **Load Balancer** | $0 | ~$20/month |
| **Total (Staging)** | **~$5-15/month** | **~$60-150/month** |
| **Total (Production)** | **~$15-30/month** | **~$100-300/month** |

**Annual Savings:** ~$1,500-3,500/year by using S3 + CloudFront

### Performance Comparison

| Metric | S3 + CloudFront | ECS Fargate |
|--------|-----------------|-------------|
| **TTFB** | ~20-50ms (edge) | ~100-300ms |
| **Global latency** | Consistent <100ms | Varies by region |
| **Cold start** | None | Container startup |
| **Scaling** | Automatic, instant | Auto-scaling rules |

---

## Security

### Web Security (S3 + CloudFront)

1. **S3 Bucket Policy**
   - Block all public access
   - Allow only CloudFront OAC

2. **CloudFront Security**
   - HTTPS only (redirect HTTP)
   - TLS 1.2+ minimum
   - Security headers policy:
     - X-Content-Type-Options: nosniff
     - X-Frame-Options: DENY
     - X-XSS-Protection: 1; mode=block
     - Strict-Transport-Security: max-age=31536000

3. **Content Security**
   - Signed URLs/cookies (if needed)
   - Geographic restrictions (optional)

### API Security (ECS Fargate)

1. **Network Isolation**
   - ECS tasks in private subnets
   - No public IP addresses
   - NAT gateway for outbound

2. **Load Balancer**
   - HTTPS only
   - WAF integration (optional)
   - Security groups

3. **Data Protection**
   - RDS encryption at rest
   - Redis encryption in transit
   - Secrets in AWS Secrets Manager

---

## Disaster Recovery

### Web (S3 + CloudFront)

| Component | Recovery Method | RTO |
|-----------|-----------------|-----|
| **S3 Bucket** | Versioning + cross-region replication | Minutes |
| **CloudFront** | Multi-origin failover | Automatic |
| **DNS** | Route53 health checks | Automatic |

### API (ECS Fargate)

| Component | Recovery Method | RTO |
|-----------|-----------------|-----|
| **ECS Service** | Multi-AZ task placement | Automatic |
| **RDS** | Multi-AZ failover | 1-2 minutes |
| **Redis** | Cluster mode | Automatic |

---

## Terraform State Management

Each application maintains separate Terraform state:

| Application | Environment | State Bucket |
|-------------|-------------|--------------|
| **API** | Staging | `connect2-api-terraform-state-staging` |
| **API** | Production | `connect2-api-terraform-state-prod` |
| **Web** | Staging | `connect2-web-terraform-state-staging` |
| **Web** | Production | `connect2-web-terraform-state-prod` |

**Note:** PR preview infrastructure uses the Web staging state bucket with workspace isolation.

---

## Related Documentation

- [Repository Structure](./REPOSITORY_STRUCTURE.md) — Independent repository design
- [System Architecture](./SYSTEM_ARCHITECTURE.md) — High-level system design
- [API Infrastructure](../../api/docs/technical/INFRASTRUCTURE.md) — Detailed API infrastructure
- [Web Infrastructure](../../web/docs/technical/INFRASTRUCTURE.md) — Detailed Web infrastructure
- [API GitHub Actions](../../api/docs/technical/GITHUB_ACTIONS.md) — API CI/CD workflows
- [Web GitHub Actions](../../web/docs/technical/GITHUB_ACTIONS.md) — Web CI/CD workflows
