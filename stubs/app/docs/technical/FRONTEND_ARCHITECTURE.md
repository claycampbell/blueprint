# Connect 2.0 Web App - Frontend Architecture

**Version:** 1.0.0
**Last Updated:** December 26, 2025
**Status:** Approved

---

## Executive Summary

This document defines the architecture for the Connect 2.0 Web Application, a React-based frontend that provides the user interface for the Connect 2.0 platform.

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Project Structure](#2-project-structure)
3. [Architecture Layers](#3-architecture-layers)
4. [State Management](#4-state-management)
5. [Routing](#5-routing)
6. [API Integration](#6-api-integration)
7. [Component Architecture](#7-component-architecture)
8. [Styling Strategy](#8-styling-strategy)
9. [Testing Strategy](#9-testing-strategy)
10. [Error Handling](#10-error-handling)
11. [Development Standards](#11-development-standards)

---

## 1. Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | React | 18.x | Component-based UI library |
| **Language** | TypeScript | 5.6+ | Type safety, better DX |
| **Build Tool** | Vite | 6.x | Fast builds, HMR |
| **Styling** | CSS Modules | — | Scoped, co-located styles |
| **Server State** | TanStack Query | 5.x | Caching, sync, mutations |
| **Client State** | Zustand | 4.x | Simple, lightweight stores |
| **Routing** | React Router | 6.x | Declarative routing |
| **HTTP Client** | Axios | 1.x | API requests, interceptors |
| **Forms** | React Hook Form | 7.x | Performant form handling |
| **Validation** | Zod | 3.x | Schema validation |
| **Testing** | Vitest + RTL | Latest | Unit and component tests |

### Why These Choices?

- **Vite**: 10-100x faster than CRA, native ESM, excellent HMR
- **TanStack Query**: Eliminates boilerplate for server state, automatic caching
- **Zustand**: Simpler than Redux, no boilerplate, tiny bundle size
- **CSS Modules**: Scoped styles without runtime cost of CSS-in-JS
- **Vitest**: Native Vite integration, Jest-compatible API

---

## 2. Project Structure

```
app/
├── src/
│   ├── main.tsx                    # Application entry point
│   │
│   ├── app/                        # Application shell
│   │   ├── App.tsx                 # Root component
│   │   ├── routes.tsx              # Route definitions
│   │   └── providers.tsx           # Context providers (Query, etc.)
│   │
│   ├── pages/                      # Route entry points (smart components)
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── LoansPage.tsx
│   │   └── index.ts                # Barrel export
│   │
│   ├── api/                        # Server state (TanStack Query)
│   │   ├── projects/
│   │   │   ├── types.ts            # Domain types
│   │   │   ├── keys.ts             # Query key factory
│   │   │   ├── queries.ts          # useProjects, useProject
│   │   │   ├── mutations.ts        # useCreateProject, etc.
│   │   │   └── index.ts            # Barrel export
│   │   ├── loans/
│   │   ├── contacts/
│   │   └── documents/
│   │
│   ├── stores/                     # Client state (Zustand)
│   │   ├── auth.store.ts           # User session, permissions
│   │   ├── auth.store.test.ts      # Co-located test
│   │   ├── ui.store.ts             # Theme, sidebar, modals
│   │   ├── toast.store.ts          # Toast notifications
│   │   └── index.ts                # Barrel export
│   │
│   ├── features/                   # Feature modules (isolated)
│   │   ├── project-management/
│   │   │   ├── components/         # Feature-specific components
│   │   │   ├── hooks/              # Feature-specific hooks
│   │   │   ├── store.ts            # PRIVATE feature state
│   │   │   └── index.ts            # Public exports only
│   │   ├── loan-management/
│   │   └── document-viewer/
│   │
│   ├── components/                 # Shared UI components
│   │   ├── ui/                     # Primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.test.tsx     # Co-located test
│   │   │   ├── Input.tsx
│   │   │   ├── Input.module.css
│   │   │   └── index.ts
│   │   └── common/                 # Composed components
│   │       ├── DataTable.tsx
│   │       ├── SearchBar.tsx
│   │       └── index.ts
│   │
│   ├── hooks/                      # Shared custom hooks
│   │   └── index.ts
│   │
│   ├── lib/                        # Utilities and config
│   │   ├── api-client.ts           # Configured Axios instance
│   │   ├── constants.ts            # App-wide constants
│   │   ├── utils.ts                # Helper functions
│   │   └── index.ts
│   │
│   ├── styles/                     # Global styles
│   │   ├── variables.css           # CSS custom properties
│   │   └── global.css              # Reset, base styles
│   │
│   ├── types/                      # Shared TypeScript types
│   │   └── common.ts               # ApiResponse, Pagination, etc.
│   │
│   └── test/                       # Test utilities
│       └── setup.ts                # Vitest setup, mocks
│
├── docs/
│   └── technical/
│       ├── FRONTEND_ARCHITECTURE.md
│       └── APP_QUICKSTART.md
│
├── infrastructure/
│   ├── terraform/
│   └── docker/
│
├── index.html                      # HTML entry point
├── vite.config.ts                  # Vite + Vitest config
├── tsconfig.json                   # TypeScript config
├── package.json
├── Dockerfile
├── nginx.conf                      # Production server config
└── CLAUDE.md
```

---

## 3. Architecture Layers

### Layer Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           pages/                                      │
│              Route entry points, page composition                     │
│         - Compose features and components                             │
│         - Handle page-level concerns (auth, loading)                  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌────────────────┐   ┌────────────────┐   ┌────────────────┐
│   features/    │   │     api/       │   │    stores/     │
│ ────────────── │   │ ────────────── │   │ ────────────── │
│  Feature UI    │   │ Server State   │   │ Client State   │
│  (isolated)    │   │ (TanStack Q)   │   │  (Zustand)     │
│                │   │                │   │                │
│ - components/  │   │ - queries.ts   │   │ - auth.store   │
│ - hooks/       │   │ - mutations.ts │   │ - ui.store     │
│ - store.ts     │   │ - keys.ts      │   │ - toast.store  │
└────────────────┘   └────────────────┘   └────────────────┘
         │                     │                     │
         └──────────┬──────────┴──────────┬──────────┘
                    │                     │
                    ▼                     ▼
         ┌────────────────┐   ┌────────────────┐
         │  components/   │   │     lib/       │
         │ ────────────── │   │ ────────────── │
         │  Shared UI     │   │  Utilities     │
         │                │   │                │
         │ - ui/          │   │ - api-client   │
         │ - common/      │   │ - utils        │
         └────────────────┘   └────────────────┘
```

### Import Rules

| Layer | Can Import From | Cannot Import From |
|-------|-----------------|-------------------|
| `pages/*` | Everything | — |
| `features/*` | `api/*`, `stores/*`, `components/*`, `lib/*`, `hooks/*` | Other `features/*` |
| `api/*` | `lib/*`, `types/*` | `features/*`, `pages/*`, `stores/*`, `components/*` |
| `stores/*` | `lib/*`, `types/*` | `features/*`, `pages/*`, `api/*`, `components/*` |
| `components/*` | `lib/*`, `types/*`, `hooks/*` | `features/*`, `pages/*`, `api/*`, `stores/*` |
| `lib/*` | `types/*` | Everything else |

**Key Rule:** Features NEVER import from other features. They share data through `api/` and `stores/`.

---

## 4. State Management

### Server State vs Client State

| Type | Tool | Examples | Characteristics |
|------|------|----------|-----------------|
| **Server State** | TanStack Query | Projects, Loans, Users | Async, cached, shared |
| **Client State** | Zustand | Auth, UI, Toasts | Sync, local, ephemeral |

### TanStack Query (Server State)

```typescript
// api/projects/queries.ts
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/projects')
      return response.data.data
    },
  })
}

// Usage in component
function ProjectsPage() {
  const { data: projects, isLoading, error } = useProjects()
  // ...
}
```

**Query Key Factory Pattern:**
```typescript
// api/projects/keys.ts
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: Filters) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
}
```

### Zustand (Client State)

```typescript
// stores/auth.store.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user, token) => {
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      hasPermission: (permission) => {
        const { user } = get()
        return user?.permissions.includes(permission) ?? false
      },
    }),
    { name: 'auth-storage' }
  )
)

// Usage in component
function Header() {
  const { user, logout } = useAuthStore()
  // ...
}
```

### When to Use Which

| Scenario | Use |
|----------|-----|
| Data from API | TanStack Query |
| User session | Zustand (persisted) |
| UI state (sidebar, modals) | Zustand |
| Form state | React Hook Form |
| Component-local state | useState |

---

## 5. Routing

### Route Structure

```typescript
// app/routes.tsx
export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:id" element={<ProjectDetailPage />} />
      <Route path="/loans" element={<LoansPage />} />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
```

### Protected Routes

```typescript
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
```

---

## 6. API Integration

### Axios Client Configuration

```typescript
// lib/api-client.ts
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
})

// Auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### API Response Types

```typescript
// types/common.ts
interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    total: number
    page: number
    pageSize: number
  }
}

interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Array<{ field: string; message: string }>
  }
}
```

---

## 7. Component Architecture

### Component Categories

| Category | Location | Purpose | Examples |
|----------|----------|---------|----------|
| **Pages** | `pages/` | Route entry points | `ProjectsPage`, `LoginPage` |
| **Features** | `features/*/components/` | Domain-specific UI | `ProjectCard`, `LoanTable` |
| **Common** | `components/common/` | Reusable composed | `DataTable`, `SearchBar` |
| **UI** | `components/ui/` | Design system primitives | `Button`, `Input`, `Modal` |

### Component Anatomy

```typescript
// components/ui/Button.tsx
import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

### Co-located Files

```
components/ui/
├── Button.tsx              # Component
├── Button.module.css       # Styles
├── Button.test.tsx         # Tests
└── index.ts                # Export
```

---

## 8. Styling Strategy

### CSS Modules

```css
/* Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary {
  background-color: var(--color-primary);
  color: white;
}

.primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}
```

### CSS Custom Properties

```css
/* styles/variables.css */
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-danger: #dc2626;
  --color-text: #111827;
  --color-background: #ffffff;
  --color-border: #e5e7eb;

  /* Spacing */
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #f9fafb;
    --color-background: #111827;
    --color-border: #374151;
  }
}
```

---

## 9. Testing Strategy

### Test Types

| Type | Tool | Location | Purpose |
|------|------|----------|---------|
| **Unit** | Vitest | Co-located `.test.ts` | Stores, utils, hooks |
| **Component** | Vitest + RTL | Co-located `.test.tsx` | Component behavior |
| **E2E** | Playwright | `e2e/` | Full user flows |

### Test Location (Co-located)

```
src/
├── components/ui/
│   ├── Button.tsx
│   └── Button.test.tsx     # Lives with component
├── stores/
│   ├── auth.store.ts
│   └── auth.store.test.ts  # Lives with store
```

### Component Test Example

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when loading is true', () => {
    render(<Button loading>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Store Test Example

```typescript
// auth.store.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth.store'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
  })

  it('sets user and token on login', () => {
    const { setUser } = useAuthStore.getState()
    setUser(mockUser, 'jwt-token')

    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toEqual(mockUser)
    expect(isAuthenticated).toBe(true)
  })
})
```

### Running Tests

```bash
# Run all tests
npm run test

# Run in watch mode
npm run test -- --watch

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific file
npm run test -- Button.test.tsx
```

---

## 10. Error Handling

### API Error Handling

```typescript
// In TanStack Query
const { data, error, isError } = useProjects()

if (isError) {
  const apiError = error as AxiosError<ApiError>
  toast.error(apiError.response?.data.error.message || 'An error occurred')
}
```

### Error Boundaries

```typescript
// components/common/ErrorBoundary.tsx
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

### Toast Notifications

```typescript
// Using toast store
const { addToast } = useToastStore()

// Success
addToast({ type: 'success', message: 'Project created successfully' })

// Error
addToast({ type: 'error', message: 'Failed to save changes' })
```

---

## 11. Development Standards

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProjectCard.tsx` |
| Hooks | camelCase with `use` | `useProjects.ts` |
| Stores | camelCase with `.store` | `auth.store.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | PascalCase | `Project`, `ApiResponse` |
| CSS Modules | camelCase in JS | `styles.button` |
| CSS Classes | kebab-case in CSS | `.primary-button` |

### File Organization

- One component per file
- Co-locate tests with implementation
- Co-locate styles with component
- Use barrel exports (`index.ts`) for public API
- Keep feature internals private

### Code Quality

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Test
npm run test

# All checks
npm run lint && npx tsc --noEmit && npm run test
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Dec 26, 2025 | Engineering | Initial document |
