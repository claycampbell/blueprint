# Everhour API Integration Guide

**Created:** December 15, 2025
**Status:** Research & Planning
**Related Project:** Connect 2.0 Platform Development

## Overview

This guide documents how to programmatically access Everhour time tracking data, including integration with Jira for the DP01 project.

## What is Everhour?

Everhour is a time tracking software that integrates with Jira to provide:
- Start/stop timers for Jira issues
- Manual time entry logging
- Work log synchronization with Jira
- Budget tracking and reporting
- Team-level time tracking dashboards

**Current Setup:**
- Everhour is installed as a Jira Cloud plugin for the vividcg.atlassian.net instance
- Time entries logged in Everhour automatically sync to Jira work logs
- Requires Team plan subscription for API access

## Authentication

### Getting Your API Key

1. Sign in to Everhour at https://everhour.com
2. Click **Settings** in the left menu
3. Click **My Profile**
4. Copy your **API Token** from the **Application Access** section

### API Authentication Method

All API requests require the `X-Api-Key` header:

```bash
X-Api-Key: YOUR_API_TOKEN_HERE
```

### API Base URL

```
https://api.everhour.com
```

**Note:** Some documentation references `/v1` in the base URL, but the current API appears to work without explicit versioning.

## Core API Endpoints

Based on unofficial client implementations and integration platform documentation, here are the primary endpoints:

### 1. User Information

**Get Current User**
```http
GET /users/me
X-Api-Key: YOUR_TOKEN
```

**Response:**
```json
{
  "id": 123456,
  "name": "John Doe",
  "email": "john.doe@company.com",
  "status": "active"
}
```

### 2. Projects

**List All Projects**
```http
GET /projects
X-Api-Key: YOUR_TOKEN
```

**Response:**
```json
[
  {
    "id": "pr:123456",
    "name": "DP01 - Datapage",
    "workspace": "Jira",
    "type": "jira",
    "billing": {
      "type": "non-billable"
    }
  }
]
```

### 3. Tasks

**Get Tasks for Project**
```http
GET /projects/{project_id}/tasks
X-Api-Key: YOUR_TOKEN
```

**Get Single Task**
```http
GET /tasks/{task_id}
X-Api-Key: YOUR_TOKEN
```

**Task ID Format for Jira:**
- Jira tasks in Everhour use format: `ji:12345` (where 12345 is the internal Jira issue ID)
- Or use the Jira issue key format: `DP01-74` (may need URL encoding: `DP01-74`)

**Response:**
```json
{
  "id": "ji:12345",
  "name": "DP01-74: Set up LocalStack container configuration",
  "projects": ["pr:123456"],
  "status": "open",
  "time": {
    "total": 7200000,
    "users": {
      "123456": 7200000
    }
  }
}
```

### 4. Time Entries

**Add Time to Task**
```http
POST /tasks/{task_id}/time
X-Api-Key: YOUR_TOKEN
Content-Type: application/json

{
  "time": 3600000,
  "date": "2025-12-15",
  "comment": "Initial setup and configuration"
}
```

**Parameters:**
- `time` (required): Time in milliseconds (3600000 = 1 hour)
- `date` (optional): Date in YYYY-MM-DD format (defaults to today)
- `comment` (optional): Description of work performed (max 1000 chars for Jira sync)

**Update Time Entry**
```http
PUT /tasks/{task_id}/time
X-Api-Key: YOUR_TOKEN
Content-Type: application/json

{
  "time": 5400000,
  "date": "2025-12-15"
}
```

**Delete Time Entry**
```http
DELETE /tasks/{task_id}/time
X-Api-Key: YOUR_TOKEN
Content-Type: application/json

{
  "date": "2025-12-15"
}
```

**Get Time Records**
```http
GET /team/time
X-Api-Key: YOUR_TOKEN
```

Query parameters:
- `from`: Start date (YYYY-MM-DD)
- `to`: End date (YYYY-MM-DD)
- `users[]`: Filter by user IDs
- `projects[]`: Filter by project IDs
- `limit`: Max results (default: 1000)

**Response:**
```json
[
  {
    "id": 987654321,
    "time": 3600000,
    "date": "2025-12-15",
    "task": "ji:12345",
    "user": 123456,
    "comment": "Initial setup and configuration",
    "createdAt": "2025-12-15T10:30:00Z"
  }
]
```

### 5. Timer Operations

**Start Timer for Task**
```http
POST /timers
X-Api-Key: YOUR_TOKEN
Content-Type: application/json

{
  "task": "ji:12345"
}
```

