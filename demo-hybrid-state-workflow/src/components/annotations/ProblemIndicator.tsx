import React from 'react';
import { Annotation } from '../../data/scenarioAnnotations';

interface ProblemIndicatorProps {
  annotation: Annotation;
}

/**
 * ProblemIndicator - Visual indicator for workflow model problems
 *
 * Shows red-bordered callouts with error icons and explanatory text
 * demonstrating where the workflow model breaks down.
 */
export const ProblemIndicator: React.FC<ProblemIndicatorProps> = ({ annotation }) => {
  return (
    <div
      className="problem-indicator"
      style={{
        position: 'relative',
        border: '3px solid #ef4444',
        borderRadius: '12px',
        backgroundColor: '#fef2f2',
        padding: '1rem',
        marginTop: '1rem',
        marginBottom: '1rem',
        boxShadow: '0 4px 6px -1px rgb(239 68 68 / 0.3), 0 2px 4px -2px rgb(239 68 68 / 0.3)',
        animation: 'problemPulse 2s ease-in-out infinite'
      }}
    >
      {/* Error Icon */}
      <div
        style={{
          position: 'absolute',
          top: '-16px',
          left: '16px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <svg
          width="20"
          height="20"
          fill="white"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Content */}
      <div style={{ marginLeft: '8px' }}>
        {/* Title */}
        <div
          style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: '#991b1b',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {annotation.icon && <span style={{ fontSize: '1.25rem' }}>{annotation.icon}</span>}
          <span>{annotation.title}</span>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '0.875rem',
            color: '#7f1d1d',
            lineHeight: '1.5'
          }}
        >
          {annotation.description}
        </div>
      </div>

      {/* Bottom border accent */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '4px',
          backgroundColor: '#ef4444',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px'
        }}
      />
    </div>
  );
};

// Add CSS animation for pulse effect (would normally be in CSS file)
// This is inline for demo purposes
const style = document.createElement('style');
style.textContent = `
  @keyframes problemPulse {
    0%, 100% {
      box-shadow: 0 4px 6px -1px rgb(239 68 68 / 0.3), 0 2px 4px -2px rgb(239 68 68 / 0.3);
    }
    50% {
      box-shadow: 0 4px 6px -1px rgb(239 68 68 / 0.5), 0 2px 4px -2px rgb(239 68 68 / 0.5), 0 0 0 4px rgb(239 68 68 / 0.1);
    }
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('#problem-indicator-styles')) {
  style.id = 'problem-indicator-styles';
  document.head.appendChild(style);
}
