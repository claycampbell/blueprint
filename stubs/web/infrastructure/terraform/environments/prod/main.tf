# Web Frontend - Production Environment
#
# This configuration deploys the React frontend with its own independent infrastructure.
# Includes: VPC, ECS Cluster, ECS Service, ALB, ECR, DNS, SSL Certificate
#
# This infrastructure is fully self-contained and can be deployed to any AWS account
# without dependencies on shared infrastructure.

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "connect2-web-terraform-state-prod"
    key          = "terraform.tfstate"
    region       = "us-west-2"
    encrypt      = true
    use_lockfile = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
      Component   = "web"
    }
  }
}

# =============================================================================
# Networking - Own VPC for Web
# =============================================================================

module "networking" {
  source = "../../modules/networking"

  project_name       = "${var.project_name}-web"
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  az_count           = 2
  enable_nat_gateway = true
}

# =============================================================================
# ECS Cluster - Own cluster for Web
# =============================================================================

module "ecs_cluster" {
  source = "../../modules/ecs-cluster"

  project_name              = "${var.project_name}-web"
  environment               = var.environment
  enable_container_insights = true
  enable_spot               = false  # No Spot in production for stability
}

# =============================================================================
# Route53 Hosted Zone (optional - create own or use existing)
# =============================================================================

module "route53_zone" {
  source = "../../modules/route53-zone"
  count  = var.create_route53_zone ? 1 : 0

  project_name = "${var.project_name}-web"
  environment  = var.environment
  domain_name  = var.domain_name
}

# =============================================================================
# ECR Repository
# =============================================================================

module "ecr" {
  source = "../../modules/ecr"

  project_name         = "${var.project_name}-web"
  environment          = var.environment
  image_tag_mutability = "IMMUTABLE"
  scan_on_push         = true
  image_count_to_keep  = 20
}

# =============================================================================
# SSL Certificate
# =============================================================================

module "acm" {
  source = "../../modules/acm"

  project_name      = "${var.project_name}-web"
  environment       = var.environment
  domain_name       = "app.${var.domain_name}"
  route53_zone_id   = var.create_route53_zone ? module.route53_zone[0].zone_id : var.route53_zone_id

  subject_alternative_names = [
    "www.${var.domain_name}"
  ]
}

# =============================================================================
# Application Load Balancer
# =============================================================================

module "alb" {
  source = "../../modules/alb"

  project_name               = "${var.project_name}-web"
  environment                = var.environment
  vpc_id                     = module.networking.vpc_id
  public_subnet_ids          = module.networking.public_subnet_ids
  container_port             = var.container_port
  health_check_path          = var.health_check_path
  certificate_arn            = module.acm.certificate_arn
  enable_deletion_protection = true  # Protect production ALB
}

# =============================================================================
# DNS Record
# =============================================================================

module "dns_record" {
  source = "../../modules/dns-record"

  route53_zone_id    = var.create_route53_zone ? module.route53_zone[0].zone_id : var.route53_zone_id
  record_name        = "app"
  alb_dns_name       = module.alb.alb_dns_name
  alb_zone_id        = module.alb.alb_zone_id
}

# =============================================================================
# ECS Service
# =============================================================================

module "ecs_service" {
  source = "../../modules/ecs-service"

  project_name   = var.project_name
  service_name   = "${var.project_name}-web"
  environment    = var.environment
  aws_region     = var.aws_region

  # Own infrastructure
  ecs_cluster_arn    = module.ecs_cluster.cluster_arn
  ecs_cluster_name   = module.ecs_cluster.cluster_name
  vpc_id             = module.networking.vpc_id
  private_subnet_ids = module.networking.private_subnet_ids

  # ALB
  alb_security_group_id = module.alb.security_group_id
  target_group_arn      = module.alb.target_group_arn

  # Container configuration
  container_image   = var.container_image
  container_port    = var.container_port
  health_check_path = var.health_check_path

  # Resources - Production scale
  task_cpu      = var.task_cpu
  task_memory   = var.task_memory
  desired_count = var.desired_count
  min_capacity  = var.min_capacity
  max_capacity  = var.max_capacity

  # Environment variables
  environment_variables = [
    {
      name  = "NODE_ENV"
      value = "production"
    },
    {
      name  = "API_URL"
      value = var.api_url
    }
  ]

  log_retention_days = 90
  use_spot           = false  # No Spot in production for stability
  enable_autoscaling = true
  cpu_target_value   = 60     # More aggressive scaling in prod
}
