#!/usr/bin/env python
"""
Create the loan approval flow in Windmill via API
"""

import requests
import json

WINDMILL_URL = 'http://localhost:8000'
WORKSPACE = 'blueprint'
TOKEN = 'FmYFqLYfOX7yyt8N9a1TOxbHMtkqyKsx'

# Flow definition matching the manual guide
flow_value = {
    "modules": [
        {
            "id": "a",
            "value": {
                "type": "rawscript",
                "content": '''def main(loan_amount: int, borrower_name: str, credit_score: int, property_value: int):
    """Step 1: Application Input"""
    ltv = (loan_amount / property_value) * 100

    return {
        "loan_amount": loan_amount,
        "borrower_name": borrower_name,
        "credit_score": credit_score,
        "property_value": property_value,
        "ltv": round(ltv, 2)
    }
''',
                "language": "python3",
                "input_transforms": {
                    "loan_amount": {"type": "javascript", "expr": "flow_input.loan_amount"},
                    "borrower_name": {"type": "javascript", "expr": "flow_input.borrower_name"},
                    "credit_score": {"type": "javascript", "expr": "flow_input.credit_score"},
                    "property_value": {"type": "javascript", "expr": "flow_input.property_value"}
                }
            },
            "summary": "Application Input"
        },
        {
            "id": "b",
            "value": {
                "type": "rawscript",
                "content": '''def main(application: dict):
    """Step 2: Credit Check"""
    credit_score = application["credit_score"]
    ltv = application["ltv"]

    if credit_score >= 700 and ltv <= 75:
        status = "approved"
        message = "Meets credit requirements"
    elif credit_score >= 650 and ltv <= 70:
        status = "conditional"
        message = "Conditional - needs documentation"
    else:
        status = "denied"
        message = "Does not meet requirements"

    return {
        **application,
        "credit_status": status,
        "credit_message": message
    }
''',
                "language": "python3",
                "input_transforms": {
                    "application": {"type": "javascript", "expr": "results.a"}
                }
            },
            "summary": "Credit Check"
        },
        {
            "id": "c",
            "value": {
                "type": "rawscript",
                "content": '''def main(result: dict):
    """Step 3: Final Decision"""
    status = result["credit_status"]

    if status == "approved":
        next_steps = ["Send commitment letter", "Order appraisal", "Schedule closing"]
        rate = 6.5
    elif status == "conditional":
        next_steps = ["Request documentation", "Follow-up review"]
        rate = 7.0
    else:
        next_steps = ["Send denial letter"]
        rate = None

    return {
        **result,
        "final_status": status.upper(),
        "interest_rate": rate,
        "next_steps": next_steps
    }
''',
                "language": "python3",
                "input_transforms": {
                    "result": {"type": "javascript", "expr": "results.b"}
                }
            },
            "summary": "Final Decision"
        }
    ],
    "failure_module": {
        "id": "failure",
        "value": {
            "type": "rawscript",
            "content": "def main(error: dict):\n    return error",
            "language": "python3"
        }
    }
}

# Flow schema (input parameters)
flow_schema = {
    "type": "object",
    "properties": {
        "loan_amount": {
            "type": "integer",
            "default": 250000,
            "description": "Loan amount ($)"
        },
        "borrower_name": {
            "type": "string",
            "default": "John Doe",
            "description": "Borrower name"
        },
        "credit_score": {
            "type": "integer",
            "default": 750,
            "description": "Credit score (300-850)"
        },
        "property_value": {
            "type": "integer",
            "default": 500000,
            "description": "Property value ($)"
        }
    },
    "required": ["loan_amount", "credit_score", "property_value"]
}

# Create flow payload
flow_payload = {
    'path': 'u/clay/loan_approval_demo',
    'summary': 'Loan Approval Workflow',
    'description': 'Demo workflow for Blueprint loan approvals',
    'value': flow_value,
    'schema': flow_schema
}

# Create the flow
headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json'
}

print("Creating loan approval flow...")
print("=" * 70)

response = requests.post(
    f'{WINDMILL_URL}/api/w/{WORKSPACE}/flows/create',
    headers=headers,
    json=flow_payload
)

print(f'Status Code: {response.status_code}')

if response.status_code in [200, 201]:
    print("[SUCCESS] Flow created successfully!")
    print(f"Path: u/clay/loan_approval_demo")
    print(f"\nTest URL: {WINDMILL_URL}/flows/run/u/clay/loan_approval_demo")
else:
    print(f"[ERROR] Failed to create flow")
    print(f"Response: {response.text[:2000]}")

print("=" * 70)
