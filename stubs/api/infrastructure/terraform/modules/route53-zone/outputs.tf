output "zone_id" {
  description = "ID of the Route53 hosted zone"
  value       = aws_route53_zone.main.zone_id
}

output "zone_arn" {
  description = "ARN of the Route53 hosted zone"
  value       = aws_route53_zone.main.arn
}

output "name_servers" {
  description = "Name servers for the hosted zone"
  value       = aws_route53_zone.main.name_servers
}

output "domain_name" {
  description = "Domain name of the hosted zone"
  value       = aws_route53_zone.main.name
}
