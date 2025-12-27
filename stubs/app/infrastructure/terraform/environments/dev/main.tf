# Development Environment - AWS Configuration
#
# This environment deploys to real AWS (same as staging/prod but with minimal resources)
# For local development of the React app, just run: npm run dev

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # S3 backend for state - create this bucket first via AWS Console or bootstrap
  backend "s3" {
    bucket         = "connect2-app-terraform-state-dev"
    key            = "app/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    use_lockfile   = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Networking
module "networking" {
  source = "../../modules/networking"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  az_count           = var.az_count
  enable_nat_gateway = var.enable_nat_gateway
}

# ECR Repository
module "ecr" {
  source = "../../modules/ecr"

  project_name         = var.project_name
  environment          = var.environment
  image_tag_mutability = "MUTABLE"
  scan_on_push         = true
  image_count_to_keep  = 5
}

# Application Load Balancer
module "alb" {
  source = "../../modules/alb"

  project_name               = var.project_name
  environment                = var.environment
  vpc_id                     = module.networking.vpc_id
  public_subnet_ids          = module.networking.public_subnet_ids
  container_port             = var.container_port
  health_check_path          = var.health_check_path
  certificate_arn            = null # No HTTPS for dev - add certificate_arn for HTTPS
  enable_deletion_protection = false
}

# ECS Cluster and Service
module "ecs" {
  source = "../../modules/ecs"

  project_name          = var.project_name
  environment           = var.environment
  aws_region            = var.aws_region
  vpc_id                = module.networking.vpc_id
  private_subnet_ids    = module.networking.private_subnet_ids
  alb_security_group_id = module.alb.security_group_id
  target_group_arn      = module.alb.target_group_arn

  container_image   = var.container_image
  container_port    = var.container_port
  health_check_path = var.health_check_path

  task_cpu      = var.task_cpu
  task_memory   = var.task_memory
  desired_count = var.desired_count
  min_capacity  = var.min_capacity
  max_capacity  = var.max_capacity

  environment_variables = var.environment_variables

  enable_container_insights = false
  log_retention_days        = 7
  use_spot                  = true  # Use Spot for dev to save costs
  enable_autoscaling        = false # No autoscaling for dev
}
