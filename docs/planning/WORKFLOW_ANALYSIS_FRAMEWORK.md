# Workflow Analysis Framework
## Cross-Functional Workshop Guide

**Purpose**: Structured framework for capturing workflow components during stakeholder workshops
**Created**: December 23, 2025
**Use Case**: Requirements gathering, process mapping, system design workshops

---

## Overview

This framework provides a standardized vocabulary and structure for decomposing workflows into discrete, analyzable components. Use this during workshops to ensure complete capture of:

1. **Entities** - State-based objects that flow through the system
2. **Actors** - People, systems, or roles that interact with the workflow
3. **Events** - Triggers that initiate or advance workflows
4. **Actions** - Operations performed on entities
5. **Decision Points** - Conditional logic that routes workflow paths
6. **Inputs/Outputs** - Data exchanged at each step
7. **Rules** - Business logic that governs decisions and validations
8. **Integrations** - External systems and APIs involved
9. **Metrics** - KPIs and success criteria
10. **Edge Cases** - Exception handling and alternate paths

---

## 1. Entities (State-Based Objects)

**Definition**: Domain objects that have lifecycle states and flow through the workflow.

### Components to Capture

| Component | Description | Example (Design Team) |
|-----------|-------------|----------------------|
| **Entity Name** | Primary object being tracked | `Project` |
| **States** | All possible statuses the entity can have | `Draft`, `Feasibility`, `Schematic`, `Design Dev`, `Permit Submitted`, `Approved`, `CA`, `Complete` |
| **State Transitions** | Valid state changes and triggers | `Feasibility` → `Schematic` (trigger: feasibility approved) |
| **Attributes** | Data fields that describe the entity | `project_name`, `address`, `jurisdiction`, `lot_size_sf`, `property_value` |
| **Lifecycle Duration** | Average time in each state | `Schematic`: 14-21 days, `Design Dev`: 28-42 days |
| **Terminal States** | Final states (workflow ends) | `Complete`, `Canceled`, `On Hold` |

### Workshop Questions

- What is the primary object this workflow operates on?
- What are all the possible states this object can be in?
- What triggers a state change?
- What data describes this object at each state?
- How long does the object typically stay in each state?
- What states indicate the workflow is complete?

### Example: Design Team Project Entity

```yaml
entity:
  name: Project
  states:
    - name: Draft
      description: Initial project intake, not yet assigned
      avg_duration: 1-2 days

    - name: Feasibility
      description: Feasibility analysis in progress
      avg_duration: 3-7 days

    - name: Schematic Design
      description: Creating initial design concepts
      avg_duration: 14-21 days

    - name: Design Development
      description: Refining to construction-ready documents
      avg_duration: 28-42 days

    - name: Permit Submitted
      description: Waiting for jurisdiction review
      avg_duration: 60-90 days

    - name: Corrections Required
      description: Addressing reviewer comments
      avg_duration: 5-10 days per round

    - name: Permit Approved
      description: Permit granted, ready for construction
      terminal: false

    - name: Construction Admin
      description: Ongoing support during construction
      avg_duration: 6-12 months

    - name: Project Complete
      description: Final closeout
      terminal: true

  attributes:
    - name: project_name
      type: string
      required: true

    - name: project_address
      type: string
      required: true

    - name: jurisdiction
      type: string
      required: true
      enum: [Seattle, Shoreline, King County, Bellevue, etc.]

    - name: lot_size_sf
      type: integer
      required: true
      validation: "must be > 0"

    - name: estimated_buildable_sf
      type: integer
      calculated: "lot_size_sf * coverage_ratio"

    - name: permit_application_number
      type: string
      required_after_state: Permit Submitted

  state_transitions:
    - from: Draft
      to: Feasibility
      trigger: Acquisitions team submits project
      conditions: [project_name, address, jurisdiction all populated]

    - from: Feasibility
      to: Schematic Design
      trigger: Feasibility approved
      conditions: [feasibility_status = APPROVED, design_team_assigned]

    - from: Schematic Design
      to: Design Development
      trigger: Client approves schematic
      conditions: [schematic_approval_received, approval_date populated]

    - from: Design Development
      to: Permit Submitted
      trigger: Permit application submitted to jurisdiction
      conditions: [permit_set_complete, permit_application_number populated]

    - from: Permit Submitted
      to: Corrections Required
      trigger: Jurisdiction sends correction letter
      conditions: [correction_letter_received]

    - from: Corrections Required
      to: Permit Submitted
      trigger: Corrections resubmitted
      conditions: [all_corrections_addressed]

    - from: Permit Submitted
      to: Permit Approved
      trigger: Jurisdiction grants approval
      conditions: [permit_approved_date populated]

    - from: Permit Approved
      to: Construction Admin
      trigger: Construction starts
      conditions: [construction_start_date populated]

    - from: Construction Admin
      to: Project Complete
      trigger: Final inspection passed
      conditions: [certificate_of_occupancy_received]
```

---

## 2. Actors (People, Systems, Roles)

**Definition**: Entities (human or system) that perform actions or make decisions in the workflow.

### Components to Capture

| Component | Description | Example (Design Team) |
|-----------|-------------|----------------------|
| **Actor Name** | Role or system identifier | `Senior Design Manager` |
| **Actor Type** | Human, System, External Party | `Human (Internal)` |
| **Responsibilities** | Actions this actor can perform | `Assign projects`, `Review schematic designs`, `Approve permit sets` |
| **Permissions** | What the actor can view/edit | `Can edit all projects`, `Can reassign tasks`, `Cannot delete projects` |
| **Decision Authority** | What decisions this actor makes | `Approve/reject schematic design`, `Determine project complexity` |
| **Triggering Actions** | Actions that advance the workflow | `Approve schematic → triggers Design Development phase` |

### Workshop Questions

- Who are all the people involved in this workflow?
- What systems or external parties participate?
- What can each actor do at each workflow stage?
- What decisions does each actor make?
- What triggers a workflow to advance?
- What permissions/access does each actor need?

### Example: Design Team Actors

