#!/usr/bin/env python3
"""
Assign Track 3 value stream stories to sprints with prioritized workflow.

Sprint Structure (Days 1-90 MVP):
- Sprint 1-2: VS2 Entitlement & Permitting (priority - fed from other workstream)
- Sprint 3-4: VS1 Acquisitions Pipeline (Lead Intake + Feasibility)
- Sprint 5-6: Platform Services (continuous support)

Usage:
    python scripts/assign-stories-to-sprints.py --dry-run
    python scripts/assign-stories-to-sprints.py
"""

import argparse
import sys
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"
JIRA_AGILE_URL = f"{JIRA_BASE_URL}/rest/agile/1.0"
PROJECT_KEY = "DP01"
BOARD_ID = 1254  # Datapage Phase 1 Board

# Sprint allocation (prioritized workflow order)
# Actual sprint dates: Dec 29 - Jan 9, Jan 12 - Jan 23, etc.
SPRINT_ALLOCATIONS = {
    "Sprint 1: VS2 Entitlement 1": {
        "start_date": "2024-12-29",
        "end_date": "2025-01-09",
        "stories": [
            # DP01-199: Entitlement & Permitting (VS2) - 8 stories
            # Priority stories first (needed for intake from other workstream)
            "DP01-216",  # Plan Library Integration
            "DP01-219",  # Permit Packet Generation
            "DP01-220",  # Permit Submission & Tracking Workflow
            "DP01-218",  # Consultant Task Management (Entitlement)
        ]
    },
    "Sprint 2: VS2 Entitlement 2": {
        "start_date": "2025-01-12",
        "end_date": "2025-01-23",
        "stories": [
            # DP01-199: Entitlement & Permitting (VS2) - remaining stories
            "DP01-217",  # Design Customization Interface
            "DP01-221",  # Correction Cycle Management
            "DP01-223",  # Cross-Team Visibility (Entitlement Status)
            # Platform Services supporting VS2
            "DP01-244",  # Notification System
        ]
    },
    "Sprint 3: VS1 Lead Intake": {
        "start_date": "2025-01-26",
        "end_date": "2025-02-06",
        "stories": [
            # DP01-197: Lead Intake & Screening (VS1) - 4 stories
            "DP01-206",  # Lead Submission Form
            "DP01-207",  # Lead Assignment & Routing
            "DP01-208",  # Lead Queue & Duplicate Detection
            "DP01-209",  # Internal Notes & Collaboration (Lead Screening)
            # Platform Services supporting VS1
            "DP01-242",  # Workflow Engine
        ]
    },
    "Sprint 4: VS1 Feasibility 1": {
        "start_date": "2025-02-09",
        "end_date": "2025-02-20",
        "stories": [
            # DP01-198: Feasibility & Due Diligence (VS1) - 6 stories (part 1)
            "DP01-210",  # Consultant Ordering System
            "DP01-211",  # Consultant Portal
            "DP01-212",  # Document AI Extraction (AWS Textract)
            # Platform Services
            "DP01-247",  # BPO API Integration
            "DP01-248",  # AWS Textract Integration
        ]
    },
    "Sprint 5: VS1 Feasibility 2": {
        "start_date": "2025-02-23",
        "end_date": "2025-03-06",
        "stories": [
            # DP01-198: Feasibility & Due Diligence (VS1) - 6 stories (part 2)
            "DP01-213",  # Proforma Builder
            "DP01-214",  # Viability Decision Workflow
            "DP01-215",  # Feasibility Dashboard
            # Platform Services
            "DP01-243",  # Rules Engine
        ]
    },
    "Sprint 6: Platform & Collab": {
        "start_date": "2025-03-09",
        "end_date": "2025-03-20",
        "stories": [
            # DP01-203: Platform Services - remaining
            "DP01-245",  # Webhook System
            "DP01-246",  # Multi-Tenant Foundation
            # DP01-205: Collaboration & Communication (VS1/VS2 support)
            "DP01-256",  # Document Viewer & Versioning
            "DP01-257",  # Internal Team Messaging
            "DP01-259",  # Contact Relationship Mapping
            "DP01-260",  # Duplicate Contact Prevention
        ]
    }
}

