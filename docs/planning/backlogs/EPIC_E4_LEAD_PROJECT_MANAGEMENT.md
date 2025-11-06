# Epic E4: Lead & Project Management - Detailed Backlog

**Epic Owner:** Acquisitions Lead
**Target Phase:** Days 1-90 (MVP Phase 1)
**Created:** November 6, 2025
**Status:** Ready for Sprint Planning

---

## Epic Overview

**Total Estimated Points:** 114 points (full scope) or **88 points** (MVP core - E4a)
**Priority:** P0 (Blocker - Foundation for all workflows)

This epic provides the foundation for managing leads and projects through the entire lifecycle: intake → feasibility → go/pass decision → entitlement → closing.

**Recommendation:** Split into two phases:
- **E4a: Core Project Management (Days 1-90)** - 88 points (MVP critical)
- **E4b: Advanced Features (Days 91-180)** - 26 points (Enhancement)

---

## Feature 1: Lead Intake System

### User Story E4-US1
**As an** Agent, **I need to** submit leads with project details **so that** Blueprint can evaluate opportunities quickly.

**Acceptance Criteria:**
- [ ] Agent can submit lead with address, price, notes, attachments
- [ ] System auto-acknowledges submission (email notification)
- [ ] Lead appears in acquisitions queue with status "LEAD"
- [ ] Agent receives confirmation with tracking ID
- [ ] Form validates required fields (address, city, state, zip)

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E4-T1 | Create `projects` database table | DATABASE_SCHEMA.md lines 129-172 | 3 | P0 | E2 (Core Data Model) |
| E4-T2 | Implement POST `/projects` API | API_SPECIFICATION.md lines 234-276 | 3 | P0 | E4-T1, E3 (Auth) |
| E4-T3 | Implement address validation logic | Business logic | 2 | P1 | E4-T2 |
| E4-T4 | Build Lead Submission Form UI | SYSTEM_ARCHITECTURE.md lines 175-220 | 5 | P0 | E4-T2 |
| E4-T5 | Implement auto-assignment to acquisitions team | API business logic | 3 | P1 | E4-T2 |
| E4-T6 | Send confirmation email on lead submission | E13 (Email integration) | 2 | P1 | E13, E4-T2 |
| E4-T7 | Unit tests for project creation service | TESTING_STRATEGY.md section 4 | 2 | P0 | E4-T2 |
| E4-T8 | Integration tests for lead submission API | TESTING_STRATEGY.md section 5 | 3 | P0 | E4-T2 |
| E4-T9 | E2E test: Submit lead → Confirm → View in queue | TESTING_STRATEGY.md section 6 | 3 | P1 | E4-T4 |

**Subtotal:** 26 points

---

## Feature 2: Project List & Filtering

### User Story E4-US2
**As an** Acquisitions Specialist, **I need to** view and filter projects by status, city, and assignment **so I can** prioritize my work.

**Acceptance Criteria:**
- [ ] View paginated list of projects (50 per page)
- [ ] Filter by status (LEAD, FEASIBILITY, GO, PASS, CLOSED)
- [ ] Filter by city (Seattle, Phoenix, etc.)
- [ ] Filter by assigned user
- [ ] Sort by created date, price, or status
- [ ] Results update in real-time or with manual refresh

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E4-T10 | Implement GET `/projects` API with filters | API_SPECIFICATION.md lines 182-232 | 3 | P0 | E4-T1 |
| E4-T11 | Add database indexes for filtering performance | DATABASE_SCHEMA.md lines 163-172 | 2 | P0 | E4-T1 |
| E4-T12 | Build Project List UI component | SYSTEM_ARCHITECTURE.md | 5 | P0 | E4-T10 |
| E4-T13 | Build Filter Panel component (status, city, user) | Frontend pattern | 3 | P0 | E4-T12 |
| E4-T14 | Implement pagination controls | Frontend pattern | 2 | P0 | E4-T12 |
| E4-T15 | Unit tests for project list service | TESTING_STRATEGY.md | 2 | P1 | E4-T10 |
| E4-T16 | E2E test: Filter projects → Sort → Paginate | TESTING_STRATEGY.md | 3 | P1 | E4-T13 |

**Subtotal:** 20 points

---

## Feature 3: Project Detail View

### User Story E4-US3
**As a** Blueprint User, **I need to** view comprehensive project details **so I have** full context.

**Acceptance Criteria:**
- [ ] View project overview (address, status, pricing)
- [ ] View submitted by (agent contact info)
- [ ] View assigned to (acquisitions specialist)
- [ ] View assigned builder (if applicable)
- [ ] View feasibility summary (if exists)
- [ ] View entitlement status (if exists)
- [ ] View associated documents
- [ ] View activity timeline (status changes, notes)

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E4-T17 | Implement GET `/projects/{id}` API with expansions | API_SPECIFICATION.md lines 278-346 | 3 | P0 | E4-T1 |
| E4-T18 | Build Project Detail page layout | SYSTEM_ARCHITECTURE.md | 5 | P0 | E4-T17 |
| E4-T19 | Build Project Overview Card component | Frontend pattern | 3 | P0 | E4-T18 |
| E4-T20 | Build Parties & Assignment Card component | Frontend pattern | 3 | P1 | E4-T18 |
| E4-T21 | Build Activity Timeline component | Frontend pattern | 3 | P1 | E4-T18 |
| E4-T22 | Integration tests for project detail API | TESTING_STRATEGY.md | 2 | P1 | E4-T17 |
| E4-T23 | E2E test: Navigate to project → View details | TESTING_STRATEGY.md | 2 | P1 | E4-T18 |

