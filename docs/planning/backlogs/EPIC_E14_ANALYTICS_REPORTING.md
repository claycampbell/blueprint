# Epic E14: Analytics & Reporting - Detailed Backlog

**Epic Owner:** Product & Engineering
**Target Phase:** Days 91-180 (Phase 2)
**Created:** November 6, 2025
**Status:** Ready for Sprint Planning

---

## Epic Overview

**Full Scope:** 168 points (all features)
**Optimized Estimate:** 62 points (accounting for shared patterns)
**Priority:** P2 (Important for insights, not blocking MVP launch)

Analytics & Reporting provides leadership and operational teams with visibility into key performance metrics, conversion rates, cycle times, and builder performance.

**Business Value:**
- Track success against PRD metrics (feasibility cycle time -50%, draw turnaround -60%)
- Data-driven decision making
- Measure Blueprint transformation progress
- Identify operational bottlenecks

---

## Feature 1: Dashboard Metrics

### User Story E14-US1
**As an** Executive/Leadership team member, **I need to** view high-level metrics on pipeline, conversions, and revenue, **so that** I can monitor business health.

**Acceptance Criteria:**
- [ ] Display deals in pipeline by stage (Lead, Feasibility, GO, Funded)
- [ ] Show conversion rates between stages
- [ ] Display revenue metrics (total loan volume, avg loan size)
- [ ] Filter by date range (30/60/90 days, custom)
- [ ] Filter by market (Seattle, Phoenix, All)
- [ ] Refresh data automatically (5-minute interval)
- [ ] Export dashboard data to CSV

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E14-T1 | Design database aggregation queries | DATABASE_SCHEMA.md projects | 3 | P2 | E2 |
| E14-T2 | Create materialized view `mv_pipeline_metrics` | DATABASE_SCHEMA.md | 3 | P2 | E14-T1 |
| E14-T3 | Implement GET `/analytics/dashboard` API | API lines 886-929 | 5 | P2 | E14-T2, E3 |
| E14-T4 | Build Dashboard page UI (React) | SYSTEM_ARCHITECTURE.md | 8 | P2 | E14-T3 |
| E14-T5 | Integrate charting library (Chart.js/Recharts) | Frontend | 3 | P2 | E14-T4 |
| E14-T6 | Build metric cards component | Frontend | 3 | P2 | E14-T4 |
| E14-T7 | Implement date range filter | Frontend | 2 | P2 | E14-T4 |
| E14-T8 | Implement market filter dropdown | Frontend | 2 | P2 | E14-T4 |
| E14-T9 | Add auto-refresh mechanism (5-min polling) | Frontend | 2 | P2 | E14-T3 |
| E14-T10 | Unit tests for analytics service | TESTING_STRATEGY.md | 2 | P2 | E14-T3 |
| E14-T11 | Integration tests for dashboard API | TESTING_STRATEGY.md | 3 | P2 | E14-T3 |
| E14-T12 | E2E test: View dashboard → Filter → Export | TESTING_STRATEGY.md | 3 | P2 | E14-T9 |

**Subtotal:** 39 points

---

## Feature 2: Performance Metrics Tracking

### User Story E14-US2
**As a** Department Lead, **I need to** track team performance metrics (cycle times, throughput), **so that** I can measure progress toward targets.

