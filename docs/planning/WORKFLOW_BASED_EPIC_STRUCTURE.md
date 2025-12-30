# Workflow-Based Epic Structure for Connect 2.0

**Date:** December 30, 2025
**Author:** Clay Campbell
**Purpose:** Reorganize Track 3 backlog by value streams instead of technical modules

---

## Value Stream Alignment

Based on Blueprint's core business workflows (from PRD Section 4.2 and Workshop outcomes), Connect 2.0 should be organized around these **5 primary value streams**:

```
Value Stream 1: Lead → Feasibility → Go/Pass Decision
Value Stream 2: Entitlement → Permit Approval → Construction Ready
Value Stream 3: Loan Origination → Funding → Servicing
Value Stream 4: Construction Draws → Inspections → Disbursement
Value Stream 5: Loan Payoff → Reconveyance → Close
```

Plus **2 supporting value streams**:
- Platform Services (authentication, notifications, integrations)
- Analytics & Reporting (cross-cutting)

---

## Proposed Epic Structure (Workflow-Based)

### **Value Stream 1: Acquisitions Pipeline** (Lead → Feasibility → Go/Pass)

**Business Context:**
Agents submit leads → Acquisitions team screens → Order consultant reports → Analyze viability → Make Go/Pass decision

**Current Coverage:**
- ⚠️ Partial: DP01-35 covers feasibility checklists, document upload, AI extraction
- ❌ Missing: Lead intake, consultant ordering, proforma builder, viability workflow

**Proposed Epics:**

#### Epic: **DP01-45: Lead Intake & Screening (VS1)**
*Capture and triage incoming leads from agents*

**Stories:**
1. Lead Submission Form (mobile-responsive, agent portal)
2. Lead Assignment & Routing (round-robin or rules-based)
3. Lead Queue & Duplicate Detection (acquisitions dashboard)
4. Internal Notes & Collaboration (RBAC, team comments)

**Workflow Touchpoints:**
- **Input:** Agent submits lead via mobile form or BPO integration
- **Process:** System assigns to acquisitions specialist → Screen for duplicates → Prioritize queue
- **Output:** Lead status (New → In Review → Feasibility → Passed/Closed)

---

#### Epic: **DP01-46: Feasibility & Due Diligence (VS1)**
*Deep dive analysis with consultant reports to determine viability*

**Stories:**
1. Consultant Ordering System (bulk or selective, email/API notifications)
2. Consultant Portal (external user access to view tasks, upload deliverables)
3. Document AI Extraction (surveys, title reports, arborist reports → key data)
4. Proforma Builder (auto-calculated ROI, budget tracking)
5. Viability Decision Workflow (Go/Pass with notes, triggers next stage)
6. Feasibility Dashboard (real-time project status, consultant delivery tracking)

**Workflow Touchpoints:**
- **Input:** Lead approved for feasibility (from VS1 Lead Screening)
- **Process:** Order reports → Consultants deliver → AI extracts data → Build proforma → Analyze ROI
- **Output:** Go/Pass decision → If GO, trigger Entitlement (VS2); if PASS, archive

**Integration Points:**
- Azure Document Intelligence (AI extraction)
- Email service (consultant notifications)
- BPO (read project data, write feasibility status)

---

### **Value Stream 2: Entitlement & Permitting** (Schematic Design → Permit Approval)

**Business Context:**
Select plan from library → Customize for site → Coordinate consultants (civil, structural, MEP) → Submit permit → Manage correction cycles → Obtain approval

**Current Coverage:**
- ✅ DP01-30: Task Management (consultant task assignment, tracking)
- ⚠️ Partial: DP01-129-130: Permit packet generation (from Feasibility epic)
- ❌ Missing: Plan library, permit workflow, correction cycles, timeline forecasting

**Proposed Epic:**

#### Epic: **DP01-47: Entitlement & Permitting (VS2)**
*Coordinate design consultants, submit permits, manage city review cycles*

**Stories:**
1. Plan Library Integration (1,500+ searchable plan sets, selection workflow)
2. Design Customization Interface (architect portal, CAD integration placeholder)
3. Consultant Task Management (assign tasks with SLAs, track deliverables) *[May be covered by DP01-30]*
4. Permit Packet Generation (template-based assembly) *[Already in DP01-129]*
5. Permit Submission & Tracking Workflow (submitted → under review → corrections → approved)
6. Correction Cycle Management (log city feedback, create action items, track resolution)
7. Timeline Forecasting (ML-based prediction of approval date) *[Post-MVP]*
8. Cross-Team Visibility (servicing team can see entitlement status)

