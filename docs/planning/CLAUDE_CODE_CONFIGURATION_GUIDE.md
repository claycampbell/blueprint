# Claude Code Configuration Guide

**Purpose:** Complete reference for managing Claude Code configurations across the Blueprint Connect 2.0 development team.

**Last Updated:** December 14, 2024
**Maintained By:** Blueprint Platform Team

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Configuration File Structure](#configuration-file-structure)
4. [Team-Shared Settings](#team-shared-settings)
5. [Personal Settings](#personal-settings)
6. [Custom Slash Commands](#custom-slash-commands)
7. [Agent Skills](#agent-skills)
8. [Hooks & Automation](#hooks--automation)
9. [MCP Server Configuration](#mcp-server-configuration)
10. [Git Best Practices](#git-best-practices)
11. [Onboarding Checklist](#onboarding-checklist)
12. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Claude Code Configuration?

Claude Code uses a **hierarchical configuration system** that allows teams to share standard settings while preserving individual developer flexibility.

**Key Benefits:**
- ✅ **Consistent AI behavior** across all team members
- ✅ **Shared capabilities** (slash commands, skills, hooks)
- ✅ **Personal customization** without affecting teammates
- ✅ **Version control** for team configurations
- ✅ **Automatic synchronization** via Git

### Configuration Scopes

| Scope | Location | Shared? | Use Case |
|-------|----------|---------|----------|
| **Enterprise** | System directories | Via IT policy | Organization-wide standards |
| **User** | `~/.claude/` | No | Personal preferences across all projects |
| **Project (Shared)** | `.claude/` | Yes (Git) | Team standards for this project |
| **Project (Local)** | `.claude/settings.local.json` | No (auto-ignored) | Machine-specific overrides |

---

## Quick Start

### For New Developers

```bash
# 1. Clone the repository
git clone https://github.com/claycampbell/blueprint.git
cd blueprint

# 2. Review team configuration
cat .claude/settings.json
cat .claude/README.md

# 3. (Optional) Create personal overrides
# This file is auto-ignored by git
cat > .claude/settings.local.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash(my-custom-script:*)"
    ]
  }
}
EOF

# 4. Verify Claude Code recognizes the configuration
claude config show

# 5. Start onboarding exercise
# See docs/planning/LOCALSTACK_HEPHAESTUS_ONBOARDING.md
```

### For Existing Developers

```bash
# Pull latest configurations
git pull origin main

# Check for new team settings
git diff HEAD@{1} .claude/

# Restart Claude Code to apply changes
claude restart
```

---

## Configuration File Structure

### Complete Directory Layout

```
blueprint/
├── .claude/                          # Team Claude Code configuration
│   ├── settings.json                 # ✅ Team-shared (IN GIT)
│   ├── settings.local.json           # ❌ Personal (AUTO-IGNORED)
│   ├── README.md                     # ✅ Configuration docs (IN GIT)
│   ├── commands/                     # ✅ Team slash commands (IN GIT)
│   │   ├── .gitkeep
│   │   ├── database/
│   │   │   ├── migrate.md           # Example: /migrate (project:database)
│   │   │   └── seed.md              # Example: /seed (project:database)
│   │   └── deploy/
│   │       └── check.md             # Example: /check (project:deploy)
│   ├── skills/                       # ✅ Team agent skills (IN GIT)
│   │   ├── .gitkeep
│   │   └── api-validator/           # Example skill
│   │       ├── SKILL.md
│   │       ├── reference.md
│   │       ├── examples.md
│   │       ├── scripts/
│   │       └── templates/
│   └── hooks/                        # ✅ Team hook scripts (IN GIT)
│       ├── .gitkeep
│       ├── config.json
│       └── scripts/
│           ├── pre-commit-check.sh
│           └── post-tool-validation.py
├── .mcp.json                         # ✅ MCP server config (IN GIT)
├── CLAUDE.md                         # ✅ Project instructions (IN GIT)
└── docs/
    └── planning/
        └── CLAUDE_CODE_CONFIGURATION_GUIDE.md  # ✅ This file
```

### What Gets Committed vs. Ignored

**Committed to Git (Shared with Team):**
```
✅ .claude/settings.json              # Team defaults
✅ .claude/README.md                  # Documentation
✅ .claude/commands/                  # Team slash commands
✅ .claude/skills/                    # Team agent skills
✅ .claude/hooks/                     # Team hook scripts
✅ .mcp.json                          # MCP server configs (no secrets)
✅ CLAUDE.md                          # Project instructions
```

**Auto-Ignored (Personal Settings):**
```
❌ .claude/settings.local.json        # Claude Code auto-ignores
❌ ~/.claude/                         # User-level directory
❌ ~/.claude.json                     # User-level MCP config
```

---

## Team-Shared Settings

### .claude/settings.json

**Purpose:** Default configuration for all team members.

**Current Blueprint Team Configuration:**

```json
{
  "model": "sonnet",
  "enabledPlugins": {
    "pr-review-toolkit@claude-code-plugins": true,
    "feature-dev@claude-code-plugins": true,
    "devkit@devkit-marketplace": true,
    "superpowers@superpowers-marketplace": true
  },
  "alwaysThinkingEnabled": true,
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(npm run:*)",
      "Bash(docker:*)",
      "Bash(docker-compose:*)",
      "Read",
      "Write",
      "Edit",
      "Glob",
      "Grep",
      "Bash(gh:*)"
    ],
    "deny": [],
    "ask": []
  }
}
```

### What Belongs in Team Settings

**✅ Include:**
- Default AI model for the project
- Required plugins for development
- Standard tool permissions
- Feature flags (e.g., always-thinking mode)
- Project-wide configurations

**❌ Do Not Include:**
- API keys or secrets
- Personal preferences
- Machine-specific paths
- Experimental features

### Updating Team Settings

When you need to change team configuration:

1. **Discuss with team** - Settings affect everyone
2. **Update `.claude/settings.json`**
3. **Test locally** - Verify changes work
4. **Create PR** with explanation
5. **Get team approval** before merging
6. **Announce in Slack** - Notify team to pull changes

---

## Personal Settings

### .claude/settings.local.json

**Purpose:** Machine-specific overrides that don't affect teammates.

**Location:** `.claude/settings.local.json` (auto-ignored by Git)

**Configuration Precedence:**
```
Local settings (highest priority)
  ↓
Team settings
  ↓
User settings (~/.claude/settings.json)
  ↓
Default settings (lowest priority)
```

### Example Personal Overrides

```json
{
  "permissions": {
    "allow": [
      "Bash(custom-local-script:*)",
      "Bash(experimental-tool:*)"
    ]
  },
  "model": "opus",  // Override team default for testing
  "alwaysThinkingEnabled": false  // Personal preference
}
```

### When to Use Local Settings

**Use `.claude/settings.local.json` for:**
- Personal workflow customizations
- Local development scripts
- Testing experimental features
- Tool permissions specific to your machine
- Model preferences different from team

**Don't use it for:**
- Configurations that should be shared
- Workarounds for team setting issues (fix the team settings instead)

---

## Custom Slash Commands

### Overview

Slash commands are team-shared shortcuts for common development tasks.

**Location:** `.claude/commands/`

**Naming Convention:**
- File: `command-name.md`
- Invocation: `/command-name`
- Namespaced: `/command-name (project:category)`

### Command File Format

Each command is a Markdown file with YAML frontmatter:

**Example: `.claude/commands/database/migrate.md`**

```markdown
---
description: "Run database migrations for Connect 2.0"
argument-hint: "<environment>"
allowed-tools:
  - Bash
  - Read
  - Write
model: "sonnet"
---

# /migrate

Run database migrations for the specified environment.

## Usage
/migrate <environment>

Where environment is one of: local, dev, staging, prod

## Steps
1. Check current migration status
2. Run pending migrations
3. Verify schema integrity
4. Update migration log

## Implementation

! cd scripts && ./run-migrations.sh $1

Verify the migration completed successfully and update Jira if needed.
```

### Command Features

**Variable Substitution:**
- `$ARGUMENTS` - All arguments as single string
- `$1`, `$2`, `$3`, etc. - Individual arguments
- Environment variables: `${ENV_VAR}`

**File References:**
- `@path/to/file.txt` - Reference file content

**Shell Execution:**
- `! command` - Execute shell command

### Creating New Commands

```bash
# 1. Create command file
mkdir -p .claude/commands/deploy
cat > .claude/commands/deploy/check.md << 'EOF'
---
description: "Pre-deployment readiness check"
argument-hint: "<environment>"
allowed-tools:
  - Bash
  - Read
  - Grep
model: "sonnet"
---

# /check

Verify application is ready for deployment to $1 environment.

1. Run test suite
2. Check environment variables
3. Validate configuration
4. Review security checklist

! npm run test && npm run lint && npm run build
EOF

# 2. Test locally
claude /check dev

# 3. Commit to git
git add .claude/commands/deploy/check.md
git commit -m "feat: Add deployment readiness check command"
git push

# 4. Create PR
gh pr create --title "feat: Add /check command for deployment readiness"
```

### Command Organization

**Subdirectories for Namespacing:**
```
.claude/commands/
├── database/
│   ├── migrate.md          → /migrate (project:database)
│   ├── seed.md             → /seed (project:database)
│   └── backup.md           → /backup (project:database)
├── deploy/
│   ├── check.md            → /check (project:deploy)
│   └── rollback.md         → /rollback (project:deploy)
└── testing/
    ├── unit.md             → /unit (project:testing)
    └── integration.md      → /integration (project:testing)
```

**Conflict Resolution:**
- If project and personal commands have same name, **project wins**
- Personal command is silently ignored

---

## Agent Skills

### Overview

Skills extend Claude Code's capabilities with specialized behaviors.

**Location:** `.claude/skills/`

**Structure:** Each skill is a directory with a `SKILL.md` file

### Skill Directory Layout

```
.claude/skills/api-validator/
├── SKILL.md                 # Required - main skill definition
├── reference.md             # Optional - detailed reference
├── examples.md              # Optional - usage examples
├── scripts/                 # Optional - utility scripts
│   ├── validate.py
│   └── helpers.js
└── templates/               # Optional - code templates
    ├── endpoint-template.ts
    └── test-template.ts
```

### SKILL.md Format

**Example: `.claude/skills/api-validator/SKILL.md`**

```yaml
---
name: "api-validator"
description: "Validates API endpoint implementations against OpenAPI specs. Use after implementing new endpoints, modifying existing endpoints, or before creating PRs with API changes."
---

# API Validator Skill

## Overview
Automatically validates API endpoint implementations against the project's OpenAPI specification to ensure consistency and correctness.

## When to Use
- After implementing new API endpoints
- When modifying existing endpoints
- Before creating pull requests with API changes
- During code review of API-related changes

## How It Works
1. Reads OpenAPI spec from `docs/api/openapi.yaml`
2. Analyzes implementation in `src/api/` directory
3. Compares actual implementation with spec requirements
4. Reports discrepancies (missing endpoints, wrong types, missing validation)
5. Suggests fixes with code examples

## Dependencies
- OpenAPI spec must exist at `docs/api/openapi.yaml`
- API implementation in `src/api/`
- TypeScript type definitions in `src/types/`

## Example Usage

When Claude Code is activated with this skill:

**User:** "I just implemented the new user registration endpoint"

**Claude (with skill):**
1. Reads `docs/api/openapi.yaml` to find `/api/users/register` spec
2. Analyzes `src/api/users/register.ts` implementation
3. Compares request/response types, validation rules, error handling
4. Reports: "✅ Endpoint matches spec. Consider adding rate limiting per API standards."

## Validation Checks
- ✅ HTTP method matches spec (POST, GET, etc.)
- ✅ Request body schema matches spec
- ✅ Response schema matches spec
- ✅ Error responses match spec
- ✅ Authentication/authorization requirements
- ✅ Validation rules implemented
- ✅ TypeScript types match OpenAPI schema

## Configuration
Edit `.claude/skills/api-validator/config.json`:
```json
{
  "specPath": "docs/api/openapi.yaml",
  "apiSourcePath": "src/api/",
  "strictMode": true
}
```

## Related Skills
- `test-generator` - Generates tests for validated endpoints
- `security-reviewer` - Checks authentication/authorization

## Maintenance
- Update when OpenAPI spec format changes
- Review validation rules quarterly
- Add new checks based on API standards evolution
```

### Creating New Skills

```bash
# 1. Create skill directory
mkdir -p .claude/skills/database-optimizer

# 2. Create SKILL.md
cat > .claude/skills/database-optimizer/SKILL.md << 'EOF'
---
name: "database-optimizer"
description: "Analyzes database queries and suggests optimizations. Use when writing new queries, experiencing performance issues, or before deploying query-heavy features."
---

# Database Optimizer Skill

## Overview
Automatically analyzes SQL queries and suggests performance optimizations.

## When to Use
- Writing complex database queries
- Experiencing slow query performance
- Before deploying features with heavy database usage
- During code review of database-related changes

## How It Works
1. Identifies SQL queries in code
2. Analyzes query patterns (N+1, missing indexes, etc.)
3. Suggests optimizations (indexes, query rewrites, caching)
4. Estimates performance impact

## Example
...
EOF

# 3. Test locally
# Claude Code will automatically discover the skill

# 4. Commit to git
git add .claude/skills/database-optimizer/
git commit -m "feat: Add database optimizer skill"
git push
```

### Skill Best Practices

**✅ DO:**
- Write clear, specific descriptions (triggers automatic activation)
- Include concrete examples
- Document dependencies
- Provide configuration options
- Keep skills focused on one responsibility

**❌ DON'T:**
- Make skills too broad ("general helper")
- Forget to document when to use it
- Include hardcoded paths (use config files)
- Duplicate functionality of existing skills

---

## Hooks & Automation

### Overview

Hooks are automated scripts that run at specific lifecycle points during Claude Code execution.

**Location:** `.claude/hooks/`

**Supported Hook Points:**
- `PreToolUse` - Before any tool execution
- `PostToolUse` - After tool execution completes
- Other events (see official docs)

### Hook Configuration

**Storage:**
- Project-level: `.claude/hooks/` directory
- User-level: `~/.claude/settings.json` → `hooks` section

**Example: `.claude/hooks/config.json`**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit:*)",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/scripts/pre-commit-check.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/scripts/post-write-lint.js"
          }
        ]
      }
    ]
  }
}
```

### Hook Script Example

**`.claude/hooks/scripts/pre-commit-check.sh`**

```bash
#!/bin/bash
# Pre-commit hook to validate CLAUDE.md sync
# Runs before git commit operations

set -e

echo "Running pre-commit checks..."

# Check if CLAUDE.md is being committed
if git diff --cached --name-only | grep -q "^CLAUDE.md$"; then
    echo "⚠️  WARNING: CLAUDE.md is being modified"
    echo "Ensure this is intentional and follows the sync process"
    echo "See docs/diagrams/CLAUDE_MD_SYNC_FLOW.md"
fi

# Check for secrets
if git diff --cached | grep -Ei 'api[_-]?key|secret|password|token'; then
    echo "❌ ERROR: Potential secrets detected in commit"
    exit 1
fi

echo "✅ Pre-commit checks passed"
exit 0
```

### Hook Matchers

**Wildcard Support:**
```json
"matcher": "Bash(git:*)"           // Matches all git commands
"matcher": "Bash(npm run:*)"       // Matches all npm run commands
"matcher": "Bash(*)"                // Matches all bash commands
"matcher": "Write"                  // Matches Write tool exactly
```

### Creating Hooks

```bash
# 1. Create hook script
mkdir -p .claude/hooks/scripts
cat > .claude/hooks/scripts/security-scan.sh << 'EOF'
#!/bin/bash
# Security scan hook - runs after file writes
echo "Running security scan..."
# Add security scanning logic here
EOF

chmod +x .claude/hooks/scripts/security-scan.sh

# 2. Configure hook
cat > .claude/hooks/config.json << 'EOF'
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/scripts/security-scan.sh"
          }
        ]
      }
    ]
  }
}
EOF

