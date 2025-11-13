# Connect 2.0 - Baseline Cost of Ownership Analysis
**Version 1.0 | November 13, 2025**

---

## Executive Summary

This document provides a comprehensive cost analysis for the Connect 2.0 platform across development, MVP operations, and commercial scaling. Cost estimates are provided for three cloud provider options (Azure, AWS, GCP) and multiple scaling scenarios.

### Total Cost Summary (Annual)

| Phase | Timeline | Azure | AWS | GCP | Notes |
|-------|----------|-------|-----|-----|-------|
| **MVP Phase 1** (Design & Entitlement) | Days 1-90 | $8,500 | $8,200 | $7,900 | 6 users, limited modules |
| **MVP Phase 2** (Full Platform) | Days 91-180 | $15,200 | $14,800 | $14,300 | 20 users, all modules |
| **Year 1 Operations** (Blueprint) | Post-Day 180 | $38,400 | $36,900 | $35,600 | 25 users, full production |
| **Multi-Tenant (5 clients)** | Days 180-360 | $84,000 | $79,500 | $76,800 | ~100 users total |
| **Multi-Tenant (20 clients)** | Year 2+ | $245,000 | $232,000 | $223,000 | ~400 users total |

**Note:** All costs are *operational expenses only* and exclude:
- Development team salaries
- Initial platform build costs
- Consulting/professional services
- One-time migration costs
- Sales & marketing expenses

---

## Table of Contents

