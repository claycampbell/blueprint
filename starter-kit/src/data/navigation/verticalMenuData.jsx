const verticalMenuData = () => [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'ri-dashboard-line'
  },
  {
    label: 'Lead Intake',
    icon: 'ri-file-add-line',
    children: [
      {
        label: 'All Leads',
        href: '/leads',
        icon: 'ri-list-check'
      },
      {
        label: 'Submit Lead',
        href: '/leads/new',
        icon: 'ri-add-circle-line'
      }
    ]
  },
  {
    label: 'Feasibility',
    icon: 'ri-search-line',
    children: [
      {
        label: 'Projects',
        href: '/feasibility',
        icon: 'ri-folder-open-line'
      },
      {
        label: 'Due Diligence',
        href: '/feasibility/due-diligence',
        icon: 'ri-file-search-line'
      }
    ]
  },
  {
    label: 'Entitlement',
    icon: 'ri-government-line',
    children: [
      {
        label: 'Status Dashboard',
        href: '/entitlement',
        icon: 'ri-dashboard-2-line'
      },
      {
        label: 'Tasks',
        href: '/entitlement/tasks',
        icon: 'ri-task-line'
      },
      {
        label: 'Permit Tracking',
        href: '/entitlement/permits',
        icon: 'ri-file-list-3-line'
      }
    ]
  },
  {
    label: 'Lending',
    icon: 'ri-money-dollar-circle-line',
    children: [
      {
        label: 'All Loans',
        href: '/loans',
        icon: 'ri-file-text-line'
      },
      {
        label: 'Origination',
        href: '/loans/origination',
        icon: 'ri-add-box-line'
      }
    ]
  },
  {
    label: 'Servicing',
    icon: 'ri-service-line',
    children: [
      {
        label: 'Draw Management',
        href: '/servicing/draws',
        icon: 'ri-refresh-line'
      },
      {
        label: 'Inspections',
        href: '/servicing/inspections',
        icon: 'ri-eye-line'
      },
      {
        label: 'Active Loans',
        href: '/servicing/loans',
        icon: 'ri-checkbox-circle-line'
      }
    ]
  },
  {
    label: 'Contacts',
    href: '/contacts',
    icon: 'ri-contacts-line'
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: 'ri-bar-chart-box-line'
  },
  {
    label: 'Windmill Demo',
    href: '/windmill-demo',
    icon: 'ri-window-line'
  }
]

export default verticalMenuData
