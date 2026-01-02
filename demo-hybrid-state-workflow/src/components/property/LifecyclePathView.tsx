import React from 'react';
import { Property, LifecycleState } from '../../types';
import { PHASE_COLORS } from '../../styles/theme';

interface LifecyclePathViewProps {
  property: Property;
}

export const LifecyclePathView: React.FC<LifecyclePathViewProps> = ({ property }) => {
  // Get lifecycle transitions from state history
  const lifecycleTransitions = property.stateHistory
    .filter(change => change.stateType === 'lifecycle')
    .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime());

  if (lifecycleTransitions.length === 0) {
    return null;
  }

  // Build the path including current state
  const path: Array<{ state: LifecycleState; timestamp: Date; reason?: string; isBackward?: boolean }> = [];

  // Add initial state
  if (lifecycleTransitions.length > 0) {
    path.push({
      state: lifecycleTransitions[0].previousValue as LifecycleState,
      timestamp: new Date(lifecycleTransitions[0].changedAt),
      reason: 'Starting point'
    });
  }

  // Add each transition
  lifecycleTransitions.forEach((transition) => {
    const newState = transition.newValue as LifecycleState;
    const previousState = transition.previousValue as LifecycleState;

    // Detect backward transitions
    const phaseOrder: LifecycleState[] = ['intake', 'feasibility', 'entitlement', 'construction', 'servicing'];
    const prevIndex = phaseOrder.indexOf(previousState);
    const newIndex = phaseOrder.indexOf(newState);
    const isBackward = newIndex < prevIndex;

    path.push({
      state: newState,
      timestamp: new Date(transition.changedAt),
      reason: transition.reason,
      isBackward
    });
  });

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
          🌳 Lifecycle Path (Git-Style Branch View)
        </h2>
        <div style={{
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          {path.length} {path.length === 1 ? 'state' : 'states'}
        </div>
      </div>

      {/* Path visualization - like git log */}
      <div style={{
        position: 'relative',
        paddingLeft: '2.5rem'
      }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '1rem',
          top: '1rem',
          bottom: '1rem',
          width: '2px',
          background: 'linear-gradient(to bottom, #e5e7eb 0%, #e5e7eb 100%)'
        }} />

        {/* Path nodes */}
        {path.map((node, index) => {
          const phaseColor = PHASE_COLORS[node.state];
          const isLast = index === path.length - 1;

          return (
            <div
              key={index}
              style={{
                position: 'relative',
                marginBottom: index < path.length - 1 ? '1.5rem' : 0
              }}
            >
              {/* Node dot */}
              <div style={{
                position: 'absolute',
                left: '-1.5rem',
                top: '0.5rem',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: phaseColor.dot,
                border: '3px solid white',
                boxShadow: `0 0 0 2px ${phaseColor.dot}`,
                zIndex: 2
              }} />

              {/* Enhanced backward transition indicator */}
              {node.isBackward && (
                <>
                  {/* Large backward arrow */}
                  <div style={{
                    position: 'absolute',
                    left: '-2.75rem',
                    top: '-0.5rem',
                    fontSize: '1.5rem',
                    color: '#ef4444',
                    zIndex: 3,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    ↩️
                  </div>
                  {/* Red connecting line overlay */}
                  <div style={{
                    position: 'absolute',
                    left: '-0.9rem',
                    top: '-1.5rem',
                    width: '2px',
                    height: '2rem',
                    background: 'repeating-linear-gradient(to bottom, #ef4444 0px, #ef4444 4px, transparent 4px, transparent 8px)',
                    zIndex: 2
                  }} />
                </>
              )}

              {/* Node content */}
              <div style={{
                padding: '1rem',
                backgroundColor: node.isBackward ? '#fef2f2' : isLast ? `${phaseColor.dot}15` : '#fafafa',
                border: node.isBackward ? '2px solid #ef4444' : isLast ? `2px solid ${phaseColor.dot}` : '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: isLast || node.isBackward ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>
                    {phaseColor.icon}
                  </span>
                  <div style={{
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    color: '#0f172a'
                  }}>
                    {phaseColor.label}
                  </div>
                  {isLast && (
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: phaseColor.dot,
                      padding: '0.25rem 0.625rem',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Current
                    </span>
                  )}
                  {node.isBackward && (
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: '700',
                      color: '#dc2626',
                      backgroundColor: '#fee2e2',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: '1px solid #fca5a5'
                    }}>
                      ↩️ Backward
                    </span>
                  )}
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  fontWeight: '500',
                  marginBottom: node.reason ? '0.5rem' : 0
                }}>
                  {node.timestamp.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </div>

                {node.reason && (
                  <div style={{
                    fontSize: '0.8125rem',
                    color: node.isBackward ? '#7f1d1d' : '#475569',
                    fontStyle: 'italic',
                    paddingLeft: '0.75rem',
                    borderLeft: `3px solid ${node.isBackward ? '#dc2626' : '#d1d5db'}`,
                    backgroundColor: node.isBackward ? 'white' : 'transparent',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    fontWeight: node.isBackward ? '500' : '400'
                  }}>
                    {node.reason}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Teaching annotation for non-linear paths */}
      {path.some(node => node.isBackward) && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#fef2f2',
          borderRadius: '6px',
          borderLeft: '3px solid #ef4444'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#991b1b',
            lineHeight: '1.5',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <span style={{ flexShrink: 0 }}>💡</span>
            <div>
              <strong>State Machine Advantage:</strong> This property returned to a previous lifecycle state.
              In a workflow model, "going backwards" is awkward. In the state machine model,
              it's just another state transition with a clear reason. No special handling needed!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
