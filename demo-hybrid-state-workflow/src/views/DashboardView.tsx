import React from 'react';
import { LifecycleState } from '../types';
import { PropertyCard } from '../components/dashboard/PropertyCard';
import { getPropertiesByLifecycle, getDashboardStats } from '../utils/propertyHelpers';
import { PHASE_COLORS } from '../styles/theme';
import { UserRole, PERSONAS } from '../types/personas';

interface DashboardViewProps {
  onPropertyClick: (propertyId: string) => void;
  currentRole: UserRole;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onPropertyClick, currentRole }) => {
  const persona = PERSONAS[currentRole];
  const propertiesByPhase = getPropertiesByLifecycle();
  const dashboardStats = getDashboardStats();

  // Filter phases based on role permissions
  const allPhases: LifecycleState[] = ['intake', 'feasibility', 'entitlement', 'construction', 'servicing'];
  const phases = allPhases.filter(phase =>
    persona.permissions.lifecycleAccess.includes(phase)
  );

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Professional Dashboard Header */}
      <header style={{
        backgroundColor: '#ffffff',
        padding: '1.75rem 2.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '0.375rem',
              letterSpacing: '-0.025em'
            }}>
              Property Pipeline
              {currentRole !== 'demo-viewer' && (
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#2563eb',
                  marginLeft: '1rem'
                }}>
                  • {persona.title} View
                </span>
              )}
            </h1>
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b',
              fontWeight: '400'
            }}>
              {dashboardStats.totalProperties} properties • {phases.length} active phases
              {persona.permissions.lifecycleAccess.length < 5 && (
                <span style={{ color: '#3b82f6', marginLeft: '0.5rem' }}>
                  (Filtered to {persona.permissions.lifecycleAccess.join(', ')})
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#475569',
              cursor: 'pointer',
              fontWeight: '500',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}>
              Filter
            </button>
            <button style={{
              backgroundColor: '#2563eb',
              border: 'none',
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }}>
              + New Property
            </button>
          </div>
        </div>

        {/* Time-based stats bar */}
        <div style={{
          display: 'flex',
          gap: '2.5rem',
          fontSize: '0.8125rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontWeight: '600',
              color: '#0f172a',
              textTransform: 'uppercase',
              fontSize: '0.6875rem',
              letterSpacing: '0.05em'
            }}>Overdue:</span>
            <span style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.75rem'
            }}>
              {dashboardStats.overdueCount}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontWeight: '600',
              color: '#0f172a',
              textTransform: 'uppercase',
              fontSize: '0.6875rem',
              letterSpacing: '0.05em'
            }}>Due This Week:</span>
            <span style={{
              backgroundColor: '#fffbeb',
              color: '#d97706',
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.75rem'
            }}>
              {dashboardStats.dueThisWeekCount}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontWeight: '600',
              color: '#0f172a',
              textTransform: 'uppercase',
              fontSize: '0.6875rem',
              letterSpacing: '0.05em'
            }}>Due This Month:</span>
            <span style={{
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.75rem'
            }}>
              {dashboardStats.dueThisMonthCount}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontWeight: '600',
              color: '#0f172a',
              textTransform: 'uppercase',
              fontSize: '0.6875rem',
              letterSpacing: '0.05em'
            }}>Active:</span>
            <span style={{
              backgroundColor: '#f1f5f9',
              color: '#475569',
              padding: '0.25rem 0.625rem',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.75rem'
            }}>
              {dashboardStats.activeProcessCount}
            </span>
          </div>
        </div>
      </header>

      {/* Professional Kanban columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        padding: '0 2.5rem',
        paddingBottom: '2rem'
      }}>
        {phases.map(phase => {
          const properties = propertiesByPhase[phase];
          const phaseColor = PHASE_COLORS[phase];

          return (
            <div key={phase} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              minHeight: '500px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
            }}>
              {/* Column header */}
              <div style={{
                paddingBottom: '1rem',
                marginBottom: '1rem',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontSize: '0.6875rem',
                    fontWeight: '700',
                    color: '#475569',
                    textTransform: 'uppercase',
                    letterSpacing: '0.075em'
                  }}>
                    {phaseColor.label}
                  </div>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '6px',
                    fontSize: '0.6875rem',
                    fontWeight: '600'
                  }}>
                    {properties.length}
                  </div>
                </div>
              </div>

              {/* Properties */}
              <div>
                {properties.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    backgroundColor: '#fafafa',
                    borderRadius: '6px',
                    border: '1px dashed #d1d5db'
                  }}>
                    <div style={{
                      fontSize: '0.8125rem',
                      color: '#9ca3af',
                      fontWeight: '400'
                    }}>
                      No properties
                    </div>
                  </div>
                ) : (
                  properties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onClick={() => onPropertyClick(property.id)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