```yaml
actors:
  - name: Acquisitions Specialist
    type: Human (Internal)
    department: Acquisitions Team
    responsibilities:
      - Submit new projects from BPO
      - Provide project context and history
      - Communicate builder/client preferences
    permissions:
      - Read: All projects in Feasibility state
      - Write: Project notes, acquisitions_contact field
      - Cannot: Assign design team, approve designs
    decision_authority:
      - Determine if project should proceed to feasibility
    triggering_actions:
      - Submit project → Triggers Intake & Feasibility workflow

  - name: Design Team Lead
    type: Human (Internal)
    department: Design Team
    responsibilities:
      - Assign projects to designers
      - Review schematic designs before client submission
      - Coordinate with consultants
      - Respond to RFIs during construction
    permissions:
      - Read: All active projects
      - Write: All project fields, task assignments
      - Approve: Schematic designs (internal review)
    decision_authority:
      - Assign project to specific designer
      - Determine project complexity (simple, medium, high)
      - Decide if consultant needed for corrections
    triggering_actions:
      - Assign to designer → Project moves to active queue

  - name: Designer (Architect)
    type: Human (Internal)
    department: Design Team
    responsibilities:
      - Create schematic design concepts
      - Develop construction documents
      - Address permit corrections
      - Respond to RFIs
    permissions:
      - Read: Assigned projects only
      - Write: Design deliverables, task status, hours logged
      - Cannot: Reassign projects, approve own work
    decision_authority:
      - Determine design approach within approved scope
    triggering_actions:
      - Upload schematic package → Triggers client approval request
      - Upload permit set → Triggers permit submission

  - name: Client (Builder/Developer)
    type: Human (External)
    department: External Party
    responsibilities:
      - Provide design requirements and preferences
      - Approve schematic design
      - Review and approve change orders
    permissions:
      - Read: Own projects only (via BPO portal)
      - Write: Comments, approval signature
      - Cannot: Edit design documents, see other projects
    decision_authority:
      - Approve or request changes to schematic design
    triggering_actions:
      - Approve schematic → Triggers Design Development phase

  - name: Engineering Consultant (Structural)
    type: Human (External)
    department: External Party
    responsibilities:
      - Provide structural calculations and plans
      - Address structural corrections from jurisdiction
      - Stamp structural drawings
    permissions:
      - Read: Assigned projects only (specific deliverables)
      - Write: Upload structural documents
      - Cannot: See budget, other consultants' work
    decision_authority:
      - Determine foundation type and framing approach
    triggering_actions:
      - Upload structural plans → Enables permit set compilation

  - name: Jurisdiction Reviewer
    type: Human (External)
    department: External Party
    responsibilities:
      - Review permit application for code compliance
      - Issue correction letters
      - Grant permit approval
    permissions:
      - Read: Submitted permit applications
      - Write: Correction letters, approval status
      - Cannot: Edit applicant's drawings
    decision_authority:
      - Approve permit or require corrections
    triggering_actions:
      - Issue correction letter → Triggers Corrections workflow
      - Grant permit approval → Triggers Construction Admin phase

  - name: Windmill Workflow Engine
    type: System (Internal)
    department: Platform
    responsibilities:
      - Execute automated workflows
      - Send notifications (email, Slack)
      - Track SLAs and deadlines
      - Calculate KPIs
    permissions:
      - Read: All project data
      - Write: Task statuses, calculated fields, notifications
      - Cannot: Override human decisions
    decision_authority:
      - Determine if SLA breached (auto-escalate)
      - Calculate project complexity score
    triggering_actions:
      - SLA breach → Send escalation notification
      - Permit approved → Create CA tasks automatically

  - name: BPO (Blueprint Online)
    type: System (Internal)
    department: Platform
    responsibilities:
      - Store project intake data
      - Provide acquisitions team interface
      - Display project status to clients
    permissions:
      - Read: All projects originating from BPO
      - Write: Project status updates from Connect 2.0
      - Cannot: Edit design deliverables
    decision_authority: None (data storage only)
    triggering_actions:
      - Project status change → Notify client via BPO portal

  - name: DocuSign
    type: System (External)
    department: External Service
    responsibilities:
      - Send documents for e-signature
      - Track signature status
      - Return signed documents
    permissions:
      - Read: Documents sent for signature
      - Write: Signature completion status
    decision_authority: None (signature service only)
    triggering_actions:
      - Signature complete → Webhook to Connect 2.0 (triggers next workflow step)
```

---

## 3. Events (Triggers)

**Definition**: Occurrences that initiate or advance workflows.

### Components to Capture

| Component | Description | Example (Design Team) |
|-----------|-------------|----------------------|
| **Event Name** | Descriptive trigger name | `Permit Correction Letter Received` |
| **Event Type** | User action, System event, External event, Scheduled | `External event` |
| **Event Source** | Where the event originates | `Jurisdiction email` |
| **Event Payload** | Data accompanying the event | `correction_letter.pdf`, `application_number`, `jurisdiction_name` |
| **Frequency** | How often this event occurs | `1-3 times per project` |
| **Timing** | When this event typically happens | `30-60 days after permit submission` |

### Workshop Questions

- What starts this workflow?
- What external events can interrupt or advance the workflow?
- What scheduled events occur (e.g., monthly KPI report)?
- What system events trigger actions (e.g., SLA breach)?
- What data comes with each event?

### Example: Design Team Events

```yaml
events:
  - name: Project Submitted from BPO
    type: User Action
    source: Acquisitions Specialist (via BPO)
    payload:
      - project_name
      - project_address
      - jurisdiction
      - lot_size_sf
      - property_value
      - acquisitions_contact
    frequency: 3-5 per week
    timing: Continuous (as deals are identified)
    triggers_workflow: design_intake_feasibility

  - name: Feasibility Approved
    type: User Action
    source: Design Team Lead
    payload:
      - feasibility_status: APPROVED
      - assigned_designer
      - estimated_hours
    frequency: 2-4 per week
    timing: 3-7 days after project submitted
    triggers_workflow: design_schematic_phase

  - name: Client Approves Schematic Design
    type: External Event
    source: DocuSign webhook
    payload:
      - envelope_id
      - signed_document_url
      - approval_date
      - client_signature
    frequency: 2-3 per week
    timing: 14-21 days after schematic submitted
    triggers_workflow: design_development_permitting

  - name: Permit Correction Letter Received
    type: External Event
    source: Jurisdiction (email or portal)
    payload:
      - correction_letter.pdf
      - application_number
      - jurisdiction_name
      - reviewer_name
    frequency: 1-2 per project (60-80% of permits)
    timing: 30-60 days after permit submission
    triggers_workflow: design_permit_corrections

  - name: RFI Submitted by Contractor
    type: External Event
    source: Contractor (via email or portal)
    payload:
      - rfi_number
      - project_name
      - question_description
      - urgency_level
      - contractor_contact
    frequency: 5-15 per project during construction
    timing: Throughout construction phase (6-12 months)
    triggers_workflow: design_construction_admin

  - name: Monthly KPI Report Due
    type: Scheduled Event
    source: System (cron job)
    payload:
      - reporting_month
      - team_size
    frequency: Monthly (1st of month)
    timing: 1st of each month at 6:00 AM
    triggers_workflow: design_kpi_tracking

  - name: SLA Breach Detected
    type: System Event
    source: Windmill monitoring
    payload:
      - task_id
      - task_name
      - due_date
      - current_date
      - assigned_to
    frequency: Rare (target: <5% of tasks)
    timing: Continuous monitoring
    triggers_action: Send escalation notification to Design Team Lead
```

---

## 4. Actions (Operations)

**Definition**: Discrete operations performed on entities or data.

### Components to Capture

| Component | Description | Example (Design Team) |
|-----------|-------------|----------------------|
| **Action Name** | Operation being performed | `Generate Permit Set` |
| **Action Type** | Create, Read, Update, Delete, Calculate, Transform, Notify, Integrate | `Transform` |
| **Performed By** | Actor executing the action | `Designer (Architect)` |
| **Inputs Required** | Data needed to execute | `Approved schematic design`, `Consultant drawings` |
| **Outputs Produced** | Data or artifacts created | `Permit set PDF`, `Document list`, `Submission checklist` |
| **Duration** | Time to complete | `40-80 hours over 6-8 weeks` |
| **Side Effects** | Other changes triggered | `Update project status`, `Create permit submission task`, `Send notification to acquisitions team` |

### Workshop Questions

- What specific actions are performed at each workflow step?
- Who or what performs each action?
- What data is required to perform the action?
- What is created or changed by the action?
- How long does each action take?
- What happens after the action completes?

### Example: Design Team Actions

