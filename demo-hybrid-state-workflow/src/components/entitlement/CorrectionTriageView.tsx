import { useState } from 'react';
import { CorrectionLetter, CorrectionItem } from '../../types';
import { CorrectionLetterHeader } from './CorrectionLetterHeader';
import { CorrectionItemCard } from './CorrectionItemCard';

interface CorrectionTriageViewProps {
  letter: CorrectionLetter;
  pdfUrl?: string;
  onItemUpdate?: (itemId: string, updates: Partial<CorrectionItem>) => void;
  onCompleteTriageClicked?: () => void;
}

/**
 * Flow 1: Correction Triage View
 * Side-by-side layout: PDF viewer on left, correction items on right
 * Used when correction letter is first received for initial review and triage
 */
export function CorrectionTriageView({
  letter,
  pdfUrl,
  onItemUpdate,
  onCompleteTriageClicked
}: CorrectionTriageViewProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [pdfPage, setPdfPage] = useState(1);

  const untriaged = letter.items.filter(item => item.status === 'not-started');
  const triaged = letter.items.filter(item => item.status !== 'not-started');

  const handleItemClick = (item: CorrectionItem) => {
    setSelectedItemId(item.id);
    // TODO: In real implementation, parse sheet numbers and jump to PDF page
    // For now, just highlight the item
  };

  const handleQuickAssign = (itemId: string, person: string) => {
    onItemUpdate?.(itemId, { assignedToPerson: person, status: 'in-progress' });
  };

  const allTriaged = untriaged.length === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <CorrectionLetterHeader letter={letter} />

        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🔍</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#78350f' }}>
              Triage Mode: Review and Assign Corrections
            </div>
            <div style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '2px' }}>
              Review each item, assign to consultants, and set priorities. {untriaged.length} items remaining.
            </div>
          </div>
          {allTriaged && (
            <button
              onClick={onCompleteTriageClicked}
              style={{
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Complete Triage →
            </button>
          )}
        </div>
      </div>

      {/* Split pane layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        flex: 1,
        minHeight: 0
      }}>
        {/* Left: PDF Viewer */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              Correction Letter PDF
            </h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setPdfPage(Math.max(1, pdfPage - 1))}
                disabled={pdfPage === 1}
                style={{
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: pdfPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: pdfPage === 1 ? 0.5 : 1
                }}
              >
                ← Prev
              </button>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Page {pdfPage}
              </span>
              <button
                onClick={() => setPdfPage(pdfPage + 1)}
                style={{
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                Next →
              </button>
            </div>
          </div>

          {/* PDF Display Area */}
          <div style={{
            flex: 1,
            backgroundColor: '#f9fafb',
            border: '2px dashed #d1d5db',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '12px',
            overflow: 'auto'
          }}>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                title="Correction Letter PDF"
              />
            ) : (
              <>
                <span style={{ fontSize: '3rem', opacity: 0.3 }}>📄</span>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  textAlign: 'center',
                  maxWidth: '300px'
                }}>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    PDF Viewer Placeholder
                  </div>
                  <div style={{ fontSize: '0.75rem' }}>
                    In production, this would display the correction letter PDF with navigation and annotation tools.
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{
            marginTop: '12px',
            display: 'flex',
            gap: '8px'
          }}>
            <button
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Download PDF
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
                cursor: 'pointer'
              }}
            >
              Print
            </button>
          </div>
        </div>

        {/* Right: Correction Items List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Items header with tabs */}
          <div style={{
            marginBottom: '12px',
            display: 'flex',
            gap: '4px',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <button
              style={{
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '2px solid #3b82f6',
                marginBottom: '-2px',
                cursor: 'pointer'
              }}
            >
              Untriaged ({untriaged.length})
            </button>
            <button
              style={{
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Assigned ({triaged.length})
            </button>
          </div>

          {/* Scrollable items list */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            paddingRight: '8px'
          }}>
            {untriaged.length > 0 ? (
              untriaged.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  style={{
                    marginBottom: '8px',
                    cursor: 'pointer',
                    opacity: selectedItemId === item.id ? 1 : 0.9,
                    transform: selectedItemId === item.id ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.15s'
                  }}
                >
                  <CorrectionItemCard
                    item={item}
                    showActions={false}
                  />
                  {/* Quick assign buttons */}
                  <div style={{
                    marginTop: '-4px',
                    marginBottom: '4px',
                    paddingLeft: '16px',
                    display: 'flex',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', marginRight: '8px' }}>
                      Quick assign:
                    </span>
                    {['J. Smith', 'A. Lee', 'M. Johnson'].map(person => (
                      <button
                        key={person}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAssign(item.id, person);
                        }}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.65rem',
                          fontWeight: '500',
                          color: '#3b82f6',
                          backgroundColor: 'white',
                          border: '1px solid #3b82f6',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {person}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px dashed #d1d5db'
              }}>
                <span style={{ fontSize: '3rem', opacity: 0.3 }}>✅</span>
                <div style={{
                  marginTop: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#111827'
                }}>
                  All items triaged!
                </div>
                <div style={{
                  marginTop: '4px',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  All correction items have been assigned. Ready to move to assignment workflow.
                </div>
              </div>
            )}
          </div>

          {/* Bulk actions footer */}
          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '6px',
            display: 'flex',
            gap: '8px'
          }}>
            <button
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Auto-Assign All
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
                cursor: 'pointer'
              }}
            >
              Bulk Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
