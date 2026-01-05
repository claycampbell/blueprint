# Blueprint Value Streams v3.5 - Change Summary

**Date:** January 10, 2026
**Status:** Proposed Update
**Changes from v3.4:** Addition of VS8 - Portfolio Management

---

## New Value Stream Added: VS8 Portfolio Management

### Overview

**Purpose:** Monitor portfolio health, track aggregate metrics across all active loans, and provide executive-level reporting for investors and board.

**System:** Connect 2.0 (new module)

**Why Added:** Leadership identified need for portfolio-level visibility that doesn't exist in current fragmented systems. Investors and board require quarterly reporting, risk aggregation, and performance trending that currently requires manual consolidation across BPO, SharePoint, and Connect 1.0.

---

### Key Activities

1. **Portfolio-level financial reporting**
   - Aggregate loan values across all active projects
   - Track portfolio composition (loan types, markets, builder diversity)
   - Calculate portfolio-level ROI and returns

2. **Risk aggregation and monitoring**
   - Aggregate risk scores across all deals
   - Identify concentration risks (geographic, builder, property type)
   - Monitor early warning indicators

3. **Investor reporting (quarterly)**
   - Generate standardized investor packets
   - Performance vs. benchmarks
   - Risk disclosure reports

4. **Board dashboard preparation**
   - Executive KPI summary dashboards
   - Trend analysis vs. prior quarters
   - Strategic recommendations based on portfolio data

---

### Inputs

- **All active loans** from VS5 (Construction Servicing)
- **All completed loans** from VS6 (Payoff & Closeout)
- **Builder performance data** from VS7 (Builder Accounting)
- **Market data** (external - e.g., Zillow, local MLS)
- **Financial data** (accounting system integration)

---

### Outputs

- **Portfolio health dashboard** - Real-time executive view
- **Quarterly investor reports** - PDF/PowerPoint format
- **Risk heat maps** - Visual risk aggregation
- **Executive KPI summary** - Monthly board reports
- **Trend analysis reports** - Performance over time

---

### Key Metrics & Targets

| Metric | Description | Target |
|--------|-------------|--------|
| **Total Portfolio Value** | Aggregate value of all active loans | Track (no target) |
| **Average Loan Size** | Mean loan amount | $2.5M-$3.5M range |
| **Default Rate** | % of loans defaulted | 0% (maintain zero-default record) |
| **Average Draw Cycle Time** | Portfolio-wide draw turnaround | 3 days (aligned with VS5 target) |
| **Builder Performance Score** | Weighted builder ratings | ≥80 average |
| **Portfolio Concentration Risk** | Max % with single builder | <15% per builder |
| **Geographic Diversification** | Market distribution | Seattle 60% / Phoenix 40% |

---

### System Capabilities Required

**Dashboard Components:**
- Real-time portfolio value aggregation
- Loan status breakdown (active, completed, at-risk)
- Builder performance scorecard
- Geographic heat map
- Risk indicators and alerts

**Reporting Engine:**
- Template-based report generation
- Scheduled report delivery (quarterly, monthly)
- Export to PDF, PowerPoint, Excel
- Interactive drill-down capability

**Data Aggregation:**
- Cross-system data consolidation
- Automated data quality checks
- Historical trending (multi-quarter)
- Benchmark comparisons

---

### User Personas

**Primary Users:**
- **Executive Team** (CEO, CFO) - Strategic oversight
- **Board of Directors** - Quarterly governance
- **Investors** (REIT stakeholders) - Performance monitoring
- **Finance Team** - Detailed analytics and reporting

**Secondary Users:**
- **Acquisitions Team** - Pipeline vs. capacity planning
- **Servicing Team** - Portfolio-level workload visibility

---

### Integration Points

```
VS5 (Construction Servicing) ──┐
                               ├──> VS8 (Portfolio Management)
VS6 (Payoff & Closeout) ──────┤
                               │
VS7 (Builder Accounting) ──────┘

VS8 Output ──> External Systems:
    - Investor Portal
    - Board Reporting Platform
    - Accounting System (QuickBooks)
```

---

### Connect 2.0 Implementation

**MVP Phase:**
- **Day 1-90:** NOT in scope (focus on Design & Entitlement module)
- **Day 91-180:** Basic portfolio dashboard (read-only)
- **Post-Day 180:** Full reporting engine with automated generation

**Technical Requirements:**
- Data warehouse or aggregation layer
- Business intelligence (BI) tool integration (e.g., Power BI, Tableau)
- Scheduled job framework for report generation
- Export/email automation

---

### Pain Points Addressed (Current State)

**Without VS8 (Current):**
- ❌ Manual portfolio consolidation (spreadsheets)
- ❌ Investor reports take 2-3 days to compile
- ❌ No real-time risk visibility
- ❌ Board reports prepared ad-hoc (inconsistent)
- ❌ No trending or historical analysis

**With VS8 (Connect 2.0):**
- ✅ Automated portfolio aggregation
- ✅ Investor reports generated in <1 hour
- ✅ Real-time risk dashboards
- ✅ Standardized board reporting
- ✅ Historical trending with one-click access

---

### Business Value

**Efficiency Gains:**
- Reduce investor reporting time by 90% (3 days → 3 hours)
- Eliminate manual portfolio consolidation (save 40 hours/month)
- Enable data-driven decision making with real-time dashboards

**Strategic Value:**
- Investor confidence through transparent reporting
- Board governance improved with better visibility
- Risk mitigation through early warning systems
- Scalability - support portfolio growth without proportional reporting burden

---

## Updated Value Stream Flow

```
VS1 → VS2 → VS3 → VS4/VS4.5/VS4.6 → VS5 → VS6 → VS7
                                      ↓     ↓     ↓
                                      └─────┴─────┴──> VS8 (Portfolio Management)
```

**Note:** VS8 is a **parallel/monitoring** value stream, not a sequential step. It continuously aggregates data from VS5, VS6, and VS7.

---

## Impact on Existing Documentation

### VALUE_STREAMS.md
- Add new section: "VS8: Portfolio Management"
- Update system ownership map (add Connect 2.0 - VS8 module)
- Update value stream count (7 → 8)
- Add VS8 to handoff points (VS5/VS6/VS7 → VS8)

### PRODUCT_REQUIREMENTS_DOCUMENT.md
- Add Section 5.8: "Portfolio Management Module"
- Update Section 3.2 (target architecture) with BI integration
- Add data warehouse requirements to Section 6 (data model)
- Update Section 8.1 (MVP phasing) with VS8 timeline

### CLAUDE.md
- Update value stream count (7 → 8)
- Add VS8 terminology
- Update project context with portfolio management focus

---

## Change Log

**v3.5 (January 10, 2026):**
- Added VS8: Portfolio Management value stream
- Defined portfolio-level metrics and targets
- Documented investor and board reporting requirements
- Mapped integration points with VS5, VS6, VS7
- Defined MVP phasing (post-Day 180 for full functionality)

**v3.4 (January 3, 2026):**
- Original 7 value streams documented (VS1-VS7)

---

**Document Status:**
- **Version:** 3.5 (SIMULATED for testing)
- **Status:** Proposed update
- **Approval:** Pending stakeholder review
- **Implementation:** Post-MVP (Day 180+)
