# SpiffWorkflow Architecture for Property Development Workflow

## Your Business Process Overview

Based on your PDF, here's your value stream hierarchy:

```
Value Stream (VS) - The big picture stages
├── VS1: Lead Intake, Discovery & Initial Review
├── VS2: Feasibility, Due Diligence & Consultant Coordination
├── VS4: Design & Entitlement (Permitting)
├── VS5: Underwriting, Loan Structuring, Documentation & Builder Assignment
├── VS5.5: Land Loan (conditional - when permit not ready)
├── VS6: Construction Servicing, Draws & Inspections
├── VS7: Payoff, Reconveyance & Closeout
└── VS8: Builder Accounting Services (parallel/support)
```

Each VS contains **Workflow Groups**, and each Group contains **Workflow Steps**.

---

## How This Maps to SpiffWorkflow/BPMN

### Conceptual Mapping

| Your Concept | BPMN Concept | SpiffWorkflow Implementation |
|--------------|--------------|------------------------------|
| Value Stream | Process / Collaboration | Top-level BPMN Process or Pool |
| Workflow Group | Sub-Process or Call Activity | Collapsed Sub-Process |
| Workflow Step | User Task / Service Task | Task within Sub-Process |
| Property Item | Process Instance | One workflow instance per property |
| Decision Maker | Lane Assignment | BPMN Lane + Your DB |
| Ad-hoc routing | Exclusive Gateway + Signals | Gateway with decision maker input |

### Key Insight: Your Workflow is NOT Multi-Instance

Each **property** is a single workflow instance that moves through the value streams. The "40 properties being worked on" means 40 **separate workflow instances**, not 40 parallel tasks within one workflow.

```
Property #001 ──────────────────────────────────────────────────────────────►
                VS1 → VS2 → VS4 → VS5 → VS6 → VS7
                           ↑
                      (currently here)

Property #002 ──────────────────────────────────────────────────────────────►
                VS1 → VS2 → ...
                      ↑
                 (currently here)

Property #003 ──────────────────────────────────────────────────────────────►
                VS1 → VS2 → VS4 → VS5.5 → (waiting for permit) → VS5 → ...
                                   ↑
                              (currently here - took land loan path)
```

---

## BPMN Structure for Your Process

### Top-Level Process (Value Stream Flow)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  Property Development Process (one instance per property)                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  ○ Start                                                                                │
│  │ (Lead New)                                                                           │
│  ▼                                                                                      │
│  ┌──────────────────┐     ┌──────────────────┐                                         │
│  │ VS1: Lead Intake │────▶│ VS2: Feasibility │                                         │
│  │ [Sub-Process]    │     │ [Sub-Process]    │                                         │
│  └──────────────────┘     └────────┬─────────┘                                         │
│         │                          │                                                    │
│         │ (In Contract)            │ (Go Decision Made)                                │
│         ▼                          ▼                                                    │
│                              ◇ Go/No-Go?                                               │
│                             / \                                                         │
│                     No-Go /   \ Go                                                      │
│                          ▼     ▼                                                        │
│                    ○ End   ┌──────────────────┐                                        │
│                    (Dead)  │ VS4: Design &    │                                        │
│                            │ Entitlement      │                                        │
│                            │ [Sub-Process]    │                                        │
│                            └────────┬─────────┘                                        │
│                                     │ (Permit Approved)                                │
│                                     ▼                                                   │
│                              ┌──────────────────┐                                      │
│                              │ VS5: Underwriting│                                      │
│                              │ [Sub-Process]    │                                      │
│                              └────────┬─────────┘                                      │
│                                       │                                                 │
│                                       ◇ Permit Ready?                                  │
│                                      / \                                               │
│                               No    /   \ Yes                                          │
│                                    ▼     ▼                                             │
│                        ┌──────────────┐  │                                             │
│                        │ VS5.5: Land  │  │                                             │
│                        │ Loan         │  │                                             │
│                        │ [Sub-Process]│  │                                             │
│                        └──────┬───────┘  │                                             │
│                               │          │                                              │
│                               │ (Land Loan Active)                                     │
│                               │          │                                              │
│                               └────┬─────┘                                             │
│                                    │ (Construction Loan Active)                        │
│                                    ▼                                                    │
│                              ┌──────────────────┐                                      │
│                              │ VS6: Construction│                                      │
│                              │ Servicing        │                                      │
│                              │ [Sub-Process]    │                                      │
│                              └────────┬─────────┘                                      │
│                                       │ (Draw Funded)                                  │
│                                       ▼                                                 │
│                              ┌──────────────────┐                                      │
│                              │ VS7: Payoff &    │                                      │
│                              │ Closeout         │                                      │
│                              │ [Sub-Process]    │                                      │
│                              └────────┬─────────┘                                      │
│                                       │ (Loan Paid Off, Lien Released)                 │
│                                       ▼                                                 │
│                                  ○ End                                                 │
│                                  (Complete)                                            │
│                                                                                         │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  VS8: Builder Accounting (runs in parallel when builder assigned)                      │
│  [Parallel Sub-Process triggered by message from VS5]                                  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Example: VS4 Design & Entitlement (Expanded Sub-Process)

