"""
Find available projects and tasks in Everhour to get the correct IDs.
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
    print("Finding available projects and tasks in Everhour...\n")

    try:
        # Get all projects
        projects = get_projects()
        print(f"Found {len(projects)} projects\n")

        # Look for DP01 or Datapage related projects
        dp01_projects = []

        for project in projects:
            project_id = project.get('id', '')
            project_name = project.get('name', '')
            project_type = project.get('type', 'unknown')

            # Check if this might be a DP01 project
            if 'DP01' in project_name.upper() or 'DATAPAGE' in project_name.upper() or 'DP01' in str(project_id).upper():
                dp01_projects.append(project)

            # Also show all Jira projects
            if project_type == 'jira' or 'jr:' in str(project_id):
                print(f"Jira Project Found:")
                print(f"  ID: {project_id}")
                print(f"  Name: {project_name}")
                print(f"  Type: {project_type}")

                # Try to get tasks for this project
                tasks = get_project_tasks(project_id)
                if tasks:
                    print(f"  Tasks: {len(tasks)} tasks found")

                    # Show first 10 tasks that might be DP01 related
                    dp_tasks = [t for t in tasks if 'DP01' in str(t.get('name', '')).upper()]
                    if dp_tasks:
                        print(f"  DP01 Tasks:")
                        for task in dp_tasks[:10]:
                            task_id = task.get('id')
                            task_name = task.get('name')
                            print(f"    - ID: {task_id}")
                            print(f"      Name: {task_name}")
                else:
                    print(f"  Tasks: No tasks found or not accessible")
                print()

        # If we found DP01 projects, show them
        if dp01_projects:
            print("\n" + "="*60)
            print("DP01/DATAPAGE PROJECTS FOUND:")
            print("="*60)

            for project in dp01_projects:
                print(f"\nProject: {project.get('name')}")
                print(f"ID: {project.get('id')}")
                print(f"Type: {project.get('type', 'unknown')}")

                # Get tasks
                tasks = get_project_tasks(project.get('id'))
                if tasks:
                    print(f"Tasks ({len(tasks)} total):")
                    for task in tasks[:20]:  # Show first 20 tasks
                        print(f"  - {task.get('id')}: {task.get('name')}")

        # Also show all available projects for reference
        print("\n" + "="*60)
        print("ALL AVAILABLE PROJECTS:")
        print("="*60)

        for project in projects:
            print(f"\nProject: {project.get('name')}")
            print(f"  ID: {project.get('id')}")
            print(f"  Type: {project.get('type', 'unknown')}")

    except requests.exceptions.HTTPError as e:
        print(f"[ERROR] Failed to get projects: {e}")
        if hasattr(e, 'response'):
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    main()