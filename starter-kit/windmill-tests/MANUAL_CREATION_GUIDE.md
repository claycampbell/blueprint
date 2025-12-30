# Manual Creation Guide for Windmill Demo Content

Since the Windmill API requires authentication, here's how to create the flow and script manually in the Windmill UI.

## Step 1: Create the Loan Calculator Script

1. **Open Windmill**: http://localhost:8000
2. **Navigate to Scripts**: Click "Scripts" in the left sidebar
3. **Create New Script**: Click "+ Script" button
4. **Configure Script**:
   - Path: `u/clay/loan_calculator_demo`
   - Summary: `Loan Payment Calculator`
   - Description: `Calculate monthly payments and total cost for Blueprint loans`
   - Language: `Python 3`

5. **Paste Script Code**:

```python
def main(
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
```

6. **Save**: Click "Save" button

7. **Test**: Click "Test" button to run with default values

## Step 2: Create the Loan Approval Flow

1. **Navigate to Flows**: Click "Flows" in the left sidebar
2. **Create New Flow**: Click "+ Flow" button
3. **Configure Flow**:
   - Path: `u/clay/loan_approval_demo`
   - Summary: `Loan Approval Workflow`
   - Description: `Demo workflow for Blueprint loan approvals`

4. **Add Flow Input Schema**:
   - Click on "Flow Input" step
   - Set schema to:

```json
{
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
```

5. **Add Step 1 - Application Input**:
   - Click "+ Step" → "Inline Script" → "Python"
   - Summary: `Application Input`
   - Code:

```python
def main(loan_amount: int, borrower_name: str, credit_score: int, property_value: int):
    """Step 1: Application Input"""
    ltv = (loan_amount / property_value) * 100

    return {
        "loan_amount": loan_amount,
        "borrower_name": borrower_name,
        "credit_score": credit_score,
        "property_value": property_value,
        "ltv": round(ltv, 2)
    }
```

   - **Input Transforms**:
     - `loan_amount`: `flow_input.loan_amount`
     - `borrower_name`: `flow_input.borrower_name`
     - `credit_score`: `flow_input.credit_score`
     - `property_value`: `flow_input.property_value`

6. **Add Step 2 - Credit Check**:
   - Click "+ Step" → "Inline Script" → "Python"
   - Summary: `Credit Check`
   - Code:

```python
def main(application: dict):
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
```

   - **Input Transforms**:
     - `application`: `results.a` (or the ID of step 1)

7. **Add Step 3 - Final Decision**:
   - Click "+ Step" → "Inline Script" → "Python"
   - Summary: `Final Decision`
   - Code:

```python
def main(result: dict):
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
```

   - **Input Transforms**:
     - `result`: `results.b` (or the ID of step 2)

8. **Save Flow**: Click "Save" button

9. **Test Flow**: Click "Test" button and provide sample inputs

## Step 3: Update React Demo Page

Once created, the React demo will automatically detect and embed them at:
- **Script**: http://localhost:3004/windmill-demo (Script tab)
- **Flow**: http://localhost:3004/windmill-demo (Flow tab)

The `WindmillEmbed` component will use these paths:
- Script: `u/clay/loan_calculator_demo`
- Flow: `u/clay/loan_approval_demo`

## Verification

After creating both:

1. **Test Script**: http://localhost:8000/scripts/run/u/clay/loan_calculator_demo
2. **Test Flow**: http://localhost:8000/flows/run/u/clay/loan_approval_demo
3. **View in React**: http://localhost:3004/windmill-demo

## Quick Create Tips

- **Copy-Paste**: Copy code blocks above directly into Windmill editor
- **Test First**: Always test in Windmill before embedding
- **Path Format**: Must use `u/clay/name` format (user/username/resourcename)
- **Save Often**: Windmill auto-saves but use Save button to be sure

## Troubleshooting

**Issue**: Path already exists
- **Solution**: Delete existing script/flow first or use different name

**Issue**: Syntax errors
- **Solution**: Check Python indentation (spaces, not tabs)

**Issue**: Flow inputs not connecting
- **Solution**: Use correct step IDs in input transforms (a, b, c by default)

**Issue**: Script won't save
- **Solution**: Check that all parameters have type hints (`: int`, `: str`, etc.)

---

**Estimated Time**: 10-15 minutes total (5 min script + 10 min flow)

After creation, refresh http://localhost:3004/windmill-demo and click the Flow/Script tabs!
