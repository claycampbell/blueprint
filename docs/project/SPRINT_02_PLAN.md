# Sprint 2 Planning - Authentication, Task & Contact Management

**Sprint Duration:** 2 weeks (10 working days)
**Start Date:** 2025-12-02
**End Date:** 2025-12-13
**Sprint Goal:** Complete authentication infrastructure, establish task and contact management foundations, and deploy staging environment to enable feature development

---

## 1. Sprint Information

### 1.1 Key Dates

| Milestone | Date | Time |
|-----------|------|------|
| Sprint Planning | 2025-12-02 | 09:00 AM |
| Daily Standups | Mon-Fri | 09:30 AM |
| Mid-Sprint Checkpoint | 2025-12-06 | 02:00 PM |
| Sprint Review | 2025-12-13 | 02:00 PM |
| Sprint Retrospective | 2025-12-13 | 03:30 PM |

### 1.2 Sprint Objectives

**Primary Goal:** Complete authentication/RBAC, implement core Task Management (E8) and Contact Management (E11) APIs to unblock E4, E5 feature development

**Secondary Goals:**
- Deploy staging environment for continuous testing
- Establish email service integration foundation
- Complete remaining data model components (indexes, additional tables)

**Success Criteria:**
- [ ] All P0 tasks from E3 (Auth), E8 (Tasks), E11 (Contacts) completed and merged
- [ ] RBAC fully implemented with role-based access controls
- [ ] Task and Contact CRUD APIs functional with tests
- [ ] Staging environment deployed and accessible
- [ ] Email service configured for notifications
- [ ] ≥80% test coverage for all new code
- [ ] Zero critical bugs in staging environment

---

## 2. Team Capacity Calculation

### 2.1 Team Composition

| Role | Team Members | Velocity per Person | Total Points |
|------|--------------|---------------------|--------------|
| Backend Developer | 2 | 10 points/sprint | 20 points |
| Frontend Developer | 2 | 10 points/sprint | 20 points |
| Full-Stack Developer | 2 | 10 points/sprint | 20 points |
| **Total Base Capacity** | **6** | | **60 points** |

### 2.2 Capacity Adjustments

| Adjustment Type | Impact | Points Deducted |
|----------------|--------|-----------------|
| Meetings / Ceremonies | Sprint ceremonies (15% overhead) | -9 points |
| Tech Debt / Bug Fixes | 10% buffer for Sprint 1 issues | -6 points |
| Code Reviews | Additional review time for new patterns | -3 points |
| **Total Adjustments** | | **-18 points** |

### 2.3 Available Sprint Capacity

```
Total Base Capacity:        60 points
Total Adjustments:         -18 points
─────────────────────────────────────
Available Sprint Capacity:  42 points
```

### 2.4 Historical Velocity

| Sprint | Planned | Completed | Velocity % |
|--------|---------|-----------|------------|
| Sprint 1 | 37 pts | 37 pts | 100% |
| **Average** | **37 pts** | **37 pts** | **100%** |

*Note: Sprint 1 established baseline velocity. Adjusting Sprint 2 target based on complexity increase.*

---

## 3. Sprint Backlog Selection

### 3.1 Selection Criteria

**Priority Order:**
1. **P0 (Blocker)** - Auth/RBAC completion (blocks all API work)
2. **P0 (Critical)** - Task Management core (blocks E5 Feasibility)
3. **P0 (Critical)** - Contact Management core (blocks E4, E5, E9)
4. **P1 (Important)** - Staging deployment, Email service setup
5. **P2 (Nice-to-have)** - Defer to Sprint 3

**Selection Rules:**
- E8 (Task Management) is a critical blocker for E5 consultant workflows
- E11 (Contact Management) is a critical blocker for E4, E5, E9
- Must complete E3 (Auth) to enable all authenticated API endpoints
- Leave buffer for Sprint 1 integration issues

### 3.2 Sprint Backlog

