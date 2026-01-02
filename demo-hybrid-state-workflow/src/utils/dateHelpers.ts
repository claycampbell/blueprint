/**
 * Date utility functions for time-based dashboard features
 */

import { Property, Process } from '../types';

/**
 * Calculate days until a due date
 * Returns negative number if overdue
 */
export const getDaysUntilDue = (dueDate: Date): number => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Format a due date in a user-friendly way
 * Examples: "2d ago", "Today", "Tomorrow", "in 3d", "Jan 5"
 */
export const formatDueDate = (dueDate: Date): string => {
  const days = getDaysUntilDue(dueDate);
  const date = new Date(dueDate);

  if (days < 0) return `${Math.abs(days)}d ago`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `in ${days}d`;

  // Format as "Jan 5" for dates further out
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Format a regular date as "Jan 5" or "Jan 5, 2024" if different year
 */
export const formatDate = (date: Date): string => {
  const now = new Date();
  const d = new Date(date);

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

  if (d.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }

  return d.toLocaleDateString('en-US', options);
};

/**
 * Get the next due date from a property's active processes
 * Returns null if no processes have due dates
 */
export const getNextDueDate = (property: Property): Date | null => {
  const activeDueDates = property.activeProcesses
    .map(p => p.dueDate)
    .filter((date): date is Date => date !== undefined && date !== null)
    .sort((a, b) => a.getTime() - b.getTime());

  return activeDueDates[0] || null;
};

/**
 * Check if a date is overdue
 */
export const isOverdue = (dueDate: Date): boolean => {
  return getDaysUntilDue(dueDate) < 0;
};

/**
 * Check if a date is due within the next N days
 */
export const isDueWithinDays = (dueDate: Date, days: number): boolean => {
  const daysUntil = getDaysUntilDue(dueDate);
  return daysUntil >= 0 && daysUntil <= days;
};

/**
 * Check if a date is due this week (within 7 days)
 */
export const isDueThisWeek = (dueDate: Date): boolean => {
  return isDueWithinDays(dueDate, 7);
};

/**
 * Check if a date is due this month (within 30 days)
 */
export const isDueThisMonth = (dueDate: Date): boolean => {
  return isDueWithinDays(dueDate, 30);
};

/**
 * Calculate duration in days between two dates
 */
export const getDuration = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get the offset in days from today for a given date
 * Useful for positioning on a timeline
 */
export const getDayOffset = (date: Date): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get process status color based on due date
 */
export const getProcessStatusColor = (process: Process): string => {
  if (!process.dueDate) return '#6b7280'; // gray

  if (process.status === 'completed') return '#10b981'; // green
  if (process.status === 'blocked') return '#ef4444'; // red

  if (isOverdue(process.dueDate)) return '#dc2626'; // dark red
  if (isDueWithinDays(process.dueDate, 3)) return '#f59e0b'; // amber
  if (isDueWithinDays(process.dueDate, 7)) return '#fbbf24'; // light amber

  return '#3b82f6'; // blue (on track)
};
