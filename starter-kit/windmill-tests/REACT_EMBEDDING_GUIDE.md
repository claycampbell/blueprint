# Windmill React Embedding Guide

## Summary

Successfully integrated Windmill dashboards into Blueprint Connect 2.0 React application using iframe embedding.

## What We Built

### 1. WindmillEmbed Component

**Location:** [src/components/shared/WindmillEmbed.tsx](../src/components/shared/WindmillEmbed.tsx)

Reusable React component for embedding Windmill apps:

```tsx
<WindmillEmbed
  workspace="blueprint"
  appPath="u/clay/blueprint_loan_dashboard"
  height="700px"
  title="Blueprint Loan Dashboard"
/>
```

**Features:**
- Configurable workspace and app path
- Customizable dimensions (height/width)
- Security sandbox attributes
- Accessible iframe with titles
- Styled container with border radius

### 2. Demo Page

**Location:** [src/app/(dashboard)/windmill-demo/page.tsx](../src/app/(dashboard)/windmill-demo/page.tsx)

Full demonstration page showing:
- Embedded loan dashboard (created programmatically)
- Technical details about the integration
- Next steps for production deployment
- Navigation menu integration

**Access:** http://localhost:3000/windmill-demo (when dev server running)

### 3. Menu Integration

Added "Windmill Demo" to vertical navigation menu in [src/data/navigation/verticalMenuData.jsx](../src/data/navigation/verticalMenuData.jsx)

## Integration Approach

Since we're using **Windmill Community Edition** (not White Label), we use **iframe embedding** instead of the React SDK.

### Iframe Method

**Pros:**
- Works with Community Edition (free)
- Simple implementation
- No additional dependencies
- Full Windmill UI/UX preserved

**Cons:**
- Limited customization of embedded content
- Cookie/authentication considerations (SameSite policies)
- Cannot deeply integrate Windmill state with React state
- iframe performance overhead

### Alternative: React SDK (White Label Edition)

If Blueprint upgrades to Windmill White Label Edition, you can use:

```tsx
import { AppPreview } from '@windmill/react-sdk';

<AppPreview
  workspace="blueprint"
  appPath="u/clay/blueprint_loan_dashboard"
/>
```

**Benefits:**
- Direct React component integration
- Shared state between Connect 2.0 and Windmill
- Custom styling and theming
- Better performance (no iframe)

**Cost:** Requires White Label Edition subscription

## Production Considerations

### 1. Authentication

Current implementation uses localhost without authentication. For production:

**Option A: Public Dashboards**
- Make certain dashboards public (no auth required)
- Use Windmill's public sharing feature
- Suitable for read-only dashboards

**Option B: Shared Session**
- Implement OAuth/JWT for Connect 2.0
- Configure Windmill to use same auth provider
- Share session tokens between systems

**Option C: API Key Authentication**
- Generate API keys for embedded dashboards
- Pass via query parameter: `?token=xxx`
- Windmill validates token on load

### 2. Production URL

Replace `baseUrl` prop in production:

```tsx
<WindmillEmbed
  workspace="blueprint"
  appPath="u/clay/blueprint_loan_dashboard"
  baseUrl="https://windmill.blueprintconnect.com"  // Production URL
  height="700px"
/>
```

### 3. Data Synchronization

For production, implement bidirectional data sync:

**Connect 2.0 → Windmill:**
- Use Windmill REST API to update app data when loan data changes
- Create/update resources via API endpoints
- Trigger Windmill flows from Connect 2.0 events

**Windmill → Connect 2.0:**
- Use Windmill webhooks to notify Connect 2.0 of user actions
- Windmill flows can call Connect 2.0 API endpoints
- Real-time updates via WebSocket (if needed)

### 4. Cookie/Session Handling

Iframe embedding has cookie restrictions with SameSite policies:

**Issue:** Browsers block third-party cookies by default
**Solution:**
- Deploy Windmill on same domain (subdomain): `windmill.blueprintconnect.com`
- Or use `SameSite=None; Secure` cookies (requires HTTPS)
- Or implement token-based authentication (no cookies)

### 5. Performance Optimization

