# ECS Cluster Module
# Creates an ECS Fargate cluster for API services

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster-${var.environment}"

  setting {
    name  = "containerInsights"
    value = var.enable_container_insights ? "enabled" : "disabled"
  }

  tags = {
    Name        = "${var.project_name}-cluster-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ECS Cluster Capacity Providers
resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = var.enable_spot ? ["FARGATE", "FARGATE_SPOT"] : ["FARGATE"]

  default_capacity_provider_strategy {
    base              = var.enable_spot ? 1 : 0
    weight            = var.enable_spot ? 50 : 100
    capacity_provider = "FARGATE"
  }

  dynamic "default_capacity_provider_strategy" {
    for_each = var.enable_spot ? [1] : []
    content {
      weight            = 50
      capacity_provider = "FARGATE_SPOT"
    }
  }
}
