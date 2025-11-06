# Backlog Creation Plan - Connect 2.0

**Version:** 1.0
**Created:** November 6, 2025
**Status:** Draft - Ready for Review
**Purpose:** Task breakdown plan for creating development backlog from technical specifications

---

## Executive Summary

This plan provides a structured approach to convert the comprehensive technical documentation (8 technical specs) into an actionable, prioritized development backlog aligned with the MVP phasing strategy (Days 1-90 and Days 91-180).

### Key Documents to Process

1. **[PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md)** - Business requirements, MVP phasing, feature backlog
2. **[API_SPECIFICATION.md](../technical/API_SPECIFICATION.md)** - REST API endpoints, authentication, error handling
3. **[DATABASE_SCHEMA.md](../technical/DATABASE_SCHEMA.md)** - Data model, tables, migrations
4. **[SYSTEM_ARCHITECTURE.md](../technical/SYSTEM_ARCHITECTURE.md)** - Tech stack, infrastructure, deployment
5. **[INTEGRATION_SPECIFICATIONS.md](../technical/INTEGRATION_SPECIFICATIONS.md)** - External system integrations
6. **[TESTING_STRATEGY.md](../technical/TESTING_STRATEGY.md)** - Quality assurance, test coverage
7. **[SECURITY_COMPLIANCE.md](../technical/SECURITY_COMPLIANCE.md)** - Security requirements, compliance
8. **[DEPLOYMENT_DEVOPS.md](../technical/DEPLOYMENT_DEVOPS.md)** - CI/CD, infrastructure as code

---

## Table of Contents

