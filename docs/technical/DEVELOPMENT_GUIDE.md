# Development Setup and Environment Guide

**Version:** 1.0
**Last Updated:** November 5, 2025
**Status:** Draft - Ready for Technical Review
**Related Documents:** [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md), [API_SPECIFICATION.md](API_SPECIFICATION.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Local Development Environment Setup](#3-local-development-environment-setup)
4. [Repository Structure](#4-repository-structure)
5. [Database Setup](#5-database-setup)
6. [Running the Application](#6-running-the-application)
7. [Development Workflow](#7-development-workflow)
8. [Environment Variables](#8-environment-variables)
9. [Docker Development Environment](#9-docker-development-environment)
10. [Troubleshooting](#10-troubleshooting)
11. [Code Style and Standards](#11-code-style-and-standards)
12. [IDE Setup](#12-ide-setup)

---

## 1. Overview

This guide covers everything a developer needs to set up their local development environment for Connect 2.0. By the end of this guide, you'll have:

- A fully functional local development environment
- Backend API server running with hot reload
- Frontend React app running with hot reload
- PostgreSQL database with seed data
- Redis cache for sessions
- All necessary development tools configured

**Estimated Setup Time:** 30-45 minutes

---

## 2. Prerequisites

### 2.1 Required Software

Install the following before proceeding:

| Software | Version | Download Link | Purpose |
|----------|---------|---------------|---------|
| **Node.js** | 20.x LTS | https://nodejs.org | JavaScript runtime |
| **npm** | 10.x | (included with Node.js) | Package manager |
| **PostgreSQL** | 15.x | https://www.postgresql.org | Database |
| **Redis** | 7.x | https://redis.io | Cache/sessions |
| **Git** | 2.40+ | https://git-scm.com | Version control |
| **Docker** | 24.x | https://docker.com | Containerization (optional) |
| **VS Code** | Latest | https://code.visualstudio.com | IDE (recommended) |

### 2.2 Verify Installations

Run these commands to verify installations:

```bash
# Node.js and npm
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x

# PostgreSQL
psql --version  # Should show 15.x

# Redis
redis-cli --version  # Should show 7.x

# Git
git --version  # Should show 2.40+

# Docker (optional)
docker --version  # Should show 24.x
```

### 2.3 Required Accounts

You'll need accounts for these services (obtain API keys from team lead):

- **GitHub**: Access to Connect 2.0 repository
- **SendGrid**: Email service (API key)
- **Twilio**: SMS service (Account SID + Auth Token)
- **Azure**: Document Intelligence (subscription key)
- **DocuSign** or **Authentisign**: E-signature (OAuth credentials)

---

## 3. Local Development Environment Setup

### 3.1 Clone the Repository

```bash
# Clone the repository
git clone https://github.com/blueprint/connect-2.0.git
cd connect-2.0

# Checkout the development branch
git checkout develop
```

### 3.2 Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 3.3 Configure Environment Variables

```bash
# Copy example environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` with your local configuration (see [Section 8](#8-environment-variables) for details).

---

## 4. Repository Structure

```
connect-2.0/
├── backend/                    # Node.js/TypeScript backend
│   ├── src/
│   │   ├── modules/            # Feature modules
│   │   │   ├── projects/       # Project management
│   │   │   ├── feasibility/    # Feasibility module
│   │   │   ├── entitlement/    # Entitlement module
│   │   │   ├── loans/          # Loan origination
│   │   │   ├── servicing/      # Loan servicing
│   │   │   ├── contacts/       # Contact management
│   │   │   ├── documents/      # Document management
│   │   │   └── auth/           # Authentication
│   │   ├── shared/             # Shared utilities
│   │   │   ├── database/       # Database utilities
│   │   │   ├── events/         # Event bus
│   │   │   ├── middleware/     # Express middleware
│   │   │   └── utils/          # Helper functions
│   │   ├── integrations/       # External integrations
│   │   │   ├── docusign/
│   │   │   ├── azure-ai/
│   │   │   ├── sendgrid/
│   │   │   └── twilio/
│   │   ├── app.ts              # Express app setup
│   │   └── server.ts           # Server entry point
│   ├── tests/                  # Test files
│   ├── migrations/             # Database migrations
│   ├── seeds/                  # Seed data
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard/
│   │   │   ├── Projects/
│   │   │   ├── Loans/
│   │   │   └── Settings/
│   │   ├── components/         # Reusable components
│   │   │   ├── forms/
│   │   │   ├── tables/
│   │   │   ├── layouts/
│   │   │   └── common/
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API client
│   │   ├── stores/             # State management (Zustand)
│   │   ├── utils/              # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── tests/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env.example
│
├── shared/                     # Shared TypeScript types
│   └── types/
│
├── docs/                       # Documentation
│   └── technical/
│
├── docker-compose.yml          # Docker development setup
├── .gitignore
├── README.md
└── package.json                # Workspace root
```

---

## 5. Database Setup

### 5.1 Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE connect2_dev;
CREATE USER connect2_user WITH ENCRYPTED PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE connect2_dev TO connect2_user;

# Exit PostgreSQL
\q
```

### 5.2 Run Migrations

```bash
cd backend

# Run migrations to create schema
npm run migrate:latest

# Verify migrations
npm run migrate:status
```

### 5.3 Seed Development Data

```bash
# Seed the database with test data
npm run seed:run

# This creates:
# - 3 test users (admin, acquisitions, entitlement)
# - 10 sample projects
# - 5 sample loans
# - Sample contacts, entities, documents
```

### 5.4 Verify Database Setup

```bash
# Connect to database
psql -U connect2_user -d connect2_dev

# List tables
\dt

# You should see:
# - users
# - contacts
# - entities
# - projects
# - feasibility_items
# - entitlement_items
# - loans
# - loan_draws
# - documents
# - tasks
# - activity_log

# Exit
\q
```

---

## 6. Running the Application

### 6.1 Start Backend API Server

```bash
cd backend

# Development mode (with hot reload)
npm run dev

# The API server starts at: http://localhost:3000
# API documentation: http://localhost:3000/api/docs
```

**Expected Output:**
```
🚀 Server started on port 3000
✅ Database connected
✅ Redis connected
📡 API documentation available at http://localhost:3000/api/docs
```

### 6.2 Start Frontend Development Server

In a separate terminal:

```bash
cd frontend

# Development mode (with hot reload)
npm run dev

# The frontend starts at: http://localhost:5173
```

**Expected Output:**
```
VITE v5.x.x  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 6.3 Start Redis (if not running as service)

In a separate terminal:

```bash
redis-server
```

### 6.4 Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **API Docs** (Swagger): http://localhost:3000/api/docs

**Default Login Credentials:**
```
Email: admin@blueprint.com
Password: Admin123!
```

---

## 7. Development Workflow

### 7.1 Branch Strategy

```
main           (production-ready code)
  └── develop  (integration branch)
        ├── feature/PROJECT-123-add-loan-calculator
        ├── feature/PROJECT-124-entitlement-workflow
        └── bugfix/PROJECT-125-fix-date-picker
```

**Creating a Feature Branch:**
```bash
# Update develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/PROJECT-123-add-loan-calculator

# Make changes...

# Commit
git add .
git commit -m "feat(loans): add loan payment calculator"

# Push to remote
git push origin feature/PROJECT-123-add-loan-calculator

# Create pull request on GitHub
```

### 7.2 Making Changes

**Backend Changes:**
```bash
cd backend

# Make code changes
# Hot reload automatically applies changes

# Run tests
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

**Frontend Changes:**
```bash
cd frontend

# Make code changes
# Hot reload automatically applies changes in browser

# Run tests
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

### 7.3 Database Migrations

**Creating a New Migration:**
```bash
cd backend

# Generate migration file
npm run migrate:create add_loan_status_field

# Edit the generated file in migrations/
# Example: migrations/20251105_add_loan_status_field.ts

# Run migration
npm run migrate:latest

# Rollback if needed
npm run migrate:rollback
```

**Migration Example:**
```typescript
// migrations/20251105_add_loan_status_field.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('loans', (table) => {
    table.string('underwriting_status').defaultTo('PENDING');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('loans', (table) => {
    table.dropColumn('underwriting_status');
  });
}
```

### 7.4 Adding a New API Endpoint

**Step 1: Create Route Handler**
```typescript
// backend/src/modules/loans/routes.ts
import { Router } from 'express';
import { LoanController } from './controller';
import { authenticate, authorize } from '../../shared/middleware/auth';

const router = Router();
const controller = new LoanController();

router.post(
  '/loans/:id/calculate-payment',
  authenticate,
  authorize(['ADMIN', 'LOAN_OFFICER']),
  controller.calculatePayment
);

export default router;
```

**Step 2: Implement Controller**
```typescript
// backend/src/modules/loans/controller.ts
export class LoanController {
  async calculatePayment(req: Request, res: Response) {
    const { id } = req.params;
    const { principal, rate, term } = req.body;

    const monthlyPayment = calculateMonthlyPayment(principal, rate, term);

    return res.json({
      loan_id: id,
      monthly_payment: monthlyPayment,
      total_interest: (monthlyPayment * term) - principal
    });
  }
}
```

**Step 3: Register Route**
```typescript
// backend/src/app.ts
import loanRoutes from './modules/loans/routes';

app.use('/api/v1', loanRoutes);
```

**Step 4: Test Endpoint**
```bash
curl -X POST http://localhost:3000/api/v1/loans/ln_123/calculate-payment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"principal": 1000000, "rate": 0.08, "term": 24}'
```

---

## 8. Environment Variables

### 8.1 Backend Environment Variables

Create `backend/.env` with the following:

```bash
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://connect2_user:your_password@localhost:5432/connect2_dev
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=30d

# OAuth 2.0 (for social login)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

# SendGrid (Email)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@blueprint.com
SENDGRID_FROM_NAME=Blueprint Capital

# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+12065550100

# DocuSign
DOCUSIGN_INTEGRATION_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DOCUSIGN_USER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DOCUSIGN_ACCOUNT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DOCUSIGN_PRIVATE_KEY_PATH=./config/docusign_private.key
DOCUSIGN_OAUTH_BASE_URL=https://account-d.docusign.com
DOCUSIGN_API_BASE_URL=https://demo.docusign.net/restapi

# Azure Document Intelligence
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# AWS S3 (Document Storage)
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-west-2
AWS_S3_BUCKET=connect2-dev-documents

# BPO Integration (temporary during Days 1-90)
BPO_API_URL=https://bpo.blueprint.com/api
BPO_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=debug
LOG_FORMAT=json

# Feature Flags
FEATURE_FLAG_MULTI_TENANCY=false
FEATURE_FLAG_AI_SUGGESTIONS=true
```

### 8.2 Frontend Environment Variables

Create `frontend/.env` with the following:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000

# OAuth (if using social login)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Feature Flags
VITE_FEATURE_MULTI_TENANCY=false
VITE_FEATURE_AI_SUGGESTIONS=true

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=
```

---

## 9. Docker Development Environment

### 9.1 Using Docker Compose

For a fully containerized development environment:

```bash
# Start all services (backend, frontend, postgres, redis)
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v
```

### 9.2 Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: connect2_user
      POSTGRES_PASSWORD: connect2_pass
      POSTGRES_DB: connect2_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    environment:
      DATABASE_URL: postgresql://connect2_user:connect2_pass@postgres:5432/connect2_dev
      REDIS_URL: redis://redis:6379
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis
    command: npm run dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
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

### 9.3 Docker Development Commands

```bash
# Rebuild containers after dependency changes
docker-compose build

# Run migrations in container
docker-compose exec backend npm run migrate:latest

# Run seeds in container
docker-compose exec backend npm run seed:run

# Access database in container
docker-compose exec postgres psql -U connect2_user -d connect2_dev

# Access backend shell
docker-compose exec backend sh

# View backend logs only
docker-compose logs -f backend
```

---

## 10. Troubleshooting

### 10.1 Common Issues

#### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in backend/.env
PORT=3001
```

#### Issue: "Cannot connect to PostgreSQL"

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL service
# macOS (Homebrew)
brew services start postgresql

# Linux (systemd)
sudo systemctl start postgresql

# Windows
# Start via Services app or pgAdmin

# Verify connection
psql -U postgres -c "SELECT version();"
```

#### Issue: "Redis connection refused"

**Solution:**
```bash
# Check if Redis is running
redis-cli ping  # Should return "PONG"

# Start Redis service
# macOS (Homebrew)
brew services start redis

# Linux (systemd)
sudo systemctl start redis

# Windows
# Download and run Redis from GitHub releases
```

#### Issue: "Module not found" after git pull

**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Migration failed"

**Solution:**
```bash
# Check migration status
npm run migrate:status

# Rollback last migration
npm run migrate:rollback

# Re-run migrations
npm run migrate:latest

# If still failing, reset database (WARNING: deletes all data)
npm run migrate:rollback --all
npm run migrate:latest
npm run seed:run
```

### 10.2 Debugging Tips

**Backend Debugging (VS Code):**

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/backend",
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    }
  ]
}
```

**Frontend Debugging (Browser DevTools):**
- Chrome DevTools: F12 → Sources tab → Add breakpoints
- React DevTools: Install extension for component inspection
- Network tab: Monitor API requests

**Database Debugging:**
```bash
# Enable query logging in backend
# Add to backend/.env
LOG_SQL_QUERIES=true

# View slow queries
psql -U connect2_user -d connect2_dev
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

---

## 11. Code Style and Standards

### 11.1 TypeScript Standards

**Use strict TypeScript:**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Naming Conventions:**
```typescript
// Interfaces: PascalCase with 'I' prefix (optional)
interface User {
  id: string;
  email: string;
}

// Types: PascalCase
type ProjectStatus = 'LEAD' | 'FEASIBILITY' | 'GO' | 'PASS';

// Classes: PascalCase
class LoanService {
  async calculatePayment() {}
}

// Functions/Methods: camelCase
function formatCurrency(amount: number): string {}

// Constants: UPPER_SNAKE_CASE
const MAX_UPLOAD_SIZE = 10_000_000; // 10 MB

// Files: kebab-case
// loan-service.ts, user-controller.ts
```

### 11.2 ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react/react-in-jsx-scope": "off"
  }
}
```

### 11.3 Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}
```

### 11.4 Git Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(loans): add payment calculator endpoint

Implemented monthly payment calculation based on principal, rate, and term.
Includes validation for input parameters.

Closes #123

---

fix(auth): resolve JWT expiration bug

Fixed issue where JWT tokens were expiring 1 day early due to
incorrect millisecond conversion.

Fixes #456

---

docs(api): update loan endpoints documentation

Added examples for all loan API endpoints including request/response formats.
```

---

## 12. IDE Setup

### 12.1 VS Code Extensions

Install these recommended extensions:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "dsznajder.es7-react-js-snippets",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "GitHub.copilot",
    "eamodio.gitlens",
    "usernamehw.errorlens",
    "ms-azuretools.vscode-docker"
  ]
}
```

### 12.2 VS Code Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 12.3 VS Code Snippets

Create custom snippets in `.vscode/typescript.code-snippets`:

```json
{
  "Express Route Handler": {
    "prefix": "route",
    "body": [
      "router.${1:get}('${2:/endpoint}', async (req: Request, res: Response) => {",
      "  try {",
      "    $0",
      "    return res.json({ success: true });",
      "  } catch (error) {",
      "    return res.status(500).json({ error: error.message });",
      "  }",
      "});"
    ],
    "description": "Express route handler"
  },
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "",
      "interface ${1:Component}Props {",
      "  $2",
      "}",
      "",
      "export const ${1:Component}: React.FC<${1:Component}Props> = ({ $3 }) => {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "};"
    ],
    "description": "React functional component with TypeScript"
  }
}
```

---

## Appendix A: Quick Reference

### Useful Commands

```bash
# Backend
npm run dev              # Start dev server with hot reload
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run migrate:latest   # Run migrations
npm run migrate:rollback # Rollback last migration
npm run seed:run         # Seed database

# Frontend
npm run dev              # Start dev server
npm test                 # Run tests
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Database
psql -U connect2_user -d connect2_dev   # Connect to database
\dt                                      # List tables
\d table_name                            # Describe table
\q                                       # Quit

# Git
git checkout develop                     # Switch to develop branch
git pull origin develop                  # Update develop branch
git checkout -b feature/PROJECT-123      # Create feature branch
git commit -m "feat: add feature"        # Commit changes
git push origin feature/PROJECT-123      # Push branch

# Docker
docker-compose up                        # Start all services
docker-compose down                      # Stop all services
docker-compose logs -f backend           # View backend logs
docker-compose exec backend sh           # Access backend shell
```

### Default Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 3000 | http://localhost:3000 |
| API Docs | 3000 | http://localhost:3000/api/docs |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |

---

**End of Development Setup Guide**
