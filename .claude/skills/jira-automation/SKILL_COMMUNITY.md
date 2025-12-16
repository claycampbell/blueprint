---
name: jira-automation
description: Complete Jira automation toolkit using REST API - create, update, search, transition issues, manage sprints, add comments, link issues, and more. Community-ready with environment variable configuration.
version: 2.1
author: Blueprint/Datapage Project
license: MIT
---

# Jira Automation Skill (Community Edition)

Complete Jira automation toolkit using REST API as a drop-in replacement for Atlassian MCP. Supports all major Jira operations with secure environment variable configuration.

## Quick Start

### 1. Install Dependencies

```bash
pip install requests python-dotenv
```

### 2. Configure Environment Variables

Create a `.env` file in your project root (**DO NOT COMMIT THIS FILE**):

```bash
# .env
JIRA_BASE_URL=https://your-company.atlassian.net
JIRA_EMAIL=your.email@company.com
JIRA_API_TOKEN=your_api_token_here
JIRA_PROJECT_KEY=YOUR_PROJECT
```

**Get your API token:** https://id.atlassian.com/manage-profile/security/api-tokens

### 3. Add .env to .gitignore

```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo "*.env" >> .gitignore
```

### 4. Use the Skill

```python
#!/usr/bin/env python3
import os
from dotenv import load_dotenv
import requests
from requests.auth import HTTPBasicAuth

# Load environment variables
load_dotenv()

JIRA_BASE_URL = os.getenv('JIRA_BASE_URL')
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"
JIRA_EMAIL = os.getenv('JIRA_EMAIL')
JIRA_API_TOKEN = os.getenv('JIRA_API_TOKEN')
PROJECT_KEY = os.getenv('JIRA_PROJECT_KEY')

auth = HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN)

# Now use any of the functions below...
```

## When to Use This Skill

**Issue Management:**
- Create single or multiple Jira issues from specifications
- Update existing issues (fields, status, assignee, etc.)
- Search and filter issues using JQL (Jira Query Language)
- Get detailed issue information
- Delete issues (with caution)

**Workflow & Status:**
- Transition issues through workflow states (To Do → In Progress → Done)
- Get available transitions for an issue
- Track issue status across projects

**Collaboration:**
- Add comments to issues
- Mention users in comments with @username
- Update issue descriptions with findings

**Agile & Sprint Management:**
- Create and update sprints
- Link issues to epics
- Get board and sprint information
- Manage sprint issues and backlog

**Issue Relationships:**
- Link related issues (blocks, relates to, duplicates, etc.)
- Remove issue links
- Create parent-child relationships

**Project & Version Management:**
- Get all projects and their details
- Create and manage project versions
- Get project-specific issues

**Time Tracking:**
- Add work logs to issues
- Track time spent on tasks

## Core Functions Library

Copy these functions into your scripts as needed:

### Authentication Helper

```python
import os
from dotenv import load_dotenv
import requests
from requests.auth import HTTPBasicAuth

def get_jira_auth():
    """Load credentials from environment and return auth object."""
    load_dotenv()

    jira_email = os.getenv('JIRA_EMAIL')
    jira_token = os.getenv('JIRA_API_TOKEN')

    if not jira_email or not jira_token:
        raise ValueError("JIRA_EMAIL and JIRA_API_TOKEN must be set in environment")

    return HTTPBasicAuth(jira_email, jira_token)

def get_jira_config():
    """Get Jira configuration from environment."""
    load_dotenv()

    return {
        'base_url': os.getenv('JIRA_BASE_URL'),
        'api_url': f"{os.getenv('JIRA_BASE_URL')}/rest/api/3",
        'project_key': os.getenv('JIRA_PROJECT_KEY'),
        'auth': get_jira_auth()
    }
```

### 1. Search Issues with JQL

```python
def search_issues(auth, jira_api_url, jql, max_results=50):
    """Search Jira issues using JQL (Jira Query Language)."""
    params = {
        "jql": jql,
        "maxResults": max_results,
        "fields": "summary,status,assignee,priority,created"
    }

    response = requests.get(
        f"{jira_api_url}/search/jql",
        auth=auth,
        params=params
    )

    if response.status_code == 200:
        data = response.json()
        print(f"[OK] Found issues matching query")
        for issue in data.get('issues', []):
            print(f"  {issue['key']}: {issue['fields']['summary']}")
        return data.get('issues', [])
    else:
        print(f"[ERROR] Search failed: {response.status_code}")
        return []

# Example usage:
# config = get_jira_config()
# search_issues(config['auth'], config['api_url'], "project = DP01 AND status = 'In Progress'")
```

