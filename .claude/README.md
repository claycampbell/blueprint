# Claude Code Configuration

This directory contains team-shared Claude Code configuration for the Blueprint Connect 2.0 project.

## Directory Structure

```
.claude/
├── settings.json              # Team-shared settings (committed to git)
├── settings.local.json        # Personal overrides (auto-ignored by git)
├── commands/                  # Team slash commands (committed to git)
├── skills/                    # Team agent skills (committed to git)
├── hooks/                     # Hook scripts (committed to git)
└── README.md                  # This file
```

## Files in This Directory

### settings.json (Team-Shared)
**Committed to Git:** YES

Team-wide configuration for Claude Code including:
- Default model: Claude 3.5 Sonnet
- Enabled plugins: pr-review-toolkit, feature-dev, devkit, superpowers
- Standard permission policies for git, npm, docker commands
- Feature flags (always-thinking mode enabled)

**Do not put secrets or personal preferences here.** This file is shared with all developers.

### settings.local.json (Personal)
**Committed to Git:** NO (auto-ignored by Claude Code)

Your personal overrides and machine-specific settings. This file lets you:
- Customize permissions for your development workflow
- Enable experimental features
- Add local tool allowances
- Override team settings where needed

**Note:** This file is automatically ignored by git. You can freely modify it without affecting teammates.

### commands/ (Team Slash Commands)
**Committed to Git:** YES

Custom slash commands shared across the team. Each command is a Markdown file with YAML frontmatter.

**Example:** `.claude/commands/deploy/check.md`
```markdown
---
description: "Check deployment readiness"
argument-hint: "<environment>"
allowed-tools:
  - Bash
  - Read
model: "sonnet"
---

# /check

Verify that the application is ready for deployment to $1 environment.

Steps:
1. Run tests
2. Check environment variables
3. Validate configuration
```

**Command Naming:**
- Use descriptive filenames: `migrate-db.md`, `review-pr.md`
- Organize in subdirectories: `deploy/`, `database/`, `testing/`
- Namespace prevents conflicts: `/migrate (project:database)`

### skills/ (Team Agent Skills)
**Committed to Git:** YES

Shared agent skills that extend Claude Code's capabilities. Each skill is a directory with a `SKILL.md` file.

**Example:** `.claude/skills/api-validator/SKILL.md`
```yaml
---
name: "api-validator"
description: "Validates API endpoint implementations against OpenAPI specs"
---

# API Validator Skill

## Overview
Automatically validates API endpoints against the project's OpenAPI specification.

## When to Use
- After implementing new API endpoints
- When modifying existing endpoints
- Before creating pull requests with API changes

## How It Works
1. Reads OpenAPI spec from docs/api/openapi.yaml
2. Compares implementation with spec
3. Reports discrepancies and suggests fixes
```

**Skill Structure:**
```
.claude/skills/api-validator/
├── SKILL.md              # Required - main skill definition
├── reference.md          # Optional - detailed reference
├── examples.md           # Optional - usage examples
├── scripts/              # Optional - utility scripts
└── templates/            # Optional - code templates
```

### hooks/ (Hook Scripts)
**Committed to Git:** YES

Automated scripts that run at specific lifecycle points (before/after tool use).

**Example:** `.claude/hooks/pre-commit-check.sh`
```bash
#!/bin/bash
# Pre-commit hook to validate CLAUDE.md sync
# Runs before git commit operations
```

## Configuration Precedence

When Claude Code loads settings, it applies them in this order (highest to lowest priority):

1. **Enterprise managed policies** → Non-overridable IT policies
2. **Command-line arguments** → Session-specific overrides
3. **Local project settings** → `.claude/settings.local.json`
4. **Shared project settings** → `.claude/settings.json`
5. **User settings** → `~/.claude/settings.json`

**Example:** If your `settings.local.json` allows `Bash(git commit:*)` and `settings.json` doesn't mention it, your local setting wins.

## MCP (Model Context Protocol) Configuration

MCP servers connect Claude Code to external tools and services. Configuration can be at user or project level.

### Project-Level MCP (.mcp.json in project root)
**Committed to Git:** YES

