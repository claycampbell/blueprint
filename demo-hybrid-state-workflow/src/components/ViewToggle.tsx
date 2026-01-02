import React from 'react';

export type ViewMode = 'workflow' | 'state-machine' | 'side-by-side';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  const options: { value: ViewMode; label: string }[] = [
    { value: 'workflow', label: 'Workflow Only' },
    { value: 'side-by-side', label: 'Side-by-Side' },
    { value: 'state-machine', label: 'State Machine Only' }
  ];

  return (
    <div className="card" style={{
      marginBottom: '2rem',
      padding: '1rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem'
      }}>
        <div>
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
            View Mode
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
            Compare traditional workflow with hybrid state machine approach
          </div>
        </div>

        <div style={{
          display: 'inline-flex',
          backgroundColor: 'var(--color-gray-100)',
          borderRadius: '8px',
          padding: '4px',
          gap: '4px'
        }}>
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => onViewModeChange(option.value)}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: viewMode === option.value
                  ? 'white'
                  : 'transparent',
                color: viewMode === option.value
                  ? 'var(--color-primary)'
                  : 'var(--color-gray-600)',
                boxShadow: viewMode === option.value
                  ? '0 1px 3px rgba(0,0,0,0.1)'
                  : 'none'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
