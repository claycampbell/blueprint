variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the ALB will be created"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs for the ALB"
  type        = list(string)
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

variable "certificate_arn" {
  description = "ARN of ACM certificate for HTTPS (null for HTTP only)"
  type        = string
  default     = null
}

variable "enable_deletion_protection" {
  description = "Enable deletion protection on ALB"
  type        = bool
  default     = false
}
