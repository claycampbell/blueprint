# These outputs are consumed by API and Web infrastructure via remote state

# Networking outputs
output "vpc_id" {
  description = "ID of the shared VPC"
  value       = module.networking.vpc_id
}

output "vpc_cidr" {
  description = "CIDR block of the shared VPC"
  value       = module.networking.vpc_cidr
}

output "public_subnet_ids" {
  description = "IDs of public subnets (for ALBs)"
  value       = module.networking.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of private subnets (for ECS tasks, RDS, Redis)"
  value       = module.networking.private_subnet_ids
}

output "availability_zones" {
  description = "Availability zones in use"
  value       = module.networking.availability_zones
}

# ECS Cluster outputs
output "ecs_cluster_id" {
  description = "ID of the shared ECS cluster"
  value       = module.ecs_cluster.cluster_id
}

output "ecs_cluster_arn" {
  description = "ARN of the shared ECS cluster"
  value       = module.ecs_cluster.cluster_arn
}

output "ecs_cluster_name" {
  description = "Name of the shared ECS cluster"
  value       = module.ecs_cluster.cluster_name
}

# Route53 outputs (conditional)
output "route53_zone_id" {
  description = "ID of the Route53 hosted zone"
  value       = var.create_route53_zone ? module.route53_zone[0].zone_id : null
}

output "route53_zone_name_servers" {
  description = "Name servers for the hosted zone"
  value       = var.create_route53_zone ? module.route53_zone[0].name_servers : null
}

# SNS outputs
output "sns_critical_topic_arn" {
  description = "ARN of the critical alerts SNS topic"
  value       = module.sns_alerts.critical_topic_arn
}

output "sns_warning_topic_arn" {
  description = "ARN of the warning alerts SNS topic"
  value       = module.sns_alerts.warning_topic_arn
}

output "sns_info_topic_arn" {
  description = "ARN of the info alerts SNS topic"
  value       = module.sns_alerts.info_topic_arn
}
