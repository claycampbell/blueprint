import React, { useMemo } from 'react';
import ReactFlow, { Node, Edge, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { Property, LifecycleState } from '../../types';
import { PHASE_COLORS } from '../../styles/theme';

interface ReactflowLifecyclePathProps {
  property: Property;
}

export const ReactflowLifecyclePath: React.FC<ReactflowLifecyclePathProps> = ({ property }) => {
  const { nodes, edges } = useMemo(() => {
    const lifecycleTransitions = property.stateHistory
      .filter(change => change.stateType === 'lifecycle')
      .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime());

    // Determine next likely state based on current lifecycle
    const getNextState = (currentLifecycle: LifecycleState): LifecycleState | null => {
      const progressionMap: Record<LifecycleState, LifecycleState | null> = {
        'intake': 'feasibility',
        'feasibility': 'entitlement',
        'entitlement': 'construction',
        'construction': 'servicing',
        'servicing': null // End state
      };
      return progressionMap[currentLifecycle];
    };

    const nextState = getNextState(property.lifecycle);

    if (lifecycleTransitions.length === 0) {
      // Current state + potential next state
      const phaseColor = PHASE_COLORS[property.lifecycle];
      const nodes: Node[] = [{
        id: '0',
        type: 'default',
        data: {
          label: (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{phaseColor.icon}</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{phaseColor.label}</div>
              <div style={{
                fontSize: '0.625rem',
                fontWeight: '600',
                color: 'white',
                backgroundColor: phaseColor.dot,
                padding: '0.125rem 0.5rem',
                borderRadius: '3px'
              }}>NOW</div>
            </div>
          )
        },
        position: { x: 0, y: 0 },
        style: {
          backgroundColor: `${phaseColor.dot}10`,
          border: `2px solid ${phaseColor.dot}`,
          borderRadius: '6px',
          padding: '8px 12px',
          width: 120,
          fontSize: '12px'
        }
      }];

      // Add potential next state
      if (nextState) {
        const nextPhaseColor = PHASE_COLORS[nextState];
        nodes.push({
          id: '1',
          type: 'default',
          data: {
            label: (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', marginBottom: '0.25rem', opacity: 0.5 }}>{nextPhaseColor.icon}</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.25rem' }}>{nextPhaseColor.label}</div>
                <div style={{
                  fontSize: '0.625rem',
                  fontWeight: '500',
                  color: '#94a3b8',
                  backgroundColor: '#f8fafc',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '3px',
                  border: '1px solid #e2e8f0'
                }}>NEXT</div>
              </div>
            )
          },
          position: { x: 150, y: 0 },
          style: {
            backgroundColor: '#fafafa',
            border: '1px dashed #cbd5e1',
            borderRadius: '6px',
            padding: '8px 12px',
            width: 120,
            fontSize: '12px'
          }
        });

        const edges: Edge[] = [{
          id: 'e0-1',
          source: '0',
          target: '1',
          animated: true,
          style: { stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5,5' }
        }];

        return { nodes, edges };
      }

      return { nodes, edges: [] };
    }

    // Build path with branching detection
    const phaseOrder: LifecycleState[] = ['intake', 'feasibility', 'entitlement', 'construction', 'servicing'];
    const states: LifecycleState[] = [
      lifecycleTransitions[0].previousValue as LifecycleState,
      ...lifecycleTransitions.map(t => t.newValue as LifecycleState)
    ];

    // Detect branching
    let branchIndex = -1;
    lifecycleTransitions.forEach((transition, index) => {
      const prevIdx = phaseOrder.indexOf(transition.previousValue as LifecycleState);
      const newIdx = phaseOrder.indexOf(transition.newValue as LifecycleState);
      if (newIdx < prevIdx && branchIndex === -1) {
        branchIndex = index + 1; // +1 because states array includes initial state
      }
    });

    const nodeSpacing = 150; // Reduced for tighter fit
    const rowHeight = 90;
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (branchIndex === -1) {
      // Linear path
      states.forEach((state, index) => {
        const phaseColor = PHASE_COLORS[state];
        const isLast = index === states.length - 1;

        nodes.push({
          id: `${index}`,
          type: 'default',
          data: {
            label: (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{phaseColor.icon}</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: '600', marginBottom: isLast ? '0.25rem' : 0 }}>{phaseColor.label}</div>
                {isLast && <div style={{
                  fontSize: '0.625rem',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: phaseColor.dot,
                  padding: '0.125rem 0.5rem',
                  borderRadius: '3px'
                }}>NOW</div>}
              </div>
            )
          },
          position: { x: index * nodeSpacing, y: 0 },
          style: {
            backgroundColor: isLast ? `${phaseColor.dot}10` : 'white',
            border: isLast ? `2px solid ${phaseColor.dot}` : '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '8px 12px',
            width: 120,
            fontSize: '12px'
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left
        });

        if (index < states.length - 1) {
          edges.push({
            id: `e${index}-${index + 1}`,
            source: `${index}`,
            target: `${index + 1}`,
            animated: index === states.length - 2,
            style: { stroke: index === states.length - 2 ? phaseColor.dot : '#cbd5e1', strokeWidth: 2 }
          });
        }
      });

      // Add potential next state
      if (nextState) {
        const nextPhaseColor = PHASE_COLORS[nextState];
        const lastIndex = states.length;
        nodes.push({
          id: `${lastIndex}`,
          type: 'default',
          data: {
            label: (
              <div style={{ textAlign: 'center', opacity: 0.6 }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{nextPhaseColor.icon}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8' }}>{nextPhaseColor.label}</div>
                <div style={{
                  fontSize: '0.625rem',
                  fontWeight: '500',
                  color: '#94a3b8',
                  backgroundColor: '#f1f5f9',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '3px',
                  marginTop: '0.25rem'
                }}>NEXT</div>
              </div>
            )
          },
          position: { x: lastIndex * nodeSpacing, y: 0 },
          style: {
            backgroundColor: 'white',
            border: '1px dashed #d1d5db',
            borderRadius: '8px',
            padding: '12px',
            width: 140
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left
        });

        edges.push({
          id: `e${lastIndex - 1}-${lastIndex}`,
          source: `${lastIndex - 1}`,
          target: `${lastIndex}`,
          animated: true,
          style: { stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5,5' }
        });
      }
    } else {
      // Branching path
      const mainPath = states.slice(0, branchIndex + 1);
      const branchPath = states.slice(branchIndex);

      // Main abandoned path (Row 1)
      mainPath.forEach((state, index) => {
        const phaseColor = PHASE_COLORS[state];
        nodes.push({
          id: `main-${index}`,
          type: 'default',
          data: {
            label: (
              <div style={{ textAlign: 'center', opacity: 0.5 }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{phaseColor.icon}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8' }}>{phaseColor.label}</div>
              </div>
            )
          },
          position: { x: index * nodeSpacing, y: 0 },
          style: {
            backgroundColor: '#f9fafb',
            border: '1px dashed #d1d5db',
            borderRadius: '8px',
            padding: '12px',
            width: 140,
            opacity: 0.6
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left
        });

        if (index < mainPath.length - 1) {
          edges.push({
            id: `e-main-${index}`,
            source: `main-${index}`,
            target: `main-${index + 1}`,
            style: { stroke: '#d1d5db', strokeWidth: 2, strokeDasharray: '5,5' }
          });
        }
      });

      // Branch path (Row 2)
      branchPath.forEach((state, index) => {
        const phaseColor = PHASE_COLORS[state];
        const isLast = index === branchPath.length - 1;
        const isFirst = index === 0;

        nodes.push({
          id: `branch-${index}`,
          type: 'default',
          data: {
            label: (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{phaseColor.icon}</div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: isLast ? '#0f172a' : '#7f1d1d'
                }}>{phaseColor.label}</div>
                {isFirst && <div style={{
                  fontSize: '0.625rem',
                  fontWeight: '600',
                  color: '#dc2626',
                  backgroundColor: '#fee2e2',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '3px',
                  marginTop: '0.25rem',
                  border: '1px solid #fca5a5'
                }}>↩ RETURN</div>}
                {isLast && <div style={{
                  fontSize: '0.625rem',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: phaseColor.dot,
                  padding: '0.125rem 0.5rem',
                  borderRadius: '3px',
                  marginTop: '0.25rem'
                }}>NOW</div>}
              </div>
            )
          },
          position: { x: (branchIndex + index) * nodeSpacing, y: rowHeight },
          style: {
            backgroundColor: isLast ? `${phaseColor.dot}15` : '#fef2f2',
            border: isLast ? `2px solid ${phaseColor.dot}` : '2px solid #ef4444',
            borderRadius: '8px',
            padding: '12px',
            width: 140
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left
        });

        if (index === 0) {
          // Branch connector from main path
          edges.push({
            id: `e-branch-start`,
            source: `main-${branchIndex}`,
            target: `branch-0`,
            animated: true,
            style: { stroke: '#ef4444', strokeWidth: 2 },
            label: '↓ Branch',
            labelStyle: { fill: '#ef4444', fontWeight: 600, fontSize: 11 }
          });
        }

        if (index < branchPath.length - 1) {
          edges.push({
            id: `e-branch-${index}`,
            source: `branch-${index}`,
            target: `branch-${index + 1}`,
            animated: isLast,
            style: { stroke: isLast ? phaseColor.dot : '#ef4444', strokeWidth: 2 }
          });
        }
      });
    }

    return { nodes, edges };
  }, [property.stateHistory, property.lifecycle]);

  // Detect if there's branching for alert
  const hasBranching = useMemo(() => {
    const lifecycleTransitions = property.stateHistory
      .filter(change => change.stateType === 'lifecycle');

    const phaseOrder: LifecycleState[] = ['intake', 'feasibility', 'entitlement', 'construction', 'servicing'];
    return lifecycleTransitions.some(transition => {
      const prevIdx = phaseOrder.indexOf(transition.previousValue as LifecycleState);
      const newIdx = phaseOrder.indexOf(transition.newValue as LifecycleState);
      return newIdx < prevIdx;
    });
  }, [property.stateHistory]);

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#111827',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '1rem'
      }}>
        🌳 Lifecycle Journey {hasBranching && '(Branched Path)'}
      </div>

      {/* Reactflow visualization */}
      <div style={{ width: '100%', height: hasBranching ? '280px' : '180px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          panOnDrag={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
        />
      </div>

      {/* Teaching annotation for branching */}
      {hasBranching && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
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
            <strong>Git-style branching:</strong> Original path preserved (grayed/dashed). New branch created when property returned to previous state.
          </div>
        </div>
      )}
    </div>
  );
};
