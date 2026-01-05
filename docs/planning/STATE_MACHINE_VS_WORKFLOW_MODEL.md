# State Machine vs. Workflow: Rethinking the Connect 2.0 Model

**Date**: December 30, 2025
**Status**: Conceptual Discussion
**Context**: Evaluating whether workflow-based or state-machine-based modeling better represents Blueprint's operations

## The Fundamental Question

**Current assumption**: Properties move through a workflow (Intake → Feasibility → Entitlement → etc.)

**Alternative view**: Properties are stateful entities that undergo transformations via various processes

## Two Mental Models Compared

### Model A: Workflow-Centric (Current Approach)

```
┌─────────┐    ┌────────────┐    ┌─────────────┐    ┌──────────────┐
│ Intake  │ -> │ Feasibility│ -> │ Entitlement │ -> │ Construction │
└─────────┘    └────────────┘    └─────────────┘    └──────────────┘
     ^              ^                   ^                    ^
     |              |                   |                    |
  Property      Property            Property            Property
  enters        enters              enters              enters
```

**Characteristics**:
- Property "moves" through stages
- Each stage is a container/module
- Linear progression assumed
- Epics organized by stage
- Stage-specific UI/forms
- "Where is this property right now?"

### Model B: State Machine (Alternative)

```
                    ┌──────────────────────────┐
                    │   PROPERTY (Entity)       │
                    │                          │
                    │  State: Active           │
                    │  Lifecycle: Feasibility   │
                    │  Risk Score: 8.5         │
                    │  Documents: [...]        │
                    │  Tasks: [...]            │
                    │  Approvals: [...]        │
                    └──────────────────────────┘
                              ^
                              |
        ┌─────────────────────┼─────────────────────┐
        |                     |                     |
   ┌────────┐          ┌──────────┐          ┌──────────┐
   │Process │          │ Process  │          │ Process  │
   │   A    │          │    B     │          │    C     │
   └────────┘          └──────────┘          └──────────┘
   Updates             Updates              Updates
   property            property             property
   state               state                state
```

**Characteristics**:
- Property is central, persistent entity
- Processes operate ON the property
- Non-linear - multiple processes can run simultaneously
- Epics organized by process/capability
- Property-centric UI with process panels
- "What operations can we perform on this property?"

## Real-World Scenarios: Which Model Fits Better?

### Scenario 1: Property Returns to Feasibility After Entitlement Issues

**Workflow Model**:
- Awkward: Property already "left" feasibility stage
- Need to "move backwards" in the workflow
- Or create exception handling for "re-feasibility"

**State Machine Model**:
- Natural: Property state changes to `lifecycle: re-feasibility`
- Feasibility process runs again
- No concept of "backwards" - just state transition

### Scenario 2: Multiple Parallel Activities

**Example**: While in entitlement phase, property also needs:
- Environmental assessment (new process)
- Title update (ongoing process)
- Community engagement (concurrent process)

**Workflow Model**:
- Where does the property "live" during this?
- Need sub-workflows or parallel tracks
- Complex stage management

**State Machine Model**:
- Property exists with state `lifecycle: entitlement`
- Multiple processes act on it simultaneously
- Each process updates relevant property attributes
- No ambiguity about "location"

### Scenario 3: Different Property Types Follow Different Paths

**Example**:
- Single-family subdivision: Intake → Feasibility → Entitlement → Construction
- Multi-family rehab: Intake → Feasibility → Construction (no entitlement)
- Land banking: Intake → Feasibility → Hold (no construction)

**Workflow Model**:
- Need multiple workflow definitions
- Hard to handle exceptions
- "What stage is a land-bank property in?"

**State Machine Model**:
- Property type determines which processes apply
- Process availability based on property attributes
- Flexible - new property types don't require new workflows

## Data Model Implications

### Workflow-Centric Schema

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  current_stage VARCHAR(50), -- "feasibility", "entitlement", etc.
  stage_entered_at TIMESTAMP,
  stage_data JSONB  -- Stage-specific fields
);

CREATE TABLE feasibility_data (
  property_id UUID REFERENCES properties(id),
  ...feasibility-specific fields...
);