# 3. Test
# Claude Code will automatically run hook on next Write operation

# 4. Commit
git add .claude/hooks/
git commit -m "feat: Add security scan hook for file writes"
```

---

## MCP Server Configuration

### Overview

MCP (Model Context Protocol) servers connect Claude Code to external tools and services.

**Configuration Locations:**
- **Project-level:** `.mcp.json` (committed to git)
- **User-level:** `~/.claude.json` (not committed)
- **Enterprise-level:** Centrally managed

### .mcp.json Format

**Example: Project-level MCP configuration**

```json
{
  "mcpServers": {
    "jira-integration": {
      "command": "npx",
      "args": ["@anthropic/mcp-server-jira"],
      "env": {
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}",
        "JIRA_SITE_URL": "https://blueprint.atlassian.net"
      }
    },
    "aws-localstack": {
      "command": "node",
      "args": ["scripts/mcp-localstack-server.js"],
      "env": {
        "LOCALSTACK_ENDPOINT": "http://localhost:4566"
      }
    },
    "postgres-inspector": {
      "command": "python",
      "args": ["scripts/mcp-postgres-server.py"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

### MCP Transport Types

| Transport | Use Case | Example |
|-----------|----------|---------|
| **HTTP** | Remote services (recommended) | APIs, cloud services |
| **Stdio** | Local processes | Custom scripts, system tools |
| **SSE** | Legacy | Deprecated - avoid |

### Managing MCP Servers

**CLI Commands:**
```bash
# List configured servers
claude mcp list

# Add HTTP server
claude mcp add --transport http myserver https://api.example.com

# Add local stdio server
claude mcp add --transport stdio localstack -- node scripts/mcp-server.js

# Remove server
claude mcp remove myserver

# Test server connection
claude mcp test myserver
```

### Security: Environment Variables

**✅ DO:**
```json
{
  "mcpServers": {
    "secure-api": {
      "env": {
        "API_KEY": "${API_KEY}"           // References env var
      }
    }
  }
}
```

**❌ DON'T:**
```json
{
  "mcpServers": {
    "insecure-api": {
      "env": {
        "API_KEY": "sk-1234567890abcdef"  // Hardcoded secret
      }
    }
  }
}
```

**Best Practice:** Create `.env` file (git-ignored) for local development:

```bash
# .env
JIRA_API_TOKEN=your_token_here
DATABASE_URL=postgresql://localhost:5432/connect
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

---

## Git Best Practices

### What to Commit

**✅ Always commit:**
- `.claude/settings.json` - Team configuration
- `.claude/README.md` - Documentation
- `.claude/commands/` - Team slash commands
- `.claude/skills/` - Team agent skills
- `.claude/hooks/` - Team hook scripts
- `.mcp.json` - MCP server configs (no secrets!)
- `CLAUDE.md` - Project instructions

**❌ Never commit:**
- `.claude/settings.local.json` - Auto-ignored by Claude Code
- `~/.claude/` - User-level directory
- `~/.claude.json` - User-level MCP config
- `.env` - Environment variables with secrets
- Any file containing API keys or tokens

### Git Ignore Configuration

Claude Code **automatically ignores** `.claude/settings.local.json` - no manual `.gitignore` entry needed.

**Verify auto-ignore:**
```bash
git check-ignore .claude/settings.local.json
# Should output: .claude/settings.local.json
```

### PR Workflow for Configuration Changes

**When updating team configurations:**

1. **Create feature branch:**
   ```bash
   git checkout -b config/add-api-validator-skill
   ```

2. **Make changes:**
   ```bash
   # Add new skill
   mkdir -p .claude/skills/api-validator
   # ... create SKILL.md
   ```

3. **Test locally first:**
   ```bash
   # Verify skill works
   claude skills list | grep api-validator
   ```

4. **Commit with descriptive message:**
   ```bash
   git add .claude/skills/api-validator/
   git commit -m "feat: Add API validator skill

   - Validates endpoints against OpenAPI spec
   - Checks request/response schemas
   - Reports discrepancies and suggests fixes
   - Auto-activates after API implementation"
   ```

5. **Create PR:**
   ```bash
   gh pr create \
     --title "feat: Add API validator skill" \
     --body "Adds automatic API endpoint validation against OpenAPI specs. See .claude/skills/api-validator/SKILL.md for details."
   ```

6. **Get team review:**
   - Request review from tech lead
   - Demo the skill in PR comments
   - Address feedback

7. **Merge and notify:**
   ```bash
   gh pr merge
   # Notify team in Slack to pull latest configs
   ```

### Synchronization

**Team members get updates:**
```bash
# Pull latest changes (includes .claude/ updates)
git pull origin main

# Verify new configurations
claude config show
claude skills list
claude commands list

# Restart Claude Code to apply changes
claude restart
```

---

## Onboarding Checklist

### For New Developers

**Day 1: Setup**
- [ ] Clone repository: `git clone https://github.com/claycampbell/blueprint.git`
- [ ] Review team config: `cat .claude/settings.json`
- [ ] Read configuration guide: `cat .claude/README.md`
- [ ] Read this guide: `docs/planning/CLAUDE_CODE_CONFIGURATION_GUIDE.md`

**Day 1: Configuration**
- [ ] Verify Claude Code recognizes settings: `claude config show`
- [ ] List team plugins: `claude plugins list`
- [ ] List team skills: `claude skills list`
- [ ] List team commands: `claude commands list`

**Day 1: Optional Customization**
- [ ] Create `.claude/settings.local.json` for personal preferences (optional)
- [ ] Configure MCP servers in `~/.claude.json` (optional)

**Day 2: Onboarding Exercise**
- [ ] Read onboarding guide: `docs/planning/LOCALSTACK_HEPHAESTUS_ONBOARDING.md`
- [ ] Create feature branch: `git checkout -b <name>/localstack-setup`
- [ ] Start Epic DP01-65 in Jira
- [ ] Complete LocalStack setup with Claude Code assistance
- [ ] Submit for tech lead review

**Week 1: Contributing**
- [ ] Create first custom slash command (if needed)
- [ ] Contribute to team skills (if applicable)
- [ ] Understand CLAUDE.md sync process
- [ ] Join #blueprint-dev Slack channel for config discussions

### For Tech Leads

**When Onboarding New Developer:**
- [ ] Ensure repository access granted
- [ ] Review this guide with developer
- [ ] Explain team configuration philosophy
- [ ] Demo key skills and commands
- [ ] Schedule DP01-65 review session
- [ ] Monitor first week for configuration issues

**Regular Maintenance:**
- [ ] Review team configurations quarterly
- [ ] Audit skills for relevance and accuracy
- [ ] Update permissions as project evolves
- [ ] Document new patterns in CLAUDE.md
- [ ] Ensure configurations stay in sync with PRD

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "My local settings are affecting teammates"

**Symptoms:** Teammates complain about unexpected permissions or behaviors

**Cause:** Modifying `.claude/settings.json` instead of `.claude/settings.local.json`

**Solution:**
```bash
# 1. Check which file you modified
git status .claude/

# 2. If settings.json was modified unintentionally, revert
git checkout .claude/settings.json

# 3. Move changes to settings.local.json
cat > .claude/settings.local.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash(my-custom-script:*)"
    ]
  }
}
EOF

# 4. Restart Claude Code
claude restart
```

---

#### Issue: "Custom command not showing up"

**Symptoms:** `/my-command` not found, command doesn't appear in `claude commands list`

**Solutions:**

**1. Verify file location:**
```bash
# Commands must be in .claude/commands/ (not ~/.claude/commands/)
ls -la .claude/commands/my-command.md

# If in wrong location, move it
mv ~/.claude/commands/my-command.md .claude/commands/
```

**2. Check filename:**
```bash
# File must end with .md
ls .claude/commands/my-command.*

# If wrong extension, rename
mv .claude/commands/my-command.txt .claude/commands/my-command.md
```

**3. Verify YAML frontmatter:**
```bash
cat .claude/commands/my-command.md
# Should start with:
# ---
# description: "..."
# ---
```

**4. Restart Claude Code:**
```bash
claude restart
claude commands list | grep my-command
```

---

#### Issue: "MCP server not connecting"

**Symptoms:** MCP server appears offline, tools not available

**Diagnosis:**
```bash
# 1. List servers
claude mcp list

# 2. Check server status
claude mcp status myserver

# 3. View logs
claude mcp logs myserver

# 4. Test connection
claude mcp test myserver
```

**Solutions:**

**1. Check `.mcp.json` syntax:**
```bash
# Validate JSON
cat .mcp.json | python -m json.tool

# Common issues:
# - Missing commas
# - Unclosed brackets
# - Invalid escape sequences
```

**2. Verify environment variables:**
```bash
# Check required env vars are set
echo $JIRA_API_TOKEN
echo $DATABASE_URL

# If missing, set them
export JIRA_API_TOKEN="your_token"

# Or add to .env file
echo "JIRA_API_TOKEN=your_token" >> .env
```

**3. Check command is executable:**
```bash
# Verify command exists
which npx
which node
which python

# For custom scripts, check permissions
chmod +x scripts/mcp-server.js
```

**4. Review server logs for errors:**
```bash
claude mcp logs myserver --follow
```

---

#### Issue: "Permission denied for tool"

**Symptoms:** Claude asks for approval even though tool should be allowed

**Diagnosis:**
```bash
# 1. Check current permissions
claude config show | grep -A 20 permissions

# 2. Verify precedence
# Local > Team > User > Default
```

**Solutions:**

**1. Add to local settings (quick fix):**
```bash
cat >> .claude/settings.local.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash(git commit:*)"
    ]
  }
}
EOF
```

**2. Or update team settings (permanent fix):**
```bash
# Edit .claude/settings.json
# Add to permissions.allow array
# Create PR for team approval
```

**3. Restart Claude Code:**
```bash
claude restart
```

---

#### Issue: "Skill not activating automatically"

**Symptoms:** Skill exists but Claude doesn't use it when appropriate

**Diagnosis:**
```bash
# 1. List skills
claude skills list

# 2. Check skill description
cat .claude/skills/my-skill/SKILL.md | head -10

# 3. Verify skill structure
ls .claude/skills/my-skill/
# Must have SKILL.md at minimum
```

**Solutions:**

**1. Improve skill description:**
```yaml
---
name: "my-skill"
description: "Be very specific about WHEN to use this skill. Include trigger conditions, use cases, and scenarios. This description determines automatic activation."
---
```

**2. Add concrete examples in SKILL.md:**
```markdown
## When to Use
- After implementing new API endpoints
- When user mentions "validate API"
- Before creating PRs with API changes
```

**3. Restart Claude Code:**
```bash
claude restart
```

**4. Test skill manually:**
```
User: "Use the api-validator skill to check my endpoint"
```

---

#### Issue: "CLAUDE.md out of sync across developers"

**Symptoms:** Different developers have different CLAUDE.md versions

**Diagnosis:**
```bash
# Check if local CLAUDE.md differs from main
git fetch origin main
git diff origin/main HEAD -- CLAUDE.md
```

**Solution:**
```bash
# 1. If you didn't intentionally modify CLAUDE.md, restore from main
git checkout origin/main -- CLAUDE.md
git commit -m "sync: Restore CLAUDE.md from main"

# 2. If you made intentional improvements:
# Create separate PR for CLAUDE.md changes
git checkout -b docs/improve-claude-md
git add CLAUDE.md
git commit -m "docs: Improve CLAUDE.md with [description]"
gh pr create

# 3. Merge CLAUDE.md PR first
# Then rebase your feature branch
git checkout feature/my-work
git rebase origin/main
```

**Prevention:**
- GitHub Action `.github/workflows/claude-md-sync-check.yml` warns on PRs
- See [docs/diagrams/CLAUDE_MD_SYNC_FLOW.md](../diagrams/CLAUDE_MD_SYNC_FLOW.md)

---

#### Issue: "Hook not executing"

**Symptoms:** Hook script exists but doesn't run

**Diagnosis:**
```bash
# 1. Check hook configuration
cat .claude/hooks/config.json

# 2. Verify script exists and is executable
ls -la .claude/hooks/scripts/my-hook.sh
chmod +x .claude/hooks/scripts/my-hook.sh

# 3. Check logs
claude logs | grep hook
```

**Solutions:**

**1. Fix matcher pattern:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit:*)",  // Must match exactly
        "hooks": [...]
      }
    ]
  }
}
```

**2. Make script executable:**
```bash
chmod +x .claude/hooks/scripts/my-hook.sh
```

**3. Test hook manually:**
```bash
# Run script directly
.claude/hooks/scripts/my-hook.sh

