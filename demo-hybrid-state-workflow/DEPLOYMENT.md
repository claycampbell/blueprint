# Hybrid State Machine Demo - Deployment Guide

## Quick Deploy to AWS

### Option 1: AWS App Runner (Easiest - Recommended)

**Prerequisites:**
- AWS account with appropriate permissions
- Docker installed locally

**Steps:**
1. **Build and test locally:**
   ```bash
   docker build -t hybrid-state-demo .
   docker run -p 3000:80 hybrid-state-demo
   # Visit http://localhost:3000 to verify
   ```

2. **Push to Amazon ECR:**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-west-2.amazonaws.com

   # Create repository
   aws ecr create-repository --repository-name hybrid-state-demo --region us-west-2

   # Tag and push
   docker tag hybrid-state-demo:latest <account-id>.dkr.ecr.us-west-2.amazonaws.com/hybrid-state-demo:latest
   docker push <account-id>.dkr.ecr.us-west-2.amazonaws.com/hybrid-state-demo:latest
   ```

3. **Deploy to App Runner:**
   - Go to AWS App Runner console
   - Click "Create service"
   - Choose "Container registry" → "Amazon ECR"
   - Select your image
   - Configure:
     - Port: 80
     - CPU: 1 vCPU
     - Memory: 2 GB
   - Click "Create & deploy"
   - App Runner provides a URL: `https://xxxxx.us-west-2.awsapprunner.com`

**Cost:** ~$20-30/month (always-on)

---

### Option 2: AWS ECS Fargate (Production-Ready)

**Prerequisites:**
- AWS CLI configured
- Docker installed

**Steps:**
1. **Build and push to ECR** (same as Option 1)

2. **Create ECS cluster:**
   ```bash
   aws ecs create-cluster --cluster-name hybrid-demo-cluster --region us-west-2
   ```

3. **Create task definition:**
   ```bash
   aws ecs register-task-definition \
     --family hybrid-state-demo \
     --network-mode awsvpc \
     --requires-compatibilities FARGATE \
     --cpu 256 \
     --memory 512 \
     --container-definitions '[
       {
         "name": "demo",
         "image": "<account-id>.dkr.ecr.us-west-2.amazonaws.com/hybrid-state-demo:latest",
         "portMappings": [{"containerPort": 80, "protocol": "tcp"}],
         "essential": true,
         "logConfiguration": {
           "logDriver": "awslogs",
           "options": {
             "awslogs-group": "/ecs/hybrid-demo",
             "awslogs-region": "us-west-2",
             "awslogs-stream-prefix": "demo"
           }
         }
       }
     ]'
   ```

4. **Create service with ALB:**
   - Use AWS Console or CLI to create ECS service
   - Attach Application Load Balancer
   - Configure health checks

**Cost:** ~$15-25/month (pay per use)

---

### Option 3: Docker Compose (Simple Self-Hosted)

**For any server with Docker:**

```bash
# Clone repo
git clone <repo-url>
cd demo-hybrid-state-workflow

# Start with docker-compose
docker-compose up -d

# Demo available at http://server-ip:3000
```

**Cost:** Server cost only

---

## Quick Deploy Script

Create `deploy.sh`:

```bash
#!/bin/bash

# Configuration
AWS_REGION="us-west-2"
AWS_ACCOUNT_ID="<your-account-id>"
ECR_REPO="hybrid-state-demo"
IMAGE_TAG="latest"

# Build
echo "Building Docker image..."
docker build -t $ECR_REPO:$IMAGE_TAG .

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Tag and push
echo "Pushing to ECR..."
docker tag $ECR_REPO:$IMAGE_TAG \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG

docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG

echo "✅ Image pushed successfully!"
echo "Image: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG"
```

---

## Environment Variables

None required - this is a static React app with no backend dependencies.

---

## Demo URLs After Deployment

**Local:** http://localhost:3000
**AWS App Runner:** `https://xxxxx.us-west-2.awsapprunner.com`
**AWS ECS/ALB:** `http://your-alb-dns.us-west-2.elb.amazonaws.com`

---

##Recommended: AWS App Runner

- ✅ Easiest deployment
- ✅ Automatic HTTPS
- ✅ Auto-scaling
- ✅ Managed service
- ✅ ~5 minutes to deploy
- ✅ Perfect for demos

---

## Troubleshooting

**Build fails:**
- Ensure Node 18+ installed
- Run `npm install` first
- Check `npm run build` works locally

**Container won't start:**
- Check logs: `docker logs hybrid-state-demo`
- Verify port 80 is exposed
- Check nginx configuration

**Demo not loading:**
- Verify container is running: `docker ps`
- Check health: `docker exec hybrid-state-demo wget -q -O- http://localhost:80`
- Review nginx logs: `docker logs hybrid-state-demo`

---

## Cost Estimates

| Option | Monthly Cost | Best For |
|--------|--------------|----------|
| App Runner | $20-30 | Quick demos, always-on |
| ECS Fargate | $15-25 | Production, variable load |
| EC2 + Docker | $10-20 | Full control |

---

## Production Checklist

- ✅ Docker image builds successfully
- ✅ Health check endpoint working
- ✅ Nginx serving static files
- ✅ SPA routing configured
- ✅ HTTPS enabled (App Runner auto, ALB manual)
- ✅ Monitoring configured (CloudWatch)

The demo is containerized and ready to deploy!
