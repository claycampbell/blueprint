/**
 * Delete Confirm Dialog
 *
 * Confirmation modal for deleting a workflow definition.
 */

import { useDeleteWorkflowDefinition } from '@/api/workflow-definitions';
import type { WorkflowDefinitionListResponse } from '@/api/workflow-definitions';

interface DeleteConfirmDialogProps {
  definition: WorkflowDefinitionListResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteConfirmDialog({
  definition,
  isOpen,
  onClose,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const deleteMutation = useDeleteWorkflowDefinition();

  if (!isOpen || !definition) {
    return null;
  }

  const handleConfirm = () => {
    deleteMutation.mutate(definition.id, {
      onSuccess: () => {
        onClose();
        onSuccess?.();
      },
    });
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <h2 id="delete-dialog-title">Delete Workflow Definition</h2>
      <p>
        Are you sure you want to delete <strong>{definition.name}</strong>?
      </p>
      <p>This action cannot be undone.</p>
      {definition.version_count > 0 && (
        <p>
          <strong>Warning:</strong> This will delete {definition.version_count} version(s).
        </p>
      )}
      <div>
        <button onClick={onClose} disabled={deleteMutation.isPending}>
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
      {deleteMutation.isError && (
        <p>Error: {deleteMutation.error?.message}</p>
      )}
    </div>
  );
}
