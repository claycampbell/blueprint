variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "connect2-api"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

# Networking
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.3.0.0/16"  # Different from dev and staging
}

variable "az_count" {
  description = "Number of availability zones"
  type        = number
  default     = 3  # 3 AZs for production
}

variable "enable_nat_gateway" {
  description = "Enable NAT gateway"
  type        = bool
  default     = true
}

# DNS
variable "domain_name" {
  description = "Root domain name (e.g., example.com)"
  type        = string
}

variable "subdomain" {
  description = "Subdomain for the API (e.g., api)"
  type        = string
  default     = "api"
}

# Container
variable "container_image" {
  description = "Docker image to deploy"
  type        = string
}

variable "container_port" {
  description = "Container port"
  type        = number
  default     = 8000
}

variable "health_check_path" {
  description = "Health check path"
  type        = string
  default     = "/health"
}

# ECS Task - Production sizing
variable "task_cpu" {
  description = "Task CPU units"
  type        = number
  default     = 512  # More CPU for production
}

variable "task_memory" {
  description = "Task memory in MB"
  type        = number
  default     = 1024  # More memory for production
}

variable "desired_count" {
  description = "Desired task count"
  type        = number
  default     = 3  # More tasks for production
}

variable "min_capacity" {
  description = "Minimum task count"
  type        = number
  default     = 3
}

variable "max_capacity" {
  description = "Maximum task count"
  type        = number
  default     = 20
}

# Database
variable "database_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "connect2"
}

variable "database_username" {
  description = "Master username for PostgreSQL"
  type        = string
  default     = "postgres"
}

# Redis
variable "redis_auth_token" {
  description = "Auth token for Redis (required for transit encryption)"
  type        = string
  sensitive   = true
}

# Bastion Host
variable "enable_bastion" {
  description = "Enable bastion host for database access"
  type        = bool
  default     = true  # Recommended for production
}

variable "bastion_allowed_cidrs" {
  description = "CIDR blocks allowed to SSH to bastion"
  type        = list(string)
  default     = []
}

variable "bastion_ssh_public_key" {
  description = "SSH public key for bastion access"
  type        = string
  default     = null
}
