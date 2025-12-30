"""
Programmatically create Windmill demo components via REST API.

Creates:
1. Loan Calculator Script (u/clay/loan_calculator_demo)
2. Loan Approval Flow (u/clay/loan_approval_demo)

Usage:
    python create-demo-components.py
"""

import requests
import json
import sys

WINDMILL_URL = "http://localhost:8000"
WORKSPACE = "admins"

# No authentication needed for local Windmill Community Edition
# If you need auth, add headers like: {"Authorization": f"Bearer {token}"}

def create_loan_calculator_script():
    """Create the loan calculator Python script."""

    script_code = '''def main(
    loan_amount: int = 250000,
    annual_interest_rate: float = 6.5,
    term_months: int = 360,
    origination_fee_percent: float = 1.0
):
    """Loan Payment Calculator

    Calculate monthly payments, total interest, and fees for a loan.
    """

    # Calculate monthly interest rate
    monthly_rate = annual_interest_rate / 100 / 12

    # Calculate monthly payment using amortization formula
    if monthly_rate > 0:
        monthly_payment = loan_amount * (
            monthly_rate * (1 + monthly_rate) ** term_months
        ) / ((1 + monthly_rate) ** term_months - 1)
    else:
        monthly_payment = loan_amount / term_months

    # Calculate totals
    total_payments = monthly_payment * term_months
    total_interest = total_payments - loan_amount
    origination_fee = loan_amount * (origination_fee_percent / 100)
    total_cost = total_payments + origination_fee

    # Calculate first payment breakdown
    first_month_interest = loan_amount * monthly_rate
    first_month_principal = monthly_payment - first_month_interest

    return {
        "loan_amount": f"${loan_amount:,.2f}",
        "monthly_payment": f"${monthly_payment:,.2f}",
        "total_interest": f"${total_interest:,.2f}",
        "total_payments": f"${total_payments:,.2f}",
        "origination_fee": f"${origination_fee:,.2f}",
        "total_cost": f"${total_cost:,.2f}",
        "annual_interest_rate": f"{annual_interest_rate}%",
        "term_years": term_months / 12,
        "first_payment_breakdown": {
            "principal": f"${first_month_principal:,.2f}",
            "interest": f"${first_month_interest:,.2f}"
        }
    }
'''

    payload = {
        "path": "u/clay/loan_calculator_demo",
        "summary": "Loan Payment Calculator",
        "description": "Calculate monthly payments and total cost for Blueprint loans",
        "content": script_code,
        "language": "python3",
        "schema": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
                "loan_amount": {
                    "type": "integer",
                    "default": 250000,
                    "description": "Principal loan amount ($)"
                },
                "annual_interest_rate": {
                    "type": "number",
                    "default": 6.5,
                    "description": "Annual interest rate (%)"
                },
                "term_months": {
                    "type": "integer",
                    "default": 360,
                    "description": "Loan term in months"
                },
                "origination_fee_percent": {
                    "type": "number",
                    "default": 1.0,
                    "description": "Origination fee as % of loan amount"
                }
            },
            "required": ["loan_amount", "annual_interest_rate", "term_months"]
        }
    }

    try:
        response = requests.post(
            f"{WINDMILL_URL}/api/w/{WORKSPACE}/scripts/create",
            json=payload,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 201:
            print("[OK] Script created successfully: u/clay/loan_calculator_demo")
            print(f"  View at: {WINDMILL_URL}/scripts/get/u/clay/loan_calculator_demo")
            return True
        else:
            print(f"[FAIL] Script creation failed: {response.status_code}")
            print(f"  Response: {response.text}")
            return False
    except Exception as e:
        print(f"[ERROR] Error creating script: {e}")
        return False


def create_loan_approval_flow():
    """Create the loan approval workflow."""

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
        ]
    }

    payload = {
        "path": "u/clay/loan_approval_demo",
        "summary": "Loan Approval Workflow",
        "description": "Demo workflow for Blueprint loan approvals",
        "value": flow_value,
        "schema": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
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
    }

    try:
        response = requests.post(
            f"{WINDMILL_URL}/api/w/{WORKSPACE}/flows/create",
            json=payload,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 201:
            print("[OK] Flow created successfully: u/clay/loan_approval_demo")
            print(f"  View at: {WINDMILL_URL}/flows/get/u/clay/loan_approval_demo")
            return True
        else:
            print(f"[FAIL] Flow creation failed: {response.status_code}")
            print(f"  Response: {response.text}")
            return False
    except Exception as e:
        print(f"[ERROR] Error creating flow: {e}")
        return False


def test_connection():
    """Test connection to Windmill server."""
    try:
        response = requests.get(f"{WINDMILL_URL}/api/version")
        if response.ok:
            print(f"[OK] Connected to Windmill at {WINDMILL_URL}")
            return True
        else:
            print(f"[FAIL] Windmill server returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Cannot connect to Windmill: {e}")
        print(f"  Make sure Windmill is running at {WINDMILL_URL}")
        return False


if __name__ == "__main__":
    print("=" * 70)
    print("Creating Windmill Demo Components")
    print("=" * 70)
    print()

    # Test connection first
    print("Testing connection to Windmill...")
    if not test_connection():
        print("\n[ERROR] Cannot proceed without Windmill connection")
        print("   Start Windmill with: docker-compose up -d")
        sys.exit(1)

    print()

    # Create script
    print("1. Creating Loan Calculator Script...")
    script_success = create_loan_calculator_script()
    print()

    # Create flow
    print("2. Creating Loan Approval Flow...")
    flow_success = create_loan_approval_flow()
    print()

    # Summary
    print("=" * 70)
    if script_success and flow_success:
        print("[SUCCESS] All demo components created!")
        print()
        print("Next steps:")
        print(f"  1. Test script: {WINDMILL_URL}/scripts/run/u/clay/loan_calculator_demo")
        print(f"  2. Test flow:   {WINDMILL_URL}/flows/run/u/clay/loan_approval_demo")
        print(f"  3. View React demo: http://localhost:3004/windmill-demo")
        print()
        print("The custom React components will now be fully functional!")
    elif script_success or flow_success:
        print("[PARTIAL] Some components created (check errors above)")
    else:
        print("[FAILED] Could not create components")
        print()
        print("Common issues:")
        print("  - Paths already exist (delete them in Windmill UI first)")
        print("  - Workspace 'admins' doesn't exist (update WORKSPACE variable)")
        print("  - Authentication required (add Authorization header)")
    print("=" * 70)