**Get Running Timer**
```http
GET /timers/current
X-Api-Key: YOUR_TOKEN
```

**Stop Running Timer**
```http
POST /timers/current
X-Api-Key: YOUR_TOKEN
Content-Type: application/json

{
  "status": "stopped"
}
```

### 6. Task Estimates

**Set Task Estimate**
```http
POST /tasks/{task_id}/estimate
X-Api-Key: YOUR_TOKEN
Content-Type: application/json

{
  "total": 14400000
}
```

**Parameters:**
- `total`: Estimated time in milliseconds (14400000 = 4 hours)

**Delete Task Estimate**
```http
DELETE /tasks/{task_id}/estimate
X-Api-Key: YOUR_TOKEN
```

## Jira Integration Specifics

### How Everhour Syncs with Jira

**One-Way Sync:**
- Time entries logged in Everhour → Automatically appear in Jira work logs
- Native Jira work logs → Do NOT sync back to Everhour
- Historical data before enabling sync is NOT synchronized

**Sync Timing:**
- Real-time for new entries
- Updates may take a few seconds to propagate

**Data Transformations:**
- Comments limited to 1,000 characters
- Text formatting and emojis removed
- Timestamps reflect logging time, not work time
- Manual entries show calculated start times

**Requirements:**
- Everhour Team plan subscription
- Jira Cloud compatibility
- Integration enabled in Everhour settings

### Accessing Jira Issues via Everhour API

**Option 1: Query by Jira Issue Key**
```python
import requests

def get_everhour_task_by_jira_key(jira_key, api_token):
    """Get Everhour task data for a Jira issue."""
    # Everhour may accept Jira keys directly
    task_id = jira_key  # e.g., "DP01-74"

    headers = {
        "X-Api-Key": api_token,
        "Content-Type": "application/json"
    }

    response = requests.get(
        f"https://api.everhour.com/tasks/{task_id}",
        headers=headers
    )

    return response.json()
```

**Option 2: Search via Project Tasks**
```python
def get_all_jira_project_tasks(project_id, api_token):
    """Get all tasks for a Jira project in Everhour."""
    headers = {"X-Api-Key": api_token}

    response = requests.get(
        f"https://api.everhour.com/projects/{project_id}/tasks",
        headers=headers
    )

    return response.json()
```

### Getting Time Entries for Jira Issues

**Approach 1: Get All Team Time Entries (Filtered)**
```python
def get_time_for_jira_issue(jira_key, start_date, end_date, api_token):
    """Get all time entries for a specific Jira issue."""
    headers = {"X-Api-Key": api_token}

    params = {
        "from": start_date,  # "2025-12-01"
        "to": end_date,      # "2025-12-15"
        "limit": 1000
    }

    response = requests.get(
        "https://api.everhour.com/team/time",
        headers=headers,
        params=params
    )

    all_entries = response.json()

    # Filter for specific Jira issue
    issue_entries = [
        entry for entry in all_entries
        if entry.get("task") == f"ji:{jira_key}" or entry.get("task") == jira_key
    ]

    return issue_entries
```

**Approach 2: Get Task Details (Includes Time Summary)**
```python
def get_jira_issue_time_summary(jira_key, api_token):
    """Get time summary for a Jira issue from Everhour."""
    headers = {"X-Api-Key": api_token}

    response = requests.get(
        f"https://api.everhour.com/tasks/{jira_key}",
        headers=headers
    )

    task_data = response.json()

    return {
        "task": jira_key,
        "total_time_ms": task_data.get("time", {}).get("total", 0),
        "total_hours": task_data.get("time", {}).get("total", 0) / 3600000,
        "users": task_data.get("time", {}).get("users", {})
    }
```

## Python Implementation Examples

### Complete Example: Add Time to Jira Issue

