"""
Get time entries for the current user.
Uses the user's own time endpoint which doesn't require admin permissions.
"""

import os
import sys
import requests
import json
from datetime import datetime, timedelta
from collections import defaultdict

# API Configuration
EVERHOUR_API_TOKEN = os.getenv("EVERHOUR_API_TOKEN")

if not EVERHOUR_API_TOKEN:
    print("[ERROR] EVERHOUR_API_TOKEN environment variable must be set")
    print("        Generate token at: https://everhour.com/app/settings/my-profile")
    sys.exit(1)
BASE_URL = "https://api.everhour.com"

def get_current_user():
    """Get current user information."""
    headers = {
        "X-Api-Key": EVERHOUR_API_TOKEN,
        "Content-Type": "application/json"
    }

    response = requests.get(
        f"{BASE_URL}/users/me",
        headers=headers
    )
    response.raise_for_status()
    return response.json()

def get_my_time_entries(start_date, end_date):
    """Get time entries for current user."""
    headers = {
        "X-Api-Key": EVERHOUR_API_TOKEN,
        "Content-Type": "application/json"
    }

    # Try the user-specific endpoint
    params = {
        "from": start_date,
        "to": end_date,
        "limit": 1000
    }

    response = requests.get(
        f"{BASE_URL}/users/me/time",
        headers=headers,
        params=params
    )
    response.raise_for_status()
    return response.json()

def get_task_details(task_id):
    """Get task details."""
    headers = {
        "X-Api-Key": EVERHOUR_API_TOKEN,
        "Content-Type": "application/json"
    }

    response = requests.get(
        f"{BASE_URL}/tasks/{task_id}",
        headers=headers
    )

    if response.status_code == 404:
        return None

    response.raise_for_status()
    return response.json()

def main():
    print("Getting your time entries from Everhour...\n")

    # Get current user
    user = get_current_user()
    print(f"User: {user.get('name')} ({user.get('email')})")
    print(f"User ID: {user.get('id')}\n")

    # Get time entries for last 30 days
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")

    print(f"Fetching time entries from {start_date} to {end_date}...")

    try:
        entries = get_my_time_entries(start_date, end_date)
        print(f"[OK] Found {len(entries)} time entries\n")

        if entries:
            # Group by task
            by_task = defaultdict(list)
            for entry in entries:
                task_id = entry.get('task')
                by_task[task_id].append(entry)

            print(f"{'='*80}")
            print(f"Time Entries by Task")
            print(f"{'='*80}\n")

            # Sort by total time per task
            sorted_tasks = sorted(
                by_task.items(),
                key=lambda x: sum(e.get('time', 0) for e in x[1]),
                reverse=True
            )

            for task_id, task_entries in sorted_tasks:
                total_time = sum(e.get('time', 0) for e in task_entries)
                hours = total_time / 3600000

                print(f"Task ID: {task_id}")
                print(f"Total Time: {hours:.2f} hours ({len(task_entries)} entries)")

                # Try to get task details
                try:
                    task = get_task_details(task_id)
                    if task:
                        print(f"Task Name: {task.get('name')}")
                        if task.get('status'):
                            print(f"Status: {task.get('status')}")
                except:
                    pass

                # Show individual entries
                print(f"\nEntries:")
                for entry in sorted(task_entries, key=lambda x: x.get('date')):
                    entry_hours = entry.get('time', 0) / 3600000
                    date = entry.get('date')
                    comment = entry.get('comment', '')

                    print(f"  {date}: {entry_hours:.2f}h", end='')
                    if comment:
                        print(f" - {comment[:60]}{'...' if len(comment) > 60 else ''}")
                    else:
                        print()

                print()

            # Summary
            print(f"{'='*80}")
            print(f"Summary")
            print(f"{'='*80}\n")

            total_hours = sum(e.get('time', 0) for e in entries) / 3600000
            unique_tasks = len(by_task)
            unique_dates = len(set(e.get('date') for e in entries))

            print(f"Total Time: {total_hours:.2f} hours")
            print(f"Unique Tasks: {unique_tasks}")
            print(f"Days with Time Logged: {unique_dates}")
            print(f"Average Hours per Day: {total_hours/unique_dates:.2f}h")

            # Daily breakdown
            by_date = defaultdict(float)
            for entry in entries:
                date = entry.get('date')
                hours = entry.get('time', 0) / 3600000
                by_date[date] += hours

            print(f"\nTime by Date:")
            for date in sorted(by_date.keys(), reverse=True)[:10]:
                print(f"  {date}: {by_date[date]:.2f}h")

        else:
            print("[INFO] No time entries found in the last 30 days")

    except requests.exceptions.HTTPError as e:
        print(f"[ERROR] Failed to get time entries: {e}")
        if hasattr(e, 'response'):
            print(f"Status Code: {e.response.status_code}")
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    main()
