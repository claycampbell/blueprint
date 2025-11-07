# GitHub Project Setup Guide - Connect 2.0

**Version:** 1.0
**Created:** November 6, 2025
**Purpose:** Step-by-step instructions for setting up GitHub Issues and Projects v2 for Connect 2.0 backlog management
**Audience:** Engineering Leads, Scrum Masters, DevOps

---

## Table of Contents

1. [GitHub Organization Setup](#1-github-organization-setup)
2. [Repository Labels](#2-repository-labels)
3. [GitHub Milestones](#3-github-milestones)
4. [Issue Templates](#4-issue-templates)
5. [Creating Issues from Backlog](#5-creating-issues-from-backlog)
6. [GitHub Project Board Setup](#6-github-project-board-setup)
7. [Automation Rules](#7-automation-rules)
8. [Bulk Import Script](#8-bulk-import-script)
9. [Project Views](#9-project-views)
10. [Backlog Grooming Process](#10-backlog-grooming-process)
11. [Example: Import Epic E4](#11-example-import-epic-e4)
12. [Appendix: Complete Epic List](#appendix-complete-epic-list)

---

## 1. GitHub Organization Setup

### Option A: Create New Organization

1. **Navigate to GitHub:**
   - Go to https://github.com/organizations/plan
   - Select "Create a free organization"

2. **Organization Details:**
   - **Name:** `datapage-platform` (or your preferred name)
   - **Contact email:** Engineering lead's email
   - **Belongs to:** My personal account (or company account)

3. **Invite Team Members:**
   - Navigate to: Organization → People → Invite member
   - Add team members with appropriate roles:
     - **Owners:** Engineering Lead, Product Manager (2-3 people max)
     - **Members:** All developers, designers, QA
     - **Outside Collaborators:** External consultants (if any)

### Option B: Use Existing Organization

1. **Verify Permissions:**
   - Ensure you have Owner or Admin role
   - Navigate to: Organization → Settings → Member privileges

2. **Create Repository:**
   - Organization → Repositories → New repository
   - Name: `connect-2.0`
   - Visibility: Private (recommended for proprietary platform)
   - Initialize with README: Yes
   - Add .gitignore: Node (or your chosen stack)
   - License: None (proprietary) or MIT/Apache (if open-sourcing)

---

## 2. Repository Labels

GitHub labels provide visual organization and filtering. Create a comprehensive taxonomy aligned with your backlog structure.

### 2.1 Create Label Categories

Navigate to: **Repository → Issues → Labels → New Label**

### Epic Labels (Color: `#0052CC` - Blue)

```
epic:E1  - Foundation & Setup
epic:E2  - Core Data Model
epic:E3  - Authentication & Authorization
epic:E4  - Lead & Project Management
epic:E5  - Feasibility Module
epic:E6  - Entitlement & Design
epic:E7  - Document Management
epic:E8  - Task Management
epic:E9  - Lending Module
epic:E10 - Servicing Module
epic:E11 - Contact Management
epic:E12 - BPO Integration
epic:E13 - External Integrations
epic:E14 - Analytics & Reporting
epic:E15 - DevOps & Infrastructure
```

### Priority Labels (Color Gradient)

```
priority:P0 - #D73A4A (Red)        - Blocker: Prevents MVP launch
priority:P1 - #FF9900 (Orange)     - Critical: Core functionality required
priority:P2 - #FBCA04 (Yellow)     - Important: Enhances experience
priority:P3 - #0E8A16 (Green)      - Nice-to-have: Post-MVP
```

### Team Labels (Color: `#5319E7` - Purple variations)

```
team:backend    - #5319E7 (Purple)
team:frontend   - #1D76DB (Cyan)
team:fullstack  - #8B5CF6 (Violet)
team:devops     - #78350F (Brown)
team:design     - #EC4899 (Pink)
team:qa         - #10B981 (Emerald)
```

### Phase Labels (Color: `#006B75` - Teal)

```
phase:pre-mvp   - Days 1-30: Foundation
phase:1         - Days 1-90: Design & Entitlement Pilot
phase:2         - Days 91-180: Full Platform Rebuild
phase:post-mvp  - Days 180+: Enhancements
```

### Status Labels (Color: varies)

```
status:ready        - #0E8A16 (Green)     - Ready for sprint planning
status:blocked      - #D73A4A (Red)       - Blocked by dependency
status:in-review    - #FBCA04 (Yellow)    - PR open, awaiting review
status:needs-info   - #D876E3 (Purple)    - Requires clarification
status:wont-fix     - #6E7681 (Gray)      - Closed without action
```

### Type Labels (Color: varies)

```
type:bug            - #D73A4A (Red)
type:feature        - #0075CA (Blue)
type:task           - #6E7681 (Gray)
type:documentation  - #FFFFFF (White with border)
type:refactor       - #FBCA04 (Yellow)
type:spike          - #D876E3 (Purple)  - Research/investigation
```

### 2.2 Quick Label Creation Script

Use GitHub CLI to create labels in bulk:

```bash
# Install GitHub CLI: https://cli.github.com/

# Authenticate
gh auth login

# Navigate to your repository
cd /path/to/connect-2.0

# Create Epic labels
for i in {1..15}; do
  gh label create "epic:E$i" --color "0052CC" --description "Epic E$i tasks"
done

# Create Priority labels
gh label create "priority:P0" --color "D73A4A" --description "Blocker: Prevents MVP launch"
gh label create "priority:P1" --color "FF9900" --description "Critical: Core functionality"
gh label create "priority:P2" --color "FBCA04" --description "Important: Enhances experience"
gh label create "priority:P3" --color "0E8A16" --description "Nice-to-have: Post-MVP"

# Create Team labels
gh label create "team:backend" --color "5319E7" --description "Backend engineering tasks"
gh label create "team:frontend" --color "1D76DB" --description "Frontend engineering tasks"
gh label create "team:fullstack" --color "8B5CF6" --description "Full-stack tasks"
gh label create "team:devops" --color "78350F" --description "DevOps and infrastructure"
gh label create "team:design" --color "EC4899" --description "UX/UI design tasks"
gh label create "team:qa" --color "10B981" --description "QA and testing tasks"

# Create Phase labels
gh label create "phase:pre-mvp" --color "006B75" --description "Days 1-30: Foundation"
gh label create "phase:1" --color "006B75" --description "Days 1-90: Pilot"
gh label create "phase:2" --color "006B75" --description "Days 91-180: Full rebuild"
gh label create "phase:post-mvp" --color "006B75" --description "Post-MVP enhancements"

# Create Status labels
gh label create "status:ready" --color "0E8A16" --description "Ready for sprint planning"
gh label create "status:blocked" --color "D73A4A" --description "Blocked by dependency"
gh label create "status:in-review" --color "FBCA04" --description "PR in review"
gh label create "status:needs-info" --color "D876E3" --description "Needs clarification"

# Create Type labels
gh label create "type:bug" --color "D73A4A" --description "Bug fix"
gh label create "type:feature" --color "0075CA" --description "New feature"
gh label create "type:task" --color "6E7681" --description "Development task"
gh label create "type:documentation" --color "FFFFFF" --description "Documentation update"
gh label create "type:refactor" --color "FBCA04" --description "Code refactoring"
gh label create "type:spike" --color "D876E3" --description "Research/investigation"
```

---

## 3. GitHub Milestones

Milestones align with decision gates and phase boundaries defined in the PRD.

### 3.1 Create Milestones

Navigate to: **Repository → Issues → Milestones → New Milestone**

### Phase 1 Milestones (Days 1-90)

| Milestone Name | Due Date | Description |
|----------------|----------|-------------|
| **Day 7: Tech Stack Finalized** | [Calculate: Program Start + 7 days] | All technology decisions made (E1 complete) |
| **Day 14: Integration Approach** | [Program Start + 14 days] | BPO integration method decided (E12 gate) |
| **Day 30: Foundation Complete** | [Program Start + 30 days] | Core data model, auth, infra complete (E2, E3, E15) |
| **Day 60: Core Modules Built** | [Program Start + 60 days] | E4, E5, E6, E7 feature-complete |
| **Day 90: Phase 1 Launch** | [Program Start + 90 days] | Pilot launch - Design & Entitlement module live |

### Phase 2 Milestones (Days 91-180)

| Milestone Name | Due Date | Description |
|----------------|----------|-------------|
| **Day 120: Lending Module** | [Program Start + 120 days] | E9 complete - Loan origination live |
| **Day 150: Servicing Module** | [Program Start + 150 days] | E10 complete - Draw management live |
| **Day 180: MVP Launch** | [Program Start + 180 days] | Full platform launch, BPO deprecated |

### 3.2 Example: Create Milestone via CLI

```bash
# Day 7: Tech Stack Finalized
gh api repos/:owner/:repo/milestones \
  -f title='Day 7: Tech Stack Finalized' \
  -f description='All technology stack decisions made (E1 complete)' \
  -f due_on='2025-11-13T23:59:59Z'  # Adjust date

# Day 30: Foundation Complete
gh api repos/:owner/:repo/milestones \
  -f title='Day 30: Foundation Complete' \
  -f description='Core data model, authentication, and infrastructure complete' \
  -f due_on='2025-12-06T23:59:59Z'  # Adjust date

# Day 90: Phase 1 Launch
gh api repos/:owner/:repo/milestones \
  -f title='Day 90: Phase 1 Launch' \
  -f description='Pilot launch - Design & Entitlement module live' \
  -f due_on='2026-02-04T23:59:59Z'  # Adjust date
```

---

## 4. Issue Templates

Issue templates ensure consistency when creating tasks from the backlog.

### 4.1 Create Template Directory

```bash
# In your repository root
mkdir -p .github/ISSUE_TEMPLATE
```

### 4.2 Task Template

**File:** `.github/ISSUE_TEMPLATE/task.md`

```markdown
---
name: Development Task
about: Create a development task from the backlog
title: '[EPIC-T#] Task Title'
labels: 'type:task'
assignees: ''
---

## Epic
**Epic ID:** E# - Epic Name

## Parent User Story
**User Story:** E#-US# (if applicable)
**Link:** #[issue number]

## Description
[Clear description of what needs to be done]

## Technical Reference
- **Document:** [e.g., DATABASE_SCHEMA.md lines 129-172]
- **API Spec:** [e.g., API_SPECIFICATION.md lines 234-276]
- **Related Files:** [e.g., src/modules/projects/]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Story Points
**Estimate:** [#] points

## Priority
**Priority Level:** P0/P1/P2/P3

## Dependencies
**Blocked By:**
- [ ] #[Issue number] - [Task name]

**Blocks:**
- [ ] #[Issue number] - [Task name]

## Definition of Done
- [ ] Code complete and passes linting
- [ ] Unit tests written and passing (≥80% coverage)
- [ ] Integration tests passing (if applicable)
- [ ] Code reviewed and approved (2 reviewers required)
- [ ] Documentation updated (inline comments + README if needed)
- [ ] Merged to `main` branch
- [ ] Deployed to staging environment

## Technical Notes
[Any additional context, implementation notes, or edge cases]
```

### 4.3 Bug Template

**File:** `.github/ISSUE_TEMPLATE/bug.md`

```markdown
---
name: Bug Report
about: Report a defect or unexpected behavior
title: '[BUG] Brief description'
labels: 'type:bug'
assignees: ''
---

## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[If applicable, add screenshots]

## Environment
- **Browser:** [e.g., Chrome 118, Safari 17]
- **OS:** [e.g., macOS Sonoma, Windows 11]
- **Environment:** [e.g., Production, Staging, Local]
- **User Role:** [e.g., Acquisitions Specialist, Admin]

## Severity
**Priority:** P0/P1/P2/P3

## Additional Context
[Any other relevant information]
```

### 4.4 Feature Request Template

**File:** `.github/ISSUE_TEMPLATE/feature.md`

```markdown
---
name: Feature Request
about: Suggest a new feature or enhancement
title: '[FEATURE] Brief description'
labels: 'type:feature'
assignees: ''
---

## Feature Description
[Clear description of the proposed feature]

## User Story
**As a** [user role]
**I need to** [action/capability]
**So that** [business value/outcome]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Business Value
[Why is this feature important? What problem does it solve?]

## Proposed Solution
[Optional: How you envision this working]

## Alternatives Considered
[Optional: Other approaches considered]

## Priority
**Suggested Priority:** P0/P1/P2/P3

## Phase
**Target Phase:** Phase 1 / Phase 2 / Post-MVP
```

---

## 5. Creating Issues from Backlog

Step-by-step walkthrough for converting backlog tasks into GitHub issues.

### 5.1 Example: Create Issue from E4-T1

**Source:** `EPIC_E4_LEAD_PROJECT_MANAGEMENT.md`, lines 37-39

```
| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E4-T1 | Create `projects` database table | DATABASE_SCHEMA.md lines 129-172 | 3 | P0 | E2 (Core Data Model) |
```

**Step-by-Step:**

1. **Navigate to Issues**
   - Go to: Repository → Issues → New Issue
   - Select: "Development Task" template

2. **Fill in Title**
   ```
   [E4-T1] Create projects database table
   ```

3. **Fill in Description Fields**

   ```markdown
   ## Epic
   **Epic ID:** E4 - Lead & Project Management

   ## Description
   Create the `projects` database table with all required columns as specified in the database schema document. This table serves as the foundation for all project-related workflows including lead intake, feasibility, entitlement, and lending.

   ## Technical Reference
   - **Document:** DATABASE_SCHEMA.md lines 129-172
   - **Related Files:**
     - `migrations/001_create_projects_table.sql` (to be created)
     - `src/models/Project.js` (to be created)

   ## Acceptance Criteria
   - [ ] Migration file created following naming convention
   - [ ] Projects table created with all columns from schema
   - [ ] Foreign key constraints added (assigned_to_user_id, builder_id)
   - [ ] Indexes created on status, city, created_at
   - [ ] Enum types created for status values
   - [ ] Migration successfully runs on local PostgreSQL
   - [ ] Rollback migration tested and working

   ## Story Points
   **Estimate:** 3 points

   ## Priority
   **Priority Level:** P0

   ## Dependencies
   **Blocked By:**
   - [ ] #[E2 issue number] - Core Data Model Setup Complete

   ## Definition of Done
   - [ ] Migration file reviewed and approved
   - [ ] Migration runs successfully on dev/staging
   - [ ] Database schema documentation updated
   - [ ] ORM model created and tested
   ```

4. **Assign Labels**
   - `epic:E4`
   - `priority:P0`
   - `team:backend`
   - `phase:pre-mvp`
   - `type:task`

5. **Assign Milestone**
   - Select: "Day 30: Foundation Complete"

6. **Assign Team Member**
   - Leave blank initially (assign during sprint planning)
   - Or assign to: Backend Lead for triage

7. **Click "Create Issue"**

### 5.2 Example: Create Issue from E5-T13 (Complex Task)

**Source:** `EPIC_E5_FEASIBILITY_MODULE.md`, lines 96

```
| E5-T13 | Implement POST `/projects/{id}/feasibility/order-reports` | API lines 438-483 | 5 | P0 | E5-T1, E8 |
```

**Issue Content:**

```markdown
## Epic
**Epic ID:** E5 - Feasibility Module

## Parent User Story
**User Story:** E5-US2 - Consultant Report Ordering
**Link:** #[parent user story issue number]

## Description
Implement the API endpoint that allows acquisitions specialists to order consultant reports (survey, title, arborist, geotechnical) for a project. This endpoint creates task records for each selected report type and assigns them to the appropriate consultants.

## Technical Reference
- **Document:** API_SPECIFICATION.md lines 438-483
- **Related Files:**
  - `src/routes/feasibility.js`
  - `src/controllers/feasibilityController.js`
  - `src/services/reportOrderingService.js`
  - `src/models/Task.js` (from E8)

## Acceptance Criteria
- [ ] POST endpoint accepts project ID and report selection payload
- [ ] Validates project exists and user has permission
- [ ] Validates feasibility record exists for project
- [ ] Creates one task per selected report type
- [ ] Assigns tasks to correct consultant contacts
- [ ] Sets due dates based on report type SLA
- [ ] Returns created task IDs and confirmation
- [ ] Triggers email notifications to consultants (optional for MVP)
- [ ] Handles errors gracefully (project not found, consultant not assigned)

## Story Points
**Estimate:** 5 points

## Priority
**Priority Level:** P0

## Dependencies
**Blocked By:**
- [ ] #[E5-T1] - Create feasibility database table
- [ ] #[E8-T1] - Create tasks database table
- [ ] #[E8-T4] - Implement task creation service
- [ ] #[E11 issue] - Contact management API (for consultant lookup)

**Blocks:**
- [ ] #[E5-T18] - Build report tracking dashboard

## Definition of Done
- [ ] Endpoint implemented following API spec
- [ ] OpenAPI/Swagger documentation updated
- [ ] Unit tests cover all business logic paths
- [ ] Integration tests verify task creation
- [ ] Error handling tested (404, 403, 400 scenarios)
- [ ] Postman collection updated with example request
- [ ] Code reviewed and approved (2 reviewers)
- [ ] Merged to main

## Technical Notes
**Business Logic:**
- Default SLA: Survey (7 days), Title (5 days), Arborist (14 days), Geotech (21 days)
- Consultant assignment: Look up contact by type (contact_type = 'CONSULTANT')
- Task priority: All consultant tasks default to P1
- Idempotency: Prevent duplicate task creation if endpoint called twice
```

---

## 6. GitHub Project Board Setup

GitHub Projects v2 provides a powerful Kanban-style board with custom fields and automation.

### 6.1 Create New Project

1. **Navigate to Projects**
   - Organization → Projects → New Project
   - Or: Repository → Projects → Link a project → New project

2. **Project Details**
   - **Name:** Connect 2.0 Development
   - **Description:** Backlog and sprint management for Connect 2.0 platform rebuild
   - **Template:** Board (classic Kanban)
   - **Visibility:** Private (visible to organization members only)

3. **Click "Create Project"**

### 6.2 Configure Board Columns

Rename and configure default columns to match your workflow.

**Recommended Columns:**

| Column Name | Description | Auto-movement Rule |
|-------------|-------------|-------------------|
| **Backlog** | All ungroomed issues | New issues auto-added |
| **Ready** | Groomed and ready for sprint planning | Manually moved |
| **Sprint Backlog** | Committed for current sprint | Manually moved |
| **In Progress** | Actively being worked | Moved when assigned + status changed |
| **In Review** | PR open, awaiting code review | Auto-moved when PR opened |
| **Done** | Merged to main, deployed | Auto-moved when PR merged |
| **Blocked** | Blocked by dependencies | Manually moved + `status:blocked` label |

**ASCII Diagram:**

```
┌──────────┐   ┌───────┐   ┌───────────────┐   ┌────────────┐   ┌───────────┐   ┌──────┐
│ Backlog  │──▶│ Ready │──▶│ Sprint Backlog│──▶│In Progress │──▶│ In Review │──▶│ Done │
└──────────┘   └───────┘   └───────────────┘   └────────────┘   └───────────┘   └──────┘
                                                       │               │
                                                       ▼               │
                                                  ┌──────────┐         │
                                                  │ Blocked  │◀────────┘
                                                  └──────────┘
```

### 6.3 Add Custom Fields

Custom fields provide metadata for filtering and reporting.

**Navigate to:** Project → Settings (⚙️) → Fields

| Field Name | Type | Options |
|------------|------|---------|
| **Story Points** | Number | Min: 0, Max: 21 |
| **Epic** | Single Select | E1, E2, E3, ..., E15 |
| **Priority** | Single Select | P0, P1, P2, P3 |
| **Sprint** | Single Select | Sprint 1, Sprint 2, ..., Sprint 20 |
| **Team** | Single Select | Backend, Frontend, Full-stack, DevOps, Design, QA |
| **Phase** | Single Select | Pre-MVP, Phase 1, Phase 2, Post-MVP |
| **Blocked Reason** | Text | Free-form field for blocked items |

**Example: Create "Story Points" Field**

1. Click "+ New Field"
2. Field name: `Story Points`
3. Field type: Number
4. Save

**Example: Create "Epic" Field**

1. Click "+ New Field"
2. Field name: `Epic`
3. Field type: Single select
4. Options:
   ```
   E1 - Foundation & Setup
   E2 - Core Data Model
   E3 - Authentication & Authorization
   E4 - Lead & Project Management
   E5 - Feasibility Module
   E6 - Entitlement & Design
   E7 - Document Management
   E8 - Task Management
   E9 - Lending Module
   E10 - Servicing Module
   E11 - Contact Management
   E12 - BPO Integration
   E13 - External Integrations
   E14 - Analytics & Reporting
   E15 - DevOps & Infrastructure
   ```
5. Save

### 6.4 Add Issues to Project

**Option 1: Add Manually**
1. Project board → Click "+"
2. Search for issue by number or title
3. Select issue to add

**Option 2: Auto-add via Automation**
1. Project → Settings → Workflows
2. Enable: "Auto-add to project"
3. Configure: Add items when they match filters
   - Repository: `your-org/connect-2.0`
   - Labels: All issues (or filter by specific labels)

---

## 7. Automation Rules

GitHub Projects supports built-in workflows to reduce manual work.

### 7.1 Enable Built-in Workflows

**Navigate to:** Project → Settings (⚙️) → Workflows

### Workflow 1: Auto-add Issues

**Purpose:** Automatically add new issues to the Backlog column.

**Configuration:**
- **Trigger:** Item added to project
- **Action:** Set status to "Backlog"
- **Filters:**
  - Repository: `your-org/connect-2.0`
  - Type: Issue

### Workflow 2: Move to In Progress

**Purpose:** Move issue to "In Progress" when assigned.

**Configuration:**
- **Trigger:** Issue assigned
- **Action:** Set status to "In Progress"

### Workflow 3: Move to In Review

**Purpose:** Move issue to "In Review" when PR is opened.

**Configuration:**
- **Trigger:** Pull request opened
- **Action:** Set status to "In Review"
- **Condition:** PR is linked to issue

### Workflow 4: Move to Done

**Purpose:** Move issue to "Done" when PR is merged.

**Configuration:**
- **Trigger:** Pull request merged
- **Action:** Set status to "Done"
- **Additional:** Close linked issue

### Workflow 5: Flag Blocked Items

**Purpose:** Add comment when issue is labeled "status:blocked".

**Configuration:**
- **Trigger:** Label added = "status:blocked"
- **Action:** Add comment:
  ```
  ⚠️ This issue has been marked as blocked.

  Please:
  1. Update the "Blocked Reason" field
  2. Tag the blocking issue using #[issue number]
  3. Notify the team in #engineering Slack channel
  ```

### 7.2 Advanced Automation (GitHub Actions)

For more complex automation, use GitHub Actions.

**Example:** `.github/workflows/project-automation.yml`

```yaml
name: Project Automation

on:
  issues:
    types: [opened, labeled]
  pull_request:
    types: [opened, closed]

jobs:
  update-project:
    runs-on: ubuntu-latest
    steps:
      - name: Add issue to project
        if: github.event_name == 'issues' && github.event.action == 'opened'
        uses: actions/add-to-project@v0.4.0
        with:
          project-url: https://github.com/orgs/your-org/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Set epic field from label
        if: contains(github.event.issue.labels.*.name, 'epic:')
        run: |
          # Extract epic label (e.g., epic:E4 -> E4)
          EPIC=$(echo "${{ github.event.issue.labels }}" | grep -oP 'epic:\K\w+')
          # Use GitHub API to set custom field
          gh api graphql -f query='...' # (GraphQL query to update field)
```

---

## 8. Bulk Import Script

Manually creating 800+ issues is impractical. Use scripts to bulk import from backlog markdown files.

### 8.1 Prerequisites

1. **Install GitHub CLI:**
   ```bash
   # macOS
   brew install gh

   # Windows (using winget)
   winget install GitHub.cli

   # Linux
   sudo apt install gh  # Debian/Ubuntu
   ```

2. **Authenticate:**
   ```bash
   gh auth login
   ```

3. **Clone Repository:**
   ```bash
   git clone https://github.com/your-org/connect-2.0.git
   cd connect-2.0
   ```

### 8.2 Import Script (Bash)

**File:** `scripts/import_backlog.sh`

```bash
#!/bin/bash

# Import backlog tasks from markdown to GitHub Issues
# Usage: ./scripts/import_backlog.sh EPIC_E4_LEAD_PROJECT_MANAGEMENT.md

set -e

BACKLOG_FILE=$1
REPO="your-org/connect-2.0"  # Update with your repo

if [ -z "$BACKLOG_FILE" ]; then
  echo "Usage: ./import_backlog.sh <backlog_file.md>"
  exit 1
fi

# Parse markdown and extract task table rows
# This is a simplified example - you'll need to customize based on your markdown structure

grep -E "^\| E[0-9]+-T[0-9]+ \|" "$BACKLOG_FILE" | while IFS='|' read -r _ task_id description tech_ref points priority deps _; do
  # Clean up whitespace
  task_id=$(echo "$task_id" | xargs)
  description=$(echo "$description" | xargs)
  tech_ref=$(echo "$tech_ref" | xargs)
  points=$(echo "$points" | xargs)
  priority=$(echo "$priority" | xargs)
  deps=$(echo "$deps" | xargs)

  # Extract epic from task_id (e.g., E4-T1 -> E4)
  epic=$(echo "$task_id" | cut -d'-' -f1)

  # Determine team based on tech_ref (heuristic)
  team="team:backend"
  if [[ "$tech_ref" =~ "UI"|"Frontend"|"Component" ]]; then
    team="team:frontend"
  fi

  # Create issue
  gh issue create \
    --repo "$REPO" \
    --title "[$task_id] $description" \
    --label "epic:$epic,priority:$priority,$team,type:task,phase:1" \
    --milestone "Day 30: Foundation Complete" \
    --body "$(cat <<EOF
## Epic
**Epic ID:** $epic

## Description
$description

## Technical Reference
- **Document:** $tech_ref

## Acceptance Criteria
- [ ] Implementation complete
- [ ] Tests written and passing
- [ ] Code reviewed

## Story Points
**Estimate:** $points points

## Priority
**Priority Level:** $priority

## Dependencies
**Blocked By:** $deps

## Definition of Done
- [ ] Code complete and reviewed
- [ ] Unit tests passing
- [ ] Documentation updated
- [ ] Merged to main
EOF
)"

  echo "Created issue: [$task_id] $description"
  sleep 1  # Rate limiting
done

echo "Import complete!"
```

### 8.3 Import Script (Python)

For more robust parsing, use Python.

**File:** `scripts/import_backlog.py`

```python
#!/usr/bin/env python3
"""
Import backlog tasks from markdown to GitHub Issues using GitHub CLI.
Usage: python scripts/import_backlog.py docs/planning/backlogs/EPIC_E4_LEAD_PROJECT_MANAGEMENT.md
"""

import re
import subprocess
import sys
import time

def parse_task_table(markdown_file):
    """Extract tasks from markdown table."""
    tasks = []

    with open(markdown_file, 'r') as f:
        content = f.read()

    # Regex to match task table rows
    # Example: | E4-T1 | Create `projects` database table | DATABASE_SCHEMA.md lines 129-172 | 3 | P0 | E2 (Core Data Model) |
    pattern = r'\|\s*(E\d+-T\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(\d+)\s*\|\s*(P\d)\s*\|\s*([^|]*)\s*\|'

    matches = re.findall(pattern, content)

    for match in matches:
        task = {
            'id': match[0].strip(),
            'description': match[1].strip(),
            'tech_ref': match[2].strip(),
            'points': match[3].strip(),
            'priority': match[4].strip(),
            'dependencies': match[5].strip()
        }
        tasks.append(task)

    return tasks

def determine_team(tech_ref, description):
    """Heuristic to determine team based on task content."""
    text = (tech_ref + ' ' + description).lower()

    if any(word in text for word in ['ui', 'component', 'frontend', 'react', 'vue']):
        return 'team:frontend'
    elif any(word in text for word in ['database', 'migration', 'api', 'backend']):
        return 'team:backend'
    elif any(word in text for word in ['docker', 'ci/cd', 'deployment', 'infrastructure']):
        return 'team:devops'
    elif any(word in text for word in ['test', 'e2e', 'integration test']):
        return 'team:qa'
    else:
        return 'team:fullstack'

def create_issue(task, repo, milestone='Day 30: Foundation Complete'):
    """Create GitHub issue using gh CLI."""

    epic = task['id'].split('-')[0]  # E4-T1 -> E4
    team = determine_team(task['tech_ref'], task['description'])

    title = f"[{task['id']}] {task['description']}"

    body = f"""## Epic
**Epic ID:** {epic}

## Description
{task['description']}

## Technical Reference
- **Document:** {task['tech_ref']}

## Acceptance Criteria
- [ ] Implementation complete
- [ ] Tests written and passing
- [ ] Code reviewed

## Story Points
**Estimate:** {task['points']} points

## Priority
**Priority Level:** {task['priority']}

## Dependencies
**Blocked By:** {task['dependencies']}

## Definition of Done
- [ ] Code complete and reviewed (2 approvals)
- [ ] Unit tests written and passing (≥80% coverage)
- [ ] Documentation updated
- [ ] Merged to main
"""

    labels = f"epic:{epic},priority:{task['priority']},{team},type:task,phase:1"

    cmd = [
        'gh', 'issue', 'create',
        '--repo', repo,
        '--title', title,
        '--body', body,
        '--label', labels,
        '--milestone', milestone
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"✅ Created: {title}")
        print(f"   URL: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to create: {title}")
        print(f"   Error: {e.stderr}")
        return False

def main():
    if len(sys.argv) != 2:
        print("Usage: python import_backlog.py <backlog_file.md>")
        sys.exit(1)

    markdown_file = sys.argv[1]
    repo = "your-org/connect-2.0"  # UPDATE THIS

    print(f"Parsing {markdown_file}...")
    tasks = parse_task_table(markdown_file)
    print(f"Found {len(tasks)} tasks\n")

    for i, task in enumerate(tasks, 1):
        print(f"[{i}/{len(tasks)}] Creating issue for {task['id']}...")
        create_issue(task, repo)
        time.sleep(1)  # Rate limiting: 1 second between requests

    print(f"\n✅ Import complete! Created {len(tasks)} issues.")

if __name__ == '__main__':
    main()
```

### 8.4 Usage Example

```bash
# Make script executable
chmod +x scripts/import_backlog.py

# Import Epic E4
python scripts/import_backlog.py docs/planning/backlogs/EPIC_E4_LEAD_PROJECT_MANAGEMENT.md

# Import Epic E5
python scripts/import_backlog.py docs/planning/backlogs/EPIC_E5_FEASIBILITY_MODULE.md

# Import all epics
for epic in docs/planning/backlogs/EPIC_*.md; do
  python scripts/import_backlog.py "$epic"
  sleep 5  # Pause between epics
done
```

---

## 9. Project Views

GitHub Projects v2 supports multiple views for different perspectives.

### 9.1 Default Views to Create

#### View 1: Sprint Board (Kanban)

**Purpose:** Current sprint progress

**Configuration:**
- **Layout:** Board
- **Group by:** Status
- **Filter:** Sprint = "Sprint [current]"
- **Sort:** Priority (P0 → P3)

#### View 2: Backlog (Table)

**Purpose:** Grooming and sprint planning

**Configuration:**
- **Layout:** Table
- **Columns:** Title, Epic, Priority, Story Points, Team, Dependencies
- **Filter:** Status = "Backlog" OR "Ready"
- **Sort:** Priority (P0 first), then Story Points (ascending)

#### View 3: By Epic (Board)

**Purpose:** See progress across all epics

**Configuration:**
- **Layout:** Board
- **Group by:** Epic
- **Filter:** Phase = "Phase 1"
- **Sort:** Status (In Progress → Backlog)

#### View 4: By Team (Board)

**Purpose:** Team workload balancing

**Configuration:**
- **Layout:** Board
- **Group by:** Team
- **Filter:** Status = "In Progress" OR "Sprint Backlog"
- **Sort:** Priority

#### View 5: Blocked Items (Table)

**Purpose:** Identify and resolve blockers

**Configuration:**
- **Layout:** Table
- **Columns:** Title, Blocked Reason, Dependencies, Assignee, Created Date
- **Filter:** Status = "Blocked"
- **Sort:** Created Date (oldest first)

#### View 6: Completed Work (Table)

**Purpose:** Sprint review and velocity tracking

**Configuration:**
- **Layout:** Table
- **Columns:** Title, Epic, Story Points, Completed Date, Assignee
- **Filter:** Status = "Done", Sprint = "Sprint [current]"
- **Sort:** Completed Date (newest first)

### 9.2 Custom Filters

**High Priority Items:**
```
priority:P0 OR priority:P1
status:Backlog OR status:Ready
```

**Frontend Work Ready:**
```
team:frontend
status:Ready
no:assignee
```

**Overdue Items:**
```
milestone:<"Day 30: Foundation Complete"
-status:Done
```

---

## 10. Backlog Grooming Process

Establish a regular grooming cadence to keep the backlog healthy.

### 10.1 Weekly Backlog Grooming (1 hour)

**Attendees:** Product Manager, Engineering Lead, Scrum Master, Senior Engineers

**Agenda:**

1. **Review New Issues (10 min)**
   - Triage ungroomed issues in "Backlog" column
   - Add missing labels, epic tags, technical references
   - Clarify unclear descriptions

2. **Estimate Story Points (20 min)**
   - Use Planning Poker for un-estimated tasks
   - Focus on top 20 priority items
   - Break down 13+ point tasks into smaller chunks

3. **Clarify Acceptance Criteria (15 min)**
   - Ensure each task has clear, testable criteria
   - Add technical notes for complex tasks
   - Identify open questions and assign owners

4. **Identify Dependencies (10 min)**
   - Link blocking/blocked tasks
   - Update "Blocked By" and "Blocks" sections
   - Flag critical path items

5. **Move Ready Items (5 min)**
   - Move fully groomed tasks to "Ready" column
   - Sequence tasks based on dependencies
   - Flag any blockers for immediate resolution

### 10.2 Grooming Checklist

Use this checklist for each task:

- [ ] **Title** is clear and follows `[EPIC-T#] Description` format
- [ ] **Epic label** is assigned (e.g., `epic:E4`)
- [ ] **Priority label** is assigned (P0/P1/P2/P3)
- [ ] **Team label** is assigned (backend/frontend/etc.)
- [ ] **Phase label** is assigned (phase:1, phase:2)
- [ ] **Story points** are estimated
- [ ] **Acceptance criteria** are clear and testable (3-5 criteria)
- [ ] **Technical reference** links to spec docs
- [ ] **Dependencies** are identified and linked
- [ ] **Milestone** is assigned (if applicable)
- [ ] **Definition of Done** is complete

### 10.3 Archive Completed Work

**Cadence:** Every 2 sprints

**Process:**
1. Filter: Status = "Done", Updated < 30 days ago
2. Verify all tasks are truly complete (merged, deployed)
3. Archive completed issues (or close if already closed)
4. Update velocity metrics in project README

---

## 11. Example: Import Epic E4

Let's walk through importing all 40 tasks from **Epic E4: Lead & Project Management**.

### Step 1: Review Epic Document

**File:** `docs/planning/backlogs/EPIC_E4_LEAD_PROJECT_MANAGEMENT.md`

**Summary:**
- **Total Tasks:** 40 tasks
- **Story Points:** 114 points (full), 88 points (MVP core)
- **Features:**
  - F1: Lead Intake (26 points, 9 tasks)
  - F2: Project List & Filtering (20 points, 7 tasks)
  - F3: Project Detail View (21 points, 7 tasks)
  - F4: Status Transitions (21 points, 7 tasks)
  - F5: Project Assignment (12 points, 5 tasks)
  - F6: Project Search (14 points, 5 tasks)

### Step 2: Create Parent Epic Issue

**Manually create an Epic tracking issue:**

```bash
gh issue create \
  --repo your-org/connect-2.0 \
  --title "[E4] Epic: Lead & Project Management" \
  --label "epic:E4,type:epic,phase:1" \
  --milestone "Day 90: Phase 1 Launch" \
  --body "$(cat <<'EOF'
# Epic E4: Lead & Project Management

**Total Estimated Points:** 114 points (full scope) or 88 points (MVP core)
**Priority:** P0 (Blocker - Foundation for all workflows)
**Target Phase:** Days 1-90 (MVP Phase 1)

## Overview
This epic provides the foundation for managing leads and projects through the entire lifecycle:
- Lead intake → Feasibility → Go/Pass decision → Entitlement → Closing

## Features
- [x] F1: Lead Intake System (26 points)
- [ ] F2: Project List & Filtering (20 points)
- [ ] F3: Project Detail View (21 points)
- [ ] F4: Status Transitions (21 points)
- [ ] F5: Project Assignment (12 points)
- [ ] F6: Project Search (14 points)

## Dependencies
**Blocked By:**
- E2 (Core Data Model)
- E3 (Authentication)
- E11 (Contact Management)

**Blocks:**
- E5 (Feasibility Module)
- E6 (Entitlement Module)

## Reference
[EPIC_E4_LEAD_PROJECT_MANAGEMENT.md](docs/planning/backlogs/EPIC_E4_LEAD_PROJECT_MANAGEMENT.md)
EOF
)"
```

### Step 3: Run Import Script

```bash
# Using Python script
python scripts/import_backlog.py docs/planning/backlogs/EPIC_E4_LEAD_PROJECT_MANAGEMENT.md
```

**Expected Output:**

```
Parsing docs/planning/backlogs/EPIC_E4_LEAD_PROJECT_MANAGEMENT.md...
Found 40 tasks

[1/40] Creating issue for E4-T1...
✅ Created: [E4-T1] Create projects database table
   URL: https://github.com/your-org/connect-2.0/issues/42

[2/40] Creating issue for E4-T2...
✅ Created: [E4-T2] Implement POST /projects API
   URL: https://github.com/your-org/connect-2.0/issues/43

...

[40/40] Creating issue for E4-T40...
✅ Created: [E4-T40] E2E test: Search by address → View results
   URL: https://github.com/your-org/connect-2.0/issues/81

✅ Import complete! Created 40 issues.
```

### Step 4: Manually Link Dependencies

The script creates issues but doesn't auto-link dependencies. Do this manually or enhance the script.

**Example: Link E4-T2 dependencies**

1. Open issue #43 ([E4-T2] Implement POST /projects API)
2. Edit the "Blocked By" section:
   ```markdown
   **Blocked By:**
   - [ ] #42 - E4-T1: Create projects database table
   - [ ] #[E3 Auth issue] - Authentication middleware
   ```
3. GitHub will auto-detect and create issue relationships

### Step 5: Verify in Project Board

1. Navigate to: **Connect 2.0 Development** project
2. View: "By Epic"
3. Verify: All 40 tasks appear under "E4 - Lead & Project Management"
4. Check: Labels, milestones, story points populated correctly

### Step 6: Groom and Prioritize

1. Move critical path tasks to "Ready" column:
   - E4-T1, E4-T2, E4-T10 (foundation)
2. Assign to "Day 30" milestone:
   - E4-T1 through E4-T11 (database + API foundation)
3. Assign to "Day 60" milestone:
   - E4-T12 through E4-T30 (UI implementation)

---

## Appendix: Complete Epic List

Reference for all 15 epics and their scope.

| Epic ID | Epic Name | Story Points (Full) | Story Points (MVP) | Phase | Status |
|---------|-----------|---------------------|-------------------|-------|--------|
| **E1** | Foundation & Setup | 20 | 20 | Pre-MVP | Not broken down |
| **E2** | Core Data Model | 34 | 34 | Pre-MVP | Not broken down |
| **E3** | Authentication & Authorization | 38 | 38 | Pre-MVP | Not broken down |
| **E4** | Lead & Project Management | 114 | 88 | Phase 1 | ✅ Broken down |
| **E5** | Feasibility Module | 235 | 121 | Phase 1 | ✅ Broken down |
| **E6** | Entitlement & Design | 69 | 69 | Phase 1 | Partially broken down |
| **E7** | Document Management | 88 | 88 | Phase 1 | Partially broken down |
| **E8** | Task Management | 144 | 44 | Phase 1 | ✅ Broken down |
| **E9** | Lending Module | 85 | — | Phase 2 | Partially broken down |
| **E10** | Servicing Module | 89 | — | Phase 2 | Partially broken down |
| **E11** | Contact Management | 156 | 67 | Phase 1 | ✅ Broken down |
| **E12** | BPO Integration | 34 | 34 | Phase 1 | Partially broken down |
| **E13** | External Integrations | 56 | 56 | Phase 1 | Partially broken down |
| **E14** | Analytics & Reporting | 168 | 62 | Phase 2 | ✅ Broken down |
| **E15** | DevOps & Infrastructure | ~40 | ~40 | Ongoing | Not broken down |
| **TOTAL** | — | **~1,370** | **~761** | — | — |

**MVP Scope (Phase 1: Days 1-90):**
- E1, E2, E3 (Foundation): 92 points
- E4, E5, E6, E7, E8, E11, E12, E13 (Features): 669 points
- **Total Phase 1:** ~761 points

**Team Velocity Needed:**
- 761 points ÷ 90 days ≈ 8.5 points/day
- With 6 developers: ~1.4 points/dev/day (achievable with 2-week sprints)

---

## Quick Reference: GitHub CLI Commands

### Create Issue
```bash
gh issue create \
  --title "[E4-T1] Task title" \
  --body "Description" \
  --label "epic:E4,priority:P0" \
  --milestone "Day 30" \
  --assignee "@me"
```

### List Issues
```bash
# All open issues
gh issue list

# Filter by label
gh issue list --label "epic:E4,priority:P0"

# Filter by milestone
gh issue list --milestone "Day 30: Foundation Complete"
```

### Update Issue
```bash
# Add label
gh issue edit 42 --add-label "status:blocked"

# Change milestone
gh issue edit 42 --milestone "Day 60"

# Assign
gh issue edit 42 --add-assignee johndoe
```

### Bulk Operations
```bash
# Close all done issues
gh issue list --state open --label "status:done" --json number --jq '.[].number' | \
  xargs -I {} gh issue close {}

# Add label to all E4 issues
gh issue list --label "epic:E4" --json number --jq '.[].number' | \
  xargs -I {} gh issue edit {} --add-label "phase:1"
```

---

## Summary

You now have a complete GitHub Project setup for managing the Connect 2.0 backlog:

✅ **Organization/Repository** configured with team access
✅ **Labels** created (Epics, Priority, Teams, Status, Type)
✅ **Milestones** aligned with decision gates (Day 7, 30, 90, 180)
✅ **Issue Templates** for consistent task creation
✅ **Project Board** with Kanban columns and custom fields
✅ **Automation Rules** to reduce manual work
✅ **Import Scripts** to bulk-create issues from backlog
✅ **Views** for different perspectives (Sprint, Epic, Team, Blocked)
✅ **Grooming Process** to maintain backlog health

**Next Steps:**
1. **Review this guide** with engineering leadership
2. **Execute steps 1-3** (Organization, Labels, Milestones)
3. **Test import script** with one epic (E4 or E5)
4. **Bulk import** remaining epics
5. **Train team** on board usage and workflow
6. **Begin Sprint 1** with groomed backlog

**Questions?** Contact: Engineering Lead or Scrum Master

---

**Document Status:** Ready for Implementation
**Last Updated:** November 6, 2025
**Version:** 1.0
