# API Rollback Procedures

**Last Updated:** December 2025

---

## Overview

This runbook covers how to rollback deployments when issues are discovered in production or other environments.

**Key Principle:** Infrastructure changes and application code changes should be in **separate PRs** to enable clean rollbacks.

---

## Quick Reference

| Rollback Type | Method | Time to Complete |
|---------------|--------|------------------|
| Application code | Revert PR + redeploy | ~5-10 minutes |
| Infrastructure | Revert PR + terraform apply | ~5-15 minutes |
| Emergency (app) | Deploy previous ECS task revision | ~2-5 minutes |
| Database migration | Run downgrade migration | ~5-30 minutes |

---

## Application Code Rollback

### Method 1: Revert the PR (Recommended)

This is the cleanest approach - creates an audit trail and triggers a fresh build.

**Steps:**

1. **Identify the bad commit/PR:**
   ```bash
   git log --oneline -10
   ```

2. **Create a revert commit:**
   ```bash
   # Revert a single commit
   git revert <commit-sha>

   # Revert a merge commit (PR)
   git revert -m 1 <merge-commit-sha>
   ```

3. **Push to trigger deployment:**
   ```bash
   git push origin main  # or staging/development
   ```

4. **Monitor the deployment:**
   - Watch GitHub Actions for build/deploy status
   - Check ECS service in AWS Console
   - Verify API is working

### Method 2: Emergency ECS Rollback

Use this when you need to rollback immediately without waiting for a new build.

**Steps:**

1. **List recent task definitions:**
   ```bash
   aws ecs list-task-definitions \
     --family-prefix connect2-api-prod \
     --sort DESC \
     --max-items 5
   ```

2. **Update service to use previous revision:**
   ```bash
   aws ecs update-service \
     --cluster connect2-api-cluster-prod \
     --service connect2-api-service-prod \
     --task-definition connect2-api-prod:<PREVIOUS_REVISION> \
     --force-new-deployment
   ```

3. **Wait for rollback to complete:**
   ```bash
   aws ecs wait services-stable \
     --cluster connect2-api-cluster-prod \
     --services connect2-api-service-prod
   ```

4. **Verify the rollback:**
   ```bash
   aws ecs describe-services \
     --cluster connect2-api-cluster-prod \
     --services connect2-api-service-prod \
     --query 'services[0].deployments'
   ```

**Note:** After emergency rollback, still create a revert PR to keep Git history accurate.

---

## Infrastructure Rollback

### Method 1: Revert the PR (Recommended)

**Steps:**

1. **Identify the infrastructure PR that caused issues**

2. **Create a revert commit:**
   ```bash
   git revert -m 1 <merge-commit-sha>
   ```

3. **Push to trigger Terraform apply:**
   ```bash
   git push origin main
   ```

4. **Monitor Terraform workflow:**
   - Watch GitHub Actions for terraform apply
   - Review the plan output
   - Verify resources are restored

### Method 2: Manual Terraform Rollback

If GitHub Actions is unavailable:

1. **Checkout the previous working commit:**
   ```bash
   git checkout <known-good-commit> -- infrastructure/terraform/
   ```

2. **Run Terraform locally:**
   ```bash
   cd infrastructure/terraform/environments/prod
   terraform init
   terraform plan    # Review changes carefully
   terraform apply
   ```

### Method 3: Restore Terraform State (Last Resort)

Only use if state is corrupted:

1. **List state versions in S3:**
   ```bash
   aws s3api list-object-versions \
     --bucket connect2-api-terraform-state-prod \
     --prefix api/terraform.tfstate \
     --query 'Versions[0:5].[VersionId,LastModified]'
   ```

2. **Download previous state:**
   ```bash
   aws s3api get-object \
     --bucket connect2-api-terraform-state-prod \
     --key api/terraform.tfstate \
     --version-id <version-id> \
     restored-state.tfstate
   ```

3. **Replace current state:**
   ```bash
   # Backup current state first
   terraform state pull > current-state-backup.tfstate

   # Push restored state
   terraform state push restored-state.tfstate
   ```

