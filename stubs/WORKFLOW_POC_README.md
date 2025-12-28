# SpiffWorkflow POC - VS4 Design & Entitlement

This is a Proof of Concept demonstrating SpiffWorkflow integration for the Blueprint workflow system.

## Overview

The POC implements a simplified VS4 (Design & Entitlement) workflow with 3 steps:

1. **WFG1: Project Kickoff** - Initial project setup
2. **WFG2: Schematic Design** - Design development
3. **WFG3: Construction Docs** - Final documentation

### Supported Actions

- **Approve** - Move forward to the next step
- **Send Back** - Return to a previous step (with reason)
- **Skip To** - Jump to a future step

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend                            │
│  WorkflowPocPage.tsx + Components (StepDisplay, DecisionPanel)   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP API
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FastAPI Backend                           │
│  app/api/v1/workflow.py - REST endpoints                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Workflow Service Layer                         │
│  app/services/workflow_service.py - SpiffWorkflow integration   │
│  bpmn/vs4_poc.bpmn - BPMN workflow definition                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PostgreSQL                                │
│  workflow_poc database                                          │
│  Tables: projects, workflow_instances, step_comments, etc.      │
└─────────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Create PostgreSQL Database

First, create the database and tables:

```bash
# Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE workflow_poc;"

# Run the schema setup
cd stubs/api
psql -U postgres -d workflow_poc -f scripts/init_workflow_poc_db.sql
```

Or using pgAdmin:
1. Create a new database called `workflow_poc`
2. Run the SQL from `stubs/api/scripts/init_workflow_poc_db.sql`

### 2. Install API Dependencies

```bash
cd stubs/api

# Using uv (recommended)
uv sync

# Or using pip
pip install -e ".[dev]"
```

### 3. Configure Environment

Create a `.env` file in `stubs/api/`:

```env
DEBUG=true
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/workflow_poc
```

Adjust the database URL to match your PostgreSQL credentials.

### 4. Start the API Server

```bash
cd stubs/api
uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 5. Start the Frontend (Optional)

```bash
cd stubs/app
npm install
npm run dev
```

The frontend will be available at http://localhost:5173/workflow-poc

## API Endpoints

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/workflow/projects` | Create project + start workflow |
| GET | `/api/v1/workflow/projects` | List all projects |
| GET | `/api/v1/workflow/projects/{id}` | Get project details |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/workflow/projects/{id}/comments` | Add comment |
| GET | `/api/v1/workflow/projects/{id}/comments` | List comments |

### Decisions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/workflow/projects/{id}/decision` | Make workflow decision |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/workflow/steps` | Get step definitions |

## Testing the Workflow

### Using Swagger UI

1. Go to http://localhost:8000/docs
2. Create a project:
   ```json
   POST /api/v1/workflow/projects
   {
     "name": "Test Project 1"
   }
   ```
3. Add a comment:
   ```json
   POST /api/v1/workflow/projects/{id}/comments
   {
     "content": "This is a test comment"
   }
   ```
4. Approve to next step:
   ```json
   POST /api/v1/workflow/projects/{id}/decision
   {
     "action": "approve"
   }
   ```
5. Skip from WFG1 to WFG3:
   ```json
   POST /api/v1/workflow/projects/{id}/decision
   {
     "action": "skip_to",
     "target_step": "WFG3"
   }
   ```
6. Send back from WFG3 to WFG2:
   ```json
   POST /api/v1/workflow/projects/{id}/decision
   {
     "action": "send_back",
     "target_step": "WFG2",
     "reason": "Need to revise schematic design"
   }
   ```

### Using curl

```bash
# Create project
curl -X POST http://localhost:8000/api/v1/workflow/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Project"}'

# Get project (replace {id} with actual UUID)
curl http://localhost:8000/api/v1/workflow/projects/{id}

# Add comment
curl -X POST http://localhost:8000/api/v1/workflow/projects/{id}/comments \
  -H "Content-Type: application/json" \
  -d '{"content": "Test comment"}'

