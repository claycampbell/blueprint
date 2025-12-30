#!/usr/bin/env python
"""
Create an MCP token with the correct scope
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

    print("Creating MCP token with correct scope...")
    print("="*70)

    # Create a token with MCP scope
    create_url = f"{WINDMILL_BASE_URL}/api/users/tokens/create"

    token_payload = {
        "label": "MCP Token with Scope",
        "expiration": None,
        "scopes": ["mcp"]  # Add MCP scope!
    }

    print(f"\nPayload: {json.dumps(token_payload, indent=2)}")

    response = requests.post(create_url, json=token_payload, cookies=cookies)

    print(f"\nStatus: {response.status_code}")

    if response.status_code in [200, 201]:
        print("[SUCCESS] MCP token created with correct scope!")
        token = response.text.strip()
        print(f"\nToken: {token}")
        print()
        print("="*70)
        print("Update .mcp.json with this new token:")
        print("="*70)
        print(f'''
{{
  "mcpServers": {{
    "windmill": {{
      "url": "http://localhost:8000/api/mcp/w/{WORKSPACE}/sse?token={token}"
    }}
  }}
}}
''')
        print("="*70)

    else:
        print(f"[ERROR] Failed: {response.status_code}")
        print(f"Response: {response.text[:500]}")

else:
    print(f"[ERROR] Login failed: {login_response.status_code}")
