/**
 * Workflow Definitions Management Page
 *
 * This page allows workflow admins to create, edit, version, and manage
 * BPMN workflow definitions.
 */

import { useState, useEffect, useCallback } from 'react';
import { EMPTY_DIAGRAM } from '../components/workflow/WorkflowBuilder';
import {
  DefinitionsListView,
  DefinitionCreateView,
  DefinitionEditView,
  DefinitionHistoryView,
} from '../components/workflow/definitions';
import {
  listDefinitions,
  getDefinition,
  createDefinition,
  createVersion,
  publishVersion,
  rollbackToVersion,
  deleteDefinition,
  validateBpmn,
  type WorkflowDefinitionListResponse,
  type WorkflowDefinitionDetailResponse,
  type WorkflowVersionResponse,
  type DefinitionStatus,
} from '../api/workflow-definitions';

// Import external styles
import '@/styles/workflow-definitions.css';

type ViewMode = 'list' | 'create' | 'edit' | 'history';

export function WorkflowDefinitionsPage() {
  // State
  const [definitions, setDefinitions] = useState<WorkflowDefinitionListResponse[]>([]);
  const [selectedDefinition, setSelectedDefinition] = useState<WorkflowDefinitionDetailResponse | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<WorkflowVersionResponse | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<DefinitionStatus | ''>('');

  // Form state for new definition
  const [newDefName, setNewDefName] = useState('');
  const [newDefDescription, setNewDefDescription] = useState('');
  const [newDefProcessId, setNewDefProcessId] = useState('');
  const [newDefBpmnXml, setNewDefBpmnXml] = useState(EMPTY_DIAGRAM);
  const [changeNotes, setChangeNotes] = useState('');

  // Load definitions
  const loadDefinitions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listDefinitions(statusFilter || undefined);
      setDefinitions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load definitions');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadDefinitions();
  }, [loadDefinitions]);

  // Load definition detail
  const loadDefinitionDetail = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const detail = await getDefinition(id);
      setSelectedDefinition(detail);
      // Set the active version or latest version for editing
      const activeVersion = detail.versions.find((v) => v.is_active);
      const latestVersion = detail.versions[0];
      setSelectedVersion(activeVersion || latestVersion || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load definition');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle create new definition
  const handleCreateDefinition = async () => {
    if (!newDefName.trim() || !newDefProcessId.trim()) {
      setError('Name and Process ID are required');
      return;
    }

    // Validate BPMN first
    const validation = await validateBpmn({
      bpmn_xml: newDefBpmnXml,
      process_id: newDefProcessId,
    });

    if (!validation.valid) {
      setError(`Invalid BPMN: ${validation.errors.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await createDefinition({
        name: newDefName.trim(),
        description: newDefDescription.trim() || undefined,
        process_id: newDefProcessId.trim(),
        bpmn_xml: newDefBpmnXml,
        change_notes: changeNotes.trim() || 'Initial version',
      });

      // Reset form and go back to list
      setNewDefName('');
      setNewDefDescription('');
      setNewDefProcessId('');
      setNewDefBpmnXml(EMPTY_DIAGRAM);
      setChangeNotes('');
      setViewMode('list');
      loadDefinitions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create definition');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save new version
  const handleSaveVersion = async (xml: string, publish: boolean = false) => {
    if (!selectedDefinition) return;

    setIsLoading(true);
    setError(null);
    try {
      const newVersion = await createVersion(selectedDefinition.id, {
        bpmn_xml: xml,
        change_notes: changeNotes.trim() || undefined,
        publish,
      });

      setChangeNotes('');

      // Reload definition to get updated versions
      await loadDefinitionDetail(selectedDefinition.id);
      setSelectedVersion(newVersion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save version');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle publish version
  const handlePublishVersion = async (versionNumber: number) => {
    if (!selectedDefinition) return;

    setIsLoading(true);
    setError(null);
    try {
      await publishVersion(selectedDefinition.id, versionNumber);
      await loadDefinitionDetail(selectedDefinition.id);
      loadDefinitions(); // Refresh list to show updated status
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish version');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle rollback
  const handleRollback = async (versionNumber: number) => {
    if (!selectedDefinition) return;

    setIsLoading(true);
    setError(null);
    try {
      const newVersion = await rollbackToVersion(selectedDefinition.id, versionNumber);
      await loadDefinitionDetail(selectedDefinition.id);
      setSelectedVersion(newVersion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rollback');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow definition?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await deleteDefinition(id);
      setSelectedDefinition(null);
      setViewMode('list');
      loadDefinitions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete definition');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const handleNavigateToEdit = (id: string) => {
    loadDefinitionDetail(id);
    setViewMode('edit');
  };

  const handleNavigateToHistory = (id: string) => {
    loadDefinitionDetail(id);
    setViewMode('history');
  };

  const handleNavigateToList = () => {
    setSelectedDefinition(null);
    setSelectedVersion(null);
    setViewMode('list');
  };

  return (
    <div className="workflow-definitions-page">
      {error && (
        <div className="page-error">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {isLoading && viewMode === 'list' && (
        <div className="page-loading">Loading...</div>
      )}

      {viewMode === 'list' && (
        <DefinitionsListView
          definitions={definitions}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onCreateNew={() => setViewMode('create')}
          onEdit={handleNavigateToEdit}
          onViewHistory={handleNavigateToHistory}
          onDelete={handleDelete}
        />
      )}

      {viewMode === 'create' && (
        <DefinitionCreateView
          name={newDefName}
          description={newDefDescription}
          processId={newDefProcessId}
          bpmnXml={newDefBpmnXml}
          changeNotes={changeNotes}
          isLoading={isLoading}
          onNameChange={setNewDefName}
          onDescriptionChange={setNewDefDescription}
          onProcessIdChange={setNewDefProcessId}
          onBpmnXmlChange={setNewDefBpmnXml}
          onChangeNotesChange={setChangeNotes}
          onSubmit={handleCreateDefinition}
          onCancel={handleNavigateToList}
        />
      )}

      {viewMode === 'edit' && selectedDefinition && selectedVersion && (
        <DefinitionEditView
          definition={selectedDefinition}
          version={selectedVersion}
          changeNotes={changeNotes}
          isLoading={isLoading}
          onChangeNotesChange={setChangeNotes}
          onSave={handleSaveVersion}
          onViewHistory={() => setViewMode('history')}
          onBack={handleNavigateToList}
        />
      )}

      {viewMode === 'history' && selectedDefinition && (
        <DefinitionHistoryView
          definition={selectedDefinition}
          selectedVersion={selectedVersion}
          isLoading={isLoading}
          onSelectVersion={setSelectedVersion}
          onPublishVersion={handlePublishVersion}
          onRollback={handleRollback}
          onEdit={() => setViewMode('edit')}
          onBack={handleNavigateToList}
        />
      )}
    </div>
  );
}