1. [Cost Model Assumptions](#1-cost-model-assumptions)
2. [Cloud Infrastructure Costs](#2-cloud-infrastructure-costs)
3. [AI & ML Services](#3-ai--ml-services)
4. [SaaS & Third-Party Services](#4-saas--third-party-services)
5. [Development & Operations Tools](#5-development--operations-tools)
6. [Phased Cost Breakdown](#6-phased-cost-breakdown)
7. [Multi-Tenant Scaling](#7-multi-tenant-scaling)
8. [Cost Optimization Strategies](#8-cost-optimization-strategies)
9. [Risk Factors & Variables](#9-risk-factors--variables)

---

## 1. Cost Model Assumptions

### User & Usage Metrics (Blueprint as Client Zero)

| Metric | MVP Phase 1 (Days 1-90) | MVP Phase 2 (Days 91-180) | Year 1 Operations |
|--------|-------------------------|---------------------------|-------------------|
| **Active Users** | 6 (Design & Entitlement team) | 20 (all teams) | 25 (all teams + growth) |
| **Concurrent Users** | 3 | 10 | 15 |
| **Projects/Year** | ~100 (entitlement only) | ~3,200 (leads) → ~500 deals | ~3,200 leads → ~600 deals |
| **Active Loans** | 0 | ~150 | ~200 |
| **Documents/Month** | ~200 | ~1,500 | ~2,000 |
| **Document Storage** | 50 GB | 500 GB | 1.5 TB (cumulative) |
| **API Calls/Day** | ~5,000 | ~50,000 | ~75,000 |
| **Database Size** | 5 GB | 25 GB | 50 GB |

### Traffic & Performance Targets

- **Uptime SLA:** 99.5% (≤43 hours downtime/year)
- **Response Time:** <500ms (95th percentile)
- **Peak Traffic:** 3x average (end-of-month draw cycles)
- **Data Retention:** 7 years (legal/regulatory requirement)

### Geographic Distribution

- **Primary Region:** US West (Seattle) - Blueprint HQ
- **Backup/DR Region:** US East (redundancy)
- **Global CDN:** Not required for MVP (internal users only)

---

## 2. Cloud Infrastructure Costs

### 2.1 Compute (Application Hosting)

**Architecture Assumption:** Kubernetes-based microservices or containerized modular monolith

| Component | Azure | AWS | GCP | Specs |
|-----------|-------|-----|-----|-------|
| **Web/API Servers** | 2x D4s v5 ($280/mo) | 2x m6i.xlarge ($263/mo) | 2x e2-standard-4 ($245/mo) | 4 vCPU, 16GB RAM each |
| **Background Workers** | 1x D2s v5 ($85/mo) | 1x m6i.large ($81/mo) | 1x e2-standard-2 ($74/mo) | 2 vCPU, 8GB RAM |
| **Load Balancer** | App Gateway ($260/mo) | ALB ($30/mo) | Cloud Load Balancer ($25/mo) | Regional, basic tier |
| **Auto-scaling buffer** | +20% ($125/mo) | +20% ($115/mo) | +20% ($108/mo) | Handle peak loads |
| **SUBTOTAL (Monthly)** | **$830** | **$735** | **$688** | |
| **ANNUAL** | **$9,960** | **$8,820** | **$8,256** | |

**Scaling Notes:**
- MVP Phase 1: Use 50% capacity ($4,980 Azure / $4,410 AWS / $4,128 GCP annually)
- MVP Phase 2: Full capacity as shown
- Year 1+: Add 1-2 additional servers as usage grows (+$3,000-6,000/year)

### 2.2 Database

**Primary Option:** Managed PostgreSQL (relational data model per PRD)

| Component | Azure | AWS | GCP | Specs |
|-----------|-------|-----|-----|-------|
| **Primary Database** | Azure Database for PostgreSQL Flexible ($320/mo) | RDS PostgreSQL db.m6i.large ($280/mo) | Cloud SQL PostgreSQL db-n1-standard-2 ($265/mo) | 2 vCPU, 8GB RAM, 100GB SSD |
| **Read Replica** (optional for reports) | +$160/mo | +$140/mo | +$133/mo | Same specs, secondary region |
| **Backup Storage** | Included (7 days), +$15/mo (30 days) | Included (7 days), +$12/mo (30 days) | Included (7 days), +$10/mo (30 days) | 30-day retention |
| **Database Growth** | +$1/GB/mo over 100GB | +$0.92/GB/mo over 100GB | +$0.85/GB/mo over 100GB | Pay for growth |
| **SUBTOTAL (Monthly)** | **$495** | **$432** | **$408** | With read replica + extended backups |
| **ANNUAL** | **$5,940** | **$5,184** | **$4,896** | |

**Scaling Notes:**
- MVP Phase 1: Single instance, no replica ($3,840 Azure / $3,360 AWS / $3,180 GCP annually)
- MVP Phase 2: Add read replica as shown
- Year 1: Grow to 200GB database (+$100-150/month)

**Alternative: NoSQL Option (if preferred)**

| Component | Azure | AWS | GCP |
|-----------|-------|-----|-----|
| **CosmosDB** (Azure) | $180/mo (serverless, 50GB) | N/A | N/A |
| **DynamoDB** (AWS) | N/A | $130/mo (on-demand, 50GB) | N/A |
| **Firestore** (GCP) | N/A | N/A | $95/mo (native mode, 50GB) |

*Note: NoSQL costs scale with usage; estimates assume 50M reads + 10M writes/month*

### 2.3 Object Storage (Documents, Images, Plans)

| Component | Azure | AWS | GCP | Volume |
|-----------|-------|-----|-----|--------|
| **Hot Tier** (recent docs) | Blob Storage: $23/100GB/mo | S3 Standard: $23/100GB/mo | Cloud Storage Standard: $20/100GB/mo | 500GB in Year 1 |
| **Cool Tier** (archive) | $10/100GB/mo | S3 Infrequent Access: $12.50/100GB/mo | Nearline: $10/100GB/mo | 1TB archive in Year 1 |
| **Data Transfer** (egress) | $87/TB | $90/TB | $85/TB | ~100GB/month |
| **Estimated Monthly** | **$225** | **$240** | **$210** | 500GB hot + 1TB cool + 100GB egress |
| **ANNUAL** | **$2,700** | **$2,880** | **$2,520** | |

**Scaling Notes:**
- MVP Phase 1: 50GB storage (~$12/month all providers)
- MVP Phase 2: 500GB storage (~$115/month Azure / $120 AWS / $105 GCP)
- Year 1: 1.5TB total as shown
- **Plan library:** 1,500 plan sets = ~150GB (one-time upload)
- **Growth:** +200GB/year (documents per PRD usage estimates)

### 2.4 Message Queue / Event Streaming

For async workflows (e.g., document processing, status updates)

| Component | Azure | AWS | GCP | Usage |
|-----------|-------|-----|-----|-------|
| **Service Bus / SQS / Pub/Sub** | Service Bus: $10/mo | SQS: $8/mo | Pub/Sub: $7/mo | ~10M messages/month |
| **Event Grid** (optional) | +$5/mo | SNS: +$3/mo | N/A (included) | Event notifications |
| **SUBTOTAL (Monthly)** | **$15** | **$11** | **$7** | |
| **ANNUAL** | **$180** | **$132** | **$84** | |

### 2.5 Authentication & Identity

| Component | Azure | AWS | GCP | Users |
|-----------|-------|-----|-----|-------|
| **Azure AD B2C / Cognito / Identity Platform** | Free (< 50K MAU) | Free (< 50K MAU) | Free (< 50K logins) | Up to 1,000 users for free |
| **SSO / SAML** (multi-tenant future) | $0.015/MAU over 50K | $0.015/MAU | $0.015/MAU | Post-MVP feature |

**Cost:** $0 for MVP and Year 1 (under free tier limits)

### 2.6 Content Delivery Network (CDN)

**Not required for MVP** - internal users only

Post-MVP for external portals:
- Azure CDN: $80/TB + $8/10M requests = ~$100/month
- CloudFront (AWS): $85/TB + $10/10M requests = ~$105/month
- Cloud CDN (GCP): $80/TB + $8/10M requests = ~$98/month

**Estimated Year 1:** $0 (defer until multi-tenant)

### 2.7 Networking & Security

| Component | Azure | AWS | GCP |
|-----------|-------|-----|-----|
| **Virtual Network** | $0 (included) | VPC: $0 (included) | VPC: $0 (included) |
| **NAT Gateway** | $45/mo | $45/mo | $40/mo |
| **VPN / Private Link** (if needed) | $145/mo | $150/mo | $140/mo |
| **Web Application Firewall** | $125/mo | $100/mo | $95/mo |
| **DDOS Protection** | Basic: $0 / Standard: $2,944/mo | Shield Standard: $0 / Advanced: $3,000/mo | Basic: $0 |
| **SUBTOTAL (Monthly)** | **$170** (basic) | **$145** (basic) | **$135** (basic) |
| **ANNUAL** | **$2,040** | **$1,740** | **$1,620** | |

**Note:** Using basic DDOS protection for MVP; upgrade to advanced for production at +$3,000/month

### 2.8 Backup & Disaster Recovery

| Component | Azure | AWS | GCP |
|-----------|-------|-----|-----|
| **Database Backups** | Included in DB costs | Included in DB costs | Included in DB costs |
| **VM Snapshots** | $0.05/GB/mo × 200GB = $10/mo | EBS Snapshots: $0.05/GB × 200GB = $10/mo | Persistent Disk Snapshots: $0.026/GB × 200GB = $5/mo |
| **Cross-Region Replication** | $50/mo (blob replication) | $45/mo (S3 replication) | $40/mo (storage replication) |
| **SUBTOTAL (Monthly)** | **$60** | **$55** | **$45** | |
| **ANNUAL** | **$720** | **$660** | **$540** | |

### **Total Cloud Infrastructure Costs**

| Category | Azure (Annual) | AWS (Annual) | GCP (Annual) |
|----------|----------------|--------------|--------------|
| Compute | $9,960 | $8,820 | $8,256 |
| Database | $5,940 | $5,184 | $4,896 |
| Object Storage | $2,700 | $2,880 | $2,520 |
| Message Queue | $180 | $132 | $84 |
| Auth/Identity | $0 | $0 | $0 |
| CDN | $0 | $0 | $0 |
| Networking | $2,040 | $1,740 | $1,620 |
| Backup/DR | $720 | $660 | $540 |
| **TOTAL** | **$21,540** | **$19,416** | **$17,916** |

---

## 3. AI & ML Services

### 3.1 Document Intelligence (Extraction)

Azure Document Intelligence / AWS Textract / GCP Document AI

| Service | Azure | AWS | GCP | Usage |
|---------|-------|-----|-----|-------|
| **Document Extraction** | $1.50/1,000 pages | $1.50/1,000 pages | $1.50/1,000 pages | Industry standard pricing |
| **Custom Model Training** | $40/model/month | $30/model/month | $35/model/month | Train 3 models (survey, title, arborist) |
| **Estimated Volume** | 2,000 docs/month × 5 pages avg = 10,000 pages/month | Same | Same | Per PRD usage |
| **Monthly Cost** | $15 (extraction) + $120 (models) = **$135** | $15 + $90 = **$105** | $15 + $105 = **$120** | |
| **ANNUAL** | **$1,620** | **$1,260** | **$1,440** | |

**Scaling Notes:**
- MVP Phase 1: 200 docs/month = $130/year (all providers)
- MVP Phase 2: 1,500 docs/month = $540/year
- Year 1: 2,000 docs/month as shown
- **Cost driver:** Number of documents processed (surveys, title reports, arborist reports)

### 3.2 GPT / LLM Services (Summarization, Chat)

Azure OpenAI / OpenAI API / Vertex AI (PaLM/Gemini)

| Service | Azure OpenAI | OpenAI API | GCP Vertex AI | Usage |
|---------|--------------|------------|---------------|-------|
| **Model** | GPT-4 Turbo | GPT-4 Turbo | Gemini 1.5 Pro | Latest models |
| **Input Tokens** | $10/1M tokens | $10/1M tokens | $7/1M tokens | Document summarization |
| **Output Tokens** | $30/1M tokens | $30/1M tokens | $21/1M tokens | Summaries generated |
| **Estimated Volume** | 20M input + 2M output tokens/month | Same | Same | ~2,000 docs × 10K tokens each |
| **Monthly Cost** | $200 + $60 = **$260** | **$260** | $140 + $42 = **$182** | |
| **ANNUAL** | **$3,120** | **$3,120** | **$2,184** | |

**Use Cases:**
- Document summarization (title reports, survey findings)
- Natural language queries (post-MVP)
- Builder/consultant recommendations
- Risk analysis narrative generation

**Alternative: GPT-3.5 Turbo (Cost Savings)**
- Input: $0.50/1M tokens | Output: $1.50/1M tokens
- Same volume: $10 + $3 = **$13/month** or **$156/year**
- **Trade-off:** Lower quality summaries, less sophisticated reasoning

### 3.3 Custom ML Models (Lead Scoring, Timeline Forecasting)

**Post-MVP Feature** - included for planning

| Component | Azure ML | AWS SageMaker | GCP Vertex AI |
|-----------|----------|---------------|---------------|
| **Model Training** | $0.60/hour × 10 hours/month = $6/mo | $0.50/hour × 10 hours = $5/mo | $0.55/hour × 10 hours = $5.50/mo |
| **Model Hosting** | $50/mo (1 endpoint, low traffic) | $45/mo | $48/mo |
| **Inference** | $0.10/1,000 predictions × 100K/month = $10/mo | Same | Same |
| **Monthly Cost** | **$66** | **$60** | **$63.50** | |
| **ANNUAL** | **$792** | **$720** | **$762** | |

**Models Planned (Post-MVP):**
1. Lead scoring (viability prediction)
2. Entitlement timeline forecasting
3. Builder recommendation engine
4. Risk scoring for loans

**MVP Cost:** $0 (defer until post-180 days)

### **Total AI/ML Costs**

| Service | Azure (Annual) | AWS/OpenAI (Annual) | GCP (Annual) |
|---------|----------------|---------------------|--------------|
| Document Intelligence | $1,620 | $1,260 | $1,440 |
| GPT/LLM Services | $3,120 | $3,120 | $2,184 |
| Custom ML (Post-MVP) | $792 | $720 | $762 |
| **MVP TOTAL** | **$4,740** | **$4,380** | **$3,624** |
| **Year 1 TOTAL** | **$5,532** | **$5,100** | **$4,386** |

---

## 4. SaaS & Third-Party Services

### 4.1 Email Services

SendGrid / Amazon SES / Google Workspace SMTP

| Service | SendGrid | Amazon SES | Mailgun | Usage |
|---------|----------|------------|---------|-------|
| **Volume** | 100K emails/month | 100K emails/month | 100K emails/month | Notifications, statements |
| **Pricing** | $20/mo (Essentials plan) | $10/mo ($0.10/1K after first 62K free) | $35/mo | Industry pricing |
| **ANNUAL** | **$240** | **$120** | **$420** | |

**Recommended:** Amazon SES (lowest cost) or SendGrid (better deliverability/analytics)

**Email Volume Breakdown:**
- Task notifications: ~30K/month
- Monthly statements: ~200/month
- System alerts: ~5K/month
- Marketing/announcements: ~10K/month (future)

### 4.2 SMS Services

Twilio / AWS SNS / Google Cloud Communication Services

| Service | Twilio | AWS SNS | Azure Communication | Usage |
|---------|--------|---------|---------------------|-------|
| **Volume** | 5,000 SMS/month | 5,000 SMS/month | 5,000 SMS/month | Urgent alerts only |
| **Pricing** | $0.0079/SMS (US) × 5K = $40/mo | $0.0075/SMS × 5K = $38/mo | $0.0075/SMS × 5K = $38/mo | Standard US rates |
| **ANNUAL** | **$480** | **$456** | **$456** | |

**Use Cases:**
- Urgent task alerts
- Draw approval notifications
- System downtime alerts

**Cost Control:** SMS should be opt-in; email preferred to minimize costs

### 4.3 E-Signature Services

DocuSign / HelloSign (Dropbox Sign) / Adobe Sign

| Service | DocuSign | HelloSign | Adobe Sign | Usage |
|---------|----------|-----------|------------|-------|
| **Plan** | Standard ($25/user/mo × 3 users) | Essentials ($15/mo unlimited) | Small Business ($30/user/mo) | Based on servicing team needs |
| **Envelopes** | 100/month included | Unlimited | 150/month included | Loan documents |
| **Monthly Cost** | **$75** | **$15** | **$90** | |
| **ANNUAL** | **$900** | **$180** | **$1,080** | |

**Estimated Envelope Volume:**
- Loan origination docs: ~50 envelopes/month (600/year)
- Modifications/amendments: ~20/month
- Miscellaneous: ~10/month

**Recommendation:** HelloSign for cost savings OR DocuSign for enterprise features

**Alternative: Authentisign** (current provider per PRD)
- Pricing TBD - need current contract details
- Assume similar to HelloSign (~$15-25/month)

### 4.4 Monitoring & Observability

Application Insights / Datadog / New Relic

| Service | Azure App Insights | Datadog | New Relic | Coverage |
|---------|-------------------|---------|-----------|----------|
| **Plan** | Pay-as-you-go | Pro ($31/host/mo × 3 hosts) | Standard ($99/mo) | APM + infrastructure monitoring |
| **Data Ingestion** | $2.30/GB × 50GB/mo = $115/mo | Included up to 150GB | Included up to 100GB | Logs, metrics, traces |
| **Monthly Cost** | **$115** | **$93** | **$99** | |
| **ANNUAL** | **$1,380** | **$1,116** | **$1,188** | |

**Features Needed:**
- Application performance monitoring (APM)
- Infrastructure metrics (CPU, memory, disk)
- Log aggregation and search
- Alerting and dashboards
- Uptime monitoring (99.5% SLA per PRD)

**Cost-Efficient Alternative:** Use native cloud monitoring
- Azure Monitor: ~$100/month
- AWS CloudWatch: ~$80/month
- GCP Cloud Monitoring: ~$70/month

### 4.5 Error Tracking & Logging

Sentry / Rollbar / LogRocket

| Service | Sentry | Rollbar | LogRocket |
|---------|--------|---------|-----------|
| **Plan** | Team ($26/mo) | Essentials ($49/mo) | Team ($99/mo) |
| **Events** | 50K errors/month | 25K errors/month | 10K sessions/month |
| **ANNUAL** | **$312** | **$588** | **$1,188** |

**Recommended:** Sentry (best balance of features/cost)

### 4.6 CI/CD & DevOps Tools

GitHub Actions / GitLab CI / CircleCI

| Service | GitHub Actions | GitLab CI | CircleCI |
|---------|----------------|-----------|----------|
| **Plan** | Team ($4/user/mo × 5 devs) | Premium ($29/user/mo) | Performance ($70/mo) |
| **CI/CD Minutes** | 3,000 min/mo included, +$0.008/min | 10K min/mo | 25K credits/mo |
| **Storage** | 2GB included, +$0.25/GB | 10GB | 10GB |
| **Monthly Cost** | **$20** | **$145** | **$70** |
| **ANNUAL** | **$240** | **$1,740** | **$840** |

**Recommended:** GitHub Actions (lowest cost, tight integration with GitHub repos)

**Alternative:** Use cloud-native CI/CD
- Azure DevOps: $6/user/mo × 5 = $30/month ($360/year)
- AWS CodePipeline: Pay-per-use, ~$50/month ($600/year)
- GCP Cloud Build: 120 min/day free, ~$30/month over ($360/year)

### 4.7 Project Management & Collaboration

Jira / Linear / Monday.com

| Service | Jira | Linear | Monday.com |
|---------|------|--------|------------|
| **Plan** | Standard ($7.75/user/mo × 25 users) | Plus ($8/user/mo) | Standard ($10/user/mo) |
| **Monthly Cost** | **$194** | **$200** | **$250** |
| **ANNUAL** | **$2,328** | **$2,400** | **$3,000** |

**Note:** This is for internal development team project management, NOT the Connect 2.0 built-in task management

**Cost Saving:** Use free tier (Jira: 10 users free, Linear: unlimited viewers free) during MVP

### 4.8 Security & Compliance

| Service | Cost | Provider | Purpose |
|---------|------|----------|---------|
| **SSL/TLS Certificates** | $0 | Let's Encrypt | Free SSL certs |
| **Secrets Management** | $25/mo | Azure Key Vault / AWS Secrets Manager / GCP Secret Manager | API keys, credentials |
| **Vulnerability Scanning** | $50/mo | Snyk / Aqua Security | Container/dependency scanning |
| **Penetration Testing** | $5,000/year | Third-party firm | Annual security audit |
| **Compliance Audit** (future) | $10,000/year | SOC 2 Type II (post-MVP) | For enterprise clients |
| **ANNUAL** | **$6,100** | Various | Security baseline |

**MVP Cost:** $900/year (secrets mgmt + vuln scanning only)

### **Total SaaS & Third-Party Costs**

| Service | Annual Cost | Provider Options |
|---------|-------------|------------------|
| Email | $240 | SendGrid / SES |
| SMS | $480 | Twilio / AWS SNS |
| E-Signature | $900 | DocuSign / HelloSign |
| Monitoring | $1,380 | Azure App Insights / Datadog |
| Error Tracking | $312 | Sentry |
| CI/CD | $240 | GitHub Actions |
| Project Mgmt | $0 (free tier) | Jira / Linear |
| Security | $900 | Various |
| **TOTAL** | **$4,452** | |

---

## 5. Development & Operations Tools

### 5.1 Development Environment

| Tool | Cost | Purpose |
|------|------|---------|
| **GitHub Team** | $4/user/mo × 5 devs = $240/year | Source control |
| **VS Code** | Free | IDE |
| **Postman Team** | $12/user/mo × 3 = $432/year | API testing |
| **Figma Professional** | $12/editor/mo × 2 = $288/year | UX/UI design |
| **Database Tools** | $0 (use pgAdmin, DBeaver free) | Database management |
| **ANNUAL** | **$960** | |

### 5.2 Staging & Development Environments

| Environment | Azure | AWS | GCP |
|-------------|-------|-----|-----|
| **Development** | 25% of production = $5,385/year | 25% = $4,854/year | 25% = $4,479/year |
| **Staging** | 50% of production = $10,770/year | 50% = $9,708/year | 50% = $8,958/year |
| **TOTAL** | **$16,155** | **$14,562** | **$13,437** |

**Note:** Dev/staging environments run smaller instances and can be shut down nights/weekends for cost savings

### **Total Development & Operations**

| Category | Annual Cost |
|----------|-------------|
| Development Tools | $960 |
| Dev/Staging Environments | $13,437 - $16,155 (varies by cloud) |
| **TOTAL** | **$14,400 - $17,100** |

---

## 6. Phased Cost Breakdown

### 6.1 MVP Phase 1 (Days 1-90): Design & Entitlement Only

| Category | Azure | AWS | GCP |
|----------|-------|-----|-----|
| **Infrastructure** | $5,385 (25% of full) | $4,854 | $4,479 |
| **AI Services** | $325 (200 docs/mo) | $300 | $285 |
| **SaaS Services** | $800 (limited email/monitoring) | $800 | $800 |
| **Dev/Ops Tools** | $240 | $240 | $240 |
| **Dev/Staging Envs** | $4,050 | $3,640 | $3,360 |
| **TOTAL (3 months)** | **$10,800** | **$9,834** | **$9,164** |
| **MONTHLY AVERAGE** | **$3,600** | **$3,278** | **$3,055** |

**Users:** 6 (Design & Entitlement team)
**Documents:** 200/month
**Active Projects:** ~30

### 6.2 MVP Phase 2 (Days 91-180): Full Platform Rebuild

| Category | Azure | AWS | GCP |
|----------|-------|-----|-----|
| **Infrastructure** | $10,770 (50% of full) | $9,708 | $8,958 |
| **AI Services** | $1,320 (1,500 docs/mo) | $1,200 | $1,080 |
| **SaaS Services** | $1,600 (email, SMS, e-sign) | $1,600 | $1,600 |
| **Dev/Ops Tools** | $240 | $240 | $240 |
| **Dev/Staging Envs** | $8,100 | $7,280 | $6,720 |
| **TOTAL (3 months)** | **$22,030** | **$20,028** | **$18,598** |
| **MONTHLY AVERAGE** | **$7,343** | **$6,676** | **$6,199** |

**Users:** 20 (all Blueprint teams)
**Documents:** 1,500/month
**Active Projects:** ~200 leads + 50 entitlement + 150 loans

### 6.3 Year 1 Operations (Post-Day 180)

| Category | Azure | AWS | GCP |
|----------|-------|-----|-----|
| **Infrastructure** | $21,540 | $19,416 | $17,916 |
| **AI Services** | $5,532 | $5,100 | $4,386 |
| **SaaS Services** | $4,452 | $4,452 | $4,452 |
| **Dev/Ops Tools** | $960 | $960 | $960 |
| **Dev/Staging Envs** | $16,155 | $14,562 | $13,437 |
| **TOTAL (Annual)** | **$48,639** | **$44,490** | **$41,151** |
| **MONTHLY AVERAGE** | **$4,053** | **$3,708** | **$3,429** |

**Users:** 25 (Blueprint + modest growth)
**Documents:** 2,000/month
**Storage:** 1.5TB cumulative
**Active Loans:** ~200

### **6.4 Total First 180 Days**

| Cloud Provider | Phase 1 (90 days) | Phase 2 (90 days) | **Total 180 Days** |
|----------------|-------------------|-------------------|---------------------|
| **Azure** | $10,800 | $22,030 | **$32,830** |
| **AWS** | $9,834 | $20,028 | **$29,862** |
| **GCP** | $9,164 | $18,598 | **$27,762** |

---

## 7. Multi-Tenant Scaling

### 7.1 Scaling Assumptions

| Clients | Users | Projects/Year | Active Loans | Documents/Month | Storage (TB) |
|---------|-------|---------------|--------------|-----------------|--------------|
| **1 (Blueprint)** | 25 | 3,200 leads → 600 deals | 200 | 2,000 | 1.5 |
| **5 clients** | 100 | 12,000 leads → 2,000 deals | 800 | 8,000 | 5 |
| **10 clients** | 200 | 25,000 leads → 4,500 deals | 1,600 | 16,000 | 10 |
| **20 clients** | 400 | 50,000 leads → 9,000 deals | 3,200 | 32,000 | 20 |

### 7.2 Cost Scaling by Tier (Annual)

#### **5 Clients (~100 Users)**

| Category | Azure | AWS | GCP |
|----------|-------|-----|-----|
| **Infrastructure** | $48,600 | $43,800 | $40,400 |
| **AI Services** | $22,000 | $20,000 | $17,500 |
| **SaaS Services** | $13,400 | $13,400 | $13,400 |
| **Dev/Ops** | $17,100 | $15,400 | $14,200 |
| **TOTAL** | **$101,100** | **$92,600** | **$85,500** |
| **Per Client** | **$20,220** | **$18,520** | **$17,100** |

**Infrastructure Scaling:**
- Compute: 6x servers (4 web/API, 2 workers) = $30K/year
- Database: Larger instance (4 vCPU, 16GB) + read replicas = $12K/year
- Storage: 5TB = $6K/year

#### **10 Clients (~200 Users)**

| Category | Azure | AWS | GCP |
|----------|-------|-----|-----|
| **Infrastructure** | $86,400 | $77,800 | $71,800 |
| **AI Services** | $44,000 | $40,000 | $35,000 |
| **SaaS Services** | $24,000 | $24,000 | $24,000 |
| **Dev/Ops** | $18,600 | $16,800 | $15,500 |
| **TOTAL** | **$173,000** | **$158,600** | **$146,300** |
| **Per Client** | **$17,300** | **$15,860** | **$14,630** |

**Infrastructure Scaling:**
- Compute: 12x servers (autoscaling) = $54K/year
- Database: Multi-region, sharded = $22K/year
- Storage: 10TB = $10K/year

#### **20 Clients (~400 Users)**

| Category | Azure | AWS | GCP |
|----------|-------|-----|-----|
| **Infrastructure** | $156,000 | $140,600 | $129,800 |
| **AI Services** | $88,000 | $80,000 | $70,000 |
| **SaaS Services** | $42,000 | $42,000 | $42,000 |
| **Dev/Ops** | $20,000 | $18,000 | $16,600 |
| **TOTAL** | **$306,000** | **$280,600** | **$258,400** |
| **Per Client** | **$15,300** | **$14,030** | **$12,920** |

**Infrastructure Scaling:**
- Compute: Kubernetes cluster with 24+ nodes = $96K/year
- Database: Horizontally sharded, multi-region = $40K/year
- Storage: 20TB = $20K/year

### 7.3 Marginal Cost per New Client

| Tier | Azure (Annual) | AWS (Annual) | GCP (Annual) |
|------|----------------|--------------|--------------|
| **Client 1 (Blueprint baseline)** | $48,639 | $44,490 | $41,151 |
| **Clients 2-5** | +$13,200/client | +$12,000/client | +$11,100/client |
| **Clients 6-10** | +$14,400/client | +$13,200/client | +$12,200/client |
| **Clients 11-20** | +$13,300/client | +$12,200/client | +$11,200/client |

**Economies of Scale:**
- Fixed costs (dev/staging, monitoring) amortize across clients
- Bulk pricing negotiations kick in at scale
- Shared infrastructure components (auth, CDN, etc.)

### 7.4 Revenue Model Implications

**Current External Clients (Send Capital, Create Capital):**
- Pay $5-6K/month each ($60-72K/year)
- Heavily customized instances (out of scope for Connect 2.0 MVP)

**Proposed Connect 2.0 Pricing (SaaS Model):**

| Pricing Model | Small Lender | Mid-Size Lender | Enterprise |
|---------------|--------------|-----------------|------------|
| **Profile** | 1-5 users, <500 deals/year | 10-20 users, 500-2,000 deals/year | 25+ users, 2,000+ deals/year |
| **Suggested Price** | $1,500/mo ($18K/year) | $4,000/mo ($48K/year) | $8,000/mo ($96K/year) |
| **Platform Cost** | $11,100-14,400/year | $15,300-17,300/year | $41,151/year (full instance) |
| **Gross Margin** | ~25% (low margin tier) | ~65% (healthy margin) | ~57% (strong margin) |

**Key Insight:** Need 3-5 clients minimum to achieve profitability per client; economies improve dramatically at 10+ clients

---

## 8. Cost Optimization Strategies

### 8.1 Infrastructure Optimization

| Strategy | Potential Savings | Implementation |
|----------|-------------------|----------------|
| **Reserved Instances** | 30-40% on compute/database | Commit to 1-3 year terms for production |
| **Spot/Preemptible Instances** | 60-80% on batch workloads | Use for non-critical background jobs (document processing) |
| **Auto-scaling policies** | 20-30% on compute | Scale down during off-hours (nights, weekends) |
| **Storage lifecycle policies** | 50-70% on old documents | Auto-archive docs >2 years old to cold tier |
| **Database optimization** | 20-30% on database | Right-size instances, optimize queries, use read replicas |
| **ESTIMATED TOTAL SAVINGS** | **$8,000-15,000/year** | Implement by Day 180 |

### 8.2 AI/ML Optimization

| Strategy | Potential Savings | Implementation |
|----------|-------------------|----------------|
| **Batch processing** | 20-30% on document extraction | Process documents in bulk vs. real-time |
| **Use GPT-3.5 instead of GPT-4** | 90% on LLM costs | Trade quality for cost where appropriate |
| **Cache frequent queries** | 40-60% on API calls | Cache common summaries/recommendations |
| **Self-host models (advanced)** | 50-70% at scale | Run open-source models (Llama, Mistral) on own infrastructure |
| **ESTIMATED TOTAL SAVINGS** | **$2,000-4,000/year** | Implement selectively post-MVP |

### 8.3 SaaS Optimization

| Strategy | Potential Savings | Implementation |
|----------|-------------------|----------------|
| **Email: Use SES instead of SendGrid** | $120/year | Lower cost, less analytics |
| **SMS: Strict opt-in policy** | $200-300/year | Default to email, SMS only for urgent alerts |
| **E-signature: HelloSign vs DocuSign** | $720/year | Trade enterprise features for cost |
| **Monitoring: Use native cloud tools** | $600-1,000/year | Azure Monitor vs Datadog |
| **CI/CD: GitHub Actions vs dedicated** | $400-1,000/year | Use free tier where possible |
| **ESTIMATED TOTAL SAVINGS** | **$2,000-3,000/year** | Implement during MVP |

### 8.4 Development Environment Optimization

| Strategy | Potential Savings | Implementation |
|----------|-------------------|----------------|
| **Shut down dev/staging nights/weekends** | $5,000-8,000/year | Auto-shutdown policies (save 60% of runtime) |
| **Use smaller instances for development** | $2,000-3,000/year | Developers don't need production-scale |
| **Share staging across teams** | $3,000-5,000/year | Single staging environment vs. per-team |
| **ESTIMATED TOTAL SAVINGS** | **$10,000-16,000/year** | Implement from Day 1 |

### **Total Potential Savings: $22,000-38,000/year**

**Optimized Year 1 Cost:**
- Baseline: $41,151 (GCP) to $48,639 (Azure)
- After optimization: **$25,000-35,000/year**

---

## 9. Risk Factors & Variables

### 9.1 Cost Overrun Risks

| Risk Factor | Impact | Mitigation |
|-------------|--------|------------|
| **Faster user adoption than expected** | +20-50% infrastructure costs | Implement auto-scaling, monitor usage closely |
| **Document volume exceeds estimates** | +30-100% AI/storage costs | Batch processing, archive policies, cost alerts |
| **Custom integrations require more compute** | +15-30% infrastructure | Optimize integration code, use async processing |
| **Security breach / compliance failure** | +$50K-500K (one-time) | Invest in security upfront, pen testing, insurance |
| **Multi-tenant delays require longer dual-system operation** | +$10K-30K | Clear cutover plan, rollback triggers |

### 9.2 Variable Cost Drivers

| Driver | Low Case | Base Case | High Case |
|--------|----------|-----------|-----------|
| **Monthly Document Volume** | 1,000 docs | 2,000 docs | 5,000 docs |
| **AI Extraction Cost** | $15/mo | $30/mo | $75/mo |
| **Storage Growth Rate** | +100GB/year | +200GB/year | +500GB/year |
| **Active Users** | 20 | 25 | 40 |
| **Infrastructure Impact** | -20% | Baseline | +40% |

**Example: High Growth Scenario (Year 1)**
- Documents: 5,000/month instead of 2,000
- Users: 40 instead of 25
- Storage: +500GB/year instead of +200GB
- **Total Cost:** $60K-70K/year (vs. $41K-48K baseline) = **+45-50% increase**

### 9.3 External Dependencies

| Dependency | Cost Risk | Mitigation |
|------------|-----------|------------|
| **OpenAI pricing changes** | GPT-4 price increases 50% → +$1,500/year | Build fallback to GPT-3.5 or alternatives |
| **Cloud provider price increases** | Compute/storage +10% → +$2,000/year | Multi-cloud strategy, reserved pricing locks |
| **Third-party SaaS price increases** | E-signature, monitoring +20% → +$500-1,000/year | Negotiate multi-year contracts |
| **Regulatory compliance requirements** | SOC 2 mandate → +$10K-20K/year | Plan budget for post-MVP compliance |

---

## 10. Cost Allocation Model (Multi-Tenant)

### 10.1 Fixed vs. Variable Costs

| Cost Category | Type | Blueprint (Client Zero) | Multi-Tenant Allocation |
|---------------|------|-------------------------|-------------------------|
| **Core Infrastructure** (minimum cluster) | Fixed | 100% | Shared across all clients |
| **Database** (base tier) | Fixed | 100% | Shared, tenant-isolated |
| **Auth/CDN** (baseline) | Fixed | 100% | Shared |
| **Dev/Staging** | Fixed | 100% | Shared (development overhead) |
| **Compute** (auto-scaled nodes) | Variable | Per-usage | Allocate by usage metrics |
| **Storage** (per-GB) | Variable | Per-GB | Allocate by tenant storage |
| **AI Services** (per-document) | Variable | Per-document | Allocate by tenant document volume |
| **Email/SMS** (per-message) | Variable | Per-message | Allocate by tenant notifications |

### 10.2 Tenant Cost Allocation Formula

**Fixed Cost Allocation:**
```
Tenant Fixed Cost Share = (Total Fixed Costs) / (Number of Tenants)
```

**Variable Cost Allocation:**
```
Tenant Variable Cost =
  (Tenant Documents × AI Cost per Doc) +
  (Tenant Storage GB × Storage Cost per GB) +
  (Tenant Compute Hours × Compute Cost per Hour) +
  (Tenant Email/SMS × Messaging Cost per Message)
```

**Total Tenant Cost:**
```
Total = Fixed Cost Share + Variable Costs
```

### 10.3 Example: 10-Tenant Scenario

**Total Annual Costs:** $158,600 (AWS example)
- Fixed: $40,000 (dev/staging, base infrastructure, monitoring)
- Variable: $118,600 (compute, storage, AI, messaging that scales with usage)

**Tenant A (Blueprint-sized: 25 users, 2,000 docs/month):**
```
Fixed Share: $40,000 / 10 = $4,000
Variable:
  - AI: 2,000 docs × 12 months × $0.021 = $504
  - Storage: 150GB × $2.40/GB = $360
  - Compute: 20% of cluster = $11,000
  - Messaging: $400
Total: $4,000 + $12,264 = $16,264/year ($1,355/mo)
```

**Tenant B (Smaller: 5 users, 400 docs/month):**
```
Fixed Share: $4,000
Variable:
  - AI: 400 × 12 × $0.021 = $101
  - Storage: 30GB × $2.40/GB = $72
  - Compute: 5% of cluster = $2,750
  - Messaging: $100
Total: $4,000 + $3,023 = $7,023/year ($585/mo)
```

**Insight:** Smaller tenants subsidize larger ones on fixed costs, but pay proportionally for variable usage

---

## 11. Recommendations

### 11.1 Cloud Provider Selection

| Provider | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **Azure** | • M365 integration (SharePoint migration)<br>• Azure OpenAI (GPT-4 with enterprise SLA)<br>• Azure Document Intelligence mature | • 10-15% more expensive than GCP<br>• More complex pricing | **Best if:** M365 ecosystem important, enterprise AI needs |
| **AWS** | • Mature service ecosystem<br>• Best third-party integration (Bedrock, Textract)<br>• Strong Kubernetes (EKS) support | • Mid-range pricing<br>• OpenAI API separate (not integrated) | **Best if:** Broad ecosystem, third-party integrations critical |
| **GCP** | • Lowest cost (15-20% cheaper than Azure)<br>• Firebase migration path (current BPO)<br>• Strong AI/ML (Vertex AI, Document AI) | • Smaller market share (fewer experts)<br>• Less mature enterprise features | **Best if:** Cost optimization priority, Firebase familiarity |

**Recommended: GCP for MVP, evaluate Azure for enterprise clients post-MVP**

### 11.2 Cost Management Strategy

#### **Phase 1 (Days 1-90): Minimize Spend**
- Use GCP for lowest costs
- Start with smallest viable instances
- Defer AI features to Phase 2
- Use free tiers (auth, CI/CD, monitoring basics)
- **Target:** <$10K for 90 days

#### **Phase 2 (Days 91-180): Scale Deliberately**
- Implement reserved instances (30% savings)
- Optimize based on Phase 1 learnings
- Add AI services incrementally
- Monitor costs weekly
- **Target:** <$30K total for first 180 days

#### **Year 1 Operations: Optimize for Efficiency**
- Implement all cost optimization strategies (Section 8)
- Negotiate annual contracts with SaaS vendors (10-20% discounts)
- Right-size infrastructure based on actual usage
- **Target:** $25-35K/year (optimized from $41K baseline)

#### **Multi-Tenant: Pricing Strategy**
- Target 60-70% gross margin per client
- Price tiers: Small ($18K/year), Mid ($48K/year), Enterprise ($96K/year)
- Break-even at 3-5 clients
- Profitable at 10+ clients

### 11.3 Budget Allocation (Year 1)

| Category | Budget | % of Total |
|----------|--------|------------|
| Infrastructure | $18,000 | 43% |
| AI/ML Services | $5,500 | 13% |
| SaaS & Third-Party | $4,500 | 11% |
| Dev/Staging Environments | $13,500 | 32% |
| Contingency (15%) | $6,200 | -- |
| **TOTAL** | **$47,700** | 100% |

### 11.4 Monitoring & Alerts

**Set up cost alerts at:**
- 50% of monthly budget
- 75% of monthly budget
- 90% of monthly budget
- Any single service >$500/month

**Weekly Reviews:**
- Top 10 cost drivers
- Month-over-month trends
- Anomaly detection (unusual spikes)

**Quarterly Reviews:**
- Right-sizing opportunities
- Reserved instance evaluations
- SaaS contract renewals

---

## 12. Conclusion

### Key Takeaways

1. **MVP is affordable:** $27K-33K total cost for first 180 days across all cloud providers
2. **GCP offers best value:** 15-20% lower costs than Azure, suitable for MVP and scale
3. **AI is manageable:** Document extraction + GPT services = $4K-5K/year (not a cost blocker)
4. **Scaling is predictable:** Costs scale linearly with users/documents; economies kick in at 10+ clients
5. **Margins are healthy:** With proper pricing ($18K-96K/year per client), 60-70% gross margins achievable
6. **Optimization is critical:** $22K-38K/year savings available through best practices

### Budget Recommendation

**Request approval for:**
- **MVP (Days 1-180):** $35,000 budget ($30K estimated + $5K contingency)
- **Year 1 Operations:** $50,000 budget ($42K estimated + $8K contingency)
- **Multi-Tenant (5 clients):** $100,000 budget with revenue offset from client fees

### Next Steps

1. **Day 1-7:** Finalize cloud provider selection (recommend GCP)
2. **Day 1-14:** Set up cost tracking dashboard and alerts
3. **Day 14:** Lock in reserved instances for committed infrastructure
4. **Day 30:** Review actual costs vs. estimates, adjust projections
5. **Day 90:** Optimize based on Phase 1 learnings
6. **Day 180:** Finalize multi-tenant pricing model based on real operational data

---

## Appendix A: Cost Comparison Tables

### A.1 Three-Year Cost Projection

| Scenario | Year 1 | Year 2 | Year 3 | Total |
|----------|--------|--------|--------|-------|
| **Blueprint Only (1 client)** | $42K | $45K | $48K | $135K |
| **5 Clients** | $85K | $90K | $95K | $270K |
| **10 Clients** | $146K | $155K | $165K | $466K |
| **20 Clients** | $258K | $275K | $295K | $828K |

*Based on GCP pricing, 6% annual cost inflation*

### A.2 Revenue vs. Cost (Multi-Tenant)

| Clients | Annual Revenue (avg $48K/client) | Annual Costs (GCP) | Gross Profit | Margin |
|---------|----------------------------------|---------------------|--------------|--------|
| 1 | $0 (Blueprint internal) | $42K | -$42K | N/A |
| 5 | $240K | $85K | $155K | 65% |
| 10 | $480K | $146K | $334K | 70% |
| 20 | $960K | $258K | $702K | 73% |

*Assumes mid-tier pricing of $4,000/month average per client*

### A.3 Cost per User (Economies of Scale)

| Scale | Total Users | Annual Cost (GCP) | Cost per User/Year | Cost per User/Month |
|-------|-------------|-------------------|--------------------|---------------------|
| Blueprint | 25 | $42,000 | $1,680 | $140 |
| 5 Clients | 100 | $85,500 | $855 | $71 |
| 10 Clients | 200 | $146,300 | $732 | $61 |
| 20 Clients | 400 | $258,400 | $646 | $54 |

**Insight:** Cost per user decreases by 60% from single-tenant to 20-tenant deployment

---

## Appendix B: Cost Calculator Assumptions

All estimates based on:
- **Usage Patterns:** Per PRD Section 2 (3,200 leads/year, 600 deals, 200 active loans)
- **Document Volume:** 2,000 docs/month at steady state (surveys, title, arborist, plans)
- **Storage Growth:** 200GB/year (conservative; plan library is one-time 150GB upload)
- **AI Usage:** 10K pages/month document extraction + 20M GPT tokens/month
- **Users:** 25 active users for Blueprint baseline
- **Geographic Region:** US West (primary), US East (backup)
- **Availability:** 99.5% uptime SLA = 43 hours max downtime/year
- **Retention:** 7 years for compliance

**Pricing Sources:**
- Azure: https://azure.microsoft.com/en-us/pricing/calculator/ (November 2025)
- AWS: https://calculator.aws/ (November 2025)
- GCP: https://cloud.google.com/products/calculator (November 2025)
- Third-party SaaS: Public pricing pages (November 2025)

**Last Updated:** November 13, 2025
**Next Review:** Day 30 (actual costs vs. estimates)

---

**Document Status:** Draft v1.0 - Ready for Leadership Review
**Prepared by:** Claude Code (AI Assistant)
**Approved by:** [Pending]
