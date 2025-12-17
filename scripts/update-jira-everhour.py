"""
Update Jira tasks related to Everhour integration work.
"""

import requests
from requests.auth import HTTPBasicAuth
import sys

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"
PROJECT_KEY = "DP01"

# Everhour integration work summary
WORK_COMPLETED = """
# Everhour Integration - Completed Work

## What Was Done:

### 1. API Research and Documentation
- Researched Everhour REST API v1 capabilities
- Created comprehensive integration guide (EVERHOUR_API_INTEGRATION_GUIDE.md)
- Documented all major endpoints and authentication methods

### 2. Created Everhour Integration Skill
- Built complete Claude Code skill for Everhour automation
- 11 core API functions (time entries, projects, tasks, timers, estimates)
- Integration with Jira via task IDs
- Location: .claude/skills/everhour-integration/SKILL.md

### 3. Time Entry Population Scripts
Created Python scripts for bulk time entry management:
- test-everhour-api.py - API connectivity verification
- find-dp01-project.py - Project discovery (DP01: jr:6091-12165)
- populate-time-entries.py - Nov 24-28 week (20 hours)
- populate-dec1-week.py - Dec 1-5 week (20 hours)
- populate-dec8-week.py - Dec 8-12 week (20 hours)
- verify-time-entries.py - Verification for Nov 24-28
- verify-dec1-week.py - Verification for Dec 1-5
- verify-dec8-week.py - Verification for Dec 8-12
- delete-time-entries.py - Cleanup script for errors

### 4. Bug Fixes
- Fixed critical 1000x error (milliseconds vs seconds conversion)
- Everhour API uses SECONDS not milliseconds for time values
- Updated all scripts to use correct conversion: hours * 3600

### 5. CLAUDE.md Updates
- Added comprehensive time tracking guidelines
- Best practices for logging time on DP01 tasks
- Integration instructions for developers

## Time Logged:
- **November 24-28, 2025:** 20 hours (12 entries)
- **December 1-5, 2025:** 20 hours (12 entries)
- **December 8-12, 2025:** 20 hours (12 entries)
- **Total:** 60 hours across 36 time entries

## Key Technical Details:
- Everhour API Base: https://api.everhour.com
- Authentication: X-Api-Key header
- DP01 Project ID: jr:6091-12165 (147 tasks)
- Time unit: SECONDS (not milliseconds!)
- Jira sync: One-way (Everhour → Jira work logs)

## Deliverables:
- ✅ API integration guide (720 lines)
- ✅ Claude Code skill (everhour-integration)
- ✅ 9 Python automation scripts
- ✅ 60 hours of time entries populated
- ✅ CLAUDE.md documentation updated
- ✅ Bug fixes and verification
"""

def get_auth():
    """Get Jira authentication."""
    email = "clay.campbell@vividcg.com"
    # API token should be passed as command line argument
    if len(sys.argv) < 2:
        print("[ERROR] Usage: python update-jira-everhour.py <api-token>")
        sys.exit(1)

    api_token = sys.argv[1]
    return HTTPBasicAuth(email, api_token)

