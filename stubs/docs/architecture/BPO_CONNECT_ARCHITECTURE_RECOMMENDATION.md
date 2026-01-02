# BPO / Connect 2.0 Frontend Architecture Recommendation

## Executive Summary

This document analyzes whether Blueprint Online (BPO) and Connect 2.0 should be built as a single unified application or as two separate frontend applications sharing a common API backend.

**Recommendation**: Build two separate frontend applications with a shared API and database.

---

## Context

### Blueprint Online (BPO)
- **Purpose**: Public-facing website for external users
- **Users**: Property owners, borrowers, external stakeholders
- **Access**: Public pages (no login) + authenticated areas for status viewing
- **Features**: Lead submission, property status viewing, document access, public information

### Connect 2.0
- **Purpose**: Internal workflow management application
- **Users**: Blueprint employees (designers, managers, loan officers, servicers)
- **Access**: Fully authenticated, role-based access control
- **Features**: Property lifecycle management, document workflows, task management, gate/dependency tracking

### Shared Infrastructure
- **API**: Single FastAPI backend serving both applications
- **Database**: PostgreSQL (accessed exclusively through the API)
- **Authentication**: JWT-based authentication for both apps

---

## Architecture Options Analyzed

### Option 1: Single Unified Application

Build one React application that serves both public BPO pages and internal Connect 2.0 functionality.

**Pros:**
- Single codebase to maintain
- Shared components and utilities
- Unified build and deployment pipeline
- Consistent design system

**Cons:**
- Increased bundle size for all users (public users download internal app code)
- Complex routing and access control logic
- Security risk: internal features bundled in public app
- Different release cadences create deployment friction
- Performance impact on public pages from internal code
- SEO challenges for public content in SPA

### Option 2: Two Separate Applications (Recommended)

Build two independent React applications, each optimized for its user base.

**Pros:**
- Optimized bundle size for each audience
- Clear security boundaries (internal code never exposed publicly)
- Independent release cycles
- Different performance optimization strategies
- Public app can be optimized for SEO
- Simpler codebase for each app
- Teams can work independently

**Cons:**
- Some code duplication (minimal with proper patterns)
- Two deployment pipelines to maintain
- Need strategy for sharing common types/utilities

---

## Recommendation: Two Separate Applications

### Rationale

1. **Security**: Internal application code, routes, and features should never be bundled in a public-facing application. Separate apps create a clear security boundary.

2. **Performance**: Public users should not download kilobytes of internal workflow management code. Each app can be optimized for its specific use case.

3. **User Experience**: BPO can prioritize fast initial load, SEO, and simple navigation. Connect 2.0 can prioritize rich interactions and complex workflows.

4. **Development Velocity**: Teams can deploy updates to Connect 2.0 without affecting the public-facing BPO site and vice versa.

5. **Regulatory Compliance**: Clear separation makes it easier to audit what code is exposed publicly versus internally.

### Code Sharing Strategy

Despite being separate applications, common code can be shared through:

1. **OpenAPI Codegen**: Generate TypeScript types from the shared API schema
   ```bash
   # Generate types from API spec
   npx openapi-typescript http://localhost:8000/openapi.json -o ./src/api/types.ts
   ```

2. **Copy-Paste for Utilities**: Simple utility functions (formatting, validation) can be copied between repos. This is pragmatic for small amounts of shared code.

3. **Shared Design Tokens**: Export CSS variables or design tokens that both apps import for visual consistency.

4. **NPM Package (Optional)**: If sharing becomes substantial, create a private npm package for shared utilities.

### Repository Structure

**Recommended: Independent Repositories**

```
blueprint-bpo/           # Public-facing BPO application
├── src/
├── package.json
└── README.md

blueprint-connect/       # Internal Connect 2.0 application
├── src/
├── package.json
└── README.md

blueprint-api/           # Shared FastAPI backend
├── app/
├── pyproject.toml
└── README.md
```

**Why Not Monorepo?**
- The API is Python (FastAPI), not included in frontend monorepo
- Minimal code sharing between BPO and Connect 2.0
- Independent deployment and release cycles
- Simpler CI/CD configuration
- No need for monorepo tooling complexity (Nx, Turborepo)

---

## Security Architecture

### Authentication: JWT Tokens (Not Cookies)

Both applications use JWT tokens for authentication rather than cookies.

**Benefits:**
- No cookie domain sharing required
- BPO and Connect 2.0 can run on completely different domains
- Simpler CORS configuration
- Works seamlessly with API-first architecture
- Mobile app compatibility (future)

**Implementation:**
```typescript
// Token storage in localStorage (or memory for higher security)
const token = localStorage.getItem('auth_token');

// API requests include Bearer token
fetch('/api/v1/tasks/my-tasks', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### CORS Configuration

The API must be configured to accept requests from both frontend domains.

```python
# FastAPI CORS configuration
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://bpo.blueprint.com",      # Production BPO
        "https://connect.blueprint.com",  # Production Connect 2.0
        "http://localhost:3000",          # Local development BPO
        "http://localhost:3001",          # Local development Connect
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Domain Strategy

| Application | Production Domain | Purpose |
|-------------|-------------------|---------|
| BPO | `bpo.blueprint.com` or `blueprint.com` | Public-facing |
| Connect 2.0 | `connect.blueprint.com` or `app.blueprint.com` | Internal |
| API | `api.blueprint.com` | Shared backend |

**Note**: Because JWT tokens are used (not cookies), these domains do not need to share a common parent domain. They could even be entirely different domains if needed.

---

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐
│      BPO        │     │   Connect 2.0   │
│  (Public App)   │     │  (Internal App) │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │  JWT + REST           │  JWT + REST
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────▼──────┐
              │   FastAPI   │
              │     API     │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │  PostgreSQL │
              │   Database  │
              └─────────────┘
```

### API Endpoint Segregation

While both apps share the same API, endpoints can be logically grouped:

```
/api/v1/public/        # BPO endpoints (may have lighter auth requirements)
  /properties/{id}/status
  /leads
  /documents/public/{id}

/api/v1/internal/      # Connect 2.0 endpoints (requires employee auth)
  /tasks/my-tasks
  /gates/...
  /properties/...
  /admin/...
```

---

## Implementation Considerations

### BPO-Specific Considerations
- Server-side rendering (SSR) or static generation for SEO
- Progressive enhancement for slow connections
- Accessibility compliance for public content
- Analytics and conversion tracking

### Connect 2.0-Specific Considerations
- Rich client-side state management
- Complex form handling and validation
- Real-time updates (WebSocket consideration)
- Offline support (future consideration)

### Shared Considerations
- Consistent API error handling
- Unified logging and monitoring
- Feature flags for gradual rollouts
- Shared design language (colors, typography, spacing)

---

## Conclusion

Building BPO and Connect 2.0 as two separate frontend applications provides the best balance of security, performance, and development velocity. The shared API architecture ensures data consistency while allowing each application to be optimized for its specific user base and use case.

The key enablers for this architecture are:
1. **JWT authentication** - Eliminates cookie/domain sharing complexity
2. **OpenAPI codegen** - Ensures type safety across both apps
3. **CORS configuration** - Allows secure cross-origin API access
4. **Independent repositories** - Simplifies development and deployment

This recommendation is formalized in the accompanying decision document.
