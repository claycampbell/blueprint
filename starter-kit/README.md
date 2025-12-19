# Blueprint Connect 2.0 - Starter Kit

This is a clean, minimal implementation of the Connect 2.0 platform with **Windmill** as the business process automation engine.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Connect 2.0 Platform                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   API Layer  │  │   Windmill   │  │  PostgreSQL  │  │
│  │  (Express)   │◄─┤  (Workflows) │─►│  (Database)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                 │          │
│  ┌──────────────────────────────────────────────────┐  │
│  │               Business Automations                │  │
│  │  • Lead Intake → Auto-assign to manager          │  │
│  │  • Document Upload → Extract & validate          │  │
│  │  • Status Change → Trigger notifications         │  │
│  │  • Approval Required → Route to approver         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## What's Included

### Core Infrastructure
- **PostgreSQL**: Primary database for all business data
- **Windmill**: Business process automation platform
- **Express API**: RESTful API server (TypeScript)
- **LocalStack**: AWS service emulation (S3, SQS, etc.)
- **Redis**: Caching and session management

### Key Features
- **Workflow Orchestration**: Define complex business processes visually or in code
- **Event-Driven Automation**: Trigger workflows based on business events
- **Approval Flows**: Built-in human-in-the-loop capabilities
- **Scheduling**: Cron-based scheduled workflows
- **Monitoring**: Track all workflow executions with full audit trail

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Node.js 18+ and npm
- Git

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/claycampbell/blueprint.git
cd blueprint/starter-kit

# Copy environment variables
cp .env.example .env

# Install API dependencies
cd api && npm install && cd ..
```

### 2. Start the Infrastructure

```bash
# Start all services
docker-compose up -d

# Wait for services to be healthy (about 30 seconds)
docker-compose ps

# Check logs if needed
docker-compose logs -f windmill-server
```

### 3. Access the Services

- **Windmill UI**: http://localhost:8000
  - Default login: `admin@windmill.dev` / `changeme`
  - First time: Change the admin password!

- **API Server**: http://localhost:3000
  - Health check: http://localhost:3000/health

- **PostgreSQL**: `localhost:5432`
  - User: `blueprint`
  - Password: `blueprint_dev_2024`
  - Databases: `connect2`, `windmill`

### 4. Create Your First Workflow

1. Open Windmill UI at http://localhost:8000
2. Click "Flows" → "New Flow"
3. Name it: `lead_intake`
4. Add steps:
   - **Input**: Receive lead data
   - **Transform**: Validate and enrich
   - **Database**: Insert into `projects` table
   - **Notification**: Send notification (email/slack)
5. Save and test the flow

### 5. Trigger Workflow from API

```bash
# Create a new lead via API
curl -X POST http://localhost:3000/api/v1/workflows/run \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_name": "lead_intake",
    "entity_type": "project",
    "inputs": {
      "name": "123 Main St Development",
      "address": "123 Main St",
      "city": "Seattle",
      "builder_name": "ABC Builders",
      "contact_email": "john@abcbuilders.com"
    }
  }'
```

## Project Structure

```
starter-kit/
├── docker-compose.yml       # All services configuration
├── Caddyfile               # Windmill reverse proxy
├── .env.example            # Environment variables template
├── init-scripts/           # Database initialization
│   ├── 01-create-databases.sql
│   └── 02-connect2-schema.sql
├── api/                    # Express API server
│   ├── src/
│   │   ├── index.ts       # Main server file
│   │   ├── routes/        # API endpoints
│   │   │   ├── projects.ts
│   │   │   ├── contacts.ts
│   │   │   ├── workflows.ts
│   │   │   └── automations.ts
│   │   └── services/      # Business logic
│   │       └── windmill.service.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md              # This file
```

## Windmill Workflow Examples

### 1. Lead Intake Automation

```typescript
// Windmill script: lead_intake.ts
export async function main(input: {
  name: string;
  address: string;
  builder_email: string;
}) {
  // Step 1: Validate input
  if (!input.name || !input.address) {
    throw new Error("Missing required fields");
  }

  // Step 2: Check for duplicate
  const existing = await sql`
    SELECT id FROM projects
    WHERE address = ${input.address}
  `;

  if (existing.length > 0) {
    return { status: "duplicate", project_id: existing[0].id };
  }

  // Step 3: Create project
  const project = await sql`
    INSERT INTO projects (name, address, status)
    VALUES (${input.name}, ${input.address}, 'LEAD')
    RETURNING *
  `;

  // Step 4: Send notification
  await sendEmail({
    to: "acquisitions@blueprint.com",
    subject: "New Lead: " + input.name,
    body: `New lead received at ${input.address}`
  });

  return { status: "created", project: project[0] };
}
```

### 2. Document Processing Automation

```typescript
// Windmill flow: document_processing
// This would be configured visually in Windmill UI

