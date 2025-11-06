# Epic E5: Feasibility Module - Detailed Backlog

**Epic Owner:** Acquisitions Lead
**Target Phase:** Days 1-90 (MVP Phase 1)
**Created:** November 6, 2025
**Status:** Ready for Sprint Planning

---

## Epic Overview

**Full Scope:** 235 points
**P0 + P1 Scope:** 192 points
**MVP Core (P0 only):** 121 points
**Recommended MVP:** ~50 points (see phasing below)

The Feasibility Module manages the due diligence process including financial analysis (proforma), consultant report ordering, viability scoring, and go/pass decision-making.

**Business Value:**
- **-50% reduction** in feasibility packet assembly cycle time
- Automated consultant coordination
- AI-assisted document extraction
- Single source of truth (replaces SharePoint Site 1)

---

## Recommended MVP Phasing

### Phase 1A: Core Feasibility (Days 1-45) - 37 points
**Feature 1: Proforma Management** (E5-T1 to E5-T12)

### Phase 1B: Consultant Management (Days 30-60) - 42 points
**Feature 2: Consultant Report Ordering** (E5-T13 to E5-T24)

### Phase 1C: Decision Workflow (Days 45-75) - 42 points
**Feature 4: Viability Scoring & Decision** (E5-T35 to E5-T47)

**Deferred to Phase 2:**
- Feature 3: Report Tracking
- Feature 5: Packet Assembly (manual initially)
- Feature 6: Dashboard

---

## Feature 1: Proforma Management (PRIORITY: P0)

### User Story E5-US1
**As an** Acquisitions Specialist, **I need to** create and edit proformas with automatic ROI calculations, **so that** I can quickly assess project financial viability.

**Acceptance Criteria:**
- [ ] Create feasibility record linked to project
- [ ] Enter land cost, construction cost, soft costs, contingency
- [ ] System auto-calculates total cost, ARV, profit, and ROI
- [ ] Save and update proforma data
- [ ] View proforma history (changes over time)
- [ ] Display viability score (0-100) based on ROI

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E5-T1 | Create `feasibility` database table | DATABASE_SCHEMA.md lines 178-213 | 3 | P0 | E2 |
| E5-T2 | Implement POST `/projects/{id}/feasibility` API | API_SPECIFICATION.md lines 421-434 | 3 | P0 | E5-T1, E3 |
| E5-T3 | Implement GET `/projects/{id}/feasibility` API | API implicit | 2 | P0 | E5-T1 |
| E5-T4 | Implement PATCH `/feasibility/{id}` API | API patterns | 3 | P0 | E5-T1 |
| E5-T5 | Build proforma calculation engine (ROI, profit) | Business logic | 5 | P0 | E5-T2 |
| E5-T6 | Build Feasibility Detail page | SYSTEM_ARCHITECTURE.md | 5 | P0 | E5-T2, E5-T3 |
| E5-T7 | Build Proforma Edit form with real-time calculations | Frontend | 5 | P0 | E5-T4, E5-T5 |
| E5-T8 | Add proforma version history tracking | Database + API | 3 | P1 | E5-T4 |
| E5-T9 | Build proforma history view UI | Frontend | 2 | P2 | E5-T8 |
| E5-T10 | Unit tests for proforma calculation logic | TESTING_STRATEGY.md | 2 | P0 | E5-T5 |
| E5-T11 | API integration tests for feasibility endpoints | TESTING_STRATEGY.md | 2 | P0 | E5-T4 |
| E5-T12 | E2E test: Create feasibility → Edit proforma | TESTING_STRATEGY.md | 2 | P1 | E5-T7 |

**Subtotal:** 37 points

---

## Feature 2: Consultant Report Ordering (PRIORITY: P0)

### User Story E5-US2
**As an** Acquisitions Specialist, **I need to** order consultant reports and track their status, **so I can** manage due diligence timelines.

**Acceptance Criteria:**
- [ ] Select report types to order (survey, title, arborist)
- [ ] Assign consultant to each report type
- [ ] Set due dates for each report
- [ ] System creates tasks for each assignment
- [ ] Send email notification to consultants
- [ ] Track report status (Ordered → In Progress → Delivered)

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E5-T13 | Implement POST `/projects/{id}/feasibility/order-reports` | API lines 438-483 | 5 | P0 | E5-T1, E8 |
| E5-T14 | Create task records for each consultant report | DATABASE_SCHEMA.md | 3 | P0 | E5-T13, E8-T1 |
| E5-T15 | Build Consultant Report Ordering UI | SYSTEM_ARCHITECTURE.md | 5 | P0 | E5-T13 |
| E5-T16 | Implement consultant selection dropdown | Frontend + API | 3 | P0 | E11 |
| E5-T17 | Implement email notification service | INTEGRATION_SPEC section 6 | 5 | P1 | E13-T10 |
| E5-T18 | Build report tracking dashboard | Frontend | 5 | P0 | E5-T13, E8-T4 |
| E5-T19 | Add bulk ordering option | Business logic + UI | 3 | P1 | E5-T13 |
| E5-T20 | Add selective ordering option | Business logic + UI | 2 | P1 | E5-T13 |
| E5-T21 | Implement task status update webhook | API pattern | 3 | P2 | E5-T14 |
| E5-T22 | Unit tests for report ordering service | TESTING_STRATEGY.md | 2 | P0 | E5-T13 |
| E5-T23 | Integration tests for task creation | TESTING_STRATEGY.md | 3 | P1 | E5-T17 |
| E5-T24 | E2E test: Order reports → Track → Upload | TESTING_STRATEGY.md | 3 | P1 | E5-T18 |

