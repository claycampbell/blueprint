#!/usr/bin/env python3
"""
Update Sprint 2 subtasks with proper autonomy levels and time estimates
following TIME_ESTIMATION_METHODOLOGY.md

Usage:
    python scripts/update-sprint2-autonomy-estimates.py --dry-run
    python scripts/update-sprint2-autonomy-estimates.py
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

# Updated task estimates with autonomy levels using TIME_ESTIMATION_METHODOLOGY.md
# Formula: Total Time = Base Implementation Time × Autonomy Multiplier + Human Overhead Time
# HIGH: Base × 1.0 + 15 min
# MEDIUM: Base × 1.3 + 55 min
# LOW: Base × 1.7 + 120 min

SUBTASK_UPDATES = {
    # DP01-217: Design Customization Interface
    "DP01-261": {
        "autonomy": "MEDIUM",
        "base_time": 120,  # 2 hours base (auth extension + portal setup)
        "total_time": 211,  # (120 × 1.3) + 55 = 211 min (~3.5 hours)
        "estimate": "3h 30m",
        "labels_add": ["autonomy-medium"],
        "story_points": 3
    },
    "DP01-262": {
        "autonomy": "MEDIUM",
        "base_time": 150,  # 2.5 hours base (dashboard UI + API + real-time updates)
        "total_time": 250,  # (150 × 1.3) + 55 = 250 min (~4 hours)
        "estimate": "4h",
        "labels_add": ["autonomy-medium"],
        "story_points": 3
    },
    "DP01-263": {
        "autonomy": "LOW",  # S3 upload, virus scanning, multi-file handling - critical functionality
        "base_time": 180,  # 3 hours base (S3 presigned URLs + virus scan + thumbnails)
        "total_time": 426,  # (180 × 1.7) + 120 = 426 min (~7 hours)
        "estimate": "7h",
        "labels_add": ["autonomy-low"],
        "story_points": 5
    },
    "DP01-264": {
        "autonomy": "HIGH",  # Standard CRUD + file download - well-defined pattern
        "base_time": 90,  # 1.5 hours base (query + UI display + download links)
        "total_time": 105,  # (90 × 1.0) + 15 = 105 min (~2 hours)
        "estimate": "2h",
        "labels_add": ["autonomy-high"],
        "story_points": 2
    },
    "DP01-265": {
        "autonomy": "HIGH",  # Simple placeholder UI - minimal risk
        "base_time": 30,  # 30 min base (placeholder component + modal)
        "total_time": 45,  # (30 × 1.0) + 15 = 45 min
        "estimate": "45m",
        "labels_add": ["autonomy-high"],
        "story_points": 1
    },

    # DP01-221: Correction Cycle Management
    "DP01-266": {
        "autonomy": "MEDIUM",
        "base_time": 135,  # 2.25 hours base (form + rich text editor + auto-save)
        "total_time": 231,  # (135 × 1.3) + 55 = 231 min (~4 hours)
        "estimate": "4h",
        "labels_add": ["autonomy-medium"],
        "story_points": 3
    },
    "DP01-267": {
        "autonomy": "LOW",  # Assignment rules engine - business logic critical
        "base_time": 120,  # 2 hours base (rules engine + action item creation)
        "total_time": 324,  # (120 × 1.7) + 120 = 324 min (~5.5 hours)
        "estimate": "5h 30m",
        "labels_add": ["autonomy-low"],
        "story_points": 5
    },
    "DP01-268": {
        "autonomy": "MEDIUM",
        "base_time": 180,  # 3 hours base (Kanban board + filters + comments)
        "total_time": 289,  # (180 × 1.3) + 55 = 289 min (~5 hours)
        "estimate": "5h",
        "labels_add": ["autonomy-medium"],
        "story_points": 3
    },
    "DP01-269": {
        "autonomy": "LOW",  # Resubmission workflow - critical business process
        "base_time": 135,  # 2.25 hours base (readiness check + checklist + workflow trigger)
        "total_time": 350,  # (135 × 1.7) + 120 = 350 min (~6 hours)
        "estimate": "6h",
        "labels_add": ["autonomy-low"],
        "story_points": 5
    },

    # DP01-223: Cross-Team Visibility
    "DP01-270": {
        "autonomy": "MEDIUM",
        "base_time": 150,  # 2.5 hours base (RBAC model + middleware + UI permissions)
        "total_time": 250,  # (150 × 1.3) + 55 = 250 min (~4 hours)
        "estimate": "4h",
        "labels_add": ["autonomy-medium"],
        "story_points": 3
    },
    "DP01-271": {
        "autonomy": "MEDIUM",
        "base_time": 135,  # 2.25 hours base (dashboard + filtering + status badges)
        "total_time": 231,  # (135 × 1.3) + 55 = 231 min (~4 hours)
        "estimate": "4h",
        "labels_add": ["autonomy-medium"],
        "story_points": 3
    },
    "DP01-272": {
        "autonomy": "MEDIUM",
        "base_time": 180,  # 3 hours base (Gantt timeline + milestone calculation + color coding)
        "total_time": 289,  # (180 × 1.3) + 55 = 289 min (~5 hours)
        "estimate": "5h",
        "labels_add": ["autonomy-medium"],
        "story_points": 3
    },
    "DP01-273": {
        "autonomy": "HIGH",  # Standard notification - well-defined pattern
        "base_time": 60,  # 1 hour base (trigger + email template + in-app notification)
        "total_time": 75,  # (60 × 1.0) + 15 = 75 min (~1.5 hours)
        "estimate": "1h 30m",
        "labels_add": ["autonomy-high"],
        "story_points": 2
    },

    # DP01-244: Notification System
    "DP01-274": {
        "autonomy": "LOW",  # AWS SES production setup - critical infrastructure
        "base_time": 120,  # 2 hours base (SES config + bounce handling + logging)
        "total_time": 324,  # (120 × 1.7) + 120 = 324 min (~5.5 hours)
        "estimate": "5h 30m",
        "labels_add": ["autonomy-low"],
        "story_points": 5
    },
    "DP01-275": {
        "autonomy": "MEDIUM",
        "base_time": 90,  # 1.5 hours base (Twilio setup + SMS service + rate limiting)
        "total_time": 172,  # (90 × 1.3) + 55 = 172 min (~3 hours)
        "estimate": "3h",
        "labels_add": ["autonomy-medium"],
        "story_points": 3
    },
    "DP01-276": {
        "autonomy": "MEDIUM",
        "base_time": 150,  # 2.5 hours base (template CRUD + variable interpolation + preview)
        "total_time": 250,  # (150 × 1.3) + 55 = 250 min (~4 hours)
        "estimate": "4h",
        "labels_add": ["autonomy-medium"],
        "story_points": 3
    },
    "DP01-277": {
        "autonomy": "MEDIUM",
        "base_time": 120,  # 2 hours base (preferences UI + per-category + quiet hours + digest)
        "total_time": 211,  # (120 × 1.3) + 55 = 211 min (~3.5 hours)
        "estimate": "3h 30m",
        "labels_add": ["autonomy-medium"],
        "story_points": 3
    },
    "DP01-278": {
        "autonomy": "LOW",  # Queue processing + retry logic + rate limiting - critical infrastructure
        "base_time": 180,  # 3 hours base (SQS queue + processor + retry + DLQ)
        "total_time": 426,  # (180 × 1.7) + 120 = 426 min (~7 hours)
        "estimate": "7h",
        "labels_add": ["autonomy-low"],
        "story_points": 5
    }
}


def update_subtask(auth, issue_key, updates):
    """Update a Jira subtask with autonomy level, labels, and time estimate."""

    # Build update payload
    payload = {"fields": {}}

    # Update labels (add autonomy label if not already present)
    if "labels_add" in updates:
        # First, get current labels
        response = requests.get(
            f"{JIRA_API_URL}/issue/{issue_key}",
            auth=auth,
            params={"fields": "labels"}
        )

        if response.status_code == 200:
            current_labels = response.json()["fields"].get("labels", [])
            # Add new labels if not already present
            new_labels = current_labels + [l for l in updates["labels_add"] if l not in current_labels]
            payload["fields"]["labels"] = new_labels

    # Update time estimate
    if "estimate" in updates:
        payload["fields"]["timetracking"] = {
            "originalEstimate": updates["estimate"]
        }

    # Update issue (labels + time tracking)
    if payload["fields"]:
        response = requests.put(
            f"{JIRA_API_URL}/issue/{issue_key}",
            auth=auth,
            headers={"Content-Type": "application/json"},
            json=payload
        )

        if response.status_code == 204:
            print(f"[OK] Updated {issue_key}: {updates['autonomy']} autonomy, {updates['estimate']} estimate")
            return True
        else:
            print(f"[ERROR] Failed to update {issue_key}: {response.status_code}")
            print(f"   Response: {response.text}")
            return False

    return False


def add_comment(auth, issue_key, updates):
    """Add comment to subtask explaining autonomy level and estimate calculation."""

    autonomy = updates['autonomy']
    base_time = updates['base_time']
    total_time = updates['total_time']
    estimate = updates['estimate']

    # Calculate multiplier and overhead based on autonomy
    if autonomy == "HIGH":
        multiplier = "1.0x"
        overhead = "15 min"
    elif autonomy == "MEDIUM":
        multiplier = "1.3x"
        overhead = "55 min"
    else:  # LOW
        multiplier = "1.7x"
        overhead = "120 min"

    comment_text = f"""**Autonomy Level:** {autonomy}

