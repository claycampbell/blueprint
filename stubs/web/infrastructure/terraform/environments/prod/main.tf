# Web Frontend - Production Environment
#
# This configuration deploys the React frontend as a static SPA to S3 + CloudFront.
# No VPC, ECS, or containers - just static hosting with global CDN.
#
# This infrastructure is fully self-contained and can be deployed to any AWS account
# without dependencies on shared infrastructure.

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "connect2-web-terraform-state-prod"
    key          = "terraform.tfstate"
    region       = "us-west-2"
    encrypt      = true
    use_lockfile = true
  }
}

# Default provider for most resources
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
      Component   = "web"
    }
  }
}

# us-east-1 provider required for CloudFront ACM certificates
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
      Component   = "web"
    }
  }
}

# =============================================================================
# Route53 Hosted Zone (optional - create own or use existing)
# =============================================================================

module "route53_zone" {
  source = "../../modules/route53-zone"
  count  = var.create_route53_zone ? 1 : 0

  project_name = "${var.project_name}-web"
  environment  = var.environment
  domain_name  = var.domain_name
}

locals {
  route53_zone_id = var.create_route53_zone ? module.route53_zone[0].zone_id : var.route53_zone_id
  full_domain     = "app.${var.domain_name}"
}

# =============================================================================
# SSL Certificate (must be in us-east-1 for CloudFront)
# =============================================================================

module "acm" {
  source = "../../modules/acm"
  providers = {
    aws = aws.us_east_1
  }

  project_name    = "${var.project_name}-web"
  environment     = var.environment
  domain_name     = local.full_domain
  route53_zone_id = local.route53_zone_id

  # Include www subdomain for production
  subject_alternative_names = [
    "www.${var.domain_name}"
  ]
}

# =============================================================================
# CloudFront Distribution (must be created before S3 bucket policy)
# =============================================================================

module "cloudfront" {
  source = "../../modules/cloudfront"

  project_name                   = var.project_name
  environment                    = var.environment
  s3_bucket_id                   = aws_s3_bucket.website.id
  s3_bucket_regional_domain_name = aws_s3_bucket.website.bucket_regional_domain_name
  domain_names                   = [local.full_domain, "www.${var.domain_name}"]
  certificate_arn                = module.acm.certificate_arn
  price_class                    = "PriceClass_All"  # Global distribution for production

  content_security_policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ${var.api_url};"
}

# =============================================================================
# S3 Bucket for Static Website
# =============================================================================

resource "aws_s3_bucket" "website" {
  bucket = "${var.project_name}-web-${var.environment}"

  tags = {
    Name        = "${var.project_name}-web-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Block all public access - CloudFront will access via OAC
resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning for rollback capability
resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Lifecycle rules to clean up old versions (longer retention for production)
resource "aws_s3_bucket_lifecycle_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    id     = "cleanup-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 90  # Longer retention for production
    }
  }
}

# Bucket policy allowing CloudFront OAC access
resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontOAC"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.website.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = module.cloudfront.distribution_arn
          }
        }
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.website]
}

# =============================================================================
# DNS Records
# =============================================================================

module "dns_record" {
  source = "../../modules/dns-record"

  route53_zone_id       = local.route53_zone_id
  record_name           = "app"
  alias_target_dns_name = module.cloudfront.distribution_domain_name
  alias_target_zone_id  = module.cloudfront.distribution_hosted_zone_id
  create_ipv6_record    = true
}

# WWW redirect record
module "dns_record_www" {
  source = "../../modules/dns-record"

  route53_zone_id       = local.route53_zone_id
  record_name           = "www"
  alias_target_dns_name = module.cloudfront.distribution_domain_name
  alias_target_zone_id  = module.cloudfront.distribution_hosted_zone_id
  create_ipv6_record    = true
}
