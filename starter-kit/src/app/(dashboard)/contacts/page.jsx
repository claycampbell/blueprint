'use client'

import { useState } from 'react'

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Avatar,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Switch,
  FormControlLabel,
  Stack,
  Link
} from '@mui/material'

// Mock data for contacts with relationships
const mockContacts = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Johnson',
    type: 'Agent',
    company: 'Premier Realty',
    email: 'sarah.j@premierrealty.com',
    phone: '(206) 555-1234',
    address: '1234 Main St, Seattle, WA 98101',
    entities: ['Premier Realty LLC'],
    tags: ['Top Performer', 'Seattle Market'],
    status: 'Active',
    projectsCount: 8,
    loansCount: 5,
    lastActivity: '2024-11-12',
    notes: 'Excellent agent with deep Seattle market knowledge. Specializes in luxury developments.',
    projects: [
      { id: 101, name: 'Greenwood Estates', role: 'Listing Agent' },
      { id: 102, name: 'Ballard Commons', role: 'Listing Agent' },
      { id: 103, name: 'Queen Anne Residences', role: 'Buyer Agent' }
    ],
    loans: [
      { id: 4523, projectName: 'Greenwood Estates', role: 'Agent' },
      { id: 4521, projectName: 'Madison Park Homes', role: 'Agent' }
    ],
    relatedContacts: [2, 3, 15],
    activities: [
      { date: '2024-11-12', type: 'Meeting', description: 'Site visit for Greenwood Estates' },
      { date: '2024-11-08', type: 'Email', description: 'Sent listing agreement for review' },
      { date: '2024-11-05', type: 'Call', description: 'Discussed pricing strategy' }
    ]
  },
  {
    id: 2,
    firstName: 'Michael',
    lastName: 'Chen',
    type: 'Builder',
    company: 'Premier Builders Inc',
    email: 'mchen@premierbuilders.com',
    phone: '(206) 555-5678',
    address: '5678 Builder Ave, Bellevue, WA 98004',
    entities: ['Premier Builders Inc', 'Chen Construction LLC'],
    tags: ['Preferred Builder', 'Zero Defaults'],
    status: 'Active',
    projectsCount: 12,
    loansCount: 8,
    lastActivity: '2024-11-13',
    notes: 'Trusted builder with 15 years experience. Excellent track record, never missed a deadline.',
    projects: [
      { id: 101, name: 'Greenwood Estates', role: 'General Contractor' },
      { id: 104, name: 'Fremont Gardens', role: 'General Contractor' }
    ],
    loans: [
      { id: 4523, projectName: 'Greenwood Estates', role: 'Builder' },
      { id: 4519, projectName: 'Capitol Hill Residences', role: 'Builder' }
    ],
    relatedContacts: [1, 5, 11],
    activities: [
      { date: '2024-11-13', type: 'Inspection', description: 'Foundation inspection completed' },
      { date: '2024-11-10', type: 'Draw Request', description: 'Submitted draw #3 for $450k' },
      { date: '2024-11-07', type: 'Meeting', description: 'Progress review meeting' }
    ]
  },
  {
    id: 3,
    firstName: 'Jennifer',
    lastName: 'Martinez',
    type: 'Borrower',
    company: 'ABC Development LLC',
    email: 'jmartinez@abcdev.com',
    phone: '(425) 555-9012',
    address: '9012 Dev Plaza, Redmond, WA 98052',
    entities: ['ABC Development LLC', 'Martinez Holdings Inc'],
    tags: ['Repeat Borrower', 'Strong Credit'],
    status: 'Active',
    projectsCount: 4,
    loansCount: 3,
    lastActivity: '2024-11-11',
    notes: 'Experienced developer with strong financials. Has completed 3 successful projects with us.',
    projects: [
      { id: 105, name: 'Redmond Heights', role: 'Developer/Owner' },
      { id: 106, name: 'Kirkland Lakefront', role: 'Developer/Owner' }
    ],
    loans: [
      { id: 4520, projectName: 'Redmond Heights', role: 'Borrower' },
      { id: 4518, projectName: 'Kirkland Lakefront', role: 'Borrower' }
    ],
    relatedContacts: [4, 7, 10],
    activities: [
      { date: '2024-11-11', type: 'Loan Application', description: 'Submitted new loan application' },
      { date: '2024-11-06', type: 'Meeting', description: 'Discussed project financing options' },
      { date: '2024-11-01', type: 'Payment', description: 'Interest payment received' }
    ]
  },
  {
    id: 4,
    firstName: 'Robert',
    lastName: 'Thompson',
    type: 'Guarantor',
    company: 'Thompson Capital Group',
    email: 'rthompson@thompsoncapital.com',
    phone: '(206) 555-3456',
    address: '3456 Finance Blvd, Seattle, WA 98101',
    entities: ['Thompson Capital Group', 'RT Investment Partners'],
    tags: ['High Net Worth', 'Multiple Guarantees'],
    status: 'Active',
    projectsCount: 6,
    loansCount: 4,
    lastActivity: '2024-11-09',
    notes: 'Personal guarantor for ABC Development. Strong financials, verified net worth $15M+.',
    projects: [
      { id: 105, name: 'Redmond Heights', role: 'Guarantor' },
      { id: 106, name: 'Kirkland Lakefront', role: 'Guarantor' }
    ],
    loans: [
      { id: 4520, projectName: 'Redmond Heights', role: 'Guarantor' },
      { id: 4518, projectName: 'Kirkland Lakefront', role: 'Guarantor' }
    ],
    relatedContacts: [3, 14],
    activities: [
      { date: '2024-11-09', type: 'Document', description: 'Signed personal guarantee for new loan' },
      { date: '2024-10-28', type: 'Financial Update', description: 'Submitted updated financial statements' }
    ]
  },
  {
    id: 5,
    firstName: 'David',
    lastName: 'Wilson',
    type: 'Consultant',
    company: 'Pacific Title Company',
    email: 'dwilson@pactitle.com',
    phone: '(206) 555-7890',
    address: '7890 Title Row, Seattle, WA 98104',
    entities: ['Pacific Title Company'],
    tags: ['Title Services', 'Fast Turnaround'],
    status: 'Active',
    projectsCount: 18,
    loansCount: 15,
    lastActivity: '2024-11-13',
    notes: 'Primary title company for Seattle projects. Excellent service and competitive rates.',
    projects: [
      { id: 101, name: 'Greenwood Estates', role: 'Title Company' },
      { id: 102, name: 'Ballard Commons', role: 'Title Company' },
      { id: 103, name: 'Queen Anne Residences', role: 'Title Company' }
    ],
    loans: [
      { id: 4523, projectName: 'Greenwood Estates', role: 'Title Company' },
      { id: 4521, projectName: 'Madison Park Homes', role: 'Title Company' }
    ],
    relatedContacts: [1, 2, 8, 12],
    activities: [
      { date: '2024-11-13', type: 'Document', description: 'Title report delivered for Greenwood' },
      { date: '2024-11-11', type: 'Order', description: 'New title order received' },
      { date: '2024-11-08', type: 'Issue', description: 'Resolved lien issue on Ballard Commons' }
    ]
  },
  {
    id: 6,
    firstName: 'Lisa',
    lastName: 'Anderson',
    type: 'Agent',
    company: 'Elite Realty Group',
    email: 'landerson@eliterealty.com',
    phone: '(602) 555-2345',
    address: '2345 Realty Pkwy, Phoenix, AZ 85001',
    entities: ['Elite Realty Group'],
    tags: ['Phoenix Market', 'New Development Specialist'],
    status: 'Active',
    projectsCount: 6,
    loansCount: 4,
    lastActivity: '2024-11-10',
    notes: 'Top performing agent in Phoenix market. Strong relationships with local builders.',
    projects: [
      { id: 107, name: 'Desert Bloom Estates', role: 'Listing Agent' },
      { id: 108, name: 'Scottsdale Heights', role: 'Listing Agent' }
    ],
    loans: [
      { id: 4517, projectName: 'Desert Bloom Estates', role: 'Agent' }
    ],
    relatedContacts: [9, 13],
    activities: [
      { date: '2024-11-10', type: 'Showing', description: 'Model home showing for buyers' },
      { date: '2024-11-07', type: 'Contract', description: 'New purchase agreement signed' }
    ]
  },
  {
    id: 7,
    firstName: 'James',
    lastName: 'Rodriguez',
    type: 'Builder',
    company: 'Apex Construction',
    email: 'jrodriguez@apexconstruct.com',
    phone: '(425) 555-6789',
    address: '6789 Construction Way, Bellevue, WA 98005',
    entities: ['Apex Construction', 'JR Builder Group LLC'],
    tags: ['Commercial & Residential', 'Fast Track'],
    status: 'Active',
    projectsCount: 9,
    loansCount: 6,
    lastActivity: '2024-11-12',
    notes: 'Versatile builder handling both commercial and residential. Known for fast-track schedules.',
    projects: [
      { id: 109, name: 'Bellevue Square Residences', role: 'General Contractor' },
      { id: 110, name: 'Mercer Island Luxury', role: 'General Contractor' }
    ],
    loans: [
      { id: 4521, projectName: 'Madison Park Homes', role: 'Builder' }
    ],
    relatedContacts: [3, 11],
    activities: [
      { date: '2024-11-12', type: 'Meeting', description: 'Project kickoff for new development' },
      { date: '2024-11-09', type: 'Draw Request', description: 'Draw request submitted and approved' }
    ]
  },
  {
    id: 8,
    firstName: 'Emily',
    lastName: 'Davis',
    type: 'Consultant',
    company: 'Northwest Surveying',
    email: 'edavis@nwsurveying.com',
    phone: '(206) 555-8901',
    address: '8901 Survey St, Seattle, WA 98103',
    entities: ['Northwest Surveying Inc'],
    tags: ['Land Surveying', 'ALTA Surveys'],
    status: 'Active',
    projectsCount: 14,
    loansCount: 12,
    lastActivity: '2024-11-11',
    notes: 'Preferred surveying firm. Fast turnaround and accurate work.',
    projects: [
      { id: 101, name: 'Greenwood Estates', role: 'Surveyor' },
      { id: 105, name: 'Redmond Heights', role: 'Surveyor' }
    ],
    loans: [],
    relatedContacts: [5, 12],
    activities: [
      { date: '2024-11-11', type: 'Delivery', description: 'ALTA survey completed and delivered' },
      { date: '2024-11-05', type: 'Order', description: 'New survey order received' }
    ]
  },
  {
    id: 9,
    firstName: 'Carlos',
    lastName: 'Hernandez',
    type: 'Builder',
    company: 'Desert Builders LLC',
    email: 'chernandez@desertbuilders.com',
    phone: '(602) 555-3456',
    address: '3456 Desert Dr, Phoenix, AZ 85002',
    entities: ['Desert Builders LLC', 'Hernandez Construction Inc'],
    tags: ['Phoenix Market', 'Energy Efficient'],
    status: 'Active',
    projectsCount: 7,
    loansCount: 5,
    lastActivity: '2024-11-13',
    notes: 'Specializes in energy-efficient construction. LEED certified builder.',
    projects: [
      { id: 107, name: 'Desert Bloom Estates', role: 'General Contractor' },
      { id: 111, name: 'Tempe Modern', role: 'General Contractor' }
    ],
    loans: [
      { id: 4517, projectName: 'Desert Bloom Estates', role: 'Builder' }
    ],
    relatedContacts: [6, 13],
    activities: [
      { date: '2024-11-13', type: 'Inspection', description: 'Passed framing inspection' },
      { date: '2024-11-10', type: 'Meeting', description: 'Energy efficiency review' }
    ]
  },
  {
    id: 10,
    firstName: 'Amanda',
    lastName: 'Taylor',
    type: 'Borrower',
    company: 'Taylor Development Group',
    email: 'ataylor@taylordevgroup.com',
    phone: '(206) 555-4567',
    address: '4567 Developer Lane, Seattle, WA 98109',
    entities: ['Taylor Development Group', 'AT Properties LLC'],
    tags: ['First-Time Borrower', 'High Potential'],
    status: 'Active',
    projectsCount: 2,
    loansCount: 1,
    lastActivity: '2024-11-08',
    notes: 'New developer with strong team and solid business plan. First project going well.',
    projects: [
      { id: 112, name: 'Wallingford Homes', role: 'Developer/Owner' }
    ],
    loans: [
      { id: 4516, projectName: 'Wallingford Homes', role: 'Borrower' }
    ],
    relatedContacts: [11, 14],
    activities: [
      { date: '2024-11-08', type: 'Check-in', description: 'Monthly project status review' },
      { date: '2024-11-01', type: 'Payment', description: 'First interest payment received' }
    ]
  },
  {
    id: 11,
    firstName: 'Daniel',
    lastName: 'Kim',
    type: 'Consultant',
    company: 'Structural Engineering Associates',
    email: 'dkim@seaengineers.com',
    phone: '(425) 555-5678',
    address: '5678 Engineer Blvd, Bellevue, WA 98006',
    entities: ['Structural Engineering Associates'],
    tags: ['Structural Engineering', 'Seismic Design'],
    status: 'Active',
    projectsCount: 11,
    loansCount: 9,
    lastActivity: '2024-11-12',
    notes: 'Excellent structural engineer. Specializes in complex seismic design.',
    projects: [
      { id: 109, name: 'Bellevue Square Residences', role: 'Structural Engineer' },
      { id: 112, name: 'Wallingford Homes', role: 'Structural Engineer' }
    ],
    loans: [],
    relatedContacts: [2, 7, 10],
    activities: [
      { date: '2024-11-12', type: 'Review', description: 'Structural plans approved' },
      { date: '2024-11-06', type: 'Meeting', description: 'Foundation design review' }
    ]
  },
  {
    id: 12,
    firstName: 'Patricia',
    lastName: 'Moore',
    type: 'Consultant',
    company: 'Moore & Associates Law',
    email: 'pmoore@moorelaw.com',
    phone: '(206) 555-6789',
    address: '6789 Legal Plaza, Seattle, WA 98101',
    entities: ['Moore & Associates Law PLLC'],
    tags: ['Real Estate Law', 'Contract Review'],
    status: 'Active',
    projectsCount: 20,
    loansCount: 18,
    lastActivity: '2024-11-13',
    notes: 'Primary real estate attorney. Handles all loan documentation and contract review.',
    projects: [
      { id: 101, name: 'Greenwood Estates', role: 'Legal Counsel' },
      { id: 103, name: 'Queen Anne Residences', role: 'Legal Counsel' }
    ],
    loans: [
      { id: 4523, projectName: 'Greenwood Estates', role: 'Legal Counsel' },
      { id: 4521, projectName: 'Madison Park Homes', role: 'Legal Counsel' }
    ],
    relatedContacts: [5, 8],
    activities: [
      { date: '2024-11-13', type: 'Document', description: 'Loan documents executed' },
      { date: '2024-11-11', type: 'Review', description: 'Contract review completed' }
    ]
  },
  {
    id: 13,
    firstName: 'Steven',
    lastName: 'Garcia',
    type: 'Agent',
    company: 'Sonora Realty Partners',
    email: 'sgarcia@sonorarealtypartners.com',
    phone: '(602) 555-7890',
    address: '7890 Realty Ave, Phoenix, AZ 85003',
    entities: ['Sonora Realty Partners'],
    tags: ['Phoenix Market', 'Investment Properties'],
    status: 'Active',
    projectsCount: 5,
    loansCount: 3,
    lastActivity: '2024-11-09',
    notes: 'Investment property specialist. Strong track record with developer clients.',
    projects: [
      { id: 108, name: 'Scottsdale Heights', role: 'Buyer Agent' },
      { id: 111, name: 'Tempe Modern', role: 'Listing Agent' }
    ],
    loans: [
      { id: 4517, projectName: 'Desert Bloom Estates', role: 'Agent' }
    ],
    relatedContacts: [6, 9],
    activities: [
      { date: '2024-11-09', type: 'Contract', description: 'Purchase agreement executed' },
      { date: '2024-11-04', type: 'Showing', description: 'Property tours completed' }
    ]
  },
  {
    id: 14,
    firstName: 'Rachel',
    lastName: 'Brown',
    type: 'Guarantor',
    company: 'Brown Family Trust',
    email: 'rbrown@brownfamilytrust.com',
    phone: '(206) 555-8901',
    address: '8901 Trust Way, Seattle, WA 98102',
    entities: ['Brown Family Trust', 'RB Holdings LLC'],
    tags: ['Family Office', 'Multiple Guarantees'],
    status: 'Active',
    projectsCount: 4,
    loansCount: 3,
    lastActivity: '2024-11-07',
    notes: 'Family office providing guarantees for Taylor Development. Strong financial position.',
    projects: [
      { id: 112, name: 'Wallingford Homes', role: 'Guarantor' }
    ],
    loans: [
      { id: 4516, projectName: 'Wallingford Homes', role: 'Guarantor' }
    ],
    relatedContacts: [10],
    activities: [
      { date: '2024-11-07', type: 'Financial Update', description: 'Quarterly financial statements submitted' },
      { date: '2024-10-30', type: 'Document', description: 'Personal guarantee executed' }
    ]
  },
  {
    id: 15,
    firstName: 'Thomas',
    lastName: 'White',
    type: 'Consultant',
    company: 'Urban Planning Solutions',
    email: 'twhite@urbanplanningsolutions.com',
    phone: '(206) 555-9012',
    address: '9012 Planning Dr, Seattle, WA 98105',
    entities: ['Urban Planning Solutions Inc'],
    tags: ['Land Use', 'Zoning Expert'],
    status: 'Active',
    projectsCount: 13,
    loansCount: 10,
    lastActivity: '2024-11-10',
    notes: 'Land use and zoning consultant. Expert at navigating city planning departments.',
    projects: [
      { id: 101, name: 'Greenwood Estates', role: 'Urban Planner' },
      { id: 103, name: 'Queen Anne Residences', role: 'Urban Planner' }
    ],
    loans: [],
    relatedContacts: [1, 2],
    activities: [
      { date: '2024-11-10', type: 'Approval', description: 'Zoning variance approved' },
      { date: '2024-11-05', type: 'Meeting', description: 'City planning department meeting' }
    ]
  },
  {
    id: 16,
    firstName: 'Michelle',
    lastName: 'Lee',
    type: 'Borrower',
    company: 'Cascade Development Partners',
    email: 'mlee@cascadedev.com',
    phone: '(425) 555-0123',
    address: '123 Developer Ct, Kirkland, WA 98033',
    entities: ['Cascade Development Partners LLC', 'ML Properties Inc'],
    tags: ['Repeat Borrower', 'Commercial Focus'],
    status: 'Active',
    projectsCount: 5,
    loansCount: 4,
    lastActivity: '2024-11-11',
    notes: 'Commercial developer transitioning to residential. Strong financial backing.',
    projects: [
      { id: 113, name: 'Kirkland Mixed-Use', role: 'Developer/Owner' }
    ],
    loans: [
      { id: 4522, projectName: 'Kirkland Mixed-Use', role: 'Borrower' }
    ],
    relatedContacts: [4, 17],
    activities: [
      { date: '2024-11-11', type: 'Meeting', description: 'Project financing discussion' },
      { date: '2024-11-04', type: 'Application', description: 'Loan application submitted' }
    ]
  },
  {
    id: 17,
    firstName: 'Kevin',
    lastName: 'Patel',
    type: 'Guarantor',
    company: 'Patel Investment Group',
    email: 'kpatel@patelinvestments.com',
    phone: '(425) 555-1234',
    address: '1234 Investment Way, Bellevue, WA 98004',
    entities: ['Patel Investment Group', 'KP Capital Partners'],
    tags: ['Private Equity', 'High Net Worth'],
    status: 'Active',
    projectsCount: 5,
    loansCount: 4,
    lastActivity: '2024-11-11',
    notes: 'Private equity firm backing Cascade Development. Deep pockets and excellent credit.',
    projects: [
      { id: 113, name: 'Kirkland Mixed-Use', role: 'Guarantor' }
    ],
    loans: [
      { id: 4522, projectName: 'Kirkland Mixed-Use', role: 'Guarantor' }
    ],
    relatedContacts: [16],
    activities: [
      { date: '2024-11-11', type: 'Document', description: 'Personal guarantee signed' },
      { date: '2024-11-04', type: 'Financial Verification', description: 'Financial statements verified' }
    ]
  },
  {
    id: 18,
    firstName: 'Angela',
    lastName: 'Brooks',
    type: 'Consultant',
    company: 'Environmental Impact Services',
    email: 'abrooks@envimpact.com',
    phone: '(206) 555-2345',
    address: '2345 Green St, Seattle, WA 98106',
    entities: ['Environmental Impact Services Inc'],
    tags: ['Environmental', 'Phase I & II'],
    status: 'Active',
    projectsCount: 10,
    loansCount: 8,
    lastActivity: '2024-11-12',
    notes: 'Environmental consultant for site assessments. Thorough and detail-oriented.',
    projects: [
      { id: 105, name: 'Redmond Heights', role: 'Environmental Consultant' },
      { id: 113, name: 'Kirkland Mixed-Use', role: 'Environmental Consultant' }
    ],
    loans: [],
    relatedContacts: [3, 16],
    activities: [
      { date: '2024-11-12', type: 'Report', description: 'Phase I ESA completed' },
      { date: '2024-11-06', type: 'Site Visit', description: 'Property inspection conducted' }
    ]
  },
  {
    id: 19,
    firstName: 'Christopher',
    lastName: 'Nelson',
    type: 'Builder',
    company: 'Skyline Builders',
    email: 'cnelson@skylinebuilders.com',
    phone: '(206) 555-3456',
    address: '3456 Build St, Seattle, WA 98107',
    entities: ['Skyline Builders Inc', 'Nelson Construction LLC'],
    tags: ['High-Rise Specialist', 'Luxury Projects'],
    status: 'Active',
    projectsCount: 8,
    loansCount: 6,
    lastActivity: '2024-11-13',
    notes: 'Specializes in high-rise and luxury residential. Premium quality work.',
    projects: [
      { id: 103, name: 'Queen Anne Residences', role: 'General Contractor' },
      { id: 114, name: 'Capitol Hill Tower', role: 'General Contractor' }
    ],
    loans: [
      { id: 4519, projectName: 'Capitol Hill Residences', role: 'Builder' }
    ],
    relatedContacts: [1, 15],
    activities: [
      { date: '2024-11-13', type: 'Milestone', description: 'Topping out ceremony completed' },
      { date: '2024-11-09', type: 'Draw Request', description: 'Draw #5 submitted for $850k' }
    ]
  },
  {
    id: 20,
    firstName: 'Diane',
    lastName: 'Foster',
    type: 'Agent',
    company: 'Waterfront Realty Group',
    email: 'dfoster@waterfrontrealty.com',
    phone: '(206) 555-4567',
    address: '4567 Harbor View, Seattle, WA 98108',
    entities: ['Waterfront Realty Group'],
    tags: ['Luxury Specialist', 'Waterfront Properties'],
    status: 'Active',
    projectsCount: 7,
    loansCount: 5,
    lastActivity: '2024-11-12',
    notes: 'Luxury and waterfront property specialist. Excellent network of high-net-worth buyers.',
    projects: [
      { id: 110, name: 'Mercer Island Luxury', role: 'Listing Agent' },
      { id: 114, name: 'Capitol Hill Tower', role: 'Sales Agent' }
    ],
    loans: [
      { id: 4519, projectName: 'Capitol Hill Residences', role: 'Agent' }
    ],
    relatedContacts: [7, 19],
    activities: [
      { date: '2024-11-12', type: 'Showing', description: 'Private showing for VIP buyers' },
      { date: '2024-11-08', type: 'Contract', description: 'Pre-sale agreement signed' }
    ]
  }
]

