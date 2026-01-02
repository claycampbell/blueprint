import { Property } from '../types';

/**
 * Comprehensive sample dataset with 18 properties across all lifecycle phases
 * Distribution: 3 intake, 5 feasibility, 3 entitlement, 2 construction, 5 servicing
 */
export const MULTIPLE_PROPERTIES: Record<string, Property> = {
  // ========== INTAKE (3 properties) ==========
  'prop-001': {
    id: 'prop-001',
    type: 'subdivision',
    lifecycle: 'intake',
    status: 'active',
    approvalState: 'needs-revision',
    riskLevel: 7.5,
    attributes: {
      address: '123 Main Street',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      parcelNumber: '1234567890',
      lotSizeSF: 8000,
      jurisdiction: 'Seattle',
      propertyValue: 450000,
      zoningDistrict: 'LR3',
      imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop'
    },
    activeProcesses: [
      {
        id: 'proc-001',
        type: 'intake-qualification',
        status: 'blocked',
        propertyId: 'prop-001',
        assignedTo: 'Sarah Chen',
        startedAt: new Date('2025-12-23T10:00:00Z'),
        dueDate: new Date('2025-12-28T17:00:00Z'), // OVERDUE
        outputs: [],
        notes: 'Waiting for updated financial docs from borrower'
      }
    ],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2025-01-15T10:00:00Z'),
    updatedAt: new Date('2025-01-15T10:00:00Z'),
    createdBy: 'agent-001',
    assignedTo: 'Sarah Chen'
  },

  'prop-002': {
    id: 'prop-002',
    type: 'multi-family-rehab',
    lifecycle: 'intake',
    status: 'active',
    approvalState: 'pending',
    riskLevel: 4.0,
    attributes: {
      address: '234 First Avenue',
      city: 'Tacoma',
      state: 'WA',
      zip: '98402',
      lotSizeSF: 15000,
      estimatedBuildableSF: 12000,
      jurisdiction: 'Tacoma',
      propertyValue: 580000,
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
    },
    activeProcesses: [],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2025-01-18T14:00:00Z'),
    updatedAt: new Date('2025-01-18T14:00:00Z'),
    createdBy: 'agent-002',
    assignedTo: 'Mike Torres'
  },

  'prop-003': {
    id: 'prop-003',
    type: 'adaptive-reuse',
    lifecycle: 'intake',
    status: 'active',
    approvalState: 'pending',
    riskLevel: 3.5,
    attributes: {
      address: '567 Second Boulevard',
      city: 'Everett',
      state: 'WA',
      zip: '98201',
      lotSizeSF: 20000,
      jurisdiction: 'Everett',
      propertyValue: 750000,
      imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop'
    },
    activeProcesses: [
      {
        id: 'proc-003',
        type: 'intake-qualification',
        status: 'in-progress',
        propertyId: 'prop-003',
        assignedTo: 'Jane Doe',
        startedAt: new Date('2025-12-29T09:00:00Z'),
        dueDate: new Date('2026-01-05T17:00:00Z'), // Due within week
        outputs: []
      }
    ],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2025-01-19T09:00:00Z'),
    updatedAt: new Date('2025-01-19T09:00:00Z'),
    createdBy: 'agent-003',
    assignedTo: 'Jane Doe'
  },

  // ========== FEASIBILITY (5 properties) ==========
  'prop-004': {
    id: 'prop-004',
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
      propertyValue: 620000,
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
    },
    activeProcesses: [
      {
        id: 'proc-004a',
        type: 'feasibility-analysis',
        status: 'in-progress',
        propertyId: 'prop-004',
        assignedTo: 'Sarah Chen',
        startedAt: new Date('2025-12-21T08:00:00Z'),
        dueDate: new Date('2026-01-20T17:00:00Z'), // Due this month
        outputs: []
      },
      {
        id: 'proc-004b',
        type: 'title-review',
        status: 'blocked',
        propertyId: 'prop-004',
        assignedTo: 'title-consultant-001',
        startedAt: new Date('2025-12-20T09:00:00Z'),
        dueDate: new Date('2025-12-26T17:00:00Z'), // OVERDUE
        outputs: [],
        notes: 'Waiting on title company response - 3rd party delay'
      }
    ],
    processHistory: [],
    stateHistory: [
      {
        id: 'state-004-1',
        propertyId: 'prop-004',
        stateType: 'lifecycle',
        previousValue: 'intake',
        newValue: 'feasibility',
        changedAt: new Date('2025-12-20T08:00:00Z'),
        changedBy: 'system',
        reason: 'Intake qualification completed - moving to feasibility'
      },
      {
        id: 'state-004-2',
        propertyId: 'prop-004',
        stateType: 'risk',
        previousValue: 5.0,
        newValue: 6.5,
        changedAt: new Date('2025-12-22T10:00:00Z'),
        changedBy: 'Sarah Chen',
        reason: 'Initial site visit revealed potential zoning concerns'
      }
    ],
    createdAt: new Date('2025-01-14T14:30:00Z'),
    updatedAt: new Date('2025-01-17T09:00:00Z'),
    createdBy: 'agent-004',
    assignedTo: 'Sarah Chen'
  },

  'prop-005': {
    id: 'prop-005',
    type: 'subdivision',
    lifecycle: 'feasibility',
    status: 'active',
    approvalState: 'pending',
    riskLevel: 5.0,
    attributes: {
      address: '890 Third Lane',
      city: 'Redmond',
      state: 'WA',
      zip: '98052',
      lotSizeSF: 18000,
      estimatedBuildableSF: 14000,
      jurisdiction: 'Redmond',
      propertyValue: 920000,
      zoningDistrict: 'R-4',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'
    },
    activeProcesses: [
      {
        id: 'proc-005a',
        type: 'feasibility-analysis',
        status: 'in-progress',
        propertyId: 'prop-005',
        assignedTo: 'Sarah Chen',
        startedAt: new Date('2025-12-20T08:00:00Z'),
        dueDate: new Date('2026-01-15T17:00:00Z'),
        outputs: []
      },
      {
        id: 'proc-005b',
        type: 'environmental-assessment',
        status: 'in-progress',
        propertyId: 'prop-005',
        assignedTo: 'Mike Torres',
        startedAt: new Date('2025-12-22T10:00:00Z'),
        dueDate: new Date('2026-01-08T17:00:00Z'),
        outputs: []
      },
      {
        id: 'proc-005c',
        type: 'zoning-review',
        status: 'in-progress',
        propertyId: 'prop-005',
        assignedTo: 'Jane Doe',
        startedAt: new Date('2025-12-21T09:00:00Z'),
        dueDate: new Date('2026-01-10T17:00:00Z'),
        outputs: []
      },
      {
        id: 'proc-005d',
        type: 'arborist-review',
        status: 'in-progress',
        propertyId: 'prop-005',
        assignedTo: 'Mike Torres',
        startedAt: new Date('2025-12-28T08:00:00Z'),
        dueDate: new Date('2026-01-12T17:00:00Z'),
        outputs: []
      }
    ],
    processHistory: [
      {
        id: 'proc-005-completed-1',
        type: 'title-review',
        status: 'completed',
        propertyId: 'prop-005',
        assignedTo: 'title-consultant-001',
        startedAt: new Date('2025-12-18T08:00:00Z'),
        completedAt: new Date('2025-12-27T16:00:00Z'),
        outputs: [
          {
            key: 'titleStatus',
            value: 'Clear - No liens',
            type: 'recommendation',
            timestamp: new Date('2025-12-27T16:00:00Z')
          }
        ],
        archivedAt: new Date('2025-12-27T16:00:00Z')
      }
    ],
    stateHistory: [
      {
        id: 'state-005-1',
        propertyId: 'prop-005',
        stateType: 'lifecycle',
        previousValue: 'intake',
        newValue: 'feasibility',
        changedAt: new Date('2025-12-18T08:00:00Z'),
        changedBy: 'system',
        reason: 'Intake qualification completed - moving to comprehensive feasibility'
      },
      {
        id: 'state-005-2',
        propertyId: 'prop-005',
        stateType: 'risk',
        previousValue: 6.5,
        newValue: 5.0,
        changedAt: new Date('2025-12-27T16:00:00Z'),
        changedBy: 'title-consultant-001',
        processId: 'proc-005-completed-1',
        reason: 'Title review complete - no liens found, risk reduced'
      }
    ],
    createdAt: new Date('2025-01-10T11:00:00Z'),
    updatedAt: new Date('2025-12-28T08:00:00Z'),
    createdBy: 'agent-005',
    assignedTo: 'Mike Torres'
  },

  'prop-006': {
    id: 'prop-006',
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
      zoningDistrict: 'R-5',
      imageUrl: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=400&h=300&fit=crop'
    },
    activeProcesses: [],
    processHistory: [
      {
        id: 'proc-006',
        type: 'feasibility-analysis',
        status: 'completed',
        propertyId: 'prop-006',
        assignedTo: 'Sarah Chen',
        startedAt: new Date('2026-01-05T08:00:00Z'),
        completedAt: new Date('2026-01-20T17:00:00Z'),
        outputs: [
          {
            key: 'viabilityScore',
            value: 8.5,
            type: 'score',
            timestamp: new Date('2026-01-20T17:00:00Z')
          },
          {
            key: 'goNoGoDecision',
            value: 'GO',
            type: 'recommendation',
            timestamp: new Date('2026-01-20T17:00:00Z')
          }
        ],
        archivedAt: new Date('2026-01-20T17:00:00Z')
      }
    ],
    stateHistory: [
      {
        id: 'state-006-1',
        propertyId: 'prop-006',
        stateType: 'lifecycle',
        previousValue: 'intake',
        newValue: 'feasibility',
        changedAt: new Date('2026-01-05T08:00:00Z'),
        changedBy: 'system',
        processId: 'proc-006',
        reason: 'Intake qualification completed successfully'
      },
      {
        id: 'state-006-2',
        propertyId: 'prop-006',
        stateType: 'risk',
        previousValue: 5.5,
        newValue: 3.0,
        changedAt: new Date('2026-01-20T17:00:00Z'),
        changedBy: 'Sarah Chen',
        processId: 'proc-006',
        reason: 'Feasibility analysis showed low risk profile'
      },
      {
        id: 'state-006-3',
        propertyId: 'prop-006',
        stateType: 'approval',
        previousValue: 'pending',
        newValue: 'approved',
        changedAt: new Date('2026-01-20T17:00:00Z'),
        changedBy: 'Sarah Chen',
        processId: 'proc-006',
        reason: 'Feasibility complete - GO decision confirmed'
      }
    ],
    createdAt: new Date('2025-01-08T10:00:00Z'),
    updatedAt: new Date('2026-01-20T17:00:00Z'),
    createdBy: 'agent-006',
    assignedTo: 'Sarah Chen'
  },

  'prop-007': {
    id: 'prop-007',
    type: 'subdivision',
    lifecycle: 'feasibility',
    status: 'active',
    approvalState: 'pending',
    riskLevel: 4.5,
    attributes: {
      address: '101 Elm Street',
      city: 'Kirkland',
      state: 'WA',
      zip: '98033',
      lotSizeSF: 10000,
      jurisdiction: 'Kirkland',
      propertyValue: 680000,
      zoningDistrict: 'R-6',
      imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'
    },
    activeProcesses: [
      {
        id: 'proc-007',
        type: 'zoning-review',
        status: 'in-progress',
        propertyId: 'prop-007',
        assignedTo: 'Jane Doe',
        startedAt: new Date('2025-12-25T08:00:00Z'),
        dueDate: new Date('2026-01-25T17:00:00Z'), // Due this month
        outputs: []
      }
    ],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2025-01-11T10:00:00Z'),
    updatedAt: new Date('2025-01-13T08:00:00Z'),
    createdBy: 'agent-007',
    assignedTo: 'Jane Doe'
  },

  'prop-008': {
    id: 'prop-008',
    type: 'adaptive-reuse',
    lifecycle: 'feasibility',
    status: 'active',
    approvalState: 'pending',
    riskLevel: 6.0,
    attributes: {
      address: '303 Fourth Court',
      city: 'Bellevue',
      state: 'WA',
      zip: '98005',
      lotSizeSF: 22000,
      jurisdiction: 'Bellevue',
      propertyValue: 1050000,
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop'
    },
    activeProcesses: [
      {
        id: 'proc-008',
        type: 'arborist-review',
        status: 'in-progress',
        propertyId: 'prop-008',
        assignedTo: 'Mike Torres',
        startedAt: new Date('2025-12-15T09:00:00Z'),
        dueDate: new Date('2026-02-05T17:00:00Z'), // On track (far future)
        outputs: []
      }
    ],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2025-01-12T13:00:00Z'),
    updatedAt: new Date('2025-01-14T09:00:00Z'),
    createdBy: 'agent-008',
    assignedTo: 'Mike Torres'
  },

  // ========== ENTITLEMENT (3 properties) ==========
  'prop-009': {
    id: 'prop-009',
    type: 'subdivision',
    lifecycle: 'entitlement',
    status: 'active',
    approvalState: 'pending',
    riskLevel: 5.5,
    attributes: {
      address: '202 Maple Drive',
      city: 'Seattle',
      state: 'WA',
      zip: '98115',
      lotSizeSF: 16000,
      estimatedBuildableSF: 12800,
      jurisdiction: 'Seattle',
      propertyValue: 850000,
      zoningDistrict: 'LR2',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'
    },
    activeProcesses: [
      {
        id: 'proc-009',
        type: 'entitlement-preparation',
        status: 'in-progress',
        propertyId: 'prop-009',
        assignedTo: 'Jane Doe',
        startedAt: new Date('2025-12-28T08:00:00Z'),
        dueDate: new Date('2026-01-07T17:00:00Z'), // Due within week
        outputs: []
      }
    ],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2025-01-02T10:00:00Z'),
    updatedAt: new Date('2025-01-05T08:00:00Z'),
    createdBy: 'agent-009',
    assignedTo: 'Jane Doe'
  },

  'prop-010': {
    id: 'prop-010',
    type: 'multi-family-rehab',
    lifecycle: 'entitlement',
    status: 'active',
    approvalState: 'approved',
    riskLevel: 4.0,
    attributes: {
      address: '404 Cedar Lane',
      city: 'Renton',
      state: 'WA',
      zip: '98055',
      lotSizeSF: 14000,
      jurisdiction: 'Renton',
      propertyValue: 720000,
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'
    },
    activeProcesses: [],
    processHistory: [
      {
        id: 'proc-010',
        type: 'permit-submission',
        status: 'completed',
        propertyId: 'prop-010',
        assignedTo: 'Sarah Chen',
        startedAt: new Date('2026-01-10T09:00:00Z'),
        completedAt: new Date('2025-01-18T16:00:00Z'),
        outputs: [
          {
            key: 'permitNumber',
            value: 'PERM-2025-0012',
            type: 'data',
            timestamp: new Date('2025-01-18T16:00:00Z')
          }
        ],
        archivedAt: new Date('2025-01-18T16:00:00Z')
      }
    ],
    stateHistory: [
      {
        id: 'state-010-1',
        propertyId: 'prop-010',
        stateType: 'lifecycle',
        previousValue: 'intake',
        newValue: 'feasibility',
        changedAt: new Date('2025-12-20T08:00:00Z'),
        changedBy: 'system',
        reason: 'Intake qualification completed'
      },
      {
        id: 'state-010-2',
        propertyId: 'prop-010',
        stateType: 'risk',
        previousValue: 6.5,
        newValue: 4.5,
        changedAt: new Date('2025-12-28T17:00:00Z'),
        changedBy: 'Mike Torres',
        reason: 'Title review clear - no liens found'
      },
      {
        id: 'state-010-3',
        propertyId: 'prop-010',
        stateType: 'lifecycle',
        previousValue: 'feasibility',
        newValue: 'entitlement',
        changedAt: new Date('2026-01-03T09:00:00Z'),
        changedBy: 'system',
        reason: 'All feasibility processes completed with GO decision'
      },
      {
        id: 'state-010-4',
        propertyId: 'prop-010',
        stateType: 'approval',
        previousValue: 'pending',
        newValue: 'approved',
        changedAt: new Date('2026-01-03T14:00:00Z'),
        changedBy: 'Sarah Chen',
        reason: 'Feasibility approved by acquisitions team'
      },
      {
        id: 'state-010-5',
        propertyId: 'prop-010',
        stateType: 'risk',
        previousValue: 4.5,
        newValue: 4.0,
        changedAt: new Date('2025-01-18T16:00:00Z'),
        changedBy: 'Sarah Chen',
        processId: 'proc-010',
        reason: 'Permit submission successful - entitlement risk reduced'
      }
    ],
    createdAt: new Date('2025-01-01T10:00:00Z'),
    updatedAt: new Date('2025-01-18T16:00:00Z'),
    createdBy: 'agent-010',
    assignedTo: 'Sarah Chen'
  },

  'prop-011': {
    id: 'prop-011',
    type: 'land-banking',
    lifecycle: 'entitlement',
    status: 'active',
    approvalState: 'pending',
    riskLevel: 7.0,
    attributes: {
      address: '505 Birch Avenue',
      city: 'Issaquah',
      state: 'WA',
      zip: '98027',
      lotSizeSF: 30000,
      jurisdiction: 'Issaquah',
      propertyValue: 1350000,
      zoningDistrict: 'R-8',
      imageUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=400&h=300&fit=crop'
    },
    activeProcesses: [
      {
        id: 'proc-011',
        type: 'permit-submission',
        status: 'blocked',
        propertyId: 'prop-011',
        assignedTo: 'Mike Torres',
        startedAt: new Date('2025-12-18T08:00:00Z'),
        dueDate: new Date('2025-12-27T17:00:00Z'), // OVERDUE
        outputs: [],
        notes: 'City requested additional environmental impact study'
      }
    ],
    processHistory: [],
    stateHistory: [
      {
        id: 'state-011-1',
        propertyId: 'prop-011',
        stateType: 'lifecycle',
        previousValue: 'intake',
        newValue: 'feasibility',
        changedAt: new Date('2025-11-15T08:00:00Z'),
        changedBy: 'system',
        reason: 'Intake qualification completed'
      },
      {
        id: 'state-011-2',
        propertyId: 'prop-011',
        stateType: 'lifecycle',
        previousValue: 'feasibility',
        newValue: 'entitlement',
        changedAt: new Date('2025-12-01T10:00:00Z'),
        changedBy: 'system',
        reason: 'Feasibility complete - moving to entitlement'
      },
      {
        id: 'state-011-3',
        propertyId: 'prop-011',
        stateType: 'lifecycle',
        previousValue: 'entitlement',
        newValue: 'feasibility',
        changedAt: new Date('2025-12-18T14:00:00Z'),
        changedBy: 'Mike Torres',
        reason: '⬅️ RETURNED TO FEASIBILITY: City identified wetlands issue requiring new environmental study'
      },
      {
        id: 'state-011-4',
        propertyId: 'prop-011',
        stateType: 'lifecycle',
        previousValue: 'feasibility',
        newValue: 'entitlement',
        changedAt: new Date('2025-12-22T16:00:00Z'),
        changedBy: 'system',
        reason: 'Environmental study complete - resuming entitlement process'
      },
      {
        id: 'state-011-5',
        propertyId: 'prop-011',
        stateType: 'risk',
        previousValue: 5.0,
        newValue: 7.0,
        changedAt: new Date('2025-12-18T14:00:00Z'),
        changedBy: 'Mike Torres',
        reason: 'Risk increased due to wetlands discovery'
      }
    ],
    createdAt: new Date('2025-12-23T10:00:00Z'),
    updatedAt: new Date('2026-01-05T08:00:00Z'),
    createdBy: 'agent-011',
    assignedTo: 'Mike Torres'
  },

  // ========== CONSTRUCTION (2 properties) ==========
  'prop-012': {
    id: 'prop-012',
    type: 'subdivision',
    lifecycle: 'construction',
    status: 'active',
    approvalState: 'approved',
    riskLevel: 3.5,
    attributes: {
      address: '606 Spruce Street',
      city: 'Bothell',
      state: 'WA',
      zip: '98011',
      lotSizeSF: 12000,
      estimatedBuildableSF: 10000,
      jurisdiction: 'Bothell',
      propertyValue: 780000,
      zoningDistrict: 'R-5',
      imageUrl: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop'
    },
    activeProcesses: [
      {
        id: 'proc-012',
        type: 'construction-start',
        status: 'in-progress',
        propertyId: 'prop-012',
        assignedTo: 'Jane Doe',
        startedAt: new Date('2025-12-20T08:00:00Z'),
        dueDate: new Date('2026-01-28T17:00:00Z'), // Due this month
        outputs: []
      }
    ],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2024-11-15T10:00:00Z'),
    updatedAt: new Date('2025-01-03T08:00:00Z'),
    createdBy: 'agent-012',
    assignedTo: 'Jane Doe'
  },

  'prop-013': {
    id: 'prop-013',
    type: 'adaptive-reuse',
    lifecycle: 'construction',
    status: 'active',
    approvalState: 'approved',
    riskLevel: 4.5,
    attributes: {
      address: '707 Willow Way',
      city: 'Mercer Island',
      state: 'WA',
      zip: '98040',
      lotSizeSF: 18000,
      jurisdiction: 'Mercer Island',
      propertyValue: 1150000,
      imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop'
    },
    activeProcesses: [],
    processHistory: [
      {
        id: 'proc-013',
        type: 'construction-start',
        status: 'completed',
        propertyId: 'prop-013',
        assignedTo: 'Mike Torres',
        startedAt: new Date('2024-12-15T08:00:00Z'),
        completedAt: new Date('2025-01-10T17:00:00Z'),
        outputs: [],
        archivedAt: new Date('2025-01-10T17:00:00Z')
      }
    ],
    stateHistory: [],
    createdAt: new Date('2024-10-01T10:00:00Z'),
    updatedAt: new Date('2025-01-10T17:00:00Z'),
    createdBy: 'agent-013',
    assignedTo: 'Mike Torres'
  },

  // ========== SERVICING (5 properties) ==========
  'prop-014': {
    id: 'prop-014',
    type: 'subdivision',
    lifecycle: 'servicing',
    status: 'active',
    approvalState: 'approved',
    riskLevel: 2.5,
    attributes: {
      address: '808 Poplar Drive',
      city: 'Federal Way',
      state: 'WA',
      zip: '98003',
      lotSizeSF: 11000,
      jurisdiction: 'Federal Way',
      propertyValue: 650000,
      zoningDistrict: 'R-4',
      imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop'
    },
    activeProcesses: [],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2024-08-01T10:00:00Z'),
    updatedAt: new Date('2025-01-15T12:00:00Z'),
    createdBy: 'agent-014',
    assignedTo: 'Sarah Chen'
  },

  'prop-015': {
    id: 'prop-015',
    type: 'multi-family-rehab',
    lifecycle: 'servicing',
    status: 'active',
    approvalState: 'approved',
    riskLevel: 3.0,
    attributes: {
      address: '909 Alder Court',
      city: 'Kent',
      state: 'WA',
      zip: '98032',
      lotSizeSF: 13000,
      jurisdiction: 'Kent',
      propertyValue: 690000,
      imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop'
    },
    activeProcesses: [],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2024-07-15T10:00:00Z'),
    updatedAt: new Date('2025-01-18T14:00:00Z'),
    createdBy: 'agent-015',
    assignedTo: 'Mike Torres'
  },

  'prop-016': {
    id: 'prop-016',
    type: 'land-banking',
    lifecycle: 'servicing',
    status: 'active',
    approvalState: 'approved',
    riskLevel: 1.5,
    attributes: {
      address: '1010 Ash Street',
      city: 'Auburn',
      state: 'WA',
      zip: '98001',
      lotSizeSF: 28000,
      jurisdiction: 'Auburn',
      propertyValue: 1280000,
      zoningDistrict: 'R-10',
      imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop'
    },
    activeProcesses: [],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2024-06-01T10:00:00Z'),
    updatedAt: new Date('2025-01-12T09:00:00Z'),
    createdBy: 'agent-016',
    assignedTo: 'Jane Doe'
  },

  'prop-017': {
    id: 'prop-017',
    type: 'subdivision',
    lifecycle: 'servicing',
    status: 'active',
    approvalState: 'approved',
    riskLevel: 2.0,
    attributes: {
      address: '1111 Fir Lane',
      city: 'Lynnwood',
      state: 'WA',
      zip: '98036',
      lotSizeSF: 9500,
      jurisdiction: 'Lynnwood',
      propertyValue: 620000,
      zoningDistrict: 'R-3',
      imageUrl: 'https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=400&h=300&fit=crop'
    },
    activeProcesses: [],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2024-05-10T10:00:00Z'),
    updatedAt: new Date('2025-01-16T11:00:00Z'),
    createdBy: 'agent-017',
    assignedTo: 'Sarah Chen'
  },

  'prop-018': {
    id: 'prop-018',
    type: 'adaptive-reuse',
    lifecycle: 'servicing',
    status: 'active',
    approvalState: 'approved',
    riskLevel: 2.8,
    attributes: {
      address: '1212 Hemlock Boulevard',
      city: 'Sammamish',
      state: 'WA',
      zip: '98074',
      lotSizeSF: 19000,
      jurisdiction: 'Sammamish',
      propertyValue: 1100000,
      imageUrl: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&h=300&fit=crop'
    },
    activeProcesses: [],
    processHistory: [],
    stateHistory: [],
    createdAt: new Date('2024-04-20T10:00:00Z'),
    updatedAt: new Date('2025-01-14T10:00:00Z'),
    createdBy: 'agent-018',
    assignedTo: 'Mike Torres'
  }
};
