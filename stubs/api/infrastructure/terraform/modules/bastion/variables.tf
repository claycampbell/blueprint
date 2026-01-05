variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the bastion will be created"
  type        = string
}

variable "public_subnet_id" {
  description = "Public subnet ID for the bastion host"
  type        = string
}

variable "allowed_ssh_cidr_blocks" {
  description = "List of CIDR blocks allowed to SSH to the bastion"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "ssh_public_key" {
  description = "SSH public key for the bastion (if null, use SSM Session Manager only)"
  type        = string
  default     = null
}

variable "instance_type" {
  description = "EC2 instance type for the bastion"
  type        = string
  default     = "t3.micro"
}

variable "create_elastic_ip" {
  description = "Create and associate an Elastic IP with the bastion"
  type        = bool
  default     = false
}
