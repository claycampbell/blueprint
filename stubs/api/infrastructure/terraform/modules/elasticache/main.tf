# ElastiCache Redis Module
# Provides Redis caching layer for FastAPI application

# Security group for ElastiCache
resource "aws_security_group" "redis" {
  name        = "${var.project_name}-redis-sg-${var.environment}"
  description = "Security group for ElastiCache Redis"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Redis from allowed security groups"
    from_port       = var.port
    to_port         = var.port
    protocol        = "tcp"
    security_groups = var.allowed_security_group_ids
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-redis-sg-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Subnet group for ElastiCache
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-redis-subnet-${var.environment}"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name        = "${var.project_name}-redis-subnet-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Parameter group for Redis configuration
resource "aws_elasticache_parameter_group" "main" {
  family = "redis${var.redis_version_major}"
  name   = "${var.project_name}-redis-params-${var.environment}"

  # Memory management
  parameter {
    name  = "maxmemory-policy"
    value = var.maxmemory_policy
  }

  # Enable keyspace notifications for cache invalidation patterns
  parameter {
    name  = "notify-keyspace-events"
    value = var.notify_keyspace_events
  }

  tags = {
    Name        = "${var.project_name}-redis-params-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ElastiCache Replication Group (Redis cluster mode disabled for simpler setup)
resource "aws_elasticache_replication_group" "main" {
  replication_group_id = "${var.project_name}-redis-${var.environment}"
  description          = "Redis cluster for ${var.project_name} ${var.environment}"

  # Engine configuration
  engine               = "redis"
  engine_version       = var.redis_version
  node_type            = var.node_type
  port                 = var.port
  parameter_group_name = aws_elasticache_parameter_group.main.name

  # Cluster configuration
  num_cache_clusters         = var.num_cache_clusters
  automatic_failover_enabled = var.num_cache_clusters > 1 ? var.automatic_failover_enabled : false
  multi_az_enabled           = var.num_cache_clusters > 1 ? var.multi_az_enabled : false

  # Network configuration
  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  # Security
  at_rest_encryption_enabled = var.at_rest_encryption_enabled
  transit_encryption_enabled = var.transit_encryption_enabled
  auth_token                 = var.transit_encryption_enabled ? var.auth_token : null

  # Maintenance
  maintenance_window       = var.maintenance_window
  snapshot_window          = var.snapshot_window
  snapshot_retention_limit = var.snapshot_retention_limit
  auto_minor_version_upgrade = var.auto_minor_version_upgrade

  # Apply changes
  apply_immediately = var.apply_immediately

  tags = {
    Name        = "${var.project_name}-redis-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Store Redis connection info in Secrets Manager
resource "aws_secretsmanager_secret" "redis_credentials" {
  name        = "${var.project_name}/${var.environment}/redis-credentials"
  description = "Redis connection credentials for ${var.project_name} ${var.environment}"

  tags = {
    Name        = "${var.project_name}-redis-credentials-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_secretsmanager_secret_version" "redis_credentials" {
  secret_id = aws_secretsmanager_secret.redis_credentials.id
  secret_string = jsonencode({
    host              = aws_elasticache_replication_group.main.primary_endpoint_address
    port              = var.port
    auth_token        = var.transit_encryption_enabled ? var.auth_token : null
    ssl               = var.transit_encryption_enabled
    url               = var.transit_encryption_enabled ? "rediss://:${var.auth_token}@${aws_elasticache_replication_group.main.primary_endpoint_address}:${var.port}" : "redis://${aws_elasticache_replication_group.main.primary_endpoint_address}:${var.port}"
    reader_endpoint   = var.num_cache_clusters > 1 ? aws_elasticache_replication_group.main.reader_endpoint_address : null
  })
}

# CloudWatch alarms for Redis monitoring
resource "aws_cloudwatch_metric_alarm" "redis_cpu" {
  count = var.enable_cloudwatch_alarms ? 1 : 0

  alarm_name          = "${var.project_name}-redis-cpu-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ElastiCache"
  period              = 300
  statistic           = "Average"
  threshold           = 75
  alarm_description   = "Redis CPU utilization is high"

  dimensions = {
    CacheClusterId = "${var.project_name}-redis-${var.environment}-001"
  }

  tags = {
    Name        = "${var.project_name}-redis-cpu-alarm-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_cloudwatch_metric_alarm" "redis_memory" {
  count = var.enable_cloudwatch_alarms ? 1 : 0

  alarm_name          = "${var.project_name}-redis-memory-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "DatabaseMemoryUsagePercentage"
  namespace           = "AWS/ElastiCache"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Redis memory usage is high"

  dimensions = {
    CacheClusterId = "${var.project_name}-redis-${var.environment}-001"
  }

  tags = {
    Name        = "${var.project_name}-redis-memory-alarm-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}