**Workflow Touchpoints:**
- **Input:** Project approved from Feasibility (VS1)
- **Process:** Select plan → Customize → Assign consultants → Generate permit packet → Submit → Manage corrections → Approval
- **Output:** Permit approved → Trigger Loan Origination (VS3)

**Integration Points:**
- SharePoint (current state for plan library, may migrate to Connect 2.0)
- Email/SMS (consultant notifications, SLA alerts)

---

### **Value Stream 3: Loan Origination & Funding** (Underwriting → Documentation → Funding)

**Business Context:**
Project ready to build → Create loan → Structure terms → Add borrower/guarantor → Pre-funding checks → Generate docs → E-signature → Fund loan → Assign to servicing

**Current Coverage:**
- ❌ Completely missing (no lending/loan origination epics exist)

**Proposed Epic:**

#### Epic: **DP01-48: Loan Origination & Funding (VS3)**
*Originate construction loans and fund approved projects*

**Stories:**
1. Loan Creation & Configuration (auto-create from project, configurable terms, templates)
2. Borrower & Guarantor Management (contact relationships, credit tracking)
3. Loan Terms & Budget Setup (interest rate, fees, draw schedule, proforma import)
4. Pre-Funding Audit & Validation (checklist, stale credit alerts, compliance checks)
5. Loan Document Generation & E-Signature (templates, DocuSign/Authentisign integration)
6. Builder Assignment & Recommendations (assign builder, AI scoring placeholder)
7. Funding Workflow (mark funded, assign to borrowing base, trigger servicing)

**Workflow Touchpoints:**
- **Input:** Permit approved (from VS2 Entitlement)
- **Process:** Create loan → Configure terms → Add stakeholders → Generate docs → E-sign → Validate compliance → Fund
- **Output:** Loan funded → Trigger Servicing (VS4)

**Integration Points:**
- DocuSign/Authentisign (e-signature)
- BPO (builder assignment data)
- Accounting system (loan funding entry)
- Columbia Bank (borrowing base assignment)

---

### **Value Stream 4: Construction Servicing & Draws** (Monthly Draws → Inspections → Disbursement)

**Business Context:**
Monthly draw cycle → Create draw set → Push to iPad app → Inspectors assess progress → Upload inspections → Review conditions → Approve draws → Disburse funds → Generate statements

**Current Coverage:**
- ❌ Completely missing (no servicing/draws epics exist)

**Proposed Epic:**

#### Epic: **DP01-49: Construction Servicing & Draws (VS4)**
*Manage active construction loans through monthly draw cycles*

**Stories:**
1. Draw Set Creation & iPad Integration (automated monthly cycle, API to iPad app, nightly sync)
2. Draw Review & Approval Dashboard (inspection viewer, condition checks, approve/hold/reject)
3. Automated Draw Condition Checks (credit expiration, insurance, lien waivers)
4. Payment Processing & Disbursement (trigger payments, accounting integration)
5. Monthly Statements & Borrower Communication (auto-generate PDFs, email to borrowers)
6. Builder Draw Visibility (BPO integration, builder portal)
7. Loan Modifications & Extensions (amendment workflow, e-signature, history tracking)

**Workflow Touchpoints:**
- **Input:** Loan funded (from VS3 Origination)
- **Process:** Create draw set → Inspect → Upload → Review → Approve → Disburse → Statements
- **Output:** Draw disbursed → Update loan balance → Repeat monthly → When complete, trigger Payoff (VS5)

**Integration Points:**
- iPad Inspection App (existing app, bi-directional API)
- Accounting system (payment processing, GL updates)
- BPO (builder draw status visibility)
- Email service (monthly statements)

---

### **Value Stream 5: Loan Payoff & Closeout** (Payoff Request → Reconveyance → Final Accounting)

**Business Context:**
Borrower requests payoff → Generate quote → Receive payment → Release lien → Final accounting → Close loan

**Current Coverage:**
- ❌ Completely missing

**Proposed Epic:**

#### Epic: **DP01-50: Loan Payoff & Closeout (VS5)**
*Manage loan payoffs, lien releases, and final accounting*

