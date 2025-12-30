# Windmill Embedding Guide - Apps, Flows, and Scripts

## Overview

The `WindmillEmbed` component now supports embedding three types of Windmill content:
1. **Apps** - Interactive dashboards with tables, charts, forms
2. **Flows** - Workflow execution forms
3. **Scripts** - Script execution forms with parameters

## Component Props

```typescript
interface WindmillEmbedProps {
  type?: 'app' | 'flow' | 'script';  // Default: 'app'
  workspace: string;                  // Windmill workspace name
  path: string;                       // Content path
  baseUrl?: string;                   // Windmill URL (default: localhost:8000)
  height?: string;                    // iframe height (default: '600px')
  width?: string;                     // iframe width (default: '100%')
  className?: string;                 // Custom CSS classes
  title?: string;                     // Accessibility title
  hideSidebar?: boolean;             // Hide sidebar (apps only, default: true)
}
```

## Usage Examples

### 1. Embedding an App Dashboard

**Use Case**: Display loan data, analytics, or interactive reports

```tsx
import WindmillEmbed from '@/components/shared/WindmillEmbed';

<WindmillEmbed
  type="app"
  workspace="blueprint"
  path="u/clay/blueprint_loan_dashboard"
  height="700px"
  title="Loan Dashboard"
  hideSidebar={true}
/>
```

**URL Pattern**: `http://localhost:8000/apps/get/u/clay/blueprint_loan_dashboard`

**Features**:
- Full interactive dashboard
- Tables, charts, forms, buttons
- Sidebar automatically hidden with CSS cropping
- Real-time data updates

### 2. Embedding a Flow Form

**Use Case**: Loan approval workflow, draw request process, document generation

```tsx
<WindmillEmbed
  type="flow"
  workspace="blueprint"
  path="f/loan_approval_workflow"
  height="600px"
  title="Loan Approval Process"
/>
```

**URL Pattern**: `http://localhost:8000/flows/run/f/loan_approval_workflow`

**Features**:
- Step-by-step workflow execution
- Form inputs for flow parameters
- Progress tracking
- Results display
- **No sidebar** - flows render clean by default

**Example Flow Scenarios**:
- **Draw Request Flow**: Borrower submits draw → Inspector review → Approval → Disbursement
- **Loan Approval**: Application → Credit check → Underwriting → Approval
- **Document Generation**: Gather data → Generate PDF → Store in S3 → Email borrower

### 3. Embedding a Script Form

**Use Case**: Run individual scripts with parameter inputs

```tsx
<WindmillEmbed
  type="script"
  workspace="blueprint"
  path="u/clay/calculate_feasibility_score"
  height="500px"
  title="Feasibility Calculator"
/>
```

**URL Pattern**: `http://localhost:8000/scripts/run/u/clay/calculate_feasibility_score`

**Features**:
- Form with script parameter inputs
- Execute button
- Results/output display
- Error handling
- **No sidebar** - scripts render clean by default

**Example Script Scenarios**:
- **Feasibility Score Calculator**: Input project details → Calculate score
- **Loan Proforma Generator**: Input costs/revenue → Generate proforma
- **Builder Credit Check**: Input builder info → Fetch credit report

## Windmill Content Path Patterns

| Content Type | Path Pattern | Example |
|--------------|--------------|---------|
| **User App** | `u/<username>/<app_name>` | `u/clay/blueprint_loan_dashboard` |
| **Folder App** | `f/<folder>/<app_name>` | `f/dashboards/loan_overview` |
| **User Flow** | `f/<username>/<flow_name>` | `f/clay/loan_approval` |
| **Folder Flow** | `f/<folder>/<flow_name>` | `f/workflows/draw_processing` |
| **User Script** | `u/<username>/<script_name>` | `u/clay/calculate_score` |
| **Folder Script** | `f/<folder>/<script_name>` | `f/scripts/generate_report` |

## Real-World Blueprint Connect 2.0 Examples

### Example 1: Feasibility Module - Decision Dashboard

```tsx
// src/app/(dashboard)/feasibility/[id]/page.tsx

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Left: Project details from Connect 2.0 */}
  <ProjectDetailsCard project={project} />

  {/* Right: Windmill feasibility analysis dashboard */}
  <WindmillEmbed
    type="app"
    workspace="blueprint"
    path={`u/clay/feasibility_analysis_${project.id}`}
    height="600px"
    title="Feasibility Analysis"
  />
</div>
```

### Example 2: Servicing Module - Draw Request Flow

```tsx
// src/app/(dashboard)/servicing/draws/new/page.tsx

<WindmillEmbed
  type="flow"
  workspace="blueprint"
  path="f/workflows/draw_request_submission"
  height="800px"
  title="Submit Draw Request"
/>
```

**Flow Steps**:
1. Borrower info (pre-filled from Connect 2.0)
2. Draw amount and invoice upload
3. Inspection scheduling
4. Inspector assignment
5. Approval routing
6. Disbursement confirmation

### Example 3: Lending Module - Loan Calculator

```tsx
// src/app/(dashboard)/loans/calculator/page.tsx

<WindmillEmbed
  type="script"
  workspace="blueprint"
  path="u/clay/loan_payment_calculator"
  height="500px"
  title="Loan Payment Calculator"
/>
```

**Script Inputs**:
- Loan amount
- Interest rate
- Term (months)
- Start date

