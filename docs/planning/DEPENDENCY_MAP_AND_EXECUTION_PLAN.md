# Connect 2.0 - Dependency Map & Execution Plan

**Version:** 1.0
**Created:** November 6, 2025
**Status:** Ready for Review
**Purpose:** Master dependency map, critical path analysis, and sprint-by-sprint execution plan

---

## Executive Summary

This document provides a comprehensive view of task dependencies, critical path analysis, and execution sequencing for the Connect 2.0 MVP (Days 1-180). It integrates all epic backlogs into a coordinated execution plan.

### Key Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| **Total Story Points (Phase 1)** | 659 points | Days 1-90 MVP |
| **Critical Path Duration** | ~18 weeks | With 6 developers |
| **Foundation Phase** | 136 points | Days 1-30 (must complete first) |
| **Parallel Workstreams** | 3-4 streams | Maximum team utilization |
| **Decision Gates** | 4 gates | Days 7, 14, 30, 90 |

---

## Table of Contents

1. [Epic Dependency Matrix](#1-epic-dependency-matrix)
2. [Critical Path Analysis](#2-critical-path-analysis)
3. [Task-Level Dependencies](#3-task-level-dependencies)
4. [Sprint-by-Sprint Execution Plan](#4-sprint-by-sprint-execution-plan)
5. [Resource Allocation Strategy](#5-resource-allocation-strategy)
6. [Parallelization Opportunities](#6-parallelization-opportunities)
7. [Risk Mitigation](#7-risk-mitigation)
8. [Decision Gates & Blockers](#8-decision-gates--blockers)

---

## 1. Epic Dependency Matrix

### 1.1 Foundation Layer (Days 1-30)

These epics **MUST** complete before any feature work can begin:

```
┌─────────────────────────────────────────────────────────────────┐
│                    FOUNDATION LAYER (136 pts)                    │
│                                                                   │
│  E1: Foundation      E2: Core Data         E3: Auth              │
│  & Setup            Model                  & Authorization       │
│  (20 pts)           (34 pts)               (38 pts)              │
│                                                                   │
│  ├─ Tech Stack      ├─ PostgreSQL         ├─ JWT Auth           │
│  ├─ GitHub Repo     ├─ ORM Setup          ├─ RBAC               │
│  ├─ Docker Dev      ├─ Migrations         ├─ Login UI           │
│  └─ CI/CD Base      └─ All Tables         └─ Protected Routes   │
│                                                                   │
│  E8: Task Management (Core) - 44 pts                             │
│  ├─ BLOCKS: E5 (Feasibility consultant tasks)                    │
│  ├─ BLOCKS: E6 (Entitlement consultant coordination)             │
│  └─ Required for: All workflow automation                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
             │                     │                     │
             ▼                     ▼                     ▼
         ALL FEATURE EPICS DEPEND ON FOUNDATION
```

**Critical Finding:** E8 (Task Management) is a **critical blocker** for E5 and E6. Must prioritize in Weeks 3-4.

---

### 1.2 Phase 1 Feature Dependencies (Days 30-90)

```
Foundation Complete (Day 30)
    │
    ├──────────────────────────────────────────────────────────┐
    │                                                            │
    ▼                                                            ▼
E11: Contact Mgmt (67 pts)                          E12: BPO Integration (34 pts)
    │                                                            │
    ├─ BLOCKS: E4 (agent/builder assignment)                    │
    ├─ BLOCKS: E5 (consultant selection)                        │
    ├─ BLOCKS: E9 (borrower/guarantor mgmt)                     │
    │                                                            │
    ▼                                                            ▼
E4: Lead & Project (88 pts) ──────────────┐         E6: Entitlement (69 pts)
    │                                      │             │
    ├─ BLOCKS: E5 (project records)       │             │
    ├─ BLOCKS: E6 (project records)       │             │
    │                                      │             │
    ▼                                      ▼             ▼
E5: Feasibility (121 pts)          E7: Documents (88 pts)
    │                                      │
    └──────────────┬───────────────────────┘
                   │
                   ▼
          E13: External Integrations (56 pts)
          ├─ Email (E13-T8 to T14): 21 pts
          ├─ DocuSign (E13-T1 to T7): 23 pts
          └─ SMS (E13-T15 to T19): 12 pts
```

**Parallel Workstreams:**
- **Stream 1 (Backend Focus):** E11 → E4 → E5
- **Stream 2 (Feature Focus):** E12 → E6 → E7
- **Stream 3 (Integration):** E13 (can run parallel)

---

### 1.3 Phase 2 Feature Dependencies (Days 91-180)

```
Phase 1 Complete (Day 90)
    │
    ├────────────────────────────────────┐
    │                                    │
    ▼                                    ▼
E9: Lending Module (85 pts)      E10: Servicing Module (89 pts)
    │                                    │
    ├─ Requires: E4 (projects)          ├─ Requires: E9 (loans)
    ├─ Requires: E11 (borrowers)        ├─ Requires: iPad API
    │                                    └─ Requires: E7 (documents)
    │
    ▼
E14: Analytics (62 pts)
    │
    └─ Requires: ALL Phase 1 data
```

---

### 1.4 Infrastructure (Parallel - Days 1-180)

```
E15: DevOps & Infrastructure (63 pts)
├─ Sprint 1-2: CI/CD, Staging/Prod Environments
├─ Sprint 3-4: Monitoring, Logging, Alerting
├─ Sprint 5-6: Backup, Redis Cache, Health Checks
└─ Ongoing: Infrastructure as Code, Runbooks

RUNS IN PARALLEL WITH ALL FEATURE WORK
```

---

## 2. Critical Path Analysis

### 2.1 Critical Path Identification

The **longest path** through the dependency graph determines the minimum timeline:

```
E1 (Foundation) → E2 (Data Model) → E3 (Auth) → E8 (Tasks) →
E11 (Contacts) → E4 (Projects) → E5 (Feasibility) → E6 (Entitlement)
```

**Critical Path Duration:**
- E1: 4 weeks (20 pts ÷ 5 pts/week = 4 weeks with 1 dev)
- E2: 7 weeks (34 pts ÷ 5 pts/week = 6.8 weeks)
- E3: 7 weeks (38 pts ÷ 5 pts/week = 7.6 weeks)
- E8: 9 weeks (44 pts ÷ 5 pts/week = 8.8 weeks)
- E11: 13 weeks (67 pts ÷ 5 pts/week = 13.4 weeks)
- E4: 18 weeks (88 pts ÷ 5 pts/week = 17.6 weeks)
- E5: 24 weeks (121 pts ÷ 5 pts/week = 24.2 weeks)

**Total Serial Duration:** ~82 weeks (16 months) **IF DONE SEQUENTIALLY** ❌

**With Parallelization (6 devs, 3 streams):**
- **Foundation (Weeks 1-4):** E1 + E2 + E3 in parallel = ~4 weeks
- **E8 (Weeks 3-5):** Task Management = ~3 weeks (overlaps with Foundation)
- **Phase 1 Features (Weeks 5-12):** E4, E5, E6, E7, E11, E12, E13 in parallel = ~8 weeks
- **Buffer & Testing (Weeks 12-13):** Integration testing, bug fixes = ~1 week

**Total Parallelized Duration:** ~**13 weeks (90 days)** ✅

---

### 2.2 Critical Path Bottlenecks

| Bottleneck | Impact | Mitigation |
|------------|--------|------------|
| **E8 (Task Management) delay** | Blocks E5 consultant workflows | Start E8 by Week 3; dedicate 1 senior dev |
| **E11 (Contacts) incomplete** | Blocks E4, E5 contact pickers | Prioritize Contact CRUD (32 pts) first |
| **E2 (Data Model) errors** | Blocks ALL features | Thorough testing; schema review before merge |
| **BPO integration complexity** | Blocks E6 data flow | Decision gate Day 14; fallback to batch import |
| **E13 (Email) not ready** | Blocks notifications across all features | Start E13 early (Week 2-3) |

---

## 3. Task-Level Dependencies

### 3.1 Cross-Epic Task Dependencies

#### Example: E5 (Feasibility) depends on E4, E8, E11

```
E5-T13: "Order consultant reports" API
    ├─ Depends on: E4-T1 (projects table exists)
    ├─ Depends on: E8-T1 (tasks API exists)
    ├─ Depends on: E11-T1 (contacts table exists)
    └─ Depends on: E11-T13 (contacts list API for consultant dropdown)

Resolution Order:
1. E4-T1, E8-T1, E11-T1 (database tables) - Sprint 2
2. E11-T13 (contacts list API) - Sprint 3
3. E8-T1 (tasks API) - Sprint 3
4. E5-T13 (order reports API) - Sprint 4
```

#### Example: E6 (Entitlement) depends on E4, E8, E7

```
E6-T3: "Create entitlement" API
    ├─ Depends on: E4-T1 (projects table)
    ├─ Depends on: E6-T1 (entitlement table)
    └─ Depends on: E3-T5 (auth middleware)

E6-T7: "Entitlement Detail UI"
    ├─ Depends on: E6-T3 (API endpoint)
    ├─ Depends on: E6-T4 (GET entitlement API)
    ├─ Depends on: E7-T7 (document list component - reusable)
    └─ Depends on: E8-T14 (task list component - reusable)

Resolution Order:
1. E4-T1, E6-T1 (tables) - Sprint 2
2. E6-T3, E6-T4 (APIs) - Sprint 3
3. E7-T7, E8-T14 (reusable components) - Sprint 4
4. E6-T7 (Entitlement UI) - Sprint 5
```

---

### 3.2 Task Dependency Graph (Simplified)

```
Foundation Tasks (Sprint 1-2):
E1-T1 → E1-T2 → E1-T3 (Tech stack decisions)
    └────────────┐
                 ▼
E1-T4 → E1-T5 → E1-T6 → E1-T7 (Repo setup, Docker)
                 │
                 ▼
E2-T1 → E2-T2 → E2-T3 (Database setup)
    │
    ├─→ E2-T4 (users table) → E3-T1 → E3-T2 → E3-T3 (Auth)
    ├─→ E2-T5 (contacts table) → E11-T2 → E11-T13
    ├─→ E2-T8 (projects table) → E4-T2 → E4-T10
    ├─→ E2-T9 (tasks table) → E8-T1 → E8-T10
    └─→ E2-T10 (indexes)

Feature Tasks (Sprint 3-6):
E4-T2 (Create project API) → E5-T2 (Create feasibility API)
E11-T13 (List contacts API) → E5-T16 (Consultant dropdown)
E8-T1 (Create task API) → E5-T14 (Create tasks for reports)
E7-T3 (Upload document API) → E6-T7 (Document list in entitlement)
```

---

## 4. Sprint-by-Sprint Execution Plan

### Team Assumptions
- **6 Developers:** 2 Senior, 2 Mid, 2 Junior
- **Velocity:** 75 points/sprint (2 weeks)
- **Sprints:** 6 sprints = 12 weeks = ~90 days

---

### Sprint 0 (Pre-Kickoff, Days -7 to 0)

**Goals:**
- Finalize tech stack decisions
- Set up infrastructure prerequisites
- Onboard team

**Tasks:**
- E1-T1: Backend language decision (Node.js/Python) - **Leadership Decision**
- E1-T2: Frontend framework decision (React/Vue) - **Leadership Decision**
- E1-T3: Cloud provider decision (AWS/Azure/GCP) - **Leadership Decision**
- E1-T4: GitHub repo setup
- Hire/onboard developers (if not yet complete)

**Deliverables:**
- ✅ Tech stack finalized
- ✅ GitHub repo ready
- ✅ Team onboarded

**Decision Gate:** Day 7 - Tech Stack Locked

---

### Sprint 1 (Weeks 1-2, Days 1-14)

**Theme:** Foundation & Infrastructure Setup
**Points Target:** 75 points
**Team Structure:** 6 devs working on parallel foundation tasks

#### Assigned Tasks

| Epic | Tasks | Points | Assigned To |
|------|-------|--------|-------------|
| **E1** | T5, T6, T7, T8, T9, T10 | 18 pts | Dev 1 (Senior) + Dev 2 (Mid) |
| **E2** | T1, T2, T3, T4, T5, T6, T7, T8 | 21 pts | Dev 3 (Senior) + Dev 4 (Mid) |
| **E3** | T1, T2, T3, T4, T5 | 16 pts | Dev 5 (Mid) + Dev 6 (Junior) |
| **E15** | T1, T2, T9 (CI/CD basics) | 13 pts | Dev 1 (parallel) |
| **T-T** | T1, T2, T3 (Test framework) | 7 pts | Dev 6 (parallel) |

**Total:** 75 points

**Deliverables:**
- ✅ Backend + Frontend projects initialized
- ✅ Docker Compose working locally
- ✅ PostgreSQL + migrations set up
- ✅ All core tables created (users, contacts, projects, tasks)
- ✅ JWT authentication working
- ✅ CI/CD pipeline running tests

**Decision Gate:** Day 14 - BPO Integration Approach Confirmed

---

### Sprint 2 (Weeks 3-4, Days 15-28)

**Theme:** Core Data Model + Task Management
**Points Target:** 75 points
**Focus:** Complete foundation, begin E8 (critical for E5/E6)

#### Assigned Tasks

| Epic | Tasks | Points | Assigned To |
|------|-------|--------|-------------|
| **E2** | T9, T10, T11, T12 (Remaining tables, indexes) | 13 pts | Dev 3 + Dev 4 |
| **E3** | T6, T7, T8, T9, T10, T11, T12 (RBAC, UI, tests) | 22 pts | Dev 5 + Dev 6 |
| **E8** | T1, T2, T3, T4, T5, T6, T8 (Task CRUD core) | 17 pts | Dev 1 (Senior) |
| **E11** | T1, T2, T3, T4, T5, T6 (Contact CRUD core) | 14 pts | Dev 2 (Mid) |
| **E13** | T8, T9, T10 (Email service setup) | 6 pts | Dev 4 (parallel) |
| **E15** | T3, T4 (Staging/prod environments) | 16 pts | DevOps (external or Dev 1) |

**Total:** 88 points (slightly over, adjust as needed)

**Deliverables:**
- ✅ Task Management API functional
- ✅ Contact Management API functional
- ✅ RBAC fully implemented
- ✅ Email service integrated
- ✅ Staging environment live

**Decision Gate:** Day 30 - Core Data Model Complete, Phase 1 Scope Locked

---

### Sprint 3 (Weeks 5-6, Days 29-42)

**Theme:** Lead/Project Management + Document Management
**Points Target:** 75 points
**Parallel Workstreams:** 3 streams

#### Assigned Tasks

| Epic | Tasks | Points | Stream | Assigned To |
|------|-------|--------|--------|-------------|
| **E4** | T1, T2, T3, T4, T5, T6, T7, T8 (Lead intake) | 23 pts | Stream 1 | Dev 1 + Dev 2 |
| **E11** | T7, T8, T9, T10, T11, T12 (Contact UI + tests) | 18 pts | Stream 1 | Dev 2 (parallel) |
| **E7** | T1, T2, T3, T4, T5, T6 (Document upload core) | 20 pts | Stream 2 | Dev 3 + Dev 4 |
| **E12** | T1, T2, T3 or T4 (BPO integration) | 10 pts | Stream 3 | Dev 5 |
| **E8** | T9, T10, T11, T12, T14 (Task list views) | 13 pts | Stream 3 | Dev 6 |

**Total:** 84 points (slightly over, adjust as needed)

**Deliverables:**
- ✅ Lead submission working (E4)
- ✅ Contact management UI complete (E11)
- ✅ Document upload functional (E7)
- ✅ BPO integration approach decided (E12)
- ✅ Task list views working (E8)

---

### Sprint 4 (Weeks 7-8, Days 43-56)

**Theme:** Feasibility Module + Entitlement Setup
**Points Target:** 75 points

#### Assigned Tasks

| Epic | Tasks | Points | Stream | Assigned To |
|------|-------|--------|--------|-------------|
| **E5** | T1-T12 (Proforma management) | 37 pts | Stream 1 | Dev 1 + Dev 2 + Dev 6 |
| **E6** | T1, T2, T3, T4, T5 (Entitlement core APIs) | 14 pts | Stream 2 | Dev 3 |
| **E7** | T7, T8, T9, T10, T11, T12 (Document UI + tests) | 19 pts | Stream 2 | Dev 4 |
| **E13** | T11, T12, T13, T14 (Email templates, queue) | 13 pts | Stream 3 | Dev 5 |

**Total:** 83 points

**Deliverables:**
- ✅ Proforma creation and editing functional (E5)
- ✅ Entitlement records can be created (E6)
- ✅ Document upload UI complete (E7)
- ✅ Email notifications working (E13)

---

### Sprint 5 (Weeks 9-10, Days 57-70)

**Theme:** Feasibility Consultant Workflows + Entitlement UI
**Points Target:** 75 points

#### Assigned Tasks

| Epic | Tasks | Points | Stream | Assigned To |
|------|-------|--------|--------|-------------|
| **E5** | T13-T24 (Consultant ordering) | 42 pts | Stream 1 | Dev 1 + Dev 2 + Dev 5 |
| **E6** | T6-T12 (Corrections, timeline, tests) | 20 pts | Stream 2 | Dev 3 + Dev 6 |
| **E4** | T10-T16 (Project list, filters) | 20 pts | Stream 2 | Dev 4 |
| **E12** | T5, T6, T7, T8 (BPO sync) | 16 pts | Stream 3 | Dev 5 (parallel) |

**Total:** 98 points (over budget - defer E12-T7, T8 to Sprint 6)

**Adjusted Total:** 82 points

**Deliverables:**
- ✅ Consultant report ordering functional (E5)
- ✅ Entitlement UI complete with corrections tracking (E6)
- ✅ Project list and filtering working (E4)
- ✅ BPO sync operational (E12)

---

### Sprint 6 (Weeks 11-12, Days 71-84)

**Theme:** Integration, Polish, and Testing
**Points Target:** 75 points

#### Assigned Tasks

| Epic | Tasks | Points | Stream | Assigned To |
|------|-------|--------|--------|-------------|
| **E5** | T35-T47 (Viability decision workflow) | 42 pts | Stream 1 | Dev 1 + Dev 2 + Dev 3 |
| **E4** | T17-T23 (Project detail view) | 21 pts | Stream 2 | Dev 4 + Dev 6 |
| **E6** | T13-T22 (Plan library) | 32 pts | Stream 2 | Dev 5 |
| **E7** | T13-T22 (AI document extraction - optional) | 46 pts | Defer to Phase 2 | — |
| **E13** | T1-T7 (DocuSign integration) | 23 pts | Stream 3 | Dev 1 (partial) |
| **Testing** | T-T9 (E2E critical user journey) | 8 pts | All devs | All |

**Total:** 126 points (over budget)

**Adjusted (Defer DocuSign + AI):**
- E5: 42 pts
- E4: 21 pts
- Testing: 8 pts
- **Total:** 71 pts

**Deliverables:**
- ✅ Feasibility go/pass decision workflow complete (E5)
- ✅ Project detail view complete (E4)
- ✅ Plan library functional (E6)
- ✅ Critical E2E tests passing
- ✅ **MVP READY FOR DAY 90 PILOT LAUNCH**

**Decision Gate:** Day 90 - Phase 1 Pilot Launch

---

### Sprint 7-12 (Weeks 13-24, Days 85-180)

**Theme:** Phase 2 - Lending & Servicing Modules

#### High-Level Breakdown

| Sprint | Focus | Epics | Points |
|--------|-------|-------|--------|
| Sprint 7 | Loan origination setup | E9: T1-T12 | 52 pts |
| Sprint 8 | Loan approval/funding + Draw setup | E9: T13-T21, E10: T1-T3 | 42 pts |
| Sprint 9 | Draw management | E10: T4-T12 | 53 pts |
| Sprint 10 | iPad integration + Analytics setup | E10: T13-T20, E14: T1-T5 | 44 pts |
| Sprint 11 | Analytics dashboards | E14: T6-T18 | 62 pts |
| Sprint 12 | Polish, testing, documentation | Testing, Docs | 30 pts |

**Total Phase 2:** ~283 points

---

## 5. Resource Allocation Strategy

### 5.1 Team Composition (Recommended)

| Role | Count | Primary Responsibilities |
|------|-------|-------------------------|
| **Senior Backend Dev** | 2 | E2, E3, E8, E5 (complex business logic) |
| **Mid-Level Full-Stack Dev** | 2 | E4, E6, E7, E11 (CRUD + UI) |
| **Junior Frontend Dev** | 1 | UI components, testing |
| **Mid-Level Backend Dev** | 1 | E12, E13 (integrations) |
| **DevOps Engineer** | 0.5 FTE | E15 (infrastructure - shared resource) |

**Total:** 6.5 FTEs

---

### 5.2 Skill-to-Task Mapping

#### Senior Backend Developers
- **Dev 1 (Senior):**
  - Sprint 1-2: E1, E2 (database, ORM)
  - Sprint 3-4: E4, E5 (complex APIs)
  - Sprint 5-6: E5, E9 (business logic)

- **Dev 2 (Senior):**
  - Sprint 1-2: E3 (auth, RBAC)
  - Sprint 3-4: E8, E11 (task/contact mgmt)
  - Sprint 5-6: E5 (feasibility logic)

#### Mid-Level Full-Stack Developers
- **Dev 3 (Mid-Full-Stack):**
  - Sprint 1-2: E2 (data model)
  - Sprint 3-4: E7 (documents backend)
  - Sprint 5-6: E6 (entitlement backend)

- **Dev 4 (Mid-Full-Stack):**
  - Sprint 1-2: E2 (data model)
  - Sprint 3-4: E7 (documents frontend)
  - Sprint 5-6: E4 (project frontend)

#### Junior/Mid Frontend Developer
- **Dev 5 (Mid-Backend):**
  - Sprint 1-2: E3 (auth UI)
  - Sprint 3-4: E12 (BPO integration)
  - Sprint 5-6: E5, E6 (feasibility/entitlement)

- **Dev 6 (Junior Frontend):**
  - Sprint 1-2: Testing setup, E3 (UI)
  - Sprint 3-4: E8 (task UI)
  - Sprint 5-6: E4 (project UI)

---

## 6. Parallelization Opportunities

### 6.1 Maximum Parallel Workstreams

**Weeks 1-4 (Foundation):**
- ✅ Stream 1: E1 + E2 (Backend setup, database)
- ✅ Stream 2: E3 (Authentication)
- ✅ Stream 3: E15 (DevOps)
- ✅ Stream 4: Testing setup
- **Max Parallelism:** 4 streams

**Weeks 5-8 (Features):**
- ✅ Stream 1: E4 (Lead/Project) + E11 (Contacts)
- ✅ Stream 2: E7 (Documents) + E6 (Entitlement backend)
- ✅ Stream 3: E12 (BPO) + E8 (Tasks UI)
- ✅ Stream 4: E13 (Email integration)
- **Max Parallelism:** 4 streams

**Weeks 9-12 (Integration):**
- ✅ Stream 1: E5 (Feasibility workflows)
- ✅ Stream 2: E6 (Entitlement UI) + E4 (Project detail)
- ✅ Stream 3: E13 (DocuSign), Testing
- **Max Parallelism:** 3 streams

---

### 6.2 Independent Work Packages

These can be worked on **anytime** without blocking other work:

| Package | Epics/Tasks | Points | Notes |
|---------|-------------|--------|-------|
| **Email Integration** | E13-T8 to T14 | 21 pts | Standalone, widely useful |
| **Document Upload** | E7-T1 to T12 | 42 pts | No dependencies after E2 |
| **BPO Investigation** | E12-T1 to T2 | 5 pts | Can start Day 1 |
| **Testing Framework** | T-T1 to T6 | 17 pts | Parallel with all work |
| **DevOps** | E15 (most tasks) | 63 pts | Parallel infrastructure |

---

## 7. Risk Mitigation

### 7.1 Dependency Risk Matrix

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **E8 (Tasks) delayed** | Medium | High | Allocate senior dev; start Week 3; daily check-ins |
| **E11 (Contacts) incomplete** | Low | High | Prioritize Contact CRUD (T1-T6) first; defer advanced features |
| **BPO integration failure** | Medium | Medium | Decision gate Day 14; fallback to batch import |
| **E2 schema errors** | Low | Critical | Mandatory schema review before merge; automated tests |
| **Team velocity < 75 pts/sprint** | Medium | High | Re-scope after Sprint 1; defer P1/P2 features |
| **Tech stack indecision** | Low | Critical | Force decision by Day 7; use defaults if needed |

---

### 7.2 Contingency Plans

#### If E8 (Task Management) Delays

**Trigger:** E8 not complete by end of Sprint 2 (Day 28)

**Impact:**
- E5-T13 (consultant ordering) blocked
- E6 (entitlement coordination) partially blocked

**Mitigation:**
1. Implement **temporary workaround:** Manual task creation (no API)
2. Defer E5-T13 to Sprint 5, use email-based consultant ordering
3. Add 1 additional developer to E8 in Sprint 3

---

#### If BPO Integration Fails

**Trigger:** E12-T1 investigation reveals no API access (Day 14)

**Impact:**
- E6 (entitlement) can't auto-create from BPO projects
- Manual project data entry required

**Mitigation:**
1. **Fallback:** Batch CSV import from BPO export
2. Build manual project creation form (E4-T4 already planned)
3. Defer auto-sync to Phase 2; nightly batch sync acceptable for MVP

---

## 8. Decision Gates & Blockers

### 8.1 Decision Gate Schedule

#### Gate 1: Tech Stack Finalized (Day 7)
**Must Decide:**
- ✅ Backend language (Node.js recommended)
- ✅ Frontend framework (React recommended)
- ✅ Cloud provider (Azure recommended for Document Intelligence)
- ✅ Database (PostgreSQL confirmed)

**Blocker if not met:** Cannot start E1-T5, E1-T6 (project initialization)

---

#### Gate 2: BPO Integration Approach (Day 14)
**Must Decide:**
- ✅ BPO API availability (E12-T1 investigation)
- ✅ Integration method: REST API, batch import, or manual entry
- ✅ Data mapping: BPO fields → Connect 2.0 projects table

**Blocker if not met:** E12 cannot proceed; E6 may be impacted

---

#### Gate 3: Core Data Model Complete (Day 30)
**Must Achieve:**
- ✅ All foundation epics complete (E1, E2, E3)
- ✅ E8 (Task Management) core complete
- ✅ All database tables created and tested
- ✅ CI/CD pipeline operational
- ✅ Staging environment live

**Blocker if not met:** No feature work can proceed; must re-scope or extend timeline

**Go/No-Go Decision:** Proceed with Phase 1 feature development

---

#### Gate 4: Phase 1 Pilot Launch (Day 90)
**Must Achieve:**
- ✅ Design & Entitlement MVP functional (E6)
- ✅ Feasibility module operational (E5)
- ✅ Document management working (E7)
- ✅ BPO integration live (E12)
- ✅ User acceptance testing complete
- ✅ Production deployment successful
- ✅ Pilot users trained

**Success Metrics:**
- WAU (Weekly Active Users) ≥ 70% by Week 12
- System uptime ≥ 99.5%
- Critical bug count < 5

**Go/No-Go Decision:** Proceed with Phase 2 (Days 91-180)

---

## 9. Implementation Checklist

### Week 1 (Days 1-7)
- [ ] **Day 1:** Team kickoff, tech stack decisions (E1-T1, T2, T3)
- [ ] **Day 2:** GitHub repo setup (E1-T4), begin Docker setup (E1-T7)
- [ ] **Day 3:** Initialize backend project (E1-T5)
- [ ] **Day 4:** Initialize frontend project (E1-T6)
- [ ] **Day 5:** PostgreSQL setup (E2-T1), ORM setup (E2-T2)
- [ ] **Day 6:** Begin table creation (E2-T4, T5, T8, T9)
- [ ] **Day 7:** **GATE 1: Tech Stack Review**

### Week 2 (Days 8-14)
- [ ] **Day 8:** Complete table creation (E2)
- [ ] **Day 9:** Begin JWT auth implementation (E3-T1, T2, T3)
- [ ] **Day 10:** CI/CD pipeline setup (E15-T1)
- [ ] **Day 11:** Login UI implementation (E3-T7)
- [ ] **Day 12:** BPO integration investigation (E12-T1)
- [ ] **Day 13:** Integration testing (E3-T11)
- [ ] **Day 14:** **GATE 2: BPO Integration Decision**

### Week 3 (Days 15-21)
- [ ] Begin E8 (Task Management)
- [ ] Begin E11 (Contact Management)
- [ ] Begin E13 (Email service)
- [ ] Staging environment deployment (E15-T3)

### Week 4 (Days 22-28)
- [ ] Complete E8 core (Task CRUD)
- [ ] Complete E11 core (Contact CRUD)
- [ ] Complete RBAC (E3-T6)
- [ ] E2E test framework setup (T-T3)

### Day 30 Decision Gate
- [ ] **GATE 3: Foundation Review**
- [ ] Demo to PLT
- [ ] Velocity assessment
- [ ] Scope confirmation for Phase 1

---

## 10. Success Metrics & Tracking

### 10.1 Sprint Velocity Tracking

Track **actual vs. planned** story points each sprint:

| Sprint | Planned | Actual | Variance | Notes |
|--------|---------|--------|----------|-------|
| Sprint 1 | 75 | _TBD_ | _TBD_ | Foundation sprint (may be slower) |
| Sprint 2 | 75 | _TBD_ | _TBD_ | |
| Sprint 3 | 75 | _TBD_ | _TBD_ | |
| Sprint 4 | 75 | _TBD_ | _TBD_ | |
| Sprint 5 | 75 | _TBD_ | _TBD_ | |
| Sprint 6 | 75 | _TBD_ | _TBD_ | MVP completion |

**Action Thresholds:**
- **Velocity < 60 points:** Re-scope immediately; defer P1/P2 features
- **Velocity 60-70 points:** Monitor closely; identify bottlenecks
- **Velocity 70-90 points:** On track
- **Velocity > 90 points:** Estimates may be too conservative; add scope

---

### 10.2 Dependency Completion Tracking

Track **blocker resolution** to ensure downstream work isn't delayed:

| Blocker Epic | Must Complete By | Status | Blocked Epics |
|--------------|------------------|--------|---------------|
| E1 (Foundation) | End of Sprint 1 | 🟡 In Progress | All epics |
| E2 (Data Model) | End of Sprint 2 | 🟡 In Progress | All epics |
| E3 (Auth) | End of Sprint 2 | 🟡 In Progress | All epics |
| E8 (Tasks) | End of Sprint 2 | ⚪ Not Started | E5, E6 |
| E11 (Contacts) | End of Sprint 3 | ⚪ Not Started | E4, E5 |

**Status Legend:**
- ⚪ Not Started
- 🟡 In Progress
- 🟢 Complete
- 🔴 Blocked/Delayed

---

## 11. Summary & Next Steps

### 11.1 Key Takeaways

1. **Critical Path:** E1 → E2 → E3 → E8 → E11 → E4 → E5 → E6 (13 weeks with parallelization)
2. **Critical Blocker:** E8 (Task Management) **must** complete by end of Sprint 2
3. **Parallelization:** 3-4 parallel workstreams maximize team efficiency
4. **Decision Gates:** Days 7, 14, 30, 90 are critical checkpoints
5. **Resource Allocation:** 6 developers + 0.5 DevOps = optimal for 90-day timeline

---

### 11.2 Immediate Actions (Week 1)

- [ ] **Day 1:** Hold kickoff meeting with all stakeholders
- [ ] **Day 1:** Make tech stack decisions (E1-T1, T2, T3)
- [ ] **Day 1-2:** Set up GitHub repo and project board
- [ ] **Day 2:** Assign developers to Sprint 1 tasks
- [ ] **Day 3:** Begin Sprint 1 development
- [ ] **Day 7:** **Gate 1 Review** - Tech stack confirmed
- [ ] **Day 14:** **Gate 2 Review** - BPO integration approach confirmed

---

### 11.3 Tools & Tracking

**Recommended Tools:**
- **GitHub Projects:** Kanban board for task tracking
- **GitHub Milestones:** Day 30, Day 90, Day 180 gates
- **GitHub Labels:** `epic:name`, `priority:P0`, `blocked`, `dependencies:E#`
- **Daily Standups:** Track progress, identify blockers
- **Weekly Velocity Reports:** Points completed, burndown charts

---

## Appendix A: Dependency Quick Reference

### Epic Dependency Cheat Sheet

```
NO DEPENDENCIES:
- E1 (Foundation) - START IMMEDIATELY
- E15 (DevOps) - PARALLEL WITH ALL

DEPENDS ON E2 (Data Model):
- E4, E5, E6, E7, E8, E9, E10, E11, E12, E14 (ALL FEATURES)

DEPENDS ON E3 (Auth):
- All API endpoints (must authenticate requests)

DEPENDS ON E8 (Task Management):
- E5 (Feasibility consultant tasks)
- E6 (Entitlement consultant coordination)

DEPENDS ON E11 (Contact Management):
- E4 (agent/builder assignment)
- E5 (consultant selection)
- E9 (borrower/guarantor management)

DEPENDS ON E4 (Project Management):
- E5 (Feasibility requires projects)
- E6 (Entitlement requires projects)

DEPENDS ON E7 (Documents):
- E5 (Feasibility documents)
- E6 (Entitlement documents)
- E10 (Inspection photos)

DEPENDS ON E9 (Lending):
- E10 (Servicing requires loans)
```

---

## Appendix B: Task ID Cross-Reference

For detailed task descriptions, reference these epic backlog documents:

- **E4:** [EPIC_E4_LEAD_PROJECT_MANAGEMENT.md](backlogs/EPIC_E4_LEAD_PROJECT_MANAGEMENT.md)
- **E5:** [EPIC_E5_FEASIBILITY_MODULE.md](backlogs/EPIC_E5_FEASIBILITY_MODULE.md)
- **E8:** [EPIC_E8_TASK_MANAGEMENT.md](backlogs/EPIC_E8_TASK_MANAGEMENT.md)
- **E11:** [EPIC_E11_CONTACT_MANAGEMENT.md](backlogs/EPIC_E11_CONTACT_MANAGEMENT.md)
- **E14:** [EPIC_E14_ANALYTICS_REPORTING.md](backlogs/EPIC_E14_ANALYTICS_REPORTING.md)
- **E6, E7, E9, E10, E12, E13:** [BACKLOG_CREATION_PLAN.md](BACKLOG_CREATION_PLAN.md)

---

**Document Status:** Ready for PLT Review
**Next Steps:** Review → Import to GitHub → Begin Sprint 1
**Last Updated:** November 6, 2025
