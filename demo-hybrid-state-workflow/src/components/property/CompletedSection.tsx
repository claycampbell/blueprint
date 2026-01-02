import React, { useState } from 'react';
import { Property } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface CompletedSectionProps {
  property: Property;
}

export const CompletedSection: React.FC<CompletedSectionProps> = ({ property }) => {
  const [showAll, setShowAll] = useState(false);

  const completedProcesses = property.processHistory.filter(p => p.status === 'completed');

  if (completedProcesses.length === 0) {
    return null;
  }

  const recentCompletedProcesses = completedProcesses.slice(-3).reverse(); // Last 3, most recent first
  const displayProcesses = showAll ? completedProcesses.reverse() : recentCompletedProcesses;

  // Helper to get state changes caused by a process
  const getStateChangesForProcess = (processId: string) => {
    return property.stateHistory.filter(change => change.processId === processId);
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
          ✓ Recently Completed
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {displayProcesses.map(process => {
          const completedTimeAgo = process.completedAt
            ? formatDistanceToNow(process.completedAt, { addSuffix: true })
            : 'Unknown';

          const stateChanges = getStateChangesForProcess(process.id);

          return (
            <div
              key={process.id}
              style={{
                padding: '1rem',
                border: '1px solid #d1fae5',
                borderRadius: '6px',
                backgroundColor: '#f0fdf4'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem'
                  }}>
                    <span style={{ fontSize: '1rem' }}>✓</span>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {process.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '500' }}>
                    Completed {completedTimeAgo}
                  </div>

                  {process.assignedTo && (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      By: {process.assignedTo}
                    </div>
                  )}

                  {/* State Changes - KEY TEACHING MOMENT */}
                  {stateChanges.length > 0 && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      border: '1px solid #d1fae5'
                    }}>
                      <div style={{
                        fontSize: '0.6875rem',
                        fontWeight: '600',
                        color: '#059669',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.5rem'
                      }}>
                        State Changes:
                      </div>
                      {stateChanges.map(change => (
                        <div key={change.id} style={{
                          fontSize: '0.75rem',
                          color: '#475569',
                          marginBottom: '0.375rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem'
                        }}>
                          <span style={{ color: '#64748b' }}>•</span>
                          <strong>{formatStateDimension(change.stateType)}:</strong>
                          <span style={{ color: '#94a3b8' }}>{formatStateValue(change.previousValue, change.stateType)}</span>
                          <span style={{ color: '#059669' }}>→</span>
                          <span style={{ color: '#047857', fontWeight: '600' }}>{formatStateValue(change.newValue, change.stateType)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Outputs */}
                  {process.outputs && process.outputs.length > 0 && (
                    <div style={{
                      marginTop: '0.75rem',
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      <div style={{
                        fontSize: '0.6875rem',
                        fontWeight: '600',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.375rem'
                      }}>
                        Outputs:
                      </div>
                      {process.outputs.map(output => (
                        <div key={output.key} style={{ marginBottom: '0.25rem' }}>
                          📄 {output.key}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Teaching annotation */}
      {displayProcesses.some(p => getStateChangesForProcess(p.id).length > 0) && (
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
              <strong>Process-Driven State Changes:</strong> Processes update state dimensions when completed.
              This creates a clear audit trail of WHY state changed, not just that it did.
              Each state change is linked to the process that caused it.
            </div>
          </div>
        </div>
      )}

      {completedProcesses.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
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
            width: '100%'
          }}
        >
          {showAll ? 'Show Less' : `View Full History (${completedProcesses.length} total)`}
        </button>
      )}
    </div>
  );
};
