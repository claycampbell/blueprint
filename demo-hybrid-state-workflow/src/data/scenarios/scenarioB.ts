import { DemoScenario } from '../../types';

/**
 * Scenario B: Exception Handling - Return to Feasibility from Entitlement
 *
 * This scenario demonstrates the critical difference between workflow and state machine
 * models when handling exceptions that require backwards transitions.
 *
 * STORY: A property in entitlement discovers a zoning issue that requires
 * returning to feasibility for additional analysis.
 *
 * WORKFLOW MODEL (Traditional) - Shows PROBLEMS:
 * - ❌ Error: "Cannot move backwards in workflow"
 * - ❌ Need workaround: create special "re-feasibility" stage
 * - ❌ Stage indicators break (can't show going backwards)
 * - ❌ User confusion: Is this a new property or existing property?
 * - ❌ Loss of context: Original feasibility work is disconnected
 *
 * STATE MACHINE MODEL (Hybrid) - Shows SOLUTION:
 * - ✅ Natural state transition: lifecycle: entitlement → feasibility
 * - ✅ Start new "Feasibility Re-Analysis" process
 * - ✅ Full audit trail showing why state changed
 * - ✅ Original feasibility work remains in process history
 * - ✅ All context preserved
 */
export const SCENARIO_B: DemoScenario = {
  id: 'scenario-b',
  name: 'Exception Handling: Return to Feasibility',
  description: 'Property in entitlement discovers zoning issue requiring return to feasibility',
  propertyType: 'subdivision',

  events: [
    // SETUP: Property has successfully completed feasibility and is now in entitlement
    {
      timestamp: 0,
      type: 'state-change',
      description: 'Initial state: Property in entitlement phase (feasibility completed)',
      stateChange: {
        stateType: 'lifecycle',
        previousValue: 'feasibility',
        newValue: 'entitlement'
      }
    },

    // ENTITLEMENT WORK BEGINS
    {
      timestamp: 500,
      type: 'process-start',
      description: 'Start entitlement preparation process',
      processType: 'entitlement-preparation'
    },

    {
      timestamp: 2000,
      type: 'process-complete',
      description: 'Entitlement package prepared',
      processType: 'entitlement-preparation'
    },

    {
      timestamp: 2500,
      type: 'process-start',
      description: 'Submit permits to jurisdiction',
      processType: 'permit-submission'
    },

    // THE CRITICAL MOMENT: ZONING ISSUE DISCOVERED
    {
      timestamp: 5000,
      type: 'user-action',
      description: '🚨 ISSUE DISCOVERED: Jurisdiction identifies zoning variance requirement',
      userAction: 'zoning-issue-discovered'
    },

    {
      timestamp: 5500,
      type: 'state-change',
      description: 'Approval state changes: approved → needs-revision',
      stateChange: {
        stateType: 'approval',
        previousValue: 'approved',
        newValue: 'needs-revision'
      }
    },

    // THE KEY EVENT: BACKWARDS TRANSITION (This is where workflow breaks!)
    {
      timestamp: 6000,
      type: 'state-change',
      description: '⚠️ BACKWARDS TRANSITION: Lifecycle: entitlement → feasibility',
      stateChange: {
        stateType: 'lifecycle',
        previousValue: 'entitlement',
        newValue: 'feasibility'
      }
    },

    // RE-FEASIBILITY WORK BEGINS
    {
      timestamp: 6500,
      type: 'process-start',
      description: 'Start zoning variance analysis (re-feasibility)',
      processType: 'zoning-review'
    },

    {
      timestamp: 7000,
      type: 'user-action',
      description: 'Assign to senior design specialist for variance strategy',
      userAction: 'reassign-specialist'
    },

    {
      timestamp: 9500,
      type: 'process-complete',
      description: 'Zoning variance analysis complete - variance strategy identified',
      processType: 'zoning-review'
    },

    {
      timestamp: 10000,
      type: 'state-change',
      description: 'Approval state changes: needs-revision → approved',
      stateChange: {
        stateType: 'approval',
        previousValue: 'needs-revision',
        newValue: 'approved'
      }
    },

    // BACK TO ENTITLEMENT (Now with variance strategy)
    {
      timestamp: 10500,
      type: 'state-change',
      description: 'Lifecycle: feasibility → entitlement (with variance plan)',
      stateChange: {
        stateType: 'lifecycle',
        previousValue: 'feasibility',
        newValue: 'entitlement'
      }
    },

    {
      timestamp: 11000,
      type: 'process-start',
      description: 'Re-submit permits with variance application',
      processType: 'permit-submission'
    }
  ],

  expectedOutcomes: {
    workflow: [
      '❌ Workflow Error: Cannot return to previous stage',
      '❌ Workflow only supports forward progression',
      '❌ Workaround needed: Create "Re-Feasibility" stage or start new workflow',
      '❌ User confusion: Stage indicators don\'t reflect current reality',
      '❌ Data integrity risk: Original feasibility work may be lost or duplicated'
    ],
    stateMachine: [
      '✅ State machine handles backwards transition naturally',
      '✅ Lifecycle state changes from entitlement → feasibility',
      '✅ New zoning review process starts independently',
      '✅ Full audit trail preserved in state history',
      '✅ Original feasibility work intact in process history',
      '✅ Clear reason for state change visible to all stakeholders'
    ]
  }
};
