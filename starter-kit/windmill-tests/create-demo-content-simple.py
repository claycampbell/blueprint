"""
Create demo flow and script in Windmill programmatically.

Simplified version that creates content via REST API without authentication.
For local development only.
"""

import requests
import json

WINDMILL_URL = "http://localhost:8000"
WORKSPACE = "admins"

def create_simple_script():
    """Create a simple loan calculator script"""

    script_content = """def main(
    loan_amount: int = 250000,
    annual_interest_rate: float = 6.5,
    term_months: int = 360,
    origination_fee_percent: float = 1.0
):
    \"\"\"
    Loan Payment Calculator

    Calculate monthly payments, total interest, and fees for a loan.
    \"\"\"

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
"""

    payload = {
        "path": "u/clay/loan_calculator_demo",
        "summary": "Loan Payment Calculator",
        "description": "Calculate monthly payments and total cost for Blueprint loans",
        "content": script_content,
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
            print("✓ Script created successfully: u/clay/loan_calculator_demo")
            return True
        else:
            print(f"✗ Script creation failed: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"✗ Error creating script: {e}")
        return False


def create_simple_flow():
    """Create a simple loan approval flow"""

    # Simple 3-step flow
    flow_value = {
        "modules": [
            {
                "id": "a",
                "value": {
                    "type": "rawscript",
                    "content": """def main(
    loan_amount: int = 250000,
    borrower_name: str = "John Doe",
    credit_score: int = 750,
    property_value: int = 500000
):
    \"\"\"Step 1: Application Input\"\"\"
    ltv = (loan_amount / property_value) * 100

    return {
        "loan_amount": loan_amount,
        "borrower_name": borrower_name,
        "credit_score": credit_score,
        "property_value": property_value,
        "ltv": round(ltv, 2)
    }
""",
                    "language": "python3"
                },
                "summary": "Application Input"
            },
            {
                "id": "b",
                "value": {
                    "type": "rawscript",
                    "content": """def main(a: dict):
    \"\"\"Step 2: Credit Check\"\"\"
    credit_score = a["credit_score"]
    ltv = a["ltv"]

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
        **a,
        "credit_status": status,
        "credit_message": message
    }
""",
                    "language": "python3",
                    "input_transforms": {
                        "a": {"type": "javascript", "expr": "results.a"}
                    }
                },
                "summary": "Credit Check"
            },
            {
                "id": "c",
                "value": {
                    "type": "rawscript",
                    "content": """def main(b: dict):
    \"\"\"Step 3: Final Decision\"\"\"
    status = b["credit_status"]

    if status == "approved":
        next_steps = ["Send commitment", "Order appraisal", "Schedule closing"]
        rate = 6.5
    elif status == "conditional":
        next_steps = ["Request documentation", "Follow-up review"]
        rate = 7.0
    else:
        next_steps = ["Send denial letter"]
        rate = None

    return {
        **b,
        "final_status": status.upper(),
        "interest_rate": rate,
        "next_steps": next_steps
    }
""",
                    "language": "python3",
                    "input_transforms": {
                        "b": {"type": "javascript", "expr": "results.b"}
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
                "loan_amount": {"type": "integer", "default": 250000},
                "borrower_name": {"type": "string", "default": "John Doe"},
                "credit_score": {"type": "integer", "default": 750},
                "property_value": {"type": "integer", "default": 500000}
            }
        }
    }

    try:
        response = requests.post(
            f"{WINDMILL_URL}/api/w/{WORKSPACE}/flows/create",
            json=payload,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 201:
            print("✓ Flow created successfully: u/clay/loan_approval_demo")
            return True
        else:
            print(f"✗ Flow creation failed: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"✗ Error creating flow: {e}")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("Creating Windmill Demo Content")
    print("=" * 60)

    print("\n1. Creating Script (Loan Calculator)...")
    script_success = create_simple_script()

    print("\n2. Creating Flow (Loan Approval)...")
    flow_success = create_simple_flow()

    print("\n" + "=" * 60)
    if script_success and flow_success:
        print("SUCCESS: All demo content created!")
    elif script_success or flow_success:
        print("PARTIAL: Some content created (check errors above)")
    else:
        print("FAILED: Could not create content")
        print("\nThis is likely due to authentication.")
        print("Please create content manually in Windmill UI:")
        print("  http://localhost:8000")

    print("\nContent paths:")
    print("  Script: u/clay/loan_calculator_demo")
    print("  Flow:   u/clay/loan_approval_demo")
    print("  App:    u/clay/blueprint_loan_dashboard")
    print("=" * 60)
