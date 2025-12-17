"""
Update Jira tasks that we logged time to in Everhour.
Mark tasks as In Progress or Done based on the time logged.
"""

import requests
from requests.auth import HTTPBasicAuth
import sys

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"
PROJECT_KEY = "DP01"

# Everhour configuration
EVERHOUR_API_TOKEN = "a25e-e33f-b2662e-3c5019-6f6073e6"
EVERHOUR_BASE_URL = "https://api.everhour.com"
DP01_PROJECT_ID = "jr:6091-12165"

def get_jira_auth():
    """Get Jira authentication."""
    email = "clay.campbell@vividcg.com"
    if len(sys.argv) < 2:
        print("[ERROR] Usage: python update-jira-time-logged-tasks.py <jira-api-token>")
        sys.exit(1)

    api_token = sys.argv[1]
    return HTTPBasicAuth(email, api_token)

def get_everhour_headers():
    """Get Everhour API headers."""
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
        f"{EVERHOUR_BASE_URL}/users/me/time",
        headers=get_everhour_headers(),
        params=params
    )
    response.raise_for_status()
    return response.json()

def get_task_details(task_id):
    """Get task details from Everhour."""
    response = requests.get(
        f"{EVERHOUR_BASE_URL}/tasks/{task_id}",
        headers=get_everhour_headers()
    )

    if response.status_code == 404:
        return None

    response.raise_for_status()
    return response.json()

def extract_jira_key(task_name):
    """Extract Jira issue key from task name (e.g., 'DP01-21' from task name)."""
    import re
    match = re.search(r'(DP01-\d+)', task_name)
    return match.group(1) if match else None

def get_jira_issue(auth, issue_key):
    """Get Jira issue details."""
    response = requests.get(
        f"{JIRA_API_URL}/issue/{issue_key}",
        auth=auth
    )

    if response.status_code == 200:
        return response.json()
    else:
        return None

