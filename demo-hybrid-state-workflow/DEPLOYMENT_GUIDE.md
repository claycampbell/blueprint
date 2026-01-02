# AWS ECS Fargate Deployment Guide

**Last Updated:** January 2, 2026
**Current Deployment:** http://44.252.112.14
**Task ID:** b9afcbe4955242e28053a1b52fb9a18a

This guide documents the exact process used to successfully deploy the Hybrid State Machine Demo to AWS ECS Fargate.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup (One-Time)](#initial-setup-one-time)
3. [Building and Pushing Updates](#building-and-pushing-updates)
4. [Deploying New Versions](#deploying-new-versions)
5. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
6. [Cost Management](#cost-management)
7. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Tools
- **Docker Desktop** - Must be running
- **AWS CLI** - Configured with credentials (`aws configure`)
- **Git Bash or PowerShell** - For running commands

### Required Environment Variables
```bash
# Get your AWS account ID
aws sts get-caller-identity --query Account --output text

# Set environment variable (PowerShell)
$env:AWS_ACCOUNT_ID = "718533829778"

# Or (Bash)
export AWS_ACCOUNT_ID="718533829778"
```

### AWS Resources Created
- **ECR Repository:** `hybrid-state-demo`
- **ECS Cluster:** `hybrid-state-demo`
- **IAM Role:** `ecsTaskExecutionRole` (with CloudWatch Logs permissions)
- **Security Group:** `sg-0486ffb39acc1fdb6` (allows HTTP traffic on port 80)
- **VPC/Subnets:** Using default VPC with public subnets

---

## Initial Setup (One-Time)

These steps were completed during initial deployment and should **not** be repeated unless recreating infrastructure.

### 1. Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name hybrid-state-demo \
  --region us-west-2 \
  --image-scanning-configuration scanOnPush=true
```

### 2. Create ECS Cluster

```bash
aws ecs create-cluster \
  --cluster-name hybrid-state-demo \
  --region us-west-2
```

### 3. Create IAM Execution Role

```bash
# Create role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ecs-tasks.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

# Attach AWS managed policy for ECS
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# Add CloudWatch Logs permissions (CRITICAL)
aws iam put-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-name CloudWatchLogsPolicy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:us-west-2:718533829778:log-group:/ecs/hybrid-state-demo:*"
    }]
  }'
```

### 4. Create Security Group

```bash
# Get VPC ID
VPC_ID=$(aws ec2 describe-vpcs --region us-west-2 --query "Vpcs[0].VpcId" --output text)

# Create security group
SG_ID=$(aws ec2 create-security-group \
  --group-name hybrid-state-demo-sg \
  --description "Security group for hybrid state demo" \
  --vpc-id $VPC_ID \
  --region us-west-2 \
  --query "GroupId" \
  --output text)

# Allow HTTP traffic (port 80)
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0 \
  --region us-west-2
```

**Security Group ID:** `sg-0486ffb39acc1fdb6`

### 5. Register Task Definition

```bash
aws ecs register-task-definition \
  --family hybrid-state-demo \
  --network-mode awsvpc \
  --requires-compatibilities FARGATE \
  --cpu 256 \
  --memory 512 \
  --execution-role-arn arn:aws:iam::718533829778:role/ecsTaskExecutionRole \
  --container-definitions '[
    {
      "name": "demo",
      "image": "718533829778.dkr.ecr.us-west-2.amazonaws.com/hybrid-state-demo:latest",
      "portMappings": [{
        "containerPort": 80,
        "protocol": "tcp"
      }],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/hybrid-state-demo",
          "awslogs-region": "us-west-2",
          "awslogs-stream-prefix": "demo",
          "awslogs-create-group": "true"
        }
      }
    }
  ]' \
  --region us-west-2
```

---

## Building and Pushing Updates

**⚠️ CRITICAL:** Always build with `--platform linux/amd64` flag for AWS Fargate compatibility.

### Build Docker Image

```bash
cd demo-hybrid-state-workflow

# Build with correct platform (REQUIRED for Fargate)
docker build --platform linux/amd64 -t hybrid-state-demo:latest .
```

**Build Time:** ~2-3 minutes (includes npm ci and vite build)

### Login to ECR

```bash
aws ecr get-login-password --region us-west-2 | \
  docker login --username AWS --password-stdin \
  718533829778.dkr.ecr.us-west-2.amazonaws.com
