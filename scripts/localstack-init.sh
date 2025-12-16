#!/bin/bash

# LocalStack Initialization Script
# This script runs automatically when LocalStack starts up
# It creates all necessary AWS resources for local development

set -e

echo "============================================"
echo "Initializing LocalStack AWS resources..."
echo "============================================"

# Wait for LocalStack to be fully ready
echo "Waiting for LocalStack to be ready..."
until awslocal s3 ls 2>/dev/null; do
    echo "LocalStack not ready yet, waiting..."
    sleep 2
done
echo "✓ LocalStack is ready!"

# ============================================
# S3 Buckets
# ============================================
echo ""
echo "Creating S3 buckets..."

# Main document storage bucket
if ! awslocal s3 ls s3://connect2-documents-dev 2>/dev/null; then
    awslocal s3 mb s3://connect2-documents-dev
    echo "✓ Created bucket: connect2-documents-dev"
else
    echo "- Bucket already exists: connect2-documents-dev"
fi

# Archive bucket for older documents
if ! awslocal s3 ls s3://connect2-documents-archive 2>/dev/null; then
    awslocal s3 mb s3://connect2-documents-archive
    echo "✓ Created bucket: connect2-documents-archive"
else
    echo "- Bucket already exists: connect2-documents-archive"
fi

# Temp bucket for uploads/processing
if ! awslocal s3 ls s3://connect2-temp 2>/dev/null; then
    awslocal s3 mb s3://connect2-temp
    echo "✓ Created bucket: connect2-temp"
else
    echo "- Bucket already exists: connect2-temp"
fi

# Configure bucket lifecycle policies
awslocal s3api put-bucket-lifecycle-configuration \
    --bucket connect2-temp \
    --lifecycle-configuration '{
        "Rules": [{
            "Id": "DeleteOldTempFiles",
            "Status": "Enabled",
            "Prefix": "",
            "Expiration": { "Days": 7 }
        }]
    }' 2>/dev/null || echo "- Lifecycle policy already set for connect2-temp"

# ============================================
# SQS Queues
# ============================================
echo ""
echo "Creating SQS queues..."

# Document processing queue
QUEUE_URL=$(awslocal sqs create-queue \
    --queue-name connect2-document-processing \
    --attributes VisibilityTimeout=300,MessageRetentionPeriod=1209600 \
    --output text --query 'QueueUrl' 2>/dev/null) || echo "Queue already exists: connect2-document-processing"
if [ ! -z "$QUEUE_URL" ]; then
    echo "✓ Created queue: connect2-document-processing"
    echo "  URL: $QUEUE_URL"
fi

# Dead letter queue for failed document processing
DLQ_URL=$(awslocal sqs create-queue \
    --queue-name connect2-document-processing-dlq \
    --output text --query 'QueueUrl' 2>/dev/null) || echo "Queue already exists: connect2-document-processing-dlq"
if [ ! -z "$DLQ_URL" ]; then
    echo "✓ Created DLQ: connect2-document-processing-dlq"
fi

# Notifications queue
awslocal sqs create-queue \
    --queue-name connect2-notifications \
    --attributes VisibilityTimeout=60,MessageRetentionPeriod=604800 \
    2>/dev/null && echo "✓ Created queue: connect2-notifications" || echo "Queue already exists: connect2-notifications"

# Email queue
awslocal sqs create-queue \
    --queue-name connect2-email-queue \
    --attributes VisibilityTimeout=120 \
    2>/dev/null && echo "✓ Created queue: connect2-email-queue" || echo "Queue already exists: connect2-email-queue"

# Task queue for async operations
awslocal sqs create-queue \
    --queue-name connect2-tasks \
    --attributes VisibilityTimeout=180 \
    2>/dev/null && echo "✓ Created queue: connect2-tasks" || echo "Queue already exists: connect2-tasks"

# ============================================
# SNS Topics
# ============================================
echo ""
echo "Creating SNS topics..."

# Project lifecycle events
PROJECT_TOPIC_ARN=$(awslocal sns create-topic \
    --name connect2-project-events \
    --output text --query 'TopicArn' 2>/dev/null) || echo "Topic already exists: connect2-project-events"
if [ ! -z "$PROJECT_TOPIC_ARN" ]; then
    echo "✓ Created topic: connect2-project-events"
    echo "  ARN: $PROJECT_TOPIC_ARN"
fi

# Loan lifecycle events
LOAN_TOPIC_ARN=$(awslocal sns create-topic \
    --name connect2-loan-events \
    --output text --query 'TopicArn' 2>/dev/null) || echo "Topic already exists: connect2-loan-events"
if [ ! -z "$LOAN_TOPIC_ARN" ]; then
    echo "✓ Created topic: connect2-loan-events"
fi

# Document events
awslocal sns create-topic \
    --name connect2-document-events \
    2>/dev/null && echo "✓ Created topic: connect2-document-events" || echo "Topic already exists: connect2-document-events"

# User notification topic
awslocal sns create-topic \
    --name connect2-user-notifications \
    2>/dev/null && echo "✓ Created topic: connect2-user-notifications" || echo "Topic already exists: connect2-user-notifications"

# ============================================
# Secrets Manager
# ============================================
echo ""
echo "Creating Secrets Manager secrets..."

