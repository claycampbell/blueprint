# Web Frontend - PR Preview Environment
#
# This configuration creates ephemeral S3 + CloudFront deployments for pull request previews.
# Each PR gets its own S3 bucket prefix and CloudFront distribution for isolated testing.
#
# PR previews connect to the STAGING API for backend functionality.
# This allows QA testing of frontend changes against a stable API environment.
#
# Usage:
#   terraform apply -var="pr_number=123"
#   terraform destroy -var="pr_number=123"

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "connect2-web-terraform-state-staging"
    key          = "pr-previews/terraform.tfstate"  # Shared state for all PR previews
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
      Environment = "pr-preview"
      ManagedBy   = "terraform"
      Component   = "web"
      PRNumber    = var.pr_number
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
      Environment = "pr-preview"
      ManagedBy   = "terraform"
      Component   = "web"
      PRNumber    = var.pr_number
    }
  }
}

# =============================================================================
# Local Values
# =============================================================================

locals {
  preview_subdomain = "pr-${var.pr_number}"
  full_domain       = "${local.preview_subdomain}.app.${var.domain_name}"
}

# =============================================================================
# S3 Bucket for PR Preview
# =============================================================================

resource "aws_s3_bucket" "preview" {
  bucket = "${var.project_name}-web-pr-${var.pr_number}"

  tags = {
    Name     = "${var.project_name}-web-pr-${var.pr_number}"
    PRNumber = var.pr_number
    TTL      = var.ttl_days
  }

  lifecycle {
    prevent_destroy = false  # Allow destruction of PR preview buckets
  }
}

# Block all public access - CloudFront will access via OAC
resource "aws_s3_bucket_public_access_block" "preview" {
  bucket = aws_s3_bucket.preview.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "preview" {
  bucket = aws_s3_bucket.preview.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Lifecycle rule to auto-expire old objects
resource "aws_s3_bucket_lifecycle_configuration" "preview" {
  bucket = aws_s3_bucket.preview.id

  rule {
    id     = "auto-expire"
    status = "Enabled"

    expiration {
      days = var.ttl_days
    }
  }
}

# =============================================================================
# CloudFront Distribution for PR Preview
# =============================================================================

# Origin Access Control for secure S3 access
resource "aws_cloudfront_origin_access_control" "preview" {
  name                              = "${var.project_name}-web-pr-${var.pr_number}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "preview" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "PR Preview #${var.pr_number}"
  price_class         = "PriceClass_100"  # US, Canada, Europe only for cost savings
  aliases             = [local.full_domain]

  origin {
    domain_name              = aws_s3_bucket.preview.bucket_regional_domain_name
    origin_id                = "s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.preview.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id            = "658327ea-f89d-4fab-a63d-7e88639e58f6"  # CachingOptimized
    origin_request_policy_id   = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf"  # CORS-S3Origin
    response_headers_policy_id = aws_cloudfront_response_headers_policy.preview.id
  }

  # SPA routing - serve index.html for 404s
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.wildcard_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = {
    Name     = "${var.project_name}-web-pr-${var.pr_number}"
    PRNumber = var.pr_number
  }
}

# Response headers policy with security headers
resource "aws_cloudfront_response_headers_policy" "preview" {
  name    = "${var.project_name}-web-pr-${var.pr_number}-headers"
  comment = "Security headers for PR Preview #${var.pr_number}"

  security_headers_config {
    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }

    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }

    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }

    content_security_policy {
      content_security_policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ${var.api_url};"
      override                = true
    }
  }
}

# S3 bucket policy allowing CloudFront OAC access
resource "aws_s3_bucket_policy" "preview" {
  bucket = aws_s3_bucket.preview.id
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
        Resource = "${aws_s3_bucket.preview.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.preview.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.preview]
}

# =============================================================================
# DNS Record for PR Preview
# =============================================================================

resource "aws_route53_record" "preview" {
  zone_id = var.route53_zone_id
  name    = local.preview_subdomain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.preview.domain_name
    zone_id                = aws_cloudfront_distribution.preview.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "preview_ipv6" {
  zone_id = var.route53_zone_id
  name    = local.preview_subdomain
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.preview.domain_name
    zone_id                = aws_cloudfront_distribution.preview.hosted_zone_id
    evaluate_target_health = false
  }
}
