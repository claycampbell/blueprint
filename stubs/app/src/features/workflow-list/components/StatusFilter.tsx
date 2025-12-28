/**
 * Status Filter
 *
 * Filter dropdown for workflow definition status.
 */

import type { DefinitionStatus } from '@/api/workflow-definitions';

interface StatusFilterProps {
  value: DefinitionStatus | '';
  onChange: (status: DefinitionStatus | '') => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div>
      <label htmlFor="status-filter">Filter by status:</label>
      <select
        id="status-filter"
        value={value}
        onChange={(e) => onChange(e.target.value as DefinitionStatus | '')}
      >
        <option value="">All</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  );
}