**Script Output**:
- Monthly payment
- Total interest
- Amortization schedule
- Payment breakdown

## Styling and Layout

### Container Styling

```tsx
<WindmillEmbed
  type="app"
  workspace="blueprint"
  path="u/clay/dashboard"
  height="700px"
  className="shadow-lg rounded-lg"  // Custom Tailwind classes
/>
```

### Responsive Heights

```tsx
<WindmillEmbed
  type="flow"
  workspace="blueprint"
  path="f/workflow"
  height="min(80vh, 900px)"  // Responsive: 80% viewport or max 900px
/>
```

### Full-Width Layout

```tsx
<div className="w-full max-w-7xl mx-auto">
  <WindmillEmbed
    type="app"
    workspace="blueprint"
    path="u/clay/wide_dashboard"
    width="100%"
    height="600px"
  />
</div>
```

## Sidebar Hiding (Apps Only)

The component automatically hides the Windmill sidebar for **apps** using CSS cropping:

```typescript
hideSidebar={true}  // Default for apps
```

**How it works**:
- Iframe is shifted **-220px to the left**
- Iframe width is increased by **220px**
- Container has `overflow: hidden` to crop the sidebar

**Flows and Scripts**:
- No sidebar by default
- `hideSidebar` prop has no effect

## Authentication Considerations

### Community Edition (Current Setup)

**Same-origin only**: Windmill and Connect 2.0 must share cookies (both on localhost or same domain)

```
Connect 2.0: http://localhost:3004
Windmill:    http://localhost:8000
✅ Works: Same origin (localhost)
```

### Production Deployment

**Option 1: Subdomain** (Recommended)
```
Connect 2.0: https://app.blueprintconnect.com
Windmill:    https://windmill.blueprintconnect.com
✅ Shares cookies with SameSite=None
```

**Option 2: Same Domain**
```
Connect 2.0: https://blueprintconnect.com
Windmill:    https://blueprintconnect.com/windmill
✅ Same origin, cookies work automatically
```

**Option 3: Public Apps** (Read-only)
```tsx
// Make Windmill app public (no auth required)
<WindmillEmbed
  type="app"
  workspace="blueprint"
  path="u/clay/public_dashboard"
  height="600px"
/>
```

## Performance Optimization

### Lazy Loading

```tsx
import dynamic from 'next/dynamic';

const WindmillEmbed = dynamic(
  () => import('@/components/shared/WindmillEmbed'),
  { ssr: false, loading: () => <LoadingSpinner /> }
);
```

### Conditional Rendering

```tsx
{showDashboard && (
  <WindmillEmbed
    type="app"
    workspace="blueprint"
    path="u/clay/dashboard"
    height="700px"
  />
)}
```

## URL Endpoints Summary

| Type | Endpoint Pattern | Example |
|------|------------------|---------|
| App | `/apps/get/{path}` | `/apps/get/u/clay/loan_dashboard` |
| Flow | `/flows/run/{path}` | `/flows/run/f/loan_approval` |
| Script | `/scripts/run/{path}` | `/scripts/run/u/clay/calculator` |

## Troubleshooting

### Issue: 404 Not Found

**Cause**: Incorrect path or content doesn't exist
**Solution**: Verify path in Windmill UI or via API

```bash
# List apps
curl http://localhost:8000/api/w/admins/apps/list

# List flows
curl http://localhost:8000/api/w/admins/flows/list

# List scripts
curl http://localhost:8000/api/w/admins/scripts/list
```

### Issue: Sidebar Still Showing

**Cause**: `hideSidebar` not working for your app layout
**Solution**: Adjust the sidebar width offset

```tsx
// Manually adjust if sidebar width differs
<WindmillEmbed
  type="app"
  path="u/clay/app"
  hideSidebar={false}  // Disable auto-hide
  // Then apply custom CSS
/>
```

### Issue: Authentication Errors

**Cause**: Cookie SameSite policy blocking in iframes
**Solutions**:
1. Deploy on same domain/subdomain
2. Configure Windmill with `SameSite=None; Secure`
3. Use public apps (no auth required)

### Issue: Content Too Small/Large

**Cause**: Fixed iframe height doesn't match content
**Solution**: Adjust height or use viewport-relative units

```tsx
<WindmillEmbed
  type="flow"
  path="f/long_workflow"
  height="max(600px, 70vh)"  // At least 600px or 70% viewport
/>
```

## Migration from Legacy appPath Prop

Old syntax (still works, but deprecated):
```tsx
<WindmillEmbed
  workspace="blueprint"
  appPath="u/clay/dashboard"
  height="700px"
/>
```

New syntax (recommended):
```tsx
<WindmillEmbed
  type="app"
  workspace="blueprint"
  path="u/clay/dashboard"
  height="700px"
/>
```

The component supports both for backward compatibility.

## Next Steps

1. **Create Flow Forms**: Build draw request, loan approval, document generation flows in Windmill
2. **Build Script Library**: Create reusable calculation and data processing scripts
3. **Design App Templates**: Standard dashboard layouts for different modules
4. **Test Authentication**: Set up production domain structure for cookie sharing
5. **Consider White Label**: Evaluate Windmill White Label Edition for React SDK (cleaner integration)

---

**Component Location**: [src/components/shared/WindmillEmbed.tsx](../src/components/shared/WindmillEmbed.tsx)
**Demo Page**: http://localhost:3004/windmill-demo
**Windmill UI**: http://localhost:8000
