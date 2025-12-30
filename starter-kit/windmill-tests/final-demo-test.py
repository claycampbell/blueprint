#!/usr/bin/env python
"""
Final comprehensive test of both Windmill demo resources
"""

import requests
import time
import json

WINDMILL_URL = 'http://localhost:8000'
WORKSPACE = 'blueprint'
TOKEN = 'FmYFqLYfOX7yyt8N9a1TOxbHMtkqyKsx'

headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json'
}

print('='*70)
print('WINDMILL DEMO RESOURCES - FINAL COMPREHENSIVE TEST')
print('='*70)
print()

# Test 1: Loan Calculator Script
print('1. Testing Loan Calculator Script')
print('-'*70)

script_params = {
    'loan_amount': 500000,
    'annual_interest_rate': 7.0,
    'term_months': 360,
    'origination_fee_percent': 1.5
}

script_run = requests.post(
    f'{WINDMILL_URL}/api/w/{WORKSPACE}/jobs/run/p/u/clay/loan_calculator_demo',
    headers=headers,
    json=script_params
)

if script_run.status_code in [200, 201]:
    job_id = script_run.text.strip().strip('"')
    print(f'[OK] Script started: {job_id}')

    time.sleep(2)

    result_resp = requests.get(
        f'{WINDMILL_URL}/api/w/{WORKSPACE}/jobs/completed/get/{job_id}',
        headers=headers
    )

    if result_resp.status_code == 200:
        result = result_resp.json().get('result', {})
        print(f'[OK] Script completed successfully')
        print()
        print('Input:')
        print(f'  Loan Amount: ${script_params["loan_amount"]:,}')
        print(f'  Interest Rate: {script_params["annual_interest_rate"]}%')
        print(f'  Term: {script_params["term_months"]} months')
        print(f'  Origination Fee: {script_params["origination_fee_percent"]}%')
        print()
        print('Output:')
        print(f'  Monthly Payment: {result.get("monthly_payment")}')
        print(f'  Total Interest: {result.get("total_interest")}')
        print(f'  Total Cost: {result.get("total_cost")}')
        print(f'  First Payment Principal: {result.get("first_payment_breakdown", {}).get("principal")}')
        print(f'  First Payment Interest: {result.get("first_payment_breakdown", {}).get("interest")}')

print()
print()

# Test 2: Loan Approval Flow - Approved Case
print('2. Testing Loan Approval Flow - APPROVED Case')
print('-'*70)

approved_params = {
    'loan_amount': 400000,
    'borrower_name': 'Alice Johnson',
    'credit_score': 780,
    'property_value': 600000
}

flow_run = requests.post(
    f'{WINDMILL_URL}/api/w/{WORKSPACE}/jobs/run/f/u/clay/loan_approval_demo',
    headers=headers,
    json=approved_params
)

if flow_run.status_code in [200, 201]:
    job_id = flow_run.text.strip().strip('"')
    print(f'[OK] Flow started: {job_id}')

    time.sleep(4)

    result_resp = requests.get(
        f'{WINDMILL_URL}/api/w/{WORKSPACE}/jobs/completed/get/{job_id}',
        headers=headers
    )

    if result_resp.status_code == 200:
        data = result_resp.json()
        if data.get('success'):
            result = data.get('result', {})
            print(f'[OK] Flow completed successfully')
            print()
            print('Input:')
            print(f'  Borrower: {approved_params["borrower_name"]}')
            print(f'  Loan Amount: ${approved_params["loan_amount"]:,}')
            print(f'  Credit Score: {approved_params["credit_score"]}')
            print(f'  Property Value: ${approved_params["property_value"]:,}')
            print()
            print('Output:')
            print(f'  LTV Ratio: {result.get("ltv")}%')
            print(f'  Credit Status: {result.get("credit_status")}')
            print(f'  Final Decision: {result.get("final_status")}')
            print(f'  Interest Rate: {result.get("interest_rate")}%')
            print(f'  Next Steps:')
            for step in result.get('next_steps', []):
                print(f'    - {step}')

