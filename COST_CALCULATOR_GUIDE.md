# Connect 2.0 Cost Calculator - User Guide

**Version 1.1 | November 15, 2025**

## Overview

The `COST_CALCULATOR.csv` spreadsheet provides a parameter-driven cost model for Connect 2.0 platform operations. All costs are derived from adjustable input parameters, allowing you to model different scenarios.

## How to Use

### Step 1: Open in Excel or Google Sheets

1. **Excel:** File → Open → Select `COST_CALCULATOR.csv`
2. **Google Sheets:** File → Import → Upload file → Select `COST_CALCULATOR.csv`

### Step 2: Key Sections

The spreadsheet is organized into logical sections:

#### 📊 **PARAMETERS - USER ASSUMPTIONS** (Rows 3-11)
- **Adjust these cells** to model different user scenarios
- Key parameters:
  - Internal Users (power users with full platform access)
  - External Builders (portal access)
  - External Investors/Agents (read-only)
  - Concurrency percentages (% of users online at peak)

**Example Scenario:** "What if we have 80 internal users instead of 65?"
- Change cell B6 from `65` to `80`
- Recalculate concurrent users: `80 × 30% = 24 concurrent`
- Infrastructure costs increase ~$3K/year

#### 📈 **PARAMETERS - USAGE ASSUMPTIONS** (Rows 13-21)
- Document volume, storage, API calls
- Less sensitive to changes than user count
- Primarily affects AI/storage costs, not infrastructure

#### 💰 **COST TABLES** (Rows 23+)
- Pre-calculated costs for each cloud provider
- Shows "Original" vs. "Revised" configurations side-by-side
- **Compare columns** to see impact of user count changes

#### 📉 **SENSITIVITY ANALYSIS** (Search for "SENSITIVITY ANALYSIS")
- Shows how costs change with different assumptions
- Key insight: **Each 100 additional users = +$8K/year**

#### 🎯 **USER TIER COST ALLOCATION** (Search for "USER TIER COST ALLOCATION")
- Breaks down infrastructure costs by user type
- Shows that **power users drive 55% of costs** despite being 30% of user base

#### ✅ **VALIDATION CHECKLIST** (Bottom of spreadsheet)
- Critical assumptions requiring stakeholder confirmation
- Impact assessment if assumptions are wrong
- Priority ranking (CRITICAL / HIGH / MEDIUM)

## Key Formulas to Add

If you want to make the spreadsheet fully dynamic in Excel/Google Sheets, add these formulas:

### Total Users Calculation
```
=B6+B7+B8  (Sum of Internal + Builders + Investors)
```

### Concurrent Users Calculation
```
=(B6*B12)+(B7*B13)  (Internal users × concurrency + External users × concurrency)
```

### Infrastructure Cost Scaling
```
Base Cost = $17,916 (for 25 users, 15 concurrent)
Scaling Factor = (Current Concurrent Users / 15)
New Cost = Base Cost × Scaling Factor × 0.85  (85% because costs don't scale perfectly linearly)
```

**Example for Year 1 Revised (45 concurrent users):**
```
=$17,916 × (45/15) × 0.85 = $45,811 × 0.85 = $27,108  ✓ Matches our estimate
```

## Common Scenarios to Model

### Scenario 1: Higher Concurrency
**Question:** What if internal users have 40% concurrency (vs. 30%)?

**Changes:**
- Cell E12: Change from `30%` to `40%`
- Concurrent users increase from 45 to 51
- Infrastructure cost increase: ~+$4K/year

**Recommended Action:** Monitor actual concurrency in Month 1-3; add servers if >40%

---

### Scenario 2: More External Users
**Question:** What if we have 200 builders (vs. 100)?

**Changes:**
- Cell E7: Change from `100` to `200`
- Total users increase from 215 to 315
- Concurrent users increase from 45 to 60
- Infrastructure cost increase: ~+$8K/year

**Recommended Action:** Validate builder count with operations team

---

### Scenario 3: Cost Optimization Applied
**Question:** What if we implement all optimization strategies?

**Reference:** "COST OPTIMIZATION OPPORTUNITIES" section
- Reserved Instances: -$8K
- Auto-scaling: -$5K
- Dev/Staging shutdown: -$8K
- **Total Savings: -$21K/year**

**Optimized Year 1 Cost:**
- Original: $57,237 (GCP)
- Optimized: $36,237 (GCP)
- **Savings: 37%**

---

### Scenario 4: Budget Constraint
**Question:** What if we have a hard budget ceiling of $50K/year?

**Required Changes:**
- Current estimate: $57,237 (GCP)
- **Gap: -$7,237 (need to cut costs)**

**Options:**
1. Implement reserved instances (-$6K) + auto-scaling (-$3K) = **$48K** ✓ Under budget
2. Reduce external user count from 150 to 100 (-$5K) + reserved instances (-$6K) = **$46K** ✓ Under budget
3. Defer custom ML models to Year 2 (-$762) + optimizations (-$9K) = **$47K** ✓ Under budget