# Check exit code
echo $?  # Should be 0 for success
```

**4. Review hook output:**
```bash
# Hooks should write to stdout/stderr
# Claude Code captures this output
claude logs --follow
```

---

### Getting Help

**Internal Resources:**
- **Configuration README:** [.claude/README.md](../.claude/README.md)
- **CLAUDE.md:** Project-wide instructions
- **Slack Channel:** #blueprint-dev
- **Tech Lead:** Schedule 1:1 for configuration questions

**External Resources:**
- **Official Docs:** https://code.claude.com/docs/
- **Settings Guide:** https://code.claude.com/docs/en/settings.md
- **Commands Guide:** https://code.claude.com/docs/en/slash-commands.md
- **Skills Guide:** https://code.claude.com/docs/en/skills.md
- **Hooks Guide:** https://code.claude.com/docs/en/hooks-guide.md
- **MCP Guide:** https://code.claude.com/docs/en/mcp.md

**Reporting Issues:**
- **Configuration bugs:** Create issue in this repo tagged `claude-config`
- **Claude Code bugs:** Report at https://github.com/anthropics/claude-code/issues
- **Documentation improvements:** Submit PR to this guide

---

## Appendix A: Configuration Precedence Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│                  Configuration Loading Order                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Default Settings │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  User Settings   │
                    │ ~/.claude/       │
                    │ settings.json    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Team Settings   │
                    │ .claude/         │
                    │ settings.json    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Local Settings   │
                    │ .claude/         │
                    │settings.local.json│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ CLI Arguments    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Enterprise       │
                    │ Managed Policies │
                    │ (Non-overridable)│
                    └──────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Final Config     │
                    │ Applied to       │
                    │ Claude Code      │
                    └──────────────────┘
```

