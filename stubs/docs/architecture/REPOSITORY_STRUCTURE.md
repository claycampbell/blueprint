# Repository Structure & Infrastructure Architecture

**Last Updated:** January 2026

---

## Overview

This document describes the polyglot repository structure for Connect 2.0, which contains both the API (FastAPI) and Web (React) applications in a single Git repository with independent deployments.

**Key Principles:**
- Single repository, multiple applications
- Independent deployments per application
- Shared infrastructure for networking and compute cluster
- Path-based CI/CD triggers
- Granular rollback capability per service

---

## Repository Structure

```
connect2/
├── api/                              # FastAPI Backend
│   ├── .github/workflows/
│   │   ├── ci.yml                    # Lint, test, type-check
│   │   ├── deploy-dev.yml            # Deploy to dev on merge
│   │   ├── deploy-staging.yml        # Deploy to staging
│   │   └── deploy-prod.yml           # Deploy to production
│   ├── app/                          # Application code
│   ├── docs/
│   │   ├── runbooks/
│   │   │   ├── DEPLOYMENT.md
│   │   │   └── ROLLBACK.md           # API-specific rollback procedures
│   │   └── technical/
│   │       ├── API_QUICKSTART.md
│   │       └── BACKEND_ARCHITECTURE.md
│   ├── infrastructure/
│   │   └── terraform/
│   │       ├── environments/
│   │       │   ├── dev/main.tf
│   │       │   ├── staging/main.tf
│   │       │   └── prod/main.tf
│   │       └── modules/              # API-specific modules only
│   │           ├── rds/              # PostgreSQL database
│   │           ├── elasticache/      # Redis cache
│   │           └── bastion/          # DB access host
│   ├── migrations/                   # Alembic migrations
│   ├── scripts/
│   │   └── rollback.sh               # One-command API rollback
│   ├── tests/
│   ├── Dockerfile
│   └── README.md
│
├── web/                              # React Frontend
│   ├── .github/workflows/
│   │   ├── ci.yml
│   │   ├── deploy-dev.yml
│   │   ├── deploy-staging.yml
│   │   └── deploy-prod.yml
│   ├── src/                          # Application code
│   ├── docs/
│   │   ├── runbooks/
│   │   │   ├── DEPLOYMENT.md
│   │   │   └── ROLLBACK.md           # Web-specific rollback procedures
│   │   └── technical/
│   │       ├── APP_QUICKSTART.md
│   │       └── FRONTEND_ARCHITECTURE.md
│   ├── infrastructure/
│   │   └── terraform/
│   │       ├── environments/
│   │       │   ├── dev/main.tf
│   │       │   ├── staging/main.tf
│   │       │   └── prod/main.tf
│   │       └── modules/              # Web-specific modules (if any)
│   ├── scripts/
│   │   └── rollback.sh               # One-command web rollback
│   ├── tests/
│   ├── Dockerfile
│   └── README.md
│
├── infrastructure/                   # Shared Infrastructure
│   ├── .github/workflows/
│   │   └── deploy-shared.yml         # Manual trigger, rarely run
│   ├── terraform/
│   │   ├── environments/
│   │   │   ├── dev/main.tf
│   │   │   ├── staging/main.tf
│   │   │   └── prod/main.tf
│   │   └── modules/
│   │       ├── networking/           # VPC, subnets, NAT gateway
│   │       ├── ecs-cluster/          # Shared Fargate cluster
│   │       ├── route53-zone/         # DNS hosted zone
│   │       ├── sns-alerts/           # Shared alert topics
│   │       ├── alb/                  # Reusable ALB module
│   │       ├── ecs-service/          # Reusable ECS service module
│   │       ├── acm/                  # Reusable certificate module
│   │       └── dns-record/           # Reusable Route53 record module
│   ├── docs/
│   │   ├── INFRASTRUCTURE_OVERVIEW.md
│   │   ├── TERRAFORM_GUIDE.md
│   │   └── runbooks/
│   │       └── SHARED_INFRA_ROLLBACK.md
│   └── scripts/
│       └── rollback.sh               # Shared infra rollback (wraps git revert)
│
├── scripts/                          # Repository-wide scripts
│   ├── rollback-all.sh               # Wrapper to rollback all services
│   └── generate-types.sh             # Generate TS types from OpenAPI
│
├── docs/                             # Cross-cutting documentation
│   ├── standards/
│   │   ├── git-standards.md
│   │   ├── cicd-and-release.md
│   │   └── observability-and-operations.md
│   ├── security/
│   │   └── SECURITY_COMPLIANCE.md
│   ├── architecture/
│   │   ├── TECH_STACK_DECISIONS.md
│   │   ├── BPO_CONNECT_ARCHITECTURE_DECISION.md
│   │   └── REPOSITORY_STRUCTURE.md   # This document
│   └── development/
│       ├── DEVELOPMENT_GUIDE.md
│       ├── CODE_REVIEW_GUIDELINES.md
│       └── PRE_COMMIT_HOOKS.md
│
├── .github/
│   └── workflows/
│       └── pr-checks.yml             # Shared PR validation
│
├── docker-compose.yml                # Local development
├── CLAUDE.md                         # AI assistant instructions
└── README.md
```

