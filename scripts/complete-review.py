#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Complete a code review and return issue to original author or merge.

This script handles two scenarios:
1. Approve and merge: Transition to "Done", add approval comment
2. Request changes: Transition back to "In Progress", reassign to original author

Usage:
    # Approve and merge
    python scripts/complete-review.py DP01-157 --approve --merge-comment "LGTM! Merging now."

    # Request changes
    python scripts/complete-review.py DP01-157 --request-changes --assignee "Clay Campbell" --comment "Please update..."
"""

import argparse
import os
import sys
from pathlib import Path

# Fix Windows console encoding for emojis
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import after environment is loaded
from jira_automation import (
    get_issue,
    transition_issue,
    update_issue,
    add_comment,
)


def approve_and_merge(issue_key: str, merge_comment: str | None = None) -> None:
    """
    Approve PR and transition issue to Done.

    Args:
        issue_key: Jira issue key (e.g., "DP01-157")
        merge_comment: Optional comment about the merge
    """
    print(f"\n✅ Approving and merging {issue_key}...")

    # 1. Get current state
    issue = get_issue(issue_key)
    current_status = issue["fields"]["status"]["name"]
    print(f"   Current status: {current_status}")

    # 2. Add approval comment
    if merge_comment is None:
        merge_comment = (
            "✅ Code review complete - LGTM!\n\nApproved and merging to main."
        )

    print(f"\n1️⃣  Adding approval comment...")
    add_comment(issue_key=issue_key, comment=merge_comment)
    print("   ✅ Comment added")

    # 3. Transition to Done
    print(f"\n2️⃣  Transitioning {issue_key} to 'Done' status...")
    transition_issue(
        issue_key=issue_key,
        transition_id="341",  # Done transition ID
        comment=None,
    )
    print("   ✅ Status transitioned to 'Done'")

    print(
        f"\n✅ {issue_key} approved and marked as Done!\n"
    )
    print(
        f"   View issue: https://vividcg.atlassian.net/browse/{issue_key}"
    )


def request_changes(
    issue_key: str, assignee: str, change_comment: str
) -> None:
    """
    Request changes and return issue to original author.

    Args:
        issue_key: Jira issue key (e.g., "DP01-157")
        assignee: Name or email of person to reassign to
        change_comment: Comment explaining requested changes
    """
    print(f"\n🔄 Requesting changes on {issue_key}...")

    # 1. Get current state
    issue = get_issue(issue_key)
    current_status = issue["fields"]["status"]["name"]
    print(f"   Current status: {current_status}")

    # 2. Add change request comment
    print(f"\n1️⃣  Adding change request comment...")
    formatted_comment = (
        f"📝 **Changes Requested**\n\n{change_comment}\n\n@{assignee} - Please address these items."
    )
    add_comment(issue_key=issue_key, comment=formatted_comment)
    print("   ✅ Comment added")

    # 3. Transition back to In Progress
    print(
        f"\n2️⃣  Transitioning {issue_key} back to 'In Progress' status..."
    )
    transition_issue(
        issue_key=issue_key,
        transition_id="301",  # In Progress transition ID
        comment=None,
    )
    print("   ✅ Status transitioned to 'In Progress'")

    # 4. Reassign to original author
    print(f"\n3️⃣  Reassigning {issue_key} to {assignee}...")
    update_issue(
        issue_key=issue_key, fields={"assignee": {"name": assignee}}
    )
    print(f"   ✅ Assigned to {assignee}")

    print(
        f"\n✅ Changes requested on {issue_key} and returned to {assignee}\n"
    )
    print(
        f"   View issue: https://vividcg.atlassian.net/browse/{issue_key}"
    )


def main():
    parser = argparse.ArgumentParser(
        description="Complete a code review (approve or request changes)"
    )
    parser.add_argument("issue_key", help="Jira issue key (e.g., DP01-157)")

    # Approval flow
    approval_group = parser.add_argument_group("approval options")
    approval_group.add_argument(
        "--approve",
        action="store_true",
        help="Approve the PR and mark as Done",
    )
    approval_group.add_argument(
        "--merge-comment",
        help="Optional comment about the merge",
    )

    # Change request flow
    changes_group = parser.add_argument_group("change request options")
    changes_group.add_argument(
        "--request-changes",
        action="store_true",
        help="Request changes and return to author",
    )
    changes_group.add_argument(
        "--assignee",
        "-a",
        help='Person to reassign to (e.g., "Clay Campbell")',
    )
    changes_group.add_argument(
        "--comment",
        "-c",
        help="Comment explaining requested changes",
    )

    args = parser.parse_args()

    # Validate environment
    if not os.getenv("JIRA_API_TOKEN"):
        print("❌ Error: JIRA_API_TOKEN not found in environment")
        print("   Please set it in your .env file")
        sys.exit(1)

    # Validate action
    if args.approve and args.request_changes:
        print(
            "❌ Error: Cannot use both --approve and --request-changes"
        )
        sys.exit(1)

    if not args.approve and not args.request_changes:
        print("❌ Error: Must specify either --approve or --request-changes")
        sys.exit(1)

    # Execute appropriate flow
    try:
        if args.approve:
            approve_and_merge(
                issue_key=args.issue_key, merge_comment=args.merge_comment
            )
        else:  # request_changes
            if not args.assignee or not args.comment:
                print(
                    "❌ Error: --request-changes requires both --assignee and --comment"
                )
                sys.exit(1)
            request_changes(
                issue_key=args.issue_key,
                assignee=args.assignee,
                change_comment=args.comment,
            )
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