// Step 1: Receive document upload event
// Step 2: Download from S3
// Step 3: Extract text (OCR if needed)
// Step 4: Parse and validate data
// Step 5: Update database
// Step 6: Trigger next workflow if conditions met
```

### 3. Approval Workflow

```typescript
// Windmill approval flow with human-in-the-loop
export async function main(input: {
  loan_id: string;
  amount: number;
}) {
  // Step 1: Check if approval needed
  if (input.amount > 1000000) {
    // Step 2: Create approval task
    const approval = await createApproval({
      title: `Loan approval required: $${input.amount}`,
      assignee: "senior_manager@blueprint.com",
      data: input
    });

    // Step 3: Wait for approval (Windmill handles this)
    if (approval.approved) {
      // Step 4: Update loan status
      await sql`
        UPDATE loans
        SET status = 'APPROVED'
        WHERE id = ${input.loan_id}
      `;
    } else {
      // Handle rejection
      await sql`
        UPDATE loans
        SET status = 'REJECTED'
        WHERE id = ${input.loan_id}
      `;
    }
  }
}
```

## API Endpoints

### Projects
- `GET /api/v1/projects` - List all projects
- `GET /api/v1/projects/:id` - Get project details
- `POST /api/v1/projects` - Create new project
- `PATCH /api/v1/projects/:id` - Update project

### Workflows
- `POST /api/v1/workflows/run` - Run a workflow immediately
- `GET /api/v1/workflows/executions/:id` - Get execution status
- `GET /api/v1/workflows/available` - List available workflows
- `POST /api/v1/workflows/trigger` - Trigger based on event

### Automations
- `GET /api/v1/automations/rules` - List automation rules
- `POST /api/v1/automations/rules` - Create new rule
- `GET /api/v1/automations/history` - View execution history

## Development Workflow

### Adding a New Workflow

1. **Design in Windmill UI**:
   - Open http://localhost:8000
   - Create new flow or script
   - Test with sample data

2. **Register Automation Rule**:
   ```sql
   INSERT INTO automation_rules (
     name,
     trigger_type,
     trigger_config,
     windmill_path
   ) VALUES (
     'Auto-assign on lead creation',
     'entity_created',
     '{"entity_type": "project"}',
     'flows/lead_assignment'
   );
   ```

3. **Trigger from Application**:
   ```typescript
   // In your application code
   await fetch('/api/v1/workflows/trigger', {
     method: 'POST',
     body: JSON.stringify({
       event_type: 'entity_created',
       entity_type: 'project',
       entity_id: projectId,
       data: projectData
     })
   });
   ```

## Monitoring & Debugging

### View Workflow Executions

```sql
-- Check recent executions
SELECT * FROM workflow_executions
ORDER BY started_at DESC
LIMIT 10;

-- Check failed workflows
SELECT * FROM workflow_executions
WHERE status = 'FAILED'
ORDER BY started_at DESC;
```

### Windmill Logs

```bash
# View Windmill server logs
docker-compose logs -f windmill-server

# View worker logs
docker-compose logs -f windmill-worker
```

### API Logs

```bash
# If running locally
cd api && npm run dev

# If running in Docker
docker-compose logs -f api
```

## Production Considerations

1. **Security**:
   - Change all default passwords
   - Use environment-specific secrets
   - Enable HTTPS/TLS
   - Implement proper authentication

2. **Scaling**:
   - Add more Windmill workers for parallel execution
   - Use Redis for distributed locking
   - Implement database connection pooling
   - Consider Kubernetes for orchestration

3. **Monitoring**:
   - Set up Prometheus/Grafana
   - Configure alerting rules
   - Track workflow SLAs
   - Monitor resource usage

4. **Backup**:
   - Regular PostgreSQL backups
   - Windmill script versioning
   - Configuration management

## Next Steps

1. **Explore Windmill Features**:
   - Scheduled workflows (cron)
   - Webhook triggers
   - Approval flows
   - Custom scripts in TypeScript/Python
   - Integration with external services

2. **Build Core Workflows**:
   - Lead intake and qualification
   - Document processing pipeline
   - Approval chains
   - Notification system
   - Report generation

3. **Extend the API**:
   - Add authentication (JWT)
   - Implement role-based access
   - Add validation middleware
   - Create DTOs for type safety
   - Add OpenAPI documentation

## Troubleshooting

### Services won't start
```bash
# Check Docker is running
docker ps

# Reset everything
docker-compose down -v
docker-compose up -d
```

### Can't connect to Windmill
```bash
# Check if Caddy is running
docker-compose ps caddy

# Check Windmill logs
docker-compose logs windmill-server
```

### Database connection errors
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Connect manually
docker exec -it blueprint-postgres psql -U blueprint -d connect2
```

## Support

For issues or questions:
- Check Windmill docs: https://windmill.dev/docs
- Review logs: `docker-compose logs`
- Database state: Connect to PostgreSQL and check tables

---

Built with Windmill - The open-source developer platform for building production-grade internal tools and workflows.