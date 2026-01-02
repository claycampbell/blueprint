#!/usr/bin/env python3
"""
Link stories to Epic DP01-279 (Hybrid State Machine Demo).

Usage:
    python link-stories-to-epic.py
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

# Epic and stories to link
EPIC_KEY = "DP01-279"
STORY_KEYS = [
    "DP01-280",  # Property State Machine Core
    "DP01-281",  # Process Engine Core
    "DP01-282",  # Feasibility Workflow Demo Implementation
    "DP01-283",  # Property-Centric UI
    "DP01-284",  # Business Rules & Workflow Comparison Report
]

def link_to_epic(auth, issue_key, epic_key):
    """Link an issue to an epic (parent)."""
    payload = {
        "fields": {
            "parent": {"key": epic_key}
        }
    }

    response = requests.put(
        f"{JIRA_API_URL}/issue/{issue_key}",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 204:
        print(f"[OK] Linked {issue_key} to epic {epic_key}")
        return True
    else:
        print(f"[ERROR] Failed to link {issue_key} to epic: {response.status_code}")
        print(f"   Response: {response.text}")
        return False

def main():
    auth = HTTPBasicAuth(EMAIL, API_TOKEN)

    # Verify authentication
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']} ({user_info['emailAddress']})")
    print()

    # Link each story to the epic
    print(f"Linking {len(STORY_KEYS)} stories to epic {EPIC_KEY}...")
    print()

    success_count = 0
    failed_count = 0

    for story_key in STORY_KEYS:
        if link_to_epic(auth, story_key, EPIC_KEY):
            success_count += 1
        else:
            failed_count += 1

    print()
    print(f"[SUMMARY] Successfully linked {success_count} stories to epic {EPIC_KEY}")
    if failed_count > 0:
        print(f"[SUMMARY] Failed to link {failed_count} stories")

if __name__ == "__main__":
    main()
