# RDS PostgreSQL Module
# Creates RDS PostgreSQL database for the API

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

# Generate random password for database
resource "random_password" "db_password" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# Security Group for RDS
resource "aws_security_group" "db" {
  name        = "${var.project_name}-db-sg-${var.environment}"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = var.vpc_id

  # Allow PostgreSQL from specified security groups
  dynamic "ingress" {
    for_each = var.allowed_security_group_ids
    content {
      description     = "PostgreSQL from allowed security groups"
      from_port       = 5432
      to_port         = 5432
      protocol        = "tcp"
      security_groups = [ingress.value]
    }
  }

  # Allow PostgreSQL from specified CIDR blocks
  dynamic "ingress" {
    for_each = length(var.allowed_cidr_blocks) > 0 ? [1] : []
    content {
      description = "PostgreSQL from allowed CIDR blocks"
      from_port   = 5432
      to_port     = 5432
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
    Name        = "${var.project_name}-db-sg-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name        = "${var.project_name}-db-subnet-${var.environment}"
  description = "DB subnet group for ${var.project_name}"
  subnet_ids  = var.private_subnet_ids

  tags = {
    Name        = "${var.project_name}-db-subnet-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# DB Parameter Group
resource "aws_db_parameter_group" "main" {
  name        = "${var.project_name}-db-params-${var.environment}"
  family      = "postgres${var.engine_version_major}"
  description = "Parameter group for ${var.project_name}"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000" # Log queries taking more than 1 second
  }

  tags = {
    Name        = "${var.project_name}-db-params-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }

  lifecycle {
    create_before_destroy = true
  }
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-db-${var.environment}"

  engine               = "postgres"
  engine_version       = var.engine_version
  instance_class       = var.instance_class
  allocated_storage    = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type         = "gp3"
  storage_encrypted    = true

  db_name  = var.database_name
  username = var.master_username
  password = random_password.db_password.result
  port     = 5432

  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name   = aws_db_parameter_group.main.name

  multi_az               = var.multi_az
  publicly_accessible    = false
  deletion_protection    = var.deletion_protection
  skip_final_snapshot    = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : "${var.project_name}-db-final-${var.environment}"

  backup_retention_period = var.backup_retention_period
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  performance_insights_enabled          = var.performance_insights_enabled
  performance_insights_retention_period = var.performance_insights_enabled ? 7 : null

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  apply_immediately = var.apply_immediately

  tags = {
    Name        = "${var.project_name}-db-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Store credentials in Secrets Manager
resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${var.project_name}/db-credentials/${var.environment}"
  description = "Database credentials for ${var.project_name} ${var.environment}"

  tags = {
    Name        = "${var.project_name}-db-credentials-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = aws_db_instance.main.username
    password = random_password.db_password.result
    host     = aws_db_instance.main.address
    port     = aws_db_instance.main.port
    database = aws_db_instance.main.db_name
    url      = "postgresql://${aws_db_instance.main.username}:${random_password.db_password.result}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/${aws_db_instance.main.db_name}"
  })
}
