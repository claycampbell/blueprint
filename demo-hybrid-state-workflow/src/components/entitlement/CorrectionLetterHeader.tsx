import { CorrectionLetter } from '../../types';
import { calculateProgress, isLetterAtRisk, formatDaysUntilDue } from '../../utils/correctionHelpers';

interface CorrectionLetterHeaderProps {
  letter: CorrectionLetter;
}

/**
 * Header component showing correction letter metadata and progress
 * Displays round number, due date, progress bar, and item breakdown
 */
export function CorrectionLetterHeader({ letter }: CorrectionLetterHeaderProps) {
  const progress = calculateProgress(letter);
  const atRisk = isLetterAtRisk(letter);

  return (
    <div style={{
      backgroundColor: 'white',
      border: `1px solid ${atRisk ? '#fee2e2' : '#e5e7eb'}`,
      borderLeft: `4px solid ${atRisk ? '#dc2626' : '#3b82f6'}`,
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {/* Title Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827'
          }}>
            Correction Letter Round {letter.roundNumber}
          </h3>
          {letter.jurisdictionDocumentId && (
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              {letter.jurisdictionDocumentId}
            </p>
          )}
        </div>

        {/* Status Badge */}
        {atRisk && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            <span>⚠️</span>
            At Risk
          </span>
        )}
      </div>

      {/* Metadata Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
      }}>
        {/* Received Date */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>
            Received
          </div>
          <div style={{ fontSize: '0.875rem', color: '#111827' }}>
            {new Date(letter.receivedDate).toLocaleDateString()}
          </div>
        </div>

        {/* Due Date */}
        {letter.responseDueDate && (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>
              Response Due
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: atRisk ? '#dc2626' : '#111827',
              fontWeight: atRisk ? '600' : '400'
            }}>
              {formatDaysUntilDue(letter.responseDueDate)}
            </div>
          </div>
        )}

        {/* Internal Target */}
        {letter.internalTargetDate && (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>
              Internal Target
            </div>
            <div style={{ fontSize: '0.875rem', color: '#111827' }}>
              {new Date(letter.internalTargetDate).toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Total Items */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>
            Total Items
          </div>
          <div style={{ fontSize: '0.875rem', color: '#111827' }}>
            {letter.totalItems} correction{letter.totalItems !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
            Progress
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
            {progress}%
          </span>
        </div>

        {/* Progress Bar Track */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '9999px',
          overflow: 'hidden'
        }}>
          {/* Progress Bar Fill */}
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: progress === 100 ? '#10b981' : atRisk ? '#f59e0b' : '#3b82f6',
            borderRadius: '9999px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Status Breakdown */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.875rem'
      }}>
        {letter.itemsCompleted > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#10b981',
              borderRadius: '50%'
            }} />
            <span style={{ color: '#6b7280' }}>
              <span style={{ fontWeight: '600', color: '#111827' }}>{letter.itemsCompleted}</span> Completed
            </span>
          </div>
        )}

        {letter.itemsInProgress > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#f59e0b',
              borderRadius: '50%'
            }} />
            <span style={{ color: '#6b7280' }}>
              <span style={{ fontWeight: '600', color: '#111827' }}>{letter.itemsInProgress}</span> In Progress
            </span>
          </div>
        )}

        {letter.itemsNotStarted > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#9ca3af',
              borderRadius: '50%'
            }} />
            <span style={{ color: '#6b7280' }}>
              <span style={{ fontWeight: '600', color: '#111827' }}>{letter.itemsNotStarted}</span> Not Started
            </span>
          </div>
        )}
      </div>

      {/* Document Link */}
      {letter.documentUrl && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <a
            href={letter.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.875rem',
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            <span>📄</span>
            View Original Correction Letter
            <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
}
