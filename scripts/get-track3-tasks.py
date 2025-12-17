#!/usr/bin/env python3
"""
Fetch Track 3 (Platform Development) tasks only.

Usage:
    python scripts/get-track3-tasks.py
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
    """Main function to fetch Track 3 tasks."""
    auth = HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN)

    # Verify authentication
    print("[INFO] Authenticating with Jira...")
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        sys.exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']}")
    print(f"[OK] Filtering for: Track-3-Platform tasks only\n")

    # Track 3 Platform Development - All tasks
    print("[INFO] Fetching Track 3 tasks in current sprint...")
    jql = f"project = {PROJECT_KEY} AND labels = 'Track-3-Platform' AND sprint in openSprints() ORDER BY status ASC, priority DESC"
    sprint_track3 = search_issues(auth, jql)
    print(f"[OK] Found {len(sprint_track3)} Track 3 tasks in sprint")

    # Track 3 - Your assigned tasks
    print("[INFO] Fetching your assigned Track 3 tasks...")
    jql = f"project = {PROJECT_KEY} AND labels = 'Track-3-Platform' AND assignee = currentUser() AND status != Done ORDER BY status ASC, priority DESC"
    my_track3 = search_issues(auth, jql)
    print(f"[OK] Found {len(my_track3)} Track 3 tasks assigned to you")

    # Track 3 - In Progress
    print("[INFO] Fetching Track 3 tasks in progress...")
    jql = f"project = {PROJECT_KEY} AND labels = 'Track-3-Platform' AND status = 'In Progress' ORDER BY updated DESC"
    in_progress_track3 = search_issues(auth, jql)
    print(f"[OK] Found {len(in_progress_track3)} Track 3 tasks in progress")

    # Track 3 - Ready for Development
    print("[INFO] Fetching Track 3 tasks ready for development...")
    jql = f"project = {PROJECT_KEY} AND labels = 'Track-3-Platform' AND status = 'Ready for Development' ORDER BY priority DESC"
    ready_track3 = search_issues(auth, jql)
    print(f"[OK] Found {len(ready_track3)} Track 3 tasks ready for development")

    # Display results
    if in_progress_track3:
        in_progress_formatted = [format_issue(i) for i in in_progress_track3]
        print_issue_list("TRACK 3 - IN PROGRESS (Finish These First)", in_progress_formatted)

    if my_track3:
        my_formatted = [format_issue(i) for i in my_track3]
        print_issue_list("TRACK 3 - YOUR ASSIGNED TASKS", my_formatted)

    if ready_track3:
        ready_formatted = [format_issue(i) for i in ready_track3]
        print_issue_list("TRACK 3 - READY FOR DEVELOPMENT", ready_formatted[:5])

    if sprint_track3:
        sprint_formatted = [format_issue(i) for i in sprint_track3]
        print_issue_list("TRACK 3 - ALL SPRINT TASKS", sprint_formatted)

    # Recommendations
    print(f"\n{'='*80}")
    print("RECOMMENDED WORK ORDER FOR TODAY (TRACK 3 ONLY)")
    print(f"{'='*80}\n")

    # Prioritize: In Progress > Assigned > Ready
    prioritized = []
    seen_keys = set()

    # Add in-progress first
    for issue in in_progress_track3:
        formatted = format_issue(issue)
        if formatted['key'] not in seen_keys:
            prioritized.append(formatted)
            seen_keys.add(formatted['key'])

    # Add assigned tasks
    for issue in my_track3:
        formatted = format_issue(issue)
        if formatted['key'] not in seen_keys:
            prioritized.append(formatted)
            seen_keys.add(formatted['key'])

    # Add ready tasks
    for issue in ready_track3[:3]:  # Top 3 ready tasks
        formatted = format_issue(issue)
        if formatted['key'] not in seen_keys:
            prioritized.append(formatted)
            seen_keys.add(formatted['key'])

    if prioritized:
        for idx, issue in enumerate(prioritized[:5], 1):
            print(f"{idx}. [{issue['key']}] {issue['summary']}")
            print(f"   Status: {issue['status']} | Priority: {issue['priority']}")

            reasons = []
            if issue['status'] == 'In Progress':
                reasons.append("IN PROGRESS - finish before starting new work")
            if issue['assignee'] == user_info['displayName']:
                reasons.append("ASSIGNED TO YOU")
            if 'Phase-1-Foundation' in issue['labels']:
                reasons.append("PHASE 1 FOUNDATION")
            if 'autonomy-high' in issue['labels']:
                reasons.append("HIGH AUTONOMY")

            if reasons:
                print(f"   Why: {', '.join(reasons)}")

            print(f"   URL: {issue['url']}\n")
    else:
        print("  No Track 3 tasks found. Great job! 🎉\n")

    print(f"{'='*80}\n")


if __name__ == "__main__":
    main()
