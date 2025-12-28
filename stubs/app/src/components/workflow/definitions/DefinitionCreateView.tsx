/**
 * Definition Create View Component
 *
 * Form and workflow builder for creating new workflow definitions.
 */

import { WorkflowBuilder } from '../WorkflowBuilder';

interface DefinitionCreateViewProps {
  name: string;
  description: string;
  processId: string;
  bpmnXml: string;
  changeNotes: string;
  isLoading: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onProcessIdChange: (value: string) => void;
  onBpmnXmlChange: (xml: string) => void;
  onChangeNotesChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function DefinitionCreateView({
  name,
  description,
  processId,
  bpmnXml,
  changeNotes,
  isLoading,
  onNameChange,
  onDescriptionChange,
  onProcessIdChange,
  onBpmnXmlChange,
  onChangeNotesChange,
  onSubmit,
  onCancel,
}: Readonly<DefinitionCreateViewProps>) {
  return (
    <div className="create-view">
      <div className="create-header">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Back to List
        </button>
        <h2>Create New Workflow Definition</h2>
      </div>

      <div className="create-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="defName">Name *</label>
            <input
              id="defName"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g., VS4 Design & Entitlement"
            />
          </div>
          <div className="form-group">
            <label htmlFor="processId">Process ID *</label>
            <input
              id="processId"
              type="text"
              value={processId}
              onChange={(e) => onProcessIdChange(e.target.value)}
              placeholder="e.g., VS4_DesignEntitlement"
            />
            <small>Must match the process ID in your BPMN</small>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="defDescription">Description</label>
          <textarea
            id="defDescription"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Optional description..."
            rows={2}
          />
        </div>
        <div className="form-group">
          <label htmlFor="initialNotes">Initial Version Notes</label>
          <input
            id="initialNotes"
            type="text"
            value={changeNotes}
            onChange={(e) => onChangeNotesChange(e.target.value)}
            placeholder="e.g., Initial workflow setup"
          />
        </div>
      </div>

      <div className="builder-section">
        <h3>Design Your Workflow</h3>
        <WorkflowBuilder
          initialXml={bpmnXml}
          onChange={onBpmnXmlChange}
          height={500}
        />
      </div>

      <div className="create-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={isLoading || !name.trim() || !processId.trim()}
        >
          Create Definition
        </button>
      </div>
    </div>
  );
}
