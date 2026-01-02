# AWS Deployment Script for Hybrid State Machine Demo
# PowerShell version for Windows
# Deploys to Amazon ECR + AWS App Runner

param(
    [string]$AwsRegion = "us-west-2",
    [string]$AwsAccountId = $env:AWS_ACCOUNT_ID,
    [string]$EcrRepo = "hybrid-state-demo",
    [string]$ImageTag = "latest"
)

$ErrorActionPreference = "Stop"

function Write-Info {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Check prerequisites
Write-Host "Checking prerequisites..."

if (-not $AwsAccountId) {
    Write-Error "AWS_ACCOUNT_ID environment variable not set"
    Write-Host "Get your account ID with: aws sts get-caller-identity --query Account --output text"
    exit 1
}

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Error "AWS CLI not installed"
    Write-Host "Install from: https://aws.amazon.com/cli/"
    exit 1
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker not installed"
    exit 1
}

Write-Info "Prerequisites check passed"

# Build Docker image
Write-Host ""
Write-Host "Building Docker image..."
docker build -t "${EcrRepo}:${ImageTag}" .
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Info "Docker image built successfully"

# Login to ECR
Write-Host ""
Write-Host "Logging in to Amazon ECR..."
$loginPassword = aws ecr get-login-password --region $AwsRegion
$loginPassword | docker login --username AWS --password-stdin "$AwsAccountId.dkr.ecr.$AwsRegion.amazonaws.com"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Info "Logged in to ECR"

# Create ECR repository if it doesn't exist
Write-Host ""
Write-Host "Checking ECR repository..."
try {
    aws ecr describe-repositories --repository-names $EcrRepo --region $AwsRegion 2>$null | Out-Null
    Write-Info "ECR repository already exists"
} catch {
    Write-Host "Creating ECR repository..."
    aws ecr create-repository `
        --repository-name $EcrRepo `
        --region $AwsRegion `
        --image-scanning-configuration scanOnPush=true
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    Write-Info "ECR repository created"
}

# Tag and push image
Write-Host ""
Write-Host "Pushing image to ECR..."
$EcrImage = "$AwsAccountId.dkr.ecr.$AwsRegion.amazonaws.com/${EcrRepo}:${ImageTag}"
docker tag "${EcrRepo}:${ImageTag}" $EcrImage
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
docker push $EcrImage
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Info "Image pushed successfully"

# Display deployment info
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✓ Deployment Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "ECR Image: $EcrImage" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:"
Write-Host ""
Write-Host "Option 1: AWS App Runner (Easiest)" -ForegroundColor Yellow
Write-Host "-----------------------------------"
Write-Host "1. Go to AWS App Runner console:"
Write-Host "   https://console.aws.amazon.com/apprunner/home?region=$AwsRegion#/services"
Write-Host "2. Click 'Create service'"
Write-Host "3. Choose 'Container registry' → 'Amazon ECR'"
Write-Host "4. Select image: $EcrImage"
Write-Host "5. Configure:"
Write-Host "   - Port: 80"
Write-Host "   - CPU: 1 vCPU"
Write-Host "   - Memory: 2 GB"
Write-Host "6. Deploy!"
Write-Host ""
Write-Host "Option 2: AWS ECS Fargate" -ForegroundColor Yellow
Write-Host "-------------------------"
Write-Host "Use the image URI above in your ECS task definition"
Write-Host ""
Write-Host "Option 3: Quick Test" -ForegroundColor Yellow
Write-Host "-------------------"
Write-Host "docker run -p 8080:80 $EcrImage"
Write-Host "Then visit: http://localhost:8080"
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
