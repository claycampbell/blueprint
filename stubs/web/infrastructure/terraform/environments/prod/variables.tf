variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "connect2"
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

# DNS
variable "domain_name" {
  description = "Root domain name"
  type        = string
}

# Container
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

# ECS Task - Production scale
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
  default     = 3
}

variable "min_capacity" {
  description = "Minimum task count for autoscaling"
  type        = number
  default     = 3
}

variable "max_capacity" {
  description = "Maximum task count for autoscaling"
  type        = number
  default     = 20
}
