#!/usr/bin/env python
"""
Compare the working test app with our loan dashboard
"""

import requests
import json

WINDMILL_BASE_URL = "http://localhost:8000"
WINDMILL_USER = "clay@seawolfai.net"
WINDMILL_PASSWORD = "password"
WORKSPACE = "blueprint"

# Login
login_response = requests.post(
    f"{WINDMILL_BASE_URL}/api/auth/login",
    json={"email": WINDMILL_USER, "password": WINDMILL_PASSWORD}
)

if login_response.status_code == 200:
    cookies = login_response.cookies

    # Get both apps
    apps = {
        "working_test": "u/clay/test",
        "loan_dashboard": "u/clay/loan_dashboard"
    }

    print("="*70)
    print("COMPARING APPS")
    print("="*70)

    for name, path in apps.items():
        get_url = f"{WINDMILL_BASE_URL}/api/w/{WORKSPACE}/apps/get/p/{path}"
        response = requests.get(get_url, cookies=cookies)

        if response.status_code == 200:
            app_data = response.json()

            print(f"\n{name.upper()} ({path}):")
            print(f"  Components: {len(app_data['value']['grid'])}")
            print(f"  Has theme: {'theme' in app_data['value']}")
            print(f"  Has subgrids: {'subgrids' in app_data['value']}")
            print(f"  raw_app: {app_data.get('raw_app', 'N/A')}")
            print(f"  execution_mode: {app_data['policy'].get('execution_mode', 'N/A')}")

            # Check first component structure
            if app_data['value']['grid']:
                first = app_data['value']['grid'][0]
                print(f"  First component type: {first['data']['type']}")
                print(f"  First component has customCss: {'customCss' in first['data']}")
                print(f"  First component has configuration: {'configuration' in first['data']}")
                print(f"  First component has componentInput: {'componentInput' in first['data']}")

            # Save for detailed inspection
            with open(f"{name}-detailed.json", "w") as f:
                json.dump(app_data, f, indent=2)

        else:
            print(f"\n{name.upper()}: ERROR {response.status_code}")

    print()
    print("="*70)
    print("Files saved:")
    print("  working_test-detailed.json")
    print("  loan_dashboard-detailed.json")
    print("="*70)

else:
    print(f"[ERROR] Login failed: {login_response.status_code}")
