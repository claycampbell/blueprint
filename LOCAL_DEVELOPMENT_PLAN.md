# Connect 2.0 - Local Development Plan with LocalStack
**Version 1.0 | December 12, 2025**

---

## Executive Summary

This document provides a comprehensive plan for setting up local development environments using **LocalStack** to simulate AWS services. This approach enables developers to:

- **Develop and test offline** without AWS connectivity
- **Reduce AWS costs** during development (save ~$3-5K/month in dev environments)
- **Speed up development cycles** with instant local deployments
- **Maintain parity** between local, staging, and production environments
- **Enable CI/CD testing** without AWS dependencies

**Key Technologies:**
- **LocalStack**: AWS service emulation (S3, RDS, SQS, SNS, Secrets Manager, etc.)
- **Docker Compose**: Container orchestration for local environment
- **Kubernetes (Minikube/Kind)**: Local Kubernetes for EKS simulation
- **PostgreSQL**: Local database matching RDS configuration
- **Localstack Pro** (optional): Enhanced features for Bedrock, Textract simulation

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [LocalStack Service Mapping](#2-localstack-service-mapping)
3. [Development Environment Setup](#3-development-environment-setup)
4. [Docker Compose Configuration](#4-docker-compose-configuration)
5. [Database Setup (PostgreSQL)](#5-database-setup-postgresql)
6. [AWS Service Configuration](#6-aws-service-configuration)
7. [Application Configuration](#7-application-configuration)
8. [Testing Strategy](#8-testing-strategy)
9. [CI/CD Integration](#9-cicd-integration)
10. [Developer Workflow](#10-developer-workflow)
11. [Troubleshooting Guide](#11-troubleshooting-guide)
12. [Cost Comparison](#12-cost-comparison)

---

## 1. Architecture Overview

### 1.1 Local Development Stack

```
┌────────────────────────────────────────────────────────────────┐
│                   LOCAL DEVELOPMENT MACHINE                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Docker Compose Environment                   │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │  │
│  │  │  LocalStack │  │ PostgreSQL  │  │   Redis     │      │  │
│  │  │  (AWS Mock) │  │   (RDS)     │  │ (ElastiCache)│     │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │  │
│  │        │                  │                 │            │  │
│  │  ┌─────────────────────────────────────────────┐         │  │
│  │  │         Application Containers              │         │  │
│  │  ├─────────────────────────────────────────────┤         │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │         │  │
│  │  │  │ Web/API  │  │ Workers  │  │  Queue   │  │         │  │
│  │  │  │ (Node.js)│  │ (Python) │  │Processor │  │         │  │
│  │  │  └──────────┘  └──────────┘  └──────────┘  │         │  │
│  │  └─────────────────────────────────────────────┘         │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Development Tools                      │  │
│  │  • VS Code with DevContainers                            │  │
│  │  • AWS CLI configured for LocalStack                     │  │
│  │  • Postman/Insomnia for API testing                      │  │
│  │  • pgAdmin for database management                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 1.2 LocalStack vs Real AWS Comparison

| Component | Production (AWS) | Local Development (LocalStack) |
|-----------|------------------|-------------------------------|
| **Object Storage** | S3 | LocalStack S3 (file-based) |
| **Database** | RDS PostgreSQL | PostgreSQL Docker container |
| **Cache** | ElastiCache Redis | Redis Docker container |
| **Message Queue** | SQS/SNS | LocalStack SQS/SNS |
| **Secrets** | Secrets Manager | LocalStack Secrets Manager |
| **Auth** | Cognito | LocalStack Cognito or mock JWT |
| **AI Services** | Bedrock + Textract | Mock services or LocalStack Pro |
| **Monitoring** | CloudWatch | Local logs + optional OpenTelemetry |
| **Container Orchestration** | EKS (Kubernetes) | Minikube or Kind (local Kubernetes) |

---

## 2. LocalStack Service Mapping

### 2.1 Core AWS Services (Free LocalStack)

LocalStack Community Edition supports these AWS services out of the box:

| AWS Service | LocalStack Support | Connect 2.0 Use Case |
|-------------|-------------------|---------------------|
| **S3** | ✅ Full | Document storage (plans, reports, images) |
| **SQS** | ✅ Full | Message queue for async tasks |
| **SNS** | ✅ Full | Pub/sub notifications |
| **Lambda** | ✅ Full | Background processing (optional) |
| **DynamoDB** | ✅ Full | Not used (we use PostgreSQL) |
| **CloudWatch Logs** | ✅ Full | Application logging |
| **Secrets Manager** | ✅ Full | API keys, database credentials |
| **IAM** | ✅ Basic | Access control policies |
| **API Gateway** | ✅ Full | REST API endpoints (if used) |
| **EventBridge** | ✅ Basic | Event-driven workflows |

### 2.2 Advanced Services (LocalStack Pro - Optional)

LocalStack Pro ($50/dev/month) adds:

| AWS Service | LocalStack Pro | Connect 2.0 Use Case |
|-------------|----------------|---------------------|
| **EKS** | ✅ Full | Kubernetes cluster simulation |
| **RDS** | ✅ Proxy | PostgreSQL connection (use native Docker instead) |
| **Cognito** | ✅ Full | User authentication |
| **Textract** | ⚠️ Mock | Document extraction (use mock responses) |
| **Bedrock** | ⚠️ Mock | LLM/AI services (use OpenAI API directly in dev) |
| **CloudFront** | ✅ Full | CDN simulation |

**Recommendation for MVP:** Start with **LocalStack Community (free)** + native PostgreSQL Docker. Evaluate LocalStack Pro only if EKS/Cognito simulation becomes critical.

### 2.3 Services NOT Using LocalStack

These services run natively in Docker:

| Service | Local Solution | Reason |
|---------|---------------|--------|
| **PostgreSQL** | Official PostgreSQL Docker image | Better performance than LocalStack RDS proxy |
| **Redis** | Official Redis Docker image | Simpler than ElastiCache simulation |
| **AI Services (Textract/Bedrock)** | Mock API responses or OpenAI API | LocalStack AI mocking is limited; use real OpenAI API with dev keys |

---

## 3. Development Environment Setup

### 3.1 Prerequisites

Install the following on your development machine:

```bash
# Required
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
  Version: 20.10+
  Download: https://www.docker.com/products/docker-desktop

- Docker Compose
  Version: 2.0+
  Included with Docker Desktop

- Node.js (if using Node.js backend)
  Version: 18.x LTS or 20.x
  Download: https://nodejs.org/

- Python (if using Python backend)
  Version: 3.11+
  Download: https://www.python.org/

- Git
  Version: 2.30+
  Download: https://git-scm.com/

# Recommended
- VS Code
  Extensions:
    - Docker
    - Remote - Containers
    - AWS Toolkit
    - PostgreSQL (by Chris Kolkman)
    - REST Client or Thunder Client

- AWS CLI v2
  Download: https://aws.amazon.com/cli/
  Purpose: Interact with LocalStack using AWS CLI commands

- Postman or Insomnia
  Purpose: API testing and development

- pgAdmin or DBeaver
  Purpose: Database management and queries
```

### 3.2 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **RAM** | 8 GB | 16 GB+ |
| **CPU** | 4 cores | 8 cores+ |
| **Disk Space** | 20 GB free | 50 GB+ free |
| **OS** | Windows 10+, macOS 11+, Ubuntu 20.04+ | Latest stable OS |

**Note:** LocalStack + PostgreSQL + Redis + Application containers will consume ~4-6GB RAM at idle.

---

## 4. Docker Compose Configuration

### 4.1 Complete docker-compose.yml

Create `docker-compose.yml` in your project root:

```yaml
version: '3.8'

services:
  # LocalStack - AWS Service Emulation
  localstack:
    container_name: connect2-localstack
    image: localstack/localstack:latest
    ports:
      - "4566:4566"            # LocalStack Gateway (all services)
      - "4510-4559:4510-4559"  # External services port range
    environment:
      - SERVICES=s3,sqs,sns,secretsmanager,iam,cloudwatch,logs,events
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
      - DOCKER_HOST=unix:///var/run/docker.sock
      - LOCALSTACK_API_KEY=${LOCALSTACK_API_KEY:-}  # Only if using Pro
    volumes:
      - "./localstack-data:/tmp/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
      - "./scripts/localstack-init.sh:/etc/localstack/init/ready.d/init.sh"
    networks:
      - connect2-network

  # PostgreSQL - Primary Database
  postgres:
    container_name: connect2-postgres
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=connect2_dev
      - POSTGRES_USER=connect_user
      - POSTGRES_PASSWORD=connect_dev_password
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U connect_user -d connect2_dev"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - connect2-network

  # Redis - Cache Layer
  redis:
    container_name: connect2-redis
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - connect2-network

  # Application Backend (Node.js example - adjust as needed)
  api:
    container_name: connect2-api
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://connect_user:connect_dev_password@postgres:5432/connect2_dev
      - REDIS_URL=redis://redis:6379
      - AWS_ENDPOINT_URL=http://localstack:4566
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
      - AWS_REGION=us-west-2
      - S3_BUCKET_NAME=connect2-documents-dev
      - LOG_LEVEL=debug
    volumes:
      - ./backend:/app
      - /app/node_modules  # Prevent overwriting node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      localstack:
        condition: service_started
    networks:
      - connect2-network
    command: npm run dev

  # Background Worker (Optional - for async tasks)
  worker:
    container_name: connect2-worker
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://connect_user:connect_dev_password@postgres:5432/connect2_dev
      - REDIS_URL=redis://redis:6379
      - AWS_ENDPOINT_URL=http://localstack:4566
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
      - AWS_REGION=us-west-2
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      localstack:
        condition: service_started
    networks:
      - connect2-network
    command: npm run worker

  # Frontend (React example - optional for full-stack dev)
  frontend:
    container_name: connect2-frontend
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    environment:
      - REACT_APP_API_URL=http://localhost:3000/api
      - NODE_ENV=development
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - connect2-network
    command: npm start

  # pgAdmin - Database Management UI (Optional)
  pgadmin:
    container_name: connect2-pgadmin
    image: dpage/pgadmin4:latest
    ports:
      - "5050:80"
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@connect2.local
      - PGADMIN_DEFAULT_PASSWORD=admin
    volumes:
      - pgadmin-data:/var/lib/pgadmin
    networks:
      - connect2-network
    profiles:
      - tools  # Only start with: docker-compose --profile tools up

volumes:
  postgres-data:
  redis-data:
  pgadmin-data:

networks:
  connect2-network:
    driver: bridge
```

### 4.2 LocalStack Initialization Script

Create `scripts/localstack-init.sh` to set up AWS resources on startup:

```bash
#!/bin/bash

echo "Initializing LocalStack AWS resources..."

# Wait for LocalStack to be ready
awslocal s3 ls || true

# Create S3 buckets
echo "Creating S3 buckets..."
awslocal s3 mb s3://connect2-documents-dev
awslocal s3 mb s3://connect2-documents-dev-archive

# Create SQS queues
echo "Creating SQS queues..."
awslocal sqs create-queue --queue-name connect2-document-processing
awslocal sqs create-queue --queue-name connect2-notifications
awslocal sqs create-queue --queue-name connect2-document-processing-dlq

# Create SNS topics
echo "Creating SNS topics..."
awslocal sns create-topic --name connect2-project-events
awslocal sns create-topic --name connect2-loan-events

# Create Secrets Manager secrets
echo "Creating secrets..."
awslocal secretsmanager create-secret \
  --name connect2/dev/database \
  --secret-string '{"username":"connect_user","password":"connect_dev_password","host":"postgres","port":5432,"database":"connect2_dev"}'

awslocal secretsmanager create-secret \
  --name connect2/dev/openai \
  --secret-string '{"api_key":"sk-test-key-for-local-dev"}'

# Set up CloudWatch Log Groups
echo "Creating CloudWatch Log Groups..."
awslocal logs create-log-group --log-group-name /connect2/api
awslocal logs create-log-group --log-group-name /connect2/worker

echo "LocalStack initialization complete!"
```

Make it executable:
```bash
chmod +x scripts/localstack-init.sh
```

### 4.3 Database Initialization Script

Create `scripts/init-db.sql` to set up database schema on first run:

```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search

-- Create schemas
CREATE SCHEMA IF NOT EXISTS connect2;

-- Set search path
SET search_path TO connect2, public;

-- Example: Create initial tables (adjust based on your data model)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(2),
    zip VARCHAR(10),
    status VARCHAR(50) DEFAULT 'LEAD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_number VARCHAR(50) UNIQUE NOT NULL,
    project_id UUID REFERENCES projects(id),
    status VARCHAR(50) DEFAULT 'PENDING',
    loan_amount DECIMAL(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_city ON projects(city);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_project_id ON loans(project_id);

-- Insert seed data for local development
INSERT INTO projects (address, city, state, zip, status) VALUES
    ('123 Main St', 'Seattle', 'WA', '98101', 'LEAD'),
    ('456 Oak Ave', 'Phoenix', 'AZ', '85001', 'FEASIBILITY'),
    ('789 Pine Rd', 'Seattle', 'WA', '98102', 'GO')
ON CONFLICT DO NOTHING;

-- Create read-only user for reporting (optional)
CREATE USER connect_readonly WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE connect2_dev TO connect_readonly;
GRANT USAGE ON SCHEMA connect2 TO connect_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA connect2 TO connect_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA connect2 GRANT SELECT ON TABLES TO connect_readonly;

COMMIT;
```

---

## 5. Database Setup (PostgreSQL)

### 5.1 Connection Configuration

**Local Development Connection String:**
```
postgresql://connect_user:connect_dev_password@localhost:5432/connect2_dev
```

**From within Docker network:**
```
postgresql://connect_user:connect_dev_password@postgres:5432/connect2_dev
```

### 5.2 Database Management Tools

#### Option 1: pgAdmin (Web UI)
```bash
# Start pgAdmin
docker-compose --profile tools up -d pgadmin

# Access at: http://localhost:5050
# Email: admin@connect2.local
# Password: admin

# Add server connection:
#   Host: postgres
#   Port: 5432
#   Database: connect2_dev
#   Username: connect_user
#   Password: connect_dev_password
```

#### Option 2: psql (Command Line)
```bash
# Connect to PostgreSQL container
docker exec -it connect2-postgres psql -U connect_user -d connect2_dev

# Common commands:
\dt                    # List all tables
\d table_name          # Describe table schema
\l                     # List all databases
\dn                    # List all schemas
SELECT * FROM projects LIMIT 10;
```

#### Option 3: VS Code Extension
Install "PostgreSQL" extension by Chris Kolkman:
- Host: localhost
- Port: 5432
- Database: connect2_dev
- Username: connect_user
- Password: connect_dev_password

### 5.3 Database Migration Strategy

Use a migration tool to manage schema changes:

**Option A: Node.js - Knex.js**
```bash
npm install knex pg

# Create migration
npx knex migrate:make add_contacts_table

# Run migrations
npx knex migrate:latest

# Rollback
npx knex migrate:rollback
```

**Option B: Python - Alembic**
```bash
pip install alembic psycopg2-binary

# Initialize
alembic init alembic

# Create migration
alembic revision -m "add contacts table"

# Run migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## 6. AWS Service Configuration

### 6.1 AWS CLI Configuration for LocalStack

Install `awslocal` wrapper (recommended):

```bash
# Install awslocal
pip install awscli-local

# Or use aws CLI with --endpoint-url flag
```

**Using awslocal (recommended):**
```bash
# List S3 buckets
awslocal s3 ls

# Upload file to S3
awslocal s3 cp ./test-file.pdf s3://connect2-documents-dev/

# List SQS queues
awslocal sqs list-queues

# Send message to queue
awslocal sqs send-message \
  --queue-url http://localhost:4566/000000000000/connect2-document-processing \
  --message-body "Test message"

# Get secret
awslocal secretsmanager get-secret-value --secret-id connect2/dev/database
```

**Using standard aws CLI:**
```bash
# Configure endpoint
export AWS_ENDPOINT_URL=http://localhost:4566
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_REGION=us-west-2

# Use standard commands
aws s3 ls
aws sqs list-queues
```

### 6.2 Application SDK Configuration

#### Node.js - AWS SDK v3
```javascript
// config/aws.js
import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

const awsConfig = {
  region: process.env.AWS_REGION || 'us-west-2',
  endpoint: process.env.AWS_ENDPOINT_URL || undefined,
  credentials: process.env.AWS_ENDPOINT_URL ? {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  } : undefined,
  forcePathStyle: true,  // Required for LocalStack S3
};

export const s3Client = new S3Client(awsConfig);
export const sqsClient = new SQSClient(awsConfig);
export const secretsClient = new SecretsManagerClient(awsConfig);
```

#### Python - Boto3
```python
# config/aws.py
import os
import boto3

def get_aws_client(service_name):
    """Get AWS client configured for LocalStack or real AWS"""
    endpoint_url = os.getenv('AWS_ENDPOINT_URL')

    config = {
        'region_name': os.getenv('AWS_REGION', 'us-west-2'),
    }

    if endpoint_url:
        config['endpoint_url'] = endpoint_url
        config['aws_access_key_id'] = 'test'
        config['aws_secret_access_key'] = 'test'

    return boto3.client(service_name, **config)

# Usage
s3 = get_aws_client('s3')
sqs = get_aws_client('sqs')
secrets = get_aws_client('secretsmanager')
```

### 6.3 S3 Document Storage Example

```javascript
// services/documentService.js
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from '../config/aws.js';

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'connect2-documents-dev';

export async function uploadDocument(fileBuffer, fileName, metadata = {}) {
  const key = `documents/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    Metadata: metadata,
    ContentType: metadata.contentType || 'application/pdf',
  });

  await s3Client.send(command);

  return {
    bucket: BUCKET_NAME,
    key: key,
    url: `s3://${BUCKET_NAME}/${key}`,
  };
}

export async function getDocumentSignedUrl(key, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}
```

### 6.4 SQS Queue Processing Example

```javascript
// services/queueService.js
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from '../config/aws.js';

const QUEUE_URL = process.env.DOCUMENT_QUEUE_URL ||
  'http://localhost:4566/000000000000/connect2-document-processing';

export async function sendToQueue(messageBody) {
  const command = new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(messageBody),
  });

  const result = await sqsClient.send(command);
  return result.MessageId;
}

export async function processQueue(handler) {
  while (true) {
    const command = new ReceiveMessageCommand({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,  // Long polling
    });

    const result = await sqsClient.send(command);

    if (!result.Messages || result.Messages.length === 0) {
      continue;
    }

    for (const message of result.Messages) {
      try {
        const body = JSON.parse(message.Body);
        await handler(body);

        // Delete message after successful processing
        await sqsClient.send(new DeleteMessageCommand({
          QueueUrl: QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle,
        }));
      } catch (error) {
        console.error('Error processing message:', error);
        // Message will be redelivered after visibility timeout
      }
    }
  }
}
```

---

## 7. Application Configuration

### 7.1 Environment Variables

Create `.env.local` for local development:

```bash
# Application
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://connect_user:connect_dev_password@localhost:5432/connect2_dev
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PREFIX=connect2:

# AWS LocalStack
AWS_ENDPOINT_URL=http://localhost:4566
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
S3_BUCKET_NAME=connect2-documents-dev
DOCUMENT_QUEUE_URL=http://localhost:4566/000000000000/connect2-document-processing

# Authentication (mock for local dev)
JWT_SECRET=local-dev-secret-change-in-production
JWT_EXPIRATION=7d

# External Services (use sandbox/test accounts)
OPENAI_API_KEY=sk-test-your-dev-key
SENDGRID_API_KEY=SG.test-key
TWILIO_ACCOUNT_SID=test-sid
TWILIO_AUTH_TOKEN=test-token

# Feature Flags
ENABLE_AI_FEATURES=false
ENABLE_EMAIL_NOTIFICATIONS=false
ENABLE_SMS_NOTIFICATIONS=false
```

### 7.2 Configuration Management

**config/index.js** (Node.js example):

```javascript
import dotenv from 'dotenv';

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.local';
dotenv.config({ path: envFile });

export default {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,

  database: {
    url: process.env.DATABASE_URL,
    poolMin: parseInt(process.env.DATABASE_POOL_MIN, 10) || 2,
    poolMax: parseInt(process.env.DATABASE_POOL_MAX, 10) || 10,
  },

  redis: {
    url: process.env.REDIS_URL,
    prefix: process.env.REDIS_PREFIX || 'connect2:',
  },

  aws: {
    endpointUrl: process.env.AWS_ENDPOINT_URL,
    region: process.env.AWS_REGION || 'us-west-2',
    s3BucketName: process.env.S3_BUCKET_NAME,
    documentQueueUrl: process.env.DOCUMENT_QUEUE_URL,
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  },

  features: {
    aiEnabled: process.env.ENABLE_AI_FEATURES === 'true',
    emailEnabled: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
    smsEnabled: process.env.ENABLE_SMS_NOTIFICATIONS === 'true',
  },

  isProduction: () => process.env.NODE_ENV === 'production',
  isLocal: () => !!process.env.AWS_ENDPOINT_URL,
};
```

---

## 8. Testing Strategy

### 8.1 Unit Tests with LocalStack

```javascript
// tests/services/documentService.test.js
import { describe, it, beforeAll, afterAll } from 'vitest';
import { uploadDocument, getDocumentSignedUrl } from '../../src/services/documentService.js';

describe('Document Service', () => {
  beforeAll(async () => {
    // Ensure LocalStack is running
    // Create test bucket if needed
  });

  it('should upload document to S3', async () => {
    const buffer = Buffer.from('test document content');
    const result = await uploadDocument(buffer, 'test.pdf', {
      contentType: 'application/pdf',
    });

    expect(result.bucket).toBe('connect2-documents-dev');
    expect(result.key).toContain('test.pdf');
  });

  it('should generate signed URL for document', async () => {
    const url = await getDocumentSignedUrl('documents/test.pdf');
    expect(url).toContain('localhost:4566');
    expect(url).toContain('X-Amz-Signature');
  });
});
```

### 8.2 Integration Tests

```javascript
// tests/integration/project-workflow.test.js
import { describe, it, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { resetDatabase } from '../helpers/db.js';

describe('Project Workflow Integration', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('should complete full project lifecycle', async () => {
    // 1. Create project
    const createResponse = await request(app)
      .post('/api/v1/projects')
      .send({
        address: '123 Test St',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
      })
      .expect(201);

    const projectId = createResponse.body.id;

    // 2. Upload document
    const uploadResponse = await request(app)
      .post(`/api/v1/projects/${projectId}/documents`)
      .attach('file', Buffer.from('test'), 'survey.pdf')
      .expect(201);

    // 3. Transition to feasibility
    await request(app)
      .post(`/api/v1/projects/${projectId}/transition`)
      .send({ status: 'FEASIBILITY' })
      .expect(200);

    // 4. Verify document stored in S3
    expect(uploadResponse.body.storageUrl).toContain('s3://');

    // 5. Verify project status
    const getResponse = await request(app)
      .get(`/api/v1/projects/${projectId}`)
      .expect(200);

    expect(getResponse.body.status).toBe('FEASIBILITY');
  });
});
```

---

## 9. CI/CD Integration

### 9.1 GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Test with LocalStack

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: connect2_test
          POSTGRES_USER: connect_user
          POSTGRES_PASSWORD: connect_test_password
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 3s
          --health-retries 5

      localstack:
        image: localstack/localstack:latest
        env:
          SERVICES: s3,sqs,sns,secretsmanager
          DEBUG: 1
        ports:
          - 4566:4566

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Initialize LocalStack resources
        run: |
          npm install -g awslocal
          chmod +x ./scripts/localstack-init.sh
          ./scripts/localstack-init.sh

      - name: Run database migrations
        env:
          DATABASE_URL: postgresql://connect_user:connect_test_password@localhost:5432/connect2_test
        run: npm run migrate

      - name: Run tests
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://connect_user:connect_test_password@localhost:5432/connect2_test
          REDIS_URL: redis://localhost:6379
          AWS_ENDPOINT_URL: http://localhost:4566
          AWS_ACCESS_KEY_ID: test
          AWS_SECRET_ACCESS_KEY: test
          AWS_REGION: us-west-2
        run: npm test

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        if: always()
```

---

## 10. Developer Workflow

### 10.1 Daily Development Cycle

**Morning Setup (5 minutes):**
```bash
# 1. Start all services
cd /path/to/connect2
docker-compose up -d

# 2. Verify services are running
docker-compose ps

# 3. Check logs if needed
docker-compose logs -f api

# 4. Verify LocalStack resources
awslocal s3 ls
awslocal sqs list-queues
```

**Active Development:**
```bash
# API development - hot reload enabled
# Edit files in ./backend
# API container automatically restarts

# Test API endpoint
curl http://localhost:3000/api/v1/health

# View logs in real-time
docker-compose logs -f api worker

# Run tests
docker-compose exec api npm test

# Database operations
docker-compose exec postgres psql -U connect_user -d connect2_dev
```

**End of Day:**
```bash
# Stop services (keeps data)
docker-compose stop

# Or remove everything (clean slate next time)
docker-compose down
docker-compose down -v  # Also removes volumes (database data)
```

### 10.2 Common Development Tasks

#### Task 1: Reset Database
```bash
# Stop services
docker-compose down

# Remove database volume
docker volume rm blueprint_postgres-data

# Restart (will re-initialize database)
docker-compose up -d
```

#### Task 2: Clear LocalStack Data
```bash
# Remove LocalStack data directory
rm -rf ./localstack-data

# Restart LocalStack
docker-compose restart localstack

# Re-run initialization
docker-compose exec localstack /etc/localstack/init/ready.d/init.sh
```

#### Task 3: Add New Migration
```bash
# Generate migration file
docker-compose exec api npm run migrate:make add_contacts_table

# Edit migration file in ./backend/migrations

# Run migration
docker-compose exec api npm run migrate:latest

# Rollback if needed
docker-compose exec api npm run migrate:rollback
```

#### Task 4: Test S3 Upload
```bash
# Upload test file
awslocal s3 cp ./test-files/sample.pdf s3://connect2-documents-dev/test/

# List files
awslocal s3 ls s3://connect2-documents-dev/test/

# Download file
awslocal s3 cp s3://connect2-documents-dev/test/sample.pdf ./downloaded.pdf

# View in browser (LocalStack serves S3 via HTTP)
open http://localhost:4566/connect2-documents-dev/test/sample.pdf
```

#### Task 5: Debug Queue Processing
```bash
# Send test message
awslocal sqs send-message \
  --queue-url http://localhost:4566/000000000000/connect2-document-processing \
  --message-body '{"documentId":"test-123","action":"extract"}'

# View worker logs
docker-compose logs -f worker

# Check queue depth
awslocal sqs get-queue-attributes \
  --queue-url http://localhost:4566/000000000000/connect2-document-processing \
  --attribute-names ApproximateNumberOfMessages
```

### 10.3 VS Code DevContainer (Optional)

Create `.devcontainer/devcontainer.json` for consistent dev environment:

```json
{
  "name": "Connect 2.0 Development",
  "dockerComposeFile": "../docker-compose.yml",
  "service": "api",
  "workspaceFolder": "/app",

  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-azuretools.vscode-docker",
        "ckolkman.vscode-postgres",
        "amazonwebservices.aws-toolkit-vscode"
      ],
      "settings": {
        "terminal.integrated.defaultProfile.linux": "bash"
      }
    }
  },

  "forwardPorts": [3000, 3001, 4566, 5432, 6379],
  "postCreateCommand": "npm install",
  "remoteUser": "node"
}
```

---

## 11. Troubleshooting Guide

### 11.1 Common Issues

#### Issue 1: LocalStack not starting

**Symptoms:**
- `docker-compose up` hangs on localstack service
- Port 4566 not responding

**Solutions:**
```bash
# Check Docker daemon is running
docker ps

# Check port conflicts
lsof -i :4566  # Mac/Linux
netstat -ano | findstr :4566  # Windows

# View LocalStack logs
docker-compose logs localstack

# Try pulling latest image
docker pull localstack/localstack:latest
docker-compose up -d --force-recreate localstack
```

#### Issue 2: PostgreSQL connection refused

**Symptoms:**
- Application can't connect to database
- `ECONNREFUSED` errors

**Solutions:**
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check health status
docker-compose exec postgres pg_isready -U connect_user

# View PostgreSQL logs
docker-compose logs postgres

# Verify connection from host
psql -h localhost -p 5432 -U connect_user -d connect2_dev

# If using Docker internal network, use 'postgres' as host
# Connection string: postgresql://connect_user:password@postgres:5432/connect2_dev
```

#### Issue 3: S3 operations failing

**Symptoms:**
- Upload/download operations timeout
- 404 errors on bucket access

**Solutions:**
```bash
# Verify LocalStack is running
curl http://localhost:4566/_localstack/health

# Check if bucket exists
awslocal s3 ls

# Recreate bucket
awslocal s3 mb s3://connect2-documents-dev

# Verify endpoint configuration in app
# Must use: http://localstack:4566 (from Docker network)
# Or: http://localhost:4566 (from host)

# Enable S3 path-style access (required for LocalStack)
# AWS SDK config: { forcePathStyle: true }
```

#### Issue 4: Hot reload not working

**Symptoms:**
- Code changes not reflected in running app
- Must manually restart container

**Solutions:**
```bash
# Verify volume mounts in docker-compose.yml
# Should have: - ./backend:/app

# Check file watching limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Verify nodemon/watcher is running
docker-compose exec api ps aux | grep nodemon

# Restart container
docker-compose restart api
```

#### Issue 5: Out of memory errors

**Symptoms:**
- Docker containers crashing
- `ENOMEM` errors

**Solutions:**
```bash
# Check Docker resource limits
docker stats

# Increase Docker memory (Docker Desktop):
# Settings → Resources → Memory → Set to 6-8 GB

# Stop unused services
docker-compose stop pgadmin frontend

# Clean up unused resources
docker system prune -a
```

### 11.2 Debugging Tools

#### Enable Verbose Logging
```bash
# LocalStack debug mode
# In docker-compose.yml:
# environment:
#   - DEBUG=1
#   - LS_LOG=trace

# Application debug logs
# In .env.local:
# LOG_LEVEL=debug
```

#### Inspect Docker Networks
```bash
# List networks
docker network ls

# Inspect connect2 network
docker network inspect blueprint_connect2-network

# Check container IPs
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' connect2-api
```

#### Monitor Resource Usage
```bash
# Real-time stats
docker stats

# Disk usage
docker system df

# Container logs with timestamps
docker-compose logs -f --timestamps api
```

---

## 12. Cost Comparison

### 12.1 Development Environment Costs

| Environment | Monthly Cost | Annual Cost | Notes |
|-------------|-------------|-------------|-------|
| **Local with LocalStack (Free)** | $0 | $0 | Community edition, unlimited developers |
| **Local with LocalStack Pro** | $50/dev | $600/dev | Advanced features (EKS, Cognito, etc.) |
| **AWS Development Account** | $500-1,500 | $6,000-18,000 | Per PRD estimates for dev/staging |
| **Shared AWS Staging** | $1,000-2,000 | $12,000-24,000 | Multiple developers sharing environment |

### 12.2 Cost Savings with LocalStack

**Scenario: 5 developers working on Connect 2.0**

| Cost Category | Without LocalStack | With LocalStack | Savings |
|---------------|-------------------|-----------------|---------|
| **Developer AWS accounts** | $7,500/month | $0 | $7,500/month |
| **CI/CD pipeline AWS usage** | $500/month | $50/month | $450/month |
| **Staging environment** | $1,500/month | $1,500/month | $0 |
| **Total Monthly Cost** | **$9,500** | **$1,550** | **$7,950/month** |
| **Annual Savings** | — | — | **$95,400/year** |

**ROI of LocalStack Pro:**
- LocalStack Pro: $250/month (5 devs × $50)
- Savings: $7,950/month
- **Net savings: $7,700/month or $92,400/year**

### 12.3 Development Velocity Benefits

| Metric | Traditional AWS Dev | LocalStack | Improvement |
|--------|-------------------|------------|-------------|
| **Environment setup time** | 2-4 hours | 15 minutes | **8-16x faster** |
| **AWS API call latency** | 100-500ms | <10ms | **10-50x faster** |
| **S3 upload/download** | Network-dependent | Instant | **100x+ faster** |
| **Offline development** | Not possible | Fully supported | **Eliminates connectivity dependency** |
| **Cost per test run** | $0.01-0.10 | $0.00 | **100% savings** |
| **Deployment iterations/day** | 5-10 | 50-100 | **10x more iterations** |

---

## 13. Next Steps & Onboarding Plan

### 13.1 Week 1: Foundation Setup

**Day 1-2: Environment Setup**
- [ ] Install Docker Desktop on all developer machines
- [ ] Clone repository and verify docker-compose.yml
- [ ] Run `docker-compose up -d` successfully
- [ ] Verify all services healthy: `docker-compose ps`

**Day 3-4: Developer Onboarding**
- [ ] Complete "Developer Workflow" walkthrough
- [ ] Run sample API requests via Postman/curl
- [ ] Execute database queries via pgAdmin or psql
- [ ] Test S3 upload/download operations

**Day 5: Testing & CI/CD**
- [ ] Run unit tests locally: `docker-compose exec api npm test`
- [ ] Set up GitHub Actions workflow
- [ ] Verify CI pipeline runs successfully

### 13.2 Week 2: Application Development

**Day 1-2: API Development**
- [ ] Create first REST API endpoint (e.g., `POST /api/v1/projects`)
- [ ] Integrate with PostgreSQL for data persistence
- [ ] Add S3 document upload functionality

**Day 3-4: Queue Processing**
- [ ] Implement SQS message producer
- [ ] Create worker process to consume messages
- [ ] Test async document processing workflow

**Day 5: Integration Testing**
- [ ] Write integration tests for complete workflows
- [ ] Test error handling and edge cases
- [ ] Document API endpoints with examples

### 13.3 Documentation Requirements

Create/update these files:

- [x] `LOCAL_DEVELOPMENT_PLAN.md` (this file)
- [ ] `DEVELOPER_QUICKSTART.md` - 5-minute setup guide
- [ ] `API_DOCUMENTATION.md` - Endpoint reference
- [ ] `ARCHITECTURE.md` - System design and data flow
- [ ] `TROUBLESHOOTING.md` - Common issues and solutions

---

## 14. Conclusion

### Key Benefits of LocalStack Approach

1. **Cost Savings**: $95,400/year savings vs. traditional AWS dev accounts
2. **Development Speed**: 10x faster iterations with local AWS services
3. **Offline Capability**: Develop anywhere without internet connectivity
4. **Consistency**: Same environment for all developers
5. **Testing**: Fast, isolated tests without cloud dependencies
6. **CI/CD**: Automated testing with LocalStack in GitHub Actions

### Recommended Next Actions

1. **Immediate (Day 1):**
   - Set up docker-compose.yml and LocalStack initialization
   - Get first developer environment running successfully

2. **Week 1:**
   - Onboard all developers with local environment
   - Establish database migration workflow
   - Create sample API endpoints

3. **Week 2:**
   - Build out core API functionality
   - Implement S3 document storage integration
   - Set up CI/CD pipeline with LocalStack

4. **Month 1:**
   - Complete MVP Phase 1 infrastructure (Design & Entitlement)
   - Test LocalStack → AWS migration path
   - Document lessons learned and optimize workflow

### Success Criteria

- ✅ All developers can run full stack locally in <15 minutes
- ✅ Zero AWS costs for local development
- ✅ CI/CD pipeline runs all tests with LocalStack
- ✅ Database migrations work identically local → staging → production
- ✅ AWS SDK code works unchanged between LocalStack and real AWS

---

**Document Status:** Ready for Review
**Last Updated:** December 12, 2025
**Next Review:** After first developer onboarding session
**Owner:** [Assign to Technical Lead]
