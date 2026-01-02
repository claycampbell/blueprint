#!/usr/bin/env python3
"""
Assign stories to Clay Campbell.

Usage:
    python assign-stories-to-me.py
"""

import os
import requests
from requests.auth import HTTPBasicAuth

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"

# Get credentials from environment
EMAIL = os.environ.get("JIRA_EMAIL", "clay.campbell@vividcg.com")
API_TOKEN = os.environ.get("JIRA_API_TOKEN")

if not API_TOKEN:
    print("[ERROR] JIRA_API_TOKEN environment variable not set")
    print("Set it with: set JIRA_API_TOKEN=your-token-here")
    exit(1)

# Stories to assign
STORY_KEYS = [
    "DP01-280",  # Property State Machine Core
    "DP01-281",  # Process Engine Core
    "DP01-282",  # Feasibility Workflow Demo Implementation
    "DP01-283",  # Property-Centric UI
    "DP01-284",  # Business Rules & Workflow Comparison Report
]

def get_my_account_id(auth):
    """Get the current user's account ID."""
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code == 200:
        user = response.json()
        return user['accountId']
    else:
        print(f"[ERROR] Failed to get user info: {response.status_code}")
        return None

def assign_issue(auth, issue_key, account_id):
    """Assign an issue to a user."""
    payload = {
        "accountId": account_id
    }

    response = requests.put(
        f"{JIRA_API_URL}/issue/{issue_key}/assignee",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 204:
        print(f"[OK] Assigned {issue_key} to you")
        return True
    else:
        print(f"[ERROR] Failed to assign {issue_key}: {response.status_code}")
        print(f"   Response: {response.text}")
        return False

def main():
    auth = HTTPBasicAuth(EMAIL, API_TOKEN)

    # Verify authentication and get account ID
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        exit(1)

    user_info = response.json()
    account_id = user_info['accountId']
    print(f"[OK] Authenticated as: {user_info['displayName']} ({user_info['emailAddress']})")
    print(f"[OK] Account ID: {account_id}")
    print()

    # Assign each story
    print(f"Assigning {len(STORY_KEYS)} stories to you...")
    print()

    success_count = 0
    failed_count = 0

    for story_key in STORY_KEYS:
        if assign_issue(auth, story_key, account_id):
            success_count += 1
        else:
            failed_count += 1

    print()
    print(f"[SUMMARY] Successfully assigned {success_count} stories")
    if failed_count > 0:
        print(f"[SUMMARY] Failed to assign {failed_count} stories")

if __name__ == "__main__":
    main()
