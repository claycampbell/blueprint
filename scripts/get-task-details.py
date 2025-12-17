#!/usr/bin/env python3
"""
Fetch detailed information for specific Jira tasks.

Usage:
    python scripts/get-task-details.py DP01-6 DP01-7 DP01-8
"""

import os
import sys
import requests
from requests.auth import HTTPBasicAuth

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"

# Get credentials from environment variables
JIRA_EMAIL = os.getenv("JIRA_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")

if not JIRA_EMAIL or not JIRA_API_TOKEN:
    print("[ERROR] JIRA_EMAIL and JIRA_API_TOKEN environment variables must be set")
    print("        Set them in your shell or .env file")
    sys.exit(1)


def get_issue_details(auth, issue_key):
    """Get complete details of a specific issue."""
    response = requests.get(
        f"{JIRA_API_URL}/issue/{issue_key}",
        auth=auth
    )

    if response.status_code == 200:
        return response.json()
    else:
        print(f"[ERROR] Failed to get {issue_key}: {response.status_code}")
        return None


def get_transitions(auth, issue_key):
    """Get available transitions for an issue."""
    response = requests.get(
        f"{JIRA_API_URL}/issue/{issue_key}/transitions",
        auth=auth
    )

    if response.status_code == 200:
        return response.json()['transitions']
    else:
        print(f"[ERROR] Failed to get transitions for {issue_key}: {response.status_code}")
        return []


def format_description(desc):
    """Format Atlassian Document Format to readable text."""
    if not desc or not isinstance(desc, dict):
        return "No description"

    text_parts = []

    def extract_text(content):
        if isinstance(content, dict):
            if content.get('type') == 'text':
                text_parts.append(content.get('text', ''))
            if 'content' in content:
                for item in content['content']:
                    extract_text(item)
        elif isinstance(content, list):
            for item in content:
                extract_text(item)

    extract_text(desc)
    return ' '.join(text_parts).strip() or "No description"


def print_issue_details(issue):
    """Print formatted issue details."""
    fields = issue['fields']

    print(f"\n{'='*80}")
    print(f"[{issue['key']}] {fields['summary']}")
    print(f"{'='*80}")
    print(f"Status: {fields['status']['name']}")
    print(f"Priority: {fields.get('priority', {}).get('name', 'None')}")
    print(f"Assignee: {fields.get('assignee', {}).get('displayName', 'Unassigned')}")
    print(f"Created: {fields['created'][:10]}")
    print(f"Updated: {fields['updated'][:10]}")

    if fields.get('parent'):
        print(f"Epic: {fields['parent']['key']} - {fields['parent']['fields']['summary']}")

    if fields.get('labels'):
        print(f"Labels: {', '.join(fields['labels'])}")

    print(f"\nDescription:")
    print(f"  {format_description(fields.get('description'))}")

    # Get comments
    if 'comment' in fields and fields['comment']['comments']:
        print(f"\nRecent Comments ({len(fields['comment']['comments'])}):")
        for comment in fields['comment']['comments'][-3:]:  # Last 3 comments
            author = comment['author']['displayName']
            created = comment['created'][:10]
            body = format_description(comment['body'])
            print(f"  - {author} ({created}): {body[:100]}...")

    print(f"\nURL: {JIRA_BASE_URL}/browse/{issue['key']}")


def main():
    """Main function to fetch task details."""
    if len(sys.argv) < 2:
        print("Usage: python scripts/get-task-details.py DP01-6 DP01-7 DP01-8")
        sys.exit(1)

    issue_keys = sys.argv[1:]
    auth = HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN)

    # Verify authentication
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        sys.exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']}")

    # Fetch and display each issue
    for issue_key in issue_keys:
        issue = get_issue_details(auth, issue_key)
        if issue:
            print_issue_details(issue)

            # Get available transitions
            transitions = get_transitions(auth, issue_key)
            if transitions:
                print(f"\nAvailable Transitions:")
                for t in transitions:
                    print(f"  - {t['name']} (ID: {t['id']})")

    print(f"\n{'='*80}")
    print(f"Fetched details for {len(issue_keys)} issues")
    print(f"{'='*80}\n")


if __name__ == "__main__":
    main()
