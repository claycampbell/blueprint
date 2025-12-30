# Windmill React Integration - Complete Success

**Status**: ✅ FULLY WORKING
**Date**: December 23, 2025
**Demo URL**: http://localhost:3000/windmill-demo

## Summary

Successfully integrated Windmill workflows with a custom React application using Next.js API routes as a proxy layer. Both the loan calculator script and loan approval flow are now fully functional in the React UI.

## Architecture

```
┌─────────────────────┐
│   React Frontend    │
│  (Browser/Client)   │
└──────────┬──────────┘
           │ fetch('/api/windmill/...')
           ▼
┌─────────────────────┐
│  Next.js API Route  │
│  (Server-side)      │
│  - Adds auth token  │
│  - Polls for result │
└──────────┬──────────┘
           │ HTTP + Bearer token
           ▼
┌─────────────────────┐
│   Windmill API      │
│  (localhost:8000)   │
│  - Executes jobs    │
│  - Returns results  │
└─────────────────────┘
```

## Key Components

### 1. Environment Configuration

**File**: `.env.local`

```env
# Public (exposed to browser)
NEXT_PUBLIC_WINDMILL_URL=http://localhost:8000
NEXT_PUBLIC_WINDMILL_WORKSPACE=blueprint

# Server-side only (NOT exposed to browser)
WINDMILL_API_TOKEN=FmYFqLYfOX7yyt8N9a1TOxbHMtkqyKsx
```

**Security**: The API token is prefixed with `WINDMILL_` (not `NEXT_PUBLIC_`) so it's only available server-side and never sent to the browser.

### 2. Next.js API Routes (Proxy Layer)

These server-side routes handle authentication and job polling:

#### Script Execution Route
**File**: `src/app/api/windmill/run-script/route.ts`

**Endpoint**: `POST /api/windmill/run-script`

**Request**:
```json
{
  "path": "u/clay/loan_calculator_demo",
  "args": {
    "loan_amount": 250000,
    "annual_interest_rate": 6.5,
    "term_months": 360,
    "origination_fee_percent": 1.0
  }
}
```

**Response**: Returns the script result directly (no wrapper)

#### Flow Execution Route
**File**: `src/app/api/windmill/run-flow/route.ts`

**Endpoint**: `POST /api/windmill/run-flow`

**Request**:
```json
{
  "path": "u/clay/loan_approval_demo",
  "args": {
    "loan_amount": 250000,
    "borrower_name": "John Doe",
    "credit_score": 750,
    "property_value": 500000
  }
}
```

**Response**: Returns the flow result directly

### 3. WindmillService (Client-side)

**File**: `src/services/windmill.ts`

The service was updated to call the Next.js proxy routes instead of directly calling Windmill:

```typescript
async runScript(path: string, args: WindmillScriptArgs = {}): Promise<any> {
  const response = await fetch('/api/windmill/run-script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new WindmillError(error.error || 'Failed to run script');
  }

  return response.json();
}
```

### 4. React Components

#### Loan Calculator
**File**: `src/components/windmill/LoanCalculator.tsx`

- Custom React form with loan parameters
- Calls `windmill.runScript('u/clay/loan_calculator_demo', formData)`
- Displays results in custom UI with styled cards and breakdowns

#### Loan Approval Flow
**File**: `src/components/windmill/LoanApproval.tsx`

- Custom React form with borrower details
- Calls `windmill.runFlow('u/clay/loan_approval_demo', formData)`
- Shows approval decision, interest rate, and next steps

#### Demo Page
**File**: `src/app/(dashboard)/windmill-demo/page.tsx`

Tabbed interface showing:
1. Custom Script UI (loan calculator)
2. Custom Flow UI (loan approval)
3. Embedded App (iframe embed)
4. Integration Comparison (architecture table)

## Problem & Solution

### Initial Problem
Direct browser calls to Windmill API failed due to:
1. **CORS**: Browser blocked `localhost:3000` → `localhost:8000` requests
2. **Authentication**: API token cannot be exposed in browser code
3. **Workspace Mismatch**: Service defaulted to 'admins' workspace instead of 'blueprint'

### Solution: Next.js API Route Proxy
The proxy pattern solves all three issues:
- **CORS**: Browser calls same-origin (`/api/windmill/*`)
- **Auth**: Token stays server-side in environment variables
- **Configuration**: Workspace configured via `.env.local`

### Critical Discovery: Job Status Response Structure

The `/jobs/completed/get/{id}` endpoint returns a different structure than documented:

**Actual Response**:
```json
{
  "success": true,
  "result": { /* actual result data */ },
  "duration_ms": 114,
  // ... other fields but NO "type" field
}
```

**Initial (Wrong) Check**:
```typescript
if (jobStatus.type === 'CompletedJob' && jobStatus.success)
```

**Corrected Check**:
```typescript
if (jobStatus.success === true && jobStatus.result !== undefined)
```

## Polling Logic

The API routes poll Windmill for job completion:

