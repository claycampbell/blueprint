/**
 * Scenario Player - Interactive playback controls for demo scenarios
 */

import React from 'react';
import { DemoScenario, ProcessType, Process } from '../types';
import { PlaybackSpeed } from '../types/scenarios';
import { useScenarioPlayback } from '../hooks/useScenarioPlayback';
import { EventTimeline } from './EventTimeline';

interface ScenarioPlayerProps {
  scenario: DemoScenario;
  propertyId: string;
  onProcessStart: (process: Process) => void;
  onProcessComplete: (processId: string) => void;
  onStateChange: (
    stateType: string,
    previousValue: string | number,
    newValue: string | number,
    reason?: string
  ) => void;
  getActiveProcessId: (processType: ProcessType) => string | undefined;
}

export const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({
  scenario,
  propertyId,
  onProcessStart,
  onProcessComplete,
  onStateChange,
  getActiveProcessId
}) => {
  const {
    playbackState,
    currentEventIndex,
    currentEvent,
    totalEvents,
    speed,
    mode,
    progress,
    play,
    pause,
    stop,
    stepForward,
    stepBackward,
    jumpToEvent,
    changeSpeed,
    toggleMode,
    events
  } = useScenarioPlayback({
    scenario,
    propertyId,
    onProcessStart,
    onProcessComplete,
    onStateChange,
    getActiveProcessId
  });

  const speeds: PlaybackSpeed[] = [0.5, 1, 2, 4];

  return (
    <div style={styles.container}>
      {/* Scenario Info */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{scenario.name}</h2>
          <p style={styles.description}>{scenario.description}</p>
        </div>
        <div style={styles.badge}>
          {scenario.propertyType}
        </div>
      </div>

      {/* Current Event Display */}
      {currentEvent && (
        <div style={styles.currentEventDisplay}>
          <div style={styles.currentEventIcon}>
            {getEventIcon(currentEvent.type)}
          </div>
          <div style={styles.currentEventContent}>
            <div style={styles.currentEventType}>
              {getEventTypeLabel(currentEvent.type)}
            </div>
            <div style={styles.currentEventDescription}>
              {currentEvent.description}
            </div>
          </div>
          <div style={styles.currentEventProgress}>
            Event {currentEventIndex + 1} of {totalEvents}
          </div>
        </div>
      )}

      {/* Event Timeline */}
      <EventTimeline
        events={events}
        currentEventIndex={currentEventIndex}
        onEventClick={jumpToEvent}
      />

      {/* Playback Controls */}
      <div style={styles.controls}>
        {/* Left side: Play/Pause/Stop */}
        <div style={styles.controlsLeft}>
          {playbackState === 'playing' ? (
            <button
              onClick={pause}
              style={{ ...styles.button, ...styles.buttonPrimary }}
              title="Pause"
            >
              <PauseIcon />
              <span style={styles.buttonLabel}>Pause</span>
            </button>
          ) : (
            <button
              onClick={play}
              style={{ ...styles.button, ...styles.buttonPrimary }}
              title="Play"
            >
              <PlayIcon />
              <span style={styles.buttonLabel}>Play</span>
            </button>
          )}

          <button
            onClick={stop}
            style={{ ...styles.button, ...styles.buttonSecondary }}
            title="Reset"
          >
            <StopIcon />
            <span style={styles.buttonLabel}>Reset</span>
          </button>
        </div>

        {/* Center: Manual step controls */}
        <div style={styles.controlsCenter}>
          <button
            onClick={stepBackward}
            disabled={currentEventIndex === 0}
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
              ...(currentEventIndex === 0 ? styles.buttonDisabled : {})
            }}
            title="Previous Event"
          >
            <PreviousIcon />
            <span style={styles.buttonLabel}>Previous</span>
          </button>

          <button
            onClick={stepForward}
            disabled={currentEventIndex >= totalEvents - 1}
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
              ...(currentEventIndex >= totalEvents - 1 ? styles.buttonDisabled : {})
            }}
            title="Next Event"
          >
            <span style={styles.buttonLabel}>Next</span>
            <NextIcon />
          </button>
        </div>

        {/* Right side: Speed control */}
        <div style={styles.controlsRight}>
          <span style={styles.speedLabel}>Speed:</span>
          <div style={styles.speedButtons}>
            {speeds.map(s => (
              <button
                key={s}
                onClick={() => changeSpeed(s)}
                style={{
                  ...styles.speedButton,
                  ...(speed === s ? styles.speedButtonActive : {})
                }}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`
            }}
          />
        </div>
      </div>

      {/* Expected outcomes */}
      <div style={styles.outcomes}>
        <div style={styles.outcomeColumn}>
          <h4 style={styles.outcomeTitle}>Traditional Workflow</h4>
          <ul style={styles.outcomeList}>
            {scenario.expectedOutcomes.workflow.map((outcome, idx) => (
              <li key={idx} style={styles.outcomeItem}>
                {outcome}
              </li>
            ))}
          </ul>
        </div>
        <div style={styles.outcomeColumn}>
          <h4 style={styles.outcomeTitle}>Hybrid State Machine</h4>
          <ul style={styles.outcomeList}>
            {scenario.expectedOutcomes.stateMachine.map((outcome, idx) => (
              <li key={idx} style={styles.outcomeItem}>
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Helper function for event type labels
function getEventTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'process-start': 'Process Started',
    'process-complete': 'Process Completed',
    'state-change': 'State Changed',
    'user-action': 'User Action'
  };
  return labels[type] || type;
}

// Helper function for event icons
function getEventIcon(type: string): React.ReactNode {
  switch (type) {
    case 'process-start':
      return '▶️';
    case 'process-complete':
      return '✅';
    case 'state-change':
      return '🔄';
    case 'user-action':
      return '👤';
    default:
      return '📋';
  }
}

// Icon components
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 2v12l10-6z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 2h3v12H4zM9 2h3v12H9z" />
  </svg>
);

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 3h10v10H3z" />
  </svg>
);

const PreviousIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11 2L5 8l6 6V2z" />
  </svg>
);

const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 2l6 6-6 6V2z" />
  </svg>
);

// Styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'sticky',
    top: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    marginBottom: '2rem',
    zIndex: 100,
    border: '2px solid var(--color-primary)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid var(--color-gray-200)'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--color-gray-900)',
    margin: 0,
    marginBottom: '0.25rem'
  },
  description: {
    fontSize: '0.875rem',
    color: 'var(--color-gray-600)',
    margin: 0
  },
  badge: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  currentEventDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'var(--color-gray-50)',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    border: '2px solid var(--color-primary)'
  },
  currentEventIcon: {
    fontSize: '2rem',
    flexShrink: 0
  },
  currentEventContent: {
    flex: 1
  },
  currentEventType: {
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: 'var(--color-primary)',
    letterSpacing: '0.05em'
  },
  currentEventDescription: {
    fontSize: '1rem',
    fontWeight: '500',
    color: 'var(--color-gray-900)',
    marginTop: '0.25rem'
  },
  currentEventProgress: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--color-gray-600)',
    flexShrink: 0
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
    marginBottom: '1rem'
  },
  controlsLeft: {
    display: 'flex',
    gap: '0.5rem'
  },
  controlsCenter: {
    display: 'flex',
    gap: '0.5rem'
  },
  controlsRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  buttonPrimary: {
    backgroundColor: 'var(--color-primary)',
    color: 'white'
  },
  buttonSecondary: {
    backgroundColor: 'var(--color-gray-200)',
    color: 'var(--color-gray-700)'
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  buttonLabel: {
    fontSize: '0.875rem'
  },
  speedLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--color-gray-700)'
  },
  speedButtons: {
    display: 'flex',
    gap: '0.25rem',
    backgroundColor: 'var(--color-gray-100)',
    padding: '0.25rem',
    borderRadius: '6px'
  },
  speedButton: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-gray-600)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  speedButtonActive: {
    backgroundColor: 'white',
    color: 'var(--color-primary)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  progressContainer: {
    marginTop: '1rem'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--color-gray-200)',
    borderRadius: '9999px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--color-primary)',
    borderRadius: '9999px',
    transition: 'width 0.5s ease'
  },
  outcomes: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '2px solid var(--color-gray-200)'
  },
  outcomeColumn: {
    backgroundColor: 'var(--color-gray-50)',
    padding: '1rem',
    borderRadius: '6px'
  },
  outcomeTitle: {
    fontSize: '0.875rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--color-gray-700)',
    marginBottom: '0.75rem',
    margin: 0
  },
  outcomeList: {
    margin: 0,
    paddingLeft: '1.25rem',
    fontSize: '0.8125rem',
    lineHeight: '1.6'
  },
  outcomeItem: {
    marginBottom: '0.5rem',
    color: 'var(--color-gray-700)'
  }
};