# Database credentials
awslocal secretsmanager create-secret \
    --name connect2/dev/database \
    --description "Database connection credentials for local development" \
    --secret-string '{
        "username": "connect_user",
        "password": "connect_dev_password",
        "host": "postgres",
        "port": 5432,
        "database": "connect2_dev",
        "engine": "postgres"
    }' 2>/dev/null && echo "✓ Created secret: connect2/dev/database" || echo "Secret already exists: connect2/dev/database"

# OpenAI API key (placeholder for local dev)
awslocal secretsmanager create-secret \
    --name connect2/dev/openai \
    --description "OpenAI API key for AI features" \
    --secret-string '{
        "api_key": "sk-test-local-dev-key-replace-with-real"
    }' 2>/dev/null && echo "✓ Created secret: connect2/dev/openai" || echo "Secret already exists: connect2/dev/openai"

# JWT signing secret
awslocal secretsmanager create-secret \
    --name connect2/dev/jwt \
    --description "JWT signing secret for authentication" \
    --secret-string '{
        "secret": "local-dev-jwt-secret-change-in-production",
        "algorithm": "HS256",
        "expiresIn": "7d"
    }' 2>/dev/null && echo "✓ Created secret: connect2/dev/jwt" || echo "Secret already exists: connect2/dev/jwt"

# Email service credentials (SendGrid/SES)
awslocal secretsmanager create-secret \
    --name connect2/dev/email \
    --description "Email service credentials" \
    --secret-string '{
        "provider": "ses",
        "from_email": "noreply@connect2.local",
        "from_name": "Connect 2.0 Local Dev"
    }' 2>/dev/null && echo "✓ Created secret: connect2/dev/email" || echo "Secret already exists: connect2/dev/email"

# ============================================
# CloudWatch Log Groups
# ============================================
echo ""
echo "Creating CloudWatch Log Groups..."

awslocal logs create-log-group --log-group-name /connect2/api 2>/dev/null \
    && echo "✓ Created log group: /connect2/api" || echo "Log group already exists: /connect2/api"

awslocal logs create-log-group --log-group-name /connect2/worker 2>/dev/null \
    && echo "✓ Created log group: /connect2/worker" || echo "Log group already exists: /connect2/worker"

awslocal logs create-log-group --log-group-name /connect2/frontend 2>/dev/null \
    && echo "✓ Created log group: /connect2/frontend" || echo "Log group already exists: /connect2/frontend"

awslocal logs create-log-group --log-group-name /connect2/errors 2>/dev/null \
    && echo "✓ Created log group: /connect2/errors" || echo "Log group already exists: /connect2/errors"

# ============================================
# EventBridge Rules (Optional)
# ============================================
echo ""
echo "Creating EventBridge rules..."

# Daily cleanup rule (runs at midnight)
awslocal events put-rule \
    --name connect2-daily-cleanup \
    --description "Daily cleanup of temp files and expired data" \
    --schedule-expression "cron(0 0 * * ? *)" \
    2>/dev/null && echo "✓ Created rule: connect2-daily-cleanup" || echo "Rule already exists: connect2-daily-cleanup"

# ============================================
# IAM Policies (Basic simulation)
# ============================================
echo ""
echo "Creating IAM policies..."

# Basic S3 access policy
awslocal iam create-policy \
    --policy-name Connect2S3Access \
    --policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
            "Resource": "arn:aws:s3:::connect2-*/*"
        }]
    }' 2>/dev/null && echo "✓ Created policy: Connect2S3Access" || echo "Policy already exists: Connect2S3Access"

# ============================================
# Sample Test Data (Optional)
# ============================================
echo ""
echo "Creating sample test data..."

# Upload a sample test document
echo "This is a sample document for testing" > /tmp/sample-test.txt
awslocal s3 cp /tmp/sample-test.txt s3://connect2-documents-dev/test/sample.txt 2>/dev/null \
    && echo "✓ Uploaded sample test document to S3" || echo "Sample document already exists"
rm -f /tmp/sample-test.txt

# Send a test message to the queue
awslocal sqs send-message \
    --queue-url http://localhost:4566/000000000000/connect2-document-processing \
    --message-body '{"type":"test","message":"LocalStack initialization test message"}' \
    2>/dev/null && echo "✓ Sent test message to document-processing queue" || echo "Test message already sent"

# ============================================
# Summary
# ============================================
echo ""
echo "============================================"
echo "LocalStack initialization complete!"
echo "============================================"
echo ""
echo "Available Resources:"
echo "-------------------"
echo "S3 Buckets:"
echo "  - connect2-documents-dev"
echo "  - connect2-documents-archive"
echo "  - connect2-temp"
echo ""
echo "SQS Queues:"
echo "  - connect2-document-processing"
echo "  - connect2-document-processing-dlq"
echo "  - connect2-notifications"
echo "  - connect2-email-queue"
echo "  - connect2-tasks"
echo ""
echo "SNS Topics:"
echo "  - connect2-project-events"
echo "  - connect2-loan-events"
echo "  - connect2-document-events"
echo "  - connect2-user-notifications"
echo ""
echo "Secrets:"
echo "  - connect2/dev/database"
echo "  - connect2/dev/openai"
echo "  - connect2/dev/jwt"
echo "  - connect2/dev/email"
echo ""
echo "Access LocalStack:"
echo "  - Web UI: http://localhost:4566/_localstack/health"
echo "  - Endpoint: http://localhost:4566"
echo ""
echo "Quick Commands:"
echo "  awslocal s3 ls"
echo "  awslocal sqs list-queues"
echo "  awslocal sns list-topics"
echo "  awslocal secretsmanager list-secrets"
echo ""
echo "============================================"
