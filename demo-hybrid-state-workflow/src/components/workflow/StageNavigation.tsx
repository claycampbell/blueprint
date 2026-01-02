import React from 'react';
import { LifecycleState } from '../../types';

interface StageNavigationProps {
  currentStage: LifecycleState;
  nextStage?: LifecycleState;
  previousStage?: LifecycleState;
  canAdvance: boolean;
  canGoBack: boolean;
  onAdvance: () => void;
  onGoBack: () => void;
}

/**
 * Stage navigation controls
 *
 * Demonstrates workflow rigidity:
 * - Prominent "Advance" button (primary action)
 * - Less prominent "Go Back" button (discouraged)
 * - Validation prevents advancement until checklist complete
 */
const StageNavigation: React.FC<StageNavigationProps> = ({
  nextStage,
  previousStage,
  canAdvance,
  canGoBack,
  onAdvance,
  onGoBack
}) => {
  const formatStageName = (stage?: LifecycleState): string => {
    if (!stage) return '';
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  };

  return (
    <div className="stage-navigation">
      {/* Back Button (Secondary, less prominent) */}
      <div className="nav-back">
        {previousStage && (
          <button
            className={`button button-secondary ${!canGoBack ? 'button-disabled' : ''}`}
            onClick={onGoBack}
            disabled={!canGoBack}
            title={!canGoBack ? 'Cannot go backwards in workflow' : undefined}
          >
            <svg
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ marginRight: '0.5rem' }}
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Return to {formatStageName(previousStage)}
          </button>
        )}
      </div>

      {/* Advance Button (Primary, prominent) */}
      <div className="nav-advance">
        {nextStage && (
          <button
            className={`button button-primary button-large ${!canAdvance ? 'button-disabled' : ''}`}
            onClick={onAdvance}
            disabled={!canAdvance}
            title={!canAdvance ? 'Complete all required items first' : undefined}
          >
            Advance to {formatStageName(nextStage)}
            <svg
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ marginLeft: '0.5rem' }}
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default StageNavigation;
