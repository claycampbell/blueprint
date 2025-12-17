#!/usr/bin/env python3
"""
Find available Track 3 tasks (unassigned or ready for development).

Usage:
    python scripts/get-available-track3-tasks.py
"""

import os
import sys
import requests
from requests.auth import HTTPBasicAuth

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"
PROJECT_KEY = "DP01"

# Get credentials from environment variables
JIRA_EMAIL = os.getenv("JIRA_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")

if not JIRA_EMAIL or not JIRA_API_TOKEN:
    print("[ERROR] JIRA_EMAIL and JIRA_API_TOKEN environment variables must be set")
    print("        Set them in your shell or .env file")
    sys.exit(1)


def search_issues(auth, jql, max_results=100):
    """Search Jira issues using JQL."""
    payload = {
        "jql": jql,
        "maxResults": max_results,
        "fields": ["summary", "status", "assignee", "priority", "created", "updated", "labels", "parent", "customfield_10014"]
    }

    response = requests.post(
        f"{JIRA_API_URL}/search",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 200:
        data = response.json()
        return data['issues']
    else:
        print(f"[ERROR] Search failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return []


def format_issue(issue):
    """Format issue for display."""
    key = issue['key']
    summary = issue['fields']['summary']
    status = issue['fields']['status']['name']
    priority = issue['fields']['priority']['name'] if issue['fields'].get('priority') else 'None'
    assignee = issue['fields']['assignee']['displayName'] if issue['fields'].get('assignee') else 'Unassigned'
    labels = ', '.join(issue['fields'].get('labels', []))
    epic_link = issue['fields'].get('parent', {}).get('key', '')

    return {
        'key': key,
        'summary': summary,
        'status': status,
        'priority': priority,
        'assignee': assignee,
        'labels': labels,
        'epic': epic_link,
        'url': f"{JIRA_BASE_URL}/browse/{key}"
    }


def print_issue_list(title, issues):
    """Print formatted list of issues."""
    print(f"\n{'='*80}")
    print(f"{title}")
    print(f"{'='*80}")

    if not issues:
        print("  No issues found.")
        return

    for idx, issue in enumerate(issues, 1):
        print(f"\n{idx}. [{issue['key']}] {issue['summary']}")
        print(f"   Status: {issue['status']} | Priority: {issue['priority']} | Assignee: {issue['assignee']}")
        if issue['epic']:
            print(f"   Epic: {issue['epic']}")
        if issue['labels']:
            print(f"   Labels: {issue['labels']}")
        print(f"   URL: {issue['url']}")


def main():
    """Main function to find available Track 3 tasks."""
    auth = HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN)

    # Verify authentication
    print("[INFO] Authenticating with Jira...")
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        sys.exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']}")
    print(f"[OK] Finding available Track 3 tasks...\n")

    # Find unassigned Track 3 tasks
    print("[INFO] Searching for unassigned Track 3 tasks...")
    jql = f"project = {PROJECT_KEY} AND labels = 'Track-3-Platform' AND assignee is EMPTY AND status != Done ORDER BY priority DESC, created ASC"
    unassigned = search_issues(auth, jql)
    print(f"[OK] Found {len(unassigned)} unassigned Track 3 tasks")

    # Find Track 3 tasks ready for development
    print("[INFO] Searching for Track 3 tasks ready for development...")
    jql = f"project = {PROJECT_KEY} AND labels = 'Track-3-Platform' AND status = 'Ready for Development' ORDER BY priority DESC"
    ready = search_issues(auth, jql)
    print(f"[OK] Found {len(ready)} Track 3 tasks ready for development")

    # Find Track 3 tasks in To Do status
    print("[INFO] Searching for Track 3 tasks in backlog...")
    jql = f"project = {PROJECT_KEY} AND labels = 'Track-3-Platform' AND status = 'To Do' ORDER BY priority DESC"
    todo = search_issues(auth, jql)
    print(f"[OK] Found {len(todo)} Track 3 tasks in To Do")

    # Display results
    if unassigned:
        unassigned_formatted = [format_issue(i) for i in unassigned]
        print_issue_list("TRACK 3 - UNASSIGNED TASKS (Pick one!)", unassigned_formatted)

    if ready:
        ready_formatted = [format_issue(i) for i in ready]
        print_issue_list("TRACK 3 - READY FOR DEVELOPMENT", ready_formatted)

    if todo:
        todo_formatted = [format_issue(i) for i in todo]
        print_issue_list("TRACK 3 - TO DO (Backlog)", todo_formatted[:10])

    # Summary
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"  Unassigned: {len(unassigned)}")
    print(f"  Ready for Development: {len(ready)}")
    print(f"  To Do (Backlog): {len(todo)}")
    print(f"  Total Available: {len(unassigned) + len(ready) + len(todo)}")
    print()

    if not (unassigned or ready or todo):
        print("[INFO] No Track 3 tasks available for assignment.")
        print("        Check with your team lead for next priorities.")
    else:
        print("[NEXT STEPS]")
        print("  1. Pick a task from the lists above")
        print("  2. Assign it to yourself in Jira")
        print("  3. Transition to 'In Progress'")
        print("  4. Start working!")

    print(f"{'='*80}\n")


if __name__ == "__main__":
    main()
