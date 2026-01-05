# Connect 2.0 Web

React-based frontend application for the Connect 2.0 platform.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

The app runs at http://localhost:3000.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **State Management:** TanStack Query (server) + Zustand (client)
- **Testing:** Vitest + React Testing Library
- **Styling:** CSS Modules
- **Linting:** ESLint + Prettier

## Project Structure

```
src/
├── app/               # App shell, routes, providers
├── pages/             # Route pages
├── api/               # TanStack Query hooks
├── stores/            # Zustand stores
├── features/          # Feature modules
├── components/        # Shared components
│   ├── ui/            # Primitives (Button, Input)
│   └── common/        # Composed (DataTable)
├── hooks/             # Shared hooks
├── lib/               # Utilities
├── styles/            # Global CSS
└── types/             # TypeScript types

infrastructure/
└── terraform/
    ├── environments/  # dev, staging, prod configs
    │   ├── dev/
    │   ├── staging/
    │   └── prod/
    └── modules/       # Terraform modules
        ├── networking/      # VPC, subnets, NAT
        ├── ecs-cluster/     # Fargate cluster
        ├── ecs-service/     # ECS service
        ├── alb/             # Load balancer
        ├── ecr/             # Container registry
        ├── acm/             # SSL certificates
        ├── dns-record/      # Route53 records
        ├── route53-zone/    # DNS zone
        └── sns-alerts/      # Alerting

tests/                 # Test suite
scripts/               # Utility scripts
```

## Infrastructure

This repository includes its own complete AWS infrastructure:

| Resource | Description |
|----------|-------------|
| VPC | 10.2.0.0/16 with public/private subnets |
| ECS Cluster | Fargate capacity provider |
| ALB | Load balancer for app.connect.com |
| ECR | Container registry |
| Route53 | DNS management |

### Environments

| Environment | State Bucket | Domain |
|-------------|--------------|--------|
| dev | `connect2-web-terraform-state-dev` | app-dev.connect.com |
| staging | `connect2-web-terraform-state-staging` | app-staging.connect.com |
| prod | `connect2-web-terraform-state-prod` | app.connect.com |

### Deploying Infrastructure

```bash
cd infrastructure/terraform/environments/dev

# Initialize
terraform init

# Plan
terraform plan -var-file=dev.tfvars

# Apply
terraform apply -var-file=dev.tfvars
```

## Contributing

### Branch Strategy

```
development  →  Dev environment
staging      →  Staging environment
main         →  Production environment
```

### PR Guidelines

#### Keep Infrastructure and Code Separate

**Never mix infrastructure changes and application code in the same PR.**

| PR Type | Contains | Examples |
|---------|----------|----------|
| **Code PR** | React components, hooks, tests, styles | `feat: add login page` |
| **Infrastructure PR** | Terraform, Docker, GitHub Actions | `infra: increase task memory` |

**Why?**
- Clean rollbacks - revert one without affecting the other
- Easier reviews - focus on one type of change
- Simpler debugging - know exactly what changed

**Example - Adding a feature that needs new infrastructure:**

```
1. PR #1: "infra: Add CloudFront CDN" → merge, wait for deploy
2. PR #2: "feat: Use CDN for static assets" → merge
```

### Workflow

1. Create feature branch from `development`
2. Make changes, write tests
3. Run pre-commit checks: `npm run lint && npx tsc --noEmit && npm run test -- --run`
4. Create PR to `development`
5. Wait for CI (lint, type-check, test, build)
6. Get code review
7. Merge → auto-deploys to Dev

To promote to staging/production:
- Create PR from `development` → `staging` → `main`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint -- --fix` | Fix linting issues |
| `npm run test` | Run tests in watch mode |
| `npm run test -- --run` | Run tests once |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage |
| `npx tsc --noEmit` | Type check |

## Documentation

- [App Quickstart](docs/technical/APP_QUICKSTART.md) - Setup and development guide
- [Frontend Architecture](docs/technical/FRONTEND_ARCHITECTURE.md) - Architecture patterns
- [Infrastructure](docs/technical/INFRASTRUCTURE.md) - AWS infrastructure details
- [GitHub Actions](docs/technical/GITHUB_ACTIONS.md) - CI/CD workflows
- [Deployment Runbook](docs/runbooks/DEPLOYMENT.md) - Deployment procedures
- [Rollback Runbook](docs/runbooks/ROLLBACK.md) - Rollback procedures

## Environment Variables

Key environment variables (see `.env.example` for full list):

```bash
# API Configuration
VITE_API_URL=http://localhost:8000/api/v1

# Feature Flags
VITE_FEATURE_DARK_MODE=true
```

## API Connection

This frontend connects to the Connect 2.0 API:

| Environment | API URL |
|-------------|---------|
| dev | `https://api-dev.connect.com` |
| staging | `https://api-staging.connect.com` |
| prod | `https://api.connect.com` |

Configure the API URL via `VITE_API_URL` environment variable.

## Rollback

To rollback the Web service:

```bash
./scripts/rollback.sh prod
```

This reverts to the previous ECS task definition.

## License

Proprietary - Blueprint Capital
