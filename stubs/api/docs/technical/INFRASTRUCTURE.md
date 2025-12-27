# API Infrastructure Documentation

**Version:** 1.0.0
**Last Updated:** December 2025

---

## Overview

The Connect 2.0 API is deployed to AWS using:
- **Terraform** for infrastructure as code
- **Docker** for containerization
- **ECS Fargate** for container orchestration
- **RDS PostgreSQL** for database
- **ElastiCache Redis** for caching
- **GitHub Actions** for CI/CD

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Route 53                                    │
│                         (DNS + SSL Certificate)                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Application Load Balancer                         │
│                    (HTTPS termination, health checks)                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           ECS Fargate Cluster                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│  │   Task 1    │  │   Task 2    │  │   Task N    │  (Auto-scaling)      │
│  │  (FastAPI)  │  │  (FastAPI)  │  │  (FastAPI)  │                      │
│  └─────────────┘  └─────────────┘  └─────────────┘                      │
└─────────────────────────────────────────────────────────────────────────┘
                          │                    │
                          ▼                    ▼
┌─────────────────────────────┐    ┌─────────────────────────────┐
│      RDS PostgreSQL         │    │     ElastiCache Redis       │
│   (Multi-AZ in Production)  │    │   (Shared Cache Layer)      │
└─────────────────────────────┘    └─────────────────────────────┘
```

---

## Environments

| Environment | Branch | Resources | Purpose |
|-------------|--------|-----------|---------|
| **Development** | `development` | Minimal, Spot | Feature testing |
| **Staging** | `staging` | Production-like, Spot | Pre-release validation |
| **Production** | `main` | Full HA, Multi-AZ | Live users |

### Environment Differences

| Feature | Dev | Staging | Prod |
|---------|-----|---------|------|
| Fargate Tasks | 2 | 2-6 | 3-20 |
| CPU/Memory | 256/512 | 256/512 | 512/1024 |
| Spot Instances | Yes | Yes | No |
| Autoscaling | No | Yes | Yes |
| HTTPS | No | Yes | Yes |
| RDS Instance | db.t3.micro | db.t3.small | db.t3.medium |
| RDS Multi-AZ | No | No | Yes |
| Redis Nodes | 1 | 2 | 3 |
| Redis TLS | No | No | Yes |
| Log Retention | 7 days | 14 days | 90 days |
| Deletion Protection | No | No | Yes |
| Bastion Host | Optional | Optional | Recommended |

---

## Directory Structure

```
infrastructure/
├── docker/
│   ├── Dockerfile           # Multi-stage build (Python → Production)
│   └── .dockerignore        # Files excluded from Docker build
└── terraform/
    ├── modules/             # Reusable infrastructure components
    │   ├── networking/      # VPC, subnets, NAT gateway
    │   ├── ecr/             # Container registry
    │   ├── alb/             # Application Load Balancer
    │   ├── ecs/             # ECS cluster, service, task definition
    │   ├── dns/             # Route53 + ACM certificate
    │   ├── rds/             # PostgreSQL database
    │   ├── elasticache/     # Redis cache
    │   └── bastion/         # Bastion host for DB access
    └── environments/        # Environment-specific configurations
        ├── dev/
        ├── staging/
        └── prod/
```

---

## Terraform Modules

### networking

Creates the VPC foundation with public and private subnets.

**Resources Created:**
- VPC with DNS support
- Public subnets (for ALB, Bastion)
- Private subnets (for ECS, RDS, Redis)
- Internet Gateway
- NAT Gateway (optional)
- Route tables

**Key Variables:**
```hcl
vpc_cidr           = "10.1.0.0/16"  # Different from app VPC
az_count           = 2
enable_nat_gateway = true
```

### rds

Creates PostgreSQL database with Secrets Manager integration.

**Resources Created:**
- RDS PostgreSQL instance
- DB Subnet Group
- DB Parameter Group
- Security Group
- Secrets Manager secret (credentials)

**Key Variables:**
```hcl
instance_class         = "db.t3.micro"
engine_version         = "16.4"
allocated_storage      = 20
max_allocated_storage  = 100
multi_az              = false  # true for production
deletion_protection   = false  # true for production
```

**Secrets Manager Output:**
```json
{
  "username": "postgres",
  "password": "auto-generated",
  "host": "rds-endpoint.region.rds.amazonaws.com",
  "port": 5432,
  "database": "connect2",
  "url": "postgresql://postgres:password@host:5432/connect2"
}
```

### elasticache

Creates Redis cache cluster shared across all ECS tasks.

**Resources Created:**
- ElastiCache Replication Group
- ElastiCache Subnet Group
- ElastiCache Parameter Group
- Security Group
- Secrets Manager secret (connection info)
- CloudWatch Alarms (optional)

**Key Variables:**
```hcl
node_type                  = "cache.t3.micro"
num_cache_clusters         = 1      # 2+ for HA
automatic_failover_enabled = false  # true when num_cache_clusters > 1
transit_encryption_enabled = false  # true for production
```

### bastion

Creates a bastion host for secure database access.

**Resources Created:**
- EC2 instance (Amazon Linux 2023)
- Security Group
- IAM Role with SSM access
- Elastic IP (optional)
- Key Pair (optional)

**Access Methods:**
1. **SSH** (if key pair provided):
   ```bash
   ssh -i key.pem ec2-user@<bastion-ip>
   ```

2. **AWS Systems Manager Session Manager** (no SSH key required):
   ```bash
   aws ssm start-session --target <instance-id>
   ```

**Connecting to RDS via Bastion:**
```bash
# SSH tunnel
ssh -i key.pem -L 5432:rds-endpoint:5432 ec2-user@<bastion-ip>

