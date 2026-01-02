import React from 'react';
import { Property } from '../../types';
import { getPropertyTypeLabel } from '../../utils/propertyHelpers';

interface PropertyHeaderProps {
  property: Property;
  onBack: () => void;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property, onBack }) => {
  return (
    <>
      {/* Back navigation */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '0'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            cursor: 'pointer',
            fontSize: '0.875rem',
            padding: '0',
            fontWeight: '500'
          }}
        >
          ← Back to Pipeline
        </button>
      </div>

      {/* Property header */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem 2rem',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Property Image */}
          {property.attributes.imageUrl && (
            <div style={{
              width: '200px',
              height: '150px',
              borderRadius: '8px',
              overflow: 'hidden',
              flexShrink: 0,
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb'
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

          {/* Property Title and Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '0.25rem',
              color: '#111827'
            }}>
              {property.attributes.address}
            </h1>

            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              {getPropertyTypeLabel(property.type)} • {property.attributes.city}, {property.attributes.state}
            </div>
          </div>
        </div>

        {/* Metadata row */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          fontSize: '0.875rem',
          paddingTop: '1rem',
          borderTop: '1px solid #f3f4f6'
        }}>
          <div>
            <span style={{ color: '#6b7280' }}>Status:</span>{' '}
            <span style={{
              fontWeight: '500',
              color: property.status === 'active' ? '#10b981' : '#f59e0b'
            }}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </span>
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>Assigned To:</span>{' '}
            <span style={{ fontWeight: '500', color: '#111827' }}>
              {property.assignedTo || 'Unassigned'}
            </span>
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>Risk Level:</span>{' '}
            <span style={{
              fontWeight: '500',
              color: property.riskLevel >= 7 ? '#ef4444' : property.riskLevel >= 5 ? '#f59e0b' : '#10b981'
            }}>
              {property.riskLevel.toFixed(1)} / 10.0
            </span>
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>Approval State:</span>{' '}
            <span style={{
              fontWeight: '500',
              color: property.approvalState === 'approved' ? '#10b981' : property.approvalState === 'rejected' ? '#ef4444' : '#f59e0b'
            }}>
              {property.approvalState.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
