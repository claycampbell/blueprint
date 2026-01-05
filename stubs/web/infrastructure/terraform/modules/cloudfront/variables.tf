variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "s3_bucket_id" {
  description = "ID of the S3 bucket to use as origin"
  type        = string
}

variable "s3_bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  type        = string
}

variable "domain_names" {
  description = "List of domain names for the distribution"
  type        = list(string)
  default     = []
}

variable "certificate_arn" {
  description = "ARN of the ACM certificate (must be in us-east-1)"
  type        = string
  default     = null
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"  # US, Canada, Europe

  validation {
    condition     = contains(["PriceClass_100", "PriceClass_200", "PriceClass_All"], var.price_class)
    error_message = "Price class must be PriceClass_100, PriceClass_200, or PriceClass_All."
  }
}

variable "default_ttl" {
  description = "Default TTL for objects (seconds)"
  type        = number
  default     = 86400  # 1 day
}

variable "max_ttl" {
  description = "Maximum TTL for objects (seconds)"
  type        = number
  default     = 604800  # 7 days
}

variable "geo_restriction_type" {
  description = "Type of geo restriction (none, whitelist, blacklist)"
  type        = string
  default     = "none"
}

variable "geo_restriction_locations" {
  description = "List of country codes for geo restriction"
  type        = list(string)
  default     = []
}

variable "web_acl_id" {
  description = "WAF Web ACL ID (optional)"
  type        = string
  default     = null
}

variable "content_security_policy" {
  description = "Content Security Policy header value"
  type        = string
  default     = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.connect.com;"
}