1. [Backlog Structure & Organization](#1-backlog-structure--organization)
2. [Phase 1 Tasks (Days 1-90)](#2-phase-1-tasks-days-1-90)
3. [Phase 2 Tasks (Days 91-180)](#3-phase-2-tasks-days-91-180)
4. [Foundation & Infrastructure Tasks](#4-foundation--infrastructure-tasks)
5. [Integration Tasks](#5-integration-tasks)
6. [Testing & Quality Assurance Tasks](#6-testing--quality-assurance-tasks)
7. [Documentation Tasks](#7-documentation-tasks)
8. [Task Estimation & Prioritization Framework](#8-task-estimation--prioritization-framework)

---

## 1. Backlog Structure & Organization

### 1.1 Backlog Hierarchy

```
EPICS (Strategic Initiatives)
  └─── FEATURES (User-facing capabilities)
        └─── USER STORIES (Specific user needs)
              └─── TASKS (Implementation work items)
                    └─── SUBTASKS (Technical details)
```

### 1.2 Epic Categories

Based on the PRD and technical documents, organize backlog into these epics:

| Epic ID | Epic Name | Description | MVP Phase |
|---------|-----------|-------------|-----------|
| **E1** | **Foundation & Setup** | Dev environment, tech stack decisions, infrastructure | Pre-Day 1 |
| **E2** | **Core Data Model** | Database schema, migrations, ORM setup | Days 1-30 |
| **E3** | **Authentication & Authorization** | User management, RBAC, JWT authentication | Days 1-30 |
| **E4** | **Lead & Project Management** | Lead intake, project tracking, status workflows | Days 1-90 |
| **E5** | **Feasibility Module** | Due diligence, consultant management, reports | Days 1-90 |
| **E6** | **Entitlement & Design** | Permit tracking, plan library, corrections workflow | Days 1-90 (MVP) |
| **E7** | **Document Management** | Upload, storage, AI extraction, search | Days 1-90 |
| **E8** | **Task Management** | Task creation, assignment, notifications | Days 1-90 |
| **E9** | **Lending Module** | Loan origination, approval, funding | Days 91-180 |
| **E10** | **Servicing Module** | Draw management, inspections, payments | Days 91-180 |
| **E11** | **Contact Management** | Agents, builders, consultants, borrowers | Days 1-90 |
| **E12** | **BPO Integration** | Temporary API integration with legacy BPO | Days 1-90 |
| **E13** | **External Integrations** | DocuSign, Azure AI, email, SMS | Days 1-90 |
| **E14** | **Analytics & Reporting** | Dashboards, metrics, exports | Days 91-180 |
| **E15** | **DevOps & Infrastructure** | CI/CD, monitoring, deployment | Ongoing |

### 1.3 Story Point Estimation Scale

Use Fibonacci sequence for relative sizing:

| Points | Complexity | Time Estimate (Single Dev) | Examples |
|--------|------------|----------------------------|----------|
| **1** | Trivial | 1-2 hours | Add a simple field to UI form |
| **2** | Simple | Half day | Create basic CRUD endpoint |
| **3** | Moderate | 1 day | Implement simple business logic |
| **5** | Complex | 2-3 days | Multi-table database migration |
| **8** | Very Complex | 4-5 days | Complex workflow with state machine |
| **13** | Epic-sized | 1-2 weeks | Full module (needs decomposition) |
| **21+** | Too Large | > 2 weeks | **Break down into smaller stories** |

### 1.4 Priority Framework

**P0 (Blocker):** Prevents MVP launch; must be completed
**P1 (Critical):** Core functionality; required for MVP
**P2 (Important):** Enhances experience; nice-to-have for MVP
**P3 (Nice-to-have):** Post-MVP enhancements

### 1.5 Backlog Management Tools

**Recommended:** GitHub Issues + Projects (already in use)

**Structure:**
- **Labels:** `epic:name`, `phase:1`, `priority:P0`, `team:backend`, `status:ready`
- **Milestones:** `Day 30 Decision Gate`, `Day 90 Phase 1 Complete`, `Day 180 MVP Launch`
- **Projects:** Kanban board with columns: Backlog, Ready, In Progress, Review, Done

---

## 2. Phase 1 Tasks (Days 1-90)

### Focus: Design & Entitlement Module (Pilot)

### 2.1 Epic E6: Entitlement & Design Module

#### Feature: Permit Tracking System

**User Story E6-US1:** As an Entitlement Coordinator, I need to track permit submissions so I can monitor approval timelines and manage corrections.

**Acceptance Criteria:**
- [ ] Create entitlement record linked to project
- [ ] Record permit number and submission date
- [ ] Track status: Planning → Submitted → Under Review → Corrections → Approved/Denied
- [ ] View permit history and status changes
- [ ] Generate permit status report

**Tasks (from DATABASE_SCHEMA.md + API_SPECIFICATION.md):**

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E6-T1 | Create `entitlement` database table | DATABASE_SCHEMA.md lines 267-295 | 3 | P0 | E2 (Core Data Model) |
| E6-T2 | Create `permit_corrections` table | DATABASE_SCHEMA.md lines 298-320 | 2 | P0 | E6-T1 |
| E6-T3 | Implement POST `/projects/{id}/entitlement` API | API_SPECIFICATION.md (implicit) | 3 | P0 | E6-T1, E3 (Auth) |
| E6-T4 | Implement GET `/entitlement/{id}` API | API_SPECIFICATION.md (implicit) | 2 | P0 | E6-T1 |
| E6-T5 | Implement PATCH `/entitlement/{id}` (update status) | API_SPECIFICATION.md patterns | 3 | P0 | E6-T3 |
| E6-T6 | Implement POST `/entitlement/{id}/corrections` API | API_SPECIFICATION.md (implicit) | 3 | P1 | E6-T2 |
| E6-T7 | Build Entitlement Detail UI page (React) | SYSTEM_ARCHITECTURE.md lines 175-220 | 5 | P0 | E6-T3, E6-T4 |
| E6-T8 | Build Permit Status Timeline component | Frontend pattern | 3 | P1 | E6-T7 |
| E6-T9 | Build Corrections Management UI | Frontend pattern | 5 | P1 | E6-T6, E6-T7 |
| E6-T10 | Write unit tests for Entitlement service | TESTING_STRATEGY.md section 4 | 2 | P0 | E6-T3 |
| E6-T11 | Write API integration tests | TESTING_STRATEGY.md section 5 | 3 | P0 | E6-T5 |
| E6-T12 | Write E2E test: Create permit → Submit → Track | TESTING_STRATEGY.md section 6 | 3 | P1 | E6-T9 |

**Total Estimated Points:** 37 points (~7 weeks for 1 full-stack dev)

---

#### Feature: Plan Library Integration

**User Story E6-US2:** As a Design Coordinator, I need to browse and assign architectural plans to projects so builders can move forward with approved designs.

**Acceptance Criteria:**
- [ ] View plan library with filters (bedrooms, sqft, lot size)
- [ ] Search plans by number or name
- [ ] View plan details (images, specs, requirements)
- [ ] Assign plan to entitlement record
- [ ] Track which plans are most commonly used

**Tasks:**

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E6-T13 | Create `plan_library` database table | DATABASE_SCHEMA.md lines 658-693 | 3 | P0 | E2 |
| E6-T14 | Seed plan library with initial data (1,500 plans) | Migration strategy | 5 | P0 | E6-T13 |
| E6-T15 | Implement GET `/plans` with filters API | API_SPECIFICATION.md patterns | 3 | P0 | E6-T13 |
| E6-T16 | Implement GET `/plans/{id}` API | API_SPECIFICATION.md patterns | 2 | P0 | E6-T13 |
| E6-T17 | Build Plan Library Browse UI (grid view) | SYSTEM_ARCHITECTURE.md | 5 | P0 | E6-T15 |
| E6-T18 | Build Plan Detail Modal with images | Frontend pattern | 3 | P1 | E6-T16 |
| E6-T19 | Implement plan assignment to entitlement | API + DB update | 3 | P0 | E6-T1, E6-T16 |
| E6-T20 | Add plan search with full-text index | DATABASE_SCHEMA.md indexing | 3 | P1 | E6-T13 |
| E6-T21 | Unit tests for plan library service | TESTING_STRATEGY.md | 2 | P1 | E6-T15 |
| E6-T22 | E2E test: Browse plans → Select → Assign | TESTING_STRATEGY.md | 3 | P1 | E6-T19 |

**Total Estimated Points:** 32 points (~6 weeks for 1 full-stack dev)

---

### 2.2 Epic E7: Document Management

#### Feature: Document Upload & Storage

**User Story E7-US1:** As any user, I need to upload documents (surveys, reports, plans) and associate them with projects so all stakeholders have access.

**Tasks:**

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E7-T1 | Create `documents` table | DATABASE_SCHEMA.md lines 573-614 | 3 | P0 | E2 |
| E7-T2 | Set up cloud object storage (S3/Azure Blob) | SYSTEM_ARCHITECTURE.md lines 429-495 | 5 | P0 | E15 (Infra) |
| E7-T3 | Implement POST `/documents` (multipart upload) | API_SPECIFICATION.md lines 779-808 | 5 | P0 | E7-T1, E7-T2 |
| E7-T4 | Implement GET `/documents/{id}` API | API_SPECIFICATION.md lines 810-842 | 2 | P0 | E7-T1 |
| E7-T5 | Implement GET `/documents/{id}/download` (signed URL) | API_SPECIFICATION.md lines 844-849 | 3 | P0 | E7-T2 |
| E7-T6 | Build Document Upload UI component | SYSTEM_ARCHITECTURE.md | 5 | P0 | E7-T3 |
| E7-T7 | Build Document List/Gallery view | Frontend pattern | 5 | P0 | E7-T4 |
| E7-T8 | Implement document type validation | Business logic | 2 | P1 | E7-T3 |
| E7-T9 | Add document preview (PDF, images) | Frontend library | 3 | P1 | E7-T5 |
| E7-T10 | Unit tests for document service | TESTING_STRATEGY.md | 3 | P0 | E7-T3 |
| E7-T11 | Integration tests for file upload | TESTING_STRATEGY.md | 3 | P1 | E7-T3 |
| E7-T12 | E2E test: Upload → View → Download | TESTING_STRATEGY.md | 3 | P1 | E7-T9 |

**Total Estimated Points:** 42 points (~8 weeks for 1 full-stack dev)

---

#### Feature: AI Document Extraction (Azure Document Intelligence)

**User Story E7-US2:** As a user, when I upload a survey/title report, the system should automatically extract key data so I don't have to manually enter it.

**Tasks:**

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E7-T13 | Set up Azure Document Intelligence service | INTEGRATION_SPECIFICATIONS.md section 5 | 3 | P1 | E15 (Infra) |
| E7-T14 | Create document processing queue (async job) | SYSTEM_ARCHITECTURE.md lines 99-101 | 5 | P1 | E15 |
| E7-T15 | Implement survey extraction logic | Integration spec | 8 | P1 | E7-T13 |
| E7-T16 | Implement title report extraction | Integration spec | 8 | P1 | E7-T13 |
| E7-T17 | Store extracted data in `documents.extracted_data` (JSONB) | DATABASE_SCHEMA.md line 591 | 3 | P1 | E7-T1 |
| E7-T18 | Generate AI summary and store in `documents.summary` | Integration spec | 3 | P2 | E7-T13 |
| E7-T19 | Build UI to display extracted data | Frontend | 5 | P1 | E7-T17 |
| E7-T20 | Allow user to edit/correct extracted data | Frontend + API | 5 | P2 | E7-T19 |
| E7-T21 | Unit tests for extraction service | TESTING_STRATEGY.md | 3 | P1 | E7-T15 |
| E7-T22 | Integration test with mock Azure AI | TESTING_STRATEGY.md | 3 | P1 | E7-T15 |

**Total Estimated Points:** 46 points (~9 weeks, can be done in parallel with E7-US1)

---

### 2.3 Epic E12: BPO Integration (Temporary)

**User Story E12-US1:** As a system, I need to sync lead data from BPO so users can continue using BPO during the pilot phase.

**Tasks:**

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E12-T1 | Investigate BPO API capabilities (REST vs. export) | INTEGRATION_SPECIFICATIONS.md lines 72-99 | 2 | P0 | None |
| E12-T2 | Design BPO integration approach (API or batch) | Integration spec | 3 | P0 | E12-T1 |
| E12-T3 | Implement BPO API client (if REST available) | Integration spec | 5 | P0 | E12-T2 |
| E12-T4 | Implement batch import job (if no API) | Integration spec | 8 | P0 | E12-T2 (alt) |
| E12-T5 | Map BPO lead fields → Connect 2.0 projects table | Data mapping | 3 | P0 | E12-T1, E4 |
| E12-T6 | Implement POST endpoint to receive BPO webhooks | If BPO supports webhooks | 3 | P1 | E12-T3 |
| E12-T7 | Build sync monitoring dashboard | Admin UI | 5 | P2 | E12-T3 |
| E12-T8 | Integration tests for BPO sync | TESTING_STRATEGY.md | 5 | P1 | E12-T3 |

**Total Estimated Points:** 34 points (variable based on BPO capabilities)

**Decision Gate:** Days 1-14 - Determine BPO integration approach

---

## 3. Phase 2 Tasks (Days 91-180)

### Focus: Full Platform Rebuild (Lending + Servicing)

### 3.1 Epic E9: Lending Module

#### Feature: Loan Origination

**User Story E9-US1:** As a Lending Officer, I need to create loan applications for approved projects so we can fund deals quickly.

**Tasks:**

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E9-T1 | Create `loans` table | DATABASE_SCHEMA.md lines 326-377 | 3 | P0 | E2 |
| E9-T2 | Create `loan_guarantors` junction table | DATABASE_SCHEMA.md lines 383-395 | 2 | P0 | E9-T1 |
| E9-T3 | Generate unique loan numbers (BPC-YYYY-NNNNNN) | Business logic | 2 | P0 | E9-T1 |
| E9-T4 | Implement POST `/loans` API | API_SPECIFICATION.md lines 534-558 | 5 | P0 | E9-T1, E3 |
| E9-T5 | Implement GET `/loans` with filters | API_SPECIFICATION.md lines 486-532 | 3 | P0 | E9-T1 |
| E9-T6 | Implement GET `/loans/{id}` with expansions | API_SPECIFICATION.md lines 560-619 | 3 | P0 | E9-T1 |
| E9-T7 | Build Loan Creation Form UI | SYSTEM_ARCHITECTURE.md | 8 | P0 | E9-T4 |
| E9-T8 | Build Loan List view with filtering | Frontend | 5 | P0 | E9-T5 |
| E9-T9 | Build Loan Detail page | Frontend | 8 | P0 | E9-T6 |
| E9-T10 | Implement loan budget calculation logic | Business logic | 5 | P1 | E9-T4 |
| E9-T11 | Unit tests for loan service | TESTING_STRATEGY.md | 3 | P0 | E9-T4 |
| E9-T12 | E2E test: Create loan → Fund → View | TESTING_STRATEGY.md | 5 | P1 | E9-T9 |

**Total Estimated Points:** 52 points (~10 weeks)

---

#### Feature: Loan Approval & Funding

**User Story E9-US2:** As a Lending Manager, I need to approve loans and mark them as funded so we can track active loans.

**Tasks:**

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E9-T13 | Implement loan status workflow state machine | Business logic | 5 | P0 | E9-T1 |
| E9-T14 | Implement POST `/loans/{id}/approve` API | Implied by status workflow | 3 | P0 | E9-T13 |
| E9-T15 | Implement POST `/loans/{id}/fund` API | API_SPECIFICATION.md lines 621-635 | 5 | P0 | E9-T13 |
| E9-T16 | Assign loan to bank (borrowing base) | Business logic | 3 | P1 | E9-T15 |
| E9-T17 | Build Loan Approval UI workflow | Frontend | 5 | P0 | E9-T14 |
| E9-T18 | Build Funding confirmation dialog | Frontend | 3 | P0 | E9-T15 |
| E9-T19 | Send email notifications on approval/funding | E13 (Email integration) | 3 | P1 | E13, E9-T15 |
| E9-T20 | Unit tests for approval workflow | TESTING_STRATEGY.md | 3 | P0 | E9-T13 |
| E9-T21 | E2E test: Approve → Fund → Notify | TESTING_STRATEGY.md | 3 | P1 | E9-T19 |

**Total Estimated Points:** 33 points (~6 weeks)

---

### 3.2 Epic E10: Servicing Module

#### Feature: Draw Management

**User Story E10-US1:** As a Servicing Officer, I need to process draw requests from builders so we can disburse funds for construction progress.

**Tasks:**

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E10-T1 | Create `loan_draws` table | DATABASE_SCHEMA.md lines 401-445 | 3 | P0 | E9-T1 |
| E10-T2 | Create `inspections` table | DATABASE_SCHEMA.md lines 451-474 | 3 | P0 | E10-T1 |
| E10-T3 | Implement POST `/loans/{id}/draws` API | API_SPECIFICATION.md lines 672-685 | 5 | P0 | E10-T1 |
| E10-T4 | Implement GET `/loans/{id}/draws` API | API_SPECIFICATION.md lines 638-670 | 3 | P0 | E10-T1 |
| E10-T5 | Implement POST `/draws/{id}/approve` API | API_SPECIFICATION.md lines 687-710 | 5 | P0 | E10-T1 |
| E10-T6 | Calculate draw conditions (lien waivers, insurance) | Business logic | 5 | P1 | E10-T5 |
| E10-T7 | Build Draw Request Form UI | Frontend | 5 | P0 | E10-T3 |
| E10-T8 | Build Draw List view with status | Frontend | 5 | P0 | E10-T4 |
| E10-T9 | Build Draw Approval workflow UI | Frontend | 8 | P0 | E10-T5 |
| E10-T10 | Send email/SMS to builder on draw status change | E13 | 3 | P1 | E13, E10-T5 |
| E10-T11 | Unit tests for draw service | TESTING_STRATEGY.md | 3 | P0 | E10-T3 |
| E10-T12 | E2E test: Request draw → Inspect → Approve → Notify | TESTING_STRATEGY.md | 5 | P1 | E10-T10 |

**Total Estimated Points:** 53 points (~10 weeks)

---

#### Feature: iPad Inspection App Integration

**User Story E10-US2:** As an Inspector, I need the iPad app to sync inspection data with Connect 2.0 so draw approvals reflect field conditions.

**Tasks:**

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E10-T13 | Design iPad ↔ Connect 2.0 sync API contract | INTEGRATION_SPECIFICATIONS.md section 3 | 3 | P0 | None |
| E10-T14 | Implement POST `/inspections` API (iPad → Connect) | Integration spec | 5 | P0 | E10-T2 |
| E10-T15 | Implement GET `/inspections/{id}` API (Connect → iPad) | Integration spec | 2 | P0 | E10-T2 |
| E10-T16 | Implement nightly sync job (bi-directional) | Integration spec | 8 | P0 | E10-T14 |
| E10-T17 | Handle conflict resolution (iPad vs. server changes) | Sync logic | 5 | P1 | E10-T16 |
| E10-T18 | Build inspection photo upload endpoint | API + Storage | 5 | P1 | E7-T2 |
| E10-T19 | Display inspection photos in Draw Detail UI | Frontend | 3 | P1 | E10-T18 |
| E10-T20 | Integration tests for iPad sync | TESTING_STRATEGY.md | 5 | P1 | E10-T16 |

**Total Estimated Points:** 36 points (~7 weeks)

---

## 4. Foundation & Infrastructure Tasks

### 4.1 Epic E1: Foundation & Setup (Pre-Day 1)

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E1-T1 | **Tech Stack Decision:** Backend language (Node.js/Python/Go) | SYSTEM_ARCHITECTURE.md lines 120-141 | — | P0 | Leadership |
| E1-T2 | **Tech Stack Decision:** Frontend framework (React/Vue) | SYSTEM_ARCHITECTURE.md lines 142-149 | — | P0 | Leadership |
| E1-T3 | **Tech Stack Decision:** Cloud provider (AWS/Azure/GCP) | SYSTEM_ARCHITECTURE.md lines 432-495 | — | P0 | Leadership |
| E1-T4 | Set up GitHub repository structure (monorepo or multi-repo) | DEVELOPMENT_GUIDE.md | 2 | P0 | E1-T1, E1-T2 |
| E1-T5 | Initialize backend project (Fastify + TypeScript) | SYSTEM_ARCHITECTURE.md lines 135-141 | 3 | P0 | E1-T1, E1-T4 |
| E1-T6 | Initialize frontend project (React + Vite) | SYSTEM_ARCHITECTURE.md lines 142-149 | 3 | P0 | E1-T2, E1-T4 |
| E1-T7 | Set up Docker Compose for local development | SYSTEM_ARCHITECTURE.md lines 498-549 | 5 | P0 | E1-T5, E1-T6 |
| E1-T8 | Configure ESLint + Prettier for code standards | DEVELOPMENT_GUIDE.md | 2 | P1 | E1-T4 |
| E1-T9 | Set up environment variable management (.env) | SECURITY_COMPLIANCE.md | 2 | P0 | E1-T4 |
| E1-T10 | Create DEVELOPMENT.md onboarding guide | Documentation | 3 | P1 | E1-T7 |

**Total Estimated Points:** 20 points (~4 weeks for 1 dev + infra engineer)

**Decision Gates:** Days 1-14 - Finalize tech stack choices

---

### 4.2 Epic E2: Core Data Model (Days 1-30)

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E2-T1 | Set up PostgreSQL database (local + cloud) | DATABASE_SCHEMA.md + DEPLOYMENT_DEVOPS.md | 3 | P0 | E1-T7, E1-T3 |
| E2-T2 | Set up ORM (Prisma or TypeORM) | SYSTEM_ARCHITECTURE.md lines 138 | 3 | P0 | E2-T1 |
| E2-T3 | Create database migration framework | DATABASE_SCHEMA.md lines 817-890 | 3 | P0 | E2-T2 |
| E2-T4 | Create `users` table | DATABASE_SCHEMA.md lines 620-652 | 2 | P0 | E2-T3 |
| E2-T5 | Create `contacts` table | DATABASE_SCHEMA.md lines 480-522 | 3 | P0 | E2-T3 |
| E2-T6 | Create `entities` table | DATABASE_SCHEMA.md lines 528-548 | 2 | P0 | E2-T3 |
| E2-T7 | Create `contact_entities` junction table | DATABASE_SCHEMA.md lines 554-568 | 2 | P0 | E2-T5, E2-T6 |
| E2-T8 | Create `projects` table | DATABASE_SCHEMA.md lines 129-172 | 3 | P0 | E2-T3 |
| E2-T9 | Create `tasks` table | DATABASE_SCHEMA.md lines 218-260 | 3 | P0 | E2-T3 |
| E2-T10 | Create database indexes for performance | DATABASE_SCHEMA.md lines 729-765 | 5 | P1 | All table tasks |
| E2-T11 | Set up connection pooling (PgBouncer) | SYSTEM_ARCHITECTURE.md line 703 | 3 | P1 | E2-T1 |
| E2-T12 | Write migration rollback procedures | DATABASE_SCHEMA.md | 2 | P1 | E2-T3 |

**Total Estimated Points:** 34 points (~7 weeks, foundational)

---

### 4.3 Epic E3: Authentication & Authorization (Days 1-30)

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E3-T1 | Implement password hashing (bcrypt) | SECURITY_COMPLIANCE.md | 2 | P0 | E2-T4 |
| E3-T2 | Implement JWT token generation/validation | API_SPECIFICATION.md lines 44-88 | 5 | P0 | E2-T4 |
| E3-T3 | Implement POST `/auth/token` (login) endpoint | API_SPECIFICATION.md lines 55-76 | 3 | P0 | E3-T1, E3-T2 |
| E3-T4 | Implement POST `/auth/token` (refresh) endpoint | API_SPECIFICATION.md lines 79-87 | 3 | P0 | E3-T2 |
| E3-T5 | Implement authentication middleware | SYSTEM_ARCHITECTURE.md lines 258-262 | 3 | P0 | E3-T2 |
| E3-T6 | Implement RBAC middleware (role-based access) | API_SPECIFICATION.md lines 89-100 | 5 | P0 | E3-T5 |
| E3-T7 | Build Login page UI | SYSTEM_ARCHITECTURE.md | 3 | P0 | E3-T3 |
| E3-T8 | Build Protected Route wrapper component | Frontend pattern | 3 | P0 | E3-T7 |
| E3-T9 | Implement auth token storage (localStorage + refresh logic) | Frontend security | 3 | P0 | E3-T3 |
| E3-T10 | Unit tests for auth service | TESTING_STRATEGY.md | 3 | P0 | E3-T3 |
| E3-T11 | Integration tests for auth flow | TESTING_STRATEGY.md | 3 | P0 | E3-T4 |
| E3-T12 | Security test: JWT expiration handling | TESTING_STRATEGY.md section 10 | 2 | P1 | E3-T2 |

**Total Estimated Points:** 38 points (~7 weeks)

---

### 4.4 Epic E15: DevOps & Infrastructure (Ongoing)

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E15-T1 | Set up CI/CD pipeline (GitHub Actions) | DEPLOYMENT_DEVOPS.md | 8 | P0 | E1-T4 |
| E15-T2 | Configure automated testing in CI | TESTING_STRATEGY.md section 13 | 3 | P0 | E15-T1 |
| E15-T3 | Set up staging environment (cloud) | DEPLOYMENT_DEVOPS.md | 8 | P0 | E1-T3, E15-T1 |
| E15-T4 | Set up production environment (cloud) | DEPLOYMENT_DEVOPS.md | 8 | P0 | E1-T3 |
| E15-T5 | Implement database backup strategy | SYSTEM_ARCHITECTURE.md lines 756-765 | 5 | P0 | E2-T1 |
| E15-T6 | Set up monitoring (Datadog/Application Insights) | SYSTEM_ARCHITECTURE.md line 160 | 5 | P1 | E15-T3 |
| E15-T7 | Set up log aggregation (ELK or cloud logging) | SYSTEM_ARCHITECTURE.md line 161 | 5 | P1 | E15-T3 |
| E15-T8 | Configure alerting for critical failures | DEPLOYMENT_DEVOPS.md | 3 | P1 | E15-T6 |
| E15-T9 | Implement health check endpoint (`/health`) | SYSTEM_ARCHITECTURE.md lines 801-809 | 2 | P0 | E1-T5 |
| E15-T10 | Set up Redis cache (ElastiCache/Azure Cache) | SYSTEM_ARCHITECTURE.md lines 463-465 | 5 | P1 | E1-T3 |
| E15-T11 | Implement infrastructure as code (Terraform/CloudFormation) | DEPLOYMENT_DEVOPS.md | 8 | P2 | E1-T3 |
| E15-T12 | Document deployment runbook | DEPLOYMENT_DEVOPS.md | 3 | P1 | E15-T4 |

**Total Estimated Points:** 63 points (~12 weeks, parallel with feature development)

---

## 5. Integration Tasks

### 5.1 Epic E13: External Integrations

#### E-Signature (DocuSign/Authentisign)

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E13-T1 | Research DocuSign vs. Authentisign (cost, features) | INTEGRATION_SPECIFICATIONS.md section 4 | 2 | P0 | None |
| E13-T2 | Set up DocuSign developer account + API credentials | Integration spec | 2 | P0 | E13-T1 |
| E13-T3 | Implement DocuSign adapter (send envelope) | SYSTEM_ARCHITECTURE.md lines 392-423 | 5 | P1 | E13-T2 |
| E13-T4 | Implement DocuSign webhook handler (envelope complete) | SYSTEM_ARCHITECTURE.md lines 414-423 | 3 | P1 | E13-T3 |
| E13-T5 | Build UI to send documents for signature | Frontend | 5 | P1 | E13-T3 |
| E13-T6 | Store envelope status in database | Database update | 3 | P1 | E13-T3 |
| E13-T7 | Integration tests for DocuSign flow | TESTING_STRATEGY.md | 3 | P1 | E13-T4 |

**Total Points:** 23 points (~4 weeks)

---

#### Email Service (SendGrid/AWS SES)

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E13-T8 | Choose email provider (SendGrid/AWS SES) | INTEGRATION_SPECIFICATIONS.md section 6 | 1 | P0 | E1-T3 |
| E13-T9 | Set up email service account + API key | Integration spec | 2 | P0 | E13-T8 |
| E13-T10 | Implement email service adapter | SYSTEM_ARCHITECTURE.md lines 276 | 3 | P0 | E13-T9 |
| E13-T11 | Create email templates (task assigned, draw approved, etc.) | Business requirement | 5 | P1 | E13-T10 |
| E13-T12 | Implement async email queue (background job) | SYSTEM_ARCHITECTURE.md lines 99-101 | 5 | P1 | E15-T10 |
| E13-T13 | Build email notification preferences UI | Frontend | 3 | P2 | E13-T10 |
| E13-T14 | Unit tests for email service | TESTING_STRATEGY.md | 2 | P1 | E13-T10 |

**Total Points:** 21 points (~4 weeks)

---

#### SMS Service (Twilio)

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| E13-T15 | Set up Twilio account + API credentials | INTEGRATION_SPECIFICATIONS.md section 7 | 2 | P1 | None |
| E13-T16 | Implement SMS service adapter | Integration spec | 3 | P1 | E13-T15 |
| E13-T17 | Add SMS notifications for urgent events (draw approved) | Business requirement | 3 | P2 | E13-T16 |
| E13-T18 | Store SMS notification preferences in user profile | Database update | 2 | P2 | E13-T16 |
| E13-T19 | Unit tests for SMS service | TESTING_STRATEGY.md | 2 | P2 | E13-T16 |

**Total Points:** 12 points (~2 weeks)

---

## 6. Testing & Quality Assurance Tasks

### 6.1 Ongoing Testing Tasks (Per Feature)

Each feature should include:

| Test Type | Story Points Multiplier | When to Execute |
|-----------|------------------------|-----------------|
| **Unit Tests** | +10% of feature points | During development |
| **Integration Tests** | +15% of feature points | After feature complete |
| **E2E Tests** | +10% of feature points | After feature complete |
| **Security Tests** | +5% of feature points | Before production |

**Example:** Feature with 40 points → Add 16 points for testing (40 × 40% = 16)

---

### 6.2 Epic-Level Testing Tasks

| Task ID | Description | Technical Document Reference | Story Points | Priority | Dependencies |
|---------|-------------|----------------------------|--------------|----------|--------------|
| T-T1 | Set up Jest test framework (backend) | TESTING_STRATEGY.md lines 54-64 | 2 | P0 | E1-T5 |
| T-T2 | Set up Vitest test framework (frontend) | TESTING_STRATEGY.md line 59 | 2 | P0 | E1-T6 |
| T-T3 | Set up Playwright for E2E tests | TESTING_STRATEGY.md line 61 | 3 | P0 | E1-T6 |
| T-T4 | Create test database setup/teardown utilities | TESTING_STRATEGY.md section 8 | 3 | P0 | E2-T1 |
| T-T5 | Create test data factories/fixtures | TESTING_STRATEGY.md section 12 | 5 | P1 | E2 (all tables) |
| T-T6 | Set up code coverage reporting (Codecov) | TESTING_STRATEGY.md section 14 | 2 | P1 | E15-T1 |
| T-T7 | Implement load testing with k6 | TESTING_STRATEGY.md section 9 | 5 | P2 | E15-T3 |
| T-T8 | Set up OWASP ZAP security scanning | TESTING_STRATEGY.md section 10 | 5 | P2 | E15-T3 |
| T-T9 | Create E2E test for critical user journey (lead → loan) | TESTING_STRATEGY.md section 6 | 8 | P1 | All features |

**Total Points:** 35 points (~7 weeks, parallel with development)

---

## 7. Documentation Tasks

| Task ID | Description | Story Points | Priority | Phase |
|---------|-------------|--------------|----------|-------|
| D-T1 | API documentation (OpenAPI/Swagger generation) | 5 | P1 | Day 90 |
| D-T2 | User guide for Entitlement Coordinators | 5 | P1 | Day 90 |
| D-T3 | User guide for Servicing team | 5 | P1 | Day 180 |
| D-T4 | Admin guide (user management, settings) | 3 | P2 | Day 180 |
| D-T5 | Runbook for on-call engineers | 3 | P1 | Day 60 |
| D-T6 | Disaster recovery procedures | 3 | P1 | Day 60 |
| D-T7 | Data migration guide (BPO → Connect 2.0) | 5 | P0 | Day 90 |

**Total Points:** 29 points (~6 weeks)

---

## 8. Task Estimation & Prioritization Framework

### 8.1 Total Backlog Summary

| Epic | Phase | Estimated Points | Priority | Notes |
|------|-------|------------------|----------|-------|
| E1: Foundation & Setup | Pre-Day 1 | 20 | P0 | Tech stack decisions critical |
| E2: Core Data Model | Days 1-30 | 34 | P0 | Blocks all feature work |
| E3: Auth & Authorization | Days 1-30 | 38 | P0 | Blocks all feature work |
| E4: Lead & Project Mgmt | Days 1-90 | ~45 | P0 | Not fully broken down yet |
| E5: Feasibility Module | Days 1-90 | ~50 | P0 | Not fully broken down yet |
| E6: Entitlement & Design | Days 1-90 | 69 | P0 | MVP pilot focus |
| E7: Document Management | Days 1-90 | 88 | P0 | Core capability |
| E8: Task Management | Days 1-90 | ~30 | P1 | Not fully broken down yet |
| E9: Lending Module | Days 91-180 | 85 | P0 | Phase 2 focus |
| E10: Servicing Module | Days 91-180 | 89 | P0 | Phase 2 focus |
| E11: Contact Management | Days 1-90 | ~40 | P1 | Not fully broken down yet |
| E12: BPO Integration | Days 1-90 | 34 | P0 | Temporary, phased out Day 90 |
| E13: External Integrations | Days 1-90 | 56 | P1 | Staged rollout |
| E14: Analytics & Reporting | Days 91-180 | ~60 | P2 | Not fully broken down yet |
| E15: DevOps & Infrastructure | Ongoing | 63 | P0 | Parallel with all work |
| Testing Tasks | Ongoing | 35 | P0 | Per-feature + epic-level |
| Documentation Tasks | Ongoing | 29 | P1 | Milestone-based |

**Total Estimated Points (Fully Broken Down):** ~765 points
**Total Estimated Points (Including Placeholders):** ~1,000+ points

---

### 8.2 Team Velocity & Timeline Estimates

**Assumptions:**
- 1 story point = ~1 day of focused work for 1 developer
- Average velocity: 10-15 points per developer per 2-week sprint
- Team composition: TBD (need to clarify during Days 1-14)

**Example Team Size Scenarios:**

#### Scenario A: Small Team (4 developers)
- **Team Velocity:** 40-60 points/sprint (2 weeks)
- **Phase 1 (Days 1-90):** ~450 points → 8-11 sprints → **Tight but feasible**
- **Phase 2 (Days 91-180):** ~350 points → 6-9 sprints → **Feasible**

#### Scenario B: Medium Team (6 developers)
- **Team Velocity:** 60-90 points/sprint
- **Phase 1 (Days 1-90):** ~450 points → 5-8 sprints → **Comfortable**
- **Phase 2 (Days 91-180):** ~350 points → 4-6 sprints → **Comfortable with buffer**

#### Scenario C: Large Team (8 developers)
- **Team Velocity:** 80-120 points/sprint
- **Phase 1 (Days 1-90):** ~450 points → 4-6 sprints → **Comfortable with buffer**
- **Phase 2 (Days 91-180):** ~350 points → 3-5 sprints → **Buffer for polish**

**Recommendation:** Target **6-8 developers** for optimal velocity and collaboration.

---

### 8.3 Prioritization Rules

1. **P0 (Blocker):** Foundation tasks (E1, E2, E3, E15) must complete first
2. **P0 (MVP Critical):** Phase 1 features (E6, E7, E12) required for Day 90 pilot
3. **P1 (Important):** Enhances core functionality, include if time permits
4. **P2 (Nice-to-have):** Post-MVP enhancements, defer to Phase 3 if needed

---

## 9. Next Steps: Executing This Plan

### 9.1 Immediate Actions (Days 1-7)

1. **Review & Approve Plan:** PLT reviews this document, provides feedback
2. **Finalize Tech Stack:** Complete E1-T1, E1-T2, E1-T3 decisions (CRITICAL)
3. **Create GitHub Project:** Set up backlog tracking structure
4. **Import Initial Epics:** Create Epic issues for E1-E15
5. **Breakdown Phase 1 Epics:** Fully detail remaining Phase 1 epics (E4, E5, E8, E11)

### 9.2 Task Creation Process (Days 8-14)

For each epic:
1. Create Epic issue in GitHub (label: `epic:name`)
2. Break down into Features (label: `feature:name`)
3. Break down into User Stories (label: `user-story`)
4. Break down into Tasks (label: `task`)
5. Assign story points, priority, dependencies
6. Add to appropriate milestone (Day 30, Day 90, Day 180)

### 9.3 Sprint Planning Cadence

- **Sprint Duration:** 2 weeks
- **Sprint Planning:** Day 1 of sprint (4 hours)
- **Daily Standups:** 15 minutes
- **Sprint Review:** Last day of sprint (2 hours)
- **Sprint Retro:** Last day of sprint (1 hour)

---

## 10. Risk Mitigation

### 10.1 High-Risk Items

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **BPO integration complexity** | High | Medium | Decision gate Day 14; fallback to batch import |
| **Tech stack indecision delays start** | High | Medium | Force decision by Day 7; use defaults if needed |
| **Underestimated AI extraction complexity** | Medium | High | Start early, build MVP version, iterate |
| **Scope creep from stakeholders** | High | High | Strict MVP scope freeze after Day 30 |
| **Team size insufficient for timeline** | High | Medium | Re-scope if team < 6 developers |

### 10.2 Decision Gates

- **Day 14:** Tech stack finalized, BPO integration approach confirmed
- **Day 30:** Core data model complete, Phase 1 scope locked
- **Day 90:** Phase 1 pilot launched, Go/No-Go for Phase 2
- **Day 180:** MVP launch, success metrics evaluated

---

## Appendix A: Quick Reference - Story Sizing Cheat Sheet

| Story Points | Backend | Frontend | Full-Stack |
|--------------|---------|----------|------------|
| **1 point** | Add field to API response | Add input to form | Simple CRUD endpoint + UI |
| **2 points** | Simple CRUD endpoint | Basic list view | Add database table + API |
| **3 points** | Endpoint with validation | Form with validation | Database + API + form |
| **5 points** | Complex business logic | Multi-step workflow UI | Feature with state management |
| **8 points** | State machine workflow | Complex dashboard | Full feature with tests |
| **13 points** | Module with multiple endpoints | Full page with tabs/modals | Epic-sized (decompose!) |

---

## Appendix B: Template - User Story Format

```markdown
### User Story: [E#-US#] [Title]

**As a** [persona],
**I need to** [action],
**So that** [benefit].

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Tasks:**
| Task ID | Description | Points | Priority | Dependencies |
|---------|-------------|--------|----------|--------------|
| E#-T# | Task 1 | 3 | P0 | E#-T# |

**Definition of Done:**
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Deployed to staging
```

---

## Appendix C: Cross-Reference Matrix

| Epic | PRD Section | API Spec Sections | Database Tables | Integration Specs |
|------|-------------|-------------------|-----------------|-------------------|
| E6 (Entitlement) | Section 5.3 | Implicit (projects sub-resource) | entitlement, permit_corrections, plan_library | Section 9 (internal) |
| E7 (Documents) | Section 5.6 | Lines 779-849 | documents | Section 5 (Azure AI) |
| E9 (Lending) | Section 5.7 | Lines 486-635 | loans, loan_guarantors | Section 8 (Accounting) |
| E10 (Servicing) | Section 5.8 | Lines 638-710 | loan_draws, inspections | Section 3 (iPad) |
| E12 (BPO) | Section 2.2 | N/A (external system) | projects (mapping) | Section 2 |
| E13 (Integrations) | Section 9 | N/A (external) | N/A | Sections 4, 5, 6, 7 |

---

## Document Change Log

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2025-11-06 | 1.0 | Initial backlog creation plan | Claude Code |

---

**End of Backlog Creation Plan**
