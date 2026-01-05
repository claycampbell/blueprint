# API - Production Environment
#
# This configuration deploys the FastAPI backend with its own independent infrastructure.
# Includes: VPC, ECS Cluster, ECS Service, ALB, RDS PostgreSQL, ElastiCache Redis, DNS, SSL
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
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket       = "connect2-api-terraform-state-prod"
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
      Component   = "api"
    }
  }
}

# =============================================================================
# Networking - Own VPC for API
# =============================================================================

module "networking" {
  source = "../../modules/networking"

  project_name       = "${var.project_name}-api"
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  az_count           = 3  # 3 AZs for production high availability
  enable_nat_gateway = true
}

# =============================================================================
# ECS Cluster - Own cluster for API
# =============================================================================

module "ecs_cluster" {
  source = "../../modules/ecs-cluster"

  project_name              = "${var.project_name}-api"
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

  project_name = "${var.project_name}-api"
  environment  = var.environment
  domain_name  = var.domain_name
}

# =============================================================================
# ECR Repository
# =============================================================================

module "ecr" {
  source = "../../modules/ecr"

  project_name         = "${var.project_name}-api"
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

  project_name    = "${var.project_name}-api"
  environment     = var.environment
  domain_name     = "api.${var.domain_name}"
  route53_zone_id = var.create_route53_zone ? module.route53_zone[0].zone_id : var.route53_zone_id

  subject_alternative_names = [
    "api-v1.${var.domain_name}"
  ]
}

# =============================================================================
# Application Load Balancer
# =============================================================================

module "alb" {
  source = "../../modules/alb"

  project_name               = "${var.project_name}-api"
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

  route53_zone_id = var.create_route53_zone ? module.route53_zone[0].zone_id : var.route53_zone_id
  record_name     = "api"
  alb_dns_name    = module.alb.alb_dns_name
  alb_zone_id     = module.alb.alb_zone_id
}

# =============================================================================
# RDS PostgreSQL Database
# =============================================================================

module "rds" {
  source = "../../modules/rds"

  project_name               = "${var.project_name}-api"
  environment                = var.environment
  vpc_id                     = module.networking.vpc_id
  private_subnet_ids         = module.networking.private_subnet_ids
  allowed_security_group_ids = [module.ecs_service.security_group_id]

  engine_version        = "16.4"
  engine_version_major  = "16"
  instance_class        = "db.r6g.large"
  allocated_storage     = 100
  max_allocated_storage = 500
  database_name         = var.database_name
  master_username       = var.database_username

  multi_az                     = true   # Multi-AZ for production
  backup_retention_period      = 30
  performance_insights_enabled = true
  deletion_protection          = true   # Protect production database
  skip_final_snapshot          = false
  apply_immediately            = false  # Apply during maintenance window

  depends_on = [module.ecs_service]
}

# =============================================================================
# ElastiCache Redis
# =============================================================================

module "elasticache" {
  source = "../../modules/elasticache"

  project_name               = "${var.project_name}-api"
  environment                = var.environment
  vpc_id                     = module.networking.vpc_id
  private_subnet_ids         = module.networking.private_subnet_ids
  allowed_security_group_ids = [module.ecs_service.security_group_id]

  redis_version       = "7.1"
  redis_version_major = "7"
  node_type           = "cache.r6g.large"
  num_cache_clusters  = 3  # 3 nodes for production

  automatic_failover_enabled = true
  multi_az_enabled           = true
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  snapshot_retention_limit = 7
  enable_cloudwatch_alarms = true
  apply_immediately        = false  # Apply during maintenance window

  depends_on = [module.ecs_service]
}

# =============================================================================
# ECS Service
# =============================================================================

module "ecs_service" {
  source = "../../modules/ecs-service"

  project_name = var.project_name
  service_name = "${var.project_name}-api"
  environment  = var.environment
  aws_region   = var.aws_region

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
      name  = "ENVIRONMENT"
      value = "production"
    },
    {
      name  = "LOG_LEVEL"
      value = "WARNING"
    }
  ]

  log_retention_days = 90
  use_spot           = false  # No Spot in production for stability
  enable_autoscaling = true
  cpu_target_value   = 60     # More aggressive scaling in prod
}

# =============================================================================
# Bastion Host (optional, for database access)
# =============================================================================

module "bastion" {
  source = "../../modules/bastion"
  count  = var.enable_bastion ? 1 : 0

  project_name            = "${var.project_name}-api"
  environment             = var.environment
  vpc_id                  = module.networking.vpc_id
  public_subnet_id        = module.networking.public_subnet_ids[0]
  allowed_ssh_cidr_blocks = var.bastion_allowed_cidrs
  ssh_public_key          = var.bastion_ssh_public_key
  create_elastic_ip       = true  # Static IP for production bastion
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