---

## Appendix B: Quick Reference Cards

### Command Cheat Sheet

```bash
# Configuration
claude config show                    # View current configuration
claude config validate                # Validate configuration files
claude restart                        # Restart Claude Code (apply changes)

# Skills
claude skills list                    # List all available skills
claude skills info <skill-name>       # Show skill details
claude skills reload                  # Reload skills from disk

# Commands
claude commands list                  # List all slash commands
claude commands info /<command>       # Show command details

# MCP Servers
claude mcp list                       # List configured MCP servers
claude mcp status <server>            # Check server status
claude mcp logs <server>              # View server logs
claude mcp test <server>              # Test server connection
claude mcp add <server> <args>        # Add new MCP server
claude mcp remove <server>            # Remove MCP server

# Debugging
claude logs                           # View Claude Code logs
claude logs --follow                  # Tail logs in real-time
claude version                        # Show Claude Code version
claude doctor                         # Run diagnostic checks
```

### File Path Quick Reference

```
User-Level (NOT in Git):
  ~/.claude/settings.json             # Personal settings across all projects
  ~/.claude.json                      # Personal MCP servers
  ~/.claude/commands/                 # Personal slash commands
  ~/.claude/skills/                   # Personal skills

Project-Level (IN Git):
  .claude/settings.json               # Team-shared settings
  .claude/README.md                   # Configuration docs
  .claude/commands/                   # Team slash commands
  .claude/skills/                     # Team skills
  .claude/hooks/                      # Team hooks
  .mcp.json                           # Project MCP servers
  CLAUDE.md                           # Project instructions

Project-Level (NOT in Git):
  .claude/settings.local.json         # Personal overrides (auto-ignored)
  .env                                # Environment variables (manual ignore)
```

---

## Document Status

**Version:** 1.0
**Last Updated:** December 14, 2024
**Maintained By:** Blueprint Platform Team
**Next Review:** March 14, 2025 (quarterly)

**Change Log:**
- **2024-12-14:** Initial version created with complete configuration guide
- **2024-12-14:** Added troubleshooting section and quick reference cards
- **2024-12-14:** Integrated with CLAUDE.md and onboarding documentation

---

**Questions or suggestions for this guide?** Create an issue tagged `claude-config` or discuss in #blueprint-dev Slack channel.