| Task ID | Description | Priority | Story Points | Assignee | Dependencies | Epic |
|---------|-------------|----------|--------------|----------|--------------|------|
| E3-T6 | Implement RBAC middleware | P0 | 3 | Alex | E3-T1 | E3: Auth |
| E3-T7 | Build Login UI | P0 | 5 | Jordan | E3-T5 | E3: Auth |
| E3-T8 | Build Protected Route wrapper | P0 | 2 | Jordan | E3-T7 | E3: Auth |
| E3-T9 | Implement token refresh flow | P1 | 3 | Alex | E3-T3 | E3: Auth |
| E3-T10 | Add logout functionality | P1 | 2 | Jordan | E3-T7 | E3: Auth |
| E3-T11 | Integration tests for auth flow | P0 | 3 | Morgan | E3-T7 | E3: Auth |
| E8-T1 | Implement POST `/tasks` API | P0 | 3 | Morgan | E2-T9, E3-T6 | E8: Tasks |
| E8-T2 | Implement task validation logic | P0 | 2 | Morgan | E8-T1 | E8: Tasks |
| E8-T3 | Add assignee type support (USER/CONTACT) | P0 | 2 | Morgan | E8-T1 | E8: Tasks |
| E8-T8 | Unit tests for task creation service | P0 | 2 | Taylor | E8-T1 | E8: Tasks |
| E11-T1 | Create contacts database table | P0 | 3 | Sam | E2 | E11: Contacts |
| E11-T2 | Implement POST `/contacts` API | P0 | 3 | Taylor | E11-T1, E3-T6 | E11: Contacts |
| E11-T3 | Implement GET `/contacts/{id}` API | P0 | 2 | Taylor | E11-T1 | E11: Contacts |
| E11-T6 | Add validation middleware (email, phone) | P0 | 2 | Taylor | E11-T2 | E11: Contacts |
| E15-T3 | Deploy staging environment | P1 | 5 | Sam | E1-T7 | E15: DevOps |

**Committed Points:** 42 / 42 (100% of capacity)

**Stretch Goals** (if ahead of schedule):
- [ ] E8-T4: Build Task Creation Form UI (5 points)
- [ ] E11-T4: Implement PATCH `/contacts/{id}` API (2 points)
- [ ] E13-T8: Email service configuration (3 points)

---

## 4. Epic Breakdown

### Epic E3: Authentication & Authorization (18 points)

**Goal:** Complete authentication infrastructure and RBAC to secure all API endpoints
**Total Points:** 38 (Sprint allocation: 18 - remaining core tasks)

**Tasks in This Sprint:**
- [ ] **E3-T6**: Implement RBAC middleware (3 pts) - Alex
  - Acceptance Criteria: Role checking middleware; route-level permission enforcement
  - Dependencies: E3-T1 (JWT auth complete from Sprint 1)

- [ ] **E3-T7**: Build Login UI (5 pts) - Jordan
  - Acceptance Criteria: Login form with email/password; validation; error states; redirect after login
  - Dependencies: E3-T5 (auth context)

- [ ] **E3-T8**: Build Protected Route wrapper (2 pts) - Jordan
  - Acceptance Criteria: HOC/wrapper redirects unauthenticated users; preserves intended route
  - Dependencies: E3-T7

- [ ] **E3-T9**: Implement token refresh flow (3 pts) - Alex
  - Acceptance Criteria: Auto-refresh before expiry; silent refresh; redirect on failure
  - Dependencies: E3-T3

- [ ] **E3-T10**: Add logout functionality (2 pts) - Jordan
  - Acceptance Criteria: Clear tokens; redirect to login; invalidate session on server
  - Dependencies: E3-T7

- [ ] **E3-T11**: Integration tests for auth flow (3 pts) - Morgan
  - Acceptance Criteria: Test login, logout, token refresh, protected routes; ≥90% auth code coverage
  - Dependencies: E3-T7

### Epic E8: Task Management (9 points)

