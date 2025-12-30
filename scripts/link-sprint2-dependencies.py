#!/usr/bin/env python3
"""
Create Jira issue links for Sprint 2 subtask dependencies.

Usage:
    python scripts/link-sprint2-dependencies.py --dry-run
    python scripts/link-sprint2-dependencies.py
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

# Dependency mapping based on SPRINT_2_TASK_BREAKDOWN.md
# Format: {"subtask": [("dependency", "link_type")]}
# link_type: "Blocks" (this blocks that), "Relates" (related)

DEPENDENCIES = {
    # DP01-217: Design Customization Interface
    "DP01-261": [
        ("DP01-23", "Relates"),  # Auth system base
    ],
    "DP01-262": [
        ("DP01-261", "Blocks"),  # Needs architect auth first
    ],
    "DP01-263": [
        ("DP01-262", "Blocks"),  # Needs dashboard context
        ("DP01-244", "Relates"),  # Uses notification system
    ],
    "DP01-264": [
        ("DP01-263", "Blocks"),  # Needs uploaded files to display revisions
    ],
    "DP01-265": [
        ("DP01-263", "Relates"),  # Displayed on plan upload page
    ],

    # DP01-221: Correction Cycle Management
    "DP01-266": [
        ("DP01-220", "Relates"),  # Links to Permit Submission model
        ("DP01-216", "Relates"),  # References plan sheets from Plan Library
    ],
    "DP01-267": [
        ("DP01-266", "Blocks"),  # Needs city feedback captured first
        ("DP01-244", "Relates"),  # Uses notification system for assignments
    ],
    "DP01-268": [
        ("DP01-267", "Blocks"),  # Needs action items created first
        ("DP01-242", "Relates"),  # Uses Workflow Engine for status transitions
    ],
    "DP01-269": [
        ("DP01-268", "Blocks"),  # Needs task tracking for resolution status
        ("DP01-220", "Relates"),  # Integrates with Permit Submission workflow
        ("DP01-244", "Relates"),  # Sends city notification on resubmission
    ],

    # DP01-223: Cross-Team Visibility
    "DP01-270": [
        ("DP01-23", "Relates"),  # Extends auth system with RBAC
    ],
    "DP01-271": [
        ("DP01-270", "Blocks"),  # Needs permissions enforced
        ("DP01-220", "Relates"),  # Displays Permit Submission status
    ],
    "DP01-272": [
        ("DP01-271", "Blocks"),  # Needs status data for timeline
        ("DP01-221", "Relates"),  # Correction cycles impact timeline
    ],
    "DP01-273": [
        ("DP01-244", "Blocks"),  # Requires notification infrastructure
        ("DP01-220", "Relates"),  # Triggered by permit approval status
    ],

    # DP01-244: Notification System (foundation for all other stories)
    "DP01-274": [],  # No dependencies (foundation)
    "DP01-275": [],  # Can run parallel with DP01-274
    "DP01-276": [
        ("DP01-274", "Blocks"),  # Needs email service
        ("DP01-275", "Blocks"),  # Needs SMS service
    ],
    "DP01-277": [
        ("DP01-276", "Blocks"),  # Needs templates to reference categories
    ],
    "DP01-278": [
        ("DP01-274", "Blocks"),  # Needs email service
        ("DP01-275", "Blocks"),  # Needs SMS service
        ("DP01-276", "Blocks"),  # Needs templates
        ("DP01-277", "Blocks"),  # Needs user preferences
    ],
}

# Critical external dependencies (from Sprint 1 or other epics)
EXTERNAL_DEPENDENCIES = {
    "DP01-23": "Authentication & Authorization (Sprint 1 or earlier)",
    "DP01-216": "Plan Library Integration (Sprint 1)",
    "DP01-220": "Permit Submission & Tracking Workflow (Sprint 1)",
    "DP01-242": "Workflow Engine (Sprint 3 - future dependency)",
}


def create_issue_link(auth, inward_issue, outward_issue, link_type):
    """Create a link between two Jira issues."""
    payload = {
        "type": {"name": link_type},
        "inwardIssue": {"key": inward_issue},
        "outwardIssue": {"key": outward_issue}
    }

    response = requests.post(
        f"{JIRA_API_URL}/issueLink",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        return True
    elif response.status_code == 400 and "link already exists" in response.text.lower():
        print(f"[INFO] Link already exists: {inward_issue} {link_type} {outward_issue}")
        return True
    else:
        print(f"[ERROR] Failed to create link: {inward_issue} {link_type} {outward_issue}")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Link Sprint 2 subtask dependencies in Jira")
    parser.add_argument("--dry-run", action="store_true", help="Preview links without creating")

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

    if args.dry_run:
        print("[DRY-RUN] Proposed issue links:")
        print()

        total_links = 0
        for subtask, dependencies in DEPENDENCIES.items():
            if dependencies:
                print(f"{subtask}:")
                for dep_issue, link_type in dependencies:
                    ext_note = f" (EXTERNAL: {EXTERNAL_DEPENDENCIES[dep_issue]})" if dep_issue in EXTERNAL_DEPENDENCIES else ""
                    print(f"  {link_type}: {dep_issue}{ext_note}")
                    total_links += 1
                print()

        print(f"[SUMMARY] Would create {total_links} issue links")
        print()
        print("[EXTERNAL DEPENDENCIES]")
        for dep_issue, description in EXTERNAL_DEPENDENCIES.items():
            print(f"  {dep_issue}: {description}")
        return

    # Create links
    success_count = 0
    failed_count = 0
    skipped_count = 0

    for subtask, dependencies in DEPENDENCIES.items():
        if not dependencies:
            continue

        print(f"[INFO] Creating links for {subtask}...")

        for dep_issue, link_type in dependencies:
            # Skip external dependencies that might not exist yet
            if dep_issue in EXTERNAL_DEPENDENCIES:
                # Check if issue exists first
                check_response = requests.get(
                    f"{JIRA_API_URL}/issue/{dep_issue}",
                    auth=auth
                )

                if check_response.status_code == 404:
                    print(f"[SKIP] {dep_issue} does not exist yet ({EXTERNAL_DEPENDENCIES[dep_issue]})")
                    skipped_count += 1
                    continue

            if create_issue_link(auth, subtask, dep_issue, link_type):
                print(f"[OK] Linked {subtask} {link_type} {dep_issue}")
                success_count += 1
            else:
                failed_count += 1

        print()

    print(f"[SUMMARY] Created {success_count} links")
    if failed_count > 0:
        print(f"[SUMMARY] Failed to create {failed_count} links")
    if skipped_count > 0:
        print(f"[SUMMARY] Skipped {skipped_count} external dependencies (issues don't exist yet)")


if __name__ == "__main__":
    main()
