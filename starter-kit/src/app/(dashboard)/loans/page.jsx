'use client'

import { useState } from 'react'

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
  Alert
} from '@mui/material'

// Mock data for loans
const MOCK_LOANS = [
  {
    loanNumber: 'LN-2024-1001',
    propertyAddress: '1234 Greenwood Ave N, Seattle, WA 98103',
    borrower: 'ABC Development LLC',
    borrowerContact: 'John Smith',
    status: 'Servicing',
    loanAmount: 4200000,
    fundedAmount: 2800000,
    fundedDate: '2024-02-15',
    maturityDate: '2025-12-15',
    assignedTo: 'Sarah Johnson',
    interestRate: 8.5,
    term: 24,
    builder: 'Premier Builders Inc',
    guarantors: ['John Smith', 'Jane Doe'],
    projectId: 'PRJ-2023-456'
  },
  {
    loanNumber: 'LN-2024-1002',
    propertyAddress: '5678 Madison Park Blvd, Seattle, WA 98112',
    borrower: 'Park Dev Partners',
    borrowerContact: 'Michael Chen',
    status: 'Servicing',
    loanAmount: 3850000,
    fundedAmount: 3200000,
    fundedDate: '2024-01-20',
    maturityDate: '2025-10-30',
    assignedTo: 'David Martinez',
    interestRate: 8.75,
    term: 22,
    builder: 'Apex Construction',
    guarantors: ['Michael Chen'],
    projectId: 'PRJ-2023-412'
  },
  {
    loanNumber: 'LN-2024-1003',
    propertyAddress: '9012 Capitol Hill Dr, Seattle, WA 98102',
    borrower: 'Hill Properties LLC',
    borrowerContact: 'Emily Rodriguez',
    status: 'Funded',
    loanAmount: 5100000,
    fundedAmount: 1200000,
    fundedDate: '2024-09-15',
    maturityDate: '2026-03-15',
    assignedTo: 'Sarah Johnson',
    interestRate: 8.25,
    term: 18,
    builder: 'Skyline Builders',
    guarantors: ['Emily Rodriguez', 'Robert Hill'],
    projectId: 'PRJ-2024-102'
  },
  {
    loanNumber: 'LN-2023-0987',
    propertyAddress: '3456 Ballard Ave NW, Seattle, WA 98107',
    borrower: 'Ballard Dev Group',
    borrowerContact: 'Tom Wilson',
    status: 'Paid Off',
    loanAmount: 2950000,
    fundedAmount: 2950000,
    fundedDate: '2023-05-10',
    maturityDate: '2024-11-01',
    assignedTo: 'David Martinez',
    interestRate: 8.0,
    term: 18,
    builder: 'Harbor Construction',
    guarantors: ['Tom Wilson'],
    projectId: 'PRJ-2023-301'
  },
  {
    loanNumber: 'LN-2024-1004',
    propertyAddress: '7890 Fremont St, Seattle, WA 98103',
    borrower: 'Fremont Developers',
    borrowerContact: 'Lisa Anderson',
    status: 'Approved',
    loanAmount: 3600000,
    fundedAmount: 0,
    fundedDate: null,
    maturityDate: '2026-06-30',
    assignedTo: 'Sarah Johnson',
    interestRate: 8.5,
    term: 20,
    builder: 'Northwest Builders',
    guarantors: ['Lisa Anderson', 'Mark Thompson'],
    projectId: 'PRJ-2024-156'
  },
  {
    loanNumber: 'LN-2024-1005',
    propertyAddress: '2345 Queen Anne Ave, Seattle, WA 98109',
    borrower: 'Queen Anne Properties',
    borrowerContact: 'Robert Davis',
    status: 'Servicing',
    loanAmount: 4750000,
    fundedAmount: 3800000,
    fundedDate: '2024-03-01',
    maturityDate: '2025-09-01',
    assignedTo: 'David Martinez',
    interestRate: 8.25,
    term: 18,
    builder: 'Elite Construction',
    guarantors: ['Robert Davis'],
    projectId: 'PRJ-2024-089'
  },
  {
    loanNumber: 'LN-2024-1006',
    propertyAddress: '6789 Wallingford Ave N, Seattle, WA 98103',
    borrower: 'Wallingford Holdings LLC',
    borrowerContact: 'Jennifer Lee',
    status: 'Pending',
    loanAmount: 2800000,
    fundedAmount: 0,
    fundedDate: null,
    maturityDate: '2026-08-15',
    assignedTo: 'Sarah Johnson',
    interestRate: 8.75,
    term: 24,
    builder: 'Cascade Builders',
    guarantors: ['Jennifer Lee', 'Kevin Park'],
    projectId: 'PRJ-2024-201'
  },
  {
    loanNumber: 'LN-2024-1007',
    propertyAddress: '4567 Eastlake Ave E, Seattle, WA 98102',
    borrower: 'Eastlake Development Corp',
    borrowerContact: 'William Brown',
    status: 'Servicing',
    loanAmount: 5500000,
    fundedAmount: 4200000,
    fundedDate: '2024-04-10',
    maturityDate: '2026-01-10',
    assignedTo: 'David Martinez',
    interestRate: 8.0,
    term: 21,
    builder: 'Prestige Homes',
    guarantors: ['William Brown', 'Susan Clark'],
    projectId: 'PRJ-2024-045'
  },
  {
    loanNumber: 'LN-2024-1008',
    propertyAddress: '8901 University District Way, Seattle, WA 98105',
    borrower: 'U-District Ventures',
    borrowerContact: 'Amanda White',
    status: 'Funded',
    loanAmount: 3200000,
    fundedAmount: 800000,
    fundedDate: '2024-10-01',
    maturityDate: '2026-04-01',
    assignedTo: 'Sarah Johnson',
    interestRate: 8.5,
    term: 18,
    builder: 'Vertex Construction',
    guarantors: ['Amanda White'],
    projectId: 'PRJ-2024-178'
  },
  {
    loanNumber: 'LN-2024-1009',
    propertyAddress: '1234 West Seattle Ave, Seattle, WA 98116',
    borrower: 'West Seattle Partners',
    borrowerContact: 'Daniel Martinez',
    status: 'Servicing',
    loanAmount: 4100000,
    fundedAmount: 3300000,
    fundedDate: '2024-05-20',
    maturityDate: '2025-11-20',
    assignedTo: 'David Martinez',
    interestRate: 8.25,
    term: 18,
    builder: 'Pacific Northwest Builders',
    guarantors: ['Daniel Martinez', 'Rachel Garcia'],
    projectId: 'PRJ-2024-067'
  },
  {
    loanNumber: 'LN-2024-1010',
    propertyAddress: '5678 Columbia City Blvd, Seattle, WA 98118',
    borrower: 'Columbia Developers LLC',
    borrowerContact: 'Nicole Taylor',
    status: 'Approved',
    loanAmount: 2600000,
    fundedAmount: 0,
    fundedDate: null,
    maturityDate: '2026-07-15',
    assignedTo: 'Sarah Johnson',
    interestRate: 8.5,
    term: 24,
    builder: 'Summit Construction',
    guarantors: ['Nicole Taylor'],
    projectId: 'PRJ-2024-189'
  },
  {
    loanNumber: 'LN-2024-1011',
    propertyAddress: '9012 Beacon Hill Dr, Seattle, WA 98144',
    borrower: 'Beacon Development Group',
    borrowerContact: 'Christopher Moore',
    status: 'Servicing',
    loanAmount: 3900000,
    fundedAmount: 2700000,
    fundedDate: '2024-06-15',
    maturityDate: '2025-12-15',
    assignedTo: 'David Martinez',
    interestRate: 8.0,
    term: 18,
    builder: 'Metro Builders Inc',
    guarantors: ['Christopher Moore', 'Patricia Johnson'],
    projectId: 'PRJ-2024-123'
  }
]