export default function ContactsPage() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState(true) // true = Active, false = All
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [newContactDialogOpen, setNewContactDialogOpen] = useState(false)
  const [detailTab, setDetailTab] = useState(0)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'

  // New Contact Form State
  const [newContact, setNewContact] = useState({
    type: '',
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    entities: [],
    tags: [],
    notes: ''
  })

  const getTypeColor = type => {
    switch (type) {
      case 'Agent':
        return 'primary'
      case 'Builder':
        return 'success'
      case 'Borrower':
        return 'warning'
      case 'Guarantor':
        return 'secondary'
      case 'Consultant':
        return 'info'
      default:
        return 'default'
    }
  }

  const getTypeIcon = type => {
    switch (type) {
      case 'Agent':
        return 'ri-user-star-line'
      case 'Builder':
        return 'ri-hammer-line'
      case 'Borrower':
        return 'ri-money-dollar-circle-line'
      case 'Guarantor':
        return 'ri-shield-check-line'
      case 'Consultant':
        return 'ri-briefcase-line'
      default:
        return 'ri-user-line'
    }
  }

  const getActivityIcon = type => {
    switch (type) {
      case 'Meeting':
        return 'ri-calendar-event-line'
      case 'Email':
        return 'ri-mail-line'
      case 'Call':
        return 'ri-phone-line'
      case 'Document':
        return 'ri-file-text-line'
      case 'Payment':
        return 'ri-money-dollar-circle-line'
      default:
        return 'ri-record-circle-line'
    }
  }

  // Filter contacts
  const filteredContacts = mockContacts.filter(contact => {
    const matchesType = typeFilter === 'all' || contact.type.toLowerCase() === typeFilter.toLowerCase()
    const matchesStatus = !statusFilter || contact.status === 'Active'

    const matchesSearch =
      !searchQuery ||
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)

    
return matchesType && matchesStatus && matchesSearch
  })

  // Calculate stats
  const totalContacts = mockContacts.length
  const activeAgents = mockContacts.filter(c => c.type === 'Agent' && c.status === 'Active').length
  const activeBuilders = mockContacts.filter(c => c.type === 'Builder' && c.status === 'Active').length
  const activeConsultants = mockContacts.filter(c => c.type === 'Consultant' && c.status === 'Active').length

  const handleContactClick = contact => {
    setSelectedContact(contact)
    setDetailDialogOpen(true)
    setDetailTab(0)
  }

  const handleCloseDetail = () => {
    setDetailDialogOpen(false)
    setSelectedContact(null)
  }

  const handleNewContactClick = () => {
    setNewContactDialogOpen(true)
    setNewContact({
      type: '',
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      entities: [],
      tags: [],
      notes: ''
    })
  }

  const handleCloseNewContact = () => {
    setNewContactDialogOpen(false)
  }

  const handleSubmitNewContact = () => {
    // In real app, this would POST to API
    console.log('Creating new contact:', newContact)
    setNewContactDialogOpen(false)

    // Show success message, refresh list, etc.
  }

  const getRelatedContactsData = contactIds => {
    return mockContacts.filter(c => contactIds.includes(c.id))
  }

  return (
    <div>
      {/* Page Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold mb-2">
            Contacts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage agents, builders, borrowers, guarantors, and consultants
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<i className="ri-add-line" />} onClick={handleNewContactClick}>
          New Contact
        </Button>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Total Contacts
              </Typography>
              <Typography variant="h4" className="font-bold">
                {totalContacts}
              </Typography>
              <Chip label="All Active" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Active Agents
              </Typography>
              <Typography variant="h4" className="font-bold">
                {activeAgents}
              </Typography>
              <Chip
                label="Real Estate"
                size="small"
                color="primary"
                variant="tonal"
                className="mt-2"
                icon={<i className="ri-user-star-line" />}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Active Builders
              </Typography>
              <Typography variant="h4" className="font-bold">
                {activeBuilders}
              </Typography>
              <Chip
                label="Construction"
                size="small"
                color="success"
                variant="tonal"
                className="mt-2"
                icon={<i className="ri-hammer-line" />}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Active Consultants
              </Typography>
              <Typography variant="h4" className="font-bold">
                {activeConsultants}
              </Typography>
              <Chip
                label="Professional Services"
                size="small"
                color="info"
                variant="tonal"
                className="mt-2"
                icon={<i className="ri-briefcase-line" />}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent>
          <Box className="flex gap-4 items-center flex-wrap">
            <TextField
              placeholder="Search by name, company, email, or phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              size="small"
              className="flex-1 min-w-[300px]"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="ri-search-line" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" className="min-w-[180px]">
              <InputLabel>Type</InputLabel>
              <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} label="Type">
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="agent">Agents</MenuItem>
                <MenuItem value="builder">Builders</MenuItem>
                <MenuItem value="borrower">Borrowers</MenuItem>
                <MenuItem value="guarantor">Guarantors</MenuItem>
                <MenuItem value="consultant">Consultants</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Switch checked={statusFilter} onChange={e => setStatusFilter(e.target.checked)} />}
              label="Active Only"
            />
            <Box className="flex gap-2">
              <IconButton
                size="small"
                onClick={() => setViewMode('table')}
                color={viewMode === 'table' ? 'primary' : 'default'}
              >
                <i className="ri-list-check" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <i className="ri-grid-line" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Contacts Table View */}
      {viewMode === 'table' && (
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Contact</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Company / Entity</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell align="center">Projects</TableCell>
                    <TableCell align="center">Loans</TableCell>
                    <TableCell>Last Activity</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredContacts.map(contact => (
                    <TableRow
                      key={contact.id}
                      hover
                      className="cursor-pointer"
                      onClick={() => handleContactClick(contact)}
                    >
                      <TableCell>
                        <Box className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            {contact.firstName[0]}
                            {contact.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" className="font-semibold">
                              {contact.firstName} {contact.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {contact.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={contact.type}
                          size="small"
                          color={getTypeColor(contact.type)}
                          variant="tonal"
                          icon={<i className={getTypeIcon(contact.type)} />}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{contact.company}</Typography>
                        {contact.entities.length > 1 && (
                          <Typography variant="caption" color="text.secondary">
                            +{contact.entities.length - 1} more entities
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`mailto:${contact.email}`} className="text-primary no-underline hover:underline">
                          <Typography variant="body2">{contact.email}</Typography>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`tel:${contact.phone}`} className="text-primary no-underline hover:underline">
                          <Typography variant="body2">{contact.phone}</Typography>
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={contact.projectsCount} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={contact.loansCount} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(contact.lastActivity).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={e => {
                            e.stopPropagation()
                            handleContactClick(contact)
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Contacts Grid View */}
      {viewMode === 'grid' && (
        <Grid container spacing={4}>
          {filteredContacts.map(contact => (
            <Grid item xs={12} sm={6} lg={4} key={contact.id}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleContactClick(contact)}>
                <CardContent>
                  <Box className="flex items-start justify-between mb-3">
                    <Box className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        {contact.firstName[0]}
                        {contact.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" className="font-semibold">
                          {contact.firstName} {contact.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {contact.company}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box className="mb-3">
                    <Chip
                      label={contact.type}
                      size="small"
                      color={getTypeColor(contact.type)}
                      variant="tonal"
                      icon={<i className={getTypeIcon(contact.type)} />}
                    />
                  </Box>

                  <Box className="space-y-2 mb-4">
                    <Box className="flex items-center gap-2">
                      <i className="ri-mail-line text-gray-500" />
                      <Typography variant="body2" color="text.secondary" className="truncate">
                        {contact.email}
                      </Typography>
                    </Box>
                    <Box className="flex items-center gap-2">
                      <i className="ri-phone-line text-gray-500" />
                      <Typography variant="body2" color="text.secondary">
                        {contact.phone}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider className="my-3" />

                  <Box className="flex justify-between items-center">
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Projects
                      </Typography>
                      <Typography variant="body1" className="font-bold">
                        {contact.projectsCount}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Loans
                      </Typography>
                      <Typography variant="body1" className="font-bold">
                        {contact.loansCount}
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small" onClick={(e) => {
                      e.stopPropagation()
                      handleContactClick(contact)
                    }}>
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Contact Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={handleCloseDetail} maxWidth="lg" fullWidth>
        {selectedContact && (
          <>
            <DialogTitle>
              <Box className="flex items-start justify-between">
                <Box className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 text-xl">
                    {selectedContact.firstName[0]}
                    {selectedContact.lastName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" className="font-bold">
                      {selectedContact.firstName} {selectedContact.lastName}
                    </Typography>
                    <Box className="flex items-center gap-2 mt-1">
                      <Chip
                        label={selectedContact.type}
                        size="small"
                        color={getTypeColor(selectedContact.type)}
                        variant="tonal"
                        icon={<i className={getTypeIcon(selectedContact.type)} />}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {selectedContact.company}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton onClick={handleCloseDetail}>
                  <i className="ri-close-line" />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box className="mb-4">
                <Tabs value={detailTab} onChange={(e, newValue) => setDetailTab(newValue)}>
                  <Tab label="Overview" icon={<i className="ri-information-line" />} iconPosition="start" />
                  <Tab label="Relationships" icon={<i className="ri-links-line" />} iconPosition="start" />
                  <Tab
                    label={`Projects (${selectedContact.projects.length})`}
                    icon={<i className="ri-building-line" />}
                    iconPosition="start"
                  />
                  <Tab
                    label={`Loans (${selectedContact.loans.length})`}
                    icon={<i className="ri-money-dollar-circle-line" />}
                    iconPosition="start"
                  />
                  <Tab label="Documents" icon={<i className="ri-file-list-line" />} iconPosition="start" />
                  <Tab
                    label="Activity"
                    icon={<i className="ri-time-line" />}
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              {/* Overview Tab */}
              {detailTab === 0 && (
                <Box>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" className="font-semibold mb-3">
                            Contact Information
                          </Typography>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Email
                              </Typography>
                              <Typography variant="body2">
                                <Link href={`mailto:${selectedContact.email}`} className="text-primary">
                                  {selectedContact.email}
                                </Link>
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Phone
                              </Typography>
                              <Typography variant="body2">
                                <Link href={`tel:${selectedContact.phone}`} className="text-primary">
                                  {selectedContact.phone}
                                </Link>
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Address
                              </Typography>
                              <Typography variant="body2">{selectedContact.address}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Status
                              </Typography>
                              <Box className="mt-1">
                                <Chip label={selectedContact.status} size="small" color="success" />
                              </Box>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" className="font-semibold mb-3">
                            Associated Entities
                          </Typography>
                          <Stack spacing={1}>
                            {selectedContact.entities.map((entity, idx) => (
                              <Box key={idx} className="flex items-center gap-2">
                                <i className="ri-building-4-line text-gray-500" />
                                <Typography variant="body2">{entity}</Typography>
                              </Box>
                            ))}
                          </Stack>
                          <Divider className="my-3" />
                          <Typography variant="h6" className="font-semibold mb-2">
                            Tags
                          </Typography>
                          <Box className="flex flex-wrap gap-2">
                            {selectedContact.tags.map((tag, idx) => (
                              <Chip key={idx} label={tag} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" className="font-semibold mb-2">
                            Notes
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedContact.notes}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Relationships Tab */}
              {detailTab === 1 && (
                <Box>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" className="font-semibold mb-3">
                        Related Contacts
                      </Typography>
                      <List>
                        {getRelatedContactsData(selectedContact.relatedContacts).map(relatedContact => (
                          <ListItem
                            key={relatedContact.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleContactClick(relatedContact)}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                {relatedContact.firstName[0]}
                                {relatedContact.lastName[0]}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${relatedContact.firstName} ${relatedContact.lastName}`}
                              secondary={relatedContact.company}
                              secondaryTypographyProps={{
                                component: 'span',
                                variant: 'caption'
                              }}
                            />
                            <Box className="flex items-center gap-2">
                              <Chip
                                label={relatedContact.type}
                                size="small"
                                color={getTypeColor(relatedContact.type)}
                                variant="tonal"
                              />
                              <IconButton size="small">
                                <i className="ri-arrow-right-line" />
                              </IconButton>
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                  <Card variant="outlined" className="mt-4">
                    <CardContent>
                      <Typography variant="h6" className="font-semibold mb-3">
                        Network Overview
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Box className="text-center p-3 bg-gray-50 rounded">
                            <Typography variant="h5" className="font-bold">
                              {selectedContact.projectsCount}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Projects
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box className="text-center p-3 bg-gray-50 rounded">
                            <Typography variant="h5" className="font-bold">
                              {selectedContact.loansCount}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Loans
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box className="text-center p-3 bg-gray-50 rounded">
                            <Typography variant="h5" className="font-bold">
                              {selectedContact.relatedContacts.length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Connections
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box className="text-center p-3 bg-gray-50 rounded">
                            <Typography variant="h5" className="font-bold">
                              {selectedContact.entities.length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Entities
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              )}

              {/* Projects Tab */}
              {detailTab === 2 && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" className="font-semibold mb-3">
                      Associated Projects
                    </Typography>
                    <List>
                      {selectedContact.projects.map(project => (
                        <ListItem key={project.id} divider>
                          <ListItemAvatar>
                            <Avatar>
                              <i className="ri-building-line" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={project.name}
                            secondary={`Project ID: ${project.id}`}
                            secondaryTypographyProps={{
                              component: 'span',
                              variant: 'caption',
                              color: 'text.secondary'
                            }}
                          />
                          <Box className="flex items-center gap-2">
                            <Chip label={project.role} size="small" variant="outlined" />
                            <Button variant="outlined" size="small">
                              View Project
                            </Button>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

              {/* Loans Tab */}
              {detailTab === 3 && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" className="font-semibold mb-3">
                      Associated Loans
                    </Typography>
                    {selectedContact.loans.length > 0 ? (
                      <List>
                        {selectedContact.loans.map(loan => (
                          <ListItem key={loan.id} divider>
                            <ListItemAvatar>
                              <Avatar>
                                <i className="ri-money-dollar-circle-line" />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box className="flex items-center gap-2">
                                  <Typography variant="body1" className="font-semibold">
                                    Loan #{loan.id}
                                  </Typography>
                                  <Chip label={loan.role} size="small" variant="outlined" />
                                </Box>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary">
                                  {loan.projectName}
                                </Typography>
                              }
                            />
                            <Button variant="outlined" size="small">
                              View Loan
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Box className="text-center py-8">
                        <i className="ri-money-dollar-circle-line text-6xl text-gray-300 mb-2" />
                        <Typography variant="body2" color="text.secondary">
                          No loans associated with this contact
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Documents Tab */}
              {detailTab === 4 && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" className="font-semibold mb-3">
                      Documents
                    </Typography>
                    <Box className="text-center py-8">
                      <i className="ri-file-list-line text-6xl text-gray-300 mb-2" />
                      <Typography variant="body2" color="text.secondary" className="mb-4">
                        No documents uploaded yet
                      </Typography>
                      <Button variant="outlined" startIcon={<i className="ri-upload-line" />}>
                        Upload Document
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Activity Tab */}
              {detailTab === 5 && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" className="font-semibold mb-3">
                      Activity Timeline
                    </Typography>
                    <List>
                      {selectedContact.activities.map((activity, idx) => (
                        <ListItem key={idx} divider>
                          <ListItemAvatar>
                            <Avatar className="bg-blue-100">
                              <i className={`${getActivityIcon(activity.type)} text-blue-600`} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box className="flex items-center gap-2">
                                <Typography variant="body2" className="font-semibold">
                                  {activity.type}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(activity.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </Typography>
                              </Box>
                            }
                            secondary={activity.description}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}
            </DialogContent>
            <DialogActions className="p-6 bg-gray-50">
              <Button
                variant="outlined"
                startIcon={<i className="ri-edit-line" />}
                onClick={() => console.log('Edit contact')}
              >
                Edit Contact
              </Button>
              <Button
                variant="outlined"
                startIcon={<i className="ri-mail-line" />}
                onClick={() => window.location.href = `mailto:${selectedContact.email}`}
              >
                Send Message
              </Button>
              <Button variant="outlined" startIcon={<i className="ri-add-line" />}>
                Add to Project
              </Button>
              <Button variant="contained" startIcon={<i className="ri-money-dollar-circle-line" />}>
                Create Loan
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Contact Dialog */}
      <Dialog open={newContactDialogOpen} onClose={handleCloseNewContact} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box className="flex items-center justify-between">
            <Typography variant="h5" className="font-bold">
              New Contact
            </Typography>
            <IconButton onClick={handleCloseNewContact}>
              <i className="ri-close-line" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} className="mt-2">
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Contact Type</InputLabel>
                <Select
                  value={newContact.type}
                  onChange={e => setNewContact({ ...newContact, type: e.target.value })}
                  label="Contact Type"
                >
                  <MenuItem value="Agent">Agent</MenuItem>
                  <MenuItem value="Builder">Builder</MenuItem>
                  <MenuItem value="Borrower">Borrower</MenuItem>
                  <MenuItem value="Guarantor">Guarantor</MenuItem>
                  <MenuItem value="Consultant">Consultant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="First Name"
                value={newContact.firstName}
                onChange={e => setNewContact({ ...newContact, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Last Name"
                value={newContact.lastName}
                onChange={e => setNewContact({ ...newContact, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Company Name"
                value={newContact.company}
                onChange={e => setNewContact({ ...newContact, company: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                value={newContact.email}
                onChange={e => setNewContact({ ...newContact, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Phone"
                value={newContact.phone}
                onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="(206) 555-1234"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={newContact.address}
                onChange={e => setNewContact({ ...newContact, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Associated Entities / LLCs"
                value={newContact.entities.join(', ')}
                onChange={e => setNewContact({ ...newContact, entities: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Separate multiple entities with commas"
                helperText="Enter business entities associated with this contact"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags"
                value={newContact.tags.join(', ')}
                onChange={e => setNewContact({ ...newContact, tags: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Separate tags with commas"
                helperText="e.g., Top Performer, Seattle Market, Preferred Builder"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                value={newContact.notes}
                onChange={e => setNewContact({ ...newContact, notes: e.target.value })}
                placeholder="Add any relevant notes about this contact..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={handleCloseNewContact}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitNewContact}
            disabled={!newContact.type || !newContact.firstName || !newContact.lastName || !newContact.email || !newContact.phone}
          >
            Create Contact
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