**Stories:**
1. Payoff Quote Generation (one-click calculation, PDF generation)
2. Reconveyance Tracking (lien release workflow, county recording tracking)
3. Final Accounting & Close (final statement, accounting reconciliation)
4. Month-End Balancing & Bank Reporting (GL reconciliation, borrowing base report for Columbia Bank)

**Workflow Touchpoints:**
- **Input:** Borrower requests payoff (from VS4 Servicing)
- **Process:** Generate quote → Receive payment → Release lien → Reconcile → Close
- **Output:** Loan closed → Archive

**Integration Points:**
- Accounting system (final reconciliation)
- Columbia Bank (borrowing base update, loan payoff notification)
- County recorder (lien release tracking - may be manual)

---

## Supporting Value Streams (Cross-Cutting)

### **Platform Services Epic**

#### Epic: **DP01-51: Platform Services & Integrations (Platform)**
*Foundational services supporting all value streams*

**Stories:**
1. Workflow Engine (state machines for project/loan/task status transitions)
2. Rules Engine (configurable business logic for routing, terms, scoring)
3. Notification System (email/SMS service integration, user preferences)
4. Webhook System (external integration infrastructure for BPO, iPad app, consultants)
5. Multi-Tenant Foundation (logical tenant isolation, row-level security)
6. BPO API Integration (read project data, write status updates)
7. Azure Document Intelligence Integration (AI extraction service)
8. Accounting System Integration (GL reconciliation, payment processing)

**Cross-Cutting Support:**
- Workflow Engine: Used by ALL value streams (VS1-VS5)
- Rules Engine: Used by VS1 (lead routing), VS3 (loan terms), VS4 (draw conditions)
- Notifications: Used by ALL value streams (task alerts, status updates)
- Integrations: Used by specific value streams (BPO for VS1/VS2, iPad for VS4, etc.)

---

### **Analytics & Reporting Epic**

#### Epic: **DP01-52: Analytics & Dashboards (Analytics)**
*Business intelligence and reporting across all value streams*

**Stories:**
1. Executive Dashboard (KPIs, deals in pipeline, conversion, cycle times, revenue)
2. Acquisitions Dashboard (lead funnel, feasibility pipeline - VS1 metrics)
3. Entitlement Dashboard (permit status, consultant performance - VS2 metrics)
4. Servicing Dashboard (active loans, draw cycle, delinquencies - VS4 metrics)
5. Builder Performance Analytics (scorecards, trends)
6. Custom Reports & Export (ad-hoc report builder, Excel/CSV export)

**Cross-Cutting Analytics:**
- Pulls data from ALL value streams (VS1-VS5)
- Provides role-based views (executives, acquisitions, entitlement, servicing)

---

### **Collaboration & Communication Epic**

#### Epic: **DP01-53: Collaboration & Communication (Platform)**
*Communication tools used across all value streams*

**Stories:**
1. Document Viewer & Versioning (in-browser PDF/image/plans, version history)
2. Internal Team Messaging (project/loan context chat, @mentions)
3. External Stakeholder Messaging (agents, builders, consultants - shaded conversations)
4. Contact Relationship Mapping (graph-based relationships, activity feed)
5. Duplicate Contact Prevention (fuzzy matching, merge workflow)

**Cross-Cutting Communication:**
- Used by ALL value streams (VS1-VS5)
- Internal messaging: Team collaboration within projects/loans
- External messaging: Agent communication (VS1), consultant coordination (VS2), builder updates (VS4)

---

## Mapping Current Track 3 Epics to Value Streams

| Current Epic | Focus | Maps to Value Stream |
|--------------|-------|---------------------|
| **DP01-21: Technical Foundation** | Platform infrastructure (AWS, Docker, CI/CD) | Platform Services |
| **DP01-22: Core Data Model** | Database schema, API layer | Platform Services (foundation for all VS) |
| **DP01-23: Authentication & Authorization** | User auth, RBAC | Platform Services |
| **DP01-30: Task Management** | Task CRUD, assignment, workflows | Supports VS2 (Entitlement) & VS1 (Feasibility) |
| **DP01-35: Contact Management** | Contact CRUD, feasibility features | Supports VS1 (Feasibility) + Collaboration |
| **DP01-40: DevOps & Infrastructure** | CI/CD, staging, monitoring | Platform Services |

