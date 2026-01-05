# =============================================================================
# S3 Outputs
# =============================================================================

output "s3_bucket_name" {
  description = "Name of the S3 bucket for this PR preview"
  value       = aws_s3_bucket.preview.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.preview.arn
}

# =============================================================================
# CloudFront Outputs
# =============================================================================

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.preview.id
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.preview.arn
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.preview.domain_name
}

# =============================================================================
# Access URL
# =============================================================================

output "preview_url" {
  description = "PR Preview URL"
  value       = "https://pr-${var.pr_number}.app.${var.domain_name}"
}

output "pr_number" {
  description = "PR number for this preview"
  value       = var.pr_number
}
