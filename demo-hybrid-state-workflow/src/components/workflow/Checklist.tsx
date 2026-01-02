import React from 'react';
import { ChecklistItem } from '../../types';

interface ChecklistProps {
  items: ChecklistItem[];
}

/**
 * Stage-specific checklist component
 *
 * Shows tasks that must be completed before advancing.
 * Demonstrates rigid workflow thinking:
 * - All tasks for current stage grouped together
 * - Required items block advancement
 * - No visibility into future stages
 */
const Checklist: React.FC<ChecklistProps> = ({ items }) => {
  const requiredItems = items.filter(item => item.required);
  const optionalItems = items.filter(item => !item.required);

  const completedCount = requiredItems.filter(item => item.completed).length;
  const totalRequired = requiredItems.length;

  return (
    <div className="checklist-container">
      {/* Progress Summary */}
      <div className="checklist-progress">
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${(completedCount / totalRequired) * 100}%` }}
          />
        </div>
        <div className="progress-text">
          {completedCount} of {totalRequired} required items completed
        </div>
      </div>

      {/* Required Items */}
      {requiredItems.length > 0 && (
        <div className="checklist-section">
          <h4 className="checklist-section-title">Required Tasks</h4>
          {requiredItems.map(item => (
            <ChecklistItemComponent key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Optional Items */}
      {optionalItems.length > 0 && (
        <div className="checklist-section">
          <h4 className="checklist-section-title">Optional Tasks</h4>
          {optionalItems.map(item => (
            <ChecklistItemComponent key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Individual checklist item
 */
const ChecklistItemComponent: React.FC<{ item: ChecklistItem }> = ({ item }) => {
  return (
    <div className={`checklist-item ${item.completed ? 'checklist-item-completed' : ''}`}>
      <div className="checklist-checkbox">
        {item.completed ? (
          <svg
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      <div className="checklist-label">
        <span className={item.completed ? 'checklist-label-text-completed' : ''}>
          {item.label}
        </span>
        {item.required && (
          <span className="required-indicator">*</span>
        )}
      </div>
    </div>
  );
};

export default Checklist;
