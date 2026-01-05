# =============================================================================
# Networking Outputs
# =============================================================================

output "vpc_id" {
  description = "ID of the Web VPC"
  value       = module.networking.vpc_id
}

output "vpc_cidr" {
  description = "CIDR block of the Web VPC"
  value       = module.networking.vpc_cidr
}

output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = module.networking.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of private subnets"
  value       = module.networking.private_subnet_ids
}

# =============================================================================
# ECS Cluster Outputs
# =============================================================================

output "ecs_cluster_id" {
  description = "ID of the ECS cluster"
  value       = module.ecs_cluster.cluster_id
}

output "ecs_cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = module.ecs_cluster.cluster_arn
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs_cluster.cluster_name
}

# =============================================================================
# ECR Outputs
# =============================================================================

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = module.ecr.repository_url
}

output "ecr_repository_name" {
  description = "ECR repository name"
  value       = module.ecr.repository_name
}

# =============================================================================
# ALB Outputs
# =============================================================================

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = module.alb.alb_dns_name
}

output "alb_arn" {
  description = "ALB ARN"
  value       = module.alb.alb_arn
}

output "target_group_arn" {
  description = "Target group ARN"
  value       = module.alb.target_group_arn
}

# =============================================================================
# ECS Service Outputs
# =============================================================================

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.ecs_service.service_name
}

output "ecs_task_definition_arn" {
  description = "ECS task definition ARN"
  value       = module.ecs_service.task_definition_arn
}

output "ecs_security_group_id" {
  description = "ECS service security group ID"
  value       = module.ecs_service.security_group_id
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group name"
  value       = module.ecs_service.log_group_name
}

# =============================================================================
# DNS/SSL Outputs
# =============================================================================

output "route53_zone_id" {
  description = "Route53 hosted zone ID"
  value       = var.create_route53_zone ? module.route53_zone[0].zone_id : var.route53_zone_id
}

output "route53_name_servers" {
  description = "Route53 name servers (if zone was created)"
  value       = var.create_route53_zone ? module.route53_zone[0].name_servers : null
}

output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = module.acm.certificate_arn
}

# =============================================================================
# Access URL
# =============================================================================

output "app_url" {
  description = "Application URL"
  value       = "https://app.${var.domain_name}"
}