```yaml
actions:
  - name: Analyze Feasibility
    type: Calculate
    performed_by: Windmill (automated) + Design Team Lead (review)
    inputs:
      - project_address
      - lot_size_sf
      - jurisdiction
      - property_value
    outputs:
      - estimated_buildable_sf
      - coverage_ratio
      - identified_risks (array)
      - feasibility_status (GO/NO_GO/INVESTIGATE)
    duration: 1-2 hours (automated analysis) + 1-2 hours (human review)
    side_effects:
      - Update project status to "Feasibility Complete"
      - Create task "Begin Schematic Design"
      - Send notification to acquisitions team

  - name: Generate Schematic Design
    type: Create
    performed_by: Designer (Architect)
    inputs:
      - lot_size_sf
      - buildable_sf
      - zoning_requirements
      - client_design_preferences
    outputs:
      - site_plan.pdf
      - floor_plans.pdf
      - elevations.pdf
      - renderings (PNG images)
      - design_narrative.docx
    duration: 16-24 hours over 2-3 weeks
    side_effects:
      - Upload documents to S3
      - Update project status to "Schematic - Awaiting Approval"
      - Create DocuSign envelope for client approval

  - name: Coordinate Engineering Consultants
    type: Integrate
    performed_by: Design Team Lead
    inputs:
      - project_complexity (simple, medium, high)
      - required_consultants (array)
      - project_schedule
    outputs:
      - consultant_assignments (array of tasks)
      - estimated_consultant_costs
      - expected_delivery_dates
    duration: 2-4 hours (initial coordination)
    side_effects:
      - Send emails to consultants with project details
      - Create tasks for each consultant deliverable
      - Set SLA deadlines (10-14 days typical)

  - name: Submit Permit Application
    type: Integrate
    performed_by: Designer (Architect)
    inputs:
      - permit_set.pdf (compiled drawings)
      - consultant_drawings (structural, civil, mechanical)
      - jurisdiction_application_form
      - permit_fees
    outputs:
      - application_number
      - submission_date
      - submission_receipt
    duration: 4-6 hours (compile and submit)
    side_effects:
      - Update project status to "Permit Submitted"
      - Create task "Monitor Permit Status"
      - Set expected review completion date (60-90 days out)

  - name: Categorize Permit Corrections
    type: Transform
    performed_by: Windmill (Azure Document Intelligence) + Designer (review)
    inputs:
      - correction_letter.pdf
    outputs:
      - corrections_list (array of correction items)
      - corrections_by_discipline (grouped: architectural, structural, civil, mechanical, zoning, admin)
      - assigned_to (designer or consultant)
    duration: 30 minutes (automated) + 1 hour (human review/adjustment)
    side_effects:
      - Create task for each correction
      - Assign tasks to appropriate team members or consultants
      - Set turnaround deadline (5-10 days)

  - name: Respond to RFI
    type: Create
    performed_by: Designer (Architect) or Design Team Lead
    inputs:
      - rfi_question
      - project_drawings
      - urgency_level
    outputs:
      - response_letter.pdf or ASI.pdf or revised_drawing.pdf
      - response_type (clarification, ASI, drawing revision)
    duration: 1-6 hours (depends on response type)
    side_effects:
      - Send response to contractor via email
      - Log CA event in Connect 2.0
      - Track response time (KPI metric)

  - name: Calculate KPI Metrics
    type: Calculate
    performed_by: Windmill (automated)
    inputs:
      - projects_completed (count for period)
      - time_entries (from Everhour)
      - project_timelines (from Connect 2.0)
      - team_size
    outputs:
      - productivity_metrics (hours per project vs targets)
      - utilization_rate (billable hours / available hours)
      - timeline_performance (on-time delivery %)
      - recommendations (array of improvement suggestions)
    duration: 5-10 minutes (automated calculation)
    side_effects:
      - Generate KPI report PDF
      - Send email to Managing Director
      - Update BI dashboard
```

---

## 5. Decision Points (Conditional Logic)

**Definition**: Points in the workflow where logic determines the next path.

### Components to Capture

| Component | Description | Example (Design Team) |
|-----------|-------------|----------------------|
| **Decision Name** | What is being decided | `Determine if consultant revision needed` |
| **Decision Maker** | Who/what makes the decision | `Designer (Architect)` or `Windmill (rule-based)` |
| **Decision Criteria** | Logic used to decide | `IF correction_type IN ['structural', 'civil', 'mechanical'] THEN assign_to_consultant ELSE assign_to_designer` |
| **Possible Outcomes** | All possible decision results | `[Assign to Consultant, Assign to Designer, Escalate to Lead]` |
| **Next Actions** | What happens for each outcome | `Assign to Consultant → Send email to consultant` |
| **Default/Fallback** | What happens if criteria unclear | `Escalate to Design Team Lead for manual decision` |

### Workshop Questions

- Where does the workflow have branching logic?
- Who or what makes each decision?
- What information is used to make the decision?
- What are all possible outcomes?
- What happens for each outcome?
- What happens if the decision can't be made automatically?

### Example: Design Team Decision Points

```yaml
decision_points:
  - name: Determine Project Complexity
    decision_maker: Design Team Lead or Windmill (rule-based)
    decision_criteria: |
      IF jurisdiction = 'Seattle' AND lot_size_sf > 10000 THEN complexity = 'High'
      ELSE IF jurisdiction = 'Seattle' THEN complexity = 'Medium'
      ELSE IF lot_size_sf > 15000 THEN complexity = 'Medium'
      ELSE complexity = 'Simple'
    possible_outcomes:
      - Simple: Single-family, standard jurisdiction, no special conditions
      - Medium: Seattle projects, larger lots, or 1-2 special conditions
      - High: Seattle + large lot + special conditions (trees, slopes, etc.)
    next_actions:
      - Simple:
          - Assign to junior designer
          - Skip geotechnical and mechanical consultants
          - Estimated hours: 80-100
      - Medium:
          - Assign to mid-level designer
          - Include structural and civil consultants
          - Estimated hours: 100-120
      - High:
          - Assign to senior designer
          - Include all consultants (structural, civil, geo, mechanical)
          - Estimated hours: 120-144
    default_fallback: Escalate to Design Team Lead for manual complexity determination

  - name: Schematic Approval Decision
    decision_maker: Client (Builder/Developer)
    decision_criteria: "Client reviews schematic design package and decides"
    possible_outcomes:
      - Approved: Client signs DocuSign envelope
      - Changes Requested: Client provides feedback in DocuSign comments
      - Rejected: Client declines to approve (rare)
    next_actions:
      - Approved:
          - Trigger design_development_permitting workflow
          - Update project status to "Design Development"
          - Send kickoff notification to design team
      - Changes Requested:
          - Create task "Revise Schematic per Client Feedback"
          - Assign back to original designer
          - Re-send for approval after revisions
      - Rejected:
          - Escalate to Design Team Lead and Acquisitions
          - Schedule client meeting to understand concerns
          - Put project on hold pending resolution
    default_fallback: If no response after 7 days, send reminder email (up to 3 reminders)

  - name: Determine RFI Response Type
    decision_maker: Windmill (rule-based) + Designer (review)
    decision_criteria: |
      IF rfi_description CONTAINS ['conflict', 'dimension missing', 'detail unclear'] THEN response_type = 'Drawing Revision'
      ELSE IF rfi_description CONTAINS ['specification', 'material', 'method'] THEN response_type = 'ASI'
      ELSE response_type = 'Clarification Letter'
    possible_outcomes:
      - Clarification Letter: Simple question, no drawing changes needed
      - ASI (Supplemental Instruction): Minor change or specification clarification
      - Drawing Revision: Drawing error or missing detail, requires revised sheet
    next_actions:
      - Clarification Letter:
          - Generate 1-page response letter
          - Estimated effort: 1 hour
          - Send via email to contractor
      - ASI:
          - Generate ASI document (2 pages)
          - Estimated effort: 3 hours
          - Send via email, log in CA record
      - Drawing Revision:
          - Generate ASI + revised drawing sheet
          - Estimated effort: 6 hours
          - Send via email, update permit set version
    default_fallback: If automated categorization confidence < 70%, escalate to Designer for manual decision

  - name: Determine if Corrections Require Consultant
    decision_maker: Designer (Architect)
    decision_criteria: |
      FOR EACH correction IN corrections_list:
        IF correction.discipline IN ['structural', 'civil', 'mechanical', 'geotechnical'] THEN assign_to_consultant
        ELSE IF correction.discipline = 'zoning' AND correction.requires_redesign THEN assign_to_designer + escalate_to_lead
        ELSE assign_to_designer
    possible_outcomes:
      - Assign to Consultant: Correction is discipline-specific (structural calcs, civil grading, etc.)
      - Assign to Designer: Architectural correction or administrative fix
      - Escalate to Lead: Zoning issue that may require significant redesign
    next_actions:
      - Assign to Consultant:
          - Send correction item to consultant via email
          - Set SLA: 5-7 days turnaround
          - Track consultant deliverable
      - Assign to Designer:
          - Add to designer's task list
          - Set SLA: 5-10 days turnaround
          - Designer revises drawings
      - Escalate to Lead:
          - Notify Design Team Lead
          - Schedule review meeting
          - Determine if redesign feasible or if need to request variance
    default_fallback: If discipline unclear, assign to Designer and flag for Lead review

  - name: Determine Utilization Status
    decision_maker: Windmill (KPI calculation)
    decision_criteria: |
      utilization_rate = (billable_hours / available_hours) * 100
      IF utilization_rate < 70 THEN status = 'UNDER_UTILIZED'
      ELSE IF utilization_rate >= 70 AND utilization_rate <= 85 THEN status = 'ON_TARGET'
      ELSE status = 'OVER_UTILIZED'
    possible_outcomes:
      - UNDER_UTILIZED: Team has excess capacity
      - ON_TARGET: Healthy utilization (70-85%)
      - OVER_UTILIZED: Risk of burnout (>85%)
    next_actions:
      - UNDER_UTILIZED:
          - Generate recommendation: "Consider taking on additional projects or reducing team size"
          - Notify Managing Director in KPI report
      - ON_TARGET:
          - No action required
          - Include positive note in KPI report
      - OVER_UTILIZED:
          - Generate recommendation: "Team is over-utilized - risk of burnout. Consider hiring or reducing project load"
          - Flag as CRITICAL priority in KPI report
          - Notify Managing Director immediately
    default_fallback: N/A (calculation always produces a result)
```

