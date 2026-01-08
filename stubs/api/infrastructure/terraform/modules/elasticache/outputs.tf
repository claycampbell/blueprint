# ElastiCache Redis Module Outputs

output "replication_group_id" {
  description = "The ID of the ElastiCache replication group"
  value       = aws_elasticache_replication_group.main.id
}

output "replication_group_arn" {
  description = "The ARN of the ElastiCache replication group"
  value       = aws_elasticache_replication_group.main.arn
}

output "primary_endpoint_address" {
  description = "The address of the primary endpoint"
  value       = aws_elasticache_replication_group.main.primary_endpoint_address
}

output "reader_endpoint_address" {
  description = "The address of the reader endpoint"
  value       = var.num_cache_clusters > 1 ? aws_elasticache_replication_group.main.reader_endpoint_address : null
}

output "port" {
  description = "The Redis port"
  value       = var.port
}

output "security_group_id" {
  description = "The security group ID for ElastiCache"
  value       = aws_security_group.redis.id
}

output "subnet_group_name" {
  description = "The ElastiCache subnet group name"
  value       = aws_elasticache_subnet_group.main.name
}

output "parameter_group_name" {
  description = "The ElastiCache parameter group name"
  value       = aws_elasticache_parameter_group.main.name
}

output "redis_credentials_secret_arn" {
  description = "ARN of the Secrets Manager secret containing Redis credentials"
  value       = aws_secretsmanager_secret.redis_credentials.arn
}

output "redis_credentials_secret_name" {
  description = "Name of the Secrets Manager secret containing Redis credentials"
  value       = aws_secretsmanager_secret.redis_credentials.name
}

output "connection_info" {
  description = "Redis connection information"
  value = {
    host       = aws_elasticache_replication_group.main.primary_endpoint_address
    port       = var.port
    ssl        = var.transit_encryption_enabled
    secret_arn = aws_secretsmanager_secret.redis_credentials.arn
  }
  sensitive = true
}
