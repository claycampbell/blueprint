import React, { useState } from 'react';
import { MULTIPLE_PROPERTIES } from '../data/multipleProperties';
import { getDayOffset, getDuration, addDays } from '../utils/dateHelpers';
import { getLifecycleLabel } from '../utils/propertyHelpers';
import { Process } from '../types';
import { UserRole, PERSONAS } from '../types/personas';

interface TimelineViewProps {
  onPropertyClick: (propertyId: string) => void;
  currentRole: UserRole;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ onPropertyClick, currentRole }) => {
  const persona = PERSONAS[currentRole];
  const allProperties = Object.values(MULTIPLE_PROPERTIES);

  // Filter properties based on role lifecycle access
  const properties = allProperties.filter(p =>
    persona.permissions.lifecycleAccess.includes(p.lifecycle)
  );
  // Start timeline 10 days ago to show overdue items
  const today = new Date();
  const timelineStartDate = addDays(today, -10);
  const timelineDays = 55; // Show 55 days total (10 past + 45 future)

  // Track expanded properties
  const [expandedProperties, setExpandedProperties] = useState<Set<string>>(new Set());

  // Get offset from timeline start (not from today)
  const getTimelineOffset = (date: Date): number => {
    const start = new Date(timelineStartDate);
    start.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - start.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Only show properties that have active processes with due dates
  const propertiesWithTimeline = properties.filter(p =>
    p.activeProcesses.some(proc => proc.dueDate)
  );

  const toggleProperty = (propertyId: string) => {
    const newExpanded = new Set(expandedProperties);
    if (newExpanded.has(propertyId)) {
      newExpanded.delete(propertyId);
    } else {
      newExpanded.add(propertyId);
    }
    setExpandedProperties(newExpanded);
  };

  const getProcessColor = (process: Process): string => {
    if (process.status === 'completed') return '#10b981'; // green
    if (process.status === 'blocked') return '#ef4444'; // red
    if (process.status === 'in-progress') return '#8b5cf6'; // purple
    return '#3b82f6'; // blue for pending
  };

  const getProcessLighterColor = (process: Process): string => {
    if (process.status === 'completed') return '#d1fae5';
    if (process.status === 'blocked') return '#fee2e2';
    if (process.status === 'in-progress') return '#ede9fe';
    return '#dbeafe';
  };

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingBottom: '2rem' }}>
      {/* Professional Timeline Header */}
      <header style={{
        backgroundColor: '#ffffff',
        padding: '1.75rem 2.5rem',
        marginBottom: '0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '0.375rem',
              letterSpacing: '-0.025em'
            }}>
              Timeline View
            </h1>
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b',
              fontWeight: '400'
            }}>
              {propertiesWithTimeline.length} properties with scheduled processes
            </div>
          </div>

          {/* View controls */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              color: '#475569',
              cursor: 'pointer',
              fontWeight: '500',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}>
              Today
            </button>
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              backgroundColor: '#f1f5f9',
              padding: '0.25rem',
              borderRadius: '8px'
            }}>
              <button style={{
                backgroundColor: '#ffffff',
                border: 'none',
                padding: '0.5rem 0.875rem',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                color: '#0f172a',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}>
                Month
              </button>
              <button style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '0.5rem 0.875rem',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                color: '#64748b',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Week
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Timeline Grid Container */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0',
        overflow: 'auto',
        border: 'none',
        borderTop: '1px solid #e2e8f0'
      }}>
        {/* Timeline header with date columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '350px repeat(55, 40px)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#fafafa',
          zIndex: 10,
          borderBottom: '2px solid #e2e8f0'
        }}>
          <div style={{
            padding: '0.875rem 1.5rem',
            fontWeight: '600',
            fontSize: '0.6875rem',
            color: '#64748b',
            borderRight: '1px solid #e2e8f0',
            position: 'sticky',
            left: 0,
            backgroundColor: '#fafafa',
            zIndex: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center'
          }}>
            Property / Process
          </div>
          {Array.from({ length: timelineDays }, (_, i) => {
            const date = addDays(timelineStartDate, i);
            const isToday = i === 10; // Today is day 10 (timeline starts 10 days ago)
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isMonthStart = date.getDate() === 1;

            return (
              <div key={i} style={{
                padding: '0.5rem 0.125rem',
                fontSize: '0.6875rem',
                textAlign: 'center',
                borderLeft: isMonthStart ? '2px solid #cbd5e1' : i % 7 === 0 ? '1px solid #e2e8f0' : 'none',
                backgroundColor: isToday ? '#eff6ff' : 'transparent',
                fontWeight: isToday ? '600' : '400',
                color: isToday ? '#2563eb' : isWeekend ? '#94a3b8' : '#64748b'
              }}>
                <div style={{ fontSize: '0.625rem', marginBottom: '0.125rem', opacity: 0.7 }}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>
                  {date.getDate()}
                </div>
                {isMonthStart && (
                  <div style={{
                    fontSize: '0.625rem',
                    marginTop: '0.125rem',
                    fontWeight: '600',
                    color: '#475569'
                  }}>
                    {date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Timeline rows - grouped by property */}
        {propertiesWithTimeline.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            No properties with active processes
          </div>
        ) : (
          propertiesWithTimeline.map(property => {
            const activeProcesses = property.activeProcesses.filter(p => p.dueDate);
            const isExpanded = expandedProperties.has(property.id);

            return (
              <div key={property.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                {/* Property header row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '350px repeat(55, 40px)',
                    position: 'relative',
                    minHeight: '60px',
                    cursor: 'pointer',
                    backgroundColor: '#ffffff'
                  }}
                  onClick={() => toggleProperty(property.id)}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  {/* Property info column */}
                  <div style={{
                    padding: '1rem 1.5rem',
                    borderRight: '1px solid #e2e8f0',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'inherit',
                    zIndex: 5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    {/* Expand/collapse icon */}
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      transition: 'transform 0.2s',
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                    }}>
                      ▶
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: '600',
                        fontSize: '0.9375rem',
                        marginBottom: '0.25rem',
                        color: '#0f172a',
                        letterSpacing: '-0.01em'
                      }}>
                        {property.attributes.address}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center'
                      }}>
                        <span>{getLifecycleLabel(property.lifecycle)}</span>
                        <span style={{
                          backgroundColor: '#f1f5f9',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                          fontWeight: '600',
                          color: '#475569'
                        }}>
                          {activeProcesses.length} {activeProcesses.length === 1 ? 'process' : 'processes'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline cells for property header */}
                  {Array.from({ length: timelineDays }, (_, i) => {
                    const date = addDays(timelineStartDate, i);
                    const isToday = i === 10; // Today is day 10
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const isMonthStart = date.getDate() === 1;

                    return (
                      <div key={i} style={{
                        borderLeft: isMonthStart ? '2px solid #cbd5e1' : i % 7 === 0 ? '1px solid #f1f5f9' : 'none',
                        backgroundColor: isToday ? '#eff6ff20' : isWeekend ? '#f8fafc' : 'transparent',
                        position: 'relative'
                      }} />
                    );
                  })}

                  {/* Summary Gantt bar for property (when collapsed) */}
                  {!isExpanded && activeProcesses.length > 0 && (() => {
                    // Find earliest start and latest end
                    const startDates = activeProcesses.map(p => getTimelineOffset(p.startedAt!)).filter(d => d !== undefined);
                    const endDates = activeProcesses.map(p => getTimelineOffset(p.dueDate!)).filter(d => d !== undefined);

                    if (startDates.length === 0 || endDates.length === 0) return null;

                    const earliestStart = Math.min(...startDates);
                    const latestEnd = Math.max(...endDates);
                    const visibleStart = Math.max(0, earliestStart);
                    const visibleEnd = Math.min(timelineDays - 1, latestEnd);
                    const visibleDuration = visibleEnd - visibleStart + 1;

                    if (visibleDuration <= 0) return null;

                    return (
                      <div
                        style={{
                          position: 'absolute',
                          left: `${350 + visibleStart * 40}px`,
                          width: `${visibleDuration * 40 - 4}px`,
                          height: '8px',
                          top: '26px',
                          backgroundColor: '#cbd5e1',
                          borderRadius: '4px',
                          zIndex: 2
                        }}
                      />
                    );
                  })()}
                </div>

                {/* Individual process rows (when expanded) */}
                {isExpanded && activeProcesses.map((process, idx) => {
                  if (!process.dueDate || !process.startedAt) return null;

                  const startOffset = getTimelineOffset(process.startedAt);
                  const endOffset = getTimelineOffset(process.dueDate);
                  const duration = getDuration(process.startedAt, process.dueDate);

                  // Only show if within timeline range
                  if (endOffset < 0 || startOffset >= timelineDays) return null;

                  // Clip to visible range
                  const visibleStart = Math.max(0, startOffset);
                  const visibleEnd = Math.min(timelineDays - 1, endOffset);
                  const visibleDuration = visibleEnd - visibleStart + 1;

                  if (visibleDuration <= 0) return null;

                  return (
                    <div
                      key={process.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '350px repeat(55, 40px)',
                        position: 'relative',
                        minHeight: '48px',
                        backgroundColor: idx % 2 === 0 ? '#fafafa' : '#ffffff',
                        borderTop: '1px solid #f1f5f9'
                      }}
                    >
                      {/* Process name column */}
                      <div style={{
                        padding: '0.75rem 1.5rem 0.75rem 3.25rem',
                        borderRight: '1px solid #e2e8f0',
                        position: 'sticky',
                        left: 0,
                        backgroundColor: 'inherit',
                        zIndex: 5,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '0.8125rem',
                            fontWeight: '500',
                            color: '#334155',
                            marginBottom: '0.125rem'
                          }}>
                            {process.type.split('-').map(word =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </div>
                          <div style={{
                            fontSize: '0.6875rem',
                            color: '#64748b'
                          }}>
                            {duration}d • {process.status}
                          </div>
                        </div>
                      </div>

                      {/* Timeline cells for process */}
                      {Array.from({ length: timelineDays }, (_, i) => {
                        const date = addDays(timelineStartDate, i);
                        const isToday = i === 10; // Today is day 10
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        const isMonthStart = date.getDate() === 1;

                        return (
                          <div key={i} style={{
                            borderLeft: isMonthStart ? '2px solid #cbd5e1' : i % 7 === 0 ? '1px solid #f1f5f9' : 'none',
                            backgroundColor: isToday ? '#eff6ff20' : isWeekend ? '#f8fafc' : 'transparent',
                            position: 'relative'
                          }} />
                        );
                      })}

                      {/* Gantt bar for this specific process */}
                      <div
                        style={{
                          position: 'absolute',
                          left: `${350 + visibleStart * 40}px`,
                          width: `${visibleDuration * 40 - 4}px`,
                          height: '24px',
                          top: '12px',
                          backgroundColor: getProcessColor(process),
                          borderRadius: '6px',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.6875rem',
                          color: 'white',
                          fontWeight: '600',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                          zIndex: 3,
                          display: 'flex',
                          alignItems: 'center',
                          border: `1px solid ${getProcessColor(process)}dd`
                        }}
                        title={`${process.type} - ${process.status} (${duration}d)`}
                      >
                        {duration}d
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