CREATE TABLE entitlement_data (
  property_id UUID REFERENCES properties(id),
  ...entitlement-specific fields...
);
```

**Issues**:
- Stage-specific tables fragment property data
- `current_stage` field assumes single location
- Hard to query "all properties with pending environmental reviews" across stages

### State-Machine Schema

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  type VARCHAR(50),           -- "subdivision", "multi-family", etc.
  lifecycle_state VARCHAR(50), -- Current lifecycle phase
  risk_score DECIMAL(3,2),
  status VARCHAR(20),         -- "active", "paused", "closed"
  attributes JSONB            -- Flexible property data
);

CREATE TABLE property_state_history (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  state_type VARCHAR(50),     -- "lifecycle", "approval", "risk"
  previous_value VARCHAR(100),
  new_value VARCHAR(100),
  changed_at TIMESTAMP,
  changed_by UUID,
  process_id UUID             -- Which process caused this change
);

CREATE TABLE processes (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  process_type VARCHAR(50),   -- "feasibility-analysis", "title-review", etc.
  status VARCHAR(20),         -- "pending", "in-progress", "completed"
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE TABLE process_outputs (
  id UUID PRIMARY KEY,
  process_id UUID REFERENCES processes(id),
  output_type VARCHAR(50),
  data JSONB
);
```

**Benefits**:
- Property remains central, coherent entity
- State history tracks all changes (audit trail)
- Processes are first-class entities
- Easy to query across property lifecycle
- Supports concurrent processes naturally

## UI/UX Implications

### Workflow-Centric UI

```
┌─────────────────────────────────────────┐
│  Property: 123 Main St                  │
│  Current Stage: Feasibility             │
├─────────────────────────────────────────┤
│                                         │
│  [Feasibility Form Fields]              │
│  - Zoning check: [  ]                   │
│  - Environmental: [  ]                  │
│  - Utilities: [  ]                      │
│                                         │
│  [Advance to Entitlement] [Go Back]     │
└─────────────────────────────────────────┘
```

**Characteristics**:
- Stage-specific forms dominate
- Navigation is stage-based
- "Advance" or "go back" actions

### State-Machine UI

```
┌─────────────────────────────────────────────────────┐
│  Property: 123 Main St                              │
│  Type: Subdivision  │  Lifecycle: Feasibility       │
│  Status: Active     │  Risk: 8.5                    │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐  │
│  │ Overview    │ │ Documents   │ │ Tasks        │  │
│  └─────────────┘ └─────────────┘ └──────────────┘  │
├─────────────────────────────────────────────────────┤
│  Active Processes:                                  │
│  ┌─────────────────────────────────────────────┐   │
│  │ ⚙️ Feasibility Analysis      [In Progress]  │   │
│  │   - Zoning review: Complete                 │   │
│  │   - Environmental: Pending                  │   │
│  │   [View Details] [Update]                   │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │ 📄 Title Review              [Pending]       │   │
│  │   Waiting for title company response        │   │
│  │   [Start] [View History]                    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Available Actions:                                 │
│  [+ Start New Process] [Update Property] [Archive] │
└─────────────────────────────────────────────────────┘
```

**Characteristics**:
- Property details always visible
- Processes shown as cards/panels
- Actions available based on property state
- Multiple concurrent processes visible

## Epic Structure Comparison

### Current Structure (Workflow-Based)

```
Epic: Feasibility Module
  - Story: Zoning research UI
  - Story: Environmental checklist
  - Story: Feasibility report generation

Epic: Entitlement Module
  - Story: Application preparation
  - Story: Permit tracking
  - Story: Jurisdiction management
```

### Alternative Structure (Process-Based)

```
Epic: Property Management Core
  - Story: Property entity CRUD
  - Story: Property state management
  - Story: Property attribute system
  - Story: State history/audit log

Epic: Feasibility Process
  - Story: Feasibility process definition
  - Story: Zoning analysis workflow
  - Story: Environmental assessment workflow
  - Story: Feasibility report generation

Epic: Entitlement Process
  - Story: Entitlement process definition
  - Story: Application preparation workflow
  - Story: Permit tracking workflow

Epic: Process Orchestration
  - Story: Process registry
  - Story: Process state machine
  - Story: Process eligibility rules
  - Story: Concurrent process management
```

## Blueprint's Actual Operations: Which Model?

### Evidence for Workflow Model:
- ✅ Properties do generally progress through phases
- ✅ Each phase has distinct activities and outputs
- ✅ Clear handoffs between teams (Acquisitions → Design → Servicing)
- ✅ Reporting often phase-based ("properties in feasibility")

