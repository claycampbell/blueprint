variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where bastion will be created"
  type        = string
}

variable "public_subnet_id" {
  description = "Public subnet ID for bastion host"
  type        = string
}

variable "allowed_ssh_cidr_blocks" {
  description = "CIDR blocks allowed to SSH to bastion"
  type        = list(string)
  default     = []  # Empty by default - must be explicitly set
}

variable "instance_type" {
  description = "EC2 instance type for bastion"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID for bastion (uses Amazon Linux 2023 if not specified)"
  type        = string
  default     = null
}

variable "ssh_public_key" {
  description = "SSH public key for bastion access (optional if using SSM only)"
  type        = string
  default     = null
}

variable "root_volume_size" {
  description = "Root volume size in GB"
  type        = number
  default     = 8
}

variable "create_elastic_ip" {
  description = "Create Elastic IP for stable bastion address"
  type        = bool
  default     = true
}
