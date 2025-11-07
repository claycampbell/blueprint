# Repository Setup Guide - Connect 2.0

**Version:** 1.0
**Created:** November 6, 2025
**Status:** Ready for Implementation
**Related Documents:** [SYSTEM_ARCHITECTURE.md](../technical/SYSTEM_ARCHITECTURE.md), [DEVELOPMENT_GUIDE.md](../technical/DEVELOPMENT_GUIDE.md), [BACKLOG_CREATION_PLAN.md](../planning/BACKLOG_CREATION_PLAN.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Repository Strategy Decision](#2-repository-strategy-decision)
3. [Repository Creation Checklist](#3-repository-creation-checklist)
4. [Branch Strategy](#4-branch-strategy)
5. [Directory Structure](#5-directory-structure)
6. [GitHub Actions Workflows](#6-github-actions-workflows)
7. [Required Files](#7-required-files)
8. [GitHub Issue Templates](#8-github-issue-templates)
9. [Pull Request Template](#9-pull-request-template)
10. [Setup Instructions](#10-setup-instructions)

---

## 1. Overview

This guide provides step-by-step instructions for setting up the Connect 2.0 repository infrastructure. It covers repository organization, branch protection, CI/CD workflows, and all necessary configuration files.

**Estimated Setup Time:** 2-3 hours

**Prerequisites:**
- GitHub organization admin access
- Decision on repository strategy (monorepo vs. multi-repo)
- Team member GitHub usernames for access control

---

## 2. Repository Strategy Decision

### 2.1 Option A: Monorepo (Single Repository)

**Structure:** One repository containing both backend and frontend code

```
connect-2.0/
├── backend/
├── frontend/
└── shared/
```

#### Pros
- **Simplified dependency management**: Shared types and utilities in one place
- **Atomic commits**: Backend + frontend changes in single commit
- **Single CI/CD pipeline**: Build and test everything together
- **Easier version control**: Single source of truth for releases
- **Simplified developer setup**: Clone once, install once
- **Better for small-to-medium teams**: Less overhead managing multiple repos

#### Cons
- **Larger repository size**: Slower clone times
- **Coupled deployments**: Backend and frontend deploy together (can be mitigated)
- **Mixed language tooling**: Node.js + React in same repo (minimal issue with workspaces)
- **Repository permissions**: Cannot grant different access to backend vs. frontend

---

### 2.2 Option B: Multi-repo (Separate Repositories)

**Structure:** Two separate repositories

```
connect-2.0-backend/
connect-2.0-frontend/
```

#### Pros
- **Independent versioning**: Backend and frontend have separate release cycles
- **Granular permissions**: Different teams can have different access levels
- **Smaller repositories**: Faster clone times
- **Independent deployments**: Backend can deploy without frontend changes
- **Language-specific tooling**: Each repo optimized for its stack

#### Cons
- **Complex dependency management**: Shared types must be published as npm package
- **Cross-repo changes**: Requires multiple PRs and coordination
- **More CI/CD pipelines**: Duplicate configuration across repos
- **Developer setup complexity**: Must clone and configure multiple repos
- **Versioning challenges**: Must track compatibility between backend and frontend versions

---

### 2.3 Recommendation: Monorepo

**For Connect 2.0, we recommend the monorepo approach.**

**Rationale:**
1. **Team Size**: Blueprint is "Client Zero" with a single development team working on both backend and frontend
2. **Tight Coupling**: Connect 2.0's frontend and backend are tightly coupled (not a public API scenario)
3. **Shared Types**: TypeScript types for API contracts, data models, and business logic are shared
4. **Atomic Changes**: Features often require backend + frontend changes together
5. **Simpler DevOps**: Single CI/CD pipeline, single deployment process (initially)
6. **MVP Timeline**: 90-180 day timeline benefits from reduced overhead

**Modern Tools Support Monorepos:**
- **npm workspaces**: Built-in support for monorepo structure
- **Turborepo**: Fast build system for monorepos (optional, can add later)
- **GitHub Actions**: Can run different jobs for backend vs. frontend

**When to Reconsider:**
- Post-MVP (Day 180+) if Connect 2.0 becomes multi-tenant SaaS with independent services
- If backend and frontend teams diverge into separate organizations
- If API needs to be versioned independently for external consumers

---

## 3. Repository Creation Checklist

### 3.1 GitHub Organization Setup

#### Step 1: Create GitHub Organization (if not exists)
```
Organization Name: blueprint-capital or datapage-platform
```

#### Step 2: Create Repository

**Repository Name:** `connect-2.0` (for monorepo)

**Settings:**
- Visibility: **Private** (Blueprint IP, not open source)
- Description: "Connect 2.0 - Next-generation unified platform for construction lending lifecycle management"
- Initialize with README: **No** (we'll create custom README)
- .gitignore: **None** (we'll create custom)
- License: **None** (proprietary, Blueprint/Datapage IP)

**Command Line Creation:**
```bash
# Using GitHub CLI
gh repo create blueprint-capital/connect-2.0 \
  --private \
  --description "Connect 2.0 - Construction lending platform" \
  --disable-issues=false \
  --disable-wiki=true
```

---

### 3.2 Repository Settings

Navigate to **Settings** in GitHub:

#### General Settings
- [ ] **Default branch**: `main`
- [ ] **Allow merge commits**: Enabled
- [ ] **Allow squash merging**: Enabled (default for PRs)
- [ ] **Allow rebase merging**: Enabled
- [ ] **Automatically delete head branches**: Enabled (clean up after PR merge)

#### Features
- [ ] **Issues**: Enabled (for backlog tracking)
- [ ] **Projects**: Enabled (for kanban board)
- [ ] **Wiki**: Disabled (use docs/ folder instead)
- [ ] **Discussions**: Disabled (use Issues for now)

#### Pull Requests
- [ ] **Allow squash merging**: Enabled, default
- [ ] **Default squash merge commit message**: "Pull request title and description"
- [ ] **Suggest updating pull request branches**: Enabled

---

### 3.3 Branch Protection Rules

#### Protect `main` Branch

Navigate to **Settings > Branches > Add rule**

**Branch name pattern:** `main`

**Protection rules:**
- [x] **Require a pull request before merging**
  - [x] Require approvals: **1** (increase to 2 post-MVP)
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [ ] Require review from Code Owners (enable once CODEOWNERS file is created)
  - [ ] Require approval of the most recent reviewable push
- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Status checks (add after CI is set up):
    - `test-backend`
    - `test-frontend`
    - `lint-backend`
    - `lint-frontend`
    - `build-backend`
    - `build-frontend`
- [x] **Require conversation resolution before merging**
- [ ] **Require signed commits** (optional, for high security)
- [x] **Require linear history** (no merge commits, squash or rebase only)
- [x] **Include administrators** (even admins must follow rules)
- [x] **Restrict who can push to matching branches**
  - Add team: `@blueprint-capital/core-devs`
- [ ] **Allow force pushes** (disabled)
- [ ] **Allow deletions** (disabled)

#### Protect `develop` Branch (if using GitFlow)

**Branch name pattern:** `develop`

Same rules as `main`, but:
- Require approvals: **1**
- Status checks: Same as main

---

### 3.4 Team Permissions

Create GitHub teams and assign permissions:

#### Teams

| Team Name | Description | Repository Access |
|-----------|-------------|-------------------|
| `@blueprint-capital/admins` | PLT members, lead engineers | **Admin** |
| `@blueprint-capital/core-devs` | Full-time developers | **Write** |
| `@blueprint-capital/contractors` | Contract developers | **Write** (specific branches) |
| `@blueprint-capital/reviewers` | Stakeholders, product owners | **Read** |

**Create teams:**
```bash
# Using GitHub CLI
gh api orgs/blueprint-capital/teams -f name="core-devs" -f privacy="closed"
```

**Assign members:**
```bash
# Add user to team
gh api orgs/blueprint-capital/teams/core-devs/memberships/USERNAME -X PUT
```

---

## 4. Branch Strategy

### 4.1 Branch Naming Convention

Use the following format for all branches:

```
<type>/<epic-id>-<task-id>-<short-description>

Examples:
feature/E4-T1-create-projects-table
feature/E6-T7-build-entitlement-ui
bugfix/E9-T5-fix-loan-status-validation
hotfix/critical-auth-token-expiry
chore/E15-T1-setup-github-actions
docs/update-api-documentation
```

#### Branch Type Prefixes

| Prefix | Purpose | Base Branch | Target Branch |
|--------|---------|-------------|---------------|
| `feature/` | New feature development | `develop` or `main` | `develop` or `main` |
| `bugfix/` | Bug fixes during development | `develop` | `develop` |
| `hotfix/` | Critical production fixes | `main` | `main` + `develop` |
| `chore/` | Maintenance, tooling, refactoring | `develop` | `develop` |
| `docs/` | Documentation only | `develop` | `develop` |
| `test/` | Test infrastructure | `develop` | `develop` |
| `experiment/` | Proof-of-concept, spikes | `develop` | (may not merge) |

---

### 4.2 Main Branch Workflow (Recommended)

**Simplified Git Flow for MVP speed:**

```
main (production-ready)
  ├── feature/E4-T1-projects-table
  ├── feature/E6-T7-entitlement-ui
  └── hotfix/critical-bug
```

**Workflow:**
1. All feature branches created from `main`
2. Developers work on feature branches
3. Pull requests merge into `main` (after CI passes and review)
4. `main` is always production-ready
5. Hotfixes branch from `main`, merge back to `main`

**Advantages:**
- Simple mental model
- Fast PR turnaround
- CI/CD triggers on every merge to `main`
- Suitable for small teams and MVP phase

---

### 4.3 GitFlow Workflow (Optional, Post-MVP)

**Use if you need separation between development and production:**

```
main (production)
  └── develop (integration)
        ├── feature/E4-T1-projects-table
        ├── feature/E6-T7-entitlement-ui
        └── release/v1.0.0
```

**Workflow:**
1. Feature branches created from `develop`
2. Pull requests merge into `develop`
3. When ready for release, create `release/v1.0.0` from `develop`
4. After testing, merge `release/v1.0.0` into `main` and tag
5. Hotfixes branch from `main`, merge to `main` and `develop`

**Advantages:**
- Clear separation of production vs. in-development code
- Supports formal release cycles
- Better for larger teams

**Recommendation:** Start with **Main Branch Workflow** for MVP (Days 1-180), consider GitFlow post-MVP if needed.

---

### 4.4 Hotfix Process

For critical production bugs:

1. **Create hotfix branch from `main`:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-auth-token-expiry
   ```

2. **Fix the issue, commit, push:**
   ```bash
   git add .
   git commit -m "fix(auth): resolve JWT token expiration bug"
   git push origin hotfix/critical-auth-token-expiry
   ```

3. **Create PR to `main` with "HOTFIX" label**

4. **Fast-track review** (1 approval, expedited testing)

5. **Merge to `main`, deploy immediately**

6. **Backport to `develop`** (if using GitFlow)

---

## 5. Directory Structure

### 5.1 Monorepo Structure

```
connect-2.0/
├── .github/                          # GitHub configuration
│   ├── workflows/                    # GitHub Actions CI/CD
│   │   ├── ci.yml                    # Main CI pipeline
│   │   ├── deploy-staging.yml        # Staging deployment
│   │   └── deploy-production.yml     # Production deployment
│   ├── ISSUE_TEMPLATE/               # Issue templates
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── task.md
│   ├── pull_request_template.md      # PR template
│   └── CODEOWNERS                    # Code ownership rules
│
├── backend/                          # Node.js/TypeScript backend
│   ├── src/
│   │   ├── modules/                  # Feature modules
│   │   │   ├── projects/             # Project management
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── repositories/
│   │   │   │   ├── models/
│   │   │   │   ├── validators/
│   │   │   │   └── routes.ts
│   │   │   ├── feasibility/
│   │   │   ├── entitlement/
│   │   │   ├── loans/
│   │   │   ├── servicing/
│   │   │   ├── contacts/
│   │   │   ├── documents/
│   │   │   ├── tasks/
│   │   │   └── auth/
│   │   ├── shared/                   # Shared utilities
│   │   │   ├── database/
│   │   │   │   ├── connection.ts
│   │   │   │   └── client.ts
│   │   │   ├── events/               # Event bus
│   │   │   │   └── eventBus.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── rbac.ts
│   │   │   │   ├── errorHandler.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── logger.ts
│   │   │   ├── utils/
│   │   │   │   ├── logger.ts
│   │   │   │   ├── asyncHandler.ts
│   │   │   │   ├── pagination.ts
│   │   │   │   └── validators.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   ├── integrations/             # External integrations
│   │   │   ├── bpo/
│   │   │   │   └── bpoAdapter.ts
│   │   │   ├── docusign/
│   │   │   │   └── docusignAdapter.ts
│   │   │   ├── azureAI/
│   │   │   │   └── documentIntelligenceAdapter.ts
│   │   │   ├── email/
│   │   │   │   └── emailService.ts
│   │   │   └── sms/
│   │   │       └── smsService.ts
│   │   ├── config/                   # Configuration
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   ├── auth.ts
│   │   │   └── integrations.ts
│   │   ├── app.ts                    # Express app setup
│   │   └── server.ts                 # Server entry point
│   ├── tests/                        # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   ├── e2e/
│   │   └── fixtures/
│   ├── migrations/                   # Database migrations
│   │   ├── 001_create_users_table.ts
│   │   ├── 002_create_projects_table.ts
│   │   └── ...
│   ├── seeds/                        # Seed data
│   │   ├── 001_users.ts
│   │   └── 002_projects.ts
│   ├── scripts/                      # Utility scripts
│   │   ├── generate-migration.sh
│   │   └── seed-dev-data.sh
│   ├── .env.example                  # Environment variables template
│   ├── .eslintrc.json                # ESLint configuration
│   ├── .prettierrc                   # Prettier configuration
│   ├── jest.config.js                # Jest test configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── package.json                  # Backend dependencies
│   └── README.md                     # Backend-specific README
│
├── frontend/                         # React frontend
│   ├── public/                       # Static assets
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── src/
│   │   ├── pages/                    # Page components (routes)
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Dashboard.test.tsx
│   │   │   │   └── Dashboard.module.css
│   │   │   ├── Projects/
│   │   │   │   ├── ProjectList.tsx
│   │   │   │   ├── ProjectDetail.tsx
│   │   │   │   └── ProjectForm.tsx
│   │   │   ├── Entitlement/
│   │   │   ├── Loans/
│   │   │   ├── Servicing/
│   │   │   ├── Settings/
│   │   │   └── Login/
│   │   ├── components/               # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Modal/
│   │   │   │   ├── Table/
│   │   │   │   ├── Spinner/
│   │   │   │   └── Toast/
│   │   │   ├── forms/
│   │   │   │   ├── FormField.tsx
│   │   │   │   ├── FormSelect.tsx
│   │   │   │   └── FormDatePicker.tsx
│   │   │   ├── layouts/
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Header.tsx
│   │   │   └── features/             # Feature-specific components
│   │   │       ├── projects/
│   │   │       ├── loans/
│   │   │       └── documents/
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useProjects.ts
│   │   │   ├── useLoans.ts
│   │   │   ├── useDocuments.ts
│   │   │   └── useToast.ts
│   │   ├── services/                 # API client
│   │   │   ├── api.ts                # Axios instance
│   │   │   ├── authApi.ts
│   │   │   ├── projectsApi.ts
│   │   │   ├── loansApi.ts
│   │   │   └── documentsApi.ts
│   │   ├── stores/                   # State management (Zustand)
│   │   │   ├── authStore.ts
│   │   │   ├── uiStore.ts
│   │   │   └── notificationStore.ts
│   │   ├── utils/                    # Helper functions
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── constants.ts
│   │   │   └── dateHelpers.ts
│   │   ├── types/                    # TypeScript types
│   │   │   ├── index.ts
│   │   │   ├── api.ts
│   │   │   └── models.ts
│   │   ├── styles/                   # Global styles
│   │   │   ├── globals.css
│   │   │   └── variables.css
│   │   ├── App.tsx                   # Root component
│   │   ├── main.tsx                  # Entry point
│   │   └── router.tsx                # React Router config
│   ├── tests/                        # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── .env.example                  # Environment variables template
│   ├── .eslintrc.json                # ESLint configuration
│   ├── .prettierrc                   # Prettier configuration
│   ├── vitest.config.ts              # Vitest test configuration
│   ├── vite.config.ts                # Vite build configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── package.json                  # Frontend dependencies
│   └── README.md                     # Frontend-specific README
│
├── shared/                           # Shared code (types, utils)
│   ├── types/                        # Shared TypeScript types
│   │   ├── project.ts
│   │   ├── loan.ts
│   │   ├── contact.ts
│   │   └── api.ts
│   ├── constants/
│   │   └── index.ts
│   └── package.json
│
├── docs/                             # Documentation
│   ├── technical/
│   │   ├── SYSTEM_ARCHITECTURE.md
│   │   ├── API_SPECIFICATION.md
│   │   ├── DATABASE_SCHEMA.md
│   │   ├── INTEGRATION_SPECIFICATIONS.md
│   │   ├── TESTING_STRATEGY.md
│   │   ├── SECURITY_COMPLIANCE.md
│   │   └── DEPLOYMENT_DEVOPS.md
│   ├── planning/
│   │   ├── BACKLOG_CREATION_PLAN.md
│   │   └── backlogs/
│   │       ├── EPIC_E4_LEAD_PROJECT_MANAGEMENT.md
│   │       └── ...
│   ├── project/
│   │   ├── REPOSITORY_SETUP_GUIDE.md (this file)
│   │   └── ONBOARDING.md
│   └── user-guides/
│       ├── entitlement-coordinator-guide.md
│       └── servicing-officer-guide.md
│
├── infrastructure/                   # Infrastructure as Code
│   ├── terraform/                    # Terraform configs
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── kubernetes/                   # Kubernetes manifests
│   │   ├── deployments/
│   │   └── services/
│   └── docker/
│       ├── backend.Dockerfile
│       └── frontend.Dockerfile
│
├── .gitignore                        # Git ignore rules
├── .editorconfig                     # Editor configuration
├── .nvmrc                            # Node.js version (v20.x)
├── docker-compose.yml                # Docker Compose for local dev
├── package.json                      # Root package.json (workspaces)
├── README.md                         # Project README
├── LICENSE                           # License file (proprietary)
├── CONTRIBUTING.md                   # Contribution guidelines
├── CODE_OF_CONDUCT.md                # Code of conduct
└── CHANGELOG.md                      # Version changelog
```

---

### 5.2 Multi-repo Structure (Alternative)

If you choose multi-repo, create two repositories:

#### Backend Repository: `connect-2.0-backend`

```
connect-2.0-backend/
├── src/
├── tests/
├── migrations/
├── seeds/
├── .github/
├── package.json
└── README.md
```

#### Frontend Repository: `connect-2.0-frontend`

```
connect-2.0-frontend/
├── src/
├── tests/
├── public/
├── .github/
├── package.json
└── README.md
```

#### Shared Types Package: `@blueprint/connect-types`

Publish shared types as a private npm package:

```
connect-2.0-types/
├── src/
│   ├── project.ts
│   ├── loan.ts
│   └── index.ts
├── package.json (name: "@blueprint/connect-types")
└── tsconfig.json
```

Consume in both repos:
```json
// backend/package.json
{
  "dependencies": {
    "@blueprint/connect-types": "^1.0.0"
  }
}
```

---

## 6. GitHub Actions Workflows

### 6.1 CI Workflow (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  lint-backend:
    name: Lint Backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      - name: Run ESLint
        run: |
          cd backend
          npm run lint

  lint-frontend:
    name: Lint Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Run ESLint
        run: |
          cd frontend
          npm run lint

  test-backend:
    name: Test Backend
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
          POSTGRES_DB: connect2_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      - name: Run migrations
        run: |
          cd backend
          npm run migrate:latest
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/connect2_test
      - name: Run tests
        run: |
          cd backend
          npm test -- --coverage
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/connect2_test
          REDIS_URL: redis://localhost:6379
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info
          flags: backend

  test-frontend:
    name: Test Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Run tests
        run: |
          cd frontend
          npm test -- --coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info
          flags: frontend

  build-backend:
    name: Build Backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      - name: Build
        run: |
          cd backend
          npm run build

  build-frontend:
    name: Build Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: https://api-staging.blueprint.com/v1

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

---

### 6.2 Deploy to Staging (`.github/workflows/deploy-staging.yml`)

```yaml
name: Deploy to Staging

on:
  push:
    branches: [develop]  # or main, depending on strategy

jobs:
  deploy:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.blueprint.com
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push backend Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: connect-2.0-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Build and push frontend Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: connect-2.0-frontend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./frontend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster connect-2.0-staging \
            --service backend \
            --force-new-deployment
          aws ecs update-service \
            --cluster connect-2.0-staging \
            --service frontend \
            --force-new-deployment

      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Staging deployment complete: ${{ github.sha }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

### 6.3 Deploy to Production (`.github/workflows/deploy-production.yml`)

```yaml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*.*.*'  # Trigger on version tags (e.g., v1.0.0)

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://connect.blueprint.com
    steps:
      - uses: actions/checkout@v4

      # ... (similar steps to staging, but with production ECS cluster)

      - name: Run database migrations
        run: |
          # SSH into backend instance or use ECS exec
          npm run migrate:latest
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}

      - name: Deploy to Production ECS
        run: |
          aws ecs update-service \
            --cluster connect-2.0-production \
            --service backend \
            --force-new-deployment

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            Production deployment of ${{ github.ref }}
          draft: false
          prerelease: false
```

---

## 7. Required Files

### 7.1 Root README.md

```markdown
# Connect 2.0

Next-generation unified platform for construction lending lifecycle management.

## Overview

Connect 2.0 is a modern, cloud-native platform that unifies lead intake, feasibility analysis, entitlement tracking, loan origination, and servicing into a single system. Built for Blueprint Capital (Client Zero) with multi-tenancy planned for Datapage commercialization.

## Quick Start

### Prerequisites
- Node.js 20.x
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/blueprint-capital/connect-2.0.git
cd connect-2.0

# Install dependencies (both backend and frontend)
npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your configuration

# Start Docker services (PostgreSQL + Redis)
docker-compose up -d

# Run database migrations
cd backend
npm run migrate:latest
npm run seed:run

# Start backend (in one terminal)
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

Visit http://localhost:5173 to access the application.

**Default Login:**
- Email: admin@blueprint.com
- Password: Admin123!

## Documentation

- [System Architecture](docs/technical/SYSTEM_ARCHITECTURE.md)
- [API Specification](docs/technical/API_SPECIFICATION.md)
- [Database Schema](docs/technical/DATABASE_SCHEMA.md)
- [Development Guide](docs/technical/DEVELOPMENT_GUIDE.md)
- [Testing Strategy](docs/technical/TESTING_STRATEGY.md)

## Project Structure

```
connect-2.0/
├── backend/          # Node.js/TypeScript API
├── frontend/         # React SPA
├── shared/           # Shared types and utilities
├── docs/             # Documentation
└── infrastructure/   # IaC (Terraform, Kubernetes)
```

## Technology Stack

**Backend:**
- Node.js 20 + TypeScript
- Fastify (web framework)
- PostgreSQL (database)
- Redis (cache)
- Prisma (ORM)

**Frontend:**
- React 18
- TypeScript
- Vite (build tool)
- Zustand (state management)
- React Query (data fetching)

**Infrastructure:**
- AWS / Azure (cloud provider)
- Docker + Kubernetes
- GitHub Actions (CI/CD)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow and coding standards.

## License

Proprietary - Blueprint Capital / Datapage Platform
```

---

### 7.2 .gitignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output/
*.lcov

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# OS
Thumbs.db

# Database
*.sqlite
*.sqlite3
*.db

# Secrets and credentials
*.pem
*.key
credentials.json
service-account.json

# Docker
.docker/

# Terraform
infrastructure/terraform/.terraform/
infrastructure/terraform/*.tfstate
infrastructure/terraform/*.tfstate.backup
infrastructure/terraform/.terraform.lock.hcl

# Misc
.cache/
temp/
tmp/
```

---

### 7.3 .env.example (Backend)

```bash
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://connect2_user:password@localhost:5432/connect2_dev
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=30d

# SendGrid (Email)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@blueprint.com

# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+12065550100

# DocuSign
DOCUSIGN_INTEGRATION_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DOCUSIGN_USER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DOCUSIGN_ACCOUNT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Azure Document Intelligence
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# AWS S3 (Document Storage)
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-west-2
AWS_S3_BUCKET=connect2-dev-documents

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Feature Flags
FEATURE_FLAG_MULTI_TENANCY=false
FEATURE_FLAG_AI_SUGGESTIONS=true
```

---

### 7.4 .env.example (Frontend)

```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_FEATURE_MULTI_TENANCY=false
VITE_FEATURE_AI_SUGGESTIONS=true
```

---

### 7.5 LICENSE

```
Proprietary License

Copyright (c) 2025 Blueprint Capital / Datapage Platform

All rights reserved.

This software and associated documentation files (the "Software") are the
proprietary and confidential information of Blueprint Capital and Datapage
Platform. You may not use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software without express written permission.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

### 7.6 CONTRIBUTING.md

```markdown
# Contributing to Connect 2.0

## Development Workflow

1. **Claim a task** from the GitHub Project backlog
2. **Create a feature branch** using the naming convention:
   ```
   feature/E#-T#-short-description
   ```
3. **Write code** following our coding standards
4. **Write tests** (unit + integration)
5. **Run linter and tests locally**:
   ```bash
   npm run lint
   npm test
   ```
6. **Commit** using Conventional Commits format:
   ```
   feat(loans): add payment calculator endpoint
   ```
7. **Push** and create a **Pull Request**
8. **Request review** from at least 1 team member
9. **Address feedback** and resolve conversations
10. **Merge** when approved and CI passes

## Coding Standards

### TypeScript
- Use strict mode
- No `any` types (use `unknown` if needed)
- Prefer interfaces over types for object shapes
- Use functional components in React

### Naming Conventions
- Files: kebab-case (`loan-service.ts`)
- Classes: PascalCase (`LoanService`)
- Functions: camelCase (`calculatePayment`)
- Constants: UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE`)

### Testing
- Unit test coverage: > 80%
- Every API endpoint must have integration test
- Critical user flows must have E2E test

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(loans): add monthly payment calculator

Implements calculation based on principal, rate, and term.
Includes validation for input parameters.

Closes #123
```

## Pull Request Guidelines

- Title should follow commit message format
- Description should explain "why" not "what"
- Link related issues using "Closes #123"
- Include screenshots for UI changes
- Mark breaking changes clearly
```

---

### 7.7 CODE_OF_CONDUCT.md

```markdown
# Code of Conduct

## Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the team and project
- Showing empathy towards other community members

**Unacceptable behavior:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project team. All complaints will be reviewed and investigated promptly and fairly.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org/), version 2.1.
```

---

## 8. GitHub Issue Templates

### 8.1 Bug Report (`.github/ISSUE_TEMPLATE/bug_report.md`)

```markdown
---
name: Bug Report
about: Report a bug to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- Browser: [e.g., Chrome 118]
- OS: [e.g., macOS 14.0]
- Connect 2.0 Version: [e.g., v1.2.3]

## Additional Context
Add any other context about the problem here.

## Possible Solution
(Optional) Suggest a fix or reason for the bug.
```

---

### 8.2 Feature Request (`.github/ISSUE_TEMPLATE/feature_request.md`)

```markdown
---
name: Feature Request
about: Suggest a new feature for Connect 2.0
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Feature Description
A clear and concise description of the feature you'd like to see.

## User Story
**As a** [persona],
**I need to** [action],
**So that** [benefit].

## Problem Statement
What problem does this feature solve? Why is it needed?

## Proposed Solution
Describe how you envision this feature working.

## Alternatives Considered
Describe alternative solutions or features you've considered.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Additional Context
Add any other context, mockups, or examples about the feature request here.

## Priority
- [ ] P0 - Blocker (prevents MVP launch)
- [ ] P1 - Critical (core functionality)
- [ ] P2 - Important (enhances experience)
- [ ] P3 - Nice-to-have (future enhancement)
```

---

### 8.3 Task (`.github/ISSUE_TEMPLATE/task.md`)

```markdown
---
name: Task
about: Create a development task from the backlog
title: '[E#-T#] '
labels: task
assignees: ''
---

## Task Description
Clear description of the task to be completed.

## Related Epic
Epic #[number] - [Epic Name]

## Related User Story
User Story #[number] - [User Story Title]

## Technical Details

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Dependencies
- Depends on: #[task number]
- Blocks: #[task number]

### Technical References
- API Spec: [section reference]
- Database Schema: [table name]
- Related Documentation: [link]

## Implementation Notes
(Optional) Technical approach, considerations, or constraints.

## Estimates
- **Story Points**: [1/2/3/5/8/13]
- **Estimated Hours**: [hours]

## Definition of Done
- [ ] Code written and follows style guide
- [ ] Unit tests written (> 80% coverage)
- [ ] Integration tests written (if applicable)
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] QA tested (if applicable)
```

---

## 9. Pull Request Template

### `.github/pull_request_template.md`

```markdown
## Description
Brief description of what this PR does.

## Related Issues
- Closes #[issue number]
- Related to #[issue number]

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Checklist
- [ ] Unit tests pass locally
- [ ] Integration tests pass locally
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed
- [ ] Code coverage maintained or improved

## Screenshots (for UI changes)
| Before | After |
|--------|-------|
| [screenshot] | [screenshot] |

## Deployment Notes
Any special deployment considerations (database migrations, environment variables, etc.)

## Rollback Plan
How to rollback this change if issues arise in production.

## Reviewer Notes
Any specific areas you'd like reviewers to focus on.

---

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

---

## 10. Setup Instructions

### 10.1 Step-by-Step Repository Creation

Execute these commands to set up the Connect 2.0 repository from scratch:

```bash
# Step 1: Create local directory
mkdir connect-2.0
cd connect-2.0

# Step 2: Initialize Git
git init
git branch -M main

# Step 3: Create directory structure
mkdir -p .github/workflows
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p backend/src/{modules,shared,integrations,config}
mkdir -p backend/{tests,migrations,seeds,scripts}
mkdir -p frontend/src/{pages,components,hooks,services,stores,utils,types,styles}
mkdir -p frontend/{tests,public}
mkdir -p shared/types
mkdir -p docs/{technical,planning,project,user-guides}
mkdir -p infrastructure/{terraform,kubernetes,docker}

# Step 4: Create required files
touch README.md
touch .gitignore
touch .editorconfig
touch .nvmrc
touch docker-compose.yml
touch package.json
touch LICENSE
touch CONTRIBUTING.md
touch CODE_OF_CONDUCT.md
touch CHANGELOG.md

# Backend files
touch backend/.env.example
touch backend/.eslintrc.json
touch backend/.prettierrc
touch backend/jest.config.js
touch backend/tsconfig.json
touch backend/package.json
touch backend/README.md
touch backend/src/app.ts
touch backend/src/server.ts

# Frontend files
touch frontend/.env.example
touch frontend/.eslintrc.json
touch frontend/.prettierrc
touch frontend/vitest.config.ts
touch frontend/vite.config.ts
touch frontend/tsconfig.json
touch frontend/package.json
touch frontend/README.md
touch frontend/src/App.tsx
touch frontend/src/main.tsx

# GitHub files
touch .github/workflows/ci.yml
touch .github/workflows/deploy-staging.yml
touch .github/workflows/deploy-production.yml
touch .github/ISSUE_TEMPLATE/bug_report.md
touch .github/ISSUE_TEMPLATE/feature_request.md
touch .github/ISSUE_TEMPLATE/task.md
touch .github/pull_request_template.md
touch .github/CODEOWNERS

# Step 5: Populate key files (copy content from sections above)
# ... (manually copy content into files)

# Step 6: Create root package.json for workspace
cat > package.json << 'EOF'
{
  "name": "connect-2.0",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "backend",
    "frontend",
    "shared"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=backend & npm run dev --workspace=frontend",
    "test": "npm test --workspaces",
    "lint": "npm run lint --workspaces",
    "build": "npm run build --workspaces"
  }
}
EOF

# Step 7: Create .nvmrc (Node.js version)
echo "20" > .nvmrc

# Step 8: Create .editorconfig
cat > .editorconfig << 'EOF'
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
EOF

# Step 9: Create GitHub repository (using GitHub CLI)
gh repo create blueprint-capital/connect-2.0 \
  --private \
  --description "Connect 2.0 - Construction lending platform" \
  --disable-wiki

# Step 10: Add remote and push
git remote add origin git@github.com:blueprint-capital/connect-2.0.git
git add .
git commit -m "chore: initial repository setup

- Set up monorepo structure (backend, frontend, shared)
- Add GitHub Actions CI/CD workflows
- Add issue and PR templates
- Add documentation structure
- Configure ESLint, Prettier, TypeScript"
git push -u origin main

# Step 11: Create develop branch (if using GitFlow)
git checkout -b develop
git push -u origin develop

# Step 12: Set up branch protection (via GitHub web UI or API)
gh api repos/blueprint-capital/connect-2.0/branches/main/protection \
  -X PUT \
  -F required_status_checks='{"strict":true,"contexts":["test-backend","test-frontend","lint-backend","lint-frontend"]}' \
  -F enforce_admins=true \
  -F required_pull_request_reviews='{"required_approving_review_count":1}' \
  -F restrictions=null

echo "Repository setup complete!"
echo "Next steps:"
echo "1. Configure branch protection rules in GitHub UI"
echo "2. Add team members with appropriate permissions"
echo "3. Create GitHub Project for backlog tracking"
echo "4. Populate backend and frontend package.json files"
echo "5. Set up environment secrets in GitHub Actions"
```

---

### 10.2 Post-Setup Checklist

After running the setup script, complete these manual steps:

- [ ] **Configure branch protection** (Settings > Branches)
  - [ ] Main branch requires 1 approval
  - [ ] Status checks required
  - [ ] Conversation resolution required
- [ ] **Create GitHub teams** (`@blueprint-capital/core-devs`)
- [ ] **Assign team permissions**
- [ ] **Create GitHub Project** for backlog (Kanban board)
- [ ] **Set up GitHub Secrets** (Settings > Secrets and variables > Actions)
  - [ ] `AWS_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY`
  - [ ] `PRODUCTION_DATABASE_URL`
  - [ ] `SLACK_WEBHOOK_URL` (for notifications)
  - [ ] `CODECOV_TOKEN` (for code coverage)
- [ ] **Populate .env files** with actual credentials (local development)
- [ ] **Install dependencies**:
  ```bash
  npm install
  ```
- [ ] **Verify CI pipeline** by creating a test PR

---

### 10.3 Verification

To verify the repository is set up correctly:

```bash
# 1. Verify directory structure
tree -L 2 -I 'node_modules'

# 2. Verify npm workspaces
npm run test --workspaces --if-present

# 3. Verify Git configuration
git remote -v
git branch -a

# 4. Verify branch protection
gh api repos/blueprint-capital/connect-2.0/branches/main/protection

# 5. Create test PR to trigger CI
git checkout -b test/verify-ci
echo "# Test" > TEST.md
git add TEST.md
git commit -m "test: verify CI pipeline"
git push origin test/verify-ci
gh pr create --title "Test: Verify CI" --body "Testing CI/CD setup"
```

---

## Appendix A: CODEOWNERS Example

`.github/CODEOWNERS`:

```
# Global ownership
* @blueprint-capital/core-devs

# Backend ownership
/backend/ @blueprint-capital/backend-team

# Frontend ownership
/frontend/ @blueprint-capital/frontend-team

# Infrastructure ownership
/infrastructure/ @blueprint-capital/devops-team
/.github/workflows/ @blueprint-capital/devops-team

# Documentation requires PLT review
/docs/technical/ @blueprint-capital/tech-leads
/docs/planning/ @blueprint-capital/product-team

# Database migrations require DBA review
/backend/migrations/ @blueprint-capital/database-admins

# Security-sensitive files require security review
**/auth*.ts @blueprint-capital/security-team
**/security*.ts @blueprint-capital/security-team
.github/workflows/*.yml @blueprint-capital/devops-team
```

---

## Appendix B: docker-compose.yml Example

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: connect2-postgres
    environment:
      POSTGRES_USER: connect2_user
      POSTGRES_PASSWORD: connect2_pass
      POSTGRES_DB: connect2_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U connect2_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: connect2-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: connect2-backend
    environment:
      DATABASE_URL: postgresql://connect2_user:connect2_pass@postgres:5432/connect2_dev
      REDIS_URL: redis://redis:6379
      NODE_ENV: development
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: npm run dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: connect2-frontend
    environment:
      VITE_API_URL: http://localhost:3000/api/v1
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
```

---

## Document Change Log

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2025-11-06 | 1.0 | Initial repository setup guide | Claude Code |

---

**End of Repository Setup Guide**
