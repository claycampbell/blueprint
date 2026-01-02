import React from 'react';
import { Property } from '../types';

interface PropertyHeaderProps {
  property: Property;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {
  const getBadgeClass = (state: string) => {
    switch (state) {
      case 'active':
      case 'approved':
      case 'completed':
        return 'badge-success';
      case 'in-progress':
      case 'pending':
        return 'badge-warning';
      case 'paused':
      case 'on-hold':
      case 'needs-revision':
        return 'badge-info';
      default:
        return 'badge-gray';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 7) return '#ef4444'; // red
    if (risk >= 5) return '#f59e0b'; // orange
    return '#10b981'; // green
  };

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {property.attributes.address}
        </h1>
        <p style={{ color: 'var(--color-gray-500)' }}>
          {property.attributes.city}, {property.attributes.state} {property.attributes.zip}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '1.5rem'
      }}>
        {/* Property Type */}
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>
            Type
          </div>
          <div style={{ fontWeight: '500' }}>
            {property.type.split('-').map(word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </div>
        </div>

        {/* Lifecycle State */}
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>
            Lifecycle
          </div>
          <span className={`badge ${getBadgeClass(property.lifecycle)}`}>
            {property.lifecycle}
          </span>
        </div>

        {/* Status */}
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>
            Status
          </div>
          <span className={`badge ${getBadgeClass(property.status)}`}>
            {property.status}
          </span>
        </div>

        {/* Approval State */}
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>
            Approval
          </div>
          <span className={`badge ${getBadgeClass(property.approvalState)}`}>
            {property.approvalState}
          </span>
        </div>

        {/* Risk Level */}
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>
            Risk Level
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: '600', color: getRiskColor(property.riskLevel) }}>
              {property.riskLevel.toFixed(1)}
            </span>
            <div style={{
              width: '100px',
              height: '8px',
              backgroundColor: 'var(--color-gray-200)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(property.riskLevel / 10) * 100}%`,
                height: '100%',
                backgroundColor: getRiskColor(property.riskLevel),
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
        </div>

        {/* Lot Size */}
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>
            Lot Size
          </div>
          <div style={{ fontWeight: '500' }}>
            {property.attributes.lotSizeSF.toLocaleString()} SF
          </div>
        </div>
      </div>

      {/* Additional property details */}
      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--color-gray-200)'
      }}>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
          <div>
            <span style={{ color: 'var(--color-gray-500)' }}>Jurisdiction: </span>
            <span style={{ fontWeight: '500' }}>{property.attributes.jurisdiction}</span>
          </div>
          {property.attributes.zoningDistrict && (
            <div>
              <span style={{ color: 'var(--color-gray-500)' }}>Zoning: </span>
              <span style={{ fontWeight: '500' }}>{property.attributes.zoningDistrict}</span>
            </div>
          )}
          {property.assignedTo && (
            <div>
              <span style={{ color: 'var(--color-gray-500)' }}>Assigned to: </span>
              <span style={{ fontWeight: '500' }}>{property.assignedTo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
