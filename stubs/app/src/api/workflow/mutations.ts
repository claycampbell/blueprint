/**
 * Workflow Mutations
 *
 * TanStack Query mutation hooks for modifying projects and workflow state.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { workflowKeys } from './keys';
import type {
  Project,
  Comment,
  DecisionResponse,
  CreateProjectRequest,
  AddCommentRequest,
  MakeDecisionRequest,
} from './types';

const BASE_URL = '/api/v1/workflow';

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Create a new project and start its workflow
 */
export async function createProject(data: CreateProjectRequest): Promise<Project> {
  const response = await apiClient.post<Project>(`${BASE_URL}/projects`, data);
  return response.data;
}

/**
 * Add a comment to a project
 */
export async function addComment(
  projectId: string,
  data: AddCommentRequest
): Promise<Comment> {
  const response = await apiClient.post<Comment>(
    `${BASE_URL}/projects/${projectId}/comments`,
    data
  );
  return response.data;
}

/**
 * Make a workflow decision
 */
export async function makeDecision(
  projectId: string,
  data: MakeDecisionRequest
): Promise<DecisionResponse> {
  const response = await apiClient.post<DecisionResponse>(
    `${BASE_URL}/projects/${projectId}/decision`,
    data
  );
  return response.data;
}

// =============================================================================
// MUTATION HOOKS
// =============================================================================

/**
 * Hook to create a new project
 *
 * @example
 * const createMutation = useCreateProject();
 * createMutation.mutate({ name: 'New Project', description: 'Description' });
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.projects() });
    },
  });
}

/**
 * Hook to add a comment to a project
 *
 * @example
 * const addCommentMutation = useAddComment(projectId);
 * addCommentMutation.mutate({ content: 'My comment', user_name: 'John' });
 */
export function useAddComment(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCommentRequest) => addComment(projectId, data),
    onSuccess: () => {
      // Invalidate the specific project to refresh comments
      queryClient.invalidateQueries({ queryKey: workflowKeys.project(projectId) });
    },
  });
}

/**
 * Hook to make a workflow decision (approve, send back, skip to, complete WFG)
 *
 * @example
 * const decisionMutation = useMakeDecision(projectId);
 * decisionMutation.mutate({ action: 'approve' });
 * decisionMutation.mutate({ action: 'send_back', target_step: 'WFG1', reason: 'Needs review' });
 */
export function useMakeDecision(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MakeDecisionRequest) => makeDecision(projectId, data),
    onSuccess: () => {
      // Invalidate both the project detail and the projects list
      // since the decision may change status or current step
      queryClient.invalidateQueries({ queryKey: workflowKeys.project(projectId) });
      queryClient.invalidateQueries({ queryKey: workflowKeys.projects() });
    },
  });
}
