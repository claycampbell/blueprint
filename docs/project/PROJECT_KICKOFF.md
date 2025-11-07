# Connect 2.0 - Project Kickoff Document

**Program:** Datapage Platform Program - Connect 2.0 Platform Rebuild Track
**Kickoff Date:** [TBD - Day 1]
**Target MVP Launch:** [Day 1 + 180 days]
**Version:** 1.0
**Date:** November 6, 2025

---

## 1. Project Overview

### 1.1 Mission Statement

**Build Connect 2.0, a unified, cloud-native platform that consolidates Blueprint's fragmented systems (BPO, Connect 1.0, SharePoint) into a single source of truth, delivering operational leverage through automation and AI while maintaining Blueprint's zero-default track record.**

Connect 2.0 will:
- **Unify operations** - Eliminate manual data re-entry across systems
- **Scale efficiently** - Enable 2x throughput without 2x headcount
- **Accelerate workflows** - Reduce cycle times by 50-60% through automation
- **Prove the model** - Establish Blueprint as "Client Zero" for Datapage's commercial platform

### 1.2 Success Criteria

**Primary Metrics (Day 180 MVP targets):**

| Domain | Metric | Baseline | Target | Owner |
|--------|--------|----------|--------|-------|
| **Feasibility** | Packet assembly cycle time | TBD | -50% | Entitlement Lead |
| **Entitlement** | Submission prep time | TBD | -50% | Entitlement Lead |
| **Throughput** | Deals vetted per FTE | TBD | 2x | Acquisitions Lead |
| **Servicing** | Avg. draw turnaround | TBD | -60% | Servicing Lead |
| **Adoption** | Weekly Active Users (pilot roles) | Baseline | ≥70% by Week 12<br/>≥85% by Day 180 | Change Lead |
| **Data Quality** | Validation error rate | Baseline | -75% | Data Lead |
| **Reliability** | System uptime | — | ≥99.5% | Engineering Lead |

**Secondary Success Indicators:**
- Positive user sentiment (NPS ≥40 by Day 90)
- Zero critical data loss incidents
- Technical debt backlog <20% of velocity
- All P0 features delivered on schedule

### 1.3 Timeline

**Program Duration:** 180 days (two 90-day increments)

```
Day 1 ─────────► Day 30 ─────────► Day 90 ─────────► Day 180
  │                 │                  │                  │
  │                 │                  │                  │
Kickoff      Decision Gate 1    Decision Gate 2    Decision Gate 3
  │                 │                  │                  │
  ├─ Foundation     ├─ Core complete  ├─ Phase 1 pilot  ├─ MVP launch
  ├─ Tech stack     ├─ Scope locked   ├─ Go/No-Go       ├─ Full rollout
  └─ Team ramped    └─ APIs ready     └─ Metrics eval   └─ Commercialize
```

**Key Phases:**

**Phase 0 (Days 1-30): Foundation & Planning**
- Tech stack finalized (Day 7)
- Infrastructure & DevOps pipeline operational
- Core data model complete
- BPO integration approach decided (Day 14)
- Scope locked for Phase 1

**Phase 1 (Days 31-90): Design & Entitlement MVP Pilot**
- Design & Entitlement module development
- Temporary BPO integration (read project data, write status)
- Pilot launch at Day 90 (4-6 entitlement team users)
- Success metrics tracked, feedback captured

**Phase 2 (Days 91-180): Full Platform Buildout**
- BPO functionality rebuilt within Connect 2.0
- Connect 1.0 functionality rebuilt within Connect 2.0
- All Blueprint teams migrated to Connect 2.0
- Legacy systems deprecated
- MVP launch at Day 180

---

## 2. Team Structure

### 2.1 Organizational Chart

```
┌─────────────────────────────────────────────────────────────┐
│                   Program Leadership Team (PLT)              │
│  • Darin (Blueprint/Datapage CEO)                           │
│  • Mark (Product Owner)                                      │
│  • Nick (Program Lead - Intelligent Agency)                 │
│  • Paul (Executive Sponsor - IA)                            │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌─────────▼────────┐  ┌────────▼────────┐
│  Engineering   │  │  Product & UX    │  │  Change & Ops   │
└────────────────┘  └──────────────────┘  └─────────────────┘

Engineering Team:
├─ [Tech Lead / Architect] ────────────────── TBD
├─ [Backend Lead] ─────────────────────────── TBD
├─ [Frontend Lead] ────────────────────────── TBD
├─ [DevOps / Infrastructure Lead] ──────────── TBD
│
├─ Backend Developers (4-6):
│  ├─ [Backend Developer 1] ─────────────────── TBD
│  ├─ [Backend Developer 2] ─────────────────── TBD
│  ├─ [Backend Developer 3] ─────────────────── TBD
│  ├─ [Backend Developer 4] ─────────────────── TBD
│  ├─ [Backend Developer 5] ─────────────────── TBD (optional)
│  └─ [Backend Developer 6] ─────────────────── TBD (optional)
│
├─ Frontend Developers (2-3):
│  ├─ [Frontend Developer 1] ───────────────── TBD
│  ├─ [Frontend Developer 2] ───────────────── TBD
│  └─ [Frontend Developer 3] ───────────────── TBD (optional)
│
└─ [QA Engineer] ──────────────────────────── TBD

Product & UX Team:
├─ [Product Manager] ──────────────────────── TBD
└─ [UX Designer] ──────────────────────────── TBD

Change & Operations Team:
├─ [Change Lead] ──────────────────────────── TBD
├─ [Data Lead] ────────────────────────────── TBD
└─ Blueprint SMEs (part-time advisors):
   ├─ Acquisitions Lead
   ├─ Entitlement Lead
   └─ Servicing Lead
```

