import React from 'react';
import { MULTIPLE_PROPERTIES } from '../data/multipleProperties';
import { Property, LifecycleState } from '../types';
import { getPropertiesByLifecycle } from '../utils/propertyHelpers';

interface ExecutiveDashboardProps {
  onPropertyClick: (propertyId: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ onPropertyClick }) => {
  const properties = Object.values(MULTIPLE_PROPERTIES);
  const propertiesByPhase = getPropertiesByLifecycle();

  // Calculate executive-level metrics
  const metrics = {
    totalProperties: properties.length,
    totalValue: properties.reduce((sum, p) => sum + (p.attributes.propertyValue || 0), 0),
    avgRisk: properties.reduce((sum, p) => sum + p.riskLevel, 0) / properties.length,
    needsApproval: properties.filter(p => p.approvalState === 'pending').length,
    highRisk: properties.filter(p => p.riskLevel >= 7).length,
    activeProcesses: properties.reduce((sum, p) => sum + p.activeProcesses.length, 0),
    byPhase: {
      intake: propertiesByPhase['intake'].length,
      feasibility: propertiesByPhase['feasibility'].length,
      entitlement: propertiesByPhase['entitlement'].length,
      construction: propertiesByPhase['construction'].length,
      servicing: propertiesByPhase['servicing'].length
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingBottom: '2rem' }}>
      {/* Executive Header */}
      <header style={{
        backgroundColor: '#ffffff',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#0f172a',
          marginBottom: '0.5rem',
          letterSpacing: '-0.025em'
        }}>
          Executive Dashboard
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: 0
        }}>
          Portfolio overview and key performance indicators
        </p>
      </header>

      {/* Key Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        padding: '0 2.5rem',
        marginBottom: '2rem'
      }}>
        {/* Total Portfolio Value */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: '600',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Total Portfolio Value
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '0.25rem'
          }}>
            {formatCurrency(metrics.totalValue)}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#10b981'
          }}>
            {metrics.totalProperties} properties
          </div>
        </div>

        {/* Average Risk Score */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: '600',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Portfolio Risk
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: metrics.avgRisk >= 5 ? '#f59e0b' : '#10b981',
            marginBottom: '0.25rem'
          }}>
            {metrics.avgRisk.toFixed(1)} / 10
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: metrics.highRisk > 0 ? '#ef4444' : '#64748b'
          }}>
            {metrics.highRisk} high-risk properties
          </div>
        </div>

        {/* Pending Approvals */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: '600',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Pending Approvals
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: metrics.needsApproval > 0 ? '#f59e0b' : '#10b981',
            marginBottom: '0.25rem'
          }}>
            {metrics.needsApproval}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#64748b'
          }}>
            Require executive decision
          </div>
        </div>

        {/* Active Processes */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: '600',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Active Processes
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#3b82f6',
            marginBottom: '0.25rem'
          }}>
            {metrics.activeProcesses}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#64748b'
          }}>
            Across all properties
          </div>
        </div>
      </div>

      {/* Pipeline Distribution */}
      <div style={{
        padding: '0 2.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
        }}>
          <h2 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '1.5rem'
          }}>
            Pipeline Distribution
          </h2>

          {/* Phase bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(metrics.byPhase).map(([phase, count]) => {
              const total = metrics.totalProperties;
              const percentage = (count / total) * 100;
              const phaseColors: Record<string, string> = {
                intake: '#0284c7',
                feasibility: '#d97706',
                entitlement: '#9333ea',
                construction: '#ea580c',
                servicing: '#16a34a'
              };
              const color = phaseColors[phase] || '#6b7280';

              return (
                <div key={phase}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#0f172a',
                      textTransform: 'capitalize'
                    }}>
                      {phase}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#64748b'
                    }}>
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: color,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Properties Requiring Attention */}
      <div style={{
        padding: '0 2.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
        }}>
          <h2 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '1.5rem'
          }}>
            Properties Requiring Attention
          </h2>

          {/* High risk properties */}
          {properties
            .filter(p => p.riskLevel >= 7 || p.approvalState === 'pending' || p.activeProcesses.some(proc => proc.status === 'blocked'))
            .slice(0, 5)
            .map(property => {
              const hasBlockedProcess = property.activeProcesses.some(p => p.status === 'blocked');
              const needsApproval = property.approvalState === 'pending';
              const highRisk = property.riskLevel >= 7;

              return (
                <div
                  key={property.id}
                  onClick={() => onPropertyClick(property.id)}
                  style={{
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderLeft: `4px solid ${highRisk ? '#ef4444' : hasBlockedProcess ? '#f59e0b' : '#3b82f6'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    backgroundColor: '#fafafa'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#fafafa';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.9375rem',
                        fontWeight: '600',
                        color: '#0f172a',
                        marginBottom: '0.25rem'
                      }}>
                        {property.attributes.address}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '0.5rem'
                      }}>
                        {property.lifecycle.charAt(0).toUpperCase() + property.lifecycle.slice(1)} • {property.attributes.city}
                      </div>

                      {/* Issues */}
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {highRisk && (
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#dc2626',
                            backgroundColor: '#fef2f2',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            🚨 High Risk ({property.riskLevel.toFixed(1)})
                          </span>
                        )}
                        {needsApproval && (
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#d97706',
                            backgroundColor: '#fffbeb',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            ⏰ Approval Needed
                          </span>
                        )}
                        {hasBlockedProcess && (
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#ea580c',
                            backgroundColor: '#fff7ed',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            🚧 Blocked Process
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{
                      fontSize: '0.75rem',
                      color: '#3b82f6',
                      fontWeight: '500',
                      marginLeft: '1rem'
                    }}>
                      View →
                    </div>
                  </div>
                </div>
              );
            })}

          {properties.filter(p => p.riskLevel >= 7 || p.approvalState === 'pending' || p.activeProcesses.some(proc => proc.status === 'blocked')).length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#10b981',
              fontSize: '0.875rem'
            }}>
              ✓ All properties on track - no attention required
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
