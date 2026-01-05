# Document Ingestion - Impact Analysis

**Purpose:** Identify all project aspects that could change when new business documents are ingested
**Status:** Analysis for skill development
**Date:** January 5, 2026

---

## Overview

When Blueprint leadership provides updated business documents (PDFs, Word docs, spreadsheets, presentations), these documents may contain new requirements, changed processes, updated metrics, or revised strategic direction. This analysis maps all potential downstream impacts across the project.

---

## 1. Documentation Layer

### 1.1 Core Strategic Documents (Root Directory)

**High Impact - Frequently Updated:**
- **PRODUCT_REQUIREMENTS_DOCUMENT.md** - Consolidates all requirements, may need updates to:
  - Business objectives and success metrics
  - Current state architecture descriptions
  - Target architecture and system design
  - Feature backlog and priorities
  - User personas and workflows
  - Technical specifications
  - MVP scope and phasing

- **VALUE_STREAMS.md** - Business process flow, may need updates to:
  - Value stream definitions (VS1-VS7)
  - System ownership mapping
  - Decision gates and handoff points
  - Integration pain points
  - Target metrics and improvements
  - User personas by value stream

- **PRODUCT_ROADMAP.md** - May need updates to:
  - Feature priorities and sequencing
  - Timeline adjustments
  - Dependency changes
  - Milestone definitions

**Medium Impact - Occasionally Updated:**
- **TECHNOLOGY_STACK_DECISION.md** - If new requirements affect:
  - Technology choices (languages, frameworks, databases)
  - Architecture patterns
  - Integration approaches
  - Infrastructure decisions

- **COST_OF_OWNERSHIP.md** - If business needs change:
  - Infrastructure sizing estimates
  - Cost projections
  - Budget allocations
  - ROI calculations

- **AZURE_DEPLOYMENT.md** / **VERCEL_DEPLOYMENT.md** - If deployment strategy changes:
  - Hosting platform decisions
  - Deployment architecture
  - Environment configurations

**Low Impact - Rarely Updated:**
- **DEVELOPER_QUICKSTART.md** - Usually stable unless workflow changes
- **MATERIALIZE_TEMPLATE_GUIDE.md** - UI template documentation (stable)
- **LOCAL_DEVELOPMENT_PLAN.md** - Local dev environment (stable)

### 1.2 Strategic Planning Documents (Root Directory - Text Files)

**Direct Ingestion Candidates:**
- **Blueprint Workshop — Detailed Summary & Outcomes.txt**
- **Datapage Platform Program — Project Charter.txt**
- Any new workshop summaries, strategy documents, or meeting notes

**Impact:** These documents inform PRD and VALUE_STREAMS updates.

### 1.3 Supporting Documentation (docs/ Directory)

#### docs/planning/

**High Impact:**
- **EPIC_TASKING_GUIDE.md** - If new epics or features identified
- **BACKLOG_CREATION_PLAN.md** - If backlog priorities shift
- **docs/planning/backlogs/EPIC_E*.md** - Individual epic documents may need:
  - New user stories
  - Changed acceptance criteria
  - Updated technical specifications
  - Revised estimates

**Medium Impact:**
- **EVERHOUR_API_INTEGRATION_GUIDE.md** - If time tracking requirements change
- **LOCALSTACK_HEPHAESTUS_ONBOARDING.md** - If onboarding process changes

#### docs/project/

**High Impact:**
- **SPRINT_0*_PLAN.md** - Sprint plans may need:
  - Re-prioritization of stories
  - Scope adjustments
  - Timeline changes
- **PROJECT_KICKOFF.md** - If project direction changes

#### docs/decisions/

**Medium Impact:**
- **TECH_STACK_DECISIONS.md** - If technical decisions need revision

#### docs/assessment/

**Low Impact:** Assessment documentation rarely affected by business documents

---

## 2. Claude Code Configuration Layer

### 2.1 CLAUDE.md (Primary AI Assistant Instructions)

**Critical Updates Needed When:**
- New strategic documents added (update "Key Documents" section)
- Document relationships change (update "Document Structure & Relationships")
- New terminology introduced (update "Terminology" section)
- Business context changes (update "Project Context" section)
- Technical decisions made (update "Technical Decisions Now Resolved")

