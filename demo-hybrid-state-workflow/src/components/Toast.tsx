import React, { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '400px'
    }}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration || 4000;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const getToastStyles = () => {
    const styles = {
      success: {
        bg: '#f0fdf4',
        border: '#86efac',
        icon: '✓',
        iconBg: '#22c55e',
        textColor: '#166534'
      },
      info: {
        bg: '#eff6ff',
        border: '#93c5fd',
        icon: 'ℹ',
        iconBg: '#3b82f6',
        textColor: '#1e40af'
      },
      warning: {
        bg: '#fffbeb',
        border: '#fcd34d',
        icon: '⚠',
        iconBg: '#f59e0b',
        textColor: '#92400e'
      },
      error: {
        bg: '#fef2f2',
        border: '#fca5a5',
        icon: '✕',
        iconBg: '#ef4444',
        textColor: '#991b1b'
      }
    };
    return styles[toast.type];
  };

  const style = getToastStyles();

  return (
    <div
      style={{
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '8px',
        padding: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        animation: isExiting ? 'slideOut 0.3s ease-out' : 'slideIn 0.3s ease-out',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
        transition: 'opacity 0.3s, transform 0.3s'
      }}
    >
      {/* Icon */}
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: style.iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: '600',
        flexShrink: 0
      }}>
        {style.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: style.textColor,
          marginBottom: toast.message ? '0.25rem' : 0
        }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{
            fontSize: '0.8125rem',
            color: style.textColor,
            opacity: 0.8
          }}>
            {toast.message}
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: style.textColor,
          cursor: 'pointer',
          padding: '0',
          fontSize: '1.25rem',
          lineHeight: '1',
          opacity: 0.5,
          transition: 'opacity 0.15s'
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
      >
        ×
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return {
    toasts,
    showToast,
    dismissToast,
    success: (title: string, message?: string) => showToast({ type: 'success', title, message }),
    info: (title: string, message?: string) => showToast({ type: 'info', title, message }),
    warning: (title: string, message?: string) => showToast({ type: 'warning', title, message }),
    error: (title: string, message?: string) => showToast({ type: 'error', title, message })
  };
};