def add_comment(auth, issue_key, comment_text):
    """Add a comment to an issue."""
    payload = {
        "body": {
            "type": "doc",
            "version": 1,
            "content": [{
                "type": "paragraph",
                "content": [{
                    "type": "text",
                    "text": comment_text
                }]
            }]
        }
    }

    response = requests.post(
        f"{JIRA_API_URL}/issue/{issue_key}/comment",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    return response.status_code == 201

def get_transitions(auth, issue_key):
    """Get available transitions for an issue."""
    response = requests.get(
        f"{JIRA_API_URL}/issue/{issue_key}/transitions",
        auth=auth
    )

    if response.status_code == 200:
        return response.json()['transitions']
    else:
        return []

def transition_issue(auth, issue_key, transition_name):
    """Transition an issue to a new status."""
    transitions = get_transitions(auth, issue_key)
    transition = next((t for t in transitions if t['name'].lower() == transition_name.lower()), None)

    if not transition:
        return False

    payload = {
        "transition": {"id": transition['id']}
    }

    response = requests.post(
        f"{JIRA_API_URL}/issue/{issue_key}/transitions",
        auth=auth,
        headers={"Content-Type": "application/json"},
        json=payload
    )

    return response.status_code == 204

def main():
    """Update Jira tasks based on Everhour time entries."""
    print("Updating Jira tasks based on Everhour time entries")
    print("=" * 80)

    jira_auth = get_jira_auth()

    # Verify Jira authentication
    response = requests.get(f"{JIRA_API_URL}/myself", auth=jira_auth)
    if response.status_code != 200:
        print(f"[ERROR] Jira authentication failed: {response.status_code}")
        sys.exit(1)

    user_info = response.json()
    print(f"[OK] Authenticated to Jira as: {user_info['displayName']}")

    # Get all time entries from the three weeks
    print("\n[FETCH] Getting time entries from Everhour...")
    all_entries = []

    weeks = [
        ("2025-11-24", "2025-11-28", "Nov 24-28"),
        ("2025-12-01", "2025-12-05", "Dec 1-5"),
        ("2025-12-08", "2025-12-12", "Dec 8-12")
    ]

    for start_date, end_date, week_name in weeks:
        entries = get_my_time_entries(start_date, end_date)
        print(f"[OK] {week_name}: {len(entries)} entries")
        all_entries.extend(entries)

    print(f"\n[TOTAL] {len(all_entries)} time entries across all weeks\n")

    # Group by task
    tasks_with_time = {}
    for entry in all_entries:
        task_data = entry.get('task')
        if isinstance(task_data, dict):
            task_id = task_data.get('id')
        else:
            task_id = task_data

        if task_id not in tasks_with_time:
            tasks_with_time[task_id] = {
                "entries": [],
                "total_seconds": 0
            }

        tasks_with_time[task_id]["entries"].append(entry)
        tasks_with_time[task_id]["total_seconds"] += entry.get('time', 0)

    print(f"[OK] Time logged on {len(tasks_with_time)} unique tasks\n")
    print("=" * 80)
    print("Tasks with time logged:")
    print("=" * 80)

    # Display tasks and get Jira keys
    task_mapping = {}  # task_id -> jira_key
    for task_id, data in tasks_with_time.items():
        total_hours = data["total_seconds"] / 3600
        num_entries = len(data["entries"])

        # Get task details
        task = get_task_details(task_id)
        if task:
            task_name = task.get('name', task_id)
            jira_key = extract_jira_key(task_name)

            if jira_key:
                task_mapping[task_id] = jira_key
                print(f"  {jira_key}: {task_name[:60]}...")
                print(f"           Total: {total_hours:.1f}h ({num_entries} entries)")
            else:
                print(f"  {task_id}: {task_name[:60]}...")
                print(f"           Total: {total_hours:.1f}h ({num_entries} entries) [NO JIRA KEY]")
        else:
            print(f"  {task_id}: [Task not found]")
            print(f"           Total: {total_hours:.1f}h ({num_entries} entries)")

    print()
    print("=" * 80)
    print(f"Found {len(task_mapping)} tasks with Jira keys")
    print("=" * 80)
    print()

    # Ask user what to do
    print("Select an action:")
    print("  1. Add comments to all tasks with time summary")
    print("  2. Transition all tasks to 'In Progress'")
    print("  3. Mark all tasks as 'Done' (complete)")
    print("  4. Do both: Add comments AND mark as In Progress")
    print("  5. Exit without changes")

    choice = input("\nEnter choice (1-5): ").strip()

    if choice == "5":
        print("[EXIT] No changes made")
        return

    print()
    updated = 0
    errors = 0

    for task_id, jira_key in task_mapping.items():
        data = tasks_with_time[task_id]
        total_hours = data["total_seconds"] / 3600
        num_entries = len(data["entries"])

        comment = f"Time logged in Everhour: {total_hours:.1f} hours across {num_entries} time entries (Nov 24 - Dec 12, 2025)"

        if choice in ["1", "4"]:
            print(f"[COMMENT] Adding comment to {jira_key}...")
            if add_comment(jira_auth, jira_key, comment):
                print(f"[OK] Comment added to {jira_key}")
                updated += 1
            else:
                print(f"[ERROR] Failed to add comment to {jira_key}")
                errors += 1

        if choice == "2" or choice == "4":
            print(f"[TRANSITION] Moving {jira_key} to In Progress...")
            if transition_issue(jira_auth, jira_key, "In Progress"):
                print(f"[OK] {jira_key} -> In Progress")
                updated += 1
            else:
                print(f"[WARN] Could not transition {jira_key} (may already be in progress)")

        if choice == "3":
            print(f"[TRANSITION] Moving {jira_key} to Done...")
            if transition_issue(jira_auth, jira_key, "Done"):
                print(f"[OK] {jira_key} -> Done")
                updated += 1
            else:
                print(f"[WARN] Could not transition {jira_key} to Done")

        print()

    print("=" * 80)
    print(f"[SUMMARY] Updates: {updated}, Errors: {errors}")
    print("=" * 80)

if __name__ == "__main__":
    main()