# Approve
curl -X POST http://localhost:8000/api/v1/workflow/projects/{id}/decision \
  -H "Content-Type: application/json" \
  -d '{"action": "approve"}'

# Skip to WFG3
curl -X POST http://localhost:8000/api/v1/workflow/projects/{id}/decision \
  -H "Content-Type: application/json" \
  -d '{"action": "skip_to", "target_step": "WFG3"}'

# Send back with reason
curl -X POST http://localhost:8000/api/v1/workflow/projects/{id}/decision \
  -H "Content-Type: application/json" \
  -d '{"action": "send_back", "target_step": "WFG2", "reason": "Need revisions"}'
```

## Test Scenario

Here's a complete test scenario to verify the POC:

1. **Create project** → Starts at WFG1 (Project Kickoff)
2. **Add comment** → "Initial project setup complete"
3. **Approve** → Moves to WFG2 (Schematic Design)
4. **Add comment** → "Design draft uploaded"
5. **Skip to WFG3** → Jumps to WFG3 (Construction Docs)
6. **Send back to WFG2** → Returns to WFG2 with reason
7. **Approve** → Moves back to WFG3
8. **Approve** → Completes workflow

## File Structure

```
stubs/
├── api/
│   ├── app/
│   │   ├── api/v1/
│   │   │   └── workflow.py          # API endpoints
│   │   ├── models/
│   │   │   └── workflow.py          # SQLAlchemy models
│   │   ├── schemas/
│   │   │   └── workflow.py          # Pydantic schemas
│   │   ├── services/
│   │   │   └── workflow_service.py  # SpiffWorkflow integration
│   │   └── db/
│   │       └── database.py          # Database connection
│   ├── bpmn/
│   │   └── vs4_poc.bpmn             # BPMN workflow definition
│   └── scripts/
│       └── init_workflow_poc_db.sql # Database setup
│
├── app/
│   └── src/
│       ├── api/workflow/
│       │   └── index.ts             # API client
│       ├── components/workflow/
│       │   ├── StepDisplay.tsx      # Progress display
│       │   ├── CommentForm.tsx      # Comment input
│       │   └── DecisionPanel.tsx    # Action buttons
│       └── pages/
│           └── WorkflowPocPage.tsx  # Main POC page
│
└── WORKFLOW_POC_README.md           # This file
```

## How SpiffWorkflow is Used

1. **BPMN Definition** ([bpmn/vs4_poc.bpmn](api/bpmn/vs4_poc.bpmn))
   - Defines the workflow structure with User Tasks and Gateways
   - Gateway conditions evaluate `decision_action` and `target_step` variables

2. **Workflow Service** ([workflow_service.py](api/app/services/workflow_service.py))
   - Creates new workflow instances from the BPMN spec
   - Serializes/deserializes workflow state to JSON
   - Executes decisions by setting task data and completing tasks

3. **Database Storage**
   - `workflow_instances` table stores serialized SpiffWorkflow state
   - `projects` table stores denormalized current step for quick queries
   - `workflow_history` table tracks all transitions for audit

## Key Concepts Demonstrated

1. **BPMN User Tasks** - Steps that wait for user action
2. **Exclusive Gateways** - Route based on decision data
3. **Workflow Serialization** - Persist workflow state between requests
4. **Back-routing** - Non-linear flow (send back to previous steps)
5. **Skip routing** - Jump to future steps

## Limitations of this POC

- No authentication (single "POC User")
- No document uploads (comments only)
- No multi-user collaboration
- No real-time updates
- Simplified 3-step workflow

## Next Steps for Full Implementation

1. Add authentication and user management
2. Implement Call Activities for sub-processes (WFI items within WFGs)
3. Add document upload to S3
4. Implement real-time updates with WebSockets
5. Add multi-user assignment and role-based permissions
6. Build the BPMN editor UI for workflow admins
