#!/usr/bin/env python3
"""
Fetch current sprint tasks from Jira and prioritize them.

Usage:
    python scripts/get-sprint-tasks.py
"""

import os
import sys
import requests
from requests.auth import HTTPBasicAuth
from datetime import datetime

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"
JIRA_AGILE_URL = f"{JIRA_BASE_URL}/rest/agile/1.0"
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
        f"{JIRA_API_URL}/search/jql",
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


def get_current_sprint_issues(auth):
    """Get all issues in the current active sprint."""
    jql = f"project = {PROJECT_KEY} AND sprint in openSprints() ORDER BY priority DESC, created ASC"
    return search_issues(auth, jql)


def get_my_issues(auth):
    """Get issues assigned to current user."""
    jql = f"project = {PROJECT_KEY} AND assignee = currentUser() AND status != Done ORDER BY priority DESC, updated DESC"
    return search_issues(auth, jql)


def get_in_progress_issues(auth):
    """Get all issues currently in progress."""
    jql = f"project = {PROJECT_KEY} AND status = 'In Progress' ORDER BY updated DESC"
    return search_issues(auth, jql)


def get_blocked_issues(auth):
    """Get all blocked issues."""
    jql = f"project = {PROJECT_KEY} AND status = Blocked ORDER BY priority DESC"
    return search_issues(auth, jql)


def format_issue(issue):
    """Format issue for display."""
    key = issue['key']
    summary = issue['fields']['summary']
    status = issue['fields']['status']['name']
    priority = issue['fields']['priority']['name'] if issue['fields'].get('priority') else 'None'
    assignee = issue['fields']['assignee']['displayName'] if issue['fields'].get('assignee') else 'Unassigned'
    labels = ', '.join(issue['fields'].get('labels', []))

    # Get epic link if available
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


def prioritize_tasks(issues):
    """Prioritize tasks based on status, priority, and labels."""
    # Priority scoring
    priority_scores = {
        'Highest': 5,
        'High': 4,
        'Medium': 3,
        'Low': 2,
        'Lowest': 1,
        'None': 0
    }

    # Status scoring (higher = more urgent to work on)
    status_scores = {
        'Blocked': 10,  # Need to unblock
        'In Progress': 8,  # Need to finish
        'To Do': 5,  # Ready to start
        'Ready for Development': 6,
        'Done': 0
    }

    prioritized = []
    for issue in issues:
        formatted = format_issue(issue)

        # Calculate priority score
        priority_score = priority_scores.get(formatted['priority'], 0)
        status_score = status_scores.get(formatted['status'], 0)

        # Boost for specific labels
        label_boost = 0
        if 'urgent' in formatted['labels'].lower():
            label_boost += 5
        if 'Track-3-Platform' in formatted['labels']:
            label_boost += 2

        total_score = (priority_score * 2) + status_score + label_boost

        formatted['score'] = total_score
        prioritized.append(formatted)

    # Sort by score (descending)
    return sorted(prioritized, key=lambda x: x['score'], reverse=True)


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
        print(f"   Status: {issue['status']} | Priority: {issue['priority']} | Score: {issue.get('score', 'N/A')}")
        if issue['epic']:
            print(f"   Epic: {issue['epic']}")
        if issue['labels']:
            print(f"   Labels: {issue['labels']}")
        print(f"   URL: {issue['url']}")


def main():
    """Main function to fetch and prioritize sprint tasks."""
    auth = HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN)

    # Verify authentication
    print("[INFO] Authenticating with Jira...")
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        print(f"   Response: {response.text}")
        print("\n[HINT] Make sure JIRA_EMAIL and JIRA_API_TOKEN are set correctly.")
        print("        Generate a new token at: https://id.atlassian.com/manage-profile/security/api-tokens")
        sys.exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']} ({user_info['emailAddress']})")
    print(f"[OK] Project: {PROJECT_KEY}\n")

    # Fetch different views
    print("[INFO] Fetching current sprint issues...")
    sprint_issues = get_current_sprint_issues(auth)
    print(f"[OK] Found {len(sprint_issues)} issues in current sprint")

    print("[INFO] Fetching your assigned issues...")
    my_issues = get_my_issues(auth)
    print(f"[OK] Found {len(my_issues)} issues assigned to you")

    print("[INFO] Fetching in-progress issues...")
    in_progress = get_in_progress_issues(auth)
    print(f"[OK] Found {len(in_progress)} issues in progress")

    print("[INFO] Fetching blocked issues...")
    blocked = get_blocked_issues(auth)
    print(f"[OK] Found {len(blocked)} blocked issues")

    # Display results
    if blocked:
        blocked_formatted = [format_issue(i) for i in blocked]
        print_issue_list("BLOCKED ISSUES (Need Immediate Attention)", blocked_formatted)

    if in_progress:
        in_progress_formatted = [format_issue(i) for i in in_progress]
        print_issue_list("IN PROGRESS ISSUES (Finish These First)", in_progress_formatted)

    if my_issues:
        prioritized = prioritize_tasks(my_issues)
        print_issue_list("YOUR ASSIGNED ISSUES (Prioritized)", prioritized)

    if sprint_issues:
        prioritized_sprint = prioritize_tasks(sprint_issues)
        print_issue_list("CURRENT SPRINT ISSUES (All)", prioritized_sprint[:10])  # Top 10

    # Summary and recommendations
    print(f"\n{'='*80}")
    print("RECOMMENDED WORK ORDER FOR TODAY")
    print(f"{'='*80}\n")

    # Combine and prioritize all relevant issues
    all_relevant = list(set(
        [i['key'] for i in blocked] +
        [i['key'] for i in in_progress] +
        [i['key'] for i in my_issues]
    ))

    if all_relevant:
        combined_jql = f"key in ({','.join(all_relevant)})"
        combined = search_issues(auth, combined_jql)
        prioritized_all = prioritize_tasks(combined)

        for idx, issue in enumerate(prioritized_all[:5], 1):
            print(f"{idx}. [{issue['key']}] {issue['summary']}")
            print(f"   Status: {issue['status']} | Priority: {issue['priority']}")
            print(f"   Recommended because: ", end="")

            reasons = []
            if issue['status'] == 'Blocked':
                reasons.append("BLOCKED - unblock this first")
            if issue['status'] == 'In Progress':
                reasons.append("IN PROGRESS - finish before starting new work")
            if issue['priority'] in ['Highest', 'High']:
                reasons.append("HIGH PRIORITY")
            if 'urgent' in issue['labels'].lower():
                reasons.append("URGENT")

            print(", ".join(reasons) if reasons else "Ready to work on")
            print(f"   URL: {issue['url']}\n")
    else:
        print("  No issues found. You're all caught up!")

    print(f"{'='*80}\n")


if __name__ == "__main__":
    main()
