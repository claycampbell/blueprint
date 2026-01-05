# Blueprint Value Streams - Executive View

**Version:** 3.4
**Date:** January 3, 2026
**Status:** Current State (As-Is)

This document provides a comprehensive overview of Blueprint's end-to-end business value streams, from lead intake through loan closeout and builder accounting. It maps the customer journey, system responsibilities, and key decision gates.

## Visual Diagram

Source: [Blueprint_Value_Streams_(exec view)_v3_4.pdf](Blueprint_Value_Streams_(exec view)_v3_4.pdf)

## Overview

Blueprint's business operates as a **sequential pipeline** with seven distinct value streams, each with its own system ownership and outputs. The workflow follows a deal from initial lead through construction completion and loan payoff.

### High-Level Flow

```
Lead (New) → In Contract → Go Decision → Permit Ready → Construction Loan → Payoff → Builder Accounting
```

### Key Decision Gates

1. **Go/No-Go Decision** (after VS2): Determines if feasibility analysis supports moving forward
2. **Permit Ready Check** (after VS3): Determines if project goes to construction loan or conditional land loan
3. **Permit Approved** (after VS4.5/VS4.6): Activates construction loan and begins draw cycles

---

## Value Stream Details

### VS1: Lead Intake, Discovery & Screening
**System:** BPO (Blueprint Online)
**Purpose:** Capture inbound leads from agents, normalize data, and perform initial screening before feasibility
**Status Transition:** → **Lead (New)** → **In Contract**

**Key Activities:**
- Capture inbound leads from real estate agents
- Normalize lead data (property details, contact info, preliminary financials)
- Initial screening and qualification
- Transition to contract status

**Inputs:**
- Agent-submitted property opportunities
- Market referrals
- Direct inquiries

**Outputs:**
- **Lead (New)**: Qualified lead record in BPO
- **In Contract**: Property under contract, ready for feasibility

**System Capabilities:**
- Lead form submission
- Data normalization
- Basic property screening
- Status tracking

**Pain Points (Current State):**
- Manual data entry from various sources
- No automated lead scoring
- Limited integration with external data sources

---

### VS2: Feasibility, Due Diligence & Consultant Coordination
**System:** BPO (Blueprint Online)
**Purpose:** Perform deep feasibility analysis while in contract, coordinate consultants, assign permanent project number, and determine Go/No-Go decision
**Status Transition:** **In Contract** → **Go Decision Made**

**Key Activities:**
- Deep feasibility analysis (zoning, environmental, title, surveys)
- Consultant coordination (architects, engineers, environmental specialists)
- Financial proforma development
- Risk assessment and underwriting review
- **Critical Decision Gate:** Go/No-Go decision

**Inputs:**
- Lead data from VS1
- Property due diligence documents
- Consultant reports (preliminary)
- Market analysis

**Outputs:**
- **Go Decision Made**: Approved project assigned permanent project number
- Feasibility packet assembled
- Initial proforma

**System Capabilities:**
- Feasibility checklist tracking
- Consultant management
- Document repository
- Project number assignment

**Pain Points (Current State):**
- 3-30 day cycle time (target: -50% reduction in Connect 2.0)
- Manual packet assembly
- No centralized consultant coordination
- Disconnected from SharePoint entitlement tracking

**Key Deliverables:**
- Feasibility summary report
- Go/No-Go recommendation
- Assigned project number
- Budget estimate

---

### VS3: Design & Entitlement (Permitting)
**System:** SharePoint
**Purpose:** Transform assigned properties from schematic design through permit-ready status by creating architectural plans, coordinating consultants, and securing municipal approvals for construction
**Status Transition:** **Go Decision Made** → **Permit (approved)** OR → **Permit Ready?** (conditional)

**Key Activities:**
- Schematic design to construction documents
- Architectural plan development
- Consultant coordination (civil, structural, MEP, landscape)
- Municipal permitting process
- Entitlement approval acquisition
- Building permit application and approval

**Inputs:**
- Approved feasibility analysis from VS2
- Property due diligence documents
- Zoning regulations and codes
- Municipal requirements