### 2. Get Issue Details

```python
def get_issue(auth, jira_api_url, issue_key):
    """Get complete details of a specific issue."""
    response = requests.get(
        f"{jira_api_url}/issue/{issue_key}",
        auth=auth
    )

    if response.status_code == 200:
        issue = response.json()
        print(f"[OK] {issue_key}: {issue['fields']['summary']}")
        print(f"     Status: {issue['fields']['status']['name']}")
        assignee = issue['fields'].get('assignee')
        print(f"     Assignee: {assignee['displayName'] if assignee else 'Unassigned'}")
        return issue
    else:
        print(f"[ERROR] Failed to get issue: {response.status_code}")
        return None
```

### 3. Create Issue

```python
def create_issue(auth, jira_api_url, project_key, summary, description, issue_type="Task",
                 parent_key=None, labels=None, priority="Major", time_estimate=None):
    """Create a new Jira issue."""
    payload = {
        "fields": {
            "project": {"key": project_key},
            "summary": summary,
            "description": {
                "type": "doc",
                "version": 1,
                "content": [{
                    "type": "paragraph",
                    "content": [{"type": "text", "text": description}]
                }]
            },
            "issuetype": {"name": issue_type},
            "labels": labels or [],
            "priority": {"name": priority}
        }
    }

    if parent_key:
        payload["fields"]["parent"] = {"key": parent_key}

    if time_estimate:
        payload["fields"]["timetracking"] = {
            "originalEstimate": time_estimate
        }

    response = requests.post(
        f"{jira_api_url}/issue",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        result = response.json()
        print(f"[OK] Created {result['key']}: {summary}")
        return result
    else:
        print(f"[ERROR] Failed to create issue: {response.status_code}")
        print(f"   Response: {response.text}")
        return None
```

### 4. Update Issue

```python
def update_issue(auth, jira_api_url, issue_key, fields):
    """Update fields on an existing issue."""
    payload = {"fields": fields}

    response = requests.put(
        f"{jira_api_url}/issue/{issue_key}",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 204:
        print(f"[OK] Updated {issue_key}")
        return True
    else:
        print(f"[ERROR] Failed to update: {response.status_code}")
        print(f"   Response: {response.text}")
        return False

# Example usage:
# update_issue(config['auth'], config['api_url'], "DP01-74", {
#     "summary": "New task title",
#     "priority": {"name": "High"},
#     "labels": ["urgent", "backend"]
# })
```

### 5. Transition Issue (Change Status)

```python
def get_transitions(auth, jira_api_url, issue_key):
    """Get available transitions for an issue."""
    response = requests.get(
        f"{jira_api_url}/issue/{issue_key}/transitions",
        auth=auth
    )

    if response.status_code == 200:
        transitions = response.json()['transitions']
        print(f"[OK] Available transitions for {issue_key}:")
        for t in transitions:
            print(f"     {t['id']}: {t['name']}")
        return transitions
    else:
        print(f"[ERROR] Failed to get transitions: {response.status_code}")
        return []

def transition_issue(auth, jira_api_url, issue_key, transition_id):
    """Transition an issue to a new status."""
    payload = {
        "transition": {"id": transition_id}
    }

    response = requests.post(
        f"{jira_api_url}/issue/{issue_key}/transitions",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 204:
        print(f"[OK] Transitioned {issue_key}")
        return True
    else:
        print(f"[ERROR] Failed to transition: {response.status_code}")
        return False
```

### 6. Add Comment

```python
def add_comment(auth, jira_api_url, issue_key, comment_text):
    """Add a comment to an issue."""
    payload = {
        "body": {
            "type": "doc",
            "version": 1,
            "content": [{
                "type": "paragraph",
                "content": [{
                    "type": "text",
                    "text": comment_text
                }]
            }]
        }
    }

    response = requests.post(
        f"{jira_api_url}/issue/{issue_key}/comment",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        print(f"[OK] Added comment to {issue_key}")
        return True
    else:
        print(f"[ERROR] Failed to add comment: {response.status_code}")
        return False
```

