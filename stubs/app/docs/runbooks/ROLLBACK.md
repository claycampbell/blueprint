# Rollback Procedures

**Last Updated:** December 27, 2025

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
   - Verify application is working

### Method 2: Emergency ECS Rollback

Use this when you need to rollback immediately without waiting for a new build.

**Steps:**

1. **List recent task definitions:**
   ```bash
   aws ecs list-task-definitions \
     --family-prefix connect2-app-prod \
     --sort DESC \
     --max-items 5
   ```

2. **Update service to use previous revision:**
   ```bash
   aws ecs update-service \
     --cluster connect2-app-cluster-prod \
     --service connect2-app-service-prod \
     --task-definition connect2-app-prod:<PREVIOUS_REVISION> \
     --force-new-deployment
   ```

3. **Wait for rollback to complete:**
   ```bash
   aws ecs wait services-stable \
     --cluster connect2-app-cluster-prod \
     --services connect2-app-service-prod
   ```

4. **Verify the rollback:**
   ```bash
   aws ecs describe-services \
     --cluster connect2-app-cluster-prod \
     --services connect2-app-service-prod \
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
     --bucket connect2-app-terraform-state-prod \
     --prefix app/terraform.tfstate \
     --query 'Versions[0:5].[VersionId,LastModified]'
   ```

2. **Download previous state:**
   ```bash
   aws s3api get-object \
     --bucket connect2-app-terraform-state-prod \
     --key app/terraform.tfstate \
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

## Rollback Checklist

Before rolling back, confirm:

- [ ] Issue is confirmed and rollback will fix it
- [ ] Team is notified of the rollback
- [ ] You know which commit/PR to revert
- [ ] You have AWS access (for emergency rollback)

After rollback:

- [ ] Verify application is working
- [ ] Monitor logs for errors
- [ ] Create incident report if production was affected
- [ ] Schedule post-mortem if needed

---

## Environment-Specific Commands

### Development
```bash
# ECS
aws ecs update-service \
  --cluster connect2-app-cluster-dev \
  --service connect2-app-service-dev \
  --task-definition connect2-app-dev:<REVISION> \
  --force-new-deployment

# Git
git push origin development
```

### Staging
```bash
# ECS
aws ecs update-service \
  --cluster connect2-app-cluster-staging \
  --service connect2-app-service-staging \
  --task-definition connect2-app-staging:<REVISION> \
  --force-new-deployment

# Git
git push origin staging
```

### Production
```bash
# ECS
aws ecs update-service \
  --cluster connect2-app-cluster-prod \
  --service connect2-app-service-prod \
  --task-definition connect2-app-prod:<REVISION> \
  --force-new-deployment

# Git
git push origin main
```

---

## Common Rollback Scenarios

### Scenario 1: Bad Code Deploy

**Symptoms:** Application errors, broken functionality

**Solution:**
1. Revert the PR: `git revert -m 1 <sha>`
2. Push to branch
3. Wait for deployment

### Scenario 2: Infrastructure Change Broke App

**Symptoms:** App can't connect to resources, security group issues

**Solution:**
1. Revert the infrastructure PR
2. Push to trigger terraform apply
3. May need to manually restart ECS tasks after

### Scenario 3: Database Migration Failed

**Symptoms:** App errors related to DB schema

**Solution:**
1. **Do NOT just revert** - may cause data issues
2. Fix forward with a new migration
3. Or restore database from backup (separate runbook)

### Scenario 4: SSL Certificate Issues

**Symptoms:** HTTPS not working, certificate errors

**Solution:**
1. Check ACM certificate status in AWS Console
2. If DNS validation pending, check Route53 records
3. May take up to 30 minutes for certificate to validate

---

## Related Runbooks

- [Incident Response](./INCIDENT_RESPONSE.md)
- [Database Operations](./DATABASE_OPS.md)
- [Monitoring & Alerts](./MONITORING.md)
