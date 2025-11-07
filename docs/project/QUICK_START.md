# Connect 2.0 Quick Start Guide

**Version:** 1.0
**Last Updated:** November 6, 2025
**Estimated Time:** 10 minutes

Get Connect 2.0 running locally in minutes. For comprehensive setup details, see [DEVELOPMENT_GUIDE.md](../technical/DEVELOPMENT_GUIDE.md).

---

## Prerequisites Check

Verify you have these installed:

```bash
node --version   # Should be v20.x
npm --version    # Should be 10.x
psql --version   # Should be 15.x
redis-cli --version  # Should be 7.x
docker --version     # Should be 24.x (optional)
git --version    # Should be 2.40+
```

---

## Quick Setup

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/blueprint/connect-2.0.git
cd connect-2.0

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 2. Configure Environment

```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env and set:
# - DATABASE_URL (PostgreSQL connection)
# - REDIS_URL (default: redis://localhost:6379)
# - JWT_SECRET (change from default)
```

### 3. Setup Database

**Option A: Using Docker (Recommended)**
```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Run migrations
cd backend
npm run migrate:latest

# Seed database with test data
npm run seed:run
```

**Option B: Local PostgreSQL**
```bash
# Create database
psql -U postgres
CREATE DATABASE connect2_dev;
CREATE USER connect2_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE connect2_dev TO connect2_user;
\q

# Run migrations
cd backend
npm run migrate:latest

# Seed database
npm run seed:run
```

### 4. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev

# Backend running at http://localhost:3000
# API docs at http://localhost:3000/api/docs
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Frontend running at http://localhost:5173
```

**Terminal 3 - Redis (if not using Docker):**
```bash
redis-server
```

### 5. Verify Installation

```bash
# Test backend health
curl http://localhost:3000/health

# Should return: {"status":"healthy"}

# Open browser to frontend
open http://localhost:5173
```

### 6. Login

**Default credentials (created by seed script):**
```
Email: admin@blueprint.com
Password: Admin123!
```

---

## Common Commands

### Backend
```bash
npm run dev              # Start dev server with hot reload
npm test                 # Run tests
npm run lint             # Check code style
npm run migrate:latest   # Run new migrations
npm run migrate:rollback # Rollback last migration
npm run seed:run         # Seed database
```

### Frontend
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm test                 # Run tests
npm run lint             # Check code style
```

### Docker
```bash
docker-compose up -d     # Start all services in background
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
docker-compose ps        # Check status
```

---

## Troubleshooting Quick Fixes

### Port Already in Use

```bash
# Backend (port 3000)
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000 && taskkill /F /PID <PID>  # Windows

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9  # macOS/Linux
```

### Database Connection Failed

```bash
# Stop and restart Docker services
docker-compose down
docker-compose up -d

# Re-run migrations
cd backend
npm run migrate:latest
```

### Node Modules Corrupted

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Docker Volumes Corrupted

```bash
# Reset all Docker data (WARNING: deletes database)
docker-compose down -v
docker-compose up -d
cd backend
npm run migrate:latest
npm run seed:run
```

---

## Project Structure

```
connect-2.0/
├── backend/              # Node.js/TypeScript API
│   ├── src/
│   │   ├── modules/      # Feature modules (projects, loans, etc.)
│   │   ├── shared/       # Shared utilities
│   │   └── integrations/ # External integrations
│   └── tests/            # Test files
│
├── frontend/             # React SPA
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom React hooks
│   │   └── services/     # API client
│   └── tests/            # Test files
│
├── docs/                 # Documentation
│   ├── technical/        # Technical docs
│   └── project/          # Project management docs
│
└── docker-compose.yml    # Local development services
```

---

## Architecture at a Glance

```
┌─────────────┐
│  Browser    │  http://localhost:5173
│  (React)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Backend    │  http://localhost:3000
│  (Node.js)  │  API Docs: /api/docs
└──────┬──────┘
       │
       ├──────► PostgreSQL (localhost:5432)
       ├──────► Redis (localhost:6379)
       └──────► External APIs (DocuSign, SendGrid, Azure)
```

---

## Next Steps

Now that you're running locally:

1. **Read the full docs**:
   - [DEVELOPMENT_GUIDE.md](../technical/DEVELOPMENT_GUIDE.md) - Complete setup & workflow
   - [API_SPECIFICATION.md](../technical/API_SPECIFICATION.md) - API endpoints
   - [DATABASE_SCHEMA.md](../technical/DATABASE_SCHEMA.md) - Database structure

2. **Start developing**:
   ```bash
   # Create feature branch
   git checkout develop
   git pull origin develop
   git checkout -b feature/E4-T1-your-feature-name

   # Make changes, test, commit
   git add .
   git commit -m "feat(module): add feature description"

   # Push and create PR
   git push origin feature/E4-T1-your-feature-name
   ```

3. **Join the team**:
   - Slack: #connect-dev channel
   - GitHub: Review open issues and PRs
   - Backlog: Check GitHub Project board for tasks

---

## Default Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 3000 | http://localhost:3000 |
| API Docs | 3000 | http://localhost:3000/api/docs |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |

---

## Tech Stack Summary

**Backend:**
- Node.js 20+ with TypeScript
- Fastify (web framework)
- PostgreSQL 15+ (database)
- Redis 7+ (cache/sessions)
- Prisma/TypeORM (ORM)

**Frontend:**
- React 18+ with TypeScript
- Vite (build tool)
- Material-UI or Tailwind CSS
- React Hook Form
- Zustand (state management)

**Infrastructure:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- AWS/Azure (cloud provider - TBD)

---

**Questions?** Check the [DEVELOPMENT_GUIDE.md](../technical/DEVELOPMENT_GUIDE.md) or ask in #connect-dev Slack channel.
