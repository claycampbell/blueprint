import React from 'react';
import { Property } from '../../types';
import { getPropertyStats, getPropertyTypeLabel } from '../../utils/propertyHelpers';
import { STATUS_COLORS } from '../../styles/theme';
import { getNextDueDate, getDaysUntilDue, formatDueDate } from '../../utils/dateHelpers';
import { EntitlementStatusBadge } from '../entitlement/EntitlementStatusBadge';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const stats = getPropertyStats(property);

  // Determine status color
  const getStatusColor = () => {
    if (stats.needsAttention > 0) return STATUS_COLORS.needsAttention;
    if (stats.atRisk > 0) return STATUS_COLORS.atRisk;
    if (stats.totalActive > 0) return STATUS_COLORS.active;
    if (property.approvalState === 'pending') return STATUS_COLORS.pending;
    return STATUS_COLORS.onTrack;
  };

  // Get status text
  const getStatusText = () => {
    if (stats.needsAttention > 0) return `${stats.needsAttention} need attention`;
    if (stats.atRisk > 0) return `Risk ${property.riskLevel.toFixed(1)}`;
    if (stats.totalActive > 0) return `${stats.totalActive} active`;
    if (property.approvalState === 'pending') return 'Pending approval';
    return 'On track';
  };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#fafafa',
        padding: '1rem',
        marginBottom: '0.75rem',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#ffffff';
        e.currentTarget.style.borderColor = '#cbd5e1';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = '#fafafa';
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.03)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Property Image */}
      {property.attributes.imageUrl && (
        <div style={{
          width: '100%',
          height: '140px',
          marginBottom: '0.75rem',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: '#f3f4f6'
        }}>
          <img
            src={property.attributes.imageUrl}
            alt={property.attributes.address}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* Address */}
      <div style={{
        fontSize: '0.9375rem',
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: '0.5rem',
        letterSpacing: '-0.01em',
        lineHeight: '1.3'
      }}>
        {property.attributes.address}
      </div>

      {/* Property type - plain text */}
      <div style={{
        fontSize: '0.75rem',
        color: '#64748b',
        marginBottom: '0.625rem',
        fontWeight: '400'
      }}>
        {getPropertyTypeLabel(property.type)}
      </div>

      {/* Entitlement subprocess badge */}
      {property.lifecycle === 'entitlement' && property.entitlementStatus && (
        <div style={{ marginBottom: '0.625rem' }}>
          <EntitlementStatusBadge status={property.entitlementStatus} size="small" />
        </div>
      )}

      {/* Status - dot + text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
        <div style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          boxShadow: `0 0 0 2px ${getStatusColor()}20`
        }} />
        <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '500' }}>
          {getStatusText()}
        </span>
      </div>

      {/* Assigned to */}
      {property.assignedTo && (
        <div style={{
          fontSize: '0.6875rem',
          color: '#64748b',
          fontWeight: '400',
          marginBottom: '0.5rem'
        }}>
          Assigned to {property.assignedTo}
        </div>
      )}

      {/* Due date - OVERDUE or upcoming */}
      {(() => {
        const nextDueDate = getNextDueDate(property);
        if (!nextDueDate) return null;

        const daysUntilDue = getDaysUntilDue(nextDueDate);
        const isOverdue = daysUntilDue < 0;
        const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 7;

        return (
          <div style={{
            marginTop: '0.625rem',
            paddingTop: '0.625rem',
            borderTop: '1px solid #f1f5f9'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              backgroundColor: isOverdue ? '#fef2f2' : isDueSoon ? '#fffbeb' : '#f8fafc',
              color: isOverdue ? '#dc2626' : isDueSoon ? '#d97706' : '#64748b',
              padding: '0.375rem 0.625rem',
              borderRadius: '6px',
              fontSize: '0.6875rem',
              fontWeight: '600',
              border: `1px solid ${isOverdue ? '#fecaca' : isDueSoon ? '#fde68a' : '#e2e8f0'}`
            }}>
              {isOverdue && <span>⚠</span>}
              {isDueSoon && <span>⏰</span>}
              <span>
                {isOverdue ? 'OVERDUE' : 'Due'} {formatDueDate(nextDueDate)}
                {daysUntilDue >= 0 && ` (${daysUntilDue}d)`}
              </span>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
