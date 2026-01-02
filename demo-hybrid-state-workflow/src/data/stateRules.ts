import { Property, StateTransitionRule, LifecycleState } from '../types';

/**
 * State transition rules - define when and how lifecycle state changes
 */
export const STATE_TRANSITION_RULES: StateTransitionRule[] = [
  {
    fromState: 'intake',
    toState: 'feasibility',
    trigger: 'intake-qualification-complete',
    conditions: [
      (property: Property) => {
        return property.activeProcesses.some(
          p => p.type === 'intake-qualification' && p.status === 'completed'
        );
      },
      (property: Property) => property.approvalState !== 'rejected'
    ],
    onTransition: (property: Property) => {
      console.log(`Property ${property.id} transitioning: intake → feasibility`);
    }
  },

  {
    fromState: 'feasibility',
    toState: 'entitlement',
    trigger: 'feasibility-approved',
    conditions: [
      (property: Property) => {
        // All feasibility-related processes complete
        const feasibilityProcesses = property.activeProcesses.filter(
          p => ['feasibility-analysis', 'zoning-review', 'title-review'].includes(p.type)
        );
        return feasibilityProcesses.length > 0 &&
          feasibilityProcesses.every(p => p.status === 'completed');
      },
      (property: Property) => property.approvalState === 'approved'
    ],
    onTransition: (property: Property) => {
      console.log(`Property ${property.id} transitioning: feasibility → entitlement`);
    }
  },

  {
    fromState: 'entitlement',
    toState: 'construction',
    trigger: 'permit-approved',
    conditions: [
      (property: Property) => {
        return property.activeProcesses.some(
          p => p.type === 'permit-submission' && p.status === 'completed'
        );
      },
      (property: Property) => property.approvalState === 'approved'
    ],
    onTransition: (property: Property) => {
      console.log(`Property ${property.id} transitioning: entitlement → construction`);
    }
  },

  {
    fromState: 'construction',
    toState: 'servicing',
    trigger: 'construction-complete',
    conditions: [
      (property: Property) => {
        return property.activeProcesses.some(
          p => p.type === 'construction-start' && p.status === 'completed'
        );
      }
    ],
    onTransition: (property: Property) => {
      console.log(`Property ${property.id} transitioning: construction → servicing`);
    }
  },

  // Special transition: Back to feasibility (exception handling)
  {
    fromState: 'entitlement',
    toState: 'feasibility',
    trigger: 'return-to-feasibility',
    conditions: [
      (property: Property) => property.approvalState === 'needs-revision'
    ],
    onTransition: (property: Property) => {
      console.log(`Property ${property.id} EXCEPTION: entitlement → feasibility (re-work required)`);
    }
  }
];

/**
 * Check if a lifecycle transition is valid
 */
export function canTransition(
  property: Property,
  toState: LifecycleState
): { allowed: boolean; reason?: string } {
  const rule = STATE_TRANSITION_RULES.find(
    r => r.fromState === property.lifecycle && r.toState === toState
  );

  if (!rule) {
    return { allowed: false, reason: `No transition rule from ${property.lifecycle} to ${toState}` };
  }

  const allConditionsMet = rule.conditions.every(condition => condition(property));

  if (!allConditionsMet) {
    return { allowed: false, reason: 'Transition conditions not met' };
  }

  return { allowed: true };
}

/**
 * Get available transitions for current state
 */
export function getAvailableTransitions(property: Property): StateTransitionRule[] {
  return STATE_TRANSITION_RULES.filter(rule => {
    if (rule.fromState !== property.lifecycle) return false;
    const allConditionsMet = rule.conditions.every(condition => condition(property));
    return allConditionsMet;
  });
}

/**
 * Execute a lifecycle transition
 */
export function executeTransition(
  property: Property,
  toState: LifecycleState
): Property {
  const check = canTransition(property, toState);

  if (!check.allowed) {
    throw new Error(`Cannot transition: ${check.reason}`);
  }

  const rule = STATE_TRANSITION_RULES.find(
    r => r.fromState === property.lifecycle && r.toState === toState
  );

  if (rule?.onTransition) {
    rule.onTransition(property);
  }

  return {
    ...property,
    lifecycle: toState,
    updatedAt: new Date()
  };
}
