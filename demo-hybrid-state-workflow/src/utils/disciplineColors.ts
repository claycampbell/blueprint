import { CorrectionDiscipline } from '../types';

export interface DisciplineColor {
  bg: string;
  text: string;
  border: string;
  label: string;
}

/**
 * Get consistent color scheme for a discipline
 */
export function getDisciplineColor(discipline: CorrectionDiscipline): DisciplineColor {
  const colors: Record<CorrectionDiscipline, DisciplineColor> = {
    civil: {
      bg: '#dbeafe',
      text: '#1e40af',
      border: '#93c5fd',
      label: 'Civil'
    },
    structural: {
      bg: '#fce7f3',
      text: '#9f1239',
      border: '#fbcfe8',
      label: 'Structural'
    },
    architectural: {
      bg: '#e9d5ff',
      text: '#6b21a8',
      border: '#d8b4fe',
      label: 'Architectural'
    },
    landscape: {
      bg: '#d1fae5',
      text: '#065f46',
      border: '#a7f3d0',
      label: 'Landscape'
    },
    mechanical: {
      bg: '#fed7aa',
      text: '#9a3412',
      border: '#fdba74',
      label: 'Mechanical'
    },
    electrical: {
      bg: '#fef3c7',
      text: '#92400e',
      border: '#fde68a',
      label: 'Electrical'
    },
    plumbing: {
      bg: '#cffafe',
      text: '#155e75',
      border: '#a5f3fc',
      label: 'Plumbing'
    },
    fire: {
      bg: '#fee2e2',
      text: '#991b1b',
      border: '#fecaca',
      label: 'Fire'
    },
    zoning: {
      bg: '#e0e7ff',
      text: '#3730a3',
      border: '#c7d2fe',
      label: 'Zoning'
    },
    other: {
      bg: '#f3f4f6',
      text: '#374151',
      border: '#d1d5db',
      label: 'Other'
    }
  };

  return colors[discipline];
}

/**
 * Get all disciplines with their colors (for legend/filter UI)
 */
export function getAllDisciplineColors(): Array<{ discipline: CorrectionDiscipline; color: DisciplineColor }> {
  const disciplines: CorrectionDiscipline[] = [
    'civil',
    'structural',
    'architectural',
    'landscape',
    'mechanical',
    'electrical',
    'plumbing',
    'fire',
    'zoning',
    'other'
  ];

  return disciplines.map(discipline => ({
    discipline,
    color: getDisciplineColor(discipline)
  }));
}
