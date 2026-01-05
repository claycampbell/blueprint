# Document Ingestion Skill

**Skill Name:** document-ingestion
**Purpose:** Intelligently ingest new or updated business documents and propagate changes throughout the project
**Version:** 1.0
**Created:** January 5, 2026

---

## Overview

This skill automates the process of ingesting new business documents (strategy documents, process flows, workshop summaries, requirements updates) and systematically updating all affected project artifacts including documentation, configuration, and flagging necessary code changes.

**Use this skill when:**
- Blueprint leadership provides updated business documents (PDFs, Word docs, spreadsheets)
- Workshop summaries or meeting notes need to be integrated
- Process flow diagrams are updated
- Requirements change based on stakeholder feedback
- Strategic direction evolves

**What this skill does:**
1. Analyzes incoming documents to extract key information
2. Maps changes to affected project areas (docs, code, config)
3. Updates documentation systematically (CLAUDE.md, PRD, VALUE_STREAMS.md, etc.)
4. Flags code areas that need implementation changes
5. Optionally creates Jira tasks for implementation work
6. Generates a comprehensive change report

---

## Skill Invocation

```bash
@document-ingestion <document_path> [options]
```

### Parameters

**Required:**
- `document_path`: Path to the document file (PDF, DOCX, TXT, MD) or URL to fetch

**Optional Flags:**
- `--type <strategic|process|technical|financial|workshop>`: Document type (auto-detected if not specified)
- `--scope <documentation|full|analysis>`:
  - `documentation`: Only update docs, no code flagging
  - `full`: Update docs + flag code changes + create Jira tasks
  - `analysis`: Analysis only, no changes made (default)
- `--auto-jira`: Automatically create Jira tasks for implementation work
- `--auto-commit`: Commit documentation changes to git (requires approval)

### Example Usage

```bash
# Analysis only (safe mode - no changes)
@document-ingestion "Blueprint_Value_Streams_v3_5.pdf"

# Update documentation only
@document-ingestion "New Workshop Summary.txt" --scope documentation

# Full ingestion with Jira task creation
@document-ingestion "Updated PRD Requirements.docx" --scope full --auto-jira

# Strategic document with type hint
@document-ingestion "Q1 2026 Strategy.pdf" --type strategic --scope full
```

---

## Skill Workflow

### Phase 1: Document Analysis

**Objective:** Extract structured information from the incoming document

**Steps:**
1. **Load Document**
   - Read PDF (using PDF reader), DOCX (using docx parser), or plaintext
   - If URL provided, fetch document first
   - Validate document is readable

2. **Classify Document Type**
   - Strategic (vision, goals, objectives, business direction)
   - Process (workflows, value streams, procedures)
   - Technical (architecture, tech stack, API specs)
   - Financial (budgets, ROI, cost models)
   - Workshop/Meeting (summaries, outcomes, action items)

3. **Extract Key Information**
   - **Entities:** New business concepts (e.g., "Land Loan", "Builder Score")
   - **Processes:** Workflows, value streams, procedures
   - **Metrics:** KPIs, targets, success criteria
   - **Requirements:** Features, capabilities, constraints
   - **Integrations:** External systems, APIs, data flows
   - **Terminology:** New terms or changed definitions
   - **Dates/Milestones:** Timelines, deliverables, decision gates
   - **Personas:** User roles, teams, stakeholders

4. **Identify Changes from Current State**
   - Compare with existing PRODUCT_REQUIREMENTS_DOCUMENT.md
   - Compare with VALUE_STREAMS.md
   - Compare with CLAUDE.md terminology section
   - Flag: New information vs. Changed information vs. Conflicting information

5. **Assess Impact Scope**
   - Use IMPACT_ANALYSIS.md matrix to determine affected areas
   - Categorize impacts: Documentation / Data Model / API / UI / Business Logic / DevOps

**Output:**
```yaml
document_analysis:
  type: process
  key_findings:
    - new_entities: ["Land Loan", "Conditional Loan"]
    - changed_processes: ["VS4 now splits into VS4.5 and VS4.6"]
    - new_metrics: ["Land hold duration"]
    - affected_areas: [value_streams, data_model, api_endpoints]
  conflicts:
    - "PRD Section 4 says 6 value streams, new doc shows 7"
  confidence: high
```