---

## 6. Inputs & Outputs (Data Exchange)

**Definition**: Data consumed and produced at each workflow step.

### Components to Capture

| Component | Description | Example (Design Team) |
|-----------|-------------|----------------------|
| **Input Name** | Data element name | `lot_size_sf` |
| **Input Type** | Data type | `integer` |
| **Input Source** | Where the data comes from | `BPO project record` |
| **Required** | Is this input mandatory? | `Yes` |
| **Validation** | Rules the input must satisfy | `Must be > 0 and < 100000` |
| **Output Name** | Data element produced | `estimated_buildable_sf` |
| **Output Type** | Data type | `integer` |
| **Output Destination** | Where the data is sent | `Connect 2.0 Project DB` |

### Workshop Questions

- What data is needed to start this step?
- Where does each input come from?
- What data is created or modified?
- Where does each output go?
- What validations must the data pass?

### Example: Schematic Design Inputs/Outputs

```yaml
workflow_step: Generate Schematic Design

inputs:
  - name: project_name
    type: string
    source: Connect 2.0 Project record
    required: true
    validation: "Must be non-empty, max 200 characters"

  - name: lot_size_sf
    type: integer
    source: Connect 2.0 Project record (from BPO intake)
    required: true
    validation: "Must be > 0 and < 100000"

  - name: estimated_buildable_sf
    type: integer
    source: Feasibility workflow output
    required: true
    validation: "Must be <= lot_size_sf"

  - name: jurisdiction
    type: string
    source: Connect 2.0 Project record
    required: true
    validation: "Must be in jurisdiction enum list"

  - name: design_requirements
    type: text
    source: Client (via acquisitions notes in BPO)
    required: false
    validation: "Max 5000 characters"

  - name: target_units
    type: integer
    source: Connect 2.0 Project record
    required: true
    validation: "Must be >= 1, typically 1-4 for townhomes"
    default: 1

outputs:
  - name: site_plan.pdf
    type: file (PDF)
    destination: AWS S3 /projects/{project-id}/schematic/site-plan.pdf
    size_estimate: "1-2 MB"

  - name: floor_plans.pdf
    type: file (PDF)
    destination: AWS S3 /projects/{project-id}/schematic/floor-plans.pdf
    size_estimate: "2-4 MB (multiple sheets)"

  - name: elevations.pdf
    type: file (PDF)
    destination: AWS S3 /projects/{project-id}/schematic/elevations.pdf
    size_estimate: "1-2 MB"

  - name: renderings
    type: array of files (PNG)
    destination: AWS S3 /projects/{project-id}/schematic/renderings/
    size_estimate: "3-5 MB per rendering, 3-5 renderings typical"

  - name: schematic_design_package
    type: file (PDF - compiled)
    destination: DocuSign (for client approval) + AWS S3 (archive)
    size_estimate: "10-15 MB combined package"

  - name: schematic_approval_date
    type: datetime
    destination: Connect 2.0 Project record
    set_when: DocuSign webhook confirms signature complete

  - name: design_metrics
    type: object
    destination: Connect 2.0 Project record
    fields:
      - total_livable_sf: integer
      - bedrooms_count: integer
      - bathrooms_count: integer
      - efficiency_rating: float (livable_sf / buildable_sf)

  - name: hours_logged
    type: integer (hours)
    destination: Everhour time entry + Connect 2.0 task record
    typical_value: 16-24 hours for schematic phase
```

---

## 7. Rules (Business Logic)

**Definition**: Constraints, validations, and business policies that govern workflow behavior.

### Components to Capture

| Component | Description | Example (Design Team) |
|-----------|-------------|----------------------|
| **Rule Name** | Descriptive rule identifier | `Seattle Design Review Requirement` |
| **Rule Type** | Validation, Constraint, Policy, Calculation | `Constraint` |
| **Condition** | When the rule applies | `IF jurisdiction = 'Seattle' AND lot_size_sf > 4000` |
| **Action** | What the rule enforces | `THEN require_design_review = true` |
| **Enforced By** | System or Manual | `System (automated)` |
| **Consequence** | What happens if violated | `Cannot submit permit without design review approval` |

### Workshop Questions

- What business rules govern this workflow?
- What validations must data pass?
- What constraints limit actions or decisions?
- What policies must be followed?
- Are rules enforced automatically or manually?

### Example: Design Team Business Rules

