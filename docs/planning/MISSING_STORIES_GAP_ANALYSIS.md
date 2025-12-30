# Missing Stories - Gap Analysis

**Date:** December 30, 2025
**Author:** Clay Campbell
**Purpose:** Identify missing stories by comparing PRD requirements against current Track 3 backlog

---

## Executive Summary

**Analysis Results:**
- **75 missing features** identified across 10 modules
- **~50 new product stories needed** to cover MVP scope (Days 1-180)
- **Current Track 3 backlog:** 120 items (focused on technical foundation, not business features)
- **Gap:** Business feature layer (lead intake, lending, servicing) is completely missing

### Critical Finding

**Track 3 is building the platform infrastructure** (database, APIs, auth, DevOps) but is **missing the actual business modules** that users will interact with:
- ❌ No Lead Intake module
- ❌ No Lending/Loan Origination module
- ❌ No Servicing & Draws module
- ❌ No Analytics/Dashboards module
- ⚠️ Partial Feasibility module (only technical foundation)
- ⚠️ Partial Entitlement module (task management exists, but missing permit workflows)

---

## Missing Stories by Module

### 1. Lead Intake & Management Module **(COMPLETELY MISSING)**

**Missing Features (6):**
1. Lead submission form (mobile-responsive)
2. Auto-assignment of leads (round-robin or rules-based)
3. Lead queue & prioritization with AI scoring
4. Duplicate lead detection (address normalization)
5. Internal notes with RBAC
6. Lead analytics dashboard (conversion funnel, source analysis)

**Proposed Epic:** `DP01-XX: Lead Intake Module`

**Proposed Stories (4):**

#### Story 1: Lead Submission & Intake Form
- **Description:** Mobile-responsive lead submission form for agents with address, price, attachments, and real-time status tracking
- **Value:** Agents can submit leads from any device; acquisitions team sees new leads instantly
- **Acceptance Criteria:**
  - Mobile-responsive form (works on phone/tablet)
  - Address autocomplete
  - Photo/document upload from mobile camera
  - Real-time status updates (received, in review, feasibility, etc.)
- **Subtasks:**
  - Design mobile-first lead form UI
  - Build React lead submission form
  - Implement address autocomplete (Google Maps API)
  - Add photo upload with mobile camera support
  - Build lead status tracking API
  - Create agent dashboard to view submitted leads

#### Story 2: Lead Assignment & Routing
- **Description:** Automated lead assignment using round-robin or configurable rules-based routing
- **Value:** Leads are instantly assigned to acquisitions specialists without manual triage
- **Acceptance Criteria:**
  - Round-robin assignment mode
  - Rules-based assignment (by geography, lead source, etc.)
  - Manual reassignment capability
  - Assignment audit trail
- **Subtasks:**
  - Implement round-robin assignment algorithm
  - Build rules engine for custom assignment logic
  - Add manual reassignment UI
  - Create assignment history tracking

#### Story 3: Lead Queue & Duplicate Detection
- **Description:** Lead queue management with duplicate detection and AI-powered prioritization
- **Value:** Acquisitions team works on highest-value leads first; duplicate submissions are flagged automatically
- **Acceptance Criteria:**
  - Lead queue with filtering/sorting
  - Duplicate detection (same address fuzzy match)
  - AI scoring for viability (post-MVP: use ML model)
  - Prioritization by score, submission date, source
- **Subtasks:**
  - Build lead queue UI with filters
  - Implement address normalization & duplicate detection
  - Add manual priority override
  - Create lead scoring placeholder (AI post-MVP)

#### Story 4: Lead Analytics Dashboard
- **Description:** Lead conversion funnel, source analysis, and cycle time metrics
- **Value:** Management sees which lead sources convert best and where bottlenecks exist
- **Acceptance Criteria:**
  - Conversion funnel visualization (submitted → reviewed → feasibility → GO)
  - Lead source analysis (agent, referral, direct)
  - Cycle time metrics (submission to decision)
  - Export to CSV
- **Subtasks:**
  - Design analytics dashboard UI
  - Build funnel visualization component
  - Implement source analysis queries
  - Add cycle time calculations
  - Create export functionality

---

### 2. Feasibility & Due Diligence Module **(PARTIALLY COVERED)**

**Current Coverage:**
- ✅ DP01-121-133: Feasibility schema, checklists, document upload, AI extraction, packet generation (GOOD!)

