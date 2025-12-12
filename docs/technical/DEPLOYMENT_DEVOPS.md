# Deployment and DevOps Documentation

**Version:** 1.0
**Last Updated:** November 5, 2025
**Status:** Draft - Ready for DevOps Review
**Related Documents:** [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md), [SECURITY_COMPLIANCE.md](SECURITY_COMPLIANCE.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Environment Strategy](#2-environment-strategy)
3. [CI/CD Pipeline](#3-cicd-pipeline)
4. [Infrastructure as Code](#4-infrastructure-as-code)
5. [Container Orchestration](#5-container-orchestration)
6. [Database Migrations](#6-database-migrations)
7. [Deployment Strategies](#7-deployment-strategies)
8. [Monitoring and Observability](#8-monitoring-and-observability)
9. [Disaster Recovery](#9-disaster-recovery)
10. [Runbooks](#10-runbooks)
11. [Performance Optimization](#11-performance-optimization)
12. [Cost Optimization](#12-cost-optimization)

---

## 1. Overview

### 1.1 Deployment Philosophy

**Core Principles:**
- **Automated**: All deployments automated via CI/CD
- **Repeatable**: Infrastructure as Code ensures consistency
- **Auditable**: All changes logged and traceable
- **Reversible**: Ability to rollback any deployment
- **Secure**: Security scans integrated into pipeline
- **Fast**: Deployments complete in < 15 minutes

### 1.2 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **CI/CD** | GitHub Actions | Automated build, test, deploy |
| **IaC** | Terraform | Infrastructure provisioning |
| **Containers** | Docker | Application packaging |
| **Orchestration** | AWS EKS | Container management |
| **Monitoring** | CloudWatch + Datadog | Application performance monitoring |
| **Logging** | CloudWatch Logs | Centralized logging |
| **Secrets** | AWS Secrets Manager | Secret management |

### 1.3 Deployment Frequency

| Environment | Deployment Frequency | Approval Required |
|-------------|---------------------|-------------------|
| **Development** | On every commit to `develop` | Automated |
| **Staging** | On every PR merge to `main` | Automated |
| **Production** | On-demand (post-testing) | Manual approval |

---

## 2. Environment Strategy

### 2.1 Environment Tiers

```
┌─────────────────────────────────────────────────┐
│ Local Development                               │
│ - Developer laptops                             │
│ - Docker Compose                                │
│ - Seed data                                     │
└─────────────────────────────────────────────────┘
                    ↓ git push
┌─────────────────────────────────────────────────┐
│ CI/CD (GitHub Actions)                          │
│ - Automated tests                               │
│ - Code quality checks                           │
│ - Security scans                                │
└─────────────────────────────────────────────────┘
                    ↓ deploy
┌─────────────────────────────────────────────────┐
│ Development Environment                         │
│ - AWS Dev Account (us-west-2)                   │
│ - Latest code from develop branch               │
│ - Synthetic test data                           │
│ - Accessible to engineering team                │
└─────────────────────────────────────────────────┘
                    ↓ promote
┌─────────────────────────────────────────────────┐
│ Staging Environment                             │
│ - AWS Staging Account (us-west-2)               │
│ - Pre-production testing                        │
│ - Sanitized production-like data               │
│ - UAT testing environment                       │
└─────────────────────────────────────────────────┘
                    ↓ promote (manual approval)
┌─────────────────────────────────────────────────┐
│ Production Environment                          │
│ - AWS Production Account (us-west-2)            │
│ - Live user traffic                             │
│ - High availability (multi-AZ)                  │
│ - 99.5% uptime SLA                              │
└─────────────────────────────────────────────────┘
```

### 2.2 Environment Configuration

**Development:**
```yaml
environment: development
domain: dev.connect2.blueprint.com
replica_count: 1
resources:
  api:
    cpu: 0.5
    memory: 1Gi
  database:
    instance_type: db.t3.micro
auto_scaling: disabled
backup_retention: 7 days
```

**Staging:**
```yaml
environment: staging
domain: staging.connect2.blueprint.com
replica_count: 2
resources:
  api:
    cpu: 1
    memory: 2Gi
  database:
    instance_type: db.t3.medium
auto_scaling: enabled
min_replicas: 2
max_replicas: 4
backup_retention: 14 days
```

**Production:**
```yaml
environment: production
domain: connect2.blueprint.com
replica_count: 3
resources:
  api:
    cpu: 2
    memory: 4Gi
  database:
    instance_type: db.r5.large
    multi_az: true
auto_scaling: enabled
min_replicas: 3
max_replicas: 10
backup_retention: 30 days
disaster_recovery: enabled
```

---

## 3. CI/CD Pipeline

### 3.1 GitHub Actions Workflow

**.github/workflows/main.yml:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ─────────────────────────────────────────────────
  # BUILD & TEST
  # ─────────────────────────────────────────────────
  test:
    name: Test
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: |
            backend/package-lock.json
            frontend/package-lock.json

      - name: Install backend dependencies
        working-directory: backend
        run: npm ci

      - name: Install frontend dependencies
        working-directory: frontend
        run: npm ci

      - name: Run linter (backend)
        working-directory: backend
        run: npm run lint

      - name: Run linter (frontend)
        working-directory: frontend
        run: npm run lint

      - name: Run unit tests (backend)
        working-directory: backend
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Run unit tests (frontend)
        working-directory: frontend
        run: npm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info,./frontend/coverage/lcov.info

  # ─────────────────────────────────────────────────
  # SECURITY SCANS
  # ─────────────────────────────────────────────────
  security:
    name: Security Scan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run npm audit
        working-directory: backend
        run: npm audit --audit-level=high
        continue-on-error: true

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  # ─────────────────────────────────────────────────
  # BUILD DOCKER IMAGES
  # ─────────────────────────────────────────────────
  build:
    name: Build Docker Images
    runs-on: ubuntu-latest
    needs: [test, security]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels)
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=semver,pattern={{version}}

      - name: Build and push backend image
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push frontend image
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ─────────────────────────────────────────────────
  # DEPLOY TO DEVELOPMENT
  # ─────────────────────────────────────────────────
  deploy-dev:
    name: Deploy to Development
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment:
      name: development
      url: https://dev.connect2.blueprint.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2

      - name: Update kubeconfig
        run: aws eks update-kubeconfig --name connect2-dev --region us-west-2

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/connect2-backend \
            backend=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:develop-${{ github.sha }} \
            -n development

          kubectl set image deployment/connect2-frontend \
            frontend=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:develop-${{ github.sha }} \
            -n development

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/connect2-backend -n development --timeout=5m
          kubectl rollout status deployment/connect2-frontend -n development --timeout=5m

      - name: Run smoke tests
        run: |
          curl -f https://dev.connect2.blueprint.com/api/health || exit 1
          curl -f https://dev.connect2.blueprint.com/ || exit 1

  # ─────────────────────────────────────────────────
  # DEPLOY TO STAGING
  # ─────────────────────────────────────────────────
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: staging
      url: https://staging.connect2.blueprint.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2

      - name: Update kubeconfig
        run: aws eks update-kubeconfig --name connect2-staging --region us-west-2

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/connect2-backend \
            backend=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:main-${{ github.sha }} \
            -n staging

          kubectl set image deployment/connect2-frontend \
            frontend=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:main-${{ github.sha }} \
            -n staging

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/connect2-backend -n staging --timeout=5m
          kubectl rollout status deployment/connect2-frontend -n staging --timeout=5m

      - name: Run E2E tests
        working-directory: frontend
        run: npx playwright test
        env:
          BASE_URL: https://staging.connect2.blueprint.com

  # ─────────────────────────────────────────────────
  # DEPLOY TO PRODUCTION (Manual Approval)
  # ─────────────────────────────────────────────────
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment:
      name: production
      url: https://connect2.blueprint.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_PROD_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_PROD_SECRET_ACCESS_KEY }}
          aws-region: us-west-2

      - name: Update kubeconfig
        run: aws eks update-kubeconfig --name connect2-prod --region us-west-2

      - name: Deploy to Kubernetes (Rolling Update)
        run: |
          kubectl set image deployment/connect2-backend \
            backend=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:main-${{ github.sha }} \
            -n production

          kubectl set image deployment/connect2-frontend \
            frontend=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:main-${{ github.sha }} \
            -n production

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/connect2-backend -n production --timeout=10m
          kubectl rollout status deployment/connect2-frontend -n production --timeout=10m

      - name: Run smoke tests
        run: |
          curl -f https://connect2.blueprint.com/api/health || exit 1
          curl -f https://connect2.blueprint.com/ || exit 1

      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "✅ Production deployment successful",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Production Deployment*\n✅ Version: `${{ github.sha }}`\n🔗 <https://connect2.blueprint.com|View Site>"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 4. Infrastructure as Code

### 4.1 Terraform Configuration

**Directory Structure:**
```
terraform/
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── eks/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── rds/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── redis/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   │   ├── main.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   └── production/
│       ├── main.tf
│       ├── terraform.tfvars
│       └── backend.tf
└── README.md
```

**Example: EKS Cluster Module**

**terraform/modules/eks/main.tf:**
```hcl
resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  role_arn = aws_iam_role.cluster.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = var.subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = var.public_access
    security_group_ids      = [aws_security_group.cluster.id]
  }

  enabled_cluster_log_types = [
    "api",
    "audit",
    "authenticator",
    "controllerManager",
    "scheduler"
  ]

  depends_on = [
    aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.cluster_AmazonEKSVPCResourceController,
  ]

  tags = merge(
    var.tags,
    {
      Name        = var.cluster_name
      Environment = var.environment
    }
  )
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.cluster_name}-node-group"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = var.desired_capacity
    max_size     = var.max_capacity
    min_size     = var.min_capacity
  }

  instance_types = var.instance_types

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.node_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.node_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.node_AmazonEC2ContainerRegistryReadOnly,
  ]

  tags = var.tags
}
```

**terraform/environments/production/main.tf:**
```hcl
terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "blueprint-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "../../modules/vpc"

  environment = "production"
  vpc_cidr    = "10.0.0.0/16"

  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]
  database_subnet_cidrs = ["10.0.20.0/24", "10.0.21.0/24"]

  tags = {
    Project     = "Connect 2.0"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

module "eks" {
  source = "../../modules/eks"

  cluster_name        = "connect2-prod"
  kubernetes_version  = "1.28"
  subnet_ids          = module.vpc.private_subnet_ids
  public_access       = false

  desired_capacity = 3
  min_capacity     = 3
  max_capacity     = 10
  instance_types   = ["t3.large"]

  environment = "production"
  tags = {
    Project     = "Connect 2.0"
    Environment = "production"
  }
}

module "rds" {
  source = "../../modules/rds"

  identifier        = "connect2-prod"
  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.r5.large"
  allocated_storage = 100
  multi_az          = true

  database_name = "connect2_prod"
  username      = "connect2_admin"

  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.database_subnet_ids
  allowed_cidr_blocks = module.vpc.private_subnet_cidrs

  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = {
    Project     = "Connect 2.0"
    Environment = "production"
  }
}

module "redis" {
  source = "../../modules/redis"

  cluster_id         = "connect2-prod"
  engine_version     = "7.0"
  node_type          = "cache.r5.large"
  num_cache_nodes    = 2

  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.database_subnet_ids
  allowed_cidr_blocks = module.vpc.private_subnet_cidrs

  tags = {
    Project     = "Connect 2.0"
    Environment = "production"
  }
}
```

### 4.2 Terraform Workflow

```bash
# Initialize Terraform
cd terraform/environments/production
terraform init

# Validate configuration
terraform validate

# Plan changes
terraform plan -out=tfplan

# Apply changes (production requires approval)
terraform apply tfplan

# Destroy resources (careful!)
terraform destroy
```

---

## 5. Container Orchestration

### 5.1 Kubernetes Manifests

**k8s/backend-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: connect2-backend
  namespace: production
  labels:
    app: connect2
    component: backend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: connect2
      component: backend
  template:
    metadata:
      labels:
        app: connect2
        component: backend
    spec:
      containers:
        - name: backend
          image: ghcr.io/blueprint/connect2-backend:latest
          ports:
            - containerPort: 3000
              name: http
          env:
            - name: NODE_ENV
              value: "production"
            - name: PORT
              value: "3000"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: connect2-secrets
                  key: database-url
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: connect2-secrets
                  key: redis-url
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: connect2-secrets
                  key: jwt-secret
          resources:
            requests:
              cpu: 1000m
              memory: 2Gi
            limits:
              cpu: 2000m
              memory: 4Gi
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 2
      imagePullSecrets:
        - name: ghcr-secret
---
apiVersion: v1
kind: Service
metadata:
  name: connect2-backend
  namespace: production
spec:
  type: ClusterIP
  selector:
    app: connect2
    component: backend
  ports:
    - port: 80
      targetPort: 3000
      protocol: TCP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: connect2-backend
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: connect2-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

**k8s/ingress.yaml:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: connect2-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
    - hosts:
        - connect2.blueprint.com
      secretName: connect2-tls
  rules:
    - host: connect2.blueprint.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: connect2-backend
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: connect2-frontend
                port:
                  number: 80
```

### 5.2 Kubernetes Commands

```bash
# Apply manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get deployments -n production
kubectl get pods -n production

# View logs
kubectl logs -f deployment/connect2-backend -n production

# Scale deployment
kubectl scale deployment connect2-backend --replicas=5 -n production

# Rollback deployment
kubectl rollout undo deployment/connect2-backend -n production

# Exec into pod
kubectl exec -it <pod-name> -n production -- /bin/sh

# Port forward for debugging
kubectl port-forward svc/connect2-backend 3000:80 -n production
```

---

## 6. Database Migrations

### 6.1 Migration Strategy

**Automated Migrations in CI/CD:**
```yaml
# .github/workflows/migrate.yml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to migrate'
        required: true
        type: choice
        options:
          - development
          - staging
          - production

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run migrations
        working-directory: backend
        run: npm run migrate:latest
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Verify migrations
        working-directory: backend
        run: npm run migrate:status
```

### 6.2 Safe Migration Practices

**Backwards-Compatible Migrations:**
```typescript
// ✅ GOOD: Add nullable column first, populate data, then make NOT NULL
// Migration 1: Add nullable column
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('new_field').nullable();
  });
}

// Migration 2: Populate data
export async function up(knex: Knex): Promise<void> {
  await knex('users').update({ new_field: 'default_value' });
}

// Migration 3: Make NOT NULL
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('new_field').notNullable().alter();
  });
}

// ❌ BAD: Add NOT NULL column directly (breaks old app versions)
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('new_field').notNullable(); // Fails if old code tries to insert
  });
}
```

---

## 7. Deployment Strategies

### 7.1 Rolling Update (Default)

**Kubernetes Rolling Update:**
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max 1 extra pod during rollout
      maxUnavailable: 0  # Zero downtime
```

**Process:**
1. Create 1 new pod (v2)
2. Wait for new pod to be ready
3. Terminate 1 old pod (v1)
4. Repeat until all pods are v2

**Pros:** Zero downtime
**Cons:** Both versions running simultaneously (requires backwards compatibility)

### 7.2 Blue-Green Deployment

**Process:**
```bash
# 1. Deploy new version (green) alongside current (blue)
kubectl apply -f k8s/deployment-green.yaml

# 2. Test green deployment
curl -H "Host: green.connect2.blueprint.com" https://connect2.blueprint.com

# 3. Switch traffic (update ingress)
kubectl patch ingress connect2 -p '{"spec":{"rules":[{"host":"connect2.blueprint.com","http":{"paths":[{"backend":{"serviceName":"connect2-backend-green"}}]}}]}}'

# 4. Monitor for issues

# 5. If successful, delete blue deployment
kubectl delete deployment connect2-backend-blue

# 6. If issues, rollback
kubectl patch ingress connect2 -p '{"spec":{"rules":[{"host":"connect2.blueprint.com","http":{"paths":[{"backend":{"serviceName":"connect2-backend-blue"}}]}}]}}'
```

**Pros:** Instant rollback
**Cons:** Requires 2x resources during deployment

### 7.3 Canary Deployment

**Process:**
```yaml
# Deploy canary with 10% traffic
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: connect2-backend
spec:
  hosts:
    - connect2-backend
  http:
    - match:
        - headers:
            user-agent:
              regex: ".*Mobile.*"
      route:
        - destination:
            host: connect2-backend
            subset: canary
          weight: 10
        - destination:
            host: connect2-backend
            subset: stable
          weight: 90
```

**Monitoring Canary:**
```bash
# Monitor error rates
kubectl logs -l version=canary --tail=100 | grep ERROR

# If error rate is acceptable, increase traffic to 50%
# If error rate is high, rollback (set weight to 0)
```

---

## 8. Monitoring and Observability

### 8.1 Application Monitoring (Datadog)

**Datadog Agent Deployment:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: datadog-agent
data:
  datadog.yaml: |
    api_key: ${DATADOG_API_KEY}
    logs_enabled: true
    apm_enabled: true
    process_config:
      enabled: "true"
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: datadog-agent
spec:
  selector:
    matchLabels:
      app: datadog-agent
  template:
    metadata:
      labels:
        app: datadog-agent
    spec:
      containers:
        - name: datadog-agent
          image: datadog/agent:latest
          env:
            - name: DD_API_KEY
              valueFrom:
                secretKeyRef:
                  name: datadog-secret
                  key: api-key
            - name: DD_SITE
              value: "datadoghq.com"
            - name: DD_LOGS_ENABLED
              value: "true"
            - name: DD_APM_ENABLED
              value: "true"
```

**Application Instrumentation:**
```typescript
// backend/src/server.ts
import tracer from 'dd-trace';

// Initialize Datadog tracer
tracer.init({
  service: 'connect2-backend',
  env: process.env.NODE_ENV,
  version: process.env.APP_VERSION,
  logInjection: true
});

// Custom metrics
import StatsD from 'hot-shots';

const dogstatsd = new StatsD({
  host: 'localhost',
  port: 8125,
  prefix: 'connect2.',
  globalTags: { env: process.env.NODE_ENV }
});

// Track custom metrics
dogstatsd.increment('api.requests');
dogstatsd.timing('api.response_time', responseTime);
dogstatsd.gauge('db.pool.connections', activeConnections);
```

### 8.2 Key Metrics to Monitor

**Application Metrics:**

| Metric | Threshold | Alert Level |
|--------|-----------|-------------|
| **Error Rate** | > 1% | Warning |
| **Error Rate** | > 5% | Critical |
| **Response Time (p95)** | > 500ms | Warning |
| **Response Time (p95)** | > 1000ms | Critical |
| **Request Rate** | < 10 req/min | Info (low traffic) |
| **CPU Usage** | > 70% | Warning |
| **Memory Usage** | > 80% | Warning |
| **Disk Usage** | > 85% | Warning |
| **Database Connections** | > 80% of pool | Warning |

**Infrastructure Metrics:**

| Metric | Threshold | Alert Level |
|--------|-----------|-------------|
| **Pod Restart Count** | > 3 in 10 min | Critical |
| **Node CPU** | > 80% | Warning |
| **Node Memory** | > 90% | Critical |
| **Disk I/O** | > 90% | Warning |

### 8.3 Logging Strategy

**Structured Logging:**
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'connect2-backend',
    environment: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('User logged in', {
  user_id: 'usr_123',
  ip_address: req.ip,
  timestamp: new Date().toISOString()
});

logger.error('Database connection failed', {
  error: error.message,
  stack: error.stack,
  database_host: dbHost
});
```

**Log Aggregation:**
- Use CloudWatch Logs with Log Insights for querying
- Set retention period: 30 days for production, 7 days for dev
- Enable log exports to S3 for long-term archival
- Configure OpenSearch dashboards for visualization

---

## 9. Disaster Recovery

### 9.1 Backup Strategy

**Database Backups:**
```yaml
# Automated RDS backups
backup_retention_period: 30 days
backup_window: "03:00-04:00 UTC"  # Low-traffic window
automated_backups: true

# Point-in-time recovery: enabled (up to 30 days)
```

**Application Backups:**
```bash
# Backup uploaded documents (S3)
aws s3 sync s3://connect2-prod-documents s3://connect2-prod-documents-backup --delete

# Backup Kubernetes configs
kubectl get all --all-namespaces -o yaml > k8s-backup-$(date +%Y%m%d).yaml
```

### 9.2 Recovery Procedures

**Database Recovery:**
```bash
# Restore from automated backup
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier connect2-prod-restored \
  --db-snapshot-identifier connect2-prod-snapshot-2025-11-05

# Point-in-time recovery
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier connect2-prod \
  --target-db-instance-identifier connect2-prod-pitr \
  --restore-time 2025-11-05T10:00:00Z
```

**Application Recovery:**
```bash
# Rollback deployment
kubectl rollout undo deployment/connect2-backend -n production

# Restore from previous Docker image tag
kubectl set image deployment/connect2-backend \
  backend=ghcr.io/blueprint/connect2-backend:v1.2.3 \
  -n production
```

### 9.3 Disaster Recovery Testing

**Quarterly DR Drill:**
1. Simulate database failure
2. Restore from backup to staging
3. Verify data integrity
4. Measure recovery time (target: < 2 hours)
5. Document lessons learned

---

## 10. Runbooks

### 10.1 Incident Runbook: Database Connection Exhaustion

**Symptoms:**
- API returning "Cannot acquire connection from pool" errors
- Database connection count at maximum
- Application responding slowly or timing out

**Investigation:**
```bash
# Check current connections
psql -h <db-host> -U admin -d connect2_prod -c \
  "SELECT count(*) FROM pg_stat_activity;"

# List active queries
psql -h <db-host> -U admin -d connect2_prod -c \
  "SELECT pid, now() - query_start as duration, query
   FROM pg_stat_activity
   WHERE state = 'active'
   ORDER BY duration DESC;"
```

**Resolution:**
```bash
# Option 1: Terminate long-running queries
psql -h <db-host> -U admin -d connect2_prod -c \
  "SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE state = 'active' AND now() - query_start > interval '10 minutes';"

# Option 2: Scale up RDS instance (temporary)
aws rds modify-db-instance \
  --db-instance-identifier connect2-prod \
  --db-instance-class db.r5.xlarge \
  --apply-immediately

# Option 3: Increase connection pool size (if needed)
# Edit backend/knexfile.js and redeploy
```

### 10.2 Incident Runbook: High Memory Usage

**Symptoms:**
- Pods being OOMKilled
- High memory usage (> 90%)
- Application restart loops

**Investigation:**
```bash
# Check pod memory usage
kubectl top pods -n production

# Check node memory
kubectl top nodes

# View pod events
kubectl describe pod <pod-name> -n production
```

**Resolution:**
```bash
# Option 1: Increase memory limits
kubectl set resources deployment connect2-backend \
  --limits=memory=8Gi -n production

# Option 2: Scale out (horizontal)
kubectl scale deployment connect2-backend --replicas=5 -n production

# Option 3: Identify memory leak (if persistent)
kubectl exec -it <pod-name> -n production -- node --expose-gc --inspect=0.0.0.0:9229
# Use Chrome DevTools to profile memory
```

---

## 11. Performance Optimization

### 11.1 Database Optimization

**Connection Pooling:**
```typescript
// Optimized connection pool configuration
const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 600000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
    propagateCreateError: false
  }
});
```

**Query Optimization:**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_loans_borrower_id ON loans(borrower_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);

-- Analyze slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

### 11.2 Caching Strategy

**Redis Caching:**
```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

async function getProjectWithCache(projectId: string) {
  const cacheKey = `project:${projectId}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Cache miss: fetch from database
  const project = await db.projects.findById(projectId);

  // Store in cache (expire after 5 minutes)
  await redis.setex(cacheKey, 300, JSON.stringify(project));

  return project;
}

