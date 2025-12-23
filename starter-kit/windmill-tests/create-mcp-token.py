#!/usr/bin/env python
"""
Create an MCP token for Windmill
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

    print("Creating MCP token for Windmill...")
    print("="*70)

    # Create a token
    # First, check what endpoints are available
    endpoints_to_try = [
        "/api/users/tokens/create",
        "/api/w/{}/tokens/create".format(WORKSPACE),
        "/api/auth/tokens/create",
    ]

    for endpoint in endpoints_to_try:
        url = f"{WINDMILL_BASE_URL}{endpoint}"
        print(f"\nTrying: {endpoint}")

        # Try to create a token
        token_payload = {
            "label": "MCP Token for Claude Code",
            "expiration": None,  # No expiration
        }

        response = requests.post(url, json=token_payload, cookies=cookies)

        print(f"  Status: {response.status_code}")

        if response.status_code in [200, 201]:
            print(f"  [SUCCESS] Token created!")
            try:
                result = response.json()
                print(f"  Response: {json.dumps(result, indent=2)[:500]}")
            except:
                # Response might be plain text (the token itself)
                print(f"  Token: {response.text}")
            break
        else:
            print(f"  Error: {response.text[:200]}")

    # Also try to list existing tokens
    print("\n" + "="*70)
    print("Checking for existing tokens...")
    print("="*70)

    list_endpoints = [
        "/api/users/tokens/list",
        "/api/w/{}/tokens/list".format(WORKSPACE),
    ]

    for endpoint in list_endpoints:
        url = f"{WINDMILL_BASE_URL}{endpoint}"
        print(f"\nTrying: {endpoint}")

        response = requests.get(url, cookies=cookies)

        print(f"  Status: {response.status_code}")

        if response.status_code == 200:
            tokens = response.json()
            print(f"  [OK] Found {len(tokens)} tokens")

            for token in tokens:
                print(f"\n  Token: {token.get('label', 'Unnamed')}")
                print(f"    Created: {token.get('created_at', 'Unknown')}")
                print(f"    Workspace: {token.get('workspace_id', 'N/A')}")
                if 'token' in token:
                    print(f"    Token value: {token['token'][:20]}...")
            break
        else:
            print(f"  Error: {response.text[:200]}")

else:
    print(f"[ERROR] Login failed: {login_response.status_code}")
