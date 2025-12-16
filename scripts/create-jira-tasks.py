#!/usr/bin/env python3
"""
Bulk create Jira tasks for Connect 2.0 epics from epic breakdown guide.

Usage:
    python scripts/create-jira-tasks.py --email YOUR_EMAIL --api-token YOUR_API_TOKEN

Get API token: https://id.atlassian.com/manage-profile/security/api-tokens
"""

import argparse
import json
import sys
from typing import Dict, List
import requests
from requests.auth import HTTPBasicAuth

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"
PROJECT_KEY = "DP01"

# Task definitions from EPIC_TASKING_GUIDE.md
EPIC_TASKS = {
    "DP01-21": [
        {
            "summary": "Configure AWS Organizations and account structure",
            "description": """Setup AWS Organizations with Dev, Staging, and Prod accounts. Configure IAM roles, policies, and Service Control Policies (SCPs).

**Autonomy Level:** MEDIUM

**Claude Code Prompt:**
```
I need to configure AWS Organizations for Connect 2.0 with proper account structure.

Requirements:
- Dev, Staging, Prod accounts
- IAM roles and policies
- Service Control Policies (SCPs)
- Cost allocation tags

Create:
1. terraform/aws-organizations.tf
2. terraform/iam-roles.tf
3. docs/AWS_ACCOUNT_STRUCTURE.md
```

**Deliverables:**
- AWS Organizations setup
- IAM roles configured
- Documentation complete

**Validation:**
- [ ] All accounts created
- [ ] IAM roles tested
- [ ] SCPs applied
- [ ] Cost tracking enabled""",
            "timeEstimate": "2h",
            "labels": ["infrastructure", "aws", "iam"],
            "priority": "Major"
        },
        {
            "summary": "Setup IAM roles for CI/CD pipeline",
            "description": """Configure IAM roles for GitHub Actions with OIDC provider, role trust policies, and permission boundaries.

**Autonomy Level:** HIGH

**Deliverables:**
- GitHub Actions OIDC provider configured
- IAM roles for CI/CD
- Permission boundaries set

**Validation:**
- [ ] OIDC provider working
- [ ] GitHub Actions can assume roles
- [ ] Permissions follow least privilege""",
            "timeEstimate": "1h",
            "labels": ["infrastructure", "aws", "cicd"],
            "priority": "Major"
        },
        {
            "summary": "ECS cluster configuration",
            "description": """Configure ECS cluster with Fargate capacity providers, task execution roles, and CloudWatch logging.

**Autonomy Level:** MEDIUM

**Deliverables:**
- ECS cluster configured
- Fargate capacity providers
- CloudWatch logging integrated

**Validation:**
- [ ] Cluster operational
- [ ] Fargate tasks can run
- [ ] Logs appearing in CloudWatch""",
            "timeEstimate": "2h",
            "labels": ["infrastructure", "aws", "ecs"],
            "priority": "Major"
        },
        {
            "summary": "ECR repository setup",
            "description": """Setup ECR repositories with lifecycle policies, image scanning, and cross-account pull permissions.

**Autonomy Level:** HIGH

**Deliverables:**
- ECR repositories created
- Lifecycle policies configured
- Image scanning enabled

**Validation:**
- [ ] Repositories accessible
- [ ] Lifecycle policies working
- [ ] Image scanning active""",
            "timeEstimate": "1h",
            "labels": ["infrastructure", "aws", "ecr"],
            "priority": "Major"
        },
        {
            "summary": "RDS PostgreSQL instance setup",
            "description": """Configure RDS PostgreSQL with multi-AZ, parameter groups, security groups, and backup configuration.

**Autonomy Level:** LOW

**Deliverables:**
- RDS instance configured
- Multi-AZ setup
- Backups configured
- Security groups set

**Validation:**
- [ ] Database accessible
- [ ] Multi-AZ operational
- [ ] Backups tested
- [ ] Security validated""",
            "timeEstimate": "3h",
            "labels": ["infrastructure", "aws", "database"],
            "priority": "Major"
        },
        {
            "summary": "Database migrations framework",
            "description": """Setup database migration framework (Flyway or Liquibase) with initial schema, migration scripts structure, and CI/CD integration.

**Autonomy Level:** MEDIUM

**Claude Code Prompt:**
```
I need to set up a database migration framework for Connect 2.0 using PostgreSQL.

Requirements:
- Support for versioned schema changes
- Rollback capability
- Baseline from existing schema
- Integration with CI/CD pipeline
- Local development support with LocalStack

Create:
1. Migration tool configuration
2. Directory structure for migration scripts
3. Initial baseline migration
4. npm scripts for running migrations
5. Documentation for creating new migrations

Refer to:
- scripts/init-db.sql for current schema
- docker-compose.yml for local database setup
```

**Deliverables:**
- Migration framework configured
- Initial schema migrated
- CI/CD integration complete

**Validation:**
- [ ] Migrations run successfully
- [ ] Rollback tested
- [ ] CI/CD integration working""",
            "timeEstimate": "2h",
            "labels": ["infrastructure", "database", "migrations"],
            "priority": "Major"
        },
        {
            "summary": "VPC and subnet configuration",
            "description": """Configure VPC with public/private subnets, NAT gateways, and route tables.

**Autonomy Level:** LOW

**Deliverables:**
- VPC created
- Subnets configured
- NAT gateways setup
- Route tables configured

**Validation:**
- [ ] VPC operational
- [ ] Subnets accessible
- [ ] NAT working
- [ ] Routing correct""",
            "timeEstimate": "2h",
            "labels": ["infrastructure", "aws", "networking"],
            "priority": "Major"
        },
        {
            "summary": "Application Load Balancer setup",
            "description": """Setup Application Load Balancer with target groups, health checks, and SSL/TLS certificates.

**Autonomy Level:** MEDIUM

**Deliverables:**
- ALB configured
- Target groups created
- Health checks working
- SSL certificates installed

**Validation:**
- [ ] ALB routing traffic
- [ ] Health checks passing
- [ ] SSL working
- [ ] HTTPS enabled""",
            "timeEstimate": "2h",
            "labels": ["infrastructure", "aws", "networking"],
            "priority": "Major"
        },
        {
            "summary": "WAF and security groups",
            "description": """Configure AWS WAF with rate limiting rules, IP whitelisting, and security group ingress/egress rules.

**Autonomy Level:** MEDIUM

**Deliverables:**
- WAF configured
- Rate limiting active
- Security groups configured

**Validation:**
- [ ] WAF rules active
- [ ] Rate limiting working
- [ ] Security groups enforced""",
            "timeEstimate": "2h",
            "labels": ["infrastructure", "aws", "security"],
            "priority": "Major"
        },
        {
            "summary": "CloudWatch dashboards and alarms",
            "description": """Setup CloudWatch dashboards for application and database metrics with alert configurations.

**Autonomy Level:** HIGH

**Deliverables:**
- CloudWatch dashboards created
- Application metrics configured
- Database metrics configured
- Alarms configured

**Validation:**
- [ ] Dashboards displaying data
- [ ] Metrics collecting
- [ ] Alarms trigger correctly""",
            "timeEstimate": "2h",
            "labels": ["infrastructure", "aws", "monitoring"],
            "priority": "Major"
        },
        {
            "summary": "Logging aggregation setup",
            "description": """Configure CloudWatch Logs with log retention policies and query interfaces.

**Autonomy Level:** HIGH

**Deliverables:**
- CloudWatch Logs configured
- Retention policies set
- Query interface accessible

**Validation:**
- [ ] Logs aggregating
- [ ] Retention working
- [ ] Queries functional""",
            "timeEstimate": "1h",
            "labels": ["infrastructure", "aws", "logging"],
            "priority": "Major"
        }
    ],
    "DP01-22": [
        {
            "summary": "Express.js API server scaffolding",
            "description": """Create Express.js server with route organization, error handling, request validation, and OpenAPI documentation.

**Autonomy Level:** HIGH

**Claude Code Prompt:**
```
I need to scaffold an Express.js API server for Connect 2.0.

Requirements:
- TypeScript
- Route organization by resource
- Error handling middleware
- Request validation (Zod)
- OpenAPI/Swagger documentation
- CORS configuration
- Helmet.js for security

Create:
1. src/server.ts
2. src/routes/index.ts
3. src/middleware/errorHandler.ts
4. src/middleware/validateRequest.ts
5. src/utils/swagger.ts
6. docs/api/openapi.yaml

Reference: examples/nodejs-api/ for structure
```

**Deliverables:**
- API server running
- Routes organized
- Error handling working
- Swagger docs available

**Validation:**
- [ ] Server starts successfully
- [ ] Health check endpoint works
- [ ] Error handling tested
- [ ] Swagger UI accessible""",
            "timeEstimate": "2h",
            "labels": ["backend", "api", "nodejs"],
            "priority": "Major"
        },
        {
            "summary": "Database connection pooling",
            "description": """Setup PostgreSQL client with connection pool configuration and health check endpoint.

**Autonomy Level:** HIGH

**Deliverables:**
- PostgreSQL client configured
- Connection pool setup
- Health check endpoint

**Validation:**
- [ ] Database connections working
- [ ] Pool configuration optimal
- [ ] Health checks passing""",
            "timeEstimate": "1h",
            "labels": ["backend", "database", "nodejs"],
            "priority": "Major"
        },
        {
            "summary": "Projects CRUD endpoints",
            "description": """Implement CRUD endpoints for Projects entity with validation and error handling.

**Autonomy Level:** MEDIUM

**Claude Code Prompt:**
```
I need to implement CRUD endpoints for the Projects entity in Connect 2.0.

Requirements from PRD:
- RESTful API design
- PostgreSQL database (schema in scripts/init-db.sql)
- Express.js + TypeScript
- Request validation
- Error handling
- OpenAPI documentation

Create:
1. src/routes/projects.ts
2. src/controllers/projectsController.ts
3. src/services/projectsService.ts
4. src/validators/projectsValidator.ts
5. tests/projects.test.ts

Reference:
- PRD Section 6.1 (API Design)
- Database schema: scripts/init-db.sql
```

**Deliverables:**
- POST /api/projects
- GET /api/projects/:id
- PUT /api/projects/:id
- DELETE /api/projects/:id (soft delete)
- GET /api/projects (list)

**Validation:**
- [ ] All endpoints working
- [ ] Validation in place
- [ ] Tests passing""",
            "timeEstimate": "4h",
            "labels": ["backend", "api", "projects"],
            "priority": "Major"
        },
        {
            "summary": "Projects search and filtering",
            "description": """Implement search and filtering for projects with query parameters, pagination, and sorting.

**Autonomy Level:** HIGH

**Deliverables:**
- Query parameters (status, location, date range)
- Pagination support
- Sorting options

**Validation:**
- [ ] Search working
- [ ] Filters functional
- [ ] Pagination correct
- [ ] Sorting accurate""",
            "timeEstimate": "2h",
            "labels": ["backend", "api", "search"],
            "priority": "Major"
        },
        {
            "summary": "Projects validation rules",
            "description": """Implement validation rules for project data including required fields, business rules, and custom validators.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Required field validation
- Business rule validation
- Custom validators

**Validation:**
- [ ] All rules enforced
- [ ] Error messages clear
- [ ] Tests comprehensive""",
            "timeEstimate": "2h",
            "labels": ["backend", "validation"],
            "priority": "Major"
        },
        {
            "summary": "Contacts CRUD endpoints",
            "description": """Implement CRUD endpoints for Contacts entity with support for contact types and relationships.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Contact CRUD endpoints
- Contact types (builder, agent, borrower)
- Contact relationships

**Validation:**
- [ ] All endpoints working
- [ ] Types supported
- [ ] Relationships functional""",
            "timeEstimate": "3h",
            "labels": ["backend", "api", "contacts"],
            "priority": "Major"
        },
        {
            "summary": "Contact deduplication logic",
            "description": """Implement fuzzy matching for contact deduplication with merge suggestions and conflict resolution.

**Autonomy Level:** LOW

**Deliverables:**
- Fuzzy matching on name/email
- Merge suggestions
- Conflict resolution UI

**Validation:**
- [ ] Duplicates detected
- [ ] Merge working
- [ ] Conflicts resolved""",
            "timeEstimate": "3h",
            "labels": ["backend", "contacts", "deduplication"],
            "priority": "Major"
        },
        {
            "summary": "Document metadata endpoints",
            "description": """Implement document metadata CRUD endpoints.

**Autonomy Level:** MEDIUM

**Deliverables:**
- POST /api/documents
- GET /api/documents/:id
- PUT /api/documents/:id
- DELETE /api/documents/:id

**Validation:**
- [ ] Endpoints working
- [ ] Metadata correct
- [ ] Tests passing""",
            "timeEstimate": "2h",
            "labels": ["backend", "api", "documents"],
            "priority": "Major"
        },
        {
            "summary": "S3 presigned URL generation",
            "description": """Implement S3 presigned URL generation for upload and download with expiration policies.

**Autonomy Level:** HIGH

**Deliverables:**
- Upload presigned URLs
- Download presigned URLs
- Expiration policies

**Validation:**
- [ ] Upload URLs working
- [ ] Download URLs working
- [ ] Expiration correct""",
            "timeEstimate": "2h",
            "labels": ["backend", "aws", "s3"],
            "priority": "Major"
        },
        {
            "summary": "Document categorization",
            "description": """Implement document categorization with types, tagging system, and full-text search preparation.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Document types (survey, title, arborist, plans)
- Tagging system
- Search preparation

**Validation:**
- [ ] Categorization working
- [ ] Tags functional
- [ ] Search ready""",
            "timeEstimate": "2h",
            "labels": ["backend", "documents"],
            "priority": "Major"
        },
        {
            "summary": "API integration tests",
            "description": """Create comprehensive integration tests for API endpoints including happy path, error handling, and edge cases.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Test fixtures
- Happy path tests
- Error handling tests
- Edge case tests

**Validation:**
- [ ] All tests passing
- [ ] Coverage ≥80%
- [ ] Edge cases covered""",
            "timeEstimate": "4h",
            "labels": ["backend", "testing"],
            "priority": "Major"
        },
        {
            "summary": "OpenAPI specification",
            "description": """Create complete OpenAPI/Swagger specification with request/response schemas and example payloads.

**Autonomy Level:** HIGH

**Deliverables:**
- Complete API documentation
- Request/response schemas
- Example payloads
- Swagger UI

**Validation:**
- [ ] Documentation complete
- [ ] Schemas accurate
- [ ] Examples working
- [ ] UI accessible""",
            "timeEstimate": "2h",
            "labels": ["backend", "documentation"],
            "priority": "Major"
        }
    ],
    "DP01-23": [
        {
            "summary": "User authentication research & decision",
            "description": """Research and compare Auth0 vs AWS Cognito vs custom authentication solution.

**Autonomy Level:** LOW

**Deliverables:**
- Cost analysis
- Integration complexity assessment
- Recommendation document

**Validation:**
- [ ] All options evaluated
- [ ] Recommendation justified
- [ ] Team consensus""",
            "timeEstimate": "1h",
            "labels": ["backend", "auth", "research"],
            "priority": "Major"
        },
        {
            "summary": "User registration and login",
            "description": """Implement user registration and login endpoints with password hashing and JWT tokens.

**Autonomy Level:** MEDIUM

**Claude Code Prompt:**
```
I need to implement user registration and login endpoints for Connect 2.0.

Requirements:
- Express.js + TypeScript
- PostgreSQL (users table in scripts/init-db.sql)
- bcrypt for password hashing
- JWT for token generation
- Input validation
- Rate limiting for security

Create:
1. routes/auth.ts
2. controllers/authController.ts
3. services/authService.ts
4. utils/jwtUtils.ts
5. middleware/rateLimiter.ts
6. tests/auth.test.ts

Security requirements:
- Password minimum 8 characters
- Hash passwords with bcrypt (cost factor 12)
- JWT expires in 24 hours
- Rate limit: 5 login attempts per 15 minutes per IP
```

**Deliverables:**
- POST /api/auth/register
- POST /api/auth/login
- Password hashing (bcrypt)
- JWT token generation

**Validation:**
- [ ] Registration working
- [ ] Login working
- [ ] Passwords hashed
- [ ] JWTs generated""",
            "timeEstimate": "4h",
            "labels": ["backend", "auth"],
            "priority": "Major"
        },
        {
            "summary": "JWT middleware",
            "description": """Implement JWT token validation, refresh, and revocation checking middleware.

**Autonomy Level:** HIGH

**Deliverables:**
- Token validation middleware
- Token refresh endpoint
- Revocation checking

**Validation:**
- [ ] Validation working
- [ ] Refresh functional
- [ ] Revocation checked""",
            "timeEstimate": "2h",
            "labels": ["backend", "auth", "middleware"],
            "priority": "Major"
        },
        {
            "summary": "Password reset flow",
            "description": """Implement password reset with email sending (SES) and reset token validation.

**Autonomy Level:** MEDIUM

**Deliverables:**
- POST /api/auth/forgot-password
- Email sending (SES)
- Reset token validation
- POST /api/auth/reset-password

**Validation:**
- [ ] Forgot password working
- [ ] Email sent
- [ ] Reset validated
- [ ] Password reset working""",
            "timeEstimate": "3h",
            "labels": ["backend", "auth", "email"],
            "priority": "Major"
        },
        {
            "summary": "RBAC database schema",
            "description": """Design and implement RBAC schema with Users, Roles, Permissions tables and inheritance.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Users, Roles, Permissions tables
- Role assignments
- Permission inheritance

**Validation:**
- [ ] Schema created
- [ ] Assignments working
- [ ] Inheritance functional""",
            "timeEstimate": "2h",
            "labels": ["backend", "auth", "database"],
            "priority": "Major"
        },
        {
            "summary": "RBAC middleware",
            "description": """Implement RBAC middleware with requireRole() and requirePermission() functions.

**Autonomy Level:** MEDIUM

**Deliverables:**
- requireRole() middleware
- requirePermission() middleware
- Resource ownership checks

**Validation:**
- [ ] Role checks working
- [ ] Permission checks working
- [ ] Ownership validated""",
            "timeEstimate": "3h",
            "labels": ["backend", "auth", "middleware"],
            "priority": "Major"
        },
        {
            "summary": "Predefined roles setup",
            "description": """Setup predefined roles for Admin, Acquisitions Lead, Servicing Team, Feasibility Associate, Read-Only.

**Autonomy Level:** HIGH

**Deliverables:**
- Admin role
- Acquisitions Lead role
- Servicing Team role
- Feasibility Associate role
- Read-Only (External) role

**Validation:**
- [ ] All roles created
- [ ] Permissions assigned
- [ ] Roles functional""",
            "timeEstimate": "2h",
            "labels": ["backend", "auth", "rbac"],
            "priority": "Major"
        },
        {
            "summary": "Redis session store",
            "description": """Setup Redis for session storage with serialization and TTL configuration.

**Autonomy Level:** HIGH

**Deliverables:**
- Redis connection
- Session serialization
- TTL configuration

**Validation:**
- [ ] Redis connected
- [ ] Sessions stored
- [ ] TTL working""",
            "timeEstimate": "2h",
            "labels": ["backend", "redis", "sessions"],
            "priority": "Major"
        },
        {
            "summary": "Multi-device session management",
            "description": """Implement multi-device session management with active sessions list and revocation.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Active sessions list
- Session revocation
- Concurrent session limits

**Validation:**
- [ ] Sessions listed
- [ ] Revocation working
- [ ] Limits enforced""",
            "timeEstimate": "2h",
            "labels": ["backend", "sessions"],
            "priority": "Major"
        },
        {
            "summary": "Rate limiting",
            "description": """Implement rate limiting for login attempts, API requests, and IP-based limits.

**Autonomy Level:** HIGH

**Deliverables:**
- Login attempt limits
- API rate limits per user
- IP-based rate limits

**Validation:**
- [ ] Login limits working
- [ ] API limits enforced
- [ ] IP limits active""",
            "timeEstimate": "1h",
            "labels": ["backend", "security"],
            "priority": "Major"
        },
        {
            "summary": "Security headers middleware",
            "description": """Setup Helmet.js for security headers, CORS configuration, and CSP policies.

**Autonomy Level:** HIGH

**Deliverables:**
- Helmet.js setup
- CORS configuration
- CSP policies

**Validation:**
- [ ] Headers set
- [ ] CORS working
- [ ] CSP enforced""",
            "timeEstimate": "1h",
            "labels": ["backend", "security"],
            "priority": "Major"
        },
        {
            "summary": "Audit logging",
            "description": """Implement audit logging for authentication events, authorization failures, and sensitive data access.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Authentication events logged
- Authorization failures logged
- Sensitive data access logged

**Validation:**
- [ ] Events captured
- [ ] Failures logged
- [ ] Access tracked""",
            "timeEstimate": "2h",
            "labels": ["backend", "security", "logging"],
            "priority": "Major"
        },
        {
            "summary": "Authentication tests",
            "description": """Create comprehensive authentication tests including registration, login, permissions, and security.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Registration tests
- Login/logout tests
- Permission tests
- Security tests

**Validation:**
- [ ] All tests passing
- [ ] Coverage ≥80%
- [ ] Security validated""",
            "timeEstimate": "3h",
            "labels": ["backend", "testing", "auth"],
            "priority": "Major"
        }
    ],
    "DP01-30": [
        {
            "summary": "Task schema design",
            "description": """Design task schema with task types, statuses, workflow, and assignment fields.

**Autonomy Level:** LOW

**Deliverables:**
- Tasks table design
- Task types (feasibility, entitlement, servicing)
- Task statuses and workflow
- Assignment and ownership fields

**Validation:**
- [ ] Schema complete
- [ ] Types defined
- [ ] Workflow mapped
- [ ] Team approved""",
            "timeEstimate": "2h",
            "labels": ["backend", "database", "tasks"],
            "priority": "Major"
        },
        {
            "summary": "Task database migrations",
            "description": """Create database migrations for tasks table with indexes and foreign key constraints.

**Autonomy Level:** HIGH

**Deliverables:**
- Create tables migration
- Indexes for performance
- Foreign key constraints

**Validation:**
- [ ] Migration runs
- [ ] Indexes created
- [ ] Constraints enforced""",
            "timeEstimate": "1h",
            "labels": ["backend", "database", "migrations"],
            "priority": "Major"
        },
        {
            "summary": "Task CRUD endpoints",
            "description": """Implement CRUD endpoints for task management with filtering capabilities.

**Autonomy Level:** MEDIUM

**Deliverables:**
- POST /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- GET /api/tasks (with filters)

**Validation:**
- [ ] All endpoints working
- [ ] Filters functional
- [ ] Tests passing""",
            "timeEstimate": "4h",
            "labels": ["backend", "api", "tasks"],
            "priority": "Major"
        },
        {
            "summary": "Task assignment logic",
            "description": """Implement task assignment to users/teams with auto-assignment rules and reassignment.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Assign to user
- Assign to team
- Auto-assignment rules
- Reassignment capability

**Validation:**
- [ ] Assignment working
- [ ] Auto-assignment functional
- [ ] Reassignment successful""",
            "timeEstimate": "2h",
            "labels": ["backend", "tasks", "workflow"],
            "priority": "Major"
        },
        {
            "summary": "Task status transitions",
            "description": """Implement task workflow status transitions with validation and notifications.

**Autonomy Level:** MEDIUM

**Claude Code Prompt:**
```
I need to implement task workflow status transitions for Connect 2.0.

Requirements:
- Tasks progress through: TODO → IN_PROGRESS → VALIDATION → DONE
- Only certain transitions allowed
- Permissions: Only assignee or admin can transition
- Notifications sent on status change
- Audit log of transitions

Task statuses:
- TODO, READY, IN_PROGRESS, BLOCKED, VALIDATION, DONE

Create:
1. services/taskWorkflowService.ts
2. validators/taskTransitionValidator.ts
3. middleware/taskPermissions.ts
4. events/taskStatusChanged.ts
5. tests/taskWorkflow.test.ts

Validation rules:
- TODO → READY, IN_PROGRESS
- READY → IN_PROGRESS, TODO
- IN_PROGRESS → BLOCKED, VALIDATION, TODO
- BLOCKED → IN_PROGRESS
- VALIDATION → DONE, IN_PROGRESS
- DONE → (terminal state)
```

**Deliverables:**
- Status validation rules
- Workflow state machine
- Transition permissions
- Status change notifications

**Validation:**
- [ ] Transitions validated
- [ ] State machine working
- [ ] Permissions enforced
- [ ] Notifications sent""",
            "timeEstimate": "3h",
            "labels": ["backend", "tasks", "workflow"],
            "priority": "Major"
        },
        {
            "summary": "Task dependencies",
            "description": """Implement task dependencies with blocking relationships and circular dependency detection.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Blocking relationships
- Dependency resolution
- Circular dependency detection

**Validation:**
- [ ] Dependencies working
- [ ] Resolution correct
- [ ] Circular deps detected""",
            "timeEstimate": "3h",
            "labels": ["backend", "tasks"],
            "priority": "Major"
        },
        {
            "summary": "Task template system",
            "description": """Create task template system with CRUD, instantiation, and predefined templates.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Template CRUD endpoints
- Template instantiation
- Variable substitution
- Predefined templates (feasibility checklist, entitlement milestones)

**Validation:**
- [ ] CRUD working
- [ ] Instantiation functional
- [ ] Variables substituted
- [ ] Templates available""",
            "timeEstimate": "3h",
            "labels": ["backend", "tasks", "templates"],
            "priority": "Major"
        },
        {
            "summary": "Workflow automation",
            "description": """Implement trigger-based task creation for workflow automation.

**Autonomy Level:** LOW

**Deliverables:**
- Trigger-based task creation
- Example: Loan funded → Create servicing tasks
- Example: Feasibility complete → Create entitlement tasks

**Validation:**
- [ ] Triggers configured
- [ ] Tasks auto-created
- [ ] Examples working""",
            "timeEstimate": "4h",
            "labels": ["backend", "automation", "workflow"],
            "priority": "Major"
        },
        {
            "summary": "My Tasks endpoint",
            "description": """Create personalized task endpoint with filtering and sorting.

**Autonomy Level:** HIGH

**Deliverables:**
- GET /api/tasks/assigned-to-me
- Filtering (due date, priority, status)
- Sorting options

**Validation:**
- [ ] Endpoint working
- [ ] Filters functional
- [ ] Sorting correct""",
            "timeEstimate": "2h",
            "labels": ["backend", "api", "tasks"],
            "priority": "Major"
        },
        {
            "summary": "Team task dashboard",
            "description": """Create team task dashboard with workload distribution and overdue tasks.

**Autonomy Level:** HIGH

**Deliverables:**
- GET /api/tasks/team/:teamId
- Workload distribution
- Overdue tasks view

**Validation:**
- [ ] Dashboard working
- [ ] Workload calculated
- [ ] Overdue detected""",
            "timeEstimate": "2h",
            "labels": ["backend", "api", "dashboard"],
            "priority": "Major"
        },
        {
            "summary": "Task management tests",
            "description": """Create comprehensive tests for task management including CRUD, workflow, templates, and automation.

**Autonomy Level:** MEDIUM

**Deliverables:**
- CRUD tests
- Workflow tests
- Template tests
- Automation tests

**Validation:**
- [ ] All tests passing
- [ ] Coverage ≥80%
- [ ] Edge cases covered""",
            "timeEstimate": "4h",
            "labels": ["backend", "testing", "tasks"],
            "priority": "Major"
        }
    ],
    "DP01-35": [
        {
            "summary": "Feasibility schema design",
            "description": """Design feasibility database schema with records, checklist items, findings, and timeline tracking.

**Autonomy Level:** LOW

**Deliverables:**
- Feasibility records table
- Due diligence checklist items
- Findings and notes
- Timeline tracking fields

**Validation:**
- [ ] Schema complete
- [ ] Fields defined
- [ ] Relationships mapped
- [ ] Team approved""",
            "timeEstimate": "3h",
            "labels": ["backend", "database", "feasibility"],
            "priority": "Major"
        },
        {
            "summary": "Feasibility database migrations",
            "description": """Create database migrations for feasibility module.

**Autonomy Level:** HIGH

**Deliverables:**
- Migration scripts

**Validation:**
- [ ] Migrations run
- [ ] Tables created
- [ ] Data integrity maintained""",
            "timeEstimate": "1h",
            "labels": ["backend", "database", "migrations"],
            "priority": "Major"
        },
        {
            "summary": "Checklist CRUD endpoints",
            "description": """Implement CRUD endpoints for due diligence checklist with completion tracking.

**Autonomy Level:** MEDIUM

**Deliverables:**
- GET /api/projects/:id/feasibility/checklist
- PUT /api/projects/:id/feasibility/checklist/:itemId
- Checklist completion tracking

**Validation:**
- [ ] Endpoints working
- [ ] Completion tracked
- [ ] Tests passing""",
            "timeEstimate": "3h",
            "labels": ["backend", "api", "feasibility"],
            "priority": "Major"
        },
        {
            "summary": "Checklist templates",
            "description": """Create checklist template system with standard and custom checklists per project type.

**Autonomy Level:** HIGH

**Deliverables:**
- Standard feasibility checklist
- Custom checklist per project type
- Checklist versioning

**Validation:**
- [ ] Templates created
- [ ] Customization working
- [ ] Versioning functional""",
            "timeEstimate": "2h",
            "labels": ["backend", "feasibility", "templates"],
            "priority": "Major"
        },
        {
            "summary": "Feasibility document upload",
            "description": """Implement document upload for feasibility with categorization and S3 integration.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Document categorization (survey, title, arborist, etc.)
- S3 integration
- Document metadata extraction

**Validation:**
- [ ] Upload working
- [ ] Categories assigned
- [ ] S3 integrated
- [ ] Metadata extracted""",
            "timeEstimate": "3h",
            "labels": ["backend", "documents", "s3"],
            "priority": "Major"
        },
        {
            "summary": "Document AI extraction",
            "description": """Implement AI-powered document extraction using AWS Textract.

**Autonomy Level:** LOW

**Claude Code Prompt:**
```
I need to implement AI-powered document extraction for feasibility documents.

Requirements:
- Use AWS Textract for OCR and data extraction
- Extract structured data from:
  - Surveys (lot dimensions, easements, encroachments)
  - Title reports (liens, encumbrances, legal description)
  - Arborist reports (tree restrictions, removal requirements)
- Store extracted data in database
- Flag critical findings for manual review

Create:
1. services/documentAIService.ts
2. parsers/surveyParser.ts
3. parsers/titleReportParser.ts
4. parsers/arboristReportParser.ts
5. utils/textractClient.ts
6. tests/documentAI.test.ts

AWS Textract features to use:
- DetectDocumentText for general OCR
- AnalyzeDocument with FORMS and TABLES features
- Custom entity extraction with regex patterns

Reference:
- PRD Section 5 (Feasibility Module)
- PRD Section 10 (AI & Automation - Document Intelligence)
- LocalStack Textract emulation: docker-compose.yml
```

**Deliverables:**
- AWS Textract integration
- Extract key findings from surveys
- Extract zoning from title reports
- Extract tree restrictions from arborist reports

**Validation:**
- [ ] Textract integrated
- [ ] Survey extraction working
- [ ] Title extraction working
- [ ] Arborist extraction working""",
            "timeEstimate": "4h",
            "labels": ["backend", "ai", "textract"],
            "priority": "Major"
        },
        {
            "summary": "Findings entry interface",
            "description": """Create findings entry API with categories, critical issue flagging, and recommendations.

**Autonomy Level:** MEDIUM

**Deliverables:**
- POST /api/projects/:id/feasibility/findings
- Findings categories (zoning, environmental, title, etc.)
- Flag critical issues
- Recommendations field

**Validation:**
- [ ] Endpoint working
- [ ] Categories functional
- [ ] Flagging working
- [ ] Recommendations saved""",
            "timeEstimate": "3h",
            "labels": ["backend", "api", "feasibility"],
            "priority": "Major"
        },
        {
            "summary": "Risk scoring",
            "description": """Implement risk scoring algorithm with factors, thresholds, and automated alerts.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Risk calculation algorithm
- Risk factors (zoning, environmental, title clouds)
- Risk thresholds
- Automated alerts on high risk

**Validation:**
- [ ] Algorithm working
- [ ] Factors weighted
- [ ] Thresholds set
- [ ] Alerts triggering""",
            "timeEstimate": "3h",
            "labels": ["backend", "feasibility", "risk"],
            "priority": "Major"
        },
        {
            "summary": "Packet generation API",
            "description": """Create API for feasibility packet generation with document collection and PDF assembly.

**Autonomy Level:** LOW

**Deliverables:**
- POST /api/projects/:id/feasibility/generate-packet
- Collect all documents
- Generate summary report
- PDF assembly
- Email packet to stakeholders

**Validation:**
- [ ] Packet generated
- [ ] Documents collected
- [ ] Summary created
- [ ] PDF assembled
- [ ] Email sent""",
            "timeEstimate": "4h",
            "labels": ["backend", "feasibility", "pdf"],
            "priority": "Major"
        },
        {
            "summary": "Packet templates",
            "description": """Create packet template system with standard structure, custom branding, and variable fields.

**Autonomy Level:** HIGH

**Deliverables:**
- Standard packet structure
- Custom branding
- Variable fields

**Validation:**
- [ ] Templates created
- [ ] Branding applied
- [ ] Variables working""",
            "timeEstimate": "2h",
            "labels": ["backend", "templates"],
            "priority": "Major"
        },
        {
            "summary": "Feasibility status tracking",
            "description": """Implement feasibility status tracking with timeline and milestone notifications.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Status: Not Started, In Progress, Complete, Waived
- Timeline tracking (start date, target date, completion date)
- Milestone notifications

**Validation:**
- [ ] Status tracked
- [ ] Timeline accurate
- [ ] Notifications sent""",
            "timeEstimate": "2h",
            "labels": ["backend", "workflow", "feasibility"],
            "priority": "Major"
        },
        {
            "summary": "BPO integration",
            "description": """Implement BPO integration to pull project data and push feasibility status.

**Autonomy Level:** MEDIUM

**Deliverables:**
- API to pull project data from BPO
- Push feasibility status back to BPO
- Real-time sync

**Validation:**
- [ ] Data pulled from BPO
- [ ] Status pushed to BPO
- [ ] Sync working""",
            "timeEstimate": "3h",
            "labels": ["backend", "integration", "bpo"],
            "priority": "Major"
        },
        {
            "summary": "Feasibility module tests",
            "description": """Create comprehensive tests for feasibility module.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Checklist tests
- Document upload tests
- Packet generation tests
- Integration tests

**Validation:**
- [ ] All tests passing
- [ ] Coverage ≥80%
- [ ] Edge cases covered""",
            "timeEstimate": "4h",
            "labels": ["backend", "testing", "feasibility"],
            "priority": "Major"
        }
    ],
    "DP01-40": [
        {
            "summary": "Test pipeline (.github/workflows/test.yml)",
            "description": """Setup GitHub Actions CI pipeline for automated testing.

**Autonomy Level:** MEDIUM

**Claude Code Prompt:**
```
I need to set up a GitHub Actions CI pipeline for automated testing.

Requirements:
- Trigger on: pull request, push to main
- Run in parallel: linting, unit tests, integration tests
- Generate code coverage report
- Post coverage to PR comments
- Fail if coverage < 80%
- Cache dependencies for speed

Tech stack:
- Node.js 18
- TypeScript
- Jest for testing
- ESLint for linting
- PostgreSQL for integration tests (use docker service)

Create:
1. .github/workflows/test.yml
2. .github/workflows/coverage-comment.yml
3. jest.config.js
4. .eslintrc.js

Pipeline steps:
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (with caching)
4. Run ESLint
5. Start PostgreSQL service
6. Run migrations
7. Run unit tests
8. Run integration tests
9. Generate coverage report
10. Upload coverage artifact
11. Comment coverage on PR

Reference:
- Existing tests: examples/nodejs-api/tests/
- Database: scripts/init-db.sql
- Similar workflow: .github/workflows/claude-md-sync-check.yml
```

**Deliverables:**
- Trigger on PR and push to main
- Run linter
- Run unit tests
- Run integration tests
- Code coverage reporting

**Validation:**
- [ ] Pipeline runs on PR
- [ ] All tests pass
- [ ] Coverage reported
- [ ] Linting enforced""",
            "timeEstimate": "2h",
            "labels": ["devops", "ci", "github-actions"],
            "priority": "Major"
        },
        {
            "summary": "Build pipeline (.github/workflows/build.yml)",
            "description": """Setup Docker image build pipeline with tagging and ECR push.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Docker image build
- Tag with commit SHA and version
- Push to ECR
- Build artifacts

**Validation:**
- [ ] Images built
- [ ] Tagging correct
- [ ] ECR push working
- [ ] Artifacts stored""",
            "timeEstimate": "2h",
            "labels": ["devops", "ci", "docker"],
            "priority": "Major"
        },
        {
            "summary": "Deploy to dev environment",
            "description": """Setup automated deployment to dev environment.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Automated deployment on merge to develop
- ECS task definition update
- Database migrations
- Smoke tests

**Validation:**
- [ ] Deployment automated
- [ ] ECS updated
- [ ] Migrations run
- [ ] Smoke tests pass""",
            "timeEstimate": "3h",
            "labels": ["devops", "cd", "deployment"],
            "priority": "Major"
        },
        {
            "summary": "Deploy to staging",
            "description": """Setup deployment to staging with manual approval and blue/green deployment.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Manual approval required
- Blue/green deployment
- Integration tests
- Rollback capability

**Validation:**
- [ ] Approval gate working
- [ ] Blue/green functional
- [ ] Integration tests pass
- [ ] Rollback tested""",
            "timeEstimate": "3h",
            "labels": ["devops", "cd", "staging"],
            "priority": "Major"
        },
        {
            "summary": "Deploy to production",
            "description": """Setup production deployment with canary deployment and automated rollback.

**Autonomy Level:** LOW

**Deliverables:**
- Manual approval + change ticket
- Canary deployment (10% → 50% → 100%)
- Automated rollback on errors
- Health checks

**Validation:**
- [ ] Approval enforced
- [ ] Canary working
- [ ] Rollback functional
- [ ] Health checks passing""",
            "timeEstimate": "4h",
            "labels": ["devops", "cd", "production"],
            "priority": "Major"
        },
        {
            "summary": "Terraform for AWS infrastructure",
            "description": """Create Terraform configurations for all AWS infrastructure.

**Autonomy Level:** LOW

**Deliverables:**
- VPC, subnets, security groups
- RDS, ECS, ALB configurations
- S3 buckets, CloudFront distributions
- IAM roles and policies

**Validation:**
- [ ] All infrastructure defined
- [ ] Terraform plan validates
- [ ] Infrastructure deployable
- [ ] State managed""",
            "timeEstimate": "1d",
            "labels": ["devops", "terraform", "infrastructure"],
            "priority": "Major"
        },
        {
            "summary": "Environment parity enforcement",
            "description": """Ensure dev/staging/prod environments have parity with drift detection.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Dev/Staging/Prod configurations
- Environment-specific variables
- Drift detection

**Validation:**
- [ ] Configurations consistent
- [ ] Variables managed
- [ ] Drift detected""",
            "timeEstimate": "2h",
            "labels": ["devops", "infrastructure"],
            "priority": "Major"
        },
        {
            "summary": "Unit test coverage enforcement",
            "description": """Enforce minimum 80% unit test coverage in CI.

**Autonomy Level:** HIGH

**Deliverables:**
- Minimum 80% coverage
- Coverage reports in PRs
- Fail CI if coverage drops

**Validation:**
- [ ] Coverage enforced
- [ ] Reports in PRs
- [ ] CI fails on drop""",
            "timeEstimate": "1h",
            "labels": ["devops", "testing", "quality"],
            "priority": "Major"
        },
        {
            "summary": "E2E test suite",
            "description": """Setup end-to-end test suite using Playwright or Cypress.

**Autonomy Level:** MEDIUM

**Deliverables:**
- Playwright or Cypress setup
- Critical path tests
- Run on staging before prod deploy

**Validation:**
- [ ] Suite setup
- [ ] Critical paths covered
- [ ] Runs on staging""",
            "timeEstimate": "1d",
            "labels": ["devops", "testing", "e2e"],
            "priority": "Major"
        },
        {
            "summary": "Application monitoring setup",
            "description": """Setup CloudWatch application monitoring with custom metrics and dashboards.

**Autonomy Level:** MEDIUM

**Deliverables:**
- CloudWatch metrics
- Custom application metrics
- Dashboard creation

**Validation:**
- [ ] Metrics collecting
- [ ] Custom metrics working
- [ ] Dashboards functional""",
            "timeEstimate": "3h",
            "labels": ["devops", "monitoring", "cloudwatch"],
            "priority": "Major"
        },
        {
            "summary": "Alerting configuration",
            "description": """Configure CloudWatch alerts for errors, performance degradation, and security.

**Autonomy Level:** MEDIUM

**Deliverables:**
- High error rate alerts
- Performance degradation alerts
- Security alerts
- SNS notification setup

**Validation:**
- [ ] Error alerts working
- [ ] Performance alerts working
- [ ] Security alerts working
- [ ] SNS configured""",
            "timeEstimate": "2h",
            "labels": ["devops", "monitoring", "alerts"],
            "priority": "Major"
        },
        {
            "summary": "Log aggregation",
            "description": """Setup CloudWatch Logs with query interface and retention policies.

**Autonomy Level:** HIGH

**Deliverables:**
- CloudWatch Logs
- Log query setup
- Log retention policies

**Validation:**
- [ ] Logs aggregating
- [ ] Queries working
- [ ] Retention enforced""",
            "timeEstimate": "2h",
            "labels": ["devops", "logging", "cloudwatch"],
            "priority": "Major"
        },
        {
            "summary": "Security scanning in CI",
            "description": """Integrate security scanning in CI pipeline.

**Autonomy Level:** HIGH

**Deliverables:**
- npm audit
- Snyk or Dependabot
- SAST scanning
- Container image scanning

**Validation:**
- [ ] npm audit running
- [ ] Snyk/Dependabot active
- [ ] SAST scanning
- [ ] Image scanning working""",
            "timeEstimate": "2h",
            "labels": ["devops", "security", "scanning"],
            "priority": "Major"
        },
        {
            "summary": "Secrets management",
            "description": """Implement AWS Secrets Manager integration with automatic rotation.

**Autonomy Level:** MEDIUM

**Deliverables:**
- AWS Secrets Manager integration
- Rotate secrets automatically
- No secrets in code/logs

**Validation:**
- [ ] Secrets in Secrets Manager
- [ ] Rotation working
- [ ] No secrets exposed""",
            "timeEstimate": "2h",
            "labels": ["devops", "security", "secrets"],
            "priority": "Major"
        }
    ]
}