**Subtotal:** 21 points

---

## Feature 4: Status Transitions

### User Story E4-US4
**As an** Acquisitions Specialist, **I need to** transition project status **so I can** move deals through the pipeline.

**Acceptance Criteria:**
- [ ] Transition project status with notes
- [ ] System validates legal transitions (no LEAD → GO)
- [ ] Status history tracked with user and timestamp
- [ ] Notifications sent to relevant parties on status change
- [ ] UI shows current status and available transitions

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E4-T24 | Implement POST `/projects/{id}/transition` API | API_SPECIFICATION.md lines 388-416 | 5 | P0 | E4-T1 |
| E4-T25 | Create status transition validation logic | Business logic / state machine | 3 | P0 | E4-T24 |
| E4-T26 | Create `project_status_history` table | DATABASE_SCHEMA.md pattern | 2 | P0 | E4-T1 |
| E4-T27 | Build Status Transition UI component | Frontend pattern | 3 | P0 | E4-T24 |
| E4-T28 | Send status change notifications | E13 (Email integration) | 2 | P1 | E13, E4-T24 |
| E4-T29 | Unit tests for status transition service | TESTING_STRATEGY.md | 3 | P0 | E4-T24 |
| E4-T30 | E2E test: Transition LEAD → FEASIBILITY → GO | TESTING_STRATEGY.md | 3 | P1 | E4-T27 |

**Subtotal:** 21 points

---

## Feature 5: Project Assignment

### User Story E4-US5
**As an** Acquisitions Manager, **I need to** assign projects to specialists and builders **so** work is distributed efficiently.

**Acceptance Criteria:**
- [ ] Assign project to acquisitions specialist
- [ ] Assign project to builder (when status = GO)
- [ ] Reassign projects to different users
- [ ] System notifies assignee on assignment
- [ ] Assignment visible in project detail and list views

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E4-T31 | Implement PATCH `/projects/{id}` API for assignment | API_SPECIFICATION.md lines 348-377 | 3 | P0 | E4-T1 |
| E4-T32 | Build Assignment Dropdown component | Frontend pattern | 3 | P0 | E4-T31 |
| E4-T33 | Implement assignment notification logic | E13 (Email integration) | 2 | P1 | E13, E4-T31 |
| E4-T34 | Unit tests for assignment service | TESTING_STRATEGY.md | 2 | P1 | E4-T31 |
| E4-T35 | E2E test: Assign project → Notification sent | TESTING_STRATEGY.md | 2 | P1 | E4-T32 |

**Subtotal:** 12 points

---

## Feature 6: Project Search

### User Story E4-US6
**As a** Blueprint User, **I need to** search projects by address **so I can** quickly find specific deals.

**Acceptance Criteria:**
- [ ] Full-text search on project address, city, parcel number
- [ ] Search results ranked by relevance
- [ ] Search autocomplete/suggestions
- [ ] Search from project list page
- [ ] Search results display key project info

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E4-T36 | Create full-text search index on projects | DATABASE_SCHEMA.md lines 170-171 | 2 | P1 | E4-T1 |
| E4-T37 | Implement GET `/projects/search` API endpoint | API pattern | 3 | P1 | E4-T36 |
| E4-T38 | Build Search Bar component with autocomplete | Frontend pattern | 5 | P1 | E4-T37 |
| E4-T39 | Integration tests for search API | TESTING_STRATEGY.md | 2 | P1 | E4-T37 |
| E4-T40 | E2E test: Search by address → View results | TESTING_STRATEGY.md | 2 | P1 | E4-T38 |

**Subtotal:** 14 points

---

## Epic Summary

| Feature | Story Points | Priority | Phase |
|---------|--------------|----------|-------|
| Lead Intake System | 26 | P0 | E4a (MVP) |
| Project List & Filtering | 20 | P0 | E4a (MVP) |
| Project Detail View | 21 | P0 | E4a (MVP) |
| Status Transitions | 21 | P0 | E4a (MVP) |
| Project Assignment | 12 | P0 | E4b (Phase 2) |
| Project Search | 14 | P1 | E4b (Phase 2) |

**Total Epic E4:** 114 points
**E4a (MVP Core):** 88 points
**E4b (Advanced):** 26 points

---

## Dependencies

**Blocks:**
- E5 (Feasibility) - Requires project records
- E6 (Entitlement) - Requires project records
- E12 (BPO Integration) - Syncs to projects table

**Blocked By:**
- E2 (Core Data Model) - Projects table required
- E3 (Auth) - Authentication middleware required
- E11 (Contact Management) - Agent/builder assignment
- E13 (Email Integration) - Notifications

---

## File References

- [API_SPECIFICATION.md](../technical/API_SPECIFICATION.md) lines 178-416
- [DATABASE_SCHEMA.md](../technical/DATABASE_SCHEMA.md) lines 129-172
- [SYSTEM_ARCHITECTURE.md](../technical/SYSTEM_ARCHITECTURE.md) lines 175-220
- [TESTING_STRATEGY.md](../technical/TESTING_STRATEGY.md) sections 4-6
- [BACKLOG_CREATION_PLAN.md](BACKLOG_CREATION_PLAN.md) Epic E4 section

---

**Status:** Ready for Sprint Planning
**Next Steps:** Create GitHub issues, assign to sprints, begin E4-T1
