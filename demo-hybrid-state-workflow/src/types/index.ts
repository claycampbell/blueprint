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

export type EntitlementStatus =
  | 'planning'
  | 'pre-submittal-qa'
  | 'submitted'
  | 'under-review'
  | 'corrections-received'
  | 'corrections-assigned'
  | 'addressing-corrections'
  | 'corrections-qa'
  | 'resubmitted'
  | 'approved'
  | 'rejected'
  | 'on-hold';

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

  // Entitlement subprocess (only populated when lifecycle === 'entitlement')
  entitlementStatus?: EntitlementStatus;
  correctionLetters?: CorrectionLetter[];

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
// Entitlement Subprocess - Correction Management
// ============================================================================

export type CorrectionDiscipline =
  | 'civil'
  | 'structural'
  | 'architectural'
  | 'landscape'
  | 'mechanical'
  | 'electrical'
  | 'plumbing'
  | 'fire'
  | 'zoning'
  | 'other';

export type CorrectionSeverity =
  | 'critical'
  | 'major'
  | 'minor';

export type CorrectionItemStatus =
  | 'not-started'
  | 'in-progress'
  | 'consultant-submitted'
  | 'internal-review'
  | 'approved'
  | 'needs-revision'
  | 'completed';

export type CorrectionLetterStatus =
  | 'received'
  | 'triaging'
  | 'assigned'
  | 'in-progress'
  | 'in-qa'
  | 'ready-to-submit'
  | 'submitted';

export interface CorrectionLetter {
  id: string;
  propertyId: string;
  permitApplicationId: string;

  // Document metadata
  jurisdictionDocumentId?: string;
  letterDate: Date;
  receivedDate: Date;
  roundNumber: number;

  // Document storage
  documentUrl: string;
  documentHash: string;
  extractedText?: string;

  // Summary metrics (calculated from child items)
  totalItems: number;
  itemsCompleted: number;
  itemsInProgress: number;
  itemsNotStarted: number;

  // Deadlines
  responseDueDate?: Date;
  internalTargetDate?: Date;

  // Status tracking
  status: CorrectionLetterStatus;

  // Child items
  items: CorrectionItem[];

  // Metadata
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
}

export interface CorrectionItem {
  id: string;
  correctionLetterId: string;
  propertyId: string;

  // Item identification
  itemNumber: string;
  discipline: CorrectionDiscipline;

  // Content
  description: string;
  notes?: string;

  // Sheet references
  sheetNumbers?: string[];
  detailReferences?: string[];

  // Classification
  severity: CorrectionSeverity;
  category?: string;
  estimatedEffortHours?: number;

  // Assignment
  assignedToConsultantId?: string;
  assignedToPerson?: string;
  assignedDate?: Date;
  dueDate?: Date;

  // Response tracking
  status: CorrectionItemStatus;
  responseDescription?: string;
  responseDocumentUrls?: string[];
  revisedSheetNumbers?: string[];

  // Review
  reviewedBy?: string;
  reviewedDate?: Date;

  // Metadata
  createdAt: Date;
  createdBy: string;
  extractionMethod: 'manual' | 'ai-assisted' | 'ai-auto';
  updatedAt: Date;
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
