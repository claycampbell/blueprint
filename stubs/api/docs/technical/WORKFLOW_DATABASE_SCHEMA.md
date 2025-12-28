# Workflow Database Schema

This document describes the database tables used by the SpiffWorkflow-based workflow engine in Connect 2.0.

## Overview

The workflow system uses a 3-tier hierarchy:
- **Value Stream (VS)**: Top-level process (e.g., VS4 Design & Entitlement)
- **Workflow Group (WFG)**: Phases within a value stream (e.g., WFG1 Project Kickoff)
- **Workflow Item (WFI)**: Individual tasks within a group (e.g., WFI-1 Initial Project Review)

## Tables

### workflow_definitions

**Purpose**: Master catalog of workflow templates. This is the top-level container that holds multiple versions of a BPMN workflow.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | VARCHAR(255) | Human-readable name (e.g., "VS4: Design and Entitlement POC") |
| `description` | TEXT | Detailed description of the workflow |
| `process_id` | VARCHAR(255) | BPMN process ID from the XML (e.g., "VS4_DesignEntitlement_POC") |
| `status` | VARCHAR(50) | Workflow status: `draft`, `published`, or `archived` |
| `created_by` | VARCHAR(255) | User who created the definition |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

**Indexes**:
- `idx_workflow_def_status` - Quick filtering by status
- `idx_workflow_def_process_id` - Lookup by BPMN process ID

**Example**:
```sql
INSERT INTO workflow_definitions (id, name, process_id, status)
VALUES (
  'a1b2c3d4-...',
  'VS4: Design and Entitlement POC',
  'VS4_DesignEntitlement_POC',
  'published'
);
```

---

### workflow_definition_versions

**Purpose**: Stores versioned copies of BPMN XML for each workflow definition. This enables version history, rollback, and audit trails of workflow changes.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `definition_id` | UUID | Foreign key to `workflow_definitions` |
| `version` | INTEGER | Version number (1, 2, 3...) |
| `bpmn_xml` | TEXT | Complete BPMN 2.0 XML content |
| `change_notes` | TEXT | Description of what changed in this version |
| `is_active` | BOOLEAN | Whether this is the currently active version |
| `created_by` | VARCHAR(255) | User who created this version |
| `created_at` | TIMESTAMP | When this version was created |

**Indexes**:
- `idx_wf_version_definition` - Lookup versions by definition
- `idx_wf_version_active` - Find active version for a definition
- `idx_wf_version_unique` - Ensure unique version numbers per definition

**Key Concepts**:
- Only one version can have `is_active = true` per definition
- When publishing a new version, the previous active version is deactivated
- All versions are retained for audit/rollback purposes

---

### projects

**Purpose**: The main entity being worked on. In the Blueprint context, this represents a **property/deal** that flows through the workflow.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | VARCHAR(255) | Project/property name |
| `description` | TEXT | Project description |
| `current_value_stream` | VARCHAR(50) | Current VS (e.g., "VS4") |
| `current_workflow_group` | VARCHAR(50) | Current WFG (e.g., "WFG1") |
| `current_workflow_item` | VARCHAR(50) | Current WFI (e.g., "WFI1") |
| `workflow_instance_id` | VARCHAR(255) | Reference to `workflow_instances.id` |
| `workflow_definition_id` | UUID | Foreign key to `workflow_definitions` |
| `status` | VARCHAR(50) | Project status: `active`, `completed`, `cancelled` |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

**Denormalized Fields**: `current_value_stream`, `current_workflow_group`, and `current_workflow_item` are denormalized for quick queries. The authoritative state is in `workflow_instances.serialized_state`.

---

### workflow_instances

**Purpose**: Stores the **running execution state** of a workflow for a specific project. This is NOT a version of the workflow definition - it's the SpiffWorkflow engine's serialized state that tracks where a project is in its workflow journey.

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(255) | Primary key (SpiffWorkflow instance ID) |
| `project_id` | UUID | Foreign key to `projects` - which project this instance belongs to |
| `workflow_definition_id` | UUID | Foreign key to `workflow_definitions` - which workflow template this uses |
| `serialized_state` | JSON | SpiffWorkflow's complete serialized state |
| `current_task_id` | VARCHAR(255) | ID of the current active task |
| `current_task_name` | VARCHAR(255) | Name of the current active task |
| `status` | VARCHAR(50) | Instance status: `running`, `completed`, `suspended`, `error` |
| `created_at` | TIMESTAMP | When the workflow was started |
| `updated_at` | TIMESTAMP | Last state update |

**Key Concepts**:

