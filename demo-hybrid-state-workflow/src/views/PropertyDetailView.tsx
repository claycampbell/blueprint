import React from 'react';
import { Property, ProcessType } from '../types';
import { PropertyHeader } from '../components/property/PropertyHeader';
import { StateDimensionsCard } from '../components/property/StateDimensionsCard';
import { ReactflowLifecyclePath } from '../components/property/ReactflowLifecyclePath';
import { NeedsAttentionSection } from '../components/property/NeedsAttentionSection';
import { AvailableActionsSection } from '../components/property/AvailableActionsSection';
import { InProgressSection } from '../components/property/InProgressSection';
import { CompletedSection } from '../components/property/CompletedSection';
import { ReactflowStateTimeline } from '../components/property/ReactflowStateTimeline';
import { getPropertyTypeLabel } from '../utils/propertyHelpers';

interface PropertyDetailViewProps {
  property: Property;
  onBack: () => void;
  onStartProcess?: (processType: ProcessType) => void;
  onCompleteProcess?: (processId: string) => void;
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  onBack,
  onStartProcess,
  onCompleteProcess
}) => {
  return (
    <div>
      <PropertyHeader property={property} onBack={onBack} />

      {/* State Machine Model Card - Full Width */}
      <div style={{ padding: '0 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <ReactflowLifecyclePath property={property} />
        <StateDimensionsCard property={property} />
      </div>

      {/* Two-column layout: Main content left, Metadata sidebar right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
        padding: '0 2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Left column: Main content */}
        <div>
          <NeedsAttentionSection property={property} />

          <AvailableActionsSection property={property} onStartProcess={onStartProcess} />

          <InProgressSection property={property} onCompleteProcess={onCompleteProcess} />

          <CompletedSection property={property} />

          <ReactflowStateTimeline property={property} />
        </div>

        {/* Right column: Property metadata */}
        <div>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
            position: 'sticky',
            top: '1rem'
          }}>
            <h3 style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem'
            }}>
              Property Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Status */}
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Status
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: property.status === 'active' ? '#10b981' : '#f59e0b'
                }}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </div>
              </div>

              {/* Assigned To */}
              {property.assignedTo && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Assigned To
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    {property.assignedTo}
                  </div>
                </div>
              )}

              {/* Risk Level */}
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Risk Level
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: property.riskLevel >= 7 ? '#ef4444' : property.riskLevel >= 5 ? '#f59e0b' : '#10b981'
                }}>
                  {property.riskLevel.toFixed(1)} / 10.0
                </div>
              </div>

              {/* Approval State */}
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Approval State
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: property.approvalState === 'approved' ? '#10b981' : property.approvalState === 'rejected' ? '#ef4444' : '#f59e0b'
                }}>
                  {property.approvalState.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Property Type
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                  {getPropertyTypeLabel(property.type)}
                </div>
              </div>

              {/* Location */}
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Location
                </div>
                <div style={{ fontSize: '0.875rem', color: '#111827' }}>
                  {property.attributes.city}, {property.attributes.state} {property.attributes.zip}
                </div>
              </div>

              {/* Created */}
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Created
                </div>
                <div style={{ fontSize: '0.875rem', color: '#111827' }}>
                  {new Date(property.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>

              {/* Last Updated */}
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Last Updated
                </div>
                <div style={{ fontSize: '0.875rem', color: '#111827' }}>
                  {new Date(property.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