**Missing Features (7):**
1. Feasibility record auto-creation from lead approval
2. Consultant ordering system (bulk or selective)
3. Consultant portal (external user access)
4. Document summarization (GPT-based)
5. Proforma builder with auto-calculated ROI
6. Viability decision workflow (GO/PASS)
7. Feasibility dashboard (real-time project status)

**Recommendation:** Expand DP01-35 or create **DP01-XX: Advanced Feasibility Features**

**Proposed Stories (3):**

#### Story 5: Consultant Ordering System
- **Description:** Bulk or selective ordering of consultant reports (survey, title, arborist) with email/API notifications
- **Value:** Acquisitions specialists can order all reports with one click instead of manual emails
- **Acceptance Criteria:**
  - Consultant selection UI (dropdown or search)
  - Bulk order (all consultants) or selective
  - Email notification to consultants with task details
  - API integration for consultants with systems
- **Subtasks:**
  - Build consultant selection UI
  - Implement bulk vs. selective ordering logic
  - Create email template for consultant notifications
  - Add API webhook for consultant systems

#### Story 6: Consultant Portal
- **Description:** External portal for consultants to view assigned tasks and upload deliverables
- **Value:** Consultants have single place to see all Blueprint tasks across projects
- **Acceptance Criteria:**
  - Consultant login (external user auth)
  - Dashboard showing assigned tasks
  - Upload interface for deliverables
  - Automatic notification to Blueprint team on upload
- **Subtasks:**
  - Extend RBAC for external consultant role
  - Build consultant dashboard UI
  - Implement deliverable upload flow
  - Add auto-notification on upload

#### Story 7: Proforma Builder
- **Description:** Financial proforma builder with auto-calculated ROI and budget vs. actuals tracking
- **Value:** Acquisitions team can model deal economics and track actual costs
- **Acceptance Criteria:**
  - Proforma template (land, construction, soft costs, revenue)
  - Auto-calculated ROI, profit margin, yield
  - Budget vs. actuals tracking (pulls from draws)
  - Scenario modeling (what-if analysis)
- **Subtasks:**
  - Design proforma data model
  - Build proforma entry UI
  - Implement ROI calculation engine
  - Add scenario modeling capability
  - Integrate budget actuals from draw data

---

### 3. Entitlement & Design Module **(PARTIALLY COVERED)**

**Current Coverage:**
- ✅ DP01-121-133: Task management, consultant tasks, SLA tracking (from Feasibility module)
- ✅ DP01-129-130: Permit packet generation

**Missing Features (8):**
1. Plan library integration (1,500+ plan sets, searchable)
2. Design customization interface
3. Consultant task management with deadlines *(may be covered by DP01-30 Task Management)*
4. SLA tracking & alerts for overdue deliverables *(may be covered)*
5. Permit submission tracking workflow
6. Correction cycle management (city feedback)
7. Timeline forecasting with ML model
8. Cross-team visibility (servicing can see entitlement status)

**Recommendation:** Create **DP01-XX: Entitlement Module**

**Proposed Stories (3):**

#### Story 8: Plan Library Integration
- **Description:** Searchable plan library with 1,500+ plan sets for selection and customization
- **Value:** Design team can quickly find and select appropriate plans for projects
- **Acceptance Criteria:**
  - Search plans by square footage, bedrooms, style, lot constraints
  - Plan preview (thumbnail + metadata)
  - Plan selection (link to project)
  - Upload new plans to library
- **Subtasks:**
  - Design plan library data model
  - Build plan upload & metadata entry
  - Implement search with filters
  - Create plan preview UI
  - Add plan selection workflow

#### Story 9: Permit Submission & Tracking Workflow
- **Description:** Track permit submission, city review status, and correction cycles
- **Value:** Team knows exactly where each permit is in the approval process
- **Acceptance Criteria:**
  - Permit submission date logging
  - Status workflow (Submitted → Under Review → Corrections → Approved)
  - City reviewer contact tracking
  - Permit number assignment
- **Subtasks:**
  - Design permit tracking data model
  - Build permit submission UI
  - Implement status workflow transitions
  - Add city reviewer contact management

#### Story 10: Correction Cycle Management
- **Description:** Log city feedback, create action items for consultants, track resolution
- **Value:** Team systematically addresses city comments instead of ad-hoc tracking
- **Acceptance Criteria:**
  - Log city feedback (text + attachments)
  - Create action items (assign to consultants)
  - Track resolution status
  - Resubmission workflow
- **Subtasks:**
  - Build correction logging UI
  - Implement action item creation from feedback
  - Add consultant notification on action items
  - Create resubmission workflow

