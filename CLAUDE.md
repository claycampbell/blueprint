# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a **documentation repository** for the Blueprint/Connect 2.0 platform development project. It contains no application code—only strategic planning documents, requirements specifications, and project artifacts.

## Key Documents

### Primary Technical Specification
**[PRODUCT_REQUIREMENTS_DOCUMENT.md](PRODUCT_REQUIREMENTS_DOCUMENT.md)** - Comprehensive product requirements document consolidating:
- Product vision and business context
- Current state architecture (BPO, Connect 1.0, SharePoint) and pain points
- Target architecture and system design for Connect 2.0
- User personas and workflows
- Feature backlog organized by module (Lead Intake, Feasibility, Entitlement, Lending, Servicing)
- Technical specifications (API design, data model, integrations)
- Data migration strategy
- MVP phasing (Day 1-180 timeline)
- AI and automation opportunities

**Use this as the source of truth when:**
- Understanding system requirements for Connect 2.0
- Planning feature development sprints
- Designing APIs or data models
- Evaluating integration approaches
- Prioritizing backlog items

### Strategic Planning Documents
**Blueprint Workshop — Detailed Summary & Outcomes.txt** - Workshop outcomes from October 1, 2025:
- Blueprint's strategic direction and operating model
- Frontier firm concept and transformation approach
- User team structures (Acquisitions, Design & Entitlement, Servicing)
- Current workflow pain points and automation opportunities
- OGSM framework candidates (Objectives, Goals, Strategies, Measures)

**Datapage Platform Program — Project Charter.txt** - Official project charter defining:
- Three integrated tracks: Blueprint Transformation, Connect 2.0 Platform Rebuild, Datapage GTM Strategy
- 180-day phased delivery approach (two 90-day increments)
- Governance structure and decision gates
- Success criteria and key deliverables
- Program roles and responsibilities (PLT structure)

### Supporting Documents
- **Blueprint - Demo Notes.pdf** - Detailed walkthrough of current systems (Connect 1.0, BPO, SharePoint)
- **Blueprint_LOE.xlsx** - Level of effort estimates (spreadsheet format)

## Document Structure & Relationships

```
Strategic Planning Documents
├── Workshop Outcomes → Informed the program design
├── Project Charter → Formal program structure
└── PRD → Consolidated technical requirements

PRODUCT_REQUIREMENTS_DOCUMENT.md
├── Synthesizes all source documents
├── Adds technical depth (APIs, data models, integrations)
└── Provides actionable backlog for engineering
```

## Working with This Repository

### When Adding New Documentation
- **Place strategic/planning documents** in the root directory
- **Use descriptive filenames** that indicate content and date (e.g., "Workshop Summary - Nov 2025.txt")
- **Update the PRD** if new information affects technical requirements, architecture, or backlog
- **Maintain document lineage** - note which documents informed or superseded others

### When Updating the PRD
The PRD is the consolidated source of truth. When updating:

1. **Preserve section structure** - Don't reorganize the 10 main sections
2. **Update version and date** in the document header
3. **Add changelog entry** at the top documenting what changed and why
4. **Maintain consistency**:
   - Use the existing data model entity names (Project, Loan, Contact, etc.)
   - Keep API endpoint patterns consistent
   - Preserve the MVP phasing structure (Days 1-90, 91-180)
5. **Mark decisions** - When open questions are resolved (e.g., cloud provider choice), update the relevant section and note the decision

### Git Workflow and Pull Requests

**IMPORTANT:** All code changes must be committed to feature branches and merged via pull requests. Never commit directly to `main`.

#### Developer Workflow Rules

**MANDATORY PRACTICES - Read this before starting any task:**

1. **Always Start in Planning Mode**
   - Before writing any code, use the brainstorming/planning skill or process
   - Think through the approach, identify edge cases, and consider alternatives
   - Create a clear plan before implementation
   - Use `/superpowers:brainstorm` for design refinement when needed

2. **Create a New Branch for Every Task**
   - **NEVER** work directly on `main` or any shared branch
   - Create a new feature branch before beginning any new task or development work
   - Branch naming: `<name>/<feature-description>` (e.g., `clay/add-user-authentication`)
   - Even for small changes or bug fixes, use a feature branch

3. **Rebase Often**
   - **Before starting any new task**: Rebase your branch on latest `main`
   - **Before creating a PR**: Rebase to ensure clean integration
   - **When main has new commits**: Rebase your feature branch regularly
   - Command: `git checkout main && git pull && git checkout <your-branch> && git rebase main`

4. **Keep Pull Requests Small and Manageable**
   - **Target**: PRs should be reviewable in 15-30 minutes
   - **Ideal size**: < 400 lines of code changed (excluding generated code, tests, docs)
   - **Break large features** into multiple PRs with logical boundaries
   - **One concern per PR**: Don't mix refactoring with new features
   - **Benefits**: Faster reviews, easier debugging, reduced merge conflicts

