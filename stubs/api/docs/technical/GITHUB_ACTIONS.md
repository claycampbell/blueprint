# GitHub Actions CI/CD Documentation

**Version:** 2.0
**Last Updated:** January 2026
**Related Documents:** [INFRASTRUCTURE.md](INFRASTRUCTURE.md), [SYSTEM_ARCHITECTURE.md](../../docs/architecture/SYSTEM_ARCHITECTURE.md)

---

## Overview

This project uses GitHub Actions for continuous integration and deployment:

- **CI (Continuous Integration):** Automated testing on every PR and push
- **CD (Continuous Deployment):** Automated deployments to AWS environments

### Independent Infrastructure

The Connect 2.0 API is a **standalone repository** with its own complete infrastructure:

| Component | Resource Name |
|-----------|---------------|
| **ECS Cluster** | `connect2-api-cluster-{env}` |
| **ECS Service** | `connect2-api-service-{env}` |
| **ECR Repository** | `connect2-api-{env}` |
| **VPC** | `10.1.0.0/16` (dedicated API network) |
| **ALB** | `api.connect.com` / `api-{env}.connect.com` |
| **Terraform State** | `connect2-api-terraform-state-{env}` |

This repository owns all its infrastructure—no dependencies on external resources or shared state.

---

## Workflows

### CI Workflow (`ci.yml`)

**Triggers:**
- Pull requests to `main`, `staging`, `development`
- Push to `main`, `staging`, `development`

**Jobs:**

| Job | Description | Commands |
|-----|-------------|----------|
| `lint` | Ruff code quality | `uv run ruff check .` |
| `type-check` | MyPy validation | `uv run mypy app` |
| `test` | Run test suite with PostgreSQL/Redis | `uv run pytest` |
| `build` | Docker image build | `docker build` |

All jobs run in parallel for faster feedback. The `build` job runs after all checks pass.

---

### Deploy to Dev (`deploy-dev.yml`)

**Triggers:**
- Push to `development` branch
- Manual dispatch

**What it does:**
1. Builds Docker image from `infrastructure/docker/Dockerfile`
2. Tags with commit SHA and `latest`
3. Pushes to ECR (`connect2-api-dev`)
4. Updates ECS service to trigger rolling deployment
5. Waits for deployment to stabilize

**Environment:** `development`

---

### Deploy to Staging (`deploy-staging.yml`)

**Triggers:**
- Push to `staging` branch
- Manual dispatch

**What it does:**
1. Builds Docker image
2. Tags with commit SHA and `latest`
3. Pushes to ECR (`connect2-api-staging`)
4. Updates ECS service
5. Waits for deployment to stabilize

**Environment:** `staging`

---

### Deploy to Production (`deploy-prod.yml`)

**Triggers:**
- Push to `main` branch
- Manual dispatch

**What it does:**
1. **Runs full test suite first** (lint, type-check, test)
2. Builds Docker image
3. Tags with commit SHA, `latest`, and version number
4. Pushes to ECR (`connect2-api-prod`)
5. Updates ECS service
6. Waits for deployment to stabilize
7. Creates GitHub Release with version tag

**Environment:** `production` (can require approval)

---

### Terraform Infrastructure (`terraform.yml`)

**Triggers:**
- Pull requests with changes to `infrastructure/terraform/**`
- Push to branches with changes to `infrastructure/terraform/**`
- Manual dispatch with environment selection

**On Pull Request:**
- Runs `terraform plan`
- Comments plan output on the PR

**On Push (merge):**
- Runs `terraform apply -auto-approve`

**Branch → Environment Mapping:**
- `development` → `dev`
- `staging` → `staging`
- `main` → `prod`

---

## Branch Strategy

```
development ──────────────────────────────► Dev Environment
     │
     └──► PR to staging
              │
              ▼
staging ──────────────────────────────────► Staging Environment
     │
     └──► PR to main
              │
              ▼
main ─────────────────────────────────────► Production Environment
```

### Workflow

1. **Feature Development:**
   - Create feature branch from `development`
   - Push changes (CI runs)
   - Create PR to `development`
   - Merge after review → deploys to Dev

2. **Staging Release:**
   - Create PR from `development` to `staging`
   - Review and merge → deploys to Staging

3. **Production Release:**
   - Create PR from `staging` to `main`
   - Review and merge → deploys to Production
   - GitHub Release created automatically

---

## Required Secrets

Configure these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |

### IAM Permissions Required

