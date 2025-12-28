/**
 * Workflow Query Keys
 *
 * Factory pattern for TanStack Query cache keys.
 */

export const workflowKeys = {
  all: ['workflow'] as const,
  projects: () => [...workflowKeys.all, 'projects'] as const,
  project: (id: string) => [...workflowKeys.projects(), id] as const,
  steps: () => [...workflowKeys.all, 'steps'] as const,
};
