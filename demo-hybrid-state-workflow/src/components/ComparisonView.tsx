import React, { useRef, useEffect } from 'react';
import { Property } from '../types';

export type ViewMode = 'workflow' | 'state-machine' | 'side-by-side';

interface ComparisonViewProps {
  viewMode: ViewMode;
  property: Property;
  workflowView: React.ReactNode;
  stateMachineView: React.ReactNode;
}

/**
 * ComparisonView component provides a flexible layout for displaying
 * workflow and state machine UIs side-by-side or individually
 */
export const ComparisonView: React.FC<ComparisonViewProps> = ({
  viewMode,
  workflowView,
  stateMachineView
}) => {
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Optional: Synchronized scrolling in side-by-side mode
  useEffect(() => {
    if (viewMode !== 'side-by-side' || !leftPanelRef.current || !rightPanelRef.current) {
      return;
    }

    let isSyncing = false;

    const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
      if (isSyncing) return;
      isSyncing = true;

      const sourceScrollRatio = source.scrollTop / (source.scrollHeight - source.clientHeight || 1);
      const targetScrollTop = sourceScrollRatio * (target.scrollHeight - target.clientHeight);

      target.scrollTop = targetScrollTop;
      setTimeout(() => { isSyncing = false; }, 100);
    };

    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;

    const handleLeftScroll = () => syncScroll(leftPanel, rightPanel);
    const handleRightScroll = () => syncScroll(rightPanel, leftPanel);

    leftPanel.addEventListener('scroll', handleLeftScroll);
    rightPanel.addEventListener('scroll', handleRightScroll);

    return () => {
      leftPanel.removeEventListener('scroll', handleLeftScroll);
      rightPanel.removeEventListener('scroll', handleRightScroll);
    };
  }, [viewMode]);

  // Determine which panels to show
  const showLeft = viewMode === 'workflow' || viewMode === 'side-by-side';
  const showRight = viewMode === 'state-machine' || viewMode === 'side-by-side';
  const isSideBySide = viewMode === 'side-by-side';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isSideBySide
          ? 'minmax(0, 1fr) 2px minmax(0, 1fr)'
          : '1fr',
        gap: 0,
        minHeight: '600px',
        position: 'relative'
      }}
      className="comparison-view"
    >
      {/* Left Panel - Workflow View */}
      {showLeft && (
        <div
          ref={leftPanelRef}
          className="comparison-panel"
          style={{
            overflow: 'auto',
            padding: '1rem',
            backgroundColor: 'var(--color-background)',
            position: 'relative'
          }}
        >
          {/* Label */}
          {isSideBySide && (
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                borderBottom: '2px solid var(--color-primary)',
                borderRadius: '8px 8px 0 0'
              }}
            >
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--color-primary)'
              }}>
                Workflow Model (Traditional)
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-gray-500)',
                marginTop: '0.25rem'
              }}>
                Stage-based progression with linear workflow
              </div>
            </div>
          )}

          {/* Content */}
          <div>{workflowView}</div>
        </div>
      )}

      {/* Divider */}
      {isSideBySide && (
        <div
          style={{
            background: 'linear-gradient(to bottom, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
            width: '2px',
            position: 'relative'
          }}
        >
          {/* Center indicator */}
          <div
            style={{
              position: 'sticky',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            ⇄
          </div>
        </div>
      )}

      {/* Right Panel - State Machine View */}
      {showRight && (
        <div
          ref={rightPanelRef}
          className="comparison-panel"
          style={{
            overflow: 'auto',
            padding: '1rem',
            backgroundColor: 'var(--color-background)',
            position: 'relative'
          }}
        >
          {/* Label */}
          {isSideBySide && (
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                borderBottom: '2px solid var(--color-success)',
                borderRadius: '8px 8px 0 0'
              }}
            >
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--color-success)'
              }}>
                State Machine Model (Hybrid)
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-gray-500)',
                marginTop: '0.25rem'
              }}>
                Multi-dimensional state with concurrent processes
              </div>
            </div>
          )}

          {/* Content */}
          <div>{stateMachineView}</div>
        </div>
      )}
    </div>
  );
};
