import React, { useMemo } from 'react';
import ReactFlow, { Node, Edge, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { Property, StateChange } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface ReactflowStateTimelineProps {
  property: Property;
  maxVisible?: number;
}

export const ReactflowStateTimeline: React.FC<ReactflowStateTimelineProps> = ({
  property,
  maxVisible = 10
}) => {
  const { nodes, edges, totalChanges } = useMemo(() => {
    const sortedHistory = [...property.stateHistory].sort(
      (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
    );

    const displayHistory = sortedHistory.slice(0, maxVisible);

    const getDimensionColor = (stateType: string): string => {
      const colors: Record<string, string> = {
        'lifecycle': '#8b5cf6',
        'status': '#3b82f6',
        'approval': '#10b981',
        'risk': '#f59e0b'
      };
      return colors[stateType] || '#6b7280';
    };

    const formatStateDimension = (stateType: string) => {
      const names: Record<string, string> = {
        'lifecycle': 'Lifecycle',
        'status': 'Status',
        'approval': 'Approval',
        'risk': 'Risk'
      };
      return names[stateType] || stateType;
    };

    const formatStateValue = (value: string | number, stateType: string) => {
      if (stateType === 'risk') {
        return typeof value === 'number' ? value.toFixed(1) : value;
      }
      if (typeof value === 'string') {
        return value.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      return String(value);
    };

    const nodeHeight = 180; // Increased spacing
    const nodeWidth = 380; // Wider for better readability
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    displayHistory.forEach((change, index) => {
      const dimensionColor = getDimensionColor(change.stateType);
      const timeAgo = formatDistanceToNow(new Date(change.changedAt), { addSuffix: true });

      nodes.push({
        id: `change-${index}`,
        type: 'default',
        data: {
          label: (
            <div style={{ width: '100%' }}>
              {/* Dimension badge */}
              <div style={{
                fontSize: '0.6875rem',
                fontWeight: '600',
                color: dimensionColor,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>
                {formatStateDimension(change.stateType)}
              </div>

              {/* State change */}
              <div style={{
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                <span style={{ color: '#94a3b8' }}>
                  {formatStateValue(change.previousValue, change.stateType)}
                </span>
                <span style={{ color: dimensionColor, fontSize: '1rem' }}>→</span>
                <span style={{ color: '#111827' }}>
                  {formatStateValue(change.newValue, change.stateType)}
                </span>
              </div>

              {/* Metadata */}
              <div style={{
                fontSize: '0.75rem',
                color: '#64748b',
                marginBottom: change.reason ? '0.5rem' : 0
              }}>
                {timeAgo} • {change.changedBy}
              </div>

              {/* Reason */}
              {change.reason && (
                <div style={{
                  fontSize: '0.8125rem',
                  color: '#6b7280',
                  fontStyle: 'italic',
                  marginTop: '0.5rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid #e5e7eb',
                  lineHeight: '1.4'
                }}>
                  "{change.reason}"
                </div>
              )}
            </div>
          )
        },
        position: { x: 50, y: index * nodeHeight },
        style: {
          backgroundColor: 'white',
          border: `2px solid ${dimensionColor}`,
          borderRadius: '8px',
          padding: '16px',
          width: nodeWidth,
          boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top
      });

      // Connect to next node with styled edge
      if (index < displayHistory.length - 1) {
        const nextColor = getDimensionColor(displayHistory[index + 1].stateType);
        edges.push({
          id: `e-${index}`,
          source: `change-${index}`,
          target: `change-${index + 1}`,
          animated: index === 0,
          style: {
            stroke: dimensionColor,
            strokeWidth: 3,
            strokeDasharray: index === 0 ? undefined : '5,5'
          },
          markerEnd: {
            type: 'arrowclosed' as const,
            color: nextColor,
            width: 20,
            height: 20
          }
        });
      }
    });

    return { nodes, edges, totalChanges: sortedHistory.length };
  }, [property.stateHistory, maxVisible]);

  if (property.stateHistory.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#111827',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1rem'
        }}>
          📊 State Timeline
        </h2>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#9ca3af',
          fontSize: '0.875rem'
        }}>
          No state changes yet
        </div>
      </div>
    );
  }

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
          📊 State Timeline
        </h2>
        <div style={{
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          Showing {Math.min(maxVisible, totalChanges)} of {totalChanges} {totalChanges === 1 ? 'change' : 'changes'}
        </div>
      </div>

      {/* Reactflow vertical timeline */}
      <div style={{
        width: '100%',
        height: `${Math.min(nodes.length, maxVisible) * 180 + 100}px`,
        backgroundColor: '#fafafa',
        borderRadius: '6px',
        border: '1px solid #e5e7eb'
      }}>
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
          defaultEdgeOptions={{
            type: 'smoothstep'
          }}
        />
      </div>

      {/* Teaching annotation */}
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
            <strong>Full Audit Trail:</strong> Every state change is logged with causation.
            Color-coded by dimension type: Purple=Lifecycle, Blue=Status, Green=Approval, Yellow=Risk.
          </div>
        </div>
      </div>
    </div>
  );
};
