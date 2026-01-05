# Document Ingestion Skill - Test Scenario

**Purpose:** Validate the document-ingestion skill works correctly
**Test Document:** Blueprint_Value_Streams_(exec view)_v3_4.pdf (already ingested manually on January 5, 2026)
**Expected:** Skill should recognize document was already ingested and show minimal/no changes

---

## Test Execution Plan

### Test 1: Re-Ingest Already Processed Document (Baseline Test)

**Command:**
```bash
@document-ingestion "Blueprint_Value_Streams_(exec view)_v3_4.pdf" --scope analysis
```

**Expected Result:**
```yaml
document_analysis:
  type: process
  status: already_ingested
  ingestion_date: 2026-01-05
  current_state:
    - VALUE_STREAMS.md: up to date (matches document v3.4)
    - CLAUDE.md: references document correctly
    - PRD: aligned with value streams
  changes_needed: none
  confidence: high

report_summary: |
  Document Blueprint_Value_Streams_v3_4.pdf was already ingested on January 5, 2026.
  All documentation is up to date and consistent with this document.
  No changes required.
```

**Pass Criteria:**
- ✅ Skill recognizes document version (v3.4)
- ✅ Detects VALUE_STREAMS.md already exists and is up to date
- ✅ No conflicts detected
- ✅ No changes flagged
- ✅ Report generated confirming no action needed

---

### Test 2: Ingest Hypothetical Updated Version (v3.5 Simulation)

**Setup:** Create a simulated updated document describing a new change

**Test Document:** `test-documents/Value_Streams_v3_5_SIMULATED.md`

**Content:**
```markdown
# Blueprint Value Streams v3.5 - Change Summary

**Date:** January 10, 2026
**Changes from v3.4:**

## New Value Stream Added: VS8 Portfolio Management

**Purpose:** Monitor portfolio health, track aggregate metrics across all active loans,
and provide executive-level reporting for investors and board.

**System:** Connect 2.0 (new module)

**Key Activities:**
- Portfolio-level financial reporting
- Risk aggregation and monitoring
- Investor reporting (quarterly)
- Board dashboard preparation

**Inputs:**
- All active loans from VS5 (Construction Servicing)
- All completed loans from VS6 (Payoff & Closeout)
- Builder performance data from VS7 (Builder Accounting)

**Outputs:**
- Portfolio health dashboard
- Quarterly investor reports
- Risk heat maps
- Executive KPI summary

**Metrics:**
- Total portfolio value
- Average loan size
- Default rate (target: 0%)
- Average draw cycle time
- Builder performance scores
```

**Command:**
```bash
@document-ingestion "test-documents/Value_Streams_v3_5_SIMULATED.md" --type process --scope analysis
```

**Expected Result:**
```yaml
document_analysis:
  type: process
  version: v3.5 (simulated)
  key_findings:
    new_entities:
      - "Portfolio Management (VS8)"
      - "Portfolio health dashboard"
      - "Investor reporting"
    new_metrics:
      - "Total portfolio value"
      - "Average loan size"
      - "Builder performance scores"
    affected_areas:
      - value_streams
      - data_model
      - api_endpoints
      - ui_components
      - reporting

  impacts:
    documentation:
      - VALUE_STREAMS.md:
          section: "New VS8 section"
          action: "Add VS8: Portfolio Management"
      - CLAUDE.md:
          section: "Value Streams"
          action: "Update from 7 to 8 value streams"
      - PRODUCT_REQUIREMENTS_DOCUMENT.md:
          section: "Section 7 (Reporting)"
          action: "Add portfolio management requirements"

    code:
      data_model:
        - table: PortfolioMetrics
          action: Create aggregated metrics table
          priority: high
        - table: PortfolioSnapshot
          action: Create daily snapshot table
          priority: medium

      api_endpoints:
        - endpoint: GET /api/portfolio/health
          action: Portfolio health dashboard data
          priority: high
        - endpoint: GET /api/portfolio/reports/investor
          action: Generate investor report
          priority: high
        - endpoint: GET /api/portfolio/risk-heatmap
          action: Risk aggregation
          priority: medium

      ui_components:
        - component: PortfolioHealthDashboard
          action: Executive dashboard
          priority: high
        - component: InvestorReportGenerator
          action: Report generation UI
          priority: medium

  conflicts: none

  effort_estimate:
    total_hours: 80
    total_days: 10

  confidence: high
```

**Pass Criteria:**
- ✅ Detects new VS8 value stream
- ✅ Identifies new entities (Portfolio, Investor Reporting)
- ✅ Maps to correct documentation files
- ✅ Flags appropriate code areas (data model, APIs, UI)
- ✅ Estimates effort accurately
- ✅ No conflicts (since this is additive, not changing existing)
- ✅ Report generated with clear impact assessment

---

### Test 3: Ingest Document with Conflict

**Test Document:** `test-documents/Conflicting_Requirements.md`