### Evidence for State Machine Model:
- ✅ Properties often loop back (re-feasibility, permit re-submissions)
- ✅ Multiple processes happen simultaneously (title review during feasibility)
- ✅ Different property types skip phases (rehab vs. new construction)
- ✅ Team members need to see full property context, not just current phase
- ✅ Exceptions are common (expedited entitlement, early construction start)
- ✅ "Progressive profiling" concept (data accumulates over time)

## Hybrid Approach: State Machine with Lifecycle Phases

**Recommendation**: Treat lifecycle phases as a **special state dimension**, not the organizing principle.

```typescript
interface Property {
  id: string;
  type: PropertyType;

  // State dimensions (not stages!)
  lifecycle: "intake" | "feasibility" | "entitlement" | "construction" | "servicing";
  status: "active" | "paused" | "on-hold" | "closed";
  approvalState: "pending" | "approved" | "rejected" | "needs-revision";
  riskLevel: number; // 0-10 score

  // Property data
  attributes: PropertyAttributes;

  // Current and historical processes
  activeProcesses: Process[];
  processHistory: ProcessHistory[];

  // State transitions
  stateHistory: StateChange[];
}

interface Process {
  id: string;
  type: ProcessType; // "feasibility-analysis", "zoning-review", etc.
  status: "pending" | "in-progress" | "completed" | "failed";
  propertyId: string;
  assignedTo: string;
  startedAt: Date;
  completedAt?: Date;
  outputs: ProcessOutput[];
}
```

### How This Works:

1. **Property** is the central entity with multiple state dimensions
2. **Lifecycle** is ONE of those dimensions (not the only one)
3. **Processes** operate on properties and update state
4. **State changes** trigger business rules (e.g., lifecycle advancement)
5. **UI** shows property + active processes, not "current stage"

### Example: Property Progressing Through System

```typescript
// Property created
const property = {
  id: "prop-123",
  type: "subdivision",
  lifecycle: "intake",
  status: "active",
  approvalState: "pending"
};

// Intake process completes
processEngine.complete({
  processType: "intake-qualification",
  propertyId: "prop-123",
  outputs: {
    initialScore: 8.5,
    marketAnalysis: {...}
  }
});
// Triggers rule: "if intake complete → lifecycle = 'feasibility'"

// Feasibility processes start (multiple concurrent)
processEngine.start({
  processType: "zoning-analysis",
  propertyId: "prop-123"
});
processEngine.start({
  processType: "environmental-assessment",
  propertyId: "prop-123"
});
processEngine.start({
  processType: "title-review",
  propertyId: "prop-123"
});

// All three run in parallel, updating property state as they complete
```

## Implementation Recommendations

### If We Adopt State Machine Model:

1. **Refactor data model**:
   - Central `properties` table
   - `processes` table (first-class entities)
   - `property_state_history` table
   - Remove stage-specific tables

2. **Refactor API design**:
   ```
   GET /properties/:id                    # Full property state
   GET /properties/:id/processes          # Active processes
   POST /properties/:id/processes         # Start new process
   PATCH /properties/:id/state            # Update property state
   GET /properties/:id/state-history      # Audit trail
   ```

3. **Refactor epic structure**:
   - Epic: Property Core
   - Epic: Process Engine
   - Epic: [Process Type] Implementation (for each process)
   - Epic: Business Rules & State Transitions

4. **Refactor UI**:
   - Property detail page (central hub)
   - Process panels (concurrent processes visible)
   - Action menu (available actions based on state)
   - Timeline view (state history visualization)

### Migration Path

**Phase 1: Keep workflow UI, add state model underneath**
- Implement state-machine data model
- Workflow UI becomes a "view" on top of state
- "Current stage" derived from `lifecycle` state dimension

**Phase 2: Expose process model in UI**
- Add "active processes" section to property view
- Allow starting processes independently of lifecycle

**Phase 3: Remove workflow constraints**
- Full state-machine UI
- Processes can be started in any order (subject to rules)
- Lifecycle becomes just one state dimension among many

## Questions to Resolve

1. **Is lifecycle phase still useful as a concept?**
   - Or is it just a derived state from completed processes?
   - "Property is in feasibility" vs. "Property has pending feasibility processes"

