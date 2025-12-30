#!/usr/bin/env python3
"""
Assign Sprint 2 subtasks to developers.

Infrastructure/Platform tasks → Elrond
Business workflow tasks → Clay

Usage:
    python scripts/assign-sprint2-tasks.py --dry-run
    python scripts/assign-sprint2-tasks.py
"""

import argparse
import sys
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"

# Task assignments
TASK_ASSIGNMENTS = {
    # Infrastructure/Platform (Elrond) - DP01-244: Notification System
    "elrond": [
        "DP01-274",  # Email Service Integration (AWS SES)
        "DP01-275",  # SMS Service Integration (Twilio)
        "DP01-276",  # Notification Template Management
        "DP01-277",  # User Notification Preferences
        "DP01-278",  # Notification Queue & Delivery Service
    ],

    # Business Workflows (Clay)
    "clay": [
        # DP01-217: Design Customization Interface
        "DP01-261",  # Architect Authentication & Portal Access
        "DP01-262",  # Customization Request Dashboard
        "DP01-263",  # Plan Upload & Document Management
        "DP01-264",  # Revision History & Version Tracking
        "DP01-265",  # CAD Integration Placeholder UI

        # DP01-221: Correction Cycle Management
        "DP01-266",  # City Feedback Capture Form
        "DP01-267",  # Automatic Action Item Creation
        "DP01-268",  # Task Assignment & Tracking Dashboard
        "DP01-269",  # Resubmission Workflow & Completion Tracking

        # DP01-223: Cross-Team Visibility
        "DP01-270",  # Cross-Team Permission Model
        "DP01-271",  # Entitlement Status Display for Servicing
        "DP01-272",  # Project Timeline Visibility
        "DP01-273",  # Permit Approval Notification
    ]
}


def get_user_account_id(auth, email_or_name):
    """Get Jira user account ID by email or display name."""
    # Try email lookup first
    response = requests.get(
        f"{JIRA_API_URL}/user/search",
        auth=auth,
        params={"query": email_or_name}
    )

    if response.status_code == 200:
        users = response.json()
        if users:
            return users[0]["accountId"]

    return None


def assign_task(auth, issue_key, assignee_account_id):
    """Assign a Jira issue to a user."""
    payload = {
        "fields": {
            "assignee": {"accountId": assignee_account_id}
        }
    }

    response = requests.put(
        f"{JIRA_API_URL}/issue/{issue_key}",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 204:
        return True
    else:
        print(f"[ERROR] Failed to assign {issue_key}: {response.status_code}")
        print(f"   Response: {response.text}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Assign Sprint 2 tasks to developers")
    parser.add_argument("--dry-run", action="store_true", help="Preview assignments without applying")

    args = parser.parse_args()

    email = os.getenv('JIRA_EMAIL')
    api_token = os.getenv('JIRA_API_TOKEN')

    if not email or not api_token:
        print("[ERROR] Email and API token required in .env file")
        sys.exit(1)

    auth = HTTPBasicAuth(email, api_token)

    # Verify authentication
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        sys.exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']} ({user_info['emailAddress']})")
    print()

    # Get account IDs for assignees
    print("[INFO] Looking up user account IDs...")

    clay_account_id = get_user_account_id(auth, "clay.campbell@vividcg.com")
    elrond_account_id = get_user_account_id(auth, "elrond")

    if not clay_account_id:
        print("[ERROR] Could not find Clay's account ID")
        sys.exit(1)

    if not elrond_account_id:
        print("[ERROR] Could not find Elrond's account ID")
        print("[INFO] Searching by different query...")
        # Try alternate searches
        elrond_account_id = get_user_account_id(auth, "Elrond")
        if not elrond_account_id:
            print("[ERROR] Please provide Elrond's email or exact Jira display name")
            sys.exit(1)

    print(f"[OK] Clay Campbell: {clay_account_id}")
    print(f"[OK] Elrond: {elrond_account_id}")
    print()

    if args.dry_run:
        print("[DRY-RUN] Proposed task assignments:")
        print()

        print("Clay Campbell (Business Workflows) - 13 tasks:")
        for task in TASK_ASSIGNMENTS["clay"]:
            print(f"  {task}")

        print()
        print("Elrond (Infrastructure/Platform) - 5 tasks:")
        for task in TASK_ASSIGNMENTS["elrond"]:
            print(f"  {task}")

        print()
        print(f"[SUMMARY] Would assign 18 tasks total")
        return

    # Apply assignments
    success_count = 0
    failed_count = 0

    print("[INFO] Assigning Clay's tasks...")
    for task_key in TASK_ASSIGNMENTS["clay"]:
        if assign_task(auth, task_key, clay_account_id):
            print(f"[OK] Assigned {task_key} to Clay Campbell")
            success_count += 1
        else:
            failed_count += 1

    print()
    print("[INFO] Assigning Elrond's tasks...")
    for task_key in TASK_ASSIGNMENTS["elrond"]:
        if assign_task(auth, task_key, elrond_account_id):
            print(f"[OK] Assigned {task_key} to Elrond")
            success_count += 1
        else:
            failed_count += 1

    print()
    print(f"[SUMMARY] Successfully assigned {success_count} tasks")
    if failed_count > 0:
        print(f"[SUMMARY] Failed to assign {failed_count} tasks")


if __name__ == "__main__":
    main()
