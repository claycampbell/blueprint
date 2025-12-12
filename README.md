# Connect 2.0 - Blueprint Documentation Repository

This repository contains **strategic planning documents, requirements specifications, and development setup guides** for the Connect 2.0 platform development project.

> **⚠️ Important:** This is a documentation repository only. Application code will be developed in separate repositories.

---

## 🚀 Quick Start for Developers

**New to the project? Start here:**

1. **[DEVELOPER_QUICKSTART.md](DEVELOPER_QUICKSTART.md)** - Get up and running in 5 minutes
2. **[LOCAL_DEVELOPMENT_PLAN.md](LOCAL_DEVELOPMENT_PLAN.md)** - Complete local development guide
3. **[TECHNOLOGY_STACK_DECISION.md](TECHNOLOGY_STACK_DECISION.md)** - Why we chose Node.js + React + AWS

**Then explore the sample code:**
- [examples/nodejs-api/](examples/nodejs-api/) - Working API with LocalStack integration

---

## 📋 Documentation Index

### Strategic Planning
- **[Blueprint Workshop — Detailed Summary & Outcomes.txt](Blueprint%20Workshop%20—%20Detailed%20Summary%20&%20Outcomes.txt)** - Workshop outcomes from October 1, 2025
- **[Datapage Platform Program — Project Charter.txt](Datapage%20Platform%20Program%20—%20Project%20Charter.txt)** - Official project charter (180-day phased delivery)
- **[Blueprint - Demo Notes.pdf](Blueprint%20-%20Demo%20Notes.pdf)** - Current systems walkthrough
- **[Blueprint_LOE.xlsx](Blueprint_LOE.xlsx)** - Level of effort estimates

### Product & Architecture
- **[PRODUCT_REQUIREMENTS_DOCUMENT.md](PRODUCT_REQUIREMENTS_DOCUMENT.md)** ⭐ **Start here**
  - Complete product requirements (v1.0, November 2025)
  - User personas, workflows, feature backlog
  - Data model, API design, MVP phasing
  - 1,462 lines of comprehensive specs

- **[COST_OF_OWNERSHIP.md](COST_OF_OWNERSHIP.md)**
  - Infrastructure cost analysis (v1.3, December 2025)
  - AWS vs Azure vs GCP comparison
  - **AWS recommended** - $61,530/year for Year 1

### Development Setup
- **[DEVELOPER_QUICKSTART.md](DEVELOPER_QUICKSTART.md)** ⚡ **New devs start here**
  - 5-minute setup guide
  - Quick reference commands
  - Troubleshooting tips

- **[LOCAL_DEVELOPMENT_PLAN.md](LOCAL_DEVELOPMENT_PLAN.md)** 📚 **Comprehensive guide**
  - Complete LocalStack + Docker setup
  - AWS service configuration
  - Testing strategy, CI/CD integration
  - Developer workflows

- **[TECHNOLOGY_STACK_DECISION.md](TECHNOLOGY_STACK_DECISION.md)** 🎯 **Stack rationale**
  - Node.js + TypeScript + Express (backend)
  - React + TypeScript (frontend)
  - PostgreSQL + AWS infrastructure
  - Framework comparison and scoring

### Configuration Files
- **[docker-compose.yml](docker-compose.yml)** - LocalStack, PostgreSQL, Redis containers
- **[scripts/localstack-init.sh](scripts/localstack-init.sh)** - Auto-creates AWS resources
- **[scripts/init-db.sql](scripts/init-db.sql)** - Database schema and seed data

### CLAUDE.md
- **[CLAUDE.md](CLAUDE.md)** - Instructions for Claude Code AI assistant

---

## 🏗️ Project Overview

### What is Connect 2.0?

Connect 2.0 is the next-generation, AI-native platform that powers Blueprint's transformation into a frontier firm while establishing Datapage's commercial platform strategy. It unifies:

- **Lead Intake** - ~3,200 leads/year from real estate agents
- **Feasibility Analysis** - Due diligence and viability assessment
- **Entitlement Tracking** - Permit coordination and consultant management
- **Design Coordination** - Plan library (~1,500 plan sets)
- **Lending** - Loan origination and document generation
- **Servicing** - Draw management, inspections, payoff quotes

### Business Model

- **Blueprint**: Operating company (Seattle, Phoenix) - serves as "Client Zero"
- **Datapage**: Platform company owning Connect 2.0 IP - commercializes the platform
- **Current clients**: Send Capital, Create Capital ($5-6K/month each)