---

### 4. Lending & Loan Origination Module **(COMPLETELY MISSING)**

**Missing Features (7):**
1. Borrower/guarantor management (contact management)
2. Loan terms configuration with defaults (rules engine)
3. Budget & proforma tracking (budget vs. actuals)
4. Audit & validation (pre-funding checks)
5. Document generation from templates (e-signature integration)
6. Builder assignment with AI recommendations
7. Funding workflow (mark funded, assign to borrowing base)

**Proposed Epic:** `DP01-XX: Lending Module`

**Proposed Stories (6):**

#### Story 11: Loan Creation & Configuration
- **Description:** Auto-create loans from project data with configurable terms and defaults
- **Value:** Lending team doesn't re-enter project data; loan terms pre-populate from templates
- **Acceptance Criteria:**
  - Auto-create loan from approved feasibility project
  - Loan terms template system (interest rate, fees, term, draw schedule)
  - Manual override of defaults
  - Loan number auto-generation
- **Subtasks:**
  - Implement loan auto-creation trigger (from project GO decision)
  - Build loan terms template system
  - Create loan configuration UI
  - Add loan number generator

#### Story 12: Borrower & Guarantor Management
- **Description:** Manage borrowers, guarantors, and entity relationships
- **Value:** All stakeholders are tracked with relationships to projects and loans
- **Acceptance Criteria:**
  - Link borrowers to loans (1-to-many)
  - Link guarantors to loans (many-to-many)
  - Entity tracking (LLCs, partnerships)
  - Credit report tracking (expiration alerts)
- **Subtasks:**
  - Extend contact management for borrower/guarantor roles
  - Build guarantor linking UI
  - Add entity management
  - Implement credit report expiration alerts

#### Story 13: Pre-Funding Audit & Validation
- **Description:** Automated checks for missing docs, stale credit reports, incomplete conditions before funding
- **Value:** Loans don't fund with missing compliance items; reduces risk
- **Acceptance Criteria:**
  - Pre-funding checklist (required docs, credit reports, insurance, etc.)
  - Auto-check for stale credit reports (>90 days)
  - Auto-check for missing title insurance
  - Funding blocker if conditions not met
- **Subtasks:**
  - Design pre-funding checklist system
  - Implement auto-checks (credit age, docs)
  - Build funding blocker logic
  - Create pre-funding dashboard

#### Story 14: Loan Document Generation & E-Signature
- **Description:** Generate loan documents from templates and send for e-signature (DocuSign/Authentisign)
- **Value:** Loan docs are generated in seconds instead of manual Word template editing
- **Acceptance Criteria:**
  - Document templates (promissory note, deed of trust, etc.)
  - Auto-populate from loan data
  - Send to DocuSign/Authentisign
  - Track signature completion
  - Store signed docs in project
- **Subtasks:**
  - Create document template system
  - Build template merge engine (loan data → PDF)
  - Integrate DocuSign API
  - Implement signature tracking workflow
  - Add signed document storage

#### Story 15: Builder Assignment & Recommendations
- **Description:** Assign builders to projects with AI-powered recommendations based on geography, performance, capacity
- **Value:** Team matches projects with best-fit builders; reduces builder failures
- **Acceptance Criteria:**
  - Builder assignment UI
  - AI recommendations (post-MVP: use ML model)
  - Builder scorecard (on-time %, cost variance, quality)
  - Assignment history tracking
- **Subtasks:**
  - Build builder assignment UI
  - Create builder scorecard calculations
  - Add recommendation placeholder (AI post-MVP)
  - Implement assignment tracking

#### Story 16: Funding Workflow
- **Description:** Mark loan as funded, assign to borrowing base (Columbia Bank), trigger servicing
- **Value:** Loan transitions from origination to servicing seamlessly
- **Acceptance Criteria:**
  - Funding date logging
  - Borrowing base assignment (Columbia Bank vs. Blueprint balance sheet)
  - Auto-transition to servicing status
  - Funding notification to builder
- **Subtasks:**
  - Build funding workflow UI
  - Implement borrowing base assignment logic
  - Add auto-status transition (Pending → Funded → Servicing)
  - Create funding notification system

---

### 5. Servicing & Draws Module **(COMPLETELY MISSING)**