# Then connect locally
psql -h localhost -U postgres -d connect2
```

### ecs

Creates ECS Fargate cluster and service with Secrets Manager integration.

**Resources Created:**
- ECS Cluster
- Task Definition
- ECS Service
- IAM Roles (task execution, task)
- Security Group
- CloudWatch Log Group
- Auto Scaling (optional)

**Secrets Injection:**
```hcl
secrets = [
  {
    name      = "DATABASE_URL"
    valueFrom = "${rds_secret_arn}:url::"
  },
  {
    name      = "REDIS_URL"
    valueFrom = "${redis_secret_arn}:url::"
  }
]
```

---

## Initial Setup

### 1. Create S3 Bucket for Terraform State

```bash
# Development
aws s3 mb s3://connect2-api-terraform-state-dev --region us-west-2
aws s3api put-bucket-versioning \
  --bucket connect2-api-terraform-state-dev \
  --versioning-configuration Status=Enabled

# Staging
aws s3 mb s3://connect2-api-terraform-state-staging --region us-west-2
aws s3api put-bucket-versioning \
  --bucket connect2-api-terraform-state-staging \
  --versioning-configuration Status=Enabled

# Production
aws s3 mb s3://connect2-api-terraform-state-prod --region us-west-2
aws s3api put-bucket-versioning \
  --bucket connect2-api-terraform-state-prod \
  --versioning-configuration Status=Enabled
```

### 2. Configure Environment Variables

```bash
cd infrastructure/terraform/environments/dev
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### 3. Deploy Infrastructure

```bash
terraform init
terraform plan
terraform apply
```

---

## Docker Configuration

### Dockerfile

The Dockerfile uses a multi-stage build:

**Stage 1 (builder):**
- Uses `python:3.12-slim`
- Installs Poetry
- Installs production dependencies

**Stage 2 (production):**
- Uses `python:3.12-slim`
- Copies installed packages from builder
- Runs as non-root user for security
- Health check endpoint at `/health`

**Stage 3 (development):**
- Includes dev dependencies
- PostgreSQL client for DB access
- Hot reload enabled

### Building Images

```bash
# Production build
docker build -t connect2-api:latest \
  -f infrastructure/docker/Dockerfile \
  --target production \
  .

# Development build
docker build -t connect2-api:dev \
  -f infrastructure/docker/Dockerfile \
  --target development \
  .
```

---

## Deployment Process

### Automated Deployments

Deployments are automated via GitHub Actions:

1. Push code to branch (`development`, `staging`, or `main`)
2. CI workflow runs (lint, test, type-check, build)
3. Deploy workflow triggers:
   - Builds Docker image
   - Pushes to ECR
   - Updates ECS service
4. ECS performs rolling deployment

### Manual Deployment

```bash
# Build and push Docker image
aws ecr get-login-password --region us-west-2 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-west-2.amazonaws.com

docker build -t connect2-api:latest -f infrastructure/docker/Dockerfile --target production .
docker tag connect2-api:latest <account-id>.dkr.ecr.us-west-2.amazonaws.com/connect2-api-dev:latest
docker push <account-id>.dkr.ecr.us-west-2.amazonaws.com/connect2-api-dev:latest

# Trigger ECS deployment
aws ecs update-service \
  --cluster connect2-api-cluster-dev \
  --service connect2-api-service-dev \
  --force-new-deployment
```

---

## Monitoring & Logging

### CloudWatch Logs

