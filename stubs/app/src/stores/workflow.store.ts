/**
 * Workflow UI Store
 *
 * Zustand store for managing UI state related to workflow/projects.
 * This handles client-side state like:
 * - Selected project
 * - Current view mode
 * - Decision form state
 * - Comment form state
 *
 * Note: Server data is managed by TanStack Query, not this store.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DecisionAction, WorkflowGroupId, WorkflowItemId } from '@/api/workflow';

// =============================================================================
// TYPES
// =============================================================================

export type WorkflowViewMode = 'list' | 'detail' | 'create';

interface DecisionFormState {
  action: DecisionAction | null;
  targetStep: WorkflowGroupId | null;
  targetWfi: WorkflowItemId | null;
  reason: string;
}

interface CommentFormState {
  content: string;
  userName: string;
}

interface WorkflowState {
  // View state
  viewMode: WorkflowViewMode;
  selectedProjectId: string | null;

  // Decision form state
  decisionForm: DecisionFormState;
  isDecisionModalOpen: boolean;

  // Comment form state
  commentForm: CommentFormState;

  // UI state
  isHistoryExpanded: boolean;
  isCommentsExpanded: boolean;
}

interface WorkflowActions {
  // View navigation
  setViewMode: (mode: WorkflowViewMode) => void;
  navigateToList: () => void;
  navigateToCreate: () => void;
  navigateToDetail: (projectId: string) => void;

  // Selection
  setSelectedProjectId: (id: string | null) => void;

  // Decision form
  setDecisionAction: (action: DecisionAction | null) => void;
  setDecisionTargetStep: (step: WorkflowGroupId | null) => void;
  setDecisionTargetWfi: (wfi: WorkflowItemId | null) => void;
  setDecisionReason: (reason: string) => void;
  resetDecisionForm: () => void;
  openDecisionModal: () => void;
  closeDecisionModal: () => void;

  // Comment form
  setCommentContent: (content: string) => void;
  setCommentUserName: (userName: string) => void;
  resetCommentForm: () => void;

  // UI toggles
  toggleHistoryExpanded: () => void;
  toggleCommentsExpanded: () => void;
  setHistoryExpanded: (expanded: boolean) => void;
  setCommentsExpanded: (expanded: boolean) => void;

  // Reset all state
  reset: () => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialDecisionForm: DecisionFormState = {
  action: null,
  targetStep: null,
  targetWfi: null,
  reason: '',
};

const initialCommentForm: CommentFormState = {
  content: '',
  userName: '',
};

const initialState: WorkflowState = {
  viewMode: 'list',
  selectedProjectId: null,
  decisionForm: initialDecisionForm,
  isDecisionModalOpen: false,
  commentForm: initialCommentForm,
  isHistoryExpanded: true,
  isCommentsExpanded: true,
};

// =============================================================================
// STORE
// =============================================================================

export const useWorkflowStore = create<WorkflowState & WorkflowActions>()(
  devtools(
    (set) => ({
      ...initialState,

      // View navigation
      setViewMode: (mode) => set({ viewMode: mode }, false, 'setViewMode'),

      navigateToList: () =>
        set(
          {
            viewMode: 'list',
            selectedProjectId: null,
            decisionForm: initialDecisionForm,
            isDecisionModalOpen: false,
          },
          false,
          'navigateToList'
        ),

      navigateToCreate: () =>
        set(
          {
            viewMode: 'create',
            selectedProjectId: null,
          },
          false,
          'navigateToCreate'
        ),

      navigateToDetail: (projectId) =>
        set(
          {
            viewMode: 'detail',
            selectedProjectId: projectId,
            decisionForm: initialDecisionForm,
            isDecisionModalOpen: false,
          },
          false,
          'navigateToDetail'
        ),

      // Selection
      setSelectedProjectId: (id) =>
        set({ selectedProjectId: id }, false, 'setSelectedProjectId'),

      // Decision form
      setDecisionAction: (action) =>
        set(
          (state) => ({
            decisionForm: { ...state.decisionForm, action },
          }),
          false,
          'setDecisionAction'
        ),

      setDecisionTargetStep: (step) =>
        set(
          (state) => ({
            decisionForm: { ...state.decisionForm, targetStep: step },
          }),
          false,
          'setDecisionTargetStep'
        ),

      setDecisionTargetWfi: (wfi) =>
        set(
          (state) => ({
            decisionForm: { ...state.decisionForm, targetWfi: wfi },
          }),
          false,
          'setDecisionTargetWfi'
        ),

      setDecisionReason: (reason) =>
        set(
          (state) => ({
            decisionForm: { ...state.decisionForm, reason },
          }),
          false,
          'setDecisionReason'
        ),

      resetDecisionForm: () =>
        set({ decisionForm: initialDecisionForm }, false, 'resetDecisionForm'),

      openDecisionModal: () =>
        set({ isDecisionModalOpen: true }, false, 'openDecisionModal'),

      closeDecisionModal: () =>
        set(
          { isDecisionModalOpen: false, decisionForm: initialDecisionForm },
          false,
          'closeDecisionModal'
        ),

      // Comment form
      setCommentContent: (content) =>
        set(
          (state) => ({
            commentForm: { ...state.commentForm, content },
          }),
          false,
          'setCommentContent'
        ),

      setCommentUserName: (userName) =>
        set(
          (state) => ({
            commentForm: { ...state.commentForm, userName },
          }),
          false,
          'setCommentUserName'
        ),

      resetCommentForm: () =>
        set({ commentForm: initialCommentForm }, false, 'resetCommentForm'),

      // UI toggles
      toggleHistoryExpanded: () =>
        set(
          (state) => ({ isHistoryExpanded: !state.isHistoryExpanded }),
          false,
          'toggleHistoryExpanded'
        ),

      toggleCommentsExpanded: () =>
        set(
          (state) => ({ isCommentsExpanded: !state.isCommentsExpanded }),
          false,
          'toggleCommentsExpanded'
        ),

      setHistoryExpanded: (expanded) =>
        set({ isHistoryExpanded: expanded }, false, 'setHistoryExpanded'),

      setCommentsExpanded: (expanded) =>
        set({ isCommentsExpanded: expanded }, false, 'setCommentsExpanded'),

      // Reset
      reset: () => set(initialState, false, 'reset'),
    }),
    { name: 'workflow-store' }
  )
);

// =============================================================================
// SELECTORS (for performance optimization)
// =============================================================================

export const selectViewMode = (state: WorkflowState) => state.viewMode;
export const selectSelectedProjectId = (state: WorkflowState) =>
  state.selectedProjectId;
export const selectDecisionForm = (state: WorkflowState) => state.decisionForm;
export const selectIsDecisionModalOpen = (state: WorkflowState) =>
  state.isDecisionModalOpen;
export const selectCommentForm = (state: WorkflowState) => state.commentForm;
export const selectIsHistoryExpanded = (state: WorkflowState) =>
  state.isHistoryExpanded;
export const selectIsCommentsExpanded = (state: WorkflowState) =>
  state.isCommentsExpanded;
