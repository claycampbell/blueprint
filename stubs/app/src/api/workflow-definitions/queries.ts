/**
 * Workflow Definitions Queries
 *
 * TanStack Query hooks for fetching workflow definitions data.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { workflowDefinitionKeys } from './keys';
import type {
  DefinitionStatus,
  WorkflowDefinitionListResponse,
  WorkflowDefinitionDetailResponse,
  WorkflowVersionResponse,
} from './types';

const BASE_URL = '/api/v1/workflow-definitions';

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * List all workflow definitions
 */
export async function listDefinitions(
  statusFilter?: DefinitionStatus
): Promise<WorkflowDefinitionListResponse[]> {
  const params = statusFilter ? { status_filter: statusFilter } : {};
  const response = await apiClient.get<WorkflowDefinitionListResponse[]>(BASE_URL, { params });
  return response.data;
}

/**
 * Get a workflow definition with all versions
 */
export async function getDefinition(
  definitionId: string
): Promise<WorkflowDefinitionDetailResponse> {
  const response = await apiClient.get<WorkflowDefinitionDetailResponse>(
    `${BASE_URL}/${definitionId}`
  );
  return response.data;
}

/**
 * List all versions of a workflow definition
 */
export async function listVersions(
  definitionId: string
): Promise<WorkflowVersionResponse[]> {
  const response = await apiClient.get<WorkflowVersionResponse[]>(
    `${BASE_URL}/${definitionId}/versions`
  );
  return response.data;
}

/**
 * Get a specific version
 */
export async function getVersion(
  definitionId: string,
  versionNumber: number
): Promise<WorkflowVersionResponse> {
  const response = await apiClient.get<WorkflowVersionResponse>(
    `${BASE_URL}/${definitionId}/versions/${versionNumber}`
  );
  return response.data;
}

/**
 * Get the active version for a definition
 */
export async function getActiveVersion(
  definitionId: string
): Promise<WorkflowVersionResponse> {
  const response = await apiClient.get<WorkflowVersionResponse>(
    `${BASE_URL}/${definitionId}/active`
  );
  return response.data;
}

// =============================================================================
// QUERY HOOKS
// =============================================================================

/**
 * Hook to fetch all workflow definitions
 *
 * @example
 * const { data, isLoading, isError, error } = useWorkflowDefinitions();
 * const { data } = useWorkflowDefinitions({ status: 'published' });
 */
export function useWorkflowDefinitions(options?: { status?: DefinitionStatus }) {
  return useQuery({
    queryKey: workflowDefinitionKeys.list({ status: options?.status }),
    queryFn: () => listDefinitions(options?.status),
  });
}

/**
 * Hook to fetch a single workflow definition with all versions
 *
 * @example
 * const { data, isLoading, isError, error } = useWorkflowDefinition(id);
 */
export function useWorkflowDefinition(definitionId: string | undefined) {
  return useQuery({
    queryKey: workflowDefinitionKeys.detail(definitionId!),
    queryFn: () => getDefinition(definitionId!),
    enabled: !!definitionId,
  });
}

/**
 * Hook to fetch versions of a workflow definition
 *
 * @example
 * const { data: versions } = useWorkflowVersions(definitionId);
 */
export function useWorkflowVersions(definitionId: string | undefined) {
  return useQuery({
    queryKey: workflowDefinitionKeys.versions(definitionId!),
    queryFn: () => listVersions(definitionId!),
    enabled: !!definitionId,
  });
}

/**
 * Hook to fetch the active version of a workflow definition
 *
 * @example
 * const { data: activeVersion } = useActiveWorkflowVersion(definitionId);
 */
export function useActiveWorkflowVersion(definitionId: string | undefined) {
  return useQuery({
    queryKey: workflowDefinitionKeys.activeVersion(definitionId!),
    queryFn: () => getActiveVersion(definitionId!),
    enabled: !!definitionId,
  });
}