---

### Phase 2: Impact Mapping

**Objective:** Map document changes to specific project files and code areas

**Steps:**
1. **Map to Documentation Files**
   ```yaml
   documentation_impacts:
     critical:
       - CLAUDE.md:
           - section: "Key Documents"
           - action: "Add reference to new document"
       - VALUE_STREAMS.md:
           - section: "VS4.5 Land Loan (Conditional)"
           - action: "Add new value stream"
       - PRODUCT_REQUIREMENTS_DOCUMENT.md:
           - section: "5.4 Loan Origination"
           - action: "Add land loan requirements"

     recommended:
       - DEVELOPER_QUICKSTART.md:
           - section: "Business Context"
           - action: "Update with new value stream"
   ```

2. **Map to Code Areas**
   ```yaml
   code_impacts:
     data_model:
       - table: LandLoan
         action: Create new table for land loan tracking
         priority: high
       - table: Project
         fields: [land_loan_id, land_hold_start_date]
         action: Add foreign key and tracking fields
         priority: high

     api_endpoints:
       - endpoint: POST /api/land-loans
         action: Create land loan origination endpoint
         priority: high
       - endpoint: GET /api/land-loans/:id/status
         action: Track land loan status
         priority: medium

     ui_components:
       - component: LandLoanDashboard
         action: Create dashboard for land loan management
         priority: medium
       - component: LoanOriginationFlow
         action: Update to include land loan option
         priority: high
   ```

3. **Map to Configuration**
   ```yaml
   configuration_impacts:
     env_variables:
       - LAND_LOAN_MAX_DURATION_DAYS
       - LAND_LOAN_INTEREST_RATE

     constants:
       - LOAN_TYPES: Add 'CONDITIONAL_LAND_LOAN'
       - VALUE_STREAM_STATES: Add VS4.5 states
   ```

4. **Map to Jira Structure**
   ```yaml
   jira_impacts:
     new_epics:
       - title: "Land Loan Management (VS4.5)"
         description: "Implement conditional land loan functionality..."
         stories:
           - "As an underwriter, I want to create land loans..."
           - "As a servicing rep, I want to track land hold duration..."

     updated_epics:
       - epic_key: DP01-22
         updates: "Add land loan API endpoints to existing loan APIs"
   ```

---

### Phase 3: Documentation Updates

**Objective:** Systematically update all affected documentation

**Steps:**

1. **Update CLAUDE.md**
   - Add new document to "Key Documents" or "Supporting Documents"
   - Update "Document Structure & Relationships" diagram
   - Add new terminology to "Terminology" section
   - Update "Project Context" if business metrics change
   - Update "Technical Decisions" if decisions made

2. **Update VALUE_STREAMS.md** (if applicable)
   - Add new value streams
   - Update value stream descriptions
   - Revise system ownership map
   - Update handoff points and integration gaps
   - Refresh metrics and targets

3. **Update PRODUCT_REQUIREMENTS_DOCUMENT.md**
   - Add new requirements to relevant sections
   - Update feature backlog
   - Revise data model specifications
   - Add API endpoint specifications
   - Update MVP phasing if scope changes

4. **Update Supporting Documentation**
   - Epic tasking guides (if new epics)
   - Sprint plans (if priorities shift)
   - Technical decision documents (if tech choices made)
   - Cost models (if budget impacts)

5. **Create New Documentation** (if needed)
   - New epic backlogs (e.g., EPIC_E19_LAND_LOAN_MANAGEMENT.md)
   - New decision records
   - New integration guides

**Documentation Update Template:**
```markdown
<!-- Auto-generated by document-ingestion skill -->
## [Section Name]

**Source:** [Document Name, Version, Date]
**Ingested:** [Date]

[Content from source document, adapted for this documentation]

**Key Changes:**
- Added: [New information]
- Updated: [Changed information]
- Deprecated: [Obsolete information]

**Related Documentation:**
- See [VALUE_STREAMS.md](VALUE_STREAMS.md#vs45) for workflow details
- See [PRD Section 5.4](PRODUCT_REQUIREMENTS_DOCUMENT.md#54-loan-origination) for requirements
```

---

### Phase 4: Code Change Flagging