```yaml
business_rules:
  - name: Seattle Design Review Requirement
    type: Constraint
    condition: "jurisdiction = 'Seattle' AND lot_size_sf > 4000"
    action: "require_design_review = true"
    enforced_by: System (automated validation)
    consequence: "Cannot submit permit without design review board approval"
    reference: "Seattle Municipal Code 23.41.004"

  - name: Maximum Coverage Ratio by Jurisdiction
    type: Constraint
    condition: "ALWAYS (applies to all projects)"
    action: |
      IF jurisdiction = 'Seattle' THEN max_coverage_ratio = 0.35
      ELSE IF jurisdiction = 'Shoreline' THEN max_coverage_ratio = 0.40
      ELSE max_coverage_ratio = 0.45 (default)
    enforced_by: System (feasibility calculation)
    consequence: "Estimated buildable SF cannot exceed lot_size_sf * max_coverage_ratio"
    reference: "Jurisdiction zoning codes"

  - name: Consultant Coordination SLA
    type: Policy
    condition: "consultant_task_created"
    action: "consultant_due_date = task_created_date + 14 days"
    enforced_by: Manual (Design Team Lead monitors)
    consequence: "If consultant late, escalate to Managing Director"
    reference: "Design Team DOM - Consultant Management"

  - name: RFI Response Time by Urgency
    type: Policy
    condition: "rfi_received"
    action: |
      IF urgency = 'CRITICAL' THEN response_due_hours = 4
      ELSE IF urgency = 'HIGH' THEN response_due_hours = 24
      ELSE response_due_hours = 48
    enforced_by: System (SLA tracking + notifications)
    consequence: "Breach of SLA flagged in KPI report, escalation notification sent"
    reference: "Design Team DOM - Construction Admin"

  - name: Schematic Design Cannot Exceed Buildable SF
    type: Validation
    condition: "schematic_design_created"
    action: "total_livable_sf <= estimated_buildable_sf"
    enforced_by: System (validation on save)
    consequence: "Designer receives error: 'Design exceeds buildable area, reduce footprint or stories'"
    reference: "Design Team best practices"

  - name: Utilization Rate Target Range
    type: Policy
    condition: "monthly_kpi_calculation"
    action: |
      target_utilization_min = 70%
      target_utilization_max = 85%
      IF utilization_rate < 70% THEN status = 'UNDER_UTILIZED'
      ELSE IF utilization_rate > 85% THEN status = 'OVER_UTILIZED'
    enforced_by: System (KPI workflow)
    consequence: "Status flagged in monthly report, recommendations generated for Managing Director"
    reference: "Design Team DOM - KPI Targets"

  - name: Permit Set Cannot Submit Without Consultant Drawings
    type: Validation
    condition: "permit_set_submission_attempted"
    action: |
      required_consultants = determine_required_consultants(project_complexity)
      FOR EACH consultant IN required_consultants:
        IF consultant.deliverable_uploaded = false THEN block_submission = true
    enforced_by: System (pre-submission validation)
    consequence: "Cannot submit permit until all required consultant drawings uploaded"
    reference: "Jurisdiction permit requirements"

  - name: Maximum Correction Rounds Before Escalation
    type: Policy
    condition: "correction_round_completed"
    action: |
      IF correction_round_count > 2 THEN escalate_to_managing_director = true
    enforced_by: System (automatic escalation)
    consequence: "Managing Director reviews project for quality issues or jurisdiction problems"
    reference: "Design Team DOM - Quality Control"
```

---

## 8. Integrations (External Systems)

**Definition**: External systems and APIs involved in the workflow.

### Components to Capture

| Component | Description | Example (Design Team) |
|-----------|-------------|----------------------|
| **System Name** | External system identifier | `DocuSign` |
| **Integration Type** | Inbound, Outbound, Bi-directional | `Bi-directional` |
| **Integration Method** | REST API, Webhook, File Export, Email, Manual | `REST API + Webhook` |
| **Data Exchanged** | What data flows | `Outbound: signature request. Inbound: signed document + completion event` |
| **Frequency** | How often integration occurs | `2-3 times per project` |
| **Dependencies** | What relies on this integration | `Schematic approval workflow cannot proceed without DocuSign webhook` |

### Workshop Questions

- What external systems are involved?
- How does data flow in/out of each system?
- What triggers the integration?
- What happens if the integration fails?
- Who owns/maintains the external system?

### Example: Design Team Integrations

```yaml
integrations:
  - name: BPO (Blueprint Online)
    integration_type: Inbound (Phase 1), None (Phase 2 - BPO rebuilt in Connect 2.0)
    integration_method: REST API or Firebase export
    data_exchanged:
      outbound_from_bpo:
        - project_name
        - project_address
        - jurisdiction
        - lot_size_sf
        - property_value
        - acquisitions_contact
      inbound_to_bpo:
        - project_status updates (feasibility complete, schematic approved, permit submitted, etc.)
    frequency: 3-5 project intakes per week, status updates as they occur
    dependencies: Project Intake workflow requires BPO data to start
    failure_mode: If BPO unavailable, manually enter project data into Connect 2.0
    owner: Blueprint IT (internal)

  - name: DocuSign
    integration_type: Bi-directional
    integration_method: REST API (outbound) + Webhook (inbound)
    data_exchanged:
      outbound_to_docusign:
        - schematic_design_package.pdf
        - client_email
        - client_name
        - envelope_subject
      inbound_from_docusign:
        - envelope_id
        - signature_status (sent, delivered, completed, declined)
        - signed_document_url
        - completion_datetime
    frequency: 2-3 envelope sends per week
    dependencies: Schematic Design workflow waits for DocuSign webhook to advance to Design Development
    failure_mode: If webhook not received within 7 days, send reminder to client + manual status check
    owner: DocuSign (external SaaS)

  - name: AWS S3
    integration_type: Outbound (upload documents)
    integration_method: AWS SDK (boto3 or AWS CLI)
    data_exchanged:
      outbound_to_s3:
        - site_plan.pdf
        - floor_plans.pdf
        - permit_set.pdf
        - consultant_drawings
        - asi_documents
        - site_visit_photos
    frequency: Continuous (as documents created)
    dependencies: All workflows rely on S3 for document storage
    failure_mode: If S3 unavailable, retry 3 times with exponential backoff, then escalate to DevOps
    owner: AWS (Blueprint account)

  - name: Azure Document Intelligence
    integration_type: Inbound (document analysis)
    integration_method: REST API
    data_exchanged:
      outbound_to_azure:
        - correction_letter.pdf (URL or file upload)
      inbound_from_azure:
        - extracted_text
        - identified_corrections (array)
        - confidence_scores
    frequency: 1-2 correction letters per project (60-80% of projects)
    dependencies: Permit Corrections workflow uses Azure to auto-categorize corrections
    failure_mode: If Azure fails, Designer manually reads correction letter and categorizes
    owner: Microsoft Azure (Blueprint subscription)

  - name: Everhour (Time Tracking)
    integration_type: Outbound (log time)
    integration_method: REST API
    data_exchanged:
      outbound_to_everhour:
        - user_id
        - project_id
        - hours_worked
        - work_date
        - task_description (e.g., "Schematic Design")
    frequency: After each workflow step completes
    dependencies: KPI Tracking workflow requires Everhour data for productivity metrics
    failure_mode: If Everhour unavailable, queue time entries and batch sync later
    owner: Everhour (external SaaS)

  - name: Engineering Consultants (Email)
    integration_type: Bi-directional
    integration_method: Email (SMTP outbound, IMAP/POP3 inbound for replies)
    data_exchanged:
      outbound_to_consultant:
        - project_assignment_email (PDF with project details)
        - task_deadline
      inbound_from_consultant:
        - consultant_deliverables (PDF attachments)
        - invoice (PDF)
    frequency: 2-4 consultants per project, 2-3 projects per week
    dependencies: Design Development workflow waits for consultant deliverables before permit submission
    failure_mode: If consultant late (>14 days), Design Team Lead follows up via phone
    owner: External consultants (various companies)

  - name: Jurisdiction Permit Portals
    integration_type: Outbound (manual submission)
    integration_method: Manual (web portal upload) - no API available
    data_exchanged:
      outbound_to_jurisdiction:
        - permit_application_form.pdf
        - permit_set_drawings.pdf
        - consultant_reports.pdf
        - permit_fees (payment)
    frequency: 2-3 permit submissions per week
    dependencies: Permit submission is manual step in Design Development workflow
    failure_mode: N/A (manual process, no automation to fail)
    owner: Jurisdiction (Seattle SDCI, King County, etc.)
    automation_opportunity: Web scraping for status updates (Phase 2)
```

---

## 9. Metrics (KPIs & Success Criteria)

**Definition**: Quantifiable measures of workflow performance and success.

### Components to Capture

