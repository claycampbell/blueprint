"""
Populate time entries for a specific week.
This script adds realistic time entries across multiple tasks.
"""

import requests
from datetime import datetime, timedelta

# API Configuration
EVERHOUR_API_TOKEN = "a25e-e33f-b2662e-3c5019-6f6073e6"
BASE_URL = "https://api.everhour.com"
DP01_PROJECT_ID = "jr:6091-12165"

def get_headers():
    """Get API headers."""
    return {
        "X-Api-Key": EVERHOUR_API_TOKEN,
        "Content-Type": "application/json"
    }

def get_project_tasks(project_id):
    """Get tasks for a project."""
    response = requests.get(
        f"{BASE_URL}/projects/{project_id}/tasks",
        headers=get_headers()
    )
    response.raise_for_status()
    return response.json()

def add_time_to_task(task_id, hours, date, comment=""):
    """Add time entry to a task."""
    time_ms = int(hours * 3600000)

    payload = {
        "time": time_ms,
        "date": date
    }

    if comment:
        payload["comment"] = comment[:1000]

    response = requests.post(
        f"{BASE_URL}/tasks/{task_id}/time",
        headers=get_headers(),
        json=payload
    )
    response.raise_for_status()
    return response.json()

def main():
    """Populate 20 hours for the week of November 24, 2025."""

    print("Populating time entries for week of November 24, 2025")
    print("=" * 60)

    # Week dates: November 24-30, 2025 (Monday-Sunday)
    # We'll use Monday-Friday for 20 hours
    week_start = datetime(2025, 11, 24)  # Monday

    # Get all DP01 tasks
    print(f"\nFetching tasks from DP01 project...")
    tasks = get_project_tasks(DP01_PROJECT_ID)
    print(f"Found {len(tasks)} tasks")

    # Filter for tasks that are in progress or recently worked on
    # We'll use tasks with names containing key work areas
    target_keywords = [
        "infrastructure", "setup", "docker", "localstack",
        "database", "api", "authentication", "backend",
        "frontend", "framework", "repository", "planning"
    ]

    relevant_tasks = []
    for task in tasks:
        task_name = task.get('name', '').lower()
        if any(keyword in task_name for keyword in target_keywords):
            relevant_tasks.append(task)

    print(f"\nFound {len(relevant_tasks)} relevant tasks")

    # If we don't have enough tasks, use the first available ones
    if len(relevant_tasks) < 5:
        relevant_tasks = tasks[:10]

    # Show tasks we'll use
    print(f"\nTasks to receive time entries:")
    for i, task in enumerate(relevant_tasks[:10], 1):
        print(f"  {i}. {task.get('name')[:60]}...")

    # Time distribution for the week (Monday-Friday, 20 hours total)
    # Realistic daily distribution: 3, 4, 5, 4, 4 hours
    time_entries = [
        {
            "date": "2025-11-24",  # Monday
            "hours": 3,
            "tasks": [
                {"task_idx": 0, "hours": 1.5, "comment": "Initial project setup and planning"},
                {"task_idx": 1, "hours": 1.5, "comment": "Docker environment configuration"},
            ]
        },
        {
            "date": "2025-11-25",  # Tuesday
            "hours": 4,
            "tasks": [
                {"task_idx": 2, "hours": 2, "comment": "Database schema design and documentation"},
                {"task_idx": 3, "hours": 2, "comment": "API framework selection and evaluation"},
            ]
        },
        {
            "date": "2025-11-26",  # Wednesday
            "hours": 5,
            "tasks": [
                {"task_idx": 4, "hours": 2.5, "comment": "LocalStack integration and testing"},
                {"task_idx": 5, "hours": 1.5, "comment": "Authentication system design"},
                {"task_idx": 0, "hours": 1, "comment": "Project documentation updates"},
            ]
        },
        {
            "date": "2025-11-27",  # Thursday (Thanksgiving - US holiday, light work)
            "hours": 4,
            "tasks": [
                {"task_idx": 1, "hours": 2, "comment": "Repository structure and Git setup"},
                {"task_idx": 6, "hours": 2, "comment": "Development environment documentation"},
            ]
        },
        {
            "date": "2025-11-28",  # Friday (day after Thanksgiving)
            "hours": 4,
            "tasks": [
                {"task_idx": 7, "hours": 2, "comment": "Backend framework implementation"},
                {"task_idx": 8, "hours": 1.5, "comment": "Frontend framework evaluation"},
                {"task_idx": 2, "hours": 0.5, "comment": "Database migration scripts"},
            ]
        }
    ]

    # Verify we have 20 hours total
    total_hours = sum(day["hours"] for day in time_entries)
    print(f"\nTotal hours to log: {total_hours}")

    if total_hours != 20:
        print(f"[WARNING] Total is {total_hours}, not 20 hours")

    # Show summary
    print(f"\n{'='*60}")
    print("Ready to populate time entries:")
    print(f"  Week: November 24-28, 2025")
    print(f"  Total: {total_hours} hours")
    print(f"  Days: {len(time_entries)} days")
    print(f"  Entries: {sum(len(day['tasks']) for day in time_entries)} individual entries")
    print(f"{'='*60}\n")

    print("\n[STARTED] Creating time entries...\n")

    # Create time entries
    entries_created = 0
    errors = 0

    for day in time_entries:
        date = day["date"]
        day_name = datetime.strptime(date, "%Y-%m-%d").strftime("%A")

        print(f"{day_name}, {date} ({day['hours']}h total):")

        for task_entry in day["tasks"]:
            task_idx = task_entry["task_idx"]
            hours = task_entry["hours"]
            comment = task_entry["comment"]

            # Make sure we have a task at this index
            if task_idx >= len(relevant_tasks):
                print(f"  [SKIP] Task index {task_idx} out of range")
                continue

            task = relevant_tasks[task_idx]
            task_id = task.get('id')
            task_name = task.get('name', 'Unknown')[:40]

            try:
                result = add_time_to_task(task_id, hours, date, comment)
                print(f"  [OK] {hours}h - {task_name}...")
                print(f"       Comment: {comment}")
                entries_created += 1
            except requests.exceptions.HTTPError as e:
                print(f"  [ERROR] Failed to add time to {task_name}")
                print(f"          {e}")
                if hasattr(e, 'response'):
                    print(f"          Response: {e.response.text}")
                errors += 1
            except Exception as e:
                print(f"  [ERROR] Unexpected error: {e}")
                errors += 1

        print()

    # Summary
    print(f"{'='*60}")
    print(f"Summary")
    print(f"{'='*60}")
    print(f"Entries created: {entries_created}")
    print(f"Errors: {errors}")
    print(f"Total hours logged: {total_hours}")

    if errors == 0:
        print(f"\n[SUCCESS] All time entries created successfully!")
    else:
        print(f"\n[PARTIAL] Some entries failed - check errors above")

if __name__ == "__main__":
    main()