---

## Domain Architecture

The API and Web applications use separate subdomains:

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
          ▼                               ▼
   api.connect.com                 app.connect.com
          │                               │
          ▼                               ▼
  ┌───────────────┐               ┌───────────────┐
  │   API ALB     │               │   Web ALB     │
  │  (HTTPS:443)  │               │  (HTTPS:443)  │
  └───────┬───────┘               └───────┬───────┘
          │                               │
          ▼                               ▼
  ┌───────────────┐               ┌───────────────┐
  │  API Fargate  │               │  Web Fargate  │
  │   Service     │               │   Service     │
  └───────┬───────┘               └───────────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌───────┐  ┌───────┐
│  RDS  │  │ Redis │
└───────┘  └───────┘
```

**Why separate domains:**
- Third-party API access is cleaner (`api.connect.com` for external integrations)
- Independent rate limiting and WAF rules per domain
- Simpler CORS configuration
- Independent SSL certificates
- Clearer separation of concerns

---

## Infrastructure Ownership

### Shared Infrastructure (`infrastructure/`)

Deployed once per environment, rarely changes. Both API and Web depend on these resources.

| Resource | Purpose |
|----------|---------|
| VPC | Single network for all services |
| Subnets | Public (ALBs) and private (Fargate, RDS) |
| NAT Gateway | Outbound internet for private subnets |
| ECS Cluster | Logical grouping for Fargate services |
| Route53 Hosted Zone | DNS zone for `connect.com` |
| SNS Topics | Shared alerting for on-call team |

### API Infrastructure (`api/infrastructure/`)

API-specific resources that only the API service needs.

| Resource | Purpose |
|----------|---------|
| ALB | Load balancer for `api.connect.com` |
| ACM Certificate | SSL cert for `api.connect.com` |
| Route53 A Record | Points `api.connect.com` to API ALB |
| ECS Service | API Fargate service definition |
| ECS Task Definition | API container configuration |
| RDS PostgreSQL | Primary database |
| ElastiCache Redis | Caching and sessions |
| Bastion Host | Secure database access |
| Security Groups | API-specific network rules |
| CloudWatch Logs/Alarms | API monitoring and alerts |

### Web Infrastructure (`web/infrastructure/`)

Web-specific resources that only the Web application needs.

| Resource | Purpose |
|----------|---------|
| ALB | Load balancer for `app.connect.com` |
| ACM Certificate | SSL cert for `app.connect.com` |
| Route53 A Record | Points `app.connect.com` to Web ALB |
| ECS Service | Web Fargate service definition |
| ECS Task Definition | Web container configuration |
| Security Groups | Web-specific network rules |
| CloudWatch Logs/Alarms | Web monitoring and alerts |

---

## How App Terraform Uses Shared Infrastructure

Each application's Terraform reads outputs from the shared infrastructure state:

```hcl
# api/infrastructure/terraform/environments/prod/main.tf

data "terraform_remote_state" "shared" {
  backend = "s3"
  config = {
    bucket = "connect2-terraform-state-prod"
    key    = "shared/terraform.tfstate"
    region = "us-west-2"
  }
}