| Component | Description | Example (Design Team) |
|-----------|-------------|----------------------|
| **Metric Name** | KPI identifier | `Schematic Design Cycle Time` |
| **Metric Type** | Duration, Count, Rate, Percentage, Cost | `Duration (days)` |
| **Calculation** | How the metric is computed | `schematic_approval_date - schematic_start_date` |
| **Target Value** | Goal to achieve | `14-21 days` |
| **Measurement Frequency** | How often measured | `Per project (continuous), reported monthly` |
| **Owner** | Who is responsible for this metric | `Design Team Lead` |

### Workshop Questions

- How do we measure success for this workflow?
- What are the target values for each metric?
- How often are metrics calculated?
- Who is responsible for each metric?
- What actions are taken if metrics miss targets?

### Example: Design Team KPIs

```yaml
kpis:
  - name: Schematic Design Cycle Time
    type: Duration (days)
    calculation: "schematic_approval_date - schematic_start_date"
    target_value: "14-21 days"
    measurement_frequency: "Per project, reported monthly in KPI dashboard"
    owner: Design Team Lead
    data_source: Connect 2.0 Project milestones
    threshold_warning: "> 21 days"
    threshold_critical: "> 28 days"
    action_if_missed: "Review with designer to identify bottlenecks (client delays, redesign, etc.)"

  - name: Design Development Hours (Actual vs Target)
    type: Variance (hours)
    calculation: "actual_hours - target_hours (24-40 hour range, avg 32)"
    target_value: "Within ±10% of target (29-35 hours)"
    measurement_frequency: "Per project, aggregated monthly"
    owner: Design Team Lead
    data_source: Everhour time entries
    threshold_warning: "> 40 hours (exceeds target range)"
    threshold_critical: "> 50 hours (significantly over budget)"
    action_if_missed: "Review estimating process, determine if project complexity underestimated"

  - name: Team Utilization Rate
    type: Percentage
    calculation: "(billable_hours / total_available_hours) * 100"
    target_value: "70-85%"
    measurement_frequency: "Monthly"
    owner: Managing Director
    data_source: Everhour (billable hours) + Team roster (available hours)
    threshold_warning: "< 70% (under-utilized) or > 85% (over-utilized)"
    threshold_critical: "< 60% (significant excess capacity) or > 95% (burnout risk)"
    action_if_missed:
      under_utilized: "Consider taking on more projects or reducing team size"
      over_utilized: "Consider hiring additional designers or reducing project load"

  - name: Permit Approval Success Rate (First Submission)
    type: Percentage
    calculation: "(permits_approved_first_submission / total_permits_submitted) * 100"
    target_value: "> 40% (industry benchmark: 20-40%)"
    measurement_frequency: "Monthly"
    owner: Design Team Lead
    data_source: Connect 2.0 Project records (correction rounds count)
    threshold_warning: "< 30%"
    threshold_critical: "< 20%"
    action_if_missed: "Review common correction types, provide training to designers, improve QA process"

  - name: Average Correction Rounds per Project
    type: Count
    calculation: "SUM(correction_rounds) / COUNT(projects_completed)"
    target_value: "1-2 rounds"
    measurement_frequency: "Monthly"
    owner: Design Team Lead
    data_source: Connect 2.0 Project records
    threshold_warning: "> 2 rounds average"
    threshold_critical: "> 3 rounds average"
    action_if_missed: "Indicates quality issues or jurisdiction coordination problems - review with team"

  - name: RFI Response Time (% Within SLA)
    type: Percentage
    calculation: "(rfis_responded_within_sla / total_rfis) * 100"
    target_value: "> 95%"
    measurement_frequency: "Monthly"
    owner: Design Team Lead
    data_source: Connect 2.0 CA event records
    threshold_warning: "< 90%"
    threshold_critical: "< 80%"
    action_if_missed: "Review workload distribution, determine if team needs support"

  - name: Consultant Deliverable On-Time Rate
    type: Percentage
    calculation: "(consultant_deliverables_on_time / total_consultant_tasks) * 100"
    target_value: "> 85%"
    measurement_frequency: "Monthly"
    owner: Design Team Lead
    data_source: Connect 2.0 Consultant task records
    threshold_warning: "< 80%"
    threshold_critical: "< 70%"
    action_if_missed: "Review consultant SLAs, consider changing consultant partners"

  - name: Project Profitability (Hours vs Budget)
    type: Variance (hours)
    calculation: "actual_hours - budgeted_hours"
    target_value: "Within budget (±5%)"
    measurement_frequency: "Per project, reported monthly"
    owner: Managing Director
    data_source: Everhour (actual) + Project estimate (budget)
    threshold_warning: "> 10% over budget"
    threshold_critical: "> 20% over budget"
    action_if_missed: "Review scope creep, client change orders, internal inefficiencies"
```

---

## 10. Edge Cases (Exceptions & Alternate Paths)

**Definition**: Non-standard scenarios, error conditions, and alternate workflow paths.

### Components to Capture

| Component | Description | Example (Design Team) |
|-----------|-------------|----------------------|
| **Edge Case Name** | Scenario identifier | `Client Rejects Schematic Design` |
| **Frequency** | How often this occurs | `Rare (<5% of projects)` |
| **Trigger** | What causes this scenario | `Client declines DocuSign envelope` |
| **Impact** | Effect on workflow | `Blocks progression to Design Development` |
| **Handling** | How to address | `Schedule client meeting, revise design, resubmit for approval` |
| **Recovery** | How to get back to normal flow | `After revisions approved, workflow resumes at Design Development phase` |

### Workshop Questions

- What can go wrong at each step?
- What happens if data is missing or invalid?
- What if an external system is unavailable?
- What if a deadline is missed?
- What alternate paths exist (e.g., expedited review)?

### Example: Design Team Edge Cases

