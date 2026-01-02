# Shared Infrastructure - Development Environment
#
# This configuration creates shared resources used by both API and Web applications:
# - VPC and networking
# - ECS Cluster
# - Route53 hosted zone
# - SNS alert topics

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
    key          = "shared/terraform.tfstate"
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
      Component   = "shared"
    }
  }
}

# Networking (VPC, Subnets, NAT Gateway)
module "networking" {
  source = "../../modules/networking"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  az_count           = var.az_count
  enable_nat_gateway = var.enable_nat_gateway
}

# ECS Cluster (shared by all services)
module "ecs_cluster" {
  source = "../../modules/ecs-cluster"

  project_name              = var.project_name
  environment               = var.environment
  enable_container_insights = var.enable_container_insights
  enable_spot               = var.enable_spot
}

# Route53 Hosted Zone (if managing DNS)
module "route53_zone" {
  source = "../../modules/route53-zone"
  count  = var.create_route53_zone ? 1 : 0

  project_name = var.project_name
  environment  = var.environment
  domain_name  = var.domain_name
}

# SNS Alert Topics
module "sns_alerts" {
  source = "../../modules/sns-alerts"

  project_name          = var.project_name
  environment           = var.environment
  critical_alert_emails = var.critical_alert_emails
  warning_alert_emails  = var.warning_alert_emails
}