**Objective:** Create actionable flags for code implementation work

**Steps:**

1. **Generate Implementation Checklist**
   ```markdown
   # Implementation Checklist - Land Loan Feature

   ## 1. Data Model Changes
   - [ ] Create `land_loans` table (schema in `scripts/init-db.sql`)
   - [ ] Add foreign key to `projects` table
   - [ ] Create migration script
   - [ ] Update Prisma schema (if using)

   ## 2. API Endpoints
   - [ ] POST /api/land-loans - Create land loan
   - [ ] GET /api/land-loans/:id - Get land loan details
   - [ ] PATCH /api/land-loans/:id - Update land loan
   - [ ] POST /api/land-loans/:id/transition - Transition to construction loan

   ## 3. Business Logic
   - [ ] LandLoanService.create()
   - [ ] LandLoanService.calculateHoldDuration()
   - [ ] LandLoanService.transitionToConstructionLoan()
   - [ ] Validation rules for land loan creation

   ## 4. UI Components
   - [ ] LandLoanForm component
   - [ ] LandLoanDashboard page
   - [ ] Update LoanOriginationWizard to include land loan option
   - [ ] Add land loan status to ServicingDashboard

   ## 5. Tests
   - [ ] Unit tests for LandLoanService
   - [ ] Integration tests for land loan API endpoints
   - [ ] E2E tests for land loan workflow

   ## 6. Documentation
   - [ ] API documentation for land loan endpoints
   - [ ] User guide for land loan process
   - [ ] Update developer docs with land loan data model
   ```

2. **Estimate Effort**
   ```yaml
   effort_estimates:
     data_model: 4 hours
     api_endpoints: 8 hours
     business_logic: 12 hours
     ui_components: 16 hours
     tests: 8 hours
     documentation: 4 hours
     total: 52 hours (6.5 developer days)
   ```

3. **Identify Dependencies**
   ```yaml
   dependencies:
     - Must complete data model before API endpoints
     - API endpoints block UI components
     - Requires infrastructure task DP01-148 (database setup) to be complete
   ```

---

### Phase 5: Jira Task Creation (Optional)

**Objective:** Automatically create Jira tasks for implementation work

**Steps:**

1. **Check for Existing Epics**
   - Search Jira for related epics
   - Determine if new epic needed or tasks added to existing

2. **Create Epic (if needed)**
   ```python
   epic = create_jira_issue(
       project_key="DP01",
       summary="Land Loan Management (VS4.5)",
       issue_type="Epic",
       description="""
       Implement conditional land loan functionality to support VS4.5 workflow.

       **Business Context:**
       [Link to VALUE_STREAMS.md#vs45]

       **Requirements:**
       [Link to PRD Section 5.4]

       **Source Document:**
       Blueprint_Value_Streams_v3_5.pdf
       """,
       labels=["Track-3-Platform", "value-stream-VS4.5"]
   )
   ```

3. **Create User Stories**
   ```python
   stories = [
       {
           "summary": "As an underwriter, I want to create land loans for properties without permits",
           "description": "...",
           "acceptance_criteria": "...",
           "story_points": 5
       },
       {
           "summary": "As a servicing rep, I want to track land hold duration",
           "description": "...",
           "acceptance_criteria": "...",
           "story_points": 3
       }
   ]
   ```

4. **Create Technical Tasks**
   ```python
   tasks = [
       {
           "summary": "Create land_loans database table",
           "parent": epic_key,
           "description": "SQL schema in implementation checklist",
           "estimate": "4h"
       },
       {
           "summary": "Implement POST /api/land-loans endpoint",
           "parent": epic_key,
           "description": "API spec in implementation checklist",
           "estimate": "8h"
       }
   ]
   ```

5. **Link to Documentation**
   - Add links to CLAUDE.md, PRD, VALUE_STREAMS.md in Jira descriptions
   - Tag with appropriate labels
   - Assign to appropriate sprint (if specified)

---

### Phase 6: Validation & Conflict Resolution

**Objective:** Ensure changes are consistent and conflicts are resolved

**Steps:**

1. **Check Cross-References**
   ```yaml
   validation_checks:
     - PRD references to VALUE_STREAMS.md are updated
     - CLAUDE.md "Document Structure" diagram includes new doc
     - Terminology is consistent across all docs
     - Metrics align across PRD and VALUE_STREAMS.md
   ```

