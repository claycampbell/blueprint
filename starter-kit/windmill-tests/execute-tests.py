#!/usr/bin/env python
"""
Execute Windmill tests programmatically via API
This script uploads and runs our test suite in Windmill
"""

import requests
import json
import time
import sys
from datetime import datetime

# Windmill configuration
WINDMILL_BASE_URL = "http://localhost:8000"
WINDMILL_USER = "clay@seawolfai.net"
WINDMILL_PASSWORD = "password"
WORKSPACE = "starter"  # Default workspace

# Test files to execute
TEST_FILES = [
    "01-parallel-execution.ts",
    "02-memory-limits.ts",
    "03-database-stress.ts",
    "05-complex-workflow.ts"
]

def get_auth_token():
    """Authenticate with Windmill and get API token"""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Authenticating with Windmill...")

    # Login to get session
    login_url = f"{WINDMILL_BASE_URL}/api/auth/login"
    auth_data = {
        "email": WINDMILL_USER,
        "password": WINDMILL_PASSWORD
    }

    try:
        response = requests.post(login_url, json=auth_data)
        response.raise_for_status()
        print(f"[{datetime.now().strftime('%H:%M:%S')}] [OK] Authentication successful")

        # Get cookies from response
        cookies = response.cookies

        # Create a token for API access
        token_url = f"{WINDMILL_BASE_URL}/api/w/{WORKSPACE}/users/tokens/create"
        token_data = {
            "label": "test-runner-token",
            "expiration": None
        }

        token_response = requests.post(token_url, json=token_data, cookies=cookies)

        if token_response.status_code == 200:
            token = token_response.json()
            print(f"[{datetime.now().strftime('%H:%M:%S')}] [OK] API token created")
            return token.get("token", "")
        else:
            # Use session cookies if token creation fails
            print(f"[{datetime.now().strftime('%H:%M:%S')}] [WARNING] Using session authentication")
            return cookies

    except requests.exceptions.RequestException as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] [ERROR] Authentication failed: {e}")
        return None

def upload_script(token, filename, content):
    """Upload a test script to Windmill"""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Uploading {filename}...")

    # Windmill requires paths without special characters and no leading numbers
    script_name = filename.replace('.ts', '').replace('-', '_')
    # Remove leading numbers
    if script_name[:2].isdigit():
        script_name = script_name[3:]  # Remove "01_", "02_", etc.
    # Just use the script name without folder
    script_path = script_name
    print(f"    Generated path: {script_path}")

    # Prepare script data
    script_data = {
        "path": script_path,
        "content": content,
        "language": "deno",  # Windmill uses 'deno' for TypeScript
        "summary": f"Test script: {filename}",  # Required field
        "description": f"Windmill capability test - {filename}",
        "tag": "test"
    }

    # Upload script
    url = f"{WINDMILL_BASE_URL}/api/w/{WORKSPACE}/scripts/create"

    headers = {}
    cookies = None

    if isinstance(token, str):
        headers["Authorization"] = f"Bearer {token}"
    else:
        cookies = token

    try:
        response = requests.post(url, json=script_data, headers=headers, cookies=cookies)

        if response.status_code in [200, 201]:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] [OK] Uploaded {filename}")
            return True
        else:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] [WARNING] Failed to upload {filename}: {response.status_code}")
            print(f"    Response: {response.text[:200]}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] [ERROR] Error uploading {filename}: {e}")
        return False

def execute_script(token, script_path):
    """Execute a script in Windmill and wait for results"""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Executing {script_path}...")

    # Start job
    url = f"{WINDMILL_BASE_URL}/api/w/{WORKSPACE}/jobs/run/p/{script_path}"

    headers = {}
    cookies = None

    if isinstance(token, str):
        headers["Authorization"] = f"Bearer {token}"
    else:
        cookies = token

    # Job parameters based on script
    params = {}
    if "parallel" in script_path:
        params = {"parallelCount": 100}
    elif "memory" in script_path:
        params = {"testSize": "small"}
    elif "database" in script_path:
        params = {"pgClient": None, "testType": "connection"}
    elif "complex" in script_path:
        params = {"application": {"applicantName": "Test User", "loanAmount": 500000, "propertyAddress": "123 Test St"}}

    try:
        response = requests.post(url, json={"args": params}, headers=headers, cookies=cookies)

        if response.status_code in [200, 201]:
            job_id = response.json()
            print(f"[{datetime.now().strftime('%H:%M:%S')}] [OK] Job started: {job_id}")

            # Wait for job completion
            return wait_for_job(token, job_id)
        else:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] [ERROR] Failed to start job: {response.status_code}")
            return None

    except requests.exceptions.RequestException as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] [ERROR] Error executing script: {e}")
        return None

