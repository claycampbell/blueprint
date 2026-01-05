variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where RDS will be created"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for the DB subnet group"
  type        = list(string)
}

variable "allowed_security_group_ids" {
  description = "List of security group IDs allowed to connect to RDS"
  type        = list(string)
  default     = []
}

variable "allowed_cidr_blocks" {
  description = "List of CIDR blocks allowed to connect to RDS"
  type        = list(string)
  default     = []
}

# Engine configuration
variable "engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "16.4"
}

variable "engine_version_major" {
  description = "PostgreSQL major version for parameter group family"
  type        = string
  default     = "16"
}

variable "instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

# Storage configuration
variable "allocated_storage" {
  description = "Initial allocated storage in GB"
  type        = number
  default     = 20
}

variable "max_allocated_storage" {
  description = "Maximum allocated storage for autoscaling in GB"
  type        = number
  default     = 100
}

# Database configuration
variable "database_name" {
  description = "Name of the default database"
  type        = string
  default     = "connect2"
}

variable "master_username" {
  description = "Master username for the database"
  type        = string
  default     = "postgres"
}

# High availability
variable "multi_az" {
  description = "Enable Multi-AZ deployment"
  type        = bool
  default     = false
}

# Backup configuration
variable "backup_retention_period" {
  description = "Backup retention period in days"
  type        = number
  default     = 7
}

# Performance and monitoring
variable "performance_insights_enabled" {
  description = "Enable Performance Insights"
  type        = bool
  default     = false
}

# Lifecycle configuration
variable "deletion_protection" {
  description = "Enable deletion protection"
  type        = bool
  default     = false
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot on deletion"
  type        = bool
  default     = false
}

variable "apply_immediately" {
  description = "Apply changes immediately instead of during maintenance window"
  type        = bool
  default     = false
}