**Goal:** Implement core task creation and validation to enable consultant task workflows
**Total Points:** 44 MVP (Sprint allocation: 9 - foundational API)

**Tasks in This Sprint:**
- [ ] **E8-T1**: Implement POST `/tasks` API (3 pts) - Morgan
  - Acceptance Criteria: Create task with title, description, due_date, priority, assignee; returns task ID
  - Dependencies: E2-T9 (tasks table), E3-T6 (auth middleware)

- [ ] **E8-T2**: Implement task validation logic (2 pts) - Morgan
  - Acceptance Criteria: Validate required fields; due_date in future; priority enum; assignee exists
  - Dependencies: E8-T1

- [ ] **E8-T3**: Add assignee type support (USER/CONTACT) (2 pts) - Morgan
  - Acceptance Criteria: Assign to internal user or external contact; polymorphic assignee
  - Dependencies: E8-T1, E2-T4, E2-T5

- [ ] **E8-T8**: Unit tests for task creation service (2 pts) - Taylor
  - Acceptance Criteria: Test valid/invalid task creation; ≥80% coverage for task service
  - Dependencies: E8-T1

### Epic E11: Contact Management (10 points)

**Goal:** Implement contact CRUD foundation for agent, builder, consultant tracking
**Total Points:** 67 MVP (Sprint allocation: 10 - core APIs)

**Tasks in This Sprint:**
- [ ] **E11-T1**: Create contacts database table (3 pts) - Sam
  - Acceptance Criteria: Table with type, name, company, email, phone, address (JSONB); indexes
  - Dependencies: E2 foundation complete

- [ ] **E11-T2**: Implement POST `/contacts` API (3 pts) - Taylor
  - Acceptance Criteria: Create contact; validate email format; return contact ID
  - Dependencies: E11-T1, E3-T6

- [ ] **E11-T3**: Implement GET `/contacts/{id}` API (2 pts) - Taylor
  - Acceptance Criteria: Return contact by ID; 404 if not found; include all fields
  - Dependencies: E11-T1

- [ ] **E11-T6**: Add validation middleware (email, phone) (2 pts) - Taylor
  - Acceptance Criteria: Email RFC 5322 format; phone E.164 format; meaningful error messages
  - Dependencies: E11-T2

### Epic E15: DevOps & Infrastructure (5 points)

**Goal:** Deploy staging environment for continuous testing
**Total Points:** 63 (Sprint allocation: 5 - staging deployment)

**Tasks in This Sprint:**
- [ ] **E15-T3**: Deploy staging environment (5 pts) - Sam
  - Acceptance Criteria: Staging mirrors prod config; auto-deploy on merge to main; accessible to team
  - Dependencies: E1-T7 (CI/CD pipeline from Sprint 1)

---

## 5. Definition of Done

For each task to be considered **"Done"** and counted toward sprint completion:

### 5.1 Code Quality
- [ ] Code complete and functional
- [ ] Code follows project style guide / linting rules (ESLint/Prettier)
- [ ] No compiler warnings or errors
- [ ] No console errors or warnings (frontend)
- [ ] TypeScript strict mode passing

### 5.2 Testing
- [ ] Unit tests written and passing (≥80% coverage for new code)
- [ ] Integration tests written (for API endpoints)
- [ ] All existing tests still passing (regression check)
- [ ] Manual testing completed in local Docker environment

### 5.3 Code Review
- [ ] Pull request created with clear description
- [ ] Code reviewed by 2 team members
- [ ] All review comments addressed
- [ ] PR approved by reviewers

### 5.4 Documentation
- [ ] API documentation updated (for API tasks)
- [ ] Inline code comments for complex logic
- [ ] Database schema documentation updated (for E11-T1)

### 5.5 Deployment
- [ ] Merged to `main` branch
- [ ] CI/CD pipeline passing (tests, linting)
- [ ] Deployed to staging (after E15-T3 complete)
- [ ] No breaking changes