def search_issues(auth, jql):
    """Search for issues using JQL."""
    params = {
        "jql": jql,
        "maxResults": 50,
        "fields": "key,summary,status,description,assignee"
    }

    response = requests.get(
        f"{JIRA_API_URL}/search",
        auth=auth,
        params=params
    )

    if response.status_code == 200:
        data = response.json()
        return data['issues']
    else:
        print(f"[ERROR] Search failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return []

def add_comment(auth, issue_key, comment_text):
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
        f"{JIRA_API_URL}/issue/{issue_key}/comment",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        print(f"[OK] Added comment to {issue_key}")
        return True
    else:
        print(f"[ERROR] Failed to add comment: {response.status_code}")
        print(f"   Response: {response.text}")
        return False

def add_worklog(auth, issue_key, time_spent, comment=""):
    """Log time spent on an issue."""
    payload = {
        "timeSpent": time_spent
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
        f"{JIRA_API_URL}/issue/{issue_key}/worklog",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        print(f"[OK] Logged {time_spent} on {issue_key}")
        return True
    else:
        print(f"[ERROR] Failed to log work: {response.status_code}")
        print(f"   Response: {response.text}")
        return False

def get_transitions(auth, issue_key):
    """Get available transitions for an issue."""
    response = requests.get(
        f"{JIRA_API_URL}/issue/{issue_key}/transitions",
        auth=auth
    )

    if response.status_code == 200:
        return response.json()['transitions']
    else:
        print(f"[ERROR] Failed to get transitions: {response.status_code}")
        return []

def transition_issue(auth, issue_key, transition_name):
    """Transition an issue to a new status."""
    transitions = get_transitions(auth, issue_key)
    transition = next((t for t in transitions if t['name'].lower() == transition_name.lower()), None)

    if not transition:
        print(f"[WARN] Transition '{transition_name}' not available for {issue_key}")
        return False

    payload = {
        "transition": {"id": transition['id']}
    }

    response = requests.post(
        f"{JIRA_API_URL}/issue/{issue_key}/transitions",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 204:
        print(f"[OK] Transitioned {issue_key} to '{transition_name}'")
        return True
    else:
        print(f"[ERROR] Failed to transition: {response.status_code}")
        return False

def main():
    """Update Jira tasks with Everhour integration work."""
    print("Updating Jira tasks for Everhour integration work")
    print("=" * 80)

    auth = get_auth()

    # Verify authentication
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        sys.exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']}")
    print()

    # Search for Everhour/time tracking related issues
    print("[SEARCH] Looking for Everhour/time tracking related issues...")
    jql = f"project = {PROJECT_KEY} AND (summary ~ 'everhour' OR summary ~ 'time tracking' OR labels = 'integration')"
    issues = search_issues(auth, jql)

    print(f"[OK] Found {len(issues)} issues\n")

    if len(issues) == 0:
        print("[INFO] No existing Everhour issues found.")
        print("[INFO] You may want to create a new issue for this integration work.")
        print("\nSuggested issue:")
        print("  Summary: Everhour Time Tracking Integration")
        print("  Type: Task")
        print("  Labels: integration, time-tracking, automation")
        print("  Description: See WORK_COMPLETED in this script")
        return

    # Display found issues
    for issue in issues:
        print(f"  {issue['key']}: {issue['fields']['summary']}")
        print(f"           Status: {issue['fields']['status']['name']}")

    print("\n" + "=" * 80)
    print("Select an action:")
    print("  1. Add completion comment to all issues")
    print("  2. Add work log to specific issue")
    print("  3. Transition specific issue to Done")
    print("  4. Do all of the above for a specific issue")
    print("  5. Exit")

    choice = input("\nEnter choice (1-5): ").strip()

    if choice == "1":
        print("\nAdding completion comment to all issues...")
        for issue in issues:
            add_comment(auth, issue['key'], WORK_COMPLETED)

    elif choice == "2":
        issue_key = input("Enter issue key (e.g., DP01-123): ").strip()
        time_spent = input("Enter time spent (e.g., 20h, 2d): ").strip()
        add_worklog(auth, issue_key, time_spent, "Everhour integration completed")

    elif choice == "3":
        issue_key = input("Enter issue key (e.g., DP01-123): ").strip()
        transition_issue(auth, issue_key, "Done")

    elif choice == "4":
        issue_key = input("Enter issue key (e.g., DP01-123): ").strip()
        time_spent = input("Enter time spent (e.g., 20h, 2d): ").strip()

        print(f"\n[STARTED] Updating {issue_key}...\n")
        add_comment(auth, issue_key, WORK_COMPLETED)
        add_worklog(auth, issue_key, time_spent, "Everhour integration and time entry population")
        transition_issue(auth, issue_key, "Done")

        print(f"\n[SUCCESS] {issue_key} updated completely")

    elif choice == "5":
        print("[EXIT] No changes made")

    else:
        print("[ERROR] Invalid choice")

if __name__ == "__main__":
    main()
