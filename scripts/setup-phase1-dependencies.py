"""
Set up dependency links for Phase 1 tickets to enable divide-and-conquer workflow.

Usage:
    python scripts/setup-phase1-dependencies.py <jira-api-token>
"""

import requests
from requests.auth import HTTPBasicAuth
import sys

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"

# Dependency relationships for Phase 1
# Format: (blocker_issue, blocked_issue, link_type)
DEPENDENCIES = [
    # Workstream A (LocalStack) - Sequential dependencies
    ("DP01-148", "DP01-149", "Blocks"),  # Docker Compose blocks LocalStack init
    ("DP01-149", "DP01-150", "Blocks"),  # LocalStack init blocks Database schema
    ("DP01-150", "DP01-151", "Blocks"),  # Database schema blocks Node.js API
    ("DP01-151", "DP01-152", "Blocks"),  # Node.js API blocks Quickstart guide
    ("DP01-152", "DP01-153", "Blocks"),  # Quickstart blocks Comprehensive plan
    ("DP01-153", "DP01-154", "Blocks"),  # Comprehensive plan blocks README update
    ("DP01-154", "DP01-155", "Blocks"),  # README blocks E2E testing

    # Workstream B (Infrastructure) - Sequential dependencies within workstream
    ("DP01-74", "DP01-80", "Blocks"),    # AWS Organizations blocks VPC
    ("DP01-80", "DP01-78", "Blocks"),    # VPC blocks RDS
    ("DP01-75", "DP01-12", "Blocks"),    # IAM roles block CI/CD pipeline
    ("DP01-9", "DP01-12", "Blocks"),     # Git repo blocks CI/CD pipeline
    ("DP01-12", "DP01-134", "Blocks"),   # CI/CD setup blocks Test pipeline
    ("DP01-12", "DP01-135", "Blocks"),   # CI/CD setup blocks Build pipeline
    ("DP01-134", "DP01-136", "Blocks"),  # Test pipeline blocks Deploy to dev
    ("DP01-135", "DP01-136", "Blocks"),  # Build pipeline blocks Deploy to dev

    # Cross-workstream integration points (Week 2)
    ("DP01-150", "DP01-78", "Relates"),  # Database schema relates to RDS (same schema)
    ("DP01-151", "DP01-134", "Relates"), # Node.js API relates to Test pipeline (API tests in CI)
    ("DP01-9", "DP01-148", "Relates"),   # Git repo relates to Docker Compose (repo structure needed)
]

def link_issues(auth, inward_issue, outward_issue, link_type="Blocks"):
    """Create a link between two issues."""
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
        print(f"[OK] {inward_issue} {link_type.lower()} {outward_issue}")
        return True
    elif response.status_code == 400 and "already exists" in response.text.lower():
        print(f"[SKIP] Link already exists: {inward_issue} -> {outward_issue}")
        return True
    else:
        print(f"[ERROR] Failed to link {inward_issue} -> {outward_issue}")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        return False

def main():
    if len(sys.argv) < 2:
        print("[ERROR] Usage: python setup-phase1-dependencies.py <jira-api-token>")
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
    print(f"[OK] Setting up {len(DEPENDENCIES)} dependency links for Phase 1 tickets")
    print()

    success_count = 0
    for blocker, blocked, link_type in DEPENDENCIES:
        if link_issues(auth, blocker, blocked, link_type):
            success_count += 1

    print()
    print(f"[SUMMARY] Created/verified {success_count}/{len(DEPENDENCIES)} links")
    print()
    print("[DEPENDENCY VISUALIZATION]")
    print()
    print("Workstream A (LocalStack - Sequential):")
    print("  DP01-148 (Docker Compose)")
    print("    └─> DP01-149 (LocalStack Init)")
    print("          └─> DP01-150 (Database Schema)")
    print("                └─> DP01-151 (Node.js API)")
    print("                      └─> DP01-152 (Quickstart)")
    print("                            └─> DP01-153 (Comprehensive Plan)")
    print("                                  └─> DP01-154 (README)")
    print("                                        └─> DP01-155 (E2E Testing)")
    print()
    print("Workstream B (Infrastructure - Parallel branches):")
    print("  Branch 1 (AWS):")
    print("    DP01-74 (AWS Organizations)")
    print("      └─> DP01-80 (VPC)")
    print("            └─> DP01-78 (RDS)")
    print()
    print("  Branch 2 (CI/CD):")
    print("    DP01-9 (Git Repo) + DP01-75 (IAM)")
    print("      └─> DP01-12 (CI/CD Setup)")
    print("            ├─> DP01-134 (Test Pipeline)")
    print("            └─> DP01-135 (Build Pipeline)")
    print("                  └─> DP01-136 (Deploy to Dev)")
    print()
    print("Integration Points (Week 2):")
    print("  DP01-150 ↔ DP01-78 (Database schema alignment)")
    print("  DP01-151 ↔ DP01-134 (API tests in CI)")
    print("  DP01-9 ↔ DP01-148 (Repo structure)")

if __name__ == "__main__":
    main()