**Acceptance Criteria:**
- [ ] Display feasibility packet assembly cycle time (avg, trend)
- [ ] Display entitlement submission prep time (avg, trend)
- [ ] Display deals vetted per FTE (count, ratio)
- [ ] Display average draw turnaround time (avg, trend)
- [ ] Show trend lines over time (weekly/monthly)
- [ ] Compare actual vs. target metrics from PRD
- [ ] Highlight metrics exceeding/missing targets
- [ ] Drill down into specific projects/loans

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E14-T13 | Define cycle time calculation logic | DATABASE_SCHEMA.md | 3 | P2 | E4, E5, E9, E10 |
| E14-T14 | Create `mv_cycle_time_metrics` materialized view | DATABASE_SCHEMA.md | 5 | P2 | E14-T13 |
| E14-T15 | Implement GET `/analytics/performance-metrics` | API patterns | 5 | P2 | E14-T14, E3 |
| E14-T16 | Build Performance Metrics page UI | SYSTEM_ARCHITECTURE.md | 5 | P2 | E14-T15 |
| E14-T17 | Build trend chart component (line/bar charts) | Frontend + charting | 3 | P2 | E14-T16, E14-T5 |
| E14-T18 | Build target vs. actual comparison component | Frontend | 3 | P2 | E14-T16 |
| E14-T19 | Implement drill-down to project/loan detail | Frontend navigation | 2 | P2 | E14-T16 |
| E14-T20 | Add team member filter (by assignee) | Frontend + API | 2 | P2 | E14-T15 |
| E14-T21 | Unit tests for performance metrics calculations | TESTING_STRATEGY.md | 3 | P2 | E14-T15 |
| E14-T22 | E2E test: View metrics → Drill down → Filter | TESTING_STRATEGY.md | 3 | P2 | E14-T19 |

**Subtotal:** 34 points

---

## Feature 3: Builder Performance Tracking

### User Story E14-US3
**As a** Lending Officer, **I need to** view a builder's loan history and risk score, **so that** I can make informed lending decisions.

**Acceptance Criteria:**
- [ ] Display builder profile with contact information
- [ ] Show loan history (count, total volume, average size)
- [ ] Display completion rate (% projects completed on time)
- [ ] Show default risk score (if AI scoring implemented)
- [ ] List active and historical loans
- [ ] Track payment history (on-time, late payments)
- [ ] Display project performance (budget/timeline adherence)
- [ ] Filter by builder name/entity

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E14-T23 | Design builder performance aggregation queries | DATABASE_SCHEMA.md | 3 | P2 | E9, E10, E11 |
| E14-T24 | Create `mv_builder_performance` materialized view | DATABASE_SCHEMA.md | 3 | P2 | E14-T23 |
| E14-T25 | Define builder risk scoring algorithm (placeholder) | Business logic | 5 | P3 | E14-T23 |
| E14-T26 | Implement GET `/analytics/builders/{id}/performance` | API patterns | 3 | P2 | E14-T24, E3 |
| E14-T27 | Build Builder Scorecard page UI | SYSTEM_ARCHITECTURE.md | 5 | P2 | E14-T26 |
| E14-T28 | Build loan history table component | Frontend | 3 | P2 | E14-T27 |
| E14-T29 | Build performance summary cards | Frontend | 3 | P2 | E14-T27 |
| E14-T30 | Unit tests for builder performance calculations | TESTING_STRATEGY.md | 2 | P2 | E14-T26 |
| E14-T31 | E2E test: Search builder → View scorecard | TESTING_STRATEGY.md | 3 | P2 | E14-T27 |

**Subtotal:** 30 points

---

## Feature 4: Custom Reports & Data Export

### User Story E14-US4
**As a** Business Analyst, **I need to** generate custom reports and export data, **so that** I can perform ad-hoc analysis.

