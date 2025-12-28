/**
 * Version Diff
 *
 * Shows differences between two workflow versions.
 * This is a placeholder - real implementation would use a diff library.
 */

import type { WorkflowVersionResponse } from '@/api/workflow-definitions';

interface VersionDiffProps {
  currentVersion: WorkflowVersionResponse;
  compareVersion: WorkflowVersionResponse;
}

export function VersionDiff({ currentVersion, compareVersion }: VersionDiffProps) {
  // In a real implementation, you would:
  // 1. Parse both BPMN XMLs
  // 2. Compare the structures
  // 3. Show added/removed/changed elements

  const currentLines = currentVersion.bpmn_xml.split('\n').length;
  const compareLines = compareVersion.bpmn_xml.split('\n').length;
  const lineDiff = currentLines - compareLines;

  return (
    <div>
      <h4>
        Comparing v{compareVersion.version} → v{currentVersion.version}
      </h4>

      <div>
        <p>
          <strong>v{compareVersion.version}</strong>: {compareLines} lines
          {compareVersion.change_notes && ` - "${compareVersion.change_notes}"`}
        </p>
        <p>
          <strong>v{currentVersion.version}</strong>: {currentLines} lines
          {currentVersion.change_notes && ` - "${currentVersion.change_notes}"`}
        </p>
        <p>
          Difference: {lineDiff > 0 ? '+' : ''}{lineDiff} lines
        </p>
      </div>

      <details>
        <summary>View Raw XML Diff</summary>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <h5>v{compareVersion.version}</h5>
            <pre style={{ fontSize: '0.75rem', overflow: 'auto', maxHeight: '300px' }}>
              {compareVersion.bpmn_xml}
            </pre>
          </div>
          <div style={{ flex: 1 }}>
            <h5>v{currentVersion.version}</h5>
            <pre style={{ fontSize: '0.75rem', overflow: 'auto', maxHeight: '300px' }}>
              {currentVersion.bpmn_xml}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
}