```

### Tag and Push Image

```bash
# Tag image
docker tag hybrid-state-demo:latest \
  718533829778.dkr.ecr.us-west-2.amazonaws.com/hybrid-state-demo:latest

# Push to ECR
docker push 718533829778.dkr.ecr.us-west-2.amazonaws.com/hybrid-state-demo:latest
```

**Push Time:** ~30-60 seconds (depends on changes)

---

## Deploying New Versions

### Get Subnet IDs (if needed)

```bash
aws ec2 describe-subnets \
  --region us-west-2 \
  --filters "Name=vpc-id,Values=vpc-07cac4a0e5681844b" \
  --query "Subnets[?MapPublicIpOnLaunch==\`true\`].SubnetId" \
  --output text
```

**Available Subnets:**
- `subnet-0463a3ddb8d4e9124`
- `subnet-0f753f3b60e117d94`
- `subnet-0361d5132320c0f56`
- `subnet-006f245fc2943bb4c`

### Launch New Task

```bash
aws ecs run-task \
  --cluster hybrid-state-demo \
  --task-definition hybrid-state-demo:1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={
    subnets=[subnet-0463a3ddb8d4e9124,subnet-0f753f3b60e117d94],
    securityGroups=[sg-0486ffb39acc1fdb6],
    assignPublicIp=ENABLED
  }" \
  --region us-west-2 \
  --query "tasks[0].taskArn" \
  --output text
```

**Returns:** Task ARN (e.g., `arn:aws:ecs:us-west-2:718533829778:task/hybrid-state-demo/b9afcbe4955242e28053a1b52fb9a18a`)

### Wait for Task to Start (90 seconds)

```bash
# Extract task ID from ARN
TASK_ID="b9afcbe4955242e28053a1b52fb9a18a"

# Wait 90 seconds
sleep 90

# Check status
aws ecs describe-tasks \
  --cluster hybrid-state-demo \
  --tasks $TASK_ID \
  --region us-west-2 \
  --query "tasks[0].[lastStatus,containers[0].lastStatus]" \
  --output text
```

**Expected Output:** `RUNNING    RUNNING`

### Get Public IP Address

```bash
# PowerShell method (recommended on Windows)
powershell -Command "
  \$eniId = (aws ecs describe-tasks --cluster hybrid-state-demo --tasks $TASK_ID --region us-west-2 --query 'tasks[0].attachments[0].details[?name==\`networkInterfaceId\`].value' --output text).Trim();
  aws ec2 describe-network-interfaces --network-interface-ids \$eniId --region us-west-2 --query 'NetworkInterfaces[0].Association.PublicIp' --output text
"
```

**Current IP:** `44.252.112.14`

### Verify Deployment

```bash
# Test HTTP response
curl -I http://44.252.112.14

# Expected: HTTP/1.1 200 OK
# Expected: Server: nginx/1.29.4
```

---

## Monitoring and Troubleshooting

### Check Task Status

```bash
aws ecs describe-tasks \
  --cluster hybrid-state-demo \
  --tasks $TASK_ID \
  --region us-west-2 \
  --query "tasks[0].[lastStatus,stoppedReason]" \
  --output text
```

### View CloudWatch Logs

```bash
# List log streams
aws logs describe-log-streams \
  --log-group-name /ecs/hybrid-state-demo \
  --region us-west-2 \
  --order-by LastEventTime \
  --descending \
  --max-items 5

# View latest logs (replace LOG_STREAM with actual stream name)
aws logs get-log-events \
  --log-group-name /ecs/hybrid-state-demo \
  --log-stream-name demo/demo/TASK_ID \
  --region us-west-2 \
  --limit 50
```

### Common Issues and Solutions

#### Issue 1: "CannotPullContainerError: platform mismatch"

**Symptom:** Task fails with platform mismatch error
**Cause:** Docker image built without `--platform linux/amd64` flag
**Solution:**
```bash
# Rebuild with correct platform
docker build --platform linux/amd64 -t hybrid-state-demo:latest .
# Push to ECR again
docker push 718533829778.dkr.ecr.us-west-2.amazonaws.com/hybrid-state-demo:latest
# Launch new task
```

#### Issue 2: "ResourceInitializationError: logs:CreateLogGroup"

**Symptom:** Task fails immediately, logs permission error
**Cause:** ecsTaskExecutionRole lacks CloudWatch Logs permissions
**Solution:**
```bash
# Add CloudWatch Logs permissions (from Initial Setup step 3)
aws iam put-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-name CloudWatchLogsPolicy \
  --policy-document '{...}'  # See Initial Setup section
