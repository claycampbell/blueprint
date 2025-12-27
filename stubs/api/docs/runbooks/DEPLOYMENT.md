# API Deployment Procedures

**Last Updated:** December 2025

---

## Overview

This runbook covers standard deployment procedures for the Connect 2.0 API.

---

## Deployment Flow

```
Feature Branch → development → staging → main (production)
```

| Branch | Environment | Deployment | Approval Required |
|--------|-------------|------------|-------------------|
| `development` | Dev | Automatic on merge | No |
| `staging` | Staging | Automatic on merge | No |
| `main` | Production | Automatic on merge | Yes (recommended) |

---

## PR Guidelines

### ⚠️ Important: Separate Infrastructure and Code PRs

**Never mix infrastructure changes and application code in the same PR.**

**Why:**
- Clean rollbacks - revert one without affecting the other
- Easier code review - reviewers can focus on one type of change
- Simpler debugging - know exactly what changed if issues arise
- Independent deployment timing - infrastructure may need to deploy first

**Examples:**

✅ **Good:**
- PR #1: "Add user authentication endpoint" (code only)
- PR #2: "Add Redis cache for sessions" (infrastructure only)

❌ **Bad:**
- PR #1: "Add user authentication with Redis cache" (mixed)

### PR Types

**Application Code PRs:**
- FastAPI routes and controllers
- Pydantic models and schemas
- Service layer logic
- Tests
- Documentation (non-infrastructure)

**Infrastructure PRs:**
- Terraform modules and environments
- Docker configuration
- GitHub Actions workflows
- Database migrations (schema changes)

---

## Standard Deployment Process

### 1. Deploy to Development

```bash
# Create feature branch
git checkout development
git pull origin development
git checkout -b feature/my-feature

# Make changes, commit
git add .
git commit -m "feat: add new endpoint"

# Push and create PR
git push -u origin feature/my-feature
```

1. Create PR to `development`
2. Wait for CI to pass (lint, test, type-check)
3. Get code review approval
4. Merge PR
5. GitHub Actions deploys to Dev automatically

**Verify:**
- Check GitHub Actions completed successfully
- Test the API in Dev environment
- Check CloudWatch logs for errors

### 2. Promote to Staging

```bash
# Create PR from development to staging
gh pr create --base staging --head development --title "Release to staging"
```

1. Create PR from `development` to `staging`
2. Review changes included in release
3. Merge PR
4. GitHub Actions deploys to Staging automatically

**Verify:**
- Run integration tests on Staging
- QA sign-off if required
- Test database migrations

### 3. Deploy to Production

```bash
# Create PR from staging to main
gh pr create --base main --head staging --title "Production release"
```

1. Create PR from `staging` to `main`
2. Review changes carefully
3. Get required approvals
4. Merge PR
5. GitHub Actions deploys to Production
6. GitHub Release created automatically

**Verify:**
- Monitor CloudWatch for errors
- Check application health endpoint
- Verify key API endpoints work
- Monitor database performance

---

## Database Migrations

### Running Migrations

Migrations are run manually via ECS Exec or bastion host:

**Via ECS Exec:**
```bash
# Get task ARN
TASK_ARN=$(aws ecs list-tasks \
  --cluster connect2-api-cluster-dev \
  --service-name connect2-api-service-dev \
  --query 'taskArns[0]' --output text)

# Run migration
aws ecs execute-command \
  --cluster connect2-api-cluster-dev \
  --task $TASK_ARN \
  --container connect2-api \
  --interactive \
  --command "alembic upgrade head"
```

**Via Bastion:**
```bash
# SSH to bastion
ssh -i key.pem ec2-user@<bastion-ip>

# Run migration (requires app code on bastion)
cd /app
alembic upgrade head
```

### Migration Workflow

1. **Create migration in feature branch:**
   ```bash
   alembic revision --autogenerate -m "Add users table"
   ```

2. **Test migration locally:**
   ```bash
   alembic upgrade head
   alembic downgrade -1
   alembic upgrade head
   ```

3. **Deploy infrastructure PR first (if needed)**

4. **Deploy code PR**

5. **Run migration in each environment:**
   - Dev → Staging → Production
   - Verify after each environment

---

## Infrastructure Deployment

### Terraform Changes

1. **Make changes in feature branch:**
   ```bash
   git checkout -b infra/add-redis-cache
   # Edit infrastructure/terraform/...
   ```

2. **Create PR:**
   - PR triggers `terraform plan`
   - Plan output posted as PR comment
   - Review the plan carefully

3. **Merge PR:**
   - Triggers `terraform apply`
   - Infrastructure updated

4. **Verify:**
   - Check Terraform workflow completed
   - Verify resources in AWS Console

### Infrastructure Before Code

When a feature requires both infrastructure and code changes:

1. **First:** Create and merge infrastructure PR
2. **Wait:** Verify infrastructure is deployed
3. **Then:** Create and merge code PR

Example sequence:
```
Day 1: PR "Add ElastiCache Redis cluster" (infra) → merge
Day 1: Verify Redis is running in AWS
Day 1: PR "Use Redis for session caching" (code) → merge
```

---

## Manual Deployment

If GitHub Actions is unavailable:

### Deploy Application

```bash
# 1. Build Docker image
docker build -t connect2-api:latest \
  -f infrastructure/docker/Dockerfile \
  --target production \
  .

# 2. Login to ECR
aws ecr get-login-password --region us-west-2 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-west-2.amazonaws.com

# 3. Tag and push
docker tag connect2-api:latest <account-id>.dkr.ecr.us-west-2.amazonaws.com/connect2-api-prod:latest
docker push <account-id>.dkr.ecr.us-west-2.amazonaws.com/connect2-api-prod:latest

# 4. Update ECS service
aws ecs update-service \
  --cluster connect2-api-cluster-prod \
  --service connect2-api-service-prod \
  --force-new-deployment

# 5. Wait for deployment
aws ecs wait services-stable \
  --cluster connect2-api-cluster-prod \
  --services connect2-api-service-prod
```

### Deploy Infrastructure

```bash
cd infrastructure/terraform/environments/prod

terraform init
terraform plan -out=tfplan
# Review plan carefully
terraform apply tfplan
```

---

## Deployment Checklist

### Before Deploying to Production

- [ ] Feature tested in Dev environment
- [ ] Feature tested in Staging environment
- [ ] All CI checks passing
- [ ] Code review approved
- [ ] No mixed infrastructure/code changes
- [ ] Database migrations tested (if applicable)
- [ ] Rollback plan identified
- [ ] No breaking API changes (or version bump)

### After Deploying to Production

- [ ] Deployment completed successfully
- [ ] Health check endpoint passing
- [ ] No errors in CloudWatch logs
- [ ] Key API endpoints verified
- [ ] Database queries performing well
- [ ] Team notified of deployment

---

## Hotfix Process

For urgent production fixes:

1. **Create hotfix branch from `main`:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/fix-critical-bug
   ```

2. **Make minimal fix and push:**
   ```bash
   git add .
   git commit -m "fix: resolve critical bug"
   git push -u origin hotfix/fix-critical-bug
   ```

3. **Create PR directly to `main`:**
   - Get expedited review
   - Merge when approved

4. **Backport to other branches:**
   ```bash
   git checkout staging
   git cherry-pick <hotfix-commit>
   git push origin staging

   git checkout development
   git cherry-pick <hotfix-commit>
   git push origin development
   ```

---

## Related Runbooks

- [Rollback Procedures](./ROLLBACK.md)
- [Incident Response](./INCIDENT_RESPONSE.md)
- [Database Operations](./DATABASE_OPS.md)
