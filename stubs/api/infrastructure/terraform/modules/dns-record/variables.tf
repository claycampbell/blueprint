variable "route53_zone_id" {
  description = "Route53 zone ID where the record will be created"
  type        = string
}

variable "record_name" {
  description = "Name of the DNS record (e.g., api.connect.example.com)"
  type        = string
}

variable "alb_dns_name" {
  description = "DNS name of the ALB"
  type        = string
}

variable "alb_zone_id" {
  description = "Zone ID of the ALB"
  type        = string
}

variable "evaluate_target_health" {
  description = "Whether to evaluate target health"
  type        = bool
  default     = true
}