```

#### Issue 3: Task Stuck in PENDING

**Symptom:** Task remains in PENDING status for >5 minutes
**Possible Causes:**
- Insufficient ENI capacity in subnet
- Security group misconfiguration
- ECR image pull issues

**Debugging:**
```bash
# Check detailed task status
aws ecs describe-tasks \
  --cluster hybrid-state-demo \
  --tasks $TASK_ID \
  --region us-west-2
```

### Stop Old Tasks

```bash
# List all running tasks
aws ecs list-tasks \
  --cluster hybrid-state-demo \
  --region us-west-2 \
  --desired-status RUNNING

# Stop specific task
aws ecs stop-task \
  --cluster hybrid-state-demo \
  --task $OLD_TASK_ID \
  --region us-west-2
```

---

## Cost Management

### Current Cost Estimate

**ECS Fargate Task (256 CPU, 512 MB):**
- **vCPU:** $0.04048 per vCPU per hour × 0.25 vCPU = $0.01012/hour
- **Memory:** $0.004445 per GB per hour × 0.5 GB = $0.002223/hour
- **Total per hour:** ~$0.0124/hour
- **Total per month (24/7):** ~$8.93/month

**Data Transfer:**
- First 100 GB out to internet: FREE
- After 100 GB: $0.09/GB

**ECR Storage:**
- First 500 MB: FREE per month
- After 500 MB: $0.10/GB per month
- Current image size: ~50 MB

**CloudWatch Logs:**
- First 5 GB ingestion: FREE
- After 5 GB: $0.50/GB

**Total Estimated Cost:** ~$10-15/month (for always-on demo)

### Cost Optimization

**Option 1: On-Demand Deployment**
- Only run task when demo is needed
- Stop task when not in use
- Cost: ~$0.01-0.02 per demo session

**Option 2: Scheduled Tasks**
- Use ECS Scheduled Tasks to run only during business hours
- Reduces cost by ~70%

**Option 3: Move to EC2 Spot**
- Switch to EC2 + Docker Compose on spot instances
- Potential 70-90% cost savings

---

## Rollback Procedures

### Quick Rollback to Previous Image

```bash
# 1. Find previous image digest in ECR
aws ecr describe-images \
  --repository-name hybrid-state-demo \
  --region us-west-2 \
  --query "sort_by(imageDetails, &imagePushedAt)[*].[imageTags[0],imageDigest]" \
  --output table

# 2. Tag previous image as 'latest'
aws ecr batch-get-image \
  --repository-name hybrid-state-demo \
  --image-ids imageDigest=sha256:PREVIOUS_DIGEST \
  --region us-west-2 \
  --query 'images[0].imageManifest' \
  --output text | \
aws ecr put-image \
  --repository-name hybrid-state-demo \
  --image-tag latest \
  --image-manifest stdin \
  --region us-west-2

# 3. Force new task to pull updated 'latest' image
aws ecs update-service \
  --cluster hybrid-state-demo \
  --service hybrid-state-demo-service \
  --force-new-deployment \
  --region us-west-2
```

### Emergency Rollback

```bash
# Stop current task
aws ecs stop-task \
  --cluster hybrid-state-demo \
  --task $CURRENT_TASK_ID \
  --region us-west-2

# Launch task with previous known-good task definition revision
aws ecs run-task \
  --cluster hybrid-state-demo \
  --task-definition hybrid-state-demo:PREVIOUS_REVISION \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={...}" \
  --region us-west-2
```

---

## Automated Deployment Script

Create `deploy-update.sh` for automated deployments:

```bash
#!/bin/bash
set -e

AWS_ACCOUNT_ID="718533829778"
AWS_REGION="us-west-2"
ECR_REPO="hybrid-state-demo"
CLUSTER="hybrid-state-demo"
SUBNETS="subnet-0463a3ddb8d4e9124,subnet-0f753f3b60e117d94"
SECURITY_GROUP="sg-0486ffb39acc1fdb6"

echo "🔨 Building Docker image for linux/amd64..."
docker build --platform linux/amd64 -t $ECR_REPO:latest .

echo "🔑 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "🏷️  Tagging image..."
docker tag $ECR_REPO:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest

echo "📤 Pushing to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest

