#!/usr/bin/env python3
"""
Get recent sprint work from last 7 days.

Usage:
    python scripts/get-recent-sprint-work.py
"""

import os
import sys
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load environment variables from .env file
load_dotenv()

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"
PROJECT_KEY = "DP01"

# Get credentials from environment variables
JIRA_EMAIL = os.getenv("JIRA_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")

if not JIRA_EMAIL or not JIRA_API_TOKEN:
    print("[ERROR] JIRA_EMAIL and JIRA_API_TOKEN environment variables must be set")
    print("        Set them in your .env file")
    sys.exit(1)


def search_issues(auth, jql, max_results=100):
    """Search Jira issues using JQL."""
    params = {
        "jql": jql,
        "maxResults": max_results,
        "fields": "summary,status,assignee,priority,created,updated,labels,parent"
    }

    response = requests.get(
        f"{JIRA_API_URL}/search/jql",
        auth=auth,
        params=params
    )

    if response.status_code == 200:
        data = response.json()
        return data['issues']
    else:
        print(f"[ERROR] Search failed: {response.status_code}")
        print(f"        {response.text}")
        return []


def main():
    auth = HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN)

    # Verify authentication
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        sys.exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']}\n")

    # Calculate date 7 days ago
    seven_days_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')

    # Search for issues updated in last 7 days
    jql = f"project = {PROJECT_KEY} AND updated >= '{seven_days_ago}' ORDER BY updated DESC"

    print(f"Searching: {jql}\n")
    issues = search_issues(auth, jql)

    if not issues:
        print("No issues found in last 7 days")
        return

    print(f"Found {len(issues)} issues updated in last 7 days:\n")
    print("=" * 80)

    # Group by epic
    by_epic = {}
    no_epic = []

    for issue in issues:
        fields = issue['fields']
        parent = fields.get('parent', {})

        if parent:
            epic_key = parent['key']
            epic_summary = parent['fields']['summary']
            if epic_key not in by_epic:
                by_epic[epic_key] = {'summary': epic_summary, 'issues': []}
            by_epic[epic_key]['issues'].append(issue)
        else:
            no_epic.append(issue)

    # Print by epic
    for epic_key, epic_data in sorted(by_epic.items()):
        print(f"\nEPIC: {epic_key} - {epic_data['summary']}")
        print("-" * 80)

        for issue in epic_data['issues']:
            fields = issue['fields']
            status = fields['status']['name']
            updated = fields['updated'][:10]
            assignee = fields.get('assignee', {}).get('displayName', 'Unassigned') if fields.get('assignee') else 'Unassigned'
            labels = ', '.join(fields.get('labels', []))

            print(f"  {issue['key']}: {fields['summary']}")
            print(f"    Status: {status} | Updated: {updated} | Assignee: {assignee}")
            if labels:
                print(f"    Labels: {labels}")

    # Print issues without epic
    if no_epic:
        print(f"\nISSUES WITHOUT EPIC:")
        print("-" * 80)
        for issue in no_epic:
            fields = issue['fields']
            status = fields['status']['name']
            updated = fields['updated'][:10]
            assignee = fields.get('assignee', {}).get('displayName', 'Unassigned') if fields.get('assignee') else 'Unassigned'

            print(f"  {issue['key']}: {fields['summary']}")
            print(f"    Status: {status} | Updated: {updated} | Assignee: {assignee}")

    print("\n" + "=" * 80)
    print(f"\nTotal: {len(issues)} issues")


if __name__ == "__main__":
    main()
