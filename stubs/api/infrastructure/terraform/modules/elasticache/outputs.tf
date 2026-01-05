output "replication_group_id" {
  description = "ID of the ElastiCache replication group"
  value       = aws_elasticache_replication_group.main.id
}

output "replication_group_arn" {
  description = "ARN of the ElastiCache replication group"
  value       = aws_elasticache_replication_group.main.arn
}

output "primary_endpoint_address" {
  description = "Primary endpoint address for the replication group"
  value       = aws_elasticache_replication_group.main.primary_endpoint_address
}

output "reader_endpoint_address" {
  description = "Reader endpoint address for the replication group"
  value       = aws_elasticache_replication_group.main.reader_endpoint_address
}

output "port" {
  description = "Port of the Redis cluster"
  value       = aws_elasticache_replication_group.main.port
}

output "security_group_id" {
  description = "ID of the Redis security group"
  value       = aws_security_group.redis.id
}

output "subnet_group_name" {
  description = "Name of the cache subnet group"
  value       = aws_elasticache_subnet_group.main.name
}

output "redis_credentials_secret_arn" {
  description = "ARN of the Secrets Manager secret containing Redis credentials (if TLS enabled)"
  value       = var.transit_encryption_enabled ? aws_secretsmanager_secret.redis_credentials[0].arn : null
}

output "redis_url" {
  description = "Redis connection URL (without auth token)"
  value       = "redis://${aws_elasticache_replication_group.main.primary_endpoint_address}:${aws_elasticache_replication_group.main.port}"
}
