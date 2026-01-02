import { useState, useCallback } from 'react';
import { Property, Process, LifecycleState } from '../types';
import { SAMPLE_PROPERTIES } from '../data/sampleData';

/**
 * Custom hook for managing synchronized property state across both UI views
 *
 * This hook provides a single source of truth for property data that is shared
 * between the traditional workflow UI and the hybrid state machine UI.
 */
export const useSyncedProperty = (initialPropertyId: string) => {
  const [property, setProperty] = useState<Property>(SAMPLE_PROPERTIES[initialPropertyId]);

  /**
   * Update property data with partial updates
   */
  const updateProperty = useCallback((updates: Partial<Property>) => {
    setProperty(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date()
    }));
  }, []);

  /**
   * Mark a process as complete
   */
  const completeProcess = useCallback((processId: string) => {
    setProperty(prev => {
      const processToComplete = prev.activeProcesses.find(p => p.id === processId);

      if (!processToComplete) {
        return prev;
      }

      const completedProcess = {
        ...processToComplete,
        status: 'completed' as const,
        completedAt: new Date()
      };

      return {
        ...prev,
        activeProcesses: prev.activeProcesses.filter(p => p.id !== processId),
        processHistory: [
          ...prev.processHistory,
          {
            ...completedProcess,
            archivedAt: new Date()
          }
        ],
        updatedAt: new Date()
      };
    });
  }, []);

  /**
   * Start a new process for the property
   */
  const startProcess = useCallback((process: Process) => {
    setProperty(prev => ({
      ...prev,
      activeProcesses: [
        ...prev.activeProcesses,
        {
          ...process,
          propertyId: prev.id,
          status: 'in-progress',
          startedAt: new Date()
        }
      ],
      updatedAt: new Date()
    }));
  }, []);

  /**
   * Transition lifecycle state with state change tracking
   */
  const transitionLifecycle = useCallback((
    newLifecycle: LifecycleState,
    changedBy: string,
    reason?: string
  ) => {
    setProperty(prev => ({
      ...prev,
      lifecycle: newLifecycle,
      stateHistory: [
        ...prev.stateHistory,
        {
          id: `state-${Date.now()}`,
          propertyId: prev.id,
          stateType: 'lifecycle',
          previousValue: prev.lifecycle,
          newValue: newLifecycle,
          changedAt: new Date(),
          changedBy,
          reason
        }
      ],
      updatedAt: new Date()
    }));
  }, []);

  /**
   * Update property status with state change tracking
   */
  const updateStatus = useCallback((
    newStatus: Property['status'],
    changedBy: string,
    reason?: string
  ) => {
    setProperty(prev => ({
      ...prev,
      status: newStatus,
      stateHistory: [
        ...prev.stateHistory,
        {
          id: `state-${Date.now()}`,
          propertyId: prev.id,
          stateType: 'status',
          previousValue: prev.status,
          newValue: newStatus,
          changedAt: new Date(),
          changedBy,
          reason
        }
      ],
      updatedAt: new Date()
    }));
  }, []);

  /**
   * Update approval state with state change tracking
   */
  const updateApprovalState = useCallback((
    newApprovalState: Property['approvalState'],
    changedBy: string,
    reason?: string
  ) => {
    setProperty(prev => ({
      ...prev,
      approvalState: newApprovalState,
      stateHistory: [
        ...prev.stateHistory,
        {
          id: `state-${Date.now()}`,
          propertyId: prev.id,
          stateType: 'approval',
          previousValue: prev.approvalState,
          newValue: newApprovalState,
          changedAt: new Date(),
          changedBy,
          reason
        }
      ],
      updatedAt: new Date()
    }));
  }, []);

  /**
   * Update risk level with state change tracking
   */
  const updateRiskLevel = useCallback((
    newRiskLevel: number,
    changedBy: string,
    reason?: string
  ) => {
    setProperty(prev => ({
      ...prev,
      riskLevel: newRiskLevel,
      stateHistory: [
        ...prev.stateHistory,
        {
          id: `state-${Date.now()}`,
          propertyId: prev.id,
          stateType: 'risk',
          previousValue: prev.riskLevel,
          newValue: newRiskLevel,
          changedAt: new Date(),
          changedBy,
          reason
        }
      ],
      updatedAt: new Date()
    }));
  }, []);

  /**
   * Reset property to a different sample property
   */
  const loadProperty = useCallback((propertyId: string) => {
    setProperty(SAMPLE_PROPERTIES[propertyId]);
  }, []);

  return {
    property,
    updateProperty,
    completeProcess,
    startProcess,
    transitionLifecycle,
    updateStatus,
    updateApprovalState,
    updateRiskLevel,
    loadProperty
  };
};
