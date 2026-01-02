import { CorrectionLetter, CorrectionItem, CorrectionItemStatus } from '../types';

/**
 * Calculate progress percentage for a correction letter
 */
export function calculateProgress(letter: CorrectionLetter): number {
  if (letter.totalItems === 0) return 0;
  return Math.round((letter.itemsCompleted / letter.totalItems) * 100);
}

/**
 * Determine if a correction item is at risk
 */
export function isItemAtRisk(item: CorrectionItem): boolean {
  if (!item.dueDate) return false;
  if (item.status === 'completed') return false;

  const now = new Date();
  const dueDate = new Date(item.dueDate);
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // At risk if: overdue, due within 2 days, or no recent updates and due within 5 days
  if (daysUntilDue < 0) return true; // Overdue
  if (daysUntilDue <= 2) return true; // Due very soon

  // Check for stale items (no updates in 3+ days and due within 5 days)
  const daysSinceUpdate = Math.ceil((now.getTime() - new Date(item.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntilDue <= 5 && daysSinceUpdate >= 3) return true;

  return false;
}

/**
 * Determine if a correction letter is at risk overall
 */
export function isLetterAtRisk(letter: CorrectionLetter): boolean {
  if (!letter.responseDueDate) return false;

  const now = new Date();
  const dueDate = new Date(letter.responseDueDate);
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // At risk if overdue or due within 3 days with incomplete items
  if (daysUntilDue < 0) return true;
  if (daysUntilDue <= 3 && letter.itemsCompleted < letter.totalItems) return true;

  // Check if any individual items are at risk
  const atRiskItems = letter.items.filter(isItemAtRisk);
  if (atRiskItems.length > 0) return true;

  return false;
}

/**
 * Get status breakdown for a correction letter
 */
export function getStatusBreakdown(letter: CorrectionLetter) {
  const breakdown = {
    notStarted: 0,
    inProgress: 0,
    consultantSubmitted: 0,
    internalReview: 0,
    approved: 0,
    needsRevision: 0,
    completed: 0
  };

  letter.items.forEach(item => {
    switch (item.status) {
      case 'not-started':
        breakdown.notStarted++;
        break;
      case 'in-progress':
        breakdown.inProgress++;
        break;
      case 'consultant-submitted':
        breakdown.consultantSubmitted++;
        break;
      case 'internal-review':
        breakdown.internalReview++;
        break;
      case 'approved':
        breakdown.approved++;
        break;
      case 'needs-revision':
        breakdown.needsRevision++;
        break;
      case 'completed':
        breakdown.completed++;
        break;
    }
  });

  return breakdown;
}

/**
 * Get items grouped by status
 */
export function groupItemsByStatus(items: CorrectionItem[]) {
  const groups: Record<CorrectionItemStatus, CorrectionItem[]> = {
    'not-started': [],
    'in-progress': [],
    'consultant-submitted': [],
    'internal-review': [],
    'approved': [],
    'needs-revision': [],
    'completed': []
  };

  items.forEach(item => {
    groups[item.status].push(item);
  });

  return groups;
}

/**
 * Get items grouped by discipline
 */
export function groupItemsByDiscipline(items: CorrectionItem[]) {
  const groups: Record<string, CorrectionItem[]> = {};

  items.forEach(item => {
    if (!groups[item.discipline]) {
      groups[item.discipline] = [];
    }
    groups[item.discipline].push(item);
  });

  return groups;
}

/**
 * Calculate total estimated effort hours
 */
export function calculateTotalEffort(items: CorrectionItem[]): number {
  return items.reduce((total, item) => total + (item.estimatedEffortHours || 0), 0);
}

/**
 * Format days until due date
 */
export function formatDaysUntilDue(dueDate: Date): string {
  const now = new Date();
  const due = new Date(dueDate);
  const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) {
    return `${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? '' : 's'} overdue`;
  } else if (daysUntil === 0) {
    return 'Due today';
  } else if (daysUntil === 1) {
    return 'Due tomorrow';
  } else if (daysUntil <= 7) {
    return `Due in ${daysUntil} days`;
  } else {
    return due.toLocaleDateString();
  }
}

/**
 * Get severity priority (for sorting)
 */
export function getSeverityPriority(severity: 'critical' | 'major' | 'minor'): number {
  const priorities = { critical: 3, major: 2, minor: 1 };
  return priorities[severity];
}

/**
 * Sort correction items by priority (severity + due date)
 */
export function sortItemsByPriority(items: CorrectionItem[]): CorrectionItem[] {
  return [...items].sort((a, b) => {
    // First by at-risk status
    const aAtRisk = isItemAtRisk(a);
    const bAtRisk = isItemAtRisk(b);
    if (aAtRisk && !bAtRisk) return -1;
    if (!aAtRisk && bAtRisk) return 1;

    // Then by severity
    const severityDiff = getSeverityPriority(b.severity) - getSeverityPriority(a.severity);
    if (severityDiff !== 0) return severityDiff;

    // Then by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    return 0;
  });
}
