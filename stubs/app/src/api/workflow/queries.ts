/**
 * Workflow Queries
 *
 * TanStack Query hooks for fetching workflow/project data.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { workflowKeys } from './keys';
import type { Project, ProjectListItem, WorkflowStepInfo } from './types';

const BASE_URL = '/api/v1/workflow';

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * List all projects
 */
export async function listProjects(): Promise<ProjectListItem[]> {
  const response = await apiClient.get<ProjectListItem[]>(`${BASE_URL}/projects`);
  return response.data;
}

/**
 * Get a single project with full details
 */
export async function getProject(projectId: string): Promise<Project> {
  const response = await apiClient.get<Project>(`${BASE_URL}/projects/${projectId}`);
  return response.data;
}

/**
 * Get available workflow steps
 */
export async function getWorkflowSteps(): Promise<{ steps: WorkflowStepInfo[] }> {
  const response = await apiClient.get<{ steps: WorkflowStepInfo[] }>(`${BASE_URL}/steps`);
  return response.data;
}

// =============================================================================
// QUERY HOOKS
// =============================================================================

/**
 * Hook to fetch all projects
 *
 * @example
 * const { data: projects, isLoading, isError, error } = useProjects();
 */
export function useProjects() {
  return useQuery({
    queryKey: workflowKeys.projects(),
    queryFn: listProjects,
  });
}

/**
 * Hook to fetch a single project with full details
 *
 * @example
 * const { data: project, isLoading } = useProject(projectId);
 */
export function useProject(projectId: string | null) {
  return useQuery({
    queryKey: workflowKeys.project(projectId!),
    queryFn: () => getProject(projectId!),
    enabled: !!projectId,
  });
}

/**
 * Hook to fetch available workflow steps
 *
 * @example
 * const { data } = useWorkflowSteps();
 * const steps = data?.steps ?? [];
 */
export function useWorkflowSteps() {
  return useQuery({
    queryKey: workflowKeys.steps(),
    queryFn: getWorkflowSteps,
    staleTime: 5 * 60 * 1000, // Steps rarely change, cache for 5 minutes
  });
}