Based on a typical design/permitting workflow:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  VS4: Design & Entitlement [Sub-Process]                                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │ LANE: Design Team                                                                │   │
│  │                                                                                  │   │
│  │  ○ Start ──▶ □ Schematic Design ──▶ □ Blueprint Creation ──▶ □ 3D Rendering    │   │
│  │              (Architect)             (Architect)              (Designer)         │   │
│  │                                                                       │          │   │
│  └───────────────────────────────────────────────────────────────────────┼──────────┘   │
│                                                                          │              │
│  ┌───────────────────────────────────────────────────────────────────────┼──────────┐   │
│  │ LANE: Review & QA                                                     │          │   │
│  │                                                                       ▼          │   │
│  │                                              □ Design Review ◀────────┘          │   │
│  │                                              (Consultant)                        │   │
│  │                                                    │                             │   │
│  │                                                    ◇ Approved?                   │   │
│  │                                                   / \                            │   │
│  │                                            No    /   \ Yes                       │   │
│  │                                                 ▼     ▼                          │   │
│  │                               (loop back to    │     │                           │   │
│  │                                Blueprint)      │     │                           │   │
│  └────────────────────────────────────────────────┼─────┼───────────────────────────┘   │
│                                                   │     │                               │
│  ┌────────────────────────────────────────────────┼─────┼───────────────────────────┐   │
│  │ LANE: Permitting                               │     │                           │   │
│  │                                                │     ▼                           │   │
│  │                                                │  □ Permit Application           │   │
│  │                                                │  (Permit Coordinator)           │   │
│  │                                                │         │                       │   │
│  │                                                │         ▼                       │   │
│  │                                                │  □ Municipal Review             │   │
│  │                                                │  (External - Timer)             │   │
│  │                                                │         │                       │   │
│  │                                                │         ◇ Permit Granted?       │   │
│  │                                                │        / \                      │   │
│  │                                                │  No   /   \ Yes                 │   │
│  │                                                │      ▼     ▼                    │   │
│  │                                                │  □ Address  │                   │   │
│  │                                                │  Issues     │                   │   │
│  │                                                │      │      │                   │   │
│  │                                                │      └──────┤                   │   │
│  │                                                │             ▼                   │   │
│  │                                                │        ○ End                    │   │
│  │                                                │        (Permit Approved)        │   │
│  └────────────────────────────────────────────────┴─────────────────────────────────┘   │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│  │ LANE: Workflow Group Decision Maker                                               │   │
│  │                                                                                   │   │
│  │  At any point, Decision Maker can:                                               │   │
│  │  • Approve current state → Move to next step (default)                           │   │
│  │  • Send back → Return to previous workflow group                                 │   │
│  │  • Add ad-hoc step → Insert custom task before proceeding                        │   │
│  │  • Add reviewer → Assign additional user to current task                         │   │
│  │  • Skip step → Jump to a specific step (with justification)                      │   │
│  │                                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐ │   │
│  │  │  ◇ Decision Maker Gateway (at end of each workflow group)                   │ │   │
│  │  │     │                                                                       │ │   │
│  │  │     ├──▶ [Approve - Default] ──▶ Next Workflow Group                       │ │   │
│  │  │     ├──▶ [Send Back] ──▶ Previous Workflow Group (with reason)             │ │   │
│  │  │     ├──▶ [Ad-hoc Step] ──▶ Custom Task ──▶ Return to flow                  │ │   │
│  │  │     └──▶ [Skip to...] ──▶ Specified Workflow Group                         │ │   │
│  │  └─────────────────────────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Integration

### Your Data (PostgreSQL)

