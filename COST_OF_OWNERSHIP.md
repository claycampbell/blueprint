# Connect 2.0 - Baseline Cost of Ownership Analysis
**Version 1.3 | December 10, 2025**

## Revision History
- **v1.3 (Dec 10, 2025):** Changed cloud recommendation from Azure to AWS based on mature enterprise ecosystem, superior EKS support, multi-model AI flexibility (Bedrock), and better cost-to-value ratio.
- **v1.2 (Dec 8, 2025):** Added Executive Overview & Recommendation section with firm Azure recommendation based on enterprise AI, M365 integration, and Document Intelligence maturity. Budget summary and immediate action items included.
- **v1.1 (Nov 15, 2025):** Updated user count assumptions from 25 to 215 users (65 internal + 150 external). Revised Year 1 costs from $41K to $57K (GCP). Added stakeholder validation requirements.
- **v1.0 (Nov 13, 2025):** Initial baseline cost analysis

---

## Executive Overview & Recommendation

### The Bottom Line

**Recommended Cloud Provider: Amazon Web Services (AWS)**

After comprehensive analysis of Azure, AWS, and GCP across infrastructure, AI services, scalability, and total cost of ownership, **AWS is the strategic choice for Connect 2.0** based on three decisive factors:

| Decision Factor | AWS Advantage |
|-----------------|---------------|
| **Enterprise AI Integration** | AWS Bedrock provides access to multiple foundation models (Claude, Titan, Llama) with enterprise SLA, compliance, and data residency guarantees |
| **Mature Service Ecosystem** | Most comprehensive cloud service portfolio with best-in-class Kubernetes (EKS), serverless (Lambda), and third-party integrations |
| **Document Processing Excellence** | AWS Textract is proven at scale for structured document extraction (surveys, title reports, arborist reports) with strong accuracy |

### Budget Summary

| Phase | Duration | Budget Request | Notes |
|-------|----------|----------------|-------|
| **MVP Development** | Days 1-180 | **$40,000** | $32.8K estimated + $7.2K contingency |
| **Year 1 Operations** | Post-Day 180 | **$75,000** | $65.6K estimated + $9.4K contingency (215 users) |
| **Multi-Tenant (5 clients)** | Year 2+ | **$115,000** | Offset by client revenue (~$240K) |

**Total Year 1 Investment: $115,000** (MVP + Operations)

### Why AWS Over Alternatives

**Versus GCP (-$4,293/year or -7%):**
- GCP cost savings do not offset strategic value of AWS's mature enterprise ecosystem
- AWS provides superior Kubernetes support (EKS) critical for microservices architecture
- AWS Bedrock offers multi-model flexibility (Claude, Titan, Llama) vs. GCP's Vertex AI limitations
- Textract has proven accuracy for real estate document extraction at scale

**Versus Azure (+$4,095/year or +7%):**
- Azure's higher costs not justified for Connect 2.0 use case
- AWS Bedrock provides equivalent enterprise AI capabilities without Azure OpenAI premium
- Broader third-party integration ecosystem reduces custom development effort
- More predictable pricing model with lower load balancer and networking costs

### Risk Mitigation

| Risk | Mitigation Built Into Recommendation |
|------|-------------------------------------|
| Higher cost vs. GCP | Premium justified by mature enterprise ecosystem, superior EKS support, and proven third-party integrations |
| Vendor lock-in | AWS's containerized approach (EKS, Fargate) enables portability; standard PostgreSQL database via RDS |
| User count uncertainty | Budget includes 15% contingency; AWS Auto Scaling handles demand spikes |
| Multi-tenant pivot | AWS pricing scales linearly; tenant isolation via Amazon Cognito built-in |

### Critical Assumptions Requiring Validation

Before finalizing, leadership must confirm:

1. **External user count**: Analysis assumes ~150 external users (builders, investors, agents). Actual count impacts infrastructure sizing ±$3-5K per 50 users.
2. **Portal feature scope**: Full portal access vs. read-only dashboards affects compute requirements.
3. **Reliability vs. cost priority**: Budget assumes balanced approach; aggressive optimization could save additional $15K/year.

### Firm Recommendation

**Proceed with Amazon Web Services (AWS)** and the following immediate actions:

1. **Week 1**: Establish AWS account and Cost Explorer/Budgets alerts at 50%/75%/90% of monthly budget
2. **Week 2**: Deploy Phase 1 MVP infrastructure ($3,300/month target)
3. **Day 30**: Review actual vs. projected costs; evaluate AWS Savings Plans
4. **Day 90**: Lock in 1-year Reserved Instances/Savings Plans for 30-40% savings on production workloads

**Decision Owner**: [Requires Assignment]
**Approval Deadline**: Prior to Day 1 development kickoff

---

## Executive Summary

This document provides a comprehensive cost analysis for the Connect 2.0 platform across development, MVP operations, and commercial scaling. Cost estimates are provided for three cloud provider options (Azure, AWS, GCP) and multiple scaling scenarios.

### Total Cost Summary (Annual)

#### ⚠️ UPDATED November 15, 2025 - Reflects revised user count (65 internal + ~150 external users)

| Phase | Timeline | Azure | AWS | GCP | Notes |
|-------|----------|-------|-----|-----|-------|
| **MVP Phase 1** (Design & Entitlement) | Days 1-90 | $8,500 | $8,200 | $7,900 | 6 users, limited modules |
| **MVP Phase 2** (Full Platform) | Days 91-180 | $15,200 | $14,800 | $14,300 | 20-30 users, all modules |
| **Year 1 Operations** (Blueprint) | Post-Day 180 | **$65,625** | **$61,530** | **$57,237** | **215 users** (65 internal + 150 external), full production |
| **Multi-Tenant (5 clients)** | Days 180-360 | $101,100 | $92,600 | $85,500 | ~100 users total per client (500 total) |
| **Multi-Tenant (20 clients)** | Year 2+ | $306,000 | $280,600 | $258,400 | ~400 users total per client tier (variable) |

**CRITICAL CHANGE:** Year 1 costs increased from **$41K to $57K** (GCP) based on actual user count of 215 users (vs. original 25 user assumption).

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

### ⚠️ REVISED USER COUNT ASSUMPTIONS (November 15, 2025)

**CRITICAL UPDATE:** Initial estimates significantly underestimated user count. Blueprint currently has **65 internal users** plus an unknown number of external users (builders, investors, real estate agents). This section reflects revised assumptions.

**Items requiring stakeholder validation:**
- [ ] Exact count of external users (builders, investors, agents)
- [ ] Usage patterns by external user type
- [ ] Expected growth trajectory for Year 1

### User & Usage Metrics (Blueprint as Client Zero)

| Metric | MVP Phase 1 (Days 1-90) | MVP Phase 2 (Days 91-180) | Year 1 Operations |
|--------|-------------------------|---------------------------|-------------------|
| **Active Internal Users** | 6 (Design & Entitlement team) | 20 (pilot teams) | **65 (all Blueprint staff)** |
| **Active External Users** | 0 | ~10 (pilot builders/investors) | **~150 (est.)** builders, investors, agents |
| **Total Active Users** | 6 | 30 | **~215** |
| **Concurrent Users (Peak)** | 3 | 15 | **40-50** (based on 20-25% concurrency) |
| **Projects/Year** | ~100 (entitlement only) | ~3,200 (leads) → ~500 deals | ~3,200 leads → ~600 deals |
| **Active Loans** | 0 | ~150 | ~200 |
| **Documents/Month** | ~200 | ~1,500 | ~2,000 |
| **Document Storage** | 50 GB | 500 GB | 1.5 TB (cumulative) |
| **API Calls/Day** | ~5,000 | ~50,000 | **~120,000** (increased for external portals) |
| **Database Size** | 5 GB | 25 GB | 50 GB |

### User Tier Definitions

Different user types have different infrastructure impacts:

| User Tier | Count (Year 1) | Concurrency Rate | Features | Cost Impact |
|-----------|----------------|------------------|----------|-------------|
| **Power Users** (Internal) | 65 | 30% (~20 concurrent) | Full platform access, heavy document processing, task management, reporting | **High** - drive compute, database connections |
| **Portal Users** (External Builders) | ~100 | 15% (~15 concurrent) | Project portal, document upload, draw requests, read-only financials | **Medium** - document storage, moderate compute |
| **Read-Only Users** (Investors/Agents) | ~50 | 10% (~5 concurrent) | Dashboard access, reports, notifications | **Low** - minimal compute, cached queries |