### 2.2 Team Sizing Recommendation

**Recommended:** 6-8 developers (core + leads)
- **Rationale:** 659 story points for Phase 1 (Days 1-90)
  - 6 developers: 60-90 points/sprint → 8.8 sprints → 18 weeks (tight but feasible)
  - 8 developers: 80-120 points/sprint → 6.6 sprints → 13 weeks (3-week buffer)

**Minimum Viable:** 4 developers + leads
- **Risk:** Extends timeline by 4-6 weeks; requires aggressive scope reduction

### 2.3 Roles & Responsibilities

| Role | Responsibilities | Time Commitment |
|------|------------------|----------------|
| **Tech Lead / Architect** | System design, tech decisions, architectural guidance, code reviews | 100% |
| **Backend Lead** | Backend team coordination, API design, data model ownership | 100% |
| **Frontend Lead** | Frontend team coordination, component library, UX implementation | 100% |
| **DevOps / Infrastructure Lead** | CI/CD, infrastructure, security, monitoring, deployment | 100% |
| **Backend Developers** | API development, business logic, database, integrations | 100% |
| **Frontend Developers** | UI components, state management, UX implementation | 100% |
| **QA Engineer** | Test planning, automation, manual testing, quality gates | 100% |
| **Product Manager** | Backlog prioritization, stakeholder alignment, scope decisions | 100% |
| **UX Designer** | Wireframes, prototypes, user research, design system | 100% |
| **Change Lead** | User training, adoption tracking, change management | 50-75% |
| **Data Lead** | Migration planning, data quality, validation | 50-75% |
| **Blueprint SMEs** | Requirements validation, UAT, feedback | 2-6 hrs/week |

---

## 3. Communication Plan

### 3.1 Communication Channels

**Slack Workspace:** `blueprint-datapage.slack.com` (or equivalent)

**Core Channels:**
- `#connect-dev` - Engineering discussion, technical questions, architecture decisions
- `#connect-standup` - Daily standup updates (async)
- `#connect-planning` - Sprint planning, backlog grooming, roadmap discussions
- `#connect-ux` - Design reviews, UX feedback, wireframes
- `#connect-alerts` - Build failures, deployment notifications, incident alerts
- `#connect-general` - Announcements, celebrations, general team chat

**Private Channels:**
- `#connect-plt` - Program Leadership Team decisions
- `#connect-engineering-leads` - Tech Lead, Backend Lead, Frontend Lead, DevOps Lead

**Email Lists:**
- `connect-dev@datapage.com` - All engineering team members
- `connect-plt@datapage.com` - Program Leadership Team
- `connect-all@datapage.com` - All program participants (including Blueprint SMEs)

**Document Repositories:**
- **GitHub:** `https://github.com/[org]/connect-2.0` - Code, issues, PRs, project board
- **Google Drive / SharePoint:** Architecture docs, meeting notes, decision logs
- **Confluence / Notion:** Knowledge base, runbooks, onboarding guides

### 3.2 Meeting Cadence

**Daily:**
- **Daily Standup** - 15 minutes, 9:00 AM PT
  - Format: Async in `#connect-standup` OR synchronous video call
  - Questions: What did you complete? What's next? Any blockers?
  - Optional video call for blockers or complex coordination

**Bi-Weekly (Sprint Rhythm):**
- **Sprint Planning** - 4 hours (first day of sprint)
  - Review backlog, assign tasks, commit to sprint goal
  - Break down stories, clarify acceptance criteria
  - Participants: Full engineering team + Product Manager

- **Sprint Review** - 2 hours (last day of sprint)
  - Demo completed work to stakeholders
  - Gather feedback, discuss next priorities
  - Participants: Engineering, Product, UX, PLT, Blueprint SMEs

- **Sprint Retrospective** - 1 hour (after Sprint Review)
  - What went well? What didn't? What to improve?
  - Action items assigned and tracked
  - Participants: Engineering team only (safe space)

**Weekly:**
- **Tech Lead Sync** - 1 hour, Wednesday 2:00 PM PT
  - Tech Lead, Backend Lead, Frontend Lead, DevOps Lead, Product Manager
  - Architecture decisions, technical blockers, cross-team coordination

- **PLT Sync** - 30 minutes, Friday 10:00 AM PT
  - Program status, risks, escalations, decision items
  - Participants: Darin, Mark, Nick, Paul

**Monthly:**
- **Architecture Review Board** - 2 hours
  - Major architectural decisions (e.g., tech stack, integration approaches)
  - Participants: Tech Lead, Leads, PLT

- **All-Hands** - 1 hour
  - Program status, wins, upcoming milestones
  - Participants: All team members + Blueprint leadership

**Ad Hoc:**
- **Design Reviews** - As needed (1-2 hours)
- **Incident Response** - As needed (immediate)
- **Decision Gates** - Days 7, 14, 30, 90, 180 (2-4 hours)

### 3.3 Communication Norms

**Response Time Expectations:**
- **Urgent (incidents, blockers):** <1 hour during core hours
- **High priority (sprint work):** <4 hours during core hours
- **Normal priority:** <24 hours
- **Low priority:** <48 hours

