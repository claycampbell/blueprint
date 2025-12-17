#!/usr/bin/env python3
"""
Hand off a Jira issue to another engineer for PR review.

This script:
1. Transitions the issue to "Code Review" status
2. Reassigns the issue to the reviewer
3. Adds a comment with PR details
4. Optionally links the PR URL to the issue

Usage:
    python scripts/handoff-for-review.py DP01-157 --reviewer "Elrond Sheppard" --pr-url "https://github.com/..."
"""

import argparse
import os
import sys
from pathlib import Path

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
    create_remote_issue_link,
    add_comment,
)


def handoff_for_review(
    issue_key: str,
    reviewer: str,
    pr_url: str | None = None,
    comment_text: str | None = None,
) -> None:
    """
    Hand off a Jira issue to another engineer for PR review.

    Args:
        issue_key: Jira issue key (e.g., "DP01-157")
        reviewer: Name or email of reviewer (e.g., "Elrond Sheppard")
        pr_url: Optional URL to the pull request
        comment_text: Optional custom comment text
    """
    print(f"\n🔄 Handing off {issue_key} to {reviewer} for review...")

    # 1. Get current issue state
    print(f"\n1️⃣  Fetching current issue state...")
    issue = get_issue(issue_key)
    current_status = issue["fields"]["status"]["name"]
    current_assignee = issue["fields"].get("assignee", {})
    current_assignee_name = (
        current_assignee.get("displayName", "Unassigned")
        if current_assignee
        else "Unassigned"
    )

    print(f"   Current status: {current_status}")
    print(f"   Current assignee: {current_assignee_name}")

    # 2. Transition to "Code Review" if not already there
    if current_status != "Code Review":
        print(f"\n2️⃣  Transitioning {issue_key} to 'Code Review' status...")
        transition_issue(
            issue_key=issue_key,
            transition_id="311",  # Code Review transition ID
            comment=None,  # Will add detailed comment separately
        )
        print("   ✅ Status transitioned to 'Code Review'")
    else:
        print(f"\n2️⃣  Issue already in 'Code Review' status, skipping transition")

    # 3. Reassign to reviewer
    print(f"\n3️⃣  Reassigning {issue_key} to {reviewer}...")
    update_issue(
        issue_key=issue_key, fields={"assignee": {"name": reviewer}}  # Use display name
    )
    print(f"   ✅ Assigned to {reviewer}")

    # 4. Add comment with PR details
    print(f"\n4️⃣  Adding review comment...")
    if comment_text is None:
        comment_text = f"@{reviewer} - Ready for code review"
        if pr_url:
            comment_text += f"\n\n**Pull Request:** {pr_url}"
        comment_text += "\n\nPlease review when you have a chance. Thanks!"

    add_comment(issue_key=issue_key, comment=comment_text)
    print("   ✅ Comment added")

    # 5. Link PR if URL provided
    if pr_url:
        print(f"\n5️⃣  Linking pull request...")
        create_remote_issue_link(
            issue_key=issue_key,
            url=pr_url,
            title=f"PR: {issue['fields']['summary']}",
            summary="Pull request for code review",
        )
        print("   ✅ PR linked to issue")

    print(f"\n✅ Successfully handed off {issue_key} to {reviewer} for review!\n")
    print(
        f"   View issue: https://vividcg.atlassian.net/browse/{issue_key}"
    )


def main():
    parser = argparse.ArgumentParser(
        description="Hand off a Jira issue to another engineer for PR review"
    )
    parser.add_argument("issue_key", help="Jira issue key (e.g., DP01-157)")
    parser.add_argument(
        "--reviewer",
        "-r",
        required=True,
        help='Reviewer name or email (e.g., "Elrond Sheppard")',
    )
    parser.add_argument(
        "--pr-url", "-p", help="URL to the pull request (optional)"
    )
    parser.add_argument(
        "--comment", "-c", help="Custom comment text (optional)"
    )

    args = parser.parse_args()

    # Validate environment
    if not os.getenv("JIRA_API_TOKEN"):
        print("❌ Error: JIRA_API_TOKEN not found in environment")
        print("   Please set it in your .env file")
        sys.exit(1)

    # Execute handoff
    try:
        handoff_for_review(
            issue_key=args.issue_key,
            reviewer=args.reviewer,
            pr_url=args.pr_url,
            comment_text=args.comment,
        )
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
