# Epic E8: Task Management - Detailed Backlog

**Epic Owner:** Cross-Functional (All Teams)
**Target Phase:** Days 1-90 (Foundation MVP)
**Created:** November 6, 2025
**Status:** Ready for Sprint Planning

---

## Epic Overview

**Full Scope:** 144 points
**MVP Core (P0 only):** ~44 points
**Original Estimate:** ~30 points (underestimated)

Task Management enables users to create, assign, track, and manage tasks across projects and loans. Critical foundation for E5 (Feasibility consultant tasks) and E10 (Servicing workflows).

**Recommendation:** Implement P0 tasks only for MVP (Days 1-90), defer advanced features to Phase 2.

---

## MVP Scope (Days 1-90): 44 points

### Feature 1: Task Creation & Assignment (15 points from P0 tasks)
### Feature 2: Task List Views (13 points from P0 tasks)
### Feature 3: Task Status Management (11 points from P0 tasks)
### Core Testing (5 points: E8-T54, E8-T56)

---

## Feature 1: Task Creation & Assignment

### User Story E8-US1
**As a** Blueprint user, **I need to** create tasks and assign them to team members or external contacts, **so that** I can delegate work and track deliverables.

**Acceptance Criteria:**
- [ ] Create task with title, description, due date, priority
- [ ] Assign to internal user or external contact
- [ ] Link task to project or loan (optional)
- [ ] Specify task type (SURVEY, TITLE, ARBORIST)
- [ ] Set priority (LOW, MEDIUM, HIGH, URGENT)
- [ ] Assignee receives notification

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E8-T1 | Implement POST `/tasks` API endpoint | API lines 867-884 | 3 | P0 | E2-T9, E3 |
| E8-T2 | Implement task validation logic | Business logic | 2 | P0 | E8-T1 |
| E8-T3 | Add support for assignee type (USER/CONTACT) | DATABASE_SCHEMA.md lines 225-226 | 2 | P0 | E8-T1, E2-T4, E2-T5 |
| E8-T4 | Build Task Creation Form UI | SYSTEM_ARCHITECTURE.md | 5 | P0 | E8-T1 |
| E8-T5 | Implement user/contact picker component | Frontend | 3 | P0 | E8-T4 |
| E8-T6 | Add project/loan association to form | Frontend | 2 | P0 | E8-T4 |
| E8-T7 | Implement priority selector | Frontend | 1 | P1 | E8-T4 |
| E8-T8 | Unit tests for task creation service | TESTING_STRATEGY.md | 2 | P0 | E8-T1 |
| E8-T9 | E2E test: Create task → Assign → Verify | TESTING_STRATEGY.md | 3 | P1 | E8-T4, E13 |

**Subtotal:** 23 points (15 P0 points)

---

## Feature 2: Task List Views & Filters

### User Story E8-US2
**As a** Blueprint user, **I need to** view and filter my tasks, **so that** I can prioritize work.

**Acceptance Criteria:**
- [ ] View personal tasks (assigned to me)
- [ ] View project-specific tasks
- [ ] Filter by assignee, project, loan, status, priority
- [ ] Filter by due date (today, this week, overdue)
- [ ] Sort by due date, priority, creation date
- [ ] Display task count badges

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E8-T10 | Implement GET `/tasks` with query filters | API lines 854-864 | 3 | P0 | E8-T1 |
| E8-T11 | Add pagination support to tasks endpoint | API patterns | 2 | P0 | E8-T10 |
| E8-T12 | Implement task filtering logic | Backend logic | 3 | P0 | E8-T10 |
| E8-T13 | Add due date filters (due_before, overdue) | Backend logic | 2 | P1 | E8-T10 |
| E8-T14 | Build Task List view UI | Frontend | 5 | P0 | E8-T10 |
| E8-T15 | Build Task Filter sidebar component | Frontend | 3 | P1 | E8-T14 |
| E8-T16 | Implement task list sorting | Frontend | 2 | P1 | E8-T14 |
| E8-T17 | Add task count badges | Frontend | 2 | P1 | E8-T14 |
| E8-T18 | Unit tests for task query service | TESTING_STRATEGY.md | 2 | P1 | E8-T10 |
| E8-T19 | E2E test: Filter tasks → Verify results | TESTING_STRATEGY.md | 2 | P1 | E8-T15 |

**Subtotal:** 26 points (13 P0 points)

---

## Feature 3: Task Status Management

### User Story E8-US3
**As a** task assignee, **I need to** update task status, **so that** stakeholders can track progress.

