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
# Application Variables
# =============================================================================

variable "api_url" {
  description = "URL of the API backend (used for CSP headers)"
  type        = string
}