**Acceptance Criteria:**
- [ ] Select report type (Projects, Loans, Draws, Tasks, Contacts)
- [ ] Apply filters (date range, status, assigned to, market)
- [ ] Preview report data in table format
- [ ] Export report to CSV format
- [ ] Export report to Excel format (.xlsx)
- [ ] Save report configuration for reuse
- [ ] Schedule recurring reports (stretch goal)

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E14-T32 | Design generic reporting query builder service | SYSTEM_ARCHITECTURE.md | 5 | P2 | E2 |
| E14-T33 | Implement POST `/analytics/reports/generate` API | API patterns | 5 | P2 | E14-T32, E3 |
| E14-T34 | Implement GET `/analytics/reports/{id}/download` (CSV) | API + file generation | 3 | P2 | E14-T33 |
| E14-T35 | Implement GET `/analytics/reports/{id}/download` (Excel) | API + xlsx library | 3 | P2 | E14-T33 |
| E14-T36 | Build Custom Report Builder UI | SYSTEM_ARCHITECTURE.md | 8 | P2 | E14-T33 |
| E14-T37 | Build filter configuration panel | Frontend | 3 | P2 | E14-T36 |
| E14-T38 | Build report preview table | Frontend | 3 | P2 | E14-T36 |
| E14-T39 | Implement CSV/Excel download buttons | Frontend + API | 2 | P2 | E14-T34, E14-T35 |
| E14-T40 | Add report configuration save feature | API + Frontend | 3 | P3 | E14-T36 |
| E14-T41 | Unit tests for report generation service | TESTING_STRATEGY.md | 3 | P2 | E14-T33 |
| E14-T42 | Integration tests for CSV/Excel generation | TESTING_STRATEGY.md | 3 | P2 | E14-T35 |
| E14-T43 | E2E test: Configure report → Export CSV | TESTING_STRATEGY.md | 3 | P2 | E14-T39 |

**Subtotal:** 44 points

---

## Feature 5: Visualizations & Charts

### User Story E14-US5
**As any** user with analytics access, **I need to** view interactive charts and graphs, **so that** I can quickly understand trends.

**Acceptance Criteria:**
- [ ] Pipeline funnel chart (deals by stage)
- [ ] Conversion rate trend line chart
- [ ] Cycle time bar chart (by stage)
- [ ] Revenue trend chart (monthly/quarterly)
- [ ] Geographic distribution map (Seattle vs. Phoenix)
- [ ] Interactive tooltips on hover
- [ ] Responsive design (mobile-friendly)

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E14-T44 | Evaluate charting libraries (Chart.js/Recharts/D3) | Frontend research | 2 | P2 | None |
| E14-T45 | Build pipeline funnel chart component | Frontend + E14-T5 | 3 | P2 | E14-T3, E14-T44 |
| E14-T46 | Build conversion trend line chart | Frontend + E14-T5 | 3 | P2 | E14-T15, E14-T44 |
| E14-T47 | Build cycle time bar chart | Frontend + E14-T5 | 3 | P2 | E14-T15, E14-T44 |
| E14-T48 | Build revenue trend chart | Frontend + E14-T5 | 3 | P2 | E14-T3, E14-T44 |
| E14-T49 | Implement interactive tooltips and legend | Frontend | 2 | P2 | E14-T45 |
| E14-T50 | Ensure responsive design for all charts | Frontend CSS | 2 | P2 | E14-T48 |
| E14-T51 | E2E test: View charts → Interact → Verify data | TESTING_STRATEGY.md | 3 | P2 | E14-T50 |

**Subtotal:** 21 points

---

## Epic Summary

| Feature | Full Points | Optimized | Priority | Notes |
|---------|-------------|-----------|----------|-------|
| Dashboard Metrics | 39 | ~15 | P2 | Many tasks shareable |
| Performance Metrics | 34 | ~15 | P2 | Reuses dashboard patterns |
| Builder Performance | 30 | ~12 | P2 | Similar to performance metrics |
| Custom Reports | 44 | ~15 | P2 | Independent feature |
| Visualizations | 21 | ~5 | P2 | Reuses charting setup |
| **TOTAL** | **168** | **62** | — | Realistic with pattern reuse |

---

## Technical Dependencies

### Database Requirements:
- Materialized views for aggregated metrics (refresh: hourly)
- Indexes on timestamp fields for cycle time calculations
- Indexes on foreign keys for join performance

**Reference:** DATABASE_SCHEMA.md lines 767-815, 729-765

### API Requirements:
- GET `/analytics/dashboard`
- GET `/analytics/performance-metrics`
- GET `/analytics/builders/{id}/performance`
- POST `/analytics/reports/generate`
- GET `/analytics/reports/{id}/download`