```python
import requests
from datetime import datetime, timedelta

class EverhourClient:
    """Client for interacting with Everhour API."""

    def __init__(self, api_token):
        self.api_token = api_token
        self.base_url = "https://api.everhour.com"
        self.headers = {
            "X-Api-Key": api_token,
            "Content-Type": "application/json"
        }

    def get_current_user(self):
        """Get current user information."""
        response = requests.get(
            f"{self.base_url}/users/me",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

    def get_projects(self):
        """Get all projects."""
        response = requests.get(
            f"{self.base_url}/projects",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

    def get_task(self, task_id):
        """Get task details (works with Jira issue keys)."""
        response = requests.get(
            f"{self.base_url}/tasks/{task_id}",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

    def add_time_to_task(self, task_id, hours, date=None, comment=None):
        """Add time entry to a task.

        Args:
            task_id: Everhour task ID or Jira issue key (e.g., "DP01-74")
            hours: Time in hours (converted to milliseconds)
            date: Date string in YYYY-MM-DD format (defaults to today)
            comment: Optional description (max 1000 chars for Jira sync)
        """
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")

        time_ms = int(hours * 3600000)  # Convert hours to milliseconds

        payload = {
            "time": time_ms,
            "date": date
        }

        if comment:
            payload["comment"] = comment[:1000]  # Limit for Jira sync

        response = requests.post(
            f"{self.base_url}/tasks/{task_id}/time",
            headers=self.headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()

    def get_time_entries(self, start_date, end_date, project_ids=None, user_ids=None):
        """Get time entries for a date range.

        Args:
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            project_ids: Optional list of project IDs to filter
            user_ids: Optional list of user IDs to filter
        """
        params = {
            "from": start_date,
            "to": end_date,
            "limit": 1000
        }

        if project_ids:
            params["projects[]"] = project_ids
        if user_ids:
            params["users[]"] = user_ids

        response = requests.get(
            f"{self.base_url}/team/time",
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()

    def start_timer(self, task_id):
        """Start timer for a task."""
        payload = {"task": task_id}
        response = requests.post(
            f"{self.base_url}/timers",
            headers=self.headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()

    def stop_timer(self):
        """Stop currently running timer."""
        payload = {"status": "stopped"}
        response = requests.post(
            f"{self.base_url}/timers/current",
            headers=self.headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()

    def get_running_timer(self):
        """Get currently running timer."""
        response = requests.get(
            f"{self.base_url}/timers/current",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

# Usage Example
if __name__ == "__main__":
    # Initialize client
    everhour = EverhourClient(api_token="YOUR_API_TOKEN_HERE")

    # Get current user
    user = everhour.get_current_user()
    print(f"Logged in as: {user['name']}")

    # Add 2 hours to Jira issue DP01-74
    result = everhour.add_time_to_task(
        task_id="DP01-74",
        hours=2.0,
        comment="Completed LocalStack setup and configuration"
    )
    print(f"Time entry created: {result}")

    # Get task time summary
    task = everhour.get_task("DP01-74")
    total_hours = task.get("time", {}).get("total", 0) / 3600000
    print(f"Total time logged on DP01-74: {total_hours:.2f} hours")

    # Get all time entries for the last 7 days
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    entries = everhour.get_time_entries(start_date, end_date)
    print(f"Found {len(entries)} time entries in the last 7 days")
```

## Environment Variable Configuration

For secure credential management (following project standards):

**.env.example**
```bash
# Everhour Configuration
EVERHOUR_API_TOKEN=your_api_token_here
EVERHOUR_BASE_URL=https://api.everhour.com
```

**Usage with python-dotenv:**
```python
import os
from dotenv import load_dotenv

load_dotenv()

everhour = EverhourClient(
    api_token=os.getenv("EVERHOUR_API_TOKEN")
)
```

## Rate Limits

**Important:** Everhour imposes rate limits on API usage. Based on common practices:
- Recommended: Stay under 100 requests per minute
- Use bulk endpoints (like `/team/time`) instead of individual task queries when possible
- Implement retry logic with exponential backoff for 429 (Too Many Requests) responses

## Common Use Cases for Connect 2.0

### Use Case 1: Daily Time Entry Report

```python
def generate_daily_time_report(everhour_client, date):
    """Generate a report of all time entries for a specific date."""
    entries = everhour_client.get_time_entries(date, date)

    report = {}
    for entry in entries:
        task_id = entry.get("task")
        hours = entry.get("time", 0) / 3600000
        user_id = entry.get("user")

        if task_id not in report:
            report[task_id] = []

        report[task_id].append({
            "user": user_id,
            "hours": hours,
            "comment": entry.get("comment", "")
        })

    return report
```

### Use Case 2: Project Time Summary

```python
def get_project_time_summary(everhour_client, project_id, start_date, end_date):
    """Get total time logged for all tasks in a project."""
    # Get all tasks for project
    response = requests.get(
        f"{everhour_client.base_url}/projects/{project_id}/tasks",
        headers=everhour_client.headers
    )
    tasks = response.json()

    total_time_ms = 0
    task_summaries = []

    for task in tasks:
        task_time = task.get("time", {}).get("total", 0)
        total_time_ms += task_time

        task_summaries.append({
            "id": task.get("id"),
            "name": task.get("name"),
            "hours": task_time / 3600000
        })

    return {
        "project_id": project_id,
        "total_hours": total_time_ms / 3600000,
        "tasks": task_summaries
    }
```