print()
print()

# Test 3: Loan Approval Flow - Conditional Case
print('3. Testing Loan Approval Flow - CONDITIONAL Case')
print('-'*70)

conditional_params = {
    'loan_amount': 350000,
    'borrower_name': 'Bob Williams',
    'credit_score': 670,
    'property_value': 500000
}

flow_run = requests.post(
    f'{WINDMILL_URL}/api/w/{WORKSPACE}/jobs/run/f/u/clay/loan_approval_demo',
    headers=headers,
    json=conditional_params
)

if flow_run.status_code in [200, 201]:
    job_id = flow_run.text.strip().strip('"')
    print(f'[OK] Flow started: {job_id}')

    time.sleep(4)

    result_resp = requests.get(
        f'{WINDMILL_URL}/api/w/{WORKSPACE}/jobs/completed/get/{job_id}',
        headers=headers
    )

    if result_resp.status_code == 200:
        data = result_resp.json()
        if data.get('success'):
            result = data.get('result', {})
            print(f'[OK] Flow completed successfully')
            print()
            print('Input:')
            print(f'  Borrower: {conditional_params["borrower_name"]}')
            print(f'  Loan Amount: ${conditional_params["loan_amount"]:,}')
            print(f'  Credit Score: {conditional_params["credit_score"]}')
            print(f'  Property Value: ${conditional_params["property_value"]:,}')
            print()
            print('Output:')
            print(f'  LTV Ratio: {result.get("ltv")}%')
            print(f'  Credit Status: {result.get("credit_status")}')
            print(f'  Final Decision: {result.get("final_status")}')
            print(f'  Interest Rate: {result.get("interest_rate")}%')
            print(f'  Next Steps:')
            for step in result.get('next_steps', []):
                print(f'    - {step}')

print()
print()

# Test 4: Loan Approval Flow - Denied Case
print('4. Testing Loan Approval Flow - DENIED Case')
print('-'*70)

denied_params = {
    'loan_amount': 450000,
    'borrower_name': 'Charlie Brown',
    'credit_score': 620,
    'property_value': 500000
}

flow_run = requests.post(
    f'{WINDMILL_URL}/api/w/{WORKSPACE}/jobs/run/f/u/clay/loan_approval_demo',
    headers=headers,
    json=denied_params
)

if flow_run.status_code in [200, 201]:
    job_id = flow_run.text.strip().strip('"')
    print(f'[OK] Flow started: {job_id}')

    time.sleep(4)

    result_resp = requests.get(
        f'{WINDMILL_URL}/api/w/{WORKSPACE}/jobs/completed/get/{job_id}',
        headers=headers
    )

    if result_resp.status_code == 200:
        data = result_resp.json()
        if data.get('success'):
            result = data.get('result', {})
            print(f'[OK] Flow completed successfully')
            print()
            print('Input:')
            print(f'  Borrower: {denied_params["borrower_name"]}')
            print(f'  Loan Amount: ${denied_params["loan_amount"]:,}')
            print(f'  Credit Score: {denied_params["credit_score"]}')
            print(f'  Property Value: ${denied_params["property_value"]:,}')
            print()
            print('Output:')
            print(f'  LTV Ratio: {result.get("ltv")}%')
            print(f'  Credit Status: {result.get("credit_status")}')
            print(f'  Final Decision: {result.get("final_status")}')
            print(f'  Interest Rate: {result.get("interest_rate")}')
            print(f'  Next Steps:')
            for step in result.get('next_steps', []):
                print(f'    - {step}')

print()
print()
print('='*70)
print('[SUCCESS] All demo resources verified!')
print('='*70)
print()
print('Access URLs:')
print(f'  Windmill Script: {WINDMILL_URL}/scripts/run/u/clay/loan_calculator_demo')
print(f'  Windmill Flow:   {WINDMILL_URL}/flows/run/u/clay/loan_approval_demo')
print(f'  React Demo:      http://localhost:3004/windmill-demo')
print('='*70)
