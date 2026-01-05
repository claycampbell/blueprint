# Deployment Procedures

**Last Updated:** January 2026

---

## Overview

This runbook covers standard deployment procedures for the Connect 2.0 Web App, which is deployed as a static SPA to S3 + CloudFront.

---

## Deployment Flow

```
Feature Branch → staging → main (production)
                    ↓
              PR Preview (pr-{N}.app.connect.com)
```

| Branch | Environment | URL | Deployment |
|--------|-------------|-----|------------|
| PR branches | PR Preview | `pr-{N}.app.connect.com` | Automatic on PR open/update |
| `staging` | Staging | `app-staging.connect.com` | Automatic on merge |
| `main` | Production | `app.connect.com` | Automatic on merge |

---

## PR Guidelines

### Separate Infrastructure and Code PRs

**Never mix infrastructure changes and application code in the same PR.**

**Why:**
- Clean rollbacks - revert one without affecting the other
- Easier code review - reviewers can focus on one type of change
- Simpler debugging - know exactly what changed if issues arise
- Independent deployment timing - infrastructure may need to deploy first

**Examples:**

✅ **Good:**
- PR #1: "Add user authentication feature" (code only)
- PR #2: "Update CloudFront cache policy" (infrastructure only)

❌ **Bad:**
- PR #1: "Add authentication with CloudFront config" (mixed)

### PR Types

**Application Code PRs:**
- React components, hooks, utilities
- Styles and assets
- Tests
- Documentation (non-infrastructure)

**Infrastructure PRs:**
- Terraform modules and environments
- GitHub Actions workflows
- CloudFront configuration

---

## Standard Deployment Process

### 1. Create PR with Preview

```bash
# Create feature branch
git checkout staging
git pull origin staging
git checkout -b feature/my-feature

# Make changes, commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push -u origin feature/my-feature
```

1. Create PR to `staging`
2. Wait for CI to pass (lint, type-check, test, build)
3. PR Preview automatically deployed at `pr-{N}.app.connect.com`
4. Test your changes on the PR Preview URL
5. Get code review approval
6. Merge PR

**PR Preview automatically cleaned up when PR is closed.**

### 2. Staging Deployment

When PR is merged to `staging`:

1. GitHub Actions builds the React app
2. Build output synced to S3 (`connect2-web-staging`)
3. CloudFront cache invalidated
4. Changes live at `app-staging.connect.com`

**Verify:**
- Check GitHub Actions completed successfully
- Visit `app-staging.connect.com`
- Test the feature in Staging environment

### 3. Production Deployment

```bash
# Create PR from staging to main
gh pr create --base main --head staging --title "Production release"
```

1. Create PR from `staging` to `main`
2. Review changes carefully
3. Get required approvals
4. Merge PR
5. GitHub Actions runs tests, then deploys
6. GitHub Release created automatically

**Verify:**
- Check GitHub Actions completed
- Visit `app.connect.com`
- Monitor for errors
- Verify key user flows work

---

## Infrastructure Deployment

### Terraform Changes

1. **Make changes in feature branch:**
   ```bash
   git checkout -b infra/update-cloudfront
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
Day 1: PR "Update CloudFront security headers" (infra) → merge
Day 1: Verify CloudFront distribution updated
Day 1: PR "Add new feature using updated headers" (code) → merge
```

---

## Manual Deployment

If GitHub Actions is unavailable:

### Deploy Application

```bash
# 1. Build the React app
npm ci
npm run build

# 2. Sync to S3 with cache headers
aws s3 sync dist/ s3://connect2-web-prod/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "*.json"

aws s3 sync dist/ s3://connect2-web-prod/ \
  --cache-control "no-cache, no-store, must-revalidate" \
  --include "index.html" \
  --include "*.json"

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
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

- [ ] Feature tested on PR Preview
- [ ] Feature tested in Staging environment
- [ ] All CI checks passing
- [ ] Code review approved
- [ ] No mixed infrastructure/code changes
- [ ] Rollback plan identified

### After Deploying to Production

- [ ] Deployment completed successfully
- [ ] Application loads correctly
- [ ] CloudFront invalidation completed
- [ ] Key user flows verified
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

4. **Backport to staging:**
   ```bash
   git checkout staging
   git cherry-pick <hotfix-commit>
   git push origin staging
   ```

---

## Environment-Specific Commands

### Staging

```bash
# Check S3 bucket contents
aws s3 ls s3://connect2-web-staging/

# Sync to staging
aws s3 sync dist/ s3://connect2-web-staging/ --delete

# Get CloudFront distribution ID
aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='connect2-web-staging'].Id"

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id <STAGING_DIST_ID> \
  --paths "/*"
```

### Production

```bash
# Check S3 bucket contents
aws s3 ls s3://connect2-web-prod/

# Sync to production
aws s3 sync dist/ s3://connect2-web-prod/ --delete

# Get CloudFront distribution ID
aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='connect2-web-prod'].Id"

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id <PROD_DIST_ID> \
  --paths "/*"
```

---

## Related Runbooks

- [Rollback Procedures](./ROLLBACK.md)
- [Incident Response](./INCIDENT_RESPONSE.md)
