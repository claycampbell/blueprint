# Hephaestus-Inspired Execution Framework for Blueprint Connect 2.0

**Framework Type:** Semi-Structured Agentic Development
**Inspired By:** [Hephaestus Framework](https://github.com/Ido-Levi/Hephaestus)
**Created:** November 6, 2025
**Status:** Ready for Execution

---

## Framework Overview

This document adapts the Hephaestus semi-structured agentic framework for Blueprint's Connect 2.0 development. Unlike traditional sprint planning, this approach uses AI agents to autonomously execute phases with validation checkpoints.

### Key Principles from Hephaestus

1. **Semi-Structured Phases:** Clear phase definitions with flexible execution paths
2. **Agent Autonomy:** AI agents make tactical decisions within strategic constraints
3. **Validation Gates:** Each phase has concrete success criteria before proceeding
4. **Adaptive Planning:** Agents can adjust implementation details based on discoveries
5. **Knowledge Accumulation:** Each phase builds context for subsequent phases

### Blueprint Adaptation

We adapt Hephaestus patterns to our 180-day MVP delivery:

```
Traditional Sprints (What We Created):
├── Fixed 2-week iterations
├── Pre-planned story points
├── Human task assignment
└── Velocity-based planning

Hephaestus Approach (This Framework):
├── Outcome-driven phases
├── Agent-executed tasks
├── Validation-gated progression
└── Adaptive implementation
```

**Both approaches complement each other:**
- Use traditional sprints for **team coordination and reporting**
- Use Hephaestus framework for **AI-assisted implementation**

---

## Phase Architecture

### Phase 1: Foundation & Technical Decisions
**Duration:** Days 1-14
**Owner:** DevOps + Tech Lead + AI Agent
**Status:** READY TO START

#### Objectives
1. Finalize tech stack decisions (AWS, Node.js, Fastify, React, Prisma)
2. Provision infrastructure (GitHub, AWS accounts, CI/CD)
3. Create monorepo structure with working development environment
4. Establish development standards and workflows

#### Agent Instructions

```python
# Phase 1 Agent Configuration
phase_1_config = {
    "agent_type": "foundation_builder",
    "autonomy_level": "medium",
    "decision_authority": {
        "can_decide": [
            "npm package versions",
            "linting rules",
            "directory structure details",
            "local development tooling"
        ],
        "must_consult": [
            "cloud provider choice",
            "database engine selection",
            "framework choices",
            "authentication strategy"
        ],
        "cannot_decide": [
            "budget allocation",
            "team structure",
            "third-party contracts"
        ]
    },
    "validation_criteria": {
        "required": [
            "Repository created with monorepo structure",
            "CI/CD pipelines passing on main branch",
            "Local dev environment working (docker-compose up)",
            "All developers can run 'npm run dev' successfully",
            "TECH_STACK_DECISIONS.md approved by PLT"
        ],
        "optional": [
            "Storybook for component development",
            "Pre-commit hooks configured",
            "VS Code workspace settings"
        ]
    },
    "success_metrics": {
        "time_to_first_commit": "< 2 days",
        "developer_onboarding_time": "< 10 minutes",
        "ci_pipeline_success_rate": "> 95%"
    }
}
```

#### Execution Steps

**Step 1.1: Tech Stack Finalization (Day 1-2)**
- Agent: Read `TECH_STACK_DECISIONS.md`
- Agent: Present executive summary to PLT
- Human: PLT votes and approves
- Agent: Lock decisions in decision log with signatures
- **Validation:** Signed decision document exists

**Step 1.2: Infrastructure Provisioning (Day 2-5)**
- Agent: Execute `REPOSITORY_SETUP_GUIDE.md` bash script
- Agent: Create AWS account structure (dev, staging, prod)
- Agent: Provision RDS PostgreSQL instance
- Agent: Configure GitHub Actions workflows
- Agent: Set up Slack webhooks for CI notifications
- **Validation:** All infrastructure smoke tests pass

**Step 1.3: Monorepo Initialization (Day 3-7)**
- Agent: Initialize backend project (Fastify + TypeScript)
- Agent: Initialize frontend project (React + Vite)
- Agent: Configure Prisma with initial schema
- Agent: Set up Docker Compose for local development
- Agent: Create sample "Hello World" endpoint + page
- **Validation:** `npm run dev` works on 3 developer machines

**Step 1.4: Development Standards (Day 5-10)**
- Agent: Configure ESLint + Prettier + Husky
- Agent: Set up TypeScript strict mode
- Agent: Create PR template with CODE_REVIEW_GUIDELINES.md checklist
- Agent: Document QUICK_START.md for new developers
- **Validation:** First PR merged following all standards

**Step 1.5: Team Onboarding (Day 10-14)**
- Agent: Schedule kickoff meeting using PROJECT_KICKOFF.md agenda
- Human: Team introductions and role assignment
- Agent: Grant GitHub/AWS permissions based on RACI matrix
- Agent: Walk team through QUICK_START.md
- **Validation:** All 6-8 developers can run app locally

#### Phase 1 Completion Criteria

```yaml
validation_gates:
  - name: "Infrastructure Ready"
    criteria:
      - GitHub repo accessible to all team members
      - AWS dev environment provisioned
      - CI/CD pipeline green on main branch

  - name: "Development Environment Working"
    criteria:
      - Backend runs on http://localhost:3000
      - Frontend runs on http://localhost:5173
      - Database migrations execute successfully
      - Redis cache accessible

  - name: "Standards Established"
    criteria:
      - CODE_REVIEW_GUIDELINES.md approved by team
      - First PR merged following all conventions
      - Linting passes on all code

  - name: "Team Onboarded"
    criteria:
      - 100% of developers completed QUICK_START.md
      - All developers made ≥1 commit to main
      - Slack channels active with first standup completed

decision_gate: "Day 14 - Proceed to Phase 2?"
success_threshold: "4/4 validation gates passed"
escalation: "If <3 gates passed, extend Phase 1 by 1 week"
```

---

### Phase 2: Core Data Model & Authentication
**Duration:** Days 15-30
**Owner:** Backend Lead + AI Agent
**Dependencies:** Phase 1 complete

#### Objectives
1. Implement Epic E2: Core Data Model (17 points)
2. Implement Epic E3: Authentication & Authorization (28 points)
3. Create database migration framework
4. Establish RBAC foundation for all modules

#### Agent Instructions

```python
# Phase 2 Agent Configuration
phase_2_config = {
    "agent_type": "backend_foundation_specialist",
    "autonomy_level": "high",
    "context_files": [
        "docs/technical/DATABASE_SCHEMA.md",
        "docs/technical/API_SPECIFICATION.md",
        "docs/technical/SECURITY_COMPLIANCE.md",
        "docs/planning/backlogs/EPIC_E2_CORE_DATA_MODEL.md",  # To be created
        "docs/planning/backlogs/EPIC_E3_AUTH_AUTHORIZATION.md"  # To be created
    ],
    "decision_authority": {
        "can_decide": [
            "Database index strategy",
            "Migration file structure",
            "JWT token expiry times (within security policy)",
            "Password hashing rounds (bcrypt cost factor)",
            "API error response formats"
        ],
        "must_consult": [
            "Multi-tenancy data isolation approach",
            "Encryption at rest strategy",
            "RBAC role definitions beyond basic roles"
        ]
    },
    "validation_criteria": {
        "required": [
            "All 14 core tables created with indexes",
            "Prisma schema generates types without errors",
            "User registration + login working",
            "JWT authentication middleware working",
            "RBAC enforced on all protected routes",
            "Database migration rollback tested",
            "Security audit passing (no secrets in code)"
        ]
    },
    "success_metrics": {
        "migration_execution_time": "< 30 seconds",
        "auth_endpoint_response_time": "< 200ms (p95)",
        "test_coverage": "> 80% for auth module"
    }
}
```

#### Execution Steps

**Step 2.1: Database Schema Implementation (Day 15-20)**

Agent Task List:
- Read `DATABASE_SCHEMA.md` lines 1-944 to understand all tables
- Generate Prisma schema from specification:
  - `projects` table (lines 91-145)
  - `feasibility` table (lines 178-213)
  - `tasks` table (lines 218-260)
  - `entitlement` table (lines 267-295)
  - `loans` table (lines 302-354)
  - `loan_draws` table (lines 361-396)
  - `inspections` table (lines 403-441)
  - `contacts` table (lines 481-522)
  - `entities` table (lines 529-548)
  - `documents` table (lines 555-597)
  - `users` table (lines 604-639)
  - `plan_library` table (lines 686-722)
  - `cycle_time_metrics` materialized view (lines 729-765)
  - `pipeline_metrics` materialized view (lines 767-815)
- Create indexes for all foreign keys and commonly queried fields
- Write initial migration: `001_create_core_schema.sql`
- Execute migration against local dev database
- Generate TypeScript types: `npx prisma generate`
- Validate: Run `npm run db:validate` to check schema integrity

**Validation Checkpoint:**
```bash
# Agent runs these commands to validate
npm run db:migrate:status  # All migrations applied
npm run db:seed:sample     # Sample data inserted successfully
npm run test:db:schema     # Schema validation tests pass
```

**Step 2.2: Authentication System (Day 18-25)**

Agent Task List:
- Implement user registration endpoint:
  - `POST /api/v1/auth/register`
  - Validate email format, password strength (min 12 chars, complexity)
  - Hash password with bcrypt (cost factor 12)
  - Create user record in database
  - Return sanitized user object (no password)
- Implement login endpoint:
  - `POST /api/v1/auth/login`
  - Verify email + password
  - Generate JWT access token (3600s expiry)
  - Generate refresh token (7 days expiry, store in database)
  - Return both tokens
- Create authentication middleware:
  - Extract JWT from Authorization header
  - Verify signature and expiration
  - Attach user object to request context
  - Return 401 if invalid/missing token
- Implement token refresh:
  - `POST /api/v1/auth/refresh`
  - Verify refresh token from database
  - Generate new access token
  - Rotate refresh token (invalidate old, issue new)
- Write comprehensive tests:
  - Unit tests for password hashing/verification
  - Integration tests for auth endpoints
  - E2E test: Register → Login → Access protected route

**Validation Checkpoint:**
```bash
# Agent validates auth system
npm run test:auth          # All auth tests pass (>80% coverage)
npm run test:security      # Security tests pass (SQL injection, XSS)
curl -X POST localhost:3000/api/v1/auth/register -d '...'  # Works
curl -X POST localhost:3000/api/v1/auth/login -d '...'     # Returns JWT
```

**Step 2.3: RBAC Implementation (Day 22-28)**

Agent Task List:
- Define roles in database:
  - ADMIN (full access)
  - ACQUISITIONS (projects, feasibility, entitlement)
  - LENDING (loans, draws, inspections)
  - SERVICING (draws, inspections, reconveyance)
  - AGENT (read-only projects, submit leads)
  - BUILDER (read-only loans, upload inspection docs)
  - CONSULTANT (read-only tasks assigned to them)
- Create permissions matrix:
  - Map routes to required roles (e.g., `POST /projects` → ACQUISITIONS or ADMIN)
- Implement RBAC middleware:
  - Check user role from JWT payload
  - Verify role has permission for route
  - Return 403 Forbidden if unauthorized
- Apply RBAC to all protected routes
- Write RBAC tests:
  - Test each role can access authorized routes
  - Test each role blocked from unauthorized routes
  - Test permission inheritance (ADMIN can do everything)

**Validation Checkpoint:**
```bash
# Agent validates RBAC
npm run test:rbac                # All RBAC tests pass
npm run audit:security           # No unauthorized access paths
npm run test:e2e:permissions     # E2E permission scenarios pass
```

**Step 2.4: Integration & Documentation (Day 28-30)**

Agent Task List:
- Create API documentation:
  - Auto-generate OpenAPI spec from code (Swagger)
  - Add authentication section to API_SPECIFICATION.md
  - Document all error codes and responses
- Write developer guide:
  - How to add new migrations
  - How to add RBAC to new routes
  - How to test authentication locally
- Security review:
  - Run automated security scanner (npm audit, Snyk)
  - Verify no secrets in environment files
  - Test password reset flow (if implemented)
- Performance testing:
  - Load test auth endpoints (100 req/s target)
  - Verify database query performance (< 50ms p95)

#### Phase 2 Completion Criteria

```yaml
validation_gates:
  - name: "Database Schema Complete"
    criteria:
      - All 14 tables created and indexed
      - Migrations reversible (rollback tested)
      - TypeScript types generated error-free
      - Sample data seeded successfully

  - name: "Authentication Working"
    criteria:
      - User registration works
      - Login returns valid JWT
      - Token refresh works
      - Password reset works (if in scope)
      - Test coverage > 80%

  - name: "Authorization Enforced"
    criteria:
      - All roles defined in database
      - RBAC middleware applied to all protected routes
      - Permission tests passing for all roles
      - 403 Forbidden returned for unauthorized access

  - name: "Security Validated"
    criteria:
      - No critical vulnerabilities in dependencies (npm audit)
      - No secrets committed to Git
      - SQL injection prevention tested
      - XSS prevention tested
      - OWASP Top 10 checklist completed

decision_gate: "Day 30 - Core foundation ready for feature development?"
success_threshold: "4/4 validation gates passed"
escalation: "If security gate fails, halt until resolved (BLOCKING)"
```

---

### Phase 3: Contact Management & Task System
**Duration:** Days 31-60
**Owner:** Full-Stack Team + AI Agents
**Dependencies:** Phase 2 complete

#### Objectives
1. Implement Epic E11: Contact Management (67 MVP points)
2. Implement Epic E8: Task Management (44 MVP points)
3. Enable consultant coordination workflows
4. Unblock Epic E5 (Feasibility) dependencies

#### Why These Epics Together?

From dependency analysis:
- **E11 (Contacts) BLOCKS E4, E5, E9** - Must complete early
- **E8 (Tasks) BLOCKS E5** - Consultant task assignments required
- **Together:** Enable feasibility module consultant workflows

#### Agent Instructions

```python
# Phase 3 Agent Configuration
phase_3_config = {
    "agent_type": "feature_implementation_team",
    "parallel_agents": 2,  # One for E11, one for E8
    "autonomy_level": "high",
    "context_files": [
        "docs/planning/backlogs/EPIC_E11_CONTACT_MANAGEMENT.md",
        "docs/planning/backlogs/EPIC_E8_TASK_MANAGEMENT.md",
        "docs/technical/DATABASE_SCHEMA.md",
        "docs/technical/API_SPECIFICATION.md"
    ],
    "coordination": {
        "shared_resources": ["database migrations", "frontend component library"],
        "sync_points": ["Day 40 integration test", "Day 55 UAT prep"]
    },
    "validation_criteria": {
        "E11_contacts": [
            "Create/read/update/delete contacts working",
            "Contact search with full-text working",
            "Entity management working",
            "Duplicate email prevention working",
            "Integration tests passing"
        ],
        "E8_tasks": [
            "Create task and assign to user/contact",
            "Task list with filters working",
            "Task status updates working",
            "Email notifications to assignees working",
            "Consultant can receive task email and upload doc"
        ]
    }
}
```

#### Execution Steps

**Step 3.1: Parallel Agent Execution (Day 31-50)**

**Agent A: E11 Contact Management**
- Implement Feature 1: Contact CRUD (32 points)
  - Create `contacts` table (E11-T1)
  - Build POST/GET/PATCH/DELETE `/contacts` APIs (E11-T2 to E11-T5)
  - Create Contact Create/Edit forms (E11-T8, E11-T9)
  - Add email validation and duplicate prevention (E11-T6, E11-T7)
  - Write tests (E11-T11, E11-T12)
- Implement Feature 2: Contact List & Search (16 MVP points)
  - Build GET `/contacts` with filters (E11-T13)
  - Add full-text search (E11-T14, E11-T15)
  - Create Contact List UI with search (E11-T16, E11-T17)
- Implement Feature 4: Entity Management (19 MVP points)
  - Create `entities` table (E11-T32)
  - Build entity CRUD APIs (E11-T33 to E11-T36)
  - Add tax ID validation (E11-T37, E11-T38)
  - Create Entity forms (E11-T39)

**Agent B: E8 Task Management**
- Implement Feature 1: Task Creation (15 P0 points)
  - Build POST `/tasks` API (E8-T1)
  - Add assignee type support (user/contact) (E8-T3)
  - Create Task Creation Form UI (E8-T4)
  - Build user/contact picker (E8-T5)
  - Write tests (E8-T8)
- Implement Feature 2: Task List Views (13 P0 points)
  - Build GET `/tasks` with filters (E8-T10, E8-T11)
  - Add filtering logic (E8-T12)
  - Create Task List UI (E8-T14)
- Implement Feature 3: Task Status Management (11 P0 points)
  - Build PATCH `/tasks/{id}` (E8-T20)
  - Add status workflow validation (E8-T21)
  - Create Task Detail view (E8-T23)
  - Build status update component (E8-T24)

**Coordination Points:**
- **Day 35:** Agents sync on shared component library (modal, form fields, tables)
- **Day 40:** Integration test - Create contact → Assign task to contact → Verify
- **Day 45:** Mid-phase review - Demo to product owner

**Validation Checkpoints:**
```bash
# Agent A validates E11
npm run test:contacts              # All contact tests pass
curl -X POST localhost:3000/api/v1/contacts -d '...'  # Create contact
curl -X GET localhost:3000/api/v1/contacts?search=builder  # Search works

# Agent B validates E8
npm run test:tasks                 # All task tests pass
curl -X POST localhost:3000/api/v1/tasks -d '...'     # Create task
curl -X GET localhost:3000/api/v1/tasks?assignee_id=1 # Filter works
```

**Step 3.2: Integration & Email Notifications (Day 50-55)**

Agent Task List:
- Integrate SendGrid for email notifications (E8-T25 dependency)
- Create email templates:
  - Task assignment email to consultant
  - Task completion notification to creator
- Implement email service:
  - `sendTaskAssignmentEmail(task, assignee)`
  - Include task details and due date
  - Add "Upload Document" link for consultants
- Test E2E workflow:
  - Acquisitions user creates task
  - Assigns to consultant contact
  - Consultant receives email
  - Consultant uploads document (via link in email)

**Step 3.3: UAT Preparation (Day 55-60)**

Agent Task List:
- Create UAT test scripts:
  - Contact management scenarios (create builder, create agent)
  - Task management scenarios (assign arborist report task)
- Seed UAT database with realistic sample data:
  - 20 contacts (10 builders, 5 agents, 5 consultants)
  - 15 tasks (various statuses and assignees)
- Deploy to staging environment
- Conduct UAT session with 2 acquisitions team members
- Collect feedback and create bug backlog
- Fix P0 bugs before Phase 3 sign-off

#### Phase 3 Completion Criteria

```yaml
validation_gates:
  - name: "E11 Contact Management Complete"
    criteria:
      - Contact CRUD fully functional
      - Search returns accurate results (full-text working)
      - Entity management working
      - Zero duplicate contacts created in UAT
      - Performance: Search < 200ms p95

  - name: "E8 Task Management Complete"
    criteria:
      - Task creation and assignment working
      - Task list filters working (by assignee, status, project)
      - Task status updates working
      - Email notifications delivered (tested in UAT)
      - Consultant can upload doc via email link

  - name: "Integration Validated"
    criteria:
      - Create contact → Assign task integration works
      - Email service integrated (SendGrid or AWS SES)
      - No API errors in staging logs (past 7 days)
      - Frontend/backend integration tests passing

  - name: "UAT Passed"
    criteria:
      - 2 acquisitions users completed UAT scenarios
      - P0 bugs: 0 remaining
      - P1 bugs: documented in backlog for Phase 4
      - User feedback: ≥ 4/5 satisfaction score

decision_gate: "Day 60 - Ready to build Feasibility module?"
success_threshold: "4/4 validation gates passed"
next_phase: "Phase 4: Feasibility Module (E5)"
```

---

### Phase 4: Feasibility & Project Management
**Duration:** Days 61-90
**Owner:** Full-Stack Team + AI Agents
**Dependencies:** Phase 3 complete

#### Objectives
1. Implement Epic E5: Feasibility Module (121 P0 points → ~50 MVP points)
2. Implement Epic E4: Lead & Project Management (88 MVP points → ~45 MVP points)
3. Replace SharePoint Site 1 (Feasibility tracking)
4. Achieve -50% feasibility cycle time reduction

#### Phasing Strategy

**Phase 4A: Core Feasibility (Days 61-75):**
- E5 Feature 1: Proforma Management (37 pts)
- E5 Feature 2: Consultant Report Ordering (42 pts)

**Phase 4B: Projects & Decision Workflow (Days 76-90):**
- E4 MVP: Lead Intake + Project List + Project Detail (~45 pts)
- E5 Feature 4: Viability Scoring & Decision (42 pts)

**Deferred to Phase 5 (Days 91-120):**
- E5 Feature 3: Report Tracking (28 pts) - Use E8 task list initially
- E5 Feature 5: Packet Assembly (43 pts) - Manual PDF assembly acceptable
- E5 Feature 6: Dashboard (31 pts) - Use project list view initially

#### Agent Instructions

```python
# Phase 4 Agent Configuration
phase_4_config = {
    "agent_type": "domain_feature_specialist",
    "parallel_agents": 2,  # One for E5, one for E4
    "autonomy_level": "high",
    "domain_expert_required": True,  # Consult acquisitions team on business logic
    "context_files": [
        "docs/planning/backlogs/EPIC_E5_FEASIBILITY_MODULE.md",
        "docs/planning/backlogs/EPIC_E4_LEAD_PROJECT_MANAGEMENT.md",
        "docs/technical/API_SPECIFICATION.md",
        "docs/technical/INTEGRATION_SPECIFICATIONS.md"
    ],
    "validation_criteria": {
        "E5_feasibility": [
            "Proforma auto-calculates ROI correctly",
            "Consultant reports can be ordered (tasks created)",
            "Email sent to consultants with task details",
            "GO/PASS decision workflow works",
            "GO decision creates entitlement record (E6 stub)",
            "Cycle time tracking implemented"
        ],
        "E4_projects": [
            "Agents can submit leads via form",
            "Leads appear in acquisitions queue",
            "Project detail page shows all related data",
            "Project status transitions work (LEAD → FEAS → GO)",
            "Assignment to acquisitions specialist works"
        ]
    },
    "success_metrics": {
        "feasibility_cycle_time": "< 15 days (baseline: 30 days)",
        "proforma_creation_time": "< 2 minutes (baseline: 15 min)",
        "consultant_coordination_time": "< 5 minutes (baseline: 30 min)"
    }
}
```

#### Execution Steps

**Step 4.1: Proforma Management (Days 61-70)**

Agent Task List (E5 Feature 1):
- Create `feasibility` table with proforma fields (E5-T1)
- Implement POST `/projects/{id}/feasibility` API (E5-T2)
- Build proforma calculation engine (E5-T5):
  - `total_cost = land_cost + construction_cost + soft_costs + contingency`
  - `profit = arv - total_cost`
  - `roi = (profit / total_cost) * 100`
  - Auto-update on any field change
- Create Feasibility Detail page (E5-T6):
  - Display project info at top
  - Proforma edit form with real-time calculations (E5-T7)
  - Show ROI gauge (E5-T42, if time permits)
  - Save button to persist changes
- Write comprehensive tests (E5-T10, E5-T11):
  - Unit tests for ROI calculation edge cases
  - Integration tests for feasibility endpoints
  - E2E test: Create project → Create feasibility → Edit proforma

**Validation Checkpoint:**
```bash
# Agent validates proforma
npm run test:feasibility:proforma   # All proforma tests pass
# Manual test: Create feasibility, edit land cost, verify ROI recalculates
```

**Step 4.2: Consultant Report Ordering (Days 68-78)**

Agent Task List (E5 Feature 2):
- Implement POST `/projects/{id}/feasibility/order-reports` (E5-T13):
  - Accept array of report types: ["SURVEY", "TITLE", "ARBORIST"]
  - Accept consultant assignments: `{report_type: "SURVEY", consultant_id: 42}`
  - Accept due dates for each report
- For each report ordered, create task record (E5-T14):
  - Task type = report_type
  - Assignee = consultant contact
  - Due date = specified date
  - Link to project and feasibility
- Send email notification to consultant (E5-T17):
  - Use SendGrid template
  - Include project address, due date, task details
  - Include upload link for completed report
- Build Report Ordering UI (E5-T15):
  - Checkboxes for report types
  - Consultant picker for each selected report (E5-T16)
  - Date picker for due dates
  - "Order Reports" button
- Create Report Tracking Dashboard (E5-T18):
  - List all ordered reports with status
  - Use task status from E8 (PENDING/IN_PROGRESS/COMPLETED)
  - Show days until due / days overdue
  - Link to task detail

**Validation Checkpoint:**
```bash
# Agent validates report ordering
npm run test:feasibility:reports    # All report ordering tests pass
# E2E test:
# 1. Create feasibility
# 2. Order survey + title reports
# 3. Verify 2 tasks created
# 4. Verify 2 emails sent (check SendGrid logs)
# 5. Consultant clicks link, uploads document
```

**Step 4.3: Lead Intake & Project Management (Days 70-82)**

Agent Task List (E4 MVP):
- Implement POST `/projects` API for lead submission (E4-T1):
  - Accept: address, price, lot size, notes, submitter (agent contact)
  - Auto-set status = "LEAD"
  - Auto-assign to acquisitions queue (or specific specialist)
  - Send acknowledgment email to agent
- Build Lead Submission Form (E4-T8):
  - Public form (or agent-authenticated)
  - Address autocomplete (Google Places API)
  - Price and lot size validation
  - Submit button → shows confirmation message
- Implement GET `/projects` with filters (E4-T13):
  - Filter by status (LEAD, FEAS, GO, PASS)
  - Filter by assigned_to (acquisitions specialist)
  - Filter by market (Seattle, Phoenix)
  - Pagination support
- Build Project List view (E4-T16):
  - Table or card grid showing projects
  - Columns: Address, Status, Assigned To, Created Date
  - Click row to open Project Detail page
- Build Project Detail page (E4-T21):
  - Project info section (address, price, status)
  - Related feasibility (if exists)
  - Related tasks (from E8)
  - Related documents (E7, if implemented)
  - Status transition buttons (E4-T27 to E4-T30)

**Step 4.4: Decision Workflow (Days 80-88)**

Agent Task List (E5 Feature 4):
- Implement viability score calculation (E5-T35):
  - Simple algorithm: `viability_score = min(100, roi * 2)` (if ROI ≥ 50%, score = 100)
  - Store in `feasibility.viability_score` field
- Build Decision UI on Feasibility page (E5-T38):
  - Display viability score as gauge or progress bar
  - Show summary: ROI, total cost, profit
  - Show consultant report statuses
  - "GO" button (green) and "PASS" button (red)
  - Decision notes textarea (required)
- Implement POST `/feasibility/{id}/decision` API (E5-T37):
  - Accept: `decision` ("GO" or "PASS"), `notes` (required)
  - Validate: All required reports completed (if business rule)
  - Update `feasibility.go_decision_date` and `feasibility.decision_maker`
  - Update project status:
    - GO → project.status = "GO"
    - PASS → project.status = "PASS"
- Trigger entitlement record creation on GO (E5-T40):
  - Create stub entitlement record (E6-T1 from Phase 5)
  - Link to project
  - Set initial status = "PENDING"
- Send notification email when GO decision made (E5-T44):
  - Notify design team that project is ready for entitlement
  - Include project details and feasibility summary

**Step 4.5: UAT & Pilot Launch (Days 85-90)**

Agent Task List:
- Deploy to staging environment
- Seed with 10 real projects from acquisitions team backlog
- Conduct UAT:
  - Scenario 1: Agent submits lead → Acquisitions reviews → Orders reports
  - Scenario 2: Consultant receives email → Uploads report
  - Scenario 3: Acquisitions edits proforma → Makes GO decision → Entitlement created
- Collect feedback and create bug/enhancement backlog
- Fix P0 bugs
- Prepare for limited pilot (5 projects) in production

#### Phase 4 Completion Criteria

```yaml
validation_gates:
  - name: "E5 Feasibility Core Complete"
    criteria:
      - Proforma auto-calculations working correctly
      - Consultant report ordering creates tasks and sends emails
      - Report tracking dashboard shows accurate status
      - GO/PASS decision workflow works
      - GO decision creates entitlement record (stub OK)
      - Cycle time tracking implemented
      - Test coverage > 75%

  - name: "E4 Project Management MVP Complete"
    criteria:
      - Lead submission form working (agent can submit)
      - Project list shows all projects with filters
      - Project detail page displays all related data
      - Status transitions working (LEAD → FEAS → GO)
      - Email notifications working (agent acknowledgment)
      - Test coverage > 70%

  - name: "Integration & Performance"
    criteria:
      - E4 ↔ E5 integration working (project → feasibility)
      - E5 ↔ E8 integration working (order reports → tasks)
      - E5 ↔ E11 integration working (consultant assignments)
      - API response times: < 300ms p95
      - No errors in staging logs (past 7 days)

  - name: "UAT & Pilot Readiness"
    criteria:
      - 3 acquisitions users completed UAT scenarios
      - P0 bugs: 0 remaining
      - 5 real projects ready for pilot
      - User training completed
      - Support process defined
      - Rollback plan documented

decision_gate: "Day 90 - Launch pilot and proceed to Phase 5?"
success_threshold: "4/4 validation gates passed"
success_metric_target: "Feasibility cycle time < 15 days for pilot projects"
escalation: "If cycle time not achieved, investigate bottlenecks before Phase 5"
next_phase: "Phase 5: Entitlement + Document Management (Days 91-120)"
```

---

## Phase 5-8 Overview (Days 91-180)

**Phase 5: Entitlement & Document Management (Days 91-120)**
- Epic E6: Entitlement Module (69 points)
- Epic E7: Document Management (88 points)
- Replace SharePoint Site 2

**Phase 6: Lending Origination (Days 121-150)**
- Epic E9: Lending Module (85 points)
- Loan application processing
- Credit analysis integration
- Replace Connect 1.0 origination

**Phase 7: Servicing & Inspections (Days 151-170)**
- Epic E10: Loan Servicing (89 points)
- Draw request workflow
- iPad inspection app integration
- Replace Connect 1.0 servicing

**Phase 8: Analytics & Polish (Days 171-180)**
- Epic E14: Analytics & Reporting (62 optimized points)
- Dashboard metrics
- Performance tracking
- Final UAT and production launch

---

## Adaptive Execution Patterns

### Pattern 1: Discovery-Driven Development

When implementing a feature with unknown complexity:

```python
# Agent discovers implementation path
agent_task = {
    "objective": "Implement document upload with virus scanning",
    "constraints": {
        "max_file_size": "50MB",
        "allowed_types": ["pdf", "docx", "xlsx", "jpg", "png"],
        "virus_scan": "required"
    },
    "discovery_mode": True,  # Agent investigates options
    "decision_criteria": {
        "virus_scanner": {
            "options": ["ClamAV", "AWS S3 malware scanning", "VirusTotal API"],
            "evaluate_on": ["cost", "latency", "accuracy"],
            "must_consult_if": "estimated_monthly_cost > $100"
        }
    },
    "validation": {
        "upload_10MB_file": "< 5 seconds",
        "virus_detected": "upload rejected with clear error",
        "clean_file": "upload succeeds and stored in S3"
    }
}

# Agent reports back findings before implementation
agent_report = {
    "recommended_approach": "AWS S3 with AWS Macie for malware detection",
    "rationale": "Native integration, $0.10 per GB scanned, 2-second latency",
    "alternatives_considered": ["ClamAV (self-hosted complexity)", "VirusTotal ($0.01/file but 3rd party)"],
    "approval_required": False,  # Under $100/mo threshold
    "estimated_implementation": "5 points (3 days with testing)"
}
```

### Pattern 2: Test-Driven Agent Development

Agent generates tests before implementation:

```python
# Agent writes E2E test first
agent_writes_test = """
describe('Feasibility Decision Workflow', () => {
  it('should create entitlement record on GO decision', async () => {
    // Setup: Create project and feasibility
    const project = await createProject({ address: '123 Test St' });
    const feasibility = await createFeasibility(project.id, {
      land_cost: 100000,
      construction_cost: 200000,
      arv: 450000
    });

    // Act: Make GO decision
    const response = await api.post(`/feasibility/${feasibility.id}/decision`, {
      decision: 'GO',
      notes: 'Strong ROI and favorable market conditions'
    });

    // Assert: Entitlement record created
    expect(response.status).toBe(200);
    const entitlement = await getEntitlement(project.id);
    expect(entitlement).toBeDefined();
    expect(entitlement.project_id).toBe(project.id);
    expect(entitlement.status).toBe('PENDING');

    // Assert: Project status updated
    const updatedProject = await getProject(project.id);
    expect(updatedProject.status).toBe('GO');
  });
});
"""

# Agent implements feature to make test pass
# Agent runs test → Test passes → Feature validated
```

### Pattern 3: Parallel Feature Development with Sync Points

```python
# Multi-agent coordination
parallel_execution = {
    "agents": [
        {
            "id": "agent_frontend",
            "epic": "E5",
            "tasks": ["E5-T6", "E5-T7", "E5-T15", "E5-T18"],  # UI tasks
            "sync_dependencies": ["API contracts from agent_backend"]
        },
        {
            "id": "agent_backend",
            "epic": "E5",
            "tasks": ["E5-T2", "E5-T5", "E5-T13", "E5-T17"],  # API tasks
            "sync_dependencies": []  # No dependencies, starts immediately
        }
    ],
    "sync_points": [
        {
            "day": 3,
            "action": "agent_backend publishes API contracts (OpenAPI spec)",
            "triggers": "agent_frontend starts implementation"
        },
        {
            "day": 7,
            "action": "Integration test - frontend calls backend APIs",
            "validation": "All API calls return 200 OK with correct data"
        },
        {
            "day": 10,
            "action": "E2E test - full workflow validation",
            "validation": "Proforma calculation works end-to-end"
        }
    ]
}
```

---

## Agent Validation & Quality Gates

### Code Quality Checks (Automated)

Every agent commit must pass:

```yaml
pre_commit_hooks:
  - eslint: "No errors, warnings allowed if justified"
  - prettier: "Auto-format all code"
  - typescript: "Strict mode, no 'any' types"
  - tests: "All tests pass, coverage > threshold"
  - security: "npm audit shows no critical vulnerabilities"

pull_request_checks:
  - ci_pipeline: "All tests pass in CI"
  - code_review: "Human approval required for business logic"
  - performance: "API response time < 300ms p95"
  - accessibility: "WCAG 2.1 Level AA compliance"
  - security_scan: "No secrets in code, OWASP Top 10 checked"
```

### Agent Self-Validation Protocol

Before marking a task complete, agent runs:

```python
self_validation = {
    "functional": {
        "unit_tests": "npm run test:unit -- --coverage",
        "integration_tests": "npm run test:integration",
        "e2e_tests": "npm run test:e2e -- --spec=<feature>.spec.ts"
    },
    "non_functional": {
        "performance": "npm run test:performance",
        "security": "npm run test:security",
        "accessibility": "npm run test:a11y"
    },
    "documentation": {
        "api_docs": "OpenAPI spec updated with new endpoints",
        "code_comments": "TSDoc comments for all public functions",
        "changelog": "CHANGELOG.md updated with user-facing changes"
    },
    "deployment": {
        "migrations": "Database migration tested (up and down)",
        "env_vars": "New env vars documented in .env.example",
        "rollback_plan": "Rollback procedure documented if breaking change"
    }
}

# If any check fails, agent does NOT mark task complete
# Agent either fixes issue or escalates to human
```

### Human Validation Touchpoints

Even with high agent autonomy, humans validate at these gates:

```yaml
required_human_approval:
  - "Tech stack decisions (cloud provider, frameworks)"
  - "Database schema changes affecting existing tables"
  - "RBAC role/permission changes"
  - "Integration with external systems (e.g., DocuSign)"
  - "Production deployments"
  - "Security vulnerability remediation approach"

recommended_human_review:
  - "Complex business logic (ROI calculations, scoring algorithms)"
  - "User-facing copy and error messages"
  - "UI/UX design decisions"
  - "API contract changes (versioning strategy)"

agent_autonomous:
  - "Code formatting and linting fixes"
  - "Test writing and execution"
  - "Documentation updates (non-architectural)"
  - "Bug fixes for known issues"
  - "Performance optimizations (within bounds)"
```

---

## Success Metrics & Tracking

### Phase-Level Metrics

Track these for each phase:

```yaml
metrics:
  velocity:
    - "Story points completed vs. planned"
    - "Tasks completed on time (%)"
    - "Velocity trend (increasing/stable/decreasing)"

  quality:
    - "Test coverage (% by phase target)"
    - "Bug escape rate (bugs found in next phase)"
    - "Code review cycle time (hours to approval)"

  performance:
    - "API response times (p50, p95, p99)"
    - "Database query performance"
    - "Frontend page load times"

  adoption:
    - "Active users (DAU/WAU)"
    - "Feature usage (%)"
    - "User satisfaction (NPS or CSAT)"

  business:
    - "Feasibility cycle time (days)"
    - "Consultant coordination time (minutes)"
    - "Data re-entry eliminated (% reduction)"
```

### Decision Gate Criteria

At each decision gate (Days 14, 30, 60, 90, 120, 150, 180):

```python
decision_gate_evaluation = {
    "technical_readiness": {
        "all_validation_gates_passed": True,  # 4/4 gates green
        "test_coverage_above_threshold": True,  # >75%
        "no_critical_bugs": True,  # P0 count = 0
        "performance_within_sla": True  # <300ms p95
    },
    "business_readiness": {
        "uat_completed": True,
        "user_training_done": True,
        "support_process_ready": True,
        "rollback_plan_documented": True
    },
    "decision_options": [
        {
            "option": "PROCEED",
            "condition": "All technical + business criteria met",
            "action": "Advance to next phase"
        },
        {
            "option": "PROCEED_WITH_CONDITIONS",
            "condition": "1-2 non-critical items pending",
            "action": "Advance but track conditions closely"
        },
        {
            "option": "EXTEND_PHASE",
            "condition": "Critical gaps remain",
            "action": "Add 1 week, re-evaluate"
        },
        {
            "option": "PIVOT",
            "condition": "Fundamental issue discovered",
            "action": "Re-plan phase scope"
        }
    ]
}

# PLT votes on decision at gate meeting
```

---

## Risk Management & Escalation

### Risk Register

| Risk | Phase | Probability | Impact | Mitigation |
|------|-------|------------|--------|------------|
| Tech stack decision delayed | 1 | Medium | High | Schedule PLT meeting Week 1, have fallback option ready |
| Agent generates insecure code | All | Low | Critical | Mandatory security scan + human review for auth/RBAC |
| Database migration fails in prod | 2 | Low | High | Test rollback procedure in staging, backup before migrate |
| Consultant email adoption low | 3 | Medium | Medium | Provide manual task assignment fallback |
| Feasibility cycle time target not met | 4 | Medium | High | Track cycle time weekly, adjust workflow if needed |
| SharePoint data migration complex | 5 | High | Medium | Start migration planning in Phase 4, allocate buffer time |
| iPad app integration breaks | 7 | Low | High | Build integration tests early, have manual workflow fallback |

### Escalation Protocol

```yaml
escalation_triggers:
  level_1_agent:
    - "Task blocked for >2 days"
    - "Test coverage below threshold after implementation"
    - "Performance SLA missed"
    action: "Agent escalates to Tech Lead"

  level_2_tech_lead:
    - "Multiple related tasks blocked"
    - "Security vulnerability discovered"
    - "Architecture decision needed"
    action: "Tech Lead escalates to Product Manager + PLT"

  level_3_plt:
    - "Phase decision gate not met"
    - "Budget overrun risk"
    - "Timeline slip >1 week"
    action: "PLT convenes emergency meeting, may adjust scope"

escalation_response_sla:
  - "Level 1: 4 hours"
  - "Level 2: 24 hours"
  - "Level 3: 48 hours"
```

---

## Comparison: Traditional Sprints vs. Hephaestus Framework

| Aspect | Traditional Sprints | Hephaestus Framework |
|--------|---------------------|----------------------|
| **Planning** | Fixed 2-week iterations, pre-planned tasks | Outcome-driven phases, adaptive tasks |
| **Execution** | Human developers execute tasks | AI agents execute tasks with human oversight |
| **Flexibility** | Low (scope locked at sprint start) | High (agents adjust within phase objectives) |
| **Reporting** | Burndown charts, velocity | Validation gate status, quality metrics |
| **Coordination** | Daily standups, sprint ceremonies | Sync points, agent collaboration protocols |
| **Quality** | Manual code review, testing | Automated validation + human gates |
| **Best For** | Team synchronization, predictability | Speed, exploration, complex implementation |

**Blueprint Approach: Use Both**

- **Sprints for team management:** 2-week sprints for standup, retrospectives, demos
- **Hephaestus for execution:** AI agents implement features within sprint scope
- **Integration:** Sprint goals = Phase validation gates

Example Sprint 3 (Days 31-44):
- **Sprint Goal (Traditional):** "Complete Contact Management CRUD"
- **Phase 3 Execution (Hephaestus):** Agent A implements E11 Feature 1 (32 points)
- **Sprint Demo:** Show working Contact Create/Edit forms to stakeholders
- **Phase Validation:** Confirm E11 validation gates passed

---

## Appendix: Agent Prompt Templates

### Template 1: Feature Implementation Agent

```markdown
You are a full-stack development agent tasked with implementing Epic E[X] Feature [Y].

## Context Files
- Read: docs/planning/backlogs/EPIC_E[X]_[NAME].md
- Read: docs/technical/DATABASE_SCHEMA.md (lines [X-Y])
- Read: docs/technical/API_SPECIFICATION.md (lines [X-Y])

## Your Task
Implement tasks [E[X]-T[A] through E[X]-T[B]] from the epic backlog.

## Autonomy Level: HIGH
You can make decisions on:
- npm package selection
- Component structure and naming
- Test organization
- Code formatting preferences

You MUST consult humans on:
- Database schema changes
- API contract changes
- RBAC permission changes
- Integration approaches with external systems

## Validation Criteria
Before marking tasks complete, ensure:
1. All unit tests pass with >80% coverage
2. Integration tests pass
3. E2E test for the feature passes
4. API response time < 300ms p95
5. TypeScript strict mode passes with no errors
6. Code reviewed (self-review checklist completed)

## Deliverables
1. Working backend API endpoints
2. Working frontend UI components
3. Comprehensive test suite
4. Updated API documentation (OpenAPI spec)
5. Database migration (if schema changes)

## Success Criteria
[Specific acceptance criteria from user story]

Begin by reading the epic backlog and creating an implementation plan. Report your plan before starting implementation.
```

### Template 2: Validation Agent

```markdown
You are a validation agent responsible for verifying that Phase [X] is complete and ready for the decision gate.

## Your Task
Evaluate Phase [X] completion against the defined validation gates.

## Validation Gates to Check
[Paste validation_gates YAML from phase definition]

## Your Process
1. Review code changes merged during Phase [X]
2. Run all test suites (unit, integration, E2E)
3. Check code coverage reports
4. Review API response time metrics
5. Verify UAT completion (if applicable)
6. Check for open P0 bugs
7. Review documentation completeness

## Deliverables
Produce a validation report with:
- Gate-by-gate status (PASS/FAIL/PARTIAL)
- Metrics summary (test coverage, performance, bugs)
- Recommendation: PROCEED / EXTEND / PIVOT
- If not PROCEED, list specific blockers to resolve

## Decision Criteria
- PROCEED: 4/4 gates passed, all criteria met
- EXTEND: 3/4 gates passed, minor issues to resolve
- PIVOT: <3 gates passed or critical issue discovered

Begin validation and report findings.
```

---

## Next Steps

1. **Review & Approve:** PLT reviews this Hephaestus-inspired framework
2. **Pilot Phase 1:** Execute Phase 1 (Days 1-14) using this framework
3. **Retrospective:** After Phase 1, evaluate effectiveness vs. traditional sprints
4. **Iterate:** Refine agent prompts and validation criteria based on learnings
5. **Scale:** If successful, continue with Phases 2-8

**Key Decision:** Do we run Hephaestus framework alongside traditional sprints, or fully replace sprint planning with this approach?

**Recommendation:** Hybrid approach for first 90 days, then reassess based on velocity and quality metrics.

---

**Status:** Draft - Awaiting PLT Review
**Next Action:** Schedule framework review meeting with Tech Lead + Product Manager
**Timeline:** Ready to execute Phase 1 pending approval
