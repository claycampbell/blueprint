/**
 * Event Timeline - Visual progress indicator for scenario playback
 */

import React from 'react';
import { ExecutableScenarioEvent } from '../types/scenarios';
import { getEventTypeLabel, formatTimestamp } from '../utils/scenarioEngine';

interface EventTimelineProps {
  events: ExecutableScenarioEvent[];
  currentEventIndex: number;
  onEventClick: (index: number) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  currentEventIndex,
  onEventClick
}) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Event Timeline</h3>
        <span style={styles.subtitle}>
          Event {currentEventIndex + 1} of {events.length}
        </span>
      </div>

      <div style={styles.timelineContainer}>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${(currentEventIndex / (events.length - 1)) * 100}%`
            }}
          />
        </div>

        <div style={styles.eventsContainer}>
          {events.map((event, index) => (
            <div
              key={event.id}
              style={{
                ...styles.eventMarker,
                left: `${(index / (events.length - 1)) * 100}%`
              }}
              onClick={() => onEventClick(index)}
              title={event.description}
            >
              <div
                style={{
                  ...styles.eventDot,
                  ...(index < currentEventIndex
                    ? styles.eventDotCompleted
                    : index === currentEventIndex
                    ? styles.eventDotCurrent
                    : styles.eventDotFuture)
                }}
              >
                {index + 1}
              </div>

              {/* Tooltip on hover */}
              <div style={styles.tooltip}>
                <div style={styles.tooltipHeader}>
                  <span style={styles.tooltipType}>
                    {getEventTypeLabel(event.type)}
                  </span>
                  <span style={styles.tooltipTime}>
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>
                <div style={styles.tooltipDescription}>
                  {event.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--color-gray-900)',
    margin: 0
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--color-gray-500)',
    fontWeight: '500'
  },
  timelineContainer: {
    position: 'relative',
    paddingTop: '2rem',
    paddingBottom: '1rem'
  },
  progressBar: {
    position: 'absolute',
    top: '2.5rem',
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: 'var(--color-gray-200)',
    borderRadius: '9999px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--color-success)',
    borderRadius: '9999px',
    transition: 'width 0.5s ease'
  },
  eventsContainer: {
    position: 'relative',
    height: '60px'
  },
  eventMarker: {
    position: 'absolute',
    top: '1rem',
    transform: 'translateX(-50%)',
    cursor: 'pointer',
    zIndex: 1
  },
  eventDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '600',
    transition: 'all 0.3s',
    border: '2px solid transparent'
  },
  eventDotCompleted: {
    backgroundColor: 'var(--color-success)',
    color: 'white',
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
  },
  eventDotCurrent: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    boxShadow: '0 4px 8px rgba(37, 99, 235, 0.4)',
    transform: 'scale(1.15)',
    border: '2px solid white'
  },
  eventDotFuture: {
    backgroundColor: 'white',
    color: 'var(--color-gray-400)',
    border: '2px solid var(--color-gray-300)'
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-8px)',
    backgroundColor: 'var(--color-gray-900)',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.2s',
    zIndex: 10,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    minWidth: '200px',
    maxWidth: '300px',
    whiteSpace: 'normal'
  },
  tooltipHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.25rem',
    paddingBottom: '0.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
  },
  tooltipType: {
    fontWeight: '600',
    fontSize: '0.75rem'
  },
  tooltipTime: {
    fontSize: '0.7rem',
    opacity: 0.8
  },
  tooltipDescription: {
    marginTop: '0.25rem',
    fontSize: '0.7rem',
    lineHeight: '1.4'
  }
};

// Add hover effect using CSS-in-JS workaround
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .event-marker:hover .tooltip {
    opacity: 1 !important;
  }
`;
document.head.appendChild(styleSheet);
