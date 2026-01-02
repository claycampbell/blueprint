import React from 'react';
import { Property, LifecycleState } from '../../types';
import { PHASE_COLORS } from '../../styles/theme';

interface SankeyLifecyclePathProps {
  property: Property;
}

export const SankeyLifecyclePath: React.FC<SankeyLifecyclePathProps> = ({ property }) => {
  const lifecycleTransitions = property.stateHistory
    .filter(change => change.stateType === 'lifecycle')
    .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime());

  if (lifecycleTransitions.length === 0) {
    // No history - just show current
    const phaseColor = PHASE_COLORS[property.lifecycle];
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#fafafa',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          fontSize: '0.6875rem',
          fontWeight: '600',
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem'
        }}>
          Lifecycle
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.875rem',
          backgroundColor: `${phaseColor.dot}15`,
          border: `2px solid ${phaseColor.dot}`,
          borderRadius: '6px'
        }}>
          <span style={{ fontSize: '1rem' }}>{phaseColor.icon}</span>
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{phaseColor.label}</span>
          <span style={{
            fontSize: '0.625rem',
            fontWeight: '600',
            color: 'white',
            backgroundColor: phaseColor.dot,
            padding: '0.125rem 0.5rem',
            borderRadius: '3px'
          }}>NOW</span>
        </div>
      </div>
    );
  }

  // Build the path
  const phaseOrder: LifecycleState[] = ['intake', 'feasibility', 'entitlement', 'construction', 'servicing'];
  const states: LifecycleState[] = [
    lifecycleTransitions[0].previousValue as LifecycleState,
    ...lifecycleTransitions.map(t => t.newValue as LifecycleState)
  ];

  // Detect if there's a backward transition
  let hasBranching = false;
  let branchIndex = -1;

  lifecycleTransitions.forEach((transition, index) => {
    const prevIdx = phaseOrder.indexOf(transition.previousValue as LifecycleState);
    const newIdx = phaseOrder.indexOf(transition.newValue as LifecycleState);
    if (newIdx < prevIdx && branchIndex === -1) {
      hasBranching = true;
      branchIndex = index;
    }
  });

  if (!hasBranching) {
    // Simple linear path - single row
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#fafafa',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          fontSize: '0.6875rem',
          fontWeight: '600',
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem'
        }}>
          Lifecycle Journey
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {states.map((state, idx) => {
            const phaseColor = PHASE_COLORS[state];
            const isLast = idx === states.length - 1;
            return (
              <React.Fragment key={idx}>
                <div style={{
                  padding: '0.5rem 0.875rem',
                  backgroundColor: isLast ? `${phaseColor.dot}15` : 'white',
                  border: isLast ? `2px solid ${phaseColor.dot}` : '1px solid #e5e7eb',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1rem' }}>{phaseColor.icon}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: '600' }}>{phaseColor.label}</span>
                  {isLast && <span style={{
                    fontSize: '0.625rem',
                    fontWeight: '600',
                    color: 'white',
                    backgroundColor: phaseColor.dot,
                    padding: '0.125rem 0.5rem',
                    borderRadius: '3px'
                  }}>NOW</span>}
                </div>
                {idx < states.length - 1 && <span style={{ fontSize: '1.125rem', color: '#cbd5e1' }}>→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // Branching visualization - multi-row like git network graph
  const mainPath = [states[0]];
  for (let i = 1; i <= branchIndex; i++) {
    mainPath.push(states[i]);
  }

  const branchPath = states.slice(branchIndex + 1);

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{
        fontSize: '0.6875rem',
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.75rem'
      }}>
        Lifecycle Journey (Branched Path)
      </div>

      {/* Multi-row git-style network */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Main/abandoned path */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {mainPath.map((state, idx) => {
            const phaseColor = PHASE_COLORS[state];
            return (
              <React.Fragment key={idx}>
                <div style={{
                  padding: '0.5rem 0.875rem',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: 0.5
                }}>
                  <span style={{ fontSize: '1rem' }}>{phaseColor.icon}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#94a3b8' }}>{phaseColor.label}</span>
                </div>
                {idx < mainPath.length - 1 && <span style={{ fontSize: '1.125rem', color: '#d1d5db' }}>→</span>}
              </React.Fragment>
            );
          })}
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', marginLeft: '0.5rem' }}>(abandoned)</span>
        </div>

        {/* Branch connector line */}
        <div style={{
          paddingLeft: `${(mainPath.length - 1) * 7}rem`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.25rem', color: '#ef4444' }}>↓</span>
          <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '600' }}>Branched here</span>
        </div>

        {/* Current branch path */}
        <div style={{
          paddingLeft: `${(mainPath.length - 1) * 7}rem`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem'
        }}>
          {branchPath.map((state, idx) => {
            const phaseColor = PHASE_COLORS[state];
            const isLast = idx === branchPath.length - 1;
            return (
              <React.Fragment key={idx}>
                <div style={{
                  padding: '0.5rem 0.875rem',
                  backgroundColor: isLast ? `${phaseColor.dot}15` : '#fef2f2',
                  border: isLast ? `2px solid ${phaseColor.dot}` : '2px solid #fca5a5',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1rem' }}>{phaseColor.icon}</span>
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: '600',
                    color: isLast ? '#0f172a' : '#7f1d1d'
                  }}>{phaseColor.label}</span>
                  {isLast && <span style={{
                    fontSize: '0.625rem',
                    fontWeight: '600',
                    color: 'white',
                    backgroundColor: phaseColor.dot,
                    padding: '0.125rem 0.5rem',
                    borderRadius: '3px'
                  }}>NOW</span>}
                </div>
                {idx < branchPath.length - 1 && <span style={{ fontSize: '1.125rem', color: '#ef4444', fontWeight: '700' }}>→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <div style={{
        marginTop: '0.75rem',
        padding: '0.625rem 0.875rem',
        backgroundColor: '#fef2f2',
        borderRadius: '6px',
        borderLeft: '3px solid #ef4444',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ fontSize: '1rem' }}>💡</span>
        <div style={{
          fontSize: '0.75rem',
          color: '#991b1b',
          fontWeight: '500'
        }}>
          <strong>Git-style branching:</strong> Original path preserved (grayed). New branch created when property returned to previous state.
        </div>
      </div>
    </div>
  );
};
