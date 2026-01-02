import React from 'react';
import { UserRole, PERSONAS } from '../types/personas';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  const currentPersona = PERSONAS[currentRole];

  const roles: Array<{ role: UserRole; label: string; emoji: string }> = [
    { role: 'acquisitions-specialist', label: 'Acquisitions', emoji: '🎯' },
    { role: 'design-lead', label: 'Design Lead', emoji: '📐' },
    { role: 'entitlement-coordinator', label: 'Entitlement', emoji: '📋' },
    { role: 'servicing-manager', label: 'Servicing', emoji: '🏗️' },
    { role: 'executive', label: 'Executive', emoji: '👔' },
    { role: 'demo-viewer', label: 'Demo (All Access)', emoji: '👁️' }
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '0.625rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem'
    }}>
      {/* Current user indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        paddingRight: '0.75rem',
        borderRight: '1px solid #e2e8f0'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#eff6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#2563eb'
        }}>
          {roles.find(r => r.role === currentRole)?.emoji || '👤'}
        </div>
        <div>
          <div style={{
            fontSize: '0.8125rem',
            fontWeight: '600',
            color: '#0f172a',
            lineHeight: '1.2'
          }}>
            {currentPersona.name}
          </div>
          <div style={{
            fontSize: '0.6875rem',
            color: '#64748b'
          }}>
            {currentPersona.title}
          </div>
        </div>
      </div>

      {/* Role dropdown */}
      <div style={{ position: 'relative' }}>
        <select
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value as UserRole)}
          style={{
            padding: '0.5rem 2rem 0.5rem 0.75rem',
            fontSize: '0.8125rem',
            fontWeight: '500',
            color: '#475569',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          {roles.map(({ role, label, emoji }) => (
            <option key={role} value={role}>
              {emoji} {label}
            </option>
          ))}
        </select>
      </div>

      {/* Role indicator badge */}
      <div style={{
        fontSize: '0.6875rem',
        fontWeight: '600',
        color: '#2563eb',
        backgroundColor: '#eff6ff',
        padding: '0.25rem 0.625rem',
        borderRadius: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {currentPersona.department}
      </div>
    </div>
  );
};
