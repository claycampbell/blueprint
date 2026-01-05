# DNS Record Module
# Creates Route53 A record pointing to ALB or CloudFront

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_route53_record" "main" {
  zone_id = var.route53_zone_id
  name    = var.record_name
  type    = "A"

  alias {
    name                   = var.alias_target_dns_name
    zone_id                = var.alias_target_zone_id
    evaluate_target_health = var.evaluate_target_health
  }
}

# Optional AAAA record for IPv6 (CloudFront supports IPv6)
resource "aws_route53_record" "ipv6" {
  count = var.create_ipv6_record ? 1 : 0

  zone_id = var.route53_zone_id
  name    = var.record_name
  type    = "AAAA"

  alias {
    name                   = var.alias_target_dns_name
    zone_id                = var.alias_target_zone_id
    evaluate_target_health = var.evaluate_target_health
  }
}
