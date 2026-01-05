# =============================================================================
# General Variables
# =============================================================================

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "connect2"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "staging"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

# =============================================================================
# Networking Variables
# =============================================================================

variable "vpc_cidr" {
  description = "CIDR block for the API VPC"
  type        = string
  default     = "10.1.0.0/16"
}

# =============================================================================
# DNS Variables
# =============================================================================

variable "domain_name" {
  description = "Root domain name"
  type        = string
}

variable "create_route53_zone" {
  description = "Create a new Route53 hosted zone (set to false if using existing zone)"
  type        = bool
  default     = true
}

variable "route53_zone_id" {
  description = "Existing Route53 zone ID (required if create_route53_zone is false)"
  type        = string
  default     = null
}

# =============================================================================
# Container Variables
# =============================================================================

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

# =============================================================================
# ECS Task Variables
# =============================================================================

variable "task_cpu" {
  description = "Task CPU units"
  type        = number
  default     = 512
}

variable "task_memory" {
  description = "Task memory in MB"
  type        = number
  default     = 1024
}

variable "desired_count" {
  description = "Desired task count"
  type        = number
  default     = 2
}

variable "min_capacity" {
  description = "Minimum task count for autoscaling"
  type        = number
  default     = 2
}

variable "max_capacity" {
  description = "Maximum task count for autoscaling"
  type        = number
  default     = 6
}

# =============================================================================
# Database Variables
# =============================================================================

variable "database_name" {
  description = "Name of the database"
  type        = string
  default     = "connect2"
}

variable "database_username" {
  description = "Master username for the database"
  type        = string
  default     = "postgres"
}

# =============================================================================
# Bastion Variables
# =============================================================================

variable "enable_bastion" {
  description = "Enable bastion host for database access"
  type        = bool
  default     = false
}

variable "bastion_allowed_cidrs" {
  description = "CIDR blocks allowed to SSH to bastion"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "bastion_ssh_public_key" {
  description = "SSH public key for bastion access"
  type        = string
  default     = null
}
