import { useState } from 'react';
import { DashboardView } from './views/DashboardView';
import { TimelineView } from './views/TimelineView';
import { PropertyDetailView } from './views/PropertyDetailView';
import { ExecutiveDashboard } from './views/ExecutiveDashboard';
import { MULTIPLE_PROPERTIES } from './data/multipleProperties';
import { Property, ProcessType } from './types';
import { UserRole, PERSONAS } from './types/personas';
import { RoleSwitcher } from './components/RoleSwitcher';
import { Toast, useToast } from './components/Toast';
import { Confetti } from './components/Confetti';

type ViewState =
  | { view: 'dashboard' }
  | { view: 'timeline' }
  | { view: 'property-detail'; propertyId: string };

type DashboardMode = 'kanban' | 'timeline';

function App() {
  const [viewState, setViewState] = useState<ViewState>({ view: 'dashboard' });
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('kanban');
  const [properties, setProperties] = useState<Record<string, Property>>(MULTIPLE_PROPERTIES);
  const [currentRole, setCurrentRole] = useState<UserRole>('demo-viewer');
  const { toasts, dismissToast, success, info } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);

  const currentProperty = viewState.view === 'property-detail'
    ? properties[viewState.propertyId]
    : undefined;

  const handlePropertyClick = (propertyId: string) => {
    setViewState({ view: 'property-detail', propertyId });
  };

  const handleBackToDashboard = () => {
    setViewState({ view: 'dashboard' });
  };

  const handleStartProcess = (propertyId: string, processType: ProcessType) => {
    // Simple demo: add a new process to the property
    setProperties(prev => {
      const property = prev[propertyId];
      if (!property) return prev;

      const newProcess = {
        id: `proc-${Date.now()}`,
        type: processType,
        status: 'in-progress' as const,
        propertyId,
        assignedTo: 'current-user',
        startedAt: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        outputs: []
      };

      return {
        ...prev,
        [propertyId]: {
          ...property,
          activeProcesses: [...property.activeProcesses, newProcess],
          updatedAt: new Date()
        }
      };
    });

    const processName = processType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    success(`Process Started`, `${processName} has been added to the property`);
  };

  const handleCompleteProcess = (propertyId: string, processId: string) => {
    // Get property and process info before state update
    const property = properties[propertyId];
    if (!property) return;

    const process = property.activeProcesses.find(p => p.id === processId);
    if (!process) return;

    // Calculate new state values
    let newRiskLevel = property.riskLevel;
    let newApprovalState = property.approvalState;
    let newLifecycle = property.lifecycle;

    // Risk assessment process completion updates risk dimension
    if (process.type === 'feasibility-analysis' || process.type === 'environmental-assessment') {
      // Simulate risk decrease after completing analysis
      newRiskLevel = Math.max(1, property.riskLevel - 1.5);
    }

    // Title review completion updates approval dimension
    if (process.type === 'title-review') {
      if (property.approvalState === 'pending') {
        newApprovalState = 'approved';
      }
    }

    setProperties(prev => {
      const currentProperty = prev[propertyId];
      if (!currentProperty) return prev;

      // Complete the process
      const updatedProcesses = currentProperty.activeProcesses.map(p =>
        p.id === processId
          ? { ...p, status: 'completed' as const, completedAt: new Date() }
          : p
      );

      // Check if all feasibility processes are complete for lifecycle advancement
      const allFeasibilityProcesses = updatedProcesses.filter(p =>
        p.type === 'feasibility-analysis' || p.type === 'title-review' || p.type === 'environmental-assessment'
      );
      const allFeasibilityComplete = allFeasibilityProcesses.length > 0 &&
        allFeasibilityProcesses.every(p => p.status === 'completed');

      if (allFeasibilityComplete && currentProperty.lifecycle === 'feasibility') {
        newLifecycle = 'entitlement';
      }

      return {
        ...prev,
        [propertyId]: {
          ...currentProperty,
          activeProcesses: updatedProcesses,
          riskLevel: newRiskLevel,
          approvalState: newApprovalState,
          lifecycle: newLifecycle,
          updatedAt: new Date()
        }
      };
    });

    const processName = process.type.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    let message = 'Process marked as complete';
    if (newLifecycle !== property.lifecycle) {
      message = `Lifecycle advanced to ${newLifecycle}`;
    } else if (newRiskLevel !== property.riskLevel) {
      message = `Risk updated to ${newRiskLevel.toFixed(1)}`;
    }
    success(`${processName} Completed`, message);

    // Trigger confetti for completions
    setShowConfetti(true);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const persona = PERSONAS[newRole];
    info(`Switched to ${persona.title}`, `Viewing ${persona.department} perspective`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '2rem'
    }}>
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Confetti Celebration */}
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div style={{
        maxWidth: viewState.view === 'property-detail' ? '900px' : '1800px',
        margin: '0 auto'
      }}>
        {/* Header with Role Switcher and View Toggle */}
        {(viewState.view === 'dashboard' || viewState.view === 'timeline') && (
          <div style={{
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Role Switcher */}
            <RoleSwitcher
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
            />

            {/* View Toggle */}
            <div style={{
              display: 'inline-flex',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <button
                onClick={() => {
                  setDashboardMode('kanban');
                  setViewState({ view: 'dashboard' });
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: dashboardMode === 'kanban' ? '#f3f4f6' : 'white',
                  border: 'none',
                  borderRadius: '6px 0 0 6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: dashboardMode === 'kanban' ? '#111827' : '#6b7280',
                  transition: 'all 0.15s'
                }}
              >
                Kanban
              </button>
              <button
                onClick={() => {
                  setDashboardMode('timeline');
                  setViewState({ view: 'timeline' });
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: dashboardMode === 'timeline' ? '#f3f4f6' : 'white',
                  border: 'none',
                  borderRadius: '0 6px 6px 0',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: dashboardMode === 'timeline' ? '#111827' : '#6b7280',
                  transition: 'all 0.15s'
                }}
              >
                Timeline
              </button>
            </div>
          </div>
        )}

        {viewState.view === 'dashboard' && currentRole === 'executive' && (
          <ExecutiveDashboard onPropertyClick={handlePropertyClick} />
        )}

        {viewState.view === 'dashboard' && currentRole !== 'executive' && (
          <DashboardView onPropertyClick={handlePropertyClick} currentRole={currentRole} />
        )}

        {viewState.view === 'timeline' && (
          <TimelineView onPropertyClick={handlePropertyClick} currentRole={currentRole} />
        )}

        {viewState.view === 'property-detail' && currentProperty && (
          <PropertyDetailView
            property={currentProperty}
            onBack={handleBackToDashboard}
            onStartProcess={(processType) => handleStartProcess(currentProperty.id, processType)}
            onCompleteProcess={(processId) => handleCompleteProcess(currentProperty.id, processId)}
          />
        )}

        {viewState.view === 'property-detail' && !currentProperty && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>Property not found</h2>
            <button onClick={handleBackToDashboard} style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              color: '#3b82f6',
              backgroundColor: 'white',
              border: '1px solid #3b82f6',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Back to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem',
        maxWidth: '1800px',
        margin: '4rem auto 0'
      }}>
        <p>Connect 2.0 - Property Pipeline</p>
        <p style={{ marginTop: '0.5rem' }}>
          User-First Property Management • State Machine Architecture Demo
        </p>
      </footer>
    </div>
  );
}

export default App;
