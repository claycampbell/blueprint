# Connect 2.0 Shared Components Library

This directory contains reusable React components for the Connect 2.0 platform, built with Material-UI (MUI) and Next.js.

## Components

### 1. DataTable

A comprehensive data table component with sorting, filtering, pagination, and row selection.

**Features:**
- Column sorting (click headers)
- Column filtering (search inputs)
- Pagination controls
- Row selection with checkboxes
- Custom cell renderers
- Fully responsive

**Usage:**
```jsx
import { DataTable } from '@/components/shared'

const columns = [
  { id: 'name', label: 'Name', sortable: true, filterable: true },
  { id: 'status', label: 'Status', sortable: true, renderCell: (value) => <StatusBadge status={value} /> },
  { id: 'date', label: 'Date', sortable: true, filterable: false }
]

const data = [
  { id: 1, name: 'Project Alpha', status: 'ACTIVE', date: '2025-01-15' },
  { id: 2, name: 'Project Beta', status: 'PENDING', date: '2025-01-20' }
]

<DataTable
  columns={columns}
  data={data}
  selectable={true}
  onSelectionChange={(selectedIds) => console.log(selectedIds)}
  defaultSortBy="name"
  defaultRowsPerPage={10}
/>
```

### 2. StatusBadge

Color-coded status badges for workflow states across the platform.

**Features:**
- Pre-configured colors for all workflow statuses (Project, Loan, Entitlement, Draw, etc.)
- Customizable status configurations
- Built on MUI Chip component
- Support for outlined and filled variants

**Usage:**
```jsx
import { StatusBadge } from '@/components/shared'

// Basic usage
<StatusBadge status="FUNDED" />
<StatusBadge status="IN_PROGRESS" variant="outlined" />

// Custom status configuration
<StatusBadge
  status="CUSTOM_STATUS"
  customStatusConfig={{
    CUSTOM_STATUS: { color: 'primary', label: 'Custom' }
  }}
/>
```

**Supported Statuses:**
- **Project:** LEAD, FEASIBILITY, GO, PASS, FUNDED, CLOSED
- **Loan:** PENDING, APPROVED, ACTIVE, PAID_OFF, DEFAULTED
- **Entitlement:** NOT_STARTED, IN_PROGRESS, SUBMITTED, APPROVED_ENTITLED, REJECTED
- **Draw:** REQUESTED, INSPECTION_SCHEDULED, INSPECTION_COMPLETE, APPROVED_DRAW, FUNDED_DRAW, REJECTED_DRAW
- **Document:** DRAFT, PENDING_REVIEW, REVIEWED, APPROVED_DOC, REJECTED_DOC
- **Task:** TODO, IN_PROGRESS_TASK, COMPLETED, BLOCKED
- **Generic:** NEW, OPEN, CLOSED_GENERIC, CANCELLED, ON_HOLD
- **Payment:** UNPAID, PARTIALLY_PAID, PAID, REFUNDED

### 3. DocumentUpload

Drag-and-drop document upload component with file management.

**Features:**
- Drag-and-drop file upload
- File type and size validation
- Upload progress indicator
- File list with preview
- Download and delete actions
- Support for multiple file types

**Usage:**
```jsx
import { DocumentUpload } from '@/components/shared'

const handleUpload = async (files) => {
  // Upload files to your backend
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })

  const uploadedFiles = await response.json()
  return uploadedFiles // Return array of uploaded file objects
}

const handleDelete = async (fileId) => {
  await fetch(`/api/files/${fileId}`, { method: 'DELETE' })
}

<DocumentUpload
  onUpload={handleUpload}
  onDelete={handleDelete}
  onDownload={(fileId) => window.open(`/api/files/${fileId}/download`)}
  existingFiles={[
    { id: '1', name: 'document.pdf', type: 'application/pdf', size: 1024000, url: '/files/1' }
  ]}
  acceptedFileTypes={['application/pdf', 'image/*']}
  maxFileSize={10 * 1024 * 1024} // 10MB
  multiple={true}
/>
```

### 4. TimelineActivity

Activity feed/timeline component for displaying chronological events.

**Features:**
- Chronological event display
- Expandable event details
- User avatars and metadata
- Customizable event icons and colors
- Relative timestamps (e.g., "2 hours ago")
- Support for alternate and right-aligned layouts

**Usage:**
```jsx
import { TimelineActivity } from '@/components/shared'

const activities = [
  {
    id: '1',
    type: 'created',
    title: 'Project Created',
    description: 'New project "Sunset Heights" has been created',
    timestamp: new Date('2025-01-15T10:30:00'),
    user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
    details: 'Additional details about the project creation...',
    metadata: { location: 'Phoenix', type: 'Residential' }
  },
  {
    id: '2',
    type: 'approved',
    title: 'Feasibility Approved',
    description: 'Feasibility study approved by Jane Smith',
    timestamp: new Date('2025-01-16T14:20:00'),
    user: { name: 'Jane Smith', avatar: '/avatars/jane.jpg' }
  }
]

<TimelineActivity
  activities={activities}
  showOppositeContent={true}
  variant="default"
/>
```

**Event Types:**
- created, updated, deleted
- comment, upload, download
- approved, rejected, submitted
- assigned, completed
- reminder, email, call, meeting

### 5. NotificationToast

Toast notification system with context provider for app-wide notifications.

**Features:**
- Success, error, warning, info variants
- Auto-dismiss with configurable timeout
- Stack multiple notifications
- Positioned notifications (top/bottom, left/right/center)
- Context-based API for easy usage

**Setup:**
```jsx
// In your root layout or _app.js
import { NotificationProvider } from '@/components/shared'

export default function RootLayout({ children }) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  )
}
```

**Usage:**
```jsx
import { useNotification } from '@/components/shared'

function MyComponent() {
  const { success, error, warning, info } = useNotification()

  const handleSuccess = () => {
    success('Operation completed successfully!')
  }

  const handleError = () => {
    error('Something went wrong', {
      title: 'Error',
      autoHideDuration: 8000,
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
    })
  }

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  )
}
```

**Standalone Usage:**
```jsx
import NotificationToast from '@/components/shared/NotificationToast'

const [open, setOpen] = useState(false)

<NotificationToast
  open={open}
  onClose={() => setOpen(false)}
  message="This is a notification"
  severity="success"
  title="Success"
  autoHideDuration={6000}
/>
```

## Import Pattern

All components can be imported from the central index file:

```jsx
import {
  DataTable,
  StatusBadge,
  DocumentUpload,
  TimelineActivity,
  NotificationToast,
  NotificationProvider,
  useNotification
} from '@/components/shared'
```

Or individually:

```jsx
import DataTable from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
```

## Component Guidelines

1. **All components are client-side** - They use the `'use client'` directive for Next.js App Router compatibility
2. **Material-UI based** - All components use MUI components and styling
3. **Responsive** - Components are designed to work on all screen sizes
4. **Customizable** - Accept className props and other customization options
5. **TypeScript-ready** - While written in JavaScript, they follow patterns compatible with TypeScript

## Styling

Components use:
- **MUI theming** - Automatically adapt to your theme configuration
- **Tailwind CSS** - For utility classes (className props)
- **Classnames** - For conditional styling

## Next Steps

These components are ready to use in your Connect 2.0 application modules:
- Lead Intake module
- Feasibility module
- Entitlement module
- Lending module
- Servicing module

For examples and demos, create a showcase page at `/app/components/page.jsx`.
