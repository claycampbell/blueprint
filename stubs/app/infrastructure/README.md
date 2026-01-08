# Connect 2.0 App Infrastructure

This directory contains the infrastructure as code (IaC) for deploying the Connect 2.0 React application to AWS.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Route 53                                     │
│                         (DNS + SSL Certificate)                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Application Load Balancer                          │
│                    (HTTPS termination, HTTP→HTTPS redirect)              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           ECS Fargate Cluster                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                       │
│  │   Task 1    │  │   Task 2    │  │   Task N    │  (Auto-scaling)       │
│  │  (Nginx +   │  │  (Nginx +   │  │  (Nginx +   │                       │
│  │   React)    │  │   React)    │  │   React)    │                       │
│  └─────────────┘  └─────────────┘  └─────────────┘                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         ECR (Container Registry)                          │
│                     (Stores Docker images for deployment)                 │
└─────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
infrastructure/
├── docker/
│   ├── Dockerfile           # Multi-stage build for React app
│   ├── nginx.conf           # Nginx configuration for SPA
│   └── .dockerignore        # Files to exclude from Docker build
└── terraform/
    ├── modules/             # Reusable Terraform modules
    │   ├── networking/      # VPC, subnets, gateways
    │   ├── ecr/             # Container registry
    │   ├── alb/             # Application load balancer
    │   ├── ecs/             # ECS cluster, service, task
    │   └── dns/             # Route53 and ACM certificate
    └── environments/        # Environment-specific configurations
        ├── dev/             # Development AWS environment
        ├── staging/         # Staging AWS environment
        └── prod/            # Production AWS environment
```

## Prerequisites

- Terraform >= 1.6.0
- AWS CLI configured with appropriate credentials
- Docker (for building container images)

## Local Development

For local development of the React app, you don't need any AWS infrastructure:

```bash
# From the app root directory
npm install
npm run dev
```

The app runs at http://localhost:3000 with hot reload.

## Deploying to AWS

### 1. Create Terraform State Backend

Before deploying any environment, create an S3 bucket for Terraform state:

```bash
# Via AWS Console or CLI
aws s3 mb s3://connect2-app-terraform-state-dev --region us-west-2
aws s3api put-bucket-versioning \
  --bucket connect2-app-terraform-state-dev \
  --versioning-configuration Status=Enabled
```

### 2. Configure Environment

```bash
cd infrastructure/terraform/environments/dev

# Copy example and fill in values
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your ECR image URL, etc.
```

### 3. Initialize and Deploy

```bash
terraform init
terraform plan
terraform apply
```

### 4. Build and Push Docker Image

```bash
# Get ECR login
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-west-2.amazonaws.com

# Build from app root
docker build -t connect2-app-dev:latest -f infrastructure/docker/Dockerfile .

# Tag and push
docker tag connect2-app-dev:latest <account-id>.dkr.ecr.us-west-2.amazonaws.com/connect2-app-dev:latest
docker push <account-id>.dkr.ecr.us-west-2.amazonaws.com/connect2-app-dev:latest

# Update ECS service to deploy new image
aws ecs update-service \
  --cluster connect2-app-cluster-dev \
  --service connect2-app-service-dev \
  --force-new-deployment
```

## Environment Configurations

### Development

- Minimal resources (256 CPU, 512 MB memory)
- 2 Fargate tasks (Spot instances for cost savings)
- No autoscaling
- HTTP only (no SSL certificate)
- 7-day log retention

### Staging

- Moderate resources (256 CPU, 512 MB memory)
- 2-6 Fargate tasks with autoscaling
- Fargate Spot for cost savings
- HTTPS with ACM certificate
- 14-day log retention

### Production

- Higher resources (512 CPU, 1024 MB memory)
- 3-20 Fargate tasks with autoscaling
- Standard Fargate (no Spot for reliability)
- HTTPS with ACM certificate
- 90-day log retention
- Deletion protection enabled

## Terraform Modules

### networking

Creates VPC with public and private subnets across multiple AZs.

| Variable | Description | Default |
|----------|-------------|---------|
| `vpc_cidr` | VPC CIDR block | `10.0.0.0/16` |
| `az_count` | Number of AZs | `2` |
| `enable_nat_gateway` | Enable NAT for private subnets | `true` |

### ecr

Creates ECR repository with lifecycle policies.

| Variable | Description | Default |
|----------|-------------|---------|
| `image_tag_mutability` | MUTABLE or IMMUTABLE | `MUTABLE` |
| `scan_on_push` | Enable vulnerability scanning | `true` |
| `image_count_to_keep` | Number of images to retain | `10` |

### alb

Creates Application Load Balancer with target groups.

| Variable | Description | Default |
|----------|-------------|---------|
| `container_port` | Container port | `80` |
| `health_check_path` | Health check endpoint | `/` |
| `certificate_arn` | ACM certificate ARN | `null` |

### ecs

Creates ECS Fargate cluster, service, and task definition.

| Variable | Description | Default |
|----------|-------------|---------|
| `task_cpu` | CPU units | `256` |
| `task_memory` | Memory in MB | `512` |
| `desired_count` | Number of tasks | `2` |
| `enable_autoscaling` | Enable auto scaling | `true` |

### dns

Creates Route53 records and ACM certificate.

| Variable | Description | Default |
|----------|-------------|---------|
| `domain_name` | Root domain | required |
| `subdomain` | Subdomain | `null` |
| `create_certificate` | Create ACM cert | `true` |

## CI/CD Integration

The infrastructure is designed to work with GitHub Actions:

1. **On PR**: Run `terraform plan` and post results as comment
2. **On merge to main**: Run `terraform apply` for staging
3. **On release tag**: Run `terraform apply` for production

See `.github/workflows/` for workflow definitions (to be added).

## Cost Estimates

| Environment | Monthly Cost (Estimated) |
|-------------|-------------------------|
| Development | ~$50-75 (Spot instances) |
| Staging | ~$75-150 (Spot + autoscaling) |
| Production | ~$200-500 (depends on traffic) |

## Troubleshooting

### Terraform State Issues

```bash
# Force unlock state (use with caution)
terraform force-unlock <LOCK_ID>

# Refresh state from infrastructure
terraform refresh
```

### ECS Task Failures

```bash
# View task logs in CloudWatch
aws logs get-log-events \
  --log-group-name /ecs/connect2-app-dev \
  --log-stream-name <stream-name>

# Describe task failures
aws ecs describe-tasks --cluster connect2-app-cluster-dev --tasks <task-arn>
```

### Container Won't Start

1. Check CloudWatch logs for error messages
2. Verify the Docker image exists in ECR
3. Ensure security groups allow traffic on port 80
4. Check task definition for correct image URL