**Core Hours (for synchronous collaboration):**
- **Pacific Time:** 9:00 AM - 3:00 PM PT (6 hours overlap)
- **Rationale:** Accommodates distributed team while ensuring collaboration window

**Notification Guidelines:**
- Use `@channel` in Slack only for urgent/critical items (incidents, blockers)
- Use `@here` for time-sensitive items (deployments, standup reminders)
- Use DMs for 1:1 questions; escalate to channels if answer benefits others
- Respect "Do Not Disturb" hours (outside core hours)

---

## 4. Decision Authority Matrix

### 4.1 Decision Rights (RACI Model)

| Decision Type | Responsible | Accountable | Consulted | Informed |
|--------------|-------------|-------------|-----------|----------|
| **Tech Stack Selection** | Tech Lead | PLT (Mark, Darin) | Eng Leads, DevOps | Full Team |
| **Architecture Design** | Tech Lead | Tech Lead | Backend/Frontend Leads, Product | PLT |
| **API Contracts** | Backend Lead | Tech Lead | Frontend Lead, Product | Eng Team |
| **UX Design** | UX Designer | Product Manager | Tech Lead, Eng Leads | PLT |
| **Scope Changes (P0/P1)** | Product Manager | PLT (Mark) | Tech Lead, Eng Leads | Full Team |
| **Scope Changes (P2)** | Product Manager | Product Manager | Tech Lead | PLT |
| **Timeline Adjustments** | Tech Lead, PM | PLT (Nick, Mark) | Eng Leads | Full Team |
| **Sprint Commitments** | Eng Leads | Tech Lead | Full Eng Team | PM, PLT |
| **Deployment Go/No-Go** | DevOps Lead | Tech Lead | QA, Backend/Frontend Leads | PLT |
| **Incident Response** | On-call Engineer | Tech Lead | DevOps, Relevant Leads | PLT, Blueprint |
| **Hiring Decisions** | Nick (IA), Darin (Blueprint) | PLT | Tech Lead | Eng Team |
| **Budget Allocation** | Nick (IA), Darin (Blueprint) | PLT | — | Tech Lead |

### 4.2 Escalation Path

**Level 1: Team-Level Issues**
- **Examples:** Technical implementation questions, task clarifications, minor blockers
- **Resolution:** Discuss in `#connect-dev` or daily standup
- **Timeframe:** Same day

**Level 2: Lead-Level Issues**
- **Examples:** Cross-team dependencies, technical decisions, resource conflicts
- **Resolution:** Escalate to Tech Lead or relevant Lead (Backend/Frontend/DevOps)
- **Timeframe:** Within 24 hours

**Level 3: Program-Level Issues**
- **Examples:** Scope disputes, timeline risks, architectural changes affecting milestones
- **Resolution:** Escalate to PLT via Weekly Tech Lead Sync or ad hoc PLT meeting
- **Timeframe:** Within 48 hours

**Level 4: Executive-Level Issues**
- **Examples:** Budget overruns, major timeline changes, Go/No-Go decisions
- **Resolution:** PLT escalates to Darin/Mark for final decision
- **Timeframe:** Within 1 week (or immediate for Gate decisions)

---

## 5. Working Agreements

### 5.1 Core Hours

**Definition:** Time window when all team members are expected to be available for synchronous collaboration.

**Core Hours:** 9:00 AM - 3:00 PM Pacific Time (Monday-Friday)
- Includes: Daily standup, sprint ceremonies, architecture discussions
- Exceptions: Pre-approved time off, medical appointments, emergencies

**Flex Hours:** Outside core hours (early mornings, evenings, weekends)
- Developers may work flex hours for deep focus or personal schedule
- No expectation of synchronous availability outside core hours
- Async communication (Slack, comments) acceptable

### 5.2 Code Review SLA

**Target:** All PRs reviewed within 24 hours (business hours)

**Guidelines:**
- PRs submitted by 12:00 PM PT → reviewed same day
- PRs submitted after 12:00 PM PT → reviewed by 12:00 PM next day
- PRs marked `urgent` (hotfixes, blockers) → reviewed within 4 hours

**Review Standards:**
- At least 1 approval required from another developer
- Tech Lead or Lead approval required for architectural changes
- All CI checks must pass before merge
- Comments addressed or acknowledged before merge

### 5.3 Definition of Done

**A task is "Done" when:**

**Code Quality:**
- ✅ Code written and committed to feature branch
- ✅ Unit tests written (≥80% coverage for new code)
- ✅ Integration tests written (for API endpoints)
- ✅ Code reviewed and approved (1+ reviewer)
- ✅ No unresolved review comments
- ✅ All CI checks passing (linting, tests, build)

**Documentation:**
- ✅ API endpoints documented (OpenAPI/Swagger)
- ✅ README updated (if architecture/setup changes)
- ✅ Inline comments for complex logic
- ✅ Database migrations included (if schema changes)

**Testing:**
- ✅ Tested locally by developer
- ✅ Tested in staging environment
- ✅ QA sign-off (for user-facing features)
- ✅ Acceptance criteria met (from user story)

**Deployment:**
- ✅ Merged to `main` branch
- ✅ Deployed to staging successfully
- ✅ Smoke tests passed in staging
- ✅ Ready for production deployment

**Exceptions:**
- Spikes/research tasks: "Done" = findings documented, recommendation made
- Infrastructure tasks: "Done" = deployed to all environments, runbook updated
- Bugs: "Done" = root cause identified, fix deployed, regression test added

