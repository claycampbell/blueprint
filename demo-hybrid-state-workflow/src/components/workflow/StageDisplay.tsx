import React from 'react';
import { LifecycleState } from '../../types';

interface StageDisplayProps {
  currentStage: LifecycleState;
  completedStages: LifecycleState[];
}

/**
 * Visual progress indicator for workflow stages
 *
 * Shows linear progression through stages:
 * - Completed stages: green with checkmark
 * - Current stage: blue and highlighted
 * - Future stages: gray and de-emphasized
 */
const StageDisplay: React.FC<StageDisplayProps> = ({
  currentStage,
  completedStages
}) => {
  const stages: Array<{ key: LifecycleState; label: string }> = [
    { key: 'intake', label: 'Intake' },
    { key: 'feasibility', label: 'Feasibility' },
    { key: 'entitlement', label: 'Entitlement' },
    { key: 'construction', label: 'Construction' },
    { key: 'servicing', label: 'Servicing' },
    { key: 'closed', label: 'Closed' }
  ];

  const getStageStatus = (stageKey: LifecycleState): 'completed' | 'current' | 'future' => {
    if (completedStages.includes(stageKey)) return 'completed';
    if (stageKey === currentStage) return 'current';
    return 'future';
  };

  return (
    <div className="stage-display">
      {stages.map((stage, index) => {
        const status = getStageStatus(stage.key);
        const isLast = index === stages.length - 1;

        return (
          <div key={stage.key} className="stage-display-item">
            <div className={`stage-circle stage-circle-${status}`}>
              {status === 'completed' ? (
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="stage-number">{index + 1}</span>
              )}
            </div>

            <div className={`stage-label-display stage-label-${status}`}>
              {stage.label}
            </div>

            {!isLast && (
              <div className={`stage-connector stage-connector-${status}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StageDisplay;
