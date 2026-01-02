/**
 * Scenario engine utilities for event execution and management
 */

import { ScenarioEvent, ProcessType } from '../types';
import { ExecutableScenarioEvent } from '../types/scenarios';

/**
 * Convert scenario events to executable events with callbacks
 */
export function createExecutableEvents(
  events: ScenarioEvent[],
  _propertyId: string,
  handlers: {
    onProcessStart: (processType: ProcessType) => void;
    onProcessComplete: (processId: string) => void;
    onStateChange: (
      stateType: string,
      previousValue: string | number,
      newValue: string | number,
      reason?: string
    ) => void;
    onUserAction: (action: string) => void;
  }
): ExecutableScenarioEvent[] {
  return events.map((event, index) => ({
    id: `event-${index}`,
    timestamp: event.timestamp,
    type: event.type,
    description: event.description,
    processType: event.processType,
    stateChange: event.stateChange ? {
      stateType: event.stateChange.stateType || 'lifecycle',
      previousValue: event.stateChange.previousValue || '',
      newValue: event.stateChange.newValue || ''
    } : undefined,
    userAction: event.userAction,
    execute: createEventExecutor(event, _propertyId, handlers)
  }));
}

/**
 * Create execution function for a scenario event
 */
function createEventExecutor(
  event: ScenarioEvent,
  _propertyId: string,
  handlers: {
    onProcessStart: (processType: ProcessType) => void;
    onProcessComplete: (processId: string) => void;
    onStateChange: (
      stateType: string,
      previousValue: string | number,
      newValue: string | number,
      reason?: string
    ) => void;
    onUserAction: (action: string) => void;
  }
): () => void {
  return () => {
    switch (event.type) {
      case 'process-start':
        if (event.processType) {
          handlers.onProcessStart(event.processType);
        }
        break;

      case 'process-complete':
        if (event.processType) {
          // We need to find the process ID for this type
          // This will be handled by the hook that has access to property state
          handlers.onProcessComplete(event.processType);
        }
        break;

      case 'state-change':
        if (event.stateChange) {
          handlers.onStateChange(
            event.stateChange.stateType || 'lifecycle',
            event.stateChange.previousValue || '',
            event.stateChange.newValue || '',
            event.description
          );
        }
        break;

      case 'user-action':
        if (event.userAction) {
          handlers.onUserAction(event.userAction);
        }
        break;

      default:
        console.warn(`Unknown event type: ${event.type}`);
    }
  };
}

/**
 * Validate scenario events for consistency
 */
export function validateScenario(events: ScenarioEvent[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check timestamps are in order
  for (let i = 1; i < events.length; i++) {
    if (events[i].timestamp < events[i - 1].timestamp) {
      errors.push(
        `Event ${i} timestamp (${events[i].timestamp}) is before previous event (${events[i - 1].timestamp})`
      );
    }
  }

  // Check event types have required fields
  events.forEach((event, index) => {
    switch (event.type) {
      case 'process-start':
      case 'process-complete':
        if (!event.processType) {
          errors.push(`Event ${index} (${event.type}) missing processType`);
        }
        break;

      case 'state-change':
        if (!event.stateChange) {
          errors.push(`Event ${index} (state-change) missing stateChange data`);
        }
        break;

      case 'user-action':
        if (!event.userAction) {
          errors.push(`Event ${index} (user-action) missing userAction`);
        }
        break;
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculate duration of scenario in milliseconds
 */
export function getScenarioDuration(events: ScenarioEvent[]): number {
  if (events.length === 0) return 0;
  return events[events.length - 1].timestamp;
}

/**
 * Get human-readable event type label
 */
export function getEventTypeLabel(type: ScenarioEvent['type']): string {
  const labels: Record<ScenarioEvent['type'], string> = {
    'process-start': 'Process Started',
    'process-complete': 'Process Completed',
    'state-change': 'State Changed',
    'user-action': 'User Action'
  };
  return labels[type] || type;
}

/**
 * Format timestamp as MM:SS
 */
export function formatTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