1. **One instance per project**: Each project has exactly one workflow instance that tracks its progress through the workflow.

2. **Serialized State**: The `serialized_state` JSON contains everything SpiffWorkflow needs to:
   - Know which tasks are completed
   - Know which task(s) are currently ready
   - Store workflow data/variables
   - Resume execution after system restart

3. **Quick Lookup Fields**: `current_task_id` and `current_task_name` are denormalized from the serialized state for quick queries without deserializing the full JSON.

**Example of serialized_state**:
```json
{
  "data": {
    "decision_action": "approve",
    "target_step": null
  },
  "tasks": {
    "WFG1_WFI1": {"state": "COMPLETED", "completed_at": "2024-12-27T10:00:00Z"},
    "WFG1_WFI2": {"state": "READY", "assigned_to": null}
  },
  "current_task": "WFG1_WFI2"
}
```

**Answering the question**: "Is workflow_instances a version of the workflow for a specific property?"

**No** - `workflow_instances` is not a version. It's the **runtime execution state**. Think of it this way:
- `workflow_definitions` = The recipe (what steps exist)
- `workflow_definition_versions` = Different versions of the recipe
- `workflow_instances` = A meal being cooked using that recipe (actual progress for a specific project)

---

### step_comments

**Purpose**: User comments added at each workflow step. Provides context and communication between team members working on a project.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `project_id` | UUID | Foreign key to `projects` |
| `workflow_group` | VARCHAR(50) | Which WFG the comment belongs to |
| `workflow_item` | VARCHAR(50) | Which WFI the comment belongs to (optional) |
| `user_id` | VARCHAR(255) | User who made the comment |
| `user_name` | VARCHAR(255) | Display name of the commenter |
| `content` | TEXT | The comment text |
| `created_at` | TIMESTAMP | When the comment was made |

**Use Cases**:
- "I reviewed the site survey and found an issue with the setback requirements"
- "Waiting for city planner callback before we can proceed"
- "Approved - all documents in order"

---

### workflow_history

**Purpose**: Audit trail of all workflow transitions. Records every decision made as a project moves through the workflow.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `project_id` | UUID | Foreign key to `projects` |
| `from_workflow_group` | VARCHAR(50) | WFG before the transition |
| `to_workflow_group` | VARCHAR(50) | WFG after the transition |
| `action` | VARCHAR(50) | Action taken: `approve`, `send_back`, `skip_to`, `complete_wfg` |
| `reason` | TEXT | Explanation for the action |
| `decision_maker_id` | VARCHAR(255) | User who made the decision |
| `decision_maker_name` | VARCHAR(255) | Display name of decision maker |
| `created_at` | TIMESTAMP | When the transition occurred |

**Example History**:
```
Project "123 Main St" history:
1. WFG1 (Project Kickoff) -> WFG2 (Schematic Design) [approve]
2. WFG2 -> WFG1 [send_back] "Site survey incomplete, need arborist report"
3. WFG1 -> WFG2 [approve] "Added arborist report, ready to proceed"
4. WFG2 -> WFG3 (Construction Docs) [approve]
```

---

## Entity Relationships

```
workflow_definitions (1) ─────────< (N) workflow_definition_versions
         │
         │ (1)
         │
         └─────────────────────────< (N) workflow_instances
         │                                    │
         │                                    │ (1)
         │ (1)                                │
         │                                    v
         └─────────────────────────< (N) projects (1) ────────< (N) step_comments
                                              │
                                              │ (1)
                                              │
                                              └────────────────< (N) workflow_history
```

## Common Queries

### Get active workflow version for a definition
```sql
SELECT * FROM workflow_definition_versions
WHERE definition_id = :definition_id AND is_active = true;
```

### Get a project's current position with instance state
```sql
SELECT p.*, wi.serialized_state, wi.current_task_name, wi.status as workflow_status
FROM projects p
LEFT JOIN workflow_instances wi ON p.id = wi.project_id
WHERE p.id = :project_id;
```

### Get workflow history for a project
```sql
SELECT * FROM workflow_history
WHERE project_id = :project_id
ORDER BY created_at ASC;
```

### Get all projects currently at a specific workflow group
```sql
SELECT * FROM projects
WHERE current_workflow_group = 'WFG2' AND status = 'active';
```

### Get comments for a specific step
```sql
SELECT * FROM step_comments
WHERE project_id = :project_id
  AND workflow_group = :wfg
ORDER BY created_at ASC;
```

## Related Documentation

- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) - Overall API architecture
- [API_QUICKSTART.md](./API_QUICKSTART.md) - Getting started with the API
- BPMN files are in `/bpmn/` directory
