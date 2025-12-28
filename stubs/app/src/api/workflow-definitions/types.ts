/**
 * Workflow Definitions Types
 *
 * Domain types for workflow definitions and versions.
 */

// =============================================================================
// STATUS & ENUMS
// =============================================================================

export type DefinitionStatus = 'draft' | 'published' | 'archived';

// =============================================================================
// RESPONSE TYPES
// =============================================================================

export interface WorkflowVersionResponse {
  id: string;
  definition_id: string;
  version: number;
  bpmn_xml: string;
  change_notes: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface WorkflowDefinitionResponse {
  id: string;
  name: string;
  description: string | null;
  process_id: string;
  status: DefinitionStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  active_version: WorkflowVersionResponse | null;
  version_count: number;
}

export interface WorkflowDefinitionListResponse {
  id: string;
  name: string;
  description: string | null;
  process_id: string;
  status: DefinitionStatus;
  created_by: string;
  created_at: string;
  active_version_number: number | null;
  version_count: number;
}

export interface WorkflowDefinitionDetailResponse {
  id: string;
  name: string;
  description: string | null;
  process_id: string;
  status: DefinitionStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  versions: WorkflowVersionResponse[];
}

export interface BpmnValidationResponse {
  valid: boolean;
  errors: string[];
  process_ids: string[];
  warnings: string[];
}

// =============================================================================
// REQUEST TYPES
// =============================================================================

export interface CreateDefinitionRequest {
  name: string;
  description?: string;
  process_id: string;
  bpmn_xml: string;
  change_notes?: string;
}

export interface UpdateDefinitionRequest {
  name?: string;
  description?: string;
  status?: DefinitionStatus;
}

export interface CreateVersionRequest {
  bpmn_xml: string;
  change_notes?: string;
  publish?: boolean;
}

export interface ValidateBpmnRequest {
  bpmn_xml: string;
  process_id?: string;
}
