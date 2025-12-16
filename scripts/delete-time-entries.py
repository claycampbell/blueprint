"""
Delete time entries for a specific week.
Use this to clean up incorrect time entries.
"""

import requests
from datetime import datetime

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

def delete_time_entry(task_id, date):
    """Delete time entry for a task on a specific date."""
    payload = {"date": date}

    response = requests.delete(
        f"{BASE_URL}/tasks/{task_id}/time",
        headers=get_headers(),
        json=payload
    )
    response.raise_for_status()
    return response.json()

def main():
    """Delete all time entries for week of November 24-28, 2025."""

    print("Deleting incorrect time entries for week of November 24, 2025")
    print("=" * 80)

    # Week dates
    start_date = "2025-11-24"
    end_date = "2025-11-28"

    print(f"\nFetching time entries from {start_date} to {end_date}...\n")

    # Get all entries
    entries = get_my_time_entries(start_date, end_date)

    if not entries:
        print("[INFO] No time entries found for this week")
        return

    print(f"[FOUND] {len(entries)} time entries to delete\n")

    # Show what will be deleted
    total_hours = sum(e.get('time', 0) for e in entries) / 3600000
    print(f"Total hours that will be deleted: {total_hours:,.1f}h\n")

    print("Entries to delete:")
    for entry in entries:
        # Extract just the task ID string
        task_data = entry.get('task')
        if isinstance(task_data, dict):
            task_id = task_data.get('id')
        else:
            task_id = task_data

        date = entry.get('date')
        hours = entry.get('time', 0) / 3600000
        print(f"  {date}: {task_id} - {hours:,.1f}h")

    print(f"\n{'='*80}")
    print("[STARTED] Deleting time entries...\n")

    # Delete each entry
    deleted = 0
    errors = 0

    for entry in entries:
        # Extract just the task ID string
        task_data = entry.get('task')
        if isinstance(task_data, dict):
            task_id = task_data.get('id')
        else:
            task_id = task_data

        date = entry.get('date')
        hours = entry.get('time', 0) / 3600000

        try:
            delete_time_entry(task_id, date)
            print(f"[OK] Deleted {date}: {task_id} ({hours:,.1f}h)")
            deleted += 1
        except requests.exceptions.HTTPError as e:
            print(f"[ERROR] Failed to delete {task_id} on {date}")
            print(f"        {e}")
            if hasattr(e, 'response'):
                print(f"        Response: {e.response.text}")
            errors += 1
        except Exception as e:
            print(f"[ERROR] Unexpected error: {e}")
            errors += 1

    # Summary
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Entries deleted: {deleted}")
    print(f"Errors: {errors}")
    print(f"Total hours removed: {total_hours:,.1f}h")

    if errors == 0:
        print(f"\n[SUCCESS] All time entries deleted successfully!")
    else:
        print(f"\n[PARTIAL] Some deletions failed - check errors above")

if __name__ == "__main__":
    main()
