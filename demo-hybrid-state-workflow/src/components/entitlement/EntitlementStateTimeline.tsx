import { EntitlementStatus } from '../../types';

interface EntitlementStateTimelineProps {
  currentStatus: EntitlementStatus;
  onStatusClick?: (status: EntitlementStatus) => void;
}

/**
 * Visual timeline showing the 12-state entitlement workflow
 * Highlights current state, shows completed and upcoming states
 */
export function EntitlementStateTimeline({ currentStatus, onStatusClick }: EntitlementStateTimelineProps) {
  const states = getStateFlow();
  const currentIndex = states.findIndex(s => s.status === currentStatus);

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '4px'
        }}>
          Entitlement Workflow Progress
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          Track your application through the 12-state permitting process
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '19px',
          top: '10px',
          bottom: '10px',
          width: '2px',
          backgroundColor: '#e5e7eb'
        }} />

        {/* State nodes */}
        {states.map((state, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <StateNode
              key={state.status}
              state={state}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isUpcoming={isUpcoming}
              isLast={index === states.length - 1}
              onClick={onStatusClick ? () => onStatusClick(state.status) : undefined}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '20px',
        fontSize: '0.75rem',
        color: '#6b7280'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#10b981'
          }} />
          <span>Completed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            boxShadow: '0 0 0 3px #dbeafe'
          }} />
          <span>Current</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            border: '2px solid #d1d5db'
          }} />
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
}

interface StateNodeProps {
  state: StateDefinition;
  isCompleted: boolean;
  isCurrent: boolean;
  isUpcoming: boolean;
  isLast: boolean;
  onClick?: () => void;
}

function StateNode({ state, isCompleted, isCurrent, isUpcoming, isLast, onClick }: StateNodeProps) {
  // Determine node styling
  const nodeColor = isCompleted ? '#10b981' : isCurrent ? '#3b82f6' : '#f3f4f6';
  const nodeBorder = isCompleted ? 'none' : isCurrent ? '3px solid #dbeafe' : '2px solid #d1d5db';
  const textColor = isCompleted || isCurrent ? '#111827' : '#9ca3af';
  const iconOpacity = isCompleted || isCurrent ? '1' : '0.5';

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        marginBottom: isLast ? '0' : '24px',
        cursor: onClick ? 'pointer' : 'default',
        opacity: isUpcoming ? '0.7' : '1'
      }}
    >
      {/* Node circle */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: nodeColor,
        border: nodeBorder,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        opacity: iconOpacity,
        flexShrink: 0,
        boxShadow: isCurrent ? '0 0 0 3px #dbeafe' : 'none'
      }}>
        {isCompleted ? '✓' : state.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingTop: '4px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px'
        }}>
          <h4 style={{
            fontSize: '0.9375rem',
            fontWeight: isCurrent ? '600' : '500',
            color: textColor,
            margin: 0
          }}>
            {state.label}
          </h4>
          {isCurrent && (
            <span style={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.65rem',
              fontWeight: '600'
            }}>
              CURRENT
            </span>
          )}
        </div>

        <p style={{
          fontSize: '0.8125rem',
          lineHeight: '1.4',
          color: isCompleted || isCurrent ? '#6b7280' : '#9ca3af',
          margin: 0
        }}>
          {state.description}
        </p>

        {/* Typical duration */}
        {state.typicalDuration && (
          <div style={{
            marginTop: '6px',
            fontSize: '0.75rem',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>⏱️</span>
            <span>Typical duration: {state.typicalDuration}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface StateDefinition {
  status: EntitlementStatus;
  label: string;
  icon: string;
  description: string;
  typicalDuration?: string;
}

function getStateFlow(): StateDefinition[] {
  return [
    {
      status: 'planning',
      label: 'Planning',
      icon: '📝',
      description: 'Assembling permit package and coordinating consultants',
      typicalDuration: '2-4 weeks'
    },
    {
      status: 'pre-submittal-qa',
      label: 'Pre-Submittal QA',
      icon: '🔍',
      description: 'Internal quality review before submission',
      typicalDuration: '3-5 days'
    },
    {
      status: 'submitted',
      label: 'Submitted',
      icon: '📮',
      description: 'Application submitted, waiting for review to begin',
      typicalDuration: '1-2 weeks'
    },
    {
      status: 'under-review',
      label: 'Under Review',
      icon: '⏳',
      description: 'Jurisdiction actively reviewing plans',
      typicalDuration: '4-12 weeks'
    },
    {
      status: 'corrections-received',
      label: 'Corrections Received',
      icon: '📄',
      description: 'Correction letter received, needs triage',
      typicalDuration: '1-2 days'
    },
    {
      status: 'corrections-assigned',
      label: 'Corrections Assigned',
      icon: '👥',
      description: 'Corrections assigned to consultants',
      typicalDuration: '1 day'
    },
    {
      status: 'addressing-corrections',
      label: 'Addressing Corrections',
      icon: '🔨',
      description: 'Consultants working on corrections',
      typicalDuration: '1-3 weeks'
    },
    {
      status: 'corrections-qa',
      label: 'Corrections QA',
      icon: '✓',
      description: 'Internal review of consultant responses',
      typicalDuration: '2-3 days'
    },
    {
      status: 'resubmitted',
      label: 'Resubmitted',
      icon: '↻',
      description: 'Revised package submitted back to jurisdiction',
      typicalDuration: '2-6 weeks'
    },
    {
      status: 'approved',
      label: 'Approved',
      icon: '✅',
      description: 'Permit approved, ready for construction',
      typicalDuration: 'N/A'
    },
    {
      status: 'rejected',
      label: 'Rejected',
      icon: '❌',
      description: 'Application rejected, requires major redesign',
      typicalDuration: 'N/A'
    },
    {
      status: 'on-hold',
      label: 'On Hold',
      icon: '⏸️',
      description: 'Application paused by jurisdiction or applicant',
      typicalDuration: 'Variable'
    }
  ];
}
