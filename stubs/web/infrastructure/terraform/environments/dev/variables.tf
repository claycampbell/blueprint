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
  default     = "dev"
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
  description = "CIDR block for the Web VPC"
  type        = string
  default     = "10.2.0.0/16"
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
  default     = 80
}

variable "health_check_path" {
  description = "Health check path"
  type        = string
  default     = "/"
}

# =============================================================================
# ECS Task Variables
# =============================================================================

variable "task_cpu" {
  description = "Task CPU units"
  type        = number
  default     = 256
}

variable "task_memory" {
  description = "Task memory in MB"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Desired task count"
  type        = number
  default     = 1
}

variable "min_capacity" {
  description = "Minimum task count for autoscaling"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum task count for autoscaling"
  type        = number
  default     = 2
}

# =============================================================================
# Application Variables
# =============================================================================

variable "api_url" {
  description = "URL of the API backend"
  type        = string
  default     = "https://api-dev.connect2.com"
}
