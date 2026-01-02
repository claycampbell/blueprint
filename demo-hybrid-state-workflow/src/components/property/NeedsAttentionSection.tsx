import React from 'react';
import { Property, Process } from '../../types';

interface NeedsAttentionSectionProps {
  property: Property;
}

export const NeedsAttentionSection: React.FC<NeedsAttentionSectionProps> = ({ property }) => {
  // Find processes that need attention
  const urgentProcesses = property.activeProcesses.filter(process => {
    // Blocked processes
    if (process.status === 'blocked') return true;

    // Due soon (within 3 days)
    if (process.dueDate) {
      const daysUntilDue = Math.ceil((process.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 3 && daysUntilDue >= 0) return true;
    }

    return false;
  });

  // Check for high risk level
  const hasHighRisk = property.riskLevel >= 7;
  const hasIssues = urgentProcesses.length > 0 || hasHighRisk;

  if (!hasIssues) {
    // Show positive "All Clear" state
    return (
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderLeft: '4px solid #22c55e',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            fontSize: '1.5rem'
          }}>
            ✓
          </div>
          <div>
            <h2 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#166534',
              marginBottom: '0.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              ✓ All Clear
            </h2>
            <p style={{
              fontSize: '0.75rem',
              color: '#15803d',
              margin: 0
            }}>
              No issues requiring attention • Property is on track
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatDueDate = (process: Process): string => {
    if (process.status === 'blocked') {
      return 'Blocked';
    }

    if (process.dueDate) {
      const daysUntilDue = Math.ceil((process.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue < 0) return 'Overdue';
      if (daysUntilDue === 0) return 'Due today';
      if (daysUntilDue === 1) return 'Due tomorrow';
      return `Due in ${daysUntilDue} days`;
    }

    return 'No due date';
  };

  const issueCount = urgentProcesses.length + (hasHighRisk ? 1 : 0);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderLeft: '4px solid #dc2626',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      <h2 style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        ⚠️ Needs Attention ({issueCount})
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* High risk alert */}
        {hasHighRisk && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              padding: '1rem',
              borderRadius: '6px',
              border: '1px solid #fecaca'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                  color: '#dc2626'
                }}>
                  🚨 Risk Level High
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#991b1b',
                  marginBottom: '0.5rem'
                }}>
                  Current risk score: {property.riskLevel.toFixed(1)} / 10.0
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#7f1d1d'
                }}>
                  High risk requires immediate attention and additional review
                </div>
              </div>
              <button style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#dc2626',
                backgroundColor: 'white',
                border: '1px solid #dc2626',
                borderRadius: '6px',
                cursor: 'pointer',
                marginLeft: '1rem'
              }}>
                View Risk Analysis
              </button>
            </div>
          </div>
        )}

        {/* Urgent processes */}
        {urgentProcesses.map(process => (
          <div
            key={process.id}
            style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                  color: '#111827'
                }}>
                  {process.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  {process.status === 'blocked' && (
                    <span style={{
                      marginLeft: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#dc2626'
                    }}>
                      [BLOCKED]
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Assigned to: <span style={{ fontWeight: '500' }}>{process.assignedTo || 'Unassigned'}</span>
                </div>

                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: process.status === 'blocked' ? '#dc2626' : '#f59e0b'
                }}>
                  {formatDueDate(process)}
                </div>

                {process.notes && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginTop: '0.5rem',
                    fontStyle: 'italic'
                  }}>
                    {process.notes}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                <button style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#3b82f6',
                  backgroundColor: 'white',
                  border: '1px solid #3b82f6',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  {process.status === 'blocked' ? 'Unblock' : 'Mark Complete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
