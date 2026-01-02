# Quick Update Guide

**Use this when making changes to the demo application and deploying to AWS.**

---

## Prerequisites

```bash
# Set AWS account ID (do once per terminal session)
export AWS_ACCOUNT_ID="718533829778"  # Linux/Mac/Git Bash
$env:AWS_ACCOUNT_ID = "718533829778"  # PowerShell
```

---

## Step-by-Step Update Process

### 1. Test Locally First

```bash
cd demo-hybrid-state-workflow

# Start local container
docker-compose up -d

# Verify at http://localhost:3000
# Test all changed functionality

# Stop local container when done
docker-compose down
```

---

### 2. Build with Correct Platform

⚠️ **CRITICAL:** Always use `--platform linux/amd64` for AWS Fargate

```bash
docker build --platform linux/amd64 -t hybrid-state-demo:latest .
```

**Build time:** ~2-3 minutes

---

### 3. Login to ECR

```bash
aws ecr get-login-password --region us-west-2 | \
  docker login --username AWS --password-stdin \
  718533829778.dkr.ecr.us-west-2.amazonaws.com
```

---

### 4. Tag and Push

```bash
# Tag
docker tag hybrid-state-demo:latest \
  718533829778.dkr.ecr.us-west-2.amazonaws.com/hybrid-state-demo:latest

# Push
docker push 718533829778.dkr.ecr.us-west-2.amazonaws.com/hybrid-state-demo:latest
```

**Push time:** ~30-60 seconds

---

### 5. Stop Old Task (Optional but Recommended)

```bash
# Find current task ID
aws ecs list-tasks \
  --cluster hybrid-state-demo \
  --region us-west-2 \
  --desired-status RUNNING \
  --query "taskArns[0]" \
  --output text

# Extract task ID (last part of ARN)
# Example: arn:aws:ecs:us-west-2:718533829778:task/hybrid-state-demo/b9afcbe4955242e28053a1b52fb9a18a
# Task ID = b9afcbe4955242e28053a1b52fb9a18a

# Stop the task
aws ecs stop-task \
  --cluster hybrid-state-demo \
  --task b9afcbe4955242e28053a1b52fb9a18a \
  --region us-west-2
```

---

### 6. Launch New Task

```bash
aws ecs run-task \
  --cluster hybrid-state-demo \
  --task-definition hybrid-state-demo:1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0463a3ddb8d4e9124,subnet-0f753f3b60e117d94],securityGroups=[sg-0486ffb39acc1fdb6],assignPublicIp=ENABLED}" \
  --region us-west-2 \
  --query "tasks[0].taskArn" \
  --output text
```

**Save the task ARN returned!**

---

### 7. Wait and Verify

```bash
# Wait 90 seconds for task to start
sleep 90

# Check task status (replace TASK_ID with ID from step 6)
aws ecs describe-tasks \
  --cluster hybrid-state-demo \
  --tasks TASK_ID \
  --region us-west-2 \
  --query "tasks[0].[lastStatus,containers[0].lastStatus]" \
  --output text
```

**Expected:** `RUNNING    RUNNING`

---

### 8. Get Public IP

```bash
# PowerShell (recommended on Windows)
powershell -Command "
  $eniId = (aws ecs describe-tasks --cluster hybrid-state-demo --tasks TASK_ID --region us-west-2 --query 'tasks[0].attachments[0].details[?name==\`networkInterfaceId\`].value' --output text).Trim();
  aws ec2 describe-network-interfaces --network-interface-ids $eniId --region us-west-2 --query 'NetworkInterfaces[0].Association.PublicIp' --output text
"
```

---

### 9. Test Deployment

```bash
# Replace with IP from step 8
curl -I http://YOUR_PUBLIC_IP

# Should return HTTP/1.1 200 OK

# Test in browser
# Visit: http://YOUR_PUBLIC_IP
```

---

## Common Issues

### Issue: Platform mismatch error

**Error:** `CannotPullContainerError: platform mismatch`

**Fix:** Rebuild with `--platform linux/amd64` flag:
```bash
docker build --platform linux/amd64 -t hybrid-state-demo:latest .
docker push 718533829778.dkr.ecr.us-west-2.amazonaws.com/hybrid-state-demo:latest
```

---

### Issue: Task stuck in PENDING

**Cause:** Usually resolves in 60-90 seconds. If not, check:

```bash
# Get detailed task info
aws ecs describe-tasks \
  --cluster hybrid-state-demo \
  --tasks TASK_ID \
  --region us-west-2
```

---

### Issue: Task shows STOPPED

**Check reason:**
```bash
aws ecs describe-tasks \
  --cluster hybrid-state-demo \
  --tasks TASK_ID \
  --region us-west-2 \
  --query "tasks[0].[stoppedReason,stopCode]" \
  --output text
```

**Common reasons:**
- Platform mismatch → Rebuild with `--platform linux/amd64`
- CloudWatch Logs permissions → See DEPLOYMENT_GUIDE.md
- Container errors → Check CloudWatch Logs

---

## Update Checklist

- [ ] Tested changes locally (`docker-compose up -d`)
- [ ] Built with `--platform linux/amd64` flag
- [ ] Pushed to ECR successfully
- [ ] Stopped old task
- [ ] Launched new task
- [ ] Verified task status is RUNNING
- [ ] Got new public IP
- [ ] Tested demo in browser
- [ ] Updated DEPLOYMENT_GUIDE.md with new task ID and IP
- [ ] Committed changes to Git

---

## Cost Reminder

**Each running task costs:** ~$0.01-0.02/hour (~$9/month if left running 24/7)

**Best practice:** Stop tasks when not actively demoing.

---

## Need More Help?

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:
- Detailed troubleshooting
- Initial setup instructions
- Cost optimization strategies
- Rollback procedures
- CloudWatch Logs access