# Post-MVP / Days 91-180 (Backlog for now)
BACKLOG_STORIES = [
    # VS3: Loan Origination & Funding - Days 91-180
    "DP01-224", "DP01-225", "DP01-226", "DP01-227", "DP01-228", "DP01-229", "DP01-230",
    # VS4: Construction Servicing & Draws - Days 91-180
    "DP01-231", "DP01-232", "DP01-233", "DP01-234", "DP01-235", "DP01-236", "DP01-237",
    # VS5: Loan Payoff & Closeout - Days 91-180
    "DP01-238", "DP01-239", "DP01-240", "DP01-241",
    # Analytics - Days 91-180
    "DP01-250", "DP01-251", "DP01-252", "DP01-253", "DP01-254", "DP01-255",
    # Collaboration - remaining
    "DP01-258",  # External Stakeholder Messaging
    # Accounting Integration
    "DP01-249",  # Accounting System Integration
    # Post-MVP features
    "DP01-222",  # Timeline Forecasting (ML-based)
]


def create_sprint(auth, sprint_name, start_date, end_date):
    """Create a new sprint."""
    payload = {
        "name": sprint_name,
        "originBoardId": BOARD_ID,
        "startDate": start_date.isoformat() + "Z",
        "endDate": end_date.isoformat() + "Z"
    }

    response = requests.post(
        f"{JIRA_AGILE_URL}/sprint",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        sprint = response.json()
        print(f"[OK] Created sprint: {sprint['name']} (ID: {sprint['id']})")
        return sprint
    else:
        print(f"[ERROR] Failed to create sprint: {sprint_name}")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        return None


def move_issue_to_sprint(auth, issue_key, sprint_id):
    """Move an issue to a sprint."""
    payload = {
        "issues": [issue_key]
    }

    response = requests.post(
        f"{JIRA_AGILE_URL}/sprint/{sprint_id}/issue",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 204:
        return True
    else:
        print(f"[ERROR] Failed to move {issue_key} to sprint {sprint_id}")
        print(f"   Status: {response.status_code}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Assign stories to sprints with prioritized workflow")
    parser.add_argument("--dry-run", action="store_true", help="Preview sprint allocation without creating")
    parser.add_argument("--start-date", help="Sprint 1 start date (YYYY-MM-DD), defaults to next Monday")

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
        print("[DRY-RUN] Sprint allocation preview:")
        print()

        for sprint_name, config in SPRINT_ALLOCATIONS.items():
            sprint_start = datetime.strptime(config['start_date'], "%Y-%m-%d")
            sprint_end = datetime.strptime(config['end_date'], "%Y-%m-%d")

            print(f"{sprint_name}")
            print(f"  Dates: {sprint_start.strftime('%Y-%m-%d')} to {sprint_end.strftime('%Y-%m-%d')}")
            print(f"  Stories ({len(config['stories'])}):")
            for story_key in config['stories']:
                print(f"    - {story_key}")
            print()

        print(f"Backlog ({len(BACKLOG_STORIES)} stories - Days 91-180):")
        for story_key in BACKLOG_STORIES:
            print(f"  - {story_key}")
        print()

        total_sprint_stories = sum(len(config['stories']) for config in SPRINT_ALLOCATIONS.values())
        print(f"[SUMMARY] Would create {len(SPRINT_ALLOCATIONS)} sprints with {total_sprint_stories} stories")
        print(f"[SUMMARY] {len(BACKLOG_STORIES)} stories remain in backlog for Days 91-180")
        return

    # Create sprints and assign stories
    created_sprints = {}

    for sprint_name, config in SPRINT_ALLOCATIONS.items():
        sprint_start = datetime.strptime(config['start_date'], "%Y-%m-%d")
        sprint_end = datetime.strptime(config['end_date'], "%Y-%m-%d")

        sprint = create_sprint(auth, sprint_name, sprint_start, sprint_end)
        if sprint:
            created_sprints[sprint_name] = sprint

            # Move stories to sprint
            print(f"[INFO] Moving {len(config['stories'])} stories to {sprint_name}...")
            success_count = 0
            for story_key in config['stories']:
                if move_issue_to_sprint(auth, story_key, sprint['id']):
                    success_count += 1

            print(f"[OK] Moved {success_count}/{len(config['stories'])} stories")
            print()

    print(f"[SUMMARY] Created {len(created_sprints)} sprints")
    print(f"[SUMMARY] {len(BACKLOG_STORIES)} stories remain in backlog (Days 91-180)")
    print()
    print("[NEXT STEPS]")
    print("1. Review sprint allocation in Jira board")
    print("2. Start Sprint 1 when ready to begin VS2 Entitlement & Permitting")
    print("3. Monitor backlog for Days 91-180 stories (VS3, VS4, VS5, Analytics)")


if __name__ == "__main__":
    main()