# Use shared VPC and cluster
module "ecs_service" {
  source = "../../modules/ecs-service"

  cluster_arn        = data.terraform_remote_state.shared.outputs.ecs_cluster_arn
  vpc_id             = data.terraform_remote_state.shared.outputs.vpc_id
  private_subnet_ids = data.terraform_remote_state.shared.outputs.private_subnet_ids
  public_subnet_ids  = data.terraform_remote_state.shared.outputs.public_subnet_ids
  # ...
}
```

---

## Terraform State Organization

All state files are stored in a single S3 bucket per environment with versioning enabled:

| Bucket | State Key | Contains |
|--------|-----------|----------|
| `connect2-terraform-state-dev` | `shared/terraform.tfstate` | VPC, cluster, Route53 zone |
| `connect2-terraform-state-dev` | `api/terraform.tfstate` | API ALB, RDS, Redis, ECS service |
| `connect2-terraform-state-dev` | `web/terraform.tfstate` | Web ALB, ECS service |

Same pattern for `staging` and `prod` buckets.

---

## CI/CD: Path-Based Deployments

GitHub Actions workflows trigger based on which paths changed in a PR:

```yaml
# api/.github/workflows/deploy-prod.yml
on:
  push:
    branches: [main]
    paths:
      - 'api/**'
      - '!api/docs/**'

# web/.github/workflows/deploy-prod.yml
on:
  push:
    branches: [main]
    paths:
      - 'web/**'
      - '!web/docs/**'

# infrastructure/.github/workflows/deploy-shared.yml
on:
  workflow_dispatch:  # Manual trigger only
  push:
    branches: [main]
    paths:
      - 'infrastructure/**'
```

### Deployment Scenarios

| PR Contains | Workflows Triggered | Result |
|-------------|---------------------|--------|
| `api/` only | `deploy-api` | 1 deployment |
| `web/` only | `deploy-web` | 1 deployment |
| `api/` + `web/` | Both | 2 parallel deployments |
| `infrastructure/` | `deploy-shared` | 1 deployment (manual approval) |
| `api/` + `infrastructure/` | Both | 2 deployments |
| All three | All three | 3 deployments |

---

## Rollback Strategy

### Rollback Commands

Each service has its own one-command rollback script:

| Situation | Command |
|-----------|---------|
| API broke | `./api/scripts/rollback.sh prod` |
| Web broke | `./web/scripts/rollback.sh prod` |
| Both broke | `./scripts/rollback-all.sh prod` |
| Shared infra broke | `git revert -m 1 <sha> && git push` |

### Individual Service Rollback

```bash
# api/scripts/rollback.sh
#!/bin/bash
set -euo pipefail

ENV=${1:-prod}
SERVICE="connect2-api-${ENV}"
CLUSTER="connect2-cluster-${ENV}"

echo "Finding previous task definition for ${SERVICE}..."

# Get the second-most-recent task definition (the one before current)
PREV_TASK_DEF=$(aws ecs list-task-definitions \
  --family-prefix "${SERVICE}" \
  --sort DESC \
  --max-items 2 \
  --query 'taskDefinitionArns[1]' \
  --output text)

if [ "$PREV_TASK_DEF" == "None" ] || [ -z "$PREV_TASK_DEF" ]; then
  echo "ERROR: No previous task definition found to rollback to."
  exit 1
fi

echo "Rolling back to: ${PREV_TASK_DEF}"

aws ecs update-service \
  --cluster "${CLUSTER}" \
  --service "${SERVICE}" \
  --task-definition "${PREV_TASK_DEF}" \
  --force-new-deployment

echo "Waiting for service to stabilize..."
aws ecs wait services-stable \
  --cluster "${CLUSTER}" \
  --services "${SERVICE}"

echo "Rollback complete. Service ${SERVICE} is now running ${PREV_TASK_DEF}"
echo ""
echo "IMPORTANT: Create a revert PR to keep Git history accurate:"
echo "  git revert -m 1 <merge-commit-sha>"
echo "  git push origin main"
```

### Coordinated Rollback (All Services)

```bash
# scripts/rollback-all.sh
#!/bin/bash
set -euo pipefail

ENV=${1:-prod}

