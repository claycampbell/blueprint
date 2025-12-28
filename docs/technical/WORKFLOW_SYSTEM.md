# Workflow System Architecture

This document provides a comprehensive overview of the Connect 2.0 workflow system, covering the data model, execution engine, frontend components, and API integration.

## Table of Contents

1. [Overview](#overview)
2. [Three-Tier Workflow Hierarchy](#three-tier-workflow-hierarchy)
3. [System Components](#system-components)
4. [Data Flow](#data-flow)
5. [Workflow Navigation](#workflow-navigation)
6. [Workflow Builder](#workflow-builder)
7. [Database Schema](#database-schema)
8. [Related Documentation](#related-documentation)

---

## Overview

The workflow system enables Blueprint to manage properties through structured business processes. It combines:

- **BPMN 2.0** for visual workflow definition
- **SpiffWorkflow** for Python-based workflow execution
- **React frontend** for user interaction and workflow building
- **REST API** for state management and persistence

### Key Design Principles

1. **Human-in-the-Loop**: All workflow transitions require explicit user decisions
2. **Full Auditability**: Every action is logged in workflow_history
3. **Flexible Navigation**: Users can move forward, backward, or skip steps as needed
4. **Version Control**: Workflow definitions support versioning with rollback capability
5. **Separation of Concerns**: Definition (BPMN), execution (SpiffWorkflow), and presentation (React) are decoupled

---

## Three-Tier Workflow Hierarchy

The workflow system uses a three-level hierarchy to organize work:

```
Value Stream (VS)
└── Workflow Group (WFG)
    └── Workflow Item (WFI)
```

### Value Stream (VS)

The highest level, representing a major phase in the property lifecycle.

| VS | Name | Description |
|----|------|-------------|
| VS1 | Lead Intake | Initial property identification and qualification |
| VS2 | Feasibility | Due diligence and viability assessment |
| VS3 | Pre-Development | Pre-construction planning and approvals |
| VS4 | Design & Entitlement | Architectural design and municipal permitting |
| VS5 | Construction | Active building phase |
| VS6 | Lending | Loan origination and servicing |

### Workflow Group (WFG)

Phases within a value stream. Example for VS4 (Design & Entitlement):

| WFG | Name | Description |
|-----|------|-------------|
| WFG1 | Project Kickoff | Initial project setup and team assignment |
| WFG2 | Schematic Design | Preliminary architectural concepts |
| WFG3 | Design Development | Detailed design refinement |
| WFG4 | Construction Documents | Final permit-ready drawings |
| WFG5 | Permitting | Municipal review and approval |

### Workflow Item (WFI)

Individual tasks within a workflow group. Example for WFG1 (Project Kickoff):

| WFI | Name | Description |
|-----|------|-------------|
| WFI-1 | Initial Project Review | Review project scope and requirements |
| WFI-2 | Team Assignment | Assign project team members |
| WFI-3 | Kickoff Meeting | Conduct project kickoff meeting |
| WFI-4 | Document Collection | Gather initial project documents |

---

## System Components

### Frontend (React + TypeScript)

```
stubs/app/src/
├── components/workflow/
│   ├── WorkflowBuilder.tsx      # BPMN visual editor (bpmn-js)
│   ├── DecisionPanel.tsx        # Navigation controls for workflow transitions
│   ├── StepDisplay.tsx          # Current step visualization
│   ├── CommentForm.tsx          # Step comments and notes
│   └── definitions/             # Workflow definition management
│       ├── DefinitionsListView.tsx
│       ├── DefinitionCreateView.tsx
│       ├── DefinitionEditView.tsx
│       └── DefinitionHistoryView.tsx
├── pages/
│   └── WorkflowDefinitionsPage.tsx  # Admin page for managing definitions
└── styles/
    ├── workflow-builder.css
    └── workflow-definitions.css
```

### Backend (Node.js API + SpiffWorkflow)

```
stubs/api/
├── src/
│   ├── routes/
│   │   ├── workflow-definitions.ts  # CRUD for workflow templates
│   │   ├── workflow-instances.ts    # Runtime workflow state
│   │   └── projects.ts              # Project-workflow association
│   ├── services/
│   │   ├── workflow-engine.ts       # SpiffWorkflow integration
│   │   └── workflow-validator.ts    # BPMN validation
│   └── models/
│       ├── workflow-definition.ts
│       ├── workflow-instance.ts
│       └── project.ts
└── docs/technical/
    ├── WORKFLOW_DATABASE_SCHEMA.md
    └── WORKFLOW_API.md
```

### Workflow Engine (SpiffWorkflow)

SpiffWorkflow is a Python library that executes BPMN workflows. Key capabilities:

- **State Serialization**: Complete workflow state saved as JSON
- **Task Management**: Tracks ready, completed, and waiting tasks
- **Data Variables**: Workflow-scoped variables for decision logic
- **Event Handling**: Supports intermediate events and signals

---

## Data Flow

### 1. Creating a Workflow Definition

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Admin     │────▶│  Workflow   │────▶│    API      │────▶│  Database   │
│   (React)   │     │   Builder   │     │  Endpoint   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │                    │
                          │ BPMN XML           │ Validates BPMN
                          ▼                    │ Creates definition
                    bpmn-js editor             │ Creates version 1
                                               ▼
                                         workflow_definitions
                                         workflow_definition_versions
```

### 2. Starting a Workflow for a Project

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   Project   │────▶│    API      │────▶│ SpiffWork-  │
│   (React)   │     │   Create    │     │  Endpoint   │     │   flow      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                               │                    │
                                               │                    │ Creates instance
                                               │                    │ Serializes state
                                               ▼                    ▼
                                           projects          workflow_instances
```

### 3. Navigating Through the Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│  Decision   │────▶│    API      │────▶│ SpiffWork-  │
│   (React)   │     │   Panel     │     │  Endpoint   │     │   flow      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                   │                    │                    │
      │                   │ User selects:      │                    │
      │                   │ - Approve (next)   │ Completes task     │
      │                   │ - Send Back        │ Gets next ready    │
      │                   │ - Skip To          │ tasks              │
      │                   │                    │                    │
      ▼                   ▼                    ▼                    ▼
 Comments/Notes      Action + Reason     workflow_history    Updated state
 (step_comments)                         (audit trail)       (serialized_state)
```

---

## Workflow Navigation

Users navigate through workflows using the **Decision Panel** component. Each navigation action is recorded in the audit trail.

### Navigation Actions

| Action | Description | Use Case |
|--------|-------------|----------|
| **Approve** | Move to the next step in sequence | Normal progression through workflow |
| **Send Back** | Return to a previous step | Issues found that need earlier review |
| **Skip To** | Jump to a specific future step | Fast-track when intermediate steps aren't needed |
| **Complete WFG** | Mark entire workflow group as done | Bulk completion of remaining items |

### Action Flow

```typescript
// Frontend: User clicks "Approve" in DecisionPanel
const handleApprove = async (reason: string) => {
  await api.post(`/projects/${projectId}/workflow/transition`, {
    action: 'approve',
    reason: reason,
    target_step: null  // Next step is automatic
  });
};

// API: Records transition and advances workflow
// 1. Validates user can perform this action
// 2. Completes current task in SpiffWorkflow
// 3. Records entry in workflow_history
// 4. Updates project's current position
// 5. Returns new workflow state
```

### Decision Panel UI States

```
┌────────────────────────────────────────────────────────────┐
│  Current Step: WFG2 - Schematic Design                     │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  Decision:  ○ Approve and Continue                         │
│             ○ Send Back to Previous Step                   │
│             ○ Skip to Specific Step                        │
│                                                            │
│  Reason: [________________________________]                │
│                                                            │
│  [Cancel]                              [Submit Decision]   │
└────────────────────────────────────────────────────────────┘
```

### Comments and Notes

Each workflow step can have comments attached:

- **Step Comments**: Notes specific to the current WFI/WFG
- **Decision Reasons**: Required explanation for navigation actions
- **Stored in**: `step_comments` table, linked to project and workflow position

---

## Workflow Builder

The Workflow Builder allows admins to create and edit BPMN workflow definitions visually.

### Components

| Component | Purpose |
|-----------|---------|
| `WorkflowBuilder` | BPMN canvas using bpmn-js library |
| `DefinitionsListView` | Table of all workflow definitions with filtering |
| `DefinitionCreateView` | Form + builder for new definitions |
| `DefinitionEditView` | Edit existing definition with version notes |
| `DefinitionHistoryView` | Version history with preview and rollback |

### Workflow Definition Lifecycle

```
┌─────────┐     ┌───────────┐     ┌───────────┐
│  Draft  │────▶│ Published │────▶│ Archived  │
└─────────┘     └───────────┘     └───────────┘
     │               │
     │               │ New version
     ▼               ▼
  Edit/Save    Creates new version
               (old version retained)
```

### Version Management

- **Draft**: Work in progress, not yet usable
- **Published**: Active version used for new workflow instances
- **Archived**: No longer in use but retained for history

Each save creates a new version:
1. Version 1: Initial creation (Draft)
2. Version 2: First publish (Published, Active)
3. Version 3: Updates after feedback (Published, Active - v2 deactivated)

### BPMN Elements Used

| Element | BPMN Type | Purpose |
|---------|-----------|---------|
| Start Event | `bpmn:startEvent` | Entry point for workflow |
| End Event | `bpmn:endEvent` | Completion point |
| User Task | `bpmn:userTask` | Human decision required (WFI) |
| Exclusive Gateway | `bpmn:exclusiveGateway` | Decision branching |
| Sequence Flow | `bpmn:sequenceFlow` | Connections between elements |
| Sub-Process | `bpmn:subProcess` | Grouped tasks (WFG) |

---

## Database Schema

The workflow system uses six core tables:

### Entity Relationships

```
workflow_definitions (1) ─────< (N) workflow_definition_versions
         │
         │ (1)
         │
         └──────────────────────< (N) workflow_instances
         │                                    │
         │                                    │ (1)
         │ (1)                                │
         │                                    ▼
         └──────────────────────< (N) projects (1) ─────< (N) step_comments
                                              │
                                              │ (1)
                                              │
                                              └──────────< (N) workflow_history
```

### Tables Overview

| Table | Purpose |
|-------|---------|
| `workflow_definitions` | Master catalog of workflow templates |
| `workflow_definition_versions` | Versioned BPMN XML for each definition |
| `workflow_instances` | Runtime execution state (SpiffWorkflow serialization) |
| `projects` | Properties being tracked through workflows |
| `step_comments` | User comments at each workflow step |
| `workflow_history` | Audit trail of all workflow transitions |

For detailed schema, see: [WORKFLOW_DATABASE_SCHEMA.md](../../stubs/api/docs/technical/WORKFLOW_DATABASE_SCHEMA.md)

---

## Related Documentation

### API Documentation
- [WORKFLOW_API.md](../../stubs/api/docs/technical/WORKFLOW_API.md) - API endpoints and SpiffWorkflow integration
- [WORKFLOW_DATABASE_SCHEMA.md](../../stubs/api/docs/technical/WORKFLOW_DATABASE_SCHEMA.md) - Detailed database schema

### Frontend Documentation
- [WORKFLOW_NAVIGATION.md](../../stubs/app/docs/technical/WORKFLOW_NAVIGATION.md) - User navigation and decision panel
- [WORKFLOW_BUILDER.md](../../stubs/app/docs/technical/WORKFLOW_BUILDER.md) - Admin workflow builder components

### Platform Documentation
- [BACKEND_ARCHITECTURE.md](../../stubs/api/docs/technical/BACKEND_ARCHITECTURE.md) - Overall API architecture
- [PLATFORM_ARCHITECTURE.md](./PLATFORM_ARCHITECTURE.md) - System-wide architecture

---

## Quick Reference

### For Developers

**Adding a new navigation action:**
1. Add action type to `DecisionPanel.tsx`
2. Add API handler in `workflow-instances.ts`
3. Add transition logic in `workflow-engine.ts`
4. Update `workflow_history` action enum

**Creating a new workflow definition:**
1. Use WorkflowBuilder UI to design BPMN
2. Set process ID to match your code references
3. Publish when ready for use
4. Associate with projects via API

### For Claude Code

When working with the workflow system:

1. **Workflow definitions** are templates stored in `workflow_definitions` + `workflow_definition_versions`
2. **Workflow instances** are runtime state for a specific project, stored in `workflow_instances.serialized_state`
3. **Navigation** happens through the Decision Panel, which calls the API to transition workflow state
4. **All transitions** are recorded in `workflow_history` for audit
5. **Comments** are stored in `step_comments`, linked to project + workflow position
6. **BPMN XML** is rendered using bpmn-js in the WorkflowBuilder component