**Missing Features (10):**
1. Draw set creation (automated monthly cycle)
2. Inspection upload (nightly sync)
3. Automated condition checks (credit, insurance, lien waivers)
4. Draw approval workflow with payment processing
5. Builder draw visibility in BPO
6. Monthly statement generation and email
7. Payoff quote generation
8. Reconveyance tracking (lien releases)
9. Month-end balancing with accounting
10. Borrowing base reporting for Columbia Bank

**Proposed Epic:** `DP01-XX: Servicing & Draws Module`

**Proposed Stories (7):**

#### Story 17: Draw Set Creation & iPad Integration
- **Description:** Automated monthly draw set creation with iPad app sync (existing inspection app)
- **Value:** Draw coordinators don't manually create draw sets; iPad app auto-syncs
- **Acceptance Criteria:**
  - Automated monthly draw set creation (all active loans)
  - API integration to iPad inspection app
  - Nightly sync of inspections back to Connect 2.0
  - Draw set dashboard
- **Subtasks:**
  - Implement automated draw set creation (monthly cron)
  - Build iPad app API integration
  - Add nightly inspection sync job
  - Create draw set dashboard UI

#### Story 18: Draw Review & Approval Dashboard
- **Description:** Dashboard for reviewing inspections, checking conditions, and approving draws
- **Value:** Servicing associates see all draws in one place with clear approval workflow
- **Acceptance Criteria:**
  - Draw review queue (filterable by loan, status)
  - Inspection viewer (photos + line items)
  - Condition checks (automated + manual)
  - Approve/hold/reject workflow
  - Payment processing trigger
- **Subtasks:**
  - Build draw review queue UI
  - Create inspection viewer component
  - Implement approval workflow
  - Add payment processing integration

#### Story 19: Automated Draw Condition Checks
- **Description:** Auto-check credit reports, insurance certificates, lien waivers; flag issues
- **Value:** Draws don't get approved with expired compliance items
- **Acceptance Criteria:**
  - Auto-check credit report expiration (<90 days)
  - Auto-check insurance certificate validity
  - Auto-check lien waiver receipt
  - Flag draws with issues (prevent approval)
  - Alerts to servicing team
- **Subtasks:**
  - Implement credit report age check
  - Add insurance certificate validation
  - Build lien waiver tracking
  - Create auto-flagging logic
  - Add alert notifications

#### Story 20: Monthly Statements & Borrower Communication
- **Description:** Auto-generate monthly statements (PDF) and email to borrowers
- **Value:** Borrowers get consistent monthly updates; servicing team doesn't manually create statements
- **Acceptance Criteria:**
  - Monthly statement template (PDF)
  - Auto-populate loan data (balance, interest, draws)
  - Auto-email on 1st of month
  - Borrower portal access to statement history
- **Subtasks:**
  - Create monthly statement template
  - Build statement generation engine
  - Implement auto-email scheduler
  - Add borrower portal for statement access

#### Story 21: Payoff Quote & Reconveyance
- **Description:** One-click payoff quote generation and lien release tracking
- **Value:** Servicing team can provide instant payoff quotes; reconveyances are tracked
- **Acceptance Criteria:**
  - Payoff quote calculation (principal + interest + fees)
  - Payoff quote PDF generation
  - Lien release tracking (sent to county, recorded, received)
  - Payoff confirmation workflow
- **Subtasks:**
  - Implement payoff quote calculator
  - Build payoff quote PDF template
  - Add lien release tracking workflow
  - Create payoff confirmation UI

#### Story 22: Loan Modifications & Extensions
- **Description:** Workflow for creating loan modifications, extensions, and amendments
- **Value:** Modifications are tracked as formal amendments, not ad-hoc changes
- **Acceptance Criteria:**
  - Modification request workflow
  - Amendment document generation
  - E-signature for amendments
  - Track modification history
- **Subtasks:**
  - Design modification data model
  - Build modification request UI
  - Implement amendment document generation
  - Add e-signature integration
  - Create modification history tracking

#### Story 23: Month-End Balancing & Bank Reporting
- **Description:** Reconcile loan balances with accounting system; generate borrowing base report for Columbia Bank
- **Value:** Month-end close is automated; bank reporting is one-click
- **Acceptance Criteria:**
  - Reconciliation with accounting system (QuickBooks, Sage, etc.)
  - Discrepancy flagging
  - Borrowing base report generation (CSV or PDF)
  - Auto-email to Columbia Bank
- **Subtasks:**
  - Integrate with accounting system API
  - Build reconciliation comparison logic
  - Create borrowing base report template
  - Implement auto-email to bank

---

### 6. Contacts & Relationships Module **(PARTIALLY COVERED)**