def wait_for_job(token, job_id, timeout=300):
    """Wait for a job to complete and return results"""
    start_time = time.time()

    headers = {}
    cookies = None

    if isinstance(token, str):
        headers["Authorization"] = f"Bearer {token}"
    else:
        cookies = token

    while time.time() - start_time < timeout:
        try:
            url = f"{WINDMILL_BASE_URL}/api/w/{WORKSPACE}/jobs/get/{job_id}"
            response = requests.get(url, headers=headers, cookies=cookies)

            if response.status_code == 200:
                job = response.json()
                status = job.get("type", "")

                if status == "CompletedJob":
                    duration = job.get("duration_ms", 0)
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] [OK] Job completed in {duration}ms")
                    return job.get("result", {})
                elif status in ["QueuedJob", "RunningJob"]:
                    # Still running
                    time.sleep(2)
                else:
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] [ERROR] Job failed: {status}")
                    return None
            else:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] [WARNING] Failed to get job status")
                time.sleep(2)

        except requests.exceptions.RequestException as e:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] [ERROR] Error checking job: {e}")
            time.sleep(2)

    print(f"[{datetime.now().strftime('%H:%M:%S')}] [ERROR] Job timeout after {timeout} seconds")
    return None

def main():
    """Main execution function"""
    print("=" * 60)
    print("WINDMILL TEST SUITE EXECUTOR")
    print("=" * 60)
    print()

    # Check if Windmill is accessible
    try:
        health_response = requests.get(f"{WINDMILL_BASE_URL}/api/version")
        if health_response.status_code != 200:
            print("[X] Windmill is not accessible at http://localhost:8000")
            print("  Please ensure Docker containers are running:")
            print("  cd starter-kit && docker-compose up -d")
            sys.exit(1)
        else:
            try:
                version = health_response.json()
                print(f"[OK] Connected to Windmill {version.get('version', 'unknown')}")
            except:
                print("[OK] Connected to Windmill")
            print()
    except:
        print("[X] Cannot connect to Windmill at http://localhost:8000")
        sys.exit(1)

    # Authenticate
    token = get_auth_token()
    if not token:
        print("[X] Failed to authenticate with Windmill")
        sys.exit(1)

    print()

    # Upload test scripts
    print("UPLOADING TEST SCRIPTS")
    print("-" * 30)

    uploaded = []
    for test_file in TEST_FILES:
        try:
            with open(test_file, 'r', encoding='utf-8') as f:
                content = f.read()
                if upload_script(token, test_file, content):
                    uploaded.append(test_file)
        except FileNotFoundError:
            print(f"[X] Test file not found: {test_file}")

    print()

    if not uploaded:
        print("[X] No scripts uploaded successfully")
        sys.exit(1)

    # Execute tests
    print("EXECUTING TESTS")
    print("-" * 30)

    results = {}
    for test_file in uploaded:
        script_name = test_file.replace('.ts', '').replace('-', '_')
        # Remove leading numbers
        if script_name[:2].isdigit():
            script_name = script_name[3:]  # Remove "01_", "02_", etc.
        # Just use the script name without folder
        script_path = script_name
        result = execute_script(token, script_path)

        if result:
            results[test_file] = result

            # Display key metrics
            if "parallel" in test_file:
                print(f"  - Operations completed: {result.get('operationsCompleted', 0)}")
                print(f"  - Success rate: {result.get('successRate', 0)}%")
            elif "memory" in test_file:
                print(f"  - Max array size: {result.get('maxArraySize', 0)}")
                print(f"  - Memory limit: {result.get('memoryLimit', 'Unknown')}")
            elif "database" in test_file:
                print(f"  - Connections tested: {result.get('connectionsCreated', 0)}")
                print(f"  - Max concurrent: {result.get('maxConcurrent', 0)}")
            elif "complex" in test_file:
                print(f"  - Stages completed: {len(result.get('stages', []))}")
                print(f"  - Final status: {result.get('finalStatus', 'Unknown')}")

        print()

    # Summary
    print("=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)

    total_tests = len(TEST_FILES)
    successful = len(results)

    print(f"Tests executed: {successful}/{total_tests}")

    if successful == total_tests:
        print("[SUCCESS] All tests completed successfully!")
    elif successful > 0:
        print(f"[WARNING] Partial success: {successful} tests completed")
    else:
        print("[FAILED] No tests completed successfully")

    # Save results to file
    with open("test-results.json", "w") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "results": results
        }, f, indent=2)

    print()
    print(f"Results saved to test-results.json")
    print("=" * 60)

if __name__ == "__main__":
    main()