"""
Find the DP01 project in Everhour and list its tasks.
"""

import os
import sys
import requests
import json

# API Configuration
EVERHOUR_API_TOKEN = os.getenv("EVERHOUR_API_TOKEN")

if not EVERHOUR_API_TOKEN:
    print("[ERROR] EVERHOUR_API_TOKEN environment variable must be set")
    print("        Generate token at: https://everhour.com/app/settings/my-profile")
    sys.exit(1)
BASE_URL = "https://api.everhour.com"

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
    """Get tasks for a project."""
    headers = {
        "X-Api-Key": EVERHOUR_API_TOKEN,
        "Content-Type": "application/json"
    }

    response = requests.get(
        f"{BASE_URL}/projects/{project_id}/tasks",
        headers=headers
    )
    response.raise_for_status()
    return response.json()

def main():
    print("Searching for DP01 project in Everhour...\n")

    # Get all projects
    projects = get_projects()

    print(f"Found {len(projects)} total projects\n")

    # Search for DP01
    dp01_projects = [p for p in projects if 'DP01' in p.get('name', '') or 'Datapage' in p.get('name', '')]

    if not dp01_projects:
        print("DP01 project not found. Showing all project names:")
        for project in projects:
            print(f"  - {project.get('name')} (ID: {project.get('id')})")
    else:
        print(f"Found {len(dp01_projects)} matching project(s):")

        for project in dp01_projects:
            print(f"\n{'='*60}")
            print(f"Project: {project.get('name')}")
            print(f"ID: {project.get('id')}")
            print(f"Type: {project.get('type')}")
            print(f"Workspace: {project.get('workspace')}")
            print(f"{'='*60}")

            # Try to get tasks
            try:
                print(f"\nFetching tasks for project {project.get('id')}...")
                tasks = get_project_tasks(project.get('id'))

                if tasks:
                    print(f"Found {len(tasks)} tasks:\n")

                    for task in tasks[:10]:  # Show first 10 tasks
                        task_name = task.get('name', 'Unnamed')
                        task_id = task.get('id', 'Unknown')
                        total_time = task.get('time', {}).get('total', 0)
                        hours = total_time / 3600000

                        print(f"  Task: {task_name}")
                        print(f"    ID: {task_id}")
                        print(f"    Time: {hours:.2f} hours")

                        if task.get('status'):
                            print(f"    Status: {task.get('status')}")
                        print()

                    if len(tasks) > 10:
                        print(f"  ... and {len(tasks) - 10} more tasks")
                else:
                    print("  No tasks found in this project")

            except requests.exceptions.HTTPError as e:
                print(f"  [ERROR] Failed to get tasks: {e}")
                if hasattr(e, 'response'):
                    print(f"  Response: {e.response.text}")

if __name__ == "__main__":
    main()