2. **Detect Conflicts**
   ```yaml
   conflicts_detected:
     - type: metric_mismatch
       location: PRD Section 1 vs VALUE_STREAMS.md
       details: "PRD says 6 value streams, VALUE_STREAMS.md now shows 7"
       resolution: "Updated PRD to reflect 7 value streams"

     - type: terminology_inconsistency
       location: CLAUDE.md vs VALUE_STREAMS.md
       details: "'Conditional Loan' vs 'Land Loan' - which term to use?"
       resolution: "Standardized on 'Land Loan' per VALUE_STREAMS.md v3.5"
   ```

3. **Flag for Human Review**
   ```markdown
   ## ⚠️ Items Requiring Human Review

   1. **Conflicting Timeline:** PRD says Day 90 for loan features, new doc implies Day 60
      - **Action:** Review with product owner
      - **Files:** PRODUCT_REQUIREMENTS_DOCUMENT.md Section 8.1

   2. **Unclear Requirement:** Land loan interest rate not specified in new document
      - **Action:** Follow up with finance team
      - **Files:** VALUE_STREAMS.md Section VS4.5
   ```

---

### Phase 7: Report Generation

**Objective:** Generate comprehensive report of all changes

**Steps:**

1. **Generate Change Summary**
   ```markdown
   # Document Ingestion Report

   **Document:** Blueprint_Value_Streams_v3_5.pdf
   **Ingested:** January 5, 2026, 10:30 AM
   **Scope:** Full (documentation + code flagging + Jira)
   **Status:** Complete with 2 items flagged for human review

   ## Executive Summary

   Ingested updated value streams document (v3.5) which introduced a new VS4.5
   "Land Loan (Conditional)" value stream. This represents a significant workflow
   addition for handling properties that close before permits are secured.

   **Impact Assessment:**
   - 3 documentation files updated (CLAUDE.md, VALUE_STREAMS.md, PRD)
   - 1 new epic created in Jira (DP01-XXX)
   - 12 user stories and tasks created
   - Estimated implementation: 52 hours (6.5 days)
   - 2 conflicts detected and resolved
   - 2 items flagged for human review

   ## Documentation Changes

   ### Files Updated
   1. **CLAUDE.md**
      - Added reference to Blueprint_Value_Streams_v3_5.pdf
      - Updated document structure diagram
      - Added "Land Loan" to terminology

   2. **VALUE_STREAMS.md**
      - Added Section VS4.5: Land Loan (Conditional)
      - Updated system ownership map
      - Added new handoff point (VS3 → VS4.5)
      - Updated target metrics

   3. **PRODUCT_REQUIREMENTS_DOCUMENT.md**
      - Updated Section 2.2 (current state) to mention land loans
      - Added Section 5.4.5 (land loan requirements)
      - Updated Section 6.3 (data model) with LandLoan entity
      - Updated Section 8.1 (MVP phasing) with land loan scope

   ## Code Changes Flagged

   ### High Priority
   - [ ] Create land_loans database table
   - [ ] Implement land loan API endpoints (4 endpoints)
   - [ ] Build LandLoanService business logic
   - [ ] Update loan origination UI workflow

   ### Medium Priority
   - [ ] Create LandLoanDashboard component
   - [ ] Add land loan reporting
   - [ ] Update servicing dashboard

   ### Low Priority
   - [ ] Add land loan analytics

   **Full Implementation Checklist:** [See IMPLEMENTATION_CHECKLIST.md](...)

   ## Jira Tasks Created

   ### New Epic
   - **DP01-XXX:** Land Loan Management (VS4.5)
     - Link: https://vividcg.atlassian.net/browse/DP01-XXX

   ### User Stories (8)
   - DP01-XXX: As an underwriter, I want to create land loans...
   - DP01-XXX: As a servicing rep, I want to track land hold duration...
   - [... 6 more stories]

   ### Technical Tasks (4)
   - DP01-XXX: Create land_loans database table
   - DP01-XXX: Implement land loan API endpoints
   - [... 2 more tasks]

   ## Conflicts Resolved

   1. **Value Stream Count Mismatch**
      - PRD Section 1 updated from "6 value streams" to "7 value streams"

   2. **Terminology Standardization**
      - Standardized on "Land Loan" (not "Conditional Loan")
      - Updated CLAUDE.md terminology section

   ## Items for Human Review

   1. **Timeline Clarification Needed**
      - PRD says Day 90, new doc implies Day 60
      - **Action:** Review with product owner before next sprint planning

   2. **Missing Requirement**
      - Land loan interest rate not specified
      - **Action:** Follow up with finance team

   ## Next Steps

   1. Review this report and resolve flagged items
   2. Review and approve Jira epic/stories (DP01-XXX)
   3. Prioritize land loan feature in upcoming sprint planning
   4. Assign development team to implementation tasks
   5. Commit documentation changes to git (requires approval)

   ---

   **Generated by:** document-ingestion skill v1.0
   **Report saved to:** docs/ingestion-reports/2026-01-05_value-streams-v3-5.md
   ```

