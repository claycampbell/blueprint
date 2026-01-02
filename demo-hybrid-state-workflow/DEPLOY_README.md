# Hybrid State Machine Demo - Deployment Guide

**🎉 The demo is containerized and ready to deploy!**

The demo is currently running at: **http://localhost:3000**

## Quick Start - Local Testing

The Docker container is already running. Open your browser to:

```
http://localhost:3000
```

### Test Features:
- ✅ Property dashboard with multiple properties
- ✅ Lifecycle path visualization (git-style branching)
- ✅ State timeline with ReactFlow
- ✅ Interactive process cards
- ✅ Backward state transitions highlighted
- ✅ Teaching annotations explaining state machine advantages

### Container Management:

```bash
# Stop container
docker-compose down

# Restart container
docker-compose up -d

# View logs
docker logs hybrid-state-demo -f

# Check health
curl -I http://localhost:3000
```

---

## Deploy to AWS

### Prerequisites:
1. AWS account with appropriate permissions
2. AWS CLI configured (`aws configure`)
3. Docker Desktop running
4. Set environment variable: `AWS_ACCOUNT_ID`

```bash
# Get your AWS account ID
aws sts get-caller-identity --query Account --output text

# Set environment variable (Windows PowerShell)
$env:AWS_ACCOUNT_ID = "YOUR_ACCOUNT_ID"

# Or (Linux/Mac)
export AWS_ACCOUNT_ID="YOUR_ACCOUNT_ID"
```

### Deployment Options:

#### Option 1: AWS App Runner (Recommended - Easiest)

**Run the deployment script:**

```powershell
# Windows
.\deploy-aws.ps1

# Linux/Mac
chmod +x deploy-aws.sh
./deploy-aws.sh
```

The script will:
1. ✅ Build Docker image
2. ✅ Login to Amazon ECR
3. ✅ Create ECR repository
4. ✅ Push image to ECR
5. ✅ Display next steps