2. **How do we handle process dependencies?**
   - "Can't start entitlement until feasibility is complete"
   - Business rules engine? Process prerequisite checks?

3. **What about reporting and dashboards?**
   - Current: "Properties by stage" report
   - Future: "Properties by state dimension" report?
   - Do stakeholders need lifecycle view?

4. **Team organization implications?**
   - Current: Feasibility Team, Entitlement Team, etc.
   - Future: Process-based teams? Cross-functional?

5. **Does this align with Day 1-90 MVP scope?**
   - State machine is more complex upfront
   - But more flexible for future phases
   - Worth the architectural investment?

## Decision Framework

Use **State Machine Model** if:
- ✅ Exceptions and loops are common
- ✅ Multiple concurrent processes are the norm
- ✅ Property types vary significantly in their paths
- ✅ You want maximum flexibility for future process types
- ✅ Audit trail and state history are critical
- ✅ User mental model is "What can I do with this property?" not "Where is this property?"

Use **Workflow Model** if:
- ✅ Linear progression is dominant pattern
- ✅ Stages are well-defined with clear handoffs
- ✅ Exceptions are rare edge cases
- ✅ Team organization aligns with stages
- ✅ Simpler implementation is priority for MVP
- ✅ User mental model is "Which stage is this property in?"

## Next Steps

1. **Validate with Blueprint team**:
   - Show both UI mockups
   - Ask: "Which view would you use daily?"
   - Observe: Do they think in stages or processes?

2. **Prototype both approaches**:
   - Build simple demo of each model
   - Test with real property data
   - Measure complexity, flexibility, usability

3. **Assess migration effort**:
   - How much of current work (DP01-15 to DP01-147) needs rework?
   - Can we adopt hybrid approach incrementally?

4. **Make architectural decision**:
   - Document in ADR (Architecture Decision Record)
   - Update PRD Section 3.2 (Architecture Principles)
   - Revise epic structure if needed

## Where This Breaks Down: Failure Modes

### State Machine Model Failures

#### 1. **Complexity Explosion**

**Problem**: Without workflow guardrails, the state space becomes unmanageable.

```typescript
// How many possible states exist?
lifecycle: 5 options
status: 4 options
approvalState: 4 options
riskLevel: 10 options
activeProcesses: 2^N combinations (where N = number of process types)

// Total possible states: 5 × 4 × 4 × 10 × 2^20 = 8,388,608 possible states
```

**When it fails**:
- Impossible to test all state combinations
- Business rules become spaghetti ("if lifecycle=X AND status=Y AND approvalState=Z...")
- No one can answer "Is this property in a valid state?"

**Real scenario**: Property has `lifecycle: "entitlement"` but `approvalState: "rejected"` and `status: "active"` with 3 concurrent processes running. Is this valid? Who knows?

#### 2. **No Clear "Current Work" Context**

**Problem**: Users lose sense of "what should I be doing right now?"

**Workflow model**: "You're in feasibility, here's the feasibility checklist"

**State machine model**: "Here are 47 possible processes you could start... which one do you want?"

**When it fails**:
- New users overwhelmed by options
- No guided path through required work
- "Analysis paralysis" - too much flexibility
- Training becomes harder (no standard path to teach)

**Real scenario**: Junior analyst opens property page, sees 12 available processes, doesn't know which to start or in what order.

#### 3. **Process Orchestration Nightmare**

**Problem**: Who/what decides when processes should start, and in what order?

```typescript
// Workflow model: Simple
if (feasibility.complete) {
  moveToEntitlement();
}

// State machine model: Complex
if (
  allProcessesOfType("feasibility").every(p => p.status === "completed") &&
  property.approvalState === "approved" &&
  property.riskLevel < 7 &&
  !property.hasActiveProcessOfType("title-review") &&
  currentDate.isBefore(property.deadlines.entitlement)
) {
  // Maybe transition lifecycle to entitlement?
  // Or just allow entitlement processes to start?
  // Or wait for user to manually trigger?
}
```

**When it fails**:
- Business logic scattered across codebase
- No single source of truth for "what happens next"
- Race conditions when multiple processes complete simultaneously
- Debugging becomes "why didn't the expected thing happen?"

**Real scenario**: All feasibility processes complete, but property stuck because one obscure business rule wasn't met and no one knows which one.

