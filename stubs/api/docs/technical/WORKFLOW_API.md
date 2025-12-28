# Workflow API Documentation

This document details the API endpoints and SpiffWorkflow integration for the Connect 2.0 workflow system.

> **Architecture Overview**: See [WORKFLOW_SYSTEM.md](../../../../docs/technical/WORKFLOW_SYSTEM.md) for the complete workflow architecture.

## Table of Contents

1. [API Overview](#api-overview)
2. [Workflow Definitions API](#workflow-definitions-api)
3. [Workflow Instances API](#workflow-instances-api)
4. [Project Workflow API](#project-workflow-api)
5. [SpiffWorkflow Integration](#spiffworkflow-integration)
6. [Error Handling](#error-handling)

---

## API Overview

### Base URL

```
/api/v1/workflows
```

### Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Response Format

```typescript
// Success response
{
  "success": true,
  "data": { ... }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": [...]
  }
}
```

---

## Workflow Definitions API

Manage workflow templates (BPMN definitions).

### List Definitions

```http
GET /api/v1/workflows/definitions
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `draft`, `published`, `archived` |
| `page` | number | Page number (default: 1) |
| `pageSize` | number | Items per page (default: 20) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "VS4 Design & Entitlement",
      "description": "Main entitlement workflow",
      "process_id": "VS4_DesignEntitlement",
      "status": "published",
      "active_version_number": 3,
      "version_count": 5,
      "created_at": "2024-12-01T00:00:00Z",
      "updated_at": "2024-12-15T00:00:00Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "pageSize": 20
  }
}
```

### Get Definition Detail

```http
GET /api/v1/workflows/definitions/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "VS4 Design & Entitlement",
    "description": "Main entitlement workflow",
    "process_id": "VS4_DesignEntitlement",
    "status": "published",
    "created_by": "user@example.com",
    "created_at": "2024-12-01T00:00:00Z",
    "updated_at": "2024-12-15T00:00:00Z",
    "versions": [
      {
        "id": "uuid",
        "version": 3,
        "bpmn_xml": "<?xml version=\"1.0\"...",
        "change_notes": "Added review step",
        "is_active": true,
        "created_by": "admin@example.com",
        "created_at": "2024-12-15T00:00:00Z"
      },
      {
        "id": "uuid",
        "version": 2,
        "bpmn_xml": "...",
        "change_notes": "Fixed gateway logic",
        "is_active": false,
        "created_by": "admin@example.com",
        "created_at": "2024-12-10T00:00:00Z"
      }
    ]
  }
}
```

### Create Definition

```http
POST /api/v1/workflows/definitions
```

**Request Body:**
```json
{
  "name": "VS4 Design & Entitlement",
  "description": "Main entitlement workflow",
  "process_id": "VS4_DesignEntitlement",
  "bpmn_xml": "<?xml version=\"1.0\"...",
  "change_notes": "Initial version"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "VS4 Design & Entitlement",
    "status": "draft",
    "active_version_number": 1
  }
}
```

### Create New Version

```http
POST /api/v1/workflows/definitions/:id/versions
```

**Request Body:**
```json
{
  "bpmn_xml": "<?xml version=\"1.0\"...",
  "change_notes": "Updated gateway conditions",
  "publish": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "version": 4,
    "is_active": false,
    "created_at": "2024-12-20T00:00:00Z"
  }
}
```

### Publish Version

```http
POST /api/v1/workflows/definitions/:id/versions/:version/publish
```

Sets the specified version as active and updates definition status to `published`.

**Response:**
```json
{
  "success": true,
  "data": {
    "definition_id": "uuid",
    "version": 4,
    "is_active": true,
    "status": "published"
  }
}
```

### Rollback to Version

```http
POST /api/v1/workflows/definitions/:id/versions/:version/rollback
```

Creates a new version based on a previous version's BPMN XML.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "version": 5,
    "change_notes": "Rollback to version 2",
    "is_active": true
  }
}
```

### Delete Definition

```http
DELETE /api/v1/workflows/definitions/:id
```

Only allowed for definitions with no active workflow instances.

**Response:**
```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

### Validate BPMN

```http
POST /api/v1/workflows/definitions/validate
```

Validates BPMN XML without saving.

**Request Body:**
```json
{
  "bpmn_xml": "<?xml version=\"1.0\"...",
  "process_id": "VS4_DesignEntitlement"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "errors": [],
    "warnings": ["No end event found in subprocess"]
  }
}
```

---

## Workflow Instances API

Manage runtime workflow execution state.

### Get Instance

```http
GET /api/v1/workflows/instances/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "project_id": "uuid",
    "workflow_definition_id": "uuid",
    "status": "running",
    "current_task_id": "WFG2_WFI1",
    "current_task_name": "Schematic Review",
    "ready_tasks": [
      {
        "id": "WFG2_WFI1",
        "name": "Schematic Review",
        "type": "userTask"
      }
    ],
    "completed_tasks": [
      {
        "id": "WFG1_WFI1",
        "name": "Project Kickoff",
        "completed_at": "2024-12-10T00:00:00Z"
      }
    ],
    "workflow_data": {
      "project_name": "123 Main St",
      "assigned_team": ["user1", "user2"]
    },
    "created_at": "2024-12-01T00:00:00Z",
    "updated_at": "2024-12-15T00:00:00Z"
  }
}
```

### Complete Task

```http
POST /api/v1/workflows/instances/:id/tasks/:taskId/complete
```

**Request Body:**
```json
{
  "data": {
    "decision": "approved",
    "notes": "All requirements met"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "completed_task": "WFG2_WFI1",
    "next_tasks": [
      {
        "id": "WFG2_WFI2",
        "name": "Design Review",
        "type": "userTask"
      }
    ],
    "workflow_status": "running"
  }
}
```

---

## Project Workflow API

Manage workflow state for specific projects.

### Start Workflow for Project

```http
POST /api/v1/projects/:projectId/workflow/start
```

**Request Body:**
```json
{
  "workflow_definition_id": "uuid",
  "initial_data": {
    "project_name": "123 Main St",
    "project_type": "residential"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "instance_id": "uuid",
    "current_task": {
      "id": "WFG1_WFI1",
      "name": "Project Kickoff"
    }
  }
}
```

### Get Current Workflow State

```http
GET /api/v1/projects/:projectId/workflow
```

**Response:**
```json
{
  "success": true,
  "data": {
    "instance_id": "uuid",
    "definition_name": "VS4 Design & Entitlement",
    "current_value_stream": "VS4",
    "current_workflow_group": "WFG2",
    "current_workflow_item": "WFI1",
    "current_task": {
      "id": "WFG2_WFI1",
      "name": "Schematic Review",
      "description": "Review schematic design documents"
    },
    "available_actions": ["approve", "send_back", "skip_to"],
    "workflow_status": "running"
  }
}
```

### Transition Workflow

```http
POST /api/v1/projects/:projectId/workflow/transition
```

Main endpoint for navigating through the workflow.

**Request Body:**
```json
{
  "action": "approve",
  "reason": "All documents reviewed and approved",
  "target_step": null
}
```

**Actions:**

| Action | Description | `target_step` |
|--------|-------------|---------------|
| `approve` | Move to next step | Not required |
| `send_back` | Return to previous step | Optional: specific step ID |
| `skip_to` | Jump to future step | Required: target step ID |
| `complete_wfg` | Complete current workflow group | Not required |

**Response:**
```json
{
  "success": true,
  "data": {
    "previous_step": {
      "wfg": "WFG2",
      "wfi": "WFI1"
    },
    "current_step": {
      "wfg": "WFG2",
      "wfi": "WFI2"
    },
    "history_id": "uuid",
    "workflow_status": "running"
  }
}
```

### Get Workflow History

```http
GET /api/v1/projects/:projectId/workflow/history
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "from_workflow_group": "WFG1",
      "to_workflow_group": "WFG2",
      "action": "approve",
      "reason": "Kickoff complete",
      "decision_maker_id": "user123",
      "decision_maker_name": "John Doe",
      "created_at": "2024-12-10T00:00:00Z"
    },
    {
      "id": "uuid",
      "from_workflow_group": "WFG2",
      "to_workflow_group": "WFG1",
      "action": "send_back",
      "reason": "Missing arborist report",
      "decision_maker_id": "user456",
      "decision_maker_name": "Jane Smith",
      "created_at": "2024-12-12T00:00:00Z"
    }
  ]
}
```

### Add Step Comment

```http
POST /api/v1/projects/:projectId/workflow/comments
```

**Request Body:**
```json
{
  "workflow_group": "WFG2",
  "workflow_item": "WFI1",
  "content": "Waiting for city planner callback"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_name": "John Doe",
    "content": "Waiting for city planner callback",
    "created_at": "2024-12-15T14:30:00Z"
  }
}
```

### Get Step Comments

```http
GET /api/v1/projects/:projectId/workflow/comments
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `wfg` | string | Filter by workflow group |
| `wfi` | string | Filter by workflow item |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "workflow_group": "WFG2",
      "workflow_item": "WFI1",
      "user_id": "user123",
      "user_name": "John Doe",
      "content": "Waiting for city planner callback",
      "created_at": "2024-12-15T14:30:00Z"
    }
  ]
}
```

---

## SpiffWorkflow Integration

### Overview

SpiffWorkflow is a Python library that executes BPMN workflows. The Node.js API communicates with a Python service for workflow execution.

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Node.js API   │────▶│  Python Service │────▶│  SpiffWorkflow  │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                               │
         │                                               │
         ▼                                               ▼
┌─────────────────┐                           ┌─────────────────┐
│    PostgreSQL   │                           │  BPMN Execution │
│  (State Store)  │                           │     Engine      │
└─────────────────┘                           └─────────────────┘
```

### State Serialization

SpiffWorkflow state is serialized to JSON and stored in `workflow_instances.serialized_state`:

```json
{
  "spec": {
    "name": "VS4_DesignEntitlement",
    "description": "Design and Entitlement Process"
  },
  "data": {
    "project_id": "uuid",
    "decision_action": "approve",
    "last_decision_at": "2024-12-15T00:00:00Z"
  },
  "tasks": {
    "WFG1_WFI1": {
      "state": "COMPLETED",
      "last_state_change": "2024-12-10T00:00:00Z",
      "data": {}
    },
    "WFG2_WFI1": {
      "state": "READY",
      "last_state_change": "2024-12-10T00:00:00Z",
      "data": {}
    }
  },
  "last_task": "WFG2_WFI1"
}
```

### Task States

| State | Description |
|-------|-------------|
| `WAITING` | Task is waiting for predecessor to complete |
| `READY` | Task is ready to be executed |
| `COMPLETED` | Task has been completed |
| `CANCELLED` | Task was cancelled (skip/branch) |

### Python Service Endpoints

Internal endpoints called by the Node.js API:

```http
# Create workflow instance from BPMN
POST /spiff/create
{
  "bpmn_xml": "...",
  "process_id": "VS4_DesignEntitlement",
  "initial_data": {}
}

# Load existing instance from serialized state
POST /spiff/load
{
  "serialized_state": {...}
}

# Complete a task
POST /spiff/complete-task
{
  "serialized_state": {...},
  "task_id": "WFG2_WFI1",
  "task_data": {}
}

# Get ready tasks
POST /spiff/ready-tasks
{
  "serialized_state": {...}
}
```

---

## Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `NOT_FOUND` | 404 | Resource not found |
| `WORKFLOW_ERROR` | 400 | Workflow execution error |
| `INVALID_TRANSITION` | 400 | Cannot perform requested transition |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `CONFLICT` | 409 | Resource state conflict |

### Error Response Examples

**Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "process_id",
        "message": "Process ID must match BPMN definition"
      }
    ]
  }
}
```

**Invalid Transition:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TRANSITION",
    "message": "Cannot skip to WFG4 from WFG1",
    "details": [
      {
        "current_step": "WFG1",
        "requested_step": "WFG4",
        "allowed_targets": ["WFG2"]
      }
    ]
  }
}
```

---

## Related Documentation

- [WORKFLOW_SYSTEM.md](../../../../docs/technical/WORKFLOW_SYSTEM.md) - Complete architecture overview
- [WORKFLOW_DATABASE_SCHEMA.md](./WORKFLOW_DATABASE_SCHEMA.md) - Database schema details
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) - Overall API architecture