```yaml
edge_cases:
  - name: Client Rejects Schematic Design
    frequency: Rare (<5% of projects)
    trigger: "Client declines DocuSign envelope or provides extensive negative feedback"
    impact: "Blocks progression to Design Development phase"
    handling:
      - step_1: "Design Team Lead contacts client to understand concerns"
      - step_2: "Schedule meeting (phone or in-person) to discuss revisions"
      - step_3: "Assign designer to revise schematic per client feedback"
      - step_4: "Resubmit revised schematic for approval"
    recovery: "After client approves revised schematic, workflow resumes at Design Development"
    estimated_delay: "1-2 weeks for revisions + client review"

  - name: Permit Application Rejected (Not Just Corrections)
    frequency: Very rare (<1% of projects)
    trigger: "Jurisdiction determines project does not meet fundamental zoning requirements"
    impact: "Cannot proceed with permit, may require full redesign or variance request"
    handling:
      - step_1: "Escalate immediately to Managing Director + Acquisitions Team"
      - step_2: "Review rejection letter to understand specific zoning violation"
      - step_3_option_a: "If variance possible, prepare variance application (adds 60-90 days)"
      - step_3_option_b: "If redesign required, return to Schematic Design phase"
      - step_3_option_c: "If unresolvable, recommend project cancellation"
    recovery: "Highly variable - may add 3-6 months or result in project termination"
    estimated_delay: "60-180 days (or project cancellation)"

  - name: Consultant Significantly Late (>30 days)
    frequency: Occasional (10-15% of projects)
    trigger: "Consultant misses SLA by >30 days"
    impact: "Delays permit submission, affects project timeline and budget"
    handling:
      - step_1: "Design Team Lead contacts consultant to understand delay"
      - step_2: "If consultant cannot deliver, engage backup consultant"
      - step_3: "If backup also delayed, escalate to Managing Director for client communication"
      - step_4: "Update project timeline, notify acquisitions team and client"
    recovery: "Resume permit submission workflow once consultant delivers"
    estimated_delay: "2-6 weeks additional delay"

  - name: Jurisdiction Portal Down During Submission
    frequency: Rare (2-3 times per year)
    trigger: "City/county permit portal maintenance or outage"
    impact: "Cannot submit permit application on scheduled date"
    handling:
      - step_1: "Check jurisdiction website for maintenance schedule"
      - step_2: "If planned maintenance, reschedule submission for next available date"
      - step_3: "If unplanned outage, monitor portal and submit as soon as available"
      - step_4: "Notify client of delay (typically 1-3 days)"
    recovery: "Submit as soon as portal available, no workflow changes needed"
    estimated_delay: "1-3 days"

  - name: Critical RFI Received After Hours (Weekend/Evening)
    frequency: Occasional (5-10 per year)
    trigger: "Contractor submits CRITICAL urgency RFI outside business hours"
    impact: "4-hour SLA may be breached if not addressed immediately"
    handling:
      - step_1: "System sends SMS/push notification to on-call designer"
      - step_2: "Designer reviews RFI and determines if truly critical"
      - step_3_option_a: "If truly critical (safety/shutdown risk), respond immediately"
      - step_3_option_b: "If not critical, downgrade urgency and respond next business day"
    recovery: "Resume normal RFI workflow after emergency response"
    estimated_delay: "N/A (emergency response)"

  - name: Multiple Correction Rounds (>3 Rounds)
    frequency: Rare (<5% of projects)
    trigger: "Jurisdiction issues 3rd round of corrections (unusual)"
    impact: "Significant timeline delay, quality concerns, budget overruns"
    handling:
      - step_1: "Automatic escalation to Managing Director after round 3"
      - step_2: "Review correction history to identify root cause (designer error, jurisdiction confusion, etc.)"
      - step_3: "Schedule meeting with jurisdiction reviewer to clarify remaining issues"
      - step_4: "Consider engaging senior designer or external expert if quality issue"
    recovery: "Address corrections with heightened QA review, submit final revision"
    estimated_delay: "4-8 weeks additional beyond normal permit review"

  - name: Schematic Design Exceeds Buildable Area
    frequency: Occasional (10% of projects, usually caught early)
    trigger: "Designer creates schematic with total_livable_sf > estimated_buildable_sf"
    impact: "Design is not feasible, requires reduction in size or stories"
    handling:
      - step_1: "System validation blocks saving schematic design"
      - step_2: "Display error message: 'Design exceeds buildable area by X SF'"
      - step_3: "Designer reduces footprint, stories, or adjusts design to fit"
      - step_4: "Revalidate and save"
    recovery: "Resume schematic workflow after design adjusted to fit buildable area"
    estimated_delay: "1-3 days for redesign"

  - name: Client Non-Responsive (No Schematic Approval After 14 Days)
    frequency: Occasional (15-20% of projects)
    trigger: "Client has not responded to DocuSign envelope after 14 days"
    impact: "Project stalled, designer capacity tied up, timeline at risk"
    handling:
      - step_1: "System sends automated reminder email (day 7)"
      - step_2: "System sends 2nd reminder email (day 14)"
      - step_3: "Design Team Lead contacts client directly (phone) after day 14"
      - step_4: "If no response by day 21, escalate to Acquisitions Team to contact client"
      - step_5: "If no response by day 30, put project on hold and reallocate designer capacity"
    recovery: "When client responds, resume Design Development workflow"
    estimated_delay: "Variable (2-8 weeks typical)"

  - name: Engineering Consultant Deliverable Has Errors
    frequency: Occasional (10-15% of consultant deliverables)
    trigger: "Designer or jurisdiction identifies error in consultant's work (calculations, plans, etc.)"
    impact: "Cannot submit permit or must resubmit with corrected consultant drawings"
    handling:
      - step_1: "Designer notifies Design Team Lead of consultant error"
      - step_2: "Design Team Lead contacts consultant to request correction"
      - step_3: "Consultant revises and resubmits (typically 3-5 days)"
      - step_4: "Designer reviews corrected deliverable before proceeding"
    recovery: "Resume permit submission workflow with corrected consultant drawings"
    estimated_delay: "3-7 days for consultant revision"
```

---

## Workshop Facilitation Guide

### Pre-Workshop Preparation

**1. Stakeholder Identification**
- Identify 1-2 representatives from each actor group
- Include both "power users" and occasional users
- Invite IT/technical stakeholders for integration discussions

**2. Session Planning**
- Allocate 2-3 hours per workflow
- Book conference room with whiteboard and projector
- Prepare digital collaboration tool (Miro, Mural, Figma)

**3. Pre-Reading**
- Send stakeholders the workflow name and 1-page overview
- Ask them to come prepared with examples of edge cases they've encountered

### Workshop Agenda (Per Workflow)

**Hour 1: Entities & Actors (30 min each)**
1. **Entity Mapping** (30 min)
   - Draw the primary entity lifecycle on whiteboard
   - Label all states, transitions, and triggers
   - Capture entity attributes
   - Document average time in each state

2. **Actor Identification** (30 min)
   - List all actors (people, systems, external parties)
   - For each actor, capture responsibilities and permissions
   - Identify decision authority
   - Map actors to workflow stages

**Hour 2: Events, Actions, Decisions (20 min each)**
3. **Event Triggers** (20 min)
   - What starts this workflow?
   - What external events can occur?
   - What scheduled events happen?
   - Capture event payloads and frequency

4. **Action Decomposition** (20 min)
   - Walk through each workflow step
   - For each step, identify specific actions performed
   - Capture inputs required and outputs produced
   - Estimate duration for each action

5. **Decision Point Analysis** (20 min)
   - Identify all branching logic
   - For each decision, capture criteria and outcomes
   - Define default/fallback behavior
   - Validate with stakeholders

**Hour 3: Rules, Integrations, Metrics, Edge Cases**
6. **Business Rules** (15 min)
   - Capture validations, constraints, policies
   - Identify which rules are automated vs manual
   - Document consequences of rule violations

7. **Integration Discovery** (15 min)
   - List all external systems involved
   - For each system, identify data exchanged
   - Capture integration method and frequency
   - Identify integration failure modes

8. **Metrics Definition** (15 min)
   - Define success criteria
   - Identify KPIs and target values
   - Determine measurement frequency
   - Assign ownership

9. **Edge Case Brainstorm** (15 min)
   - Ask: "What can go wrong?"
   - Capture exception scenarios and frequency
   - Document handling and recovery procedures

### Facilitation Tips

**Keep it Visual**
- Use sticky notes for entities, actors, actions
- Draw state diagrams on whiteboard
- Use different colors for different component types

**Ask Open-Ended Questions**
- "Walk me through a typical project from start to finish"
- "What happens if the client doesn't respond?"
- "How do you know this step is complete?"
- "What data do you need to make this decision?"

**Validate with Examples**
- "Let's use Greenwood Townhomes as an example..."
- Work through a real project to test the workflow
- Identify gaps and missing steps

**Capture Verbatim Quotes**
- Stakeholder pain points ("This takes way too long...")
- Improvement ideas ("If we could just automate...")
- Edge cases ("One time we had a project where...")

**Don't Solve in the Workshop**
- Focus on capturing current state and requirements
- Note improvement ideas for later prioritization
- Avoid debating technical solutions during discovery

### Post-Workshop Deliverables

**Immediate (Within 24 hours)**
1. Send stakeholders photo of whiteboard for validation
2. Draft workflow diagram with entities, actors, states
3. Create Jira epic with placeholder stories

**Short-Term (Within 1 week)**
1. Complete workflow documentation using this framework
2. Identify integration APIs that need research
3. Estimate development effort (story points or hours)
4. Schedule follow-up session to review documentation

**Medium-Term (Within 2 weeks)**
1. Create Figma mockups of workflow UI
2. Document API specifications for integrations
3. Prioritize edge cases (must-handle vs nice-to-have)
4. Update PRD with workflow requirements

