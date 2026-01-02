/**
 * Helper functions for property data manipulation and derived stats
 */

import { Property, LifecycleState } from '../types';
import { MULTIPLE_PROPERTIES } from '../data/multipleProperties';
import { getNextDueDate, isOverdue, isDueThisWeek, isDueThisMonth } from './dateHelpers';

export interface PropertyStats {
  totalActive: number;
  needsAttention: number;
  atRisk: number;
}

export interface DashboardStats {
  totalProperties: number;
  activePhases: number;
  needsAttentionCount: number;
  activeProcessCount: number;
  onTrackCount: number;
  overdueCount: number;
  dueThisWeekCount: number;
  dueThisMonthCount: number;
}

/**
 * Get all properties grouped by lifecycle phase
 */
export function getPropertiesByLifecycle(): Record<LifecycleState, Property[]> {
  const all = Object.values(MULTIPLE_PROPERTIES);

  return {
    intake: all.filter(p => p.lifecycle === 'intake'),
    feasibility: all.filter(p => p.lifecycle === 'feasibility'),
    entitlement: all.filter(p => p.lifecycle === 'entitlement'),
    construction: all.filter(p => p.lifecycle === 'construction'),
    servicing: all.filter(p => p.lifecycle === 'servicing'),
    closed: all.filter(p => p.lifecycle === 'closed')
  };
}

/**
 * Calculate stats for a property
 */
export function getPropertyStats(property: Property): PropertyStats {
  const activeProcesses = property.activeProcesses.length;
  const blockedProcesses = property.activeProcesses.filter(p => p.status === 'blocked').length;
  const dueSoonProcesses = property.activeProcesses.filter(p => {
    if (!p.dueDate) return false;
    const daysUntilDue = Math.ceil((p.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 3 && daysUntilDue >= 0;
  }).length;

  return {
    totalActive: activeProcesses,
    needsAttention: blockedProcesses + dueSoonProcesses,
    atRisk: property.riskLevel >= 7 ? 1 : 0
  };
}

/**
 * Get human-readable property type label
 */
export function getPropertyTypeLabel(type: Property['type']): string {
  const labels: Record<Property['type'], string> = {
    'subdivision': 'Subdivision',
    'multi-family-rehab': 'Multi-Family Rehab',
    'land-banking': 'Land Banking',
    'adaptive-reuse': 'Adaptive Reuse'
  };
  return labels[type];
}

/**
 * Get lifecycle phase display name
 */
export function getLifecycleLabel(lifecycle: LifecycleState): string {
  const labels: Record<LifecycleState, string> = {
    'intake': 'Intake',
    'feasibility': 'Feasibility',
    'entitlement': 'Entitlement',
    'construction': 'Construction',
    'servicing': 'Servicing',
    'closed': 'Closed'
  };
  return labels[lifecycle];
}

/**
 * Get status color class
 */
export function getStatusColor(property: Property): string {
  if (property.status === 'paused' || property.status === 'on-hold') return 'yellow';
  if (property.status === 'closed') return 'gray';

  const stats = getPropertyStats(property);
  if (stats.needsAttention > 0 || property.riskLevel >= 7) return 'red';
  if (property.riskLevel >= 5) return 'yellow';
  return 'green';
}

/**
 * Calculate dashboard-level statistics
 */
export function getDashboardStats(): DashboardStats {
  const all = Object.values(MULTIPLE_PROPERTIES);
  const byLifecycle = getPropertiesByLifecycle();

  // Count active phases (phases with at least one property)
  const activePhases = Object.values(byLifecycle).filter(
    properties => properties.length > 0
  ).length;

  // Count properties needing attention
  const needsAttentionCount = all.filter(property => {
    const stats = getPropertyStats(property);
    return stats.needsAttention > 0 || property.riskLevel >= 7;
  }).length;

  // Count total active processes across all properties
  const activeProcessCount = all.reduce((count, property) => {
    return count + property.activeProcesses.length;
  }, 0);

  // Count properties that are on track (approved, no issues)
  const onTrackCount = all.filter(property => {
    const stats = getPropertyStats(property);
    return (
      property.approvalState === 'approved' &&
      stats.needsAttention === 0 &&
      property.riskLevel < 5 &&
      property.status === 'active'
    );
  }).length;

  // Count properties with overdue processes
  const overdueCount = all.filter(property => {
    const nextDue = getNextDueDate(property);
    return nextDue && isOverdue(nextDue);
  }).length;

  // Count properties with processes due this week
  const dueThisWeekCount = all.filter(property => {
    const nextDue = getNextDueDate(property);
    return nextDue && !isOverdue(nextDue) && isDueThisWeek(nextDue);
  }).length;

  // Count properties with processes due this month (but not this week)
  const dueThisMonthCount = all.filter(property => {
    const nextDue = getNextDueDate(property);
    return nextDue && !isOverdue(nextDue) && !isDueThisWeek(nextDue) && isDueThisMonth(nextDue);
  }).length;

  return {
    totalProperties: all.length,
    activePhases,
    needsAttentionCount,
    activeProcessCount,
    onTrackCount,
    overdueCount,
    dueThisWeekCount,
    dueThisMonthCount
  };
}
