import { useState } from 'react';
import { Property, CorrectionLetter, EntitlementStatus } from '../../types';
import { EntitlementStatusBadge } from './EntitlementStatusBadge';
import { EntitlementStateTimeline } from './EntitlementStateTimeline';
import { CorrectionProgressDashboard } from './CorrectionProgressDashboard';
import { CorrectionTriageView } from './CorrectionTriageView';
import { BulkAssignmentView } from './BulkAssignmentView';
import { CorrectionQAView } from './CorrectionQAView';
import { ResubmittalPackageView } from './ResubmittalPackageView';

interface EntitlementDetailViewProps {
  property: Property;
  onStatusChange?: (newStatus: EntitlementStatus) => void;
  onBack?: () => void;
}

type ViewMode =
  | 'overview'
  | 'triage'
  | 'assignment'
  | 'progress'
  | 'qa'
  | 'resubmittal';

interface ConsultantProfile {
  id: string;
  name: string;
  email: string;
  disciplines: any[];
  currentWorkload: number;
  availability: 'available' | 'busy' | 'unavailable';
}

// Mock consultant data
const MOCK_CONSULTANTS: ConsultantProfile[] = [
  {
    id: 'c1',
    name: 'J. Smith',
    email: 'j.smith@example.com',
    disciplines: ['architectural', 'structural'],
    currentWorkload: 3,
    availability: 'available'
  },
  {
    id: 'c2',
    name: 'A. Lee',
    email: 'a.lee@example.com',
    disciplines: ['civil', 'landscape'],
    currentWorkload: 5,
    availability: 'busy'
  },
  {
    id: 'c3',
    name: 'M. Johnson',
    email: 'm.johnson@example.com',
    disciplines: ['mechanical', 'electrical', 'plumbing'],
    currentWorkload: 2,
    availability: 'available'
  }
];

/**
 * Main orchestration view for entitlement subprocess
 * Routes between different workflow views based on current state
 */
