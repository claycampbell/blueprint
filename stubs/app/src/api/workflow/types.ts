/**
 * Workflow Types
 *
 * Domain types for SpiffWorkflow POC - projects, decisions, and workflow state.
 */

// =============================================================================
// ENUMS & LITERALS
// =============================================================================

export type DecisionAction = 'approve' | 'send_back' | 'skip_to' | 'complete_wfg';
export type WorkflowGroupId = 'WFG1' | 'WFG2' | 'WFG3';
export type WorkflowItemId = 'WFI1' | 'WFI2';
export type ProjectStatus = 'active' | 'completed' | 'cancelled';

// =============================================================================
// WORKFLOW STRUCTURE TYPES
// =============================================================================

export interface WorkflowItemInfo {
  id: string;
  name: string;
}

export interface WorkflowStepInfo {
  id: string;
  name: string;
  description: string | null;
  workflow_items: WorkflowItemInfo[];
}

export interface AvailableTransitions {
  can_approve: boolean;
  approve_target: WorkflowStepInfo | null;
  can_send_back: boolean;
  send_back_targets: WorkflowStepInfo[];
  can_skip_to: boolean;
  skip_to_targets: WorkflowStepInfo[];
}

// =============================================================================
// PROJECT TYPES
// =============================================================================

export interface Comment {
  id: string;
  workflow_group: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface WorkflowHistoryEntry {
  id: string;
  from_workflow_group: string | null;
  to_workflow_group: string | null;
  action: string;
  reason: string | null;
  decision_maker_name: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  current_value_stream: string;
  current_workflow_group: string | null;
  current_workflow_item: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  current_step: WorkflowStepInfo | null;
  current_wfi: WorkflowItemInfo | null;
  available_transitions: AvailableTransitions | null;
  comments: Comment[];
  history: WorkflowHistoryEntry[];
}

export interface ProjectListItem {
  id: string;
  name: string;
  current_workflow_group: string | null;
  status: ProjectStatus;
  created_at: string;
  comment_count: number;
}

// =============================================================================
// RESPONSE TYPES
// =============================================================================

export interface DecisionResponse {
  success: boolean;
  message: string;
  previous_step: string | null;
  current_step: string | null;
  project: Project;
}

// =============================================================================
// REQUEST TYPES
// =============================================================================

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface AddCommentRequest {
  content: string;
  user_name?: string;
}

export interface MakeDecisionRequest {
  action: DecisionAction;
  target_step?: WorkflowGroupId;
  target_wfi?: WorkflowItemId;
  reason?: string;
}
