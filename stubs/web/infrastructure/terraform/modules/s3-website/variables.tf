variable "project_name" {
  description = "Project name for tagging"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution that will access this bucket"
  type        = string
}

variable "enable_versioning" {
  description = "Enable versioning for rollback capability"
  type        = bool
  default     = true
}

variable "version_retention_days" {
  description = "Number of days to retain old versions"
  type        = number
  default     = 30
}

variable "enable_cors" {
  description = "Enable CORS configuration"
  type        = bool
  default     = false
}

variable "cors_allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}
