/**
 * Definition History View Component
 *
 * Displays version history for a workflow definition with preview and actions.
 */

import { WorkflowBuilder, EMPTY_DIAGRAM } from '../WorkflowBuilder';
import type {
  WorkflowDefinitionDetailResponse,
  WorkflowVersionResponse,
} from '../../../api/workflow-definitions';

interface DefinitionHistoryViewProps {
  definition: WorkflowDefinitionDetailResponse;
  selectedVersion: WorkflowVersionResponse | null;
  isLoading: boolean;
  onSelectVersion: (version: WorkflowVersionResponse) => void;
  onPublishVersion: (versionNumber: number) => void;
  onRollback: (versionNumber: number) => void;
  onEdit: () => void;
  onBack: () => void;
}

export function DefinitionHistoryView({
  definition,
  selectedVersion,
  isLoading,
  onSelectVersion,
  onPublishVersion,
  onRollback,
  onEdit,
  onBack,
}: Readonly<DefinitionHistoryViewProps>) {
  return (
    <div className="history-view">
      <div className="history-header">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
        >
          Back to List
        </button>
        <h2>{definition.name} - Version History</h2>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onEdit}
        >
          Edit Workflow
        </button>
      </div>

      <div className="versions-list">
        {definition.versions.map((version) => (
          <div
            key={version.id}
            className={`version-item ${version.is_active ? 'active' : ''} ${
              selectedVersion?.id === version.id ? 'selected' : ''
            }`}
          >
            <div className="version-info">
              <div className="version-number">
                v{version.version}
                {version.is_active && <span className="active-badge">Active</span>}
              </div>
              <div className="version-meta">
                <span>
                  {new Date(version.created_at).toLocaleDateString()} at{' '}
                  {new Date(version.created_at).toLocaleTimeString()}
                </span>
                <span>by {version.created_by}</span>
              </div>
              {version.change_notes && (
                <div className="version-notes">{version.change_notes}</div>
              )}
            </div>
            <div className="version-actions">
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => onSelectVersion(version)}
              >
                View
              </button>
              {!version.is_active && (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => onPublishVersion(version.version)}
                    disabled={isLoading}
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-warning"
                    onClick={() => onRollback(version.version)}
                    disabled={isLoading}
                  >
                    Rollback
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedVersion && (
        <div className="version-preview">
          <h3>Version {selectedVersion.version} Preview</h3>
          <WorkflowBuilder
            initialXml={
              selectedVersion.bpmn_xml &&
              (selectedVersion.bpmn_xml.includes('<bpmn:definitions') ||
                selectedVersion.bpmn_xml.includes('<definitions'))
                ? selectedVersion.bpmn_xml
                : EMPTY_DIAGRAM
            }
            readOnly
            height={400}
          />
        </div>
      )}
    </div>
  );
}
