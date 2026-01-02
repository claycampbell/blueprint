# Route53 Hosted Zone Module
# Creates a shared DNS hosted zone for the project

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_route53_zone" "main" {
  name    = var.domain_name
  comment = "${var.project_name} hosted zone - ${var.environment}"

  tags = {
    Name        = "${var.project_name}-zone-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}
