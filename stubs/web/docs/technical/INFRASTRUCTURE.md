# Web Infrastructure Documentation

**Version:** 2.0
**Last Updated:** January 2026
**Related Documents:** [SYSTEM_ARCHITECTURE.md](../../docs/architecture/SYSTEM_ARCHITECTURE.md), [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md)

---

## Overview

The Connect 2.0 Web App is deployed to AWS as a **standalone service** with its own complete infrastructure:

- **Terraform** for infrastructure as code
- **Docker** for containerization
- **ECS Fargate** for container orchestration (dedicated cluster per environment)
- **GitHub Actions** for CI/CD

### Independent Infrastructure

This repository contains **all infrastructure required** to run the Web application. There are no external dependencies or shared resources with other services.

| Component | Module Location |
|-----------|-----------------|
| **VPC, Subnets, NAT** | `infrastructure/terraform/modules/networking/` |
| **ECS Cluster** | `infrastructure/terraform/modules/ecs-cluster/` |
| **ECS Service** | `infrastructure/terraform/modules/ecs-service/` |
| **ALB** | `infrastructure/terraform/modules/alb/` |
| **ECR Repository** | `infrastructure/terraform/modules/ecr/` |
| **ACM Certificates** | `infrastructure/terraform/modules/acm/` |
| **Route53 DNS** | `infrastructure/terraform/modules/dns-record/` |
| **SNS Alerts** | `infrastructure/terraform/modules/sns-alerts/` |

### Benefits of Independent Infrastructure

- **No cross-service dependencies** — Deploy, rollback, or destroy without affecting other services
- **Cloud provider flexibility** — Can be migrated to Azure, GCP, or other providers independently
- **Isolated blast radius** — Infrastructure issues don't cascade to other services
- **Clear ownership** — All resources are managed within this repository
- **Independent scaling** — Scale infrastructure based on Web-specific needs

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         CONNECT 2.0 WEB INFRASTRUCTURE                           │
│                              (VPC: 10.2.0.0/16)                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                              Route 53                                    │    │
│  │              app.connect.com / app-{env}.connect.com                     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │              Application Load Balancer (HTTPS)                           │    │
│  │                    (SSL/TLS termination, health checks)                  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         VPC (2-3 AZs)                                    │    │
│  │  Public Subnets: ALB, NAT Gateway                                        │    │
│  │  Private Subnets: ECS Tasks                                              │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                ECS Fargate Cluster (connect2-web-cluster-{env})          │    │
│  │                       (Dedicated to Web service)                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                      │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                       ECS Service (Web)                                  │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │    │
│  │  │   Task 1    │  │   Task 2    │  │   Task N    │  (Auto-scaling)      │    │
│  │  │  (Nginx +   │  │  (Nginx +   │  │  (Nginx +   │                      │    │
│  │  │   React)    │  │   React)    │  │   React)    │                      │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         ECR (Container Registry)                         │    │
│  │                         connect2-web-{env}                               │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Environments

| Environment | Branch | AWS Resources | Purpose |
|-------------|--------|---------------|---------|
| **Development** | `development` | Minimal, Spot instances | Feature testing |
| **Staging** | `staging` | Production-like, Spot | Pre-release validation |
| **Production** | `main` | Full HA, no Spot | Live users |

### Environment Differences

| Feature | Dev | Staging | Prod |
|---------|-----|---------|------|
| Fargate Tasks | 2 | 2-6 | 3-20 |
| CPU/Memory | 256/512 | 256/512 | 512/1024 |
| Spot Instances | Yes | Yes | No |
| Autoscaling | No | Yes | Yes |
| HTTPS | No | Yes | Yes |
| Log Retention | 7 days | 14 days | 90 days |
| Deletion Protection | No | No | Yes |

---

## Directory Structure

