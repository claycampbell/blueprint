"""
Create blocker issue for customer AWS provisioning and link dependent tasks.

Usage:
    python scripts/create-aws-blocker.py <jira-api-token>
"""

import requests
from requests.auth import HTTPBasicAuth
import sys

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"
PROJECT_KEY = "DP01"

# Tickets blocked by AWS provisioning
BLOCKED_BY_AWS = [
    "DP01-74",   # AWS Organizations and account structure
    "DP01-75",   # IAM roles setup
    "DP01-76",   # ECS cluster configuration
    "DP01-77",   # ECR repository setup
    "DP01-78",   # RDS PostgreSQL instance
    "DP01-79",   # Database migrations framework
    "DP01-80",   # VPC and subnet configuration
    "DP01-81",   # Application Load Balancer
    "DP01-82",   # WAF and security groups
    "DP01-83",   # CloudWatch dashboards
    "DP01-84",   # Logging aggregation
    "DP01-12",   # CI/CD pipeline (needs IAM roles)
    "DP01-134",  # Test pipeline (depends on CI/CD)
    "DP01-135",  # Build pipeline (depends on CI/CD)
    "DP01-136",  # Deploy to dev (depends on pipelines)
    "DP01-137",  # Deploy to staging
    "DP01-138",  # Deploy to production
    "DP01-139",  # Terraform for AWS infrastructure
]

def create_blocker_issue(auth):
    """Create the AWS provisioning blocker issue."""
    payload = {
        "fields": {
            "project": {"key": PROJECT_KEY},
            "summary": "BLOCKER: Customer AWS Account Provisioning",
            "description": {
                "type": "doc",
                "version": 1,
                "content": [{
                    "type": "paragraph",
                    "content": [{
                        "type": "text",
                        "text": "EXTERNAL BLOCKER: Waiting on customer to provision AWS accounts.\n\nThis blocks all infrastructure and deployment tasks that require AWS access.\n\nRequired AWS Resources:\n- AWS Organization with 3 accounts (dev, staging, prod)\n- Root account access credentials\n- Billing alerts configured\n- Initial IAM user for Terraform/CI/CD\n\nBlocked Tasks: 17 tasks across infrastructure and CI/CD epics\n\nStatus: Waiting on customer\nETA: TBD\nOwner: Customer (Blueprint team)\nNotify: clay.campbell@vividcg.com when provisioned"
                    }]
                }]
            },
            "issuetype": {"name": "Task"},
            "labels": ["blocker", "external-dependency", "aws", "infrastructure"]
        }
    }

    response = requests.post(
        f"{JIRA_API_URL}/issue",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        result = response.json()
        print(f"[OK] Created blocker issue: {result['key']}")
        return result['key']
    else:
        print(f"[ERROR] Failed to create blocker: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def link_blocked_issue(auth, blocker_key, blocked_key):
    """Link a blocked issue to the blocker."""
    payload = {
        "type": {"name": "Blocks"},
        "inwardIssue": {"key": blocker_key},
        "outwardIssue": {"key": blocked_key}
    }

    response = requests.post(
        f"{JIRA_API_URL}/issueLink",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        print(f"[OK] {blocker_key} blocks {blocked_key}")
        return True
    elif response.status_code == 400 and "already exists" in response.text.lower():
        print(f"[SKIP] Link already exists: {blocker_key} -> {blocked_key}")
        return True
    else:
        print(f"[ERROR] Failed to link {blocker_key} -> {blocked_key}")
        print(f"   Status: {response.status_code}")
        return False

def add_comment_to_blocked_tasks(auth, blocker_key, blocked_tasks):
    """Add a comment to all blocked tasks explaining the blocker."""
    comment_text = f"⚠️ BLOCKED: This task is waiting on {blocker_key} (Customer AWS Account Provisioning).\n\nYou can work on other tasks while waiting. This will be unblocked when customer provisions AWS accounts."

    for task_key in blocked_tasks:
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
            f"{JIRA_API_URL}/issue/{task_key}/comment",
            auth=auth,
            headers={"Content-Type": "application/json"},
            json=payload
        )

        if response.status_code == 201:
            print(f"[OK] Added blocker comment to {task_key}")
        else:
            print(f"[WARN] Could not add comment to {task_key}")

def main():
    if len(sys.argv) < 2:
        print("[ERROR] Usage: python create-aws-blocker.py <jira-api-token>")
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
    print()

    # Create blocker issue
    print("[STEP 1] Creating blocker issue for AWS provisioning...")
    blocker_key = create_blocker_issue(auth)

    if not blocker_key:
        print("[ERROR] Could not create blocker issue. Exiting.")
        sys.exit(1)

    print()

    # Link all blocked tasks
    print(f"[STEP 2] Linking {len(BLOCKED_BY_AWS)} blocked tasks to {blocker_key}...")
    success_count = 0
    for blocked_key in BLOCKED_BY_AWS:
        if link_blocked_issue(auth, blocker_key, blocked_key):
            success_count += 1

    print()
    print(f"[SUMMARY] Linked {success_count}/{len(BLOCKED_BY_AWS)} tasks")
    print()

    # Add comments to blocked tasks
    print("[STEP 3] Adding blocker comments to affected tasks...")
    add_comment_to_blocked_tasks(auth, blocker_key, BLOCKED_BY_AWS)

    print()
    print("[COMPLETE] AWS blocker setup complete")
    print()
    print(f"Blocker Issue: {blocker_key}")
    print(f"Blocked Tasks: {len(BLOCKED_BY_AWS)}")
    print()
    print("Workstream Impact:")
    print("  - Workstream A (LocalStack): NOT BLOCKED - can proceed")
    print("  - Workstream B (Infrastructure): BLOCKED - 17 tasks waiting on AWS")
    print()
    print("Recommendation:")
    print("  - Clay: Continue with DP01-148 to DP01-155 (LocalStack tasks)")
    print("  - Senior Dev: Work on DP01-6 to DP01-11, DP01-13 (non-AWS tasks)")
    print("  - Both: Pause AWS-dependent tasks until customer provisions accounts")

if __name__ == "__main__":
    main()
