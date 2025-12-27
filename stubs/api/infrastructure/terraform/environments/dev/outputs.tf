output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = module.alb.alb_dns_name
}

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = module.ecr.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.ecs.service_name
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = module.rds.db_instance_endpoint
}

output "rds_credentials_secret_arn" {
  description = "ARN of the RDS credentials secret"
  value       = module.rds.db_credentials_secret_arn
}

output "redis_endpoint" {
  description = "Redis endpoint"
  value       = module.elasticache.primary_endpoint_address
}

output "redis_credentials_secret_arn" {
  description = "ARN of the Redis credentials secret"
  value       = module.elasticache.redis_credentials_secret_arn
}

output "bastion_public_ip" {
  description = "Bastion host public IP (if enabled)"
  value       = var.enable_bastion ? module.bastion[0].public_ip : null
}

output "bastion_ssh_command" {
  description = "SSH command for bastion (if enabled)"
  value       = var.enable_bastion ? module.bastion[0].ssh_connection_string : null
}
