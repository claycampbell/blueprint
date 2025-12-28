/**
 * Workflow Definitions Mutations
 *
 * TanStack Query mutation hooks for modifying workflow definitions.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/query-client';
import { workflowDefinitionKeys } from './keys';
import type {
  WorkflowDefinitionResponse,
  WorkflowVersionResponse,
  BpmnValidationResponse,
  CreateDefinitionRequest,
  UpdateDefinitionRequest,
  CreateVersionRequest,
  ValidateBpmnRequest,
} from './types';

const BASE_URL = '/api/v1/workflow-definitions';

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Create a new workflow definition
 */
export async function createDefinition(
  data: CreateDefinitionRequest
): Promise<WorkflowDefinitionResponse> {
  const response = await apiClient.post<WorkflowDefinitionResponse>(BASE_URL, data);
  return response.data;
}

/**
 * Update workflow definition metadata
 */
export async function updateDefinition(
  definitionId: string,
  data: UpdateDefinitionRequest
): Promise<WorkflowDefinitionResponse> {
  const response = await apiClient.patch<WorkflowDefinitionResponse>(
    `${BASE_URL}/${definitionId}`,
    data
  );
  return response.data;
}

/**
 * Delete a workflow definition
 */
export async function deleteDefinition(definitionId: string): Promise<void> {
  await apiClient.delete(`${BASE_URL}/${definitionId}`);
}

/**
 * Create a new version of a workflow definition
 */
export async function createVersion(
  definitionId: string,
  data: CreateVersionRequest
): Promise<WorkflowVersionResponse> {
  const response = await apiClient.post<WorkflowVersionResponse>(
    `${BASE_URL}/${definitionId}/versions`,
    data
  );
  return response.data;
}

/**
 * Publish a specific version
 */
export async function publishVersion(
  definitionId: string,
  versionNumber: number
): Promise<WorkflowVersionResponse> {
  const response = await apiClient.post<WorkflowVersionResponse>(
    `${BASE_URL}/${definitionId}/versions/${versionNumber}/publish`
  );
  return response.data;
}

/**
 * Rollback to a previous version
 */
export async function rollbackToVersion(
  definitionId: string,
  versionNumber: number
): Promise<WorkflowVersionResponse> {
  const response = await apiClient.post<WorkflowVersionResponse>(
    `${BASE_URL}/${definitionId}/versions/${versionNumber}/rollback`
  );
  return response.data;
}

/**
 * Validate BPMN XML without saving
 */
export async function validateBpmn(
  data: ValidateBpmnRequest
): Promise<BpmnValidationResponse> {
  const response = await apiClient.post<BpmnValidationResponse>(
    `${BASE_URL}/validate`,
    data
  );
  return response.data;
}

// =============================================================================
// MUTATION HOOKS
// =============================================================================

/**
 * Hook to create a new workflow definition
 *
 * @example
 * const createMutation = useCreateWorkflowDefinition();
 * createMutation.mutate({ name: 'New Workflow', process_id: 'test', bpmn_xml: '...' });
 */
export function useCreateWorkflowDefinition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDefinition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowDefinitionKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create definition:', getErrorMessage(error));
    },
  });
}

/**
 * Hook to update a workflow definition
 *
 * @example
 * const updateMutation = useUpdateWorkflowDefinition();
 * updateMutation.mutate({ definitionId: 'uuid', data: { name: 'Updated Name' } });
 */
export function useUpdateWorkflowDefinition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ definitionId, data }: { definitionId: string; data: UpdateDefinitionRequest }) =>
      updateDefinition(definitionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workflowDefinitionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: workflowDefinitionKeys.detail(variables.definitionId),
      });
    },
    onError: (error) => {
      console.error('Failed to update definition:', getErrorMessage(error));
    },
  });
}

/**
 * Hook to delete a workflow definition
 *
 * @example
 * const deleteMutation = useDeleteWorkflowDefinition();
 * deleteMutation.mutate('uuid');
 */
export function useDeleteWorkflowDefinition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDefinition,
    onSuccess: (_, definitionId) => {
      queryClient.invalidateQueries({ queryKey: workflowDefinitionKeys.lists() });
      queryClient.removeQueries({ queryKey: workflowDefinitionKeys.detail(definitionId) });
    },
    onError: (error) => {
      console.error('Failed to delete definition:', getErrorMessage(error));
    },
  });
}

/**
 * Hook to create a new version
 *
 * @example
 * const versionMutation = useCreateWorkflowVersion();
 * versionMutation.mutate({
 *   definitionId: 'uuid',
 *   data: { bpmn_xml: '...', change_notes: 'Updated flow', publish: true }
 * });
 */
export function useCreateWorkflowVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ definitionId, data }: { definitionId: string; data: CreateVersionRequest }) =>
      createVersion(definitionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workflowDefinitionKeys.detail(variables.definitionId),
      });
      queryClient.invalidateQueries({ queryKey: workflowDefinitionKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create version:', getErrorMessage(error));
    },
  });
}

/**
 * Hook to publish a specific version
 *
 * @example
 * const publishMutation = usePublishWorkflowVersion();
 * publishMutation.mutate({ definitionId: 'uuid', versionNumber: 2 });
 */
export function usePublishWorkflowVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ definitionId, versionNumber }: { definitionId: string; versionNumber: number }) =>
      publishVersion(definitionId, versionNumber),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workflowDefinitionKeys.detail(variables.definitionId),
      });
      queryClient.invalidateQueries({ queryKey: workflowDefinitionKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to publish version:', getErrorMessage(error));
    },
  });
}

/**
 * Hook to rollback to a previous version
 *
 * @example
 * const rollbackMutation = useRollbackWorkflowVersion();
 * rollbackMutation.mutate({ definitionId: 'uuid', versionNumber: 1 });
 */
export function useRollbackWorkflowVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ definitionId, versionNumber }: { definitionId: string; versionNumber: number }) =>
      rollbackToVersion(definitionId, versionNumber),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workflowDefinitionKeys.detail(variables.definitionId),
      });
      queryClient.invalidateQueries({ queryKey: workflowDefinitionKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to rollback version:', getErrorMessage(error));
    },
  });
}

/**
 * Hook to validate BPMN XML
 *
 * @example
 * const validateMutation = useValidateBpmn();
 * const result = await validateMutation.mutateAsync({ bpmn_xml: '...', process_id: 'test' });
 * if (result.valid) { ... }
 */
export function useValidateBpmn() {
  return useMutation({
    mutationFn: validateBpmn,
    onError: (error) => {
      console.error('Failed to validate BPMN:', getErrorMessage(error));
    },
  });
}
