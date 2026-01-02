# Developer Tools Setup Guide

**Version:** 1.0
**Last Updated:** January 2026
**Related Documents:** [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md), [.claude/README.md](../../.claude/README.md)

---

## Overview

This guide covers how to set up the integrations and tools available to developers on the Connect 2.0 project. These tools integrate with Claude Code via skills and help automate common workflows.

---

## Available Integrations

| Tool | Purpose | Skill Location |
|------|---------|----------------|
| **Jira** | Issue tracking, sprint management, task automation | `.claude/skills/jira-automation/` |
| **Everhour** | Time tracking, project time reports | `.claude/skills/everhour-integration/` |

---

## Initial Setup

### 1. Copy Environment File

```bash
# From repository root
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your credentials:

```env
# Jira Automation Configuration
JIRA_BASE_URL=https://your-company.atlassian.net
JIRA_EMAIL=your.email@company.com
JIRA_API_TOKEN=your_jira_api_token_here
JIRA_PROJECT_KEY=DP01

# Everhour Time Tracking Configuration
EVERHOUR_API_TOKEN=your_everhour_api_token_here
```

**Never commit the `.env` file.** It is automatically git-ignored.

---

## Jira Integration

### Getting Your Jira API Token

1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**
3. Name it something descriptive (e.g., "Claude Code - Connect 2.0")
4. Copy the token and add it to your `.env` file

### What You Can Do

The Jira skill enables Claude Code to:

- **Create issues** - Single or bulk task creation under epics
- **Update issues** - Modify fields, status, assignee
- **Search issues** - Query using JQL (Jira Query Language)
- **Transition issues** - Move through workflow states
- **Add comments** - Document progress and decisions
- **Link issues** - Create relationships (blocks, relates to)
- **Log work** - Track time spent on tasks
- **Manage sprints** - Create sprints, add issues

### Using the Skill

Talk to Claude Code naturally about what you need. Here are examples of how to phrase requests:

**Simple queries:**
```
"Search for all in-progress tasks assigned to me in DP01"

"What's the status of DP01-74?"

"Show me all bugs in the current sprint"
```

**Creating issues:**
```
"Create a task under epic DP01-21 for setting up the authentication service"

"Create a bug in DP01 - the login form doesn't validate email format"
```

**Updating and linking:**
```
"Transition DP01-74 to Done and add a comment that implementation is complete"

"Link DP01-85 as blocking DP01-86"
```

### Real-World Workflow Examples

These examples show how developers typically interact with Claude Code for Jira operations during actual development work.

---

#### Example 1: Reporting a Bug Found During Development

You're working on DP01-150 and discover a bug in the authentication service.

**What to tell Claude:**
```
I found a bug while working on DP01-150. The JWT token refresh endpoint returns
a 500 error when the refresh token is expired instead of a 401.

Create a bug for this in DP01, link it as blocking DP01-150, and also link it
as "relates to" DP01-123 since that's the original auth implementation story.
Add a comment to DP01-150 noting that we're blocked by this bug.
```

**What Claude will do:**
1. Create bug: "JWT refresh endpoint returns 500 instead of 401 on expired token"
2. Link the new bug as "blocks" DP01-150
3. Link the new bug as "relates to" DP01-123
4. Add comment to DP01-150 explaining the blocker

---

#### Example 2: Bug That Affects Multiple Stories

You find a database connection issue that impacts several features.

**What to tell Claude:**
```
Create a critical bug in DP01: "Database connection pool exhaustion under load"

This bug affects these stories and should be linked as blocking them:
- DP01-145 (user dashboard)
- DP01-147 (reporting module)
- DP01-152 (batch processing)

The bug was discovered while testing DP01-145, so mention that in the description.
Set priority to Highest.
```

---

#### Example 3: Completing Work and Updating Related Issues

You've finished implementing a feature and need to update Jira.

**What to tell Claude:**
```
I've completed DP01-160. Transition it to Done with a comment summarizing
what was implemented:
- Added REST endpoints for project CRUD
- Integrated with existing auth middleware
- Added unit tests (95% coverage)

Also update DP01-161 (which depends on this) with a comment that the API
is now ready for frontend integration.
```

---

#### Example 4: Creating a Bug with Full Context

You've found a bug and want to create a comprehensive ticket.

**What to tell Claude:**
```
Create a bug in DP01 with these details:

Title: File upload fails silently for files over 10MB

Description:
- Found while testing DP01-155 (document upload feature)
- Files under 10MB upload successfully
- Files over 10MB show success message but file is not saved
- No error appears in UI or logs
- Tested on Chrome and Firefox

Steps to reproduce:
1. Navigate to project documents
2. Click upload
3. Select a file larger than 10MB
4. Click submit
5. Observe success message but file missing from list

Expected: Error message or successful upload
Actual: Silent failure

Link this bug to DP01-155 (relates to) since that's where it was found.
Also link to DP01-89 (blocks) since that's the story for document management
that can't be completed until this is fixed.
```

---

#### Example 5: Sprint Planning Assistance

You need to organize work for the upcoming sprint.

**What to tell Claude:**
```
Show me all DP01 tasks that are:
- Status "To Do" or "Ready for Dev"
- Not assigned to anyone
- Have the label "Track-3-Platform"

Then for each one, tell me if it has any blockers or dependencies.
```

---

#### Example 6: End of Day Status Update

You want to update your tickets before ending the day.

**What to tell Claude:**
```
For DP01-175, add a comment with my progress update:
"Completed database migrations and repository layer. Starting service
implementation tomorrow. Estimated 4 more hours to complete."