### 7. Link Issues

```python
def link_issues(auth, jira_api_url, inward_issue, outward_issue, link_type="Relates"):
    """Create a link between two issues."""
    payload = {
        "type": {"name": link_type},  # "Relates", "Blocks", "Duplicate", etc.
        "inwardIssue": {"key": inward_issue},
        "outwardIssue": {"key": outward_issue}
    }

    response = requests.post(
        f"{jira_api_url}/issueLink",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        print(f"[OK] Linked {inward_issue} {link_type} {outward_issue}")
        return True
    else:
        print(f"[ERROR] Failed to link issues: {response.status_code}")
        return False
```

### 8. Add Work Log

```python
def add_worklog(auth, jira_api_url, issue_key, time_spent, comment=""):
    """Log time spent on an issue."""
    payload = {
        "timeSpent": time_spent,  # e.g., "3h 30m", "1d", "45m"
    }

    if comment:
        payload["comment"] = {
            "type": "doc",
            "version": 1,
            "content": [{
                "type": "paragraph",
                "content": [{
                    "type": "text",
                    "text": comment
                }]
            }]
        }

    response = requests.post(
        f"{jira_api_url}/issue/{issue_key}/worklog",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        print(f"[OK] Logged {time_spent} on {issue_key}")
        return True
    else:
        print(f"[ERROR] Failed to log work: {response.status_code}")
        return False
```

### 9. Batch Create Issues

```python
def batch_create_issues(auth, jira_api_url, project_key, tasks):
    """Create multiple issues - one at a time (more reliable than bulk API)."""
    created = []
    failed = []

    for task in tasks:
        result = create_issue(
            auth, jira_api_url, project_key,
            summary=task['summary'],
            description=task['description'],
            parent_key=task.get('parent_key'),
            labels=task.get('labels', []),
            priority=task.get('priority', 'Major'),
            time_estimate=task.get('time_estimate')
        )

        if result:
            created.append(result['key'])
        else:
            failed.append(task['summary'])

    print(f"\n[SUMMARY] Created {len(created)} tasks, {len(failed)} failed")
    return created, failed
```

### 10. Get All Projects

```python
def get_all_projects(auth, jira_api_url):
    """Get list of all accessible Jira projects."""
    response = requests.get(
        f"{jira_api_url}/project",
        auth=auth
    )

    if response.status_code == 200:
        projects = response.json()
        print(f"[OK] Found {len(projects)} projects:")
        for project in projects:
            print(f"     {project['key']}: {project['name']}")
        return projects
    else:
        print(f"[ERROR] Failed to get projects: {response.status_code}")
        return []
```

## Common JQL Query Examples

```python
# Issues in specific project
"project = DP01"

# Issues assigned to you
"assignee = currentUser()"

# Issues in progress
"project = DP01 AND status = 'In Progress'"

# Recent issues (last 7 days)
"created >= -7d"

# High priority bugs
"project = DP01 AND issuetype = Bug AND priority in (High, Highest)"

# Issues with specific label
"labels = Track-3-Platform"

# Overdue issues
"duedate < now() AND status != Done"

# Complex query
"project = DP01 AND assignee = currentUser() AND status in ('To Do', 'In Progress') ORDER BY priority DESC"

# Epic and its children
"parent = DP01-21"

# Unassigned issues in current sprint
"sprint in openSprints() AND assignee is EMPTY"
```

## Complete Example: Bulk Task Creator

Save this as `create_jira_tasks.py`:

```python
#!/usr/bin/env python3
"""
Bulk create Jira tasks from epic definitions.

Usage:
    python create_jira_tasks.py [--epic EPIC_KEY] [--dry-run]
"""

import argparse
import os
from dotenv import load_dotenv
import requests
from requests.auth import HTTPBasicAuth

# Load environment
load_dotenv()

JIRA_BASE_URL = os.getenv('JIRA_BASE_URL')
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"
JIRA_EMAIL = os.getenv('JIRA_EMAIL')
JIRA_API_TOKEN = os.getenv('JIRA_API_TOKEN')
PROJECT_KEY = os.getenv('JIRA_PROJECT_KEY')

# Task definitions
EPIC_TASKS = {
    "EPIC-001": [
        {
            "summary": "Setup development environment",
            "description": "Configure local development environment with all required tools.",
            "labels": ["setup", "infrastructure"],
            "priority": "High",
            "time_estimate": "2h"
        },
        # Add more tasks...
    ]
}

def create_jira_task(auth, epic_key, task):
    """Create a single Jira task."""
    payload = {
        "fields": {
            "project": {"key": PROJECT_KEY},
            "summary": task["summary"],
            "description": {
                "type": "doc",
                "version": 1,
                "content": [{
                    "type": "paragraph",
                    "content": [{"type": "text", "text": task["description"]}]
                }]
            },
            "issuetype": {"name": "Task"},
            "parent": {"key": epic_key},
            "labels": task.get("labels", []),
            "priority": {"name": task.get("priority", "Major")}
        }
    }

    if "time_estimate" in task:
        payload["fields"]["timetracking"] = {
            "originalEstimate": task["time_estimate"]
        }

    response = requests.post(
        f"{JIRA_API_URL}/issue",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        result = response.json()
        print(f"[OK] Created {result['key']}: {task['summary']}")
        return result
    else:
        print(f"[ERROR] Failed: {task['summary']}")
        print(f"   Status: {response.status_code}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Bulk create Jira tasks")
    parser.add_argument("--epic", help="Specific epic to create tasks for")
    parser.add_argument("--dry-run", action="store_true", help="Preview without creating")
    args = parser.parse_args()

    auth = HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN)

    # Verify auth
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        return

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']}\n")

    # Process epics
    epics_to_process = [args.epic] if args.epic else EPIC_TASKS.keys()
    total_created = 0

    for epic_key in epics_to_process:
        if epic_key not in EPIC_TASKS:
            print(f"[WARN] Unknown epic: {epic_key}")
            continue

        tasks = EPIC_TASKS[epic_key]
        print(f"[EPIC] {epic_key}: {len(tasks)} tasks\n")

        if args.dry_run:
            for task in tasks:
                print(f"   - {task['summary']}")
            continue

        for task in tasks:
            if create_jira_task(auth, epic_key, task):
                total_created += 1

    print(f"\n[SUMMARY] Created {total_created} tasks")

if __name__ == "__main__":
    main()
```

## Security Best Practices

1. **Never commit credentials**
   - Add `.env` to `.gitignore`
   - Use environment variables only
   - Rotate tokens every 90 days

2. **Use read-only tokens when possible**
   - For search/query operations, use tokens with minimal permissions

3. **Validate inputs**
   - Sanitize user input before passing to Jira API
   - Validate issue keys match expected format

4. **Handle errors gracefully**
   - Don't expose API tokens in error messages
   - Log errors to files, not console in production

5. **Rate limiting**
   - Add delays between bulk operations
   - Respect Jira API rate limits (default: 10 requests/second)

## Troubleshooting

### Authentication Failed (401)
- Verify `JIRA_EMAIL` matches your Atlassian account
- Regenerate API token: https://id.atlassian.com/manage-profile/security/api-tokens
- Check `JIRA_BASE_URL` is correct (e.g., `https://company.atlassian.net`)

### Parent Epic Not Found (404)
- Verify epic key exists in Jira
- Ensure you have permission to link to the epic

### Rate Limited (429)
- Add delays: `time.sleep(0.5)` between API calls
- Reduce batch size

### Connection Timeout
- Check network connectivity
- Verify Jira instance is accessible

## Version History

- **v2.1** (2025-01-14): Community edition with environment variables
  - Removed hardcoded credentials
  - Added `.env` support with python-dotenv
  - Added security best practices
  - Simplified function signatures
  - Added complete working examples

- **v2.0** (2025-01-14): Expanded to full Jira automation toolkit
  - Added all MCP-equivalent operations
  - Sprint and board management
  - Work logging and time tracking
  - Issue relationships and linking

- **v1.0** (2025-01-14): Initial release
  - Basic task creation workflow

## Contributing

This is a community skill. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Submit a pull request

## License

MIT License - Free to use and modify

## Support

- **Jira REST API Docs**: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
- **Issue Tracker**: https://github.com/your-org/blueprint/issues
- **Discussions**: https://github.com/your-org/blueprint/discussions