The AWS credentials need these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTasks"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::connect2-api-terraform-state-*",
        "arn:aws:s3:::connect2-api-terraform-state-*/*"
      ]
    }
  ]
}
```

---

## Environment Protection (Optional)

For production safety, configure GitHub Environments:

1. Go to **Settings → Environments**
2. Create environment named `production`
3. Configure protection rules:
   - **Required reviewers:** Add team members who must approve
   - **Wait timer:** Optional delay before deployment
   - **Deployment branches:** Restrict to `main` only

---

## Manual Triggers

All deploy workflows support `workflow_dispatch` for manual triggering:

1. Go to **Actions** tab
2. Select the workflow (e.g., "Deploy to Dev")
3. Click **Run workflow**
4. Select branch and click **Run workflow**

The Terraform workflow also allows selecting:
- Environment (`dev`, `staging`, `prod`)
- Action (`plan` or `apply`)

---

## Workflow Files

### API Workflows

```
.github/workflows/
├── ci.yml              # Lint, test, type-check on all branches
├── deploy-dev.yml      # Deploy to dev on push to development
├── deploy-staging.yml  # Deploy to staging on push to staging
├── deploy-prod.yml     # Deploy to prod on push to main (with tests + GitHub Release)
└── terraform.yml       # Infrastructure changes (VPC, ECS, RDS, Redis, etc.)
```

All workflows are self-contained within this repository. No external workflow dependencies.

---

## Deployment Flow Diagram

```
┌─────────────────┐
│   Push Code     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    CI Workflow  │
│  (lint, test,   │
│   type-check,   │
│     build)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Deploy Workflow │────►│  Build Docker   │
│   (per branch)  │     │     Image       │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   Push to ECR   │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Update ECS     │
                        │    Service      │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ Rolling Deploy  │
                        │ (zero downtime) │
                        └─────────────────┘
```

---

## Best Practices

### ⚠️ Separate Infrastructure and Code PRs

**Never mix infrastructure changes and application code in the same PR.**

| PR Type | Contains | Examples |
|---------|----------|----------|
| **Code PR** | FastAPI routes, models, services | `feat: add user endpoint` |
| **Infrastructure PR** | Terraform, Docker, GitHub Actions | `infra: add Redis cache` |

**Why?**
- **Clean rollbacks** - revert code without affecting infrastructure
- **Easier reviews** - reviewers can focus on one type of change
- **Simpler debugging** - know exactly what changed if issues arise
- **Independent timing** - infrastructure may need to deploy before code

**When a feature needs both:**
```
1. PR #1: "infra: Add ElastiCache Redis cluster" → merge, wait for deploy
2. PR #2: "feat: Use Redis for session caching" → merge
```

### Commit Messages

Use conventional commits for clear history:
```
feat: add user authentication endpoint
fix: resolve database connection timeout
infra: add Redis cache cluster
docs: update API documentation
chore: upgrade FastAPI to 0.109
```

### Branch Naming

```
feature/add-user-endpoint
bugfix/fix-auth-token
hotfix/security-patch
infra/add-redis-cache
```

### Pull Request Process

1. Create PR with descriptive title
2. **Verify it's either code OR infrastructure, not both**
3. Wait for CI to pass
4. Request review from team member
5. Address feedback
6. Merge when approved

---

## Troubleshooting

### CI Failing

**Lint errors:**
```bash
uv run ruff check . --fix  # Auto-fix issues locally
```

**Type errors:**
```bash
uv run mypy app            # Check types locally
```

**Test failures:**
```bash
uv run pytest -v           # Run tests locally
```

### Deployment Failing

**ECR Push fails:**
- Check AWS credentials are correct
- Verify ECR repository exists
- Check IAM permissions

**ECS Update fails:**
- Verify cluster and service names match
- Check service exists in the target environment
- Review CloudWatch logs for container errors

**Terraform fails:**
- Check S3 bucket for state exists
- Verify AWS credentials have Terraform permissions
- Run `terraform plan` locally to debug

### Viewing Logs

**GitHub Actions logs:**
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Expand the failed step

**AWS logs:**
```bash
# View ECS task logs
aws logs tail /ecs/connect2-api-dev --follow

# View specific deployment
aws ecs describe-services \
  --cluster connect2-api-cluster-dev \
  --services connect2-api-service-dev

# Check ECS cluster status
aws ecs describe-clusters --clusters connect2-api-cluster-dev
```

---

## Related Documentation

- [Infrastructure Documentation](./INFRASTRUCTURE.md)
- [Deployment Runbook](../runbooks/DEPLOYMENT.md)
- [Rollback Runbook](../runbooks/ROLLBACK.md)
