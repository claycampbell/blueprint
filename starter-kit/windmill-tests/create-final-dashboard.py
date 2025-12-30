#!/usr/bin/env python
"""
Create complete Blueprint Loan Dashboard - WORKING VERSION
"""

import requests

WINDMILL_BASE_URL = "http://localhost:8000"
WINDMILL_USER = "clay@seawolfai.net"
WINDMILL_PASSWORD = "password"
WORKSPACE = "blueprint"

print("Creating Blueprint Loan Dashboard - Final Version")
print("="*70)

login_response = requests.post(
    f"{WINDMILL_BASE_URL}/api/auth/login",
    json={"email": WINDMILL_USER, "password": WINDMILL_PASSWORD}
)

if login_response.status_code == 200:
    cookies = login_response.cookies
    print("[OK] Logged in")

    # Complete loan dashboard
    app_value = {
        "grid": [
            # Title
            {
                "3": {"h": 2, "w": 3, "x": 0, "y": 0, "fixed": False, "fullHeight": False},
                "12": {"h": 2, "w": 12, "x": 0, "y": 0, "fixed": False, "fullHeight": False},
                "id": "title",
                "data": {
                    "id": "title",
                    "type": "textcomponent",
                    "customCss": {
                        "text": {"class": "text-3xl font-bold", "style": ""},
                        "container": {"class": "", "style": ""}
                    },
                    "configuration": {"style": {"type": "static", "value": "Title"}},
                    "componentInput": {"type": "static", "value": "Blueprint Connect 2.0 - Loan Dashboard"},
                    "verticalAlignment": "center",
                    "horizontalAlignment": "left"
                }
            },
            # Summary stats
            {
                "3": {"h": 2, "w": 3, "x": 0, "y": 2, "fixed": False, "fullHeight": False},
                "12": {"h": 2, "w": 12, "x": 0, "y": 2, "fixed": False, "fullHeight": False},
                "id": "summary",
                "data": {
                    "id": "summary",
                    "type": "textcomponent",
                    "customCss": {
                        "text": {"class": "text-lg", "style": ""},
                        "container": {"class": "bg-blue-50 p-4 rounded", "style": ""}
                    },
                    "configuration": {"style": {"type": "static", "value": "Body"}},
                    "componentInput": {
                        "type": "static",
                        "value": "Total Active Loans: 5 | Total Amount: $11.1M | Avg Loan: $2.22M"
                    },
                    "verticalAlignment": "center",
                    "horizontalAlignment": "center"
                }
            },
            # Loan table
            {
                "3": {"h": 12, "w": 3, "x": 0, "y": 4, "fixed": False, "fullHeight": False},
                "12": {"h": 12, "w": 12, "x": 0, "y": 4, "fixed": False, "fullHeight": False},
                "id": "loan_table",
                "data": {
                    "id": "loan_table",
                    "type": "tablecomponent",
                    "customCss": {"container": {"class": "", "style": ""}},
                    "actionButtons": [],  # CRITICAL - required field!
                    "configuration": {},
                    "componentInput": {
                        "type": "static",
                        "value": [
                            {
                                "loan_id": "LOAN-2025-001",
                                "borrower": "Acme Development LLC",
                                "amount": "$2,500,000",
                                "status": "In Review",
                                "created": "2025-01-15",
                                "project_type": "Multifamily",
                                "units": 24
                            },
                            {
                                "loan_id": "LOAN-2025-002",
                                "borrower": "Summit Builders Inc",
                                "amount": "$1,800,000",
                                "status": "Approved",
                                "created": "2025-01-20",
                                "project_type": "Townhomes",
                                "units": 12
                            },
                            {
                                "loan_id": "LOAN-2025-003",
                                "borrower": "Cascade Properties",
                                "amount": "$3,200,000",
                                "status": "Pending Documents",
                                "created": "2025-02-01",
                                "project_type": "Mixed Use",
                                "units": 18
                            },
                            {
                                "loan_id": "LOAN-2025-004",
                                "borrower": "Northwest Development",
                                "amount": "$1,500,000",
                                "status": "Funded",
                                "created": "2025-02-10",
                                "project_type": "Single Family",
                                "units": 8
                            },
                            {
                                "loan_id": "LOAN-2025-005",
                                "borrower": "Pacific Homes LLC",
                                "amount": "$2,100,000",
                                "status": "In Review",
                                "created": "2025-02-15",
                                "project_type": "Townhomes",
                                "units": 16
                            }
                        ]
                    }
                }
            },
            # Footer note
            {
                "3": {"h": 1, "w": 3, "x": 0, "y": 16, "fixed": False, "fullHeight": False},
                "12": {"h": 1, "w": 12, "x": 0, "y": 16, "fixed": False, "fullHeight": False},
                "id": "footer",
                "data": {
                    "id": "footer",
                    "type": "textcomponent",
                    "customCss": {
                        "text": {"class": "text-sm text-gray-500 italic", "style": ""},
                        "container": {"class": "", "style": ""}
                    },
                    "configuration": {"style": {"type": "static", "value": "Body"}},
                    "componentInput": {
                        "type": "static",
                        "value": "✅ This dashboard was created entirely programmatically via Windmill REST API"
                    },
                    "verticalAlignment": "center",
                    "horizontalAlignment": "center"
                }
            }
        ],
        "theme": {"type": "path", "path": "f/app_themes/theme_0"},
        "subgrids": {},
        "fullscreen": False,
        "hideLegacyTopBar": True,
        "hiddenInlineScripts": [],
        "unusedInlineScripts": [],
        "mobileViewOnSmallerScreens": False
    }

    app_path = "u/clay/blueprint_loan_dashboard"

    # Delete if exists
    requests.delete(f"{WINDMILL_BASE_URL}/api/w/{WORKSPACE}/apps/delete/p/{app_path}", cookies=cookies)

    # Create
    response = requests.post(
        f"{WINDMILL_BASE_URL}/api/w/{WORKSPACE}/apps/create",
        json={
            "path": app_path,
            "summary": "Blueprint Loan Dashboard - Programmatically Created",
            "value": app_value,
            "policy": {
                "on_behalf_of": "u/clay",
                "on_behalf_of_email": "clay@seawolfai.net",
                "execution_mode": "publisher"
            }
        },
        cookies=cookies
    )

    if response.status_code in [200, 201]:
        print("[SUCCESS] Complete dashboard created!")
        print()
        print("="*70)
        print("View at: http://localhost:8000/apps/get/{app_path}")
        print("="*70)
        print()
        print("Components:")
        print("  ✅ Title: 'Blueprint Connect 2.0 - Loan Dashboard'")
        print("  ✅ Summary: Total stats")
        print("  ✅ Table: 5 loan records with 7 columns")
        print("  ✅ Footer: Confirmation of programmatic creation")
        print()
        print("This proves that Windmill UIs can be created 100% programmatically!")
    else:
        print(f"[ERROR] {response.status_code}: {response.text[:500]}")
else:
    print(f"[ERROR] Login failed")