```
infrastructure/
├── docker/
│   ├── Dockerfile                  # Multi-stage build (Node → Nginx)
│   ├── nginx.conf                  # SPA routing, caching, security headers
│   └── .dockerignore               # Files excluded from Docker build
└── terraform/
    ├── modules/                    # Reusable Terraform modules
    │   ├── networking/             # VPC, subnets, NAT gateway
    │   ├── ecs-cluster/            # ECS Fargate cluster
    │   ├── ecs-service/            # ECS service definition
    │   ├── alb/                    # Application Load Balancer
    │   ├── ecr/                    # Container registry
    │   ├── acm/                    # SSL/TLS certificates
    │   ├── dns-record/             # Route53 DNS records
    │   ├── route53-zone/           # Route53 hosted zones
    │   └── sns-alerts/             # Alerting topics
    └── environments/               # Environment-specific configurations
        ├── dev/
        │   ├── main.tf             # Complete infrastructure definition
        │   ├── variables.tf
        │   ├── outputs.tf
        │   └── dev.tfvars
        ├── staging/
        │   ├── main.tf
        │   ├── variables.tf
        │   ├── outputs.tf
        │   └── staging.tfvars
        └── prod/
            ├── main.tf
            ├── variables.tf
            ├── outputs.tf
            └── prod.tfvars

scripts/
└── rollback.sh                     # ECS rollback script
```

---

## Terraform Modules

### networking

Creates the VPC foundation with public and private subnets.

**Resources Created:**
- VPC with DNS support
- Public subnets (for ALB)
- Private subnets (for ECS tasks)
- Internet Gateway
- NAT Gateway (optional)
- Route tables

**Key Variables:**
```hcl
vpc_cidr           = "10.2.0.0/16"  # Dedicated Web VPC
az_count           = 2
enable_nat_gateway = true
```

### ecr

Creates the Elastic Container Registry for Docker images.

**Resources Created:**
- ECR Repository
- Lifecycle policy (cleanup old images)

**Key Variables:**
```hcl
image_tag_mutability = "MUTABLE"  # or "IMMUTABLE" for prod
scan_on_push         = true
image_count_to_keep  = 10
```

### alb

Creates the Application Load Balancer for traffic distribution.

**Resources Created:**
- Application Load Balancer
- Target Group (IP-based for Fargate)
- HTTP Listener (redirect to HTTPS)
- HTTPS Listener (with ACM certificate)
- Security Group

**Key Variables:**
```hcl
container_port    = 80
health_check_path = "/"
certificate_arn   = "arn:aws:acm:..."  # null for HTTP only
```

### ecs-service

Creates the ECS Fargate service.

**Resources Created:**
- ECS Service
- Task Definition
- IAM Roles (task execution, task)
- Security Group
- CloudWatch Log Group
- Auto Scaling (optional)

**Key Variables:**
```hcl
cluster_id         = module.ecs_cluster.cluster_id
container_image    = "123456789.dkr.ecr.us-west-2.amazonaws.com/connect2-web:latest"
task_cpu           = 256
task_memory        = 512
desired_count      = 2
enable_autoscaling = true
```

### dns-record

Creates Route53 records.

**Resources Created:**
- Route53 A Record (alias to ALB)
- Route53 AAAA Record (IPv6, optional)

**Key Variables:**
```hcl
zone_id     = module.route53_zone.zone_id
domain_name = "app"  # Results in app.connect.com
alb_dns     = module.alb.dns_name
alb_zone_id = module.alb.zone_id
```

---

## Deployment Process

### Initial Setup (One-time)

1. **Create S3 bucket for Terraform state:**
   ```bash
   aws s3 mb s3://connect2-web-terraform-state-dev --region us-west-2
   aws s3api put-bucket-versioning \
     --bucket connect2-web-terraform-state-dev \
     --versioning-configuration Status=Enabled
   ```

2. **Configure environment variables:**
   ```bash
   cd infrastructure/terraform/environments/dev
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

3. **Deploy infrastructure:**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

### Ongoing Deployments

Deployments are automated via GitHub Actions:

1. Push code to branch (`development`, `staging`, or `main`)
2. CI workflow runs (lint, test, build)
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

docker build -t connect2-web:latest -f infrastructure/docker/Dockerfile .
docker tag connect2-web:latest <account-id>.dkr.ecr.us-west-2.amazonaws.com/connect2-web-dev:latest
docker push <account-id>.dkr.ecr.us-west-2.amazonaws.com/connect2-web-dev:latest

# Trigger ECS deployment (to this repository's dedicated cluster)
aws ecs update-service \
  --cluster connect2-web-cluster-dev \
  --service connect2-web-service-dev \
  --force-new-deployment
```

