variable "route53_zone_id" {
  description = "Route53 zone ID where the record will be created"
  type        = string
}

variable "record_name" {
  description = "Name of the DNS record (e.g., app, app-staging)"
  type        = string
}

variable "alias_target_dns_name" {
  description = "DNS name of the alias target (ALB or CloudFront)"
  type        = string
}

variable "alias_target_zone_id" {
  description = "Zone ID of the alias target (ALB or CloudFront)"
  type        = string
}

variable "evaluate_target_health" {
  description = "Whether to evaluate target health"
  type        = bool
  default     = false  # CloudFront doesn't support health checks in Route53
}

variable "create_ipv6_record" {
  description = "Create AAAA record for IPv6 (recommended for CloudFront)"
  type        = bool
  default     = true
}
