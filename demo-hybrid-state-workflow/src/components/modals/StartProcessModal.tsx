import React, { useState } from 'react';
import { ProcessType } from '../../types';

interface StateImpact {
  dimension: 'lifecycle' | 'approval' | 'risk' | 'status';
  description: string;
  expectedChange?: string;
}

interface StartProcessModalProps {
  isOpen: boolean;
  processType: ProcessType;
  processLabel: string;
  description: string;
  estimatedDays: number;
  stateImpacts: StateImpact[];
  prerequisites: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const StartProcessModal: React.FC<StartProcessModalProps> = ({
  isOpen,
  processType,
  processLabel,
  description,
  estimatedDays,
  stateImpacts,
  prerequisites,
  onConfirm,
  onCancel
}) => {
  const [assignee, setAssignee] = useState('current-user');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
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
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Start Process: {processLabel}
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              {description}
            </p>
          </div>

          {/* Prerequisites */}
          {prerequisites.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.75rem'
              }}>
                ✓ Prerequisites
              </h3>
              {prerequisites.map((prereq, idx) => (
                <div key={idx} style={{
                  fontSize: '0.875rem',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span>✓</span>
                  {prereq}
                </div>
              ))}
            </div>
          )}

          {/* Estimated Duration */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              📅 Estimated Duration
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              {estimatedDays} {estimatedDays === 1 ? 'day' : 'days'}
            </p>
          </div>

          {/* State Impact Preview - KEY TEACHING MOMENT */}
          {stateImpacts.length > 0 && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              border: '2px solid #3b82f6'
            }}>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                📊 State Impact When Complete:
              </h3>
              <div style={{
                fontSize: '0.75rem',
                color: '#1e3a8a',
                marginBottom: '0.75rem',
                fontStyle: 'italic'
              }}>
                This process will update the following state dimensions:
              </div>
              {stateImpacts.map((impact, idx) => (
                <div key={idx} style={{
                  marginBottom: '0.75rem',
                  paddingLeft: '0.5rem',
                  borderLeft: '2px solid #93c5fd'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1e40af',
                    marginBottom: '0.25rem',
                    textTransform: 'capitalize'
                  }}>
                    {impact.dimension}
                  </div>
                  <div style={{
                    fontSize: '0.8125rem',
                    color: '#475569',
                    marginBottom: '0.25rem'
                  }}>
                    {impact.description}
                  </div>
                  {impact.expectedChange && (
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#2563eb',
                      fontWeight: '600'
                    }}>
                      {impact.expectedChange}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Assign To */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              👤 Assign To
            </h3>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#111827',
                cursor: 'pointer'
              }}
            >
              <option value="current-user">Current User (Demo)</option>
              <option value="Sarah Chen">Sarah Chen</option>
              <option value="Mike Torres">Mike Torres</option>
              <option value="Jane Doe">Jane Doe</option>
            </select>
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
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
              }}
            >
              Start Process →
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
