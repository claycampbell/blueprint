"""
Analyze weekly time entries since end of November to identify gaps.
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

def get_week_dates(date):
    """Get Monday and Sunday for a given date."""
    weekday = date.weekday()
    monday = date - timedelta(days=weekday)
    sunday = monday + timedelta(days=6)
    return monday, sunday

def analyze_weekly_time():
    print("Analyzing time entries since end of November...\n")

    # Get current user
    user = get_current_user()
    print(f"User: {user.get('name')} ({user.get('email')})")
    print(f"User ID: {user.get('id')}\n")

    # Set date range: from November 25, 2024 to today
    start_date = "2024-11-25"  # Monday after Thanksgiving
    end_date = datetime.now().strftime("%Y-%m-%d")

    print(f"Fetching time entries from {start_date} to {end_date}...")

    try:
        entries = get_my_time_entries(start_date, end_date)
        print(f"[OK] Found {len(entries)} time entries\n")

        # Group by week
        weekly_data = defaultdict(lambda: {
            'hours': 0,
            'days_with_entries': set(),
            'tasks': set(),
            'entries': []
        })

        for entry in entries:
            entry_date = datetime.strptime(entry.get('date'), '%Y-%m-%d')
            monday, sunday = get_week_dates(entry_date)
            week_key = f"{monday.strftime('%Y-%m-%d')} to {sunday.strftime('%Y-%m-%d')}"

            hours = entry.get('time', 0) / 3600000
            weekly_data[week_key]['hours'] += hours
            weekly_data[week_key]['days_with_entries'].add(entry.get('date'))

            # Handle task which might be a dict or string
            task = entry.get('task')
            if isinstance(task, dict):
                task_id = task.get('id', 'unknown')
            else:
                task_id = task or 'unknown'
            weekly_data[week_key]['tasks'].add(task_id)
            weekly_data[week_key]['entries'].append(entry)

        print(f"{'='*80}")
        print(f"WEEKLY TIME SUMMARY")
        print(f"{'='*80}\n")

        # Sort weeks chronologically
        sorted_weeks = sorted(weekly_data.keys())

        total_hours_all_time = 0
        weeks_with_time = 0

        for week in sorted_weeks:
            data = weekly_data[week]
            total_hours = data['hours']
            total_hours_all_time += total_hours

            if total_hours > 0:
                weeks_with_time += 1

            print(f"Week: {week}")

            if total_hours == 0:
                print(f"  WARNING: NO TIME LOGGED THIS WEEK")
            else:
                print(f"  Total Hours: {total_hours:.2f}")
                print(f"  Days with entries: {len(data['days_with_entries'])}")
                print(f"  Unique tasks: {len(data['tasks'])}")

                # Show daily breakdown for the week
                daily_hours = defaultdict(float)
                for entry in data['entries']:
                    daily_hours[entry.get('date')] += entry.get('time', 0) / 3600000

                print(f"  Daily breakdown:")
                week_start = datetime.strptime(week.split(' to ')[0], '%Y-%m-%d')
                for i in range(7):
                    day = week_start + timedelta(days=i)
                    day_str = day.strftime('%Y-%m-%d')
                    day_name = day.strftime('%A')
                    hours = daily_hours.get(day_str, 0)
                    if hours > 0:
                        print(f"    {day_name} ({day_str}): {hours:.2f}h")
                    else:
                        print(f"    {day_name} ({day_str}): -")

            print()

        # Last week analysis
        print(f"{'='*80}")
        print(f"LAST WEEK DETAILS (Dec 16-22, 2024)")
        print(f"{'='*80}\n")

        last_monday = datetime(2024, 12, 16)
        last_sunday = datetime(2024, 12, 22)
        last_week_key = f"{last_monday.strftime('%Y-%m-%d')} to {last_sunday.strftime('%Y-%m-%d')}"

        if last_week_key in weekly_data:
            last_week_data = weekly_data[last_week_key]

            if last_week_data['hours'] == 0:
                print("WARNING: NO TIME LOGGED LAST WEEK!")
                print("\nMissing days:")
                for i in range(7):
                    day = last_monday + timedelta(days=i)
                    print(f"  - {day.strftime('%A, %B %d')}")
            else:
                # Group by task for last week
                by_task = defaultdict(list)
                for entry in last_week_data['entries']:
                    task = entry.get('task')
                    if isinstance(task, dict):
                        task_id = task.get('id', 'unknown')
                    else:
                        task_id = task or 'unknown'
                    by_task[task_id].append(entry)

                print(f"Tasks worked on last week:")
                for task_id, task_entries in by_task.items():
                    total_task_hours = sum(e.get('time', 0) for e in task_entries) / 3600000
                    print(f"\nTask ID: {task_id}")
                    print(f"Hours: {total_task_hours:.2f}")

                    # Get task details
                    try:
                        task = get_task_details(task_id)
                        if task:
                            print(f"Name: {task.get('name')}")
                    except:
                        pass

                    # Show entries
                    for entry in sorted(task_entries, key=lambda x: x.get('date')):
                        entry_hours = entry.get('time', 0) / 3600000
                        date = entry.get('date')
                        comment = entry.get('comment', '')
                        print(f"  {date}: {entry_hours:.2f}h", end='')
                        if comment:
                            print(f" - {comment[:60]}{'...' if len(comment) > 60 else ''}")
                        else:
                            print()
        else:
            print("⚠️  NO TIME LOGGED LAST WEEK!")
            print("\nMissing days:")
            for i in range(7):
                day = last_monday + timedelta(days=i)
                print(f"  - {day.strftime('%A, %B %d')}")

        # Summary statistics
        print(f"\n{'='*80}")
        print(f"SUMMARY STATISTICS")
        print(f"{'='*80}\n")

        print(f"Total hours since {start_date}: {total_hours_all_time:.2f}")
        print(f"Weeks with time logged: {weeks_with_time}/{len(sorted_weeks)}")
        if weeks_with_time > 0:
            print(f"Average hours per week (when logged): {total_hours_all_time/weeks_with_time:.2f}")

        # Identify gaps
        print(f"\nWARNING: WEEKS WITH NO TIME LOGGED:")
        gaps = []
        for week in sorted_weeks:
            if weekly_data[week]['hours'] == 0:
                gaps.append(week)
                print(f"  - {week}")

        if not gaps:
            print("  None - all weeks have time logged!")

    except requests.exceptions.HTTPError as e:
        print(f"[ERROR] Failed to get time entries: {e}")
        if hasattr(e, 'response'):
            print(f"Status Code: {e.response.status_code}")
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    analyze_weekly_time()