### Use Case 3: Budget Tracking Alert

```python
def check_task_budget(everhour_client, task_id, budget_hours):
    """Check if a task is approaching budget limit."""
    task = everhour_client.get_task(task_id)

    logged_hours = task.get("time", {}).get("total", 0) / 3600000
    estimated_hours = task.get("estimate", 0) / 3600000

    budget_remaining = budget_hours - logged_hours
    percent_used = (logged_hours / budget_hours) * 100

    return {
        "task_id": task_id,
        "logged_hours": logged_hours,
        "estimated_hours": estimated_hours,
        "budget_hours": budget_hours,
        "budget_remaining": budget_remaining,
        "percent_used": percent_used,
        "over_budget": logged_hours > budget_hours
    }
```

## Integration with Jira Automation Skill

The Everhour API can be combined with the existing [Jira Automation skill](.claude/skills/jira-automation/SKILL.md) to create comprehensive project tracking:

```python
from jira_automation import get_jira_auth, get_jira_config
from everhour_client import EverhourClient

def sync_time_tracking_to_connect(jira_issue_key):
    """Get time tracking data from both Jira and Everhour."""

    # Get Jira issue details
    jira_config = get_jira_config()
    jira_response = requests.get(
        f"{jira_config['api_url']}/issue/{jira_issue_key}",
        auth=jira_config['auth']
    )
    jira_issue = jira_response.json()

    # Get Everhour time tracking
    everhour = EverhourClient(os.getenv("EVERHOUR_API_TOKEN"))
    everhour_task = everhour.get_task(jira_issue_key)

    # Combined data
    return {
        "jira_key": jira_issue_key,
        "summary": jira_issue["fields"]["summary"],
        "status": jira_issue["fields"]["status"]["name"],
        "assignee": jira_issue["fields"]["assignee"]["emailAddress"],
        "everhour_total_hours": everhour_task.get("time", {}).get("total", 0) / 3600000,
        "everhour_users": everhour_task.get("time", {}).get("users", {}),
        "jira_time_spent": jira_issue["fields"].get("timetracking", {}).get("timeSpentSeconds", 0) / 3600
    }
```

## Known Limitations

1. **Historical Data:** Pre-integration time entries are not synced
2. **One-Way Sync:** Native Jira work logs don't flow back to Everhour
3. **Comment Length:** Max 1,000 characters for Jira sync
4. **No Formatting:** Text formatting and emojis removed in sync
5. **Timestamp Handling:** Manual entries show calculated times, not actual work times
6. **Paid Plan Required:** API access requires Everhour Team plan

## Official Documentation

**Primary Resource:** https://everhour.docs.apiary.io/

**Support Articles:**
- [Do you have an API available?](https://support.everhour.com/article/426-do-you-have-an-api-available)
- [Connecting with Jira Cloud](https://support.everhour.com/article/304-connecting-with-jira-cloud)
- [Sync Everhour Time Entries to Jira Work Logs](https://everhour.com/blog/sync-everhour-time-entries-to-jira-work-logs/)

**Unofficial Resources:**
- [GitHub: everhour-api (Node.js client)](https://github.com/ben-pr-p/everhour-api)
- [Pipedream Everhour Integration](https://pipedream.com/apps/everhour)

## Next Steps for Connect 2.0 Integration

1. **Obtain API Token:** Get Everhour API token from vividcg.atlassian.net Everhour account
2. **Test Basic Endpoints:** Verify access with `/users/me` and `/projects` endpoints
3. **Map Jira Issues:** Confirm task ID format for DP01 Jira issues
4. **Create Python Service:** Build reusable Everhour service for Connect 2.0
5. **Design Data Model:** Extend Connect 2.0 database schema to store time tracking data
6. **Build Sync Job:** Create scheduled job to pull Everhour data into Connect 2.0
7. **Create Dashboards:** Build time tracking reports and budget alerts

## Related Documentation

- [JIRA_AUTOMATION_SKILL.md](.claude/skills/jira-automation/SKILL.md) - Complete Jira REST API integration
- [PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md) - Connect 2.0 requirements
- [TECHNOLOGY_STACK_DECISION.md](../../TECHNOLOGY_STACK_DECISION.md) - Technology choices

---

**Document Version:** 1.0
**Last Updated:** December 15, 2025
**Maintained By:** Connect 2.0 Platform Development Team