**Total Concurrent Load:** 20 (power) + 15 (portal) + 5 (read-only) = **40 concurrent users at peak**

**Key Assumptions:**
- Power users drive 70% of infrastructure costs despite being 30% of user base
- External users primarily access portals during business hours (Pacific Time)
- Portal users have episodic usage patterns (weekly check-ins vs. daily use)
- Read-only users leverage cached data (minimal database impact)

### Traffic & Performance Targets

- **Uptime SLA:** 99.5% (≤43 hours downtime/year)
- **Response Time:** <500ms (95th percentile)
- **Peak Traffic:** 3x average (end-of-month draw cycles)
- **Data Retention:** 7 years (legal/regulatory requirement)

---

## ⚠️ OPEN QUESTIONS REQUIRING STAKEHOLDER VALIDATION

**Cost estimates revised on November 15, 2025** to reflect 215 total users (65 internal + 150 external). The following items require validation with Blueprint leadership to finalize Year 1 cost projections:

### 1. External User Count & Breakdown

**Current Assumption:** ~150 external users
- ~100 builders (portal access for project updates, draw requests)
- ~50 investors/real estate agents (read-only dashboard access)

**Questions:**
- What is the exact current count of external users with system access?
- How many builders typically have active projects at any given time?
- How many investors/agents require regular platform access?
- What is the expected growth trajectory for external users in Year 1?

**Cost Impact:** Each additional 50 external portal users = ~$3-5K/year infrastructure costs

### 2. Internal User Roles & Usage Patterns

**Current Assumption:** 65 internal users, 30% concurrency rate

**Questions:**
- Breakdown by team/role (Acquisitions, Design & Entitlement, Servicing, Admin)?
- Which roles require "power user" access vs. lightweight portal access?
- What are typical peak usage hours/days (end of month, end of quarter)?
- Are there seasonal patterns (slower summer months, busy Q4)?

**Cost Impact:** Higher concurrency rates could require +1-2 servers (+$3-6K/year)

### 3. External Portal Feature Scope

**Current Assumption:** Builders and investors access limited portal features (not full platform)

**Questions:**
- What features should external builders have access to? (document upload, draw requests, project timeline, financial dashboard)
- What features should investors/agents see? (portfolio dashboard, reports, notifications only)
- Should external users have mobile app access or web-only?
- Any heavy features like document processing/AI summaries for external users?

**Cost Impact:** Feature scope determines compute/database requirements

### 4. Multi-Tenant Roadmap Timing

**Questions:**
- When do we expect first external paying client? (affects infrastructure planning)
- Should Year 1 infrastructure be sized for multi-tenant from Day 1, or retrofit later?
- Current external clients (Send Capital, Create Capital) - do they migrate to Connect 2.0 in Year 1?

**Cost Impact:** Multi-tenant architecture from Day 1 adds ~$5-10K upfront but reduces retrofit costs

### 5. Cost Allocation & Budgeting

**Questions:**
- Is the **$61.5K/year** (AWS revised estimate) within acceptable budget range for Year 1?
- Should costs be optimized aggressively (reserved instances, smaller environments) or prioritize reliability?
- Any hard budget ceiling we need to stay under?
- Who approves infrastructure spending increases as user count grows?

**Next Steps:**
- [ ] Schedule stakeholder meeting to validate user count assumptions
- [ ] Confirm external user counts and roles from Blueprint operations team
- [ ] Review and approve revised Year 1 budget ($57K GCP / $62K AWS / $66K Azure) - **AWS recommended**
- [ ] Determine cost optimization priorities (reliability vs. cost savings)

### Geographic Distribution

- **Primary Region:** US West (Seattle) - Blueprint HQ
- **Backup/DR Region:** US East (redundancy)
- **Global CDN:** Not required for MVP (internal users only)

---

## 2. Cloud Infrastructure Costs

### 2.1 Compute (Application Hosting)

**Architecture Assumption:** Kubernetes-based microservices or containerized modular monolith

