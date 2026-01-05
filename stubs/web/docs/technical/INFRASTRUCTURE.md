# Web Infrastructure Documentation

**Version:** 3.0
**Last Updated:** January 2026
**Related Documents:** [SYSTEM_ARCHITECTURE.md](../../docs/architecture/SYSTEM_ARCHITECTURE.md), [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md)

---

## Overview

The Connect 2.0 Web App is deployed to AWS as a **static SPA** using S3 + CloudFront:

- **Terraform** for infrastructure as code
- **S3** for static file hosting
- **CloudFront** for global CDN with HTTPS
- **GitHub Actions** for CI/CD

### Why S3 + CloudFront Instead of ECS?

| Aspect | S3 + CloudFront | ECS Fargate |
|--------|-----------------|-------------|
| **Cost** | ~$5-20/month | ~$50-200/month |
| **Complexity** | Simple | Containers, networking, auto-scaling |
| **Performance** | Global edge caching | Single region |
| **Scaling** | Automatic, unlimited | Manual configuration |
| **Maintenance** | Zero servers | Container updates, patching |

For a React SPA that makes API calls to a separate backend, S3 + CloudFront is the optimal choice.

### Independent Infrastructure

This repository contains **all infrastructure required** to run the Web application:

| Component | Module Location |
|-----------|-----------------|
| **S3 Bucket** | Inline in environment config |
| **CloudFront Distribution** | `infrastructure/terraform/modules/cloudfront/` |
| **ACM Certificates** | `infrastructure/terraform/modules/acm/` |
| **Route53 DNS** | `infrastructure/terraform/modules/dns-record/` |
| **SNS Alerts** | `infrastructure/terraform/modules/sns-alerts/` |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      CONNECT 2.0 WEB INFRASTRUCTURE                              │
│                         (S3 + CloudFront Static SPA)                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                              Route 53                                    │    │
│  │              app.connect.com / app-staging.connect.com                   │    │
│  │              pr-{N}.app.connect.com (PR Previews)                        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                     CloudFront Distribution                              │    │
│  │              (Global CDN, HTTPS, SPA Routing, Security Headers)          │    │
│  │                                                                          │    │
│  │    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │    │
│  │    │  Edge: US    │  │  Edge: EU    │  │  Edge: APAC  │  ...            │    │
│  │    └──────────────┘  └──────────────┘  └──────────────┘                 │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                          │
│                              Origin Access Control                              │
│                                      │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                          S3 Bucket (Private)                             │    │
│  │                       connect2-web-{environment}                         │    │
│  │                                                                          │    │
│  │    ┌──────────────────────────────────────────────────────────┐         │    │
│  │    │  index.html  │  assets/  │  static/  │  manifest.json   │         │    │
│  │    └──────────────────────────────────────────────────────────┘         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    ACM Certificate (us-east-1)                           │    │
│  │          *.app.connect.com (wildcard for PR previews)                    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Environments

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| **PR Preview** | PR branches | `pr-{N}.app.connect.com` | QA testing before merge |
| **Staging** | `staging` | `app-staging.connect.com` | Client UAT, pre-release |
| **Production** | `main` | `app.connect.com` | Live users |

### Environment Differences

| Feature | PR Preview | Staging | Prod |
|---------|------------|---------|------|
| CloudFront Price Class | US/EU | US/EU | Global |
| S3 Versioning | No | Yes | Yes |
| Object Retention | 7 days | 30 days | 90 days |
| Custom Domain | `pr-{N}.app.*` | `app-staging.*` | `app.*` |
| API Backend | Staging API | Staging API | Production API |

### PR Previews

PR Previews provide isolated testing environments for each pull request:

- **Automatic creation** when PR is opened
- **Automatic updates** when PR is updated
- **Automatic cleanup** when PR is closed
- **URL posted as PR comment** for easy access
- **Uses Staging API** for backend functionality

---

## Directory Structure

```
infrastructure/
└── terraform/
    ├── modules/                    # Reusable Terraform modules
    │   ├── cloudfront/             # CloudFront distribution
    │   ├── s3-website/             # S3 bucket for static hosting
    │   ├── acm/                    # SSL/TLS certificates
    │   ├── dns-record/             # Route53 DNS records
    │   ├── route53-zone/           # Route53 hosted zones
    │   └── sns-alerts/             # Alerting topics
    └── environments/               # Environment-specific configurations
        ├── pr-preview/
        │   ├── main.tf             # Ephemeral PR preview infrastructure
        │   ├── variables.tf
        │   └── outputs.tf
        ├── staging/
        │   ├── main.tf             # S3 + CloudFront for staging
        │   ├── variables.tf
        │   └── outputs.tf
        └── prod/
            ├── main.tf             # S3 + CloudFront for production
            ├── variables.tf
            └── outputs.tf
```

---

## Terraform Modules

### cloudfront

Creates CloudFront distribution with SPA routing and security headers.

**Resources Created:**
- CloudFront Distribution
- Origin Access Control (OAC)
- Response Headers Policy (security headers)

**Key Features:**
- SPA routing (404/403 → index.html)
- HTTPS-only with TLS 1.2+
- Security headers (CSP, HSTS, X-Frame-Options)
- Gzip/Brotli compression
- Cache optimization

