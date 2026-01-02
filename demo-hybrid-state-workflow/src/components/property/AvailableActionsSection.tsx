import React, { useState } from 'react';
import { Property, ProcessType } from '../../types';
import { StartProcessModal } from '../modals/StartProcessModal';

interface AvailableActionsSectionProps {
  property: Property;
  onStartProcess?: (processType: ProcessType) => void;
}

export const AvailableActionsSection: React.FC<AvailableActionsSectionProps> = ({
  property,
  onStartProcess
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: ProcessAction | null;
  }>({ isOpen: false, action: null });
  // Enhanced action definition with state impact
  interface ProcessAction {
    processType: ProcessType;
    label: string;
    description: string;
    estimatedDays: number;
    stateImpacts: Array<{
      dimension: 'lifecycle' | 'approval' | 'risk' | 'status';
      description: string;
      expectedChange?: string;
    }>;
    prerequisites: string[];
    isReady: boolean;
  }

  // Determine available process actions with state impact information
  const getAvailableProcessActions = (): ProcessAction[] => {
    const actions: ProcessAction[] = [];

    switch (property.lifecycle) {
      case 'intake':
        if (!property.activeProcesses.some(p => p.type === 'intake-qualification')) {
          actions.push({
            processType: 'intake-qualification',
            label: 'Intake Qualification',
            description: 'Initial property screening and viability assessment',
            estimatedDays: 3,
            stateImpacts: [
              { dimension: 'lifecycle', description: 'Will advance to Feasibility when complete' },
              { dimension: 'approval', description: 'Sets approval to Pending' }
            ],
            prerequisites: [],
            isReady: true
          });
        }
        break;

      case 'feasibility':
        if (!property.activeProcesses.some(p => p.type === 'feasibility-analysis')) {
          actions.push({
            processType: 'feasibility-analysis',
            label: 'Feasibility Analysis',
            description: 'Comprehensive due diligence and project viability assessment',
            estimatedDays: 14,
            stateImpacts: [
              { dimension: 'risk', description: 'Updates risk score based on findings', expectedChange: `${property.riskLevel.toFixed(1)} → 4.0-6.0` },
              { dimension: 'approval', description: 'Sets approval state to Pending' }
            ],
            prerequisites: [],
            isReady: true
          });
        }
        if (!property.activeProcesses.some(p => p.type === 'title-review')) {
          actions.push({
            processType: 'title-review',
            label: 'Title Review',
            description: 'Title report analysis and lien verification',
            estimatedDays: 7,
            stateImpacts: [
              { dimension: 'risk', description: 'May reduce risk if title is clean', expectedChange: `${property.riskLevel.toFixed(1)} → ${Math.max(1, property.riskLevel - 1.5).toFixed(1)}` },
              { dimension: 'approval', description: 'Updates approval based on title status' }
            ],
            prerequisites: [],
            isReady: true
          });
        }
        if (!property.activeProcesses.some(p => p.type === 'environmental-assessment')) {
          actions.push({
            processType: 'environmental-assessment',
            label: 'Environmental Assessment',
            description: 'Environmental risks and compliance review',
            estimatedDays: 10,
            stateImpacts: [
              { dimension: 'risk', description: 'Updates risk based on environmental findings' }
            ],
            prerequisites: [],
            isReady: true
          });
        }
        break;

      case 'entitlement':
        if (!property.activeProcesses.some(p => p.type === 'permit-submission')) {
          const hasEntitlementPrep = property.processHistory.some(p => p.type === 'entitlement-preparation' && p.status === 'completed');
          actions.push({
            processType: 'permit-submission',
            label: 'Permit Submission',
            description: 'Submit permit application to jurisdiction',
            estimatedDays: 14,
            stateImpacts: [
              { dimension: 'lifecycle', description: 'Will advance to Construction when approved' },
              { dimension: 'status', description: 'May pause property during review' }
            ],
            prerequisites: hasEntitlementPrep ? [] : ['Entitlement preparation must be complete'],
            isReady: hasEntitlementPrep
          });
        }
        break;

      case 'construction':
        if (!property.activeProcesses.some(p => p.type === 'construction-start')) {
          actions.push({
            processType: 'construction-start',
            label: 'Construction Start',
            description: 'Initiate construction activities',
            estimatedDays: 180,
            stateImpacts: [
              { dimension: 'lifecycle', description: 'Advances to Servicing phase' },
              { dimension: 'status', description: 'Sets status to Active' }
            ],
            prerequisites: [],
            isReady: true
          });
        }
        break;
    }

    return actions;
  };

  const processActions = getAvailableProcessActions();
  const readyActions = processActions.filter(a => a.isReady);
  const blockedActions = processActions.filter(a => !a.isReady);

  if (processActions.length === 0) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#111827',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          🎯 Available Actions
        </h2>
      </div>

      {/* Ready to Start */}
      {readyActions.length > 0 && (
        <>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#059669',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem'
          }}>
            Ready to Start ({readyActions.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {readyActions.map((action) => (
              <div
                key={action.processType}
                style={{
                  padding: '1rem',
                  border: '2px solid #3b82f6',
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '0.25rem'
                    }}>
                      {action.label}
                    </div>

                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.75rem'
                    }}>
                      {action.description}
                    </div>

                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '0.75rem'
                    }}>
                      Duration: <strong>{action.estimatedDays} days</strong>
                    </div>

                    {/* State Impact Preview - KEY TEACHING MOMENT */}
                    {action.stateImpacts.length > 0 && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: '#eff6ff',
                        borderRadius: '6px',
                        border: '1px solid #bfdbfe'
                      }}>
                        <div style={{
                          fontSize: '0.6875rem',
                          fontWeight: '600',
                          color: '#1e40af',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '0.5rem'
                        }}>
                          State Impact When Complete:
                        </div>
                        {action.stateImpacts.map((impact, idx) => (
                          <div key={idx} style={{
                            fontSize: '0.75rem',
                            color: '#475569',
                            marginBottom: '0.375rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.375rem'
                          }}>
                            <span style={{ color: '#64748b' }}>•</span>
                            <div>
                              <strong style={{ textTransform: 'capitalize' }}>{impact.dimension}:</strong> {impact.description}
                              {impact.expectedChange && (
                                <div style={{ color: '#3b82f6', fontWeight: '600', marginTop: '0.125rem' }}>
                                  {impact.expectedChange}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setModalState({ isOpen: true, action })}
                    style={{
                      marginLeft: '1rem',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: '#3b82f6',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
                    }}
                  >
                    Start →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Not Ready (Prerequisites not met) */}
      {blockedActions.length > 0 && (
        <>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem'
          }}>
            Not Ready ({blockedActions.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {blockedActions.map((action) => (
              <div
                key={action.processType}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  opacity: 0.7
                }}
              >
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  {action.label}
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  marginBottom: '0.5rem'
                }}>
                  Prerequisites not met:
                </div>

                {action.prerequisites.map((prereq, idx) => (
                  <div key={idx} style={{
                    fontSize: '0.75rem',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}>
                    <span>❌</span>
                    {prereq}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Start Process Modal */}
      {modalState.isOpen && modalState.action && (
        <StartProcessModal
          isOpen={modalState.isOpen}
          processType={modalState.action.processType}
          processLabel={modalState.action.label}
          description={modalState.action.description}
          estimatedDays={modalState.action.estimatedDays}
          stateImpacts={modalState.action.stateImpacts}
          prerequisites={modalState.action.prerequisites.length > 0 ? modalState.action.prerequisites : ['All prerequisites met']}
          onConfirm={() => {
            onStartProcess?.(modalState.action!.processType);
            setModalState({ isOpen: false, action: null });
          }}
          onCancel={() => setModalState({ isOpen: false, action: null })}
        />
      )}
    </div>
  );
};
