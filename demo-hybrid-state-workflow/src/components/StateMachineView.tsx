import React from 'react';
import { Property } from '../types';
import { PropertyHeader } from './PropertyHeader';
import { ProcessPanel } from './ProcessPanel';

interface StateMachineViewProps {
  property: Property;
  onCompleteProcess?: (processId: string) => void;
}

/**
 * StateMachineView - Hybrid state machine UI
 *
 * This represents the "new way" of thinking about property management:
 * - Multi-dimensional state (lifecycle, status, approval, risk)
 * - Concurrent processes that can run in parallel
 * - State transitions tracked independently
 * - Processes as operations on state, not stages
 */
export const StateMachineView: React.FC<StateMachineViewProps> = ({
  property,
  onCompleteProcess
}) => {
  return (
    <div className="state-machine-view">
      {/* Property Header */}
      <PropertyHeader property={property} />

      {/* State Dimensions Grid */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          Current State Dimensions
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem'
        }}>
          {/* Lifecycle State */}
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--color-gray-50)',
            borderRadius: '8px',
            border: '2px solid var(--color-primary)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-gray-500)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              Lifecycle State
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-primary)' }}>
              {property.lifecycle.charAt(0).toUpperCase() + property.lifecycle.slice(1)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>
              Where in the overall lifecycle
            </div>
          </div>

          {/* Status State */}
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--color-gray-50)',
            borderRadius: '8px',
            border: '2px solid var(--color-warning)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-gray-500)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              Status State
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-warning)' }}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>
              Is work actively progressing?
            </div>
          </div>

          {/* Approval State */}
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--color-gray-50)',
            borderRadius: '8px',
            border: '2px solid var(--color-info)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-gray-500)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              Approval State
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-info)' }}>
              {property.approvalState.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>
              Approval status for decisions
            </div>
          </div>

          {/* Risk Level */}
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--color-gray-50)',
            borderRadius: '8px',
            border: `2px solid ${property.riskLevel >= 7 ? '#ef4444' : property.riskLevel >= 5 ? '#f59e0b' : '#10b981'}`
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-gray-500)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              Risk Level
            </div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: property.riskLevel >= 7 ? '#ef4444' : property.riskLevel >= 5 ? '#f59e0b' : '#10b981'
            }}>
              {property.riskLevel.toFixed(1)} / 10
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>
              Overall risk assessment
            </div>
          </div>
        </div>
      </div>

      {/* Concurrent Processes */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          Concurrent Processes
        </h2>

        <div className="card" style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: '#f0f9ff' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-info)', fontWeight: '500' }}>
            Key Difference: These processes can run in parallel, independent of lifecycle stage.
            Each process operates on the property state and may trigger state transitions.
          </div>
        </div>

        {property.activeProcesses.length === 0 ? (
          <div className="card" style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--color-gray-500)'
          }}>
            <p style={{ fontSize: '1.125rem' }}>No active processes</p>
            <p style={{ marginTop: '0.5rem' }}>Processes can be started independently.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '1.5rem'
          }}>
            {property.activeProcesses.map(process => (
              <ProcessPanel
                key={process.id}
                process={process}
                onComplete={onCompleteProcess}
              />
            ))}
          </div>
        )}
      </div>

      {/* State Change History */}
      {property.stateHistory.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            State Change History
          </h2>

          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {property.stateHistory.slice(-5).reverse().map((change, idx) => (
                <div
                  key={change.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    paddingBottom: idx < 4 ? '1rem' : 0,
                    borderBottom: idx < 4 ? '1px solid var(--color-gray-200)' : 'none'
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    marginTop: '0.5rem',
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {change.stateType}: {String(change.previousValue)} → {String(change.newValue)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
                      {new Date(change.changedAt).toLocaleString()} • Changed by {change.changedBy}
                    </div>
                    {change.reason && (
                      <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-gray-700)',
                        fontStyle: 'italic'
                      }}>
                        {change.reason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