**Content:**
```markdown
# Updated Feasibility Requirements - January 2026

## Change to Feasibility Cycle Time Target

**Previous Target:** -50% reduction in feasibility cycle time
**New Target:** -70% reduction in feasibility cycle time

**Rationale:** Competitive pressure requires faster turnaround.
Leadership approved more aggressive automation investment.

## Change to Value Stream Count

**Correction:** Blueprint actually operates **6 core value streams**.
VS4.5 (Land Loan) and VS4.6 (Construction Loan Closing) should be
consolidated into VS4 (Underwriting & Loan Closing).

**Rationale:** Operational teams view these as sub-steps of a single
value stream, not separate value streams.
```

**Command:**
```bash
@document-ingestion "test-documents/Conflicting_Requirements.md" --type technical --scope analysis
```

**Expected Result:**
```yaml
document_analysis:
  type: technical
  key_findings:
    changed_metrics:
      - metric: "Feasibility cycle time reduction"
        old_value: "-50%"
        new_value: "-70%"
    changed_structure:
      - concept: "Value stream count"
        old_value: "7 value streams (VS1-VS7)"
        new_value: "6 value streams (consolidate VS4.5, VS4.6 into VS4)"

  conflicts:
    - type: metric_change
      severity: medium
      location: PRODUCT_REQUIREMENTS_DOCUMENT.md Section 1
      current_value: "-50% reduction"
      new_value: "-70% reduction"
      impact: "May affect MVP scope, timeline, and cost estimates"
      resolution_required: true
      recommendation: "Confirm with product owner before updating"

    - type: structural_change
      severity: high
      location: VALUE_STREAMS.md (entire document structure)
      current_value: "7 value streams (VS1-VS7)"
      new_value: "6 value streams (consolidate VS4.5, VS4.6)"
      impact: |
        Major restructuring of VALUE_STREAMS.md required.
        Will affect:
        - All references to VS4.5, VS4.6 throughout docs
        - CLAUDE.md terminology
        - Jira tasks labeled with "VS4.5" or "VS4.6"
        - Any code comments referencing value streams
      resolution_required: true
      recommendation: |
        DO NOT AUTO-UPDATE. This requires:
        1. Confirmation with stakeholders (is this correct?)
        2. Decision on whether to refactor existing work
        3. Communication plan for team
        4. Jira task relabeling strategy

  validation_failures:
    - check: cross_reference_consistency
      status: would_fail
      details: |
        If changes applied, 47 cross-references to VS4.5/VS4.6 would break:
        - VALUE_STREAMS.md: 23 references
        - PRODUCT_REQUIREMENTS_DOCUMENT.md: 8 references
        - CLAUDE.md: 3 references
        - Jira tasks: 13 references

  recommendation: |
    ⚠️  HOLD - DO NOT APPLY CHANGES AUTOMATICALLY

    This document contains breaking changes that conflict with existing
    project structure. Required actions:

    1. Schedule stakeholder meeting to validate:
       - Is -70% target realistic and approved?
       - Is value stream consolidation correct, or is the new doc wrong?

    2. If changes confirmed, perform manual refactor:
       - Update all documentation
       - Relabel Jira tasks
       - Communicate changes to team
       - Update code comments/constants

    3. Then re-run ingestion with confirmed decisions

  confidence: high (detected conflicts correctly)
```

**Pass Criteria:**
- ✅ Detects conflicting metric (-50% vs -70%)
- ✅ Detects structural conflict (7 vs 6 value streams)
- ✅ Flags both conflicts with HIGH severity
- ✅ Does NOT auto-update (safe mode)
- ✅ Recommends stakeholder confirmation
- ✅ Identifies all cross-references that would break
- ✅ Provides clear next steps for resolution
- ✅ Report generated with conflict details

---

### Test 4: Ingest Workshop Notes (Unstructured Text)

**Test Document:** `test-documents/Workshop_Notes_2026_Q1.txt`

**Content:**
```
Blueprint Workshop - Q1 2026 Planning
Date: January 15, 2026
Attendees: Leadership team, product team

KEY DECISIONS:

1. Builder Portal Launch
   - Approved for Day 120 milestone
   - Builders need self-service draw request submission
   - Reduces servicing team workload
   - Priority: HIGH

2. AI-Powered Lead Scoring
   - Pilot in Q2 2026
   - Use historical data to predict deal success
   - Aim for 80% accuracy on go/no-go prediction
   - Priority: MEDIUM (post-MVP)

3. Mobile Inspection App
   - Current iPad app too slow
   - Rebuild as native mobile app
   - Target: -50% inspection time
   - Priority: HIGH (critical for VS5)

METRICS DISCUSSION:
- Current draw turnaround: 7-10 days
- Target: 3 days
- This is more aggressive than PRD (-60% = 4 days)
- Team believes 3 days achievable with automation

ACTION ITEMS:
- Create epic for Builder Portal
- Research AI/ML vendors for lead scoring
- Evaluate React Native vs Flutter for mobile app
```

**Command:**
```bash
@document-ingestion "test-documents/Workshop_Notes_2026_Q1.txt" --type workshop --scope analysis
```