**Observation:** Current Track 3 epics are ALL platform/infrastructure. **Zero business value stream epics exist.**

---

## Revised Epic Structure (Workflow-Aligned)

### **NEW Epic Organization:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  TRACK 3: PLATFORM FOUNDATION (Current - Days 1-90)                │
├─────────────────────────────────────────────────────────────────────┤
│  DP01-21: Technical Foundation (AWS, Docker, CI/CD)                │
│  DP01-22: Core Data Model (Database, API layer)                    │
│  DP01-23: Authentication & Authorization (User auth, RBAC)         │
│  DP01-30: Task Management (Task workflows, assignment)             │
│  DP01-35: Contact Management (Contact CRUD, relationships)         │
│  DP01-40: DevOps & Infrastructure (CI/CD, monitoring)              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TRACK 3: VALUE STREAM 1 - ACQUISITIONS PIPELINE (Days 1-90)      │
├─────────────────────────────────────────────────────────────────────┤
│  DP01-45: Lead Intake & Screening (4 stories)                      │
│  DP01-46: Feasibility & Due Diligence (6 stories)                  │
│           → Builds on DP01-35 foundation                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TRACK 3: VALUE STREAM 2 - ENTITLEMENT & PERMITTING (Days 1-90)   │
├─────────────────────────────────────────────────────────────────────┤
│  DP01-47: Entitlement & Permitting (8 stories)                     │
│           → Uses DP01-30 Task Management foundation                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TRACK 3: VALUE STREAM 3 - LOAN ORIGINATION (Days 91-180)         │
├─────────────────────────────────────────────────────────────────────┤
│  DP01-48: Loan Origination & Funding (7 stories)                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TRACK 3: VALUE STREAM 4 - CONSTRUCTION SERVICING (Days 91-180)   │
├─────────────────────────────────────────────────────────────────────┤
│  DP01-49: Construction Servicing & Draws (7 stories)               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TRACK 3: VALUE STREAM 5 - LOAN PAYOFF (Days 91-180)              │
├─────────────────────────────────────────────────────────────────────┤
│  DP01-50: Loan Payoff & Closeout (4 stories)                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TRACK 3: PLATFORM SERVICES (Days 1-180, continuous)              │
├─────────────────────────────────────────────────────────────────────┤
│  DP01-51: Platform Services & Integrations (8 stories)             │
│           → Workflow engine, rules engine, notifications, webhooks │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TRACK 3: CROSS-CUTTING (Days 91-180)                             │
├─────────────────────────────────────────────────────────────────────┤
│  DP01-52: Analytics & Dashboards (6 stories)                       │
│  DP01-53: Collaboration & Communication (5 stories)                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## MVP Phasing by Value Stream

### **Days 1-90: Design & Entitlement MVP**

**Focus:** Prove the platform with a single end-to-end workflow

**Value Streams in Scope:**
- ✅ **VS1: Acquisitions Pipeline** (Lead → Feasibility → Go/Pass)
  - Epics: DP01-45, DP01-46
- ✅ **VS2: Entitlement & Permitting** (Design → Permit Approval)
  - Epic: DP01-47
- ✅ **Platform Foundation**
  - Epics: DP01-21, DP01-22, DP01-23, DP01-30, DP01-35, DP01-40
- ✅ **Platform Services (partial)**
  - Epic: DP01-51 (BPO integration, notifications, Azure Document Intelligence)

**Out of Scope (Days 1-90):**
- ❌ VS3: Loan Origination
- ❌ VS4: Construction Servicing
- ❌ VS5: Loan Payoff
- ❌ Full analytics dashboards

**Temporary Workaround:**
- BPO continues to handle lead intake (VS1 partial)
- Connect 1.0 continues to handle lending/servicing (VS3, VS4, VS5)

---

### **Days 91-180: Full MVP (All Value Streams)**

**Focus:** Replace BPO + Connect 1.0 completely

**Value Streams Added:**
- ✅ **VS3: Loan Origination & Funding**
  - Epic: DP01-48
- ✅ **VS4: Construction Servicing & Draws**
  - Epic: DP01-49
- ✅ **VS5: Loan Payoff & Closeout**
  - Epic: DP01-50
- ✅ **Analytics & Collaboration**
  - Epics: DP01-52, DP01-53
- ✅ **Platform Services (complete)**
  - Epic: DP01-51 (iPad integration, accounting integration, workflow engine, rules engine)