### Success Metrics (180-day MVP targets)

| Domain | Metric | Target |
|--------|--------|--------|
| Feasibility | Packet assembly cycle time | -50% |
| Entitlement | Submission prep time | -50% |
| Throughput | Deals vetted per FTE | 2x |
| Servicing | Avg. draw turnaround | -60% |
| Adoption | WAU (pilot roles) | ≥85% by Day 180 |
| Reliability | Uptime | ≥99.5% |

---

## 🛠️ Technology Stack

### Recommended Stack (December 2025)

```
Frontend:  React 18 + TypeScript + Vite + Material-UI
Backend:   Node.js 20 + TypeScript + Express.js
Database:  PostgreSQL 15 (AWS RDS)
Cloud:     AWS (EKS, S3, SQS, RDS, Bedrock, Textract)
Local Dev: LocalStack + Docker Compose
CI/CD:     GitHub Actions
```

**Why this stack?**
- ✅ Fastest to MVP (180-day deadline)
- ✅ Largest developer talent pool
- ✅ Best AWS SDK support
- ✅ $95,400/year savings with LocalStack
- ✅ TypeScript for type safety across full stack

See [TECHNOLOGY_STACK_DECISION.md](TECHNOLOGY_STACK_DECISION.md) for full analysis.

---

## 💰 Cost Summary

### Development & Infrastructure Costs

| Phase | Duration | Budget | Notes |
|-------|----------|--------|-------|
| **MVP Phase 1** | Days 1-90 | $8,200 | Design & Entitlement pilot |
| **MVP Phase 2** | Days 91-180 | $14,800 | Full platform rebuild |
| **Year 1 Operations** | Post-Day 180 | $61,530/year | AWS (215 users) |
| **Multi-Tenant (5 clients)** | Year 2+ | $92,600/year | Offset by ~$240K revenue |

**LocalStack Savings:** $95,400/year vs. traditional AWS dev accounts

See [COST_OF_OWNERSHIP.md](COST_OF_OWNERSHIP.md) for detailed breakdown.

---

## 📅 MVP Timeline (180 Days)

### Phase 1: Design & Entitlement (Days 1-90)
- **Day 1-30**: Foundation & planning, AWS setup, initial data model
- **Day 31-60**: Full development (API, UI, workflow engine)
- **Day 61-90**: Pilot launch, migration from SharePoint
- **Deliverable**: 6 users (Design & Entitlement team) live on Connect 2.0

### Phase 2: Full Platform (Days 91-180)
- **Day 91-120**: Rebuild BPO (Blueprint Online) within Connect 2.0
- **Day 121-150**: Rebuild Connect 1.0 servicing module
- **Day 151-180**: Testing, data migration, full cutover
- **Deliverable**: All Blueprint teams on unified platform

### Decision Gates
- **Day 30**: Architecture approved, build commences
- **Day 90**: Pilot validation, release next funding tranche
- **Day 180**: Scale readiness, authorize commercialization

---

## 👥 Team Structure (MVP)

| Role | Count | Key Skills |
|------|-------|-----------|
| Tech Lead | 1 | Full-stack, AWS, architecture |
| Backend Developer | 2 | Node.js, TypeScript, PostgreSQL, AWS |
| Frontend Developer | 2 | React, TypeScript, Material-UI |
| DevOps Engineer | 1 | Docker, Kubernetes, AWS (EKS, RDS) |
| QA Engineer | 1 | Test automation, API testing |

**Total: 7 people** for 180 days

---

## 🚀 Getting Started

### For Developers

1. **Install prerequisites:**
   ```bash
   # Required
   - Docker Desktop
   - Node.js 20 LTS
   - Git

   # Recommended
   - VS Code
   - awslocal (pip install awscli-local)
   ```

2. **Clone and start:**
   ```bash
   git clone <repository-url>
   cd blueprint
   docker-compose up -d
   ```

3. **Verify setup:**
   ```bash
   # Check services
   docker-compose ps

   # Test LocalStack
   awslocal s3 ls

   # Test PostgreSQL
   docker exec -it connect2-postgres psql -U connect_user -d connect2_dev
   ```

4. **Read the docs:**
   - [DEVELOPER_QUICKSTART.md](DEVELOPER_QUICKSTART.md) - 5-minute guide
   - [LOCAL_DEVELOPMENT_PLAN.md](LOCAL_DEVELOPMENT_PLAN.md) - Deep dive

### For Product/Business

