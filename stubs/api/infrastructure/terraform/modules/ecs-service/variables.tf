variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "service_name" {
  description = "Name of the service (e.g., 'api', 'web')"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

# Infrastructure inputs
variable "ecs_cluster_arn" {
  description = "ARN of the ECS cluster"
  type        = string
}

variable "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where ECS will be deployed"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for ECS tasks"
  type        = list(string)
}

# ALB inputs
variable "alb_security_group_id" {
  description = "Security group ID of the ALB"
  type        = string
}

variable "target_group_arn" {
  description = "ARN of the ALB target group"
  type        = string
}

# Container configuration
variable "container_image" {
  description = "Docker image to run"
  type        = string
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 8000
}

variable "health_check_path" {
  description = "Path for health check"
  type        = string
  default     = "/health"
}

# Resource allocation
variable "task_cpu" {
  description = "CPU units for the task (256, 512, 1024, 2048, 4096)"
  type        = number
  default     = 256
}

variable "task_memory" {
  description = "Memory for the task in MB"
  type        = number
  default     = 512
}

# Scaling configuration
variable "desired_count" {
  description = "Desired number of tasks"
  type        = number
  default     = 2
}

variable "min_capacity" {
  description = "Minimum number of tasks for autoscaling"
  type        = number
  default     = 2
}

variable "max_capacity" {
  description = "Maximum number of tasks for autoscaling"
  type        = number
  default     = 10
}

variable "enable_autoscaling" {
  description = "Enable auto scaling"
  type        = bool
  default     = true
}

variable "cpu_target_value" {
  description = "Target CPU utilization for autoscaling"
  type        = number
  default     = 70
}

variable "memory_target_value" {
  description = "Target memory utilization for autoscaling"
  type        = number
  default     = 80
}

# Environment and secrets
variable "environment_variables" {
  description = "Environment variables for the container"
  type = list(object({
    name  = string
    value = string
  }))
  default = []
}

variable "secrets" {
  description = "Secrets to inject from Secrets Manager"
  type = list(object({
    name      = string
    valueFrom = string
  }))
  default = []
}

variable "secrets_arns" {
  description = "List of Secrets Manager ARNs the task needs access to"
  type        = list(string)
  default     = []
}

# Operational settings
variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "use_spot" {
  description = "Use Fargate Spot for cost savings"
  type        = bool
  default     = false
}