**Full System Cutover:**
- BPO deprecated (VS1 fully in Connect 2.0)
- Connect 1.0 deprecated (VS3, VS4, VS5 fully in Connect 2.0)
- All Blueprint teams on Connect 2.0

---

## Benefits of Workflow-Based Epic Structure

### **1. Aligns with Business Reality**
- Epics map to actual user workflows, not technical modules
- Product owner can prioritize by business value (which workflow first?)
- Stakeholders understand epic names (no need to explain "Core Data Model")

### **2. Enables Incremental Delivery**
- Each value stream epic delivers end-to-end functionality
- VS1 + VS2 can launch independently (Design & Entitlement MVP)
- VS3 + VS4 + VS5 can launch later (Lending/Servicing)

### **3. Clarifies Dependencies**
- Platform Foundation (DP01-21 to DP01-40) must complete before value streams
- VS2 (Entitlement) depends on VS1 (Feasibility) completion
- VS4 (Servicing) depends on VS3 (Origination) completion

### **4. Improves Team Organization**
- **Platform Team:** DP01-21 to DP01-40, DP01-51 (backend, DevOps)
- **Acquisitions Team:** DP01-45, DP01-46 (full-stack, UX)
- **Entitlement Team:** DP01-47 (full-stack, UX)
- **Lending Team:** DP01-48, DP01-49, DP01-50 (full-stack, UX)
- **Analytics Team:** DP01-52, DP01-53 (data, dashboards)

### **5. Enables AI/Automation Targeting**
- Each value stream has clear automation opportunities:
  - **VS1:** Lead scoring, document AI extraction, viability prediction
  - **VS2:** Timeline forecasting, consultant auto-selection
  - **VS3:** Builder recommendations, risk scoring
  - **VS4:** Draw condition auto-checks, fraud detection
  - **VS5:** Payoff calculation automation

---

## Story Count by Value Stream

| Value Stream / Epic | Stories | Priority | Phase |
|---------------------|---------|----------|-------|
| **DP01-45: Lead Intake & Screening (VS1)** | 4 | P0 | Days 1-90 |
| **DP01-46: Feasibility & Due Diligence (VS1)** | 6 | P0 | Days 1-90 |
| **DP01-47: Entitlement & Permitting (VS2)** | 8 | P0 | Days 1-90 |
| **DP01-48: Loan Origination & Funding (VS3)** | 7 | P0 | Days 91-180 |
| **DP01-49: Construction Servicing & Draws (VS4)** | 7 | P0 | Days 91-180 |
| **DP01-50: Loan Payoff & Closeout (VS5)** | 4 | P0 | Days 91-180 |
| **DP01-51: Platform Services & Integrations** | 8 | P0 | Days 1-180 |
| **DP01-52: Analytics & Dashboards** | 6 | P1 | Days 91-180 |
| **DP01-53: Collaboration & Communication** | 5 | P1 | Days 1-180 |
| **TOTAL NEW STORIES** | **55** | | |

Plus ~35-40 consolidated stories from current Track 3 (DP01-21 to DP01-40) = **~90-95 total feature stories**

---

## Integration Points by Value Stream

| Value Stream | External Integrations |
|--------------|----------------------|
| **VS1: Acquisitions** | BPO (read projects, write status), Azure Document Intelligence (AI extraction) |
| **VS2: Entitlement** | Email/SMS (consultant notifications), SharePoint (plan library - migrate) |
| **VS3: Loan Origination** | DocuSign/Authentisign (e-signature), Accounting system (loan funding), Columbia Bank (borrowing base) |
| **VS4: Construction Servicing** | iPad Inspection App (existing API), Accounting system (payments, GL), BPO (builder draw visibility) |
| **VS5: Loan Payoff** | Accounting system (final reconciliation), Columbia Bank (payoff notification) |

**Platform Services (DP01-51):** Provides shared integration infrastructure (webhooks, notification services) for all value streams

---

## Next Steps

### 1. Validate Value Stream Mapping
- **Review with Blueprint leadership:** Do these 5 value streams match actual workflows?
- **Confirm epic boundaries:** Should any stories move between epics?

### 2. Create Epics in Jira
- **Create 9 new epics** (DP01-45 through DP01-53)
- **Use value stream naming** instead of generic module names
- **Add epic descriptions** explaining the workflow context