**Outputs:**
- **Permit (approved)**: Fully entitled project ready for construction
- **Permit Ready?**: Decision gate - if permit not yet secured, may proceed to VS4.5 (land loan)
- Construction-ready plans
- Approved entitlements

**System Capabilities (SharePoint):**
- Document management
- Entitlement tracking
- Consultant deliverable management
- Municipal submission tracking

**Pain Points (Current State):**
- No integration with BPO or Connect 1.0
- Manual status updates
- 50% cycle time reduction target for submission prep
- Consultant coordination bottlenecks

**Key Deliverables:**
- Stamped architectural plans
- Approved building permits
- Site plans and engineering documents
- Municipal approval letters

---

### VS4: Underwriting, Loan Structuring, Documentation & Builder Assignment
**System:** Connect (Connect 1.0)
**Purpose:** Structure construction loan terms, create builder-specific deal packages, match projects to qualified builders, complete underwriting and loan documentation (happens parallel to VS3 entitlement process)
**Status Transition:** **Go Decision Made** → [runs parallel to VS3] → **Permit Ready?** decision gate

**Key Activities:**
- Construction loan term structuring
- Builder qualification and matching
- Deal package creation (builder-specific)
- Underwriting analysis and approval
- Loan documentation preparation
- Builder assignment

**Inputs:**
- Approved project from VS2
- Builder database and qualifications
- Market comps and financial data
- Risk assessment criteria

**Outputs:**
- Structured loan terms
- Builder-specific deal packages
- Underwriting approval
- Loan documentation (ready for closing)

**System Capabilities (Connect 1.0):**
- Loan structuring tools
- Builder database management
- Underwriting workflows
- Document generation

**Pain Points (Current State):**
- Runs on legacy Filemaker platform
- No real-time integration with SharePoint (VS3) or BPO (VS2)
- Builder scoring done manually
- Document templates require manual updates

**Key Deliverables:**
- Loan term sheet
- Builder assignment
- Underwriting approval memo
- Loan agreement drafts

**Parallel Execution:**
This value stream runs **concurrently with VS3** (Design & Entitlement). While the property moves through permitting, the loan structuring and builder assignment proceed in parallel to minimize time-to-close.

---

### VS4.5: Land Loan (Conditional) Consultant Coordination
**System:** Connect 1.0
**Purpose:** Close on property acquisition when permit is not yet secured; provides interim financing to hold land until Design & Entitlement (VS3) completes and construction loan can be activated
**Status Transition:** **Permit Ready? → No** → **Land Loan (active)**

**Key Activities:**
- Conditional land loan closing
- Interim financing activation
- Hold property during permitting
- Consultant coordination continues
- Monitor entitlement progress

**Inputs:**
- Project not yet permit-approved (from VS3)
- Completed underwriting from VS4
- Land acquisition requirements
- Builder commitment (or pending)

**Outputs:**
- **Land Loan (active)**: Interim financing secured
- Property secured for entitlement completion
- Continued consultant coordination

**System Capabilities:**
- Land loan management
- Interim financing tracking
- Transition to construction loan (once permit approved)

**Pain Points (Current State):**
- Complex transition from land loan to construction loan
- Manual tracking of permit status
- Risk of extended land hold periods

**Key Deliverables:**
- Land loan closing documents
- Interim financing agreement
- Transition plan to construction loan

**Decision Logic:**
- **If Permit Approved:** Proceed directly to VS4.6 (Construction Loan Closing)
- **If Permit NOT Approved:** Activate land loan, continue entitlement work, then proceed to VS4.6 when permit secured

---

### VS4.6: Construction Loan Closing
**System:** Connect 1.0
**Purpose:** Execute final loan closing activities once permit is secured and all underwriting conditions are satisfied. This includes final audit verification, loan document generation, signature collection, fund disbursement, and assignment to the bank borrowing base.
**Status Transition:** **Permit (approved)** → **Construction Loan (active)**

