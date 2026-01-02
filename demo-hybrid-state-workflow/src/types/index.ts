/**
 * Core type definitions for hybrid state machine + workflow demo
 */

// ============================================================================
// Property Entity (Central State-Based Object)
// ============================================================================

export type LifecycleState =
  | 'intake'
  | 'feasibility'
  | 'entitlement'
  | 'construction'
  | 'servicing'
  | 'closed';

export type PropertyStatus =
  | 'active'
  | 'paused'
  | 'on-hold'
  | 'closed';

export type ApprovalState =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs-revision';

export type PropertyType =
  | 'subdivision'
  | 'multi-family-rehab'
  | 'land-banking'
  | 'adaptive-reuse';

export interface PropertyAttributes {
  address: string;
  city: string;
  state: string;
  zip: string;
  parcelNumber?: string;
  lotSizeSF: number;
  estimatedBuildableSF?: number;
  jurisdiction: string;
  propertyValue?: number;
  zoningDistrict?: string;
  imageUrl?: string;
}

export interface Property {
  id: string;
  type: PropertyType;

  // State dimensions (not stages!)
  lifecycle: LifecycleState;
  status: PropertyStatus;
  approvalState: ApprovalState;
  riskLevel: number; // 0-10 score

  // Property data
  attributes: PropertyAttributes;

  // Current and historical processes
  activeProcesses: Process[];
  processHistory: ProcessHistoryEntry[];

  // State transitions
  stateHistory: StateChange[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo?: string;
}

// ============================================================================
// Process Entity (Operations on Properties)
// ============================================================================

export type ProcessType =
  | 'intake-qualification'
  | 'feasibility-analysis'
  | 'zoning-review'
  | 'title-review'
  | 'environmental-assessment'
  | 'arborist-review'
  | 'entitlement-preparation'
  | 'permit-submission'
  | 'construction-start';

export type ProcessStatus =
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'blocked';

export interface ProcessDefinition {
  type: ProcessType;
  name: string;
  description: string;
  estimatedDurationDays: number;
  requiredFor: PropertyType[];
  prerequisites?: ProcessType[];
  outputs: string[];
}

export interface Process {
  id: string;
  type: ProcessType;
  status: ProcessStatus;
  propertyId: string;

  assignedTo?: string;
  startedAt?: Date;
  completedAt?: Date;
  dueDate?: Date;

  outputs: ProcessOutput[];
  notes?: string;
}

export interface ProcessOutput {
  key: string;
  value: any;
  type: 'data' | 'document' | 'score' | 'recommendation';
  timestamp: Date;
}

export interface ProcessHistoryEntry extends Process {
  archivedAt: Date;
}

// ============================================================================
// State Machine & Transitions
// ============================================================================

export type StateType =
  | 'lifecycle'
  | 'status'
  | 'approval'
  | 'risk';

export interface StateChange {
  id: string;
  propertyId: string;
  stateType: StateType;
  previousValue: string | number;
  newValue: string | number;
  changedAt: Date;
  changedBy: string;
  processId?: string; // Which process caused this change
  reason?: string;
}

export interface StateTransitionRule {
  fromState: LifecycleState;
  toState: LifecycleState;
  trigger: string;
  conditions: ((property: Property) => boolean)[];
  onTransition?: (property: Property) => void;
}

// ============================================================================
// Business Rules
// ============================================================================

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  condition: (property: Property) => boolean;
  action: (property: Property) => void;
  enforced: 'automatic' | 'manual';
}

// ============================================================================
// UI View Models
// ============================================================================

export interface WorkflowStageView {
  stage: LifecycleState;
  displayName: string;
  description: string;
  checklist: ChecklistItem[];
  canAdvance: boolean;
  canGoBack: boolean;
  nextStage?: LifecycleState;
  previousStage?: LifecycleState;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
  processType?: ProcessType;
}

export interface StateMachineView {
  property: Property;
  availableProcesses: ProcessDefinition[];
  availableActions: Action[];
  recentStateChanges: StateChange[];
}

export interface Action {
  id: string;
  label: string;
  icon?: string;
  enabled: boolean;
  disabledReason?: string;
  execute: () => void;
}

// ============================================================================
// Demo Scenarios
// ============================================================================

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  propertyType: PropertyType;
  events: ScenarioEvent[];
  expectedOutcomes: {
    workflow: string[];
    stateMachine: string[];
  };
}

export interface ScenarioEvent {
  timestamp: number; // Milliseconds from start
  type: 'process-start' | 'process-complete' | 'state-change' | 'user-action';
  description: string;
  processType?: ProcessType;
  stateChange?: Partial<StateChange>;
  userAction?: string;
}
