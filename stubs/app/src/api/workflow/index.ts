/**
 * Workflow API
 *
 * Public exports for the workflow domain (SpiffWorkflow POC).
 */

// Types
export type {
  DecisionAction,
  WorkflowGroupId,
  WorkflowItemId,
  ProjectStatus,
  WorkflowItemInfo,
  WorkflowStepInfo,
  AvailableTransitions,
  Comment,
  WorkflowHistoryEntry,
  Project,
  ProjectListItem,
  DecisionResponse,
  CreateProjectRequest,
  AddCommentRequest,
  MakeDecisionRequest,
} from './types';

// Query keys
export { workflowKeys } from './keys';

// Queries
export {
  listProjects,
  getProject,
  getWorkflowSteps,
  useProjects,
  useProject,
  useWorkflowSteps,
} from './queries';

// Mutations
export {
  createProject,
  addComment,
  makeDecision,
  useCreateProject,
  useAddComment,
  useMakeDecision,
} from './mutations';