---

## Docker Configuration

### Dockerfile

The Dockerfile uses a multi-stage build:

**Stage 1 (builder):**
- Uses `node:20-alpine`
- Installs dependencies with `npm ci`
- Builds production bundle with `npm run build`

**Stage 2 (production):**
- Uses `nginx:alpine`
- Copies built assets from stage 1
- Configures Nginx for SPA routing
- Runs as non-root user for security

### Nginx Configuration

The `nginx.conf` provides:
- **SPA Routing:** All routes serve `index.html`
- **Static Asset Caching:** 1-year cache for JS/CSS/images
- **Gzip Compression:** Reduces transfer size
- **Security Headers:** X-Frame-Options, X-Content-Type-Options, etc.
- **Health Check Endpoint:** `/health` returns 200 OK
- **API Proxy:** `/api/` routes to backend (configurable)

---

## Monitoring & Logging

### CloudWatch Logs

Container logs are sent to CloudWatch:
- **Log Group:** `/ecs/connect2-web-{environment}`
- **Retention:** 7 days (dev), 14 days (staging), 90 days (prod)

**View logs:**
```bash
aws logs tail /ecs/connect2-web-dev --follow
```

### Health Checks

- **ALB Health Check:** `GET /` every 30 seconds
- **Container Health Check:** `curl http://localhost/health`

### Metrics

ECS provides metrics in CloudWatch:
- CPU Utilization
- Memory Utilization
- Running Task Count

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
task_cpu    = 256   # 0.25 vCPU
task_memory = 512   # 512 MB
```

### Auto Scaling

Production uses target tracking scaling based on CPU:
```hcl
enable_autoscaling = true
min_capacity       = 3
max_capacity       = 20
cpu_target_value   = 60  # Scale when CPU > 60%
```

---

## Troubleshooting

### Container Won't Start

1. **Check CloudWatch Logs:**
   ```bash
   aws logs tail /ecs/connect2-web-dev --since 1h
   ```

2. **Describe task failures:**
   ```bash
   aws ecs describe-tasks \
     --cluster connect2-cluster-dev \
     --tasks <task-arn>
   ```

3. **Common issues:**
   - Image not found in ECR
   - Port mismatch (container vs target group)
   - Memory limit exceeded
   - Health check failing

### Terraform State Lock

If Terraform reports a state lock:
```bash
# Check who holds the lock
terraform force-unlock <LOCK_ID>
```

### ECS Service Stuck

If deployment is stuck:
```bash
# Check service events
aws ecs describe-services \
  --cluster connect2-web-cluster-dev \
  --services connect2-web-service-dev

# Force new deployment
aws ecs update-service \
  --cluster connect2-web-cluster-dev \
  --service connect2-web-service-dev \
  --force-new-deployment
```

---

## Security

### IAM Roles

- **Task Execution Role:** Allows ECS to pull images from ECR and write logs
- **Task Role:** Application permissions (S3, etc.)

### Network Security

- ALB in public subnets (internet-facing)
- ECS tasks in private subnets (no public IP)
- Security groups restrict traffic:
  - ALB: Allows 80/443 from anywhere
  - ECS: Allows traffic only from ALB

### Secrets Management

Use AWS Secrets Manager or Parameter Store for sensitive values:
```hcl
environment_variables = [
  {
    name  = "API_URL"
    value = "https://api.connect2.com"
  }
]

secrets = [
  {
    name      = "AUTH_SECRET"
    valueFrom = "arn:aws:secretsmanager:us-west-2:123456789:secret:auth-secret"
  }
]
```

---

## Related Documentation

- [GitHub Actions Workflows](./GITHUB_ACTIONS.md)
- [App Quickstart Guide](./APP_QUICKSTART.md)
- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md)
- [Deployment Runbook](../runbooks/DEPLOYMENT.md)
- [Rollback Runbook](../runbooks/ROLLBACK.md)