**Specific Sections That May Change:**
```markdown
## Key Documents
  └── Add references to new documents
  └── Update document descriptions
  └── Add "Use this when..." guidance

## Document Structure & Relationships
  └── Update ASCII diagram
  └── Show new document lineage

## Terminology
  └── Add new domain-specific terms
  └── Update definitions

## Project Context
  └── Update business metrics
  └── Revise success criteria
  └── Update key dates/milestones

## Jira Integration & Project Tracking
  └── Update if new epics created
  └── Add new common queries
```

### 2.2 Claude Skills (.claude/skills/)

**May Need New Skills For:**
- Document-specific analyzers (e.g., "financial-proforma-analyzer")
- Domain-specific assistants (e.g., "entitlement-workflow-expert")
- Integration-specific helpers (e.g., "bpo-api-mapper")

**Existing Skills May Need Updates:**
- **jira-automation/SKILL.md** - If new Jira project structures introduced
- **everhour-integration/SKILL.md** - If time tracking requirements change

### 2.3 Claude Slash Commands (.claude/commands/)

**May Need New Commands:**
- `/analyze-feasibility` - If feasibility process documented in detail
- `/review-entitlement` - If entitlement workflows formalized
- `/compare-proformas` - If financial analysis processes documented

**Existing Commands May Need Updates:**
- Check if any commands reference outdated processes or documents

### 2.4 Claude Hooks (.claude/hooks/)

**Rarely Affected:** Hooks typically handle code quality, not business logic

---

## 3. Codebase / Feature Layer

### 3.1 Data Models (Database Schema)

**High Impact - Potential Changes:**

**When:** New business entities, attributes, or relationships identified

**Affected Files:**
- `scripts/init-db.sql` - PostgreSQL schema definitions
- `examples/nodejs-api/prisma/schema.prisma` - ORM models (if using Prisma)
- API type definitions (TypeScript interfaces)

**Examples of Changes:**
- New VALUE_STREAMS.md reveals "Land Loan" entity (VS4.5) → May need `LandLoan` table
- Workshop doc identifies "Builder Score" field → Add to `Builder` entity
- Charter doc specifies "Decision Gate" tracking → New `DecisionGate` table

**Schema Areas That May Change:**
```sql
-- Projects / Deals
- Project entity attributes (new fields)
- Project lifecycle states (new statuses)
- Project relationships (new foreign keys)

-- Contacts / Builders
- Builder scoring attributes
- Relationship types
- Contact roles

-- Loans
- New loan types (land loan, construction loan, etc.)
- Loan state transitions
- Financial calculations

-- Feasibility / Entitlement
- Consultant types
- Document types
- Approval workflows

-- Tasks / Workflows
- Task types aligned with value streams
- Workflow states
- Automation triggers
```

### 3.2 API Endpoints (Backend)

**High Impact - Potential New Endpoints:**

**When:** New workflows, user stories, or integrations identified

**Affected Files:**
- `examples/nodejs-api/src/routes/` - API route definitions
- API design specifications in PRD Section 6

**Examples of Changes:**
- VALUE_STREAMS.md documents draw approval process → New `/api/draws/approve` endpoint
- Workshop identifies builder portal need → New `/api/builders/portal` endpoints
- Charter specifies external reporting → New `/api/reports/reit` endpoint

**Endpoint Categories That May Need Updates:**
```javascript
// Lead Intake (VS1)
- POST /api/leads - May need new fields
- GET /api/leads/screening - May need new filters

// Feasibility (VS2)
- POST /api/feasibility/packets - May need new checklist items
- POST /api/feasibility/consultants - May need new consultant types

// Entitlement (VS3)
- POST /api/entitlements - May need new permit types
- GET /api/entitlements/status - May need new status values

// Underwriting (VS4)
- POST /api/underwriting/builder-assignment - May need new matching logic
- POST /api/underwriting/risk-assessment - May need new risk factors

// Servicing (VS5)
- POST /api/draws/submit - May need new draw types
- POST /api/inspections - May need new inspection criteria

// Reporting
- GET /api/reports/* - May need new report types
- GET /api/analytics/* - May need new metrics
```

