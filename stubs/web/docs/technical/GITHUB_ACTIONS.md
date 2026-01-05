# GitHub Actions CI/CD Documentation

**Version:** 3.0
**Last Updated:** January 2026
**Related Documents:** [INFRASTRUCTURE.md](INFRASTRUCTURE.md), [SYSTEM_ARCHITECTURE.md](../../docs/architecture/SYSTEM_ARCHITECTURE.md)

---

## Overview

This project uses GitHub Actions for continuous integration and deployment:

- **CI (Continuous Integration):** Automated testing on every PR and push
- **CD (Continuous Deployment):** Automated S3 deployments with CloudFront invalidation
- **PR Previews:** Ephemeral preview environments for each pull request

### Static SPA Deployment

The Connect 2.0 Web App is deployed as a **static SPA** to S3 + CloudFront:

| Component | Resource Name |
|-----------|---------------|
| **S3 Bucket** | `connect2-web-{env}` |
| **CloudFront Distribution** | Global CDN with HTTPS |
| **ACM Certificate** | `*.app.connect.com` (wildcard for PR previews) |
| **Terraform State** | `connect2-web-terraform-state-{env}` |

---

## Workflows

### CI Workflow (`ci.yml`)

**Triggers:**
- Pull requests to `main`, `staging`
- Push to `main`, `staging`

**Jobs:**

| Job | Description | Commands |
|-----|-------------|----------|
| `lint` | ESLint code quality | `npm run lint` |
| `type-check` | TypeScript validation | `npx tsc --noEmit` |
| `test` | Run test suite | `npm run test -- --run` |
| `build` | Production build | `npm run build` |

All jobs run in parallel for faster feedback.

---

### Deploy to Staging (`deploy-staging.yml`)

**Triggers:**
- Push to `staging` branch
- Manual dispatch

**What it does:**
1. Builds React app with `npm run build`
2. Syncs build output to S3 with cache headers
3. Invalidates CloudFront cache
4. Reports deployment summary

**Environment:** `staging`

---

### Deploy to Production (`deploy-prod.yml`)

**Triggers:**
- Push to `main` branch
- Manual dispatch

**What it does:**
1. **Runs full test suite first** (lint, type-check, test, build)
2. Builds React app with production API URL
3. Syncs build output to S3 with cache headers
4. Invalidates CloudFront cache
5. Creates GitHub Release with version tag

**Environment:** `production` (can require approval)

---

### Deploy PR Preview (`deploy-pr-preview.yml`)

**Triggers:**
- Pull request opened, synchronized, or reopened
- Targeting `staging` or `main` branches

**What it does:**
1. Builds React app with staging API URL
2. Creates S3 bucket and CloudFront distribution via Terraform
3. Syncs build output to S3
4. Invalidates CloudFront cache
5. Posts preview URL as PR comment

**Resources Created:**
- S3 Bucket: `connect2-web-pr-{number}`
- CloudFront Distribution with custom domain
- Route53 DNS record: `pr-{number}.app.connect.com`

---

### Cleanup PR Preview (`cleanup-pr-preview.yml`)

**Triggers:**
- Pull request closed

**What it does:**
1. Empties S3 bucket
2. Destroys Terraform resources (CloudFront, DNS, S3)
3. Reports cleanup summary

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
- `staging` → `staging`
- `main` → `prod`

---

## Branch Strategy

```
feature-branch ─────────► PR to staging
                              │
                              ├──► PR Preview Created (pr-123.app.connect.com)
                              │
                              ▼
staging ──────────────────────────────────► Staging Environment (app-staging.connect.com)
     │                                       (Client UAT + QA)
     └──► PR to main
              │
              ▼
main ─────────────────────────────────────► Production Environment (app.connect.com)
```

### Two-Environment Model

The Web uses a **two-environment model** (Staging + Production):

- **PR Previews** provide isolated testing for each pull request
- **PR Previews connect to Staging API** for backend functionality
- **Staging** serves as the integration environment for final QA
- **Production** serves live users

### Workflow

1. **Feature Development:**
   - Create feature branch from `staging`
   - Push changes (CI runs, PR preview created)
   - Create PR to `staging`
   - Test on PR preview URL
   - Merge after review → deploys to Staging

2. **Production Release:**
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
| `CLOUDFRONT_STAGING_DISTRIBUTION_ID` | CloudFront distribution ID for staging |
| `CLOUDFRONT_PROD_DISTRIBUTION_ID` | CloudFront distribution ID for production |
| `STAGING_API_URL` | API URL for staging (used in builds) |
| `PROD_API_URL` | API URL for production (used in builds) |
| `DOMAIN_NAME` | Root domain (e.g., `connect.com`) |
| `ROUTE53_ZONE_ID` | Route53 hosted zone ID |
| `WILDCARD_CERTIFICATE_ARN` | ACM certificate for `*.app.connect.com` |

### IAM Permissions Required