**Acceptance Criteria:**
- [ ] Update status: PENDING → IN_PROGRESS → COMPLETED
- [ ] Allow status change to CANCELLED
- [ ] Record completion timestamp
- [ ] Prevent invalid status transitions
- [ ] Notify task creator when completed

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E8-T20 | Implement PATCH `/tasks/{id}` API | API patterns | 3 | P0 | E8-T1 |
| E8-T21 | Implement status workflow validation | DATABASE_SCHEMA.md | 2 | P0 | E8-T20 |
| E8-T22 | Auto-set completed_at timestamp | DATABASE_SCHEMA.md | 1 | P0 | E8-T20 |
| E8-T23 | Build Task Detail view UI | Frontend | 5 | P0 | E8-T20 |
| E8-T24 | Build Task Status update component | Frontend | 2 | P0 | E8-T23 |
| E8-T25 | Implement completion notification | E13 integration | 3 | P1 | E8-T20, E13 |
| E8-T26 | Display status history in detail view | Frontend | 3 | P2 | E8-T23 |
| E8-T27 | Unit tests for status update service | TESTING_STRATEGY.md | 2 | P0 | E8-T20 |
| E8-T28 | E2E test: Update status → Verify notification | TESTING_STRATEGY.md | 2 | P1 | E8-T25 |

**Subtotal:** 23 points (11 P0 points)

---

## Deferred Features (Phase 2: Days 91-180)

### Feature 4: Task Notifications & Reminders (20 points)
- E8-T29 to E8-T37
- Email/SMS notifications
- Daily cron job for due/overdue reminders

### Feature 5: Task Calendar View (24 points)
- E8-T38 to E8-T45
- Calendar library integration
- Month/week/day views

### Feature 6: Task Integration with Projects & Loans (19 points)
- E8-T46 to E8-T53
- Contextual task display
- Task count badges on project/loan cards

---

## Epic-Level Testing & Documentation

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E8-T54 | Integration tests for task API endpoints | 3 | P0 | All API tasks |
| E8-T55 | Performance testing for task queries | 2 | P1 | E8-T10 |
| E8-T56 | Security testing: RBAC for tasks | 2 | P0 | E8-T1, E3 |
| E8-T57 | User documentation: Task Management guide | 2 | P1 | All features |

**Subtotal:** 9 points

---

## Epic Summary

| Feature | Full Points | P0 Points | Phase |
|---------|-------------|-----------|-------|
| Task Creation & Assignment | 23 | 15 | MVP |
| Task List Views & Filters | 26 | 13 | MVP |
| Task Status Management | 23 | 11 | MVP |
| Task Notifications | 20 | — | Phase 2 |
| Task Calendar View | 24 | — | Phase 2 |
| Project/Loan Integration | 19 | — | Phase 2 |
| Epic Testing | 9 | 5 | MVP |
| **TOTAL** | **144** | **44** | — |

---

## Dependencies

**Blocks:**
- E5 (Feasibility) - Consultant task assignments
- E10 (Servicing) - Draw inspection tasks

**Blocked By:**
- E2 (Core Data Model) - tasks table required
- E3 (Auth) - Authentication middleware
- E4 (Projects) - Project association
- E9 (Loans) - Loan association (Phase 2)
- E11 (Contacts) - External contact assignment
- E13 (Notifications) - Email/SMS service

**Critical:** E8 must complete early (Days 1-30) to unblock E5 consultant workflows.

---

## RBAC Rules

**Who can see which tasks:**
- Users see: Tasks assigned to them + Tasks they created
- Managers see: All tasks for their team
- Admins see: All tasks

**External Contacts:**
- Consultants receive email notifications with read-only links
- No login required for external users

---

## Acceptance Testing Scenarios

### Scenario 1: Entitlement Coordinator Creates Consultant Task
1. Navigate to Project Detail page
2. Click "Create Task"
3. Enter title: "Complete arborist report"
4. Assign to: Contact (ABC Arborist)
5. Set due date: 7 days from now
6. Set priority: HIGH
7. Submit form
8. **Expected**: Task created, consultant receives email notification

### Scenario 2: View Overdue Tasks
1. Navigate to Tasks page
2. Apply filter: Status = PENDING, Due Date = Overdue
3. **Expected**: List shows all pending tasks past due date
4. Click task to view details
5. Update status to IN_PROGRESS
6. **Expected**: Task moves out of overdue filter

---

## Success Metrics (Day 90)

| Metric | Target |
|--------|--------|
| % projects with ≥1 task | ≥50% |
| Task completion rate | ≥70% |
| % tasks completed on time | ≥80% |
| DAU in Task module | Track baseline |

---

## File References

- [API_SPECIFICATION.md](../technical/API_SPECIFICATION.md) lines 851-884
- [DATABASE_SCHEMA.md](../technical/DATABASE_SCHEMA.md) lines 218-260
- [SYSTEM_ARCHITECTURE.md](../technical/SYSTEM_ARCHITECTURE.md) lines 99-101, 175-220
- [INTEGRATION_SPECIFICATIONS.md](../technical/INTEGRATION_SPECIFICATIONS.md) sections 6-7
- [TESTING_STRATEGY.md](../technical/TESTING_STRATEGY.md) sections 4-6
- [BACKLOG_CREATION_PLAN.md](BACKLOG_CREATION_PLAN.md) Epic E8 section

---

**Status:** Ready for Sprint Planning
**Priority:** HIGH - Must complete early to unblock E5
**Next Steps:** Create GitHub issues, assign to Sprint 2-3 (Days 15-45)
