#!/usr/bin/env python3
"""
Transition Jira tasks to DONE status with completion comments.

Usage:
    python scripts/transition-tasks.py DP01-6 DP01-7 DP01-8 --comment "Completed: Tech stack documented"
    python scripts/transition-tasks.py --dry-run DP01-6 DP01-7  # Preview only
"""

import argparse
import os
import sys
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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


def transition_issue(auth, issue_key, transition_id, comment=None):
    """Transition an issue to a new status."""
    payload = {
        "transition": {"id": transition_id}
    }

    response = requests.post(
        f"{JIRA_API_URL}/issue/{issue_key}/transitions",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 204:
        return True
    else:
        print(f"[ERROR] Failed to transition {issue_key}: {response.status_code}")
        print(f"   Response: {response.text}")
        return False


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
        return True
    else:
        print(f"[ERROR] Failed to add comment to {issue_key}: {response.status_code}")
        return False


def get_issue_status(auth, issue_key):
    """Get current status of an issue."""
    response = requests.get(
        f"{JIRA_API_URL}/issue/{issue_key}?fields=status,summary",
        auth=auth
    )

    if response.status_code == 200:
        data = response.json()
        return data['fields']['status']['name'], data['fields']['summary']
    else:
        return None, None


def main():
    """Main function to transition tasks."""
    parser = argparse.ArgumentParser(description="Transition Jira tasks to DONE")
    parser.add_argument("issue_keys", nargs="+", help="Jira issue keys to transition (e.g., DP01-6)")
    parser.add_argument("--comment", help="Comment to add when transitioning")
    parser.add_argument("--dry-run", action="store_true", help="Preview transitions without making changes")

    args = parser.parse_args()
    auth = HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN)

    # Verify authentication
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        sys.exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']}")

    if args.dry_run:
        print(f"[DRY-RUN] Preview mode - no changes will be made")

    print()

    transitioned_count = 0
    skipped_count = 0
    failed_count = 0

    for issue_key in args.issue_keys:
        print(f"[INFO] Processing {issue_key}...")

        # Get current status
        current_status, summary = get_issue_status(auth, issue_key)
        if not current_status:
            print(f"[ERROR] Could not fetch status for {issue_key}")
            failed_count += 1
            continue

        print(f"  Current status: {current_status}")
        print(f"  Summary: {summary}")

        # Check if already done
        if current_status.lower() == 'done':
            print(f"[SKIP] {issue_key} is already Done")
            skipped_count += 1
            print()
            continue

        # Get available transitions
        transitions = get_transitions(auth, issue_key)
        if not transitions:
            print(f"[ERROR] No transitions available for {issue_key}")
            failed_count += 1
            print()
            continue

        # Find "Done" transition
        done_transition = next(
            (t for t in transitions if t['name'].lower() == 'done'),
            None
        )

        if not done_transition:
            print(f"[ERROR] No 'Done' transition found for {issue_key}")
            print(f"  Available transitions: {', '.join(t['name'] for t in transitions)}")
            failed_count += 1
            print()
            continue

        print(f"  Transition ID: {done_transition['id']} ('{done_transition['name']}')")

        if args.dry_run:
            print(f"[DRY-RUN] Would transition {issue_key} to Done")
            if args.comment:
                print(f"[DRY-RUN] Would add comment: {args.comment}")
            transitioned_count += 1
        else:
            # Add comment first if provided
            if args.comment:
                if add_comment(auth, issue_key, args.comment):
                    print(f"[OK] Added comment to {issue_key}")
                else:
                    print(f"[WARN] Could not add comment to {issue_key}")

            # Transition to Done
            if transition_issue(auth, issue_key, done_transition['id']):
                print(f"[OK] Transitioned {issue_key} to Done")
                transitioned_count += 1
            else:
                failed_count += 1

        print()

    # Summary
    print(f"{'='*80}")
    print(f"SUMMARY")
    print(f"{'='*80}")
    print(f"  Transitioned: {transitioned_count}")
    print(f"  Skipped (already done): {skipped_count}")
    print(f"  Failed: {failed_count}")

    if args.dry_run:
        print(f"\n[DRY-RUN] No changes were made. Remove --dry-run to actually transition tasks.")


if __name__ == "__main__":
    main()
