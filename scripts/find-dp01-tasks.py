"""
Find DP01 project and its tasks in Everhour.
"""

import os
import sys
import requests
import json

# API Configuration
EVERHOUR_API_TOKEN = os.getenv("EVERHOUR_API_TOKEN")

if not EVERHOUR_API_TOKEN:
    print("[ERROR] EVERHOUR_API_TOKEN environment variable must be set")
    sys.exit(1)

BASE_URL = "https://api.everhour.com"

def search_tasks(query):
    """Search for tasks by query."""
    headers = {
        "X-Api-Key": EVERHOUR_API_TOKEN,
        "Content-Type": "application/json"
    }

    # Try searching for tasks
    response = requests.get(
        f"{BASE_URL}/tasks/search",
        headers=headers,
        params={"query": query, "limit": 100}
    )

    if response.status_code == 200:
        return response.json()
    else:
        return []

def get_projects():
    """Get all projects."""
    headers = {
        "X-Api-Key": EVERHOUR_API_TOKEN,
        "Content-Type": "application/json"
    }

    response = requests.get(
        f"{BASE_URL}/projects",
        headers=headers
    )
    response.raise_for_status()
    return response.json()

def get_project_tasks(project_id):
    """Get all tasks for a project."""
    headers = {
        "X-Api-Key": EVERHOUR_API_TOKEN,
        "Content-Type": "application/json"
    }

    response = requests.get(
        f"{BASE_URL}/projects/{project_id}/tasks",
        headers=headers
    )

    if response.status_code == 404:
        return []

    response.raise_for_status()
    return response.json()

def main():
    print("Searching for DP01 project and tasks in Everhour...\n")

    try:
        # First try to search for DP01 tasks directly
        print("Searching for DP01 tasks...")
        dp01_tasks = search_tasks("DP01")

        if dp01_tasks:
            print(f"Found {len(dp01_tasks)} DP01 tasks!\n")

            # Show first 10 DP01 tasks with their IDs
            print("DP01 Tasks Found (showing first 10):")
            print("-" * 40)
            for i, task in enumerate(dp01_tasks[:10], 1):
                task_id = task.get('id')
                task_name = str(task.get('name', '')).encode('ascii', 'ignore').decode('ascii')
                print(f"{i}. Task ID: {task_id}")
                print(f"   Task Name: {task_name[:80]}")

                # Show project info if available
                projects = task.get('projects', [])
                if projects:
                    if isinstance(projects[0], str):
                        print(f"   Project: {projects[0]}")
                    elif isinstance(projects[0], dict):
                        print(f"   Project: {projects[0].get('name', 'Unknown')}")
                print()

        else:
            print("No DP01 tasks found via search.\n")

        # Also try to find the project by ID pattern
        print("\nLooking for project with ID pattern jr:6091-12165 (DP01 project)...")

        # Get all projects and look for the right one
        projects = get_projects()

        # Look for project ID that might be DP01
        # Based on pattern, DP01 might be jr:6091-12165 or similar
        for project in projects:
            project_id = str(project.get('id', ''))
            project_name = str(project.get('name', '')).encode('ascii', 'ignore').decode('ascii')

            # Check if this might be DP01 based on ID pattern or name
            if '12165' in project_id or 'DP01' in project_name.upper() or 'DATAPAGE' in project_name.upper():
                print(f"\nPotential DP01 Project Found!")
                print(f"  Project ID: {project_id}")
                print(f"  Project Name: {project_name}")

                # Try to get tasks
                tasks = get_project_tasks(project_id)
                if tasks:
                    print(f"  Found {len(tasks)} tasks")

                    # Show some task IDs and names
                    print(f"  Sample tasks:")
                    for task in tasks[:10]:
                        task_id = task.get('id')
                        task_name = str(task.get('name', '')).encode('ascii', 'ignore').decode('ascii')
                        print(f"    Task ID: {task_id}")
                        print(f"    Task Name: {task_name[:60]}...")

        # Show instruction for manual time entry
        print("\n" + "="*60)
        print("IMPORTANT: How to add time in Everhour")
        print("="*60)
        print("\nSince direct Jira task IDs (like DP01-74) aren't working,")
        print("you may need to:")
        print("\n1. Log into Everhour web interface")
        print("2. Search for 'DP01' or 'Datapage' in the search bar")
        print("3. Find the correct tasks")
        print("4. Add time entries manually")
        print("\nOR use the Everhour task IDs found above (format: jr:6091-XXXXX-YYYYY)")

    except requests.exceptions.HTTPError as e:
        print(f"[ERROR] Failed to search: {e}")
        if hasattr(e, 'response'):
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    main()