### 3.3 Frontend Components (UI)

**Medium Impact - Potential New Components:**

**When:** New user workflows or screens identified

**Affected Areas:**
- `full-version/src/views/` - Page components
- `full-version/src/components/` - Reusable components
- Navigation menus (`src/data/navigation/`)

**Examples of Changes:**
- VALUE_STREAMS.md maps VS2 feasibility workflow → New `FeasibilityPacketBuilder` component
- Workshop identifies consultant coordination pain point → New `ConsultantDashboard` component
- Charter specifies decision gate reviews → New `DecisionGateReview` component

**Component Categories That May Need Updates:**
```javascript
// Dashboards
- AcquisitionsDashboard - May need new lead metrics
- FeasibilityDashboard - May need new packet status views
- EntitlementDashboard - May need new permit tracking
- ServicingDashboard - May need new draw cycle views

// Forms
- LeadIntakeForm - May need new fields
- FeasibilityChecklistForm - May need new checklist items
- DrawRequestForm - May need new draw types

// Data Tables
- ProjectsTable - May need new columns/filters
- BuildersTable - May need new scoring display
- LoansTable - May need new loan types

// Workflows
- FeasibilityWorkflow - May need new steps
- EntitlementWorkflow - May need new approval gates
- DrawApprovalWorkflow - May need new inspection steps
```

### 3.4 Business Logic (Backend Services)

**High Impact - Potential New Services:**

**When:** New calculations, validations, or automations identified

**Affected Files:**
- `examples/nodejs-api/src/services/` - Business logic services

**Examples of Changes:**
- VALUE_STREAMS.md documents builder scoring → New `BuilderScoringService`
- Workshop identifies automated lead scoring → New `LeadScoringService`
- Charter specifies risk assessment automation → New `RiskAssessmentService`

**Service Categories That May Need Updates:**
```javascript
// Calculations
- ProformaCalculationService - May need new financial models
- PayoffCalculationService - May need new fee structures
- BudgetVarianceService - May need new variance logic

// Validations
- LeadValidationService - May need new screening rules
- DrawValidationService - May need new approval criteria
- PermitValidationService - May need new compliance checks

// Automations
- NotificationService - May need new notification types
- WorkflowAutomationService - May need new trigger conditions
- ReportGenerationService - May need new report templates

// Integrations
- BpoIntegrationService - May need new API mappings
- SharePointIntegrationService - May need new document types
- DocuSignService - May need new signing workflows
```

### 3.5 Configuration & Constants

**Medium Impact - Configuration Changes:**

**Affected Files:**
- Environment variables (`.env.example`)
- Configuration files (`src/configs/`)
- Constant definitions

**Examples of Changes:**
- New external integrations identified → Add API keys/endpoints to `.env`
- New business rules documented → Add constants for thresholds, limits
- New feature flags introduced → Add to configuration

```javascript
// May need new constants:
const VALUE_STREAM_STATES = {
  VS1: ['NEW_LEAD', 'SCREENING', 'IN_CONTRACT'],
  VS2: ['FEASIBILITY', 'DUE_DILIGENCE', 'GO_DECISION'],
  VS3: ['DESIGN', 'PERMITTING', 'PERMIT_READY'],
  // ... etc
}

const DECISION_GATES = {
  GO_NO_GO: { thresholds: {...} },
  PERMIT_READY: { criteria: {...} },
  CONSTRUCTION_START: { conditions: {...} }
}

const BUSINESS_RULES = {
  MIN_BUILDER_SCORE: 75,
  MAX_DRAW_AMOUNT: 5000000,
  INSPECTION_REQUIRED_THRESHOLD: 100000
}
```

---

## 4. Testing Layer

### 4.1 Test Cases

**May Need New Tests When:**
- New business rules documented → Unit tests for validation logic
- New workflows identified → Integration tests for workflows
- New calculations specified → Tests for financial calculations

**Affected Files:**
- `tests/` directory - Python test files
- `examples/nodejs-api/tests/` - JavaScript test files (if they exist)

