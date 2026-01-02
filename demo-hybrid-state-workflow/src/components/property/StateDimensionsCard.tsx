import React from 'react';
import { Property } from '../../types';

interface StateDimensionsCardProps {
  property: Property;
}

export const StateDimensionsCard: React.FC<StateDimensionsCardProps> = ({ property }) => {
  const getLifecycleColor = (lifecycle: string) => {
    const colors: Record<string, string> = {
      'intake': '#3b82f6',
      'feasibility': '#8b5cf6',
      'entitlement': '#f59e0b',
      'construction': '#10b981',
      'servicing': '#6366f1'
    };
    return colors[lifecycle] || '#6b7280';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': '#10b981',
      'paused': '#f59e0b',
      'on-hold': '#ef4444',
      'closed': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getApprovalColor = (state: string) => {
    const colors: Record<string, string> = {
      'pending': '#f59e0b',
      'approved': '#10b981',
      'rejected': '#ef4444',
      'needs-revision': '#8b5cf6'
    };
    return colors[state] || '#6b7280';
  };

  const getRiskColor = (level: number) => {
    if (level < 4) return '#10b981'; // green
    if (level < 7) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem'
      }}>
        <h3 style={{
          fontSize: '0.875rem',
          fontWeight: '700',
          color: '#0f172a',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          State Machine Model
        </h3>
        <div style={{
          fontSize: '0.6875rem',
          color: '#64748b',
          backgroundColor: '#f1f5f9',
          padding: '0.25rem 0.625rem',
          borderRadius: '6px'
        }}>
          4 State Dimensions
        </div>
      </div>

      {/* State dimensions grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem'
      }}>
        {/* Lifecycle State */}
        <div style={{
          border: `2px solid ${getLifecycleColor(property.lifecycle)}20`,
          backgroundColor: `${getLifecycleColor(property.lifecycle)}08`,
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <div style={{
            fontSize: '0.6875rem',
            color: '#64748b',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Lifecycle Phase
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: getLifecycleColor(property.lifecycle)
            }} />
            <span style={{
              fontSize: '0.9375rem',
              fontWeight: '600',
              color: '#0f172a'
            }}>
              {property.lifecycle.charAt(0).toUpperCase() + property.lifecycle.slice(1)}
            </span>
          </div>
        </div>

        {/* Status State */}
        <div style={{
          border: `2px solid ${getStatusColor(property.status)}20`,
          backgroundColor: `${getStatusColor(property.status)}08`,
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <div style={{
            fontSize: '0.6875rem',
            color: '#64748b',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Activity Status
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(property.status)
            }} />
            <span style={{
              fontSize: '0.9375rem',
              fontWeight: '600',
              color: '#0f172a'
            }}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Approval State */}
        <div style={{
          border: `2px solid ${getApprovalColor(property.approvalState)}20`,
          backgroundColor: `${getApprovalColor(property.approvalState)}08`,
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <div style={{
            fontSize: '0.6875rem',
            color: '#64748b',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Approval State
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: getApprovalColor(property.approvalState)
            }} />
            <span style={{
              fontSize: '0.9375rem',
              fontWeight: '600',
              color: '#0f172a'
            }}>
              {property.approvalState.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </span>
          </div>
        </div>

        {/* Risk Level */}
        <div style={{
          border: `2px solid ${getRiskColor(property.riskLevel)}20`,
          backgroundColor: `${getRiskColor(property.riskLevel)}08`,
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <div style={{
            fontSize: '0.6875rem',
            color: '#64748b',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Risk Score
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: getRiskColor(property.riskLevel)
            }} />
            <span style={{
              fontSize: '0.9375rem',
              fontWeight: '600',
              color: '#0f172a'
            }}>
              {property.riskLevel.toFixed(1)} / 10
            </span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: '#f8fafc',
        borderRadius: '6px',
        borderLeft: '3px solid #8b5cf6'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: '#475569',
          lineHeight: '1.5'
        }}>
          <strong>State Machine Model:</strong> Property state exists across multiple independent dimensions.
          Processes can update any dimension. Lifecycle is just ONE dimension, not the organizing principle.
        </div>
      </div>
    </div>
  );
};
