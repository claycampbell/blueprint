/**
 * Scenario Annotations - Visual indicators and explanatory text for demo scenarios
 *
 * This maps scenario events to visual annotations that appear on the workflow
 * and state machine views, highlighting the differences between the two models.
 */

export type AnnotationType = 'problem' | 'success' | 'info' | 'warning';

export interface Annotation {
  // Which event timestamp triggers this annotation
  eventTimestamp: number;

  // Which view(s) should show this annotation
  showOn: 'workflow' | 'state-machine' | 'both';

  // Type of annotation (determines styling)
  type: AnnotationType;

  // Position on screen
  position?: 'top' | 'middle' | 'bottom';

  // Main message
  title: string;

  // Detailed explanation
  description: string;

  // Optional icon/emoji
  icon?: string;

  // Duration to show (ms), or null to persist until next event
  duration?: number | null;
}

/**
 * Scenario B Annotations: Exception Handling
 */
export const SCENARIO_B_ANNOTATIONS: Annotation[] = [
  // INITIAL STATE
  {
    eventTimestamp: 0,
    showOn: 'both',
    type: 'info',
    position: 'top',
    title: 'Starting Scenario',
    description: 'Property has completed feasibility and is now in entitlement phase.',
    icon: '📋',
    duration: 3000
  },

  // ENTITLEMENT PREPARATION STARTS
  {
    eventTimestamp: 500,
    showOn: 'state-machine',
    type: 'info',
    position: 'middle',
    title: 'Process Started',
    description: 'Entitlement preparation process begins. Notice it appears as an active process card.',
    icon: '▶️',
    duration: null
  },

  {
    eventTimestamp: 500,
    showOn: 'workflow',
    type: 'info',
    position: 'middle',
    title: 'Checklist Item',
    description: 'Workflow shows this as a checklist item in the Entitlement stage.',
    icon: '☑️',
    duration: null
  },

  // PERMIT SUBMISSION
  {
    eventTimestamp: 2500,
    showOn: 'both',
    type: 'info',
    position: 'middle',
    title: 'Permits Submitted',
    description: 'Permit submission process begins with jurisdiction.',
    icon: '📤',
    duration: null
  },

  // THE CRITICAL MOMENT: ISSUE DISCOVERED
  {
    eventTimestamp: 5000,
    showOn: 'both',
    type: 'warning',
    position: 'top',
    title: '🚨 ISSUE DISCOVERED',
    description: 'Jurisdiction identifies a zoning variance requirement that was missed in feasibility!',
    icon: '⚠️',
    duration: null
  },

  // BACKWARDS TRANSITION - WORKFLOW PROBLEM
  {
    eventTimestamp: 6000,
    showOn: 'workflow',
    type: 'problem',
    position: 'middle',
    title: '❌ Workflow Error',
    description: 'Cannot move backwards in workflow! Workflow models expect linear progression only.',
    icon: '🚫',
    duration: null
  },

  {
    eventTimestamp: 6000,
    showOn: 'workflow',
    type: 'problem',
    position: 'bottom',
    title: 'Workaround Required',
    description: 'Need to either: (1) Create a "Re-Feasibility" stage, (2) Start a new workflow, or (3) Manually track in comments.',
    icon: '🔧',
    duration: null
  },

  // BACKWARDS TRANSITION - STATE MACHINE SUCCESS
  {
    eventTimestamp: 6000,
    showOn: 'state-machine',
    type: 'success',
    position: 'middle',
    title: '✅ State Transition',
    description: 'Lifecycle state naturally changes from entitlement → feasibility. State machine handles this effortlessly.',
    icon: '🔄',
    duration: null
  },

  {
    eventTimestamp: 6000,
    showOn: 'state-machine',
    type: 'success',
    position: 'bottom',
    title: 'Full Audit Trail',
    description: 'State change is logged with reason: "Zoning variance discovered during permit review." All context preserved.',
    icon: '📝',
    duration: null
  },

  // RE-FEASIBILITY PROCESS STARTS
  {
    eventTimestamp: 6500,
    showOn: 'state-machine',
    type: 'success',
    position: 'middle',
    title: '✅ New Process Started',
    description: 'Zoning variance analysis begins as a new independent process. Original feasibility work remains in history.',
    icon: '🔍',
    duration: null
  },

  {
    eventTimestamp: 6500,
    showOn: 'workflow',
    type: 'problem',
    position: 'middle',
    title: '❌ User Confusion',
    description: '"I thought we already completed this stage? Why are we back here?" - Typical user reaction to backwards workflow movement.',
    icon: '😕',
    duration: null
  },

  // SPECIALIST REASSIGNMENT
  {
    eventTimestamp: 7000,
    showOn: 'both',
    type: 'info',
    position: 'top',
    title: 'Specialist Assigned',
    description: 'Senior design specialist assigned to develop variance strategy.',
    icon: '👤',
    duration: 3000
  },

  // RE-FEASIBILITY COMPLETE
  {
    eventTimestamp: 9500,
    showOn: 'state-machine',
    type: 'success',
    position: 'middle',
    title: '✅ Process Complete',
    description: 'Zoning variance analysis complete. Variance strategy identified and documented.',
    icon: '✅',
    duration: null
  },

  {
    eventTimestamp: 9500,
    showOn: 'workflow',
    type: 'problem',
    position: 'middle',
    title: '❌ Data Integrity Risk',
    description: 'If using a workaround workflow, risk of losing original feasibility data or creating duplicate records.',
    icon: '⚠️',
    duration: null
  },

  // APPROVAL STATE CHANGES
  {
    eventTimestamp: 10000,
    showOn: 'both',
    type: 'info',
    position: 'top',
    title: 'Approval Granted',
    description: 'With variance strategy in place, approval state changes to approved.',
    icon: '👍',
    duration: 3000
  },

  // FORWARD TRANSITION BACK TO ENTITLEMENT
  {
    eventTimestamp: 10500,
    showOn: 'state-machine',
    type: 'success',
    position: 'middle',
    title: '✅ Return to Entitlement',
    description: 'Lifecycle state transitions back to entitlement (now with variance plan). State history shows the full journey.',
    icon: '➡️',
    duration: null
  },

  {
    eventTimestamp: 10500,
    showOn: 'workflow',
    type: 'problem',
    position: 'middle',
    title: '❌ Stage Indicators Confused',
    description: 'If workflow allowed backwards movement, how do progress indicators show we\'re "back" at entitlement but not starting over?',
    icon: '📊',
    duration: null
  },

  // RE-SUBMISSION
  {
    eventTimestamp: 11000,
    showOn: 'both',
    type: 'info',
    position: 'middle',
    title: 'Permits Re-Submitted',
    description: 'Permits re-submitted with variance application attached.',
    icon: '📤',
    duration: null
  },

  {
    eventTimestamp: 11000,
    showOn: 'state-machine',
    type: 'success',
    position: 'bottom',
    title: '✅ Complete Context',
    description: 'Process history shows: (1) Original feasibility, (2) First entitlement attempt, (3) Variance analysis, (4) Second entitlement attempt. Full story preserved.',
    icon: '📚',
    duration: null
  }
];

