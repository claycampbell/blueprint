/**
 * Version History
 *
 * Displays version history for a workflow definition with
 * options to view, publish, or rollback to previous versions.
 */

import { useWorkflowVersions, usePublishWorkflowVersion, useRollbackWorkflowVersion } from '@/api/workflow-definitions';
import type { WorkflowVersionResponse } from '@/api/workflow-definitions';

interface VersionHistoryProps {
  definitionId: string;
  onSelectVersion: (version: WorkflowVersionResponse) => void;
  selectedVersionId?: string;
}

export function VersionHistory({
  definitionId,
  onSelectVersion,
  selectedVersionId,
}: VersionHistoryProps) {
  const { data: versions, isLoading, isError } = useWorkflowVersions(definitionId);
  const publishMutation = usePublishWorkflowVersion();
  const rollbackMutation = useRollbackWorkflowVersion();

  if (isLoading) {
    return <div>Loading version history...</div>;
  }

  if (isError) {
    return <div>Error loading version history</div>;
  }

  if (!versions || versions.length === 0) {
    return <div>No versions found</div>;
  }

  const handlePublish = (version: WorkflowVersionResponse) => {
    publishMutation.mutate({
      definitionId,
      versionNumber: version.version,
    });
  };

  const handleRollback = (version: WorkflowVersionResponse) => {
    rollbackMutation.mutate({
      definitionId,
      versionNumber: version.version,
    });
  };

  return (
    <div>
      <h3>Version History</h3>
      <ul>
        {versions.map((version) => (
          <li
            key={version.id}
            style={{
              background: selectedVersionId === version.id ? '#e0e0e0' : 'transparent',
            }}
          >
            <div>
              <strong>v{version.version}</strong>
              {version.is_active && <span> (Active)</span>}
            </div>
            <div>
              <small>
                {new Date(version.created_at).toLocaleString()} by {version.created_by}
              </small>
            </div>
            {version.change_notes && (
              <div>
                <small>{version.change_notes}</small>
              </div>
            )}
            <div>
              <button onClick={() => onSelectVersion(version)}>View</button>
              {!version.is_active && (
                <>
                  <button
                    onClick={() => handlePublish(version)}
                    disabled={publishMutation.isPending}
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => handleRollback(version)}
                    disabled={rollbackMutation.isPending}
                  >
                    Rollback
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
