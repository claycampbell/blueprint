"""
Create demo flows and scripts in Windmill for the React embed examples.

This script creates:
1. A simple flow (loan approval workflow)
2. A simple script (loan calculator)
"""

import requests
import json

WINDMILL_URL = "http://localhost:8000"
WORKSPACE = "admins"  # Using admins workspace

# API token - you'll need to get this from Windmill UI
# For now, trying without auth (local development)

def create_flow():
    """Create a simple loan approval workflow"""

    flow_definition = {
        "summary": "Loan Approval Workflow",
        "description": "Simple workflow to approve loan applications",
        "value": {
            "modules": [
                {
                    "id": "a",
                    "value": {
                        "type": "rawscript",
                        "content": """
def main(
    loan_amount: int = 100000,
    borrower_name: str = "John Doe",
    credit_score: int = 750,
    property_value: int = 500000
):
    \"\"\"
    Loan Application Input
    Collect basic loan application details
    \"\"\"
    ltv = (loan_amount / property_value) * 100

    return {
        "loan_amount": loan_amount,
        "borrower_name": borrower_name,
        "credit_score": credit_score,
        "property_value": property_value,
        "ltv": round(ltv, 2)
    }
""",
                        "language": "python3",
                        "input_transforms": {}
                    },
                    "summary": "Application Input"
                },
                {
                    "id": "b",
                    "value": {
                        "type": "rawscript",
                        "content": """
def main(application: dict):
    \"\"\"
    Credit Check
    Evaluate creditworthiness
    \"\"\"
    credit_score = application["credit_score"]
    ltv = application["ltv"]

    # Simple approval logic
    if credit_score >= 700 and ltv <= 75:
        status = "approved"
        message = "Application meets credit requirements"
    elif credit_score >= 650 and ltv <= 70:
        status = "conditional"
        message = "Conditional approval - additional documentation required"
    else:
        status = "denied"
        message = "Application does not meet minimum requirements"

    return {
        **application,
        "credit_status": status,
        "credit_message": message
    }
""",
                        "language": "python3",
                        "input_transforms": {
                            "application": "flow_input.a"
                        }
                    },
                    "summary": "Credit Check"
                },
                {
                    "id": "c",
                    "value": {
                        "type": "rawscript",
                        "content": """
def main(result: dict):
    \"\"\"
    Final Decision
    Generate approval decision and next steps
    \"\"\"
    status = result["credit_status"]

    if status == "approved":
        next_steps = [
            "Send commitment letter",
            "Order appraisal",
            "Collect documentation",
            "Schedule closing"
        ]
        interest_rate = 6.5
    elif status == "conditional":
        next_steps = [
            "Request additional documentation",
            "Schedule follow-up review",
            "Verify income sources"
        ]
        interest_rate = 7.0
    else:
        next_steps = [
            "Send denial letter",
            "Provide feedback for reapplication"
        ]
        interest_rate = None

    return {
        **result,
        "final_status": status.upper(),
        "interest_rate": interest_rate,
        "next_steps": next_steps
    }
""",
                        "language": "python3",
                        "input_transforms": {
                            "result": "flow_input.b"
                        }
                    },
                    "summary": "Final Decision"
                }
            ]
        },
        "schema": {
            "properties": {
                "loan_amount": {"type": "integer", "default": 100000},
                "borrower_name": {"type": "string", "default": "John Doe"},
                "credit_score": {"type": "integer", "default": 750},
                "property_value": {"type": "integer", "default": 500000}
            }
        }
    }

    # Create the flow
    response = requests.post(
        f"{WINDMILL_URL}/api/w/{WORKSPACE}/flows/create",
        json={
            "path": "u/clay/loan_approval_demo",
            "summary": "Loan Approval Workflow",
            "description": "Demo workflow for React embedding",
            "value": flow_definition["value"],
            "schema": flow_definition["schema"]
        }
    )

    print(f"Flow creation: {response.status_code}")
    if response.status_code == 201:
        print(f"✅ Flow created: u/clay/loan_approval_demo")
    else:
        print(f"❌ Error: {response.text}")

    return response


def create_script():
    """Create a loan calculator script"""

    script_content = """
def main(
    loan_amount: int = 250000,
    annual_interest_rate: float = 6.5,
    term_months: int = 360,
    origination_fee_percent: float = 1.0
):
    \"\"\"
    Loan Payment Calculator

    Calculate monthly payments, total interest, and fees for a loan.

    Args:
        loan_amount: Principal loan amount ($)
        annual_interest_rate: Annual interest rate (%)
        term_months: Loan term in months
        origination_fee_percent: Origination fee as % of loan amount

    Returns:
        Dictionary with payment breakdown
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

    response = requests.post(
        f"{WINDMILL_URL}/api/w/{WORKSPACE}/scripts/create",
        json={
            "path": "u/clay/loan_calculator_demo",
            "summary": "Loan Payment Calculator",
            "description": "Calculate monthly payments and total cost",
            "content": script_content,
            "language": "python3",
            "schema": {
                "properties": {
                    "loan_amount": {
                        "type": "integer",
                        "default": 250000,
                        "description": "Principal loan amount"
                    },
                    "annual_interest_rate": {
                        "type": "number",
                        "default": 6.5,
                        "description": "Annual interest rate (%)"
                    },
                    "term_months": {
                        "type": "integer",
                        "default": 360,
                        "description": "Loan term (months)"
                    },
                    "origination_fee_percent": {
                        "type": "number",
                        "default": 1.0,
                        "description": "Origination fee (%)"
                    }
                },
                "required": ["loan_amount", "annual_interest_rate", "term_months"]
            }
        }
    )

    print(f"Script creation: {response.status_code}")
    if response.status_code == 201:
        print(f"✅ Script created: u/clay/loan_calculator_demo")
    else:
        print(f"❌ Error: {response.text}")

    return response


if __name__ == "__main__":
    print("Creating Windmill demo content...")
    print("=" * 50)

    print("\n1. Creating Flow (Loan Approval Workflow)...")
    create_flow()

    print("\n2. Creating Script (Loan Calculator)...")
    create_script()

    print("\n" + "=" * 50)
    print("✅ Demo content creation complete!")
    print("\nYou can now use these in the React demo:")
    print("- Flow:   u/clay/loan_approval_demo")
    print("- Script: u/clay/loan_calculator_demo")
    print("- App:    u/clay/blueprint_loan_dashboard (already exists)")
