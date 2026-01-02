# Connect 2.0 Web App - Developer Quickstart Guide

**Version:** 2.0
**Last Updated:** January 2026
**Related Documents:** [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md), [INFRASTRUCTURE.md](INFRASTRUCTURE.md), [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md)

---

## Overview

This guide covers how to set up, run, and test the Connect 2.0 Web Application locally.

---

## Prerequisites

### Required Software

| Software | Version | Installation |
|----------|---------|--------------|
| **Node.js** | 20+ | [nodejs.org](https://nodejs.org/) or via nvm |
| **npm** | 10+ | Included with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/downloads) |

### Optional

| Software | Purpose |
|----------|---------|
| **VS Code** | Recommended editor with TypeScript support |
| **React Developer Tools** | Browser extension for debugging |

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/connect2-app.git
cd connect2-app
```

### 2. Install Dependencies

```bash
npm install
```

This installs all runtime and dev dependencies from `package.json`.

---

## Running the Application

### Development Server

```bash
npm run dev
```

The app runs at **http://localhost:3000** with hot module replacement (HMR).

### Build for Production

```bash
npm run build
```

Creates optimized production build in `dist/`.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Build for production |
| `preview` | `npm run preview` | Preview production build |
| `lint` | `npm run lint` | Run ESLint |
| `test` | `npm run test` | Run tests in watch mode |
| `test:ui` | `npm run test:ui` | Run tests with Vitest UI |
| `test:coverage` | `npm run test:coverage` | Run tests with coverage report |

---

## Project Structure

```
app/
├── src/
│   ├── main.tsx              # Entry point
│   ├── app/                  # App shell (routes, providers)
│   ├── pages/                # Route pages
│   ├── api/                  # TanStack Query (server state)
│   ├── stores/               # Zustand (client state)
│   ├── features/             # Feature modules
│   ├── components/           # Shared components
│   │   ├── ui/               # Primitives (Button, Input)
│   │   └── common/           # Composed (DataTable)
│   ├── hooks/                # Shared hooks
│   ├── lib/                  # Utilities
│   ├── styles/               # Global CSS
│   ├── types/                # TypeScript types
│   └── test/                 # Test setup
├── docs/technical/           # Documentation
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Testing

### Test Framework

We use **Vitest** with **React Testing Library** for tests.

Tests are **co-located** with the code they test:

```
src/
├── components/ui/
│   ├── Button.tsx
│   └── Button.test.tsx      # Test next to component
├── stores/
│   ├── auth.store.ts
│   └── auth.store.test.ts   # Test next to store
```

### Running Tests

```bash
# Run all tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test -- --run

# Run with Vitest UI (interactive)
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test -- Button.test.tsx

# Run tests matching pattern
npm run test -- --grep "Button"
```

### Writing Tests

**Component Test:**
```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

**Store Test:**
```typescript
// auth.store.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth.store'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
  })

  it('sets user on login', () => {
    const { setUser } = useAuthStore.getState()
    setUser({ id: '1', email: 'test@test.com', name: 'Test', role: 'user', permissions: [] }, 'token')

    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })
})
```

### Test Conventions

- Test files: `*.test.tsx` or `*.test.ts`
- Use `describe` blocks for grouping
- Use clear test names: `it('renders children correctly')`
- One assertion concept per test
- Use `userEvent` for interactions (not `fireEvent`)
- Reset state in `beforeEach` for stores

---

## Code Quality

### Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues (if configured)
npm run lint -- --fix
```

### Type Checking

```bash
# Check TypeScript types
npx tsc --noEmit
```

### Run All Checks

```bash
npm run lint && npx tsc --noEmit && npm run test -- --run
```

---

## State Management

### Server State (TanStack Query)

For data from the API (projects, loans, etc.):

```typescript
// Using a query
import { useProjects } from '@/api/projects'

function ProjectsPage() {
  const { data: projects, isLoading, error } = useProjects()

  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />

  return <ProjectList projects={projects} />
}
```

### Client State (Zustand)

For UI state, auth, etc.:

```typescript
// Using a store
import { useAuthStore } from '@/stores'

function Header() {
  const { user, logout } = useAuthStore()

  return (
    <header>
      <span>Welcome, {user?.name}</span>
      <button onClick={logout}>Logout</button>
    </header>
  )
}
```

---

## Styling

### CSS Modules

Styles are co-located with components:

```
components/ui/
├── Button.tsx
└── Button.module.css
```

```typescript
// Button.tsx
import styles from './Button.module.css'

export function Button({ children }) {
  return <button className={styles.button}>{children}</button>
}
```

```css
/* Button.module.css */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-md);
}
```

### CSS Variables

Global design tokens are in `styles/variables.css`:

```css
:root {
  --color-primary: #2563eb;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --radius-md: 6px;
}
```

---

## API Integration

### Making API Calls

Use TanStack Query hooks in `api/`:

```typescript
// Already configured in api/projects/queries.ts
import { useProjects, useProject } from '@/api/projects'

// List
const { data: projects } = useProjects()

// Single item
const { data: project } = useProject(projectId)
```

### Mutations

```typescript
import { useCreateProject } from '@/api/projects'

function CreateProjectForm() {
  const createProject = useCreateProject()

  const handleSubmit = (data) => {
    createProject.mutate(data, {
      onSuccess: () => toast.success('Project created!'),
      onError: (error) => toast.error(error.message),
    })
  }
}
```

### API Client

The Axios client in `lib/api-client.ts`:
- Adds auth token automatically
- Handles 401 (redirects to login)
- Proxies `/api` to backend in development

---

## Environment Variables

Create `.env.local` for local overrides:

```env
# API URL (defaults to proxy in dev)
VITE_API_URL=http://localhost:8000

# Feature flags
VITE_ENABLE_DARK_MODE=true
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## Troubleshooting

### "Module not found" errors

Check path aliases in `vite.config.ts`:
```typescript
resolve: {
  alias: {
    '@': '/src',
  },
},
```

Use imports like `import { Button } from '@/components/ui'`

### Tests failing with "document is not defined"

Ensure `vite.config.ts` has:
```typescript
test: {
  environment: 'jsdom',
  setupFiles: './src/test/setup.ts',
}
```

### Hot reload not working

Try:
1. Clear browser cache
2. Restart dev server: `npm run dev`
3. Delete `node_modules/.vite` and restart

### TypeScript errors in tests

Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

### API requests failing in development

Check that the API is running on port 8000. Vite proxies `/api` requests.

---

## IDE Setup (VS Code)

### Recommended Extensions

- **ESLint** - Linting
- **Prettier** - Formatting
- **TypeScript Vue Plugin (Volar)** - Better TS support
- **CSS Modules** - CSS module intellisense

### Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

---

## Next Steps

After completing setup:

1. **Run the app** - Verify it starts at localhost:3000
2. **Run tests** - Verify all tests pass
3. **Explore the codebase** - Start with `src/app/App.tsx`
4. **Read architecture docs** - Understand patterns in use
5. **Start the API** - For full-stack development

---

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - AI assistant context
- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md) - Full architecture spec
- [Infrastructure](./INFRASTRUCTURE.md) - AWS deployment (ECS, ALB)
- [GitHub Actions](./GITHUB_ACTIONS.md) - CI/CD workflows
- [System Architecture](../../docs/architecture/SYSTEM_ARCHITECTURE.md) - High-level system design
- [Development Guide](../../../docs/DEVELOPMENT_GUIDE.md) - Overarching development workflow
