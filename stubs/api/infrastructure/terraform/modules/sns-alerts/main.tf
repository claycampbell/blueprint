# SNS Alerts Module
# Creates SNS topics for alerting

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Critical alerts topic (pages on-call)
resource "aws_sns_topic" "critical" {
  name = "${var.project_name}-alerts-critical-${var.environment}"

  tags = {
    Name        = "${var.project_name}-alerts-critical-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
    Severity    = "critical"
  }
}

# Warning alerts topic (notifications, no page)
resource "aws_sns_topic" "warning" {
  name = "${var.project_name}-alerts-warning-${var.environment}"

  tags = {
    Name        = "${var.project_name}-alerts-warning-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
    Severity    = "warning"
  }
}

# Info alerts topic (logging, audit)
resource "aws_sns_topic" "info" {
  name = "${var.project_name}-alerts-info-${var.environment}"

  tags = {
    Name        = "${var.project_name}-alerts-info-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
    Severity    = "info"
  }
}

# Email subscriptions for critical alerts
resource "aws_sns_topic_subscription" "critical_email" {
  count = length(var.critical_alert_emails)

  topic_arn = aws_sns_topic.critical.arn
  protocol  = "email"
  endpoint  = var.critical_alert_emails[count.index]
}

# Email subscriptions for warning alerts
resource "aws_sns_topic_subscription" "warning_email" {
  count = length(var.warning_alert_emails)

  topic_arn = aws_sns_topic.warning.arn
  protocol  = "email"
  endpoint  = var.warning_alert_emails[count.index]
}
