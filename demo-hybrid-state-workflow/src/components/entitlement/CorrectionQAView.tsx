import { useState } from 'react';
import { CorrectionLetter } from '../../types';
import { getDisciplineColor } from '../../utils/disciplineColors';

interface CorrectionQAViewProps {
  letter: CorrectionLetter;
  onItemApprove?: (itemId: string) => void;
  onItemReject?: (itemId: string, feedback: string) => void;
  onCompleteQA?: () => void;
}

type QADecision = 'approved' | 'needs-revision' | 'pending';

interface QAReview {
  itemId: string;
  decision: QADecision;
  feedback?: string;
}

/**
 * Flow 4: Correction QA View
 * Side-by-side comparison of original correction and consultant response
 * Internal quality review before resubmission
 */
export function CorrectionQAView({
  letter,
  onItemApprove,
  onItemReject,
  onCompleteQA
}: CorrectionQAViewProps) {
  const [reviews, setReviews] = useState<Record<string, QAReview>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    letter.items.find(item => item.status === 'consultant-submitted')?.id || null
  );
  const [feedbackText, setFeedbackText] = useState('');

  const submittedItems = letter.items.filter(item => item.status === 'consultant-submitted');
  const selectedItem = submittedItems.find(item => item.id === selectedItemId);

  const handleDecision = (decision: QADecision) => {
    if (!selectedItemId) return;

    if (decision === 'approved') {
      setReviews(prev => ({
        ...prev,
        [selectedItemId]: { itemId: selectedItemId, decision: 'approved' }
      }));
      onItemApprove?.(selectedItemId);
      // Move to next item
      const currentIndex = submittedItems.findIndex(item => item.id === selectedItemId);
      if (currentIndex < submittedItems.length - 1) {
        setSelectedItemId(submittedItems[currentIndex + 1].id);
      }
      setFeedbackText('');
    } else if (decision === 'needs-revision') {
      if (!feedbackText.trim()) {
        alert('Please provide feedback for revisions');
        return;
      }
      setReviews(prev => ({
        ...prev,
        [selectedItemId]: {
          itemId: selectedItemId,
          decision: 'needs-revision',
          feedback: feedbackText
        }
      }));
      onItemReject?.(selectedItemId, feedbackText);
      setFeedbackText('');
    }
  };

  const approvedCount = Object.values(reviews).filter(r => r.decision === 'approved').length;
  const needsRevisionCount = Object.values(reviews).filter(r => r.decision === 'needs-revision').length;
  const allReviewed = submittedItems.every(item => reviews[item.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '4px'
            }}>
              Quality Assurance Review - {letter.permitApplicationId} Round {letter.roundNumber}
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Review consultant responses before resubmission
            </div>
          </div>
          {allReviewed && (
            <button
              onClick={onCompleteQA}
              style={{
                padding: '10px 20px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Complete QA Review →
            </button>
          )}
        </div>

        {/* Review progress */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          gap: '16px',
          fontSize: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#10b981'
            }} />
            <span style={{ color: '#6b7280' }}>
              Approved: <strong style={{ color: '#111827' }}>{approvedCount}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ef4444'
            }} />
            <span style={{ color: '#6b7280' }}>
              Needs Revision: <strong style={{ color: '#111827' }}>{needsRevisionCount}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#e5e7eb'
            }} />
            <span style={{ color: '#6b7280' }}>
              Pending: <strong style={{ color: '#111827' }}>{submittedItems.length - approvedCount - needsRevisionCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        gap: '20px',
        flex: 1,
        minHeight: 0
      }}>
        {/* Left: Item list */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px',
          overflow: 'auto'
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '12px'
          }}>
            Submitted Items ({submittedItems.length})
          </h3>

          {submittedItems.map(item => {
            const review = reviews[item.id];
            const isSelected = selectedItemId === item.id;
            const disciplineColor = getDisciplineColor(item.discipline);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                style={{
                  padding: '10px',
                  marginBottom: '8px',
                  backgroundColor: isSelected ? '#eff6ff' : '#f9fafb',
                  border: `1px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    {item.itemNumber}
                  </span>
                  {review && (
                    <span style={{ fontSize: '0.875rem' }}>
                      {review.decision === 'approved' ? '✅' : '🔴'}
                    </span>
                  )}
                </div>
                <div style={{
                  padding: '3px 6px',
                  backgroundColor: disciplineColor.bg,
                  color: disciplineColor.text,
                  fontSize: '0.65rem',
                  fontWeight: '500',
                  borderRadius: '3px',
                  width: 'fit-content'
                }}>
                  {disciplineColor.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Comparison view */}
        {selectedItem ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Item header */}
            <div style={{
              marginBottom: '16px',
              padding: '12px 16px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '4px'
              }}>
                Item {selectedItem.itemNumber}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280'
              }}>
                {selectedItem.sheetNumbers && selectedItem.sheetNumbers.length > 0 && (
                  <>Sheets: {selectedItem.sheetNumbers.join(', ')}</>
                )}
              </div>
            </div>

            {/* Side-by-side comparison */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              flex: 1,
              minHeight: 0
            }}>
              {/* Original correction */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                overflow: 'auto'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  📄 Original Correction
                </h4>
                <div style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  color: '#374151'
                }}>
                  {selectedItem.description}
                </div>
              </div>

              {/* Consultant response */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                overflow: 'auto'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  ✓ Consultant Response
                </h4>
                <div style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  {selectedItem.responseDescription || 'No response provided'}
                </div>
                {selectedItem.revisedSheetNumbers && selectedItem.revisedSheetNumbers.length > 0 && (
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: '#166534'
                  }}>
                    <strong>Updated Sheets:</strong> {selectedItem.revisedSheetNumbers.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Review actions */}
            <div style={{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px'
              }}>
                QA Decision
              </h4>

              {/* Feedback textarea (shown for needs-revision) */}
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Add feedback for revisions (optional for approval, required for rejection)..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px',
                  fontSize: '0.875rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleDecision('approved')}
                  disabled={!!reviews[selectedItem.id]}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: reviews[selectedItem.id] ? '#9ca3af' : '#10b981',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: reviews[selectedItem.id] ? 'not-allowed' : 'pointer'
                  }}
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleDecision('needs-revision')}
                  disabled={!!reviews[selectedItem.id]}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: reviews[selectedItem.id] ? '#9ca3af' : '#ef4444',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: reviews[selectedItem.id] ? 'not-allowed' : 'pointer'
                  }}
                >
                  🔴 Request Revisions
                </button>
              </div>

              {/* Review status */}
              {reviews[selectedItem.id] && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px',
                  backgroundColor: reviews[selectedItem.id].decision === 'approved' ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${reviews[selectedItem.id].decision === 'approved' ? '#86efac' : '#fecaca'}`,
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: reviews[selectedItem.id].decision === 'approved' ? '#166534' : '#991b1b'
                }}>
                  <strong>Decision recorded:</strong> {reviews[selectedItem.id].decision === 'approved' ? 'Approved' : 'Needs Revision'}
                  {reviews[selectedItem.id].feedback && (
                    <div style={{ marginTop: '6px', fontStyle: 'italic' }}>
                      "{reviews[selectedItem.id].feedback}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            Select an item to review
          </div>
        )}
      </div>
    </div>
  );
}
