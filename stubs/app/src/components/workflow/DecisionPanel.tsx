/**
 * Decision panel for workflow actions (Approve, Send Back, Skip To, Complete WFG)
 */

import { useState } from 'react';
import type {
  AvailableTransitions,
  WorkflowGroupId,
  WorkflowItemId,
  WorkflowStepInfo,
  WorkflowItemInfo,
} from '../../api/workflow';

interface DecisionPanelProps {
  currentStep: WorkflowStepInfo | null;
  currentWfi: WorkflowItemInfo | null;
  transitions: AvailableTransitions | null;
  onApprove: () => Promise<void>;
  onSendBack: (targetStep: WorkflowGroupId | null, targetWfi: WorkflowItemId | null, reason: string) => Promise<void>;
  onSkipTo: (targetStep: WorkflowGroupId) => Promise<void>;
  onCompleteWfg: () => Promise<void>;
  isLoading?: boolean;
  isCompleted?: boolean;
}

export function DecisionPanel({
  currentStep,
  currentWfi,
  transitions,
  onApprove,
  onSendBack,
  onSkipTo,
  onCompleteWfg,
  isLoading = false,
  isCompleted = false,
}: Readonly<DecisionPanelProps>) {
  const [showSendBack, setShowSendBack] = useState(false);
  const [showSendBackWfi, setShowSendBackWfi] = useState(false);
  const [showSkipTo, setShowSkipTo] = useState(false);
  const [sendBackTarget, setSendBackTarget] = useState<WorkflowGroupId | ''>('');
  const [sendBackWfiTarget, setSendBackWfiTarget] = useState<WorkflowItemId | ''>('');
  const [sendBackReason, setSendBackReason] = useState('');
  const [skipToTarget, setSkipToTarget] = useState<WorkflowGroupId | ''>('');

  // Determine available WFIs for back-routing within current WFG
  const availableWfisForSendBack = currentStep?.workflow_items?.filter(
    (wfi) => currentWfi && wfi.id !== currentWfi.id && wfi.id < currentWfi.id
  ) || [];

  if (isCompleted) {
    return (
      <div className="decision-panel completed">
        <h3>Workflow Complete</h3>
        <p>This workflow has been completed. No further actions available.</p>
        <style>{`
          .decision-panel.completed {
            background: var(--color-success-light);
            border: 1px solid var(--color-success-border);
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          .decision-panel.completed h3 {
            color: var(--color-success-text);
            margin: 0 0 10px 0;
          }
          .decision-panel.completed p {
            color: var(--color-success-text);
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  if (!transitions) {
    return null;
  }

  const handleSendBackSubmit = async () => {
    if (!sendBackTarget || !sendBackReason.trim()) return;
    await onSendBack(sendBackTarget as WorkflowGroupId, null, sendBackReason.trim());
    setShowSendBack(false);
    setSendBackTarget('');
    setSendBackReason('');
  };

  const handleSendBackWfiSubmit = async () => {
    if (!sendBackWfiTarget || !sendBackReason.trim()) return;
    await onSendBack(null, sendBackWfiTarget as WorkflowItemId, sendBackReason.trim());
    setShowSendBackWfi(false);
    setSendBackWfiTarget('');
    setSendBackReason('');
  };

  const handleSkipToSubmit = async () => {
    if (!skipToTarget) return;
    await onSkipTo(skipToTarget as WorkflowGroupId);
    setShowSkipTo(false);
    setSkipToTarget('');
  };

  return (
    <div className="decision-panel">
      <h3>Decision Actions</h3>

      <div className="decision-buttons">
        {/* Approve Button - moves to next WFI or next WFG */}
        {transitions.can_approve && (
          <button
            className="btn btn-approve"
            onClick={onApprove}
            disabled={isLoading}
          >
            <span className="btn-icon">✓</span>
            <span className="btn-text">
              Approve
              {transitions.approve_target && (
                <small>→ {transitions.approve_target.name}</small>
              )}
            </span>
          </button>
        )}

        {/* Complete WFG Button - skip remaining WFIs and move to next WFG */}
        {currentStep && currentWfi && currentStep.workflow_items.length > 1 && (
          <button
            className="btn btn-complete-wfg"
            onClick={onCompleteWfg}
            disabled={isLoading}
          >
            <span className="btn-icon">⏭</span>
            <span className="btn-text">
              Complete {currentStep.id}
              <small>Skip remaining items</small>
            </span>
          </button>
        )}

        {/* Send Back to Previous WFI (within same WFG) */}
        {availableWfisForSendBack.length > 0 && (
          <button
            className="btn btn-send-back-wfi"
            onClick={() => {
              setShowSendBackWfi(!showSendBackWfi);
              setShowSendBack(false);
              setShowSkipTo(false);
            }}
            disabled={isLoading}
          >
            <span className="btn-icon">↩</span>
            <span className="btn-text">
              Back to Previous Item
              <small>Within {currentStep?.id}</small>
            </span>
          </button>
        )}

        {/* Send Back to Previous WFG */}
        {transitions.can_send_back && transitions.send_back_targets.length > 0 && (
          <button
            className="btn btn-send-back"
            onClick={() => {
              setShowSendBack(!showSendBack);
              setShowSendBackWfi(false);
              setShowSkipTo(false);
            }}
            disabled={isLoading}
          >
            <span className="btn-icon">↩↩</span>
            <span className="btn-text">
              Back to Previous Step
              <small>Different WFG</small>
            </span>
          </button>
        )}

        {/* Skip To Button */}
        {transitions.can_skip_to && transitions.skip_to_targets.length > 0 && (
          <button
            className="btn btn-skip"
            onClick={() => {
              setShowSkipTo(!showSkipTo);
              setShowSendBack(false);
              setShowSendBackWfi(false);
            }}
            disabled={isLoading}
          >
            <span className="btn-icon">⚡</span>
            <span className="btn-text">Skip To</span>
          </button>
        )}
      </div>

      {/* Send Back Form */}
      {showSendBack && (
        <div className="decision-form">
          <h4>Send Back</h4>
          <select
            value={sendBackTarget}
            onChange={(e) => setSendBackTarget(e.target.value as WorkflowGroupId)}
            disabled={isLoading}
          >
            <option value="">Select target step...</option>
            {transitions.send_back_targets.map((target) => (
              <option key={target.id} value={target.id}>
                {target.name}
              </option>
            ))}
          </select>
          <textarea
            value={sendBackReason}
            onChange={(e) => setSendBackReason(e.target.value)}
            placeholder="Reason for sending back (required)..."
            rows={2}
            disabled={isLoading}
          />
          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowSendBack(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-send-back"
              onClick={handleSendBackSubmit}
              disabled={!sendBackTarget || !sendBackReason.trim() || isLoading}
            >
              Confirm Send Back
            </button>
          </div>
        </div>
      )}

      {/* Send Back WFI Form (within same WFG) */}
      {showSendBackWfi && (
        <div className="decision-form">
          <h4>Send Back to Previous Item</h4>
          <p className="form-hint">Within {currentStep?.name}</p>
          <select
            value={sendBackWfiTarget}
            onChange={(e) => setSendBackWfiTarget(e.target.value as WorkflowItemId)}
            disabled={isLoading}
          >
            <option value="">Select target item...</option>
            {availableWfisForSendBack.map((wfi) => (
              <option key={wfi.id} value={wfi.id}>
                {wfi.id}: {wfi.name}
              </option>
            ))}
          </select>
          <textarea
            value={sendBackReason}
            onChange={(e) => setSendBackReason(e.target.value)}
            placeholder="Reason for sending back (required)..."
            rows={2}
            disabled={isLoading}
          />
          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowSendBackWfi(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-send-back-wfi"
              onClick={handleSendBackWfiSubmit}
              disabled={!sendBackWfiTarget || !sendBackReason.trim() || isLoading}
            >
              Confirm Send Back
            </button>
          </div>
        </div>
      )}

      {/* Skip To Form */}
      {showSkipTo && (
        <div className="decision-form">
          <h4>Skip To</h4>
          <select
            value={skipToTarget}
            onChange={(e) => setSkipToTarget(e.target.value as WorkflowGroupId)}
            disabled={isLoading}
          >
            <option value="">Select target step...</option>
            {transitions.skip_to_targets.map((target) => (
              <option key={target.id} value={target.id}>
                {target.name}
              </option>
            ))}
          </select>
          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowSkipTo(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-skip"
              onClick={handleSkipToSubmit}
              disabled={!skipToTarget || isLoading}
            >
              Confirm Skip
            </button>
          </div>
        </div>
      )}

      <style>{`
        .decision-panel {
          background: var(--color-card);
          border: 2px solid var(--color-primary);
          border-radius: 8px;
          padding: 20px;
        }

        .decision-panel h3 {
          margin: 0 0 15px 0;
          color: var(--color-text);
        }

        .decision-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-icon {
          font-size: 18px;
        }

        .btn-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .btn-text small {
          font-size: 11px;
          opacity: 0.8;
        }

        .btn-approve {
          background: var(--color-success);
          color: white;
        }

        .btn-approve:hover:not(:disabled) {
          background: var(--color-success-dark);
        }

        .btn-send-back {
          background: var(--color-warning);
          color: #333;
        }

        .btn-send-back:hover:not(:disabled) {
          background: var(--color-warning-dark);
        }

        .btn-send-back-wfi {
          background: #f0ad4e;
          color: #333;
        }

        .btn-send-back-wfi:hover:not(:disabled) {
          background: #ec971f;
        }

        .btn-complete-wfg {
          background: #5bc0de;
          color: white;
        }

        .btn-complete-wfg:hover:not(:disabled) {
          background: #31b0d5;
        }

        .btn-skip {
          background: var(--color-info);
          color: white;
        }

        .btn-skip:hover:not(:disabled) {
          background: var(--color-info-dark);
        }

        .btn-secondary {
          background: var(--color-secondary);
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--color-secondary-dark);
        }

        .decision-form {
          margin-top: 15px;
          padding: 15px;
          background: var(--color-card-secondary);
          border-radius: 6px;
        }

        .decision-form h4 {
          margin: 0 0 12px 0;
          color: var(--color-text);
        }

        .form-hint {
          margin: 0 0 12px 0;
          font-size: 13px;
          color: var(--color-text-secondary);
        }

        .decision-form select,
        .decision-form textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          font-size: 14px;
          margin-bottom: 10px;
          background: var(--color-card);
          color: var(--color-text);
        }

        .decision-form select:focus,
        .decision-form textarea:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
