/**
 * Scenario playback hook for managing automated scenario execution
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { DemoScenario, ProcessType, Process } from '../types';
import {
  PlaybackState,
  PlaybackSpeed,
  PlaybackMode,
  ExecutableScenarioEvent
} from '../types/scenarios';
import { createExecutableEvents, validateScenario } from '../utils/scenarioEngine';

interface ScenarioPlaybackOptions {
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

export function useScenarioPlayback({
  scenario,
  propertyId,
  onProcessStart,
  onProcessComplete,
  onStateChange,
  getActiveProcessId
}: ScenarioPlaybackOptions) {
  // Playback state
  const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [mode, setMode] = useState<PlaybackMode>('auto');

  // Timing refs
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  // Executable events
  const [executableEvents, setExecutableEvents] = useState<ExecutableScenarioEvent[]>([]);

  // Initialize executable events when scenario changes
  useEffect(() => {
    const validation = validateScenario(scenario.events);
    if (!validation.valid) {
      console.error('Scenario validation failed:', validation.errors);
      return;
    }

    const events = createExecutableEvents(scenario.events, propertyId, {
      onProcessStart: (processType) => {
        // Create a new process instance
        const process: Process = {
          id: `proc-${Date.now()}`,
          type: processType,
          status: 'in-progress',
          propertyId,
          assignedTo: 'scenario-player',
          startedAt: new Date(),
          outputs: []
        };
        onProcessStart(process);
      },
      onProcessComplete: (processType) => {
        // Find the active process of this type
        const processId = getActiveProcessId(processType as ProcessType);
        if (processId) {
          onProcessComplete(processId);
        } else {
          console.warn(`No active process found for type: ${processType}`);
        }
      },
      onStateChange,
      onUserAction: (action) => {
        console.log(`User action simulated: ${action}`);
      }
    });

    setExecutableEvents(events);
  }, [scenario, propertyId, onProcessStart, onProcessComplete, onStateChange, getActiveProcessId]);

  // Current event
  const currentEvent = executableEvents[currentEventIndex] || null;

  // Calculate next event timing
  const getNextEventDelay = useCallback((): number => {
    if (currentEventIndex >= executableEvents.length - 1) {
      return 0;
    }

    const currentTime = executableEvents[currentEventIndex]?.timestamp || 0;
    const nextTime = executableEvents[currentEventIndex + 1]?.timestamp || 0;
    const delay = nextTime - currentTime;

    // Apply speed multiplier
    return delay / speed;
  }, [currentEventIndex, executableEvents, speed]);

  // Execute current event
  const executeCurrentEvent = useCallback(() => {
    if (currentEvent) {
      console.log(`Executing event ${currentEventIndex + 1}/${executableEvents.length}: ${currentEvent.description}`);
      currentEvent.execute();
    }
  }, [currentEvent, currentEventIndex, executableEvents.length]);

  // Schedule next event
  const scheduleNextEvent = useCallback(() => {
    if (currentEventIndex >= executableEvents.length - 1) {
      // End of scenario
      setPlaybackState('stopped');
      return;
    }

    const delay = getNextEventDelay();
    timerRef.current = setTimeout(() => {
      setCurrentEventIndex(prev => prev + 1);
    }, delay);
  }, [currentEventIndex, executableEvents.length, getNextEventDelay]);

  // Auto-play effect
  useEffect(() => {
    if (playbackState === 'playing' && mode === 'auto') {
      // Execute current event
      executeCurrentEvent();

      // Schedule next event
      scheduleNextEvent();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [playbackState, mode, currentEventIndex, executeCurrentEvent, scheduleNextEvent]);

  // Play
  const play = useCallback(() => {
    if (currentEventIndex >= executableEvents.length) {
      // Reset to beginning if at end
      setCurrentEventIndex(0);
    }
    setPlaybackState('playing');
    startTimeRef.current = Date.now();
  }, [currentEventIndex, executableEvents.length]);

  // Pause
  const pause = useCallback(() => {
    setPlaybackState('paused');
    pausedAtRef.current = Date.now();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Stop/Reset
  const stop = useCallback(() => {
    setPlaybackState('stopped');
    setCurrentEventIndex(0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Step forward (manual mode)
  const stepForward = useCallback(() => {
    if (currentEventIndex < executableEvents.length) {
      executeCurrentEvent();
      if (currentEventIndex < executableEvents.length - 1) {
        setCurrentEventIndex(prev => prev + 1);
      } else {
        setPlaybackState('stopped');
      }
    }
  }, [currentEventIndex, executableEvents.length, executeCurrentEvent]);

  // Step backward (manual mode)
  const stepBackward = useCallback(() => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex(prev => prev - 1);
    }
  }, [currentEventIndex]);

  // Jump to event
  const jumpToEvent = useCallback((index: number) => {
    if (index >= 0 && index < executableEvents.length) {
      setCurrentEventIndex(index);
      if (playbackState === 'playing') {
        setPlaybackState('paused');
      }
    }
  }, [executableEvents.length, playbackState]);

  // Change speed
  const changeSpeed = useCallback((newSpeed: PlaybackSpeed) => {
    setSpeed(newSpeed);
  }, []);

  // Toggle mode
  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'auto' ? 'manual' : 'auto');
    if (playbackState === 'playing') {
      setPlaybackState('paused');
    }
  }, [playbackState]);

  // Progress percentage
  const progress = executableEvents.length > 0
    ? (currentEventIndex / executableEvents.length) * 100
    : 0;

  return {
    // State
    playbackState,
    currentEventIndex,
    currentEvent,
    totalEvents: executableEvents.length,
    speed,
    mode,
    progress,

    // Controls
    play,
    pause,
    stop,
    stepForward,
    stepBackward,
    jumpToEvent,
    changeSpeed,
    toggleMode,

    // Event list
    events: executableEvents
  };
}
