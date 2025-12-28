/**
 * Definition Edit View Component
 *
 * Editor for modifying existing workflow definitions.
 */

import { WorkflowBuilder, EMPTY_DIAGRAM } from '../WorkflowBuilder';
import type {
  WorkflowDefinitionDetailResponse,
  WorkflowVersionResponse,
} from '../../../api/workflow-definitions';

interface DefinitionEditViewProps {
  definition: WorkflowDefinitionDetailResponse;
  version: WorkflowVersionResponse;
  changeNotes: string;
  isLoading: boolean;
  onChangeNotesChange: (value: string) => void;
  onSave: (xml: string, publish: boolean) => void;
  onViewHistory: () => void;
  onBack: () => void;
}

export function DefinitionEditView({
  definition,
  version,
  changeNotes,
  isLoading,
  onChangeNotesChange,
  onSave,
  onViewHistory,
  onBack,
}: Readonly<DefinitionEditViewProps>) {
  // Use the version's BPMN XML if it looks valid, otherwise use empty diagram
  const hasBpmnXml = version.bpmn_xml &&
    (version.bpmn_xml.includes('<bpmn:definitions') ||
      version.bpmn_xml.includes('<definitions'));
  const editorXml = hasBpmnXml ? version.bpmn_xml : EMPTY_DIAGRAM;

  return (
    <div className="edit-view">
      <div className="edit-header">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
        >
          Back to List
        </button>
        <div className="edit-title">
          <h2>{definition.name}</h2>
          <span className={`status-badge status-${definition.status}`}>
            {definition.status}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onViewHistory}
        >
          View History
        </button>
      </div>

      {!hasBpmnXml && (
        <div className="page-warning">
          <span>No valid BPMN found for this version. Starting with a blank workflow.</span>
        </div>
      )}

      <div className="edit-info">
        <div className="info-item">
          <label>Process ID:</label>
          <code>{definition.process_id}</code>
        </div>
        <div className="info-item">
          <label>Editing Version:</label>
          <span>
            v{version.version}
            {version.is_active && ' (Active)'}
          </span>
        </div>
      </div>

      <div className="save-options">
        <div className="form-group">
          <label htmlFor="versionNotes">Version Notes</label>
          <input
            id="versionNotes"
            type="text"
            value={changeNotes}
            onChange={(e) => onChangeNotesChange(e.target.value)}
            placeholder="Describe your changes..."
          />
        </div>
      </div>

      <WorkflowBuilder
        key={`editor-${definition.id}-${version.version}`}
        initialXml={editorXml}
        onSave={(xml) => onSave(xml, false)}
        height={600}
      />

      <div className="edit-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={async () => {
            const { xml } = await (document.querySelector('.workflow-builder-canvas') as HTMLElement & {
              _modeler?: { saveXML: () => Promise<{ xml: string }> };
            })?._modeler?.saveXML() || { xml: '' };
            if (xml) onSave(xml, false);
          }}
          disabled={isLoading}
        >
          Save as Draft
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={async () => {
            const { xml } = await (document.querySelector('.workflow-builder-canvas') as HTMLElement & {
              _modeler?: { saveXML: () => Promise<{ xml: string }> };
            })?._modeler?.saveXML() || { xml: '' };
            if (xml) onSave(xml, true);
          }}
          disabled={isLoading}
        >
          Save & Publish
        </button>
      </div>
    </div>
  );
}