**Expected Result:**
```yaml
document_analysis:
  type: workshop
  key_findings:
    new_features:
      - name: "Builder Portal"
        milestone: "Day 120"
        priority: high
        description: "Self-service draw request submission for builders"

      - name: "AI-Powered Lead Scoring"
        milestone: "Q2 2026 (post-MVP)"
        priority: medium
        description: "Predict deal success with 80% accuracy"

      - name: "Mobile Inspection App (Native)"
        milestone: "TBD"
        priority: high
        description: "Replace iPad app, reduce inspection time by 50%"

    changed_metrics:
      - metric: "Draw turnaround target"
        old_value: "4 days (-60% reduction)"
        new_value: "3 days"
        confidence: "Team believes achievable"

    action_items:
      - "Create epic for Builder Portal"
      - "Research AI/ML vendors for lead scoring"
      - "Evaluate React Native vs Flutter for mobile app"

    affected_areas:
      - product_roadmap
      - mvp_phasing
      - feature_backlog

  impacts:
    documentation:
      - PRODUCT_ROADMAP.md:
          action: "Add Builder Portal (Day 120)"
          priority: high

      - PRODUCT_REQUIREMENTS_DOCUMENT.md:
          section: "Section 5 (Feature Backlog)"
          action: "Add Builder Portal epic"
          priority: high

      - PRODUCT_REQUIREMENTS_DOCUMENT.md:
          section: "Section 10 (AI & Automation)"
          action: "Add AI-powered lead scoring"
          priority: medium

      - PRODUCT_REQUIREMENTS_DOCUMENT.md:
          section: "Section 9 (Integrations)"
          action: "Update Mobile Inspection App requirements"
          priority: high

    jira:
      new_epics:
        - title: "Builder Portal (Self-Service Draw Requests)"
          description: "From workshop 2026-01-15"
          milestone: "Day 120"
          priority: high

        - title: "AI-Powered Lead Scoring"
          description: "From workshop 2026-01-15"
          milestone: "Q2 2026"
          priority: medium

        - title: "Native Mobile Inspection App"
          description: "From workshop 2026-01-15"
          milestone: "TBD"
          priority: high

  conflicts:
    - type: metric_refinement
      severity: low
      location: PRODUCT_REQUIREMENTS_DOCUMENT.md Section 1
      current_value: "4 days (calculated from -60%)"
      new_value: "3 days (more aggressive)"
      resolution_required: false
      recommendation: |
        This is a refinement, not a conflict. Update PRD to reflect
        new 3-day target with note: "More aggressive than initial -60% target,
        validated by team as achievable with automation."

  confidence: medium (unstructured text, some ambiguity)

  flags_for_review:
    - "Builder Portal timeline (Day 120) needs validation against current MVP scope"
    - "Mobile app tech stack (React Native vs Flutter) - decision needed"
    - "AI/ML vendor research - assign owner for action item"
```

**Pass Criteria:**
- ✅ Extracts key decisions from unstructured text
- ✅ Identifies new features (Builder Portal, AI Lead Scoring, Mobile App)
- ✅ Detects metric refinement (4 days → 3 days)
- ✅ Maps action items correctly
- ✅ Flags appropriate documentation for updates
- ✅ Suggests Jira epics to create
- ✅ Flags ambiguities for human review
- ✅ Report generated with clear next steps

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] Ensure skill files created in `.claude/skills/document-ingestion/`
- [ ] Create `test-documents/` directory
- [ ] Create simulated test documents
- [ ] Backup current documentation (in case of errors)

### Test Execution
- [ ] Test 1: Re-ingest v3.4 (baseline)
- [ ] Test 2: Ingest v3.5 simulated (new content)
- [ ] Test 3: Ingest conflicting requirements
- [ ] Test 4: Ingest workshop notes (unstructured)

### Validation
- [ ] Review generated reports for accuracy
- [ ] Verify no documentation corrupted
- [ ] Check conflict detection works correctly
- [ ] Confirm safe mode prevents unwanted changes
- [ ] Validate effort estimates reasonable

### Post-Test
- [ ] Document any issues found
- [ ] Update SKILL.md if needed
- [ ] Clean up test documents (or keep as examples)
- [ ] Report skill ready for use

---

## Success Criteria

**Skill is ready for production use if:**
1. ✅ All 4 tests pass criteria
2. ✅ No documentation corrupted during testing
3. ✅ Conflict detection catches real conflicts
4. ✅ Safe mode prevents changes without confirmation
5. ✅ Reports are clear and actionable
6. ✅ Jira task suggestions are accurate
7. ✅ Effort estimates within ±25% of reality

---

## Known Limitations (Acceptable for v1.0)

1. **Unstructured text extraction** - May miss some details from poorly formatted workshop notes
2. **Effort estimation** - Rough estimates, should be validated by developers
3. **Conflict resolution** - Flags conflicts but doesn't auto-resolve (by design)
4. **Document format support** - PDF, DOCX, TXT, MD only (no spreadsheets yet)

---

**Test Plan Status:**
- **Created:** January 5, 2026
- **Executed:** [Pending]
- **Results:** [To be documented]
- **Status:** Ready for execution
