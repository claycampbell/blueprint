/**
 * Definitions List View Component
 *
 * Displays a table of workflow definitions with filtering and actions.
 */

import type { WorkflowDefinitionListResponse, DefinitionStatus } from '../../../api/workflow-definitions';

interface DefinitionsListViewProps {
  definitions: WorkflowDefinitionListResponse[];
  statusFilter: DefinitionStatus | '';
  onStatusFilterChange: (status: DefinitionStatus | '') => void;
  onCreateNew: () => void;
  onEdit: (id: string) => void;
  onViewHistory: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DefinitionsListView({
  definitions,
  statusFilter,
  onStatusFilterChange,
  onCreateNew,
  onEdit,
  onViewHistory,
  onDelete,
}: Readonly<DefinitionsListViewProps>) {
  return (
    <div className="definitions-list-view">
      <div className="list-header">
        <h2>Workflow Definitions</h2>
        <div className="list-actions">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as DefinitionStatus | '')}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onCreateNew}
          >
            + Create New
          </button>
        </div>
      </div>

      {definitions.length === 0 ? (
        <div className="empty-state">
          <p>No workflow definitions found.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onCreateNew}
          >
            Create Your First Workflow
          </button>
        </div>
      ) : (
        <div className="definitions-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Process ID</th>
                <th>Status</th>
                <th>Active Version</th>
                <th>Total Versions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {definitions.map((def) => (
                <tr key={def.id}>
                  <td>
                    <strong>{def.name}</strong>
                    {def.description && (
                      <small className="description">{def.description}</small>
                    )}
                  </td>
                  <td><code>{def.process_id}</code></td>
                  <td>
                    <span className={`status-badge status-${def.status}`}>
                      {def.status}
                    </span>
                  </td>
                  <td>{def.active_version_number ?? '-'}</td>
                  <td>{def.version_count}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => onEdit(def.id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => onViewHistory(def.id)}
                    >
                      History
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(def.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
