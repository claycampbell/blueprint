import { Property, DemoScenario } from '../types';
import { SCENARIO_B } from './scenarios/scenarioB';

/**
 * Sample properties for demo scenarios
 */
export const SAMPLE_PROPERTIES: Record<string, Property> = {
  'prop-001': {
    id: 'prop-001',
    type: 'subdivision',
    lifecycle: 'intake',
    status: 'active',
    approvalState: 'pending',
    riskLevel: 5.0,
    attributes: {
      address: '123 Main Street',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      parcelNumber: '1234567890',
      lotSizeSF: 8000,
      jurisdiction: 'Seattle',
      propertyValue: 450000,
      zoningDistrict: 'LR3'
    },
    activeProcesses: [],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2025-01-15T10:00:00Z'),
    updatedAt: new Date('2025-01-15T10:00:00Z'),
    createdBy: 'agent-001',
    assignedTo: 'acq-specialist-001'
  },

  'prop-002': {
    id: 'prop-002',
    type: 'multi-family-rehab',
    lifecycle: 'feasibility',
    status: 'active',
    approvalState: 'pending',
    riskLevel: 6.5,
    attributes: {
      address: '456 Oak Avenue',
      city: 'Shoreline',
      state: 'WA',
      zip: '98133',
      lotSizeSF: 12000,
      estimatedBuildableSF: 9600,
      jurisdiction: 'Shoreline',
      propertyValue: 620000
    },
    activeProcesses: [
      {
        id: 'proc-001',
        type: 'feasibility-analysis',
        status: 'in-progress',
        propertyId: 'prop-002',
        assignedTo: 'design-lead-001',
        startedAt: new Date('2025-01-16T08:00:00Z'),
        dueDate: new Date('2025-01-30T17:00:00Z'),
        outputs: []
      },
      {
        id: 'proc-002',
        type: 'title-review',
        status: 'in-progress',
        propertyId: 'prop-002',
        assignedTo: 'title-consultant-001',
        startedAt: new Date('2025-01-17T09:00:00Z'),
        dueDate: new Date('2025-01-24T17:00:00Z'),
        outputs: []
      }
    ],
    processHistory: [],
    stateHistory: [
      {
        id: 'state-001',
        propertyId: 'prop-002',
        stateType: 'lifecycle',
        previousValue: 'intake',
        newValue: 'feasibility',
        changedAt: new Date('2025-01-16T08:00:00Z'),
        changedBy: 'system',
        processId: 'proc-000'
      }
    ],
    createdAt: new Date('2025-01-14T14:30:00Z'),
    updatedAt: new Date('2025-01-17T09:00:00Z'),
    createdBy: 'agent-002',
    assignedTo: 'acq-specialist-002'
  },

  'prop-003': {
    id: 'prop-003',
    type: 'land-banking',
    lifecycle: 'feasibility',
    status: 'active',
    approvalState: 'approved',
    riskLevel: 3.0,
    attributes: {
      address: '789 Pine Road',
      city: 'Bellevue',
      state: 'WA',
      zip: '98004',
      lotSizeSF: 25000,
      estimatedBuildableSF: 15000,
      jurisdiction: 'Bellevue',
      propertyValue: 1200000,
      zoningDistrict: 'R-5'
    },
    activeProcesses: [],
    processHistory: [
      {
        id: 'proc-003',
        type: 'feasibility-analysis',
        status: 'completed',
        propertyId: 'prop-003',
        assignedTo: 'design-lead-001',
        startedAt: new Date('2025-01-10T08:00:00Z'),
        completedAt: new Date('2025-01-15T17:00:00Z'),
        outputs: [
          {
            key: 'viabilityScore',
            value: 8.5,
            type: 'score',
            timestamp: new Date('2025-01-15T17:00:00Z')
          },
          {
            key: 'goNoGoDecision',
            value: 'GO',
            type: 'recommendation',
            timestamp: new Date('2025-01-15T17:00:00Z')
          }
        ],
        archivedAt: new Date('2025-01-15T17:00:00Z')
      }
    ],
    stateHistory: [
      {
        id: 'state-002',
        propertyId: 'prop-003',
        stateType: 'lifecycle',
        previousValue: 'intake',
        newValue: 'feasibility',
        changedAt: new Date('2025-01-10T08:00:00Z'),
        changedBy: 'system',
        processId: 'proc-003'
      },
      {
        id: 'state-003',
        propertyId: 'prop-003',
        stateType: 'approval',
        previousValue: 'pending',
        newValue: 'approved',
        changedAt: new Date('2025-01-15T17:00:00Z'),
        changedBy: 'acq-specialist-001',
        reason: 'Feasibility analysis complete, GO decision confirmed'
      }
    ],
    createdAt: new Date('2025-01-08T10:00:00Z'),
    updatedAt: new Date('2025-01-15T17:00:00Z'),
    createdBy: 'agent-003',
    assignedTo: 'acq-specialist-001'
  }
};

