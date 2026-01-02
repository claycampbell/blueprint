/**
 * User Personas and Role-Based Access
 * Based on Blueprint's actual team structure
 */

export type UserRole =
  | 'acquisitions-specialist'
  | 'design-lead'
  | 'entitlement-coordinator'
  | 'servicing-manager'
  | 'executive'
  | 'demo-viewer'; // For stakeholder demos

export interface UserPersona {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  permissions: UserPermissions;
  preferences: UserPreferences;
}

export interface UserPermissions {
  // Lifecycle phases they work with
  lifecycleAccess: Array<'intake' | 'feasibility' | 'entitlement' | 'construction' | 'servicing'>;

  // Process types they can manage
  canStartProcesses: string[];
  canCompleteProcesses: string[];

  // State changes they can make
  canChangeLifecycle: boolean;
  canChangeStatus: boolean;
  canChangeApproval: boolean;
  canUpdateRisk: boolean;

  // Visibility
  viewAllProperties: boolean;
  viewOnlyAssigned: boolean;
}

export interface UserPreferences {
  // Default view when opening app
  defaultView: 'dashboard' | 'timeline' | 'my-tasks';

  // Dashboard customization
  dashboardLayout: 'kanban' | 'list' | 'timeline';

  // Filters
  defaultFilters: {
    showOnlyMyProperties?: boolean;
    showOnlyNeedsAttention?: boolean;
    lifecyclePhases?: string[];
  };

  // Notifications
  notifyOnOverdue: boolean;
  notifyOnAssignment: boolean;
}

/**
 * Predefined personas based on Blueprint's team structure
 */