export function EntitlementDetailView({
  property,
  onStatusChange,
  onBack
}: EntitlementDetailViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  const entitlementStatus = property.entitlementStatus || 'planning';
  const currentLetter = property.correctionLetters?.[property.correctionLetters.length - 1];

  // Determine which workflow views are available based on status
  const availableViews = getAvailableViews(entitlementStatus, currentLetter);

  const handleViewChange = (mode: ViewMode) => {
    if (availableViews.includes(mode)) {
      setViewMode(mode);
    }
  };

  // Get current view index for navigation
  const viewOrder: ViewMode[] = ['overview', 'triage', 'assignment', 'progress', 'qa', 'resubmittal'];
  const currentViewIndex = viewOrder.indexOf(viewMode);
  const nextView = viewOrder.find((v, idx) => idx > currentViewIndex && availableViews.includes(v));
  const prevView = [...viewOrder].reverse().find((v) => {
    const originalIndex = viewOrder.indexOf(v);
    return originalIndex < currentViewIndex && availableViews.includes(v);
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#f9fafb'
    }}>
      {/* Top navigation bar */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        {/* Breadcrumb navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          fontSize: '0.8125rem',
          color: '#6b7280'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.8125rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#eff6ff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ← Property Details
          </button>
          <span>/</span>
          <span style={{ fontWeight: '500', color: '#111827' }}>Entitlement Subprocess</span>
          {viewMode !== 'overview' && (
            <>
              <span>/</span>
              <span style={{ fontWeight: '500', color: '#111827' }}>
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
              </span>
            </>
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '4px'
              }}>
                {property.attributes.address}
              </h1>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Entitlement Subprocess
              </div>
            </div>
          </div>
          <EntitlementStatusBadge status={entitlementStatus} size="large" />
        </div>

        {/* View tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '2px solid #e5e7eb',
          marginBottom: '-1px'
        }}>
          <ViewTab
            label="Overview"
            icon="📊"
            isActive={viewMode === 'overview'}
            isAvailable={true}
            onClick={() => handleViewChange('overview')}
          />
          <ViewTab
            label="Triage"
            icon="🔍"
            isActive={viewMode === 'triage'}
            isAvailable={availableViews.includes('triage')}
            onClick={() => handleViewChange('triage')}
          />
          <ViewTab
            label="Assignment"
            icon="👥"
            isActive={viewMode === 'assignment'}
            isAvailable={availableViews.includes('assignment')}
            onClick={() => handleViewChange('assignment')}
          />
          <ViewTab
            label="Progress"
            icon="📈"
            isActive={viewMode === 'progress'}
            isAvailable={availableViews.includes('progress')}
            onClick={() => handleViewChange('progress')}
          />
          <ViewTab
            label="QA Review"
            icon="✓"
            isActive={viewMode === 'qa'}
            isAvailable={availableViews.includes('qa')}
            onClick={() => handleViewChange('qa')}
          />
          <ViewTab
            label="Resubmittal"
            icon="📦"
            isActive={viewMode === 'resubmittal'}
            isAvailable={availableViews.includes('resubmittal')}
            onClick={() => handleViewChange('resubmittal')}
          />
        </div>

        {/* Flow navigation buttons */}
        {viewMode !== 'overview' && (prevView || nextView) && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #e5e7eb'
          }}>
            {prevView ? (
              <button
                onClick={() => handleViewChange(prevView)}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8125rem',
                  fontWeight: '500',
                  color: '#3b82f6',
                  backgroundColor: 'white',
                  border: '1px solid #3b82f6',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                ← Previous: {prevView.charAt(0).toUpperCase() + prevView.slice(1)}
              </button>
            ) : <div />}

            {nextView ? (
              <button
                onClick={() => handleViewChange(nextView)}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8125rem',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
              >
                Next: {nextView.charAt(0).toUpperCase() + nextView.slice(1)} →
              </button>
            ) : <div />}
          </div>
        )}
      </div>

      {/* Main content area */}
      <div style={{
        flex: 1,
        padding: '24px',
        overflow: 'auto'
      }}>
        {viewMode === 'overview' && (
          <OverviewContent
            property={property}
            entitlementStatus={entitlementStatus}
            currentLetter={currentLetter}
            onStatusChange={onStatusChange}
            onViewChange={handleViewChange}
          />
        )}

        {viewMode === 'triage' && currentLetter && (
          <CorrectionTriageView
            letter={currentLetter}
            onCompleteTriageClicked={() => {
              onStatusChange?.('corrections-assigned');
              setViewMode('assignment');
            }}
          />
        )}

        {viewMode === 'assignment' && currentLetter && (
          <BulkAssignmentView
            letter={currentLetter}
            availableConsultants={MOCK_CONSULTANTS}
            onAssignmentComplete={(assignments) => {
              console.log('Assignments saved:', assignments);
              onStatusChange?.('addressing-corrections');
              setViewMode('progress');
            }}
          />
        )}

        {viewMode === 'progress' && currentLetter && (
          <CorrectionProgressDashboard
            letter={currentLetter}
            onItemStatusChange={(itemId, newStatus) => {
              console.log('Item status change:', itemId, newStatus);
            }}
          />
        )}

        {viewMode === 'qa' && currentLetter && (
          <CorrectionQAView
            letter={currentLetter}
            onItemApprove={(itemId) => {
              console.log('Item approved:', itemId);
            }}
            onItemReject={(itemId, feedback) => {
              console.log('Item rejected:', itemId, feedback);
            }}
            onCompleteQA={() => {
              onStatusChange?.('resubmitted');
              setViewMode('resubmittal');
            }}
          />
        )}

        {viewMode === 'resubmittal' && currentLetter && (
          <ResubmittalPackageView
            letter={currentLetter}
            onGeneratePackage={() => {
              console.log('Generating package documents...');
            }}
            onSubmitToJurisdiction={() => {
              onStatusChange?.('resubmitted');
              setViewMode('overview');
            }}
          />
        )}
      </div>

      {/* Floating navigation helper */}
      {viewMode !== 'overview' && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 1000
        }}>
          <button
            onClick={() => handleViewChange('overview')}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}
            title="Back to Overview"
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            📊
          </button>
          <button
            onClick={onBack}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}
            title="Exit to Property Details"
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ⬅️
          </button>
        </div>
      )}
    </div>
  );
}

interface ViewTabProps {
  label: string;
  icon: string;
  isActive: boolean;
  isAvailable: boolean;
  onClick: () => void;
}