### 5.6 Acceptance
- [ ] Acceptance criteria met (from task description)
- [ ] Tech Lead reviewed and approved
- [ ] Demo-able in sprint review

---

## 6. Dependencies & Blockers

### 6.1 External Dependencies

| Dependency | Owner | Status | Due Date | Risk | Mitigation |
|------------|-------|--------|----------|------|------------|
| AWS staging account | DevOps team | Green | Sprint Day 3 | Low | Sandbox ready from Sprint 1 |
| Email service credentials (SendGrid/SES) | Alex | Yellow | Sprint Day 5 | Medium | Use local SMTP for dev; defer prod integration |

### 6.2 Internal Blockers

| Blocker | Impact | Owner | Resolution Plan | Target Date |
|---------|--------|-------|-----------------|-------------|
| E2-T9 (tasks table) completion | Blocks E8-T1 | Sprint 1 carryover | Verify completion Day 1 | Day 1 |
| E3-T5 (auth context) completion | Blocks E3-T7 | Sprint 1 carryover | Verify completion Day 1 | Day 1 |

### 6.3 Cross-Team Coordination

| Team | What We Need | Contact | Status |
|------|--------------|---------|--------|
| Product | Review RBAC role definitions | Sarah (PO) | Scheduled Day 2 |
| Design | Login UI mockups | Design team | In progress |

---

## 7. Risk Assessment

### 7.1 Sprint Risks

| Risk | Likelihood | Impact | Severity | Mitigation Strategy | Owner |
|------|------------|--------|----------|---------------------|-------|
| Sprint 1 tech debt slows velocity | Medium | Medium | **MEDIUM** | Allocate 10% buffer; address critical issues first | Alex |
| RBAC complexity higher than estimated | Medium | High | **HIGH** | Use established library (casl/accesscontrol); simplify initial roles | Alex |
| Staging deployment issues | Low | Medium | **LOW** | Use Docker Compose parity; document deployment steps | Sam |
| Contact/Task API integration issues | Low | Medium | **LOW** | Clear interface contracts; parallel development with mocks | Morgan/Taylor |

### 7.2 Technical Debt

**Debt Incurred This Sprint:**
- May use simplified RBAC initially (3 roles) - Expand in Sprint 4
- Email service may be stubbed - Full integration in Sprint 3

**Debt Paid Down This Sprint:**
- Docker optimizations from Sprint 1 feedback
- Database index improvements

---

## 8. Sprint Planning Meeting Agenda

**Duration:** 4 hours
**Date:** 2025-12-02
**Time:** 09:00 AM - 01:00 PM

### 8.1 Agenda

| Time | Activity | Duration | Facilitator |
|------|----------|----------|-------------|
| 09:00 | Welcome & Sprint Goal Review | 10 min | Alex (Scrum Master) |
| 09:10 | Sprint 1 Review & Velocity Discussion | 30 min | Team |
| 09:40 | Review Sprint 2 Backlog | 30 min | Sarah (Product Owner) |
| 10:10 | Dependency Review (E3, E8, E11 relationships) | 20 min | Alex |
| 10:30 | Break | 15 min | - |
| 10:45 | Capacity Planning & Adjustments | 15 min | Alex |
| 11:00 | Task Breakdown & Estimation Refinement | 90 min | Team (Planning Poker) |
| 12:30 | Sprint Commitment | 15 min | Team |
| 12:45 | Risk & Blocker Mitigation Planning | 10 min | Team |
| 12:55 | Wrap-up & Action Items | 5 min | Alex |

### 8.2 Previous Sprint Review (Sprint 1)

**What Went Well:**
- Tech stack decisions made quickly (Day 1)
- CI/CD pipeline operational ahead of schedule
- Database schema well-received by team
- Team collaboration strong despite Thanksgiving week

**What Didn't Go Well:**
- Docker setup took longer than estimated (5 pts → 7 pts actual effort)
- Some Sprint 1 tasks had unclear acceptance criteria initially