```typescript
const maxAttempts = 120; // 60 seconds (120 * 500ms)
const pollInterval = 500;

for (let i = 0; i < maxAttempts; i++) {
  await new Promise(resolve => setTimeout(resolve, pollInterval));

  // Try completed endpoint first (fast path)
  let statusResponse = await fetch(
    `${WINDMILL_URL}/api/w/${WORKSPACE}/jobs/completed/get/${jobId}`,
    { headers: { 'Authorization': `Bearer ${TOKEN}` } }
  );

  // Fallback to general job status if not in completed
  if (!statusResponse.ok) {
    statusResponse = await fetch(
      `${WINDMILL_URL}/api/w/${WORKSPACE}/jobs/get/${jobId}`,
      { headers: { 'Authorization': `Bearer ${TOKEN}` } }
    );
  }

  if (statusResponse.ok) {
    const jobStatus = await statusResponse.json();

    if (jobStatus.success === true && jobStatus.result !== undefined) {
      return NextResponse.json(jobStatus.result);
    }

    if (jobStatus.success === false) {
      return NextResponse.json(
        { error: 'Job failed', details: jobStatus.result },
        { status: 500 }
      );
    }
  }
}
```

## Testing & Verification

### Test Results

**Loan Calculator Script**:
```
Input:  $250,000 @ 6.5% for 360 months, 1% origination
Output: $1,580.17/month, $571,361.22 total cost
Status: ✅ Working perfectly
```

**Loan Approval Flow**:
```
Input:  Jane Smith, $300,000 loan, 720 credit, $450,000 property
Output: APPROVED, 6.5% rate, 66.67% LTV
Status: ✅ Working perfectly
```

### Performance
- **Script execution**: ~100-200ms
- **Flow execution**: ~500ms-1s
- **Total round-trip**: ~1-3 seconds (including polling overhead)
- **Poll interval**: 500ms (fast enough for UI feedback)

## Windmill Resources Created

### Script: Loan Calculator
- **Path**: `u/clay/loan_calculator_demo`
- **Language**: Python 3
- **Function**: Calculate monthly payments, total interest, and fees
- **Windmill URL**: http://localhost:8000/scripts/run/u/clay/loan_calculator_demo

### Flow: Loan Approval
- **Path**: `u/clay/loan_approval_demo`
- **Steps**: 3 (Application Input → Credit Check → Final Decision)
- **Function**: Evaluate loan applications based on credit score and LTV ratio
- **Windmill URL**: http://localhost:8000/flows/run/u/clay/loan_approval_demo

## Production Considerations

### Security
1. **API Token Rotation**: Tokens created for this demo should be rotated for production
2. **Rate Limiting**: Consider adding rate limits to API routes
3. **Input Validation**: Add server-side validation in API routes
4. **Error Handling**: Add structured error logging

### Performance
1. **Polling Optimization**: Consider WebSockets for long-running jobs
2. **Caching**: Cache frequently-used results if appropriate
3. **Connection Pooling**: Reuse HTTP connections to Windmill

### Deployment
1. **Environment Variables**: Configure for production Windmill instance
2. **CORS**: May need CORS configuration if deploying to different domains
3. **Monitoring**: Add request logging and error tracking
4. **Health Checks**: Add endpoint to verify Windmill connectivity

## Files Modified/Created

### Created
- `src/app/api/windmill/run-script/route.ts` - Script execution proxy
- `src/app/api/windmill/run-flow/route.ts` - Flow execution proxy
- `.env.local` - Environment configuration
- `windmill-tests/REACT_INTEGRATION_SUCCESS.md` - This document

### Modified
- `src/services/windmill.ts` - Updated to use proxy routes
- `src/components/windmill/LoanCalculator.tsx` - Working with proxy
- `src/components/windmill/LoanApproval.tsx` - Working with proxy

## Troubleshooting

### Issue: "Failed to fetch"
**Cause**: CORS blocking direct Windmill API calls
**Solution**: Ensure using `/api/windmill/*` proxy routes, not direct Windmill URLs

### Issue: "Job timeout"
**Cause**: Job not completing or polling logic not finding result
**Solution**: Check `jobStatus.success` and `jobStatus.result` fields (not `type` field)

### Issue: Incorrect workspace
**Cause**: Environment variable not loaded
**Solution**: Restart Next.js dev server to reload `.env.local`

### Issue: 401 Unauthorized
**Cause**: Missing or invalid API token
**Solution**: Verify `WINDMILL_API_TOKEN` in `.env.local` and check token scopes

## References

- **Windmill Documentation**: https://www.windmill.dev/docs
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Manual Creation Guide**: [MANUAL_CREATION_GUIDE.md](MANUAL_CREATION_GUIDE.md)
- **Windmill Demo Created**: [WINDMILL_DEMO_CREATED.md](WINDMILL_DEMO_CREATED.md)

---

**Status**: Production-ready architecture validated ✅
**Recommendation**: This pattern is suitable for Blueprint Connect 2.0 implementation