```sql
-- The property being worked on (your domain data)
CREATE TABLE properties (
    id UUID PRIMARY KEY,
    address TEXT,
    lead_source TEXT,
    builder_id UUID,
    current_value_stream TEXT,  -- VS1, VS2, VS4, etc.
    current_workflow_group TEXT,
    current_step TEXT,
    workflow_instance_id TEXT,  -- Links to SpiffWorkflow
    status TEXT,  -- active, completed, dead
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Documents attached to properties
CREATE TABLE property_documents (
    id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    document_type TEXT,  -- blueprint, 3d_rendering, permit, contract, etc.
    s3_bucket TEXT,
    s3_key TEXT,
    file_name TEXT,
    uploaded_by UUID,
    workflow_group TEXT,  -- which group this was uploaded in
    workflow_step TEXT,   -- which step
    metadata JSONB,       -- any additional info
    created_at TIMESTAMP
);

-- Workflow group assignments (who can do what)
CREATE TABLE workflow_group_assignments (
    id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    workflow_group TEXT,  -- VS4_design, VS4_permitting, etc.
    user_id UUID,
    role TEXT,  -- decision_maker, architect, consultant, permit_coordinator
    is_active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP
);

-- Activity/comments on properties
CREATE TABLE property_activity (
    id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    user_id UUID,
    activity_type TEXT,  -- comment, status_change, document_upload, decision
    content TEXT,
    workflow_group TEXT,
    workflow_step TEXT,
    metadata JSONB,
    created_at TIMESTAMP
);

-- Ad-hoc additions
CREATE TABLE adhoc_workflow_items (
    id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    created_by UUID,  -- the decision maker
    type TEXT,  -- extra_reviewer, adhoc_step, skip_to, send_back
    target_user_id UUID,  -- for extra_reviewer
    target_step TEXT,     -- for adhoc_step, skip_to, send_back
    reason TEXT,
    status TEXT,  -- pending, completed, cancelled
    created_at TIMESTAMP
);

-- Workflow definitions (the BPMN XML)
CREATE TABLE workflow_definitions (
    id UUID PRIMARY KEY,
    name TEXT,  -- "Property Development v3.2"
    version TEXT,
    bpmn_xml TEXT,  -- The actual BPMN from your editor
    status TEXT,  -- draft, published, archived
    created_by UUID,
    created_at TIMESTAMP,
    published_at TIMESTAMP
);
```

### SpiffWorkflow Data (Managed by the Engine)

SpiffWorkflow serializes its state. You'd store this alongside your data:

```sql
CREATE TABLE workflow_instances (
    id TEXT PRIMARY KEY,  -- SpiffWorkflow's instance ID
    definition_id UUID REFERENCES workflow_definitions(id),
    property_id UUID REFERENCES properties(id),
    serialized_state JSONB,  -- SpiffWorkflow's serialized workflow
    current_tasks JSONB,     -- Quick lookup of ready tasks
    status TEXT,  -- running, suspended, completed, errored
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## Handling Your Specific Scenarios

### Scenario 1: Normal Forward Flow
```
Decision Maker clicks [Approve]
    ↓
Your API: POST /api/properties/{id}/approve
    ↓
FastAPI:
    1. Update property status in your DB
    2. Get workflow instance from SpiffWorkflow
    3. Complete current user task
    4. SpiffWorkflow advances to next step (BPMN logic)
    5. Create new assignments for next workflow group
    6. Send notifications (Slack/email via Service Task)
```

### Scenario 2: Send Back to Previous Group
```
Decision Maker clicks [Send Back] with reason
    ↓
Your API: POST /api/properties/{id}/send-back
    {
        "target_group": "VS2",  // or determined by BPMN
        "reason": "Missing feasibility documents"
    }
    ↓
FastAPI:
    1. Log the send-back in property_activity
    2. Signal the workflow to move backward
       (BPMN handles this via Message Event or Gateway)
    3. Update property.current_workflow_group
    4. Notify VS2 team