echo "🚀 Launching new task..."
TASK_ARN=$(aws ecs run-task \
  --cluster $CLUSTER \
  --task-definition $ECR_REPO:1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNETS],securityGroups=[$SECURITY_GROUP],assignPublicIp=ENABLED}" \
  --region $AWS_REGION \
  --query "tasks[0].taskArn" \
  --output text)

echo "✅ Task launched: $TASK_ARN"
TASK_ID=$(echo $TASK_ARN | awk -F'/' '{print $NF}')

echo "⏳ Waiting 90 seconds for task to start..."
sleep 90

echo "🔍 Checking task status..."
STATUS=$(aws ecs describe-tasks \
  --cluster $CLUSTER \
  --tasks $TASK_ID \
  --region $AWS_REGION \
  --query "tasks[0].lastStatus" \
  --output text)

if [ "$STATUS" = "RUNNING" ]; then
  echo "✅ Deployment successful! Task is RUNNING."

  echo "🌐 Getting public IP..."
  # Note: PowerShell command required on Windows
  echo "Run this command to get the IP:"
  echo "powershell -Command \"\$eniId = (aws ecs describe-tasks --cluster $CLUSTER --tasks $TASK_ID --region $AWS_REGION --query 'tasks[0].attachments[0].details[?name==\\\`networkInterfaceId\\\`].value' --output text).Trim(); aws ec2 describe-network-interfaces --network-interface-ids \$eniId --region $AWS_REGION --query 'NetworkInterfaces[0].Association.PublicIp' --output text\""
else
  echo "❌ Deployment failed! Task status: $STATUS"
  exit 1
fi
```

---

## Change Management Checklist

When making changes to the demo application:

- [ ] **Build locally and test:** `docker-compose up -d` and verify at `http://localhost:3000`
- [ ] **Build with correct platform:** `docker build --platform linux/amd64 -t hybrid-state-demo:latest .`
- [ ] **Tag with version:** Consider tagging with git commit hash or version number
- [ ] **Push to ECR:** Use `docker push` to upload new image
- [ ] **Stop old task:** Stop previous task to avoid duplicate costs
- [ ] **Launch new task:** Run new task with updated image
- [ ] **Verify deployment:** Check task is RUNNING and demo is accessible
- [ ] **Update documentation:** Update this file with new IP, task ID, or configuration changes
- [ ] **Test demo features:** Verify all functionality works as expected
- [ ] **Update DEPLOY_README.md:** Keep user-facing docs in sync

---

## Infrastructure as Code (Future Enhancement)

Consider migrating to Terraform or CloudFormation for:
- Repeatable infrastructure provisioning
- Version-controlled infrastructure changes
- Easier environment duplication (dev/staging/prod)
- Automated rollback capabilities

**Example Terraform structure:**
```
terraform/
├── main.tf              # ECS cluster, task definition
├── ecr.tf               # ECR repository
├── iam.tf               # Execution role and policies
├── networking.tf        # VPC, subnets, security groups
├── variables.tf         # Configuration variables
└── outputs.tf           # Public IP, task ARN
```

---

## Support and References

**AWS Documentation:**
- [ECS Task Definitions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)
- [Fargate Task Networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html)
- [ECR User Guide](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)

**Related Files:**
- [DEPLOY_README.md](DEPLOY_README.md) - User-facing deployment guide
- [DEMO_GUIDE.md](DEMO_GUIDE.md) - How to present the demo
- [docker-compose.yml](docker-compose.yml) - Local development setup
- [Dockerfile](Dockerfile) - Container build instructions

**Troubleshooting:**
- CloudWatch Logs: https://console.aws.amazon.com/cloudwatch/home?region=us-west-2#logsV2:log-groups/log-group/$252Fecs$252Fhybrid-state-demo
- ECS Console: https://console.aws.amazon.com/ecs/v2/clusters/hybrid-state-demo/tasks?region=us-west-2
- ECR Console: https://console.aws.amazon.com/ecr/repositories/private/718533829778/hybrid-state-demo?region=us-west-2

---

**Last Successful Deployment:**
- **Date:** January 2, 2026
- **Task ID:** b9afcbe4955242e28053a1b52fb9a18a
- **Public IP:** http://44.252.112.14
- **Image Digest:** sha256:3ae3a4b86e2ef246da607f26a3d026d979bcab9805ad195b02725d47be658972
- **Status:** ✅ RUNNING
