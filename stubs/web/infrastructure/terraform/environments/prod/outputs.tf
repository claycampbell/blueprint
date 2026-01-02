# ECR Outputs
output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = module.ecr.repository_url
}

output "ecr_repository_name" {
  description = "ECR repository name"
  value       = module.ecr.repository_name
}

# ALB Outputs
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

# ECS Outputs
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

# DNS/SSL Outputs
output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = module.acm.certificate_arn
}

# Access URL
output "app_url" {
  description = "Application URL"
  value       = "https://app.${var.domain_name}"
}
