# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a **documentation repository** for the Blueprint/Connect 2.0 platform development project. It contains no application code—only strategic planning documents, requirements specifications, and project artifacts.

## Key Documents

### Primary Technical Specification
**[PRODUCT_REQUIREMENTS_DOCUMENT.md](PRODUCT_REQUIREMENTS_DOCUMENT.md)** - Comprehensive product requirements document consolidating:
- Product vision and business context
- Current state architecture (BPO, Connect 1.0, SharePoint) and pain points
- Target architecture and system design for Connect 2.0
- User personas and workflows
- Feature backlog organized by module (Lead Intake, Feasibility, Entitlement, Lending, Servicing)
- Technical specifications (API design, data model, integrations)
- Data migration strategy
- MVP phasing (Day 1-180 timeline)
- AI and automation opportunities

**Use this as the source of truth when:**
- Understanding system requirements for Connect 2.0
- Planning feature development sprints
- Designing APIs or data models
- Evaluating integration approaches
- Prioritizing backlog items

### Strategic Planning Documents
**Blueprint Workshop — Detailed Summary & Outcomes.txt** - Workshop outcomes from October 1, 2025:
- Blueprint's strategic direction and operating model
- Frontier firm concept and transformation approach
- User team structures (Acquisitions, Design & Entitlement, Servicing)
- Current workflow pain points and automation opportunities
- OGSM framework candidates (Objectives, Goals, Strategies, Measures)

**Datapage Platform Program — Project Charter.txt** - Official project charter defining:
- Three integrated tracks: Blueprint Transformation, Connect 2.0 Platform Rebuild, Datapage GTM Strategy
- 180-day phased delivery approach (two 90-day increments)
- Governance structure and decision gates
- Success criteria and key deliverables
- Program roles and responsibilities (PLT structure)

### Supporting Documents
- **Blueprint - Demo Notes.pdf** - Detailed walkthrough of current systems (Connect 1.0, BPO, SharePoint)
- **Blueprint_LOE.xlsx** - Level of effort estimates (spreadsheet format)

## Document Structure & Relationships

```
Strategic Planning Documents
├── Workshop Outcomes → Informed the program design
├── Project Charter → Formal program structure
└── PRD → Consolidated technical requirements

PRODUCT_REQUIREMENTS_DOCUMENT.md
├── Synthesizes all source documents
├── Adds technical depth (APIs, data models, integrations)
└── Provides actionable backlog for engineering
```

## Working with This Repository

### When Adding New Documentation
- **Place strategic/planning documents** in the root directory
- **Use descriptive filenames** that indicate content and date (e.g., "Workshop Summary - Nov 2025.txt")
- **Update the PRD** if new information affects technical requirements, architecture, or backlog
- **Maintain document lineage** - note which documents informed or superseded others

### When Updating the PRD
The PRD is the consolidated source of truth. When updating:

1. **Preserve section structure** - Don't reorganize the 10 main sections
2. **Update version and date** in the document header
3. **Add changelog entry** at the top documenting what changed and why
4. **Maintain consistency**:
   - Use the existing data model entity names (Project, Loan, Contact, etc.)
   - Keep API endpoint patterns consistent
   - Preserve the MVP phasing structure (Days 1-90, 91-180)
5. **Mark decisions** - When open questions are resolved (e.g., cloud provider choice), update the relevant section and note the decision

### Critical Information in the PRD

**Current System Architecture** (Section 2.2-2.3):
- BPO (Blueprint Online): Firebase-based, handles lead intake and project tracking
- Connect 1.0: Filemaker-based, handles loan origination and servicing
- SharePoint: M365-based, handles feasibility and entitlement tracking
- **Key Pain Point**: Zero integration between systems; all data manually re-entered

**Target Architecture Principles** (Section 3.2):
- Cloud-native & API-first
- Experience-led development (UX informs backend)
- Composable & modular
- Data-centric design (single source of truth)
- Progressive multi-tenancy (foundation built in, activated post-MVP)

**MVP Phasing** (Section 8.1):
- **Days 1-90**: Design & Entitlement module only (pilot)
- **Days 91-180**: Rebuild BPO + Connect 1.0 within Connect 2.0
- **Decision Gates at Days 30, 90, 180**

**Integration Architecture** (Section 9):
- BPO ↔ Connect 2.0: Temporary API integration Days 1-90, then BPO becomes a module
- iPad Inspection App: Bi-directional REST API (nightly sync)
- DocuSign/Authentisign: Outbound + webhook for e-signature
- AWS Textract: Document extraction for surveys, title reports, arborist reports

## Project Context

**Business Entity Structure:**
- **Blueprint**: Operating company (Seattle, Phoenix markets) - serves as "Client Zero"
- **Datapage**: Platform company owning Connect 2.0 IP - commercializes the platform
- **Blueprint as Client Zero**: First live implementation proving the platform works

**Key Success Metrics (Day 180 targets):**
- Feasibility packet assembly: -50% cycle time
- Entitlement submission prep: -50% cycle time
- Deals vetted per FTE: 2x increase
- Average draw turnaround: -60% reduction
- User adoption: ≥85% across pilot roles
- System uptime: ≥99.5%

**Zero-Default Track Record:**
- Blueprint has originated $3B+ in loans with zero builder or loan defaults
- Technology must augment, not replace, expert judgment to maintain this record
- Human-in-the-loop required for all AI-assisted decisions (especially builder scoring, risk assessment)

## Terminology

**Domain-Specific Terms:**
- **Feasibility**: 3-30 day due diligence period assessing project viability
- **Entitlement**: Municipal permitting process to secure development approvals
- **Draw**: Construction loan disbursement tied to work completed
- **Reconveyance**: Lien release when loan is paid off
- **Borrowing Base**: Loans assigned to Blueprint's bank line of credit (Columbia Bank)
- **Proforma**: Financial projection showing project costs, revenue, and ROI
- **Progressive Profiling**: Deal data accumulates across lifecycle vs. static snapshots

**Product Terms:**
- **BPO**: Blueprint Online (current lead intake system)
- **Connect 1.0**: Legacy loan servicing platform (Filemaker-based)
- **Connect 2.0**: Next-generation unified platform being built
- **Client Zero**: First implementation of a platform (Blueprint for Connect 2.0)
- **Frontier Firm**: Company designed to embed data, AI, and structured decision-making from day one

## Questions to Resolve (from PRD Appendix C)

When working on implementation planning, these remain open:
- ~~Exact hosting platform~~ → **AWS selected (December 2025)**
- Preferred frontend framework (React vs. Vue)
- Backend language/framework (Node.js vs. Python)
- BPO API capabilities (or export-based integration approach)
- iPad inspection app API documentation availability
- Accounting system details (platform, integration method)

## Document Status

**Last Updated**: December 12, 2025
**Status**: Draft v1.1 - AWS Selected as Cloud Provider
**Next Milestone**: Leadership feedback → Day 14 program kickoff
