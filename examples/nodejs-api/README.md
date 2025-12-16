# Connect 2.0 Platform API

Node.js + TypeScript + Express API for the Connect 2.0 platform, demonstrating integration with LocalStack (AWS services) and PostgreSQL.

## Technology Stack

- **Runtime:** Node.js 18+ with TypeScript 5.3
- **Framework:** Express.js 4.18
- **Database:** PostgreSQL 15 (via pg client)
- **AWS Services:** S3, SQS (via AWS SDK v3)
- **Local Development:** LocalStack for AWS service emulation

## Prerequisites

Before running this API, ensure you have:

1. **Node.js 18+** and **npm 9+** installed
2. **Docker and Docker Compose** running (for LocalStack and PostgreSQL)
3. **LocalStack services** started via `docker-compose up -d`

## Installation

1. **Install dependencies:**
   ```bash
   cd examples/nodejs-api
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env if needed (defaults work with docker-compose setup)
   ```

3. **Verify LocalStack and PostgreSQL are running:**
   ```bash
   docker ps
   # Should show containers: localstack-main, postgres
   ```

## Running the API

### Development Mode (with hot reload)

```bash
npm run dev
```

The API will start on `http://localhost:3000` with automatic reloading on file changes.

### Production Build

```bash
npm run build
npm start
```

## Testing Endpoints

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-15T10:30:00.000Z",
  "services": {
    "database": "connected",
    "s3": "connected",
    "sqs": "connected"
  }
}
```

### Projects API

**List all projects:**
```bash
curl http://localhost:3000/api/v1/projects
```

**Get project by ID:**
```bash
curl http://localhost:3000/api/v1/projects/1
```

**Create a new project:**
```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "Westside Townhomes",
    "address": "123 Main St, Seattle, WA 98101",
    "market_id": 1,
    "project_type": "townhome",
    "total_units": 12,
    "status": "lead"
  }'
```

**Update a project:**
```bash
curl -X PUT http://localhost:3000/api/v1/projects/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "feasibility",
    "total_units": 15
  }'
```

**Delete a project:**
```bash
curl -X DELETE http://localhost:3000/api/v1/projects/1
```

### Documents API (S3 Integration)

**Upload a document:**
```bash
curl -X POST http://localhost:3000/api/v1/documents/upload \
  -F "file=@/path/to/document.pdf" \
  -F "project_id=1" \
  -F "document_type=survey"
```

**Get presigned download URL:**
```bash
curl http://localhost:3000/api/v1/documents/1/download
```

Expected response:
```json
{
  "url": "http://localhost:4566/connect-documents/documents/...",
  "expires_in": 3600
}
```

### Tasks API (SQS Integration)

**Create a task (sends SQS notification):**
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "title": "Review preliminary title report",
    "description": "Check for liens and encumbrances",
    "assigned_to": "john.smith@example.com",
    "due_date": "2025-12-20",
    "priority": "high"
  }'
```

## LocalStack Integration Notes

### S3 Configuration

The API uses **path-style S3 URLs** for LocalStack compatibility:
- LocalStack: `http://localhost:4566/bucket-name/key`
- AWS: `https://bucket-name.s3.amazonaws.com/key`

Set `S3_FORCE_PATH_STYLE=true` in `.env` for local development.

### SQS Configuration

Queue URL format for LocalStack:
```
http://localhost:4566/000000000000/queue-name
```

The account ID `000000000000` is LocalStack's default.

### Endpoint Configuration

All AWS SDK clients use the `AWS_ENDPOINT_URL` environment variable:
```javascript
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL, // http://localhost:4566
  forcePathStyle: true
});
```

## Project Structure

```
examples/nodejs-api/
├── src/
│   ├── index.ts              # Application entry point
│   ├── config/
│   │   ├── database.ts       # PostgreSQL connection
│   │   ├── aws.ts            # AWS SDK clients (S3, SQS)
│   │   └── env.ts            # Environment variable validation
│   ├── routes/
│   │   ├── projects.ts       # Project CRUD endpoints
│   │   ├── documents.ts      # Document upload/download (S3)
│   │   ├── tasks.ts          # Task management (SQS)
│   │   └── health.ts         # Health check endpoint
│   ├── models/
│   │   ├── Project.ts        # Project data model
│   │   ├── Document.ts       # Document data model
│   │   └── Task.ts           # Task data model
│   ├── services/
│   │   ├── s3.service.ts     # S3 operations wrapper
│   │   ├── sqs.service.ts    # SQS operations wrapper
│   │   └── db.service.ts     # Database query helpers
│   └── middleware/
│       ├── errorHandler.ts   # Global error handling
│       └── validation.ts     # Request validation
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## Database Schema

The API expects the following PostgreSQL tables (see `../../scripts/init-db.sql`):

- `markets` - Geographic markets (Seattle, Phoenix)
- `projects` - Development projects
- `contacts` - Builder/borrower contacts
- `loans` - Construction loans
- `documents` - Document metadata (files stored in S3)
- `tasks` - Task tracking
- `comments` - Comments on projects/tasks

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `connect_db` |
| `DB_USER` | Database user | `connect_user` |
| `DB_PASSWORD` | Database password | `connect_password` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS access key | `test` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `test` |
| `AWS_ENDPOINT_URL` | LocalStack endpoint | `http://localhost:4566` |
| `S3_BUCKET_NAME` | S3 bucket for documents | `connect-documents` |
| `S3_FORCE_PATH_STYLE` | Use path-style S3 URLs | `true` |
| `SQS_QUEUE_URL` | SQS queue for notifications | `http://localhost:4566/000000000000/connect-notifications` |

## Next Steps

After setting up the API:

1. **Implement authentication** (DP01-23) - Add JWT-based auth middleware
2. **Add comprehensive error handling** - Standardize API error responses
3. **Write unit tests** - Use Jest or Mocha for testing
4. **Add API documentation** - Use Swagger/OpenAPI spec
5. **Implement logging** - Use Winston or Pino for structured logs
6. **Add request validation** - Use Joi or Zod schemas
7. **Deploy to AWS** - Replace LocalStack with real AWS services

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env to a different value (e.g., 3001)
PORT=3001 npm run dev
```

**Cannot connect to PostgreSQL:**
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check connection details match docker-compose.yml
cat .env | grep DB_
```

**Cannot connect to LocalStack:**
```bash
# Verify LocalStack is running
docker ps | grep localstack

# Check LocalStack logs
docker logs localstack-main

# Test S3 connectivity
aws --endpoint-url=http://localhost:4566 s3 ls
```

**TypeScript compilation errors:**
```bash
# Clean build and reinstall
rm -rf node_modules dist
npm install
npm run build
```

## Related Documentation

- **Project Charter:** [../../Datapage Platform Program — Project Charter.txt](../../Datapage%20Platform%20Program%20—%20Project%20Charter.txt)
- **Product Requirements:** [../../PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md)
- **Technology Stack:** [../../TECHNOLOGY_STACK_DECISION.md](../../TECHNOLOGY_STACK_DECISION.md)
- **Database Schema:** [../../scripts/init-db.sql](../../scripts/init-db.sql)
- **LocalStack Setup:** [../../LOCAL_DEVELOPMENT_PLAN.md](../../LOCAL_DEVELOPMENT_PLAN.md)
- **Jira Epic:** [DP01-22 (Core API Development)](https://vividcg.atlassian.net/browse/DP01-22)

## License

UNLICENSED - Internal use only for Datapage Platform development.
