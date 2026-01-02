#!/bin/bash
# AWS Deployment Script for Hybrid State Machine Demo
# Deploys to Amazon ECR + AWS App Runner

set -e  # Exit on error

# Configuration
AWS_REGION="${AWS_REGION:-us-west-2}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID}"
ECR_REPO="hybrid-state-demo"
IMAGE_TAG="${IMAGE_TAG:-latest}"
APP_RUNNER_SERVICE="hybrid-state-demo-service"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}✓${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."

if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo_error "AWS_ACCOUNT_ID environment variable not set"
    echo "Get your account ID with: aws sts get-caller-identity --query Account --output text"
    exit 1
fi

if ! command -v aws &> /dev/null; then
    echo_error "AWS CLI not installed"
    echo "Install from: https://aws.amazon.com/cli/"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo_error "Docker not installed"
    exit 1
fi

echo_info "Prerequisites check passed"

# Build Docker image
echo ""
echo "Building Docker image..."
docker build -t $ECR_REPO:$IMAGE_TAG .
echo_info "Docker image built successfully"

# Login to ECR
echo ""
echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | \
    docker login --username AWS --password-stdin \
    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
echo_info "Logged in to ECR"

# Create ECR repository if it doesn't exist
echo ""
echo "Checking ECR repository..."
if ! aws ecr describe-repositories --repository-names $ECR_REPO --region $AWS_REGION &> /dev/null; then
    echo "Creating ECR repository..."
    aws ecr create-repository \
        --repository-name $ECR_REPO \
        --region $AWS_REGION \
        --image-scanning-configuration scanOnPush=true
    echo_info "ECR repository created"
else
    echo_info "ECR repository already exists"
fi

# Tag and push image
echo ""
echo "Pushing image to ECR..."
ECR_IMAGE="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG"
docker tag $ECR_REPO:$IMAGE_TAG $ECR_IMAGE
docker push $ECR_IMAGE
echo_info "Image pushed successfully"

# Display deployment info
echo ""
echo "=================================================="
echo "✓ Deployment Complete!"
echo "=================================================="
echo ""
echo "ECR Image: $ECR_IMAGE"
echo ""
echo "Next Steps:"
echo ""
echo "Option 1: AWS App Runner (Easiest)"
echo "-----------------------------------"
echo "1. Go to AWS App Runner console:"
echo "   https://console.aws.amazon.com/apprunner/home?region=$AWS_REGION#/services"
echo "2. Click 'Create service'"
echo "3. Choose 'Container registry' → 'Amazon ECR'"
echo "4. Select image: $ECR_IMAGE"
echo "5. Configure:"
echo "   - Port: 80"
echo "   - CPU: 1 vCPU"
echo "   - Memory: 2 GB"
echo "6. Deploy!"
echo ""
echo "Option 2: AWS ECS Fargate"
echo "-------------------------"
echo "Use the image URI above in your ECS task definition"
echo ""
echo "Option 3: Quick Test"
echo "-------------------"
echo "docker run -p 8080:80 $ECR_IMAGE"
echo "Then visit: http://localhost:8080"
echo ""
echo "=================================================="