---

## Example: Complete Workflow Analysis Template

Use this template to document each workflow analyzed in workshops:

```yaml
workflow_name: "Design Team - Schematic Design Phase"
workflow_id: "design_schematic_phase"
workshop_date: "2025-12-23"
stakeholders:
  - name: "John Smith"
    role: "Design Team Lead"
  - name: "Sarah Chen"
    role: "Senior Architect"
  - name: "Mike Johnson"
    role: "Acquisitions Specialist"

# 1. ENTITIES
entities:
  - name: "Project"
    current_state_on_entry: "Feasibility Approved"
    target_state_on_exit: "Schematic - Awaiting Client Approval"
    # ... (see Entity section above for full structure)

# 2. ACTORS
actors:
  - name: "Designer (Architect)"
    type: "Human (Internal)"
    # ... (see Actor section above for full structure)

# 3. EVENTS
events:
  - name: "Feasibility Approved"
    type: "User Action"
    # ... (see Event section above for full structure)

# 4. ACTIONS
actions:
  - name: "Generate Schematic Design"
    type: "Create"
    # ... (see Action section above for full structure)

# 5. DECISION POINTS
decision_points:
  - name: "Determine Project Complexity"
    decision_maker: "Design Team Lead"
    # ... (see Decision Point section above for full structure)

# 6. INPUTS & OUTPUTS
inputs:
  - name: "lot_size_sf"
    type: "integer"
    # ... (see Input/Output section above for full structure)

outputs:
  - name: "site_plan.pdf"
    type: "file (PDF)"
    # ... (see Input/Output section above for full structure)

# 7. BUSINESS RULES
business_rules:
  - name: "Seattle Design Review Requirement"
    type: "Constraint"
    # ... (see Business Rules section above for full structure)

# 8. INTEGRATIONS
integrations:
  - name: "DocuSign"
    integration_type: "Bi-directional"
    # ... (see Integration section above for full structure)

# 9. METRICS
kpis:
  - name: "Schematic Design Cycle Time"
    type: "Duration (days)"
    # ... (see Metrics section above for full structure)

# 10. EDGE CASES
edge_cases:
  - name: "Client Rejects Schematic Design"
    frequency: "Rare (<5%)"
    # ... (see Edge Cases section above for full structure)
```

---

## Tools & Techniques

### Recommended Tools for Documentation

**Diagramming**
- **Miro/Mural**: Collaborative whiteboarding for workshop sessions
- **Lucidchart**: State diagrams, flowcharts, swimlane diagrams
- **Figma/FigJam**: UI mockups + lightweight diagramming
- **Draw.io**: Free, open-source diagramming

**Documentation**
- **Confluence/Notion**: Structured documentation repository
- **Markdown (Git)**: Version-controlled documentation (this approach)
- **YAML/JSON**: Machine-readable workflow definitions (for automation)

**Requirements Management**
- **Jira**: Epic → Story → Subtask hierarchy
- **Linear**: Modern issue tracker with workflow states
- **GitHub Issues**: Lightweight, integrated with code

**Process Modeling (Advanced)**
- **BPMN Tools** (Camunda, Signavio): Business Process Model and Notation
- **UML Tools** (PlantUML, StarUML): Unified Modeling Language
- **Decision Model and Notation (DMN)**: For complex decision logic

### Notation Standards

**State Diagrams** (UML State Machine)
```
┌─────────────┐
│   State     │
│   Name      │
└──────┬──────┘
       │ transition [condition] / action
       ▼
┌─────────────┐
│  Next       │
│  State      │
└─────────────┘
```

**Swimlane Diagrams** (BPMN)
```
Acquisitions Team  │  Design Team         │  Client
───────────────────┼──────────────────────┼─────────────
                   │                      │
 [Submit Project]  │                      │
        │          │                      │
        ▼          │                      │
   ┌────────┐      │                      │
   │Intake  │─────>│                      │
   └────────┘      │  [Feasibility]       │
                   │      │               │
                   │      ▼               │
                   │  ┌────────┐          │
                   │  │Schematic│─────────>│
                   │  └────────┘          │
                   │                      │ [Approve]
                   │                      │    │
                   │      ┌────────┐      │    │
                   │  <───│Approved│<─────┘    ▼
                   │      └────────┘          ✓
```

**Decision Trees**
```
                 Project Complexity?
                        │
        ┌───────────────┼───────────────┐
        │               │               │
     Simple          Medium           High
        │               │               │
        ▼               ▼               ▼
   Junior Designer  Mid Designer   Senior Designer
   80-100 hrs      100-120 hrs     120-144 hrs
   2 consultants   3 consultants   4 consultants
```

---

## Appendix: Real-World Example

### Workshop Output: Permit Corrections Workflow

**Workshop Participants**: Design Team Lead, 2 Architects, Managing Director
**Date**: December 23, 2025
**Duration**: 2.5 hours

**Key Findings**:

**Entities Identified**:
- Primary: `Project` (state: Permit Submitted → Corrections Required → Permit Submitted → Permit Approved)
- Secondary: `CorrectionItem` (individual corrections from jurisdiction letter)

**Actors Identified**:
- Designer (Architect) - addresses architectural corrections
- Engineering Consultants - address discipline-specific corrections
- Design Team Lead - assigns corrections, reviews before resubmission
- Jurisdiction Reviewer - issues correction letters, reviews resubmissions

**Events Discovered**:
- Correction Letter Received (trigger: email from jurisdiction with PDF attachment)
- All Corrections Addressed (trigger: all CorrectionItem tasks marked complete)

**Actions Decomposed**:
1. Parse Correction Letter (automated via Azure Document Intelligence)
2. Categorize Corrections by Discipline (automated with human review)
3. Assign Corrections to Team/Consultants (semi-automated: system suggests, Lead confirms)
4. Address Individual Corrections (manual: revise drawings)
5. Compile Response Letter (semi-automated: template + manual entries)
6. Resubmit to Jurisdiction (manual: upload to jurisdiction portal)

**Decision Points Mapped**:
- **Decision 1**: Is this correction architectural or consultant-specific?
  - Criteria: Correction discipline (from categorization step)
  - Outcomes: Assign to Designer OR Assign to Consultant
- **Decision 2**: Can we address in current round or need clarification from jurisdiction?
  - Criteria: Correction clarity (designer assessment)
  - Outcomes: Address Now OR Request Clarification Meeting

**Rules Documented**:
- **Rule 1**: Correction turnaround must be within 10 business days (policy)
- **Rule 2**: Cannot resubmit if any CorrectionItem status != "Complete" (validation)
- **Rule 3**: If correction count > 15, auto-escalate to Managing Director (policy)

**Integrations Identified**:
- Jurisdiction email → Windmill (receive correction letter PDF)
- Azure Document Intelligence (extract corrections from PDF)
- Engineering Consultant email (send correction assignments)
- Jurisdiction portal (manual upload of response)

**Metrics Defined**:
- Correction turnaround time (target: <10 days)
- Average corrections per round (target: 5-15)
- % projects requiring >2 rounds (target: <20%)

**Edge Cases Captured**:
- **Edge Case 1**: Correction letter PDF is scanned image (poor OCR quality)
  - Handling: Designer manually reads and enters corrections
- **Edge Case 2**: Jurisdiction requests in-person meeting to clarify corrections
  - Handling: Design Team Lead schedules meeting, updates correction items based on discussion
- **Edge Case 3**: Consultant unavailable (vacation, overbooked)
  - Handling: Engage backup consultant or extend deadline

---

**Document Status**: Planning Framework
**Last Updated**: December 23, 2025
**Next Review**: Before first cross-functional workshop (Day 15-20)
**Owner**: Clay Campbell (Solutions Architect)