The AWS credentials need these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::connect2-web-*",
        "arn:aws:s3:::connect2-web-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetDistribution",
        "cloudfront:CreateDistribution",
        "cloudfront:UpdateDistribution",
        "cloudfront:DeleteDistribution",
        "cloudfront:TagResource",
        "cloudfront:CreateOriginAccessControl",
        "cloudfront:DeleteOriginAccessControl",
        "cloudfront:GetOriginAccessControl",
        "cloudfront:CreateResponseHeadersPolicy",
        "cloudfront:DeleteResponseHeadersPolicy",
        "cloudfront:GetResponseHeadersPolicy"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "route53:ChangeResourceRecordSets",
        "route53:GetHostedZone",
        "route53:ListResourceRecordSets"
      ],
      "Resource": "arn:aws:route53:::hostedzone/*"
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
        "arn:aws:s3:::connect2-web-terraform-state-*",
        "arn:aws:s3:::connect2-web-terraform-state-*/*"
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
2. Select the workflow (e.g., "Deploy to Staging")
3. Click **Run workflow**
4. Select branch and click **Run workflow**

The Terraform workflow also allows selecting:
- Environment (`staging`, `prod`)
- Action (`plan` or `apply`)

---

## Workflow Files

```
.github/workflows/
├── ci.yml                  # Lint, test, type-check, build on all branches
├── deploy-staging.yml      # Deploy to staging on push to staging
├── deploy-prod.yml         # Deploy to prod on push to main (with tests + GitHub Release)
├── deploy-pr-preview.yml   # Create PR preview on PR open/update
├── cleanup-pr-preview.yml  # Cleanup PR preview on PR close
└── terraform.yml           # Infrastructure changes (S3, CloudFront, etc.)
```

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
│ Deploy Workflow │────►│  npm run build  │
│   (per branch)  │     │                 │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   S3 Sync       │
                        │ (with cache     │
                        │   headers)      │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   CloudFront    │
                        │  Invalidation   │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Live Globally  │
                        │  (within mins)  │
                        └─────────────────┘
```

---

## PR Preview Flow

```
┌─────────────────┐
│  Open/Update PR │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    CI Workflow  │──────────────────────────┐
│     (tests)     │                          │
└────────┬────────┘                          │
         │                                   │
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│ Terraform Apply │                 │   npm build     │
│ (S3 + CloudFront│                 │                 │
│   + DNS record) │                 └────────┬────────┘
└────────┬────────┘                          │
         │                                   │
         └───────────────┬───────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │   S3 Sync       │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │   Post PR       │
                │   Comment with  │
                │   Preview URL   │
                └─────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │  pr-123.app.connect.com → Ready!  │
         └───────────────────────────────────┘

┌─────────────────┐
│   Close PR      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Empty S3      │
│   Terraform     │
│   Destroy       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Resources     │
│   Cleaned Up    │
└─────────────────┘
```

---

## Best Practices

### Separate Infrastructure and Code PRs

**Never mix infrastructure changes and application code in the same PR.**

| PR Type | Contains | Examples |
|---------|----------|----------|
| **Code PR** | React components, hooks, tests, styles | `feat: add login page` |
| **Infrastructure PR** | Terraform, GitHub Actions | `infra: update CloudFront cache policy` |

### Commit Messages

Use conventional commits for clear history:
```
feat: add user authentication
fix: resolve login redirect issue
infra: update CloudFront security headers
docs: update deployment documentation
chore: upgrade dependencies
```

### Branch Naming

```
feature/add-login-page
bugfix/fix-header-styling
hotfix/security-patch
infra/update-cloudfront-config
```

---

## Troubleshooting

### CI Failing

**Lint errors:**
```bash
npm run lint -- --fix  # Auto-fix issues locally
```

**Type errors:**
```bash
npx tsc --noEmit       # Check types locally
```

**Test failures:**
```bash
npm run test           # Run tests locally
```

### Deployment Failing

**S3 Sync fails:**
- Check AWS credentials are correct
- Verify S3 bucket exists
- Check IAM permissions

**CloudFront Invalidation fails:**
- Verify distribution ID is correct
- Check IAM permissions for CloudFront

**Changes not appearing:**
- Check CloudFront invalidation completed
- Clear browser cache
- Wait a few minutes for edge propagation

### Viewing Logs

**GitHub Actions logs:**
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Expand the failed step

**AWS logs:**
```bash
# Check S3 bucket contents
aws s3 ls s3://connect2-web-staging/

# Check CloudFront distribution status
aws cloudfront get-distribution --id E1234567890ABC

# Check recent invalidations
aws cloudfront list-invalidations --distribution-id E1234567890ABC
```

---

## Related Documentation

- [Infrastructure Documentation](./INFRASTRUCTURE.md)
- [App Quickstart Guide](./APP_QUICKSTART.md)
- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md)
- [Deployment Runbook](../runbooks/DEPLOYMENT.md)
- [Rollback Runbook](../runbooks/ROLLBACK.md)
