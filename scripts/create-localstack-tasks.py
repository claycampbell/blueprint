"""
Create the 8 LocalStack onboarding tasks under Epic DP01-65.

Usage:
    python scripts/create-localstack-tasks.py <jira-api-token>
"""

import requests
from requests.auth import HTTPBasicAuth
import sys

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"
PROJECT_KEY = "DP01"
EPIC_KEY = "DP01-65"

# Task definitions
LOCALSTACK_TASKS = [
    {
        "summary": "Docker Compose Configuration",
        "description": """Task: Docker Compose Configuration

Epic: DP01-65 (LocalStack Development Environment Setup)
Estimated Time: 45 minutes
Autonomy Level: HIGH
Workstream: A (Local Development)

Requirements:
- LocalStack container (port 4566) with S3, SQS, SNS, Secrets Manager, CloudWatch
- PostgreSQL 15 container (port 5432)
- Redis 7 container (port 6379)
- pgAdmin container (port 5050)
- Shared Docker network
- Auto-run init scripts on startup
- Persistent volumes for data

Validation Gates:
- docker-compose config (no errors)
- docker-compose up -d (all 4 services start)
- LocalStack health check passes
- Redis ping responds PONG

Deliverables:
- docker-compose.yml at repository root

Reference: LOCALSTACK_HEPHAESTUS_ONBOARDING.md (Task 1)""",
        "labels": ["Track-3-Platform", "Phase-1-Foundation", "Workstream-A", "local-dev"],
        "priority": "High"
    },
    {
        "summary": "LocalStack AWS Resource Initialization",
        "description": """Task: LocalStack AWS Resource Initialization

Epic: DP01-65 (LocalStack Development Environment Setup)
Estimated Time: 60 minutes
Autonomy Level: MEDIUM
Workstream: A (Local Development)

Requirements:
- Script location: scripts/localstack-init.sh
- Must be idempotent (can run multiple times without errors)
- Create 3 S3 buckets: connect2-documents-dev, connect2-documents-archive, connect2-temp
- Create 5 SQS queues: connect2-document-processing, connect2-notifications, connect2-email-queue, connect2-task-queue, connect2-draw-workflow
- Create 4 SNS topics: connect2-system-events, connect2-draw-updates, connect2-loan-status, connect2-notifications
- Create 4 Secrets Manager secrets: connect2/database, connect2/jwt, connect2/api-keys, connect2/third-party
- Create CloudWatch log groups
- Use awslocal CLI
- Include verification/status output

Validation Gates:
- awslocal s3 ls (3 buckets)
- awslocal sqs list-queues (5 queues)
- awslocal sns list-topics (4 topics)
- awslocal secretsmanager list-secrets (4 secrets)
- Script runs twice without errors (idempotency)

Deliverables:
- scripts/localstack-init.sh (executable)

Reference: LOCALSTACK_HEPHAESTUS_ONBOARDING.md (Task 2)""",
        "labels": ["Track-3-Platform", "Phase-1-Foundation", "Workstream-A", "local-dev"],
        "priority": "High"
    },
    {
        "summary": "PostgreSQL Database Schema",
        "description": """Task: PostgreSQL Database Schema

Epic: DP01-65 (LocalStack Development Environment Setup)
Estimated Time: 90 minutes
Autonomy Level: LOW (must validate against PRD)
Workstream: A (Local Development)

Requirements:
- Script location: scripts/init-db.sql
- Create schema namespace: connect2
- Implement all 13 tables from PRD Section 7:
  1. users, 2. contacts, 3. projects, 4. feasibility, 5. consultant_tasks
  6. entitlement, 7. permit_corrections, 8. loans, 9. loan_guarantors
  10. draws, 11. documents, 12. tasks, 13. audit_log
- Include foreign key constraints
- Include indexes for commonly queried fields
- Enable uuid-ossp extension
- Seed data: 5 users, 10 contacts, 8 projects, 3 loans, 15 documents

CRITICAL: Schema must match PRODUCT_REQUIREMENTS_DOCUMENT.md Section 7 exactly

Validation Gates:
- psql connection successful
- \\dt connect2.* shows 13 tables
- SELECT COUNT(*) verifies seed data
- Foreign key constraints tested
- All indexes exist

Deliverables:
- scripts/init-db.sql

Reference: LOCALSTACK_HEPHAESTUS_ONBOARDING.md (Task 3)""",
        "labels": ["Track-3-Platform", "Phase-1-Foundation", "Workstream-A", "local-dev", "database"],
        "priority": "High"
    },
    {
        "summary": "Node.js API Example",
        "description": """Task: Node.js API Example

Epic: DP01-65 (LocalStack Development Environment Setup)
Estimated Time: 120 minutes
Autonomy Level: HIGH
Workstream: A (Local Development)

Requirements:
- Directory: examples/nodejs-api/
- Framework: Express.js + TypeScript
- Demonstrate: AWS SDK config, S3 upload/download, SQS messaging, PostgreSQL CRUD
- API Endpoints:
  - GET/POST /api/v1/projects
  - GET/PATCH /api/v1/projects/:id
  - POST /api/v1/projects/:id/transition
  - POST /api/v1/projects/:id/documents (upload to S3)
  - GET /api/v1/projects/:id/documents (list)
  - GET /api/v1/projects/:id/documents/:docId/download (pre-signed URL)

Project Structure:
- src/config/ (AWS SDK, database)
- src/services/ (S3, SQS)
- src/routes/ (API endpoints)
- package.json, tsconfig.json, .env.example, README.md

Validation Gates:
- npm install && npm run dev (starts successfully)
- curl endpoints (all return valid responses)
- S3 file upload works
- SQS message sent
- Database records created

Deliverables:
- Working Node.js API in examples/nodejs-api/

Reference: LOCALSTACK_HEPHAESTUS_ONBOARDING.md (Task 4)""",
        "labels": ["Track-3-Platform", "Phase-1-Foundation", "Workstream-A", "local-dev", "api"],
        "priority": "High"
    },
    {
        "summary": "Developer Quickstart Guide",
        "description": """Task: Developer Quickstart Guide

Epic: DP01-65 (LocalStack Development Environment Setup)
Estimated Time: 30 minutes
Autonomy Level: HIGH
Workstream: A (Local Development)

Requirements:
- File: DEVELOPER_QUICKSTART.md
- Target: New developers, 5-minute setup
- Structure:
  1. Prerequisites (2-3 lines)
  2. Quick Start (3 commands max)
  3. Verification (4 commands)
  4. Common Commands (daily tasks)
  5. Troubleshooting (5 common issues)
  6. Quick Reference Table (URLs, credentials)
  7. Next Steps (links to guides)

Must be:
- Concise (< 150 lines)
- Copy-pasteable commands (no placeholders)
- Tested on fresh environment
- Setup completes in < 5 minutes

Validation Gates:
- Test on fresh clone
- Time setup process
- All commands work
- Troubleshooting covers common errors

Deliverables:
- DEVELOPER_QUICKSTART.md

Reference: LOCALSTACK_HEPHAESTUS_ONBOARDING.md (Task 5)""",
        "labels": ["Track-3-Platform", "Phase-1-Foundation", "Workstream-A", "local-dev", "documentation"],
        "priority": "Medium"
    },
    {
        "summary": "Comprehensive Local Development Plan",
        "description": """Task: Comprehensive Local Development Plan

Epic: DP01-65 (LocalStack Development Environment Setup)
Estimated Time: 45 minutes
Autonomy Level: MEDIUM
Workstream: A (Local Development)

Requirements:
- File: LOCAL_DEVELOPMENT_PLAN.md (already exists ~4,500 lines)
- Review existing content for accuracy
- Fill gaps discovered during Tasks 1-5
- Add new section: "Developer Insights"
  - Common pitfalls and solutions
  - Performance tips
  - Debugging techniques
  - Docker Compose optimization
- Verify all code examples work
- Add detailed cost analysis

DO NOT rewrite entire document - only add/update specific sections

Validation Gates:
- Test bash commands from document (spot check 10-15)
- Code examples use syntax highlighting
- Architecture diagram matches implementation
- Cost analysis accurate ($95,400/year savings)

Deliverables:
- Updated LOCAL_DEVELOPMENT_PLAN.md

Reference: LOCALSTACK_HEPHAESTUS_ONBOARDING.md (Task 6)""",
        "labels": ["Track-3-Platform", "Phase-1-Foundation", "Workstream-A", "local-dev", "documentation"],
        "priority": "Medium"
    },
    {
        "summary": "Update Repository README",
        "description": """Task: Update Repository README

Epic: DP01-65 (LocalStack Development Environment Setup)
Estimated Time: 20 minutes
Autonomy Level: HIGH
Workstream: A (Local Development)

Requirements:
- Update README.md to include LocalStack references
- Add to "Quick Start for Developers" section
- Update "Technology Stack" to include LocalStack
- Update "Cost Summary" with savings ($95,400/year)
- Update "Repository Structure" to show new files:
  - docker-compose.yml
  - scripts/localstack-init.sh
  - scripts/init-db.sql
  - examples/nodejs-api/
- Ensure all links work (relative paths)

Validation Gates:
- markdownlint README.md (no errors)
- markdown-link-check README.md (no broken links)
- Preview renders correctly on GitHub
- All new file references exist

Deliverables:
- Updated README.md

Reference: LOCALSTACK_HEPHAESTUS_ONBOARDING.md (Task 7)""",
        "labels": ["Track-3-Platform", "Phase-1-Foundation", "Workstream-A", "local-dev", "documentation"],
        "priority": "Medium"
    },
    {
        "summary": "End-to-End Testing & Validation",
        "description": """Task: End-to-End Testing & Validation

Epic: DP01-65 (LocalStack Development Environment Setup)
Estimated Time: 90 minutes
Autonomy Level: LOW (developer-driven)
Workstream: A (Local Development)

Requirements:
- Execute 3 testing scenarios:
  1. Fresh Environment Setup (30 min)
  2. Full Workflow Test (45 min)
  3. Troubleshooting Practice (15 min)

Scenario 1: Fresh Setup
- Delete all Docker resources
- Clone repo to new directory
- Follow DEVELOPER_QUICKSTART.md
- Time the process (< 5 min target)
- Verify all services start

Scenario 2: Full Workflow
- Create project via API
- Upload document (S3 + SQS)
- Query database
- Transition project status
- Stop/restart environment
- Verify data persistence

Scenario 3: Troubleshooting
- Intentionally break things
- Fix using documentation
- Verify recovery

Validation Gates:
- All scenarios pass
- Setup time < 5 minutes
- API response < 50ms
- Docker startup < 60 seconds
- Document results in TEST_RESULTS.md

Deliverables:
- TEST_RESULTS.md with scenario results

Reference: LOCALSTACK_HEPHAESTUS_ONBOARDING.md (Task 8)""",
        "labels": ["Track-3-Platform", "Phase-1-Foundation", "Workstream-A", "local-dev", "testing"],
        "priority": "High"
    }
]