### 5.4 Work-in-Progress (WIP) Limits

**To prevent context-switching and improve flow:**

**Per Developer:**
- Max 2 tasks "In Progress" simultaneously (1 primary, 1 fallback for blockers)
- Exception: Code review tasks don't count toward WIP limit

**Per Team:**
- Max 10 tasks "In Progress" for 6-person team (1.67 per person avg)
- Max 12 tasks "In Review" (to prevent review bottleneck)

**Rationale:** Finish work before starting new work; unblock code reviews quickly.

### 5.5 On-Call & Incident Response

**On-Call Rotation:**
- Established after Day 30 (once production environment live)
- 1-week rotations, weekdays only (9 AM - 5 PM PT)
- Weekend coverage TBD based on Phase 1 pilot needs

**Incident Severity Levels:**

| Level | Definition | Response Time | Escalation |
|-------|-----------|---------------|------------|
| **P0 (Critical)** | Production down, data loss, security breach | <15 min | Immediate to Tech Lead + PLT |
| **P1 (High)** | Major feature broken, performance degraded | <1 hour | Tech Lead within 2 hours |
| **P2 (Medium)** | Minor feature broken, workaround available | <4 hours | Lead within 1 day |
| **P3 (Low)** | Cosmetic issues, nice-to-have features | Next sprint | Backlog grooming |

**Incident Process:**
1. On-call engineer opens incident channel (`#incident-YYYY-MM-DD`)
2. Assess severity, notify relevant stakeholders
3. Triage and mitigate (stop the bleeding)
4. Root cause analysis and permanent fix
5. Post-mortem (blameless, within 48 hours of resolution)

### 5.6 Time Off & Coverage

**Requesting Time Off:**
- Submit to Tech Lead at least 1 week in advance (2 weeks preferred)
- Mark in shared team calendar (Google Calendar)
- Identify coverage for critical tasks (e.g., on-call, code reviews)

**Holidays:**
- Observe US federal holidays (or team-specific holidays for distributed team)
- Program pauses for major holidays (Thanksgiving, Christmas, New Year)

---

## 6. Sprint 1 Goals (Days 1-14)

### 6.1 Sprint 1 Objectives

**Mission:** Establish technical foundation and unblock core development

**Goals:**
1. **Finalize tech stack** (Day 7) - Cloud provider, backend framework, frontend framework, database
2. **Stand up infrastructure** (Day 14) - Dev, staging, prod environments; CI/CD pipeline
3. **Begin core data model** (Day 14) - Database schema designed, initial migrations written
4. **Team onboarded** (Day 14) - All developers have access, local dev environments working

### 6.2 Sprint 1 Backlog

**Epic E1: Foundation & Infrastructure (20 points)**

| Task | Description | Story Points | Owner | Status |
|------|-------------|--------------|-------|--------|
| **E1-T1** | Tech stack selection (backend, frontend, database, hosting) | 3 | Tech Lead | 🚨 CRITICAL |
| **E1-T2** | Initialize repository, mono-repo or multi-repo structure | 2 | Tech Lead | Blocked by E1-T1 |
| **E1-T3** | Set up Docker Compose for local dev (backend, frontend, DB, Redis) | 5 | DevOps Lead | Blocked by E1-T1 |
| **E1-T4** | CI/CD pipeline (GitHub Actions: lint, test, build, deploy to staging) | 5 | DevOps Lead | Blocked by E1-T2 |
| **E1-T5** | Cloud infrastructure setup (staging + prod environments) | 5 | DevOps Lead | Blocked by E1-T1 |

**Epic E2: Core Data Model (34 points) - START IN SPRINT 1**

| Task | Description | Story Points | Owner | Status |
|------|-------------|--------------|-------|--------|
| **E2-T1** | Design database schema (Projects, Loans, Contacts, Documents, Tasks) | 8 | Backend Lead | Priority |
| **E2-T2** | Create initial migrations (tables, indexes, constraints) | 5 | Backend Dev 1 | Blocked by E2-T1 |
| **E2-T3** | Implement base model classes with audit fields (created_at, updated_at, created_by) | 3 | Backend Dev 2 | Blocked by E2-T1 |

**Total Sprint 1 Capacity:** 20 points (E1) + 16 points (E2 started) = **36 points**

**Team Velocity Target:** 30-40 points (conservative for first sprint, includes setup overhead)

### 6.3 Sprint 1 Success Criteria

**Must-Have (P0):**
- ✅ Tech stack finalized and documented (Day 7 deadline)
- ✅ Repository initialized, all developers can clone and run locally
- ✅ Docker Compose working (backend + DB + frontend dev server)
- ✅ CI/CD pipeline passing (lint, build, basic tests)
- ✅ Database schema designed and reviewed (E2-T1)

**Should-Have (P1):**
- ✅ Cloud staging environment deployed (basic "Hello World" app)
- ✅ Initial database migrations written (E2-T2)
- ✅ Team onboarding complete (access, tools, runbooks)

**Nice-to-Have (P2):**
- Documentation site initialized (e.g., Docusaurus, MkDocs)
- Monitoring & logging infrastructure (e.g., Datadog, New Relic)

