import { CorrectionItem } from '../../types';
import { getDisciplineColor } from '../../utils/disciplineColors';
import { isItemAtRisk, formatDaysUntilDue } from '../../utils/correctionHelpers';

interface CorrectionItemCardProps {
  item: CorrectionItem;
  onStatusChange?: (itemId: string, newStatus: CorrectionItem['status']) => void;
  showActions?: boolean;
}

/**
 * Display card for individual correction item
 * Shows discipline, description, status, assignment, and due date
 */
export function CorrectionItemCard({ item, onStatusChange, showActions = false }: CorrectionItemCardProps) {
  const disciplineColor = getDisciplineColor(item.discipline);
  const atRisk = isItemAtRisk(item);

  const severityConfig = {
    critical: { icon: '🔴', label: 'Critical', color: '#dc2626' },
    major: { icon: '⚠️', label: 'Major', color: '#ea580c' },
    minor: { icon: 'ℹ️', label: 'Minor', color: '#2563eb' }
  };

  const statusConfig = {
    'not-started': { label: 'Not Started', color: '#9ca3af' },
    'in-progress': { label: 'In Progress', color: '#f59e0b' },
    'consultant-submitted': { label: 'Submitted', color: '#3b82f6' },
    'internal-review': { label: 'In Review', color: '#8b5cf6' },
    'approved': { label: 'Approved', color: '#10b981' },
    'needs-revision': { label: 'Needs Revision', color: '#ef4444' },
    'completed': { label: 'Completed', color: '#059669' }
  };

  const severity = severityConfig[item.severity];
  const status = statusConfig[item.status];

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: `1px solid ${atRisk ? '#fee2e2' : '#e5e7eb'}`,
        borderLeft: `4px solid ${atRisk ? '#dc2626' : disciplineColor.border}`,
        borderRadius: '6px',
        padding: '12px 16px',
        marginBottom: '8px',
        boxShadow: atRisk ? '0 1px 3px rgba(220, 38, 38, 0.1)' : '0 1px 2px rgba(0,0,0,0.05)'
      }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          {/* Item Number */}
          <span style={{
            fontWeight: '600',
            fontSize: '0.875rem',
            color: '#111827'
          }}>
            {item.itemNumber}
          </span>

          {/* Discipline Badge */}
          <span style={{
            backgroundColor: disciplineColor.bg,
            color: disciplineColor.text,
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            {disciplineColor.label}
          </span>

          {/* Severity Indicator */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            color: severity.color,
            fontWeight: '500'
          }}>
            <span style={{ fontSize: '12px' }}>{severity.icon}</span>
            {severity.label}
          </span>
        </div>

        {/* Status Badge */}
        <span style={{
          backgroundColor: `${status.color}15`,
          color: status.color,
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '500',
          whiteSpace: 'nowrap'
        }}>
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p style={{
        margin: '8px 0',
        fontSize: '0.875rem',
        lineHeight: '1.5',
        color: '#374151'
      }}>
        {item.description}
      </p>

      {/* Metadata Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginTop: '12px',
        fontSize: '0.75rem',
        color: '#6b7280'
      }}>
        {/* Sheet References */}
        {item.sheetNumbers && item.sheetNumbers.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontWeight: '500' }}>📄</span>
            <span>{item.sheetNumbers.join(', ')}</span>
          </div>
        )}

        {/* Assigned To */}
        {item.assignedToPerson && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontWeight: '500' }}>👤</span>
            <span>{item.assignedToPerson}</span>
          </div>
        )}

        {/* Due Date */}
        {item.dueDate && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: atRisk ? '#dc2626' : '#6b7280',
            fontWeight: atRisk ? '600' : '400'
          }}>
            <span style={{ fontWeight: '500' }}>{atRisk ? '⚠️' : '📅'}</span>
            <span>{formatDaysUntilDue(item.dueDate)}</span>
          </div>
        )}

        {/* Effort Estimate */}
        {item.estimatedEffortHours && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontWeight: '500' }}>⏱️</span>
            <span>{item.estimatedEffortHours}h</span>
          </div>
        )}
      </div>

      {/* Response (if available) */}
      {item.responseDescription && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          backgroundColor: '#f9fafb',
          borderRadius: '4px',
          borderLeft: '3px solid #10b981'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#059669', marginBottom: '4px' }}>
            Response:
          </div>
          <div style={{ fontSize: '0.875rem', color: '#374151' }}>
            {item.responseDescription}
          </div>
          {item.revisedSheetNumbers && item.revisedSheetNumbers.length > 0 && (
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
              Updated: {item.revisedSheetNumbers.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && onStatusChange && item.status !== 'completed' && (
        <div style={{
          marginTop: '12px',
          display: 'flex',
          gap: '8px'
        }}>
          {item.status === 'not-started' && (
            <button
              onClick={() => onStatusChange(item.id, 'in-progress')}
              style={{
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#3b82f6',
                backgroundColor: 'white',
                border: '1px solid #3b82f6',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Start
            </button>
          )}
          {item.status === 'in-progress' && (
            <button
              onClick={() => onStatusChange(item.id, 'consultant-submitted')}
              style={{
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Mark Submitted
            </button>
          )}
          {item.status === 'consultant-submitted' && (
            <button
              onClick={() => onStatusChange(item.id, 'completed')}
              style={{
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Approve
            </button>
          )}
        </div>
      )}
    </div>
  );
}
