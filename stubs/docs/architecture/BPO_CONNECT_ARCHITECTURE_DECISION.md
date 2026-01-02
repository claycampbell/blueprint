# Architecture Decision Record: BPO / Connect 2.0 Frontend Separation

**ADR-001** | **Status: Accepted** | **Date: 2026-01-02**

---

## Decision

Blueprint Online (BPO) and Connect 2.0 will be built as **two separate frontend applications** sharing a **single API backend** and **database**.

---

## Context

Blueprint requires two distinct user-facing applications:

1. **Blueprint Online (BPO)**: A public-facing website where external users (property owners, borrowers, stakeholders) can submit leads, view property statuses, and access public information.

2. **Connect 2.0**: An internal application where Blueprint employees manage property lifecycles, documents, tasks, gates, and workflows.

Both applications need access to the same underlying data (properties, documents, users) but serve fundamentally different user bases with different security requirements, performance needs, and feature sets.

---

## Decision Drivers

| Driver | Weight | Notes |
|--------|--------|-------|
| Security isolation | High | Internal code must not be exposed in public app |
| Performance optimization | High | Public app needs fast initial load |
| Development velocity | Medium | Independent release cycles preferred |
| Code maintainability | Medium | Simpler codebases easier to maintain |
| Code reuse | Low | Minimal overlap between apps |

---

## Alternatives Considered

### Alternative 1: Single Unified Application
Build one React application serving both public and internal functionality.

**Rejected because:**
- Security risk: internal features bundled in public-facing code
- Performance penalty: public users download internal app code
- Complex access control and routing
- Deployment coupling between unrelated features

### Alternative 2: Monorepo with Shared Packages
Use a monorepo (Nx, Turborepo) to manage both apps with shared packages.

**Rejected because:**
- API is Python, not part of frontend monorepo
- Minimal code sharing between apps (not worth tooling overhead)
- Adds complexity without proportional benefit
- Independent repos are simpler and sufficient

---

## Architecture

### Application Topology

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
├─────────────────────────┬───────────────────────────────────┤
│                         │                                    │
│   ┌─────────────────┐   │   ┌─────────────────────────┐     │
│   │      BPO        │   │   │      Connect 2.0        │     │
│   │ (Public Website)│   │   │   (Internal App)        │     │
│   │                 │   │   │                         │     │
│   │ • Lead forms    │   │   │ • Task management       │     │
│   │ • Status views  │   │   │ • Gate workflows        │     │
│   │ • Public docs   │   │   │ • Document management   │     │
│   │ • SEO content   │   │   │ • Property lifecycle    │     │
│   └────────┬────────┘   │   └───────────┬─────────────┘     │
│            │            │               │                    │
│            │ JWT        │               │ JWT                │
│            │            │               │                    │
└────────────┼────────────┴───────────────┼────────────────────┘
             │                            │
             └──────────────┬─────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      SHARED API                              │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    FastAPI                           │   │
