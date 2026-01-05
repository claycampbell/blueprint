# ElastiCache Redis Module
# Creates ElastiCache Redis for the API

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
}

# Generate random auth token for Redis
resource "random_password" "redis_auth_token" {
  count            = var.transit_encryption_enabled ? 1 : 0
  length           = 32
  special          = false
}

# Security Group for ElastiCache
resource "aws_security_group" "redis" {
  name        = "${var.project_name}-redis-sg-${var.environment}"
  description = "Security group for ElastiCache Redis"
  vpc_id      = var.vpc_id

  # Allow Redis from specified security groups
  dynamic "ingress" {
    for_each = var.allowed_security_group_ids
    content {
      description     = "Redis from allowed security groups"
      from_port       = 6379
      to_port         = 6379
      protocol        = "tcp"
      security_groups = [ingress.value]
    }
  }

  # Allow Redis from specified CIDR blocks
  dynamic "ingress" {
    for_each = length(var.allowed_cidr_blocks) > 0 ? [1] : []
    content {
      description = "Redis from allowed CIDR blocks"
      from_port   = 6379
      to_port     = 6379
      protocol    = "tcp"
      cidr_blocks = var.allowed_cidr_blocks
    }
  }

  egress {
    description = "Allow all outbound"
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

# ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "main" {
  name        = "${var.project_name}-redis-subnet-${var.environment}"
  description = "Redis subnet group for ${var.project_name}"
  subnet_ids  = var.private_subnet_ids

  tags = {
    Name        = "${var.project_name}-redis-subnet-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ElastiCache Parameter Group
resource "aws_elasticache_parameter_group" "main" {
  name        = "${var.project_name}-redis-params-${var.environment}"
  family      = "redis${var.redis_version_major}"
  description = "Parameter group for ${var.project_name}"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }

  tags = {
    Name        = "${var.project_name}-redis-params-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ElastiCache Replication Group
resource "aws_elasticache_replication_group" "main" {
  replication_group_id = "${var.project_name}-redis-${var.environment}"
  description          = "Redis cluster for ${var.project_name} ${var.environment}"

  engine               = "redis"
  engine_version       = var.redis_version
  node_type            = var.node_type
  num_cache_clusters   = var.num_cache_clusters
  port                 = 6379

  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]
  parameter_group_name = aws_elasticache_parameter_group.main.name

  automatic_failover_enabled = var.automatic_failover_enabled
  multi_az_enabled           = var.multi_az_enabled

  at_rest_encryption_enabled = var.at_rest_encryption_enabled
  transit_encryption_enabled = var.transit_encryption_enabled
  auth_token                 = var.transit_encryption_enabled ? random_password.redis_auth_token[0].result : null

  snapshot_retention_limit = var.snapshot_retention_limit
  snapshot_window          = "03:00-05:00"
  maintenance_window       = "mon:05:00-mon:07:00"

  apply_immediately = var.apply_immediately

  tags = {
    Name        = "${var.project_name}-redis-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Store credentials in Secrets Manager (if auth token is used)
resource "aws_secretsmanager_secret" "redis_credentials" {
  count       = var.transit_encryption_enabled ? 1 : 0
  name        = "${var.project_name}/redis-credentials/${var.environment}"
  description = "Redis credentials for ${var.project_name} ${var.environment}"

  tags = {
    Name        = "${var.project_name}-redis-credentials-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_secretsmanager_secret_version" "redis_credentials" {
  count     = var.transit_encryption_enabled ? 1 : 0
  secret_id = aws_secretsmanager_secret.redis_credentials[0].id
  secret_string = jsonencode({
    host       = aws_elasticache_replication_group.main.primary_endpoint_address
    port       = aws_elasticache_replication_group.main.port
    auth_token = random_password.redis_auth_token[0].result
    url        = "rediss://:${random_password.redis_auth_token[0].result}@${aws_elasticache_replication_group.main.primary_endpoint_address}:${aws_elasticache_replication_group.main.port}"
  })
}

# CloudWatch Alarms (optional)
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
    CacheClusterId = aws_elasticache_replication_group.main.id
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
    CacheClusterId = aws_elasticache_replication_group.main.id
  }

  tags = {
    Name        = "${var.project_name}-redis-memory-alarm-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}