**Action Items from Retro:**
- [ ] Improve task acceptance criteria detail level
- [ ] Add Docker troubleshooting documentation
- [ ] Schedule mid-sprint checkpoint for blockers

**Velocity Achieved:**
- Planned: 37 points
- Completed: 37 points
- Velocity: 100%

---

## 9. Daily Standup Format

**Duration:** 15 minutes max
**Time:** 09:30 AM daily (Mon-Fri)
**Format:** Video call (Zoom/Teams)
**Location:** [Meeting link]

**Each team member answers:**
1. **Yesterday:** What did I complete?
2. **Today:** What will I work on?
3. **Blockers:** What's preventing progress?

**Parking Lot:**
- Topics that need longer discussion (schedule separate meeting after standup)

**Standup Order:**
1. Alex (Tech Lead)
2. Jordan (Frontend Lead)
3. Sam (DevOps)
4. Morgan (Backend Dev)
5. Taylor (Backend Dev)
6. [Frontend Dev 2]

---

## 10. Sprint Review Preparation

**Date:** 2025-12-13
**Time:** 02:00 PM - 03:00 PM
**Duration:** 1 hour
**Attendees:** Team, Product Owner (Sarah), Stakeholders (PLT members)

**Demo Checklist:**
- [ ] Login flow functional (Login UI → Auth → Protected routes)
- [ ] RBAC working (different roles see different content)
- [ ] Task creation API functional (Postman/UI demo)
- [ ] Contact creation API functional
- [ ] Staging environment accessible

**Features to Demo:**

1. **Authentication Flow** (Jordan) - 15 min
   - Show login form (validation, error states)
   - Demonstrate protected routes (redirect if not logged in)
   - Show logout functionality
   - Demonstrate token refresh (inspect network tab)

2. **RBAC Implementation** (Alex) - 10 min
   - Log in as different roles (Admin, Acquisitions, Servicing)
   - Show role-based route access
   - Demonstrate permission middleware in API

3. **Task Management API** (Morgan) - 10 min
   - Create task via Postman/API client
   - Show validation errors for invalid data
   - Demonstrate assignee types (User vs Contact)

4. **Contact Management API** (Taylor) - 10 min
   - Create contact via Postman/API client
   - Show email/phone validation
   - Retrieve contact by ID

5. **Staging Environment** (Sam) - 5 min
   - Show staging URL accessible
   - Demonstrate auto-deployment on merge
   - Show environment configuration

**Q&A / Feedback** - 10 min

---

## 11. Sprint Retrospective Format

**Date:** 2025-12-13
**Time:** 03:30 PM - 04:30 PM
**Duration:** 1 hour
**Format:** Start/Stop/Continue

**Retrospective Questions:**
1. What went well this sprint?
2. What didn't go well?
3. What should we start doing?
4. What should we stop doing?
5. What should we continue doing?

**Action Items** (from Sprint 1 retro):
- [ ] Improve task acceptance criteria detail level
- [ ] Add Docker troubleshooting documentation

**Topics to Discuss:**
- Was RBAC implementation smoother than expected?
- Did parallel API development (E8/E11) work well?
- Is staging environment deployment process clear?
- Are we ready for feature development in Sprint 3?

---

## 12. Success Metrics

