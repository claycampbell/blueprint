import React, { useState } from 'react';
import { Process } from '../../types';
import { CompleteProcessModal } from '../modals/CompleteProcessModal';

interface InteractiveProcessCardProps {
  process: Process;
  onComplete: () => void;
}

export const InteractiveProcessCard: React.FC<InteractiveProcessCardProps> = ({ process, onComplete }) => {
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': '#f59e0b',
      'in-progress': '#8b5cf6',
      'completed': '#10b981',
      'blocked': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusBgColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': '#fffbeb',
      'in-progress': '#f5f3ff',
      'completed': '#ecfdf5',
      'blocked': '#fef2f2'
    };
    return colors[status] || '#f9fafb';
  };

  const formatProcessType = (type: string) => {
    return type.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Calculate progress and time tracking
  const calculateProgress = (): { percentage: number; daysRemaining: number; status: 'on-track' | 'at-risk' | 'overdue' } => {
    if (!process.startedAt || !process.dueDate) {
      return { percentage: 0, daysRemaining: 0, status: 'on-track' };
    }

    const now = new Date();
    const totalDuration = process.dueDate.getTime() - process.startedAt.getTime();
    const elapsed = now.getTime() - process.startedAt.getTime();
    const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    const daysRemaining = Math.ceil((process.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'on-track' | 'at-risk' | 'overdue' = 'on-track';
    if (daysRemaining < 0) status = 'overdue';
    else if (daysRemaining <= 3) status = 'at-risk';

    return { percentage, daysRemaining, status };
  };

  const progress = calculateProgress();
  const canComplete = process.status === 'in-progress';

  return (
    <div style={{
      border: `2px solid ${getStatusColor(process.status)}20`,
      backgroundColor: getStatusBgColor(process.status),
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '0.75rem',
      transition: 'all 0.2s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.75rem'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '0.9375rem',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '0.375rem'
          }}>
            {formatProcessType(process.type)}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(process.status)
            }} />
            <span style={{
              fontSize: '0.75rem',
              color: '#64748b',
              fontWeight: '500'
            }}>
              {process.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </span>
          </div>
        </div>

        {canComplete && (
          <button
            onClick={() => setShowCompleteModal(true)}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
            }}
          >
            ✓ Complete Process
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {canComplete && process.startedAt && process.dueDate && (
        <div style={{
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: '600',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Progress
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: progress.status === 'overdue' ? '#ef4444' : progress.status === 'at-risk' ? '#f59e0b' : '#10b981'
            }}>
              {progress.status === 'overdue'
                ? `${Math.abs(progress.daysRemaining)} days overdue`
                : progress.status === 'at-risk'
                ? `${progress.daysRemaining} days left (At risk)`
                : `${progress.daysRemaining} days left (On track)`
              }
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress.percentage}%`,
              height: '100%',
              backgroundColor: progress.status === 'overdue' ? '#ef4444' : progress.status === 'at-risk' ? '#f59e0b' : '#8b5cf6',
              transition: 'width 0.3s ease'
            }} />
          </div>

          <div style={{
            fontSize: '0.6875rem',
            color: '#94a3b8',
            marginTop: '0.25rem',
            textAlign: 'right'
          }}>
            {Math.round(progress.percentage)}%
          </div>
        </div>
      )}

      {/* Process details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(0,0,0,0.05)'
      }}>
        {process.startedAt && (
          <div>
            <div style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.25rem' }}>
              Started
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#0f172a', fontWeight: '500' }}>
              {new Date(process.startedAt).toLocaleDateString()}
            </div>
          </div>
        )}
        {process.dueDate && (
          <div>
            <div style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.25rem' }}>
              Due Date
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#0f172a', fontWeight: '500' }}>
              {new Date(process.dueDate).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      {/* What will happen when completed */}
      {canComplete && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.75rem',
          backgroundColor: 'rgba(139, 92, 246, 0.08)',
          borderRadius: '6px',
          borderLeft: '3px solid #8b5cf6'
        }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: '600',
            color: '#8b5cf6',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.375rem'
          }}>
            State Changes on Completion:
          </div>
          <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: '1.5' }}>
            • Risk level will update based on findings<br />
            • Process status → Completed<br />
            • Property state may auto-advance if all processes done
          </div>
        </div>
      )}

      {/* Complete Process Modal */}
      <CompleteProcessModal
        isOpen={showCompleteModal}
        process={process}
        stateChanges={[
          {
            dimension: 'Risk Level',
            previousValue: '6.5',
            newValue: '5.0'
          },
          {
            dimension: 'Process Status',
            previousValue: 'In Progress',
            newValue: 'Completed'
          }
        ]}
        onConfirm={(notes) => {
          onComplete();
          setShowCompleteModal(false);
        }}
        onCancel={() => setShowCompleteModal(false)}
      />
    </div>
  );
};
