/**
 * Workflow Definition Table
 *
 * Displays a list of workflow definitions with actions.
 */

import { useWorkflowDefinitions } from '@/api/workflow-definitions';
import type { WorkflowDefinitionListResponse, DefinitionStatus } from '@/api/workflow-definitions';

interface DefinitionTableProps {
  statusFilter?: DefinitionStatus;
  onEdit: (definitionId: string) => void;
  onViewHistory: (definitionId: string) => void;
  onDelete: (definition: WorkflowDefinitionListResponse) => void;
}

export function DefinitionTable({
  statusFilter,
  onEdit,
  onViewHistory,
  onDelete,
}: DefinitionTableProps) {
  const { data: definitions, isLoading, isError, error } = useWorkflowDefinitions({
    status: statusFilter,
  });

  if (isLoading) {
    return <div>Loading workflow definitions...</div>;
  }

  if (isError) {
    return <div>Error loading definitions: {error?.message}</div>;
  }

  if (!definitions || definitions.length === 0) {
    return (
      <div>
        <p>No workflow definitions found.</p>
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Process ID</th>
          <th>Status</th>
          <th>Version</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {definitions.map((definition) => (
          <tr key={definition.id}>
            <td>{definition.name}</td>
            <td>{definition.process_id}</td>
            <td>{definition.status}</td>
            <td>
              {definition.active_version_number
                ? `v${definition.active_version_number}`
                : 'No active version'}
            </td>
            <td>{new Date(definition.created_at).toLocaleDateString()}</td>
            <td>
              <button onClick={() => onEdit(definition.id)}>Edit</button>
              <button onClick={() => onViewHistory(definition.id)}>History</button>
              <button onClick={() => onDelete(definition)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