1. **Understand the vision:**
   - Read [PRODUCT_REQUIREMENTS_DOCUMENT.md](PRODUCT_REQUIREMENTS_DOCUMENT.md)
   - Review [Blueprint Workshop — Detailed Summary & Outcomes.txt](Blueprint%20Workshop%20—%20Detailed%20Summary%20&%20Outcomes.txt)

2. **Review the charter:**
   - [Datapage Platform Program — Project Charter.txt](Datapage%20Platform%20Program%20—%20Project%20Charter.txt)

3. **Understand costs:**
   - [COST_OF_OWNERSHIP.md](COST_OF_OWNERSHIP.md)

---

## 📂 Repository Structure

```
blueprint/
├── README.md                          # This file
├── CLAUDE.md                          # AI assistant instructions
├── PRODUCT_REQUIREMENTS_DOCUMENT.md   # Complete PRD
├── COST_OF_OWNERSHIP.md              # Infrastructure cost analysis
├── LOCAL_DEVELOPMENT_PLAN.md         # LocalStack setup guide
├── DEVELOPER_QUICKSTART.md           # 5-minute setup
├── TECHNOLOGY_STACK_DECISION.md      # Stack rationale
│
├── docker-compose.yml                # Local infrastructure
├── scripts/
│   ├── localstack-init.sh           # AWS resource setup
│   └── init-db.sql                  # Database schema
│
├── examples/
│   └── nodejs-api/                  # Sample API implementation
│       ├── src/
│       │   ├── config/              # AWS SDK configuration
│       │   ├── services/            # S3, SQS services
│       │   └── routes/              # API endpoints
│       ├── package.json
│       └── README.md
│
└── [Strategic Documents]
    ├── Blueprint Workshop — Detailed Summary & Outcomes.txt
    ├── Datapage Platform Program — Project Charter.txt
    ├── Blueprint - Demo Notes.pdf
    └── Blueprint_LOE.xlsx
```

---

## 🔗 Key Resources

### Internal
- **Current Systems**:
  - BPO (Blueprint Online): Firebase-based lead intake
  - Connect 1.0: Filemaker-based loan servicing
  - SharePoint: M365-based feasibility/entitlement

### External
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

---

## 📝 Key Decisions

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| Oct 1, 2025 | Blueprint Transformation Strategy | Workshop outcomes | ✅ Approved |
| Nov 5, 2025 | Product Requirements v1.0 | Consolidated PRD | ✅ Ready for review |
| Dec 10, 2025 | Cloud Provider: AWS | Superior EKS, Bedrock AI, enterprise ecosystem | ✅ Approved |
| Dec 10, 2025 | Database: PostgreSQL | Proven for structured data, RDS managed service | ✅ Approved |
| Dec 12, 2025 | Backend: Node.js + TypeScript | Fastest to MVP, largest talent pool, best AWS SDK | ✅ Recommended |
| Dec 12, 2025 | Frontend: React + TypeScript | Industry standard, easiest hiring | ✅ Recommended |
| Dec 12, 2025 | Local Dev: LocalStack + Docker | $95K/year savings vs AWS dev accounts | ✅ Approved |

---

## 🎯 Next Steps

### Immediate (Week 1)
- [ ] Finalize technology stack approval (Node.js + React)
- [ ] Set up AWS account and cost monitoring
- [ ] Onboard development team
- [ ] Initialize code repositories (backend, frontend)
- [ ] Deploy LocalStack development environment

### Month 1 (Days 1-30)
- [ ] Complete architecture documentation
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Implement authentication and base API
- [ ] Create UI component library
- [ ] Database migrations framework
- [ ] Decision Gate 1: Architecture approved

### Month 2-3 (Days 31-90)
- [ ] Build Design & Entitlement MVP
- [ ] Integrate with BPO (temporary)
- [ ] Migrate from SharePoint
- [ ] User acceptance testing
- [ ] Decision Gate 2: Pilot validation

### Month 4-6 (Days 91-180)
- [ ] Rebuild BPO within Connect 2.0
- [ ] Rebuild Connect 1.0 servicing
- [ ] Data migration and cutover
- [ ] Full team onboarding
- [ ] Decision Gate 3: Scale readiness

---

## 📞 Support & Feedback

- **Issues**: Create GitHub issues for bugs or questions
- **Documentation**: Contributions welcome via pull requests
- **Discussions**: Use GitHub Discussions for architecture questions

---

## 📄 License

[To be determined - proprietary software owned by Datapage]

---

**Last Updated:** December 12, 2025
**Document Status:** Active Development Documentation
**Maintained By:** Technical Leadership Team
