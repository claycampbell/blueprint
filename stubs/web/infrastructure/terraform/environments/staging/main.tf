# Web Frontend - Staging Environment
#
# This configuration deploys the React frontend using shared infrastructure.
# Includes: ECS Service, ALB, ECR, DNS, SSL Certificate
#
# Prerequisites: Shared infrastructure must be deployed first
# (see: infrastructure/terraform/environments/staging/)

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "connect2-terraform-state-staging"
    key          = "web/terraform.tfstate"
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
# Remote State - Shared Infrastructure
# =============================================================================

data "terraform_remote_state" "shared" {
  backend = "s3"
  config = {
    bucket = "connect2-terraform-state-staging"
    key    = "shared/terraform.tfstate"
    region = "us-west-2"
  }
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
  image_count_to_keep  = 10
}

# =============================================================================
# SSL Certificate
# =============================================================================

module "acm" {
  source = "../../../../infrastructure/terraform/modules/acm"

  project_name = "${var.project_name}-web"
  environment  = var.environment
  domain_name  = "app-staging.${var.domain_name}"
  zone_id      = data.terraform_remote_state.shared.outputs.route53_zone_id
}

# =============================================================================
# Application Load Balancer
# =============================================================================

module "alb" {
  source = "../../../../infrastructure/terraform/modules/alb"

  project_name               = "${var.project_name}-web"
  environment                = var.environment
  vpc_id                     = data.terraform_remote_state.shared.outputs.vpc_id
  public_subnet_ids          = data.terraform_remote_state.shared.outputs.public_subnet_ids
  container_port             = var.container_port
  health_check_path          = var.health_check_path
  certificate_arn            = module.acm.certificate_arn
  enable_deletion_protection = false
}

# =============================================================================
# DNS Record
# =============================================================================

module "dns_record" {
  source = "../../../../infrastructure/terraform/modules/dns-record"

  zone_id          = data.terraform_remote_state.shared.outputs.route53_zone_id
  record_name      = "app-staging"
  alb_dns_name     = module.alb.alb_dns_name
  alb_zone_id      = module.alb.alb_zone_id
}

# =============================================================================
# ECS Service (uses shared cluster)
# =============================================================================

module "ecs_service" {
  source = "../../../../infrastructure/terraform/modules/ecs-service"

  project_name   = var.project_name
  service_name   = "${var.project_name}-web"
  environment    = var.environment
  aws_region     = var.aws_region

  # Shared infrastructure
  ecs_cluster_arn    = data.terraform_remote_state.shared.outputs.ecs_cluster_arn
  ecs_cluster_name   = data.terraform_remote_state.shared.outputs.ecs_cluster_name
  vpc_id             = data.terraform_remote_state.shared.outputs.vpc_id
  private_subnet_ids = data.terraform_remote_state.shared.outputs.private_subnet_ids

  # ALB
  alb_security_group_id = module.alb.security_group_id
  target_group_arn      = module.alb.target_group_arn

  # Container configuration
  container_image   = var.container_image
  container_port    = var.container_port
  health_check_path = var.health_check_path

  # Resources
  task_cpu      = var.task_cpu
  task_memory   = var.task_memory
  desired_count = var.desired_count
  min_capacity  = var.min_capacity
  max_capacity  = var.max_capacity

  # Environment variables
  environment_variables = [
    {
      name  = "NODE_ENV"
      value = "staging"
    },
    {
      name  = "API_URL"
      value = "https://api-staging.${var.domain_name}"
    }
  ]

  log_retention_days = 14
  use_spot           = true  # Use Spot for staging to save costs
  enable_autoscaling = true
}