#### Original Assumptions (25 users, 15 concurrent)

| Component | Azure | AWS | GCP | Specs |
|-----------|-------|-----|-----|-------|
| **Web/API Servers** | 2x D4s v5 ($280/mo) | 2x m6i.xlarge ($263/mo) | 2x e2-standard-4 ($245/mo) | 4 vCPU, 16GB RAM each |
| **Background Workers** | 1x D2s v5 ($85/mo) | 1x m6i.large ($81/mo) | 1x e2-standard-2 ($74/mo) | 2 vCPU, 8GB RAM |
| **Load Balancer** | App Gateway ($260/mo) | ALB ($30/mo) | Cloud Load Balancer ($25/mo) | Regional, basic tier |
| **Auto-scaling buffer** | +20% ($125/mo) | +20% ($115/mo) | +20% ($108/mo) | Handle peak loads |
| **SUBTOTAL (Monthly)** | **$830** | **$735** | **$688** | |
| **ANNUAL** | **$9,960** | **$8,820** | **$8,256** | |

#### ⚠️ REVISED Year 1 Assumptions (215 users, 40-50 concurrent)

**Required to support 40-50 concurrent users + external portal traffic:**

| Component | Azure | AWS | GCP | Specs |
|-----------|-------|-----|-----|-------|
| **Web/API Servers** | 4x D4s v5 ($560/mo) | 4x m6i.xlarge ($526/mo) | 4x e2-standard-4 ($490/mo) | 4 vCPU, 16GB RAM each |
| **Background Workers** | 2x D2s v5 ($170/mo) | 2x m6i.large ($162/mo) | 2x e2-standard-2 ($148/mo) | 2 vCPU, 8GB RAM (doc processing) |
| **Load Balancer** | App Gateway ($260/mo) | ALB ($30/mo) | Cloud Load Balancer ($25/mo) | Regional, basic tier |
| **Auto-scaling buffer** | +25% ($248/mo) | +25% ($230/mo) | +25% ($216/mo) | Handle peak loads (3x avg) |
| **SUBTOTAL (Monthly)** | **$1,238** | **$1,118** | **$1,049** | |
| **ANNUAL** | **$14,856** | **$13,416** | **$12,588** | **+$4,332 - $4,896 increase** |

**Scaling Notes:**
- MVP Phase 1: Use 50% capacity (6 users, 3 concurrent) = original estimates apply
- MVP Phase 2: Use 75% capacity (30 users, 15 concurrent) = original estimates apply
- **Year 1 (REVISED):** Use configuration above to handle 215 users, 40-50 concurrent
- **Rationale:** 2x more servers needed to handle 3x concurrent user load + external portal traffic
- **Cost Impact:** +49% infrastructure compute costs (+$4,332-$4,896/year)

### 2.2 Database

**Primary Option:** Managed PostgreSQL (relational data model per PRD)

#### Original Assumptions (15 concurrent users, ~30 DB connections)

| Component | Azure | AWS | GCP | Specs |
|-----------|-------|-----|-----|-------|
| **Primary Database** | Azure Database for PostgreSQL Flexible ($320/mo) | RDS PostgreSQL db.m6i.large ($280/mo) | Cloud SQL PostgreSQL db-n1-standard-2 ($265/mo) | 2 vCPU, 8GB RAM, 100GB SSD |
| **Read Replica** (optional for reports) | +$160/mo | +$140/mo | +$133/mo | Same specs, secondary region |
| **Backup Storage** | Included (7 days), +$15/mo (30 days) | Included (7 days), +$12/mo (30 days) | Included (7 days), +$10/mo (30 days) | 30-day retention |
| **Database Growth** | +$1/GB/mo over 100GB | +$0.92/GB/mo over 100GB | +$0.85/GB/mo over 100GB | Pay for growth |
| **SUBTOTAL (Monthly)** | **$495** | **$432** | **$408** | With read replica + extended backups |
| **ANNUAL** | **$5,940** | **$5,184** | **$4,896** | |

#### ⚠️ REVISED Year 1 Assumptions (40-50 concurrent users, ~100 DB connections)

**Required to support higher concurrent connection load:**