### 6.4 Sprint 1 Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Tech stack decision delayed beyond Day 7** | Medium | High | Force decision by Day 7; use default recommendations from PRD if no consensus |
| **DevOps Lead unavailable** | Low | High | Cross-train Backend Lead on infrastructure; use managed services (Heroku, Vercel) as fallback |
| **Team onboarding delays** | Medium | Medium | Prepare onboarding scripts, automate access provisioning |
| **Docker local dev issues (Windows compatibility)** | Medium | Medium | Provide alternative setup (native installs), document troubleshooting |

---

## 7. Key Milestones

### 7.1 Decision Gates

**Gate 1 — Architecture & Alignment (Day 30)**
- **Purpose:** Confirm technical and operating foundation before major build spend
- **Criteria:**
  - ✅ Tech stack selected and infrastructure operational
  - ✅ Core data model complete (all tables, migrations, base APIs)
  - ✅ Auth & authorization working (JWT, RBAC)
  - ✅ Initial backlog validated and resourced
  - ✅ Blueprint Operating System v1 framework outlined
  - ✅ Cumulative spend within budget
- **Decision:** Go / Hold for Day 31+ development
- **Decision Makers:** PLT (Darin, Mark, Nick)

**Gate 2 — Pilot Validation (Day 90)**
- **Purpose:** Ensure pilot delivers measurable business value before full-scale development
- **Criteria:**
  - ✅ Design & Entitlement MVP live in production
  - ✅ At least 3 of 4 core KPIs met or trending positive:
    - Speed (cycle time reduction ≥25%)
    - Adoption (user engagement ≥70%)
    - Quality (data accuracy ≥95%)
    - Stability (uptime ≥99%)
  - ✅ User feedback positive (NPS ≥30)
  - ✅ Backlog for Phase 2 validated and prioritized
- **Decision:** Release next funding tranche, proceed with full platform buildout
- **Decision Makers:** PLT (Darin, Mark, Nick, Paul)

**Gate 3 — Scale Readiness (Day 180)**
- **Purpose:** Confirm unified platform and organizational readiness for scale-out
- **Criteria:**
  - ✅ Unified Blueprint environment operational (BPO & Connect 1.0 rebuilt in Connect 2.0)
  - ✅ User adoption ≥85% across all teams
  - ✅ Reliability ≥99.5%; core automation stable
  - ✅ Success metrics achieved (see Section 1.2)
  - ✅ Sustained-engineering backlog approved
  - ✅ Multi-tenancy foundation in place (data model, RBAC)
- **Decision:** Authorize scale-out and commercialization
- **Decision Makers:** PLT + Datapage Board

### 7.2 Sprint Schedule

**Sprints = 2 weeks each (10 business days)**

| Sprint | Days | Focus | Key Deliverables |
|--------|------|-------|------------------|
| **Sprint 1** | 1-14 | Foundation | Tech stack, infrastructure, data model design |
| **Sprint 2** | 15-28 | Core APIs | Auth, Projects API, Contacts API, Tasks API |
| **Sprint 3** | 29-42 | Lead & Project Management | Lead intake, project list, status transitions |
| **Sprint 4** | 43-56 | Feasibility (1/2) | Proforma management, consultant ordering |
| **Sprint 5** | 57-70 | Feasibility (2/2) + Entitlement (1/2) | Report tracking, entitlement project intake |
| **Sprint 6** | 71-84 | Entitlement (2/2) + Documents | Task workflows, permit tracking, document storage |
| **Sprint 7** | 85-98 | BPO Integration + Pilot Prep | Temporary integration, pilot testing, UAT |
| **Sprint 8** | 99-112 | Lending Module (1/2) | Loan creation, borrower management, document generation |
| **Sprint 9** | 113-126 | Lending Module (2/2) + Servicing (1/2) | Loan funding, draw set creation, iPad integration |
| **Sprint 10** | 127-140 | Servicing (2/2) | Draw approval, monthly statements, payoff quotes |
| **Sprint 11** | 141-154 | BPO Rebuild (1/2) | Agent portal, builder portal, messaging |
| **Sprint 12** | 155-168 | BPO Rebuild (2/2) + Connect 1.0 Rebuild | Unified lead intake, loan servicing UI |
| **Sprint 13** | 169-182 | Testing, Hardening, Launch Prep | UAT, performance testing, data migration, cutover |

**Buffer:** Days 183-200 reserved for contingency (timeline slippage, critical bugs, extended UAT)

### 7.3 Major Milestones

```
Day 1    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Day 180
  │                            │                             │                            │
  ▼                            ▼                             ▼                            ▼
Kickoff                   Day 30 Gate                   Day 90 Gate                  Day 180 Gate
  │                            │                             │                            │
  ├─ Team assembled            ├─ Core complete             ├─ Pilot launched            ├─ MVP launched
  ├─ Tech stack locked         ├─ Auth working              ├─ Entitlement team live     ├─ All teams live
  ├─ Infra operational         ├─ APIs deployed             ├─ Metrics tracked           ├─ Legacy deprecated
  └─ Backlog groomed           └─ Scope locked              └─ Phase 2 funded            └─ Commercialize ready
```

**Milestone Checklist:**

**Day 7: Tech Stack Finalized**
- Cloud provider selected (Azure / AWS / GCP)
- Backend framework selected (Node.js/TypeScript or Python/Django)
- Frontend framework selected (React or Vue.js)
- Database selected (PostgreSQL + object storage)
- DevOps tools selected (CI/CD, monitoring, logging)
- Decision documented in `docs/decisions/TECH_STACK.md`