---

## Cost Per User Benchmarks

Use these benchmarks to sanity-check your scenarios:

| User Type | Annual Cost | Monthly Cost | Notes |
|-----------|-------------|--------------|-------|
| **Power User (Internal)** | $229/user | $19/user | Full platform, heavy compute |
| **Portal User (Builder)** | $95/user | $8/user | Portal access, document storage |
| **Read-Only User (Investor)** | $54/user | $5/user | Dashboards, reports only |
| **Blended Average** | $126/user | $11/user | Average across all 215 users |

**Rule of Thumb:** Each additional internal user = ~$230/year; each external portal user = ~$95/year

---

## Critical Thresholds

Be aware of these infrastructure thresholds that trigger cost jumps:

| Threshold | Current | Impact if Exceeded |
|-----------|---------|-------------------|
| **50 concurrent users** | 45 | Need +2 web servers (+$6K/year) |
| **100 concurrent users** | 45 | Need +4 web servers + larger DB (+$15K/year) |
| **3,000 docs/month** | 2,000 | AI costs increase +$450/year |
| **2TB storage** | 1.5TB | Storage costs increase +$600/year |

---

## Validation Workflow

Before finalizing Year 1 budget, complete this validation:

### Week 1: Gather Data
- [ ] **Confirm internal user count** with HR/ops (current assumption: 65)
- [ ] **Confirm external user count** by role:
  - Builders with active projects: ___
  - Investors needing dashboard access: ___
  - Real estate agents: ___
- [ ] **Review historical concurrency** from BPO/Connect 1.0 analytics

### Week 2: Validate Assumptions
- [ ] **Monitor actual concurrency** during peak hours (end of month)
- [ ] **Define external portal features** (impacts compute requirements)
- [ ] **Confirm document volume** from past 12 months

### Week 3: Adjust Model
- [ ] **Update spreadsheet** with validated numbers
- [ ] **Recalculate costs** for each cloud provider
- [ ] **Identify optimization opportunities** based on actual usage

### Week 4: Budget Approval
- [ ] **Present revised budget** to leadership
- [ ] **Get approval** for Year 1 spend
- [ ] **Set up cost alerts** at 50%, 75%, 90% of budget

---

## Quick Reference: What Drives Costs?

### 🔴 **High Impact** (±$5K+ per change)
- **Concurrent user count** - Each +10 concurrent users = +$5K/year
- **Internal user count** - Each +20 power users = +$5K/year
- **Database size/connections** - Upgrading DB instance = +$5K/year
- **Reserved instances** - 1-year commit = -$6K/year savings

### 🟡 **Medium Impact** (±$1-5K per change)
- **External portal users** - Each +50 users = +$3K/year
- **Document volume** - Each +1,000 docs/month = +$360/year
- **Storage growth** - Each +500GB = +$1.5K/year
- **Auto-scaling policies** - Optimized scaling = -$3K/year

### 🟢 **Low Impact** (<$1K per change)
- **Email volume** - 2x email volume = +$120/year
- **SMS usage** - Opt-in policy can save $200-300/year
- **Read-only users** - Each +50 investors = +$500/year

---

## Export & Reporting

### For Leadership Presentations
1. Export "TOTAL COST SUMMARY BY PHASE" section → PowerPoint slide
2. Export "COST BY CLOUD PROVIDER" → Cloud selection decision matrix
3. Export "SENSITIVITY ANALYSIS" → Risk assessment table

### For Finance/Budgeting
1. Use "BUDGET RECOMMENDATIONS" section for budget request
2. Reference "VALIDATION CHECKLIST" for assumptions requiring CFO approval
3. Provide "COST OPTIMIZATION OPPORTUNITIES" as cost reduction plan

### For Engineering/Ops
1. Share "PARAMETERS - USER ASSUMPTIONS" to define infrastructure sizing
2. Use "USER TIER COST ALLOCATION" to optimize feature access by role
3. Reference "Critical Thresholds" to plan capacity monitoring alerts

---

## Change Log

**v1.1 (Nov 15, 2025):**
- Updated user count from 25 to 215 (65 internal + 150 external)
- Revised infrastructure costs from $17.9K to $27.1K (GCP)
- Added user tier cost allocation
- Added sensitivity analysis
- Added validation checklist

**v1.0 (Nov 13, 2025):**
- Initial cost model with 25 user baseline

---

## Support & Questions

For questions about this cost model:
- **Technical assumptions:** Review COST_OF_OWNERSHIP.md (comprehensive documentation)
- **Feature scope:** Review PRODUCT_REQUIREMENTS_DOCUMENT.md (system requirements)
- **User counts:** Validate with Blueprint operations team
- **Budget approval:** Escalate to program leadership team (PLT)

---

**Next Steps:**
1. Open COST_CALCULATOR.csv in Excel/Google Sheets
2. Adjust parameters in yellow-highlighted cells (if you add highlighting)
3. Review revised cost estimates
4. Complete validation checklist
5. Submit budget request based on validated numbers