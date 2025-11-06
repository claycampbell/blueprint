# Connect 2.0 System Architecture

**Version:** 1.0.0
**Last Updated:** November 5, 2025
**Status:** Design Phase

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Application Layers](#application-layers)
4. [Infrastructure](#infrastructure)
5. [Security Architecture](#security-architecture)
6. [Scalability & Performance](#scalability--performance)
7. [Disaster Recovery](#disaster-recovery)

---

## Architecture Overview

### High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Web App    │  │  Mobile Web  │  │   iPad App   │            │
│  │  (React/Vue) │  │ (Responsive) │  │ (Inspections)│            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│         │                  │                  │                     │
└─────────┼──────────────────┼──────────────────┼─────────────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────────┐
│                         API GATEWAY                                  │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • Rate Limiting  • Authentication  • Request Routing         │   │
│  │ • API Versioning  • CORS  • Request/Response Logging         │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────────┐
│                     APPLICATION LAYER                                │
├──────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────┐ │
│  │   Lead &    │  │ Feasibility  │  │ Entitlement  │  │ Lending │ │
│  │   Project   │  │   Service    │  │   Service    │  │ Service │ │
│  │   Service   │  │              │  │              │  │         │ │
│  └─────────────┘  └──────────────┘  └──────────────┘  └─────────┘ │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────┐ │
│  │  Servicing  │  │   Document   │  │   Contact    │  │  Task   │ │
│  │   Service   │  │   Service    │  │   Service    │  │ Service │ │
│  └─────────────┘  └──────────────┘  └──────────────┘  └─────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────────┐
│                       INTEGRATION LAYER                              │
├──────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  BPO Legacy  │  │   DocuSign   │  │  Accounting  │              │
│  │  Integration │  │  Integration │  │  Integration │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Azure Doc   │  │     Email    │  │     SMS      │              │
│  │Intelligence  │  │   Service    │  │   Service    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└──────────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────────┐
│                         DATA LAYER                                   │
├──────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  PostgreSQL  │  │    Redis     │  │    Object    │              │
│  │  (Primary DB)│  │    (Cache)   │  │   Storage    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐                                 │
│  │  Message     │  │  Search      │                                 │
│  │  Queue       │  │ (Elasticsearch)│                                │
│  └──────────────┘  └──────────────┘                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Microservices/Modular Monolith**
   - Start with modular monolith for simpler deployment
   - Clear module boundaries to enable future service extraction
   - Shared database with logical separation

2. **API-First Design**
   - All functionality exposed via REST APIs
   - Internal modules communicate via APIs
   - External integrations use same API layer

3. **Event-Driven Where Appropriate**
   - Async processing for long-running tasks (document AI, email notifications)
   - Event bus for cross-module communication
   - Workflow state changes trigger events

4. **Cloud-Native**
   - Containerized applications (Docker)
   - Orchestrated with Kubernetes or similar
   - Stateless application servers (scale horizontally)
   - Managed cloud services for data layer

5. **Security by Design**
   - Authentication at API gateway
   - Authorization at application layer (RBAC)
   - Encryption in transit (TLS) and at rest
   - Audit logging for all data changes

---

## Technology Stack

### Decision Matrix

| Component | Option 1 | Option 2 | Option 3 | Recommendation |
|-----------|----------|----------|----------|----------------|
| **Cloud Provider** | Azure | AWS | GCP | TBD (Day 1-14) |
| **Backend Language** | Node.js/TypeScript | Python (FastAPI) | Go | Node.js (team familiarity) |
| **Backend Framework** | Express.js | Fastify | NestJS | Fastify (performance) |
| **Frontend Framework** | React | Vue | Svelte | React (ecosystem) |
| **Database** | PostgreSQL | MySQL | MongoDB | PostgreSQL (relational + JSONB) |
| **Cache** | Redis | Memcached | — | Redis (versatility) |
| **Object Storage** | S3 / Azure Blob | — | — | Cloud provider default |
| **Message Queue** | RabbitMQ | AWS SQS | Redis Streams | Cloud provider managed |
| **Search** | Elasticsearch | Algolia | Meilisearch | Elasticsearch (if needed) |

### Recommended Stack (Provisional)

**Backend:**
- **Language**: Node.js 20+ with TypeScript
- **Framework**: Fastify (performance, plugins)
- **ORM**: Prisma or TypeORM
- **Validation**: Zod or Joi
- **Testing**: Jest + Supertest

**Frontend:**
- **Framework**: React 18+
- **Build Tool**: Vite
- **State Management**: Zustand or React Query
- **UI Library**: Material-UI or Tailwind CSS + Headless UI
- **Forms**: React Hook Form
- **Testing**: Vitest + React Testing Library

**Database & Storage:**
- **Primary DB**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Object Storage**: AWS S3 / Azure Blob Storage
- **Search**: PostgreSQL Full-Text Search (start), Elasticsearch (if needed)

**Infrastructure:**
- **Containers**: Docker
- **Orchestration**: Kubernetes or AWS ECS/Fargate
- **CI/CD**: GitHub Actions
- **Monitoring**: Datadog or Application Insights
- **Logging**: ELK Stack or Cloud-native logging

**External Services:**
- **AI/ML**: Azure OpenAI, Azure Document Intelligence
- **Email**: SendGrid or AWS SES
- **SMS**: Twilio
- **E-Signature**: DocuSign API

---

## Application Layers

### 1. Presentation Layer

**Web Application (React SPA)**

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Table/
│   └── features/         # Feature-specific components
│       ├── projects/
│       ├── loans/
│       ├── contacts/
│       └── documents/
├── pages/                # Route-level components
│   ├── Dashboard/
│   ├── ProjectList/
│   ├── ProjectDetail/
│   ├── LoanList/
│   └── LoanDetail/
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── useProjects.ts
│   └── useLoans.ts
├── services/             # API clients
│   ├── api.ts
│   ├── projectsApi.ts
│   └── loansApi.ts
├── stores/               # State management
│   ├── authStore.ts
│   └── uiStore.ts
├── utils/                # Helper functions
│   ├── formatters.ts
│   └── validators.ts
├── types/                # TypeScript types
│   └── index.ts
└── App.tsx
```

**Key Features:**
- Responsive design (mobile-first)
- Optimistic UI updates
- Real-time updates (WebSocket or polling)
- Offline-capable (service workers for inspections)

### 2. API Gateway Layer

**Responsibilities:**
- Request routing
- Rate limiting
- Authentication (verify JWT)
- CORS handling
- Request/response logging
- API versioning (/v1/, /v2/)

**Technology Options:**
- Kong
- AWS API Gateway
- Nginx + custom middleware
- Built into application (Fastify plugins)

### 3. Application Layer

**Modular Monolith Structure:**

```
src/
├── modules/
│   ├── projects/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   └── routes.ts
│   ├── feasibility/
│   ├── entitlement/
│   ├── loans/
│   ├── servicing/
│   ├── contacts/
│   ├── documents/
│   └── tasks/
├── shared/
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rbac.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── asyncHandler.ts
│   │   └── pagination.ts
│   ├── database/
│   │   ├── connection.ts
│   │   └── migrations/
│   └── types/
│       └── index.ts
├── integrations/
│   ├── bpo/
│   ├── docusign/
│   ├── azureAI/
│   └── email/
├── app.ts
└── server.ts
```

**Service Layer Pattern:**

```typescript
// Example: ProjectService
class ProjectService {
  constructor(
    private projectRepo: ProjectRepository,
    private eventBus: EventBus
  ) {}

  async createProject(data: CreateProjectDTO): Promise<Project> {
    // Business logic
    const project = await this.projectRepo.create(data);

    // Emit event
    await this.eventBus.publish('project.created', project);

    return project;
  }

  async transitionStatus(
    projectId: string,
    toStatus: ProjectStatus,
    userId: string
  ): Promise<Project> {
    // Validate transition
    const project = await this.projectRepo.findById(projectId);
    if (!this.isValidTransition(project.status, toStatus)) {
      throw new InvalidTransitionError();
    }

    // Update status
    project.status = toStatus;
    await this.projectRepo.update(project);

    // Emit event
    await this.eventBus.publish('project.status_changed', {
      projectId,
      from: project.status,
      to: toStatus,
      changedBy: userId,
    });

    return project;
  }
}
```

### 4. Data Access Layer

**Repository Pattern:**

```typescript
// Example: ProjectRepository
class ProjectRepository {
  constructor(private db: Database) {}

  async findById(id: string): Promise<Project | null> {
    return this.db.projects.findUnique({
      where: { id },
      include: {
        submittedBy: true,
        assignedTo: true,
        feasibility: true,
      },
    });
  }

  async findAll(filters: ProjectFilters): Promise<PaginatedResult<Project>> {
    const { status, city, limit, offset } = filters;

    const [data, total] = await Promise.all([
      this.db.projects.findMany({
        where: {
          status,
          city,
          deletedAt: null,
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.db.projects.count({
        where: { status, city, deletedAt: null },
      }),
    ]);

    return {
      data,
      pagination: {
        total,
        limit,
        offset,
        hasNext: offset + limit < total,
      },
    };
  }

  async create(data: CreateProjectData): Promise<Project> {
    return this.db.projects.create({
      data,
    });
  }
}
```

### 5. Integration Layer

**Integration Adapters:**

```typescript
// Example: DocuSignAdapter
class DocuSignAdapter {
  constructor(private config: DocuSignConfig) {}

  async sendEnvelopeForSignature(params: {
    documents: File[];
    signers: Signer[];
  }): Promise<Envelope> {
    // Call DocuSign API
    const envelope = await this.docuSignClient.createEnvelope({
      ...params,
      status: 'sent',
    });

    return envelope;
  }

  async getEnvelopeStatus(envelopeId: string): Promise<EnvelopeStatus> {
    return this.docuSignClient.getEnvelope(envelopeId);
  }

  // Webhook handler
  handleWebhook(payload: DocuSignWebhookPayload): void {
    // Process webhook event
    if (payload.event === 'envelope-completed') {
      this.eventBus.publish('document.signed', {
        envelopeId: payload.data.envelopeId,
        completedAt: payload.data.completedDateTime,
      });
    }
  }
}
```

---

## Infrastructure

### Cloud Provider Options

#### Option 1: AWS

**Compute:**
- ECS Fargate (containerized apps without managing servers)
- Lambda (serverless functions for background tasks)

**Database & Storage:**
- RDS PostgreSQL (managed database)
- ElastiCache Redis (managed cache)
- S3 (object storage)

**Networking:**
- VPC (isolated network)
- ALB (load balancer)
- Route 53 (DNS)

**Monitoring:**
- CloudWatch (logs, metrics, alarms)
- X-Ray (distributed tracing)

**AI/ML:**
- Bedrock (AI models)
- Textract (document processing)

#### Option 2: Azure

**Compute:**
- Azure Container Apps or AKS (Kubernetes)
- Azure Functions (serverless)

**Database & Storage:**
- Azure Database for PostgreSQL
- Azure Cache for Redis
- Azure Blob Storage

**Networking:**
- Virtual Network
- Application Gateway
- Azure DNS

**Monitoring:**
- Application Insights
- Log Analytics

**AI/ML:**
- Azure OpenAI
- Azure Document Intelligence (Form Recognizer)

#### Option 3: GCP

**Compute:**
- Cloud Run (serverless containers)
- GKE (Kubernetes)
- Cloud Functions

**Database & Storage:**
- Cloud SQL (PostgreSQL)
- Memorystore (Redis)
- Cloud Storage

**AI/ML:**
- Vertex AI
- Document AI

### Container Architecture

**Docker Compose (Development):**

```yaml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/connect
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  web:
    build: ./frontend
    ports:
      - '5173:5173'
    environment:
      - VITE_API_URL=http://localhost:3000

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=connect

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  worker:
    build: ./backend
    command: npm run worker
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/connect
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
  redis_data:
```

**Kubernetes Deployment (Production):**

```yaml
# api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: connect-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: connect-api
  template:
    metadata:
      labels:
        app: connect-api
    spec:
      containers:
        - name: api
          image: connect-api:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: url
          resources:
            requests:
              memory: '512Mi'
              cpu: '500m'
            limits:
              memory: '1Gi'
              cpu: '1000m'
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: connect-api-service
spec:
  selector:
    app: connect-api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

---

## Security Architecture

### Authentication & Authorization

**OAuth 2.0 + JWT Flow:**

```
1. User Login:
   Client → POST /auth/token (username, password)
   Server → Validate credentials
   Server → Generate JWT access token + refresh token
   Server → Return tokens

2. API Request:
   Client → GET /projects (Authorization: Bearer {token})
   API Gateway → Verify JWT signature
   API Gateway → Check token expiration
   API Gateway → Forward request with user context
   Application → Check RBAC permissions
   Application → Return response

3. Token Refresh:
   Client → POST /auth/token (refresh_token)
   Server → Validate refresh token
   Server → Generate new access token
   Server → Return new access token
```

**JWT Payload:**

```json
{
  "sub": "user_abc123",
  "email": "jane@blueprint.com",
  "role": "acquisitions",
  "permissions": ["read:projects", "write:projects", "read:loans"],
  "iat": 1699200000,
  "exp": 1699203600
}
```

**RBAC Matrix:**

| Resource | Admin | Acquisitions | Design | Entitlement | Servicing | Agent | Builder |
|----------|-------|--------------|--------|-------------|-----------|-------|---------|
| Projects (Read) | ✓ | ✓ | ✓ | ✓ | ✓ | Own only | Own only |
| Projects (Write) | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Feasibility (Read) | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Feasibility (Write) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Loans (Read) | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | Own only |
| Loans (Write) | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| Draws (Request) | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ |
| Draws (Approve) | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |

### Data Security

**Encryption:**
- **In Transit**: TLS 1.3 for all connections
- **At Rest**: Database encryption, encrypted object storage
- **Secrets**: AWS Secrets Manager / Azure Key Vault

**PII Handling:**
- Minimize collection
- Encrypt sensitive fields (SSN, tax ID)
- Audit all access
- GDPR/CCPA compliance ready

**Database Security:**
- Connection pooling with least privilege
- No direct DB access from internet
- Private subnet for databases
- Automated backups encrypted

---

## Scalability & Performance

### Horizontal Scaling

**Stateless Application Servers:**
- Scale API instances based on CPU/memory/request rate
- Auto-scaling groups (3-10 instances)
- Load balancer distributes traffic

**Database Scaling:**
- Read replicas for read-heavy operations
- Connection pooling (PgBouncer)
- Vertical scaling for writes (start with db.r6g.xlarge)

**Caching Strategy:**

```
1. Application Cache (Redis):
   - User sessions (JWT verification results)
   - Frequently accessed data (projects, contacts)
   - API rate limit counters
   - TTL: 5-60 minutes

2. CDN Cache (CloudFront/Azure CDN):
   - Static assets (JS, CSS, images)
   - Document thumbnails
   - TTL: 24 hours

3. Database Query Cache:
   - PostgreSQL query plan cache
   - ORM query result cache (Prisma)
```

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p95) | < 200ms | Application Insights |
| API Response Time (p99) | < 500ms | Application Insights |
| Database Query Time (p95) | < 50ms | Database metrics |
| Page Load Time (FCP) | < 1.5s | Lighthouse |
| Time to Interactive (TTI) | < 3s | Lighthouse |
| Uptime (SLA) | 99.5% | Monitoring alerts |

### Optimization Strategies

**Backend:**
- Database indexing (see DATABASE_SCHEMA.md)
- Query optimization (N+1 prevention, JOINs)
- Connection pooling
- Async processing for heavy tasks

**Frontend:**
- Code splitting (route-based)
- Lazy loading components
- Image optimization (WebP, lazy load)
- Debounced search
- Virtual scrolling for long lists

---

## Disaster Recovery

### Backup Strategy

**Database Backups:**
- Automated daily snapshots (retained 30 days)
- Point-in-time recovery (PITR) enabled
- Cross-region replication (disaster recovery)

**Object Storage:**
- Versioning enabled
- Cross-region replication
- Lifecycle policies (archive after 1 year)

### Recovery Objectives

- **RPO (Recovery Point Objective)**: < 15 minutes
- **RTO (Recovery Time Objective)**: < 2 hours

### Disaster Recovery Plan

**Incident Response:**

1. **Detection**: Monitoring alerts trigger
2. **Assessment**: On-call engineer evaluates severity
3. **Communication**: Notify stakeholders, status page
4. **Mitigation**: Rollback, failover, or hotfix
5. **Recovery**: Restore service to normal
6. **Post-Mortem**: Document incident, prevent recurrence

**Failover Procedures:**

```
Primary Region Failure:
1. DNS failover to secondary region (Route 53 health checks)
2. Activate read replica as primary database
3. Route traffic to secondary application instances
4. Target: < 30 minutes to failover
```

### High Availability

**Multi-AZ Deployment:**
- Application servers in 3 availability zones
- Database with multi-AZ failover
- Load balancer health checks
- Auto-replace failed instances

**Health Checks:**
```
GET /health → 200 OK
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "uptime": 3600
}
```

---

## Appendix

### Technology Decision Criteria

**Backend Language/Framework:**
- Team expertise
- Ecosystem maturity
- Performance benchmarks
- Community support
- Hiring availability

**Cloud Provider:**
- Cost analysis (TCO)
- AI/ML service availability
- Team familiarity
- Existing infrastructure
- Support quality

### Future Considerations

**Multi-Tenancy (Days 180-360):**
- Tenant isolation (schema per tenant or row-level security)
- Tenant provisioning automation
- Usage metering and billing
- Tenant-specific customization

**Global Distribution:**
- Multi-region deployment
- CDN for static assets
- Regional databases with replication
- Latency-based routing