**Day 14: BPO Integration Approach Decided**
- BPO API capabilities assessed
- Integration method chosen (REST API or scheduled export)
- Technical spike complete
- Integration backlog updated
- Decision documented in `docs/decisions/BPO_INTEGRATION.md`

**Day 30: Core Data Model Complete**
- All database tables created (Projects, Loans, Contacts, Documents, Tasks, Users)
- Migrations written and tested
- Base API endpoints operational (CRUD for core entities)
- Auth & authorization working (JWT, RBAC)
- Scope locked for Phase 1 (no new P0 features added)
- **DECISION GATE: Go/No-Go for Phase 1 development**

**Day 90: Phase 1 Pilot Launch**
- Design & Entitlement MVP deployed to production
- 4-6 entitlement team users trained and onboarded
- Success metrics baseline captured
- Feedback loop established (weekly check-ins)
- Temporary BPO integration operational
- **DECISION GATE: Go/No-Go for Phase 2 funding**

**Day 180: MVP Launch**
- BPO functionality rebuilt within Connect 2.0
- Connect 1.0 functionality rebuilt within Connect 2.0
- All Blueprint teams migrated (Acquisitions, Design & Entitlement, Servicing)
- Legacy systems deprecated (read-only archives)
- Success metrics achieved (≥85% adoption, ≥99.5% uptime, -50% cycle times)
- Multi-tenancy foundation in place (data model, RBAC, theming hooks)
- **DECISION GATE: Go/No-Go for commercialization**

---

## 8. Program Governance

### 8.1 Program Leadership Team (PLT)

**Members:**
- **Darin** (Blueprint/Datapage CEO) - Executive Sponsor, final decision authority
- **Mark** (Blueprint/Datapage Co-Owner) - Product Owner, scope decisions
- **Nick** (Intelligent Agency) - Program Lead, delivery accountability
- **Paul** (Intelligent Agency) - Executive Sponsor (IA-side), escalation point

**Responsibilities:**
- Approve major decisions (tech stack, scope changes, timeline adjustments)
- Review progress at decision gates (Days 30, 90, 180)
- Remove organizational blockers
- Allocate budget and resources
- Approve Go/No-Go decisions at each gate

**Cadence:**
- Weekly PLT Sync (30 minutes, Fridays)
- Decision Gate Reviews (2-4 hours at Days 30, 90, 180)
- Ad hoc meetings for urgent escalations

### 8.2 Change Control Process

**Scope Change Requests:**

**Trigger:** New feature request, deprioritized feature, timeline adjustment

**Process:**
1. **Requestor** submits change request (GitHub issue or document)
2. **Product Manager** assesses impact (story points, dependencies, timeline)
3. **Tech Lead** reviews technical feasibility and risks
4. **PLT** reviews and approves/rejects (weekly sync or ad hoc for urgent)
5. **Backlog updated** and team notified

**Approval Thresholds:**
- **P2 features (nice-to-have):** Product Manager approval sufficient
- **P1 features (should-have):** PLT approval required
- **P0 features (must-have):** PLT approval + impact analysis + contingency plan required
- **Timeline changes >1 week:** PLT approval + stakeholder notification

**Documentation:** All approved changes logged in `docs/decisions/CHANGE_LOG.md`

### 8.3 Risk Management

**Risk Review Cadence:**
- Weekly: Tech Lead reviews active risks, updates register
- Bi-Weekly: Sprint retrospective surfaces new risks
- Monthly: PLT reviews top 5 risks, mitigation plans

**Risk Register:** Maintained in `docs/project/RISK_REGISTER.md`

**Top Risks (Day 1):**

| Risk | Probability | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| **Tech stack decision delayed** | Medium | High | Force decision Day 7; use PRD defaults if no consensus | Tech Lead |
| **BPO integration more complex than expected** | Medium | High | Technical spike Day 8-14; fallback to batch export | Backend Lead |
| **Team size insufficient (<6 devs)** | Medium | High | Aggressive scope reduction; extend timeline | PLT |
| **Scope creep (P0 features added after Day 30)** | Medium | High | Strict change control; Gate 1 scope lock | Product Manager |
| **Key personnel turnover** | Low | High | Cross-training, documentation, knowledge sharing | Tech Lead |
| **Data migration issues** | Medium | Medium | Dry-run migrations, shadow period, rollback plan | Data Lead |
| **User adoption <70% at Day 90** | Medium | Medium | Change management, training, leadership sponsorship | Change Lead |

---

## 9. Success Criteria Recap

### 9.1 Technical Success

**By Day 30:**
- ✅ Infrastructure operational (dev, staging, prod environments)
- ✅ Core data model complete (all tables, migrations)
- ✅ Auth & authorization working (JWT, RBAC)
- ✅ CI/CD pipeline operational (automated tests, deployments)
- ✅ API documentation auto-generated (OpenAPI/Swagger)

**By Day 90:**
- ✅ Design & Entitlement MVP deployed to production
- ✅ Temporary BPO integration operational
- ✅ 100+ automated tests passing (unit + integration)
- ✅ System uptime ≥99% during pilot
- ✅ API response times <500ms (p95)

**By Day 180:**
- ✅ Full platform deployed (BPO + Connect 1.0 rebuilt)
- ✅ All integrations operational (iPad app, DocuSign, accounting)
- ✅ System uptime ≥99.5%
- ✅ API response times <300ms (p95)
- ✅ 500+ automated tests passing
- ✅ Security audit passed (no critical vulnerabilities)
- ✅ Performance load testing passed (2x current user load)

