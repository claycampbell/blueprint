# Workflow Navigation Guide

This document explains how users navigate through workflows in Connect 2.0, including the Decision Panel, comments system, and available navigation actions.

> **Architecture Overview**: See [WORKFLOW_SYSTEM.md](../../../../docs/technical/WORKFLOW_SYSTEM.md) for the complete workflow architecture.

## Table of Contents

1. [Overview](#overview)
2. [Navigation Components](#navigation-components)
3. [Navigation Actions](#navigation-actions)
4. [Comments and Notes](#comments-and-notes)
5. [Workflow State Display](#workflow-state-display)
6. [API Integration](#api-integration)
7. [Component Reference](#component-reference)

---

## Overview

Workflow navigation allows users to move properties through the business process. The system is designed for:

- **Explicit Decision Making**: Every transition requires user action
- **Full Auditability**: All decisions are recorded with reasons
- **Flexible Navigation**: Forward, backward, and skip capabilities
- **Contextual Comments**: Notes attached to each workflow step

### User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                     Project Detail Page                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────────────────────────┐ │
│  │   Step Display   │  │         Decision Panel               │ │
│  │                  │  │                                      │ │
│  │  Current: WFG2   │  │  ○ Approve and Continue              │ │
│  │  Schematic       │  │  ○ Send Back                         │ │
│  │  Design          │  │  ○ Skip To...                        │ │
│  │                  │  │                                      │ │
│  │  Progress: ██░░  │  │  Reason: [________________]          │ │
│  │                  │  │                                      │ │
│  └──────────────────┘  │  [Submit Decision]                   │ │
│                        └──────────────────────────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Step Comments                          │   │
│  │  ────────────────────────────────────────────────────     │   │
│  │  John (12/15): Waiting for city planner callback          │   │
│  │  Jane (12/14): Initial review complete                    │   │
│  │                                                           │   │
│  │  [Add Comment: ____________________________] [Post]       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Navigation Components

### StepDisplay

Displays the current position in the workflow hierarchy.

```tsx
import { StepDisplay } from '@/components/workflow/StepDisplay';

<StepDisplay
  valueStream="VS4"
  workflowGroup="WFG2"
  workflowItem="WFI1"
  taskName="Schematic Review"
  progress={45}  // Percentage through workflow
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `valueStream` | string | Current VS (e.g., "VS4") |
| `workflowGroup` | string | Current WFG (e.g., "WFG2") |
| `workflowItem` | string | Current WFI (e.g., "WFI1") |
| `taskName` | string | Human-readable task name |
| `progress` | number | Percentage complete (0-100) |

### DecisionPanel

Primary interface for workflow navigation decisions.

```tsx
import { DecisionPanel } from '@/components/workflow/DecisionPanel';

<DecisionPanel
  currentStep={{ wfg: 'WFG2', wfi: 'WFI1' }}
  availableActions={['approve', 'send_back', 'skip_to']}
  skipTargets={[
    { id: 'WFG3', name: 'Design Development' },
    { id: 'WFG4', name: 'Construction Docs' }
  ]}
  onDecision={handleDecision}
  isLoading={isSubmitting}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `currentStep` | object | Current WFG/WFI position |
| `availableActions` | string[] | Allowed navigation actions |
| `skipTargets` | object[] | Valid targets for skip_to action |
| `onDecision` | function | Callback when decision is submitted |
| `isLoading` | boolean | Disable while API call in progress |

### CommentForm

Add and view step-specific comments.

```tsx
import { CommentForm } from '@/components/workflow/CommentForm';

<CommentForm
  projectId={projectId}
  workflowGroup="WFG2"
  workflowItem="WFI1"
  comments={stepComments}
  onCommentAdded={refreshComments}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `projectId` | string | Project UUID |
| `workflowGroup` | string | Current WFG |
| `workflowItem` | string | Current WFI (optional) |
| `comments` | Comment[] | Existing comments to display |
| `onCommentAdded` | function | Callback after new comment posted |

---

## Navigation Actions

### Approve (Next Step)

Move to the next step in the workflow sequence.

```typescript
const handleApprove = async (reason: string) => {
  await api.post(`/projects/${projectId}/workflow/transition`, {
    action: 'approve',
    reason: reason,
    target_step: null
  });
};
```

**Use Cases:**
- Completing a review with no issues
- Moving forward after all requirements met
- Normal progression through workflow

**UI Behavior:**
1. User selects "Approve and Continue"
2. User enters reason (required)
3. System advances to next step
4. History entry created
5. Step Display updates

### Send Back (Previous Step)

Return to a previous step for rework or additional information.

```typescript
const handleSendBack = async (reason: string, targetStep?: string) => {
  await api.post(`/projects/${projectId}/workflow/transition`, {
    action: 'send_back',
    reason: reason,
    target_step: targetStep || null  // null = immediate previous
  });
};
```

**Use Cases:**
- Missing information discovered
- Issues found requiring earlier review
- Documentation incomplete

**UI Behavior:**
1. User selects "Send Back"
2. Optionally selects specific target step
3. User enters reason (required)
4. System returns to specified/previous step
5. History entry created with send_back action

### Skip To (Jump Forward)

Skip intermediate steps to reach a specific future step.

```typescript
const handleSkipTo = async (reason: string, targetStep: string) => {
  await api.post(`/projects/${projectId}/workflow/transition`, {
    action: 'skip_to',
    reason: reason,
    target_step: targetStep  // Required for skip_to
  });
};
```

**Use Cases:**
- Fast-tracking when intermediate steps don't apply
- Special circumstances requiring expedited processing
- Requirements already satisfied from previous work

**UI Behavior:**
1. User selects "Skip To"
2. Dropdown shows valid target steps
3. User selects target and enters reason
4. System jumps to selected step
5. Skipped steps marked as cancelled in history

### Complete Workflow Group

Mark an entire workflow group as complete.

```typescript
const handleCompleteWFG = async (reason: string) => {
  await api.post(`/projects/${projectId}/workflow/transition`, {
    action: 'complete_wfg',
    reason: reason,
    target_step: null
  });
};
```

**Use Cases:**
- Bulk completion of remaining items in a group
- Group-level approval after all items reviewed

---

## Comments and Notes

### Comment Types

| Type | Scope | Purpose |
|------|-------|---------|
| **Step Comment** | WFG + WFI | Notes about specific task |
| **Group Comment** | WFG only | Notes about workflow group overall |
| **Decision Reason** | Transition | Required explanation for navigation action |

### Comment Data Model

```typescript
interface StepComment {
  id: string;
  project_id: string;
  workflow_group: string;
  workflow_item?: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}
```

### Adding Comments

```typescript
const addComment = async (content: string) => {
  const response = await api.post(`/projects/${projectId}/workflow/comments`, {
    workflow_group: currentWFG,
    workflow_item: currentWFI,
    content: content
  });
  return response.data;
};
```

### Fetching Comments

```typescript
// Get all comments for current step
const fetchComments = async () => {
  const response = await api.get(`/projects/${projectId}/workflow/comments`, {
    params: {
      wfg: currentWFG,
      wfi: currentWFI
    }
  });
  return response.data;
};
```

---

## Workflow State Display

### Progress Calculation

Progress is calculated based on completed tasks vs total tasks:

```typescript
const calculateProgress = (instance: WorkflowInstance): number => {
  const completedTasks = instance.completed_tasks.length;
  const totalTasks = instance.total_tasks;
  return Math.round((completedTasks / totalTasks) * 100);
};
```

### Status Indicators

| Status | Color | Description |
|--------|-------|-------------|
| `running` | Blue | Workflow in progress |
| `completed` | Green | All steps complete |
| `suspended` | Yellow | Paused/on hold |
| `error` | Red | Workflow error state |

### Workflow Breadcrumb

Display hierarchical position:

```tsx
<div className="workflow-breadcrumb">
  <span className="vs">VS4: Design & Entitlement</span>
  <span className="separator">›</span>
  <span className="wfg">WFG2: Schematic Design</span>
  <span className="separator">›</span>
  <span className="wfi active">WFI1: Initial Review</span>
</div>
```

---

## API Integration

### Fetching Current State

```typescript
const useWorkflowState = (projectId: string) => {
  const [state, setState] = useState<WorkflowState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/workflow`);
        setState(response.data);
      } catch (err) {
        setError('Failed to load workflow state');
      } finally {
        setLoading(false);
      }
    };
    fetchState();
  }, [projectId]);

  return { state, loading, error, refetch: fetchState };
};
```

### Handling Transitions

```typescript
const useWorkflowTransition = (projectId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const transition = async (
    action: 'approve' | 'send_back' | 'skip_to' | 'complete_wfg',
    reason: string,
    targetStep?: string
  ) => {
    setIsSubmitting(true);
    try {
      const response = await api.post(
        `/projects/${projectId}/workflow/transition`,
        { action, reason, target_step: targetStep }
      );
      return response.data;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { transition, isSubmitting };
};
```

### Error Handling

```typescript
const handleTransitionError = (error: ApiError) => {
  switch (error.code) {
    case 'INVALID_TRANSITION':
      toast.error(`Cannot perform this action: ${error.message}`);
      break;
    case 'VALIDATION_ERROR':
      toast.error('Please provide a reason for this decision');
      break;
    default:
      toast.error('An error occurred. Please try again.');
  }
};
```

---

## Component Reference

### File Locations

```
stubs/app/src/
├── components/workflow/
│   ├── DecisionPanel.tsx      # Navigation decision UI
│   ├── StepDisplay.tsx        # Current step visualization
│   ├── CommentForm.tsx        # Step comments
│   └── WorkflowBreadcrumb.tsx # Hierarchical position
├── hooks/
│   ├── useWorkflowState.ts    # Workflow state fetching
│   └── useWorkflowTransition.ts # Transition handling
└── styles/
    └── workflow-navigation.css # Navigation component styles
```

### State Management

Workflow state is typically managed at the page level and passed down:

```tsx
function ProjectDetailPage({ projectId }: Props) {
  const { state, loading, refetch } = useWorkflowState(projectId);
  const { transition, isSubmitting } = useWorkflowTransition(projectId);

  const handleDecision = async (
    action: string,
    reason: string,
    targetStep?: string
  ) => {
    await transition(action, reason, targetStep);
    await refetch();  // Refresh state after transition
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="project-detail">
      <StepDisplay {...state.currentStep} />
      <DecisionPanel
        currentStep={state.currentStep}
        availableActions={state.availableActions}
        onDecision={handleDecision}
        isLoading={isSubmitting}
      />
      <CommentForm
        projectId={projectId}
        workflowGroup={state.currentStep.wfg}
        workflowItem={state.currentStep.wfi}
      />
    </div>
  );
}
```

---

## Related Documentation

- [WORKFLOW_SYSTEM.md](../../../../docs/technical/WORKFLOW_SYSTEM.md) - Complete architecture overview
- [WORKFLOW_BUILDER.md](./WORKFLOW_BUILDER.md) - Admin workflow builder documentation
- [WORKFLOW_API.md](../../api/docs/technical/WORKFLOW_API.md) - API endpoint reference