│   │                                                      │   │
│   │  /api/v1/public/*     → BPO endpoints               │   │
│   │  /api/v1/internal/*   → Connect 2.0 endpoints       │   │
│   │  /api/v1/shared/*     → Common endpoints            │   │
│   │                                                      │   │
│   └─────────────────────────┬───────────────────────────┘   │
│                             │                                │
│   ┌─────────────────────────▼───────────────────────────┐   │
│   │                   PostgreSQL                         │   │
│   │                                                      │   │
│   │  • Properties    • Users      • Documents           │   │
│   │  • Gates         • Tasks      • Assignments         │   │
│   │  • Leads         • Workflows  • Audit logs          │   │
│   │                                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Repository Structure

**Development (stubs/):**
```
stubs/
├── api/                    # Shared FastAPI backend (port 8000)
├── connect/                # Internal Connect 2.0 app (port 3000)
└── bpo/                    # Public BPO app (port 3001)
```

**Production (separate repos):**
```
Organization: blueprint/

bpo/                        # Public-facing application
├── src/
│   ├── api/               # API client (generated from OpenAPI)
│   ├── components/        # UI components
│   ├── pages/             # Route pages
│   └── styles/            # CSS/design tokens
├── package.json
└── vite.config.ts

connect/                    # Internal application
├── src/
│   ├── api/               # API client (generated from OpenAPI)
│   ├── components/        # UI components
│   ├── features/          # Feature modules
│   ├── pages/             # Route pages
│   └── stores/            # State management
├── package.json
└── vite.config.ts

api/                        # Shared backend
├── app/
│   ├── api/v1/            # API routes
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic schemas
│   └── services/          # Business logic
├── pyproject.toml
└── alembic/               # Database migrations
```

---

## Security Implementation

### Authentication: JWT Tokens

**Decision**: Use JWT tokens stored in client memory or localStorage, not HTTP-only cookies.

**Rationale**:
- No cookie domain sharing required between BPO and Connect 2.0
- Applications can run on completely different domains
- Simplifies CORS configuration
- Compatible with future mobile applications
- API-first architecture alignment

**Token Flow**:
```
1. User authenticates → API returns JWT
2. Client stores JWT (localStorage or memory)
3. Client includes JWT in Authorization header
4. API validates JWT on each request
```

**Implementation**:
```typescript
// Both apps use the same pattern
const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
  }
};
```

### CORS Configuration

**Decision**: Configure API to accept requests from specific allowed origins.

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

ALLOWED_ORIGINS = [
    # Production
    "https://bpo.blueprint.com",
    "https://connect.blueprint.com",
    "https://app.blueprint.com",

    # Staging
    "https://staging-bpo.blueprint.com",
    "https://staging-connect.blueprint.com",

    # Development
    "http://localhost:3000",  # BPO dev
    "http://localhost:3001",  # Connect dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "X-User-Id", "X-User-Role"],
)
```

### Domain Configuration

| Environment | BPO | Connect 2.0 | API |
|-------------|-----|-------------|-----|
| Production | `bpo.blueprint.com` | `connect.blueprint.com` | `api.blueprint.com` |
| Staging | `staging-bpo.blueprint.com` | `staging-connect.blueprint.com` | `staging-api.blueprint.com` |
| Development | `localhost:3000` | `localhost:3001` | `localhost:8000` |

**Note**: Domains do not need to share a parent domain because JWT authentication is used instead of cookies.

---

## Code Sharing Strategy

### TypeScript Types (OpenAPI Codegen)

Both applications generate TypeScript types from the shared API schema:

```bash
# In each frontend repo
npx openapi-typescript http://localhost:8000/openapi.json \
  --output src/api/types.generated.ts
```

**Benefits**:
- Type safety with API contracts
- Automatic updates when API changes
- No manual type synchronization

### Design Tokens

Shared CSS custom properties for visual consistency:

```css
/* shared-design-tokens.css (copied to both repos) */
:root {
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --font-family: 'Inter', sans-serif;
}
```

### Utility Functions

Simple utilities (date formatting, validation) are copied between repos as needed. This is intentionally not a shared package to avoid dependency management overhead for minimal code.

---

## API Endpoint Organization

### Public Endpoints (BPO)

```
GET  /api/v1/public/properties/{id}/status    # Property status (limited fields)
POST /api/v1/public/leads                      # Submit lead
GET  /api/v1/public/documents/{id}            # Public document access
```

### Internal Endpoints (Connect 2.0)

```
GET  /api/v1/tasks/my-tasks                    # User's assigned tasks
POST /api/v1/tasks/{id}/complete               # Complete a task
GET  /api/v1/properties                        # Full property list
GET  /api/v1/gates/properties/{id}/gates       # Gate status for property
POST /api/v1/admin/users                       # User management
```

### Shared Endpoints

```
POST /api/v1/auth/login                        # Authentication
POST /api/v1/auth/refresh                      # Token refresh
GET  /api/v1/users/me                          # Current user profile
```

---

## Deployment Strategy

### Independent Deployments

Each application is deployed independently:

```yaml
# BPO CI/CD (GitHub Actions example)
name: Deploy BPO
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: aws s3 sync dist/ s3://bpo-bucket/
      - run: aws cloudfront create-invalidation --distribution-id $CF_ID
```

```yaml
# Connect 2.0 CI/CD
name: Deploy Connect
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: aws s3 sync dist/ s3://connect-bucket/
      - run: aws cloudfront create-invalidation --distribution-id $CF_ID
```

### Release Independence

- BPO can be updated without affecting Connect 2.0
- Connect 2.0 can be updated without affecting BPO
- API changes require coordination with both apps (versioned API)

---

## Consequences

### Positive

- **Clear security boundary**: Internal code never exposed publicly
- **Optimized performance**: Each app loads only what it needs
- **Independent velocity**: Teams deploy without coordination
- **Simpler codebases**: Each app is focused and maintainable
- **Flexible domains**: No cookie/domain sharing complexity

### Negative

- **Some duplication**: API client code, utilities may be duplicated
- **Two pipelines**: Separate CI/CD configurations to maintain
- **Type sync effort**: Must regenerate types when API changes

### Mitigations

- OpenAPI codegen automates type synchronization
- CI/CD templates reduce pipeline maintenance
- Minimal actual code overlap limits duplication impact

---

## Implementation Checklist

- [ ] Create `blueprint-bpo` repository
- [ ] Create `blueprint-connect` repository (current `stubs/app`)
- [ ] Configure CORS in API for all environments
- [ ] Set up OpenAPI codegen in both frontend repos
- [ ] Configure JWT authentication flow
- [ ] Set up independent CI/CD pipelines
- [ ] Document deployment procedures
- [ ] Configure monitoring for both apps

---

## References

- [BPO Connect Architecture Recommendation](./BPO_CONNECT_ARCHITECTURE_RECOMMENDATION.md)
- [Tech Stack Decisions](./TECH_STACK_DECISIONS.md)
- [Integration Specifications](./INTEGRATION_SPECIFICATIONS.md)

---

**Decision made by**: Architecture Team
**Date**: 2026-01-02
**Review date**: 2026-04-02
