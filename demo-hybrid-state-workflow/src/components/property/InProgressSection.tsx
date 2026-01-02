import React from 'react';
import { Property } from '../../types';
import { InteractiveProcessCard } from './InteractiveProcessCard';

interface InProgressSectionProps {
  property: Property;
  onCompleteProcess?: (processId: string) => void;
}

export const InProgressSection: React.FC<InProgressSectionProps> = ({ property, onCompleteProcess }) => {
  const inProgressProcesses = property.activeProcesses.filter(p =>
    p.status === 'in-progress' || p.status === 'pending'
  );

  if (inProgressProcesses.length === 0) {
    return null;
  }

  const hasConcurrentProcesses = inProgressProcesses.length > 1;

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
          ⏳ In Progress ({inProgressProcesses.length})
        </h2>
      </div>

      {/* Teaching annotation for concurrent processes */}
      {hasConcurrentProcesses && (
        <div style={{
          marginBottom: '1rem',
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
              <strong>State Machine Model:</strong> Multiple processes can run concurrently.
              Each operates independently on the property. No need to ask "where does the property live?"
              - it exists with multiple active processes simultaneously.
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {inProgressProcesses.map(process => (
          <InteractiveProcessCard
            key={process.id}
            process={process}
            onComplete={() => onCompleteProcess?.(process.id)}
          />
        ))}
      </div>
    </div>
  );
};
