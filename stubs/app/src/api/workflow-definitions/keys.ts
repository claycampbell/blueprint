/**
 * Workflow Definitions Query Keys
 *
 * Factory pattern for TanStack Query cache keys.
 */

import type { DefinitionStatus } from './types';

export const workflowDefinitionKeys = {
  all: ['workflow-definitions'] as const,
  lists: () => [...workflowDefinitionKeys.all, 'list'] as const,
  list: (filters: { status?: DefinitionStatus }) =>
    [...workflowDefinitionKeys.lists(), filters] as const,
  details: () => [...workflowDefinitionKeys.all, 'detail'] as const,
  detail: (id: string) => [...workflowDefinitionKeys.details(), id] as const,
  versions: (id: string) => [...workflowDefinitionKeys.detail(id), 'versions'] as const,
  version: (id: string, version: number) =>
    [...workflowDefinitionKeys.versions(id), version] as const,
  activeVersion: (id: string) =>
    [...workflowDefinitionKeys.detail(id), 'active'] as const,
};