```

### Scenario 3: Skip from WG2 → WG3 → WG1 → WG3
This is your complex routing scenario. In BPMN, this is handled by:

```
┌─────────────────────────────────────────────────────────────────────┐
│  Decision Maker Task (at end of each Workflow Group)                │
│                                                                     │
│  □ Review & Decide                                                  │
│     │                                                               │
│     ▼                                                               │
│  ◇ What's the decision?                                            │
│     │                                                               │
│     ├─[default: approve]──────────────────▶ Next WG (BPMN default) │
│     │                                                               │
│     ├─[send_back]─────────────────────────▶ ◇ Where to?            │
│     │                                          ├─▶ Previous WG     │
│     │                                          └─▶ Specific WG     │
│     │                                                               │
│     ├─[skip_to]───────────────────────────▶ ◇ Target WG            │
│     │                                          └─▶ Jump to WG      │
│     │                                                               │
│     └─[adhoc_step]────────────────────────▶ □ Ad-hoc Task          │
│                                                │                    │
│                                                └─▶ Return to flow  │
└─────────────────────────────────────────────────────────────────────┘
```

Your FastAPI code:
```python
@app.post("/api/properties/{property_id}/decision")
async def make_decision(
    property_id: str,
    decision: DecisionRequest  # action, target_group, reason, etc.
):
    property = await get_property(property_id)
    workflow = load_workflow_instance(property.workflow_instance_id)
    
    # Get current decision task
    task = get_decision_maker_task(workflow)
    
    # Set the decision data that BPMN gateway will use
    task.data["decision_action"] = decision.action  # approve, send_back, skip_to, adhoc
    task.data["target_group"] = decision.target_group
    task.data["reason"] = decision.reason
    
    # Complete the task - BPMN gateway routes based on decision_action
    workflow.run_task_from_id(task.id)
    
    # Save workflow state
    await save_workflow_instance(workflow)
    
    # Update your property record
    new_step = get_current_step(workflow)
    await update_property_step(property_id, new_step)
    
    # Log activity
    await log_activity(property_id, decision)
    
    return {"new_step": new_step, "status": "success"}
```

### Scenario 4: Multiple Users Working on Same Step
```
VS4 Design & Entitlement:
├── Architect: Uploads blueprint (document to S3)
├── Designer: Uploads 3D rendering (document to S3)  
├── Consultant: Reviews and comments
└── Decision Maker: Approves when ready

All users see the SAME property record, work in parallel.
Workflow doesn't advance until Decision Maker approves.
```

Your UI shows:
- The property details
- Documents uploaded by each user
- Comments/activity feed
- Status of who has done what
- [Approve] button only visible to Decision Maker

---

## The Approval Flow UI Pattern

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Property: 123 Main Street                                              │
│  Value Stream: VS4 - Design & Entitlement                               │
│  Workflow Group: Design Review                                          │
│  Step: Consultant Review                                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Assigned Users:                                                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────┐   │
│  │ Jane (Architect)│ │ Bob (Designer)  │ │ Sarah (Consultant)      │   │
│  │ ✓ Uploaded      │ │ ✓ Uploaded      │ │ ⏳ Reviewing...         │   │
│  │   blueprint     │ │   3D render     │ │                         │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Mike (Decision Maker)                                           │   │
│  │                                                                  │   │
│  │  Default next step: [VS4 - Permit Application]                  │   │
│  │                                                                  │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │   │
│  │  │  ✓ Approve   │ │  ↩ Send Back │ │  ⚡ Skip To   │            │   │
│  │  │  (Default)   │ │              │ │              │            │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘            │   │
│  │                                                                  │   │
│  │  ┌──────────────┐ ┌──────────────┐                              │   │
│  │  │  + Ad-hoc    │ │  + Reviewer  │                              │   │
│  │  │    Step      │ │              │                              │   │
│  │  └──────────────┘ └──────────────┘                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Documents:                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📄 blueprint_v2.pdf (Jane, 2 hours ago)              [Download] │   │
│  │ 🖼️ 3d_render_front.png (Bob, 1 hour ago)            [Download] │   │
│  │ 📄 structural_notes.pdf (Sarah, 30 min ago)          [Download] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Activity:                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Sarah: "Blueprint looks good. Need fire safety addendum."       │   │
│  │ Bob: "3D render updated with new window placement"              │   │
│  │ Jane: "Revised blueprint uploaded with fire safety section"     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Summary: SpiffWorkflow's Role vs Your App's Role

| Responsibility | SpiffWorkflow | Your App |
|----------------|---------------|----------|
| Define workflow structure | ✅ BPMN diagram | |
| Store workflow state | ✅ Serialized instance | |
| Determine valid transitions | ✅ Gateway logic | |
| Route based on decisions | ✅ Exclusive gateways | |
| Handle ad-hoc routing | ✅ Signals/Messages | Trigger via API |
| Property data | | ✅ Your PostgreSQL |
| Document storage | | ✅ S3 |
| User assignments | | ✅ Your DB |
| Comments/activity | | ✅ Your DB |
| UI | | ✅ Your React |
| Notifications | ✅ Service Tasks | Configure connectors |

SpiffWorkflow is the **traffic controller**—it knows the rules of the road and directs traffic. Your app is the **city**—it has all the actual buildings, people, and stuff.
