variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where ElastiCache will be created"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for the cache subnet group"
  type        = list(string)
}

variable "allowed_security_group_ids" {
  description = "List of security group IDs allowed to connect to Redis"
  type        = list(string)
  default     = []
}

variable "allowed_cidr_blocks" {
  description = "List of CIDR blocks allowed to connect to Redis"
  type        = list(string)
  default     = []
}

# Engine configuration
variable "redis_version" {
  description = "Redis engine version"
  type        = string
  default     = "7.1"
}

variable "redis_version_major" {
  description = "Redis major version for parameter group family"
  type        = string
  default     = "7"
}

variable "node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "num_cache_clusters" {
  description = "Number of cache clusters (nodes) in the replication group"
  type        = number
  default     = 1
}

# High availability
variable "automatic_failover_enabled" {
  description = "Enable automatic failover (requires num_cache_clusters > 1)"
  type        = bool
  default     = false
}

variable "multi_az_enabled" {
  description = "Enable Multi-AZ (requires num_cache_clusters > 1)"
  type        = bool
  default     = false
}

# Security
variable "at_rest_encryption_enabled" {
  description = "Enable encryption at rest"
  type        = bool
  default     = true
}

variable "transit_encryption_enabled" {
  description = "Enable encryption in transit (TLS)"
  type        = bool
  default     = false
}

# Backup
variable "snapshot_retention_limit" {
  description = "Number of days to retain snapshots"
  type        = number
  default     = 1
}

# Monitoring
variable "enable_cloudwatch_alarms" {
  description = "Enable CloudWatch alarms for Redis"
  type        = bool
  default     = false
}

# Lifecycle
variable "apply_immediately" {
  description = "Apply changes immediately instead of during maintenance window"
  type        = bool
  default     = false
}
