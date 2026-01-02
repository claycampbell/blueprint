# Connect 2.0 Web App

React-based web application for the Connect 2.0 platform.

## Quick Start

```bash
# Install dependencies
npm install

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

## Project Structure

```
src/
├── app/           # App shell, routes, providers
├── pages/         # Route pages
├── api/           # TanStack Query hooks
├── stores/        # Zustand stores
├── features/      # Feature modules
├── components/    # Shared components
│   ├── ui/        # Primitives (Button, Input)
│   └── common/    # Composed (DataTable)
├── hooks/         # Shared hooks
├── lib/           # Utilities
├── styles/        # Global CSS
└── types/         # TypeScript types
```

## Contributing

### Branch Strategy

```
development  →  Dev environment
staging      →  Staging environment
main         →  Production environment
```

### PR Guidelines

#### ⚠️ Keep Infrastructure and Code Separate

**Never mix infrastructure changes and application code in the same PR.**

| PR Type | Contains | Examples |
|---------|----------|----------|
| **Code PR** | React components, hooks, tests, styles | `feat: add login page` |
| **Infrastructure PR** | Terraform, Docker, GitHub Actions | `infra: add Redis cache` |

**Why?**
- Clean rollbacks - revert one without affecting the other
- Easier reviews - focus on one type of change
- Simpler debugging - know exactly what changed

**Example - Adding a feature that needs new infrastructure:**

```
1. PR #1: "infra: Add ElastiCache Redis" → merge, wait for deploy
2. PR #2: "feat: Use Redis for session caching" → merge
```

### Workflow

1. Create feature branch from `development`
2. Make changes, write tests
3. Create PR to `development`
4. Wait for CI (lint, test, build)
5. Get code review
6. Merge → auto-deploys to Dev

To promote to staging/production:
- Create PR from `development` → `staging` → `main`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage |

## Documentation

- [App Quickstart](docs/technical/APP_QUICKSTART.md) - Setup and development guide
- [Frontend Architecture](docs/technical/FRONTEND_ARCHITECTURE.md) - Architecture patterns
- [Infrastructure](docs/technical/INFRASTRUCTURE.md) - AWS infrastructure
- [GitHub Actions](docs/technical/GITHUB_ACTIONS.md) - CI/CD workflows
- [Deployment Runbook](docs/runbooks/DEPLOYMENT.md) - Deployment procedures
- [Rollback Runbook](docs/runbooks/ROLLBACK.md) - Rollback procedures

## Environments

| Environment | URL | Branch |
|-------------|-----|--------|
| Development | TBD | `development` |
| Staging | TBD | `staging` |
| Production | TBD | `main` |
