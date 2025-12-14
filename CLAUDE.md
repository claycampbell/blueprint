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

## Document Status

**Last Updated**: December 14, 2025
**Status**: Active Development Documentation
**Jira Project**: DP01 - Datapage
**Next Milestone**: Day 30 Architecture Review