**Key Activities:**
- Final audit verification (permits, entitlements, conditions satisfied)
- Loan document finalization
- Signature collection (borrower, lender, guarantors)
- Fund disbursement (initial draw)
- Assignment to bank borrowing base (Columbia Bank)
- Activate loan in servicing system

**Inputs:**
- Approved permit from VS3
- Completed loan documentation from VS4
- Satisfied underwriting conditions
- Builder assignment confirmed

**Outputs:**
- **Construction Loan (active)**: Fully closed construction loan
- Loan assigned to borrowing base
- Initial funds disbursed
- Loan entered into servicing (VS5)

**System Capabilities:**
- Loan closing workflow
- Document execution tracking
- Fund disbursement
- Borrowing base assignment
- Servicing activation

**Pain Points (Current State):**
- Manual document collection and verification
- Time lag between permit approval and closing
- Borrowing base assignment requires manual coordination

**Key Deliverables:**
- Executed loan documents
- Disbursed funds (initial draw)
- Borrowing base assignment confirmation
- Loan servicing activation

**Critical Handoff:**
This is the **gateway to active construction servicing (VS5)**. Once the construction loan closes, the project transitions from origination to servicing.

---

### VS5: Construction Servicing, Draws & Inspections
**System:** Connect 1.0
**Purpose:** Manage active construction loans through monthly draw cycles, field inspections, and fund disbursements (includes internal monthly GL reconciliation and REIT financial reporting)
**Status Transition:** **Construction Loan (active)** → **Draw (funded)** [repeating cycle]

**Key Activities:**
- Monthly draw request processing
- Field inspections (verify work completed)
- Fund disbursement approvals
- Loan balance tracking
- Monthly GL reconciliation
- REIT financial reporting
- Construction progress monitoring
- Budget variance tracking

**Inputs:**
- Active construction loan from VS4.6
- Draw requests from builders
- Inspection reports from field staff
- Monthly financial statements

**Outputs:**
- **Draw (funded)**: Recurring monthly fund disbursements
- Inspection reports
- Updated loan balances
- Monthly financial reports (internal and REIT)

**System Capabilities:**
- Draw request management
- Inspection scheduling and reporting
- Fund disbursement workflow
- GL reconciliation
- Financial reporting (monthly)

**Pain Points (Current State):**
- -60% average draw turnaround time target (Connect 2.0)
- Manual inspection scheduling
- Spreadsheet-based budget tracking
- Monthly reconciliation labor-intensive

**Key Deliverables:**
- Approved draw requests
- Field inspection reports
- Disbursed funds
- Monthly financial statements
- Budget vs. actual reports

**Cycle Frequency:**
This is a **recurring monthly cycle** throughout the construction period (typically 12-24 months per project).

---

### VS6: Payoff, Reconveyance & Closeout
**System:** Connect 1.0
**Purpose:** Execute unit sales, calculate payoffs, release liens, and close out loans with final accounting
**Status Transition:** **Draw (funded)** → **Loan (paid off)** → **Lien (released)** → **Builder (financials reconciled)**

**Key Activities:**
- Unit sale coordination (as homes sell)
- Payoff calculation (principal, interest, fees)
- Lien release processing
- Final loan accounting
- Builder financial reconciliation
- Loan closeout and archival

**Inputs:**
- Completed construction (homes sold)
- Final draw request (if any)
- Buyer closing statements
- Lien holder information

**Outputs:**
- **Loan (paid off)**: All principal and interest paid in full
- **Lien (released)**: Legal lien release recorded
- **Builder (financials reconciled)**: Final accounting complete
- Closed loan file

**System Capabilities:**
- Payoff calculation engine
- Lien release tracking
- Final accounting
- Loan closeout workflow

**Pain Points (Current State):**
- Manual payoff calculations (risk of errors)
- Lien release processing delays
- Final reconciliation time-consuming

**Key Deliverables:**
- Payoff statements
- Lien release documents (recorded)
- Final loan accounting report
- Builder final reconciliation statement

**Zero-Default Record:**
Blueprint maintains a **zero-default track record** across $3B+ in originated loans. Final accounting and builder reconciliation ensure this record is preserved.

---