Example:
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
      "args": ["scripts/mcp-localstack-server.js"]
    }
  }
}
```

**Note:** Use environment variable references (`${VAR_NAME}`) for secrets. Never commit actual credentials.

### User-Level MCP (~/.claude.json)
**Committed to Git:** NO

Personal MCP configurations available across all projects.

## Best Practices for Team Collaboration

### ✅ DO Commit to Git
- `.claude/settings.json` - Team settings
- `.claude/commands/` - Team slash commands
- `.claude/skills/` - Team agent skills
- `.claude/hooks/` - Team hook scripts
- `.mcp.json` - MCP server configurations (without secrets)
- `CLAUDE.md` - Project documentation

### ❌ DO NOT Commit
- `.claude/settings.local.json` - Personal settings (auto-ignored)
- `~/.claude/` - User-level settings directory
- `~/.claude.json` - User-level MCP config
- Any files containing API keys, tokens, or credentials

### 🔒 Secrets Management
- Use environment variable references: `${API_KEY}`
- Document required environment variables in README
- Never hardcode credentials in committed files
- Use `.env` files (git-ignored) for local development

### 🔄 Sharing New Configurations
When you create a new command, skill, or hook:

1. Create it in the `.claude/` directory (not `~/.claude/`)
2. Test it locally first
3. Commit to git: `git add .claude/commands/my-new-command.md`
4. Create PR with description of what it does
5. Teammates get it automatically with `git pull`

### 📚 Onboarding New Developers
New team members should:

1. Clone the repository (gets `.claude/settings.json` automatically)
2. Review this README
3. Create `.claude/settings.local.json` for personal preferences (optional)
4. Install required plugins (listed in `settings.json`)
5. Set up any required environment variables for MCP servers

## Current Team Configuration

### Enabled Plugins
- **pr-review-toolkit@claude-code-plugins** - Comprehensive PR review agents
- **feature-dev@claude-code-plugins** - Guided feature development workflow
- **devkit@devkit-marketplace** - Developer utilities and skills
- **superpowers@superpowers-marketplace** - Advanced coding capabilities

### Project Skills
- **jira-automation** ([.claude/skills/jira-automation/SKILL.md](.claude/skills/jira-automation/SKILL.md)) - Complete Jira automation toolkit using REST API
- **everhour-integration** ([.claude/skills/everhour-integration/SKILL.md](.claude/skills/everhour-integration/SKILL.md)) - Time tracking integration via Everhour REST API
- **plan** ([.claude/skills/plan/SKILL.md](.claude/skills/plan/SKILL.md)) - Create detailed task breakdown using Claude Code To Do feature
- **scope** ([.claude/skills/scope/SKILL.md](.claude/skills/scope/SKILL.md)) - Create comprehensive project scope documents as development checklists

### Standard Permissions
All team members have these tools auto-approved:
- Git operations (`git add`, `git commit`, `git push`, `gh` CLI)
- NPM commands (`npm run *`)
- Docker commands (`docker`, `docker-compose`)
- File operations (`Read`, `Write`, `Edit`, `Glob`, `Grep`)

### Default Model
**Claude 3.5 Sonnet** - Balanced performance and capability for most development tasks

## Troubleshooting

### "My settings.local.json changes affect teammates"
- **Solution:** Check that you're modifying `.claude/settings.local.json` (project-local), not `.claude/settings.json` (team-shared)

### "Custom command not showing up"
- **Solution:**
  1. Verify file is in `.claude/commands/` (not `~/.claude/commands/`)
  2. Check filename ends with `.md`
  3. Restart Claude Code session: `claude restart`

### "MCP server not connecting"
- **Solution:**
  1. Check `.mcp.json` syntax is valid JSON
  2. Verify environment variables are set: `echo $JIRA_API_TOKEN`
  3. Check server command is executable: `which npx`
  4. Review Claude Code logs: `claude logs`

### "Permission denied for tool"
- **Solution:**
  1. Add to `.claude/settings.local.json` → `permissions.allow` array
  2. Or update team settings in `.claude/settings.json` (requires team approval)
  3. Restart Claude Code session

## Additional Resources

- **Official Claude Code Docs:** https://code.claude.com/docs/
- **Settings & Permissions:** https://code.claude.com/docs/en/settings.md
- **Custom Slash Commands:** https://code.claude.com/docs/en/slash-commands.md
- **Agent Skills:** https://code.claude.com/docs/en/skills.md
- **Hooks Guide:** https://code.claude.com/docs/en/hooks-guide.md
- **MCP Integration:** https://code.claude.com/docs/en/mcp.md

## Questions?

- **Project-specific questions:** Ask in #blueprint-dev Slack channel
- **Claude Code questions:** See https://code.claude.com/docs/ or ask Claude directly
- **Configuration issues:** Create an issue in this repo tagged `claude-config`

---

**Last Updated:** December 14, 2024
**Maintained By:** Blueprint Platform Team
