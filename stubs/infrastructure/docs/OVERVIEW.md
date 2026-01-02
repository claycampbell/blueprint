# Shared Infrastructure Overview

This directory contains shared infrastructure resources used by both the API and Web applications.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Shared Infrastructure                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                          VPC                                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │   │
│  │  │ Public       │  │ Public       │  │ Public       │       │   │
│  │  │ Subnet AZ-a  │  │ Subnet AZ-b  │  │ Subnet AZ-c  │       │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │   │
│  │  │ Private      │  │ Private      │  │ Private      │       │   │
│  │  │ Subnet AZ-a  │  │ Subnet AZ-b  │  │ Subnet AZ-c  │       │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │   ECS Cluster   │  │  Route53 Zone   │  │   SNS Topics    │     │
│  │   (Fargate)     │  │  (DNS)          │  │   (Alerts)      │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
         │                      │                      │
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Service   │    │   Web Service   │    │  Future Service │
│  (api/)         │    │  (web/)         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## What's Shared

| Resource | Description | Why Shared |
|----------|-------------|------------|
| **VPC** | Virtual Private Cloud with public/private subnets | Single network boundary, consistent security groups |
| **NAT Gateway** | Enables private subnet internet access | Expensive resource, share to save costs |
| **ECS Cluster** | Fargate cluster for container workloads | Both services run as ECS services |
| **Route53 Zone** | DNS hosted zone for the domain | One zone per domain |
| **SNS Topics** | Alert topics (critical, warning, info) | Centralized alerting |

## What's NOT Shared

Each service (API, Web) owns:

- **ALB (Load Balancer)** - Separate domains, separate certificates
- **ECS Service & Task Definition** - Independent scaling and deployment
- **ECR Repository** - Separate container images
- **SSL Certificates** - Different subdomains
- **CloudWatch Log Groups** - Isolated logging
- **Service-specific resources** - RDS (API only), ElastiCache (API only)

## Deployment Order

**CRITICAL**: Shared infrastructure must be deployed before API or Web.

```
1. infrastructure/  →  Deploys VPC, ECS Cluster, Route53, SNS
2. api/             →  Reads shared state, deploys API service
3. web/             →  Reads shared state, deploys Web service
```

## Terraform State

Each component has its own state file in S3:

```
s3://connect2-terraform-state-{env}/
├── shared/terraform.tfstate    # This directory
├── api/terraform.tfstate       # api/ directory
└── web/terraform.tfstate       # web/ directory
```

## Remote State Access

API and Web access shared outputs via `terraform_remote_state`:

```hcl
data "terraform_remote_state" "shared" {
  backend = "s3"
  config = {
    bucket = "connect2-terraform-state-${var.environment}"
    key    = "shared/terraform.tfstate"
    region = "us-west-2"
  }
}

# Use shared resources
module "ecs_service" {
  source = "../../../../infrastructure/terraform/modules/ecs-service"

  ecs_cluster_arn  = data.terraform_remote_state.shared.outputs.ecs_cluster_arn
  vpc_id           = data.terraform_remote_state.shared.outputs.vpc_id
  # ...
}
```

## Available Outputs

After deployment, the following outputs are available to API/Web:

| Output | Description |
|--------|-------------|
| `vpc_id` | VPC ID |
| `public_subnet_ids` | List of public subnet IDs |
| `private_subnet_ids` | List of private subnet IDs |
| `ecs_cluster_arn` | ECS cluster ARN |
| `ecs_cluster_name` | ECS cluster name |
| `route53_zone_id` | Route53 hosted zone ID (if enabled) |
| `route53_zone_name` | Route53 zone name (if enabled) |
| `sns_critical_topic_arn` | Critical alerts SNS topic ARN |
| `sns_warning_topic_arn` | Warning alerts SNS topic ARN |

## Module Reference

### networking
Creates VPC with public/private subnets across multiple AZs, NAT Gateway, and route tables.

### ecs-cluster
Creates a Fargate-enabled ECS cluster with optional Container Insights.

### route53-zone
Creates a Route53 hosted zone for DNS management.

### sns-alerts
Creates SNS topics for critical, warning, and info alerts with email subscriptions.

### Reusable Modules (for API/Web)

These modules are in `infrastructure/terraform/modules/` but used by API/Web:

- **alb** - Application Load Balancer
- **ecs-service** - ECS service, task definition, IAM roles
- **acm** - SSL certificate with DNS validation
- **dns-record** - Route53 A record pointing to ALB
