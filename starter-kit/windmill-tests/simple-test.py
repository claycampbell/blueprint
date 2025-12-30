#!/usr/bin/env python
"""
Simple test to verify Windmill API works
"""

import requests
import json

WINDMILL_BASE_URL = "http://localhost:8000"
WINDMILL_USER = "clay@seawolfai.net"
WINDMILL_PASSWORD = "password"

# Login
print("Logging in...")
login_response = requests.post(
    f"{WINDMILL_BASE_URL}/api/auth/login",
    json={"email": WINDMILL_USER, "password": WINDMILL_PASSWORD}
)

if login_response.status_code == 200:
    print("[OK] Logged in successfully")
    cookies = login_response.cookies

    # List existing scripts
    print("\nListing existing scripts...")
    list_response = requests.get(
        f"{WINDMILL_BASE_URL}/api/w/starter/scripts/list",
        cookies=cookies
    )

    if list_response.status_code == 200:
        scripts = list_response.json()
        print(f"Found {len(scripts)} existing scripts:")
        for script in scripts[:5]:  # Show first 5
            print(f"  - {script.get('path', 'unknown')}: {script.get('summary', '')}")
    else:
        print(f"[ERROR] Failed to list scripts: {list_response.status_code}")
        print(list_response.text[:200])

    # Try creating a simple script
    print("\nAttempting to create a test script...")

    simple_script = """
export async function main() {
    console.log("Hello from Windmill test!");
    return { success: true, message: "Test completed" };
}
"""

    # Try different path formats
    paths_to_try = [
        "test_simple",
        "u/clay/test_simple",
        "f/tests/test_simple"
    ]

    for path in paths_to_try:
        print(f"\nTrying path: {path}")

        create_response = requests.post(
            f"{WINDMILL_BASE_URL}/api/w/starter/scripts/create",
            json={
                "path": path,
                "content": simple_script,
                "language": "deno",
                "summary": "Simple test script",
                "description": "Testing Windmill API"
            },
            cookies=cookies
        )

        if create_response.status_code in [200, 201]:
            print(f"  [SUCCESS] Created script at: {path}")
            break
        else:
            print(f"  [FAILED] {create_response.status_code}")
            error_text = create_response.text[:200]
            if "proper_id" in error_text:
                print(f"    ID format issue: {error_text}")
            else:
                print(f"    Error: {error_text}")

else:
    print(f"[ERROR] Login failed: {login_response.status_code}")
    print(login_response.text[:200])