---

## Database Migration Rollback

### Alembic Downgrade

**Steps:**

1. **Identify current and target revision:**
   ```bash
   # Via ECS Exec
   aws ecs execute-command \
     --cluster connect2-api-cluster-prod \
     --task <task-id> \
     --container connect2-api \
     --interactive \
     --command "alembic history"
   ```

2. **Downgrade to previous revision:**
   ```bash
   aws ecs execute-command \
     --cluster connect2-api-cluster-prod \
     --task <task-id> \
     --container connect2-api \
     --interactive \
     --command "alembic downgrade -1"
   ```

3. **Verify database state:**
   ```bash
   # Connect via bastion
   psql -h <rds-endpoint> -U postgres -d connect2
   \dt  # List tables
   ```

### ⚠️ Important Migration Rollback Considerations

- **Data loss risk:** Downgrade migrations may lose data
- **Test first:** Always test downgrade in staging
- **Point-in-time recovery:** For major issues, consider RDS point-in-time recovery
- **Fix forward:** Sometimes it's better to fix forward with a new migration

---

## Rollback Checklist

Before rolling back, confirm:

- [ ] Issue is confirmed and rollback will fix it
- [ ] Team is notified of the rollback
- [ ] You know which commit/PR to revert
- [ ] You have AWS access (for emergency rollback)
- [ ] Database rollback plan (if applicable)

After rollback:

- [ ] Verify API is working
- [ ] Monitor logs for errors
- [ ] Verify database integrity (if DB was involved)
- [ ] Create incident report if production was affected
- [ ] Schedule post-mortem if needed

---

## Environment-Specific Commands

### Development
```bash
# ECS
aws ecs update-service \
  --cluster connect2-api-cluster-dev \
  --service connect2-api-service-dev \
  --task-definition connect2-api-dev:<REVISION> \
  --force-new-deployment

# Git
git push origin development
```

### Staging
```bash
# ECS
aws ecs update-service \
  --cluster connect2-api-cluster-staging \
  --service connect2-api-service-staging \
  --task-definition connect2-api-staging:<REVISION> \
  --force-new-deployment

# Git
git push origin staging
```

### Production
```bash
# ECS
aws ecs update-service \
  --cluster connect2-api-cluster-prod \
  --service connect2-api-service-prod \
  --task-definition connect2-api-prod:<REVISION> \
  --force-new-deployment

# Git
git push origin main
```

---

## Common Rollback Scenarios

### Scenario 1: Bad Code Deploy

**Symptoms:** API errors, broken endpoints, 500 responses

**Solution:**
1. Revert the PR: `git revert -m 1 <sha>`
2. Push to branch
3. Wait for deployment

### Scenario 2: Infrastructure Change Broke API

**Symptoms:** API can't connect to database, Redis connection errors

**Solution:**
1. Revert the infrastructure PR
2. Push to trigger terraform apply
3. May need to restart ECS tasks after

### Scenario 3: Database Migration Failed

**Symptoms:** API errors related to DB schema, missing columns

**Solution:**
1. **Do NOT just revert code** - may cause data issues
2. Run `alembic downgrade -1` to revert migration
3. Then revert the code PR
4. Or fix forward with a new migration

### Scenario 4: Redis Configuration Issues

**Symptoms:** Caching not working, connection timeouts

**Solution:**
1. Check Redis security groups
2. Check Redis credentials in Secrets Manager
3. Revert infrastructure change if needed
4. Restart ECS tasks to pick up new connections

### Scenario 5: SSL Certificate Issues

**Symptoms:** HTTPS not working, certificate errors

**Solution:**
1. Check ACM certificate status in AWS Console
2. If DNS validation pending, check Route53 records
3. May take up to 30 minutes for certificate to validate

---

## Related Runbooks

- [Deployment Procedures](./DEPLOYMENT.md)
- [Incident Response](./INCIDENT_RESPONSE.md)
- [Database Operations](./DATABASE_OPS.md)