/**
 * Get annotations for a specific scenario
 */
export function getAnnotationsForScenario(scenarioId: string): Annotation[] {
  switch (scenarioId) {
    case 'scenario-b':
      return SCENARIO_B_ANNOTATIONS;
    default:
      return [];
  }
}

/**
 * Get annotations active at a specific timestamp
 */
export function getActiveAnnotations(
  scenarioId: string,
  currentTimestamp: number
): Annotation[] {
  const allAnnotations = getAnnotationsForScenario(scenarioId);

  return allAnnotations.filter(annotation => {
    // Annotation is triggered at or before current timestamp
    if (annotation.eventTimestamp > currentTimestamp) {
      return false;
    }

    // If duration is null, annotation persists until next event with same position
    if (annotation.duration === null) {
      // Find next annotation at same position
      const nextAnnotation = allAnnotations.find(
        a =>
          a.eventTimestamp > annotation.eventTimestamp &&
          a.showOn === annotation.showOn &&
          a.position === annotation.position
      );

      if (nextAnnotation) {
        return currentTimestamp < nextAnnotation.eventTimestamp;
      } else {
        return true; // No next annotation, persist forever
      }
    }

    // If duration is specified, check if still active
    return currentTimestamp < annotation.eventTimestamp + (annotation.duration || 0);
  });
}