// Mock contacts for autocomplete
const MOCK_CONTACTS = [
  { name: 'John Smith', company: 'ABC Development LLC', type: 'Borrower' },
  { name: 'Michael Chen', company: 'Park Dev Partners', type: 'Borrower' },
  { name: 'Emily Rodriguez', company: 'Hill Properties LLC', type: 'Borrower' },
  { name: 'Tom Wilson', company: 'Ballard Dev Group', type: 'Borrower' },
  { name: 'Lisa Anderson', company: 'Fremont Developers', type: 'Borrower' },
  { name: 'Robert Davis', company: 'Queen Anne Properties', type: 'Borrower' },
  { name: 'Jennifer Lee', company: 'Wallingford Holdings LLC', type: 'Borrower' },
  { name: 'William Brown', company: 'Eastlake Development Corp', type: 'Borrower' },
  { name: 'Jane Doe', company: 'ABC Development LLC', type: 'Guarantor' },
  { name: 'Robert Hill', company: 'Hill Properties LLC', type: 'Guarantor' }
]

// Mock team members
const TEAM_MEMBERS = ['Sarah Johnson', 'David Martinez', 'Emily Chen', 'Michael Roberts']

export default function LoansPage() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [newLoanDialogOpen, setNewLoanDialogOpen] = useState(false)
  const [detailTab, setDetailTab] = useState(0)

  // New loan form state
  const [newLoanData, setNewLoanData] = useState({
    propertyAddress: '',
    borrower: null,
    loanAmount: '',
    interestRate: '',
    term: '',
    closingDate: '',
    guarantors: [],
    assignedTo: '',
    builder: ''
  })

  const getStatusColor = status => {
    switch (status) {
      case 'Servicing':
        return 'success'
      case 'Funded':
        return 'info'
      case 'Approved':
        return 'primary'
      case 'Pending':
        return 'warning'
      case 'Paid Off':
        return 'default'
      default:
        return 'default'
    }
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = dateString => {
    if (!dateString) return 'N/A'
    
return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Filter loans
  const filteredLoans = MOCK_LOANS.filter(loan => {
    const matchesStatus = statusFilter === 'All' || loan.status === statusFilter

    const matchesSearch =
      searchQuery === '' ||
      loan.loanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.borrower.toLowerCase().includes(searchQuery.toLowerCase())

    
return matchesStatus && matchesSearch
  })

  // Calculate stats
  const activeLoans = MOCK_LOANS.filter(l => l.status === 'Servicing' || l.status === 'Funded').length
  const totalPortfolio = MOCK_LOANS.reduce((sum, loan) => sum + loan.loanAmount, 0)
  const fundingPipeline = MOCK_LOANS.filter(l => l.status === 'Approved' || l.status === 'Pending').length
  const avgLoanSize = totalPortfolio / MOCK_LOANS.length

  const handleViewDetails = loan => {
    setSelectedLoan(loan)
    setDetailDialogOpen(true)
    setDetailTab(0)
  }

  const handleNewLoan = () => {
    setNewLoanDialogOpen(true)

    // Reset form
    setNewLoanData({
      propertyAddress: '',
      borrower: null,
      loanAmount: '',
      interestRate: '',
      term: '',
      closingDate: '',
      guarantors: [],
      assignedTo: '',
      builder: ''
    })
  }

  const handleSubmitNewLoan = () => {
    // In a real app, this would submit to an API
    console.log('Submitting new loan:', newLoanData)
    setNewLoanDialogOpen(false)
  }

  return (
    <div>
      {/* Page Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold mb-2">
            Loan Portfolio
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage construction loans and servicing
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<i className="ri-add-line" />} onClick={handleNewLoan}>
          New Loan
        </Button>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Total Active Loans
              </Typography>
              <Typography variant="h4" className="font-bold">
                {activeLoans}
              </Typography>
              <Chip label="Servicing + Funded" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Total Portfolio Value
              </Typography>
              <Typography variant="h4" className="font-bold">
                {formatCurrency(totalPortfolio)}
              </Typography>
              <Chip label={`${MOCK_LOANS.length} Total Loans`} size="small" color="info" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Loans in Funding Pipeline
              </Typography>
              <Typography variant="h4" className="font-bold">
                {fundingPipeline}
              </Typography>
              <Chip label="Pending + Approved" size="small" color="warning" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Average Loan Size
              </Typography>
              <Typography variant="h4" className="font-bold">
                {formatCurrency(avgLoanSize)}
              </Typography>
              <Chip label="0 Defaults" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card className="mb-4">
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by loan number, address, or borrower..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="ri-search-line" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} label="Status">
                  <MenuItem value="All">All Statuses</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Funded">Funded</MenuItem>
                  <MenuItem value="Servicing">Servicing</MenuItem>
                  <MenuItem value="Paid Off">Paid Off</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box className="flex gap-2 justify-end">
                <Typography variant="body2" color="text.secondary" className="self-center">
                  Showing {filteredLoans.length} of {MOCK_LOANS.length} loans
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Loans Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Loan Number</TableCell>
                  <TableCell>Property Address</TableCell>
                  <TableCell>Borrower</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Loan Amount</TableCell>
                  <TableCell>Funded Date</TableCell>
                  <TableCell>Maturity Date</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLoans.map(loan => (
                  <TableRow
                    key={loan.loanNumber}
                    hover
                    className="cursor-pointer"
                    onClick={() => handleViewDetails(loan)}
                  >
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {loan.loanNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {loan.interestRate}% APR
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="max-w-[250px] truncate">
                        {loan.propertyAddress}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{loan.borrower}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {loan.borrowerContact}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={loan.status} size="small" color={getStatusColor(loan.status)} variant="tonal" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" className="font-bold">
                        {formatCurrency(loan.loanAmount)}
                      </Typography>
                      {loan.fundedAmount > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          {formatCurrency(loan.fundedAmount)} funded
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(loan.fundedDate)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(loan.maturityDate)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{loan.assignedTo}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={e => {
                          e.stopPropagation()
                          handleViewDetails(loan)
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
          {filteredLoans.length === 0 && (
            <Box className="text-center py-8">
              <Typography color="text.secondary">No loans found matching your filters</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Loan Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="lg" fullWidth>
        {selectedLoan && (
          <>
            <DialogTitle>
              <Box className="flex justify-between items-start">
                <Box>
                  <Typography variant="h5" className="font-bold">
                    {selectedLoan.loanNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="mt-1">
                    {selectedLoan.propertyAddress}
                  </Typography>
                </Box>
                <Box className="flex items-center gap-2">
                  <Chip label={selectedLoan.status} color={getStatusColor(selectedLoan.status)} variant="tonal" />
                  <IconButton onClick={() => setDetailDialogOpen(false)}>
                    <i className="ri-close-line" />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Tabs value={detailTab} onChange={(e, v) => setDetailTab(v)} className="mb-4">
                <Tab label="Overview" />
                <Tab label="Documents" />
                <Tab label="Draws" />
                <Tab label="Statements" />
                <Tab label="Activity" />
              </Tabs>

              {/* Overview Tab */}
              {detailTab === 0 && (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" className="font-semibold mb-3">
                          Borrower Information
                        </Typography>
                        <Box className="space-y-2">
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Company
                            </Typography>
                            <Typography variant="body1">{selectedLoan.borrower}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Contact
                            </Typography>
                            <Typography variant="body1">{selectedLoan.borrowerContact}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Guarantors
                            </Typography>
                            <Typography variant="body1">{selectedLoan.guarantors.join(', ')}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" className="font-semibold mb-3">
                          Loan Terms
                        </Typography>
                        <Box className="space-y-2">
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Loan Amount
                            </Typography>
                            <Typography variant="body1" className="font-bold">
                              {formatCurrency(selectedLoan.loanAmount)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Interest Rate
                            </Typography>
                            <Typography variant="body1">{selectedLoan.interestRate}% APR</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Term
                            </Typography>
                            <Typography variant="body1">{selectedLoan.term} months</Typography>
                          </Box>
                          <Box className="flex gap-4">
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Funded Date
                              </Typography>
                              <Typography variant="body1">{formatDate(selectedLoan.fundedDate)}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Maturity Date
                              </Typography>
                              <Typography variant="body1">{formatDate(selectedLoan.maturityDate)}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" className="font-semibold mb-3">
                          Property Details
                        </Typography>
                        <Box className="space-y-2">
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Address
                            </Typography>
                            <Typography variant="body1">{selectedLoan.propertyAddress}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Builder
                            </Typography>
                            <Typography variant="body1">{selectedLoan.builder}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Project ID
                            </Typography>
                            <Typography variant="body1">{selectedLoan.projectId}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" className="font-semibold mb-3">
                          Servicing
                        </Typography>
                        <Box className="space-y-2">
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Assigned To
                            </Typography>
                            <Typography variant="body1">{selectedLoan.assignedTo}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Funded Amount
                            </Typography>
                            <Typography variant="body1">{formatCurrency(selectedLoan.fundedAmount)}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Remaining to Fund
                            </Typography>
                            <Typography variant="body1">
                              {formatCurrency(selectedLoan.loanAmount - selectedLoan.fundedAmount)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {/* Documents Tab */}
              {detailTab === 1 && (
                <Box>
                  <Alert severity="info" className="mb-4">
                    Document management integration coming soon
                  </Alert>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Loan Agreement"
                        secondary="Signed on 2024-02-15 • PDF • 2.4 MB"
                      />
                      <IconButton>
                        <i className="ri-download-line" />
                      </IconButton>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Title Report"
                        secondary="Uploaded on 2024-02-10 • PDF • 1.8 MB"
                      />
                      <IconButton>
                        <i className="ri-download-line" />
                      </IconButton>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Insurance Certificate"
                        secondary="Uploaded on 2024-02-12 • PDF • 456 KB"
                      />
                      <IconButton>
                        <i className="ri-download-line" />
                      </IconButton>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Appraisal Report"
                        secondary="Uploaded on 2024-02-08 • PDF • 3.2 MB"
                      />
                      <IconButton>
                        <i className="ri-download-line" />
                      </IconButton>
                    </ListItem>
                  </List>
                </Box>
              )}

              {/* Draws Tab */}
              {detailTab === 2 && (
                <Box>
                  <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-semibold">
                      Draw History
                    </Typography>
                    <Button variant="contained" size="small" startIcon={<i className="ri-add-line" />}>
                      Create Draw Request
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Draw #</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Requested</TableCell>
                          <TableCell align="right">Approved</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Draw 5</TableCell>
                          <TableCell>Nov 1, 2024</TableCell>
                          <TableCell align="right">$450,000</TableCell>
                          <TableCell align="right">$450,000</TableCell>
                          <TableCell>
                            <Chip label="Funded" size="small" color="success" variant="tonal" />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Draw 4</TableCell>
                          <TableCell>Oct 1, 2024</TableCell>
                          <TableCell align="right">$520,000</TableCell>
                          <TableCell align="right">$520,000</TableCell>
                          <TableCell>
                            <Chip label="Funded" size="small" color="success" variant="tonal" />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Draw 3</TableCell>
                          <TableCell>Sep 1, 2024</TableCell>
                          <TableCell align="right">$680,000</TableCell>
                          <TableCell align="right">$680,000</TableCell>
                          <TableCell>
                            <Chip label="Funded" size="small" color="success" variant="tonal" />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Statements Tab */}
              {detailTab === 3 && (
                <Box>
                  <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-semibold">
                      Monthly Statements
                    </Typography>
                    <Button variant="contained" size="small" startIcon={<i className="ri-file-line" />}>
                      Generate Statement
                    </Button>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="October 2024 Statement"
                        secondary="Generated on Nov 1, 2024 • Balance: $2,800,000"
                      />
                      <IconButton>
                        <i className="ri-download-line" />
                      </IconButton>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="September 2024 Statement"
                        secondary="Generated on Oct 1, 2024 • Balance: $2,350,000"
                      />
                      <IconButton>
                        <i className="ri-download-line" />
                      </IconButton>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="August 2024 Statement"
                        secondary="Generated on Sep 1, 2024 • Balance: $1,830,000"
                      />
                      <IconButton>
                        <i className="ri-download-line" />
                      </IconButton>
                    </ListItem>
                  </List>
                </Box>
              )}

              {/* Activity Tab */}
              {detailTab === 4 && (
                <Box>
                  <Typography variant="h6" className="font-semibold mb-4">
                    Activity Timeline
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Draw 5 Funded"
                        secondary="Nov 1, 2024 • $450,000 disbursed by Sarah Johnson"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Draw 5 Approved"
                        secondary="Oct 30, 2024 • Inspection completed, draw approved"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Draw 5 Requested"
                        secondary="Oct 25, 2024 • $450,000 requested by ABC Development LLC"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Draw 4 Funded"
                        secondary="Oct 1, 2024 • $520,000 disbursed by Sarah Johnson"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText primary="Loan Funded" secondary="Feb 15, 2024 • Initial funding of $1,150,000" />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Loan Approved"
                        secondary="Feb 10, 2024 • Loan approved by underwriting"
                      />
                    </ListItem>
                  </List>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Box className="flex justify-between w-full px-2">
                <Box className="flex gap-2">
                  {selectedLoan.status === 'Approved' && (
                    <Button variant="contained" startIcon={<i className="ri-funds-line" />}>
                      Fund Loan
                    </Button>
                  )}
                  {(selectedLoan.status === 'Servicing' || selectedLoan.status === 'Funded') && (
                    <Button variant="contained" startIcon={<i className="ri-add-line" />}>
                      Create Draw Request
                    </Button>
                  )}
                  <Button variant="outlined" startIcon={<i className="ri-file-line" />}>
                    Generate Documents
                  </Button>
                  {selectedLoan.status === 'Servicing' && (
                    <Button variant="outlined" startIcon={<i className="ri-calculator-line" />}>
                      Generate Payoff Quote
                    </Button>
                  )}
                </Box>
                <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Loan Dialog */}
      <Dialog open={newLoanDialogOpen} onClose={() => setNewLoanDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" className="font-bold">
            Create New Loan
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Property Address"
                value={newLoanData.propertyAddress}
                onChange={e => setNewLoanData({ ...newLoanData, propertyAddress: e.target.value })}
                placeholder="Enter property address"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={MOCK_CONTACTS}
                getOptionLabel={option => `${option.name} - ${option.company}`}
                value={newLoanData.borrower}
                onChange={(e, value) => setNewLoanData({ ...newLoanData, borrower: value })}
                renderInput={params => <TextField {...params} label="Borrower" placeholder="Search contacts..." />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Loan Amount"
                type="number"
                value={newLoanData.loanAmount}
                onChange={e => setNewLoanData({ ...newLoanData, loanAmount: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Interest Rate"
                type="number"
                value={newLoanData.interestRate}
                onChange={e => setNewLoanData({ ...newLoanData, interestRate: e.target.value })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Term"
                type="number"
                value={newLoanData.term}
                onChange={e => setNewLoanData({ ...newLoanData, term: e.target.value })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">months</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Closing Date"
                type="date"
                value={newLoanData.closingDate}
                onChange={e => setNewLoanData({ ...newLoanData, closingDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={MOCK_CONTACTS}
                getOptionLabel={option => `${option.name} - ${option.company}`}
                value={newLoanData.guarantors}
                onChange={(e, value) => setNewLoanData({ ...newLoanData, guarantors: value })}
                renderInput={params => <TextField {...params} label="Guarantors" placeholder="Add guarantors..." />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={newLoanData.assignedTo}
                  onChange={e => setNewLoanData({ ...newLoanData, assignedTo: e.target.value })}
                  label="Assign To"
                >
                  {TEAM_MEMBERS.map(member => (
                    <MenuItem key={member} value={member}>
                      {member}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Builder"
                value={newLoanData.builder}
                onChange={e => setNewLoanData({ ...newLoanData, builder: e.target.value })}
                placeholder="Enter builder name"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewLoanDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitNewLoan}>
            Create Loan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
