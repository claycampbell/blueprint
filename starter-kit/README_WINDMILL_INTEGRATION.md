# Windmill Integration Quick Start

## Overview

This starter kit demonstrates how to integrate Windmill workflows into a Next.js React application using a server-side proxy pattern.

## Demo

**Live Demo**: http://localhost:3000/windmill-demo

The demo page showcases:
- **Custom Script UI**: Loan calculator with custom React forms
- **Custom Flow UI**: Multi-step loan approval workflow
- **Embedded App**: iframe embedding example
- **Integration Comparison**: Architecture analysis

## Quick Start

### 1. Environment Setup

Create `.env.local` in the `starter-kit` directory:

```env
# Windmill Configuration
NEXT_PUBLIC_WINDMILL_URL=http://localhost:8000
NEXT_PUBLIC_WINDMILL_WORKSPACE=blueprint

# Server-side only (not exposed to browser)
WINDMILL_API_TOKEN=your_api_token_here
```

### 2. Create Windmill Resources

Run the creation scripts to set up demo resources:

```bash
cd starter-kit/windmill-tests

# Create loan calculator script
python create-demo-script.py

# Create loan approval flow
python create-demo-flow.py

# Verify resources
python final-demo-test.py
```

### 3. Start the Development Server

```bash
cd starter-kit
npm run dev
```

Navigate to http://localhost:3000/windmill-demo

## Using Windmill in Your Components

### Run a Script

```typescript
import windmill from '@/services/windmill';

const result = await windmill.runScript('u/clay/loan_calculator_demo', {
  loan_amount: 250000,
  annual_interest_rate: 6.5,
  term_months: 360,
  origination_fee_percent: 1.0
});

console.log(result.monthly_payment); // "$1,580.17"
```

### Run a Flow

```typescript
import windmill from '@/services/windmill';

const result = await windmill.runFlow('u/clay/loan_approval_demo', {
  loan_amount: 300000,
  borrower_name: 'Jane Smith',
  credit_score: 720,
  property_value: 450000
});

console.log(result.final_status); // "APPROVED"
console.log(result.interest_rate); // 6.5
```

### Error Handling

```typescript
import windmill, { WindmillError } from '@/services/windmill';

try {
  const result = await windmill.runScript('u/clay/my_script', args);
  // Handle success
} catch (err) {
  if (err instanceof WindmillError) {
    console.error('Windmill error:', err.message);
    console.error('Job ID:', err.jobId);
    console.error('Logs:', err.logs);
  }
}
```

## Architecture

### Client-Side (Browser)
```
React Component
  ↓ windmill.runScript()
WindmillService (@/services/windmill)
  ↓ fetch('/api/windmill/run-script')
```

### Server-Side (Next.js API Route)
```
/api/windmill/run-script
  ↓ Add auth token
  ↓ Submit job to Windmill API
  ↓ Poll for completion
  ↓ Return result
```

### Why This Pattern?

1. **CORS**: Avoids cross-origin issues
2. **Security**: API token never exposed to browser
3. **Simplicity**: Components just call `windmill.runScript()`
4. **Type Safety**: Full TypeScript support

## File Structure

```
starter-kit/
├── .env.local                              # Environment config
├── src/
│   ├── app/
│   │   ├── api/windmill/
│   │   │   ├── run-script/route.ts        # Script proxy
│   │   │   └── run-flow/route.ts          # Flow proxy
│   │   └── (dashboard)/windmill-demo/
│   │       └── page.tsx                    # Demo page
│   ├── components/windmill/
│   │   ├── LoanCalculator.tsx             # Example component
│   │   └── LoanApproval.tsx               # Example component
│   └── services/
│       └── windmill.ts                     # Client service
└── windmill-tests/
    ├── create-demo-script.py               # Script creator
    ├── create-demo-flow.py                 # Flow creator
    └── REACT_INTEGRATION_SUCCESS.md        # Full documentation
```

## Common Issues

### "Failed to fetch"
- **Cause**: Direct Windmill API call instead of proxy
- **Fix**: Use `windmill.runScript()` or `windmill.runFlow()`

### "Job timeout"
- **Cause**: Polling not finding completed job
- **Fix**: Check API route logs for details

### "401 Unauthorized"
- **Cause**: Missing or invalid API token
- **Fix**: Verify `WINDMILL_API_TOKEN` in `.env.local`

### Workspace mismatch
- **Cause**: Wrong workspace in environment
- **Fix**: Set `NEXT_PUBLIC_WINDMILL_WORKSPACE=blueprint`
- **Note**: Restart dev server after changing `.env.local`

## Creating New Windmill Resources

### Via Python API

```python
import requests

WINDMILL_URL = 'http://localhost:8000'
WORKSPACE = 'blueprint'
TOKEN = 'your_token_here'

# Create a script
response = requests.post(
    f'{WINDMILL_URL}/api/w/{WORKSPACE}/scripts/create',
    headers={
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json'
    },
    json={
        'path': 'u/your_username/script_name',
        'summary': 'Script description',
        'content': 'def main():\n    return {"message": "Hello"}',
        'language': 'python3'
    }
)
```

### Via Windmill UI

1. Navigate to http://localhost:8000
2. Go to Scripts or Flows section
3. Create manually
4. Reference the path in your React code

## Next Steps

- Read [REACT_INTEGRATION_SUCCESS.md](windmill-tests/REACT_INTEGRATION_SUCCESS.md) for detailed architecture
- See [MANUAL_CREATION_GUIDE.md](windmill-tests/MANUAL_CREATION_GUIDE.md) for Windmill resource creation
- Check [WINDMILL_DEMO_CREATED.md](windmill-tests/WINDMILL_DEMO_CREATED.md) for API examples

## Support

For issues or questions:
- Check [Windmill Documentation](https://www.windmill.dev/docs)
- Review troubleshooting section above
- Check Next.js server logs for API route errors
