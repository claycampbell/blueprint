import { useState } from 'react';
import { CorrectionLetter, CorrectionItem, CorrectionDiscipline } from '../../types';
import { getDisciplineColor, getAllDisciplineColors } from '../../utils/disciplineColors';
import { groupItemsByDiscipline } from '../../utils/correctionHelpers';

interface BulkAssignmentViewProps {
  letter: CorrectionLetter;
  availableConsultants: ConsultantProfile[];
  onAssignmentComplete?: (assignments: Record<string, string>) => void;
}

interface ConsultantProfile {
  id: string;
  name: string;
  email: string;
  disciplines: CorrectionDiscipline[];
  currentWorkload: number; // Number of active items
  availability: 'available' | 'busy' | 'unavailable';
}

/**
 * Flow 2: Bulk Assignment View
 * Assign corrections to consultants by discipline with drag-and-drop and bulk operations
 */
export function BulkAssignmentView({
  letter,
  availableConsultants,
  onAssignmentComplete
}: BulkAssignmentViewProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedDiscipline, setSelectedDiscipline] = useState<CorrectionDiscipline | 'all'>('all');

  const groupedItems = groupItemsByDiscipline(letter.items);
  const unassignedItems = letter.items.filter(item => !assignments[item.id] && !item.assignedToPerson);

  const handleAssignItem = (itemId: string, consultantId: string) => {
    setAssignments(prev => ({
      ...prev,
      [itemId]: consultantId
    }));
  };

  const handleBulkAssignDiscipline = (discipline: CorrectionDiscipline, consultantId: string) => {
    const disciplineItems = groupedItems[discipline] || [];
    const newAssignments = { ...assignments };
    disciplineItems.forEach(item => {
      if (!item.assignedToPerson) {
        newAssignments[item.id] = consultantId;
      }
    });
    setAssignments(newAssignments);
  };

  const handleAutoAssign = () => {
    const newAssignments = { ...assignments };
    unassignedItems.forEach(item => {
      // Find best consultant based on discipline match and workload
      const matchingConsultants = availableConsultants
        .filter(c => c.disciplines.includes(item.discipline) && c.availability !== 'unavailable')
        .sort((a, b) => a.currentWorkload - b.currentWorkload);

      if (matchingConsultants.length > 0) {
        newAssignments[item.id] = matchingConsultants[0].id;
      }
    });
    setAssignments(newAssignments);
  };

  const handleSaveAssignments = () => {
    onAssignmentComplete?.(assignments);
  };

  const assignmentCount = Object.keys(assignments).length;
  const totalUnassigned = unassignedItems.length;

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
              Bulk Assignment - {letter.permitApplicationId} Round {letter.roundNumber}
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {totalUnassigned - assignmentCount} of {totalUnassigned} items still need assignment
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAutoAssign}
              disabled={totalUnassigned === 0}
              style={{
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#3b82f6',
                backgroundColor: 'white',
                border: '1px solid #3b82f6',
                borderRadius: '6px',
                cursor: totalUnassigned === 0 ? 'not-allowed' : 'pointer',
                opacity: totalUnassigned === 0 ? 0.5 : 1
              }}
            >
              🤖 Auto-Assign All
            </button>
            <button
              onClick={handleSaveAssignments}
              disabled={assignmentCount === 0}
              style={{
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: assignmentCount > 0 ? '#10b981' : '#9ca3af',
                border: 'none',
                borderRadius: '6px',
                cursor: assignmentCount === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Save {assignmentCount > 0 ? `(${assignmentCount})` : ''} Assignments →
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {totalUnassigned > 0 && (
          <div style={{
            marginTop: '12px',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(assignmentCount / totalUnassigned) * 100}%`,
              backgroundColor: '#10b981',
              transition: 'width 0.3s'
            }} />
          </div>
        )}
      </div>

      {/* Split layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '20px',
        flex: 1,
        minHeight: 0
      }}>
        {/* Left: Consultant roster */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          overflow: 'auto'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '12px'
          }}>
            Available Consultants
          </h3>

          {availableConsultants.map(consultant => {
            const assignedToConsultant = Object.entries(assignments).filter(
              ([_, consultantId]) => consultantId === consultant.id
            ).length;

            return (
              <ConsultantCard
                key={consultant.id}
                consultant={consultant}
                newAssignments={assignedToConsultant}
              />
            );
          })}
        </div>

        {/* Right: Items by discipline */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Discipline filter */}
          <div style={{
            marginBottom: '16px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setSelectedDiscipline('all')}
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: selectedDiscipline === 'all' ? 'white' : '#374151',
                backgroundColor: selectedDiscipline === 'all' ? '#3b82f6' : 'white',
                border: `1px solid ${selectedDiscipline === 'all' ? '#3b82f6' : '#d1d5db'}`,
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              All Disciplines
            </button>
            {getAllDisciplineColors().map(({ discipline, color }) => {
              const itemCount = (groupedItems[discipline] || []).length;
              if (itemCount === 0) return null;

              return (
                <button
                  key={discipline}
                  onClick={() => setSelectedDiscipline(discipline)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: selectedDiscipline === discipline ? color.text : '#374151',
                    backgroundColor: selectedDiscipline === discipline ? color.bg : 'white',
                    border: `1px solid ${selectedDiscipline === discipline ? color.border : '#d1d5db'}`,
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {color.label} ({itemCount})
                </button>
              );
            })}
          </div>

          {/* Items list */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {Object.entries(groupedItems)
              .filter(([discipline]) =>
                selectedDiscipline === 'all' || discipline === selectedDiscipline
              )
              .map(([discipline, items]) => (
                <DisciplineGroup
                  key={discipline}
                  discipline={discipline as CorrectionDiscipline}
                  items={items}
                  assignments={assignments}
                  consultants={availableConsultants}
                  onAssignItem={handleAssignItem}
                  onBulkAssign={(consultantId) =>
                    handleBulkAssignDiscipline(discipline as CorrectionDiscipline, consultantId)
                  }
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ConsultantCardProps {
  consultant: ConsultantProfile;
  newAssignments: number;
}

function ConsultantCard({ consultant, newAssignments }: ConsultantCardProps) {
  const availabilityConfig = {
    available: { icon: '🟢', label: 'Available', color: '#10b981' },
    busy: { icon: '🟡', label: 'Busy', color: '#f59e0b' },
    unavailable: { icon: '🔴', label: 'Unavailable', color: '#ef4444' }
  };

  const status = availabilityConfig[consultant.availability];

  return (
    <div style={{
      marginBottom: '12px',
      padding: '12px',
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '6px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '2px'
          }}>
            {consultant.name}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            {consultant.email}
          </div>
        </div>
        <span style={{ fontSize: '0.875rem' }}>{status.icon}</span>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        marginBottom: '8px'
      }}>
        {consultant.disciplines.map(discipline => {
          const color = getDisciplineColor(discipline);
          return (
            <span
              key={discipline}
              style={{
                padding: '2px 6px',
                fontSize: '0.65rem',
                fontWeight: '500',
                backgroundColor: color.bg,
                color: color.text,
                borderRadius: '3px'
              }}
            >
              {color.label}
            </span>
          );
        })}
      </div>

      <div style={{
        fontSize: '0.75rem',
        color: '#6b7280',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Current: {consultant.currentWorkload} items</span>
        {newAssignments > 0 && (
          <span style={{ color: '#10b981', fontWeight: '600' }}>
            +{newAssignments} new
          </span>
        )}
      </div>
    </div>
  );
}

interface DisciplineGroupProps {
  discipline: CorrectionDiscipline;
  items: CorrectionItem[];
  assignments: Record<string, string>;
  consultants: ConsultantProfile[];
  onAssignItem: (itemId: string, consultantId: string) => void;
  onBulkAssign: (consultantId: string) => void;
}

function DisciplineGroup({
  discipline,
  items,
  assignments,
  consultants,
  onAssignItem,
  onBulkAssign
}: DisciplineGroupProps) {
  const color = getDisciplineColor(discipline);
  const unassignedCount = items.filter(item => !assignments[item.id] && !item.assignedToPerson).length;
  const matchingConsultants = consultants.filter(c => c.disciplines.includes(discipline));

  return (
    <div style={{
      marginBottom: '20px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Group header */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: color.bg,
        borderBottom: `2px solid ${color.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: color.text
          }}>
            {color.label}
          </span>
          <span style={{
            marginLeft: '8px',
            fontSize: '0.75rem',
            color: color.text,
            opacity: 0.8
          }}>
            {items.length} items ({unassignedCount} unassigned)
          </span>
        </div>

        {/* Bulk assign dropdown */}
        {matchingConsultants.length > 0 && unassignedCount > 0 && (
          <select
            onChange={(e) => {
              if (e.target.value) {
                onBulkAssign(e.target.value);
                e.target.value = '';
              }
            }}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              border: `1px solid ${color.border}`,
              borderRadius: '4px',
              backgroundColor: 'white',
              color: color.text,
              cursor: 'pointer'
            }}
          >
            <option value="">Bulk assign all...</option>
            {matchingConsultants.map(consultant => (
              <option key={consultant.id} value={consultant.id}>
                {consultant.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Items */}
      <div style={{ padding: '12px' }}>
        {items.map(item => {
          const assignedConsultantId = assignments[item.id];
          const assignedConsultant = assignedConsultantId
            ? consultants.find(c => c.id === assignedConsultantId)
            : null;

          return (
            <div
              key={item.id}
              style={{
                marginBottom: '8px',
                padding: '12px',
                backgroundColor: assignedConsultant ? '#f0fdf4' : '#f9fafb',
                border: `1px solid ${assignedConsultant ? '#86efac' : '#e5e7eb'}`,
                borderRadius: '6px'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '4px'
                  }}>
                    {item.itemNumber}: {item.description}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    {item.sheetNumbers && item.sheetNumbers.length > 0 && (
                      <>Sheets: {item.sheetNumbers.join(', ')}</>
                    )}
                  </div>
                </div>

                {/* Assignment selector */}
                <select
                  value={assignedConsultantId || ''}
                  onChange={(e) => onAssignItem(item.id, e.target.value)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    minWidth: '150px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Assign to...</option>
                  {matchingConsultants.map(consultant => (
                    <option key={consultant.id} value={consultant.id}>
                      {consultant.name}
                    </option>
                  ))}
                </select>
              </div>

              {assignedConsultant && (
                <div style={{
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid #d1fae5',
                  fontSize: '0.75rem',
                  color: '#059669',
                  fontWeight: '500'
                }}>
                  ✓ Will be assigned to {assignedConsultant.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
