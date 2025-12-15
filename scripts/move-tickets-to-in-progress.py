"""
Move Phase 1 tickets to "In Progress" status to start execution.

Usage:
    python scripts/move-tickets-to-in-progress.py <jira-api-token>
"""

import requests
from requests.auth import HTTPBasicAuth
import sys

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"

# Tickets to move to In Progress
# Format: (issue_key, comment)
TICKETS_TO_START = [
    # Workstream A (LocalStack) - Clay's tickets
    ("DP01-148", "Starting Phase 1 execution. Docker Compose configuration for LocalStack environment."),
    ("DP01-149", "LocalStack AWS resource initialization - creating S3 buckets, SQS queues, SNS topics, Secrets Manager."),
    ("DP01-150", "PostgreSQL database schema implementation - 13 tables matching PRD Section 7."),
    ("DP01-151", "Node.js API examples demonstrating S3, SQS, and PostgreSQL integration."),
    ("DP01-152", "Developer quickstart guide for 5-minute environment setup."),
    ("DP01-153", "Comprehensive local development plan documentation."),
    ("DP01-154", "Repository README update with LocalStack references."),
    ("DP01-155", "End-to-end testing and validation of complete LocalStack environment."),

    # Workstream B (Infrastructure) - Senior Dev's tickets
    ("DP01-6", "Backend framework selection and documentation."),
    ("DP01-7", "Frontend framework selection and documentation."),
    ("DP01-8", "Database selection and documentation."),
    ("DP01-9", "Git repository initialization with monorepo structure."),
    ("DP01-10", "Docker Compose setup for local development."),
    ("DP01-11", "Linting and code formatting configuration."),
    ("DP01-12", "CI/CD pipeline setup with GitHub Actions."),
    ("DP01-13", "Development setup documentation."),
    ("DP01-74", "AWS Organizations and account structure configuration."),
    ("DP01-75", "IAM roles setup for CI/CD pipeline."),
]

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
        print(f"[WARN] Could not add comment to {issue_key}: {response.status_code}")
        return False

def transition_issue(auth, issue_key, transition_name, comment=None):
    """Transition an issue to a new status."""
    # Get available transitions
    transitions = get_transitions(auth, issue_key)

    # Find the transition ID for the target status
    transition_id = None
    for t in transitions:
        if t['name'].lower() == transition_name.lower() or t['to']['name'].lower() == transition_name.lower():
            transition_id = t['id']
            break

    if not transition_id:
        print(f"[SKIP] {issue_key} - Transition '{transition_name}' not available")
        print(f"       Available: {', '.join([t['name'] for t in transitions])}")
        return False

    # Add comment if provided
    if comment:
        add_comment(auth, issue_key, comment)

    # Perform transition
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
        print(f"[OK] {issue_key} -> In Progress")
        return True
    else:
        print(f"[ERROR] Failed to transition {issue_key}: {response.status_code}")
        print(f"        Response: {response.text}")
        return False

def main():
    if len(sys.argv) < 2:
        print("[ERROR] Usage: python move-tickets-to-in-progress.py <jira-api-token>")
        sys.exit(1)

    email = "clay.campbell@vividcg.com"
    api_token = sys.argv[1]
    auth = HTTPBasicAuth(email, api_token)

    # Verify authentication
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        sys.exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']}")
    print(f"[OK] Moving {len(TICKETS_TO_START)} tickets to 'In Progress'")
    print()

    success_count = 0
    for issue_key, comment in TICKETS_TO_START:
        if transition_issue(auth, issue_key, "In Progress", comment):
            success_count += 1

    print()
    print(f"[SUMMARY] Moved {success_count}/{len(TICKETS_TO_START)} tickets to In Progress")
    print()
    print("[PHASE 1 EXECUTION STARTED]")
    print()
    print("Next steps:")
    print("  1. Review HEPHAESTUS_DAILY_WORKFLOW.md")
    print("  2. Post morning standup in Slack #connect-standup")
    print("  3. Start working on first ticket with Claude Code")
    print("  4. Follow validation gates and move to DONE when complete")

if __name__ == "__main__":
    main()
