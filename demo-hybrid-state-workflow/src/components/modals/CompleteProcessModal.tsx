import React, { useState } from 'react';
import { Process } from '../../types';

interface StateChange {
  dimension: string;
  previousValue: string;
  newValue: string;
}

interface CompleteProcessModalProps {
  isOpen: boolean;
  process: Process;
  stateChanges: StateChange[];
  onConfirm: (notes?: string) => void;
  onCancel: () => void;
}

export const CompleteProcessModal: React.FC<CompleteProcessModalProps> = ({
  isOpen,
  process,
  stateChanges,
  onConfirm,
  onCancel
}) => {
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const formatProcessType = (type: string) => {
    return type.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getDimensionColor = (dimension: string): string => {
    const colors: Record<string, string> = {
      'lifecycle': '#8b5cf6',
      'status': '#3b82f6',
      'approval': '#10b981',
      'risk': '#f59e0b'
    };
    return colors[dimension] || '#6b7280';
  };

  const handleConfirm = () => {
    onConfirm(notes || undefined);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>✓</span>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                Complete Process
              </h2>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              {formatProcessType(process.type)}
            </p>
          </div>

          {/* State Changes Preview - KEY TEACHING MOMENT */}
          {stateChanges.length > 0 && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '2px solid #10b981'
            }}>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#059669',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                📊 State Changes
              </h3>
              <div style={{
                fontSize: '0.75rem',
                color: '#166534',
                marginBottom: '0.75rem',
                fontStyle: 'italic'
              }}>
                The following will be updated when you complete this process:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stateChanges.map((change, idx) => {
                  const dimensionColor = getDimensionColor(change.dimension);

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        border: `1px solid ${dimensionColor}30`
                      }}
                    >
                      <div style={{
                        fontSize: '0.6875rem',
                        fontWeight: '600',
                        color: dimensionColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.375rem'
                      }}>
                        {change.dimension}
                      </div>
                      <div style={{
                        fontSize: '0.9375rem',
                        fontWeight: '600',
                        color: '#111827',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ color: '#94a3b8' }}>{change.previousValue}</span>
                        <span style={{ color: dimensionColor }}>→</span>
                        <span style={{ color: '#059669' }}>{change.newValue}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completion Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              📝 Completion Notes <span style={{ fontWeight: '400', color: '#9ca3af' }}>(optional)</span>
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about the completed process..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '0.625rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#111827',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              style={{
                flex: 1,
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'white',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '6px',
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
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};
