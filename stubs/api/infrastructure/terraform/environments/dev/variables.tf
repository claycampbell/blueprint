variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "connect2-api"
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

# Networking
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.1.0.0/16"  # Different from app VPC
}

variable "az_count" {
  description = "Number of availability zones"
  type        = number
  default     = 2
}

variable "enable_nat_gateway" {
  description = "Enable NAT gateway"
  type        = bool
  default     = true
}

# Container
variable "container_image" {
  description = "Docker image to deploy"
  type        = string
}

variable "container_port" {
  description = "Container port"
  type        = number
  default     = 8000  # FastAPI default
}

variable "health_check_path" {
  description = "Health check path"
  type        = string
  default     = "/health"
}

# ECS Task
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
  default     = 2
}

variable "min_capacity" {
  description = "Minimum task count"
  type        = number
  default     = 2
}

variable "max_capacity" {
  description = "Maximum task count"
  type        = number
  default     = 4
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

# Bastion Host
variable "enable_bastion" {
  description = "Enable bastion host for database access"
  type        = bool
  default     = false
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
