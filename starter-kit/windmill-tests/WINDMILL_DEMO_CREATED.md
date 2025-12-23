# Windmill Demo Resources - Created Successfully

This document confirms that all demo content from `MANUAL_CREATION_GUIDE.md` has been created programmatically via the Windmill API.

## Resources Created

### 1. Loan Calculator Script ✓
- **Path**: `u/clay/loan_calculator_demo`
- **Type**: Python 3 script
- **Summary**: Loan Payment Calculator
- **Description**: Calculate monthly payments and total cost for Blueprint loans
- **Test URL**: http://localhost:8000/scripts/run/u/clay/loan_calculator_demo

**Parameters**:
- `loan_amount` (integer, default: 250000) - Loan amount ($)
- `annual_interest_rate` (number, default: 6.5) - Annual interest rate (%)
- `term_months` (integer, default: 360) - Loan term (months)
- `origination_fee_percent` (number, default: 1.0) - Origination fee (%)

**Output Example**:
```json
{
  "loan_amount": "$250,000.00",
  "monthly_payment": "$1,580.17",
  "total_interest": "$318,861.22",
  "total_payments": "$568,861.22",
  "origination_fee": "$2,500.00",
  "total_cost": "$571,361.22",
  "annual_interest_rate": "6.5%",
  "term_years": 30.0,
  "first_payment_breakdown": {
    "principal": "$217.34",
    "interest": "$1,362.84"
  }
}
```

### 2. Loan Approval Workflow ✓
- **Path**: `u/clay/loan_approval_demo`
- **Type**: Flow (3 steps)
- **Summary**: Loan Approval Workflow
- **Description**: Demo workflow for Blueprint loan approvals
- **Test URL**: http://localhost:8000/flows/run/u/clay/loan_approval_demo

**Flow Steps**:
1. **Application Input** - Calculate LTV ratio from loan and property values
2. **Credit Check** - Evaluate credit score and LTV against approval criteria
3. **Final Decision** - Determine final status and interest rate

**Parameters**:
- `loan_amount` (integer, default: 250000) - Loan amount ($)
- `borrower_name` (string, default: "John Doe") - Borrower name
- `credit_score` (integer, default: 750) - Credit score (300-850)
- `property_value` (integer, default: 500000) - Property value ($)

**Approval Logic**:
- **Approved**: Credit score ≥ 700 AND LTV ≤ 75% → 6.5% interest rate
- **Conditional**: Credit score ≥ 650 AND LTV ≤ 70% → 7.0% interest rate
- **Denied**: All other cases

**Output Example**:
```json
{
  "loan_amount": 300000,
  "borrower_name": "Jane Smith",
  "credit_score": 720,
  "property_value": 450000,
  "ltv": 66.67,
  "credit_status": "approved",
  "credit_message": "Meets credit requirements",
  "final_status": "APPROVED",
  "interest_rate": 6.5,
  "next_steps": [
    "Send commitment letter",
    "Order appraisal",
    "Schedule closing"
  ]
}
```

## Creation Method

All resources were created using the **Windmill REST API** rather than manual UI creation:

1. **API Token Created**: Full-scope token with permissions for scripts, flows, and job execution
2. **Script Creation**: POST to `/api/w/{workspace}/scripts/create`
3. **Flow Creation**: POST to `/api/w/{workspace}/flows/create` with `rawscript` modules
4. **Verification**: Executed both resources via `/api/w/{workspace}/jobs/run/p/...` and `/api/w/{workspace}/jobs/run/f/...`

## Scripts Used

### Creation Scripts
- [`create-demo-script.py`](create-demo-script.py) - Creates loan calculator script
- [`create-demo-flow.py`](create-demo-flow.py) - Creates loan approval flow
- [`create-proper-mcp-token.py`](create-proper-mcp-token.py) - Generates API tokens with correct scopes

### Verification Scripts
- [`verify-demo-resources.py`](verify-demo-resources.py) - Comprehensive verification of both resources
- [`test-corrected-flow.py`](test-corrected-flow.py) - Detailed flow execution test

## API Token Configuration

**Current Token**: `FmYFqLYfOX7yyt8N9a1TOxbHMtkqyKsx`

**Scopes**:
- `scripts:read` - Read script definitions
- `scripts:write` - Create/update scripts
- `flows:read` - Read flow definitions
- `flows:write` - Create/update flows
- `apps:read` - Read app definitions
- `apps:write` - Create/update apps
- `jobs:run:scripts` - Execute scripts
- `jobs:run:flows` - Execute flows
- `jobs:read` - View job results

## React Integration

The created resources are ready for embedding in the React demo page at:
- **URL**: http://localhost:3004/windmill-demo

The `WindmillEmbed` component will automatically detect and embed:
- Script in the "Script" tab: `u/clay/loan_calculator_demo`
- Flow in the "Flow" tab: `u/clay/loan_approval_demo`

## Verification Results

### Script Verification ✓
```
Status: 201 Created
Execution: SUCCESS
Monthly Payment: $1,580.17
Total Cost: $571,361.22
```

### Flow Verification ✓
```
Status: 201 Created
Execution: SUCCESS
Final Status: APPROVED
Interest Rate: 6.5%
LTV Ratio: 66.67%
```

## Key Insights

1. **Module Type**: Flows require `"type": "rawscript"` for inline scripts (not `"type": "script"`)
2. **API Structure**: Flow modules must include `content` and `language` directly in the `value` object
3. **Token Scopes**: Separate scopes required for creation vs. execution (`scripts:write` vs `jobs:run:scripts`)
4. **Job Execution**: Jobs are asynchronous; requires polling `/jobs/completed/get/{id}` for results

## Next Steps

1. ✓ Resources created in Windmill
2. ✓ Verified via API execution
3. → Test embedding in React app at http://localhost:3004/windmill-demo
4. → Verify user interactions work correctly in embedded view

---

**Created**: December 23, 2025
**Workspace**: blueprint
**Windmill URL**: http://localhost:8000
