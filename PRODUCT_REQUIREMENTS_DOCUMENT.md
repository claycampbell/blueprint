# Connect 2.0 - Product Requirements Document
**Version 1.0 | November 2025**

---

## Executive Summary

### Product Vision
Connect 2.0 is the next-generation, AI-native platform that powers Blueprint's transformation into a frontier firm while establishing Datapage's commercial platform strategy. It unifies lead intake, feasibility analysis, entitlement tracking, design coordination, lending, and servicing into a single, intelligent system that scales operational leverage without proportional headcount growth.

### Business Objectives
- **30% revenue growth** with modest headcount increases through technology, automation, and data leverage
- **Platform commercialization** - Blueprint serves as "Client Zero" proving the model for external clients
- **Operational efficiency** - Remove friction across the entire deal lifecycle (intake → feasibility → entitlement → lending → servicing)
- **Zero defaults maintained** - Technology augments, not replaces, expert judgment

### Success Metrics (180-day MVP targets)
| Domain | Metric | Baseline | Target | Owner |
|--------|--------|----------|--------|-------|
| Feasibility | Packet assembly cycle time | TBD | -50% | Entitlement Lead |
| Entitlement | Submission prep time | TBD | -50% | Entitlement Lead |
| Throughput | Deals vetted per FTE | TBD | 2x | Acquisitions Lead |
| Servicing | Avg. draw turnaround | TBD | -60% | Servicing Lead |
| Adoption | WAU (pilot roles) | Baseline | ≥70% by Week 12; ≥85% by Day 180 | Change Lead |
| Data Quality | Validation error rate | Baseline | -75% | Data Lead |
| Reliability | Uptime | — | ≥99.5% | Engineering Lead |

---

