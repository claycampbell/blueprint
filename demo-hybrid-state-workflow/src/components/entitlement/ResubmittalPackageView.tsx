import { useState } from 'react';
import { CorrectionLetter } from '../../types';
import { groupItemsByDiscipline, calculateTotalEffort } from '../../utils/correctionHelpers';
import { getAllDisciplineColors } from '../../utils/disciplineColors';

interface ResubmittalPackageViewProps {
  letter: CorrectionLetter;
  onGeneratePackage?: () => void;
  onSubmitToJurisdiction?: () => void;
}

interface PackageItem {
  id: string;
  type: 'cover-letter' | 'response-matrix' | 'revised-plans' | 'calculations' | 'reports' | 'other';
  name: string;
  included: boolean;
  required: boolean;
  generatedBy?: 'auto' | 'manual';
}

/**
 * Flow 5: Resubmittal Package View
 * Prepare and organize resubmittal package before sending to jurisdiction
 * Generate cover letter, response matrix, and organize revised plans
 */
export function ResubmittalPackageView({
  letter,
  onGeneratePackage,
  onSubmitToJurisdiction
}: ResubmittalPackageViewProps) {
  const [packageItems, setPackageItems] = useState<PackageItem[]>([
    {
      id: 'cover-letter',
      type: 'cover-letter',
      name: 'Cover Letter (Auto-Generated)',
      included: true,
      required: true,
      generatedBy: 'auto'
    },
    {
      id: 'response-matrix',
      type: 'response-matrix',
      name: 'Response Matrix (Auto-Generated)',
      included: true,
      required: true,
      generatedBy: 'auto'
    },
    {
      id: 'revised-architectural',
      type: 'revised-plans',
      name: 'Revised Architectural Plans',
      included: true,
      required: true
    },
    {
      id: 'revised-structural',
      type: 'revised-plans',
      name: 'Revised Structural Plans',
      included: true,
      required: true
    },
    {
      id: 'revised-civil',
      type: 'revised-plans',
      name: 'Revised Civil Plans',
      included: true,
      required: false
    },
    {
      id: 'calcs',
      type: 'calculations',
      name: 'Structural Calculations',
      included: false,
      required: false
    },
    {
      id: 'drainage',
      type: 'reports',
      name: 'Drainage Report',
      included: false,
      required: false
    }
  ]);

  const [notes, setNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const toggleItem = (itemId: string) => {
    setPackageItems(prev =>
      prev.map(item =>
        item.id === itemId && !item.required
          ? { ...item, included: !item.included }
          : item
      )
    );
  };

  const groupedItems = groupItemsByDiscipline(letter.items);
  const completedItems = letter.items.filter(item => item.status === 'completed');
  const totalEffort = calculateTotalEffort(completedItems);

  const includedCount = packageItems.filter(item => item.included).length;
  const readyToSubmit = includedCount >= 2 && letter.itemsCompleted === letter.totalItems;

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
              Resubmittal Package - {letter.permitApplicationId} Round {letter.roundNumber}
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Prepare package for jurisdiction resubmission
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onGeneratePackage}
              style={{
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#3b82f6',
                backgroundColor: 'white',
                border: '1px solid #3b82f6',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              📄 Generate Documents
            </button>
            <button
              onClick={onSubmitToJurisdiction}
              disabled={!readyToSubmit}
              style={{
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: readyToSubmit ? '#10b981' : '#9ca3af',
                border: 'none',
                borderRadius: '6px',
                cursor: readyToSubmit ? 'pointer' : 'not-allowed'
              }}
            >
              Submit to Jurisdiction →
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          gap: '20px',
          fontSize: '0.75rem',
          color: '#6b7280'
        }}>
          <div>
            <strong style={{ color: '#111827' }}>{letter.itemsCompleted}/{letter.totalItems}</strong> corrections addressed
          </div>
          <div>
            <strong style={{ color: '#111827' }}>{includedCount}</strong> documents in package
          </div>
          <div>
            <strong style={{ color: '#111827' }}>{totalEffort}h</strong> total effort
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '20px',
        flex: 1,
        minHeight: 0
      }}>
        {/* Left: Package checklist */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '12px'
          }}>
            Package Contents
          </h3>

          <div style={{ flex: 1, overflow: 'auto' }}>
            {/* Required documents */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Required Documents
              </h4>
              {packageItems
                .filter(item => item.required)
                .map(item => (
                  <PackageItemCard
                    key={item.id}
                    item={item}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
            </div>

            {/* Optional documents */}
            <div>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Optional Documents
              </h4>
              {packageItems
                .filter(item => !item.required)
                .map(item => (
                  <PackageItemCard
                    key={item.id}
                    item={item}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
            </div>

            {/* Submission notes */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                Submission Notes
              </h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for the submission (will be included in cover letter)..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '10px',
                  fontSize: '0.875rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Summary panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Response summary */}
          <div style={{
            marginBottom: '16px',
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
              Response Summary
            </h3>

            <div style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: letter.itemsCompleted === letter.totalItems ? '#f0fdf4' : '#fef3c7',
              border: `1px solid ${letter.itemsCompleted === letter.totalItems ? '#86efac' : '#fcd34d'}`,
              borderRadius: '6px'
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: letter.itemsCompleted === letter.totalItems ? '#166534' : '#78350f',
                marginBottom: '4px'
              }}>
                {letter.itemsCompleted === letter.totalItems ? '✅ All corrections addressed' : '⚠️ Corrections in progress'}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: letter.itemsCompleted === letter.totalItems ? '#166534' : '#92400e'
              }}>
                {letter.itemsCompleted} of {letter.totalItems} items complete
              </div>
            </div>

            {/* By discipline breakdown */}
            <div style={{ fontSize: '0.75rem' }}>
              <div style={{
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                Corrections by Discipline:
              </div>
              {getAllDisciplineColors().map(({ discipline, color }) => {
                const items = groupedItems[discipline] || [];
                if (items.length === 0) return null;

                const completed = items.filter(item => item.status === 'completed').length;

                return (
                  <div
                    key={discipline}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                      padding: '6px 8px',
                      backgroundColor: color.bg,
                      borderRadius: '4px'
                    }}
                  >
                    <span style={{
                      fontWeight: '500',
                      color: color.text
                    }}>
                      {color.label}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      color: color.text,
                      opacity: 0.8
                    }}>
                      {completed}/{items.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview button */}
          <div style={{
            padding: '16px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <button
              onClick={() => setShowPreview(!showPreview)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              {showPreview ? '📋 Hide Preview' : '👁️ Preview Cover Letter'}
            </button>

            {showPreview && (
              <div style={{
                padding: '12px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '0.75rem',
                lineHeight: '1.5',
                color: '#374151',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                  RE: Response to Correction Letter - {letter.permitApplicationId}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  Dear Plan Reviewer,
                </div>
                <div style={{ marginBottom: '12px' }}>
                  We have addressed all {letter.totalItems} items identified in your correction letter dated {new Date(letter.receivedDate).toLocaleDateString()}.
                  This resubmittal package includes:
                </div>
                <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
                  {packageItems
                    .filter(item => item.included)
                    .map(item => (
                      <li key={item.id} style={{ marginBottom: '4px' }}>
                        {item.name}
                      </li>
                    ))}
                </ul>
                {notes && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Additional Notes:</strong><br />
                    {notes}
                  </div>
                )}
                <div style={{ marginBottom: '12px' }}>
                  We believe all corrections have been satisfactorily addressed. Please contact us if you have any questions or require additional information.
                </div>
                <div>
                  Sincerely,<br />
                  [Project Manager Name]
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              Quick Actions:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                📥 Download Package as ZIP
              </button>
              <button
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                📧 Email to Plan Reviewer
              </button>
              <button
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                📋 Copy Submission Checklist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PackageItemCardProps {
  item: PackageItem;
  onToggle: () => void;
}

function PackageItemCard({ item, onToggle }: PackageItemCardProps) {
  const typeIcons = {
    'cover-letter': '📧',
    'response-matrix': '📊',
    'revised-plans': '📐',
    'calculations': '🔢',
    'reports': '📄',
    'other': '📎'
  };

  return (
    <div
      onClick={item.required ? undefined : onToggle}
      style={{
        marginBottom: '8px',
        padding: '12px',
        backgroundColor: 'white',
        border: `1px solid ${item.included ? '#86efac' : '#e5e7eb'}`,
        borderLeft: `4px solid ${item.included ? '#10b981' : '#d1d5db'}`,
        borderRadius: '6px',
        cursor: item.required ? 'default' : 'pointer',
        opacity: item.included ? 1 : 0.7,
        transition: 'all 0.15s'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <span style={{ fontSize: '1.25rem' }}>{typeIcons[item.type]}</span>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#111827',
              marginBottom: '2px'
            }}>
              {item.name}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {item.required && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  color: '#dc2626',
                  backgroundColor: '#fee2e2',
                  padding: '2px 6px',
                  borderRadius: '3px'
                }}>
                  REQUIRED
                </span>
              )}
              {item.generatedBy === 'auto' && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: '500',
                  color: '#3b82f6',
                  backgroundColor: '#dbeafe',
                  padding: '2px 6px',
                  borderRadius: '3px'
                }}>
                  AUTO-GENERATED
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '4px',
          border: `2px solid ${item.included ? '#10b981' : '#d1d5db'}`,
          backgroundColor: item.included ? '#10b981' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          {item.included && '✓'}
        </div>
      </div>
    </div>
  );
}