**Key Variables:**
```hcl
s3_bucket_regional_domain_name = aws_s3_bucket.website.bucket_regional_domain_name
domain_names                   = ["app.connect.com"]
certificate_arn                = module.acm.certificate_arn
price_class                    = "PriceClass_All"  # Global
content_security_policy        = "default-src 'self'; connect-src 'self' https://api.connect.com;"
```

### s3-website

Creates S3 bucket configured for static website hosting.

**Resources Created:**
- S3 Bucket (private)
- Public Access Block
- Versioning Configuration
- Server-side Encryption
- Lifecycle Rules

**Key Variables:**
```hcl
bucket_name     = "connect2-web-staging"
versioning      = true
retention_days  = 30
```

### dns-record

Creates Route53 records for CloudFront.

**Resources Created:**
- Route53 A Record (IPv4 alias to CloudFront)
- Route53 AAAA Record (IPv6 alias to CloudFront)

**Key Variables:**
```hcl
route53_zone_id       = module.route53_zone.zone_id
record_name           = "app"  # Results in app.connect.com
alias_target_dns_name = module.cloudfront.distribution_domain_name
alias_target_zone_id  = module.cloudfront.distribution_hosted_zone_id
create_ipv6_record    = true
```

---

## Deployment Process

### Initial Setup (One-time)

1. **Create S3 bucket for Terraform state:**
   ```bash
   aws s3 mb s3://connect2-web-terraform-state-staging --region us-west-2
   aws s3api put-bucket-versioning \
     --bucket connect2-web-terraform-state-staging \
     --versioning-configuration Status=Enabled
   ```

2. **Deploy infrastructure:**
   ```bash
   cd infrastructure/terraform/environments/staging
   terraform init
   terraform plan -var="domain_name=connect.com" -var="api_url=https://api-staging.connect.com"
   terraform apply
   ```

### Ongoing Deployments

Deployments are automated via GitHub Actions:

1. Push code to branch (`staging` or `main`)
2. CI workflow runs (lint, type-check, test, build)
3. Deploy workflow triggers:
   - Builds React app with `npm run build`
   - Syncs `dist/` to S3 with proper cache headers
   - Invalidates CloudFront cache
4. Changes are live globally within minutes

### Manual Deployment

```bash
# Build the React app
npm ci
npm run build

# Sync to S3 with cache headers
aws s3 sync dist/ s3://connect2-web-staging/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "*.json"

aws s3 sync dist/ s3://connect2-web-staging/ \
  --cache-control "no-cache, no-store, must-revalidate" \
  --include "index.html" \
  --include "*.json"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

---

## Cache Strategy

### Long-lived Assets (JS, CSS, Images)

- **Cache-Control:** `public, max-age=31536000, immutable`
- **Duration:** 1 year
- **Rationale:** Vite generates hashed filenames; content changes = new filename

### Short-lived Assets (HTML, JSON)

- **Cache-Control:** `no-cache, no-store, must-revalidate`
- **Duration:** Always revalidate
- **Rationale:** Entry points must always fetch latest version

### CloudFront Cache Invalidation

After each deployment, we invalidate `/*` to ensure users get the new `index.html` immediately.

---

## Security

### Origin Access Control (OAC)

S3 bucket is completely private. Only CloudFront can access it via OAC:

```hcl
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "connect2-web-staging-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
```

### Security Headers

CloudFront adds security headers to all responses:

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | Configured per environment |

### Content Security Policy

CSP is configured to allow connections to the API backend:

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https://api.connect.com;
```

---

## Cost Optimization

### S3 + CloudFront Cost Breakdown

| Resource | Estimated Monthly Cost |
|----------|----------------------|
| S3 Storage | $0.50 (10GB) |
| S3 Requests | $1-5 |
| CloudFront Data Transfer | $5-15 |
| CloudFront Requests | $2-5 |
| Route53 Hosted Zone | $0.50 |
| ACM Certificate | Free |
| **Total** | **~$10-25/month** |

Compare to ECS Fargate: $50-200/month for equivalent availability.

### Additional Savings

- **PR Previews auto-cleanup:** Resources deleted when PR closes
- **Lifecycle rules:** Old S3 versions auto-deleted
- **Price class selection:** Staging uses US/EU only; Production uses global

---

## Monitoring & Troubleshooting

### CloudFront Metrics

Available in CloudWatch:
- Requests
- Bytes Downloaded
- 4xx Error Rate
- 5xx Error Rate
- Cache Hit Rate

### Common Issues

**Changes not appearing:**
1. Check CloudFront invalidation completed
2. Clear browser cache
3. Check S3 sync succeeded

**404 errors on routes:**
1. Verify CloudFront custom error responses
2. Check SPA routing returns `index.html` for 403/404

**SSL certificate issues:**
1. Verify ACM certificate is in us-east-1
2. Check DNS validation completed
3. Verify certificate covers the domain

### Viewing Logs

```bash
# Check CloudFront distribution status
aws cloudfront get-distribution --id E1234567890ABC

# List S3 bucket contents
aws s3 ls s3://connect2-web-staging/

# Check recent invalidations
aws cloudfront list-invalidations --distribution-id E1234567890ABC
```

---

## Related Documentation

- [GitHub Actions Workflows](./GITHUB_ACTIONS.md)
- [App Quickstart Guide](./APP_QUICKSTART.md)
- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md)
- [Deployment Runbook](../runbooks/DEPLOYMENT.md)
- [Rollback Runbook](../runbooks/ROLLBACK.md)
