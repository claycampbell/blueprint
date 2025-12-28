# Workflow Builder Documentation

This document explains the Workflow Builder components that allow administrators to create, edit, and manage BPMN workflow definitions in Connect 2.0.

> **Architecture Overview**: See [WORKFLOW_SYSTEM.md](../../../../docs/technical/WORKFLOW_SYSTEM.md) for the complete workflow architecture.

## Table of Contents

1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [WorkflowBuilder Component](#workflowbuilder-component)
4. [Definition Management Views](#definition-management-views)
5. [Version Management](#version-management)
6. [BPMN Elements](#bpmn-elements)
7. [Styling](#styling)
8. [API Integration](#api-integration)

---

## Overview

The Workflow Builder enables administrators to:

- **Create** new workflow definitions using a visual BPMN editor
- **Edit** existing workflows with version tracking
- **Publish** workflows for use with projects
- **Rollback** to previous versions when needed
- **Preview** workflow diagrams in read-only mode

### Key Technologies

| Technology | Purpose |
|------------|---------|
| **bpmn-js** | BPMN 2.0 visual editor (Camunda) |
| **React** | Component framework |
| **TypeScript** | Type-safe development |

---

## Component Architecture

```
stubs/app/src/
├── components/workflow/
│   ├── WorkflowBuilder.tsx           # Core BPMN editor
│   └── definitions/
│       ├── index.ts                  # Barrel exports
│       ├── DefinitionsListView.tsx   # List all definitions
│       ├── DefinitionCreateView.tsx  # Create new definition
│       ├── DefinitionEditView.tsx    # Edit existing definition
│       └── DefinitionHistoryView.tsx # Version history
├── pages/
│   └── WorkflowDefinitionsPage.tsx   # Container page
├── styles/
│   ├── workflow-builder.css          # Builder styles
│   └── workflow-definitions.css      # Page styles
├── types/
│   ├── bpmn-js.d.ts                  # bpmn-js type declarations
│   └── css.d.ts                      # CSS import declarations
└── api/
    └── workflow-definitions/
        └── index.ts                  # API client functions
```

### Component Hierarchy

```
WorkflowDefinitionsPage
├── DefinitionsListView        (viewMode: 'list')
├── DefinitionCreateView       (viewMode: 'create')
│   └── WorkflowBuilder
├── DefinitionEditView         (viewMode: 'edit')
│   └── WorkflowBuilder
└── DefinitionHistoryView      (viewMode: 'history')
    └── WorkflowBuilder (read-only preview)
```

---

## WorkflowBuilder Component

The core BPMN editor component wrapping bpmn-js.

### Usage

```tsx
import { WorkflowBuilder, EMPTY_DIAGRAM } from '@/components/workflow/WorkflowBuilder';

// Basic usage
<WorkflowBuilder
  initialXml={bpmnXml}
  onChange={(xml) => setBpmnXml(xml)}
  height={600}
/>

// With save callback
<WorkflowBuilder
  initialXml={bpmnXml}
  onSave={(xml) => handleSave(xml)}
  onChange={(xml) => setHasChanges(true)}
  height={600}
/>

// Read-only preview
<WorkflowBuilder
  initialXml={bpmnXml}
  readOnly
  height={400}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialXml` | string | EMPTY_DIAGRAM | Initial BPMN XML to load |
| `onSave` | function | - | Callback when Save button clicked |
| `onChange` | function | - | Callback when diagram modified |
| `readOnly` | boolean | false | Disable editing |
| `height` | string \| number | '600px' | Canvas height |
| `className` | string | '' | Additional CSS class |

### EMPTY_DIAGRAM Constant

Default template for new workflows:

```typescript
import { EMPTY_DIAGRAM } from '@/components/workflow/WorkflowBuilder';

// Creates a minimal valid BPMN with:
// - Start Event
// - End Event
// - Sequence flow connecting them
```

### Internal State

| State | Type | Purpose |
|-------|------|---------|
| `error` | string \| null | Error message display |
| `isLoading` | boolean | Loading spinner state |
| `isModelerReady` | boolean | bpmn-js initialized |
| `hasChanges` | boolean | Unsaved changes indicator |

### Toolbar Actions

| Button | Action |
|--------|--------|
| **New** | Load EMPTY_DIAGRAM template |
| **+** / **−** | Zoom in/out (20% increments) |
| **Fit** | Fit diagram to viewport |
| **Download BPMN** | Export as .bpmn file |
| **Download SVG** | Export as .svg image |
| **Save Workflow** | Trigger onSave callback |

### Key Implementation Details

**Dynamic Import**: bpmn-js is dynamically imported to handle SSR:

```typescript
const initModeler = async () => {
  const BpmnModeler = (await import('bpmn-js/lib/Modeler')).default;
  // ... initialization
};
```

**React StrictMode Handling**: Container is cleared on mount to handle double-render:

```typescript
useEffect(() => {
  containerRef.current.innerHTML = '';  // Clear existing
  // ... initialization
}, []);
```

**Cleanup on Unmount**:

```typescript
return () => {
  isCancelled = true;
  if (modeler) {
    modeler.destroy();
  }
};
```

---

## Definition Management Views

### DefinitionsListView

Displays all workflow definitions with filtering and actions.

```tsx
<DefinitionsListView
  definitions={definitions}
  statusFilter={statusFilter}
  onStatusFilterChange={setStatusFilter}
  onCreateNew={() => setViewMode('create')}
  onEdit={(id) => handleNavigateToEdit(id)}
  onViewHistory={(id) => handleNavigateToHistory(id)}
  onDelete={(id) => handleDelete(id)}
/>
```

**Features:**
- Filter by status (draft, published, archived)
- Table with name, process ID, status, versions
- Edit, History, Delete actions per row
- Empty state with create button

### DefinitionCreateView

Form and builder for creating new definitions.

```tsx
<DefinitionCreateView
  name={newDefName}
  description={newDefDescription}
  processId={newDefProcessId}
  bpmnXml={newDefBpmnXml}
  changeNotes={changeNotes}
  isLoading={isLoading}
  onNameChange={setNewDefName}
  onDescriptionChange={setNewDefDescription}
  onProcessIdChange={setNewDefProcessId}
  onBpmnXmlChange={setNewDefBpmnXml}
  onChangeNotesChange={setChangeNotes}
  onSubmit={handleCreateDefinition}
  onCancel={handleNavigateToList}
/>
```

**Form Fields:**
- Name (required)
- Process ID (required, must match BPMN)
- Description (optional)
- Initial Version Notes

### DefinitionEditView

Edit existing definition with version management.

```tsx
<DefinitionEditView
  definition={selectedDefinition}
  version={selectedVersion}
  changeNotes={changeNotes}
  isLoading={isLoading}
  onChangeNotesChange={setChangeNotes}
  onSave={(xml, publish) => handleSaveVersion(xml, publish)}
  onViewHistory={() => setViewMode('history')}
  onBack={handleNavigateToList}
/>
```

**Features:**
- Displays definition info (process ID, current version)
- Version notes input
- Save as Draft / Save & Publish buttons
- Warning when no valid BPMN found

### DefinitionHistoryView

Version history with preview and rollback.

```tsx
<DefinitionHistoryView
  definition={selectedDefinition}
  selectedVersion={selectedVersion}
  isLoading={isLoading}
  onSelectVersion={setSelectedVersion}
  onPublishVersion={(v) => handlePublishVersion(v)}
  onRollback={(v) => handleRollback(v)}
  onEdit={() => setViewMode('edit')}
  onBack={handleNavigateToList}
/>
```

**Features:**
- List of all versions with metadata
- Active version indicator
- View/Publish/Rollback actions
- Read-only preview of selected version

---

## Version Management

### Version Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    Version Lifecycle                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Create Definition                                           │
│       │                                                      │
│       ▼                                                      │
│  ┌─────────┐                                                │
│  │ v1      │ ◄── Initial version (Draft)                    │
│  │ Draft   │                                                │
│  └────┬────┘                                                │
│       │ Publish                                              │
│       ▼                                                      │
│  ┌─────────┐                                                │
│  │ v1      │ ◄── Now active                                 │
│  │ Active  │                                                │
│  └────┬────┘                                                │
│       │ Edit & Save                                          │
│       ▼                                                      │
│  ┌─────────┐    ┌─────────┐                                 │
│  │ v1      │    │ v2      │ ◄── New version                 │
│  │ Inactive│    │ Draft   │                                 │
│  └─────────┘    └────┬────┘                                 │
│                      │ Publish                               │
│                      ▼                                       │
│  ┌─────────┐    ┌─────────┐                                 │
│  │ v1      │    │ v2      │ ◄── Now active                  │
│  │ Inactive│    │ Active  │                                 │
│  └─────────┘    └─────────┘                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Version Actions

| Action | Effect |
|--------|--------|
| **Save as Draft** | Creates new version, not active |
| **Save & Publish** | Creates new version, sets as active |
| **Publish** | Sets existing version as active |
| **Rollback** | Creates new version copying old BPMN |

### API Calls

```typescript
// Create new version
const handleSaveVersion = async (xml: string, publish: boolean) => {
  await createVersion(definitionId, {
    bpmn_xml: xml,
    change_notes: changeNotes,
    publish: publish
  });
};

// Publish specific version
const handlePublishVersion = async (versionNumber: number) => {
  await publishVersion(definitionId, versionNumber);
};

// Rollback to previous version
const handleRollback = async (versionNumber: number) => {
  await rollbackToVersion(definitionId, versionNumber);
};
```

---

## BPMN Elements

### Supported Elements

| Element | BPMN Type | Visual | Purpose |
|---------|-----------|--------|---------|
| Start Event | `startEvent` | Circle | Entry point |
| End Event | `endEvent` | Bold Circle | Exit point |
| User Task | `userTask` | Rectangle + Person | Human task (WFI) |
| Service Task | `serviceTask` | Rectangle + Gear | Automated task |
| Exclusive Gateway | `exclusiveGateway` | Diamond | Decision branch |
| Parallel Gateway | `parallelGateway` | Diamond + | Parallel execution |
| Sub-Process | `subProcess` | Rounded Rectangle | Task group (WFG) |
| Sequence Flow | `sequenceFlow` | Arrow | Connection |

### BPMN Structure for Workflows

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  id="Definitions_1"
                  targetNamespace="http://bpmn.io/schema/bpmn">

  <!-- Process Definition -->
  <bpmn:process id="VS4_DesignEntitlement" name="Design & Entitlement" isExecutable="true">

    <!-- Start Event -->
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>

    <!-- User Task (WFI) -->
    <bpmn:userTask id="WFG1_WFI1" name="Project Kickoff">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:userTask>

    <!-- Exclusive Gateway (Decision) -->
    <bpmn:exclusiveGateway id="Gateway_1" name="Approved?">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_Yes</bpmn:outgoing>
      <bpmn:outgoing>Flow_No</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <!-- End Event -->
    <bpmn:endEvent id="EndEvent_1" name="Complete">
      <bpmn:incoming>Flow_Yes</bpmn:incoming>
    </bpmn:endEvent>

    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="WFG1_WFI1"/>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="WFG1_WFI1" targetRef="Gateway_1"/>

  </bpmn:process>

  <!-- Diagram Information (visual layout) -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="VS4_DesignEntitlement">
      <!-- Shape positions and edge waypoints -->
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>

</bpmn:definitions>
```

### Naming Conventions

| Element | ID Pattern | Example |
|---------|------------|---------|
| Process | `{VS}_{Name}` | `VS4_DesignEntitlement` |
| WFG Task | `{WFG}_{WFI}` | `WFG1_WFI1` |
| Gateway | `Gateway_{N}` | `Gateway_1` |
| Flow | `Flow_{N}` | `Flow_1` |

---

## Styling

### CSS Files

| File | Purpose |
|------|---------|
| `workflow-builder.css` | WorkflowBuilder component |
| `workflow-definitions.css` | Page and view components |

### CSS Variables Used

```css
/* Colors */
--color-primary
--color-primary-dark
--color-secondary
--color-secondary-dark
--color-error
--color-error-light
--color-warning
--color-success
--color-border
--color-card
--color-card-secondary
--color-text
--color-text-secondary
```

### Key Classes

**WorkflowBuilder:**
- `.workflow-builder` - Container
- `.workflow-builder-toolbar` - Toolbar
- `.workflow-builder-canvas` - BPMN canvas
- `.workflow-builder-error` - Error message
- `.workflow-builder-loading` - Loading state

**Definitions Page:**
- `.workflow-definitions-page` - Page container
- `.definitions-list-view` - List view
- `.create-view` / `.edit-view` / `.history-view` - View containers
- `.definitions-table` - Table styles
- `.status-badge` - Status indicators
- `.version-item` - History list item

### Dark Mode Support

```css
/* Via media query */
@media (prefers-color-scheme: dark) { ... }

/* Via class */
.dark-mode .workflow-builder-canvas { ... }

/* Via data attribute */
[data-theme="dark"] .workflow-builder-canvas { ... }
```

---

## API Integration

### API Client Functions

```typescript
// stubs/app/src/api/workflow-definitions/index.ts

// List all definitions
export async function listDefinitions(
  status?: DefinitionStatus
): Promise<WorkflowDefinitionListResponse[]>

// Get definition with versions
export async function getDefinition(
  id: string
): Promise<WorkflowDefinitionDetailResponse>

// Create new definition
export async function createDefinition(
  data: CreateDefinitionRequest
): Promise<WorkflowDefinitionDetailResponse>

// Create new version
export async function createVersion(
  definitionId: string,
  data: CreateVersionRequest
): Promise<WorkflowVersionResponse>

// Publish a version
export async function publishVersion(
  definitionId: string,
  versionNumber: number
): Promise<void>

// Rollback to version
export async function rollbackToVersion(
  definitionId: string,
  versionNumber: number
): Promise<WorkflowVersionResponse>

// Delete definition
export async function deleteDefinition(
  id: string
): Promise<void>

// Validate BPMN
export async function validateBpmn(
  data: ValidateBpmnRequest
): Promise<ValidationResponse>
```

### Type Definitions

```typescript
export type DefinitionStatus = 'draft' | 'published' | 'archived';

export interface WorkflowDefinitionListResponse {
  id: string;
  name: string;
  description?: string;
  process_id: string;
  status: DefinitionStatus;
  active_version_number?: number;
  version_count: number;
  created_at: string;
  updated_at: string;
}

export interface WorkflowVersionResponse {
  id: string;
  version: number;
  bpmn_xml: string;
  change_notes?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface WorkflowDefinitionDetailResponse
  extends WorkflowDefinitionListResponse {
  created_by: string;
  versions: WorkflowVersionResponse[];
}
```

---

## Related Documentation

- [WORKFLOW_SYSTEM.md](../../../../docs/technical/WORKFLOW_SYSTEM.md) - Complete architecture overview
- [WORKFLOW_NAVIGATION.md](./WORKFLOW_NAVIGATION.md) - User navigation documentation
- [WORKFLOW_API.md](../../../api/docs/technical/WORKFLOW_API.md) - API endpoint reference
- [WORKFLOW_DATABASE_SCHEMA.md](../../../api/docs/technical/WORKFLOW_DATABASE_SCHEMA.md) - Database schema