**Current Coverage:**
- ✅ DP01-36-39: Contact CRUD API (basic)
- ⚠️ Missing advanced features

**Missing Features (6):**
1. Contact creation (agents, builders, consultants, borrowers) *(partially covered)*
2. Company/LLC tracking (entity management)
3. Relationship mapping (contacts to projects/loans/tasks)
4. Contact history (activity feed)
5. Auto-contact creation from workflow triggers
6. Duplicate contact prevention (fuzzy matching)

**Recommendation:** Expand DP01-35 Contact Management with advanced features

**Proposed Stories (2):**

#### Story 24: Contact Relationship Mapping
- **Description:** Graph-based relationship mapping (contacts to projects, loans, tasks, entities)
- **Value:** Team sees full context for any contact (all projects, loans, communications)
- **Acceptance Criteria:**
  - Contact detail page shows all relationships
  - Activity feed (projects, loans, tasks, docs)
  - Relationship visualization (graph view)
  - Search by relationship (all projects for builder X)
- **Subtasks:**
  - Build relationship query engine
  - Create activity feed component
  - Add relationship graph visualization
  - Implement relationship-based search

#### Story 25: Duplicate Contact Prevention
- **Description:** Fuzzy matching for duplicate contacts (name, email, phone) with merge workflow
- **Value:** No duplicate contacts in system; clean CRM data
- **Acceptance Criteria:**
  - Fuzzy name matching (similar names flagged)
  - Email/phone exact match detection
  - Duplicate flagging on contact create
  - Contact merge workflow (pick primary, merge data)
- **Subtasks:**
  - Implement fuzzy name matching algorithm
  - Add duplicate detection on create/update
  - Build merge workflow UI
  - Create merge data consolidation logic

---

### 7. Documents & Collaboration Module **(PARTIALLY COVERED)**

**Current Coverage:**
- ✅ DP01-92-94: Document upload, metadata, categorization, S3 presigned URLs

**Missing Features (6):**
1. Document viewer (in-browser PDF/image/plans)
2. E-signature integration (DocuSign/Authentisign) *(may be covered in Lending)*
3. Internal messaging (team chat within project/loan context)
4. External messaging (agents/builders, shaded conversations)
5. Multi-party conversations (group messaging)
6. Notification preferences (user settings)

**Recommendation:** Create **DP01-XX: Collaboration Module**

**Proposed Stories (4):**

#### Story 26: Document Viewer & Versioning
- **Description:** In-browser viewer for PDFs, images, and plans with version history
- **Value:** Users don't download files to view them; version history preserves changes
- **Acceptance Criteria:**
  - In-browser PDF viewer (PDF.js)
  - Image viewer (JPG, PNG)
  - Plan viewer (large PDFs with zoom/pan)
  - Version history (track uploads of same document)
  - Download current or previous versions
- **Subtasks:**
  - Integrate PDF.js viewer
  - Build image viewer component
  - Add plan viewer with zoom/pan
  - Implement document versioning system

#### Story 27: Internal Team Messaging
- **Description:** Team chat within project/loan context (threaded conversations)
- **Value:** All communication is attached to project/loan; searchable history
- **Acceptance Criteria:**
  - Project-level chat threads
  - Loan-level chat threads
  - @mentions for team members
  - Message search
  - File attachments in chat
- **Subtasks:**
  - Design messaging data model
  - Build real-time chat UI (WebSocket or polling)
  - Implement @mention notifications
  - Add message search
  - Enable file attachments