function ViewTab({ label, icon, isActive, isAvailable, onClick }: ViewTabProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isAvailable}
      style={{
        padding: '10px 16px',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: isActive ? '#3b82f6' : isAvailable ? '#6b7280' : '#9ca3af',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: `2px solid ${isActive ? '#3b82f6' : 'transparent'}`,
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        opacity: isAvailable ? 1 : 0.5,
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

interface OverviewContentProps {
  property: Property;
  entitlementStatus: EntitlementStatus;
  currentLetter?: CorrectionLetter;
  onStatusChange?: (newStatus: EntitlementStatus) => void;
  onViewChange: (mode: ViewMode) => void;
}

function OverviewContent({
  property,
  entitlementStatus,
  currentLetter,
  onStatusChange,
  onViewChange
}: OverviewContentProps) {
  return (
    <div>
      {/* State timeline */}
      <EntitlementStateTimeline
        currentStatus={entitlementStatus}
        onStatusClick={(status) => {
          onStatusChange?.(status);
        }}
      />

      {/* Property info card */}
      <div style={{
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '12px'
        }}>
          Property Information
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          fontSize: '0.875rem'
        }}>
          <InfoItem label="Address" value={property.attributes.address} />
          <InfoItem label="City" value={property.attributes.city} />
          <InfoItem label="Project Type" value={property.type} />
          <InfoItem label="Current Phase" value={property.lifecycle} />
        </div>
      </div>

      {/* Correction letter status (if exists) */}
      {currentLetter && (
        <div style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              Active Correction Letter
            </h3>
            <button
              onClick={() => onViewChange('progress')}
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#3b82f6',
                backgroundColor: 'white',
                border: '1px solid #3b82f6',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              View Details →
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            fontSize: '0.875rem'
          }}>
            <InfoItem label="Round" value={`Round ${currentLetter.roundNumber}`} />
            <InfoItem
              label="Progress"
              value={`${currentLetter.itemsCompleted}/${currentLetter.totalItems} items`}
            />
            <InfoItem
              label="Status"
              value={currentLetter.status.replace(/-/g, ' ').toUpperCase()}
            />
          </div>

          {/* Progress bar */}
          <div style={{
            marginTop: '12px',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(currentLetter.itemsCompleted / currentLetter.totalItems) * 100}%`,
              backgroundColor: currentLetter.itemsCompleted === currentLetter.totalItems ? '#10b981' : '#3b82f6',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{
        padding: '16px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '12px'
        }}>
          Quick Actions
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}>
          <QuickActionButton
            icon="📄"
            label="View Documents"
            onClick={() => console.log('View documents')}
          />
          <QuickActionButton
            icon="📝"
            label="Add Note"
            onClick={() => console.log('Add note')}
          />
          <QuickActionButton
            icon="📧"
            label="Contact Jurisdiction"
            onClick={() => console.log('Contact jurisdiction')}
          />
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#6b7280',
        marginBottom: '4px'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#111827'
      }}>
        {value}
      </div>
    </div>
  );
}

interface QuickActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

function QuickActionButton({ icon, label, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'white',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.15s'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#f9fafb';
        e.currentTarget.style.borderColor = '#3b82f6';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'white';
        e.currentTarget.style.borderColor = '#d1d5db';
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#374151'
      }}>
        {label}
      </span>
    </button>
  );
}

/**
 * Determine which workflow views are available based on current state
 */
function getAvailableViews(status: EntitlementStatus, currentLetter?: CorrectionLetter): ViewMode[] {
  const views: ViewMode[] = ['overview'];

  if (!currentLetter) return views;

  // Triage available when corrections received
  if (status === 'corrections-received') {
    views.push('triage');
  }

  // Assignment available after triage
  if (['corrections-assigned', 'addressing-corrections', 'corrections-qa'].includes(status)) {
    views.push('assignment', 'progress');
  }

  // Progress available when corrections are being addressed
  if (['addressing-corrections', 'corrections-qa'].includes(status)) {
    views.push('progress');
  }

  // QA available when consultant submitted items exist
  if (status === 'corrections-qa' || currentLetter.items.some(item => item.status === 'consultant-submitted')) {
    views.push('qa');
  }

  // Resubmittal available when QA complete or already resubmitted
  if (status === 'corrections-qa' || status === 'resubmitted') {
    views.push('resubmittal');
  }

  return views;
}
