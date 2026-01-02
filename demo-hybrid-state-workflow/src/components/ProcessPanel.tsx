import React from 'react';
import { Process, ProcessDefinition } from '../types';
import { getProcessDefinition } from '../data/processDefinitions';

interface ProcessPanelProps {
  process: Process;
  onComplete?: (processId: string) => void;
}

export const ProcessPanel: React.FC<ProcessPanelProps> = ({ process, onComplete }) => {
  const definition: ProcessDefinition = getProcessDefinition(process.type);

  const getStatusColor = () => {
    switch (process.status) {
      case 'completed':
        return { bg: '#d1fae5', text: '#065f46', border: '#10b981' };
      case 'in-progress':
        return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
      case 'pending':
        return { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' };
      case 'failed':
        return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' };
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    }
  };

  const statusColor = getStatusColor();

  return (
    <div className="card" style={{
      borderLeft: `4px solid ${statusColor.border}`,
      position: 'relative'
    }}>
      {/* Status Badge */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        padding: '0.25rem 0.75rem',
        backgroundColor: statusColor.bg,
        color: statusColor.text,
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase'
      }}>
        {process.status}
      </div>

      {/* Process Header */}
      <div style={{ marginBottom: '1rem', paddingRight: '6rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          {definition.name}
        </h3>
        <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
          {definition.description}
        </p>
      </div>

      {/* Process Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-gray-200)'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>
            Estimated Duration
          </div>
          <div style={{ fontWeight: '500' }}>
            {definition.estimatedDurationDays} days
          </div>
        </div>

        {process.assignedTo && (
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>
              Assigned To
            </div>
            <div style={{ fontWeight: '500' }}>
              {process.assignedTo}
            </div>
          </div>
        )}

        {process.startedAt && (
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>
              Started
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              {new Date(process.startedAt).toLocaleDateString()}
            </div>
          </div>
        )}

        {process.dueDate && (
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>
              Due Date
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              {new Date(process.dueDate).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      {/* Process Outputs */}
      {process.outputs.length > 0 && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--color-gray-200)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
            Outputs
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {process.outputs.map((output, idx) => (
              <div key={idx} style={{
                padding: '0.5rem',
                backgroundColor: 'var(--color-gray-50)',
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}>
                <span style={{ fontWeight: '500' }}>{output.key}:</span>{' '}
                {typeof output.value === 'object' ? JSON.stringify(output.value) : output.value.toString()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      {process.status === 'in-progress' && onComplete && (
        <div style={{ marginTop: '1rem' }}>
          <button
            className="button button-primary"
            onClick={() => onComplete(process.id)}
            style={{ width: '100%' }}
          >
            Mark as Complete
          </button>
        </div>
      )}
    </div>
  );
};