5. **Always Tag co-pilot as Reviewer**
   - Every PR must tag `@co-pilot` as a reviewer
   - Wait for approval before merging (unless emergency hotfix)
   - Address review comments promptly
   - Use PR comments to explain complex decisions

6. **Developer Merges Their Own PRs**
   - **After approval**: The developer who created the PR is responsible for merging
   - **Merge method**: Use "Squash and merge" for clean git history
   - **After merge**: Immediately delete the feature branch
   - **Command**: `gh pr merge --squash --delete-branch`
   - **Verify**: Check that main branch is clean after merge

7. **Standard Task Workflow**
   ```
   Rebase → Plan → Create Branch → Implement → Test → Commit → Push → PR → Review → Merge → Delete Branch
   ```

**Example Complete Workflow:**
```bash
# 1. Sync with main and rebase
git checkout main
git pull origin main

# 2. Create feature branch (or rebase existing)
git checkout -b clay/add-feature-x

# 3. Plan/brainstorm with Claude Code before coding
# 4. Implement feature with tests
# 5. Commit changes

git add .
git commit -m "feat: Add feature X (DP01-123)"

# 6. Before creating PR, rebase on latest main
git fetch origin
git rebase origin/main

# 7. Push and create PR
git push -u origin clay/add-feature-x
gh pr create --title "Add Feature X" --body "..." --reviewer co-pilot

# 8. After approval, merge and clean up
gh pr merge --squash --delete-branch
git checkout main
git pull origin main
```

**Branch Naming Convention:**
- Format: `<name>/<feature-description>`
- Examples:
  - `clay/localstack-environment-setup`
  - `senior-dev/authentication-jwt-setup`
  - `docs/improve-claude-md`

**Standard Development Workflow:**

1. **Start from main branch:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create feature branch:**
   ```bash
   git checkout -b <name>/<feature-description>
   ```

3. **Make changes and commit regularly:**
   ```bash
   git add <files>
   git commit -m "descriptive commit message"
   ```