| Component | Azure | AWS | GCP | Specs |
|-----------|-------|-----|-----|-------|
| **Primary Database** | PostgreSQL Flexible 4 vCPU ($580/mo) | RDS db.m6i.xlarge ($560/mo) | Cloud SQL db-n1-standard-4 ($530/mo) | 4 vCPU, 16GB RAM, 200GB SSD |
| **Read Replica** (for reports/dashboards) | +$290/mo | +$280/mo | +$265/mo | Same specs, secondary region |
| **Backup Storage** | +$25/mo (30 days, 200GB) | +$20/mo | +$18/mo | 30-day retention |
| **Connection Pooling** | Included (PgBouncer) | Included (RDS Proxy available) | Included (Cloud SQL Auth Proxy) | Handle 100+ connections |
| **SUBTOTAL (Monthly)** | **$895** | **$860** | **$813** | Sized for 215 users |
| **ANNUAL** | **$10,740** | **$10,320** | **$9,756** | **+$4,344 - $4,860 increase** |

**Scaling Notes:**
- MVP Phase 1: Single instance, no replica = original estimates apply
- MVP Phase 2: Add read replica = original estimates apply
- **Year 1 (REVISED):** Larger instance required to handle 40-50 concurrent users
- **Rationale:**
  - 40-50 concurrent users = ~100 database connections (avg 2 connections per user)
  - Need 4 vCPU to handle connection overhead + query processing
  - Doubled storage to 200GB for external user data (portal access logs, documents metadata)
- **Cost Impact:** +81% database costs (+$4,344-$4,860/year)

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

#### Original Estimates (25 users, 15 concurrent)

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

#### ⚠️ REVISED Year 1 Estimates (215 users, 40-50 concurrent)

| Category | Azure (Annual) | AWS (Annual) | GCP (Annual) | Change vs. Original |
|----------|----------------|--------------|--------------|---------------------|
| Compute | **$14,856** | **$13,416** | **$12,588** | +49% (+$4,332-$4,896) |
| Database | **$10,740** | **$10,320** | **$9,756** | +81% (+$4,344-$4,860) |
| Object Storage | $2,700 | $2,880 | $2,520 | No change (same doc volume) |
| Message Queue | $180 | $132 | $84 | No change |
| Auth/Identity | $0 | $0 | $0 | Still under 50K MAU free tier |
| CDN | $0 | $0 | $0 | Defer to multi-tenant |
| Networking | $2,040 | $1,740 | $1,620 | No change |
| Backup/DR | $720 | $660 | $540 | No change |
| **TOTAL** | **$31,236** | **$29,148** | **$27,108** | **+$8,676 - $9,756 (+45%)** |

**Key Takeaway:** Infrastructure costs increase ~45% to support 215 users vs. 25 users, primarily driven by compute (+49%) and database (+81%) scaling requirements.

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

#### Original Estimates (25 users)

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

#### ⚠️ REVISED Year 1 Estimates (215 users: 65 internal + 150 external)

| Category | Azure | AWS | GCP | Change vs. Original |
|----------|-------|-----|-----|---------------------|
| **Infrastructure** | **$31,236** | **$29,148** | **$27,108** | +$7,908 - $9,732 (+45%) |
| **AI Services** | $5,532 | $5,100 | $4,386 | No change (same doc volume) |
| **SaaS Services** | $4,452 | $4,452 | $4,452 | No change (internal tools) |
| **Dev/Ops Tools** | $960 | $960 | $960 | No change |
| **Dev/Staging Envs** | **$23,445** | **$21,870** | **$20,331** | +$6,894 - $7,290 (+50% scaled with prod) |
| **TOTAL (Annual)** | **$65,625** | **$61,530** | **$57,237** | **+$14,802 - $17,486 (+36-40%)** |
| **MONTHLY AVERAGE** | **$5,469** | **$5,128** | **$4,770** | +$1,234 - $2,016/month |

**Users:** **215 total** (65 internal power users + ~100 external builders + ~50 investors/agents)
**Concurrent Users (Peak):** 40-50
**Documents:** 2,000/month (unchanged - same deal volume)
**Storage:** 1.5TB cumulative
**Active Loans:** ~200

