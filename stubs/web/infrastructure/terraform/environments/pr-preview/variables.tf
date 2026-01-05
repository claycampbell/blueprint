# =============================================================================
# General Variables
# =============================================================================

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "connect2"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

# =============================================================================
# PR Preview Variables
# =============================================================================

variable "pr_number" {
  description = "Pull request number for this preview"
  type        = string
}

variable "ttl_days" {
  description = "Number of days before PR preview resources expire"
  type        = number
  default     = 7
}

# =============================================================================
# DNS Variables
# =============================================================================

variable "domain_name" {
  description = "Root domain name"
  type        = string
}

variable "route53_zone_id" {
  description = "Route53 zone ID (from staging environment)"
  type        = string
}

variable "wildcard_certificate_arn" {
  description = "ARN of wildcard ACM certificate (*.app.domain.com) from staging"
  type        = string
}

# =============================================================================
# Application Variables
# =============================================================================

variable "api_url" {
  description = "URL of the Staging API backend"
  type        = string
}
