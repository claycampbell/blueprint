# Web Frontend - Development Environment
#
# This configuration deploys the React frontend with its own independent infrastructure.
# Includes: VPC, ECS Cluster, ECS Service, ALB, ECR
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
    bucket       = "connect2-web-terraform-state-dev"
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
  enable_spot               = true  # Use Spot for dev to save costs
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
  source = "../../modules/alb"

  project_name               = "${var.project_name}-web"
  environment                = var.environment
  vpc_id                     = module.networking.vpc_id
  public_subnet_ids          = module.networking.public_subnet_ids
  container_port             = var.container_port
  health_check_path          = var.health_check_path
  certificate_arn            = null # No HTTPS for dev - add certificate_arn for HTTPS
  enable_deletion_protection = false
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
      value = var.api_url
    }
  ]

  log_retention_days = 7
  use_spot           = true  # Use Spot for dev to save costs
  enable_autoscaling = false # No autoscaling for dev
}
