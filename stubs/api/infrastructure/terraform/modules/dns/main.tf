# DNS Module
# Creates Route53 hosted zone, records, and ACM certificate

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Data source for existing hosted zone (if using existing domain)
data "aws_route53_zone" "main" {
  count = var.create_hosted_zone ? 0 : 1

  name         = var.domain_name
  private_zone = false
}

# Create new hosted zone (if needed)
resource "aws_route53_zone" "main" {
  count = var.create_hosted_zone ? 1 : 0

  name = var.domain_name

  tags = {
    Name        = "${var.project_name}-zone-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

locals {
  zone_id = var.create_hosted_zone ? aws_route53_zone.main[0].zone_id : data.aws_route53_zone.main[0].zone_id
}

# ACM Certificate
resource "aws_acm_certificate" "main" {
  count = var.create_certificate ? 1 : 0

  domain_name               = var.subdomain != null ? "${var.subdomain}.${var.domain_name}" : var.domain_name
  subject_alternative_names = var.subject_alternative_names
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "${var.project_name}-cert-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# DNS validation records for ACM
resource "aws_route53_record" "cert_validation" {
  for_each = var.create_certificate ? {
    for dvo in aws_acm_certificate.main[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = local.zone_id
}

# Certificate validation
resource "aws_acm_certificate_validation" "main" {
  count = var.create_certificate ? 1 : 0

  certificate_arn         = aws_acm_certificate.main[0].arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# A Record pointing to ALB
resource "aws_route53_record" "app" {
  count = var.alb_dns_name != null ? 1 : 0

  zone_id = local.zone_id
  name    = var.subdomain != null ? "${var.subdomain}.${var.domain_name}" : var.domain_name
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}

# AAAA Record (IPv6) pointing to ALB
resource "aws_route53_record" "app_ipv6" {
  count = var.alb_dns_name != null && var.enable_ipv6 ? 1 : 0

  zone_id = local.zone_id
  name    = var.subdomain != null ? "${var.subdomain}.${var.domain_name}" : var.domain_name
  type    = "AAAA"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}