4. **Commit message format:**
   ```
   <type>: <subject> (<jira-ticket>)

   <body explaining what and why>

   Closes: <jira-tickets>
   Related: <related-tickets>

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

   **Types:** feat, fix, docs, refactor, test, chore

5. **Push branch to remote:**
   ```bash
   git push -u origin <branch-name>
   ```

6. **Create pull request:**
   - Use GitHub CLI: `gh pr create --title "..." --body "..."`
   - Or use GitHub web interface
   - Include Jira ticket references in PR description
   - Tag relevant reviewers

7. **After PR approval, merge to main:**
   - Use "Squash and merge" for clean history
   - Delete feature branch after merge

**What to Commit:**
- ✅ Source code changes (scripts, examples, configs)
- ✅ Documentation updates (markdown files, guides)
- ✅ Configuration files (docker-compose.yml, init scripts)
- ✅ Infrastructure as code (Terraform, CloudFormation)
- ✅ Reusable automation scripts (get-sprint-tasks.py, transition-tasks.py)
- ❌ `.env` files (use `.env.example` instead)
- ❌ `localstack-data/` or other volume directories
- ❌ Personal IDE settings (`.claude/settings.local.json`)
- ❌ Sensitive credentials or API tokens
- ❌ Temporary/one-off scripts (see Cleanup Rule below)

**Cleanup Rule: Temporary Scripts**

One-off scripts created for specific tasks should be **deleted after use**, not committed:

**Temporary Scripts (DELETE):**
- Bulk Jira ticket creation scripts (e.g., `create-dp01-22-tasks.py`)
- One-time data migration/transformation scripts
- Ad-hoc testing/debugging scripts
- Scripts with hardcoded values for a specific task

**Reusable Scripts (KEEP):**
- Scripts that are part of ongoing workflow (e.g., `get-available-track3-tasks.py`)
- Scripts documented in README or project docs
- Scripts that accept parameters and can be reused

**Cleanup Process:**
1. After task completion, review created files
2. Delete temporary scripts: `rm scripts/temp-script.py`
3. If pattern-based, ensure .gitignore excludes them (e.g., `scripts/create-*.py`)
4. Commit cleanup as part of PR or separate cleanup commit

**Current .gitignore patterns for temp scripts:**
```
scripts/temp-*.py
scripts/create-*.py
scripts/*-temp.py
```

**When Completing Jira Tasks:**
1. Complete the work on your feature branch
2. Run validation/tests to confirm everything works
3. Commit all changes with descriptive messages
4. Mark Jira task as DONE with detailed completion comment
5. Push branch and create PR
6. Tag reviewer (or self-merge if authorized)
7. Merge PR after approval
8. Delete feature branch

**Example Complete Workflow:**
```bash
# Start new feature
git checkout main && git pull origin main
git checkout -b clay/localstack-environment-setup

# Make changes (DP01-148, DP01-149 completed)
git add docker-compose.yml scripts/localstack-init.sh
git commit -m "feat: Complete LocalStack environment setup (DP01-148, DP01-149)

Implements comprehensive local development environment...

Closes: DP01-148, DP01-149
Related: DP01-65

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push and create PR
git push -u origin clay/localstack-environment-setup
gh pr create --title "LocalStack Environment Setup" --body "Completes DP01-148 and DP01-149..."

# After approval, merge via GitHub UI or CLI
gh pr merge --squash --delete-branch
```

**PR Review Checklist:**
- [ ] All Jira tasks referenced are actually complete
- [ ] Code follows project conventions (see TECHNOLOGY_STACK_DECISION.md)
- [ ] No sensitive data committed (.env, API keys, passwords)
- [ ] Documentation updated if needed
- [ ] Tests pass (when test suite exists)
- [ ] Docker containers build and start successfully
- [ ] No merge conflicts with main

**CLAUDE.md Updates:**
- If you improve CLAUDE.md itself, create a separate PR just for that
- Branch naming: `docs/improve-claude-md`
- Can be merged immediately (don't wait for feature completion)
- Keep CLAUDE.md in sync across all developers via Git

### Time Tracking While Working

**IMPORTANT:** Track time in Everhour for all work performed on DP01 tasks. This provides accurate project metrics and supports billing/planning.

**When to Log Time:**
- **After completing a task or significant work block** - Log time for the work just completed
- **At natural breakpoints** - End of coding session, after documentation, completing a feature
- **Before context switching** - Moving to a different task or taking a break
- **Daily or per-session** - Minimum once per work session, ideally as work progresses

**How to Log Time Using Everhour Integration:**

```python
# Quick time logging example
from everhour_integration import add_time_to_task

# Log 2 hours on a Jira issue
add_time_to_task(
    task_id="DP01-74",  # Jira issue key
    hours=2.5,
    comment="LocalStack setup and Docker configuration"
)
```

**Using the Scripts:**
- **Manual logging:** Use Everhour web interface or browser extension
- **Bulk logging:** Use [scripts/populate-time-entries.py](scripts/populate-time-entries.py) for historical entries
- **Verification:** Use [scripts/verify-time-entries.py](scripts/verify-time-entries.py) to check logged time

**Time Tracking Best Practices:**
1. **Log actual hours worked** - Be honest about time spent (not estimates)
2. **Include meaningful comments** - Describe what was accomplished (max 1000 chars for Jira sync)
3. **Use correct Jira issue keys** - Match task IDs to actual work (e.g., "DP01-74")
4. **Log same day** - Track time on the day work was performed for accurate reporting
5. **Track all activities** - Include research, documentation, meetings, coding, debugging, testing

**What Counts as Billable Time:**
- Active coding and implementation
- Code review and testing
- Documentation writing
- Research and technical design
- Debugging and troubleshooting
- Team collaboration on project work
- Learning required for project tasks

**What NOT to Track:**
- General learning unrelated to current project
- Personal breaks and lunch
- Non-project administrative tasks
- Time between active work sessions

**Integration with Jira:**
- Time logged in Everhour automatically syncs to Jira work logs (one-way sync)
- Comments are preserved (up to 1000 characters)
- Time appears in both Everhour and Jira interfaces
- Historical data before integration is NOT synced

**Available Tools:**
- **Everhour Skill:** [@everhour-integration](.claude/skills/everhour-integration/SKILL.md) - Complete API integration
- **Test Scripts:** [scripts/test-everhour-api.py](scripts/test-everhour-api.py) - Verify API access
- **Documentation:** [docs/planning/EVERHOUR_API_INTEGRATION_GUIDE.md](docs/planning/EVERHOUR_API_INTEGRATION_GUIDE.md) - Full API reference

**DP01 Project Details:**
- **Project ID:** `jr:6091-12165` (DP01 - Datapage Phase 1)
- **Total Tasks:** 147 tasks currently tracked
- **API Token:** Stored in `EVERHOUR_API_TOKEN` environment variable

### Critical Information in the PRD

**Current System Architecture** (Section 2.2-2.3):
- BPO (Blueprint Online): Firebase-based, handles lead intake and project tracking
- Connect 1.0: Filemaker-based, handles loan origination and servicing
- SharePoint: M365-based, handles feasibility and entitlement tracking
- **Key Pain Point**: Zero integration between systems; all data manually re-entered

**Target Architecture Principles** (Section 3.2):
- Cloud-native & API-first
- Experience-led development (UX informs backend)
- Composable & modular
- Data-centric design (single source of truth)
- Progressive multi-tenancy (foundation built in, activated post-MVP)

**MVP Phasing** (Section 8.1):
- **Days 1-90**: Design & Entitlement module only (pilot)
- **Days 91-180**: Rebuild BPO + Connect 1.0 within Connect 2.0
- **Decision Gates at Days 30, 90, 180**

**Integration Architecture** (Section 9):
- BPO ↔ Connect 2.0: Temporary API integration Days 1-90, then BPO becomes a module
- iPad Inspection App: Bi-directional REST API (nightly sync)
- DocuSign/Authentisign: Outbound + webhook for e-signature
- Azure Document Intelligence: Document extraction for surveys, title reports, arborist reports

## Project Context

**Business Entity Structure:**
- **Blueprint**: Operating company (Seattle, Phoenix markets) - serves as "Client Zero"
- **Datapage**: Platform company owning Connect 2.0 IP - commercializes the platform
- **Blueprint as Client Zero**: First live implementation proving the platform works

**Key Success Metrics (Day 180 targets):**
- Feasibility packet assembly: -50% cycle time
- Entitlement submission prep: -50% cycle time
- Deals vetted per FTE: 2x increase
- Average draw turnaround: -60% reduction
- User adoption: ≥85% across pilot roles
- System uptime: ≥99.5%

**Zero-Default Track Record:**
- Blueprint has originated $3B+ in loans with zero builder or loan defaults
- Technology must augment, not replace, expert judgment to maintain this record
- Human-in-the-loop required for all AI-assisted decisions (especially builder scoring, risk assessment)

## Terminology

**Domain-Specific Terms:**
- **Feasibility**: 3-30 day due diligence period assessing project viability
- **Entitlement**: Municipal permitting process to secure development approvals
- **Draw**: Construction loan disbursement tied to work completed
- **Reconveyance**: Lien release when loan is paid off
- **Borrowing Base**: Loans assigned to Blueprint's bank line of credit (Columbia Bank)
- **Proforma**: Financial projection showing project costs, revenue, and ROI
- **Progressive Profiling**: Deal data accumulates across lifecycle vs. static snapshots

**Product Terms:**
- **BPO**: Blueprint Online (current lead intake system)
- **Connect 1.0**: Legacy loan servicing platform (Filemaker-based)
- **Connect 2.0**: Next-generation unified platform being built
- **Client Zero**: First implementation of a platform (Blueprint for Connect 2.0)
- **Frontier Firm**: Company designed to embed data, AI, and structured decision-making from day one

## Jira Integration & Project Tracking

**Project Board**: [DP01 - Datapage](https://vividcg.atlassian.net/jira/software/c/projects/DP01/boards/1254)
**Atlassian Cloud**: vividcg.atlassian.net
**Integration**: Atlassian MCP server (read/write access)

### Project Structure

The DP01 board organizes work into three parallel tracks aligned with the project charter:

**Track 1: Market Research & Growth Strategy**
- Epic: DP01-55 (Market Research)
- Epic: DP01-63 (Growth Strategy)
- Focus: Commercial platform strategy and go-to-market planning

**Track 2: Blueprint Transformation & Operating System**
- Epic: DP01-42 (Process Documentation)
- Epic: DP01-48 (Workflow Automation)
- Focus: Frontier firm transformation and operational excellence

**Track 3: Connect 2.0 Platform Development** ⭐ Primary technical track
- Epic: DP01-21 (Infrastructure Setup)
- Epic: DP01-22 (Core API Development)
- Epic: DP01-23 (Authentication & Authorization)
- Epic: DP01-30 (Task Management)
- Epic: DP01-35 (Feasibility Module)
- Epic: DP01-40 (DevOps & CI/CD)

### Using the Atlassian MCP Integration

When working with Jira issues in this repository:

**1. Searching for Issues**:
```
Use the `mcp__atlassian__search` tool with natural language queries:
- "authentication issues in DP01"
- "database migration tasks"
- "issues assigned to me"
```

**2. Fetching Issue Details**:
```
Use `mcp__atlassian__getJiraIssue` with issue key (e.g., "DP01-15")
Returns full details: description, status, assignee, comments, etc.
```

**3. Creating Issues**:
```
Use `mcp__atlassian__createJiraIssue` when:
- User requests new tasks be tracked in Jira
- Implementation work uncovers new technical debt
- Integration gaps are discovered
Always ask user before creating issues
```

**4. Updating Issues**:
```
Use `mcp__atlassian__editJiraIssue` to:
- Update status (In Progress, Done, etc.)
- Add implementation notes
- Link documentation references
Always confirm with user before updating
```

**5. Adding Comments**:
```
Use `mcp__atlassian__addCommentToJiraIssue` to:
- Document technical decisions
- Link to code commits
- Report blockers or dependencies
```

### Alignment: Documentation ↔ Jira Issues

Key alignment between this repository's documentation and existing Jira issues:

| Documentation | Jira Issues | Alignment |
|---------------|-------------|-----------|
| [scripts/init-db.sql](scripts/init-db.sql) | DP01-15 to DP01-20 | Database schema matches migration tasks |
| [TECHNOLOGY_STACK_DECISION.md](TECHNOLOGY_STACK_DECISION.md) | DP01-23 to DP01-29 | Node.js + React aligns with auth framework selection |
| [docker-compose.yml](docker-compose.yml) | DP01-40, DP01-41 | LocalStack setup implements DevOps infrastructure |
| [LOCAL_DEVELOPMENT_PLAN.md](LOCAL_DEVELOPMENT_PLAN.md) | DP01-40 | Comprehensive local dev environment |
| [examples/nodejs-api/](examples/nodejs-api/) | DP01-22 | Working API demonstrates core patterns |
| PRD Section 6 (Task Management) | DP01-30 to DP01-34 | Task data model and workflows |
| PRD Section 5 (Feasibility) | DP01-35 to DP01-39 | Feasibility module requirements |
| [docs/planning/LOCALSTACK_HEPHAESTUS_ONBOARDING.md](docs/planning/LOCALSTACK_HEPHAESTUS_ONBOARDING.md) | DP01-65 to DP01-73 | Developer onboarding exercise (repeatable) |

### Developer Onboarding with Epic DP01-65

**Primary Onboarding Exercise:** Epic DP01-65 (LocalStack Development Environment) serves as the hands-on introduction for all new developers.

**How It Works:**
1. **First Developer**: Implements LocalStack environment with Claude Code assistance, creates canonical version merged to `main`
2. **Subsequent Developers**: Complete same exercise on feature branches (learning only, not merged)
3. **Reset Between Developers**: Use `scripts/reset-onboarding.sh` to clean up for next developer
4. **Duration**: 3-5 hours self-paced exercise

**Key Documents:**
- [LOCALSTACK_HEPHAESTUS_ONBOARDING.md](docs/planning/LOCALSTACK_HEPHAESTUS_ONBOARDING.md) - Complete onboarding guide
- [HEPHAESTUS_EXECUTION_FRAMEWORK.md](docs/planning/HEPHAESTUS_EXECUTION_FRAMEWORK.md) - Methodology overview
- [scripts/reset-onboarding.sh](scripts/reset-onboarding.sh) - Cleanup script for subsequent developers

**Learning Outcomes:**
- Master Claude Code pair programming
- Understand Hephaestus ticket-driven workflow
- Learn Connect 2.0 tech stack hands-on
- Establish development best practices

### Keeping CLAUDE.md in Sync

**This file (CLAUDE.md) is automatically kept in sync across all developers via Git:**

1. **Automatic Sync**: All developers pull the latest version when they start:
   ```bash
   git checkout main
   git pull origin main  # Gets latest CLAUDE.md
   git checkout -b <name>/feature-branch
   ```

2. **GitHub Action**: `.github/workflows/claude-md-sync-check.yml` automatically checks PRs to ensure CLAUDE.md is in sync with main

3. **Improving CLAUDE.md**: If you discover something during development that should be added:
   - Create a **separate PR** for CLAUDE.md improvements
   - Use branch naming: `docs/improve-claude-md`
   - These can be merged immediately (don't wait for feature completion)

4. **Never Modified During Onboarding**: The LocalStack onboarding exercise (DP01-65) never modifies CLAUDE.md - it's reset-proof

**CLAUDE.md is the single source of truth for AI assistant behavior across the entire project.**

## Claude Code Configuration Sharing

**This project uses shared Claude Code configurations to ensure consistent AI-assisted development across all team members.**

### Configuration Files in Git

All Claude Code configurations are stored in the [`.claude/`](.claude/) directory and committed to the repository:

```
.claude/
├── settings.json              # Team-shared settings (IN GIT)
├── settings.local.json        # Personal overrides (AUTO-IGNORED by Git)
├── commands/                  # Team slash commands (IN GIT)
├── skills/                    # Team agent skills (IN GIT)
├── hooks/                     # Hook scripts (IN GIT)
└── README.md                  # Configuration documentation
```

**Complete documentation:** See [.claude/README.md](.claude/README.md) for detailed configuration guide.

### Team-Shared vs. Personal Settings

| File | Shared via Git? | Purpose |
|------|-----------------|---------|
| **`.claude/settings.json`** | ✅ YES | Team defaults: model, plugins, permissions |
| **`.claude/settings.local.json`** | ❌ NO | Personal overrides for your machine |
| **`.claude/commands/`** | ✅ YES | Custom slash commands for the team |
| **`.claude/skills/`** | ✅ YES | Shared agent skills and capabilities |
| **`.claude/hooks/`** | ✅ YES | Automated scripts for lifecycle events |
| **`.mcp.json`** (root) | ✅ YES | MCP server configurations |

### Current Team Configuration

**Default Model:** Claude 3.5 Sonnet

**Enabled Plugins:**
- `pr-review-toolkit@claude-code-plugins` - Comprehensive PR review agents
- `feature-dev@claude-code-plugins` - Guided feature development workflow
- `devkit@devkit-marketplace` - Developer utilities and skills
- `superpowers@superpowers-marketplace` - Advanced coding capabilities

**Standard Permissions** (auto-approved tools):
- Git operations: `git add`, `git commit`, `git push`, `gh` CLI
- NPM commands: `npm run *`
- Docker commands: `docker`, `docker-compose`
- File operations: `Read`, `Write`, `Edit`, `Glob`, `Grep`

### Sharing New Configurations

When you create a new slash command, skill, or hook:

1. **Create in `.claude/` directory** (not `~/.claude/`)
   ```bash
   # Example: New slash command
   .claude/commands/deploy/check.md

   # Example: New skill
   .claude/skills/api-validator/SKILL.md
   ```

2. **Test locally first** - Verify it works on your machine

3. **Commit to Git**:
   ```bash
   git add .claude/commands/deploy/check.md
   git commit -m "feat: Add deployment readiness check command"
   ```

4. **Create PR** with description of what it does

5. **Teammates get it automatically** with `git pull`

### Personal Customizations

If you need **machine-specific settings** (not shared with team):

1. Create `.claude/settings.local.json` in the project root
2. Add your personal overrides (this file is auto-ignored by git)
3. Example:
   ```json
   {
     "permissions": {
       "allow": [
         "Bash(custom-script:*)"
       ]
     }
   }
   ```

**Configuration precedence:** Local settings override team settings.

### Onboarding New Developers

When a new developer joins:

1. **Clone repository** - Gets `.claude/settings.json` automatically
2. **Review** [.claude/README.md](.claude/README.md) - Understand configuration system
3. **Install plugins** - Listed in `settings.json`
4. **Optional:** Create `.claude/settings.local.json` for personal preferences
5. **Start onboarding** - Complete Epic DP01-65 (LocalStack exercise)

### MCP Server Configuration

MCP (Model Context Protocol) servers are configured in `.mcp.json` at the project root.

**Current MCP Servers:**
- **Atlassian MCP** - Jira/Confluence integration (configured at user level)

**Adding Project-Level MCP Servers:**
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["@anthropic/mcp-server-name"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

**Note:** Use environment variable references (`${VAR_NAME}`) for secrets. Never commit actual API keys.

### Project Skills

**Jira Automation** - [.claude/skills/jira-automation/SKILL.md](.claude/skills/jira-automation/SKILL.md)
- Complete Jira automation toolkit using REST API (equivalent to MCP capabilities)
- **Issue Management:** Create, update, search, get, delete issues
- **Workflow:** Transition issues, get available transitions
- **Collaboration:** Add comments, mention users
- **Agile:** Create sprints, link to epics, manage boards
- **Relationships:** Link issues (blocks, relates, duplicates)
- **Time Tracking:** Add work logs
- Includes JQL query examples and Claude Code integration patterns
- Used to create 74 tasks from Epic Tasking Guide (DP01-74 to DP01-147)
- Invoke with: `@jira-automation` or use the skill directly

**Everhour Integration** - [.claude/skills/everhour-integration/SKILL.md](.claude/skills/everhour-integration/SKILL.md)
- Complete time tracking integration via Everhour REST API v1
- **Time Entries:** Get, add, update, delete time on tasks and Jira issues
- **Projects & Tasks:** List projects, get project tasks, get task details
- **Timers:** Start, stop, and get running timers
- **Estimates:** Set and delete task estimates
- **Jira Integration:** Direct access to Jira issue time via issue keys (e.g., "DP01-74")
- **Reporting:** Daily time reports, project summaries, budget tracking
- One-way sync: Everhour → Jira work logs (historical data not synced)
- API Token: Get from Everhour → Settings → My Profile
- DP01 Project ID: `jr:6091-12165` (147 tasks tracked)
- Invoke with: `@everhour-integration` or use the skill directly

### Additional Resources

- **Claude Code Official Docs:** https://code.claude.com/docs/
- **Settings & Permissions:** https://code.claude.com/docs/en/settings.md
- **Custom Slash Commands:** https://code.claude.com/docs/en/slash-commands.md
- **Agent Skills:** https://code.claude.com/docs/en/skills.md
- **MCP Integration:** https://code.claude.com/docs/en/mcp.md

### Common Jira Queries for This Project

When working with the DP01 board, these queries are frequently useful:

- **Track 3 (Platform Development)**: `project = DP01 AND labels = "Track-3-Platform"`
- **Current Sprint**: `project = DP01 AND sprint in openSprints()`
- **Database Work**: `project = DP01 AND (labels = "database" OR summary ~ "migration")`
- **Authentication**: `project = DP01 AND epic = DP01-23`
- **Blocked Items**: `project = DP01 AND status = Blocked`
- **Ready for Dev**: `project = DP01 AND status = "Ready for Development"`

### Issue Tracking Best Practices

When implementing features from the PRD:

1. **Check Jira First**: Search for existing issues before creating new ones
2. **Link Documentation**: Reference PRD sections and local files in issue descriptions
3. **Update Status**: Move issues through workflow as implementation progresses
4. **Add Technical Notes**: Document decisions, blockers, and dependencies in comments
5. **Link Commits**: Reference issue keys in commit messages (e.g., `DP01-22: Implement S3 service`)

### Technical Decisions Now Resolved

~~When working on implementation planning, these remain open:~~
- ✅ **Hosting platform**: AWS ($61,530/year Year 1) - See [COST_OF_OWNERSHIP.md](COST_OF_OWNERSHIP.md)
- ✅ **Frontend framework**: React + TypeScript - See [TECHNOLOGY_STACK_DECISION.md](TECHNOLOGY_STACK_DECISION.md)
- ✅ **Backend framework**: Node.js + TypeScript + Express - See [TECHNOLOGY_STACK_DECISION.md](TECHNOLOGY_STACK_DECISION.md)
- ✅ **Local Development**: LocalStack + Docker Compose ($95K/year savings) - See [LOCAL_DEVELOPMENT_PLAN.md](LOCAL_DEVELOPMENT_PLAN.md)

**Still Open**:
- BPO API capabilities (or export-based integration approach)
- iPad inspection app API documentation availability
- Accounting system details (platform, integration method)

## Code Quality and Pre-Commit Hooks

**IMPORTANT:** All code changes are automatically checked for quality before commits. These checks are **enforced by Claude Code** and run automatically.

### Automated Pre-Commit Checks

Every `git commit` command automatically triggers:

1. **Ruff Linter** - Fast Python linter (auto-fixes issues)
2. **Ruff Formatter** - Code formatting (100 char lines)
3. **MyPy** - Type checking (warnings only)
4. **Pytest** - Automated tests ⚠️ **BLOCKS COMMIT IF TESTS FAIL**

**Configuration:** Pre-commit hook runs via `.claude/settings.json` → hooks → PreToolUse

**Manual testing before commit:**
```bash
.claude/hooks/pre-commit.sh        # Run all checks
python -m pytest tests/ -v         # Run tests only
ruff check . --fix                 # Lint only
```

**Full Documentation:** [docs/development/PRE_COMMIT_HOOKS.md](docs/development/PRE_COMMIT_HOOKS.md)

## Testing Requirements

**IMPORTANT:** All code changes require appropriate test coverage. Tests are automatically run by pre-commit hooks and will block commits if they fail.

### Minimum Test Coverage Expectations

**By Code Type:**
- **Business logic**: 90%+ coverage required
- **API endpoints**: 80%+ coverage required (all happy paths + error cases)
- **Utilities/helpers**: 95%+ coverage required
- **UI components**: 70%+ coverage required (critical interactions)
- **Integration tests**: All critical user flows

**Coverage is NOT enough - tests must be meaningful:**
- Test behavior, not implementation
- Test edge cases and error conditions
- Test integration points between modules

### When to Use Each Test Type

**Unit Tests (majority of tests):**
- Business logic functions
- Utility functions
- Service classes
- Data transformations
- Validation logic
- **Example**: Testing `calculateLoanInterest()` function

**Integration Tests:**
- API endpoint behavior (request → response)
- Database operations (CRUD)
- External service interactions (mocked)
- Authentication/authorization flows
- **Example**: Testing `POST /api/projects` creates database record

**E2E Tests (selective, high-value flows):**
- Critical user journeys
- Multi-step workflows
- **Example**: Lead intake → feasibility → approval flow
- **Note**: Expensive to maintain, keep minimal

### Testing Requirements by Change Type

**New Features:**
- ✅ Unit tests for all business logic
- ✅ Integration tests for API endpoints
- ✅ E2E test for primary user flow (if critical feature)
- ✅ Tests must pass before PR

**Bug Fixes:**
- ✅ Add regression test that reproduces the bug
- ✅ Verify test fails before fix
- ✅ Verify test passes after fix
- ✅ Document the bug scenario in test name

**Refactoring:**
- ✅ All existing tests must still pass
- ✅ Add tests if coverage gaps discovered
- ✅ Update tests if behavior intentionally changes
- ❌ Don't reduce test coverage during refactoring

**Documentation/Config Changes:**
- Tests not required for markdown-only changes
- Tests required if config affects runtime behavior

### Testing in LocalStack Environment

**Local Development:**
- Run tests against LocalStack for AWS service mocking
- Use `docker-compose up localstack` before running tests
- Configure tests to use LocalStack endpoints (see `.env.test`)

**Pre-Commit:**
- All tests run automatically via `.claude/hooks/pre-commit.sh`
- **Commits blocked if tests fail** - fix tests before committing

**CI/CD:**
- GitHub Actions runs full test suite on every PR
- Must pass before merge allowed

## Code Review Standards

### What Makes a Good Code Review Comment?

**Do:**
- **Be specific**: "This function could cause a race condition if two users update simultaneously" vs. "This looks wrong"
- **Explain why**: "We should validate email format here to prevent invalid data in the database"
- **Suggest solutions**: "Consider using a Map here instead of an array for O(1) lookups"
- **Ask questions**: "Could we simplify this by using the existing `formatDate()` utility?"
- **Praise good work**: "Nice error handling here - this will make debugging much easier"
- **Link to standards**: "Per [TECHNOLOGY_STACK_DECISION.md](TECHNOLOGY_STACK_DECISION.md), we're using async/await instead of .then()"

**Don't:**
- ❌ Be vague: "This doesn't look right"
- ❌ Make it personal: "You always forget to add tests"
- ❌ Nitpick style: "I prefer 4 spaces" (use linters/formatters for this)
- ❌ Approve without reading: "LGTM" when you haven't actually reviewed
- ❌ Argue in comments: Take heated discussions to Slack/video call

### Response Time Expectations

**For Reviewers (co-pilot):**
- **Critical/Hotfix PRs**: Within 2 hours during business hours
- **Standard PRs**: Within 1 business day
- **Large PRs (>400 lines)**: Within 2 business days
- **Documentation-only PRs**: Within 1 business day

**For PR Authors:**
- **Respond to comments**: Within 1 business day
- **Address requested changes**: Within 2 business days
- **Re-request review**: After addressing all comments

### When to Use Each Review Action

**Approve:**
- Code meets all standards
- Tests pass and coverage is adequate
- No significant concerns
- Minor suggestions are optional (use "Comment" for these)

**Request Changes:**
- Security vulnerabilities found
- Tests are missing or inadequate
- Breaking changes without migration plan
- Code doesn't follow project standards
- Significant logic errors or bugs

**Comment Only:**
- Asking clarifying questions
- Suggesting optional improvements
- Pointing out minor issues that don't block merge
- Sharing knowledge ("FYI, there's also a utility for this...")

### Handling Disagreements

1. **Author's first response**: Explain your reasoning with specifics
2. **Reviewer's follow-up**: If still concerned, escalate to team discussion
3. **Team discussion**: Async in Slack or sync call if complex
4. **Document decision**: If it's architectural, create an ADR in [docs/architecture/decisions/](docs/architecture/decisions/)
5. **Move forward**: Once decided, update code and move on (no grudges)

## Definition of Done

### Task Checklist: When is Work "Done"?

A task is **complete** only when ALL of the following are true:

**Code Complete:**
- [ ] Feature implemented per acceptance criteria
- [ ] Code follows project conventions (see [TECHNOLOGY_STACK_DECISION.md](TECHNOLOGY_STACK_DECISION.md))
- [ ] No linter errors or warnings
- [ ] No console.log() or debug code left in
- [ ] Error handling implemented
- [ ] Edge cases handled

**Tests:**
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (if applicable)
- [ ] Test coverage meets minimums (see Testing Requirements above)
- [ ] Manual testing completed
- [ ] No tests skipped or commented out

**Documentation:**
- [ ] Inline code comments for complex logic
- [ ] JSDoc comments for public APIs
- [ ] README updated (if new module/service)
- [ ] PRD updated (if requirements changed)
- [ ] API documentation updated (if endpoints changed)

**Code Review:**
- [ ] PR created with descriptive title and body
- [ ] @co-pilot tagged as reviewer
- [ ] All review comments addressed
- [ ] PR approved
- [ ] CI/CD checks passing (tests, lint, build)

**Jira:**
- [ ] Jira ticket status updated to "Done"
- [ ] Completion comment added with summary
- [ ] Time logged in Everhour
- [ ] Related tickets linked (if applicable)

**Git:**
- [ ] Commits follow format: `type: description (DP01-XXX)`
- [ ] Branch rebased on latest main
- [ ] PR merged via "Squash and merge"
- [ ] Feature branch deleted

**Deployment:**
- [ ] Code deployed to dev environment
- [ ] Smoke test passed in dev
- [ ] Ready for staging deployment (if applicable)

### Code Complete vs. Done

**Code Complete** = Code written and locally tested
**Done** = Everything above ✅

**Why the distinction matters:**
- Moving a ticket to "Done" signals to team it's truly finished
- Incomplete tasks block dependent work
- Impacts sprint velocity calculations
- Creates false sense of progress

**Anti-Pattern to Avoid:**
```
❌ Dev: "I'm done with the code, just need to write tests"
   → Task is NOT done. Status should be "In Progress"

❌ Dev: "PR is up, marking ticket as Done"
   → Task is NOT done until PR is merged

❌ Dev: "It works on my machine, pushing to main"
   → Tests must pass, PR must be reviewed
```

### When to Mark a Task as Done

**Mark as Done when:**
- ✅ All checklist items above are complete
- ✅ PR is merged to main
- ✅ Code is deployed to dev environment
- ✅ You would be comfortable with another developer taking over

**Don't mark as Done if:**
- ❌ "Just needs code review" → Status: "In Review"
- ❌ "Waiting for deployment" → Status: "Ready for Deploy"
- ❌ "Need to write tests" → Status: "In Progress"
- ❌ "Works but needs cleanup" → Status: "In Progress"

## Document Status

**Last Updated**: December 17, 2025
**Status**: Active Development Documentation
**Jira Project**: DP01 - Datapage
**Next Milestone**: Day 30 Architecture Review