**Lazy Loading:**
```tsx
import dynamic from 'next/dynamic';

const WindmillEmbed = dynamic(
  () => import('@/components/shared/WindmillEmbed'),
  { ssr: false }
);
```

**Conditional Rendering:**
```tsx
{showDashboard && (
  <WindmillEmbed
    workspace="blueprint"
    appPath="u/clay/blueprint_loan_dashboard"
  />
)}
```

## Example Use Cases

### 1. Loan Dashboard (Current Demo)

Embedded in `/windmill-demo` showing programmatically created loan table.

**Future Enhancement:** Pull real loan data from Connect 2.0 database and push to Windmill via API.

### 2. Feasibility Reports

Create Windmill apps for each feasibility project:

```tsx
<WindmillEmbed
  workspace="blueprint"
  appPath={`u/clay/feasibility_${projectId}`}
  height="600px"
/>
```

### 3. Interactive Charts

Use Windmill's chart components (Vega-Lite, AgCharts) for analytics:

```tsx
<WindmillEmbed
  workspace="blueprint"
  appPath="u/clay/loan_analytics_charts"
  height="500px"
/>
```

### 4. Custom Forms

Build data entry forms in Windmill, embed in Connect 2.0:

```tsx
<WindmillEmbed
  workspace="blueprint"
  appPath="u/clay/draw_request_form"
  height="800px"
/>
```

## Testing Locally

1. **Ensure Windmill is running:**
   ```bash
   docker ps  # Should show windmill_server
   ```

2. **Start Next.js dev server:**
   ```bash
   cd starter-kit
   npm run dev
   ```

3. **Navigate to demo:**
   Open http://localhost:3000/windmill-demo

4. **Verify dashboard loads:**
   You should see the Blueprint Loan Dashboard with 5 loan records

## Troubleshooting

### Dashboard doesn't load

**Check:**
- Windmill server is running: `http://localhost:8000`
- Dashboard exists: `http://localhost:8000/apps/get/u/clay/blueprint_loan_dashboard`
- Browser console for errors

### Authentication errors

**Fix:**
- Login to Windmill first: `http://localhost:8000`
- Then navigate to Connect 2.0 demo page
- Browsers share cookies between localhost:8000 and localhost:3000

### Blank iframe

**Check:**
- `appPath` prop is correct
- Dashboard was created successfully (run `create-final-dashboard.py`)
- No CORS errors in browser console

### Styling issues

**CSS conflicts:**
- Windmill uses Tailwind (like Connect 2.0)
- iframe isolation prevents conflicts
- Adjust `height` prop if content is cut off

## Files Created

### Production Code
- [src/components/shared/WindmillEmbed.tsx](../src/components/shared/WindmillEmbed.tsx) - Reusable component
- [src/app/(dashboard)/windmill-demo/page.tsx](../src/app/(dashboard)/windmill-demo/page.tsx) - Demo page
- [src/data/navigation/verticalMenuData.jsx](../src/data/navigation/verticalMenuData.jsx) - Menu config (modified)

### Documentation
- [REACT_EMBEDDING_GUIDE.md](REACT_EMBEDDING_GUIDE.md) - This file

### Reference
- [PROGRAMMATIC_UI_CREATION_GUIDE.md](PROGRAMMATIC_UI_CREATION_GUIDE.md) - How to create Windmill apps via API
- [SESSION_SUMMARY.md](SESSION_SUMMARY.md) - Complete testing session notes

## Next Steps

1. ✅ **Proven:** iframe embedding works with Community Edition
2. ⬜ Test authentication scenarios (production readiness)
3. ⬜ Create additional dashboard templates (feasibility, entitlement, servicing)
4. ⬜ Implement data sync between Connect 2.0 and Windmill
5. ⬜ Add loading states and error handling to WindmillEmbed component
6. ⬜ Evaluate White Label Edition for React SDK integration
7. ⬜ Set up production Windmill instance (not localhost)
8. ⬜ Document standard workflow for creating new embedded dashboards

## Success Metrics

✅ **Working:** Windmill dashboard embedded in React app
✅ **Navigation:** Menu integration complete
✅ **Component:** Reusable WindmillEmbed component
✅ **Documentation:** Complete integration guide

**Status:** Ready for evaluation and production planning!
