# CloudFront Distribution Module
# Creates a CloudFront distribution for serving a React SPA from S3

# Origin Access Control for secure S3 access
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "${var.project_name}-${var.environment}-oac"
  description                       = "OAC for ${var.project_name} ${var.environment}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} ${var.environment} distribution"
  default_root_object = "index.html"
  price_class         = var.price_class
  aliases             = var.domain_names
  web_acl_id          = var.web_acl_id

  origin {
    domain_name              = var.s3_bucket_regional_domain_name
    origin_id                = "S3-${var.s3_bucket_id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.s3_bucket_id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = var.default_ttl
    max_ttl                = var.max_ttl
    compress               = true

    # Use managed cache policy for better performance
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
  }

  # Cache behavior for static assets (JS, CSS, images)
  ordered_cache_behavior {
    path_pattern     = "/assets/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.s3_bucket_id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 31536000  # 1 year
    default_ttl            = 31536000
    max_ttl                = 31536000
    compress               = true

    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
  }

  # SPA routing: return index.html for 403/404 errors
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = var.geo_restriction_type
      locations        = var.geo_restriction_locations
    }
  }

  viewer_certificate {
    acm_certificate_arn            = var.certificate_arn
    ssl_support_method             = var.certificate_arn != null ? "sni-only" : null
    minimum_protocol_version       = var.certificate_arn != null ? "TLSv1.2_2021" : null
    cloudfront_default_certificate = var.certificate_arn == null
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Security headers policy
resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name    = "${var.project_name}-${var.environment}-security-headers"
  comment = "Security headers for ${var.project_name} ${var.environment}"

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

    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }

    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }

    content_security_policy {
      content_security_policy = var.content_security_policy
      override                = true
    }
  }

  custom_headers_config {
    items {
      header   = "X-Robots-Tag"
      value    = var.environment == "prod" ? "index, follow" : "noindex, nofollow"
      override = true
    }
  }
}

# CloudFront Function for cache headers on index.html
resource "aws_cloudfront_function" "no_cache_index" {
  name    = "${var.project_name}-${var.environment}-no-cache-index"
  runtime = "cloudfront-js-1.0"
  comment = "Set no-cache headers for index.html"
  publish = true

  code = <<-EOF
    function handler(event) {
      var response = event.response;
      var headers = response.headers;
      var uri = event.request.uri;

      // Don't cache index.html
      if (uri === '/' || uri === '/index.html') {
        headers['cache-control'] = { value: 'no-cache, no-store, must-revalidate' };
        headers['pragma'] = { value: 'no-cache' };
        headers['expires'] = { value: '0' };
      }

      return response;
    }
  EOF
}