#### Story 28: External Stakeholder Messaging
- **Description:** Messaging with agents/builders (shaded conversations visible to external users)
- **Value:** All external communication is tracked in Connect 2.0; no lost emails
- **Acceptance Criteria:**
  - External user chat access (agents, builders, consultants)
  - Shaded conversations (external can't see internal threads)
  - Multi-party support (loop in multiple agents/builders)
  - Email fallback (send message via email if user offline)
- **Subtasks:**
  - Extend messaging for external users
  - Implement conversation shading (internal vs. external)
  - Add multi-party chat
  - Build email fallback system

#### Story 29: Notification System & Preferences
- **Description:** User notification preferences with email/SMS delivery (task assigned, deliverable received, etc.)
- **Value:** Users control how they're notified; no spam
- **Acceptance Criteria:**
  - Notification preference UI (email, SMS, in-app)
  - Per-event notification settings (task assigned, doc uploaded, etc.)
  - Email delivery (SendGrid or AWS SES)
  - SMS delivery (Twilio)
  - In-app notification center
- **Subtasks:**
  - Build notification preference data model
  - Create preference settings UI
  - Integrate email service (SendGrid/SES)
  - Integrate SMS service (Twilio)
  - Build in-app notification center

---

### 8. Analytics & Dashboards Module **(COMPLETELY MISSING)**

**Missing Features (7):**
1. Executive dashboard (KPIs, deals, conversion, cycle times, revenue)
2. Acquisitions dashboard (lead funnel, feasibility pipeline)
3. Entitlement dashboard (permit status, consultant performance)
4. Servicing dashboard (active loans, draw cycle, delinquencies)
5. Builder performance scorecards
6. Market trends analysis
7. Custom reports & export (Excel/CSV)

**Proposed Epic:** `DP01-XX: Analytics & Dashboards Module`

**Proposed Stories (4):**

#### Story 30: Executive Dashboard
- **Description:** KPIs, deals in pipeline, conversion rates, cycle times, revenue projections
- **Value:** Leadership sees business health at a glance
- **Acceptance Criteria:**
  - Key metrics: deals in pipeline, conversion rate, avg cycle time, revenue
  - Trend charts (month-over-month growth)
  - Goal tracking (vs. targets)
  - Export to PDF for board meetings
- **Subtasks:**
  - Design executive dashboard UI
  - Build KPI calculation engine
  - Create trend chart components
  - Add export to PDF

#### Story 31: Team-Specific Dashboards
- **Description:** Acquisitions, Entitlement, and Servicing team dashboards tailored to workflows
- **Value:** Each team sees metrics relevant to their work
- **Acceptance Criteria:**
  - Acquisitions: lead funnel, feasibility pipeline, bottlenecks
  - Entitlement: permit status, consultant performance, timelines
  - Servicing: active loans, draw cycle status, delinquencies
  - Real-time updates
- **Subtasks:**
  - Build acquisitions dashboard
  - Build entitlement dashboard
  - Build servicing dashboard
  - Add real-time data refresh

#### Story 32: Builder Performance Analytics
- **Description:** Builder scorecards with on-time %, cost variance, quality metrics
- **Value:** Team makes data-driven builder selection decisions
- **Acceptance Criteria:**
  - Builder scorecard (on-time completion %, budget variance, quality score)
  - Historical performance trends
  - Filterable by geography, project type
  - Builder comparison view
- **Subtasks:**
  - Design builder scorecard calculations
  - Build builder analytics UI
  - Add historical trend charts
  - Implement builder comparison

#### Story 33: Custom Reports & Export
- **Description:** Ad-hoc report builder with Excel/CSV export
- **Value:** Users can answer custom questions without SQL knowledge
- **Acceptance Criteria:**
  - Report builder UI (select fields, filters, grouping)
  - Save report templates
  - Export to Excel/CSV
  - Schedule automated reports (email daily/weekly)
- **Subtasks:**
  - Build report builder UI
  - Implement dynamic query generation
  - Add Excel/CSV export
  - Create report scheduling system

---

### 9. Technical Foundation (Platform) **(PARTIALLY COVERED)**

**Current Coverage:**
- ✅ DP01-97-109: OAuth 2.0, RBAC, JWT, rate limiting, security headers
- ✅ DP01-85-96: API endpoints, pagination, filtering, error handling
- ✅ DP01-92-93: S3 integration

**Missing Features (11):**
1. OAuth 2.0 authentication system *(covered)*
2. Role-based access control (RBAC) *(covered)*
3. API versioning (/api/v1/) *(covered)*
4. Pagination (limit/offset or cursor-based) *(covered)*
5. Filtering & sorting on list endpoints *(covered)*
6. Error handling with consistent JSON format *(covered)*
7. Object storage integration (S3) *(covered)*
8. **Email service integration (notifications)** ← MISSING
9. **SMS service integration (alerts)** ← MISSING
10. **Webhook system for external integrations** ← MISSING
11. **Workflow engine (state machines)** ← MISSING
12. **Rules engine (configurable business logic)** ← MISSING
13. **Audit logging system** ← PARTIALLY COVERED (DP01-108)
14. **Multi-tenant foundation (logical isolation)** ← MISSING

**Proposed Stories (5):**

#### Story 34: Email & SMS Service Integration
- **Description:** Integrate email (SendGrid/AWS SES) and SMS (Twilio) for notifications
- **Value:** All system notifications can be delivered via email or SMS
- **Acceptance Criteria:**
  - SendGrid or AWS SES integration
  - Twilio SMS integration
  - Template system (email/SMS templates)
  - Delivery tracking
  - Bounce/failure handling
- **Subtasks:**
  - Integrate SendGrid/SES API
  - Integrate Twilio API
  - Build template system
  - Add delivery tracking
  - Implement bounce handling

#### Story 35: Webhook System
- **Description:** Webhook infrastructure for external integrations (BPO, iPad app, consultants)
- **Value:** External systems can subscribe to Connect 2.0 events
- **Acceptance Criteria:**
  - Webhook registration API
  - Event types (project.created, loan.funded, draw.approved, etc.)
  - Retry logic for failed deliveries
  - Webhook delivery logs
- **Subtasks:**
  - Design webhook data model
  - Build webhook registration API
  - Implement event publishing
  - Add retry logic
  - Create delivery logging

#### Story 36: Workflow Engine (State Machines)
- **Description:** State machine engine for workflow transitions (lead → feasibility → GO → loan → funded)
- **Value:** Business workflows are enforced; invalid transitions are prevented
- **Acceptance Criteria:**
  - Define state machines (Project, Loan, Task, etc.)
  - Transition rules (what states can move to what)
  - Workflow triggers (auto-actions on transition)
  - Workflow history tracking
- **Subtasks:**
  - Design state machine framework
  - Implement transition validation
  - Build workflow trigger system
  - Add workflow history logging

#### Story 37: Rules Engine
- **Description:** Configurable business logic engine for lead routing, loan terms, builder assignment, etc.
- **Value:** Business rules can be changed without code deploys
- **Acceptance Criteria:**
  - Rule definition UI (if/then logic)
  - Rule evaluation engine
  - Rule versioning
  - Rule testing/simulation
- **Subtasks:**
  - Design rules engine architecture
  - Build rule definition UI
  - Implement rule evaluation
  - Add rule versioning & testing

#### Story 38: Multi-Tenant Foundation
- **Description:** Logical tenant isolation for future multi-tenant deployment (foundation only, not full multi-tenancy)
- **Value:** Connect 2.0 is architected for eventual SaaS deployment
- **Acceptance Criteria:**
  - Tenant ID in all data models
  - Tenant isolation in queries (row-level security)
  - Tenant context middleware
  - Single-tenant mode (Blueprint) by default
- **Subtasks:**
  - Add tenant_id to all tables
  - Implement tenant context middleware
  - Add row-level security in queries
  - Document multi-tenant architecture

---

### 10. Integration Points **(PARTIALLY COVERED)**

**Current Coverage:**
- ⚠️ Partial: DocuSign/Authentisign mentioned in lending stories

**Missing Features (7):**
1. BPO API integration (read project data, write status updates)
2. iPad inspection app API integration (existing app)
3. DocuSign/Authentisign API integration *(may be covered in Lending)*
4. Azure Document Intelligence integration (Textract alternative)
5. Accounting system integration (month-end balancing)
6. Bank reporting integration (Columbia Bank borrowing base)
7. Email service provider (SendGrid, AWS SES) *(covered in Story 34)*
8. SMS service provider (Twilio) *(covered in Story 34)*

**Proposed Epic:** `DP01-XX: Integrations`

**Proposed Stories (4):**

#### Story 39: BPO API Integration
- **Description:** Read project data from BPO and write status updates back (temporary integration Days 1-90)
- **Value:** Design & Entitlement module can access BPO project data without re-entry
- **Acceptance Criteria:**
  - API integration to BPO (or export-based if no API)
  - Read project data (address, agent, builder, etc.)
  - Write status updates back to BPO (entitlement status, permit approval)
  - Nightly sync job
- **Subtasks:**
  - Assess BPO API capabilities (or fallback to export)
  - Implement BPO data read
  - Implement BPO status write-back
  - Add nightly sync job

#### Story 40: iPad Inspection App API Integration
- **Description:** Bi-directional API integration with existing iPad inspection app (push draw sets, receive inspections)
- **Value:** Draw coordinators don't manually enter inspection data
- **Acceptance Criteria:**
  - API to push draw set to iPad app
  - API to receive inspection results
  - Nightly sync job for inspections
  - Sync error handling
- **Subtasks:**
  - Assess iPad app API documentation
  - Implement draw set push API
  - Implement inspection receive API
  - Add nightly sync job
  - Add error handling & retry

#### Story 41: Azure Document Intelligence Integration
- **Description:** Document AI extraction for surveys, title reports, arborist reports (key data extraction)
- **Value:** Acquisitions team doesn't manually read 50-page reports
- **Acceptance Criteria:**
  - Azure Document Intelligence (or AWS Textract) integration
  - Extract key fields (tree count, easements, zoning, setbacks, etc.)
  - Display extracted data for validation
  - Manual override capability
- **Subtasks:**
  - Integrate Azure Document Intelligence API
  - Define extraction templates (survey, title, arborist)
  - Build extracted data display UI
  - Add manual validation workflow

#### Story 42: Accounting System Integration
- **Description:** Month-end balancing with accounting system (QuickBooks, Sage, etc.)
- **Value:** Loan balances auto-reconcile with GL; no manual Excel reconciliation
- **Acceptance Criteria:**
  - API integration to accounting system
  - Pull loan balances from GL
  - Compare Connect 2.0 balances vs. GL
  - Flag discrepancies
  - Generate reconciliation report
- **Subtasks:**
  - Assess accounting system API (QuickBooks, Sage, etc.)
  - Implement GL data pull
  - Build reconciliation comparison logic
  - Add discrepancy flagging
  - Create reconciliation report

---

## Proposed Epic Structure

Based on missing stories, here's a recommended epic structure for Connect 2.0 backlog:

### Track 3: Technical Foundation & Platform (CURRENT)
- ✅ DP01-21: Technical Foundation
- ✅ DP01-22: Core Data Model
- ✅ DP01-23: Authentication & Authorization
- ✅ DP01-30: Task Management
- ✅ DP01-35: Contact Management
- ✅ DP01-40: DevOps & Infrastructure

### Track 3: Business Modules (NEW - NEEDED)
- **DP01-45: Lead Intake Module** (4 stories)
- **DP01-46: Feasibility Module (Advanced Features)** (expand DP01-35 or new epic)
- **DP01-47: Entitlement Module** (3 stories)
- **DP01-48: Lending & Loan Origination Module** (6 stories)
- **DP01-49: Servicing & Draws Module** (7 stories)
- **DP01-50: Collaboration Module** (4 stories)
- **DP01-51: Analytics & Dashboards Module** (4 stories)
- **DP01-52: Platform Services** (5 stories - workflow engine, rules engine, notifications, etc.)
- **DP01-53: External Integrations** (4 stories)

---

## Summary Statistics

| Category | Count |
|----------|-------|
| **Missing features (PRD requirements)** | 75 |
| **Proposed new product stories** | 42 |
| **New epics needed** | 9 |
| **Current Track 3 items** | 120 |
| **Total backlog after consolidation + new stories** | ~80-100 feature stories |

---

## Recommendations

### Immediate Actions (Week 1)

1. **Review this gap analysis** with product and engineering leadership
2. **Prioritize missing stories by MVP phase:**
   - **Days 1-90 (Design & Entitlement MVP):**
     - Feasibility module (advanced features)
     - Entitlement module
     - Collaboration module (consultant portal, messaging)
     - BPO integration
   - **Days 91-180 (Full MVP):**
     - Lead Intake module
     - Lending module
     - Servicing module
     - Analytics dashboards
     - All integrations

3. **Create new epics in Jira** for business modules
4. **Create placeholder stories** for all 42 proposed stories
5. **Estimate new stories** with engineering team
6. **Update sprint roadmap** to include business module development

### Long-Term Strategy

**Connect 2.0 needs TWO parallel tracks:**

- **Track 3A: Platform & Infrastructure** (current DP01-21 through DP01-40)
  - Focus: APIs, database, auth, DevOps, technical foundation
  - Team: Backend engineers, DevOps engineers

- **Track 3B: Business Modules** (new DP01-45 through DP01-53)
  - Focus: User-facing features (lead intake, lending, servicing, dashboards)
  - Team: Full-stack engineers, UX designers

**Both tracks must progress in parallel** for Days 91-180 MVP to succeed.

---

## Next Steps

1. **Validate this analysis** - Are there any features we incorrectly flagged as missing?
2. **Confirm MVP scope** - Which missing stories are must-have for Days 1-90 vs. Days 91-180?
3. **Create Jira epics** for new business modules
4. **Populate backlog** with 42 new product stories
5. **Re-estimate program timeline** - Do we have capacity to build all business modules by Day 180?

---

**Questions? Feedback?**

Please review and comment on this document. Let's schedule a backlog planning session to finalize the new epic structure.