**Cost Impact Summary:**
- Infrastructure scales with concurrent users (+45%)
- Dev/staging environments scale proportionally with production (+50%)
- AI services unchanged (driven by document volume, not user count)
- SaaS unchanged (internal development tools only)
- **Total increase:** $14,802 - $17,486/year (+36-40%)

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
| **AWS** | • Mature service ecosystem<br>• Best third-party integration (Bedrock, Textract)<br>• Strong Kubernetes (EKS) support<br>• Multi-model AI flexibility via Bedrock | • Mid-range pricing<br>• Learning curve for complex services | **Best if:** Broad ecosystem, third-party integrations critical, enterprise scale |
| **Azure** | • M365 integration (SharePoint migration)<br>• Azure OpenAI (GPT-4 with enterprise SLA)<br>• Azure Document Intelligence mature | • 10-15% more expensive than GCP<br>• More complex pricing | **Best if:** M365 ecosystem important, enterprise AI needs |
| **GCP** | • Lowest cost (15-20% cheaper than Azure)<br>• Firebase migration path (current BPO)<br>• Strong AI/ML (Vertex AI, Document AI) | • Smaller market share (fewer experts)<br>• Less mature enterprise features | **Best if:** Cost optimization priority, Firebase familiarity |

**Recommended: AWS for MVP and production deployment based on mature ecosystem, superior EKS support, and Bedrock AI flexibility**

### 11.2 Cost Management Strategy

#### **Phase 1 (Days 1-90): Minimize Spend**
- Use AWS with cost-optimized instance types
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
- **Target:** $30-40K/year (optimized from $61.5K AWS baseline)

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

1. **MVP is affordable:** $27K-33K total cost for first 180 days across all cloud providers (unchanged)
2. **AWS offers best value:** Mature enterprise ecosystem with superior EKS and Bedrock AI, suitable for MVP and scale
3. **AI is manageable:** Document extraction + LLM services = $4K-5K/year (not a cost blocker)
4. **⚠️ User count significantly impacts costs:** Revised estimate of 215 users (vs. 25) increases Year 1 costs by 36-40%
5. **Infrastructure scales with concurrency:** Cost drivers are concurrent users and database connections, not total user count
6. **Optimization is critical:** $22K-38K/year savings available through best practices (even more important with revised costs)

### Budget Recommendation (REVISED December 10, 2025)

**Request approval for:**
- **MVP (Days 1-180):** $35,000 budget ($30K estimated + $5K contingency) - **UNCHANGED**
- **Year 1 Operations (REVISED):** **$70,000 budget** ($61.5K AWS estimated + $8.5K contingency)
  - **Increase from original:** +$20K (+40%) due to revised user count (215 vs. 25 users)
  - **Original estimate:** $50,000 (25 users)
  - **Revised estimate:** $70,000 (215 users: 65 internal + 150 external)
- **Multi-Tenant (5 clients):** $100,000 budget with revenue offset from client fees

### Critical Actions Required

**Before finalizing Year 1 budget:**
1. **Validate user count** with Blueprint operations team (exact count of internal + external users)
2. **Confirm external user roles** (builders, investors, agents) and portal feature requirements
3. **Approve revised budget** of $70K/year (vs. original $50K)
4. **Identify cost optimization priorities** (reliability vs. aggressive cost savings)

**Cost Sensitivity:**
- Each additional 50 external users: +$3-5K/year
- Higher concurrency patterns: +$3-6K/year (additional servers)
- Multi-tenant architecture from Day 1: +$5-10K upfront (reduces future retrofit costs)

### Next Steps

1. **Day 1-7:** Finalize cloud provider selection (recommend AWS)
2. **Day 1-14:** Set up cost tracking dashboard and alerts via AWS Cost Explorer
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

**Last Updated:** November 15, 2025
**Next Review:** Day 30 (actual costs vs. estimates) + stakeholder validation of user count assumptions

---

**Document Status:** Draft v1.1 - REVISED for User Count - Requires Leadership Review & Approval
**Prepared by:** Claude Code (AI Assistant)
**Critical Changes (v1.1):** Year 1 costs revised from $41K to $57K (GCP) due to actual user count of 215 vs. assumed 25 users
**Approved by:** [Pending - requires validation of external user count and budget approval]