def create_jira_task(auth, task):
    """Create a single Jira task under the epic."""
    payload = {
        "fields": {
            "project": {"key": PROJECT_KEY},
            "summary": task["summary"],
            "description": {
                "type": "doc",
                "version": 1,
                "content": [{
                    "type": "paragraph",
                    "content": [{"type": "text", "text": task["description"]}]
                }]
            },
            "issuetype": {"name": "Task"},
            "labels": task.get("labels", [])
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
        print(f"[OK] Created {result['key']}: {task['summary']}")
        return result
    else:
        print(f"[ERROR] Failed to create task: {task['summary']}")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def link_to_epic(auth, issue_key, epic_key):
    """Link an issue to an epic."""
    payload = {
        "type": {"name": "Relates"},
        "inwardIssue": {"key": issue_key},
        "outwardIssue": {"key": epic_key}
    }

    response = requests.post(
        f"{JIRA_API_URL}/issueLink",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 201:
        print(f"   Linked to epic {epic_key}")
        return True
    else:
        print(f"   [WARN] Could not link to epic: {response.status_code}")
        return False

def main():
    if len(sys.argv) < 2:
        print("[ERROR] Usage: python create-localstack-tasks.py <jira-api-token>")
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
    print(f"[OK] Creating {len(LOCALSTACK_TASKS)} LocalStack tasks under epic {EPIC_KEY}")
    print()

    created_tasks = []
    for i, task in enumerate(LOCALSTACK_TASKS, start=66):
        print(f"[{i}] Creating: {task['summary']}")
        result = create_jira_task(auth, task)
        if result:
            created_tasks.append(result['key'])
            # Link to epic
            link_to_epic(auth, result['key'], EPIC_KEY)
        print()

    print(f"[SUMMARY] Created {len(created_tasks)} tasks:")
    for key in created_tasks:
        print(f"   - {key}")

if __name__ == "__main__":
    main()
