# Jira Automation Skill

Complete Jira automation toolkit using REST API as a drop-in replacement for Atlassian MCP.

## Quick Setup

### 1. Install Dependencies

```bash
pip install requests python-dotenv
```

### 2. Configure Credentials

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
JIRA_BASE_URL=https://your-company.atlassian.net
JIRA_EMAIL=your.email@company.com
JIRA_API_TOKEN=your_api_token_here
JIRA_PROJECT_KEY=YOUR_PROJECT
```

**Get your API token:** https://id.atlassian.com/manage-profile/security/api-tokens

### 3. Use the Skill

See [SKILL_COMMUNITY.md](SKILL_COMMUNITY.md) for complete documentation and code examples.

## What This Skill Does

- ✅ Create, update, search, and delete Jira issues
- ✅ Transition issues through workflow states
- ✅ Add comments and work logs
- ✅ Link related issues
- ✅ Manage sprints and boards
- ✅ Bulk operations for task creation
- ✅ Full JQL search support

## Community Ready

This skill is designed to be shared and reused:

- 🔒 No hardcoded credentials (uses environment variables)
- 📚 Complete documentation with examples
- 🧪 Tested and verified on real Jira instance
- 🚀 Ready to commit to version control
- 📖 MIT License

## Files

- **SKILL_COMMUNITY.md** - Complete skill documentation (commit this)
- **README.md** - This file (commit this)
- **SKILL.md** - Original version with project-specific examples (optional)

## Security

**Never commit credentials!** The `.env` file is automatically ignored by Git.

## Example: Create 10 Tasks

```python
from dotenv import load_dotenv
import os
from jira_helpers import get_jira_config, create_issue

load_dotenv()
config = get_jira_config()

for i in range(1, 11):
    create_issue(
        config['auth'],
        config['api_url'],
        config['project_key'],
        summary=f"Task {i}",
        description=f"Description for task {i}",
        parent_key="EPIC-001"
    )
```

## Contributing

Improvements welcome! Fork, modify, and submit PRs.

## License

MIT - Free to use and modify