2. **Save Artifacts**
   - Save change report to `docs/ingestion-reports/`
   - Save implementation checklist to `docs/implementation/`
   - Save conflict resolution log

3. **Present to User**
   - Show executive summary
   - Highlight key changes
   - Flag items needing human review
   - Provide next steps

---

## Skill Configuration

### Default Behavior

```yaml
defaults:
  scope: analysis  # Safe mode - no changes without confirmation
  auto_jira: false  # Don't create Jira tasks automatically
  auto_commit: false  # Don't commit changes automatically
  conflict_resolution: flag  # Flag conflicts for human review
  validation_level: high  # Strict validation
```

### Configuration File

Location: `.claude/skills/document-ingestion/config.yml`

```yaml
document_ingestion:
  # Document analysis
  extract_entities: true
  extract_metrics: true
  extract_terminology: true

  # Impact assessment
  check_data_model: true
  check_api_endpoints: true
  check_ui_components: true
  check_business_logic: true

  # Documentation updates
  update_claude_md: true
  update_prd: true
  update_value_streams: true
  update_supporting_docs: true

  # Code change flagging
  flag_schema_changes: true
  flag_api_changes: true
  flag_ui_changes: true
  estimate_effort: true

  # Jira integration
  jira_enabled: true
  jira_project: DP01
  jira_epic_label_prefix: "Track-3-Platform"

  # Validation
  check_cross_references: true
  check_terminology_consistency: true
  check_metric_alignment: true

  # Reporting
  generate_report: true
  save_report_to: docs/ingestion-reports/
  report_format: markdown
```

---

## Error Handling

### Document Read Errors

```yaml
error_scenarios:
  - scenario: PDF cannot be read
    action: Prompt user to convert to text or provide alternative format

  - scenario: Document is scanned image (no text layer)
    action: Suggest using OCR or manual transcription

  - scenario: Document is password-protected
    action: Request password or unlocked version
```

### Conflict Detection

```yaml
conflict_handling:
  - type: direct_contradiction
    example: "PRD says 6 value streams, new doc says 7"
    action: Flag for human review with both sources cited

  - type: ambiguous_requirement
    example: "Timeline not clear"
    action: Flag specific section needing clarification

  - type: terminology_mismatch
    example: "Land Loan vs Conditional Loan"
    action: Propose standardization, flag for approval
```

### Validation Failures

```yaml
validation_failures:
  - type: broken_cross_reference
    example: "PRD references Section 5.4 but section doesn't exist"
    action: Fix reference or flag for human review

  - type: orphaned_content
    example: "New entity mentioned but not defined"
    action: Flag for clarification or additional documentation
```

---

## Best Practices

### 1. Always Start with Analysis Mode

```bash
# First run - analysis only
@document-ingestion "New Document.pdf"

# Review results, then proceed with updates
@document-ingestion "New Document.pdf" --scope documentation
```

### 2. Use Type Hints for Better Analysis

```bash
# Helps skill know what to look for
@document-ingestion "Workshop Notes.txt" --type workshop
```

### 3. Review Before Auto-Jira

```bash
# Step 1: Update docs only
@document-ingestion "Requirements.docx" --scope documentation

# Step 2: Review changes, then create Jira tasks
@document-ingestion "Requirements.docx" --scope full --auto-jira
```

