import { Property, WorkflowStageView, ChecklistItem, LifecycleState, ProcessType } from '../../types';

/**
 * Workflow utilities for mapping state-based properties to workflow views
 *
 * This demonstrates the "impedance mismatch" between:
 * - State-based property model (how data actually exists)
 * - Workflow-based UI expectations (how traditional systems present it)
 */

/**
 * Build a workflow stage view from a property
 *
 * This is where we "force" the state-based model into a workflow paradigm
 */
export function buildWorkflowStageView(property: Property): WorkflowStageView {
  const stage = property.lifecycle;
  const stageInfo = STAGE_DEFINITIONS[stage];

  // Build checklist from process definitions
  const checklist = buildChecklist(property, stage);

  // Determine if all required items are complete
  const canAdvance = checklist
    .filter(item => item.required)
    .every(item => item.completed);

  // Determine navigation
  const { nextStage, previousStage } = getAdjacentStages(stage);

  return {
    stage,
    displayName: stageInfo.displayName,
    description: stageInfo.description,
    checklist,
    canAdvance,
    canGoBack: !!previousStage && stage !== 'intake', // Can't go back from intake
    nextStage,
    previousStage
  };
}

/**
 * Build checklist for a given stage
 *
 * Maps process types to checklist items based on stage
 */
function buildChecklist(property: Property, stage: LifecycleState): ChecklistItem[] {
  const stageProcesses = STAGE_TO_PROCESSES[stage] || [];

  return stageProcesses.map(mapping => {
    // Check if this process is completed
    const isCompleted = isProcessCompleted(property, mapping.processType);

    return {
      id: mapping.processType,
      label: mapping.label,
      completed: isCompleted,
      required: mapping.required,
      processType: mapping.processType
    };
  });
}

/**
 * Check if a process is completed
 */
function isProcessCompleted(property: Property, processType: ProcessType): boolean {
  // Check process history for completed processes
  const completedInHistory = property.processHistory.some(
    p => p.type === processType && p.status === 'completed'
  );

  // Check active processes (none should be active if complete)
  const stillActive = property.activeProcesses.some(
    p => p.type === processType && p.status !== 'completed'
  );

  return completedInHistory && !stillActive;
}

/**
 * Get adjacent stages for navigation
 */
function getAdjacentStages(currentStage: LifecycleState): {
  nextStage?: LifecycleState;
  previousStage?: LifecycleState;
} {
  const stageOrder: LifecycleState[] = [
    'intake',
    'feasibility',
    'entitlement',
    'construction',
    'servicing',
    'closed'
  ];

  const currentIndex = stageOrder.indexOf(currentStage);

  return {
    nextStage: currentIndex < stageOrder.length - 1
      ? stageOrder[currentIndex + 1]
      : undefined,
    previousStage: currentIndex > 0
      ? stageOrder[currentIndex - 1]
      : undefined
  };
}

/**
 * Stage definitions
 */
const STAGE_DEFINITIONS: Record<LifecycleState, {
  displayName: string;
  description: string;
}> = {
  'intake': {
    displayName: 'Intake & Qualification',
    description: 'Initial property screening and viability check'
  },
  'feasibility': {
    displayName: 'Feasibility Analysis',
    description: 'Comprehensive due diligence and site assessment'
  },
  'entitlement': {
    displayName: 'Entitlement & Permitting',
    description: 'Prepare and submit permit applications'
  },
  'construction': {
    displayName: 'Construction',
    description: 'Active construction and draw management'
  },
  'servicing': {
    displayName: 'Loan Servicing',
    description: 'Ongoing loan servicing and monitoring'
  },
  'closed': {
    displayName: 'Closed',
    description: 'Loan paid off or property sold'
  }
};

/**
 * Mapping of stages to required/optional processes
 *
 * This is the "workflow logic" - defining what processes belong to each stage
 */
interface ProcessMapping {
  processType: ProcessType;
  label: string;
  required: boolean;
}

const STAGE_TO_PROCESSES: Record<LifecycleState, ProcessMapping[]> = {
  'intake': [
    {
      processType: 'intake-qualification',
      label: 'Intake Qualification Complete',
      required: true
    }
  ],

  'feasibility': [
    {
      processType: 'intake-qualification',
      label: 'Intake Qualification Complete',
      required: true
    },
    {
      processType: 'feasibility-analysis',
      label: 'Feasibility Analysis Complete',
      required: true
    },
    {
      processType: 'zoning-review',
      label: 'Zoning Review Complete',
      required: true
    },
    {
      processType: 'title-review',
      label: 'Title Review Complete',
      required: true
    },
    {
      processType: 'environmental-assessment',
      label: 'Environmental Assessment',
      required: false
    },
    {
      processType: 'arborist-review',
      label: 'Arborist Review',
      required: false
    }
  ],

  'entitlement': [
    {
      processType: 'entitlement-preparation',
      label: 'Entitlement Package Prepared',
      required: true
    },
    {
      processType: 'permit-submission',
      label: 'Permits Submitted',
      required: true
    }
  ],

  'construction': [
    {
      processType: 'construction-start',
      label: 'Construction Started',
      required: true
    }
  ],

  'servicing': [],
  'closed': []
};

/**
 * Detect backwards workflow transitions
 *
 * Workflows expect linear, forward-only progression. This function detects
 * when a lifecycle state change goes "backwards" in the expected flow.
 */
export function detectBackwardsTransition(
  fromState: LifecycleState,
  toState: LifecycleState
): boolean {
  const stageOrder: LifecycleState[] = [
    'intake',
    'feasibility',
    'entitlement',
    'construction',
    'servicing',
    'closed'
  ];

  const fromIndex = stageOrder.indexOf(fromState);
  const toIndex = stageOrder.indexOf(toState);

  // Backwards if toIndex is less than fromIndex
  return toIndex < fromIndex;
}

/**
 * Get workflow error message for backwards transitions
 *
 * Returns appropriate error messages when workflow model encounters
 * backwards state changes it can't handle.
 */
export function getBackwardsTransitionError(
  fromState: LifecycleState,
  toState: LifecycleState
): string {
  return `⚠️ Workflow Error: Cannot return to previous stage. Attempted to move from "${fromState}" back to "${toState}". This workflow only supports forward progression.`;
}

/**
 * Get workaround suggestion for backwards transitions
 *
 * Provides suggestions for how users might work around workflow limitations
 */
export function getWorkflowWorkaroundSuggestion(
  _fromState: LifecycleState,
  toState: LifecycleState
): string {
  return `Consider one of these workarounds:\n\n` +
    `1. Create a "Re-${toState}" stage in the workflow\n` +
    `2. Start a new workflow instance for the ${toState} work\n` +
    `3. Manually track the exception in comments/notes\n` +
    `4. Contact system administrator to modify workflow definition\n\n` +
    `⚠️ Warning: All workarounds risk losing context and creating duplicate data.`;
}
