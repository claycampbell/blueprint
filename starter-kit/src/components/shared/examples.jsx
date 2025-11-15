'use client'

/**
 * Shared Components Examples
 *
 * This file demonstrates how to use all the shared components.
 * Use these examples as a reference when implementing features.
 */

import { useState } from 'react'

import {
  DataTable,
  StatusBadge,
  DocumentUpload,
  TimelineActivity,
  useNotification
} from './index'

// Example: DataTable with Projects
export const DataTableExample = () => {
  const columns = [
    {
      id: 'name',
      label: 'Project Name',
      sortable: true,
      filterable: true
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      renderCell: (value) => <StatusBadge status={value} />
    },
    {
      id: 'location',
      label: 'Location',
      sortable: true,
      filterable: true
    },
    {
      id: 'amount',
      label: 'Loan Amount',
      sortable: true,
      align: 'right',
      renderCell: (value) => `$${value?.toLocaleString() || 0}`
    },
    {
      id: 'date',
      label: 'Created Date',
      sortable: true,
      renderCell: (value) => new Date(value).toLocaleDateString()
    }
  ]

  const data = [
    {
      id: 1,
      name: 'Sunset Heights Development',
      status: 'FUNDED',
      location: 'Phoenix, AZ',
      amount: 5000000,
      date: '2025-01-15'
    },
    {
      id: 2,
      name: 'Green Valley Townhomes',
      status: 'FEASIBILITY',
      location: 'Seattle, WA',
      amount: 3200000,
      date: '2025-01-20'
    },
    {
      id: 3,
      name: 'Mountain View Estates',
      status: 'LEAD',
      location: 'Phoenix, AZ',
      amount: 4500000,
      date: '2025-01-22'
    },
    {
      id: 4,
      name: 'Riverside Apartments',
      status: 'GO',
      location: 'Seattle, WA',
      amount: 7800000,
      date: '2025-01-18'
    },
    {
      id: 5,
      name: 'Downtown Mixed-Use',
      status: 'PASS',
      location: 'Phoenix, AZ',
      amount: 2100000,
      date: '2025-01-10'
    }
  ]

  const handleSelectionChange = (selectedIds) => {
    console.log('Selected project IDs:', selectedIds)
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      selectable={true}
      onSelectionChange={handleSelectionChange}
      defaultSortBy="date"
      defaultSortOrder="desc"
      defaultRowsPerPage={10}
    />
  )
}

// Example: All Status Badge Variants
export const StatusBadgeExample = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <h3>Project Statuses</h3>
      <div className="flex flex-wrap gap-2 w-full">
        <StatusBadge status="LEAD" />
        <StatusBadge status="FEASIBILITY" />
        <StatusBadge status="GO" />
        <StatusBadge status="PASS" />
        <StatusBadge status="FUNDED" />
        <StatusBadge status="CLOSED" />
      </div>

      <h3 className="w-full mt-4">Loan Statuses</h3>
      <div className="flex flex-wrap gap-2 w-full">
        <StatusBadge status="PENDING" />
        <StatusBadge status="APPROVED" />
        <StatusBadge status="ACTIVE" />
        <StatusBadge status="PAID_OFF" />
      </div>

      <h3 className="w-full mt-4">Draw Statuses</h3>
      <div className="flex flex-wrap gap-2 w-full">
        <StatusBadge status="REQUESTED" />
        <StatusBadge status="INSPECTION_SCHEDULED" />
        <StatusBadge status="APPROVED_DRAW" />
        <StatusBadge status="FUNDED_DRAW" />
      </div>

      <h3 className="w-full mt-4">Outlined Variant</h3>
      <div className="flex flex-wrap gap-2 w-full">
        <StatusBadge status="FUNDED" variant="outlined" />
        <StatusBadge status="ACTIVE" variant="outlined" />
        <StatusBadge status="APPROVED" variant="outlined" />
      </div>
    </div>
  )
}

// Example: Document Upload
export const DocumentUploadExample = () => {
  const [files, setFiles] = useState([
    {
      id: '1',
      name: 'Feasibility_Report_2025.pdf',
      type: 'application/pdf',
      size: 2457600,
      uploadedAt: '2025-01-15T10:30:00',
      url: '/files/1'
    },
    {
      id: '2',
      name: 'Site_Photos.jpg',
      type: 'image/jpeg',
      size: 1048576,
      uploadedAt: '2025-01-16T14:20:00',
      url: '/files/2'
    }
  ])

  const handleUpload = async (newFiles) => {
    // Simulate API call
    console.log('Uploading files:', newFiles)

    // Simulate uploaded files response
    const uploadedFiles = Array.from(newFiles).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      url: `/files/${Date.now()}-${index}`
    }))

    setFiles(prev => [...prev, ...uploadedFiles])
    