### 4. Commit Documentation Changes Separately

```bash
# Let skill update docs, but review before committing
@document-ingestion "Strategy.pdf" --scope documentation

# Manually review changes, then commit
git diff
git add CLAUDE.md VALUE_STREAMS.md PRODUCT_REQUIREMENTS_DOCUMENT.md
git commit -m "docs: Ingest Q1 2026 strategy updates"
```

### 5. Handle Large Documents in Chunks

```bash
# If document is very large, extract relevant sections first
# Then ingest section by section with context
@document-ingestion "Large Report - Section 3.md" --type technical
```

---

## Integration with Other Skills

### Works Well With:

1. **@jira-automation** - For creating/updating Jira tasks
2. **@feature-dev** - After ingestion, use for feature implementation
3. **@devkit:documentation-generator** - Generate API docs from flagged endpoints
4. **@devkit:code-reviewer** - Review generated implementation checklists

### Example Workflow:

```bash
# 1. Ingest new requirements
@document-ingestion "New Requirements.pdf" --scope full --auto-jira

# 2. Review generated Jira epic
@jira-automation get-issue DP01-XXX

# 3. Start implementing flagged feature
@feature-dev "Implement land loan functionality (DP01-XXX)"
```

---

## Limitations

### What This Skill Does NOT Do:

1. **Does not implement code automatically** - Only flags areas needing implementation
2. **Does not merge conflicting information** - Flags conflicts for human review
3. **Does not interpret ambiguous requirements** - Flags ambiguities for clarification
4. **Does not make business decisions** - e.g., whether to implement a feature
5. **Does not update external systems** - Only internal project artifacts

### Document Types Not Supported:

- Spreadsheets (Excel, Google Sheets) - Use CSV export first
- Presentations (PowerPoint) - Export to PDF or provide speaker notes
- Videos/Audio - Provide transcript first
- Scanned documents without OCR - Run OCR first or provide text version

---

## Troubleshooting

### "Document analysis confidence low"

**Cause:** Document is ambiguous, poorly formatted, or highly technical
**Solution:**
- Provide type hint: `--type <type>`
- Extract key sections manually and provide as markdown
- Review document with stakeholder to clarify before ingestion

### "Multiple conflicts detected"

**Cause:** New document contradicts existing documentation
**Solution:**
- Review conflict report carefully
- Determine which source is correct (usually newest)
- Manually resolve conflicts in documentation
- Re-run skill with `--scope documentation` to validate

### "No impacts detected"

**Cause:** Document doesn't contain new information or changes
**Solution:**
- Verify document is actually new/updated
- Check if document is strategic vs. implementation detail
- Document may not require ingestion (e.g., meeting notes without decisions)

---

## Version History

**v1.0 (January 5, 2026)**
- Initial release
- Supports PDF, DOCX, TXT, MD document types
- Full documentation update workflow
- Code change flagging
- Jira task creation
- Comprehensive reporting

**Future Enhancements:**
- Support for spreadsheet ingestion (Excel, Google Sheets)
- Integration with Confluence for knowledge base updates
- Automated screenshot analysis (e.g., UI mockups in documents)
- Machine learning-based entity extraction improvements
- Diff view for documentation changes

---

## References

- **Impact Analysis:** [IMPACT_ANALYSIS.md](IMPACT_ANALYSIS.md) - Comprehensive map of project areas
- **CLAUDE.md:** [/CLAUDE.md](/CLAUDE.md) - Primary AI assistant configuration
- **PRD:** [/PRODUCT_REQUIREMENTS_DOCUMENT.md](/PRODUCT_REQUIREMENTS_DOCUMENT.md) - Product requirements
- **VALUE_STREAMS:** [/VALUE_STREAMS.md](/VALUE_STREAMS.md) - Business value streams
- **Jira Automation Skill:** [.claude/skills/jira-automation/SKILL.md](../jira-automation/SKILL.md)

---

## Support

**Questions or Issues:**
- Check [IMPACT_ANALYSIS.md](IMPACT_ANALYSIS.md) for understanding what changes
- Review example output in this document
- Test with `--scope analysis` first before making changes
- Report issues in project repository

---

**Document Status:**
- **Created:** January 5, 2026
- **Status:** Active
- **Maintained By:** Development Team
