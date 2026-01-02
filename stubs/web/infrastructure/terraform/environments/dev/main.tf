# Web Frontend - Development Environment
#
# This configuration deploys the React frontend using shared infrastructure.
# Includes: ECS Service, ALB, ECR
#
# Prerequisites: Shared infrastructure must be deployed first
# (see: infrastructure/terraform/environments/dev/)

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "connect2-terraform-state-dev"
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
    bucket = "connect2-terraform-state-dev"
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
  image_tag_mutability = "MUTABLE"
  scan_on_push         = true
  image_count_to_keep  = 5
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
  certificate_arn            = null # No HTTPS for dev - add certificate_arn for HTTPS
  enable_deletion_protection = false
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
      value = "development"
    },
    {
      name  = "API_URL"
      value = "https://api-dev.connect2.com"
    }
  ]

  log_retention_days = 7
  use_spot           = true  # Use Spot for dev to save costs
  enable_autoscaling = false # No autoscaling for dev
}
