# Connect 2.0 - Developer Quickstart Guide
**Get up and running in 5 minutes**

---

## Prerequisites

Install these before you start:

1. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop)
   - Windows: Docker Desktop for Windows
   - Mac: Docker Desktop for Mac
   - Linux: Docker Engine + Docker Compose

2. **Git** - [Download here](https://git-scm.com/)

3. **Optional but recommended:**
   - **VS Code** - [Download here](https://code.visualstudio.com/)
   - **AWS CLI** - `pip install awscli-local` (for LocalStack commands)

---

## 5-Minute Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd blueprint
```

### Step 2: Start All Services
```bash
# Start LocalStack, PostgreSQL, Redis, and pgAdmin
docker-compose up -d

# Check that all services are running
docker-compose ps
```

You should see:
- ✅ `connect2-localstack` - Running
- ✅ `connect2-postgres` - Running (healthy)
- ✅ `connect2-redis` - Running (healthy)

### Step 3: Verify Everything Works

**Check LocalStack (AWS services):**
```bash
# Install awslocal (one-time)
pip install awscli-local

# List S3 buckets (should see 3 buckets)
awslocal s3 ls

# List SQS queues
awslocal sqs list-queues
```

**Check PostgreSQL:**
```bash
# Connect to database
docker exec -it connect2-postgres psql -U connect_user -d connect2_dev

# Run a query (should see 3 sample projects)
SELECT * FROM connect2.projects;

# Exit
\q
```

**Check pgAdmin (Database UI):**
- Open browser: http://localhost:5050
- Login: `admin@connect2.local` / `admin`
- Add server:
  - Name: Connect2 Local
  - Host: `postgres`
  - Port: `5432`
  - Database: `connect2_dev`
  - Username: `connect_user`
  - Password: `connect_dev_password`

---

## What Just Happened?

Docker Compose started:

| Service | Port | Purpose |
|---------|------|---------|
| **LocalStack** | 4566 | AWS services (S3, SQS, SNS, Secrets Manager) |
| **PostgreSQL** | 5432 | Primary database |
| **Redis** | 6379 | Cache layer |
| **pgAdmin** | 5050 | Database management UI |

**LocalStack automatically created:**
- 3 S3 buckets for document storage
- 5 SQS queues for async processing
- 4 SNS topics for events
- 4 Secrets Manager secrets
- CloudWatch log groups

**PostgreSQL automatically created:**
- Complete database schema (13 tables)
- Indexes for performance
- Sample seed data (5 users, 4 contacts, 3 projects)

---

## Quick Reference

### Daily Commands

**Start services:**
```bash
docker-compose up -d
```

**Stop services (keep data):**
```bash
docker-compose stop
```

**Restart everything:**
```bash
docker-compose restart
```

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f localstack
docker-compose logs -f postgres
```

**Stop and remove everything:**
```bash
# Remove containers but keep data
docker-compose down

# Remove containers AND data (fresh start)
docker-compose down -v
```

### Common Tasks

**Reset database to fresh state:**
```bash
docker-compose down -v
docker-compose up -d postgres
```

**Clear LocalStack data:**
```bash
rm -rf localstack-data
docker-compose restart localstack
```

**Access PostgreSQL shell:**
```bash
docker exec -it connect2-postgres psql -U connect_user -d connect2_dev
```

**Test S3 upload:**
```bash
echo "test" > test.txt
awslocal s3 cp test.txt s3://connect2-documents-dev/test.txt
awslocal s3 ls s3://connect2-documents-dev/
```

**Send test message to queue:**
```bash
awslocal sqs send-message \
  --queue-url http://localhost:4566/000000000000/connect2-document-processing \
  --message-body '{"test": "message"}'
```

---

## Connection Strings

Save these for your application configuration:

**PostgreSQL:**
```bash
# From host machine
postgresql://connect_user:connect_dev_password@localhost:5432/connect2_dev

# From Docker containers
postgresql://connect_user:connect_dev_password@postgres:5432/connect2_dev
```

**Redis:**
```bash
# From host machine
redis://localhost:6379

# From Docker containers
redis://redis:6379
```

**LocalStack (AWS):**
```bash
# Endpoint
http://localhost:4566 (from host)
http://localstack:4566 (from containers)

# Credentials (for local only)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_REGION=us-west-2
```

---

## Environment Variables

Create `.env.local` in your project root:

```bash
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://connect_user:connect_dev_password@localhost:5432/connect2_dev

# Redis
REDIS_URL=redis://localhost:6379

# AWS LocalStack
AWS_ENDPOINT_URL=http://localhost:4566
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
S3_BUCKET_NAME=connect2-documents-dev

# Auth (local dev only)
JWT_SECRET=local-dev-secret-change-in-production

# Feature flags (disable external services in local dev)
ENABLE_AI_FEATURES=false
ENABLE_EMAIL_NOTIFICATIONS=false
ENABLE_SMS_NOTIFICATIONS=false
```

---

## Troubleshooting

### Services won't start

```bash
# Check Docker is running
docker ps

# View detailed logs
docker-compose logs

# Force recreate
docker-compose up -d --force-recreate
```

### Port conflicts

If ports 4566, 5432, 6379, or 5050 are already in use:

```bash
# Check what's using the port (Mac/Linux)
lsof -i :5432

# Check what's using the port (Windows)
netstat -ano | findstr :5432

# Kill the process or change ports in docker-compose.yml
```

### Can't connect to PostgreSQL

```bash
# Verify it's running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Verify health
docker exec connect2-postgres pg_isready -U connect_user
```

### LocalStack not responding

```bash
# Check health
curl http://localhost:4566/_localstack/health

# Restart LocalStack
docker-compose restart localstack

# Check logs
docker-compose logs localstack
```

### Need to start fresh

```bash
# Nuclear option: remove everything and start over
docker-compose down -v
rm -rf localstack-data
docker-compose up -d
```

---

## Next Steps

1. **Read the full documentation:**
   - [LOCAL_DEVELOPMENT_PLAN.md](LOCAL_DEVELOPMENT_PLAN.md) - Complete setup guide
   - [PRODUCT_REQUIREMENTS_DOCUMENT.md](PRODUCT_REQUIREMENTS_DOCUMENT.md) - Product specs
   - [COST_OF_OWNERSHIP.md](COST_OF_OWNERSHIP.md) - AWS architecture

2. **Set up your application:**
   - Create `backend/` directory with your API code
   - Create `frontend/` directory with your UI code
   - Uncomment the `api` and `frontend` services in `docker-compose.yml`

3. **Explore the database:**
   - Open pgAdmin: http://localhost:5050
   - Run sample queries
   - Understand the data model

4. **Test LocalStack:**
   - Upload files to S3
   - Send messages to SQS
   - Read secrets from Secrets Manager

---

## Quick Tips

✅ **Use `awslocal` instead of `aws` CLI** - It's pre-configured for LocalStack
✅ **Services persist data** - Your database and LocalStack data survives restarts
✅ **Use `docker-compose down -v` for fresh start** - Removes all data
✅ **Check logs frequently** - `docker-compose logs -f` is your friend
✅ **pgAdmin is optional** - Use `psql` if you prefer command line

---

## Cost Savings

By using LocalStack + Docker for local development:

- **$0/month** vs. $500-1,500/month for AWS dev accounts
- **10-50x faster** API calls (local vs cloud)
- **Offline development** - work anywhere
- **No AWS charges** for testing and development

---

## Support

- **Issues?** Check [TROUBLESHOOTING.md](LOCAL_DEVELOPMENT_PLAN.md#11-troubleshooting-guide)
- **Questions?** Ask your team lead
- **Found a bug?** Create a GitHub issue

---

**You're ready to start building! 🚀**
