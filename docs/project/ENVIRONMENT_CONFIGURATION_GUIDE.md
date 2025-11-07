# Environment Configuration Guide

**Version:** 1.0.0
**Last Updated:** November 6, 2025
**Status:** Active
**Related Documents:** [SYSTEM_ARCHITECTURE.md](../technical/SYSTEM_ARCHITECTURE.md), [SECURITY_COMPLIANCE.md](../technical/SECURITY_COMPLIANCE.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Environment Types](#environment-types)
3. [Configuration Files](#configuration-files)
4. [Backend Configuration](#backend-configuration)
5. [Frontend Configuration](#frontend-configuration)
6. [Docker Compose Configuration](#docker-compose-configuration)
7. [Secrets Management](#secrets-management)
8. [Environment-Specific Settings](#environment-specific-settings)
9. [Variable Documentation](#variable-documentation)
10. [Security Best Practices](#security-best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Overview

### Purpose

This guide provides comprehensive instructions for configuring Connect 2.0 across different environments (development, staging, production). Proper environment configuration is critical for:

- **Security**: Protecting sensitive credentials and API keys
- **Consistency**: Ensuring all environments behave predictably
- **Maintainability**: Making configuration changes easy and safe
- **Compliance**: Meeting regulatory requirements (GLBA, SOC 2)

### Architecture Context

Connect 2.0 uses environment variables for all configuration, following the **12-Factor App** methodology:

```
┌─────────────────────────────────────────────────────────────┐
│                    CONFIGURATION SOURCES                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Development         Staging              Production        │
│  ┌──────────┐       ┌──────────┐         ┌──────────┐      │
│  │  .env    │       │ CI/CD    │         │  Azure   │      │
│  │  (local) │       │Variables │         │Key Vault │      │
│  └──────────┘       └──────────┘         └──────────┘      │
│       ↓                  ↓                     ↓            │
│  ┌──────────────────────────────────────────────────┐      │
│  │          Application Environment Variables        │      │
│  └──────────────────────────────────────────────────┘      │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────┐      │
│  │      Backend API / Frontend App / Workers        │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Types

### Development (Local)

**Purpose:** Local development on developer machines
**Configuration Source:** `.env` files (not committed to git)
**Security Level:** Low (test data only)

**Characteristics:**
- Local database (PostgreSQL in Docker)
- Local Redis cache
- Mock external services (optional)
- Debug logging enabled
- No MFA required
- Relaxed CORS policies

### Staging

**Purpose:** Pre-production testing and QA
**Configuration Source:** CI/CD pipeline variables (GitHub Actions, Azure DevOps)
**Security Level:** Medium

**Characteristics:**
- Cloud-hosted database (non-production instance)
- Real external service integrations (sandbox/test accounts)
- Debug logging enabled
- MFA optional
- Restricted access (VPN or IP whitelist)

### Production

**Purpose:** Live system serving real users
**Configuration Source:** Azure Key Vault / AWS Secrets Manager
**Security Level:** High

**Characteristics:**
- Multi-AZ database with automatic failover
- Production external service accounts
- Structured logging (JSON)
- MFA required for all users
- Strict CORS policies
- Rate limiting enforced
- Automated backups
- 99.5% uptime SLA

---

## Configuration Files

### File Structure

```
connect2/
├── .env.example                    # Root (Docker Compose)
├── backend/
│   ├── .env                        # Local backend config (DO NOT COMMIT)
│   ├── .env.example                # Backend template (COMMIT THIS)
│   ├── .env.test                   # Test environment config
│   └── src/config/
│       └── index.ts                # Configuration loader
├── frontend/
│   ├── .env                        # Local frontend config (DO NOT COMMIT)
│   ├── .env.example                # Frontend template (COMMIT THIS)
│   └── .env.production             # Production build config
└── docs/
    └── project/
        └── ENVIRONMENT_CONFIGURATION_GUIDE.md  # This file
```

### Setup Instructions

#### 1. Initial Setup (Development)

```bash
# Clone repository
git clone https://github.com/datapage/connect2.git
cd connect2

# Copy environment templates
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit configuration files
# Update database passwords, API keys, etc.
nano backend/.env
nano frontend/.env

# Start services
docker-compose up -d

# Run database migrations
cd backend
npm run migrate:latest

# Seed development data (optional)
npm run seed
```

#### 2. Verify Configuration

```bash
# Check backend configuration
cd backend
npm run config:validate

# Expected output:
# ✓ Database connection successful
# ✓ Redis connection successful
# ✓ All required environment variables present
# ⚠ Using development JWT secret (not secure for production)
```

### .gitignore Configuration

**CRITICAL:** Ensure `.env` files are never committed to version control.

```gitignore
# Environment files (NEVER COMMIT)
.env
.env.local
.env.*.local
backend/.env
frontend/.env

# ALWAYS COMMIT TEMPLATES
!.env.example
!backend/.env.example
!frontend/.env.example
```

---

## Backend Configuration

### Required Variables

| Variable | Required? | Example | Description |
|----------|-----------|---------|-------------|
| `NODE_ENV` | Yes | `development` | Environment name |
| `PORT` | Yes | `3000` | Server port |
| `DATABASE_URL` | Yes | `postgresql://...` | PostgreSQL connection string |
| `JWT_SECRET` | Yes | `random-32-char-string` | JWT signing secret |
| `DATA_ENCRYPTION_KEY` | Yes | `random-32-char-string` | Field encryption key |

### Database Configuration

```env
# PostgreSQL Connection String Format:
# postgresql://[user]:[password]@[host]:[port]/[database]?[options]

# Development (local Docker)
DATABASE_URL=postgresql://connect_user:dev_password@localhost:5432/connect_dev

# Production (Azure PostgreSQL)
DATABASE_URL=postgresql://connect_admin:secure_password@connect-prod.postgres.database.azure.com:5432/connect_prod?ssl=true&sslmode=require

# Connection Pool Settings
DATABASE_POOL_MIN=2           # Minimum connections
DATABASE_POOL_MAX=10          # Maximum connections (adjust based on load)
DATABASE_SSL=true             # REQUIRED in production
DATABASE_LOGGING=false        # Disable in production (performance)
```

**Recommendations:**
- **Development:** 2-10 connections
- **Staging:** 5-20 connections
- **Production:** 10-50 connections (monitor and adjust)

### Redis Configuration

```env
# Redis Connection String Format:
# redis://[username]:[password]@[host]:[port]/[db]

# Development (local Docker)
REDIS_URL=redis://localhost:6379

# Production (Azure Cache for Redis)
REDIS_URL=redis://:secure_password@connect-prod.redis.cache.windows.net:6380?ssl=true

# Cache TTL (seconds)
REDIS_TTL=300                 # 5 minutes default
```

### Authentication Configuration

```env
# JWT Configuration
JWT_SECRET=use-openssl-rand-base64-32-to-generate
JWT_ACCESS_TOKEN_EXPIRY=900        # 15 minutes (900 seconds)
JWT_REFRESH_TOKEN_EXPIRY=604800    # 7 days (604800 seconds)

# Data Encryption
DATA_ENCRYPTION_KEY=use-openssl-rand-base64-32-to-generate

# Password Hashing
BCRYPT_ROUNDS=12                   # Increase for more security (slower)

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000        # 15 minutes
RATE_LIMIT_MAX_REQUESTS=1000
AUTH_RATE_LIMIT_MAX_ATTEMPTS=5     # Login attempts per window
```

**Security Notes:**
- Generate strong secrets: `openssl rand -base64 32`
- Never reuse secrets across environments
- Rotate secrets every 90 days (production)

### Cloud Storage Configuration

#### Option 1: AWS S3

```env
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
S3_BUCKET_NAME=connect-prod-documents
S3_BUCKET_REGION=us-west-2
```

**Best Practice:** Use IAM roles instead of access keys when running on AWS (EC2, ECS, Lambda).

#### Option 2: Azure Blob Storage

```env
AZURE_STORAGE_ACCOUNT=connectprodstorage
AZURE_STORAGE_KEY=your-storage-key-here
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=connectprodstorage;AccountKey=...;EndpointSuffix=core.windows.net
AZURE_CONTAINER_NAME=documents
```

### External Service Integrations

#### Email (SendGrid)

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@connect.datapage.com
SENDGRID_FROM_NAME=Blueprint Connect 2.0

# Template IDs (create in SendGrid dashboard)
SENDGRID_TEMPLATE_WELCOME=d-abc123def456
SENDGRID_TEMPLATE_PASSWORD_RESET=d-abc123def457
SENDGRID_TEMPLATE_DRAW_APPROVED=d-abc123def458
```

#### SMS (Twilio)

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
```

#### E-Signature (DocuSign)

```env
DOCUSIGN_API_BASE_URL=https://api.docusign.net/restapi
DOCUSIGN_ACCOUNT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DOCUSIGN_INTEGRATION_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DOCUSIGN_USER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DOCUSIGN_PRIVATE_KEY_PATH=/path/to/private-key.pem
```

**Note:** For production, use OAuth 2.0 JWT authentication instead of legacy API keys.

#### Azure Document Intelligence

```env
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://connect-prod-doc-ai.cognitiveservices.azure.com
AZURE_DOCUMENT_INTELLIGENCE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AZURE_DOCUMENT_INTELLIGENCE_API_VERSION=2023-07-31

# Custom Models
AZURE_DOCUMENT_INTELLIGENCE_SURVEY_MODEL=blueprint-survey
AZURE_DOCUMENT_INTELLIGENCE_TITLE_MODEL=blueprint-title-report
AZURE_DOCUMENT_INTELLIGENCE_ARBORIST_MODEL=blueprint-arborist-report
```

### Monitoring & Logging

#### Sentry (Error Tracking)

```env
SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o123456.ingest.sentry.io/7891011
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1      # Sample 10% of transactions
```

#### Datadog (Monitoring & APM)

```env
DATADOG_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DATADOG_APP_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DATADOG_SERVICE_NAME=connect2-backend
DATADOG_ENV=production
```

---

## Frontend Configuration

### Required Variables

All frontend environment variables must be prefixed with `VITE_` to be exposed to the browser.

```env
# API Configuration
VITE_API_BASE_URL=https://api.connect.datapage.com/api/v1
VITE_WS_URL=wss://api.connect.datapage.com

# Application Metadata
VITE_APP_NAME=Connect 2.0
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production

# Company Branding
VITE_COMPANY_NAME=Blueprint Capital
VITE_SUPPORT_EMAIL=support@blueprint.com
VITE_SUPPORT_PHONE=(206) 555-0100
```

### Feature Flags

```env
VITE_FEATURE_BPO_INTEGRATION=false          # Days 1-90 only
VITE_FEATURE_OFFLINE_MODE=false             # iPad inspection app
VITE_FEATURE_AI_DOCUMENT_EXTRACTION=true
VITE_FEATURE_MFA=true                       # Production only
```

### External Services

```env
# Google Maps API (address autocomplete, maps)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Sentry (Error Tracking)
VITE_SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/7891011
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
```

### Build-Time vs Runtime

**Important:** Vite environment variables are embedded at **build time**, not runtime.

```bash
# Development (hot reload, variables read from .env)
npm run dev

# Production build (variables baked into bundle)
npm run build

# Preview production build locally
npm run preview
```

**To change production variables:** Rebuild and redeploy the frontend.

---

## Docker Compose Configuration

### Root `.env` File

Used by `docker-compose.yml` for local development services.

```env
# PostgreSQL
POSTGRES_USER=connect
POSTGRES_PASSWORD=connect_dev_password
POSTGRES_DB=connect_dev
POSTGRES_PORT=5432

# Redis
REDIS_PORT=6379
REDIS_PASSWORD=

# Backend
BACKEND_PORT=3000
BACKEND_NODE_ENV=development

# Frontend
FRONTEND_PORT=5173
```

### docker-compose.yml Example

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "${REDIS_PORT}:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    environment:
      - NODE_ENV=${BACKEND_NODE_ENV}
      - PORT=${BACKEND_PORT}
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - REDIS_URL=redis://redis:6379
    ports:
      - "${BACKEND_PORT}:${BACKEND_PORT}"
    depends_on:
      - db
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    environment:
      - VITE_API_BASE_URL=http://localhost:${BACKEND_PORT}/api/v1
    ports:
      - "${FRONTEND_PORT}:${FRONTEND_PORT}"
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
```

---

## Secrets Management

### Development (Local)

**Method:** `.env` files (not committed to git)

**Pros:**
- Simple and fast
- No external dependencies

**Cons:**
- Easy to accidentally commit
- No audit trail
- No rotation capability

**Best Practice:**
```bash
# Generate strong secrets
openssl rand -base64 32

# Store in .env (never commit)
echo "JWT_SECRET=$(openssl rand -base64 32)" >> backend/.env
echo "DATA_ENCRYPTION_KEY=$(openssl rand -base64 32)" >> backend/.env
```

### Staging

**Method:** CI/CD pipeline variables (GitHub Actions, Azure DevOps)

**Example (GitHub Actions):**

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy Backend
        env:
          DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}
          JWT_SECRET: ${{ secrets.STAGING_JWT_SECRET }}
          SENDGRID_API_KEY: ${{ secrets.STAGING_SENDGRID_API_KEY }}
        run: |
          npm run deploy:staging
```

**How to Set Secrets:**
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add secret name and value
4. Click "Add secret"

### Production

**Method:** Azure Key Vault or AWS Secrets Manager

#### Option 1: Azure Key Vault

**Setup:**

```bash
# Create Key Vault
az keyvault create \
  --name connect2-prod-vault \
  --resource-group connect2-prod-rg \
  --location westus2

# Add secrets
az keyvault secret set \
  --vault-name connect2-prod-vault \
  --name jwt-secret \
  --value "your-secret-value"

az keyvault secret set \
  --vault-name connect2-prod-vault \
  --name sendgrid-api-key \
  --value "SG.xxxx"
```

**Application Code (TypeScript):**

```typescript
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

const vaultUrl = process.env.KEY_VAULT_URL;
const credential = new DefaultAzureCredential();
const client = new SecretClient(vaultUrl, credential);

// Retrieve secret
export async function getSecret(name: string): Promise<string> {
  const secret = await client.getSecret(name);
  return secret.value;
}

// Usage in config
export async function loadConfig() {
  return {
    jwtSecret: await getSecret('jwt-secret'),
    sendgridApiKey: await getSecret('sendgrid-api-key'),
    databaseUrl: await getSecret('database-url'),
  };
}
```

**Environment Variables (Production):**

```env
# Only store Key Vault reference, not secrets
KEY_VAULT_URL=https://connect2-prod-vault.vault.azure.net/
```

#### Option 2: AWS Secrets Manager

**Setup:**

```bash
# Create secrets
aws secretsmanager create-secret \
  --name connect2/prod/jwt-secret \
  --secret-string "your-secret-value" \
  --region us-west-2

aws secretsmanager create-secret \
  --name connect2/prod/sendgrid-api-key \
  --secret-string "SG.xxxx" \
  --region us-west-2
```

**Application Code (TypeScript):**

```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-west-2' });

export async function getSecret(secretName: string): Promise<string> {
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const response = await client.send(command);
  return response.SecretString;
}

// Usage
export async function loadConfig() {
  return {
    jwtSecret: await getSecret('connect2/prod/jwt-secret'),
    sendgridApiKey: await getSecret('connect2/prod/sendgrid-api-key'),
  };
}
```

### Secret Rotation

**Rotation Schedule:**

| Secret Type | Rotation Frequency | Automated? |
|-------------|-------------------|------------|
| JWT Signing Key | Every 180 days | Manual (requires deployment) |
| Data Encryption Key | Every 90 days | Manual (requires re-encryption) |
| API Keys (External Services) | Every 90 days | Semi-automated |
| Database Passwords | Every 90 days | Automated (cloud provider) |

**Rotation Process:**

1. **Generate new secret** in Key Vault/Secrets Manager
2. **Deploy new version** of application (reads new secret)
3. **Wait 24 hours** (grace period for rollout)
4. **Revoke old secret** (invalidate old key)
5. **Verify** all services using new secret
6. **Document** in audit log

**Example Rotation Script:**

```bash
#!/bin/bash
# rotate-jwt-secret.sh

echo "Rotating JWT secret..."

# 1. Generate new secret
NEW_SECRET=$(openssl rand -base64 32)

# 2. Store in Key Vault with version
az keyvault secret set \
  --vault-name connect2-prod-vault \
  --name jwt-secret \
  --value "$NEW_SECRET"

# 3. Trigger deployment
gh workflow run deploy-production.yml

echo "✓ New JWT secret deployed"
echo "⚠ Wait 24 hours before revoking old secret"
echo "⚠ Old secret will remain valid during grace period"
```

---

## Environment-Specific Settings

### Development

```env
# backend/.env (Development)
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_LOGGING=true
DISABLE_AUTH=false                    # NEVER true in production
SEED_DATABASE=true
FEATURE_MFA_REQUIRED=false
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Characteristics:**
- Verbose logging for debugging
- Relaxed security (no MFA required)
- Local services (PostgreSQL, Redis in Docker)
- Hot reload enabled

### Staging

```env
# Environment Variables (CI/CD)
NODE_ENV=staging
LOG_LEVEL=info
DATABASE_LOGGING=false
DISABLE_AUTH=false
SEED_DATABASE=false
FEATURE_MFA_REQUIRED=false            # Optional for testing
CORS_ORIGINS=https://staging.connect.datapage.com
```

**Characteristics:**
- Moderate logging
- Real integrations (sandbox accounts)
- Cloud-hosted database (non-production tier)
- MFA optional for testing

### Production

```env
# Azure Key Vault Secrets
NODE_ENV=production
LOG_LEVEL=warn                        # Only warnings and errors
DATABASE_LOGGING=false
DISABLE_AUTH=false
SEED_DATABASE=false
FEATURE_MFA_REQUIRED=true             # REQUIRED in production
CORS_ORIGINS=https://connect.datapage.com
```

**Characteristics:**
- Minimal logging (performance)
- Strict security (MFA, rate limiting, CORS)
- Multi-AZ database with failover
- Production external service accounts
- Automated backups

---

## Variable Documentation

### Complete Reference Table

| Variable | Type | Required | Default | Dev Example | Prod Example | Description |
|----------|------|----------|---------|-------------|--------------|-------------|
| **Server** |
| `NODE_ENV` | string | Yes | - | `development` | `production` | Environment name |
| `PORT` | number | Yes | - | `3000` | `3000` | Server port |
| `HOST` | string | No | `localhost` | `localhost` | `0.0.0.0` | Server host |
| **Database** |
| `DATABASE_URL` | string | Yes | - | `postgresql://...` | `postgresql://...` | PostgreSQL connection string |
| `DATABASE_POOL_MIN` | number | No | `2` | `2` | `10` | Min connections |
| `DATABASE_POOL_MAX` | number | No | `10` | `10` | `50` | Max connections |
| `DATABASE_SSL` | boolean | No | `false` | `false` | `true` | Enable SSL |
| **Redis** |
| `REDIS_URL` | string | Yes | - | `redis://localhost:6379` | `redis://:password@host:6380?ssl=true` | Redis connection string |
| `REDIS_TTL` | number | No | `300` | `300` | `300` | Cache TTL (seconds) |
| **Authentication** |
| `JWT_SECRET` | string | Yes | - | `dev-secret-32-chars` | `<from Key Vault>` | JWT signing secret |
| `JWT_ACCESS_TOKEN_EXPIRY` | number | No | `900` | `900` | `900` | Access token expiry (seconds) |
| `JWT_REFRESH_TOKEN_EXPIRY` | number | No | `604800` | `604800` | `604800` | Refresh token expiry (seconds) |
| `DATA_ENCRYPTION_KEY` | string | Yes | - | `dev-key-32-chars` | `<from Key Vault>` | Field encryption key |
| **Storage** |
| `AWS_REGION` | string | Conditional | - | `us-west-2` | `us-west-2` | AWS region |
| `AWS_ACCESS_KEY_ID` | string | Conditional | - | `AKIAXXXXX` | `<from IAM role>` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | string | Conditional | - | `xxxxx` | `<from IAM role>` | AWS secret key |
| `S3_BUCKET_NAME` | string | Conditional | - | `connect-dev-docs` | `connect-prod-docs` | S3 bucket name |
| `AZURE_STORAGE_ACCOUNT` | string | Conditional | - | `connectdevstorage` | `connectprodstorage` | Azure storage account |
| **Email** |
| `SENDGRID_API_KEY` | string | Yes | - | `SG.xxxxx` | `<from Key Vault>` | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | string | Yes | - | `noreply@connect.datapage.com` | `noreply@connect.datapage.com` | From email address |
| **SMS** |
| `TWILIO_ACCOUNT_SID` | string | Yes | - | `ACxxxxx` | `<from Key Vault>` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | string | Yes | - | `xxxxx` | `<from Key Vault>` | Twilio auth token |
| **Monitoring** |
| `SENTRY_DSN` | string | No | - | - | `https://xxxxx@sentry.io/7891011` | Sentry DSN |
| `DATADOG_API_KEY` | string | No | - | - | `<from Key Vault>` | Datadog API key |
| `LOG_LEVEL` | string | No | `info` | `debug` | `warn` | Logging level |

### Conditional Variables

**"Conditional" means:** Required if using that specific cloud provider or service.

**Examples:**
- If using **AWS S3**: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `S3_BUCKET_NAME` are required
- If using **Azure Blob Storage**: `AZURE_STORAGE_ACCOUNT`, `AZURE_STORAGE_KEY` are required
- If using **DocuSign**: `DOCUSIGN_API_BASE_URL`, `DOCUSIGN_INTEGRATION_KEY` are required

---

## Security Best Practices

### 1. Never Commit Secrets

```bash
# ❌ BAD: Secrets in code
const apiKey = 'sk_live_abc123def456';

# ❌ BAD: .env file committed to git
git add .env
git commit -m "Add environment config"

# ✅ GOOD: .env.example committed (no real secrets)
git add .env.example
git commit -m "Add environment config template"

# ✅ GOOD: Real secrets in Key Vault
const apiKey = await getSecret('sendgrid-api-key');
```

### 2. Use Strong Secrets

```bash
# Generate strong random secrets
openssl rand -base64 32

# Example output:
# 7K9xZp2Qw8fGhN3mVbT5yU4cA6sE1dR0

# Use this for:
# - JWT_SECRET
# - DATA_ENCRYPTION_KEY
# - WEBHOOK_SECRET
```

**Requirements:**
- Minimum 32 characters
- Random (not dictionary words)
- Unique per environment
- Unique per purpose (don't reuse JWT_SECRET for encryption)

### 3. Principle of Least Privilege

```env
# ❌ BAD: Database user with admin privileges
DATABASE_USER=postgres

# ✅ GOOD: Database user with only necessary privileges
DATABASE_USER=connect_app_user

# Grant only necessary permissions:
# - SELECT, INSERT, UPDATE, DELETE on application tables
# - No DROP, CREATE DATABASE, or admin functions
```

### 4. Separate Environments

| Environment | Database | API Keys | Secrets Rotation |
|-------------|----------|----------|------------------|
| Development | Local Docker | Test/sandbox accounts | Never |
| Staging | Cloud (non-prod) | Test/sandbox accounts | Quarterly |
| Production | Cloud (multi-AZ) | Production accounts | Every 90 days |

**Rule:** Never use production credentials in development or staging.

### 5. Audit Secret Access

```typescript
// Log all secret retrievals
async function getSecret(name: string): Promise<string> {
  const secret = await keyVault.getSecret(name);

  // Audit log
  await auditLog.create({
    action: 'SECRET_ACCESSED',
    secret_name: name,
    user: getCurrentUser(),
    timestamp: new Date()
  });

  return secret.value;
}
```

### 6. Rotate Secrets Regularly

```bash
# Automated rotation script (runs quarterly)
#!/bin/bash

echo "Quarterly secret rotation..."

# 1. JWT Secret
rotate_secret "jwt-secret"

# 2. Data Encryption Key (requires re-encryption!)
# rotate_secret "data-encryption-key"  # TODO: Implement re-encryption

# 3. External API Keys
rotate_external_api_keys

echo "✓ Rotation complete"
```

### 7. Monitor for Exposed Secrets

**Tools:**
- **GitGuardian**: Scans commits for exposed secrets
- **TruffleHog**: Finds secrets in git history
- **GitHub Secret Scanning**: Alerts on exposed secrets

**Action Plan if Secret Exposed:**
1. **Immediately revoke** exposed secret
2. **Generate new secret** and update all systems
3. **Audit** who accessed the exposed secret
4. **Notify** affected users if necessary
5. **Document** incident in security log

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

1. **Check Docker services are running:**
   ```bash
   docker-compose ps

   # Expected output:
   # NAME                STATUS
   # connect2-db-1       Up
   # connect2-redis-1    Up
   ```

2. **Verify DATABASE_URL format:**
   ```env
   # ❌ Wrong
   DATABASE_URL=localhost:5432/connect_dev

   # ✅ Correct
   DATABASE_URL=postgresql://connect_user:password@localhost:5432/connect_dev
   ```

3. **Check PostgreSQL is listening:**
   ```bash
   docker-compose logs db

   # Look for:
   # database system is ready to accept connections
   ```

4. **Test connection manually:**
   ```bash
   psql postgresql://connect_user:password@localhost:5432/connect_dev
   ```

### Issue: "Invalid JWT secret"

**Symptoms:**
```
Error: JWT secret must be at least 32 characters
```

**Solutions:**

1. **Generate strong secret:**
   ```bash
   openssl rand -base64 32
   ```

2. **Update .env file:**
   ```env
   JWT_SECRET=<paste generated secret here>
   ```

3. **Restart backend:**
   ```bash
   npm run dev
   ```

### Issue: "CORS error in browser"

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/v1/projects' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**

1. **Check CORS_ORIGINS in backend/.env:**
   ```env
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

2. **Verify frontend is running on correct port:**
   ```bash
   # Frontend should be on :5173
   npm run dev
   ```

3. **Check API URL in frontend/.env:**
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

### Issue: "SendGrid API key invalid"

**Symptoms:**
```
Error: Unauthorized - Invalid API Key
```

**Solutions:**

1. **Verify API key format:**
   ```env
   # Should start with SG.
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Check API key permissions:**
   - Go to SendGrid dashboard → Settings → API Keys
   - Ensure key has "Mail Send" permission
   - Regenerate key if necessary

3. **Test API key:**
   ```bash
   curl -X POST https://api.sendgrid.com/v3/mail/send \
     -H "Authorization: Bearer $SENDGRID_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"noreply@connect.datapage.com"},"subject":"Test","content":[{"type":"text/plain","value":"Test"}]}'
   ```

### Issue: "Key Vault access denied"

**Symptoms:**
```
Error: Access denied to Key Vault 'connect2-prod-vault'
```

**Solutions:**

1. **Check Azure credentials:**
   ```bash
   az account show

   # Ensure you're logged into correct subscription
   az account set --subscription "Connect 2.0 Production"
   ```

2. **Verify Key Vault access policy:**
   ```bash
   az keyvault set-policy \
     --name connect2-prod-vault \
     --object-id <your-object-id> \
     --secret-permissions get list
   ```

3. **Test secret retrieval:**
   ```bash
   az keyvault secret show \
     --vault-name connect2-prod-vault \
     --name jwt-secret
   ```

### Issue: "Environment variables not loading"

**Symptoms:**
```
console.log(process.env.VITE_API_BASE_URL); // undefined
```

**Solutions (Frontend - Vite):**

1. **Ensure variable starts with VITE_:**
   ```env
   # ❌ Won't work
   API_BASE_URL=http://localhost:3000

   # ✅ Will work
   VITE_API_BASE_URL=http://localhost:3000
   ```

2. **Restart dev server after changing .env:**
   ```bash
   npm run dev
   ```

3. **Check .env file location:**
   ```
   frontend/
   ├── .env          ← Must be here
   ├── src/
   └── vite.config.ts
   ```

**Solutions (Backend - Node.js):**

1. **Ensure dotenv is loaded:**
   ```typescript
   // At the very top of server.ts or index.ts
   import 'dotenv/config';
   ```

2. **Check .env file location:**
   ```
   backend/
   ├── .env          ← Must be here
   ├── src/
   └── package.json
   ```

3. **Verify file is read:**
   ```typescript
   console.log('DATABASE_URL:', process.env.DATABASE_URL);
   ```

---

## Appendix: Quick Reference

### Development Setup Checklist

- [ ] Copy `.env.example` to `.env` in root, backend, and frontend
- [ ] Generate JWT_SECRET: `openssl rand -base64 32`
- [ ] Generate DATA_ENCRYPTION_KEY: `openssl rand -base64 32`
- [ ] Update database password in `.env` and `docker-compose.yml`
- [ ] Start Docker services: `docker-compose up -d`
- [ ] Run database migrations: `cd backend && npm run migrate:latest`
- [ ] Seed development data: `npm run seed`
- [ ] Verify backend: `curl http://localhost:3000/health`
- [ ] Verify frontend: Open `http://localhost:5173`

### Production Deployment Checklist

- [ ] All secrets stored in Azure Key Vault / AWS Secrets Manager
- [ ] JWT_SECRET and DATA_ENCRYPTION_KEY are strong (32+ chars)
- [ ] Database SSL enabled (`DATABASE_SSL=true`)
- [ ] MFA required (`FEATURE_MFA_REQUIRED=true`)
- [ ] Rate limiting enabled
- [ ] CORS restricted to production domain only
- [ ] Logging level set to `warn` or `error`
- [ ] Monitoring configured (Sentry, Datadog)
- [ ] Backups automated and tested
- [ ] Disaster recovery plan documented

### Secret Rotation Schedule

| Secret | Frequency | Method | Owner |
|--------|-----------|--------|-------|
| JWT Signing Key | 180 days | Manual deployment | Security Team |
| Data Encryption Key | 90 days | Manual + re-encryption | Engineering Lead |
| External API Keys | 90 days | Semi-automated | DevOps |
| Database Passwords | 90 days | Automated (cloud provider) | DBA |

### Emergency Contacts

| Issue | Contact | Channel |
|-------|---------|---------|
| Secret Exposed | Security Team | security@blueprint.com |
| Production Outage | On-call Engineer | PagerDuty |
| Key Vault Access | DevOps Team | #devops Slack |
| Database Issues | DBA | dba@blueprint.com |

---

**End of Environment Configuration Guide**
