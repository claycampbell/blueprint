"""
Verify time entries for the week of November 24, 2025.
"""

import requests
from datetime import datetime
from collections import defaultdict

# API Configuration
EVERHOUR_API_TOKEN = "a25e-e33f-b2662e-3c5019-6f6073e6"
BASE_URL = "https://api.everhour.com"

def get_headers():
    """Get API headers."""
    return {
        "X-Api-Key": EVERHOUR_API_TOKEN,
        "Content-Type": "application/json"
    }

def get_my_time_entries(start_date, end_date):
    """Get time entries for current user."""
    params = {
        "from": start_date,
        "to": end_date,
        "limit": 1000
    }

    response = requests.get(
        f"{BASE_URL}/users/me/time",
        headers=get_headers(),
        params=params
    )
    response.raise_for_status()
    return response.json()

def get_task_details(task_id):
    """Get task details."""
    response = requests.get(
        f"{BASE_URL}/tasks/{task_id}",
        headers=get_headers()
    )

    if response.status_code == 404:
        return None

    response.raise_for_status()
    return response.json()

def main():
    """Verify time entries for November 24-28, 2025."""

    print("Verifying time entries for week of November 24, 2025")
    print("=" * 80)

    # Get time entries for the week
    start_date = "2025-11-24"
    end_date = "2025-11-28"

    print(f"\nFetching time entries from {start_date} to {end_date}...\n")

    entries = get_my_time_entries(start_date, end_date)

    if not entries:
        print("[ERROR] No time entries found for this week!")
        return

    print(f"[OK] Found {len(entries)} time entries\n")

    # Group by date
    by_date = defaultdict(list)
    for entry in entries:
        date = entry.get('date')
        by_date[date].append(entry)

    # Display day by day
    total_hours = 0

    for date in sorted(by_date.keys()):
        day_entries = by_date[date]
        day_total = sum(e.get('time', 0) for e in day_entries) / 3600000
        total_hours += day_total

        day_name = datetime.strptime(date, "%Y-%m-%d").strftime("%A")

        print(f"{day_name}, {date} - {day_total}h total:")
        print("-" * 80)

        for entry in day_entries:
            hours = entry.get('time', 0) / 3600000
            task_id = entry.get('task')
            comment = entry.get('comment', 'No comment')

            # Try to get task name
            task_name = task_id
            try:
                task = get_task_details(task_id)
                if task:
                    task_name = task.get('name', task_id)
            except:
                pass

            print(f"  {hours}h - {task_name}")
            print(f"         Comment: {comment}")

        print()

    # Summary
    print("=" * 80)
    print(f"SUMMARY")
    print("=" * 80)
    print(f"Total Hours: {total_hours}h")
    print(f"Total Days: {len(by_date)}")
    print(f"Total Entries: {len(entries)}")
    print(f"Average Hours/Day: {total_hours/len(by_date):.1f}h")

    if total_hours == 20:
        print(f"\n[SUCCESS] Exactly 20 hours logged for the week!")
    else:
        print(f"\n[WARNING] Total is {total_hours}h, expected 20h")

if __name__ == "__main__":
    main()
