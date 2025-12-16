# LocalStack Development Environment - Hephaestus-Style Onboarding

**Purpose:** Developer onboarding exercise using AI-assisted development (Claude Code) with Hephaestus methodology
**Epic:** DP01-65 - LocalStack Development Environment Setup
**Target Audience:** New developers joining Connect 2.0 project
**Estimated Duration:** 3-5 hours per developer (self-paced)
**Repeatable:** Yes - Multiple developers can complete independently
**Created:** December 14, 2025

---

## Overview

This exercise introduces developers to the Connect 2.0 development workflow by having them implement the LocalStack local development environment **with Claude Code assistance**, following the Hephaestus semi-structured agentic framework.

**🔄 Multi-Developer Workflow:**
- Each developer works on their **own feature branch**
- Each developer implements their **own version** of the infrastructure
- Exercise is **repeatable** - reset between developers using cleanup scripts
- First completion creates the **canonical implementation** (merged to main)
- Subsequent developers **recreate** from scratch for learning (branches closed without merge)

### Learning Objectives

By completing this exercise, developers will:

1. **Master Claude Code Basics**
   - How to prompt Claude Code effectively
   - How to review and validate AI-generated code
   - When to accept vs. modify AI suggestions
   - How to use Claude Code for debugging

2. **Understand Hephaestus Methodology**
   - Ticket-driven workflow (BACKLOG → READY → IN_PROGRESS → VALIDATION → DONE)
   - Validation gates and acceptance criteria
   - Agent autonomy levels and decision-making
   - Self-validation protocols

3. **Learn Connect 2.0 Tech Stack**
   - Docker Compose orchestration
   - LocalStack AWS service emulation
   - PostgreSQL database setup
   - Node.js + TypeScript patterns
   - AWS SDK integration

4. **Establish Development Practices**
   - Git workflow (feature branches, PRs, code review)
   - Testing requirements (unit, integration, E2E)
   - Documentation standards
   - Security best practices

---

## The Hephaestus Approach

### Traditional vs. Hephaestus Developer Onboarding

| Traditional Approach | Hephaestus + Claude Code Approach |
|---------------------|-----------------------------------|
| Senior dev walks junior through setup | Junior dev implements setup **with AI assistance** |
| Read documentation, copy-paste commands | AI generates commands, junior **validates and understands** |
| Fixed tutorial steps | Adaptive implementation based on discoveries |
| Learning by following | **Learning by doing** with AI pair programming |
| Hours of manual setup | Minutes of setup, hours of **understanding** |

### Key Hephaestus Principles Applied

1. **Semi-Structured Execution**: Clear deliverables (7 tasks) with flexible implementation paths
2. **AI Agent Autonomy**: Claude Code makes tactical decisions, developer validates
3. **Validation Gates**: Each task has concrete acceptance criteria
4. **Adaptive Planning**: Developer + Claude can adjust based on discoveries
5. **Knowledge Accumulation**: Each task builds context for subsequent tasks

---

## Developer Workflow

### Phase 0: Setup (15 minutes)

**Before starting, developers must:**

1. **Install Prerequisites**
   - Docker Desktop (running and accessible)
   - Node.js 20 LTS
   - Git
   - Visual Studio Code with Claude Code extension
   - `awslocal` CLI: `pip install awscli-local`

2. **Clone Repository**
   ```bash
   git clone https://github.com/datapage/connect-2.0.git
   cd connect-2.0
   git checkout -b <your-name>/localstack-setup
   ```

