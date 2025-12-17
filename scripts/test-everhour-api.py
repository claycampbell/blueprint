"""
Test script for Everhour API connection and basic operations.
"""

import os
import sys
import requests
import json
from datetime import datetime, timedelta

# API Configuration
EVERHOUR_API_TOKEN = os.getenv("EVERHOUR_API_TOKEN")

if not EVERHOUR_API_TOKEN:
    print("[ERROR] EVERHOUR_API_TOKEN environment variable must be set")
    print("        Generate token at: https://everhour.com/app/settings/my-profile")
    sys.exit(1)
BASE_URL = "https://api.everhour.com"

class EverhourClient:
    """Client for interacting with Everhour API."""

    def __init__(self, api_token):
        self.api_token = api_token
        self.base_url = BASE_URL
        self.headers = {
            "X-Api-Key": api_token,
            "Content-Type": "application/json"
        }

    def get_current_user(self):
        """Get current user information."""
        response = requests.get(
            f"{self.base_url}/users/me",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

    def get_projects(self):
        """Get all projects."""
        response = requests.get(
            f"{self.base_url}/projects",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

    def get_task(self, task_id):
        """Get task details (works with Jira issue keys)."""
        response = requests.get(
            f"{self.base_url}/tasks/{task_id}",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

    def get_time_entries(self, start_date, end_date, limit=1000):
        """Get time entries for a date range."""
        params = {
            "from": start_date,
            "to": end_date,
            "limit": limit
        }

        response = requests.get(
            f"{self.base_url}/team/time",
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()

    def get_running_timer(self):
        """Get currently running timer."""
        response = requests.get(
            f"{self.base_url}/timers/current",
            headers=self.headers
        )
        # May return 404 if no timer running
        if response.status_code == 404:
            return None
        response.raise_for_status()
        return response.json()


def print_section(title):
    """Print a section header."""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")


def main():
    """Test Everhour API connection and basic operations."""

    print("Everhour API Test Script")
    print(f"API Token: {EVERHOUR_API_TOKEN[:10]}...")

    everhour = EverhourClient(EVERHOUR_API_TOKEN)

    # Test 1: Get Current User
    print_section("Test 1: Get Current User")
    try:
        user = everhour.get_current_user()
        print(f"[OK] Successfully authenticated!")
        print(f"User ID: {user.get('id')}")
        print(f"Name: {user.get('name')}")
        print(f"Email: {user.get('email')}")
        print(f"Status: {user.get('status')}")
        print(f"\nFull response:")
        print(json.dumps(user, indent=2))
    except requests.exceptions.HTTPError as e:
        print(f"[ERROR] Failed to get user: {e}")
        print(f"Response: {e.response.text}")
        return

    # Test 2: Get Projects
    print_section("Test 2: Get Projects")
    try:
        projects = everhour.get_projects()
        print(f"[OK] Found {len(projects)} projects")

        for project in projects[:5]:  # Show first 5 projects
            print(f"\nProject: {project.get('name')}")
            print(f"  ID: {project.get('id')}")
            print(f"  Type: {project.get('type')}")
            print(f"  Workspace: {project.get('workspace')}")

            # Look for Jira projects
            if project.get('type') == 'jira':
                print(f"  [JIRA PROJECT FOUND]")

        if len(projects) > 5:
            print(f"\n... and {len(projects) - 5} more projects")

    except requests.exceptions.HTTPError as e:
        print(f"[ERROR] Failed to get projects: {e}")
        print(f"Response: {e.response.text}")

    # Test 3: Get Running Timer
    print_section("Test 3: Get Running Timer")
    try:
        timer = everhour.get_running_timer()
        if timer:
            print(f"[OK] Timer is running!")
            print(json.dumps(timer, indent=2))
        else:
            print(f"[INFO] No timer currently running")
    except requests.exceptions.HTTPError as e:
        print(f"[ERROR] Failed to get timer: {e}")
        print(f"Response: {e.response.text}")

    # Test 4: Get Recent Time Entries
    print_section("Test 4: Get Recent Time Entries (Last 30 Days)")
    try:
        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")

        entries = everhour.get_time_entries(start_date, end_date)
        print(f"[OK] Found {len(entries)} time entries")

        if entries:
            print(f"\nMost recent entries:")
            for entry in entries[:5]:  # Show first 5 entries
                hours = entry.get('time', 0) / 3600000
                print(f"\n  Date: {entry.get('date')}")
                print(f"  Task: {entry.get('task')}")
                print(f"  Time: {hours:.2f} hours")
                if entry.get('comment'):
                    print(f"  Comment: {entry.get('comment')[:50]}...")

            # Show summary by task
            print(f"\n\nTime Summary by Task:")
            task_times = {}
            for entry in entries:
                task_id = entry.get('task')
                time_ms = entry.get('time', 0)
                task_times[task_id] = task_times.get(task_id, 0) + time_ms

            for task_id, total_ms in sorted(task_times.items(), key=lambda x: x[1], reverse=True)[:10]:
                hours = total_ms / 3600000
                print(f"  {task_id}: {hours:.2f} hours")
        else:
            print(f"[INFO] No time entries found in the last 30 days")

    except requests.exceptions.HTTPError as e:
        print(f"[ERROR] Failed to get time entries: {e}")
        print(f"Response: {e.response.text}")

    # Test 5: Try to get a Jira issue (if we found any Jira projects)
    print_section("Test 5: Get Jira Issue (DP01-74)")
    try:
        # Try to get a known Jira issue from the DP01 project
        task = everhour.get_task("DP01-74")
        print(f"[OK] Successfully retrieved Jira issue!")
        print(f"Task ID: {task.get('id')}")
        print(f"Name: {task.get('name')}")

        if 'time' in task:
            total_hours = task['time'].get('total', 0) / 3600000
            print(f"Total Time: {total_hours:.2f} hours")

            if 'users' in task['time']:
                print(f"Time by User:")
                for user_id, time_ms in task['time']['users'].items():
                    hours = time_ms / 3600000
                    print(f"  User {user_id}: {hours:.2f} hours")

        print(f"\nFull response:")
        print(json.dumps(task, indent=2))

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print(f"[INFO] Issue DP01-74 not found in Everhour")
            print(f"[INFO] This is normal if the issue hasn't had time tracked yet")
        else:
            print(f"[ERROR] Failed to get Jira issue: {e}")
            print(f"Response: {e.response.text}")

    print_section("Test Complete")
    print("All API tests completed successfully!")


if __name__ == "__main__":
    main()
