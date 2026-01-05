# =============================================================================
# S3 Outputs
# =============================================================================

output "s3_bucket_name" {
  description = "Name of the S3 bucket hosting the website"
  value       = aws_s3_bucket.website.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.website.arn
}

output "s3_bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  value       = aws_s3_bucket.website.bucket_regional_domain_name
}

# =============================================================================
# CloudFront Outputs
# =============================================================================

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = module.cloudfront.distribution_arn
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = module.cloudfront.distribution_domain_name
}

# =============================================================================
# DNS/SSL Outputs
# =============================================================================

output "route53_zone_id" {
  description = "Route53 hosted zone ID"
  value       = var.create_route53_zone ? module.route53_zone[0].zone_id : var.route53_zone_id
}

output "route53_name_servers" {
  description = "Route53 name servers (if zone was created)"
  value       = var.create_route53_zone ? module.route53_zone[0].name_servers : null
}

output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = module.acm.certificate_arn
}

output "dns_record_fqdn" {
  description = "Fully qualified domain name"
  value       = module.dns_record.fqdn
}

# =============================================================================
# Access URL
# =============================================================================

output "app_url" {
  description = "Application URL"
  value       = "https://app.${var.domain_name}"
}