Also transition DP01-172 to "In Review" - the PR is ready.
```

---

### Tips for Effective Jira Requests

1. **Be specific about relationships** - Say "blocks", "is blocked by", or "relates to"
2. **Reference issue keys** - Always include the full key like DP01-123
3. **Provide context** - Explain why you're creating/linking issues
4. **Batch related operations** - Ask for multiple updates in one request
5. **Include details for bugs** - Steps to reproduce, expected vs actual behavior

### Common JQL Queries

```
# Your tasks
assignee = currentUser() AND project = DP01

# Track 3 Platform tasks
project = DP01 AND labels = "Track-3-Platform"

# Current sprint
project = DP01 AND sprint in openSprints()

# Recently updated
project = DP01 AND updated >= -1d

# Unassigned tasks ready for work
project = DP01 AND status = "To Do" AND assignee is EMPTY
```

### Full Documentation

See [.claude/skills/jira-automation/SKILL.md](../../.claude/skills/jira-automation/SKILL.md) for complete API reference and code examples.

---

## Everhour Integration

### Getting Your Everhour API Token

1. Log in to [Everhour](https://app.everhour.com)
2. Go to **Settings** (gear icon) > **My Profile**
3. Scroll down to **API Token**
4. Copy the token and add it to your `.env` file

**Note:** API access requires an Everhour Team plan.

### What You Can Do

The Everhour skill enables Claude Code to:

- **Log time** - Add time entries to Jira tasks
- **View time entries** - Get your daily/weekly time logs
- **Start/stop timers** - Control active timers
- **Set estimates** - Add time estimates to tasks
- **Generate reports** - Project and task time summaries
- **Track budgets** - Monitor time against estimates

### Using the Skill

Invoke the skill by asking Claude Code to perform time tracking operations:

```
"Log 2.5 hours on DP01-74 for implementing authentication"

"Show my time entries for today"

"Start a timer on DP01-85"

"What's the total time logged on the DP01 project?"

"Set an estimate of 4 hours on DP01-90"
```

### DP01 Project Reference

- **Project ID:** `jr:6091-12165`
- **Project Name:** DP01 - Datapage Phase 1
- **Total Tasks:** 147+ tracked tasks

### Jira Sync Notes

Everhour syncs time to Jira work logs (one-way):
- Time logged in Everhour appears in Jira
- Native Jira work logs do NOT sync back to Everhour
- Comments are limited to 1,000 characters
- Formatting is stripped during sync

### Full Documentation

See [.claude/skills/everhour-integration/SKILL.md](../../.claude/skills/everhour-integration/SKILL.md) for complete API reference and code examples.

---

## Verifying Your Setup

### Test Jira Connection

Ask Claude Code:
```
"Test my Jira connection by getting details for issue DP01-1"
```

Or run the verification script:
```bash
python -c "
import os
import requests
from dotenv import load_dotenv

load_dotenv()

response = requests.get(
    f\"{os.getenv('JIRA_BASE_URL')}/rest/api/3/myself\",
    auth=(os.getenv('JIRA_EMAIL'), os.getenv('JIRA_API_TOKEN'))
)
print(f'Status: {response.status_code}')
if response.ok:
    user = response.json()
    print(f'Connected as: {user[\"displayName\"]} ({user[\"emailAddress\"]})')
"
```

### Test Everhour Connection

Ask Claude Code:
```
"Test my Everhour connection by getting my user info"
```

Or run the verification script:
```bash
python -c "
import os
import requests
from dotenv import load_dotenv

load_dotenv()

response = requests.get(
    'https://api.everhour.com/users/me',
    headers={'X-Api-Key': os.getenv('EVERHOUR_API_TOKEN')}
)
print(f'Status: {response.status_code}')
if response.ok:
    user = response.json()
    print(f'Connected as: {user[\"name\"]} ({user[\"email\"]})')
"
```

---

## Security Best Practices

1. **Never commit credentials** - Keep `.env` git-ignored
2. **Use unique tokens** - Create separate tokens for each tool/machine
3. **Rotate tokens regularly** - Every 90 days is recommended
4. **Limit token scope** - Use minimum required permissions
5. **Revoke unused tokens** - Clean up tokens for tools you no longer use

---

## Troubleshooting

### "Authentication Failed" (401)

**Jira:**
- Verify email matches your Atlassian account
- Regenerate API token at [id.atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens)
- Ensure `JIRA_BASE_URL` has no trailing slash

**Everhour:**
- Regenerate API token in Everhour settings
- Verify you have a Team plan (API requires paid plan)

### "Permission Denied" (403)

**Jira:**
- Check you have access to the project (DP01)
- Some operations require project admin permissions

**Everhour:**
- Team-level endpoints require admin role
- Use user-level endpoints (`/users/me/...`) instead

### "Rate Limited" (429)

Both APIs have rate limits:
- **Jira:** 100 requests per minute
- **Everhour:** 100 requests per minute

Add delays between bulk operations or implement retry logic.

### Environment Variables Not Loading

```bash
# Install python-dotenv if not present
pip install python-dotenv

# Verify .env file exists and has correct format
cat .env
```

---

## Related Documentation

- [.claude/README.md](../../.claude/README.md) - Claude Code configuration overview
- [Jira Automation Skill](../../.claude/skills/jira-automation/SKILL.md) - Full Jira API reference
- [Everhour Integration Skill](../../.claude/skills/everhour-integration/SKILL.md) - Full Everhour API reference
- [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - Main development workflow guide