**Then complete deployment in AWS Console:**
1. Go to [AWS App Runner console](https://console.aws.amazon.com/apprunner/home?region=us-west-2#/services)
2. Click "Create service"
3. Choose "Container registry" → "Amazon ECR"
4. Select your image: `{account-id}.dkr.ecr.us-west-2.amazonaws.com/hybrid-state-demo:latest`
5. Configure:
   - **Port:** 80
   - **CPU:** 1 vCPU
   - **Memory:** 2 GB
6. Click "Create & deploy"
7. Wait 5-10 minutes for deployment
8. Copy the App Runner URL: `https://xxxxx.us-west-2.awsapprunner.com`

**Cost:** ~$20-30/month (always-on)

**Features:**
- ✅ Automatic HTTPS
- ✅ Auto-scaling
- ✅ Managed infrastructure
- ✅ Perfect for demos

#### Option 2: AWS ECS Fargate (Production)

After running the deployment script, follow [DEPLOYMENT.md](DEPLOYMENT.md) for detailed ECS setup instructions.

**Cost:** ~$15-25/month (pay per use)

#### Option 3: Docker Compose (Self-Hosted)

For any server with Docker:

```bash
# Clone repo
git clone <repo-url>
cd demo-hybrid-state-workflow

# Start container
docker-compose up -d

# Demo available at http://server-ip:3000
```

---

## Deployment Verification Checklist

After deployment, verify these features work:

- [ ] Dashboard loads with property list
- [ ] Click on "Riverside Commons" property
- [ ] Lifecycle path shows git-style branching visualization
- [ ] State timeline displays with ReactFlow
- [ ] Property details show in right sidebar
- [ ] "Needs Attention" section displays overdue items
- [ ] "Available Actions" section lists startable processes
- [ ] Teaching annotations explain state machine advantages
- [ ] Backward lifecycle transitions show red "↩️ Backward" badges
- [ ] Page navigation works (SPA routing)
- [ ] Static assets load (icons, fonts, etc.)

---

## What's Included in the Container

**Technology Stack:**
- **Frontend:** React 18 + TypeScript + Vite
- **Visualization:** ReactFlow (interactive diagrams)
- **Server:** Nginx (production-ready)
- **Container:** Multi-stage Docker build (optimized size)

**Demo Features:**
1. **Lifecycle Path View** - Git-style branching showing backward state transitions
2. **State Timeline** - Vertical timeline with all state changes across dimensions
3. **Property Dashboard** - Multi-property overview
4. **Interactive Process Cards** - Start/complete processes
5. **Teaching Annotations** - Explain state machine advantages vs. workflows

**Security Headers Configured:**
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block

**Performance Optimizations:**
- Gzip compression enabled
- Static asset caching (1 year)
- Index.html cache disabled (for updates)
- SPA routing configured

---

## Container Details

**Image:** `hybrid-state-demo:latest`
**Port:** 80 (internal) → 3000 (host)
**Size:** ~50MB (multi-stage build)
**Base Images:**
- Builder: `node:18-alpine`
- Runtime: `nginx:alpine`

**Health Check:**
```bash
# Container runs health check every 30s
wget --quiet --tries=1 --spider http://localhost:80/
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs hybrid-state-demo

# Check port conflicts
netstat -ano | findstr ":3000"  # Windows
lsof -i :3000                    # Linux/Mac
```

### Demo not loading
```bash
# Verify container is running
docker ps | grep hybrid-state-demo

# Test health endpoint
curl http://localhost:3000

# Check nginx logs
docker exec hybrid-state-demo cat /var/log/nginx/error.log
```

### Build fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

### AWS Deployment Issues

**ECR Login Fails:**
```bash
# Verify AWS credentials
aws sts get-caller-identity

# Manually login
aws ecr get-login-password --region us-west-2 | \
  docker login --username AWS --password-stdin \
  {account-id}.dkr.ecr.us-west-2.amazonaws.com
```

**Image Push Fails:**
```bash
# Check repository exists
aws ecr describe-repositories --region us-west-2

# Check IAM permissions (need ecr:PutImage, ecr:InitiateLayerUpload, etc.)
```

---

## Cost Estimates

| Deployment Option | Monthly Cost | Best For |
|-------------------|--------------|----------|
| **AWS App Runner** | $20-30 | Quick demos, always-on, auto-scaling |
| **ECS Fargate** | $15-25 | Production, variable load, full control |
| **EC2 + Docker** | $10-20 | Self-hosted, maximum control |
| **Local (localhost)** | $0 | Development and testing |

---

## Next Steps

1. **✅ Local testing complete** - Demo running at http://localhost:3000
2. **📤 Deploy to AWS** - Run `deploy-aws.ps1` or `deploy-aws.sh`
3. **🌐 Share with stakeholders** - Send them the App Runner URL
4. **📊 Gather feedback** - The demo showcases hybrid state machine model

**Demo Purpose:** Show stakeholders how the hybrid state machine model handles:
- Non-linear lifecycle paths (backward state transitions)
- Full audit trail across multiple state dimensions
- Clear causation for every state change
- Git-style branching visualization for property lifecycles

---

## Documentation Files

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Comprehensive deployment guide
- **[DEMO_GUIDE.md](DEMO_GUIDE.md)** - How to present the demo
- **[DEMO_SUMMARY.md](DEMO_SUMMARY.md)** - Demo features overview
- **[docker-compose.yml](docker-compose.yml)** - Local deployment config
- **[Dockerfile](Dockerfile)** - Production container build
- **[nginx.conf](nginx.conf)** - Web server configuration

---

## Support

**Container working perfectly?** ✅
**Ready to deploy?** Run the deployment script!

**Issues?** Check the troubleshooting section above or review logs:
```bash
docker logs hybrid-state-demo -f
```

**The demo is production-ready and containerized!** 🚀