#### 4. **Reporting and Metrics Become Impossible**

**Problem**: Stakeholders can't get simple answers.

**Workflow model**:
```sql
-- How many properties are in feasibility?
SELECT COUNT(*) FROM properties WHERE stage = 'feasibility';
```

**State machine model**:
```sql
-- How many properties are in feasibility???
SELECT COUNT(*) FROM properties
WHERE lifecycle = 'feasibility'
  AND status = 'active'
  AND EXISTS (
    SELECT 1 FROM processes p
    WHERE p.property_id = properties.id
      AND p.process_type LIKE 'feasibility-%'
      AND p.status IN ('in-progress', 'pending')
  )
-- Wait, does "in feasibility" mean lifecycle state or active processes?
-- What about properties with lifecycle='entitlement' but running feasibility processes?
```

**When it fails**:
- Executives can't get pipeline visibility
- "How long does feasibility take?" becomes unanswerable (which processes count?)
- Forecasting impossible (no clear path, no average duration)
- Board reporting requires custom queries every time

**Real scenario**: CEO asks "How many deals in feasibility?" Two analysts give different answers because they queried different state dimensions.

#### 5. **Concurrency Creates Data Conflicts**

**Problem**: Multiple processes updating same property fields simultaneously.

```typescript
// Process A (zoning review) updates property at 10:00:01
property.attributes.zoningDistrict = "R-3";
property.riskLevel = 7.5;

// Process B (environmental) updates property at 10:00:02
property.attributes.environmentalConcerns = "wetlands";
property.riskLevel = 9.0;  // Overwrites Process A's risk calculation!

// Which risk level is correct? How do we merge?
```

**When it fails**:
- Last-write-wins creates data loss
- Optimistic locking creates user frustration (constant "someone else modified this" errors)
- Need complex event sourcing or CRDT (conflict-free replicated data types)
- Property data becomes inconsistent

**Real scenario**: Two team members run processes simultaneously, one's risk assessment overwrites the other's, loan gets approved that shouldn't have been.

#### 6. **Audit Trail Becomes Meaningless Noise**

**Problem**: Every state change is logged, creating massive audit tables.

```
10:00:01 - riskLevel changed from 7.0 to 7.5 by Process A
10:00:02 - riskLevel changed from 7.5 to 9.0 by Process B
10:00:05 - lifecycle changed from 'feasibility' to 'feasibility' (no-op)
10:00:07 - status changed from 'active' to 'active' (no-op)
10:00:10 - approvalState changed from 'pending' to 'pending' (no-op)
```

**When it fails**:
- Can't find meaningful events in sea of micro-changes
- Compliance audits become harder, not easier
- Storage costs explode
- "What happened to this deal?" requires forensic analysis

**Real scenario**: Auditor asks "Why was this property approved?" You hand them 47,000 state change records spanning 3 months.

#### 7. **No Forcing Functions for Critical Steps**

**Problem**: Important work gets skipped because nothing enforces it.

**Workflow model**: Can't advance to entitlement until feasibility checklist is 100% complete (enforced by system).

**State machine model**: Any process can start anytime (subject to business rules... if someone remembered to code them).

**When it fails**:
- Title review never happens, causes closing delays
- Environmental assessment skipped, regulatory violation
- Required approvals bypassed, compliance risk
- "We forgot to do X" becomes common

**Real scenario**: Property reaches construction without completed arborist report because no rule enforced it and checklist wasn't followed.

### Workflow Model Failures

#### 1. **Exception Handling is Brutal**

**Problem**: Real world doesn't follow the happy path.

```typescript
// Property needs to go back to feasibility
// But workflow says "can't go backwards"
// So we either:
// A) Create a new property record (data duplication nightmare)
// B) Add "re-feasibility" as a special stage (workflow grows to 47 stages)
// C) Add exception flags everywhere (property.isInReworkMode = true)
```

**When it fails**:
- Workarounds accumulate (shadow systems, Excel trackers)
- Data integrity breaks (property in wrong stage with wrong data)
- Users circumvent system to get work done
- Tech debt compounds with each exception

**Real scenario**: Entitlement rejected, needs new feasibility. Workflow can't handle it, team creates duplicate property record, now have two sources of truth.

#### 2. **Can't Handle Parallel Work**

**Problem**: Multiple things actually happen at once.