**Reference:** API_SPECIFICATION.md lines 886-929

### Frontend Requirements:
- Charting library (Chart.js or Recharts)
- CSV/Excel export library (Papa Parse, xlsx)
- Date picker component
- Responsive table component

**Reference:** SYSTEM_ARCHITECTURE.md lines 175-220

---

## Integration Points

Epic E14 integrates with:
- **E4** (Projects) - Pipeline metrics
- **E5** (Feasibility) - Feasibility cycle time
- **E6** (Entitlement) - Entitlement cycle time
- **E9** (Lending) - Loan revenue metrics
- **E10** (Servicing) - Draw turnaround time
- **E11** (Contacts) - Builder performance data

**Note:** E14 requires data accumulated during Phase 1 (Days 1-90).

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Slow aggregation queries | High | Use materialized views, cache results |
| Complex cycle time calculations | High | Start simple, iterate, validate with business |
| Charting library learning curve | Medium | Choose well-documented library (Chart.js) |
| Insufficient Phase 1 data | High | Use synthetic data for demo initially |
| Scope creep on custom reports | High | Freeze scope after Day 120 |

---

## Materialized View Examples

### Pipeline Metrics View

```sql
CREATE MATERIALIZED VIEW mv_pipeline_metrics AS
SELECT
  DATE_TRUNC('day', created_at) AS date,
  status,
  market,
  COUNT(*) AS deal_count,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400) AS avg_days_in_stage
FROM projects
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('day', created_at), status, market;

CREATE INDEX idx_mv_pipeline_metrics_date ON mv_pipeline_metrics(date);
```

### Cycle Time Metrics View

```sql
CREATE MATERIALIZED VIEW mv_cycle_time_metrics AS
SELECT
  p.id AS project_id,
  p.market,
  EXTRACT(EPOCH FROM (f.decision_date - p.created_at)) / 86400 AS lead_to_feas_days,
  EXTRACT(EPOCH FROM (e.approval_date - f.decision_date)) / 86400 AS feas_to_go_days
FROM projects p
LEFT JOIN feasibility f ON p.id = f.project_id
LEFT JOIN entitlement e ON p.id = e.project_id
WHERE p.deleted_at IS NULL;
```

---

## Definition of Done

- [ ] All user stories completed and acceptance criteria met
- [ ] Unit tests written and passing (90%+ coverage)
- [ ] Integration tests written and passing
- [ ] E2E tests written for critical journeys
- [ ] Performance verified (dashboard loads < 2 seconds)
- [ ] Materialized views optimized (refresh time < 30 seconds)
- [ ] Documentation updated (API docs, user guide)
- [ ] Security review completed (RBAC enforced)
- [ ] Deployed to staging and validated by PLT
- [ ] UAT completed with department leads

---

## Success Metrics (Day 180)

| Metric | Baseline | Target | Status |
|--------|----------|--------|--------|
| Dashboard adoption | — | ≥80% leadership | Track WAU |
| Report usage | — | ≥50 reports/week | Track exports |
| Data accuracy | — | 100% match to source | Audit |
| Page load time | — | < 2 seconds | Monitor |

---

## File References

- [PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md) lines 17-26 (success metrics)
- [API_SPECIFICATION.md](../technical/API_SPECIFICATION.md) lines 886-929
- [DATABASE_SCHEMA.md](../technical/DATABASE_SCHEMA.md) lines 767-815
- [SYSTEM_ARCHITECTURE.md](../technical/SYSTEM_ARCHITECTURE.md) lines 175-220
- [TESTING_STRATEGY.md](../technical/TESTING_STRATEGY.md) sections 4-6
- [BACKLOG_CREATION_PLAN.md](BACKLOG_CREATION_PLAN.md) Epic E14 section

---

**Status:** Ready for Sprint Planning
**Priority:** P2 - Phase 2 (Days 91-180)
**Next Steps:** Defer until Phase 2 kickoff; create GitHub issues when ready
