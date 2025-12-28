/**
 * Displays the current workflow step and progress with WFI sub-steps
 */

import type { WorkflowStepInfo, WorkflowItemInfo } from '../../api/workflow';

interface StepDisplayProps {
  currentStep: WorkflowStepInfo | null;
  currentWfi: WorkflowItemInfo | null;
  status: string;
}

const STEPS = [
  { id: 'WFG1', name: 'Project Kickoff', number: 1, wfis: ['WFI1', 'WFI2'] },
  { id: 'WFG2', name: 'Schematic Design', number: 2, wfis: ['WFI1', 'WFI2'] },
  { id: 'WFG3', name: 'Construction Docs', number: 3, wfis: ['WFI1'] },
  { id: 'End', name: 'Complete', number: 4, wfis: [] },
];

export function StepDisplay({ currentStep, currentWfi, status }: Readonly<StepDisplayProps>) {
  const currentStepId = currentStep?.id || 'WFG1';
  const currentWfiId = currentWfi?.id || null;
  const isCompleted = status === 'completed' || currentStepId === 'End';

  // Helper to check if a WFI is completed within the current WFG
  const isWfiCompleted = (stepId: string, wfiId: string): boolean => {
    if (isCompleted) return true;
    const stepIndex = STEPS.findIndex((s) => s.id === stepId);
    const currentStepIndex = STEPS.findIndex((s) => s.id === currentStepId);

    // If this step is before current step, all WFIs are completed
    if (stepIndex < currentStepIndex) return true;

    // If this step is after current step, no WFIs are completed
    if (stepIndex > currentStepIndex) return false;

    // Same step - check WFI position
    const step = STEPS[stepIndex];
    if (!step) return false;
    const wfiIndex = step.wfis.indexOf(wfiId);
    const currentWfiIndex = currentWfiId ? step.wfis.indexOf(currentWfiId) : -1;

    return wfiIndex < currentWfiIndex;
  };

  const isWfiActive = (stepId: string, wfiId: string): boolean => {
    return stepId === currentStepId && wfiId === currentWfiId;
  };

  return (
    <div className="step-display">
      <h3>Workflow Progress</h3>

      {/* Step Progress Bar */}
      <div className="step-progress">
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStepId;
          const isPast =
            STEPS.findIndex((s) => s.id === currentStepId) > index ||
            isCompleted;

          return (
            <div
              key={step.id}
              className={`step-item ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
            >
              <div className="step-circle">
                {isPast && !isActive ? '✓' : step.number}
              </div>
              <div className="step-label">{step.name}</div>
              {index < STEPS.length - 1 && (
                <div className={`step-connector ${isPast ? 'completed' : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Details with WFI Progress */}
      {currentStep && currentStep.id !== 'End' && (
        <div className="current-step-details">
          <h4>Current Step: {currentStep.name}</h4>
          {currentStep.description && (
            <p className="step-description">{currentStep.description}</p>
          )}

          {/* WFI Progress within current WFG */}
          {currentStep.workflow_items && currentStep.workflow_items.length > 0 && (
            <div className="wfi-progress">
              <h5>Workflow Items:</h5>
              <div className="wfi-list">
                {currentStep.workflow_items.map((wfi, wfiIndex) => {
                  const wfiCompleted = isWfiCompleted(currentStep.id, wfi.id);
                  const wfiActive = isWfiActive(currentStep.id, wfi.id);

                  return (
                    <div
                      key={wfi.id}
                      className={`wfi-item ${wfiActive ? 'active' : ''} ${wfiCompleted ? 'completed' : ''}`}
                    >
                      <div className="wfi-indicator">
                        {wfiCompleted ? '✓' : wfiIndex + 1}
                      </div>
                      <div className="wfi-name">{wfi.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="workflow-complete">
          <span className="complete-icon">🎉</span>
          <span>Workflow Complete!</span>
        </div>
      )}

      <style>{`
        .step-display {
          background: var(--color-card-secondary);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .step-display h3 {
          margin: 0 0 20px 0;
          color: var(--color-text);
        }

        .step-progress {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          margin-bottom: 20px;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--step-inactive-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: var(--step-inactive-text);
          z-index: 1;
          transition: all 0.3s ease;
        }

        .step-item.active .step-circle {
          background: var(--color-primary);
          color: white;
          box-shadow: 0 0 0 4px var(--step-active-shadow);
        }

        .step-item.completed .step-circle {
          background: var(--color-success);
          color: white;
        }

        .step-label {
          margin-top: 8px;
          font-size: 12px;
          color: var(--color-text-secondary);
          text-align: center;
          max-width: 80px;
        }

        .step-item.active .step-label {
          color: var(--color-primary);
          font-weight: bold;
        }

        .step-connector {
          position: absolute;
          top: 20px;
          left: calc(50% + 25px);
          width: calc(100% - 50px);
          height: 3px;
          background: var(--step-inactive-bg);
        }

        .step-connector.completed {
          background: var(--color-success);
        }

        .step-item:last-child .step-connector {
          display: none;
        }

        .current-step-details {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 15px;
          margin-top: 15px;
        }

        .current-step-details h4 {
          margin: 0 0 10px 0;
          color: var(--color-primary);
        }

        .step-description {
          margin: 0 0 15px 0;
          color: var(--color-text-secondary);
          font-size: 14px;
        }

        .wfi-progress {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid var(--color-border);
        }

        .wfi-progress h5 {
          margin: 0 0 10px 0;
          color: var(--color-text);
          font-size: 13px;
          font-weight: 600;
        }

        .wfi-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .wfi-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: var(--color-card-secondary);
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .wfi-item.active {
          background: var(--color-primary-light);
          border-left: 3px solid var(--color-primary);
        }

        .wfi-item.completed {
          opacity: 0.7;
        }

        .wfi-indicator {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--step-inactive-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: var(--step-inactive-text);
          flex-shrink: 0;
        }

        .wfi-item.active .wfi-indicator {
          background: var(--color-primary);
          color: white;
        }

        .wfi-item.completed .wfi-indicator {
          background: var(--color-success);
          color: white;
        }

        .wfi-name {
          font-size: 13px;
          color: var(--color-text);
        }

        .wfi-item.active .wfi-name {
          font-weight: 600;
          color: var(--color-primary);
        }

        .workflow-complete {
          background: var(--color-success-light);
          border: 1px solid var(--color-success-border);
          border-radius: 6px;
          padding: 15px;
          text-align: center;
          color: var(--color-success-text);
          font-weight: bold;
          margin-top: 15px;
        }

        .complete-icon {
          font-size: 24px;
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
}
