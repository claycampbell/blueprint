import { EntitlementStatus } from '../../types';

interface EntitlementStatusBadgeProps {
  status: EntitlementStatus;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Visual indicator for entitlement subprocess status
 * Shows current state in the 12-state entitlement workflow
 */
export function EntitlementStatusBadge({ status, size = 'medium' }: EntitlementStatusBadgeProps) {
  const config = getStatusConfig(status);

  const sizeStyles = {
    small: {
      padding: '2px 6px',
      fontSize: '0.65rem',
      fontWeight: '500' as const
    },
    medium: {
      padding: '4px 10px',
      fontSize: '0.75rem',
      fontWeight: '500' as const
    },
    large: {
      padding: '6px 14px',
      fontSize: '0.875rem',
      fontWeight: '600' as const
    }
  };

  const currentSize = sizeStyles[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: config.bgColor,
        color: config.textColor,
        borderRadius: '4px',
        ...currentSize,
        whiteSpace: 'nowrap'
      }}
      title={config.description}
    >
      <span style={{ fontSize: size === 'small' ? '10px' : size === 'medium' ? '12px' : '14px' }}>
        {config.icon}
      </span>
      <span>{config.label}</span>
    </span>
  );
}

interface StatusConfig {
  label: string;
  icon: string;
  bgColor: string;
  textColor: string;
  description: string;
}

function getStatusConfig(status: EntitlementStatus): StatusConfig {
  const configs: Record<EntitlementStatus, StatusConfig> = {
    'planning': {
      label: 'Planning',
      icon: '📝',
      bgColor: '#e0f2fe',
      textColor: '#075985',
      description: 'Assembling permit package and coordinating consultants'
    },
    'pre-submittal-qa': {
      label: 'Pre-QA',
      icon: '🔍',
      bgColor: '#e0e7ff',
      textColor: '#4338ca',
      description: 'Internal quality review before submission'
    },
    'submitted': {
      label: 'Submitted',
      icon: '📮',
      bgColor: '#dbeafe',
      textColor: '#1e40af',
      description: 'Application submitted, waiting for review to begin'
    },
    'under-review': {
      label: 'Under Review',
      icon: '⏳',
      bgColor: '#fef3c7',
      textColor: '#92400e',
      description: 'Jurisdiction actively reviewing plans'
    },
    'corrections-received': {
      label: 'Corrections Received',
      icon: '📄',
      bgColor: '#fed7aa',
      textColor: '#9a3412',
      description: 'Correction letter received, needs triage'
    },
    'corrections-assigned': {
      label: 'Assigned',
      icon: '👥',
      bgColor: '#fecaca',
      textColor: '#991b1b',
      description: 'Corrections assigned to consultants'
    },
    'addressing-corrections': {
      label: 'In Progress',
      icon: '🔨',
      bgColor: '#fde68a',
      textColor: '#78350f',
      description: 'Consultants working on corrections'
    },
    'corrections-qa': {
      label: 'Corrections QA',
      icon: '✓',
      bgColor: '#d1fae5',
      textColor: '#065f46',
      description: 'Internal review of consultant responses'
    },
    'resubmitted': {
      label: 'Resubmitted',
      icon: '↻',
      bgColor: '#bfdbfe',
      textColor: '#1e3a8a',
      description: 'Revised package submitted back to jurisdiction'
    },
    'approved': {
      label: 'Approved',
      icon: '✅',
      bgColor: '#bbf7d0',
      textColor: '#14532d',
      description: 'Permit approved, ready for construction'
    },
    'rejected': {
      label: 'Rejected',
      icon: '❌',
      bgColor: '#fecaca',
      textColor: '#7f1d1d',
      description: 'Application rejected, requires major redesign'
    },
    'on-hold': {
      label: 'On Hold',
      icon: '⏸️',
      bgColor: '#e5e7eb',
      textColor: '#374151',
      description: 'Application paused by jurisdiction or applicant'
    }
  };

  return configs[status];
}