**Subtotal:** 42 points

---

## Feature 4: Viability Scoring & Decision (PRIORITY: P0)

### User Story E5-US4
**As an** Acquisitions Specialist, **I need to** review feasibility data and make a GO/PASS decision, **so that** I can transition viable projects forward.

**Acceptance Criteria:**
- [ ] Display viability score (0-100) based on ROI
- [ ] Show summary of consultant reports
- [ ] Provide GO/PASS decision buttons
- [ ] Require decision notes
- [ ] Update project status to GO or PASS
- [ ] GO → create entitlement record; PASS → archive

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E5-T35 | Implement viability score calculation | Business logic | 5 | P1 | E5-T5 |
| E5-T36 | Store viability_score in feasibility table | DATABASE_SCHEMA.md | 1 | P1 | E5-T1 |
| E5-T37 | Implement POST `/feasibility/{id}/decision` API | API pattern | 3 | P0 | E5-T1 |
| E5-T38 | Build Decision UI (GO/PASS buttons + notes) | Frontend | 5 | P0 | E5-T6 |
| E5-T39 | Implement project status transition | Business logic | 3 | P0 | E5-T37, E4 |
| E5-T40 | Trigger entitlement record creation on GO | Workflow automation | 5 | P0 | E5-T39, E6-T1 |
| E5-T41 | Add decision notes validation (required) | Frontend + backend | 2 | P0 | E5-T37 |
| E5-T42 | Build viability score widget (gauge) | Frontend | 3 | P1 | E5-T35 |
| E5-T43 | Record go_decision_date and maker | Database + API | 2 | P0 | E5-T37 |
| E5-T44 | Send notification when GO decision made | Email integration | 2 | P1 | E13-T10 |
| E5-T45 | Unit tests for viability scoring | TESTING_STRATEGY.md | 3 | P1 | E5-T35 |
| E5-T46 | Integration tests for decision workflow | TESTING_STRATEGY.md | 3 | P0 | E5-T37 |
| E5-T47 | E2E test: Complete feasibility → GO → Verify entitlement | TESTING_STRATEGY.md | 5 | P1 | E5-T40 |

**Subtotal:** 42 points

---

## Deferred Features (Phase 2)

### Feature 3: Report Tracking (28 points)
- Tasks E5-T25 to E5-T34
- Use basic task list from E8 initially

### Feature 5: Feasibility Packet Assembly (43 points)
- Tasks E5-T48 to E5-T58
- Manual packet assembly acceptable for pilot

### Feature 6: Feasibility Dashboard (31 points)
- Tasks E5-T59 to E5-T68
- Use project list view initially

### Epic-Level Testing (12 points)
- Tasks E5-T69 to E5-T72

---

## Epic Summary

| Feature | Points | Priority | Phase |
|---------|--------|----------|-------|
| **Proforma Management** | 37 | P0 | Phase 1A |
| **Consultant Report Ordering** | 42 | P0 | Phase 1B |
| **Viability Scoring & Decision** | 42 | P0 | Phase 1C |
| **Report Tracking** | 28 | P1 | Phase 2 |
| **Packet Assembly** | 43 | P2 | Phase 2 |
| **Dashboard** | 31 | P1 | Phase 2 |
| **Testing** | 12 | P0/P1 | Ongoing |
| **TOTAL** | 235 | — | — |
| **MVP Total (P0 Features)** | 121 | — | Days 1-90 |

---

## Dependencies

**Critical Path:**
1. E2 (Core Data Model) - feasibility and tasks tables
2. E3 (Auth) - RBAC required
3. E4 (Projects) - Project record must exist
4. E6 (Entitlement) - GO decision triggers entitlement creation
5. E7 (Documents) - Consultant reports uploaded via document service
6. E8 (Tasks) - Task assignments for consultants
7. E11 (Contacts) - Consultant selection
8. E13 (Integrations) - Email notifications

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Viability scoring too simplistic | Medium | Start with ROI; iterate with feedback |
| PDF packet generation complex | Low | Mark P2; use manual assembly |
| Task management dependency delays | High | Prioritize E8 ahead of E5 |
| Consultant email low adoption | Medium | Provide manual task assignment fallback |

---

## Success Metrics (Day 90)

| Metric | Baseline | Target |
|--------|----------|--------|
| Feasibility cycle time | TBD | -50% |
| Consultant coordination time | ~30 min/project | < 5 min |
| Proforma creation time | ~15 min (spreadsheet) | < 2 min (UI) |
| User adoption | SharePoint | ≥70% by Week 12 |

---

## File References

- [API_SPECIFICATION.md](../technical/API_SPECIFICATION.md) lines 418-483
- [DATABASE_SCHEMA.md](../technical/DATABASE_SCHEMA.md) lines 178-260
- [INTEGRATION_SPECIFICATIONS.md](../technical/INTEGRATION_SPECIFICATIONS.md) section 6
- [TESTING_STRATEGY.md](../technical/TESTING_STRATEGY.md) sections 4-6
- [BACKLOG_CREATION_PLAN.md](BACKLOG_CREATION_PLAN.md) Epic E5 section

---

**Status:** Ready for Sprint Planning
**Next Steps:** Prioritize P0 tasks, create GitHub issues, sequence with E4 and E6