### VS7: Builder Accounting Services
**System:** Connect 1.0
**Purpose:** Provide accounting and bookkeeping services to builders as risk management function and value-add service offering
**Status Transition:** **Builder (financials reconciled)** [ongoing service]

**Key Activities:**
- Builder bookkeeping services
- Financial statement preparation (builder-level)
- QuickBooks management (or equivalent)
- Tax preparation support
- Risk management (financial health monitoring)
- Value-add service to maintain builder relationships

**Inputs:**
- Builder financial transactions
- Bank statements
- Expense receipts
- Payroll data

**Outputs:**
- **Builder (financials reconciled)**: Ongoing accounting services
- Monthly/quarterly financial statements (builder-specific)
- Tax-ready documents
- Financial health reports

**System Capabilities:**
- Builder accounting module
- Financial statement generation
- Integration with QuickBooks (or similar)
- Builder portal for document access

**Pain Points (Current State):**
- Labor-intensive manual bookkeeping
- Limited automation
- Builders rely on Blueprint for financial visibility

**Key Deliverables:**
- Monthly/quarterly financial statements (by builder)
- Tax documents (annual)
- Builder financial health reports
- Risk assessment indicators

**Business Value:**
This is both a **risk management function** (monitoring builder financial health) and a **value-add service** (differentiates Blueprint from competitors).

---

## System Ownership Map

| Value Stream | System | Platform | Status |
|--------------|--------|----------|--------|
| **VS1** Lead Intake | BPO | Firebase | Production |
| **VS2** Feasibility | BPO | Firebase | Production |
| **VS3** Design & Entitlement | SharePoint | M365 | Production |
| **VS4** Underwriting | Connect 1.0 | Filemaker | Production (Legacy) |
| **VS4.5** Land Loan | Connect 1.0 | Filemaker | Production (Legacy) |
| **VS4.6** Construction Loan Closing | Connect 1.0 | Filemaker | Production (Legacy) |
| **VS5** Construction Servicing | Connect 1.0 | Filemaker | Production (Legacy) |
| **VS6** Payoff & Closeout | Connect 1.0 | Filemaker | Production (Legacy) |
| **VS7** Builder Accounting | Connect 1.0 | Filemaker | Production (Legacy) |

**Key Insight:** The business operates across **three disconnected systems**:
1. **BPO (Firebase)**: Lead intake and feasibility (VS1-VS2)
2. **SharePoint (M365)**: Design and entitlement (VS3)
3. **Connect 1.0 (Filemaker)**: All loan origination, servicing, and accounting (VS4-VS7)

**Integration Gap:** Zero real-time integration between systems. All data manually re-entered at transition points.

---

## Key Metrics & Targets (Connect 2.0)

From the Product Requirements Document, Connect 2.0 targets the following improvements:

| Metric | Current State | Connect 2.0 Target | Improvement |
|--------|---------------|-------------------|-------------|
| **Feasibility Cycle Time** (VS2) | Baseline | -50% reduction | Automation + integration |
| **Entitlement Prep Time** (VS3) | Baseline | -50% reduction | Consultant coordination |
| **Deals Vetted per FTE** | Baseline | 2x increase | Automation + UX |
| **Draw Turnaround** (VS5) | Baseline | -60% reduction | Inspection + approval automation |
| **User Adoption** | N/A | ≥85% across roles | Experience-led design |
| **System Uptime** | N/A | ≥99.5% | Cloud-native architecture |

---

## Connect 2.0 Transformation Strategy

### Days 1-90 (MVP Phase 1)
**Focus:** Design & Entitlement Module (VS3) Only
- Rebuild SharePoint functionality in Connect 2.0
- Prove UX-first approach with pilot users
- Establish integration patterns
- **Systems Involved:** SharePoint → Connect 2.0 (VS3)

### Days 91-180 (MVP Phase 2)
**Focus:** Rebuild BPO + Connect 1.0 within Connect 2.0
- Migrate VS1-VS2 (Lead Intake, Feasibility) from BPO
- Migrate VS4-VS7 (Underwriting through Builder Accounting) from Connect 1.0
- Establish single unified platform
- **Systems Involved:** BPO → Connect 2.0, Connect 1.0 → Connect 2.0

