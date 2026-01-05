# Rollback Procedures

**Last Updated:** January 2026

---

## Overview

This runbook covers how to rollback deployments when issues are discovered in production or other environments.

The Web app is deployed as a static SPA to S3 + CloudFront, making rollbacks straightforward:
- **S3 versioning** enables instant object restoration
- **Git reverts** trigger fresh deployments
- No containers or services to manage

**Key Principle:** Infrastructure changes and application code changes should be in **separate PRs** to enable clean rollbacks.

---

## Quick Reference

| Rollback Type | Method | Time to Complete |
|---------------|--------|------------------|
| Application code | Revert PR + redeploy | ~3-5 minutes |
| Emergency | Restore S3 objects from version | ~1-2 minutes |
| Infrastructure | Revert PR + terraform apply | ~5-10 minutes |

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
   git push origin main  # or staging
   ```

4. **Monitor the deployment:**
   - Watch GitHub Actions for build/deploy status
   - Check CloudFront invalidation completes
   - Verify application is working

### Method 2: Emergency S3 Rollback

Use this when you need to rollback immediately without waiting for a new build.

**Steps:**

1. **List S3 object versions for index.html:**
   ```bash
   aws s3api list-object-versions \
     --bucket connect2-web-prod \
     --prefix index.html \
     --query 'Versions[0:5].[VersionId,LastModified]'
   ```

2. **Restore the previous version:**
   ```bash
   # Copy previous version to current
   aws s3api copy-object \
     --bucket connect2-web-prod \
     --copy-source "connect2-web-prod/index.html?versionId=<PREVIOUS_VERSION_ID>" \
     --key index.html \
     --metadata-directive REPLACE \
     --cache-control "no-cache, no-store, must-revalidate"
   ```

3. **Invalidate CloudFront cache:**
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id <DISTRIBUTION_ID> \
     --paths "/*"
   ```

4. **Verify the rollback:**
   - Check the application loads correctly
   - Verify the issue is resolved

**Note:** After emergency rollback, still create a revert PR to keep Git history accurate.

### Method 3: Full S3 Restore

If multiple files need to be restored:

```bash
# List all versions from a specific time
aws s3api list-object-versions \
  --bucket connect2-web-prod \
  --query 'Versions[?LastModified<=`2025-01-15T00:00:00Z`]'

# For each file, restore to previous version
# This is tedious - prefer Method 1 (Git revert) for full rollbacks
```

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

3. **Don't forget to invalidate CloudFront if distribution changed:**
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id <DISTRIBUTION_ID> \
     --paths "/*"
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
- [ ] Check CloudFront is serving correct content
- [ ] Create incident report if production was affected
- [ ] Schedule post-mortem if needed

---

## Environment-Specific Commands

### Staging

```bash
# Check current S3 contents
aws s3 ls s3://connect2-web-staging/

# List index.html versions
aws s3api list-object-versions \
  --bucket connect2-web-staging \
  --prefix index.html

# Get CloudFront distribution ID
aws cloudfront list-distributions \
  --query "DistributionList.Items[?Comment=='connect2-web-staging'].Id"

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id <STAGING_DIST_ID> \
  --paths "/*"

# Git
git push origin staging
```

### Production

```bash
# Check current S3 contents
aws s3 ls s3://connect2-web-prod/

# List index.html versions
aws s3api list-object-versions \
  --bucket connect2-web-prod \
  --prefix index.html

# Get CloudFront distribution ID
aws cloudfront list-distributions \
  --query "DistributionList.Items[?Comment=='connect2-web-prod'].Id"

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id <PROD_DIST_ID> \
  --paths "/*"

# Git
git push origin main
```

---

## Common Rollback Scenarios

### Scenario 1: Bad Code Deploy

**Symptoms:** Application errors, broken functionality, white screen

**Solution:**
1. Revert the PR: `git revert -m 1 <sha>`
2. Push to branch
3. Wait for deployment (builds, S3 sync, CloudFront invalidation)

### Scenario 2: CloudFront Configuration Change Broke App

**Symptoms:** SSL errors, incorrect redirects, cache issues

**Solution:**
1. Revert the infrastructure PR
2. Push to trigger terraform apply
3. Wait for CloudFront distribution to update (~5-10 min)

### Scenario 3: Wrong Environment Variables in Build

**Symptoms:** App pointing to wrong API, missing features

**Solution:**
1. Check GitHub secrets are correct
2. Re-run the deployment workflow
3. Or revert to previous working build

### Scenario 4: Assets Not Loading

**Symptoms:** JS/CSS 404 errors, broken styles

**Possible causes:**
- S3 sync incomplete
- CloudFront cache serving stale content
- Wrong cache headers

**Solution:**
1. Check S3 bucket has all expected files
2. Invalidate CloudFront cache: `/*`
3. If issue persists, restore from S3 versions

### Scenario 5: SSL Certificate Issues

**Symptoms:** HTTPS not working, certificate errors

**Solution:**
1. Check ACM certificate status in AWS Console (us-east-1)
2. If DNS validation pending, check Route53 records
3. May take up to 30 minutes for certificate to validate
4. CloudFront may need 5-10 minutes to pick up new certificate

---

## Related Runbooks

- [Deployment Procedures](./DEPLOYMENT.md)
- [Incident Response](./INCIDENT_RESPONSE.md)
