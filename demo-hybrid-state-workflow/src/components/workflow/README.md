# Workflow-Centric UI Components

Traditional stage-based workflow components that demonstrate the **limitations** of workflow thinking.

## Purpose

These components intentionally showcase the rigid, linear nature of traditional workflow systems to contrast with the more flexible state machine approach. They're designed to:

1. **Look traditional and rigid** (this is intentional)
2. **Make linear progression assumptions**
3. **Struggle with concurrent processes**
4. **Show awkwardness when exceptions occur** (like going backwards)

## Components

### WorkflowView

Main workflow component that orchestrates the entire workflow UI.

**Features:**
- Prominent "Current Stage" banner
- Stage-specific content area
- Validation before advancement
- Error messages for blocked actions

**Usage:**
```tsx
import WorkflowView from './components/workflow/WorkflowView';

<WorkflowView property={property} />
```

### StageDisplay

Visual progress indicator showing linear stage progression.

**Features:**
- Completed stages: green with checkmark
- Current stage: blue and highlighted
- Future stages: gray and de-emphasized
- Connecting lines between stages

### Checklist

Stage-specific checklist of tasks to complete.

**Features:**
- Progress bar (X of Y required items completed)
- Required vs. optional tasks
- Visual completion state
- Maps processes to checklist items

### StageNavigation

Navigation controls for advancing or going back through stages.

**Features:**
- Prominent "Advance to [Next Stage]" button (primary action)
- Less prominent "Return to [Previous Stage]" button (discouraged)
- Validation: can't advance until all required items checked
- Error handling for invalid actions

## Workflow Utilities

`workflowUtils.ts` provides mapping functions that bridge the gap between:
- **State-based property model** (how data actually exists)
- **Workflow-based UI expectations** (how traditional systems present it)

### Key Functions

**buildWorkflowStageView(property: Property): WorkflowStageView**
- Converts a Property into a WorkflowStageView
- Builds checklist from process definitions
- Determines navigation capabilities

**buildChecklist(property: Property, stage: LifecycleState): ChecklistItem[]**
- Maps processes to stage-specific checklist items
- Checks completion status from property data

**getAdjacentStages(currentStage: LifecycleState)**
- Returns next and previous stages for navigation
- Enforces linear stage ordering

## Styling

All workflow components use the `.workflow-*` CSS class namespace with a distinct visual style:

- **Purple gradient banner** for current stage (very prominent)
- **Linear progress indicator** with connecting lines
- **Traditional checklist UI** with checkboxes
- **Prominent advance button** vs. less prominent back button
- **Error messages** in red when validation fails

The styling is intentionally **more traditional and rigid** than the state machine UI to emphasize the differences.

## Demonstrating Workflow Limitations

These components are designed to show these workflow anti-patterns:

### 1. Backwards Movement is Awkward
```
Error: "Cannot go backwards in workflow"
```

### 2. Concurrent Processes are Hidden
- Property can only be in ONE stage at a time
- Multiple concurrent processes are forced into a single stage's checklist
- No clear way to show that processes can run in parallel

### 3. Property Type Variations are Complex
- Different property types need different workflows
- Skipping stages (e.g., multi-family rehab skips entitlement) is unclear
- Need conditional logic or multiple workflow definitions

### 4. Exception Handling is Brittle
- When something goes wrong, the workflow breaks down
- No natural way to represent "needs re-feasibility while in entitlement"
- Either block the workflow or create workarounds

## Comparison with State Machine UI

| Aspect | Workflow UI | State Machine UI |
|--------|-------------|------------------|
| **Mental Model** | Linear stages | Multi-dimensional state |
| **Current Focus** | What stage are we in? | What is the property's state? |
| **Process View** | Checklist in current stage | Active process cards |
| **Backwards Movement** | Awkward/blocked | Natural state transition |
| **Concurrent Processes** | Hidden in stage checklist | Clearly visible |
| **Property Type Variations** | Need multiple workflows | Same state model, different processes |

## Usage in Demo

The workflow components are used in the comparison demo to show side-by-side:

```tsx
<div className="grid-2">
  <div>
    <h2>Traditional Workflow View</h2>
    <WorkflowView property={property} />
  </div>
  <div>
    <h2>State Machine View</h2>
    <StateMachineView property={property} />
  </div>
</div>
```

This allows users to see exactly how the same property data is represented differently in each paradigm.