## Table of Contents
1. [Product Vision & Business Context](#1-product-vision--business-context)
2. [Current State Architecture & Pain Points](#2-current-state-architecture--pain-points)
3. [Target Architecture & System Design](#3-target-architecture--system-design)
4. [User Personas & Workflows](#4-user-personas--workflows)
5. [Feature Backlog & Requirements](#5-feature-backlog--requirements)
6. [Technical Specifications](#6-technical-specifications)
7. [Data Model & Migration Strategy](#7-data-model--migration-strategy)
8. [MVP Scope & Phasing](#8-mvp-scope--phasing)
9. [Integration Points](#9-integration-points)
10. [AI & Automation Opportunities](#10-ai--automation-opportunities)

---

## 1. Product Vision & Business Context

### 1.1 The Opportunity
Blueprint has established a proven operating model:
- **~3,200 leads per year** (95% from real estate agents)
- **$3B+ in loans originated** with **zero defaults**
- **Minute-level response times** that win deals
- **Local expertise** in Seattle and Phoenix markets
- **Deep entitlement knowledge** that derisk projects

This success is enabled by expert judgment, relationships, and speed—but current systems create operational friction that limits growth.

### 1.2 Why We're Building Connect 2.0

**Current Pain Points:**
- **Fragmented systems** - BPO (Blueprint Online), Connect 1.0, SharePoint, manual processes
- **Manual data re-entry** - Information copied between systems, creating errors and delays
- **No integration** - Systems don't communicate; data pushed manually between platforms
- **Performance issues** - Connect 1.0 is slow, laggy, and unreliable
- **Limited automation** - Repetitive administrative work consumes expert capacity
- **Knowledge trapped in heads** - Expertise not codified into repeatable processes

**What Success Looks Like:**
- **Single source of truth** - One unified platform from lead intake through loan servicing
- **Automated workflows** - Eliminate manual data entry and administrative burden
- **AI-assisted decisions** - Surface insights, flag risks, recommend actions
- **Real-time visibility** - Dashboards and status tracking across all stakeholders
- **Scalable operations** - Technology enables 2x throughput without 2x headcount

### 1.3 Blueprint as "Client Zero"
Blueprint serves as the proving ground for Connect 2.0:
- **Real operating environment** - Test under actual business conditions
- **Immediate feedback** - Users are internal stakeholders who inform product design
- **Reference implementation** - Successful transformation becomes the sales story for Datapage
- **Dual benefit** - Blueprint gains operational leverage; Datapage gains a commercializable product

**Existing External Clients:**
- Send Capital (using customized Connect 1.x)
- Create Capital (using customized Connect 1.x)
- Both pay $5-6K/month; heavily customized instances out of scope until post-MVP

---

## 2. Current State Architecture & Pain Points

### 2.1 System Landscape (As-Is)

```
┌─────────────────────────────────────────────────────────────────┐
│                     CURRENT STATE SYSTEMS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   BPO        │      │  Connect 1.0 │      │  SharePoint  │  │
│  │  (Firebase)  │◄────►│  (Filemaker) │◄────►│   (M365)     │  │
│  │              │      │              │      │              │  │
│  │ • Lead intake│      │ • Loan docs  │      │ • Feasibility│  │
│  │ • Projects   │      │ • Contacts   │      │ • Entitlement│  │
│  │ • Draw mgmt  │      │ • Servicing  │      │ • Design     │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
│         │                      │                      │         │
│         └──────────────────────┴──────────────────────┘         │
│                      (Manual data syncs)                         │
│                                                                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │  iPad App    │      │ Accounting   │      │ DocuSign/    │  │
│  │ (Inspections)│      │   System     │      │ Authentisign │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Current Systems Deep Dive

#### **Blueprint Online (BPO)**
- **Technology**: Firebase/Firestore backend, web frontend
- **Primary Users**: Real estate agents, builders, Blueprint acquisitions team
- **Function**: "Storefront" for lead intake and project tracking
- **What it does well**:
  - Fast lead intake (down from manual email/folder process)
  - Self-service for agents and builders to track their projects
  - Geographic search and visualization
  - Internal pipeline management and analytics
  - Messaging/collaboration between stakeholders

- **Pain Points**:
  - No integration with Connect or SharePoint
  - Data must be manually copied to Connect when loan is created
  - Limited workflow automation
  - No connection to feasibility or entitlement tracking

#### **Connect 1.0**
- **Technology**: Filemaker-based (legacy platform)
- **Primary Users**: Servicing team (6 people), acquisitions team
- **Function**: Loan origination, document generation, servicing, draw management
- **What it does well**:
  - Complete loan data model
  - Document generation (flows data into loan documents)
  - Audit/validation checks before funding
  - Servicing workflows (statements, payoff quotes, modifications)
  - Integration with iPad inspection app
  - Licensed to external clients (Send Capital, Create Capital)

- **Pain Points**:
  - **Performance**: Very slow, laggy (example: clicked one customer, displayed a different one due to lag)
  - **Manual data entry**: Pro-formas and project data manually imported from BPO
  - **No automation**: Contacts created manually; regulatory data (LLC names) manually entered
  - **Export issues**: Sync problems between systems
  - **One-way flow**: Data doesn't flow back to BPO once entered
  - **Vendor dependency**: Maintained by SeedCode (transitioning to support-only SLA)

#### **SharePoint (Microsoft 365)**
- **Technology**: SharePoint Online + PowerApps
- **Primary Users**: Design & Entitlement team, Feasibility team
- **Function**: Due diligence tracking, entitlement/permit coordination
- **Structure**:
  - **Site 1**: Feasibility/Due Diligence tracking
  - **Site 2**: Permit tracking (entitlement focus)
  - **Design team usage**: Architectural plan management (~1,500 plan sets)

- **Pain Points**:
  - **Zero integration**: Doesn't communicate with BPO or Connect
  - **Manual population**: When deal moves to feasibility, data manually entered into SharePoint
  - **Separate permit tracker**: Second SharePoint site for entitlement, creating another silo
  - **No visibility**: Acquisitions and Servicing teams can't see entitlement status

### 2.3 Critical Integration Gaps

**Gap 1: BPO → Connect**
- When acquisitions team creates loan, they manually re-enter data from BPO into Connect
- High-value fields like address, borrower info, property details copied by hand
- Opportunity: **Automatic loan creation** from BPO project data

**Gap 2: BPO → SharePoint**
- When project moves to feasibility, acquisitions manually creates SharePoint record
- Due diligence documents uploaded to SharePoint but not visible in BPO or Connect
- Opportunity: **Unified project record** across all systems

**Gap 3: SharePoint → Connect**
- Feasibility findings, entitlement status, permit progress not visible in Connect
- Servicing team doesn't know entitlement delays that affect loan risk
- Opportunity: **Real-time entitlement visibility** in loan records

**Gap 4: Document Intelligence**
- Arborist reports, surveys, title reports manually read and summarized into "Internal Notes"
- Key data points extracted by hand (e.g., tree restrictions, easements, zoning constraints)
- Opportunity: **AI document extraction** using Azure Document Intelligence

**Gap 5: Builder/Agent Isolation**
- Builders can only message Blueprint in BPO, not communicate with agents or consultants
- Email allows looping people in; BPO doesn't
- Opportunity: **Controlled multi-party collaboration** (Blueprint remains in control)

### 2.4 Team Structures & Workflows

#### **Acquisitions Team**
- **Split into**: Administrative intake, acquisition leads, feasibility associates
- **Current workflow**:
  1. Monitor BPO for new leads (7 days/week, 10-20 minute response SLA)
  2. Assign lead to acquisitions specialist
  3. Review property info, create feasibility assessment
  4. If viable → trigger due diligence (surveys, title, arborist, proforma)
  5. Manually summarize findings in BPO "Internal Notes" field
  6. If "GO" → manually create loan in Connect
  7. Hand off to servicing team

- **Pain Points**:
  - Manual prioritization (no automated lead scoring)
  - Manual document review and summarization
  - Re-keying data when creating loan

#### **Design & Entitlement Team**
- **Design team**: Architects managing ~1,500 plan sets, produce feasibility packages
- **Entitlement team**: Permit coordinators managing consultant orchestration
- **Current workflow**:
  1. Receive project from acquisitions (manual handoff)
  2. Create SharePoint record (manually re-enter project data)
  3. Order consultant reports (survey, arborist, civil engineering, etc.)
     - RedCloud built automation: address → blanket email to all consultants
     - 95% of time all ordered simultaneously; 5% selective (e.g., title first if risk)
  4. Track permit submissions and city correction cycles in SharePoint
  5. Coordinate consultant handoffs and milestone dates

- **Pain Points**:
  - No automated project intake from BPO
  - Consultant coordination is manual (emails, phone calls)
  - City correction cycles unpredictable; no forecasting
  - Status not visible to acquisitions or servicing teams

#### **Servicing Team**
- **6 people** managing escrow, draws, loan documents, builder interactions
- **Current workflow**:
  1. Receive funded loan from acquisitions
  2. Monthly draw cycle:
     - Create draw set in Connect (all active construction loans)
     - Push to iPad inspection app
     - Field inspections uploaded nightly
     - Review inspections, approve/hold draws
     - Push approved draws to BPO for builder visibility
  3. Generate monthly statements
  4. Process payoff quotes when units sell
  5. Month-end balancing with accounting system
  6. Borrowing base reporting (loans assigned to Columbia Bank line of credit)

- **Pain Points**:
  - No formal task assignment (work from pipeline reports, manually organized)
  - Customer groups assigned to loan associates (3 people), but no system enforcement
  - Draw approval based on inspection + doc conditions, but conditions scattered
  - Credit report staleness checks manual
  - Escrow/draw workflows heavily administrative

### 2.5 Key Bottlenecks (Identified for Automation)

| Bottleneck | Current Process | Time Impact | Automation Opportunity |
|------------|----------------|-------------|------------------------|
| **Lead vetting** | Manual review of ~3,200 leads/year; quality varies | Hours per lead | AI pre-screening, auto-flagging issues |
| **Feasibility packets** | Manual PDF assembly, re-entry of data | Days per deal | Template automation, data flow from BPO |
| **Document summarization** | Manually read title, survey, arborist reports and extract key points | 30-60 min/doc | Azure Document Intelligence extraction |
| **Entitlement coordination** | Email/phone with 5-10 consultants per project | Ongoing churn | Workflow automation, SLA tracking |
| **City correction cycles** | Reactive - wait for city to respond, manually track | Weeks of delay | Predictive analytics, automated follow-up |
| **Loan creation** | Re-key BPO data into Connect | 15-30 min | Automated loan origination from BPO project |
| **Draw approval** | Review conditions manually, check credit reports | Hours per draw set | Automated condition checks, staleness alerts |
| **Builder matching** | Experience-based assignment | Judgment call | Recommendation engine (geo, history, capacity) |

---

## 3. Target Architecture & System Design

### 3.1 Connect 2.0 High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                         CONNECT 2.0 PLATFORM                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Unified User Experience                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │  │
│  │  │   Agent    │  │  Builder   │  │ Blueprint  │  │   Admin    │ │  │
│  │  │  Portal    │  │   Portal   │  │    App     │  │  Console   │ │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                 │                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Workflow & Orchestration Layer                 │  │
│  │  • Process automation  • Task management  • Notifications         │  │
│  │  • Approval workflows  • Consultant coordination  • SLA tracking  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                 │                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         Core Modules                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │  │
│  │  │  Lead    │ │Feasibility│ │Entitlement│ │  Lending │ │Servicing││  │
│  │  │  Intake  │ │& Design   │ │& Permitting│ │          │ │        ││  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘ │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │  │
│  │  │ Contacts │ │ Documents│ │ Analytics│ │  Draws   │           │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                 │                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    AI & Intelligence Layer                        │  │
│  │  • Lead scoring  • Document extraction  • Builder recommendation  │  │
│  │  • Risk prediction  • Entitlement timeline forecasting            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                 │                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   Data & Integration Layer                        │  │
│  │  • Unified data model  • Semantic layer  • Event bus              │  │
│  │  • API gateway  • Multi-tenant foundation  • Telemetry            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                 │                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Infrastructure & Platform                      │  │
│  │  [Cloud Provider: Azure / AWS / GCP - to be selected Day 1-14]   │  │
│  │  • Kubernetes/Container orchestration                             │  │
│  │  • Database (PostgreSQL/CosmosDB/etc.)                            │  │
│  │  • Object storage (documents, images)                             │  │
│  │  • Message queue / Event streaming                                │  │
│  │  • Authentication / RBAC                                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  iPad Inspection│  │   Accounting    │  │   E-Signature   │
│       App       │  │     System      │  │  (DocuSign/etc) │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 3.2 Architecture Principles

#### **1. Cloud-Native & API-First**
- RESTful APIs for all core functions
- Microservices or modular monolith (to be determined based on team size/capability)
- Stateless services for horizontal scaling
- Event-driven where appropriate (e.g., loan status changes, document uploads)

#### **2. Experience-Led Development**
- Platform and UI development proceed in parallel
- Journey mapping & JTBD from Blueprint Transformation directly inform UX design
- Unified interface replacing fragmented tool landscape
- Mobile-responsive for field use (inspections, agent access)

#### **3. Composable & Modular**
- Each module (Lead Intake, Feasibility, Entitlement, Lending, Servicing) can be:
  - Independently deployed and versioned
  - Swapped or extended without touching other modules
  - Configured per client (when multi-tenant in future)
- Avoid rigid monoliths; plan for component replacement

#### **4. Data-Centric Design**
- Single source of truth: unified data model across all modules
- Semantic layer: consistent business entities (Project, Loan, Contact, Property, etc.)
- Event sourcing or change data capture for audit trail
- Field-level lineage for migrated data

#### **5. Progressive Multi-Tenancy**
- MVP: Single-tenant architecture (Blueprint only)
- Foundation: Data model, API design, and UI support multi-tenancy from Day 1
- Post-MVP roadmap:
  - **Days 180-270**: Logical tenant isolation, provisioning APIs, theming
  - **Days 270-360**: Usage metering, billing, tenant-scoped AI, cost controls

### 3.3 Technology Stack Recommendations

**To Be Finalized in First 2 Weeks (Days 1-14):**

#### **Cloud Provider Decision Criteria**
| Factor | Azure | AWS | GCP |
|--------|-------|-----|-----|
| **AI/ML Services** | Azure OpenAI, Document Intelligence, Form Recognizer | Bedrock, Textract, Comprehend | Vertex AI, Document AI |
| **Database Options** | CosmosDB, Azure SQL, PostgreSQL | RDS (PostgreSQL), DynamoDB, Aurora | Cloud SQL, Firestore, Spanner |
| **Team Familiarity** | TBD | TBD | Current BPO uses Firebase |
| **Cost** | Analyze | Analyze | Analyze |
| **Existing Footprint** | Check M365 integration | — | Firebase/BPO migration path? |

**Recommended Stack (Provisional):**
- **Backend**: Node.js/TypeScript or Python (Django/FastAPI)
- **Frontend**: React or Vue.js (modern SPA framework)
- **Database**: PostgreSQL (relational) + object storage for documents
- **API**: GraphQL or REST (evaluate based on team preference)
- **Auth**: OAuth 2.0 / OIDC (Azure AD, Auth0, or similar)
- **DevOps**: GitHub Actions / Azure DevOps / CircleCI
- **Monitoring**: Application Insights / Datadog / New Relic

### 3.4 Security & Compliance

#### **Access Control**
- Role-Based Access Control (RBAC):
  - **Admin**: Full system access (Blueprint leadership, platform admins)
  - **Acquisitions**: Lead intake, feasibility, project management
  - **Design & Entitlement**: Feasibility, permit tracking, consultant coordination
  - **Servicing**: Loan management, draws, servicing workflows
  - **Agent**: Lead submission, project visibility (limited to their deals)
  - **Builder**: Project visibility, draw requests, document access (limited to their projects)
  - **Consultant**: Task-specific access (e.g., surveyor sees survey tasks only)

#### **Data Governance**
- **PII Minimization**: Only collect necessary personal data
- **Purpose Binding**: Data used only for stated business purposes
- **Audit Logging**: All data access and changes logged with user/timestamp
- **Data Retention**: 7-year retention for legal/regulatory compliance

#### **AI Guardrails**
- **Human-in-the-loop**: AI recommendations, not auto-decisions (especially builder scoring, entitlement risk)
- **Explainability**: Show factors behind AI scores/recommendations
- **Fairness checks**: Monitor for bias each release
- **Model monitoring**: Track performance drift, trigger retraining alerts
- **Incident playbook**: Process for model regressions or bad predictions

---

## 4. User Personas & Workflows

### 4.1 Primary Personas

#### **Persona 1: Real Estate Agent (External)**
- **Goal**: Submit high-quality leads quickly, get fast responses, earn front and back-side commissions
- **Pain**: Submitting leads takes effort; unclear what Blueprint needs; delayed responses lose deals
- **Needs**:
  - Simple lead submission (address + basic info)
  - Minute-level acknowledgment
  - Visibility into their submitted deals
  - List-back opportunities when projects are ready
- **Tech Comfort**: Moderate (uses MLS, email, smartphone daily)

#### **Persona 2: Builder (External)**
- **Goal**: Find viable projects, secure financing, track progress, manage draws
- **Pain**: Projects scattered across emails; unclear where things stand; draw requests slow
- **Needs**:
  - See all their projects in one place
  - Track entitlement and loan status
  - Submit draw requests easily
  - Access documents and plans
- **Tech Comfort**: Moderate to high

#### **Persona 3: Acquisitions Specialist (Internal)**
- **Goal**: Vet leads quickly, approve viable deals, reject non-viable, manage feasibility pipeline
- **Pain**: Manual lead review; re-keying data; coordinating consultants; summarizing reports
- **Needs**:
  - Prioritized lead queue (AI-assisted)
  - One-click consultant ordering
  - Document summaries (AI-extracted key points)
  - Fast loan creation (auto-populate from BPO)
- **Tech Comfort**: High (power user)

#### **Persona 4: Entitlement Coordinator (Internal)**
- **Goal**: Get permits approved quickly; minimize city correction cycles; coordinate consultants
- **Pain**: Tracking consultant deliverables across email; correction cycles unpredictable; status buried in SharePoint
- **Needs**:
  - Consultant task management (assign, track SLAs, auto-remind)
  - Permit packet generation (auto-assemble from templates)
  - Correction cycle tracking (city feedback → action items)
  - Status visibility to other teams
- **Tech Comfort**: Moderate to high

#### **Persona 5: Loan Servicing Associate (Internal)**
- **Goal**: Process draws accurately, maintain loan compliance, keep builders and bank informed
- **Pain**: Manual draw review; scattered doc conditions; month-end balancing tedious
- **Needs**:
  - Draw approval workflow (inspection + automated condition checks)
  - Automated alerts (credit staleness, doc expirations)
  - One-click statement generation
  - Bank reporting automation
- **Tech Comfort**: High

#### **Persona 6: Blueprint Leadership (Internal)**
- **Goal**: Visibility into pipeline, performance metrics, growth trends, risk indicators
- **Pain**: Data scattered across systems; manual reporting; lagging indicators
- **Needs**:
  - Real-time dashboards (deals in pipeline, conversion rates, cycle times)
  - Exception alerts (deals stalled, entitlement delays, overdue draws)
  - Trend analysis (market share, builder performance, yield)
- **Tech Comfort**: High

### 4.2 End-to-End Workflow: Lead → Loan → Servicing

```
┌────────────────────────────────────────────────────────────────────────┐
│                          DEAL LIFECYCLE                                 │
└────────────────────────────────────────────────────────────────────────┘

1. LEAD INTAKE (Agent submits, Acquisitions reviews)
   │
   ├─ Agent: Submit lead via web form (address, price, notes)
   │   └─ System: Auto-acknowledge (email/SMS), assign to acquisitions
   │
   ├─ Acquisitions: Review lead in queue (AI-scored/prioritized)
   │   ├─ Quick reject (wrong market, bad zoning, etc.)
   │   └─ Move to Feasibility
   │
   ▼

2. FEASIBILITY (Due diligence, viability assessment)
   │
   ├─ System: Auto-create feasibility record (inherit lead data)
   │
   ├─ Acquisitions: Order consultant reports
   │   ├─ Survey, title, arborist, civil engineering (one-click bulk order)
   │   └─ System: Send requests, track delivery SLAs
   │
   ├─ Consultants: Upload reports to portal
   │   └─ System: AI extracts key data points, flags issues, generates summary
   │
   ├─ Acquisitions: Review findings, create proforma
   │   ├─ If viable → GO (move to entitlement/lending)
   │   └─ If not viable → PASS (notify agent, archive)
   │
   ▼

3. ENTITLEMENT & DESIGN (Permitting, plan development)
   │
   ├─ System: Auto-create entitlement project, notify design team
   │
   ├─ Design Team: Select plan set from library, customize for site
   │   └─ System: Generate feasibility packet (plans + site data)
   │
   ├─ Entitlement Team: Coordinate permit submission
   │   ├─ Assign consultants to tasks (survey revisions, civil drawings, etc.)
   │   ├─ Assemble permit packet (auto-generate from template)
   │   ├─ Submit to city, track review cycles
   │   └─ Manage correction cycles (city feedback → consultant action)
   │
   ├─ System: Update status, notify stakeholders
   │
   ▼

4. LENDING (Loan origination, builder assignment, closing)
   │
   ├─ Acquisitions: Create loan (auto-populated from project data)
   │   ├─ System pulls: Address, borrower info, property details, proforma
   │   └─ Acquisitions reviews/adjusts: Terms, budget, guarantors
   │
   ├─ Acquisitions: Assign builder (AI recommendations: geo, history, capacity)
   │
   ├─ Servicing: Review loan, run audit checks
   │   └─ System: Flag missing docs, stale credit reports, compliance issues
   │
   ├─ Servicing: Generate loan documents
   │   ├─ System: Populate templates from loan data
   │   └─ Send to DocuSign/Authentisign, track signatures
   │
   ├─ Servicing: Fund loan
   │   └─ System: Update status, assign to Columbia Bank borrowing base
   │
   ▼

5. CONSTRUCTION SERVICING (Draws, inspections, payoffs)
   │
   ├─ System: Create monthly draw set (all active construction loans)
   │   └─ Push to iPad inspection app
   │
   ├─ Inspector: Field inspections, photo documentation
   │   └─ Upload to system (nightly sync)
   │
   ├─ Servicing: Review inspections, approve draws
   │   ├─ System: Check doc conditions (credit reports current? insurance valid?)
   │   └─ System: Flag holds (missing lien waiver, inspection fail, etc.)
   │
   ├─ System: Push approved draws to BPO (builder visibility)
   │   └─ Process payments, update loan balances
   │
   ├─ Monthly: Generate statements
   │   └─ System: Auto-generate, email to borrowers
   │
   ├─ Unit Sale: Builder requests payoff quote
   │   └─ System: Calculate payoff (principal + interest + fees), generate quote
   │
   ├─ Payoff: Process reconveyance (release lien)
   │
   ▼

6. CLOSEOUT (Loan paid off, project complete)
   │
   └─ System: Archive loan, update dashboards, capture lessons learned
```

---

## 5. Feature Backlog & Requirements

### 5.1 MVP Scope (Day 1-180)

#### **MVP Priority: Design & Entitlement Module**
**Why this first?**
- **High pain**: Currently using SharePoint, zero integration
- **Clear boundaries**: Well-defined workflows, manageable scope
- **User benefits**: Entitlement team sees immediate value, proves platform foundation
- **Platform validation**: Tests data model, workflow engine, UX framework

**Design & Entitlement MVP Features:**

| Feature | Description | Priority | Complexity | Dependencies |
|---------|-------------|----------|------------|--------------|
| **Project intake from BPO** | Auto-create entitlement project when deal moves to feasibility; inherit project data | P0 | Medium | BPO integration |
| **Consultant management** | Add/edit consultants, assign to tasks, track SLAs | P0 | Low | — |
| **Task workflow** | Create tasks (survey, arborist, civil, etc.), assign, track status, send reminders | P0 | Medium | Workflow engine |
| **Document upload & storage** | Consultants upload reports; team uploads permit packets, city feedback | P0 | Low | Object storage |
| **Permit packet generation** | Template-based packet assembly (plans + reports + forms) | P1 | High | Document service |
| **Correction cycle tracking** | Log city feedback, create action items, track resolution | P1 | Medium | Task workflow |
| **Status dashboard** | Real-time view: projects, tasks, consultant deliverables, permit status | P0 | Low | — |
| **Notifications** | Email/SMS: task assigned, deliverable received, permit approved, etc. | P1 | Low | Notification service |

**Days 1-90 Deliverable:**
- Design & Entitlement MVP pilot launches at Day 90
- Entitlement team (4-6 people) using Connect 2.0 daily
- Temporary integration: Read project data from BPO (API or export), write back status updates

#### **Days 91-180: Rebuild BPO + Connect 1.0 within Connect 2.0**
- **BPO Module**: Lead intake, project tracking, agent/builder portals
- **Connect 1.0 Module**: Loan origination, servicing, draw management
- **Unified Blueprint environment**: All teams on Connect 2.0, legacy systems deprecated

**Full MVP Feature Set (by Day 180):**

### **Module 1: Lead Intake & Management**
| Feature | User Story | Priority | Notes |
|---------|-----------|----------|-------|
| Lead submission form | As an **agent**, I can submit a lead with address, price, notes, attachments | P0 | Mobile-responsive |
| Auto-assignment | As an **acquisitions manager**, leads are auto-assigned based on round-robin or rules | P1 | Configurable rules |
| Lead queue & prioritization | As an **acquisitions specialist**, I see leads prioritized by AI score (viability, urgency) | P1 | AI scoring (post-MVP+) |
| Lead status tracking | As an **agent**, I can see my lead status (received, in review, feasibility, passed, closed) | P0 | Real-time updates |
| Duplicate detection | As an **acquisitions specialist**, system flags duplicate submissions (same address) | P1 | Address normalization |
| Internal notes | As an **acquisitions team**, we can add internal notes not visible to agents | P0 | RBAC |
| Lead analytics | As a **manager**, I see lead conversion funnel, source analysis, cycle times | P2 | Dashboards |

### **Module 2: Feasibility & Due Diligence**
| Feature | User Story | Priority | Notes |
|---------|-----------|----------|-------|
| Feasibility record creation | As a **system**, auto-create feasibility project when lead approved | P0 | Workflow trigger |
| Consultant ordering | As an **acquisitions specialist**, I can order reports (survey, title, arborist) in bulk or selectively | P0 | Email/API to consultants |
| Consultant portal | As a **consultant**, I can view my assigned tasks and upload deliverables | P1 | External user access |
| Document AI extraction | As an **acquisitions specialist**, system auto-extracts key data from reports (tree counts, easements, zoning) | P2 | Azure Document Intelligence |
| Document summarization | As an **acquisitions specialist**, I see AI-generated summaries of title, survey, arborist reports | P2 | GPT-based summarization |
| Proforma builder | As an **acquisitions specialist**, I can create/edit proforma with auto-calculated ROI | P1 | Financial model |
| Viability decision | As an **acquisitions specialist**, I can mark project GO/PASS with notes | P0 | Workflow transition |
| Feasibility dashboard | As a **manager**, I see active feasibility projects, consultant delivery status, cycle times | P1 | Real-time dashboard |

### **Module 3: Entitlement & Design**
| Feature | User Story | Priority | Notes |
|---------|-----------|----------|-------|
| Project auto-creation | As a **system**, create entitlement project when feasibility marked GO | P0 | See MVP above |
| Plan library integration | As a **design team**, I can search/select from 1,500+ plan sets | P1 | Searchable repository |
| Design customization | As a **architect**, I can customize selected plan for site constraints | P2 | CAD integration (future) |
| Consultant task mgmt | As an **entitlement coordinator**, I assign tasks to consultants with deadlines | P0 | See MVP above |
| SLA tracking & alerts | As an **entitlement coordinator**, I get alerts when consultant deliverables are overdue | P1 | Automated reminders |
| Permit packet generation | As an **entitlement coordinator**, I auto-generate permit packet from template | P1 | See MVP above |
| Permit submission tracking | As an **entitlement coordinator**, I log permit submission and track city review | P0 | Status workflow |
| Correction cycle mgmt | As an **entitlement coordinator**, I log city feedback and create action items for consultants | P1 | See MVP above |
| Timeline forecasting | As a **manager**, I see predicted entitlement completion based on historical data | P2 | ML model (post-MVP) |
| Cross-team visibility | As a **servicing team**, I can see entitlement status for my loans | P1 | RBAC + dashboards |

### **Module 4: Lending & Loan Origination**
| Feature | User Story | Priority | Notes |
|---------|-----------|----------|-------|
| Auto loan creation | As an **acquisitions specialist**, I create loan with auto-populated data from project | P0 | BPO → Connect data flow |
| Borrower/guarantor mgmt | As a **servicing team**, I add/edit borrowers, guarantors, relationships | P0 | Contact management |
| Loan terms configuration | As a **servicing team**, I configure loan terms (rate, fees, draw schedule) with defaults | P0 | Rules engine |
| Budget & proforma | As a **servicing team**, I import proforma, track budget vs. actuals | P1 | Financial tracking |
| Audit & validation | As a **servicing team**, system flags missing docs, stale credit reports before funding | P0 | Pre-funding checks |
| Document generation | As a **servicing team**, I generate loan docs from templates, send to e-signature | P0 | DocuSign integration |
| Builder assignment | As an **acquisitions specialist**, I assign builder with AI recommendations | P1 | Builder scoring engine |
| Funding workflow | As a **servicing team**, I mark loan funded, assign to borrowing base | P0 | Workflow transition |

### **Module 5: Servicing & Draws**
| Feature | User Story | Priority | Notes |
|---------|-----------|----------|-------|
| Draw set creation | As a **draw coordinator**, I create monthly draw set (all active loans) | P0 | Automated cycle |
| iPad app integration | As a **draw coordinator**, draw set pushes to iPad inspection app | P0 | API integration (existing app) |
| Inspection upload | As an **inspector**, inspections auto-upload nightly to Connect | P0 | Sync process |
| Draw review dashboard | As a **servicing associate**, I review inspections, check doc conditions, approve/hold draws | P0 | Workflow UI |
| Automated condition checks | As a **system**, auto-check credit reports, insurance, lien waivers; flag issues | P1 | Rules engine |
| Draw approval workflow | As a **servicing associate**, I approve draws, trigger payment processing | P0 | Workflow + accounting integration |
| Builder draw visibility | As a **builder**, I see my draw status (submitted, under review, approved, paid) in BPO | P1 | BPO integration |
| Monthly statements | As a **servicing team**, system auto-generates monthly statements and emails borrowers | P0 | Document generation + email |
| Payoff quote generation | As a **servicing associate**, I generate payoff quote with one click | P0 | Calculation engine |
| Loan modifications | As a **servicing associate**, I create loan modifications/extensions | P1 | Amendment workflow |
| Reconveyance tracking | As a **servicing associate**, I track lien releases when loans pay off | P1 | Status tracking |
| Month-end balancing | As a **servicing team**, system reconciles loan balances with accounting | P1 | Accounting integration |
| Borrowing base reporting | As a **servicing team**, system auto-generates borrowing base report for Columbia Bank | P1 | Bank reporting |

### **Module 6: Contacts & Relationships**
| Feature | User Story | Priority | Notes |
|---------|-----------|----------|-------|
| Contact creation | As a **user**, I create contacts (agents, builders, consultants, borrowers) | P0 | CRM foundation |
| Company/LLC tracking | As a **user**, I track entities (LLCs, partnerships) and link to contacts | P0 | Entity management |
| Relationship mapping | As a **user**, I link contacts to projects, loans, tasks | P0 | Graph relationships |
| Contact history | As a **user**, I see full history: projects, loans, communications, documents | P1 | Activity feed |
| Auto-contact creation | As a **system**, auto-create builder contact when assigned to loan | P1 | Workflow automation |
| Duplicate prevention | As a **system**, flag potential duplicate contacts (name, email, phone match) | P1 | Fuzzy matching |

### **Module 7: Documents & Collaboration**
| Feature | User Story | Priority | Notes |
|---------|-----------|----------|-------|
| Document upload | As a **user**, I upload documents, tag with project/loan/contact | P0 | Object storage |
| Document viewer | As a **user**, I view PDFs, images, plans in-browser | P0 | Browser-based viewer |
| Document versioning | As a **user**, I see document version history | P1 | Version control |
| E-signature integration | As a **servicing team**, I send docs to DocuSign/Authentisign, track completion | P0 | External integration |
| Messaging (internal) | As a **Blueprint user**, I message other team members within project/loan context | P0 | Internal chat |
| Messaging (external) | As a **Blueprint user**, I message agents/builders (shaded conversations) | P0 | External chat |
| Multi-party conversations | As a **Blueprint user**, I loop in additional parties (agents, consultants, builders) | P2 | Group messaging |
| Notification preferences | As a **user**, I configure email/SMS notification preferences | P1 | User settings |

### **Module 8: Analytics & Dashboards**
| Feature | User Story | Priority | Notes |
|---------|-----------|----------|-------|
| Executive dashboard | As a **leader**, I see KPIs: deals in pipeline, conversion rates, cycle times, revenue | P1 | Real-time metrics |
| Acquisitions dashboard | As an **acquisitions manager**, I see lead funnel, feasibility pipeline, bottlenecks | P1 | Team-specific view |
| Entitlement dashboard | As an **entitlement manager**, I see permit status, consultant performance, timelines | P1 | Team-specific view |
| Servicing dashboard | As a **servicing manager**, I see active loans, draw cycle status, delinquencies | P1 | Team-specific view |
| Builder performance | As a **manager**, I see builder scorecards: on-time %, cost variance, quality | P2 | Builder analytics |
| Market trends | As a **leader**, I see market share by region, deal volume trends, yield trends | P2 | Business intelligence |
| Custom reports | As a **user**, I can create ad-hoc reports and export to Excel/CSV | P2 | Report builder |

---

### 5.2 Post-MVP Enhancements (Days 180+)

**AI & Automation Use Cases:**

| Use Case | Description | Value | Complexity |
|----------|-------------|-------|------------|
| **Lead scoring & prioritization** | AI scores incoming leads based on historical data (zoning, price, location, agent quality) | High | Medium |
| **Document intelligence** | Auto-extract key data from title reports, surveys, arborist reports (trees, easements, setbacks) | High | Medium |
| **Document summarization** | GPT-based summaries of long documents (title exceptions, survey findings) | Medium | Low |
| **Entitlement timeline prediction** | ML model predicts permit approval timeline based on jurisdiction, project type, historical data | Medium | High |
| **Builder recommendation** | Recommend builders based on geography, project type, historical performance, current capacity | Medium | Medium |
| **Risk scoring** | Flag high-risk loans based on entitlement delays, budget overruns, inspection failures | High | Medium |
| **Natural language queries** | "Show me all projects in Seattle over $1M stalled in entitlement" | Low | High |
| **Automated consultant selection** | Recommend consultants based on past performance, availability, pricing | Low | Medium |
| **Proforma optimization** | Suggest proforma adjustments to maximize yield while staying market-competitive | Low | High |

**Multi-Tenant Features (Days 180-360):**

| Feature | Description | Timeline |
|---------|-------------|----------|
| **Logical tenant isolation** | Data segregation by client ID | Days 180-270 |
| **Tenant provisioning API** | Programmatic client onboarding | Days 180-270 |
| **Theming & branding** | Client-specific logos, colors | Days 180-270 |
| **Usage metering & billing** | Track usage, generate invoices | Days 270-360 |
| **BYO Identity Provider** | SSO with client's Azure AD / Okta | Days 270-360 |
| **Tenant-scoped AI contexts** | AI models trained on client-specific data | Days 270-360 |
| **Cost controls & limits** | Quota management, rate limiting | Days 270-360 |

---

## 6. Technical Specifications

### 6.1 API Design Principles

**RESTful API Standards:**
- **Versioning**: `/api/v1/...`
- **Authentication**: OAuth 2.0 bearer tokens
- **Pagination**: `?limit=50&offset=0` or cursor-based
- **Filtering**: `?status=pending&city=Seattle`
- **Sorting**: `?sort=created_at:desc`
- **Error responses**: Consistent JSON format with error codes
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid project ID",
      "details": [ ... ]
    }
  }
  ```

**Example API Endpoints:**

**Projects:**
- `GET /api/v1/projects` - List projects (filterable, paginated)
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/{id}` - Get project details
- `PATCH /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Archive project
- `POST /api/v1/projects/{id}/transition` - Change status (lead → feasibility → go)

**Loans:**
- `GET /api/v1/loans` - List loans
- `POST /api/v1/loans` - Create loan
- `GET /api/v1/loans/{id}` - Get loan details
- `PATCH /api/v1/loans/{id}` - Update loan
- `POST /api/v1/loans/{id}/fund` - Fund loan
- `GET /api/v1/loans/{id}/draws` - Get draws for loan
- `POST /api/v1/loans/{id}/draws` - Create draw request

**Documents:**
- `GET /api/v1/documents?project_id={id}` - List documents for project
- `POST /api/v1/documents` - Upload document
- `GET /api/v1/documents/{id}` - Get document metadata
- `GET /api/v1/documents/{id}/download` - Download file
- `DELETE /api/v1/documents/{id}` - Delete document

**Consultants:**
- `GET /api/v1/consultants` - List consultants
- `POST /api/v1/consultants` - Add consultant
- `GET /api/v1/consultants/{id}/tasks` - Get consultant's tasks
- `POST /api/v1/tasks` - Create task (assign to consultant)

### 6.2 Data Model (Conceptual)

**Core Entities:**

```
Project
├─ id (UUID)
├─ address (string)
├─ city (string)
├─ state (string)
├─ zip (string)
├─ parcel_number (string)
├─ status (enum: LEAD, FEASIBILITY, GO, PASS, CLOSED)
├─ purchase_price (decimal)
├─ list_price (decimal)
├─ submitted_by (FK: Contact - agent)
├─ assigned_to (FK: User - acquisitions specialist)
├─ assigned_builder (FK: Contact - builder)
├─ created_at (timestamp)
├─ updated_at (timestamp)
├─ metadata (JSON)
│
├── Feasibility
│   ├─ id (UUID)
│   ├─ project_id (FK: Project)
│   ├─ proforma (JSON)
│   ├─ viability_score (decimal)
│   ├─ go_decision_date (date)
│   ├─ decision_notes (text)
│   ├─ Consultant Tasks []
│   │   ├─ consultant_id (FK: Contact)
│   │   ├─ task_type (enum: SURVEY, TITLE, ARBORIST, CIVIL, etc.)
│   │   ├─ status (enum: ORDERED, IN_PROGRESS, DELIVERED, APPROVED)
│   │   ├─ due_date (date)
│   │   ├─ delivered_date (date)
│   │   └─ document_id (FK: Document)
│   └─ ...
│
├── Entitlement
│   ├─ id (UUID)
│   ├─ project_id (FK: Project)
│   ├─ selected_plan_id (FK: PlanLibrary)
│   ├─ permit_number (string)
│   ├─ submitted_date (date)
│   ├─ approved_date (date)
│   ├─ status (enum: PLANNING, SUBMITTED, UNDER_REVIEW, CORRECTIONS, APPROVED)
│   ├─ Permit Corrections []
│   │   ├─ correction_number (int)
│   │   ├─ city_feedback (text)
│   │   ├─ action_items (JSON)
│   │   ├─ resolved_date (date)
│   └─ ...
│
└── Documents []
    ├─ id (UUID)
    ├─ project_id (FK: Project)
    ├─ loan_id (FK: Loan - nullable)
    ├─ type (enum: SURVEY, TITLE, ARBORIST, PROFORMA, PLAN, PERMIT, INSPECTION, etc.)
    ├─ filename (string)
    ├─ storage_url (string)
    ├─ uploaded_by (FK: User)
    ├─ uploaded_at (timestamp)
    ├─ extracted_data (JSON - AI extracted fields)
    └─ summary (text - AI generated)

Loan
├─ id (UUID)
├─ loan_number (string - unique)
├─ project_id (FK: Project)
├─ status (enum: PENDING, APPROVED, FUNDED, SERVICING, PAID_OFF, DEFAULT)
├─ borrower_id (FK: Contact)
├─ guarantors [] (FK: Contact)
├─ property_address (string - denormalized for speed)
├─ loan_amount (decimal)
├─ interest_rate (decimal)
├─ term_months (int)
├─ closing_date (date)
├─ maturity_date (date)
├─ budget (JSON)
├─ assigned_to_bank (FK: BankAccount - e.g., Columbia Bank)
├─ Draws []
│   ├─ draw_number (int)
│   ├─ requested_amount (decimal)
│   ├─ approved_amount (decimal)
│   ├─ status (enum: PENDING, APPROVED, PAID, HELD)
│   ├─ inspection_id (FK: Inspection)
│   ├─ conditions_met (boolean)
│   ├─ notes (text)
│   └─ ...
├─ Statements []
│   ├─ statement_date (date)
│   ├─ beginning_balance (decimal)
│   ├─ draws (decimal)
│   ├─ payments (decimal)
│   ├─ ending_balance (decimal)
│   ├─ document_id (FK: Document)
└─ ...

Contact
├─ id (UUID)
├─ type (enum: AGENT, BUILDER, CONSULTANT, BORROWER, GUARANTOR, SPONSOR)
├─ first_name (string)
├─ last_name (string)
├─ company_name (string)
├─ email (string)
├─ phone (string)
├─ address (JSON)
├─ entities [] (FK: Entity - LLCs, partnerships)
├─ created_at (timestamp)
└─ ...

Task
├─ id (UUID)
├─ title (string)
├─ description (text)
├─ assigned_to (FK: User or Contact)
├─ project_id (FK: Project - nullable)
├─ loan_id (FK: Loan - nullable)
├─ due_date (date)
├─ status (enum: PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
├─ priority (enum: LOW, MEDIUM, HIGH, URGENT)
├─ created_by (FK: User)
└─ ...

User
├─ id (UUID)
├─ email (string - unique)
├─ role (enum: ADMIN, ACQUISITIONS, DESIGN, ENTITLEMENT, SERVICING, MANAGER)
├─ first_name (string)
├─ last_name (string)
├─ phone (string)
├─ created_at (timestamp)
├─ last_login (timestamp)
└─ ...
```

### 6.3 Workflow State Machines

**Project Status Workflow:**
```
LEAD ──────► FEASIBILITY ──────► GO ──────► FUNDED ──────► SERVICING ──────► CLOSED
              │                    │
              └───► PASS           └───► WITHDRAWN
```

**Loan Status Workflow:**
```
PENDING ──► APPROVED ──► FUNDED ──► SERVICING ──► PAID_OFF
              │            │           │
              └─► REJECTED └─► CANCELLED └─► DEFAULT
```

**Entitlement Status Workflow:**
```
PLANNING ──► SUBMITTED ──► UNDER_REVIEW ──► CORRECTIONS ──► APPROVED
                                                │                │
                                                └────(loop)──────┘

                                            DENIED
```

**Draw Status Workflow:**
```
REQUESTED ──► INSPECTION_SCHEDULED ──► INSPECTION_COMPLETE ──► REVIEW ──► APPROVED ──► PAID
                                                                    │
                                                                    └──► HELD
```

### 6.4 Integration Specifications

**Integration 1: BPO ↔ Connect 2.0**
- **Phase 1 (Days 1-90)**: Temporary integration
  - **Read**: Connect 2.0 reads project data from BPO (API or scheduled export)
  - **Write**: Connect 2.0 writes status updates back to BPO (API)
- **Phase 2 (Days 91-180)**: BPO rebuilt within Connect 2.0
  - BPO becomes a module of Connect 2.0
  - Shared data model, no integration needed

**Integration 2: iPad Inspection App**
- **Direction**: Bi-directional
- **Method**: REST API
- **Flow**:
  1. Connect 2.0 creates draw set → API pushes to iPad app
  2. Inspector completes inspections → iPad app uploads via API (nightly sync)
  3. Connect 2.0 processes uploaded inspections, updates draw status

**Integration 3: DocuSign / Authentisign**
- **Direction**: Outbound (Connect 2.0 → E-signature service)
- **Method**: DocuSign REST API / Authentisign API
- **Flow**:
  1. Connect 2.0 generates loan documents (PDF)
  2. API sends to DocuSign with signer info
  3. Webhook receives completion notification
  4. Connect 2.0 downloads signed documents, attaches to loan

**Integration 4: Accounting System**
- **Direction**: Bi-directional (tbd based on accounting platform)
- **Method**: API or file export (depends on accounting system)
- **Flow**:
  1. Connect 2.0 exports loan balances, draw payments (monthly or real-time)
  2. Accounting system imports for reconciliation
  3. (Optional) Accounting pushes GL data back for reporting

**Integration 5: Document Intelligence (AI Services)**
- **Direction**: Outbound (Connect 2.0 → Azure Document Intelligence / GPT)
- **Method**: Azure SDK / OpenAI API
- **Flow**:
  1. Document uploaded to Connect 2.0
  2. Trigger async job: send document to Azure Document Intelligence
  3. Extract key-value pairs (e.g., "Tree count: 12", "Easement: 10ft utility")
  4. Store extracted data in `documents.extracted_data` (JSON)
  5. (Optional) Generate summary using GPT, store in `documents.summary`

**Integration 6: Email / SMS Notifications**
- **Direction**: Outbound (Connect 2.0 → Email/SMS service)
- **Method**: SendGrid / Twilio / Azure Communication Services
- **Flow**:
  - Event triggers notification (task assigned, document uploaded, draw approved)
  - System generates email/SMS from template
  - API sends notification
  - Track delivery status

---

## 7. Data Model & Migration Strategy

### 7.1 Source of Truth Transitions

**Current State:**
- **BPO**: Source of truth for leads, projects (Firebase)
- **Connect 1.0**: Source of truth for loans, servicing (Filemaker)
- **SharePoint**: Source of truth for feasibility, entitlement (M365)

**Target State:**
- **Connect 2.0**: Single source of truth for everything

**Migration Phasing:**

**Phase 1 (Days 1-90): Design & Entitlement MVP**
- **Source of Truth**: Connect 2.0 becomes authoritative for Design & Entitlement at pilot cutover
- **BPO/Connect 1.0**: Remain authoritative for their domains during this phase
- **Migration**: SharePoint entitlement data → Connect 2.0
  - Migrate active projects only (not entire archive)
  - Estimated: 50-100 active entitlement projects
  - Documents migrated to Connect 2.0 object storage

**Phase 2 (Days 91-180): BPO + Connect 1.0 Rebuild**
- **BPO Migration**: All projects, contacts, messages → Connect 2.0
  - Firebase export → ETL → Connect 2.0 PostgreSQL
  - Documents in Firebase storage → Connect 2.0 object storage
- **Connect 1.0 Migration**: All loans, draws, servicing history → Connect 2.0
  - Filemaker export → ETL → Connect 2.0 PostgreSQL
  - Connect 1.0 documents → Connect 2.0 object storage
- **Cutover**: Phased by team (acquisitions first, then servicing)
- **Shadow Period**: ≥2 weeks running dual systems (read from Connect 2.0, write to both)
- **Final Cutover**: BPO & Connect 1.0 become read-only archives

### 7.2 Data Quality Gates

**Before Cutover, Data Must Pass:**

| Quality Check | Description | Threshold |
|---------------|-------------|-----------|
| **Completeness** | All required fields populated (addresses, loan amounts, etc.) | 100% |
| **Referential Integrity** | All foreign keys valid (project → loan, loan → contact, etc.) | 100% |
| **Duplicate Rate** | No duplicate projects (same address) or contacts (same email) | <1% |
| **Business Rules** | Loan amounts > 0, interest rates within range, dates logical | 100% |
| **Document Links** | All documents accessible, no broken storage URLs | 99% |

### 7.3 Migration Process

**Step 1: Inventory & Mapping**
- Document all source tables/collections
- Map source fields → target data model
- Identify transformations needed (e.g., status code conversions)

**Step 2: Dry-Run Migration**
- Run migration scripts in staging environment
- Validate data quality gates
- Load test with migrated data

**Step 3: Shadow Period**
- Connect 2.0 live in READ mode (users can view data)
- Writes still go to legacy systems
- Nightly sync: Legacy → Connect 2.0
- Validate data consistency

**Step 4: Phased Cutover**
- **Week 1**: Entitlement team switches to write mode
- **Week 2**: Acquisitions team switches
- **Week 3**: Servicing team switches
- Monitor for issues, rollback plan ready

**Step 5: Decommission & Archive**
- Legacy systems become read-only
- Archive exports (7-year retention per legal requirements)
- Sunset legacy systems after 90-day validation period

### 7.4 Rollback Plan

**Trigger Criteria:**
- Data loss or corruption detected
- System downtime > 2 hours
- Critical bugs preventing core workflows
- User adoption < 50% after 2 weeks

**Rollback Steps:**
1. Announce rollback to users (< 30 min notice)
2. Pause all writes to Connect 2.0
3. Re-enable writes to legacy systems
4. Sync any Connect 2.0-only data back to legacy (manual if needed)
5. Revert DNS / load balancer to legacy systems
6. **Target: Executable within 2 hours**

### 7.5 Data Lineage & Telemetry

**Lineage Tracking:**
- Every migrated record tagged with: `source_system`, `source_id`, `migrated_at`
- Example: `{"source_system": "bpo_firebase", "source_id": "proj_abc123", "migrated_at": "2025-11-15T10:30:00Z"}`
- Enables traceability and troubleshooting

**Change Data Capture:**
- All updates logged: `user_id`, `timestamp`, `field_changed`, `old_value`, `new_value`
- Audit trail for compliance and debugging

---

## 8. MVP Scope & Phasing

### 8.1 Timeline Overview

**0-30 Days: Foundation & Planning**
- Establish governance and success metrics
- Select hosting platform (Azure / AWS / GCP)
- Stand up base infrastructure and DevOps
- Define initial data model and system boundaries
- Begin journey mapping and JTBD analysis (Design & Entitlement focus)
- Define Blueprint Operating System framework
- Early UX concepting

**31-60 Days: Development Begins**
- Full development of Connect 2.0 MVP (data model, APIs, workflow engine, UI)
- UX design sprints for Design & Entitlement
- Establish temporary integrations with BPO (read project data, write status)
- Implement initial workflow automation
- Conduct market and customer segmentation analysis (GTM track)

**61-90 Days: MVP Pilot Launch**
- Finalize UI and workflow for Design & Entitlement
- Migrate active entitlement projects from SharePoint → Connect 2.0
- Launch Design & Entitlement MVP pilot at Day 90
- Defined success metrics and feedback loops
- Validate leadership alignment on operating model

**91-180 Days: Full Platform Buildout**
- Extend journey mapping to remaining Blueprint teams
- Execute and measure pilot performance
- Iterate UX and workflows based on feedback
- Rebuild BPO (Blueprint Online) within Connect 2.0
- Rebuild Connect 1.0 servicing module within Connect 2.0
- Harden architecture and data model for scale
- Introduce initial AI-enabled features
- Finalize Datapage GTM and investment strategy

**Post-180 Days: Scale & Enhance**
- Institutionalize Blueprint Operating System
- Transition engineering to steady-state operations
- Build on MVP foundation: expand AI capabilities, deeper automation
- Multi-tenant roadmap (Days 180-360)
- Move GTM from planning to execution (investor/partner outreach)

### 8.2 Decision Gates

**Gate 1 — Architecture & Alignment (Day 30)**
- **Purpose**: Confirm technical and operating foundation before major build spend
- **Criteria**:
  - Architecture and hosting platform selected and documented
  - Blueprint Operating System v1 framework outlined and approved
  - Initial backlog and resourcing validated
  - Cumulative spend ≤ $X (tbd)
- **Decision**: Go or Hold for Day-31 build commencement

**Gate 2 — Pilot Validation (Day 90)**
- **Purpose**: Ensure pilot delivers measurable business value before full-scale development
- **Criteria**:
  - Design & Entitlement MVP live in production
  - At least 3 of 4 core KPIs met or trending positive:
    - Speed (cycle time reduction)
    - Adoption (user engagement)
    - Quality (data accuracy)
    - Stability (uptime, reliability)
  - Feedback loop and backlog for next increment established
- **Decision**: Release next funding tranche ($Y) and proceed with full platform build-out

**Gate 3 — Scale Readiness (Day 180)**
- **Purpose**: Confirm unified platform and organizational readiness for scale-out
- **Criteria**:
  - Unified Blueprint environment operational (BPO and Connect 1.0 rebuilt within 2.0)
  - User adoption ≥ 85% across pilot roles
  - Reliability ≥ 99.5%; core automation stable
  - Sustained-engineering backlog and post-MVP plan approved
- **Decision**: Authorize scale-out and broader commercialization

### 8.3 Success Criteria (Day 180)

**Blueprint Operating System v1 (Enterprise Scope):**
- Complete first version of company-wide operating system
- Principles, processes, roles, decision rights, performance measures defined
- Leadership routines initiated
- Adoption underway across organization
- Ready for iterative refinement post-MVP

**Connect 2.0 Platform MVP (Unified Blueprint Baseline):**
- Unified platform ready to pilot
- Design & Entitlement live at Day 90
- MVP versions of BPO and Connect 1.0 complete at Day 180
- Core automation operational
- Further functionality prioritized based on user feedback

**Validated Datapage Business & Investment Model (MVP):**
- Clear commercial and investment framework
- Financial model grounded in real build economics
- Product-market positioning and pricing approach defined
- Investor/partner-ready narrative linking Blueprint outcomes, Connect 2.0, and Datapage growth

**Sustained Engineering Backlog:**
- Prioritized backlog for post-MVP enhancements documented
- Approved by Program Leadership Team
- Clear runway for continuous improvement

---

## 9. Integration Points

### 9.1 External System Integrations

| System | Direction | Method | Data Exchanged | Frequency |
|--------|-----------|--------|----------------|-----------|
| **BPO (Phase 1)** | Bi-directional | REST API | Project data (read), Status updates (write) | Real-time |
| **iPad Inspection App** | Bi-directional | REST API | Draw sets (out), Inspections (in) | Daily (nightly sync) |
| **DocuSign / Authentisign** | Outbound + Webhook | REST API | Loan documents (out), Signed docs (in) | Per transaction |
| **Accounting System** | Bi-directional | API or File Export | Loan balances, payments, GL data | Monthly or real-time |
| **Azure Document Intelligence** | Outbound | Azure SDK | Documents (out), Extracted data (in) | Per document upload |
| **GPT / OpenAI** | Outbound | OpenAI API | Documents (out), Summaries (in) | Per document upload |
| **Email Service** | Outbound | SendGrid / SES / Azure Comm | Notifications, statements | Real-time |
| **SMS Service** | Outbound | Twilio / Azure Comm | Alerts, notifications | Real-time |

### 9.2 Internal Module Integrations

All modules share unified data model and communicate via:
- **Shared database**: Direct table access (for reads)
- **Internal APIs**: For writes and cross-module operations
- **Event bus**: For async workflows (e.g., loan funded → trigger draw set creation)

**Example Event Flow:**
```
Project status → GO
   ↓
[Event: PROJECT_APPROVED]
   ↓
Entitlement Module: Auto-create entitlement record
Lending Module: Enable loan creation
Notification Service: Alert design team
```

---

## 10. AI & Automation Opportunities

### 10.1 High-Priority AI Use Cases (Post-MVP)

**1. Document Intelligence & Extraction**
- **Technology**: Azure Document Intelligence (Form Recognizer)
- **Input**: Title reports, surveys, arborist reports (PDFs)
- **Output**: Structured JSON with key-value pairs
  - Survey: Lot size, easements, setbacks, encroachments
  - Title: Liens, exceptions, legal description
  - Arborist: Tree count, protected species, removal restrictions
- **Value**: Eliminate 30-60 min/document of manual review
- **Complexity**: Medium (requires training custom models on Blueprint documents)

**2. Document Summarization**
- **Technology**: GPT-4 (Azure OpenAI or OpenAI API)
- **Input**: Long documents (title reports, entitlement applications)
- **Output**: Executive summary (3-5 bullet points)
- **Value**: Faster review, highlights for non-experts
- **Complexity**: Low (prompt engineering, no training needed)

**3. Lead Scoring & Prioritization**
- **Technology**: ML classification model (scikit-learn, XGBoost, or Azure ML)
- **Input**: Lead attributes (address, price, agent, zoning, market, photos)
- **Output**: Viability score (0-100), Priority (High/Medium/Low)
- **Training Data**: Historical leads (3,200/year) with outcomes (GO/PASS)
- **Features**: Zoning, lot size, price per sq ft, distance to similar projects, agent quality
- **Value**: Route high-value leads first, auto-reject obvious non-fits
- **Complexity**: Medium (requires feature engineering, model training, ongoing tuning)

**4. Entitlement Timeline Forecasting**
- **Technology**: ML regression model or time-series forecasting
- **Input**: Project attributes (jurisdiction, project type, plan complexity, historical correction cycles)
- **Output**: Predicted timeline (e.g., "Permit approval in 120-150 days")
- **Training Data**: Historical entitlement projects with actual timelines
- **Value**: Better project planning, early risk identification
- **Complexity**: High (need sufficient historical data, jurisdiction-specific models)

**5. Builder Recommendation Engine**
- **Technology**: Collaborative filtering or rule-based recommendation
- **Input**: Project (location, type, budget), Builder attributes (geo, history, capacity, performance)
- **Output**: Ranked list of recommended builders with scores
- **Value**: Faster builder assignment, optimize builder utilization
- **Complexity**: Medium (requires builder performance data capture)

**6. Risk Scoring & Early Warnings**
- **Technology**: ML anomaly detection or rule-based alerts
- **Input**: Loan attributes, entitlement delays, budget variance, inspection failures
- **Output**: Risk score (0-100), Alert if high risk
- **Value**: Proactive intervention, maintain zero-default track record
- **Complexity**: Medium (requires defining risk factors, tuning thresholds)

### 10.2 Automation Opportunities (No AI Required)

**1. Consultant Ordering Automation**
- **Current**: Acquisitions manually emails consultants
- **Future**: One-click bulk order → automated emails with project details
- **Value**: Save 10-15 min per project

**2. Loan Auto-Population**
- **Current**: Manually re-key BPO data into Connect
- **Future**: Click "Create Loan" in BPO → auto-populates loan form in Connect
- **Value**: Save 15-30 min per loan, eliminate errors

**3. Draw Condition Checks**
- **Current**: Manually check credit reports, insurance, lien waivers
- **Future**: Automated checks with visual flags (green/yellow/red)
- **Value**: Save 30-60 min per draw set, reduce holds

**4. Monthly Statement Generation**
- **Current**: Manual process
- **Future**: Automated generation + email delivery
- **Value**: Save 2-3 hours/month

**5. Permit Packet Assembly**
- **Current**: Manually compile documents into PDF
- **Future**: Template-based generation (drag-drop docs → PDF)
- **Value**: Save 1-2 hours per submission

**6. Task & Notification Automation**
- **Current**: Manual emails and phone calls to track consultant deliverables
- **Future**: Automated task creation, due date reminders, escalation alerts
- **Value**: Reduce coordination overhead by 50%

---

## Appendices

### Appendix A: Glossary

- **BPO (Blueprint Online)**: Web application for lead intake and project tracking; built on Firebase
- **Connect 1.0**: Legacy loan origination and servicing platform; built on Filemaker
- **Connect 2.0**: Next-generation unified platform being built; replaces BPO, Connect 1.0, SharePoint
- **Blueprint**: Operating company (Seattle, Phoenix); Client Zero for Connect 2.0
- **Datapage**: Platform company owning Connect 2.0 and Blueprint Operating System IP
- **Client Zero**: First live implementation of a platform (Blueprint for Connect 2.0)
- **Frontier Firm**: Company designed from day one to embed data, AI, and structured decision-making
- **OGSM**: Strategy framework (Objectives, Goals, Strategies, Measures)
- **Feasibility**: Due diligence phase (3-30 days) evaluating project viability
- **Entitlement**: Permitting process to secure municipal approvals for development
- **Servicing**: Loan management after funding (draws, inspections, payments, payoffs)
- **Draw**: Construction loan disbursement based on work completed
- **Reconveyance**: Lien release when loan is paid off
- **Borrowing Base**: Loans assigned to Blueprint's bank line of credit (Columbia Bank)
- **Proforma**: Financial projection (costs, revenue, ROI) for a project
- **Progressive Profiling**: Accumulating information across deal lifecycle, not static snapshots

### Appendix B: Team Contacts

**Blueprint / Datapage Leadership:**
- **Darin**: Co-owner (Blueprint & Datapage), CEO
- **Mark**: Co-owner (Blueprint & Datapage), Product Owner

**Intelligent Agency (Delivery Partner):**
- **Nick**: Program Lead
- **Paul**: Executive Sponsor (IA-side)
- **Lisa**: GTM Strategy Lead
- **Jason**: Business Model Lead

### Appendix C: Key Assumptions & Dependencies

**Assumptions:**
- Hosting platform selected by Day 14
- Blueprint leadership commits 2-6 hrs/week for validation sessions
- SeedCode transitions to support-only SLA as planned
- Read access to production data by Day 5
- Core delivery roles remain consistent across both 90-day increments

**Dependencies:**
- BPO API availability (or export mechanism) for temporary integration
- iPad inspection app API documented and accessible
- DocuSign / Authentisign API credentials and onboarding
- Accounting system integration method determined (API vs. file export)
- Azure / AWS / GCP decision by Day 14 unlocks infrastructure setup

### Appendix D: Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Hosting platform decision delayed** | Infrastructure setup blocked | Fast-track decision in Week 1; pre-evaluate options |
| **Data migration issues** | Cutover delays, data loss | Dry-run migrations, shadow period, rollback plan |
| **User adoption < target** | Platform not used, ROI missed | Change management, training, leadership sponsorship |
| **Scope creep** | Timeline/budget overruns | Disciplined MVP scope, Gate 2 decision point |
| **Vendor dependencies** | Integration delays | Early API testing, fallback plans (manual processes) |
| **Key personnel turnover** | Knowledge loss, velocity drop | Documentation, cross-training, redundancy |
| **AI model performance** | Predictions inaccurate, low trust | Human-in-loop, confidence thresholds, ongoing tuning |

---

## Next Steps

**Immediate Actions (Next 2 Weeks):**
1. **Review & Validate**: Blueprint/Datapage leadership reviews this PRD, provides feedback
2. **Cloud Provider Decision**: Evaluate Azure/AWS/GCP, select by Day 14
3. **Kick-Off Workshop**: Align on MVP scope, success criteria, team roles
4. **Infrastructure Setup**: Spin up cloud environment, DevOps pipeline
5. **Detailed Backlog Grooming**: Break down MVP features into user stories with acceptance criteria
6. **Journey Mapping Sessions**: Begin with Design & Entitlement team (Day 1-30 focus)

**Questions to Resolve:**
- Exact hosting platform and database choice?
- Preferred frontend framework (React vs. Vue)?
- Backend language/framework (Node.js vs. Python)?
- Current BPO API capabilities (or need for export-based temporary integration)?
- iPad inspection app API documentation available?
- Accounting system details (which platform, API or file export)?

---

**Document Status:** Draft v1.0 - Ready for Leadership Review
**Last Updated:** November 5, 2025
**Next Review:** After leadership feedback, before Day-14 kickoff