// Invalidate cache on update
async function updateProject(projectId: string, data: any) {
  const updated = await db.projects.update(projectId, data);

  // Invalidate cache
  await redis.del(`project:${projectId}`);

  return updated;
}
```

---

## 12. Cost Optimization

### 12.1 Right-Sizing Resources

**Monitor Resource Usage:**
```bash
# Check actual vs requested resources
kubectl top pods -n production

# Identify over-provisioned pods
kubectl get pods -n production -o json | \
  jq '.items[] | {name: .metadata.name, cpu_request: .spec.containers[].resources.requests.cpu, cpu_usage: .status}'
```

**Adjust Resource Limits:**
```yaml
# If CPU usage is consistently < 50% of request, reduce
resources:
  requests:
    cpu: 500m    # Was 1000m
    memory: 1Gi  # Was 2Gi
```

### 12.2 Auto-Scaling Configuration

**Scale Down During Off-Hours:**
```yaml
# Use KEDA (Kubernetes Event-Driven Autoscaling)
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: connect2-backend-scaler
spec:
  scaleTargetRef:
    name: connect2-backend
  minReplicaCount: 2   # Off-hours minimum
  maxReplicaCount: 10  # Peak maximum
  triggers:
    - type: cpu
      metadata:
        type: Utilization
        value: "70"
    - type: cron
      metadata:
        timezone: America/Los_Angeles
        start: 0 8 * * 1-5   # Scale up at 8 AM weekdays
        end: 0 18 * * 1-5    # Scale down at 6 PM weekdays
        desiredReplicas: "5"
```

---

**End of Deployment and DevOps Documentation**
