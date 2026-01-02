import React from 'react';
import { Annotation } from '../../data/scenarioAnnotations';

interface SuccessIndicatorProps {
  annotation: Annotation;
}

/**
 * SuccessIndicator - Visual indicator for state machine model successes
 *
 * Shows green-bordered callouts with checkmark icons and explanatory text
 * demonstrating where the state machine model handles exceptions elegantly.
 */
export const SuccessIndicator: React.FC<SuccessIndicatorProps> = ({ annotation }) => {
  return (
    <div
      className="success-indicator"
      style={{
        position: 'relative',
        border: '3px solid #10b981',
        borderRadius: '12px',
        backgroundColor: '#f0fdf4',
        padding: '1rem',
        marginTop: '1rem',
        marginBottom: '1rem',
        boxShadow: '0 4px 6px -1px rgb(16 185 129 / 0.3), 0 2px 4px -2px rgb(16 185 129 / 0.3)',
        animation: 'successGlow 2s ease-in-out infinite'
      }}
    >
      {/* Success Icon */}
      <div
        style={{
          position: 'absolute',
          top: '-16px',
          left: '16px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
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
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
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
            color: '#065f46',
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
            color: '#064e3b',
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
          backgroundColor: '#10b981',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px'
        }}
      />
    </div>
  );
};

// Add CSS animation for glow effect (would normally be in CSS file)
// This is inline for demo purposes
const style = document.createElement('style');
style.textContent = `
  @keyframes successGlow {
    0%, 100% {
      box-shadow: 0 4px 6px -1px rgb(16 185 129 / 0.3), 0 2px 4px -2px rgb(16 185 129 / 0.3);
    }
    50% {
      box-shadow: 0 4px 6px -1px rgb(16 185 129 / 0.5), 0 2px 4px -2px rgb(16 185 129 / 0.5), 0 0 0 4px rgb(16 185 129 / 0.1);
    }
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('#success-indicator-styles')) {
  style.id = 'success-indicator-styles';
  document.head.appendChild(style);
}
