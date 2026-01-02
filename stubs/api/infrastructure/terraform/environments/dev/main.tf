# API - Development Environment
#
# This configuration deploys the FastAPI backend using shared infrastructure.
# Includes: ECS Service, ALB, RDS PostgreSQL, ElastiCache Redis
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
    key          = "api/terraform.tfstate"
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
      Component   = "api"
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

  project_name         = "${var.project_name}-api"
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

  project_name               = "${var.project_name}-api"
  environment                = var.environment
  vpc_id                     = data.terraform_remote_state.shared.outputs.vpc_id
  public_subnet_ids          = data.terraform_remote_state.shared.outputs.public_subnet_ids
  container_port             = var.container_port
  health_check_path          = var.health_check_path
  certificate_arn            = null # No HTTPS for dev - add certificate_arn for HTTPS
  enable_deletion_protection = false
}

# =============================================================================
# RDS PostgreSQL Database
# =============================================================================

module "rds" {
  source = "../../modules/rds"

  project_name               = "${var.project_name}-api"
  environment                = var.environment
  vpc_id                     = data.terraform_remote_state.shared.outputs.vpc_id
  private_subnet_ids         = data.terraform_remote_state.shared.outputs.private_subnet_ids
  allowed_security_group_ids = [module.ecs_service.security_group_id]

  engine_version        = "16.4"
  engine_version_major  = "16"
  instance_class        = "db.t3.micro"
  allocated_storage     = 20
  max_allocated_storage = 50
  database_name         = var.database_name
  master_username       = var.database_username

  multi_az                     = false
  backup_retention_period      = 7
  performance_insights_enabled = false
  deletion_protection          = false
  skip_final_snapshot          = true
  apply_immediately            = true

  depends_on = [module.ecs_service]
}

# =============================================================================
# ElastiCache Redis
# =============================================================================

module "elasticache" {
  source = "../../modules/elasticache"

  project_name               = "${var.project_name}-api"
  environment                = var.environment
  vpc_id                     = data.terraform_remote_state.shared.outputs.vpc_id
  private_subnet_ids         = data.terraform_remote_state.shared.outputs.private_subnet_ids
  allowed_security_group_ids = [module.ecs_service.security_group_id]

  redis_version       = "7.1"
  redis_version_major = "7"
  node_type           = "cache.t3.micro"
  num_cache_clusters  = 1

  automatic_failover_enabled = false
  multi_az_enabled           = false
  at_rest_encryption_enabled = true
  transit_encryption_enabled = false

  snapshot_retention_limit = 1
  enable_cloudwatch_alarms = false
  apply_immediately        = true

  depends_on = [module.ecs_service]
}

# =============================================================================
# ECS Service (uses shared cluster)
# =============================================================================

module "ecs_service" {
  source = "../../../../infrastructure/terraform/modules/ecs-service"

  project_name     = var.project_name
  service_name     = "${var.project_name}-api"
  environment      = var.environment
  aws_region       = var.aws_region

  # Shared infrastructure
  ecs_cluster_arn  = data.terraform_remote_state.shared.outputs.ecs_cluster_arn
  ecs_cluster_name = data.terraform_remote_state.shared.outputs.ecs_cluster_name
  vpc_id           = data.terraform_remote_state.shared.outputs.vpc_id
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
      name  = "ENVIRONMENT"
      value = "development"
    },
    {
      name  = "LOG_LEVEL"
      value = "DEBUG"
    }
  ]

  # Secrets will be added once RDS and ElastiCache are created
  # secrets = [
  #   {
  #     name      = "DATABASE_URL"
  #     valueFrom = "${module.rds.db_credentials_secret_arn}:url::"
  #   },
  #   {
  #     name      = "REDIS_URL"
  #     valueFrom = "${module.elasticache.redis_credentials_secret_arn}:url::"
  #   }
  # ]
  # secrets_arns = [
  #   module.rds.db_credentials_secret_arn,
  #   module.elasticache.redis_credentials_secret_arn
  # ]

  log_retention_days = 7
  use_spot           = true  # Use Spot for dev to save costs
  enable_autoscaling = false # No autoscaling for dev
}

# =============================================================================
# Bastion Host (optional, for database access)
# =============================================================================

module "bastion" {
  source = "../../modules/bastion"
  count  = var.enable_bastion ? 1 : 0

  project_name            = "${var.project_name}-api"
  environment             = var.environment
  vpc_id                  = data.terraform_remote_state.shared.outputs.vpc_id
  public_subnet_id        = data.terraform_remote_state.shared.outputs.public_subnet_ids[0]
  allowed_ssh_cidr_blocks = var.bastion_allowed_cidrs
  ssh_public_key          = var.bastion_ssh_public_key
  create_elastic_ip       = false
}

# Update RDS security group to allow bastion access
resource "aws_security_group_rule" "rds_bastion" {
  count = var.enable_bastion ? 1 : 0

  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = module.bastion[0].security_group_id
  security_group_id        = module.rds.db_security_group_id
  description              = "PostgreSQL from bastion"
}

# Update ElastiCache security group to allow bastion access
resource "aws_security_group_rule" "redis_bastion" {
  count = var.enable_bastion ? 1 : 0

  type                     = "ingress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "tcp"
  source_security_group_id = module.bastion[0].security_group_id
  security_group_id        = module.elasticache.security_group_id
  description              = "Redis from bastion"
}