### 3. Populate Stories
- **Create 55 new stories** across the 9 epics
- **Use story template** from consolidation plan
- **Link to PRD sections** for detailed requirements

### 4. Update Sprint Roadmap
- **Allocate stories to sprints** based on value stream sequencing:
  - Sprints 1-2: Platform Foundation (DP01-21 to DP01-40 consolidation)
  - Sprints 3-5: VS1 Acquisitions (DP01-45, DP01-46)
  - Sprints 6-8: VS2 Entitlement (DP01-47)
  - Sprints 9-11: VS3 Loan Origination (DP01-48)
  - Sprints 12-14: VS4 Construction Servicing (DP01-49)
  - Sprints 15-16: VS5 Loan Payoff (DP01-50)
  - Sprints 1-16: Platform Services (DP01-51, incremental)
  - Sprints 14-16: Analytics & Collaboration (DP01-52, DP01-53)

---

## Comparison: Module-Based vs. Workflow-Based Naming

| Module-Based (Generic) | Workflow-Based (Blueprint Context) |
|------------------------|-----------------------------------|
| ❌ Lead Intake Module | ✅ Lead Intake & Screening (VS1: Acquisitions Pipeline) |
| ❌ Feasibility Module | ✅ Feasibility & Due Diligence (VS1: Acquisitions Pipeline) |
| ❌ Entitlement Module | ✅ Entitlement & Permitting (VS2: Design → Permit Approval) |
| ❌ Lending Module | ✅ Loan Origination & Funding (VS3: Underwriting → Funding) |
| ❌ Servicing Module | ✅ Construction Servicing & Draws (VS4: Monthly Draws → Disbursement) |
| ❌ Payoff Module | ✅ Loan Payoff & Closeout (VS5: Payoff → Reconveyance) |

**Why better:**
- Business stakeholders immediately understand what each epic does
- Maps to actual team workflows (acquisitions team, design team, servicing team)
- Easier to prioritize ("We need VS2 before VS3")
- Aligns with PRD structure (Section 4.2: End-to-End Workflow)

---

## Visual: Value Stream Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CONNECT 2.0 VALUE STREAMS                       │
└─────────────────────────────────────────────────────────────────────┘

AGENT/BUILDER
    │
    │ Submit Lead
    ▼
┌─────────────────┐      Go Decision      ┌─────────────────┐
│ VALUE STREAM 1  │─────────────────────→ │ VALUE STREAM 2  │
│ Acquisitions    │                       │ Entitlement &   │
│ Pipeline        │                       │ Permitting      │
│                 │                       │                 │
│ • Lead Intake   │                       │ • Plan Select   │
│ • Feasibility   │                       │ • Consultant    │
│ • Go/Pass       │                       │ • Permit Submit │
└─────────────────┘                       └─────────────────┘
                                                  │
                                                  │ Permit Approved
                                                  ▼
                                          ┌─────────────────┐
                                          │ VALUE STREAM 3  │
                                          │ Loan Origination│
                                          │ & Funding       │
                                          │                 │
                                          │ • Underwriting  │
                                          │ • Documentation │
                                          │ • Funding       │
                                          └─────────────────┘
                                                  │
                                                  │ Funded
                                                  ▼
                                          ┌─────────────────┐
                                          │ VALUE STREAM 4  │
                                          │ Construction    │
                                          │ Servicing       │
                                          │                 │
                                          │ • Draw Cycles   │
                                          │ • Inspections   │
                                          │ • Disbursements │
                                          └─────────────────┘
                                                  │
                                                  │ Complete
                                                  ▼
                                          ┌─────────────────┐
                                          │ VALUE STREAM 5  │
                                          │ Loan Payoff &   │
                                          │ Closeout        │
                                          │                 │
                                          │ • Payoff Quote  │
                                          │ • Reconveyance  │
                                          │ • Final Acct    │
                                          └─────────────────┘

SUPPORTING PLATFORMS (All Value Streams)
┌────────────────────────────────────────────────────────────────────┐
│ Platform Services: Auth, Notifications, Workflow Engine, Rules    │
│ Analytics: Dashboards, Reports, KPIs                              │
│ Collaboration: Messaging, Documents, Contact Management           │
└────────────────────────────────────────────────────────────────────┘
```

---

**This workflow-based structure is ready for Jira implementation. Should I proceed with creating these epics?**