**Time Estimate Calculation:**
- Base Implementation: {base_time} min
- Autonomy Multiplier: {multiplier}
- Human Overhead: {overhead}
- **Total Estimate: {total_time} min ({estimate})**

**Formula:** Total = (Base × Multiplier) + Human Overhead

**Autonomy Definition:**
- **HIGH:** Claude can complete 80-100% independently with minimal human guidance
- **MEDIUM:** Claude can complete 50-80% independently, requires collaborative approach
- **LOW:** Claude can complete 30-50% independently, needs significant human guidance

See TIME_ESTIMATION_METHODOLOGY.md for full methodology."""

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
        print(f"[WARN] Failed to add comment to {issue_key}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Update Sprint 2 subtasks with autonomy levels and estimates")
    parser.add_argument("--dry-run", action="store_true", help="Preview updates without applying")
    parser.add_argument("--skip-comments", action="store_true", help="Skip adding explanatory comments")

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
        print("[DRY-RUN] Proposed autonomy level and estimate updates:")
        print()

        # Group by autonomy level for summary
        by_autonomy = {"HIGH": [], "MEDIUM": [], "LOW": []}

        for issue_key, updates in SUBTASK_UPDATES.items():
            autonomy = updates['autonomy']
            estimate = updates['estimate']
            by_autonomy[autonomy].append((issue_key, estimate))
            print(f"{issue_key}: {autonomy} autonomy, {estimate} estimate")

        print()
        print("[SUMMARY]")
        for autonomy, items in by_autonomy.items():
            print(f"  {autonomy}: {len(items)} tasks")

        total_high = sum(updates['total_time'] for updates in SUBTASK_UPDATES.values() if updates['autonomy'] == 'HIGH')
        total_medium = sum(updates['total_time'] for updates in SUBTASK_UPDATES.values() if updates['autonomy'] == 'MEDIUM')
        total_low = sum(updates['total_time'] for updates in SUBTASK_UPDATES.values() if updates['autonomy'] == 'LOW')
        total_all = total_high + total_medium + total_low

        print()
        print(f"[TIME BREAKDOWN]")
        print(f"  HIGH tasks: {total_high} min ({total_high/60:.1f} hours)")
        print(f"  MEDIUM tasks: {total_medium} min ({total_medium/60:.1f} hours)")
        print(f"  LOW tasks: {total_low} min ({total_low/60:.1f} hours)")
        print(f"  TOTAL: {total_all} min ({total_all/60:.1f} hours)")
        print()
        print(f"  With 4 developers in parallel: ~{(total_all/60)/4:.1f} hours each (~{((total_all/60)/4)/8:.1f} days)")
        return

    # Apply updates
    success_count = 0
    failed_count = 0

    for issue_key, updates in SUBTASK_UPDATES.items():
        print(f"[INFO] Updating {issue_key}...")

        # Update labels and time estimate
        if update_subtask(auth, issue_key, updates):
            success_count += 1

            # Add explanatory comment (unless skipped)
            if not args.skip_comments:
                add_comment(auth, issue_key, updates)
        else:
            failed_count += 1

    print()
    print(f"[SUMMARY] Updated {success_count}/{len(SUBTASK_UPDATES)} subtasks")
    if failed_count > 0:
        print(f"[SUMMARY] Failed to update {failed_count} subtasks")


if __name__ == "__main__":
    main()