3. **Access Jira Board**
   - Navigate to [DP01 Board](https://vividcg.atlassian.net/jira/software/c/projects/DP01/boards/1254)
   - Find Epic DP01-65: LocalStack Development Environment Setup
   - Review all 8 tasks (DP01-66 through DP01-73)

4. **Read Documentation Context**
   - [PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md) - Sections 3.3 (Tech Stack) and 7 (Data Model)
   - [TECHNOLOGY_STACK_DECISION.md](../../TECHNOLOGY_STACK_DECISION.md) - Why Node.js + AWS
   - [COST_OF_OWNERSHIP.md](../../COST_OF_OWNERSHIP.md) - LocalStack savings analysis

5. **Determine Your Role** (First vs. Subsequent Developer)

   **If you are the FIRST developer** completing this exercise:
   - Your branch will be merged to `main` upon successful completion
   - Your implementation becomes the canonical version
   - You are establishing the baseline for future developers

   **If you are a SUBSEQUENT developer** (2nd, 3rd, etc.):
   - Your branch is for learning only (will not be merged)
   - Complete all 8 tasks to gain hands-on experience
   - Compare your implementation to the canonical version (already in `main`)
   - Your branch will be closed after Tech Lead review
   - This ensures you learn by doing, not by copying

---

## Phase 0.5: Reset/Cleanup (For Subsequent Developers)

**⚠️ IMPORTANT: Only run this if you are NOT the first developer.**

If the LocalStack environment already exists from a previous developer's work, clean it up before starting:

### What Gets Reset vs. What Stays

**Files NEVER Modified During Onboarding (always synced from `main`):**
- ✅ **CLAUDE.md** - Project-wide AI assistant instructions (stays in sync automatically via git)
- ✅ **PRODUCT_REQUIREMENTS_DOCUMENT.md** - Product specifications
- ✅ **All documentation in `docs/planning/`** - Methodology guides, this onboarding guide
- ✅ **README.md** - You only add LocalStack references in Task 7, no conflicts
- ✅ **TECHNOLOGY_STACK_DECISION.md**, **COST_OF_OWNERSHIP.md** - Reference docs

**Files Created/Modified During Onboarding (reset between developers):**
- 🔄 **docker-compose.yml** - You create this in Task 1
- 🔄 **scripts/localstack-init.sh** - You create this in Task 2
- 🔄 **scripts/init-db.sql** - You create this in Task 3
- 🔄 **examples/nodejs-api/** - You create this in Task 4
- 🔄 **DEVELOPER_QUICKSTART.md** - You create this in Task 5
- 🔄 **LOCAL_DEVELOPMENT_PLAN.md** - May already exist, you enhance it in Task 6

### Staying in Sync with CLAUDE.md

**CLAUDE.md is automatically synced via Git:**

1. **When you start onboarding:**
   ```bash
   git checkout main
   git pull origin main  # ← Gets latest CLAUDE.md
   git checkout -b <your-name>/localstack-setup
   # CLAUDE.md is now in your branch (synced from main)
   ```

2. **If CLAUDE.md is updated while you're working:**
   ```bash
   # Periodically sync with main to get latest CLAUDE.md updates
   git fetch origin main
   git merge origin/main  # Merge latest changes including CLAUDE.md
   # No conflicts - you never modify CLAUDE.md during onboarding
   ```

3. **If you discover something that should be in CLAUDE.md:**
   - Create a **separate PR** for documentation improvements
   - Don't wait for your onboarding branch to be complete
   - Documentation fixes can be merged immediately

   ```bash
   # Create separate branch for docs improvement
   git checkout main
   git pull
   git checkout -b docs/improve-claude-md
   # Edit CLAUDE.md with your improvement
   git add CLAUDE.md
   git commit -m "docs: Add LocalStack troubleshooting tip to CLAUDE.md"
   gh pr create --title "Improve CLAUDE.md based on onboarding feedback"
   # PR can be merged immediately

   # Get back to onboarding
   git checkout <your-name>/localstack-setup
   git merge main  # Pull in your CLAUDE.md improvement
   ```

**Key Point:** CLAUDE.md is **never reset** by the cleanup script. It's a shared project resource that all developers contribute to improving over time.

### Cleanup Script

The reset script ONLY removes files you create during onboarding. It never touches CLAUDE.md, docs/, or other planning documents.

Run `scripts/reset-onboarding.sh` (already exists in the repo):

```bash
#!/bin/bash
# Reset LocalStack onboarding exercise for next developer

echo "🧹 Resetting LocalStack onboarding environment..."

# Stop and remove all containers
echo "Stopping Docker containers..."
docker-compose down -v

# Remove all generated files from previous implementation
echo "Removing generated files..."
rm -f docker-compose.yml
rm -f scripts/localstack-init.sh
rm -f scripts/init-db.sql
rm -f DEVELOPER_QUICKSTART.md
rm -rf examples/nodejs-api

# Remove Docker images (optional - saves disk space)
read -p "Remove LocalStack/PostgreSQL Docker images? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    docker rmi localstack/localstack:latest
    docker rmi postgres:15-alpine
    docker rmi redis:7-alpine
    docker rmi dpage/pgadmin4
fi

# Clean Docker system (optional - frees space)
read -p "Run docker system prune? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    docker system prune -f
fi

echo "✅ Reset complete! You can now start the onboarding exercise."
echo "Next step: git checkout -b <your-name>/localstack-setup"
```

### Reset Checklist

Before starting your onboarding:
- [ ] Run reset script: `bash scripts/reset-onboarding.sh`
- [ ] Verify no containers running: `docker ps` (should be empty)
- [ ] Verify files deleted: `ls docker-compose.yml` (should not exist)
- [ ] Create your feature branch: `git checkout -b <your-name>/localstack-setup`
- [ ] Verify clean state: `git status` (should show no uncommitted changes except reset script)

---

## Task Breakdown (Hephaestus-Style Tickets)

Each task follows this structure:

```yaml
ticket_structure:
  - Jira Issue: DP01-XX
  - Status: BACKLOG → READY → IN_PROGRESS → VALIDATION → DONE
  - Autonomy Level: How much Claude can decide vs. require human approval
  - Acceptance Criteria: What "done" looks like
  - Validation Gates: Automated tests + manual checks
  - Self-Validation: Developer runs checklist before marking complete
```

---

### Task 1: Docker Compose Configuration

**Jira Issue:** DP01-66
**Estimated Time:** 45 minutes
**Autonomy Level:** HIGH (Claude can make most decisions)

#### Claude Code Prompt Template

```
I need to create a docker-compose.yml file for our local development environment.

Requirements:
- LocalStack container (port 4566) with S3, SQS, SNS, Secrets Manager, CloudWatch
- PostgreSQL 15 container (port 5432)
- Redis 7 container (port 6379)
- pgAdmin container (port 5050) for database management
- All services on shared Docker network
- LocalStack init script should auto-run on startup
- PostgreSQL init script should auto-run on startup
- Persistent volumes for PostgreSQL data

Context files to read:
- LOCAL_DEVELOPMENT_PLAN.md (sections 5-6)
- scripts/localstack-init.sh (will be created in Task 2)
- scripts/init-db.sql (will be created in Task 3)

Create the docker-compose.yml at the repository root.
```

#### Developer Responsibilities

**Before accepting Claude's solution:**
- [ ] Review proposed docker-compose.yml structure
- [ ] Verify LocalStack services list matches requirements (S3, SQS, SNS, etc.)
- [ ] Check that volume mounts are correct (init scripts will execute)
- [ ] Confirm port mappings don't conflict with existing services
- [ ] Ask Claude to explain any unfamiliar Docker Compose syntax

**Validation Gates:**
```bash
# Automated validation (run these commands)
docker-compose config  # Should parse without errors
docker-compose up -d   # Should start all 4 services

# Expected output
docker-compose ps
# NAME                   STATUS
# localstack             Up 30 seconds
# postgres               Up 30 seconds
# redis                  Up 30 seconds
# pgadmin                Up 30 seconds
```

**Manual validation:**
- [ ] LocalStack accessible: `curl http://localhost:4566/_localstack/health`
- [ ] PostgreSQL accessible: `psql -h localhost -U connect_user -d connect2_dev` (will fail until Task 3 complete - that's OK)
- [ ] Redis accessible: `redis-cli -h localhost ping` → PONG
- [ ] pgAdmin UI accessible: `http://localhost:5050`

**Self-Validation Checklist:**
- [ ] I understand what each service in docker-compose.yml does
- [ ] I know how to view logs: `docker-compose logs <service>`
- [ ] I can stop/start services: `docker-compose down`, `docker-compose up -d`
- [ ] I reviewed the generated file and didn't just accept blindly
- [ ] All validation gates passed

**Move to DONE in Jira when checklist complete.**

---

### Task 2: LocalStack AWS Resource Initialization

**Jira Issue:** DP01-67
**Estimated Time:** 60 minutes
**Autonomy Level:** MEDIUM (Claude can decide resource names, must consult on security)

#### Claude Code Prompt Template

```
Create a bash script that initializes all AWS resources in LocalStack on container startup.

Requirements:
- Script location: scripts/localstack-init.sh
- Must be idempotent (can run multiple times without errors)
- Create 3 S3 buckets: connect2-documents-dev, connect2-documents-archive, connect2-temp
- Create 5 SQS queues: connect2-document-processing, connect2-notifications, connect2-email-queue, connect2-task-queue, connect2-draw-workflow
- Create 4 SNS topics: connect2-system-events, connect2-draw-updates, connect2-loan-status, connect2-notifications
- Create 4 Secrets Manager secrets: connect2/database, connect2/jwt, connect2/api-keys, connect2/third-party
- Create CloudWatch log groups for application logging
- Use `awslocal` CLI (LocalStack wrapper for AWS CLI)
- Include verification/status output at the end

Context files to read:
- LOCAL_DEVELOPMENT_PLAN.md (section 6: LocalStack Configuration)
- PRODUCT_REQUIREMENTS_DOCUMENT.md (section 9: Integration Architecture)

After creating the script, explain:
1. Why we need each resource type
2. How to verify resources were created correctly
3. What happens if script runs twice (idempotency)
```

#### Developer Responsibilities

**Before accepting Claude's solution:**
- [ ] Review the `awslocal` commands (understand what each does)
- [ ] Ask Claude why we need each resource (understand business context)
- [ ] Verify script is executable: `chmod +x scripts/localstack-init.sh`
- [ ] Confirm error handling exists (script doesn't fail silently)

**Validation Gates:**
```bash
# Automated validation
docker-compose restart localstack  # Triggers init script
docker-compose logs localstack | grep "Initialization complete"

# Verify S3 buckets created
awslocal s3 ls
# Expected: 3 buckets listed

# Verify SQS queues created
awslocal sqs list-queues
# Expected: 5 queue URLs

# Verify SNS topics created
awslocal sns list-topics
# Expected: 4 topic ARNs

# Verify Secrets Manager secrets created
awslocal secretsmanager list-secrets
# Expected: 4 secrets

# Test idempotency (run twice, should not fail)
bash scripts/localstack-init.sh
bash scripts/localstack-init.sh  # Should succeed, not create duplicates
```

**Manual validation:**
- [ ] Script output is clear and shows what was created
- [ ] No error messages in script output
- [ ] CloudWatch log groups exist: `awslocal logs describe-log-groups`

**Self-Validation Checklist:**
- [ ] I understand why we emulate AWS services locally (cost savings, speed)
- [ ] I know how to list resources: `awslocal s3 ls`, `awslocal sqs list-queues`, etc.
- [ ] I can troubleshoot if a resource fails to create
- [ ] I understand what "idempotent" means and why it matters
- [ ] All validation gates passed

**Move to DONE in Jira when checklist complete.**

---

### Task 3: PostgreSQL Database Schema

**Jira Issue:** DP01-68
**Estimated Time:** 90 minutes
**Autonomy Level:** LOW (Claude generates schema, developer must validate against PRD)

#### Claude Code Prompt Template

```
Create a SQL initialization script for PostgreSQL with complete database schema and seed data.

Requirements:
- Script location: scripts/init-db.sql
- Create schema namespace: connect2
- Implement all 13 tables from PRD Section 7 (Data Model):
  1. users
  2. contacts
  3. projects
  4. feasibility
  5. consultant_tasks
  6. entitlement
  7. permit_corrections
  8. loans
  9. loan_guarantors
  10. draws
  11. documents
  12. tasks
  13. audit_log

- Include foreign key constraints
- Include indexes for commonly queried fields
- Enable uuid-ossp extension for UUID generation
- Seed data:
  - 5 users (admin, acquisitions, design, entitlement, servicing)
  - 10 contacts (5 agents, 3 builders, 2 consultants)
  - 8 projects in various states (LEAD, FEASIBILITY, GO, PASS)
  - 3 loans with active draws
  - 15 documents

Context files to read:
- PRODUCT_REQUIREMENTS_DOCUMENT.md (Section 7: Data Model, lines 817-1082)
- LOCAL_DEVELOPMENT_PLAN.md (Section 7: Database Setup)

For each table, explain:
1. What business entity it represents
2. Key relationships (foreign keys)
3. Why certain indexes exist
```

#### Developer Responsibilities

**CRITICAL: Schema Validation Required**

Before accepting Claude's schema, developer must:
- [ ] Open PRD Section 7 side-by-side with generated SQL
- [ ] Verify each table matches PRD specifications:
  - [ ] users table (PRD lines 850-870)
  - [ ] contacts table (PRD lines 872-895)
  - [ ] projects table (PRD lines 897-925)
  - [ ] feasibility table (PRD lines 927-950)
  - [ ] consultant_tasks table (PRD lines 952-972)
  - [ ] entitlement table (PRD lines 974-995)
  - [ ] permit_corrections table (PRD lines 997-1015)
  - [ ] loans table (PRD lines 1017-1045)
  - [ ] loan_guarantors table (PRD lines 1047-1062)
  - [ ] draws table (PRD lines 1064-1085)
  - [ ] documents table (PRD lines 1087-1108)
  - [ ] tasks table (PRD lines 1110-1135)
  - [ ] audit_log table (PRD lines 1137-1155)
- [ ] Verify foreign key relationships are correct
- [ ] Ask Claude to explain any deviations from PRD

**Validation Gates:**
```bash
# Automated validation
docker-compose restart postgres  # Triggers init script
docker-compose logs postgres | grep "database system is ready"

# Connect to database
psql -h localhost -U connect_user -d connect2_dev

# Verify all tables exist
\dt connect2.*
# Expected: 13 tables listed

# Verify seed data
SELECT COUNT(*) FROM connect2.users;     # Expected: 5
SELECT COUNT(*) FROM connect2.contacts;  # Expected: 10
SELECT COUNT(*) FROM connect2.projects;  # Expected: 8
SELECT COUNT(*) FROM connect2.loans;     # Expected: 3

# Test foreign key constraints
# Try inserting project with invalid user (should fail)
INSERT INTO connect2.projects (assigned_to) VALUES ('00000000-0000-0000-0000-000000000000');
# Expected: ERROR - foreign key constraint violation

# Verify indexes exist
\di connect2.*
# Expected: Indexes on all foreign keys + commonly queried fields
```

**Manual validation:**
- [ ] pgAdmin UI can connect and browse schema
- [ ] Sample data looks realistic (names, addresses, etc.)
- [ ] All timestamps use `TIMESTAMP WITH TIME ZONE`
- [ ] UUIDs used for primary keys (not sequential integers)

**Self-Validation Checklist:**
- [ ] I understand the Connect 2.0 data model (how projects → feasibility → entitlement → loans flow)
- [ ] I verified schema matches PRD (not just trusted AI)
- [ ] I know how to query the database: `psql` or pgAdmin
- [ ] I understand why foreign keys and indexes matter
- [ ] All validation gates passed

**Decision Point: If schema doesn't match PRD, DO NOT proceed. Ask Claude to fix discrepancies first.**

**Move to DONE in Jira when checklist complete.**

---

### Task 4: Node.js API Example

**Jira Issue:** DP01-69
**Estimated Time:** 120 minutes
**Autonomy Level:** HIGH (Claude implements patterns, developer validates integration)

#### Claude Code Prompt Template

```
Create a complete working Node.js API demonstrating LocalStack S3, SQS, and PostgreSQL integration.

Requirements:
- Directory: examples/nodejs-api/
- Framework: Express.js + TypeScript
- Demonstrate:
  1. AWS SDK configuration (auto-detect LocalStack vs production AWS)
  2. S3 document upload/download with pre-signed URLs
  3. SQS message sending/receiving
  4. PostgreSQL CRUD operations via pg driver
  5. RESTful API design patterns

- API Endpoints:
  - GET /api/v1/projects (list with filters)
  - GET /api/v1/projects/:id (get by ID)
  - POST /api/v1/projects (create)
  - PATCH /api/v1/projects/:id (update)
  - POST /api/v1/projects/:id/transition (change status)
  - POST /api/v1/projects/:id/documents (upload file to S3)
  - GET /api/v1/projects/:id/documents (list documents)
  - GET /api/v1/projects/:id/documents/:docId/download (get pre-signed URL)

- Project Structure:
  examples/nodejs-api/
  ├── src/
  │   ├── config/
  │   │   ├── aws.js          # AWS SDK config (LocalStack detection)
  │   │   └── database.js     # PostgreSQL connection
  │   ├── services/
  │   │   ├── s3Service.js    # S3 operations
  │   │   └── queueService.js # SQS operations
  │   ├── routes/
  │   │   └── projectRoutes.js # API endpoints
  │   └── index.js            # Express app
  ├── package.json
  ├── tsconfig.json
  ├── .env.example
  └── README.md

Context files to read:
- PRODUCT_REQUIREMENTS_DOCUMENT.md (Section 8: API Design)
- LOCAL_DEVELOPMENT_PLAN.md (Section 8: AWS SDK Integration)
- TECHNOLOGY_STACK_DECISION.md (Node.js rationale)

For each file, explain:
1. What pattern it demonstrates
2. How it works with LocalStack
3. How to switch to production AWS (env vars only)
```

#### Developer Responsibilities

**Code Review Required**

Before accepting Claude's implementation, developer must:
- [ ] Review `src/config/aws.js` - understand LocalStack detection logic
- [ ] Review `src/services/s3Service.js` - understand S3 upload flow
- [ ] Review `src/services/queueService.js` - understand SQS message handling
- [ ] Review `src/routes/projectRoutes.js` - understand API patterns
- [ ] Ask Claude to explain any complex code sections
- [ ] Verify security: No hardcoded credentials, proper input validation

**Validation Gates:**
```bash
# Setup and start API
cd examples/nodejs-api
npm install
cp .env.example .env
npm run dev

# Expected output:
# Server running on http://localhost:3000

# Test endpoints (in separate terminal)

# 1. Health check
curl http://localhost:3000/health
# Expected: {"status":"ok"}

# 2. List projects (empty initially)
curl http://localhost:3000/api/v1/projects
# Expected: {"projects":[],"count":0}

# 3. Create project
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "address": "456 Test Ave",
    "city": "Seattle",
    "state": "WA",
    "zip": "98103",
    "purchasePrice": 600000,
    "listPrice": 650000
  }'
# Expected: 201 Created, returns project object with ID

# 4. Upload document (use project ID from step 3)
curl -X POST http://localhost:3000/api/v1/projects/<PROJECT_ID>/documents \
  -F "file=@./test-document.pdf" \
  -F "type=SURVEY" \
  -F "description=Property survey"
# Expected: 201 Created, returns document object

# 5. Verify S3 upload
awslocal s3 ls s3://connect2-documents-dev/documents/
# Expected: File listed

# 6. Verify SQS message
awslocal sqs receive-message \
  --queue-url http://localhost:4566/000000000000/connect2-document-processing
# Expected: Message with action: "extract", documentId: <ID>

# 7. Get download URL
curl http://localhost:3000/api/v1/projects/<PROJECT_ID>/documents/<DOC_ID>/download
# Expected: Pre-signed URL (valid for 1 hour)
```

**Manual validation:**
- [ ] API returns proper HTTP status codes (200, 201, 400, 404, 500)
- [ ] Error messages are clear and helpful
- [ ] S3 files stored with correct path structure
- [ ] Database records match API responses
- [ ] README includes clear usage examples

**Self-Validation Checklist:**
- [ ] I understand the Express.js routing pattern
- [ ] I know how AWS SDK detects LocalStack (env var: `AWS_ENDPOINT_URL`)
- [ ] I can explain what a pre-signed URL is and why we use it
- [ ] I understand async/await patterns in the code
- [ ] All validation gates passed

**Move to DONE in Jira when checklist complete.**

---

### Task 5: Developer Quickstart Guide

**Jira Issue:** DP01-70
**Estimated Time:** 30 minutes
**Autonomy Level:** HIGH (Claude writes, developer validates clarity)

#### Claude Code Prompt Template

```
Create a concise quickstart guide for developers to setup their local environment in under 5 minutes.

Requirements:
- File: DEVELOPER_QUICKSTART.md
- Target audience: New developers with prerequisites already installed
- Tone: Concise, imperative commands, minimal explanation
- Structure:
  1. Prerequisites (2-3 lines)
  2. Quick Start (3 commands max)
  3. Verification (4 commands to confirm everything works)
  4. Common Commands (daily development tasks)
  5. Troubleshooting (5 most common issues)
  6. Quick Reference Table (service URLs, credentials)
  7. Next Steps (link to comprehensive guides)

Context files to read:
- LOCAL_DEVELOPMENT_PLAN.md (consolidate into quick commands)
- examples/nodejs-api/README.md (API setup steps)

The guide should be so clear that a developer can follow it without asking questions.
```

#### Developer Responsibilities

**Usability Testing Required**

Developer must test the guide on a **fresh clone**:
- [ ] Delete local repository
- [ ] Clone repository again
- [ ] Follow DEVELOPER_QUICKSTART.md exactly (no shortcuts)
- [ ] Time how long setup takes (should be < 5 minutes)
- [ ] Note any confusing steps or missing information
- [ ] Ask Claude to clarify/fix any issues

**Validation Gates:**
```bash
# Follow DEVELOPER_QUICKSTART.md from top to bottom
# All commands should work without errors
# All verification commands should pass
```

**Manual validation:**
- [ ] Guide is < 150 lines (concise)
- [ ] All commands are copy-pasteable (no placeholders like `<YOUR_VALUE>`)
- [ ] Troubleshooting section covers port conflicts, permission issues, container failures
- [ ] Quick reference table is accurate and complete

**Self-Validation Checklist:**
- [ ] I tested the guide on a fresh environment
- [ ] Setup completed in < 5 minutes
- [ ] A non-technical person could follow this guide
- [ ] I would feel confident sharing this with new team members
- [ ] All validation gates passed

**Move to DONE in Jira when checklist complete.**

---

### Task 6: Comprehensive Local Development Plan

**Jira Issue:** DP01-71
**Estimated Time:** 45 minutes (review and validate existing document)
**Autonomy Level:** MEDIUM (Claude can fill gaps, must preserve existing content)

#### Task Context

The LOCAL_DEVELOPMENT_PLAN.md already exists (~4,500 lines). This task is about:
1. Reviewing the existing document
2. Filling any gaps discovered during Tasks 1-5
3. Ensuring accuracy (all commands work)
4. Adding developer-specific insights

#### Claude Code Prompt Template

```
Review and enhance the existing LOCAL_DEVELOPMENT_PLAN.md based on implementation learnings.

Context:
- I've just completed Tasks 1-5 (Docker Compose, LocalStack init, database schema, Node.js API, quickstart guide)
- LOCAL_DEVELOPMENT_PLAN.md was created before implementation
- Some details may be outdated or incomplete

Tasks:
1. Read LOCAL_DEVELOPMENT_PLAN.md in full
2. Identify gaps or inaccuracies based on actual implementation
3. Add a new section: "Developer Insights" with:
   - Common pitfalls and how to avoid them
   - Performance tips for local development
   - Debugging techniques for LocalStack issues
   - How to speed up Docker Compose startup
4. Verify all code examples and commands actually work
5. Add cost analysis section with detailed breakdown

Do NOT rewrite the entire document. Only add/update specific sections.
```

#### Developer Responsibilities

**Documentation Review Required**

Developer must review these sections for accuracy:
- [ ] Section 5: Docker Compose Setup (matches docker-compose.yml from Task 1?)
- [ ] Section 6: LocalStack Configuration (matches scripts/localstack-init.sh from Task 2?)
- [ ] Section 7: Database Setup (matches scripts/init-db.sql from Task 3?)
- [ ] Section 8: AWS SDK Integration (matches examples/nodejs-api/src/config/aws.js from Task 4?)
- [ ] All command examples work when copy-pasted

**Validation Gates:**
```bash
# Test all bash commands in document (spot check 10-15 commands)
# Verify they execute without errors

# Example commands to test:
docker-compose config
awslocal s3 ls
psql -h localhost -U connect_user -d connect2_dev -c "\dt connect2.*"
curl http://localhost:3000/health
npm run test  # In examples/nodejs-api
```

**Manual validation:**
- [ ] Code examples use syntax highlighting (```bash, ```javascript, etc.)
- [ ] Architecture diagram is clear and matches implementation
- [ ] Cost analysis is accurate ($95,400/year savings)
- [ ] Troubleshooting section is comprehensive

**Self-Validation Checklist:**
- [ ] I read the entire document (skimming doesn't count)
- [ ] I tested command examples from each section
- [ ] I added my own insights from implementation experience
- [ ] The document is now a reliable reference guide
- [ ] All validation gates passed

**Move to DONE in Jira when checklist complete.**

---

### Task 7: Update Repository README

**Jira Issue:** DP01-72
**Estimated Time:** 20 minutes
**Autonomy Level:** HIGH (Claude updates, developer validates links)

#### Claude Code Prompt Template

```
Update the main README.md to include comprehensive references to LocalStack setup and guides.

Requirements:
- Add LocalStack to "Quick Start for Developers" section (with links)
- Update "Technology Stack" section to include "Local Dev: LocalStack + Docker Compose"
- Update "Cost Summary" to include "LocalStack Savings: $95,400/year"
- Update "Repository Structure" to show new files:
  - docker-compose.yml
  - scripts/localstack-init.sh
  - scripts/init-db.sql
  - examples/nodejs-api/
- Ensure all links work (relative paths from repo root)

Context files to read:
- README.md (existing content)
- DEVELOPER_QUICKSTART.md (link to this)
- LOCAL_DEVELOPMENT_PLAN.md (link to this)
- examples/nodejs-api/README.md (link to this)

Maintain existing README structure and tone. Only add/update relevant sections.
```

#### Developer Responsibilities

**Link Validation Required**

Developer must verify all links work:
- [ ] Click every markdown link in updated README
- [ ] Verify relative paths are correct (`[text](./path/to/file.md)`)
- [ ] Check that referenced files exist
- [ ] Ensure code blocks render correctly on GitHub

**Validation Gates:**
```bash
# Use markdown linter
npm install -g markdownlint-cli
markdownlint README.md
# Expected: No errors

# Check for broken links (optional tool)
npm install -g markdown-link-check
markdown-link-check README.md
```

**Manual validation:**
- [ ] README renders correctly on GitHub (preview mode)
- [ ] Table of contents links work (if present)
- [ ] LocalStack content is prominently visible
- [ ] Cost savings is highlighted

**Self-Validation Checklist:**
- [ ] All links tested and working
- [ ] README is still concise and scannable
- [ ] New developers will find LocalStack setup easily
- [ ] Existing content not disrupted
- [ ] All validation gates passed

**Move to DONE in Jira when checklist complete.**

---

### Task 8: End-to-End Testing & Validation

**Jira Issue:** DP01-73
**Estimated Time:** 90 minutes
**Autonomy Level:** LOW (Developer-driven testing, Claude assists with debugging)

#### Task Context

This is the final validation task where the developer tests the entire LocalStack environment as a cohesive system.

#### Testing Scenarios

**Scenario 1: Fresh Environment Setup (30 min)**

Simulate a new developer joining the team:
1. Delete all Docker containers, volumes, images
   ```bash
   docker-compose down -v
   docker system prune -a --volumes -f
   ```
2. Clone repository to new directory (simulate fresh clone)
3. Follow DEVELOPER_QUICKSTART.md exactly
4. Time the setup process (should be < 5 minutes)
5. Verify all services start successfully

**Scenario 2: Full Workflow Test (45 min)**

Execute a realistic development workflow:
1. Start environment: `docker-compose up -d`
2. Create a project via API
3. Upload a document (triggers S3 upload + SQS message)
4. Verify document in S3: `awslocal s3 ls s3://connect2-documents-dev/documents/`
5. Receive SQS message: `awslocal sqs receive-message --queue-url ...`
6. Query database to verify project record
7. Transition project status: LEAD → FEASIBILITY → GO
8. Verify audit log entries in database
9. Generate document download URL (pre-signed)
10. Stop environment: `docker-compose down`
11. Restart environment (verify data persists)
12. Query database again (verify data still there)

**Scenario 3: Troubleshooting Practice (15 min)**

Intentionally break things and fix them:
1. Stop PostgreSQL: `docker-compose stop postgres`
2. Try API call (should fail gracefully)
3. Restart PostgreSQL: `docker-compose start postgres`
4. Verify API recovers
5. Delete LocalStack init script: `rm scripts/localstack-init.sh`
6. Restart LocalStack (should fail to create resources)
7. Restore script: `git checkout scripts/localstack-init.sh`
8. Verify recovery

#### Developer Responsibilities

**Testing Documentation**

Developer must document test results:
- [ ] Create `TEST_RESULTS.md` with:
  - Date and environment details (OS, Docker version)
  - Test scenario results (pass/fail for each)
  - Performance metrics (setup time, API response times)
  - Issues found and resolutions
  - Recommendations for improvement

**Validation Gates:**
```bash
# All scenarios must pass
# Performance targets:
# - Fresh setup: < 5 minutes
# - API response time: < 50ms (local calls)
# - Docker Compose startup: < 60 seconds
# - Database query time: < 10ms
```

**Self-Validation Checklist:**
- [ ] I completed all 3 test scenarios
- [ ] I documented all findings in TEST_RESULTS.md
- [ ] I can troubleshoot common issues without help
- [ ] I feel confident using this environment for real development
- [ ] All validation gates passed

**Final Decision Gate:**

Before marking Epic DP01-65 as complete, validate:
- [ ] All 8 tasks (DP01-66 through DP01-73) are DONE in Jira
- [ ] All code committed to feature branch
- [ ] Pull request created with summary of implementation
- [ ] Code review requested from Tech Lead
- [ ] Documentation reviewed and approved
- [ ] No P0 bugs remaining

**Move Epic DP01-65 to DONE when all tasks complete.**

---

## Developer Self-Assessment

After completing all tasks, developers should be able to answer:

### Technical Understanding
- [ ] What is LocalStack and why do we use it?
- [ ] How does the AWS SDK detect LocalStack vs. production AWS?
- [ ] What's the difference between S3 bucket storage and PostgreSQL database storage?
- [ ] How do SQS queues enable asynchronous processing?
- [ ] Why do we use UUIDs instead of auto-incrementing integers for primary keys?

### Practical Skills
- [ ] Can start/stop the local environment independently
- [ ] Can query the database using psql or pgAdmin
- [ ] Can list S3 buckets and files using `awslocal s3 ls`
- [ ] Can send/receive SQS messages using `awslocal sqs`
- [ ] Can troubleshoot Docker Compose issues (port conflicts, volume mounts)

### Development Workflow
- [ ] Can create a feature branch and make commits
- [ ] Can run the sample API and test endpoints
- [ ] Understand the validation gate process (automated + manual checks)
- [ ] Know when to ask for help vs. search documentation

### Hephaestus Methodology
- [ ] Understand ticket-driven workflow (BACKLOG → READY → IN_PROGRESS → VALIDATION → DONE)
- [ ] Know the difference between autonomy levels (LOW, MEDIUM, HIGH)
- [ ] Can write acceptance criteria for a new task
- [ ] Understand self-validation protocols

---

## Claude Code Best Practices (Learned from This Exercise)

### Effective Prompting

**Good Prompts:**
- Specific requirements with acceptance criteria
- Context files to read (with line numbers if relevant)
- Clear deliverables (file paths, function names)
- Request explanations, not just code

**Example:**
```
Create a function that uploads a file to S3 with the following requirements:
- Function name: uploadDocument
- Parameters: fileBuffer, fileName, metadata
- Returns: { bucket, key, url }
- Use AWS SDK v3
- Auto-detect LocalStack via AWS_ENDPOINT_URL env var
- Include error handling for network failures
- Explain: Why do we use PutObjectCommand vs. putObject?

Context: Read src/config/aws.js to understand existing AWS SDK setup.
```

**Bad Prompts:**
```
Make it work with S3
```

### Reviewing AI-Generated Code

**Always Check:**
1. **Security**: No hardcoded credentials, proper input validation
2. **Error Handling**: Try/catch blocks, meaningful error messages
3. **Configuration**: Uses environment variables, not hardcoded values
4. **Testing**: Testable code structure (dependency injection, pure functions)
5. **Documentation**: Clear comments explaining "why", not "what"

**Red Flags:**
- `any` type in TypeScript (type safety lost)
- `// TODO` comments (Claude couldn't figure it out)
- Hardcoded values (ports, URLs, credentials)
- No error handling (assumes happy path only)
- Overly complex solutions (simpler is better)

### When to Accept vs. Modify

**Accept Claude's Code When:**
- It passes all validation gates
- You understand how it works
- It follows project conventions
- Security review passes
- Tests are comprehensive

**Modify Claude's Code When:**
- You spot a security issue
- Performance can be improved
- Code style doesn't match project standards
- Edge cases not handled
- You have a simpler solution

**Ask Claude to Regenerate When:**
- Solution is fundamentally flawed
- Requirements misunderstood
- Code is overly complex
- Documentation is unclear

---

## Troubleshooting Guide

### Common Issues & Solutions

**Issue 1: Docker Compose fails to start**
```
Error: Cannot start service postgres: driver failed programming external connectivity on endpoint
```
**Solution:** Port already in use. Check with `lsof -i :5432` and kill process, or change port in docker-compose.yml

**Issue 2: LocalStack init script doesn't run**
```
LocalStack container starts but resources not created
```
**Solution:** Verify volume mount path in docker-compose.yml. Script must be at `/etc/localstack/init/ready.d/init.sh` inside container.

**Issue 3: PostgreSQL init script fails**
```
ERROR: relation "connect2.users" already exists
```
**Solution:** Database already initialized. Either:
- Use existing database
- Delete volume: `docker-compose down -v` (WARNING: deletes data)

**Issue 4: API can't connect to PostgreSQL**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Check DATABASE_URL in .env file. If running API in Docker, use service name `postgres` instead of `localhost`.

**Issue 5: S3 upload fails with "bucket does not exist"**
```
NoSuchBucket: The specified bucket does not exist
```
**Solution:** LocalStack init script didn't run. Restart LocalStack: `docker-compose restart localstack`

### Getting Help

**Self-Service:**
1. Check troubleshooting sections in DEVELOPER_QUICKSTART.md and LOCAL_DEVELOPMENT_PLAN.md
2. Review Docker Compose logs: `docker-compose logs <service>`
3. Ask Claude Code: "I'm seeing this error: ... How do I fix it?"

**Escalate to Team:**
1. Post in Slack #connect-dev with error message and what you tried
2. Tag @tech-lead if urgent
3. Create GitHub issue for documentation bugs

---

## Success Metrics

After completing this onboarding exercise, we track:

### Individual Developer Metrics
- **Setup Time:** < 5 minutes (from clone to running environment)
- **Task Completion Rate:** 8/8 tasks completed
- **Self-Validation Pass Rate:** >90% (developer catches issues before code review)
- **Documentation Quality:** All files have clear README/comments

### Team-Wide Metrics
- **Onboarding Time:** 3-5 hours (down from 2-3 days traditional onboarding)
- **Environment Consistency:** 100% (everyone has identical setup)
- **Blocked Time:** < 10% (minimal time waiting for help)
- **Confidence Score:** ≥4/5 (post-exercise survey)

### Business Impact
- **Cost Savings:** $95,400/year (vs. AWS dev accounts)
- **Development Speed:** 10-50x faster API calls (local vs. remote)
- **Offline Capability:** 100% (no internet required after initial setup)

---

## Completion Workflow

### For FIRST Developer

**After completing all 8 tasks:**

1. **Create Pull Request**
   ```bash
   git add .
   git commit -m "DP01-65: Complete LocalStack development environment setup

   - Docker Compose configuration
   - LocalStack AWS resource initialization
   - PostgreSQL schema with 13 tables
   - Node.js API with S3/SQS/PostgreSQL integration
   - Developer quickstart guide
   - Comprehensive development documentation
   - Updated repository README
   - End-to-end testing validation

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"

   git push origin <your-name>/localstack-setup
   ```

2. **Create PR in GitHub**
   ```bash
   gh pr create --title "DP01-65: LocalStack Development Environment Setup" \
     --body "$(cat <<'EOF'
   ## Summary
   Complete implementation of LocalStack local development environment following Hephaestus onboarding exercise.

   ## Tasks Completed
   - [x] DP01-66: Docker Compose configuration
   - [x] DP01-67: LocalStack init script (3 S3 buckets, 5 SQS queues, 4 SNS topics, 4 secrets)
   - [x] DP01-68: PostgreSQL schema (13 tables, seed data)
   - [x] DP01-69: Node.js API examples (8 endpoints)
   - [x] DP01-70: Developer quickstart guide
   - [x] DP01-71: Comprehensive documentation
   - [x] DP01-72: Updated README
   - [x] DP01-73: E2E testing and validation

   ## Validation Results
   - All automated tests: ✅ PASS
   - Manual validation: ✅ PASS
   - Self-assessment: ✅ 100% complete
   - Setup time: X minutes (target: < 5 min)
   - Test coverage: X% (target: > 75%)

   ## What I Learned
   [Add 2-3 key takeaways from the exercise]

   ## Next Steps
   - Tech Lead review
   - Merge to main (becomes canonical implementation)
   - Document serves as baseline for future developers

   🤖 Generated with Claude Code
   EOF
   )"
   ```

3. **Request Reviews**
   - Tag Tech Lead for code review
   - Tag DevOps Lead for infrastructure review
   - Wait for approval

4. **After PR Merged**
   - Mark Epic DP01-65 as DONE in Jira
   - Update onboarding documentation with any learnings
   - Prepare to mentor next developer

---

### For SUBSEQUENT Developers

**After completing all 8 tasks:**

1. **Create Comparison Report**

   Compare your implementation to the canonical version (in `main`):

   ```bash
   # Compare your implementation to canonical
   git diff main HEAD docker-compose.yml > comparison/docker-compose-diff.txt
   git diff main HEAD scripts/localstack-init.sh > comparison/localstack-diff.txt
   git diff main HEAD scripts/init-db.sql > comparison/database-diff.txt
   ```

2. **Write Learning Summary**

   Create `ONBOARDING_REFLECTION.md` in your branch:

   ```markdown
   # LocalStack Onboarding - Learning Summary

   **Developer:** <Your Name>
   **Date Completed:** <Date>
   **Total Time:** <Hours>

   ## Self-Assessment

   ### What I Learned
   1. Claude Code pair programming techniques
   2. Hephaestus validation gate workflow
   3. Docker Compose and LocalStack integration
   4. [Add more learnings]

   ### Challenges Faced
   1. [Challenge 1] - Resolved by [solution]
   2. [Challenge 2] - Resolved by [solution]

   ### Comparison to Canonical Implementation

   **Similarities:**
   - [What I did the same way]

   **Differences:**
   - [What I did differently and why]

   **What I Would Do Differently:**
   - [Improvements or alternative approaches]

   ### Questions for Tech Lead Review
   1. [Question 1]
   2. [Question 2]

   ### Confidence Score: X/5

   I feel [confident/somewhat confident/need more practice] using:
   - Claude Code for development: X/5
   - Docker Compose: X/5
   - LocalStack: X/5
   - PostgreSQL: X/5
   - Node.js + AWS SDK: X/5

   ### Ready for Production Work: [Yes/No/With Mentorship]
   ```

3. **Request Review (Learning Validation)**
   ```bash
   git add .
   git commit -m "DP01-65: LocalStack onboarding exercise complete (Developer #X)

   Completed all 8 tasks for learning purposes.
   See ONBOARDING_REFLECTION.md for detailed learning summary.

   Branch will be closed without merge (learning exercise only).

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"

   git push origin <your-name>/localstack-setup
   ```

4. **Schedule 30-Minute Review with Tech Lead**
   - Walk through your implementation
   - Discuss comparison to canonical version
   - Answer questions from your reflection
   - Get feedback on readiness for production work

5. **After Tech Lead Review**
   - Close branch (do not merge): `git branch -D <your-name>/localstack-setup`
   - Delete remote branch: `git push origin --delete <your-name>/localstack-setup`
   - Mark your onboarding complete in HR system
   - You can now work on production features using the canonical LocalStack environment from `main`

---

### Tech Lead Responsibilities

**For First Developer:**
- Thorough code review of all 8 deliverables
- Validate against acceptance criteria
- Test setup on clean machine
- Approve and merge to `main`
- Mark Epic DP01-65 as DONE in Jira

**For Subsequent Developers:**
- 30-minute review session (not full code review)
- Validate learning objectives achieved
- Compare implementation to canonical version
- Provide feedback on approach and understanding
- Assess readiness for production work
- Mark developer's onboarding complete

---

## Reset Preparation for Next Developer

**Tech Lead Action:** After each developer completes the exercise, prepare for the next:

1. **Verify Canonical Version in Main**
   ```bash
   git checkout main
   git pull
   # Verify all files exist:
   ls docker-compose.yml scripts/localstack-init.sh scripts/init-db.sql
   ls examples/nodejs-api/
   ls DEVELOPER_QUICKSTART.md
   ```

2. **Update Onboarding Documentation** (if needed)
   - Incorporate learnings from completed developer
   - Fix any unclear instructions
   - Add troubleshooting items discovered

3. **Notify Next Developer**
   - Send welcome email with onboarding guide link
   - Schedule optional kickoff call (15 min)
   - Set expectation: 3-5 hours self-paced exercise

4. **Monitor Progress**
   - Check Jira board for task progression
   - Offer help if developer blocked >2 hours
   - Schedule review session when complete

---

## Next Steps After Onboarding

**Immediate (Week 1):**
1. Join daily standup in Slack #connect-standup
2. Get assigned to first feature ticket (from Phase 2-4 backlog)
3. Set up IDE (VS Code) with recommended extensions
4. Complete security training (secrets management, OWASP Top 10)

**Short-Term (Month 1):**
1. Implement first feature using Hephaestus workflow
2. Participate in code review (both giving and receiving feedback)
3. Contribute to documentation (improve guides based on your experience)
4. Attend architecture review meeting (understand system design)

**Long-Term (Quarter 1):**
1. Become proficient in 2-3 epics (E2, E3, E5, etc.)
2. Mentor next new developer through onboarding
3. Propose improvements to development workflow
4. Lead feature implementation (with Claude Code assistance)

---

## Appendix: Hephaestus Terminology

**Key Terms:**

- **Epic:** Large body of work (e.g., DP01-65: LocalStack Setup)
- **Task:** Discrete unit of work within an epic (e.g., DP01-66: Docker Compose)
- **Ticket:** Same as task (interchangeable)
- **Validation Gate:** Checkpoint to verify task is complete (automated + manual)
- **Autonomy Level:** How much AI agent can decide independently (LOW, MEDIUM, HIGH)
- **Acceptance Criteria:** Specific conditions that define "done"
- **Self-Validation:** Developer runs checklist before marking task complete
- **Decision Gate:** Phase-level checkpoint (e.g., Day 30, Day 90)

**Workflow States:**
- **BACKLOG:** Task created, dependencies not met
- **READY:** All dependencies complete, ready to work
- **IN_PROGRESS:** Developer actively working
- **VALIDATION:** Implementation complete, running checks
- **DONE:** All validation passed, task complete

---

**Document Status:** Ready for Use
**Last Updated:** December 14, 2025
**Maintained By:** Tech Lead + DevOps Team
**Feedback:** Submit improvements via PR or Slack #connect-dev
