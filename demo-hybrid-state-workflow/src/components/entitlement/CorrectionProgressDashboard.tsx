import { useState } from 'react';
import { CorrectionLetter } from '../../types';
import { CorrectionLetterHeader } from './CorrectionLetterHeader';
import { CorrectionItemCard } from './CorrectionItemCard';
import { groupItemsByStatus, sortItemsByPriority } from '../../utils/correctionHelpers';

interface CorrectionProgressDashboardProps {
  letter: CorrectionLetter;
  onItemStatusChange?: (itemId: string, newStatus: any) => void;
}

type ViewMode = 'by-status' | 'by-discipline' | 'by-priority';

/**
 * Dashboard for tracking correction progress
 * Shows overview with multiple view modes and collapsible sections
 */
export function CorrectionProgressDashboard({ letter, onItemStatusChange }: CorrectionProgressDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('by-status');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['at-risk', 'in-progress']));

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const groupedByStatus = groupItemsByStatus(letter.items);
  const atRiskItems = letter.items.filter(item => {
    // Import isItemAtRisk inline to avoid circular dependency
    if (!item.dueDate || item.status === 'completed') return false;
    const now = new Date();
    const dueDate = new Date(item.dueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue < 0 || daysUntilDue <= 2;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Letter Header */}
      <CorrectionLetterHeader letter={letter} />

      {/* View Mode Toggle */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        padding: '4px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        width: 'fit-content'
      }}>
        <button
          onClick={() => setViewMode('by-status')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'by-status' ? 'white' : 'transparent',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: viewMode === 'by-status' ? '#111827' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
        >
          By Status
        </button>
        <button
          onClick={() => setViewMode('by-discipline')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'by-discipline' ? 'white' : 'transparent',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: viewMode === 'by-discipline' ? '#111827' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
        >
          By Discipline
        </button>
        <button
          onClick={() => setViewMode('by-priority')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'by-priority' ? 'white' : 'transparent',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: viewMode === 'by-priority' ? '#111827' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
        >
          By Priority
        </button>
      </div>

      {/* At Risk Section (Always shown first if items exist) */}
      {atRiskItems.length > 0 && (
        <CollapsibleSection
          title="At Risk"
          count={atRiskItems.length}
          icon="🔴"
          isExpanded={expandedSections.has('at-risk')}
          onToggle={() => toggleSection('at-risk')}
          accentColor="#dc2626"
        >
          {atRiskItems.map(item => (
            <CorrectionItemCard
              key={item.id}
              item={item}
              onStatusChange={onItemStatusChange}
              showActions={true}
            />
          ))}
        </CollapsibleSection>
      )}

      {/* Content based on view mode */}
      {viewMode === 'by-status' && (
        <>
          {groupedByStatus['in-progress'].length > 0 && (
            <CollapsibleSection
              title="In Progress"
              count={groupedByStatus['in-progress'].length}
              icon="🔄"
              isExpanded={expandedSections.has('in-progress')}
              onToggle={() => toggleSection('in-progress')}
              accentColor="#f59e0b"
            >
              {groupedByStatus['in-progress'].map(item => (
                <CorrectionItemCard
                  key={item.id}
                  item={item}
                  onStatusChange={onItemStatusChange}
                  showActions={true}
                />
              ))}
            </CollapsibleSection>
          )}

          {groupedByStatus['consultant-submitted'].length > 0 && (
            <CollapsibleSection
              title="Consultant Submitted"
              count={groupedByStatus['consultant-submitted'].length}
              icon="📤"
              isExpanded={expandedSections.has('consultant-submitted')}
              onToggle={() => toggleSection('consultant-submitted')}
              accentColor="#3b82f6"
            >
              {groupedByStatus['consultant-submitted'].map(item => (
                <CorrectionItemCard
                  key={item.id}
                  item={item}
                  onStatusChange={onItemStatusChange}
                  showActions={true}
                />
              ))}
            </CollapsibleSection>
          )}

          {groupedByStatus['not-started'].length > 0 && (
            <CollapsibleSection
              title="Not Started"
              count={groupedByStatus['not-started'].length}
              icon="⏸️"
              isExpanded={expandedSections.has('not-started')}
              onToggle={() => toggleSection('not-started')}
              accentColor="#9ca3af"
            >
              {groupedByStatus['not-started'].map(item => (
                <CorrectionItemCard
                  key={item.id}
                  item={item}
                  onStatusChange={onItemStatusChange}
                  showActions={true}
                />
              ))}
            </CollapsibleSection>
          )}

          {groupedByStatus['completed'].length > 0 && (
            <CollapsibleSection
              title="Completed"
              count={groupedByStatus['completed'].length}
              icon="✅"
              isExpanded={expandedSections.has('completed')}
              onToggle={() => toggleSection('completed')}
              accentColor="#10b981"
            >
              {groupedByStatus['completed'].map(item => (
                <CorrectionItemCard key={item.id} item={item} showActions={false} />
              ))}
            </CollapsibleSection>
          )}
        </>
      )}

      {viewMode === 'by-priority' && (
        <CollapsibleSection
          title="All Items (Sorted by Priority)"
          count={letter.items.length}
          icon="⚡"
          isExpanded={true}
          onToggle={() => {}}
          accentColor="#6366f1"
        >
          {sortItemsByPriority(letter.items).map(item => (
            <CorrectionItemCard
              key={item.id}
              item={item}
              onStatusChange={onItemStatusChange}
              showActions={item.status !== 'completed'}
            />
          ))}
        </CollapsibleSection>
      )}

      {viewMode === 'by-discipline' && (
        <>
          {Object.entries(
            letter.items.reduce((acc, item) => {
              if (!acc[item.discipline]) acc[item.discipline] = [];
              acc[item.discipline].push(item);
              return acc;
            }, {} as Record<string, typeof letter.items>)
          ).map(([discipline, items]) => (
            <CollapsibleSection
              key={discipline}
              title={discipline.charAt(0).toUpperCase() + discipline.slice(1)}
              count={items.length}
              icon="📋"
              isExpanded={expandedSections.has(discipline)}
              onToggle={() => toggleSection(discipline)}
              accentColor="#6366f1"
            >
              {items.map(item => (
                <CorrectionItemCard
                  key={item.id}
                  item={item}
                  onStatusChange={onItemStatusChange}
                  showActions={item.status !== 'completed'}
                />
              ))}
            </CollapsibleSection>
          ))}
        </>
      )}

      {/* Actions Footer */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        <button
          style={{
            padding: '10px 20px',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Download Status Report
        </button>
        {letter.itemsCompleted === letter.totalItems && (
          <button
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
            Move to QA Review →
          </button>
        )}
      </div>
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  count: number;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  accentColor: string;
  children: React.ReactNode;
}

function CollapsibleSection({ title, count, icon, isExpanded, onToggle, accentColor, children }: CollapsibleSectionProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: 'white',
          border: `1px solid ${accentColor}20`,
          borderLeft: `4px solid ${accentColor}`,
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: isExpanded ? '12px' : '0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.25rem' }}>{icon}</span>
          <span style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
            {title}
          </span>
          <span style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            {count}
          </span>
        </div>
        <span style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          transition: 'transform 0.2s',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div style={{ paddingLeft: '12px' }}>
          {children}
        </div>
      )}
    </div>
  );
}
