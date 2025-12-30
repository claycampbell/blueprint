#!/usr/bin/env python
"""
Create the loan calculator script in Windmill via API
"""

import requests
import json

WINDMILL_URL = 'http://localhost:8000'
WORKSPACE = 'blueprint'
TOKEN = 'HzaHSbXOgQ8nDSY91DSC9bF9xFMWnMzm'

# Loan calculator script code
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

# Create script payload
script_payload = {
    'path': 'u/clay/loan_calculator_demo',
    'summary': 'Loan Payment Calculator',
    'description': 'Calculate monthly payments and total cost for Blueprint loans',
    'content': script_code,
    'language': 'python3',
    'schema': {
        '$schema': 'https://json-schema.org/draft/2020-12/schema',
        'type': 'object',
        'required': [],
        'properties': {
            'loan_amount': {
                'type': 'integer',
                'default': 250000,
                'description': 'Loan amount ($)'
            },
            'annual_interest_rate': {
                'type': 'number',
                'default': 6.5,
                'description': 'Annual interest rate (%)'
            },
            'term_months': {
                'type': 'integer',
                'default': 360,
                'description': 'Loan term (months)'
            },
            'origination_fee_percent': {
                'type': 'number',
                'default': 1.0,
                'description': 'Origination fee (%)'
            }
        }
    }
}

# Create the script
headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json'
}

print("Creating loan calculator script...")
print("=" * 70)

response = requests.post(
    f'{WINDMILL_URL}/api/w/{WORKSPACE}/scripts/create',
    headers=headers,
    json=script_payload
)

print(f'Status Code: {response.status_code}')

if response.status_code in [200, 201]:
    print("[SUCCESS] Script created successfully!")
    print(f"Path: u/clay/loan_calculator_demo")
    print(f"\nTest URL: {WINDMILL_URL}/scripts/run/u/clay/loan_calculator_demo")
else:
    print(f"[ERROR] Failed to create script")
    print(f"Response: {response.text[:1000]}")

print("=" * 70)