### Post-Day 180
**Focus:** Full production adoption, data migration complete, legacy system sunset

---

## Value Stream Handoffs & Integration Points

### Critical Handoff Points (Current State - Manual)

1. **VS1 → VS2**: Lead (New) → In Contract
   - **System Handoff:** BPO internal (no handoff)
   - **Manual Work:** None (same system)

2. **VS2 → VS3**: Go Decision → Design & Entitlement
   - **System Handoff:** BPO → SharePoint
   - **Manual Work:** Re-enter project data, attach documents, set up entitlement tracking

3. **VS3 → VS4**: Parallel execution (no direct handoff)
   - **System Handoff:** SharePoint (VS3) and Connect 1.0 (VS4) run in parallel
   - **Manual Work:** Status updates between systems (email/calls)

4. **VS3 → VS4.5 or VS4.6**: Permit Ready decision
   - **System Handoff:** SharePoint → Connect 1.0
   - **Manual Work:** Confirm permit status, activate appropriate loan type

5. **VS4.6 → VS5**: Construction Loan Closing → Servicing
   - **System Handoff:** Connect 1.0 internal (origination → servicing modules)
   - **Manual Work:** Loan activation, borrowing base assignment

6. **VS5 → VS6**: Construction Complete → Payoff
   - **System Handoff:** Connect 1.0 internal
   - **Manual Work:** Final draw processing, payoff calculation verification

7. **VS5/VS6 → VS7**: Ongoing builder accounting
   - **System Handoff:** Connect 1.0 internal
   - **Manual Work:** Builder financials reconciliation, QuickBooks sync

### Connect 2.0 Integration Vision (Future State)

**Unified Platform:** All value streams in a single system with:
- **Real-time data flow** between value streams (no re-entry)
- **Progressive profiling** (data accumulates throughout lifecycle)
- **Automated status transitions** (trigger-based workflows)
- **Single source of truth** for all project data
- **API-first architecture** for external integrations

---

## User Personas by Value Stream

| Value Stream | Primary Users | System | Key Pain Points |
|--------------|---------------|--------|-----------------|
| **VS1** Lead Intake | Acquisitions Team | BPO | Manual lead entry, no scoring |
| **VS2** Feasibility | Acquisitions Team | BPO | Packet assembly time, consultant coordination |
| **VS3** Design & Entitlement | Design & Entitlement Team | SharePoint | No integration, manual tracking, consultant coordination |
| **VS4** Underwriting | Underwriting Team | Connect 1.0 | Legacy system, manual builder scoring |
| **VS4.5/VS4.6** Loan Closing | Underwriting + Servicing | Connect 1.0 | Manual document collection, transition complexity |
| **VS5** Construction Servicing | Servicing Team | Connect 1.0 | Draw turnaround time, manual inspections |
| **VS6** Payoff & Closeout | Servicing Team | Connect 1.0 | Manual payoff calculations, lien release delays |
| **VS7** Builder Accounting | Accounting Team | Connect 1.0 | Labor-intensive bookkeeping, limited automation |

---

## Alignment with Product Requirements Document

This value streams document aligns with:
- **PRD Section 2.2-2.3**: Current system architecture and pain points
- **PRD Section 4**: User personas and workflows
- **PRD Section 5-7**: Module-specific requirements (Feasibility, Entitlement, Lending, Servicing)
- **PRD Section 8**: MVP phasing strategy

**Next Steps:**
1. Use this VALUE_STREAMS.md as reference for Connect 2.0 module design
2. Map each value stream to Connect 2.0 modules (see PRD)
3. Design integration points and data flows
4. Establish metrics and KPIs for each value stream

---

## Document Status

**Version:** 3.4
**Source:** Blueprint_Value_Streams_(exec view)_v3_4.pdf
**Last Updated:** January 5, 2026
**Status:** Current State Documentation (As-Is)
**Next Review:** Post-MVP Phase 1 (Day 90) - Update with Connect 2.0 implementation status
