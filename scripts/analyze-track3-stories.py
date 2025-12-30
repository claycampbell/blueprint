#!/usr/bin/env python3
"""
Analyze all Track 3 stories to identify consolidation opportunities.

Usage:
    python scripts/analyze-track3-stories.py
"""

import os
import sys
import requests
from requests.auth import HTTPBasicAuth
from collections import defaultdict
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"
PROJECT_KEY = "DP01"

# Track 3 Epics
TRACK3_EPICS = [
    "DP01-21",  # Technical Foundation
    "DP01-22",  # Core Data Model
    "DP01-23",  # Authentication & Authorization
    "DP01-30",  # Task Management
    "DP01-35",  # Contact Management
    "DP01-40",  # DevOps & Infrastructure
]

# Get credentials from environment variables
JIRA_EMAIL = os.getenv("JIRA_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")

if not JIRA_EMAIL or not JIRA_API_TOKEN:
    print("[ERROR] JIRA_EMAIL and JIRA_API_TOKEN environment variables must be set")
    print("[ERROR] Make sure .env file exists with these values")
    sys.exit(1)


def search_issues(auth, jql, max_results=200):
    """Search Jira issues using JQL."""
    payload = {
        "jql": jql,
        "maxResults": max_results,
        "fields": ["summary", "status", "issuetype", "priority", "parent", "description", "labels", "subtasks"]
    }

    response = requests.post(
        f"{JIRA_API_URL}/search/jql",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    if response.status_code == 200:
        data = response.json()
        return data.get('issues', [])
    else:
        print(f"[ERROR] Search failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return []


def get_epic_children(auth, epic_key):
    """Get all child issues of an epic."""
    jql = f"parent = {epic_key} ORDER BY created ASC"
    return search_issues(auth, jql)


def analyze_epic_structure(auth, epic_key):
    """Analyze the structure of an epic and its children."""
    # Get epic details
    response = requests.get(
        f"{JIRA_API_URL}/issue/{epic_key}",
        auth=auth,
        params={"fields": "summary,description,issuetype,status"}
    )

    if response.status_code != 200:
        print(f"[ERROR] Failed to get epic {epic_key}")
        return None

    epic = response.json()
    children = get_epic_children(auth, epic_key)

    # Categorize children by type
    by_type = defaultdict(list)
    for child in children:
        issue_type = child['fields']['issuetype']['name']
        by_type[issue_type].append(child)

    # Count subtasks
    total_subtasks = sum(len(child['fields'].get('subtasks', [])) for child in children)

    return {
        'epic_key': epic_key,
        'epic_summary': epic['fields']['summary'],
        'epic_description': epic['fields'].get('description', ''),
        'total_children': len(children),
        'children_by_type': {k: len(v) for k, v in by_type.items()},
        'total_subtasks': total_subtasks,
        'children': children
    }


def print_analysis(analysis):
    """Print epic analysis."""
    print(f"\n{'='*80}")
    print(f"EPIC: {analysis['epic_key']} - {analysis['epic_summary']}")
    print(f"{'='*80}")
    print(f"Total Children: {analysis['total_children']}")
    print(f"Total Subtasks: {analysis['total_subtasks']}")
    print(f"\nChildren by Type:")
    for issue_type, count in analysis['children_by_type'].items():
        print(f"  {issue_type}: {count}")

    print(f"\nAll Children:")
    for child in analysis['children']:
        key = child['key']
        summary = child['fields']['summary']
        issue_type = child['fields']['issuetype']['name']
        subtask_count = len(child['fields'].get('subtasks', []))
        subtask_info = f" ({subtask_count} subtasks)" if subtask_count > 0 else ""
        print(f"  [{key}] ({issue_type}){subtask_info} {summary}")


def identify_consolidation_opportunities(all_analyses):
    """Identify consolidation opportunities across all epics."""
    print(f"\n{'='*80}")
    print("CONSOLIDATION OPPORTUNITIES")
    print(f"{'='*80}\n")

    total_stories = 0
    total_tasks = 0
    total_subtasks = 0

    for analysis in all_analyses:
        for issue_type, count in analysis['children_by_type'].items():
            if issue_type == 'Story':
                total_stories += count
            elif issue_type == 'Task':
                total_tasks += count
        total_subtasks += analysis['total_subtasks']

    print(f"CURRENT STATE:")
    print(f"  Total Epics: {len(all_analyses)}")
    print(f"  Total Stories: {total_stories}")
    print(f"  Total Tasks: {total_tasks}")
    print(f"  Total Subtasks: {total_subtasks}")
    print(f"  Total Items: {total_stories + total_tasks + total_subtasks}")

    print(f"\nGRANULARITY ISSUES:")

    # Identify overly granular stories
    for analysis in all_analyses:
        granular_children = []
        for child in analysis['children']:
            summary = child['fields']['summary'].lower()
            # Look for implementation-level details in titles
            if any(keyword in summary for keyword in ['table', 'endpoint', 'migration', 'schema', 'validation', 'test']):
                granular_children.append(child)

        if granular_children:
            print(f"\n  {analysis['epic_key']} has {len(granular_children)} potentially over-granular items:")
            for child in granular_children[:5]:  # Show first 5
                print(f"    - [{child['key']}] {child['fields']['summary']}")
            if len(granular_children) > 5:
                print(f"    ... and {len(granular_children) - 5} more")

    # Calculate average children per epic
    avg_children = sum(a['total_children'] for a in all_analyses) / len(all_analyses)
    print(f"\n  Average children per epic: {avg_children:.1f}")
    print(f"  Recommendation: Product features should have 3-8 stories each")

    return {
        'total_stories': total_stories,
        'total_tasks': total_tasks,
        'total_subtasks': total_subtasks,
        'avg_children_per_epic': avg_children
    }


def main():
    """Main function."""
    auth = HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN)

    # Verify authentication
    print("[INFO] Authenticating with Jira...")
    response = requests.get(f"{JIRA_API_URL}/myself", auth=auth)
    if response.status_code != 200:
        print(f"[ERROR] Authentication failed: {response.status_code}")
        sys.exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated as: {user_info['displayName']}")
    print(f"[OK] Analyzing Track 3 Platform Development epics...\n")

    # Analyze all Track 3 epics
    all_analyses = []
    for epic_key in TRACK3_EPICS:
        print(f"[INFO] Analyzing {epic_key}...")
        analysis = analyze_epic_structure(auth, epic_key)
        if analysis:
            all_analyses.append(analysis)
            print_analysis(analysis)

    # Identify consolidation opportunities
    stats = identify_consolidation_opportunities(all_analyses)

    # Save detailed analysis to JSON file
    output_file = "track3-analysis.json"
    with open(output_file, 'w') as f:
        json.dump({
            'analyses': all_analyses,
            'summary': stats
        }, f, indent=2, default=str)

    print(f"\n[OK] Detailed analysis saved to: {output_file}")


if __name__ == "__main__":
    main()