### 9.2 Business Success

**By Day 90:**
- ✅ Entitlement team using Connect 2.0 daily (≥70% WAU)
- ✅ Feasibility packet assembly time reduced by ≥25%
- ✅ Entitlement submission prep time reduced by ≥25%
- ✅ User sentiment positive (NPS ≥30)
- ✅ Zero critical data loss incidents

**By Day 180:**
- ✅ All Blueprint teams using Connect 2.0 daily (≥85% WAU)
- ✅ Feasibility packet assembly time reduced by ≥50%
- ✅ Entitlement submission prep time reduced by ≥50%
- ✅ Deals vetted per FTE increased by 2x
- ✅ Average draw turnaround reduced by ≥60%
- ✅ User sentiment strong (NPS ≥40)
- ✅ Legacy systems deprecated (BPO, Connect 1.0, SharePoint)

### 9.3 Organizational Success

**By Day 180:**
- ✅ Blueprint Operating System v1 defined and adopted
- ✅ Sustained engineering backlog prioritized and approved
- ✅ Multi-tenancy foundation in place (for commercialization)
- ✅ Datapage GTM strategy validated (investor-ready narrative)
- ✅ Blueprint serves as "Client Zero" success story
- ✅ Team transitioned to steady-state operations (no burnout)

---

## 10. Next Steps

### 10.1 Immediate Actions (Days 1-7)

**Day 1: Kickoff Meeting (4 hours)**
- Review this kickoff document with full team
- Q&A: clarify roles, responsibilities, working agreements
- Tour of codebase (GitHub repo), tools (Slack, GitHub Project, CI/CD)
- Set up individual development environments
- **Owner:** Program Lead (Nick), Tech Lead

**Days 1-2: Tool Access & Onboarding**
- Grant access: GitHub, Slack, cloud provider console, monitoring tools
- Verify local dev environment setup (Docker, IDE, dependencies)
- Complete onboarding checklist (see `docs/onboarding/CHECKLIST.md`)
- **Owner:** DevOps Lead, Tech Lead

**Days 1-7: Tech Stack Decision**
- Architecture Review Board meeting (Day 3-4)
- Evaluate options (Azure vs AWS vs GCP, Node.js vs Python, React vs Vue)
- Document trade-offs in `docs/decisions/TECH_STACK_EVALUATION.md`
- Final decision by Day 7, documented in `docs/decisions/TECH_STACK.md`
- **Owner:** Tech Lead, Backend Lead, Frontend Lead, DevOps Lead

**Days 1-7: Sprint 1 Execution**
- Begin E1 (Foundation) tasks: repo setup, Docker Compose, CI/CD
- Begin E2 (Data Model) design: whiteboard sessions, schema diagram
- Daily standups in `#connect-standup`
- **Owner:** Full Engineering Team

### 10.2 Week 2 Actions (Days 8-14)

**Days 8-14: BPO Integration Decision**
- Technical spike: assess BPO API capabilities
- Document integration options (REST API vs scheduled export)
- Recommend approach, PLT approval by Day 14
- Document decision in `docs/decisions/BPO_INTEGRATION.md`
- **Owner:** Backend Lead, assigned Backend Developer

**Days 8-14: Infrastructure Setup**
- Provision cloud environments (staging, prod)
- Configure CI/CD pipeline (GitHub Actions or equivalent)
- Set up monitoring & logging (Datadog, New Relic, or equivalent)
- Deploy "Hello World" app to staging
- **Owner:** DevOps Lead

**Days 8-14: Sprint 1 Completion**
- Finish E1 (Foundation) tasks
- Complete E2-T1 (Database schema design), begin migrations
- Sprint 1 Review (Day 14): demo completed work to PLT
- Sprint 1 Retrospective: identify improvements
- **Owner:** Full Engineering Team

**Day 14: Sprint Planning for Sprint 2**
- Review backlog, prioritize Sprint 2 tasks
- Assign tasks: E2 (Data Model completion), E3 (Auth), E8 (Task Management start)
- Commit to Sprint 2 goal: "Core APIs operational"
- **Owner:** Product Manager, Tech Lead, Engineering Team

### 10.3 Week 3-4 Actions (Days 15-30)

**Sprint 2 & 3 Focus:**
- Complete E2 (Core Data Model): all migrations, base APIs
- Complete E3 (Auth & Authorization): JWT, RBAC, user management
- Begin E8 (Task Management): task CRUD, assignment workflows
- Begin E11 (Contact Management): contact CRUD, basic search
- **Owner:** Backend Team, Frontend Team

**Day 30: Decision Gate 1 Preparation**
- Compile metrics: story points completed, velocity, risks
- Prepare demo: show core APIs, auth, database schema
- Document scope lock for Phase 1 (no new P0 features)
- Schedule Decision Gate 1 meeting (4 hours) with PLT
- **Owner:** Product Manager, Tech Lead

**Day 30: Decision Gate 1 Meeting**
- Present: tech stack, infrastructure, data model, progress
- Review: success criteria, risks, budget
- Decision: Go/No-Go for Phase 1 development
- Document: decision and action items in `docs/decisions/GATE_1_DECISION.md`
- **Owner:** PLT (Darin, Mark, Nick, Paul)

---

## 11. Appendices

### 11.1 Key Documents

