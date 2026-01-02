import React, { useState } from 'react';
import { Property } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface StateTimelineProps {
  property: Property;
}

export const StateTimeline: React.FC<StateTimelineProps> = ({ property }) => {
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Get state history, most recent first
  const sortedHistory = [...property.stateHistory].sort((a, b) =>
    new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  const recentHistory = sortedHistory.slice(0, 5);
  const displayHistory = showAllHistory ? sortedHistory : recentHistory;

  // Helper to get color for state dimension
  const getDimensionColor = (stateType: string): string => {
    const colors: Record<string, string> = {
      'lifecycle': '#8b5cf6',
      'status': '#3b82f6',
      'approval': '#10b981',
      'risk': '#f59e0b'
    };
    return colors[stateType] || '#6b7280';
  };

  // Helper to format state dimension names
  const formatStateDimension = (stateType: string) => {
    const names: Record<string, string> = {
      'lifecycle': 'Lifecycle Phase',
      'status': 'Status',
      'approval': 'Approval State',
      'risk': 'Risk Level'
    };
    return names[stateType] || stateType;
  };

  // Helper to format state values
  const formatStateValue = (value: string | number, stateType: string) => {
    if (stateType === 'risk') {
      return typeof value === 'number' ? value.toFixed(1) : value;
    }
    if (typeof value === 'string') {
      return value.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    return String(value);
  };

  if (sortedHistory.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#111827',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1rem'
        }}>
          📊 State Timeline
        </h2>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#9ca3af',
          fontSize: '0.875rem'
        }}>
          No state changes yet
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#111827',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          📊 State Timeline
        </h2>
        <div style={{
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          {sortedHistory.length} {sortedHistory.length === 1 ? 'change' : 'changes'}
        </div>
      </div>

      {/* Timeline visualization */}
      <div style={{
        position: 'relative',
        paddingLeft: '2rem'
      }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '0.5rem',
          top: '0.75rem',
          bottom: '0.75rem',
          width: '2px',
          backgroundColor: '#e5e7eb'
        }} />

        {/* State change entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayHistory.map((change) => {
            const dimensionColor = getDimensionColor(change.stateType);
            const timeAgo = formatDistanceToNow(new Date(change.changedAt), { addSuffix: true });

            return (
              <div
                key={change.id}
                style={{
                  position: 'relative',
                  paddingLeft: '1.5rem'
                }}
              >
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: '-1.5rem',
                  top: '0.25rem',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: dimensionColor,
                  border: '2px solid white',
                  boxShadow: '0 0 0 2px #e5e7eb',
                  zIndex: 1
                }} />

                {/* Change card */}
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#fafafa',
                  borderRadius: '6px',
                  border: '1px solid #f1f5f9'
                }}>
                  {/* State change header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.6875rem',
                        fontWeight: '600',
                        color: dimensionColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.25rem'
                      }}>
                        {formatStateDimension(change.stateType)}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#111827',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ color: '#94a3b8' }}>
                          {formatStateValue(change.previousValue, change.stateType)}
                        </span>
                        <span style={{ color: dimensionColor }}>→</span>
                        <span style={{ color: '#111827' }}>
                          {formatStateValue(change.newValue, change.stateType)}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.6875rem',
                      color: '#94a3b8',
                      whiteSpace: 'nowrap',
                      marginLeft: '1rem'
                    }}>
                      {timeAgo}
                    </div>
                  </div>

                  {/* Change metadata */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    color: '#64748b'
                  }}>
                    <div>
                      Changed by: <span style={{ fontWeight: '500', color: '#475569' }}>{change.changedBy}</span>
                    </div>
                    {change.processId && (
                      <div>
                        Via process: <span style={{ fontWeight: '500', color: '#475569' }}>
                          {property.processHistory.find(p => p.id === change.processId)?.type.split('-').map(w =>
                            w.charAt(0).toUpperCase() + w.slice(1)
                          ).join(' ') || change.processId}
                        </span>
                      </div>
                    )}
                    {change.reason && (
                      <div style={{
                        marginTop: '0.25rem',
                        fontStyle: 'italic',
                        color: '#6b7280'
                      }}>
                        "{change.reason}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teaching annotation */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: '#f0f9ff',
        borderRadius: '6px',
        borderLeft: '3px solid #3b82f6'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: '#1e40af',
          lineHeight: '1.5',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem'
        }}>
          <span style={{ flexShrink: 0 }}>💡</span>
          <div>
            <strong>Full Audit Trail:</strong> Every state change is logged with causation.
            See exactly which process triggered which state update, when, and by whom.
            Essential for compliance and debugging.
          </div>
        </div>
      </div>

      {/* Show all button */}
      {sortedHistory.length > 5 && (
        <button
          onClick={() => setShowAllHistory(!showAllHistory)}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#3b82f6',
            backgroundColor: 'white',
            border: '1px solid #3b82f6',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#eff6ff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
        >
          {showAllHistory ? 'Show Less' : `View Full History (${sortedHistory.length} total changes)`}
        </button>
      )}
    </div>
  );
};
