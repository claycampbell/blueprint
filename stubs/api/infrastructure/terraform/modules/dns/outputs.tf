output "zone_id" {
  description = "Route53 hosted zone ID"
  value       = local.zone_id
}

output "zone_name" {
  description = "Route53 hosted zone name"
  value       = var.domain_name
}

output "certificate_arn" {
  description = "ARN of the ACM certificate"
  value       = var.create_certificate ? aws_acm_certificate.main[0].arn : null
}

output "certificate_domain_name" {
  description = "Domain name of the certificate"
  value       = var.create_certificate ? aws_acm_certificate.main[0].domain_name : null
}

output "certificate_status" {
  description = "Status of the certificate"
  value       = var.create_certificate ? aws_acm_certificate.main[0].status : null
}

output "app_fqdn" {
  description = "Fully qualified domain name for the API"
  value       = var.subdomain != null ? "${var.subdomain}.${var.domain_name}" : var.domain_name
}

output "nameservers" {
  description = "Nameservers for the hosted zone (only if created)"
  value       = var.create_hosted_zone ? aws_route53_zone.main[0].name_servers : null
}