return uploadedFiles
  }

  const handleDelete = async (fileId) => {
    console.log('Deleting file:', fileId)
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleDownload = (fileId) => {
    console.log('Downloading file:', fileId)
  }

  return (
    <DocumentUpload
      onUpload={handleUpload}
      onDelete={handleDelete}
      onDownload={handleDownload}
      existingFiles={files}
      acceptedFileTypes={['application/pdf', 'image/*', 'application/msword']}
      maxFileSize={10 * 1024 * 1024}
      multiple={true}
    />
  )
}

// Example: Timeline Activity
export const TimelineActivityExample = () => {
  const activities = [
    {
      id: '1',
      type: 'created',
      title: 'Project Created',
      description: 'New project "Sunset Heights Development" has been created',
      timestamp: new Date(Date.now() - 86400000 * 5), // 5 days ago
      user: { name: 'John Smith', avatar: '/images/avatars/1.png' },
      details: 'Project details: 50-unit residential development in Phoenix, AZ. Estimated loan amount: $5,000,000',
      metadata: {
        'Project Type': 'Residential',
        'Location': 'Phoenix, AZ',
        'Units': '50'
      }
    },
    {
      id: '2',
      type: 'submitted',
      title: 'Feasibility Report Submitted',
      description: 'Feasibility analysis completed and submitted for review',
      timestamp: new Date(Date.now() - 86400000 * 3), // 3 days ago
      user: { name: 'Sarah Johnson', avatar: '/images/avatars/2.png' },
      details: 'Complete feasibility analysis including market study, site assessment, and financial projections'
    },
    {
      id: '3',
      type: 'approved',
      title: 'Feasibility Approved',
      description: 'Project approved to proceed to entitlement phase',
      timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
      user: { name: 'Michael Chen', avatar: '/images/avatars/3.png' }
    },
    {
      id: '4',
      type: 'upload',
      title: 'Documents Uploaded',
      description: 'Entitlement documents and site plans uploaded',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      user: { name: 'Sarah Johnson', avatar: '/images/avatars/2.png' },
      metadata: {
        'Documents': '8',
        'Total Size': '15.2 MB'
      }
    },
    {
      id: '5',
      type: 'comment',
      title: 'Comment Added',
      description: 'Review comments added by loan committee',
      timestamp: new Date(Date.now() - 3600000 * 4), // 4 hours ago
      user: { name: 'Emily Davis', avatar: '/images/avatars/4.png' },
      details: 'Requested additional market comparables and updated proforma with current construction costs'
    },
    {
      id: '6',
      type: 'meeting',
      title: 'Site Inspection Scheduled',
      description: 'On-site inspection scheduled for next week',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      user: { name: 'John Smith', avatar: '/images/avatars/1.png' },
      metadata: {
        'Date': 'Jan 25, 2025',
        'Time': '10:00 AM',
        'Inspector': 'Mike Torres'
      }
    }
  ]

  return (
    <TimelineActivity
      activities={activities}
      showOppositeContent={true}
      variant="default"
    />
  )
}

// Example: Notification Toast Usage
export const NotificationExample = () => {
  const { success, error, warning, info } = useNotification()

  return (
    <div className="flex flex-col gap-4">
      <h3>Click buttons to show notifications</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => success('Operation completed successfully!')}
        >
          Show Success
        </button>

        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => error('Something went wrong!', { title: 'Error' })}
        >
          Show Error
        </button>

        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          onClick={() => warning('Please review this action', { title: 'Warning' })}
        >
          Show Warning
        </button>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => info('Here is some information', { title: 'Info' })}
        >
          Show Info
        </button>

        <button
          className="px-4 py-2 bg-purple-500 text-white rounded"
          onClick={() => {
            success('Loan approved successfully!', {
              title: 'Loan Approval',
              autoHideDuration: 8000,
              anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
            })
          }}
        >
          Show Custom Notification
        </button>
      </div>
    </div>
  )
}