```
During "feasibility" stage, actually happening:
- Zoning research (feasibility activity)
- Title review (could be its own stage?)
- Initial builder outreach (sales activity?)
- Market comps research (feasibility activity)
- Preliminary design work (should be in design stage?)
```

**When it fails**:
- Work that doesn't fit current stage gets delayed
- Or work happens "off system" (ungoverned)
- Stage duration inflates because it's waiting for parallel work
- Bottlenecks created artificially

**Real scenario**: Feasibility complete but stuck waiting for title review (which started late). Property sits in "feasibility" stage for extra 2 weeks, metrics look terrible.

#### 3. **Different Property Types = Different Workflows**

**Problem**: One workflow doesn't fit all.

```
Subdivision: Intake → Feasibility → Entitlement → Construction
Rehab: Intake → Feasibility → Construction (skip entitlement)
Land bank: Intake → Feasibility → Hold (no construction)
Adaptive reuse: Intake → Feasibility → Design → Entitlement → Construction
```

**When it fails**:
- Need workflow branching logic (complex)
- Or need multiple workflow definitions (maintenance nightmare)
- Or force everything through same stages (creates fake stages)
- New property type requires code changes

**Real scenario**: Add "mixed-use development" property type, requires custom workflow, dev team scrambles to add new stages and conditional logic.

#### 4. **Handoffs Create Delays and Blame**

**Problem**: Workflow stage boundaries create organizational friction.

```
Feasibility team: "We're done, handed off to Entitlement"
Entitlement team: "Wait, the arborist report is incomplete"
Feasibility team: "That's not our problem anymore, we completed our stage"
Property sits in limbo for 2 weeks while teams argue
```

**When it fails**:
- "Not my stage" mentality
- Work falls between cracks
- Delays at handoff points
- Blame game when things go wrong

**Real scenario**: Property advanced to entitlement with incomplete feasibility work, gets rejected, teams argue about who should fix it.

#### 5. **Stages Become Silos**

**Problem**: Stage-specific data creates information hiding.

```sql
-- Entitlement team can't see detailed feasibility data
-- It's in feasibility_data table, not exposed in entitlement UI
-- Need to "switch" back to feasibility view
-- Or data gets duplicated into entitlement stage
```

**When it fails**:
- Context lost when advancing stages
- Information re-entry errors
- Users need multiple screens open
- Cross-stage analysis difficult

**Real scenario**: During entitlement, jurisdiction asks about environmental concerns from feasibility. Team can't easily access that data in current UI, causes delays.

#### 6. **Workflow Changes Require System Overhaul**

**Problem**: Business process changes break the system.

```
New regulation requires environmental review BEFORE feasibility
Current workflow: Intake → Feasibility → Entitlement
New workflow: Intake → Environmental → Feasibility → Entitlement

Change requires:
- New stage definition
- UI changes for new stage
- Data model changes
- Report changes
- Permissions changes
- User retraining
```

**When it fails**:
- Can't adapt to regulatory changes quickly
- Or create workarounds that break assumptions
- System becomes frozen in time
- Business innovation constrained by tech

**Real scenario**: New city requirement added, workflow can't accommodate it, team tracks new requirement in Excel instead of system.

### The Fundamental Tension

**Workflow Model**: Structure and guidance, but inflexible
**State Machine Model**: Flexible and powerful, but chaotic

**Both fail when**:
- Real world is messy and systems try to be pure
- Complexity grows faster than governance
- Users and technology have different mental models
- Edge cases outnumber happy paths

### The Real Failure Mode: Wrong Abstraction

**Neither model fails technically** - both can be implemented successfully.

**They fail when**:
1. **Chosen model doesn't match how work actually happens**
2. **Organization structure conflicts with system structure**
3. **Users forced to work around the model instead of with it**

**Key question**: Does Blueprint's work have enough structure to benefit from workflow constraints, or enough variance to require state machine flexibility?

If work is **80% structured, 20% exceptions**: Workflow model with good exception handling

If work is **50% structured, 50% exceptions**: State machine model with suggested workflows

If work is **20% structured, 80% ad-hoc**: Neither model fits - need case management system instead

---

**Document Status**: Discussion Draft
**Requires**: Stakeholder validation, prototyping
**Impacts**: All Track 3 work (DP01-21 through DP01-73)
