# Hybrid State Machine + Workflow Demo

Interactive demonstration of the hybrid approach to property lifecycle management for Connect 2.0.

## Purpose

This demo explores the fundamental architectural question: **Should Connect 2.0 model properties as workflow stages or as stateful entities with concurrent processes?**

### The Question

**Workflow Model (Current Assumption):**
- Properties "move through" stages (Intake → Feasibility → Entitlement → Construction)
- Each stage is a container/module
- Linear progression assumed
- UI organized by stage

**State Machine Model (Alternative):**
- Property is central, persistent entity
- Processes operate ON the property
- Non-linear - multiple processes can run simultaneously
- UI shows property state + active processes

**Hybrid Approach (This Demo):**
- Lifecycle phase is ONE state dimension (not the organizing principle)
- Processes are first-class entities
- State changes tracked comprehensively
- UI can present either view on same data

## Running the Demo

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd demo-hybrid-state-workflow
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the demo.

### Build for Production

```bash
npm run build
npm run preview
```

## Demo Features

### 1. Property State Dimensions

Each property has multiple independent state dimensions:

- **Lifecycle**: intake | feasibility | entitlement | construction | servicing | closed
- **Status**: active | paused | on-hold | closed
- **Approval State**: pending | approved | rejected | needs-revision
- **Risk Level**: 0-10 score

### 2. Process-Based Operations

Processes operate on properties and update their state:

- `intake-qualification` - Initial screening
- `feasibility-analysis` - Comprehensive due diligence
- `zoning-review` - Zoning compliance check
- `title-review` - Title report analysis
- `environmental-assessment` - Environmental risks
- `arborist-review` - Tree inventory
- `entitlement-preparation` - Permit application prep
- `permit-submission` - Submit to jurisdiction
- `construction-start` - Begin construction

### 3. Concurrent Processes

Properties can have multiple processes running simultaneously:

Example: Property in `lifecycle: entitlement` with:
- `entitlement-preparation` (in-progress)
- `environmental-assessment` (in-progress)
- `title-review` (in-progress)

### 4. State History Audit Trail

Every state change is logged with:
- State type (lifecycle, status, approval, risk)
- Previous and new values
- Timestamp
- User who made the change
- Process that triggered the change (if applicable)
- Reason/notes

## Sample Properties

### Property 1: 123 Main Street (Subdivision)
- **Lifecycle**: intake
- **Status**: active
- **Active Processes**: None yet
- **Use Case**: Initial state, ready to start intake qualification

### Property 2: 456 Oak Avenue (Multi-Family Rehab)
- **Lifecycle**: feasibility
- **Status**: active
- **Active Processes**: Feasibility analysis, Title review (concurrent)
- **Use Case**: Demonstrates concurrent processes in same lifecycle phase

### Property 3: 789 Pine Road (Land Banking)
- **Lifecycle**: feasibility
- **Status**: active
- **Approval State**: approved
- **Completed Processes**: Feasibility analysis
- **Use Case**: Property with completed processes, ready for decision

## Key Architectural Insights

### ✅ State Machine Model Advantages

1. **Natural Exception Handling**
   - Property can return to feasibility from entitlement
   - No "backwards" movement - just state transition
   - State history shows full audit trail

2. **Concurrent Process Support**
   - Multiple processes visible simultaneously
   - Each process has independent status
   - No confusion about "where property lives"

3. **Property Type Flexibility**
   - Different types skip different phases
   - Process availability based on property attributes
   - New property types = new process definitions (not new workflows)

4. **Comprehensive State Tracking**
   - All state dimensions visible
   - State changes linked to processes
   - Full audit trail for compliance

### ❌ State Machine Model Challenges

1. **Complexity Without Guardrails**
   - Too many possible states (combinatorial explosion)
   - Users may not know "what to do next"
   - Requires strong business rules engine

2. **Reporting Ambiguity**
   - "How many properties in feasibility?" (lifecycle state or active processes?)
   - Need clear definitions for metrics

3. **Learning Curve**
   - More abstract than linear workflow
   - Requires training on state dimensions

### ✅ Workflow Model Advantages

1. **Clarity and Guidance**
   - Clear "current stage" concept
   - Checklist-driven progress
   - Easy to understand

2. **Simple Reporting**
   - "Properties by stage" is straightforward
   - Cycle time per stage easily measured

### ❌ Workflow Model Challenges

1. **Rigid Exception Handling**
   - "Going backwards" is awkward
   - Loops require special handling

2. **Concurrent Work Problems**
   - Where does property "live" during parallel activities?
   - Need sub-workflows or parallel tracks

3. **Property Type Variations**
   - Multiple workflow definitions needed
   - Or complex branching logic

## Next Steps

After reviewing this demo:

1. **Stakeholder Feedback**
   - Which mental model matches how you think about properties?
   - Which UI would you use daily?
   - What scenarios feel natural vs forced?

2. **Architecture Decision**
   - Document choice in Architecture Decision Record (ADR)
   - Update PRD Section 3.2 (Architecture Principles)
   - Revise epic structure if needed

3. **Implementation Planning**
   - If state machine chosen: Refactor data model, API design, UI
   - If workflow chosen: Strengthen exception handling
   - If hybrid: Define which parts use which model

## Technology Stack

- **React 18** + TypeScript
- **Vite** (build tool)
- **Zustand** (state management) - not yet integrated
- **date-fns** (date utilities) - not yet integrated

## Project Structure

```
demo-hybrid-state-workflow/
├── src/
│   ├── components/
│   │   ├── PropertyHeader.tsx     # Property state dimensions display
│   │   └── ProcessPanel.tsx       # Individual process card
│   ├── data/
│   │   ├── processDefinitions.ts  # Process type definitions
│   │   ├── stateRules.ts          # State transition rules
│   │   └── sampleData.ts          # Demo properties + scenarios
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles
├── package.json
├── vite.config.ts
└── README.md (this file)
```

## Future Enhancements

### Planned Features (Not Yet Implemented)

1. **Workflow View Side-by-Side**
   - Show same property in workflow UI vs state machine UI
   - Toggle between views
   - Highlight model differences

2. **Interactive Scenarios**
   - Click "Run Scenario" to auto-play events
   - Step-by-step progression
   - Compare model responses

3. **Process Engine**
   - Start/stop processes
   - Process state transitions
   - Rule-based lifecycle advancement

4. **Timeline Visualization**
   - Visual state change timeline
   - Process duration bars
   - Concurrent process overlays

5. **Scenario Comparison**
   - Run same scenario in both models
   - Count steps required
   - Measure complexity

## Related Documentation

- [docs/planning/STATE_MACHINE_VS_WORKFLOW_MODEL.md](../docs/planning/STATE_MACHINE_VS_WORKFLOW_MODEL.md) - Full analysis document
- [docs/planning/WORKFLOW_ANALYSIS_FRAMEWORK.md](../docs/planning/WORKFLOW_ANALYSIS_FRAMEWORK.md) - Workshop framework
- [PRODUCT_REQUIREMENTS_DOCUMENT.md](../PRODUCT_REQUIREMENTS_DOCUMENT.md) - Section 3.2 (Architecture Principles)

## License

Internal demo for Blueprint/Datapage project evaluation.