def create_jira_task(auth: HTTPBasicAuth, epic_key: str, task: Dict) -> Dict:
    """Create a single Jira task under the specified epic."""

    payload = {
        "fields": {
            "project": {
                "key": PROJECT_KEY
            },
            "summary": task["summary"],
            "description": {
                "type": "doc",
                "version": 1,
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {
                                "type": "text",
                                "text": task["description"]
                            }
                        ]
                    }
                ]
            },
            "issuetype": {
                "name": "Task"
            },
            "parent": {
                "key": epic_key
            },
            "labels": task.get("labels", []),
            "priority": {
                "name": task.get("priority", "Major")
            }
        }
    }

    # Add time estimate if provided
    if "timeEstimate" in task:
        payload["fields"]["timetracking"] = {
            "originalEstimate": task["timeEstimate"]
        }

    response = requests.post(
        f"{JIRA_API_URL}/issue",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        result = response.json()
        print(f"[OK] Created {result['key']}: {task['summary']}")
        return result
    else:
        print(f"[ERROR] Failed to create task: {task['summary']}")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        return None


def main():
    parser = argparse.ArgumentParser(description="Bulk create Jira tasks for Connect 2.0 epics")
    parser.add_argument("--email", required=True, help="Your Atlassian account email")
    parser.add_argument("--api-token", required=True, help="Your Atlassian API token")
    parser.add_argument("--epic", help="Specific epic to create tasks for (e.g., DP01-21)")
    parser.add_argument("--dry-run", action="store_true", help="Print tasks without creating them")

    args = parser.parse_args()

    auth = HTTPBasicAuth(args.email, args.api_token)

    # Verify authentication
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        print(f"   Get API token: https://id.atlassian.com/manage-profile/security/api-tokens")
        sys.exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']} ({user_info['emailAddress']})")
    print()

    # Determine which epics to process
    epics_to_process = [args.epic] if args.epic else EPIC_TASKS.keys()

    total_created = 0
    total_failed = 0

    for epic_key in epics_to_process:
        if epic_key not in EPIC_TASKS:
            print(f"[WARN] Unknown epic: {epic_key}")
            continue

        tasks = EPIC_TASKS[epic_key]
        print(f"[EPIC] {epic_key}: {len(tasks)} tasks")
        print()

        if args.dry_run:
            for task in tasks:
                print(f"   - {task['summary']}")
            print()
            continue

        for task in tasks:
            result = create_jira_task(auth, epic_key, task)
            if result:
                total_created += 1
            else:
                total_failed += 1

        print()

    if args.dry_run:
        print(f"[DRY-RUN] Complete - no tasks created")
    else:
        print(f"[SUMMARY] Created {total_created} tasks")
        if total_failed > 0:
            print(f"[SUMMARY] Failed to create {total_failed} tasks")


if __name__ == "__main__":
    main()
