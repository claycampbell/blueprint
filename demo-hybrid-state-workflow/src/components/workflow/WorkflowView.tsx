import React, { useState, useEffect } from 'react';
import { Property, LifecycleState, WorkflowStageView } from '../../types';
import StageDisplay from './StageDisplay';
import Checklist from './Checklist';
import StageNavigation from './StageNavigation';
import {
  buildWorkflowStageView,
  detectBackwardsTransition,
  getBackwardsTransitionError,
  getWorkflowWorkaroundSuggestion
} from './workflowUtils';

interface WorkflowViewProps {
  property: Property;
}

/**
 * Traditional workflow-centric UI component
 *
 * Demonstrates the rigid, stage-based approach where:
 * - Everything is organized around the "current stage"
 * - Users must complete a stage before advancing
 * - Backwards movement is awkward/restricted
 * - Concurrent processes are difficult to represent
 */
const WorkflowView: React.FC<WorkflowViewProps> = ({ property }) => {
  const [stageView, setStageView] = useState<WorkflowStageView>(
    buildWorkflowStageView(property)
  );
  const [error, setError] = useState<string | null>(null);
  const [workaround, setWorkaround] = useState<string | null>(null);
  const [previousLifecycle, setPreviousLifecycle] = useState<LifecycleState>(property.lifecycle);

  // Detect backwards transitions when property lifecycle changes
  useEffect(() => {
    const currentLifecycle = property.lifecycle;

    // Check if this is a backwards transition
    if (detectBackwardsTransition(previousLifecycle, currentLifecycle)) {
      // Show error for backwards transition
      const errorMsg = getBackwardsTransitionError(previousLifecycle, currentLifecycle);
      setError(errorMsg);

      // Show workaround suggestions
      const workaroundMsg = getWorkflowWorkaroundSuggestion(previousLifecycle, currentLifecycle);
      setWorkaround(workaroundMsg);

      console.error(`Workflow error: Backwards transition detected from ${previousLifecycle} to ${currentLifecycle}`);
    } else if (currentLifecycle !== previousLifecycle) {
      // Normal forward transition - clear errors
      setError(null);
      setWorkaround(null);
    }

    // Update stage view when property changes
    setStageView(buildWorkflowStageView(property));
    setPreviousLifecycle(currentLifecycle);
  }, [property, previousLifecycle]);

  const handleAdvance = () => {
    if (!stageView.canAdvance) {
      setError('Cannot advance: Complete all required items first');
      return;
    }
    setError(null);
    setWorkaround(null);
    // In a real app, this would trigger a state transition
    console.log(`Advancing from ${stageView.stage} to ${stageView.nextStage}`);
  };

  const handleGoBack = () => {
    if (!stageView.canGoBack) {
      setError('Cannot go backwards in workflow');
      return;
    }
    setError(null);
    setWorkaround(null);
    console.log(`Going back from ${stageView.stage} to ${stageView.previousStage}`);
  };

  return (
    <div className="workflow-view">
      {/* Header: Property Info + Current Stage */}
      <div className="workflow-header">
        <div className="property-info-workflow">
          <h2>{property.attributes.address}</h2>
          <div className="property-meta-workflow">
            <span className="badge badge-info">{property.type}</span>
            <span className="badge badge-gray">{property.status}</span>
          </div>
        </div>

        <div className="current-stage-banner">
          <div className="stage-label">Current Stage</div>
          <div className="stage-name">{stageView.displayName}</div>
          <div className="stage-description">{stageView.description}</div>
        </div>
      </div>

      {/* Stage Progress Indicator */}
      <StageDisplay
        currentStage={stageView.stage}
        completedStages={getCompletedStages(property)}
      />

      {/* Stage-Specific Content Area */}
      <div className="stage-content-area">
        <h3>{stageView.displayName} Tasks</h3>
        <p className="stage-instructions">
          Complete all required items below to advance to the next stage.
        </p>

        {/* Checklist for Current Stage */}
        <Checklist items={stageView.checklist} />
      </div>

      {/* Error Message for Backwards Transitions */}
      {error && (
        <div
          className="workflow-error"
          style={{
            border: '3px solid #ef4444',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            padding: '1rem',
            marginTop: '1.5rem',
            marginBottom: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <svg
              width="24"
              height="24"
              fill="#ef4444"
              viewBox="0 0 20 20"
              style={{ flexShrink: 0, marginTop: '0.125rem' }}
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#991b1b',
                marginBottom: '0.5rem'
              }}>
                {error}
              </div>
              {workaround && (
                <div style={{
                  fontSize: '0.875rem',
                  color: '#7f1d1d',
                  whiteSpace: 'pre-line',
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: '#fee2e2',
                  borderRadius: '4px'
                }}>
                  <strong>Workaround Options:</strong>
                  <br />
                  {workaround}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stage Navigation */}
      <StageNavigation
        currentStage={stageView.stage}
        nextStage={stageView.nextStage}
        previousStage={stageView.previousStage}
        canAdvance={stageView.canAdvance}
        canGoBack={stageView.canGoBack}
        onAdvance={handleAdvance}
        onGoBack={handleGoBack}
      />
    </div>
  );
};

/**
 * Helper: Determine which stages are completed based on lifecycle state
 */
function getCompletedStages(property: Property): LifecycleState[] {
  const stageOrder: LifecycleState[] = [
    'intake',
    'feasibility',
    'entitlement',
    'construction',
    'servicing',
    'closed'
  ];

  const currentIndex = stageOrder.indexOf(property.lifecycle);
  return stageOrder.slice(0, currentIndex);
}

export default WorkflowView;