/**
 * Demo scenarios showing model advantages/disadvantages
 */
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scenario-a',
    name: 'Happy Path: Standard Subdivision',
    description: 'Property progresses linearly through all stages without exceptions',
    propertyType: 'subdivision',
    events: [
      {
        timestamp: 0,
        type: 'process-start',
        description: 'Start intake qualification',
        processType: 'intake-qualification'
      },
      {
        timestamp: 2000,
        type: 'process-complete',
        description: 'Intake qualification complete',
        processType: 'intake-qualification'
      },
      {
        timestamp: 2500,
        type: 'state-change',
        description: 'Lifecycle: intake → feasibility',
        stateChange: {
          stateType: 'lifecycle',
          previousValue: 'intake',
          newValue: 'feasibility'
        }
      },
      {
        timestamp: 3000,
        type: 'process-start',
        description: 'Start feasibility analysis',
        processType: 'feasibility-analysis'
      },
      {
        timestamp: 3500,
        type: 'process-start',
        description: 'Start zoning review (concurrent)',
        processType: 'zoning-review'
      },
      {
        timestamp: 6000,
        type: 'process-complete',
        description: 'Zoning review complete',
        processType: 'zoning-review'
      },
      {
        timestamp: 8000,
        type: 'process-complete',
        description: 'Feasibility analysis complete',
        processType: 'feasibility-analysis'
      },
      {
        timestamp: 8500,
        type: 'user-action',
        description: 'User approves feasibility',
        userAction: 'approve-feasibility'
      },
      {
        timestamp: 9000,
        type: 'state-change',
        description: 'Lifecycle: feasibility → entitlement',
        stateChange: {
          stateType: 'lifecycle',
          previousValue: 'feasibility',
          newValue: 'entitlement'
        }
      }
    ],
    expectedOutcomes: {
      workflow: [
        'Property advances through stages naturally',
        'Clear progress indicators at each stage',
        'Simple mental model for users'
      ],
      stateMachine: [
        'Property state visible at all times',
        'Concurrent processes clearly shown',
        'More flexibility but potentially more complex'
      ]
    }
  },

  SCENARIO_B,

  {
    id: 'scenario-c',
    name: 'Concurrent Processes',
    description: 'Multiple processes run simultaneously on same property',
    propertyType: 'adaptive-reuse',
    events: [
      {
        timestamp: 0,
        type: 'state-change',
        description: 'Property in entitlement phase',
        stateChange: {
          stateType: 'lifecycle',
          previousValue: 'feasibility',
          newValue: 'entitlement'
        }
      },
      {
        timestamp: 500,
        type: 'process-start',
        description: 'Start entitlement preparation',
        processType: 'entitlement-preparation'
      },
      {
        timestamp: 2000,
        type: 'process-start',
        description: 'Environmental assessment needed (concurrent)',
        processType: 'environmental-assessment'
      },
      {
        timestamp: 3000,
        type: 'process-start',
        description: 'Title update required (concurrent)',
        processType: 'title-review'
      },
      {
        timestamp: 6000,
        type: 'process-complete',
        description: 'Title review complete',
        processType: 'title-review'
      },
      {
        timestamp: 8000,
        type: 'process-complete',
        description: 'Environmental assessment complete',
        processType: 'environmental-assessment'
      },
      {
        timestamp: 10000,
        type: 'process-complete',
        description: 'Entitlement preparation complete',
        processType: 'entitlement-preparation'
      }
    ],
    expectedOutcomes: {
      workflow: [
        '❌ Confusion: where does property "live" during concurrent work?',
        '❌ Need sub-workflows or parallel tracks',
        '❌ Complex stage management'
      ],
      stateMachine: [
        '✅ Clear: property in entitlement lifecycle',
        '✅ Multiple processes visible as active cards',
        '✅ Each process has independent status'
      ]
    }
  },

  {
    id: 'scenario-d',
    name: 'Property Type Variations',
    description: 'Different property types follow different paths',
    propertyType: 'multi-family-rehab',
    events: [
      {
        timestamp: 0,
        type: 'state-change',
        description: 'Multi-family rehab property (skips entitlement)',
        stateChange: {
          stateType: 'lifecycle',
          previousValue: 'intake',
          newValue: 'feasibility'
        }
      },
      {
        timestamp: 1000,
        type: 'process-start',
        description: 'Start feasibility analysis',
        processType: 'feasibility-analysis'
      },
      {
        timestamp: 5000,
        type: 'process-complete',
        description: 'Feasibility analysis complete',
        processType: 'feasibility-analysis'
      },
      {
        timestamp: 5500,
        type: 'user-action',
        description: 'User approves feasibility',
        userAction: 'approve-feasibility'
      },
      {
        timestamp: 6000,
        type: 'state-change',
        description: 'Lifecycle: feasibility → construction (SKIP entitlement)',
        stateChange: {
          stateType: 'lifecycle',
          previousValue: 'feasibility',
          newValue: 'construction'
        }
      },
      {
        timestamp: 6500,
        type: 'process-start',
        description: 'Start construction',
        processType: 'construction-start'
      }
    ],
    expectedOutcomes: {
      workflow: [
        '❌ Need multiple workflow definitions per property type',
        '❌ Or complex branching logic',
        '❌ "Why is this property skipping stages?"'
      ],
      stateMachine: [
        '✅ Property type determines available processes',
        '✅ Lifecycle transitions adapt to property type',
        '✅ New property types = new process definitions, not new workflows'
      ]
    }
  }
];

/**
 * Get sample property by ID
 */
export function getProperty(id: string): Property | undefined {
  return SAMPLE_PROPERTIES[id];
}

/**
 * Get scenario by ID
 */
export function getScenario(id: string): DemoScenario | undefined {
  return DEMO_SCENARIOS.find(s => s.id === id);
}
