/**
 * Workflow POC Page - Main page for testing SpiffWorkflow integration
 * New layout: WFG tabs at top, project list filtered by WFG, create project always visible
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  createProject,
  listProjects,
  getProject,
  addComment,
  makeDecision,
  type Project,
  type ProjectListItem,
  type WorkflowGroupId,
  type WorkflowItemId,
} from '../api/workflow';
import { StepDisplay } from '../components/workflow/StepDisplay';
import { CommentForm, CommentList } from '../components/workflow/CommentForm';
import { DecisionPanel } from '../components/workflow/DecisionPanel';

// WFG tab definitions
const WFG_TABS = [
  { id: 'all', name: 'All Projects' },
  { id: 'WFG1', name: 'WFG1: Project Kickoff' },
  { id: 'WFG2', name: 'WFG2: Schematic Design' },
  { id: 'WFG3', name: 'WFG3: Construction Docs' },
  { id: 'completed', name: 'Completed' },
];

export function WorkflowPocPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await listProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    }
  };

  const loadProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProject(projectId);
      setSelectedProject(data);
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter projects by selected tab
  const filteredProjects = useMemo(() => {
    if (selectedTab === 'all') return projects;
    if (selectedTab === 'completed') {
      return projects.filter((p) => p.status === 'completed');
    }
    return projects.filter((p) => p.current_workflow_group === selectedTab && p.status !== 'completed');
  }, [projects, selectedTab]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const project = await createProject({ name: newProjectName.trim() });
      setSelectedProject(project);
      setNewProjectName('');
      setShowCreateForm(false);
      await loadProjects();
      // Switch to the tab where the new project landed
      if (project.current_workflow_group) {
        setSelectedTab(project.current_workflow_group);
      }
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!selectedProject) return;

    setIsLoading(true);
    setError(null);
    try {
      await addComment(selectedProject.id, { content });
      await loadProject(selectedProject.id);
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedProject) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await makeDecision(selectedProject.id, { action: 'approve' });
      setSelectedProject(result.project);
      await loadProjects();
    } catch (err) {
      setError('Failed to approve');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendBack = async (targetStep: WorkflowGroupId | null, targetWfi: WorkflowItemId | null, reason: string) => {
    if (!selectedProject) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await makeDecision(selectedProject.id, {
        action: 'send_back',
        target_step: targetStep ?? undefined,
        target_wfi: targetWfi ?? undefined,
        reason,
      });
      setSelectedProject(result.project);
      await loadProjects();
    } catch (err) {
      setError('Failed to send back');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipTo = async (targetStep: WorkflowGroupId) => {
    if (!selectedProject) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await makeDecision(selectedProject.id, {
        action: 'skip_to',
        target_step: targetStep,
      });
      setSelectedProject(result.project);
      await loadProjects();
    } catch (err) {
      setError('Failed to skip');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteWfg = async () => {
    if (!selectedProject) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await makeDecision(selectedProject.id, { action: 'complete_wfg' });
      setSelectedProject(result.project);
      await loadProjects();
    } catch (err) {
      setError('Failed to complete WFG');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="workflow-poc-page">
      {/* Header with Create Button */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h1>SpiffWorkflow POC</h1>
            <p>VS4: Design & Entitlement Workflow</p>
          </div>
          <button
            className="create-project-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            + New Project
          </button>
        </div>

        {/* Create Project Form (collapsible) */}
        {showCreateForm && (
          <form onSubmit={handleCreateProject} className="create-form-header">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name..."
              disabled={isLoading}
              autoFocus
            />
            <button type="submit" disabled={!newProjectName.trim() || isLoading}>
              Create
            </button>
            <button type="button" onClick={() => setShowCreateForm(false)} className="cancel-btn">
              Cancel
            </button>
          </form>
        )}
      </header>

      {/* WFG Tabs */}
      <nav className="wfg-tabs">
        {WFG_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${selectedTab === tab.id ? 'active' : ''}`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.name}
            <span className="tab-count">
              {tab.id === 'all'
                ? projects.length
                : tab.id === 'completed'
                ? projects.filter((p) => p.status === 'completed').length
                : projects.filter((p) => p.current_workflow_group === tab.id && p.status !== 'completed').length}
            </span>
          </button>
        ))}
      </nav>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>x</button>
        </div>
      )}

      <div className="page-content">
        {/* Sidebar - Project List */}
        <aside className="sidebar">
          <h2>
            {WFG_TABS.find((t) => t.id === selectedTab)?.name || 'Projects'}
          </h2>

          {/* Project List */}
          <ul className="project-list">
            {filteredProjects.map((project) => (
              <li
                key={project.id}
                className={selectedProject?.id === project.id ? 'selected' : ''}
                onClick={() => loadProject(project.id)}
                onKeyDown={(e) => e.key === 'Enter' && loadProject(project.id)}
                tabIndex={0}
                role="button"
              >
                <span className="project-name">{project.name}</span>
                <span className={`project-status ${project.status}`}>
                  {project.status === 'completed' ? 'Done' : project.current_workflow_group}
                </span>
              </li>
            ))}
            {filteredProjects.length === 0 && (
              <li className="empty">No projects in this stage</li>
            )}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {selectedProject ? (
            <>
              <div className="project-header">
                <h2>{selectedProject.name}</h2>
                <span className={`status-badge ${selectedProject.status}`}>
                  {selectedProject.status}
                </span>
              </div>

              {/* Step Progress */}
              <StepDisplay
                currentStep={selectedProject.current_step}
                currentWfi={selectedProject.current_wfi}
                status={selectedProject.status}
              />

              {/* Decision Panel */}
              <DecisionPanel
                currentStep={selectedProject.current_step}
                currentWfi={selectedProject.current_wfi}
                transitions={selectedProject.available_transitions}
                onApprove={handleApprove}
                onSendBack={handleSendBack}
                onSkipTo={handleSkipTo}
                onCompleteWfg={handleCompleteWfg}
                isLoading={isLoading}
                isCompleted={selectedProject.status === 'completed'}
              />

              {/* Comments Section */}
              <section className="comments-section">
                <h3>Comments</h3>
                <CommentForm onSubmit={handleAddComment} isLoading={isLoading} />
                <CommentList
                  comments={selectedProject.comments}
                  currentWorkflowGroup={selectedProject.current_workflow_group}
                />
              </section>

              {/* History Section */}
              <section className="history-section">
                <h3>Workflow History</h3>
                <div className="history-list">
                  {selectedProject.history.map((entry) => (
                    <div key={entry.id} className="history-item">
                      <span className={`action-badge ${entry.action}`}>
                        {entry.action.replace('_', ' ')}
                      </span>
                      <span className="history-text">
                        {entry.from_workflow_group || 'Start'} -{'>'}
                        {entry.to_workflow_group || 'End'}
                      </span>
                      {entry.reason && (
                        <span className="history-reason">"{entry.reason}"</span>
                      )}
                      <span className="history-time">
                        {new Date(entry.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="no-selection">
              <h2>Select a Project</h2>
              <p>Choose a project from the list or create a new one.</p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .workflow-poc-page {
          min-height: 100vh;
          background: var(--color-background);
        }

        .page-header {
          background: linear-gradient(135deg, var(--color-primary), #6610f2);
          color: white;
          padding: 15px 30px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title h1 {
          margin: 0;
          font-size: 22px;
        }

        .header-title p {
          margin: 3px 0 0 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .create-project-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .create-project-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .create-form-header {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .create-form-header input {
          flex: 1;
          max-width: 400px;
          padding: 10px 15px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
        }

        .create-form-header button {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .create-form-header button[type="submit"] {
          background: white;
          color: var(--color-primary);
          font-weight: 500;
        }

        .create-form-header button[type="submit"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .create-form-header .cancel-btn {
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .wfg-tabs {
          display: flex;
          background: var(--color-card);
          border-bottom: 1px solid var(--color-border);
          padding: 0 20px;
          overflow-x: auto;
        }

        .tab-btn {
          padding: 15px 20px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: var(--color-text-secondary);
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: var(--color-text);
          background: var(--color-background-hover);
        }

        .tab-btn.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
          font-weight: 500;
        }

        .tab-count {
          background: var(--color-background-hover);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
        }

        .tab-btn.active .tab-count {
          background: var(--color-primary-light);
          color: var(--color-primary);
        }

        .error-banner {
          background: #f8d7da;
          color: #721c24;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-banner button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #721c24;
        }

        .page-content {
          display: flex;
          gap: 20px;
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .sidebar {
          width: 280px;
          flex-shrink: 0;
          background: var(--color-card);
          border-radius: 8px;
          padding: 20px;
          height: fit-content;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
          box-shadow: var(--shadow-md);
        }

        .sidebar h2 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: var(--color-text);
        }

        .project-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .project-list li {
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
        }

        .project-list li:hover {
          background: var(--color-background-hover);
        }

        .project-list li.selected {
          background: var(--color-primary-light);
          border-left: 3px solid var(--color-primary);
        }

        .project-list li.empty {
          color: var(--color-text-secondary);
          font-style: italic;
          cursor: default;
        }

        .project-name {
          font-weight: 500;
          color: var(--color-text);
          font-size: 14px;
        }

        .project-status {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 10px;
          background: var(--color-background-hover);
          color: var(--color-text-secondary);
        }

        .project-status.completed {
          background: var(--color-success-light);
          color: var(--color-success-text);
        }

        .main-content {
          flex: 1;
          min-width: 0;
        }

        .project-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .project-header h2 {
          margin: 0;
          color: var(--color-text);
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.active {
          background: var(--color-primary-light);
          color: var(--color-primary);
        }

        .status-badge.completed {
          background: var(--color-success-light);
          color: var(--color-success-text);
        }

        .comments-section,
        .history-section {
          background: var(--color-card);
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          box-shadow: var(--shadow-md);
        }

        .comments-section h3,
        .history-section h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: var(--color-text);
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: var(--color-card-secondary);
          border-radius: 6px;
          font-size: 14px;
          flex-wrap: wrap;
        }

        .action-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .action-badge.start {
          background: var(--color-primary-light);
          color: var(--color-primary);
        }

        .action-badge.approve {
          background: var(--color-success-light);
          color: var(--color-success-text);
        }

        .action-badge.send_back, .action-badge.send {
          background: #fff3cd;
          color: #856404;
        }

        .action-badge.skip_to, .action-badge.skip {
          background: #d1ecf1;
          color: #0c5460;
        }

        .action-badge.complete_wfg, .action-badge.complete {
          background: var(--color-info-light);
          color: var(--color-info);
        }

        .history-text {
          flex: 1;
          color: var(--color-text);
        }

        .history-reason {
          color: var(--color-text-secondary);
          font-style: italic;
        }

        .history-time {
          color: var(--color-text-muted);
          font-size: 12px;
        }

        .no-selection {
          background: var(--color-card);
          border-radius: 8px;
          padding: 60px 40px;
          text-align: center;
          box-shadow: var(--shadow-md);
        }

        .no-selection h2 {
          margin: 0 0 10px 0;
          color: var(--color-text);
        }

        .no-selection p {
          color: var(--color-text-secondary);
          margin: 0;
        }

        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
          .action-badge.send_back, .action-badge.send {
            background: #5c4d00;
            color: #ffc107;
          }

          .action-badge.skip_to, .action-badge.skip {
            background: #0c4a5a;
            color: #5dd3e8;
          }
        }
      `}</style>
    </div>
  );
}
