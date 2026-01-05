variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "critical_alert_emails" {
  description = "Email addresses to receive critical alerts"
  type        = list(string)
  default     = []
}

variable "warning_alert_emails" {
  description = "Email addresses to receive warning alerts"
  type        = list(string)
  default     = []
}