Container logs are sent to CloudWatch:
- **Log Group:** `/ecs/connect2-api-{environment}`
- **Retention:** 7 days (dev), 14 days (staging), 90 days (prod)

**View logs:**
```bash
aws logs tail /ecs/connect2-api-dev --follow
```

### Health Checks

- **ALB Health Check:** `GET /health` every 30 seconds
- **Container Health Check:** `curl http://localhost:8000/health`

### CloudWatch Alarms

Production environments include:
- Redis CPU utilization alarm (>75%)
- Redis memory utilization alarm (>80%)

---

## Database Operations

### Connecting to RDS

**Via Bastion Host:**
```bash
# Start SSH tunnel
ssh -i key.pem -L 5432:<rds-endpoint>:5432 ec2-user@<bastion-ip>

# In another terminal
psql -h localhost -U postgres -d connect2
```

**Via SSM Session Manager:**
```bash
# Start session
aws ssm start-session --target <bastion-instance-id>

# Install psql (first time only)
sudo dnf install -y postgresql15

# Connect to RDS
psql -h <rds-endpoint> -U postgres -d connect2
```

### Running Migrations

```bash
# Via ECS exec (requires ECS Exec enabled)
aws ecs execute-command \
  --cluster connect2-api-cluster-dev \
  --task <task-id> \
  --container connect2-api \
  --interactive \
  --command "alembic upgrade head"
```

---

## Security

### IAM Roles

- **Task Execution Role:** ECR pull, CloudWatch logs, Secrets Manager access
- **Task Role:** Application permissions (S3, DynamoDB, etc.)

### Network Security

- ALB in public subnets (internet-facing)
- ECS tasks in private subnets (no public IP)
- RDS in private subnets (no public access)
- ElastiCache in private subnets (no public access)
- Security groups restrict traffic:
  - ALB: Allows 80/443 from anywhere
  - ECS: Allows traffic only from ALB
  - RDS: Allows 5432 only from ECS and Bastion
  - Redis: Allows 6379 only from ECS and Bastion

### Secrets Management

All secrets stored in AWS Secrets Manager:
- Database credentials (auto-rotated)
- Redis connection info
- Application secrets

Access controlled via IAM policies.

---

## Cost Optimization

### Fargate Spot (Dev/Staging)

Dev and staging environments use Fargate Spot for ~70% cost savings:
```hcl
use_spot = true
```

**Note:** Spot instances can be interrupted. Not recommended for production.

### Right-sizing

Start with minimal resources and scale up as needed:
```hcl
# Dev
task_cpu    = 256   # 0.25 vCPU
task_memory = 512   # 512 MB
instance_class = "db.t3.micro"
node_type = "cache.t3.micro"

# Production
task_cpu    = 512   # 0.5 vCPU
task_memory = 1024  # 1 GB
instance_class = "db.t3.medium"
node_type = "cache.t3.medium"
```

### Auto Scaling

Production uses target tracking scaling:
```hcl
enable_autoscaling = true
min_capacity       = 3
max_capacity       = 20
cpu_target_value   = 60
memory_target_value = 70
```

---

## Troubleshooting

### Container Won't Start

1. **Check CloudWatch Logs:**
   ```bash
   aws logs tail /ecs/connect2-api-dev --since 1h
   ```

2. **Describe task failures:**
   ```bash
   aws ecs describe-tasks \
     --cluster connect2-api-cluster-dev \
     --tasks <task-arn>
   ```

3. **Common issues:**
   - Image not found in ECR
   - Secrets Manager access denied
   - Database connection failed
   - Health check failing

### Database Connection Issues

1. **Check security groups:**
   - ECS security group should be allowed in RDS security group

2. **Check secrets:**
   ```bash
   aws secretsmanager get-secret-value \
     --secret-id connect2-api/dev/rds-credentials
   ```

3. **Test connectivity via bastion:**
   ```bash
   psql -h <rds-endpoint> -U postgres -d connect2
   ```

### Redis Connection Issues

1. **Check security groups**
2. **Check secrets:**
   ```bash
   aws secretsmanager get-secret-value \
     --secret-id connect2-api/dev/redis-credentials
   ```

3. **Test via bastion:**
   ```bash
   redis-cli -h <redis-endpoint> -p 6379 PING
   ```

---

## Related Documentation

- [GitHub Actions Workflows](./GITHUB_ACTIONS.md)
- [Deployment Runbook](../runbooks/DEPLOYMENT.md)
- [Rollback Runbook](../runbooks/ROLLBACK.md)
- [API Architecture](./BACKEND_ARCHITECTURE.md)
