# CLAUDE.md - Connect 2.0 Web App

This file provides guidance to Claude Code when working with this repository.

## Repository Purpose

This is the **Connect 2.0 Web Application** - a React frontend for the Connect 2.0 platform.

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Framework** | React | 18.x |
| **Language** | TypeScript | 5.5+ (strict) |
| **Build** | Vite | Latest stable |
| **Styling** | CSS Modules | Co-located |
| **Server State** | TanStack Query | 5.x |
| **Client State** | Zustand | 4.x |
| **Routing** | React Router | 6.x |
| **HTTP Client** | Axios | 1.x |
| **Forms** | React Hook Form + Zod | Latest |
| **Testing** | Vitest + RTL + Playwright | Latest |

## Project Structure

```
app/
├── src/                        # Application source code
│   ├── main.tsx                # Entry point
│   ├── app/                    # Application shell
│   │   ├── App.tsx
│   │   ├── routes.tsx          # Route definitions
│   │   └── providers.tsx       # QueryClientProvider
│   ├── pages/                  # Route entry points
│   ├── api/                    # TanStack Query (server state)
│   │   ├── projects/
│   │   ├── loans/
│   │   ├── contacts/
│   │   └── documents/
│   ├── stores/                 # Zustand (client state)
│   ├── features/               # Isolated UI features
│   ├── components/             # Shared UI components
│   │   ├── ui/                 # Primitives (Button, Input)
│   │   └── common/             # Composed (DataTable, SearchBar)
│   ├── hooks/                  # Shared custom hooks
│   ├── lib/                    # Utilities
│   ├── styles/                 # Global styles
│   └── types/                  # Shared TypeScript types
├── docs/
│   ├── technical/              # Architecture documentation
│   ├── decisions/              # ADRs
│   └── runbooks/               # Operational runbooks
├── infrastructure/
│   ├── terraform/              # IaC for this service
│   └── docker/                 # Docker configurations
├── scripts/                    # Development scripts
├── Dockerfile
├── package.json
├── tsconfig.json
├── vite.config.ts
└── CLAUDE.md
```

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The app runs at http://localhost:3000 and proxies API requests to http://localhost:8000.

## State Management

- **Server State** (TanStack Query): Data from API - projects, loans, etc.
- **Client State** (Zustand): UI state - auth, theme, toasts

## Import Rules

| Layer | Can Import From | Cannot Import From |
|-------|-----------------|-------------------|
| `api/*` | `lib/`, `types/` | `features/*`, `pages/*`, `stores/*` |
| `stores/*` | `lib/`, `types/` | `features/*`, `pages/*`, `api/*` |
| `features/*` | `api/*`, `stores/*`, `lib/`, `components/*` | Other `features/*` |
| `pages/*` | Everything | — |

## Code Quality

- ESLint with strict rules
- Prettier for formatting
- TypeScript strict mode
- Vitest for unit tests

## Related Documentation

- [Frontend Architecture](docs/technical/frontend_react_architecture.md)
