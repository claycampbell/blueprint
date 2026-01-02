/**
 * Extended type definitions for scenario playback functionality
 */

import { ProcessType, StateType } from './index';

/**
 * Playback modes for scenario player
 */
export type PlaybackMode = 'auto' | 'manual';

/**
 * Playback state
 */
export type PlaybackState = 'playing' | 'paused' | 'stopped';

/**
 * Playback speed multipliers
 */
export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

/**
 * Executable scenario event with state mutation callbacks
 */
export interface ExecutableScenarioEvent {
  id: string;
  timestamp: number;
  type: 'process-start' | 'process-complete' | 'state-change' | 'user-action';
  description: string;

  // Execution context
  processType?: ProcessType;
  stateChange?: {
    stateType: StateType;
    previousValue: string | number;
    newValue: string | number;
  };
  userAction?: string;

  // Execution callback
  execute: () => void;
}

/**
 * Playback controller state
 */
export interface PlaybackController {
  state: PlaybackState;
  mode: PlaybackMode;
  speed: PlaybackSpeed;
  currentEventIndex: number;
  totalEvents: number;
  currentEvent: ExecutableScenarioEvent | null;
}

/**
 * Scenario playback configuration
 */
export interface ScenarioPlaybackConfig {
  scenarioId: string;
  autoStart?: boolean;
  initialSpeed?: PlaybackSpeed;
  loop?: boolean;
}
