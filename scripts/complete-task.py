"""
Complete a Jira task by moving it to DONE and adding completion comment.

Usage:
    python scripts/complete-task.py <jira-api-token> <issue-key> <comment>
"""

import requests
from requests.auth import HTTPBasicAuth
import sys

JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"

def get_transitions(auth, issue_key):
    """Get available transitions for an issue."""
    response = requests.get(
        f"{JIRA_API_URL}/issue/{issue_key}/transitions",
        auth=auth
    )
    if response.status_code == 200:
        return response.json()['transitions']
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
    return response.status_code == 201

def transition_to_done(auth, issue_key):
    """Transition issue to Done status."""
    transitions = get_transitions(auth, issue_key)
    done_transition = next((t for t in transitions if 'done' in t['name'].lower()), None)

    if not done_transition:
        print(f"[ERROR] No 'Done' transition available for {issue_key}")
        return False

    payload = {"transition": {"id": done_transition['id']}}
    response = requests.post(
        f"{JIRA_API_URL}/issue/{issue_key}/transitions",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )
    return response.status_code == 204

def main():
    if len(sys.argv) < 3:
        print("[ERROR] Usage: python complete-task.py <jira-api-token> <issue-key> [comment]")
        sys.exit(1)

    email = "clay.campbell@vividcg.com"
    api_token = sys.argv[1]
    issue_key = sys.argv[2]
    comment = sys.argv[3] if len(sys.argv) > 3 else "Task completed."

    auth = HTTPBasicAuth(email, api_token)

    print(f"[COMPLETING] {issue_key}")

    # Add completion comment
    if add_comment(auth, issue_key, comment):
        print(f"[OK] Added completion comment")

    # Transition to Done
    if transition_to_done(auth, issue_key):
        print(f"[OK] {issue_key} -> Done")
        return True
    else:
        print(f"[ERROR] Failed to transition {issue_key}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