echo "============================================"
echo "Rolling back ALL services in ${ENV}"
echo "============================================"
echo ""

echo "[1/2] Rolling back API..."
./api/scripts/rollback.sh "${ENV}"
echo ""

echo "[2/2] Rolling back Web..."
./web/scripts/rollback.sh "${ENV}"
echo ""

echo "============================================"
echo "All services rolled back in ${ENV}"
echo "============================================"
echo ""
echo "If shared infrastructure also needs rollback:"
echo "  git revert -m 1 <commit-sha>"
echo "  git push origin main"
echo "  # Wait for terraform apply workflow"
```

### Rollback Decision Matrix

| Symptom | Likely Cause | Rollback Action |
|---------|--------------|-----------------|
| API 5xx errors after deploy | Bad API code | `./api/scripts/rollback.sh` |
| Web errors after deploy | Bad web code | `./web/scripts/rollback.sh` |
| API can't reach database | Infra change (SG, VPC) | Check infra PR, possibly `git revert` |
| Both apps broken | Shared infra or coordinated deploy | `./scripts/rollback-all.sh` + investigate |
| DNS not resolving | Route53 change | `git revert` the infra PR |
| SSL certificate errors | ACM change | Wait (propagation) or `git revert` |

### Why Shared Infrastructure Rollback is Different

Shared infrastructure rollback requires `git revert` rather than a script because:

1. **Terraform state** - Infrastructure rollback requires `terraform apply` with the previous configuration, not just pointing to a previous version
2. **Blast radius** - Rolling back VPC or cluster affects both apps simultaneously
3. **Safety** - Human review is important before rolling back networking
4. **Rarity** - Shared infrastructure should change infrequently

---

## ECS Architecture Clarification

A common point of confusion:

| Term | What It Is | Shared? |
|------|------------|---------|
| **ECR** | Docker image registry (stores images) | One registry, multiple repositories |
| **ECS Cluster** | Logical grouping of services | Yes - one cluster, multiple services |
| **ECS Service** | Manages running tasks for one app | No - one per app |
| **ECS Task Definition** | Container blueprint (image, CPU, memory) | No - one per app |
| **Fargate Task** | Running container instance | No - belongs to a service |

```
┌─────────────────────────────────────────────────────────────┐
│                    ECR (Registry)                           │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ connect2-api    │    │ connect2-web    │                │
│  │ :abc123, :latest│    │ :def456, :latest│                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              │
                    pulls images
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              ECS Cluster (shared)                           │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────┐        │
│  │ Service: api        │    │ Service: web        │        │
│  │ ┌─────┐ ┌─────┐    │    │ ┌─────┐ ┌─────┐    │        │
│  │ │Task │ │Task │    │    │ │Task │ │Task │    │        │
│  │ └─────┘ └─────┘    │    │ └─────┘ └─────┘    │        │
│  └─────────────────────┘    └─────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## Migration from Current Structure

If migrating from separate VPCs per app to shared infrastructure:

### Phase 1: Create Shared Infrastructure
1. Deploy `infrastructure/terraform/environments/{env}/`
2. Creates new shared VPC, cluster, Route53 zone
3. Old infrastructure remains running

### Phase 2: Migrate API
1. Update `api/infrastructure/` to use remote state from shared
2. Remove networking module from API terraform
3. Deploy - API moves to shared VPC
4. Verify API works

### Phase 3: Migrate Web
1. Update `web/infrastructure/` to use remote state from shared
2. Remove networking module from Web terraform
3. Deploy - Web moves to shared VPC
4. Verify Web works

### Phase 4: Cleanup
1. Destroy old VPCs (now empty)
2. Remove duplicate modules
3. Update documentation

---

## Related Documentation

- [Git Standards](./standards/git-standards.md) - Branching, commits, PRs
- [CI/CD & Release](./standards/cicd-and-release.md) - Deployment pipeline, rollback requirements
- [Observability & Operations](./standards/observability-and-operations.md) - Logging, metrics, incident response
- [Tech Stack Decisions](./architecture/TECH_STACK_DECISIONS.md) - Technology choices
- [Security Compliance](./security/SECURITY_COMPLIANCE.md) - Security requirements