**Examples:**
```javascript
// New test suites that may be needed:
describe('BuilderScoringService', () => {
  test('calculates builder score based on VALUE_STREAMS.md criteria')
})

describe('FeasibilityWorkflow', () => {
  test('follows VS2 process from VALUE_STREAMS.md')
  test('enforces go/no-go decision gate')
})

describe('DrawApprovalService', () => {
  test('validates draw amount per business rules')
  test('requires inspection per VS5 requirements')
})
```

### 4.2 Test Data / Fixtures

**May Need New Fixtures:**
- Sample data representing new entities
- Test cases for new workflows
- Mock responses for new integrations

---

## 5. Integration Layer

### 5.1 External System Integrations

**High Impact When New Integrations Identified:**

**Current Integrations (from PRD):**
- BPO (Firebase) - Lead intake and feasibility
- Connect 1.0 (Filemaker) - Loan origination and servicing
- SharePoint (M365) - Entitlement tracking
- iPad Inspection App - Field inspections
- DocuSign/Authentisign - E-signature
- Azure Document Intelligence - Document extraction
- Accounting System - Financial data

**May Need New Integration Code When:**
- New external systems identified in documents
- New API endpoints discovered for existing systems
- New data sync requirements specified

**Affected Files:**
- `examples/nodejs-api/src/integrations/` - Integration services
- API client libraries
- Webhook handlers

### 5.2 Jira Project Structure

**Medium Impact - May Need:**

**When:** New epics, features, or work breakdown structures identified

**Changes:**
- New epics created in DP01 project
- New user stories and tasks
- Updated sprint plans
- New labels or components

**Affected Files:**
- `scripts/create-jira-tasks.py` - Task creation scripts
- Sprint planning documents (`docs/project/SPRINT_*.md`)

---

## 6. Automation / Scripts Layer

### 6.1 Python Scripts (scripts/)

**May Need New Scripts When:**
- New data migrations identified
- New reporting requirements specified
- New automation workflows documented

**Existing Script Categories:**
- Jira automation (`create-jira-tasks.py`, `assign-stories-to-sprints.py`)
- Time tracking (`analyze-weekly-time.py`, `bulk-log-last-week.py`)
- Project analysis (`analyze-track3-stories.py`)

**May Need New Scripts:**
- `migrate-value-stream-data.py` - If VS data needs migration
- `generate-feasibility-reports.py` - If reporting requirements identified
- `sync-bpo-data.py` - If BPO integration requirements clarified

### 6.2 Database Migration Scripts

**High Impact When:**
- Schema changes identified from new requirements

**Affected Files:**
- `scripts/init-db.sql` - Initial schema
- Migration scripts (if using migration tool like Flyway or Prisma Migrate)

---

## 7. DevOps / Infrastructure Layer

### 7.1 Infrastructure as Code

**Medium Impact When:**
- New infrastructure requirements identified
- Scaling requirements change
- New environments needed

**Affected Files:**
- `docker-compose.yml` - Local development services
- Terraform/CloudFormation (if they exist)
- CI/CD pipelines (GitHub Actions)

**Examples of Changes:**
- New microservices identified → New Docker containers
- New data stores needed → Add to docker-compose
- New deployment environments → Add to infrastructure code

### 7.2 Environment Configuration

**May Need Updates:**
- `.env.example` - If new environment variables needed
- `README.md` - If setup instructions change

---

## 8. Project Management Layer

### 8.1 Jira

**High Impact - Automatically Managed:**

**When New Requirements Identified:**
- Create new epics in DP01 project
- Break down into user stories
- Assign story points
- Add to sprint backlog
- Link to documentation

**Jira Artifacts That May Change:**
- Epic descriptions (link to new documents)
- Story acceptance criteria (reference new requirements)
- Task descriptions (reference VALUE_STREAMS.md sections)
- Sprint goals (align with updated priorities)

### 8.2 Time Tracking (Everhour)

**Low Impact:**
- Usually no changes unless project structure changes dramatically
- May need new tasks if new project phases introduced

---

## 9. Change Propagation Matrix

