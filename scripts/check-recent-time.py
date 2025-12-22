"""
Check recent time entries with better formatting and date handling.
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
    sys.exit(1)

BASE_URL = "https://api.everhour.com"

def get_my_time_entries(start_date, end_date):
    """Get time entries for current user."""
    headers = {
        "X-Api-Key": EVERHOUR_API_TOKEN,
        "Content-Type": "application/json"
    }

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

def main():
    print("Checking time entries for the past several weeks...\n")

    # Look at November 25, 2024 through today
    start_date = "2024-11-25"
    end_date = datetime.now().strftime("%Y-%m-%d")

    print(f"Date range: {start_date} to {end_date}\n")

    try:
        entries = get_my_time_entries(start_date, end_date)
        print(f"Found {len(entries)} time entries\n")

        if entries:
            # Group by date
            by_date = defaultdict(list)
            for entry in entries:
                date = entry.get('date')
                by_date[date].append(entry)

            # Show all dates with entries
            print("Dates with time entries:")
            print("-" * 40)

            total_hours = 0
            for date in sorted(by_date.keys()):
                day_entries = by_date[date]
                day_hours = sum(e.get('time', 0) for e in day_entries) / 3600000
                total_hours += day_hours

                # Parse date for day name
                date_obj = datetime.strptime(date, '%Y-%m-%d')
                day_name = date_obj.strftime('%A')

                print(f"{date} ({day_name}): {day_hours:.2f}h - {len(day_entries)} entries")

                # Show individual entries for this date
                for entry in day_entries:
                    hours = entry.get('time', 0) / 3600000
                    task = entry.get('task')

                    # Handle task which might be dict or string
                    if isinstance(task, dict):
                        task_name = task.get('name', task.get('id', 'Unknown'))
                    else:
                        task_name = task or 'Unknown'

                    comment = entry.get('comment', '')
                    print(f"  -> {hours:.2f}h: {task_name}")
                    if comment:
                        print(f"     Comment: {comment[:80]}...")

            print(f"\nTotal hours: {total_hours:.2f}")

            # Check for gaps in last week (Dec 16-22, 2024)
            print("\n" + "="*60)
            print("LAST WEEK (December 16-22, 2024) Analysis:")
            print("="*60)

            last_week_dates = []
            for i in range(7):
                date = datetime(2024, 12, 16) + timedelta(days=i)
                date_str = date.strftime('%Y-%m-%d')
                last_week_dates.append(date_str)

            last_week_hours = 0
            for date_str in last_week_dates:
                day_name = datetime.strptime(date_str, '%Y-%m-%d').strftime('%A')
                if date_str in by_date:
                    hours = sum(e.get('time', 0) for e in by_date[date_str]) / 3600000
                    last_week_hours += hours
                    print(f"{date_str} ({day_name}): {hours:.2f}h logged")
                else:
                    print(f"{date_str} ({day_name}): NO TIME LOGGED")

            print(f"\nTotal last week: {last_week_hours:.2f} hours")

            if last_week_hours == 0:
                print("\nWARNING: No time logged for last week!")
                print("You may want to add time entries for the work done last week.")

        else:
            print("No time entries found in this date range.")

    except requests.exceptions.HTTPError as e:
        print(f"[ERROR] Failed to get time entries: {e}")
        if hasattr(e, 'response'):
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    main()