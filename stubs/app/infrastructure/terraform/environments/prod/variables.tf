variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "connect2-app"
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
  default     = "10.2.0.0/16"
}

variable "az_count" {
  description = "Number of availability zones"
  type        = number
  default     = 3 # 3 AZs for production HA
}

variable "enable_nat_gateway" {
  description = "Enable NAT gateway"
  type        = bool
  default     = true
}

# DNS
variable "domain_name" {
  description = "Root domain name"
  type        = string
}

variable "subdomain" {
  description = "Subdomain for this environment (null for root domain)"
  type        = string
  default     = "app" # e.g., app.example.com or null for example.com
}

variable "subject_alternative_names" {
  description = "Additional domain names for the certificate"
  type        = list(string)
  default     = [] # e.g., ["www.example.com"]
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

# ECS Task
variable "task_cpu" {
  description = "Task CPU units"
  type        = number
  default     = 512 # More CPU for production
}

variable "task_memory" {
  description = "Task memory in MB"
  type        = number
  default     = 1024 # More memory for production
}

variable "desired_count" {
  description = "Desired task count"
  type        = number
  default     = 3 # 3 tasks for production HA
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

variable "environment_variables" {
  description = "Environment variables for the container"
  type = list(object({
    name  = string
    value = string
  }))
  default = []
}
