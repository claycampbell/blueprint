'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

/**
 * StatusBadge Component
 *
 * A reusable status badge component for displaying workflow states
 * with color-coded chips.
 *
 * @param {String} status - The status value to display
 * @param {String} variant - MUI Chip variant ('filled', 'outlined')
 * @param {String} size - MUI Chip size ('small', 'medium')
 * @param {Object} customStatusConfig - Custom status configuration to override defaults
 * @param {String} className - Additional CSS classes
 */

// Default status configurations with colors and labels
const DEFAULT_STATUS_CONFIG = {
  // Project Statuses
  LEAD: { color: 'info', label: 'Lead' },
  FEASIBILITY: { color: 'warning', label: 'Feasibility' },
  GO: { color: 'success', label: 'Go' },
  PASS: { color: 'error', label: 'Pass' },
  FUNDED: { color: 'success', label: 'Funded' },
  CLOSED: { color: 'default', label: 'Closed' },

  // Loan Statuses
  PENDING: { color: 'warning', label: 'Pending' },
  APPROVED: { color: 'success', label: 'Approved' },
  ACTIVE: { color: 'success', label: 'Active' },
  PAID_OFF: { color: 'default', label: 'Paid Off' },
  DEFAULTED: { color: 'error', label: 'Defaulted' },

  // Entitlement Statuses
  NOT_STARTED: { color: 'default', label: 'Not Started' },
  IN_PROGRESS: { color: 'info', label: 'In Progress' },
  SUBMITTED: { color: 'warning', label: 'Submitted' },
  APPROVED_ENTITLED: { color: 'success', label: 'Approved' },
  REJECTED: { color: 'error', label: 'Rejected' },

  // Draw Statuses
  REQUESTED: { color: 'info', label: 'Requested' },
  INSPECTION_SCHEDULED: { color: 'warning', label: 'Inspection Scheduled' },
  INSPECTION_COMPLETE: { color: 'warning', label: 'Inspection Complete' },
  APPROVED_DRAW: { color: 'success', label: 'Approved' },
  FUNDED_DRAW: { color: 'success', label: 'Funded' },
  REJECTED_DRAW: { color: 'error', label: 'Rejected' },

  // Document Statuses
  DRAFT: { color: 'default', label: 'Draft' },
  PENDING_REVIEW: { color: 'warning', label: 'Pending Review' },
  REVIEWED: { color: 'info', label: 'Reviewed' },
  APPROVED_DOC: { color: 'success', label: 'Approved' },
  REJECTED_DOC: { color: 'error', label: 'Rejected' },

  // Task Statuses
  TODO: { color: 'default', label: 'To Do' },
  IN_PROGRESS_TASK: { color: 'info', label: 'In Progress' },
  COMPLETED: { color: 'success', label: 'Completed' },
  BLOCKED: { color: 'error', label: 'Blocked' },

  // Generic Statuses
  NEW: { color: 'info', label: 'New' },
  OPEN: { color: 'warning', label: 'Open' },
  CLOSED_GENERIC: { color: 'default', label: 'Closed' },
  CANCELLED: { color: 'error', label: 'Cancelled' },
  ON_HOLD: { color: 'warning', label: 'On Hold' },

  // Payment Statuses
  UNPAID: { color: 'error', label: 'Unpaid' },
  PARTIALLY_PAID: { color: 'warning', label: 'Partially Paid' },
  PAID: { color: 'success', label: 'Paid' },
  REFUNDED: { color: 'info', label: 'Refunded' },

  // Boolean-like Statuses
  YES: { color: 'success', label: 'Yes' },
  NO: { color: 'error', label: 'No' },
  TRUE: { color: 'success', label: 'True' },
  FALSE: { color: 'error', label: 'False' },
  ENABLED: { color: 'success', label: 'Enabled' },
  DISABLED: { color: 'default', label: 'Disabled' }
}

const StatusBadge = ({
  status,
  variant = 'filled',
  size = 'small',
  customStatusConfig = {},
  className,
  ...props
}) => {
  // Merge custom config with defaults
  const statusConfig = useMemo(() => ({
    ...DEFAULT_STATUS_CONFIG,
    ...customStatusConfig
  }), [customStatusConfig])

  // Get status configuration
  const getStatusConfig = () => {
    if (!status) {
      return { color: 'default', label: 'N/A' }
    }

    // Normalize status to uppercase and replace spaces/dashes with underscores
    const normalizedStatus = String(status).toUpperCase().replace(/[\s-]/g, '_')

    // Check if we have a configuration for this status
    if (statusConfig[normalizedStatus]) {
      return statusConfig[normalizedStatus]
    }

    // If no configuration found, return a default
    return {
      color: 'default',
      label: status
    }
  }

  const config = getStatusConfig()

  return (
    <Chip
      label={config.label}
      color={config.color}
      variant={variant}
      size={size}
      className={classnames(className)}
      {...props}
    />
  )
}

export default StatusBadge