### 12.1 Sprint Completion Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Committed Points | 42 | [Fill at sprint end] | [Fill at sprint end] |
| Completed Points | 42 | [Fill at sprint end] | [Fill at sprint end] |
| Velocity % | ≥ 90% | [%] | [Fill at sprint end] |
| Carryover Points | 0 | [#] | [Fill at sprint end] |

### 12.2 Quality Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Test Coverage | ≥ 80% | [%] | [Fill at sprint end] |
| Bugs Introduced | ≤ 5 | [#] | [Fill at sprint end] |
| Critical Bugs | 0 | [#] | [Fill at sprint end] |
| Code Review Time | < 4 hours | [hours] | [Fill at sprint end] |
| PR Merge Time | < 24 hours | [hours] | [Fill at sprint end] |

### 12.3 Project Health Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Sprint Goal Achieved | Yes | [Yes/No] | [Fill at sprint end] |
| Team Morale | ≥ 4/5 | [#/5] | [Fill at sprint end] |
| Blockers Resolved | 100% | [%] | [Fill at sprint end] |
| Stakeholder Satisfaction | ≥ 4/5 | [#/5] | [Fill at sprint end] |

---

## 13. Notes & Action Items

### 13.1 Planning Session Notes

**Decisions Made:**
- **RBAC Library:** Use CASL.js for flexible role-based access control
  - Rationale: Well-documented, TypeScript support, integrates with React
- **Email Service:** SendGrid for transactional emails
  - Rationale: Free tier sufficient for MVP, good deliverability
- **Staging Domain:** staging.connect2.blueprint.io
  - Rationale: Clear separation from production

**Open Questions:**
- [ ] External consultant notification flow: Email only or also in-app? - Sarah to clarify by Day 3
- [ ] Contact deduplication priority: Hard block on duplicate emails or warning? - Sarah to clarify by Day 5

### 13.2 Action Items

| Action Item | Owner | Due Date | Status |
|-------------|-------|----------|--------|
| Verify Sprint 1 carryover tasks complete | Alex | Day 1 | [ ] |
| Set up SendGrid account and API keys | Sam | Day 3 | [ ] |
| Review RBAC role definitions with Product | Sarah | Day 2 | [ ] |
| Create staging deployment runbook | Sam | Day 5 | [ ] |
| Document Task/Contact API contracts | Morgan/Taylor | Day 2 | [ ] |
| Schedule mid-sprint checkpoint | Alex | Day 5 | [ ] |

---

## 14. Sprint Burndown Chart

**Track daily progress** (update at end of each day):

| Day | Date | Remaining Points | Ideal Burndown | Notes |
|-----|------|------------------|----------------|-------|
| 1 | 2025-12-02 | 42 | 42 | Sprint start |
| 2 | 2025-12-03 | 39 | 38 | E11-T1, E3-T6 in progress |
| 3 | 2025-12-04 | 34 | 34 | E3-T7, E8-T1 started |
| 4 | 2025-12-05 | 28 | 29 | E3-T7, E3-T8 completed |
| 5 | 2025-12-06 | 22 | 25 | Mid-sprint checkpoint |
| 6 | 2025-12-09 | 17 | 21 | E8 tasks progressing |
| 7 | 2025-12-10 | 12 | 17 | E11 APIs functional |
| 8 | 2025-12-11 | 8 | 13 | E15-T3 started |
| 9 | 2025-12-12 | 4 | 8 | Tests and integration |
| 10 | 2025-12-13 | 0 | 0 | Sprint end |

**Ideal Burndown Formula:**
```
Ideal Remaining (Day N) = 42 × (10 - N) / 10
```

**Burndown Visualization:**
```
45 |●
40 |  ●
35 |    ●
30 |      ●
25 |        ●
20 |          ●
15 |            ●
10 |              ●
 5 |                ●
 0 |__________________●
   1  2  3  4  5  6  7  8  9  10
   Days
```

---

## 15. Lessons Learned (Fill at Sprint End)

### 15.1 What Worked Well
- [Fill after Sprint Review]
- [Fill after Sprint Review]

### 15.2 What Needs Improvement
- [Fill after Sprint Retrospective]
- [Fill after Sprint Retrospective]

### 15.3 Adjustments for Next Sprint
- [ ] [Adjustment based on Sprint 2 learnings]
- [ ] [Adjustment based on Sprint 2 learnings]

---

## Appendix A: RBAC Role Definitions

### Role Hierarchy

| Role | Access Level | Modules |
|------|--------------|---------|
| **ADMIN** | Full system access | All modules, settings, user management |
| **ACQUISITIONS** | Lead/Project management | Leads, Projects, Feasibility, Contacts |
| **DESIGN** | Design & Entitlement | Projects (read), Entitlement, Documents |
| **ENTITLEMENT** | Permit coordination | Projects (read), Entitlement, Tasks, Contacts |
| **SERVICING** | Loan management | Loans, Draws, Contacts, Documents |
| **MANAGER** | Team oversight | Team's data + dashboards/reports |

### Permission Matrix (MVP)

| Permission | ADMIN | MANAGER | ACQUISITIONS | SERVICING | DESIGN |
|------------|-------|---------|--------------|-----------|--------|
| users:manage | ✅ | ❌ | ❌ | ❌ | ❌ |
| projects:create | ✅ | ✅ | ✅ | ❌ | ❌ |
| projects:read | ✅ | ✅ | ✅ | ✅ | ✅ |
| projects:update | ✅ | ✅ | ✅ | ❌ | ❌ |
| loans:create | ✅ | ✅ | ✅ | ✅ | ❌ |
| loans:read | ✅ | ✅ | ✅ | ✅ | ❌ |
| contacts:manage | ✅ | ✅ | ✅ | ✅ | ✅ |
| tasks:manage | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Appendix B: API Contracts (Sprint 2)

### POST /api/v1/tasks

**Request:**
```json
{
  "title": "Complete arborist report",
  "description": "Review and approve arborist report for 123 Main St project",
  "due_date": "2025-12-15",
  "priority": "HIGH",
  "assignee_type": "CONTACT",
  "assignee_id": "uuid-contact-123",
  "project_id": "uuid-project-456"
}
```

**Response (201):**
```json
{
  "id": "uuid-task-789",
  "title": "Complete arborist report",
  "status": "PENDING",
  "created_at": "2025-12-02T10:30:00Z",
  "created_by": "uuid-user-001"
}
```

### POST /api/v1/contacts

**Request:**
```json
{
  "type": "CONSULTANT",
  "first_name": "John",
  "last_name": "Smith",
  "company_name": "ABC Arborists",
  "email": "john@abcarborists.com",
  "phone": "+12065551234",
  "address": {
    "street": "123 Tree Lane",
    "city": "Seattle",
    "state": "WA",
    "zip": "98101"
  }
}
```

**Response (201):**
```json
{
  "id": "uuid-contact-123",
  "type": "CONSULTANT",
  "first_name": "John",
  "last_name": "Smith",
  "email": "john@abcarborists.com",
  "created_at": "2025-12-02T10:30:00Z"
}
```

---

## Appendix C: Key Resources

**Documentation:**
- [Product Requirements Document](../../PRODUCT_REQUIREMENTS_DOCUMENT.md)
- [Database Schema](../technical/DATABASE_SCHEMA.md)
- [API Specification](../technical/API_SPECIFICATION.md)
- [Task Management Epic](../planning/backlogs/EPIC_E8_TASK_MANAGEMENT.md)
- [Contact Management Epic](../planning/backlogs/EPIC_E11_CONTACT_MANAGEMENT.md)
- [Sprint 1 Plan](SPRINT_01_PLAN.md)

**Tools:**
- GitHub Repository: [URL]
- Project Board: [URL]
- Slack Channel: #connect2-dev
- CI/CD: GitHub Actions
- Staging URL: staging.connect2.blueprint.io (after E15-T3)

**Meetings:**
- Daily Standup: 09:30 AM daily
- Mid-Sprint Checkpoint: Friday 12/06, 02:00 PM
- Sprint Review: Friday 12/13, 02:00 PM
- Sprint Retrospective: Friday 12/13, 03:30 PM

---

**Document Version:** 1.0
**Last Updated:** 2025-12-01
**Sprint Status:** Planning Complete - Ready to Start
**Next Sprint Planning:** 2025-12-16 (Sprint 3)