| Source Document Change | Downstream Impacts |
|------------------------|-------------------|
| **New Business Process** (e.g., VS4.5 Land Loan) | VALUE_STREAMS.md → PRD → Data Model → API Endpoints → UI Components → Tests |
| **New Entity/Concept** (e.g., Builder Score) | PRD → Data Model → Business Logic → API Endpoints → UI → Tests → CLAUDE.md (terminology) |
| **Changed Metric/Target** (e.g., -60% draw turnaround) | PRD → VALUE_STREAMS.md → Dashboard Components → Reporting APIs → Tests |
| **New Integration** (e.g., New Accounting System) | PRD → Integration Services → API Endpoints → Configuration → DevOps → CLAUDE.md |
| **New User Role** (e.g., Compliance Officer) | PRD → User Personas → RBAC/Permissions → UI Navigation → API Authorization → Tests |
| **Changed Workflow** (e.g., New approval gate) | VALUE_STREAMS.md → PRD → Business Logic → API Endpoints → UI Workflow Components → Tests |
| **New Feature** (e.g., Builder Portal) | PRD → Epic in Jira → User Stories → Data Model → APIs → UI → Tests → Documentation |
| **Updated Timeline** (e.g., MVP scope change) | PRD (MVP Phasing) → Roadmap → Sprint Plans → Jira Sprints → Team Communication |
| **New Technical Requirement** (e.g., GDPR compliance) | PRD → Tech Stack Decision → Architecture → Security Implementation → Tests → DevOps |

---

## 10. Skill Design Implications

### 10.1 Skill Workflow

The `document-ingestion` skill should:

1. **Analyze Incoming Document**
   - Identify document type (strategy, process, technical, financial)
   - Extract key information (new entities, processes, metrics, requirements)
   - Determine scope of impact (which layers affected)

2. **Map to Project Structure**
   - Identify which existing documents need updates
   - Flag which code areas may need changes
   - Determine if new artifacts needed

3. **Create Change Checklist**
   - List all affected files/areas
   - Prioritize changes (critical → nice-to-have)
   - Estimate effort for each change

4. **Execute Updates**
   - Update documentation (CLAUDE.md, PRD, VALUE_STREAMS.md, etc.)
   - Flag code changes needed (don't implement automatically)
   - Create Jira tasks for code implementation
   - Update project management artifacts

5. **Validate Consistency**
   - Check for conflicts with existing documentation
   - Verify cross-references updated
   - Ensure terminology consistency

6. **Report Results**
   - Summary of changes made
   - List of code changes flagged for implementation
   - Jira tasks created
   - Recommended next steps

### 10.2 Skill Inputs

```yaml
inputs:
  - document_path: Path to new/updated document (PDF, DOCX, TXT, MD)
  - document_type: [strategic | process | technical | financial | workshop]
  - impact_scope: [documentation_only | full_impact | analysis_only]
  - auto_create_jira: boolean (default: false)
  - auto_update_docs: boolean (default: true)
```

### 10.3 Skill Outputs

```yaml
outputs:
  - change_summary: Markdown report of all changes
  - updated_files: List of documentation files updated
  - code_changes_needed: List of code areas flagged for updates
  - jira_tasks_created: List of new Jira tasks (if auto_create_jira=true)
  - conflicts_detected: List of potential conflicts with existing docs
  - recommendations: Next steps for implementation
```

---

## 11. Guiding Principles for the Skill

1. **Documentation First, Code Second**
   - Always update documentation before flagging code changes
   - Keep CLAUDE.md, PRD, and VALUE_STREAMS.md as source of truth

2. **Preserve Lineage**
   - Document which source documents informed which changes
   - Maintain "Document Structure & Relationships" diagram in CLAUDE.md

3. **Flag, Don't Implement Code**
   - Document ingestion should update docs and create Jira tasks
   - Actual code implementation should be separate workflow

4. **Validate Consistency**
   - Check for terminology conflicts
   - Verify metric alignment across documents
   - Flag contradictions for human review

5. **Incremental Updates**
   - Support partial updates (e.g., "only update VALUE_STREAMS.md")
   - Allow review checkpoints before propagating changes

6. **Audit Trail**
   - Generate markdown report of all changes
   - Include rationale for each change
   - Link back to source document sections

---

## Document Status

**Created:** January 5, 2026
**Purpose:** Design specification for document-ingestion skill
**Next Steps:** Create SKILL.md based on this analysis
