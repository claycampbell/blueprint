import React from 'react';
import { Annotation } from '../../data/scenarioAnnotations';
import { ProblemIndicator } from './ProblemIndicator';
import { SuccessIndicator } from './SuccessIndicator';

interface ScenarioAnnotationsProps {
  // Which view is this being rendered on
  viewType: 'workflow' | 'state-machine';

  // Active annotations for current scenario timestamp
  annotations: Annotation[];
}

/**
 * ScenarioAnnotations - Container for displaying scenario annotations
 *
 * Renders the appropriate indicator components (problem, success, info, warning)
 * based on annotation type and filters by view type.
 */
export const ScenarioAnnotations: React.FC<ScenarioAnnotationsProps> = ({
  viewType,
  annotations
}) => {
  // Filter annotations for this view
  const relevantAnnotations = annotations.filter(
    a => a.showOn === viewType || a.showOn === 'both'
  );

  // Group annotations by position
  const annotationsByPosition = {
    top: relevantAnnotations.filter(a => a.position === 'top'),
    middle: relevantAnnotations.filter(a => a.position === 'middle'),
    bottom: relevantAnnotations.filter(a => a.position === 'bottom'),
    unpositioned: relevantAnnotations.filter(a => !a.position)
  };

  if (relevantAnnotations.length === 0) {
    return null;
  }

  return (
    <div className="scenario-annotations" style={{ marginTop: '1rem' }}>
      {/* Top annotations */}
      {annotationsByPosition.top.length > 0 && (
        <div className="annotations-top" style={{ marginBottom: '1rem' }}>
          {annotationsByPosition.top.map((annotation, idx) => (
            <AnnotationRenderer key={idx} annotation={annotation} />
          ))}
        </div>
      )}

      {/* Middle annotations */}
      {annotationsByPosition.middle.length > 0 && (
        <div className="annotations-middle" style={{ marginBottom: '1rem' }}>
          {annotationsByPosition.middle.map((annotation, idx) => (
            <AnnotationRenderer key={idx} annotation={annotation} />
          ))}
        </div>
      )}

      {/* Bottom annotations */}
      {annotationsByPosition.bottom.length > 0 && (
        <div className="annotations-bottom" style={{ marginBottom: '1rem' }}>
          {annotationsByPosition.bottom.map((annotation, idx) => (
            <AnnotationRenderer key={idx} annotation={annotation} />
          ))}
        </div>
      )}

      {/* Unpositioned annotations (default to middle) */}
      {annotationsByPosition.unpositioned.length > 0 && (
        <div className="annotations-unpositioned" style={{ marginBottom: '1rem' }}>
          {annotationsByPosition.unpositioned.map((annotation, idx) => (
            <AnnotationRenderer key={idx} annotation={annotation} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Helper component to render the correct indicator type
 */
const AnnotationRenderer: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
  switch (annotation.type) {
    case 'problem':
      return <ProblemIndicator annotation={annotation} />;

    case 'success':
      return <SuccessIndicator annotation={annotation} />;

    case 'info':
      return <InfoIndicator annotation={annotation} />;

    case 'warning':
      return <WarningIndicator annotation={annotation} />;

    default:
      return null;
  }
};

/**
 * InfoIndicator - Blue informational callouts
 */
const InfoIndicator: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
  return (
    <div
      className="info-indicator"
      style={{
        position: 'relative',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        backgroundColor: '#eff6ff',
        padding: '0.875rem',
        marginTop: '0.75rem',
        marginBottom: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        {/* Icon */}
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <svg width="14" height="14" fill="white" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#1e40af',
              marginBottom: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {annotation.icon && <span>{annotation.icon}</span>}
            <span>{annotation.title}</span>
          </div>
          <div
            style={{
              fontSize: '0.8125rem',
              color: '#1e3a8a',
              lineHeight: '1.4'
            }}
          >
            {annotation.description}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * WarningIndicator - Yellow warning callouts
 */
const WarningIndicator: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
  return (
    <div
      className="warning-indicator"
      style={{
        position: 'relative',
        border: '2px solid #f59e0b',
        borderRadius: '8px',
        backgroundColor: '#fffbeb',
        padding: '0.875rem',
        marginTop: '0.75rem',
        marginBottom: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        {/* Icon */}
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <svg width="14" height="14" fill="white" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#92400e',
              marginBottom: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {annotation.icon && <span>{annotation.icon}</span>}
            <span>{annotation.title}</span>
          </div>
          <div
            style={{
              fontSize: '0.8125rem',
              color: '#78350f',
              lineHeight: '1.4'
            }}
          >
            {annotation.description}
          </div>
        </div>
      </div>
    </div>
  );
};