**Project Documentation:**
- **PRODUCT_REQUIREMENTS_DOCUMENT.md** - Comprehensive requirements (source of truth)
- **BACKLOG_CREATION_PLAN.md** - Epic breakdown, story point estimates
- **BACKLOG_GENERATION_SUMMARY.md** - Team sizing, velocity scenarios, risks
- **CLAUDE.md** - Repository instructions for AI assistants
- **PROJECT_KICKOFF.md** - This document

**Technical Documentation:**
- **docs/technical/ARCHITECTURE.md** - System architecture, component diagrams
- **docs/technical/API_REFERENCE.md** - API endpoint documentation
- **docs/technical/DATABASE_SCHEMA.md** - Database schema, ER diagrams
- **docs/technical/DEPLOYMENT.md** - Deployment procedures, runbooks

**Decision Logs:**
- **docs/decisions/TECH_STACK.md** - Tech stack selection rationale
- **docs/decisions/BPO_INTEGRATION.md** - BPO integration approach
- **docs/decisions/CHANGE_LOG.md** - Scope change history

**Planning Documents:**
- **docs/planning/SPRINT_SCHEDULE.md** - Sprint-by-sprint plan
- **docs/planning/RISK_REGISTER.md** - Risk tracking, mitigation plans

### 11.2 Glossary

**Program Terms:**
- **Connect 2.0** - Next-generation unified platform (replaces BPO, Connect 1.0, SharePoint)
- **BPO (Blueprint Online)** - Current lead intake system (Firebase-based)
- **Connect 1.0** - Legacy loan servicing platform (Filemaker-based)
- **Client Zero** - First implementation of a platform (Blueprint for Connect 2.0)
- **PLT (Program Leadership Team)** - Darin, Mark, Nick, Paul
- **MVP (Minimum Viable Product)** - Day 180 deliverable (Phase 1 + Phase 2)

**Domain Terms:**
- **Feasibility** - 3-30 day due diligence period assessing project viability
- **Entitlement** - Municipal permitting process to secure development approvals
- **Draw** - Construction loan disbursement tied to work completed
- **Reconveyance** - Lien release when loan is paid off
- **Proforma** - Financial projection showing project costs, revenue, ROI

**Agile Terms:**
- **Sprint** - 2-week development cycle
- **Story Points** - Relative complexity/effort estimate (Fibonacci scale: 1, 2, 3, 5, 8, 13, 21)
- **Velocity** - Story points completed per sprint (team capacity metric)
- **WIP (Work in Progress)** - Tasks currently being worked on
- **DoD (Definition of Done)** - Criteria for marking a task complete

### 11.3 Contact Information

**Program Leadership Team:**
- **Darin** - [email@blueprint.com] - CEO, Executive Sponsor
- **Mark** - [email@blueprint.com] - Product Owner
- **Nick** - [email@intelligentagency.com] - Program Lead
- **Paul** - [email@intelligentagency.com] - Executive Sponsor (IA)

**Engineering Leadership:**
- **[Tech Lead Name]** - [email] - Tech Lead / Architect
- **[Backend Lead Name]** - [email] - Backend Lead
- **[Frontend Lead Name]** - [email] - Frontend Lead
- **[DevOps Lead Name]** - [email] - DevOps / Infrastructure Lead

**Product & UX:**
- **[Product Manager Name]** - [email] - Product Manager
- **[UX Designer Name]** - [email] - UX Designer

**Change & Operations:**
- **[Change Lead Name]** - [email] - Change Lead
- **[Data Lead Name]** - [email] - Data Lead

**Blueprint SMEs (Subject Matter Experts):**
- **Acquisitions Lead** - [email] - Blueprint Acquisitions Team Lead
- **Entitlement Lead** - [email] - Blueprint Design & Entitlement Team Lead
- **Servicing Lead** - [email] - Blueprint Servicing Team Lead

### 11.4 Tools & Access

**Development Tools:**
- **GitHub Repository:** `https://github.com/[org]/connect-2.0`
- **GitHub Project Board:** `https://github.com/[org]/connect-2.0/projects/1`
- **CI/CD Pipeline:** GitHub Actions (or Azure DevOps, CircleCI)
- **Cloud Provider Console:** Azure / AWS / GCP (TBD Day 7)
- **Monitoring:** Datadog / New Relic / Application Insights (TBD Day 14)

**Communication Tools:**
- **Slack Workspace:** `blueprint-datapage.slack.com`
- **Video Conferencing:** Zoom / Google Meet / Microsoft Teams
- **Email Lists:** `connect-dev@datapage.com`, `connect-plt@datapage.com`

**Documentation:**
- **Code Documentation:** GitHub Wiki / README files
- **Knowledge Base:** Confluence / Notion (TBD)
- **Design Files:** Figma / Adobe XD (TBD)
- **Document Storage:** Google Drive / SharePoint (TBD)

**Project Management:**
- **Backlog Management:** GitHub Projects (Kanban board)
- **Time Tracking:** (Optional, TBD)
- **Risk Register:** Google Sheets / Confluence (TBD)

---

## Document Status

**Version:** 1.0
**Date:** November 6, 2025
**Status:** Draft - Ready for PLT Review
**Next Review:** Day 1 Kickoff Meeting
**Owner:** Program Lead (Nick)

**Approval:**
- [ ] Darin (CEO, Executive Sponsor)
- [ ] Mark (Product Owner)
- [ ] Nick (Program Lead)
- [ ] Paul (IA Executive Sponsor)
- [ ] Tech Lead (when hired)

---

**Welcome to Connect 2.0. Let's build something extraordinary.**