export const PERSONAS: Record<string, UserPersona> = {
  // ========== ACQUISITIONS TEAM ==========
  'acquisitions-specialist': {
    id: 'user-acq-001',
    name: 'Sarah Chen',
    role: 'acquisitions-specialist',
    title: 'Acquisitions Specialist',
    department: 'Acquisitions',
    permissions: {
      lifecycleAccess: ['intake', 'feasibility'],
      canStartProcesses: ['intake-qualification', 'feasibility-analysis'],
      canCompleteProcesses: ['intake-qualification', 'feasibility-analysis'],
      canChangeLifecycle: true,
      canChangeStatus: true,
      canChangeApproval: true,
      canUpdateRisk: true,
      viewAllProperties: true,
      viewOnlyAssigned: false
    },
    preferences: {
      defaultView: 'dashboard',
      dashboardLayout: 'kanban',
      defaultFilters: {
        lifecyclePhases: ['intake', 'feasibility']
      },
      notifyOnOverdue: true,
      notifyOnAssignment: true
    }
  },

  // ========== DESIGN & ENTITLEMENT TEAM ==========
  'design-lead': {
    id: 'user-design-001',
    name: 'Mike Torres',
    role: 'design-lead',
    title: 'Design Lead',
    department: 'Design & Entitlement',
    permissions: {
      lifecycleAccess: ['feasibility', 'entitlement', 'construction'],
      canStartProcesses: [
        'zoning-review',
        'title-review',
        'environmental-assessment',
        'arborist-review',
        'entitlement-preparation',
        'permit-submission'
      ],
      canCompleteProcesses: [
        'zoning-review',
        'environmental-assessment',
        'arborist-review',
        'entitlement-preparation'
      ],
      canChangeLifecycle: false, // Only system or acquisitions can advance lifecycle
      canChangeStatus: true,
      canChangeApproval: false, // Only acquisitions can approve
      canUpdateRisk: true,
      viewAllProperties: true,
      viewOnlyAssigned: false
    },
    preferences: {
      defaultView: 'dashboard',
      dashboardLayout: 'kanban',
      defaultFilters: {
        lifecyclePhases: ['feasibility', 'entitlement']
      },
      notifyOnOverdue: true,
      notifyOnAssignment: true
    }
  },

  'entitlement-coordinator': {
    id: 'user-ent-001',
    name: 'Jane Doe',
    role: 'entitlement-coordinator',
    title: 'Entitlement Coordinator',
    department: 'Design & Entitlement',
    permissions: {
      lifecycleAccess: ['entitlement', 'construction'],
      canStartProcesses: ['entitlement-preparation', 'permit-submission'],
      canCompleteProcesses: ['entitlement-preparation', 'permit-submission'],
      canChangeLifecycle: false,
      canChangeStatus: true,
      canChangeApproval: false,
      canUpdateRisk: false,
      viewAllProperties: true,
      viewOnlyAssigned: false
    },
    preferences: {
      defaultView: 'timeline', // Entitlement is time-sensitive
      dashboardLayout: 'timeline',
      defaultFilters: {
        lifecyclePhases: ['entitlement'],
        showOnlyNeedsAttention: true
      },
      notifyOnOverdue: true,
      notifyOnAssignment: true
    }
  },

  // ========== SERVICING TEAM ==========
  'servicing-manager': {
    id: 'user-svc-001',
    name: 'Alex Rivera',
    role: 'servicing-manager',
    title: 'Servicing Manager',
    department: 'Servicing',
    permissions: {
      lifecycleAccess: ['construction', 'servicing'],
      canStartProcesses: ['construction-start'],
      canCompleteProcesses: ['construction-start'],
      canChangeLifecycle: false,
      canChangeStatus: true,
      canChangeApproval: false,
      canUpdateRisk: false,
      viewAllProperties: true,
      viewOnlyAssigned: false
    },
    preferences: {
      defaultView: 'dashboard',
      dashboardLayout: 'list',
      defaultFilters: {
        lifecyclePhases: ['construction', 'servicing']
      },
      notifyOnOverdue: true,
      notifyOnAssignment: true
    }
  },

  // ========== EXECUTIVE ==========
  'executive': {
    id: 'user-exec-001',
    name: 'Jordan Blake',
    role: 'executive',
    title: 'VP of Operations',
    department: 'Executive',
    permissions: {
      lifecycleAccess: ['intake', 'feasibility', 'entitlement', 'construction', 'servicing'],
      canStartProcesses: [],
      canCompleteProcesses: [],
      canChangeLifecycle: false,
      canChangeStatus: false,
      canChangeApproval: true, // Executives can override approvals
      canUpdateRisk: false,
      viewAllProperties: true,
      viewOnlyAssigned: false
    },
    preferences: {
      defaultView: 'dashboard',
      dashboardLayout: 'kanban',
      defaultFilters: {},
      notifyOnOverdue: false,
      notifyOnAssignment: false
    }
  },

  // ========== DEMO VIEWER ==========
  'demo-viewer': {
    id: 'user-demo-001',
    name: 'Demo User',
    role: 'demo-viewer',
    title: 'Stakeholder',
    department: 'Demo',
    permissions: {
      lifecycleAccess: ['intake', 'feasibility', 'entitlement', 'construction', 'servicing'],
      canStartProcesses: [
        'intake-qualification',
        'feasibility-analysis',
        'zoning-review',
        'title-review',
        'environmental-assessment',
        'arborist-review',
        'entitlement-preparation',
        'permit-submission',
        'construction-start'
      ],
      canCompleteProcesses: [
        'intake-qualification',
        'feasibility-analysis',
        'zoning-review',
        'title-review',
        'environmental-assessment',
        'arborist-review',
        'entitlement-preparation',
        'permit-submission',
        'construction-start'
      ],
      canChangeLifecycle: true,
      canChangeStatus: true,
      canChangeApproval: true,
      canUpdateRisk: true,
      viewAllProperties: true,
      viewOnlyAssigned: false
    },
    preferences: {
      defaultView: 'dashboard',
      dashboardLayout: 'kanban',
      defaultFilters: {},
      notifyOnOverdue: false,
      notifyOnAssignment: false
    }
  }
};

/**
 * Helper function to get persona by role
 */
export const getPersonaByRole = (role: UserRole): UserPersona => {
  return PERSONAS[role];
};

/**
 * Helper function to check if user can perform action
 */
export const canUserPerformAction = (persona: UserPersona, action: string): boolean => {
  switch (action) {
    case 'start-process':
      return persona.permissions.canStartProcesses.length > 0;
    case 'complete-process':
      return persona.permissions.canCompleteProcesses.length > 0;
    case 'approve-property':
      return persona.permissions.canChangeApproval;
    case 'update-lifecycle':
      return persona.permissions.canChangeLifecycle;
    default:
      return false;
  }
};

/**
 * Get filtered properties based on persona preferences
 */
export const getFilteredLifecyclePhases = (persona: UserPersona): string[] => {
  if (persona.preferences.defaultFilters.lifecyclePhases) {
    return persona.preferences.defaultFilters.lifecyclePhases;
  }
  return persona.permissions.lifecycleAccess;
};
