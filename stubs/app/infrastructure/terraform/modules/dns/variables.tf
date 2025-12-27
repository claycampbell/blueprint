variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "domain_name" {
  description = "Root domain name (e.g., example.com)"
  type        = string
}

variable "subdomain" {
  description = "Subdomain (e.g., app, www). Set to null for root domain"
  type        = string
  default     = null
}

variable "create_hosted_zone" {
  description = "Create a new Route53 hosted zone (false to use existing)"
  type        = bool
  default     = false
}

variable "create_certificate" {
  description = "Create ACM certificate"
  type        = bool
  default     = true
}

variable "subject_alternative_names" {
  description = "Additional domain names for the certificate"
  type        = list(string)
  default     = []
}

variable "alb_dns_name" {
  description = "DNS name of the ALB (null to skip A record creation)"
  type        = string
  default     = null
}

variable "alb_zone_id" {
  description = "Zone ID of the ALB"
  type        = string
  default     = null
}

variable "enable_ipv6" {
  description = "Create AAAA record for IPv6"
  type        = bool
  default     = false
}
