'use client'

import { useState } from 'react'

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  ImageList,
  ImageListItem,
  Divider,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material'

// Mock data for draw sets
const mockDrawSets = [
  {
    id: 'DS-2024-11',
    month: 'November',
    year: '2024',
    totalDraws: 23,
    totalRequested: '$8,450,000',
    status: 'Under Review',
    createdDate: '2024-11-01'
  },
  {
    id: 'DS-2024-10',
    month: 'October',
    year: '2024',
    totalDraws: 28,
    totalRequested: '$9,200,000',
    status: 'Paid',
    createdDate: '2024-10-01'
  }
]

// Mock data for draws
const mockDraws = [
  {
    id: 'DR-2024-045',
    loanNumber: '4523',
    propertyAddress: '1234 Greenwood Ave N, Seattle, WA 98103',
    builder: 'ABC Development LLC',
    drawNumber: 4,
    requestedAmount: 425000,
    inspectionDate: '2024-11-25',
    inspectionStatus: 'Complete',
    inspector: 'John Smith',
    completionPercent: 67,
    status: 'Under Review',
    submissionDate: '2024-11-24',
    approvedAmount: null,
    photos: [
      { url: '/images/inspection/photo1.jpg', caption: 'Foundation complete' },
      { url: '/images/inspection/photo2.jpg', caption: 'Framing progress' },
      { url: '/images/inspection/photo3.jpg', caption: 'Electrical rough-in' },
      { url: '/images/inspection/photo4.jpg', caption: 'Plumbing systems' }
    ],
    inspectorNotes: 'Foundation and framing meet specifications. Electrical and plumbing rough-in complete. Ready for drywall installation.',
    conditions: {
      creditReport: { status: 'pass', detail: 'Current as of 11/20/2024', lastChecked: '11/20/2024' },
      insurance: { status: 'pass', detail: 'Valid until 03/15/2025', expiryDate: '03/15/2025' },
      lienWaivers: { status: 'fail', detail: 'Missing waiver from electrical subcontractor', missing: 'Electrical sub' },
      previousDraw: { status: 'pass', detail: 'Draw #3 fully disbursed', drawNumber: 3 }
    },
    servicingNotes: '',
    holdReason: '',
    daysInQueue: 2
  },
  {
    id: 'DR-2024-044',
    loanNumber: '4521',
    propertyAddress: '5678 Madison Park Blvd, Seattle, WA 98112',
    builder: 'Park Dev Partners',
    drawNumber: 6,
    requestedAmount: 380000,
    inspectionDate: '2024-11-23',
    inspectionStatus: 'Complete',
    inspector: 'Sarah Lee',
    completionPercent: 83,
    status: 'Approved',
    submissionDate: '2024-11-22',
    approvedAmount: 380000,
    photos: [
      { url: '/images/inspection/photo5.jpg', caption: 'Interior finishes' },
      { url: '/images/inspection/photo6.jpg', caption: 'Kitchen installation' },
      { url: '/images/inspection/photo7.jpg', caption: 'Bathroom complete' }
    ],
    inspectorNotes: 'All interior finishes complete. Kitchen and bathrooms installed per plans. Minor punch list items noted.',
    conditions: {
      creditReport: { status: 'pass', detail: 'Current as of 11/18/2024', lastChecked: '11/18/2024' },
      insurance: { status: 'pass', detail: 'Valid until 06/30/2025', expiryDate: '06/30/2025' },
      lienWaivers: { status: 'pass', detail: 'All waivers received', missing: null },
      previousDraw: { status: 'pass', detail: 'Draw #5 fully disbursed', drawNumber: 5 }
    },
    servicingNotes: 'All conditions met. Approved for full requested amount.',
    holdReason: '',
    daysInQueue: 4
  },
  {
    id: 'DR-2024-043',
    loanNumber: '4519',
    propertyAddress: '910 Capitol Hill St E, Seattle, WA 98102',
    builder: 'Hill Properties LLC',
    drawNumber: 2,
    requestedAmount: 525000,
    inspectionDate: '2024-11-26',
    inspectionStatus: 'Scheduled',
    inspector: 'Mike Chen',
    completionPercent: 24,
    status: 'Pending Inspection',
    submissionDate: '2024-11-25',
    approvedAmount: null,
    photos: [],
    inspectorNotes: '',
    conditions: {
      creditReport: { status: 'pass', detail: 'Current as of 11/22/2024', lastChecked: '11/22/2024' },
      insurance: { status: 'fail', detail: 'Insurance expired 11/15/2024', expiryDate: '11/15/2024' },
      lienWaivers: { status: 'fail', detail: 'No waivers submitted yet', missing: 'All subs' },
      previousDraw: { status: 'pass', detail: 'Draw #1 fully disbursed', drawNumber: 1 }
    },
    servicingNotes: '',
    holdReason: '',
    daysInQueue: 1
  },
  {
    id: 'DR-2024-042',
    loanNumber: '4523',
    propertyAddress: '1234 Greenwood Ave N, Seattle, WA 98103',
    builder: 'ABC Development LLC',
    drawNumber: 3,
    requestedAmount: 395000,
    inspectionDate: '2024-11-15',
    inspectionStatus: 'Complete',
    inspector: 'John Smith',
    completionPercent: 52,
    status: 'Paid',
    submissionDate: '2024-11-14',
    approvedAmount: 395000,
    photos: [
      { url: '/images/inspection/photo8.jpg', caption: 'Foundation inspection' },
      { url: '/images/inspection/photo9.jpg', caption: 'Slab complete' }
    ],
    inspectorNotes: 'Foundation and slab meet all specifications. Ready for framing.',
    conditions: {
      creditReport: { status: 'pass', detail: 'Current as of 11/12/2024', lastChecked: '11/12/2024' },
      insurance: { status: 'pass', detail: 'Valid until 03/15/2025', expiryDate: '03/15/2025' },
      lienWaivers: { status: 'pass', detail: 'All waivers received', missing: null },
      previousDraw: { status: 'pass', detail: 'Draw #2 fully disbursed', drawNumber: 2 }
    },
    servicingNotes: 'Approved and funded on 11/16/2024',
    holdReason: '',
    daysInQueue: 0
  },
  {
    id: 'DR-2024-041',
    loanNumber: '4518',
    propertyAddress: '2468 Ballard Ave NW, Seattle, WA 98107',
    builder: 'Coastal Builders Inc',
    drawNumber: 5,
    requestedAmount: 450000,
    inspectionDate: '2024-11-24',
    inspectionStatus: 'Complete',
    inspector: 'Sarah Lee',
    completionPercent: 71,
    status: 'Held',
    submissionDate: '2024-11-23',
    approvedAmount: null,
    photos: [
      { url: '/images/inspection/photo10.jpg', caption: 'Exterior work' },
      { url: '/images/inspection/photo11.jpg', caption: 'Roofing complete' }
    ],
    inspectorNotes: 'Roofing and exterior work complete. Some delay on HVAC installation.',
    conditions: {
      creditReport: { status: 'fail', detail: 'Credit report from 08/15/2024 - needs update', lastChecked: '08/15/2024' },
      insurance: { status: 'pass', detail: 'Valid until 12/31/2024', expiryDate: '12/31/2024' },
      lienWaivers: { status: 'pass', detail: 'All waivers received', missing: null },
      previousDraw: { status: 'fail', detail: 'Draw #4 has pending reconciliation', drawNumber: 4 }
    },
    servicingNotes: 'On hold pending updated credit report and resolution of Draw #4 reconciliation.',
    holdReason: 'Stale credit report and previous draw reconciliation required',
    daysInQueue: 3
  },
  {
    id: 'DR-2024-040',
    loanNumber: '4517',
    propertyAddress: '1357 Fremont Ave N, Seattle, WA 98103',
    builder: 'Urban Nest Development',
    drawNumber: 7,
    requestedAmount: 290000,
    inspectionDate: '2024-11-20',
    inspectionStatus: 'Complete',
    inspector: 'Mike Chen',
    completionPercent: 89,
    status: 'Approved',
    submissionDate: '2024-11-19',
    approvedAmount: 290000,
    photos: [
      { url: '/images/inspection/photo12.jpg', caption: 'Final finishes' },
      { url: '/images/inspection/photo13.jpg', caption: 'Landscaping' }
    ],
    inspectorNotes: 'Nearly complete. Final landscaping and exterior painting in progress.',
    conditions: {
      creditReport: { status: 'pass', detail: 'Current as of 11/15/2024', lastChecked: '11/15/2024' },
      insurance: { status: 'pass', detail: 'Valid until 05/01/2025', expiryDate: '05/01/2025' },
      lienWaivers: { status: 'pass', detail: 'All waivers received', missing: null },
      previousDraw: { status: 'pass', detail: 'Draw #6 fully disbursed', drawNumber: 6 }
    },
    servicingNotes: 'All conditions satisfied. Approved for funding.',
    holdReason: '',
    daysInQueue: 6
  },
  {
    id: 'DR-2024-039',
    loanNumber: '4520',
    propertyAddress: '7890 Queen Anne Ave N, Seattle, WA 98109',
    builder: 'Summit Construction LLC',
    drawNumber: 3,
    requestedAmount: 510000,
    inspectionDate: '2024-11-27',
    inspectionStatus: 'Scheduled',
    inspector: 'John Smith',
    completionPercent: 41,
    status: 'Pending Inspection',
    submissionDate: '2024-11-26',
    approvedAmount: null,
    photos: [],
    inspectorNotes: '',
    conditions: {
      creditReport: { status: 'pass', detail: 'Current as of 11/23/2024', lastChecked: '11/23/2024' },
      insurance: { status: 'pass', detail: 'Valid until 08/15/2025', expiryDate: '08/15/2025' },
      lienWaivers: { status: 'pass', detail: 'All waivers received', missing: null },
      previousDraw: { status: 'pass', detail: 'Draw #2 fully disbursed', drawNumber: 2 }
    },
    servicingNotes: '',
    holdReason: '',
    daysInQueue: 0
  },
  {
    id: 'DR-2024-038',
    loanNumber: '4516',
    propertyAddress: '3690 Wallingford Ave N, Seattle, WA 98103',
    builder: 'Green Valley Homes',
    drawNumber: 8,
    requestedAmount: 195000,
    inspectionDate: '2024-11-21',
    inspectionStatus: 'Complete',
    inspector: 'Sarah Lee',
    completionPercent: 95,
    status: 'Paid',
    submissionDate: '2024-11-20',
    approvedAmount: 195000,
    photos: [
      { url: '/images/inspection/photo14.jpg', caption: 'Final walkthrough' },
      { url: '/images/inspection/photo15.jpg', caption: 'Certificate of occupancy' }
    ],
    inspectorNotes: 'Project substantially complete. Certificate of occupancy received.',
    conditions: {
      creditReport: { status: 'pass', detail: 'Current as of 11/18/2024', lastChecked: '11/18/2024' },
      insurance: { status: 'pass', detail: 'Valid until 07/30/2025', expiryDate: '07/30/2025' },
      lienWaivers: { status: 'pass', detail: 'All waivers received', missing: null },
      previousDraw: { status: 'pass', detail: 'Draw #7 fully disbursed', drawNumber: 7 }
    },
    servicingNotes: 'Final draw approved and funded on 11/22/2024',
    holdReason: '',
    daysInQueue: 0
  }
]

export default function DrawsPage() {
  const [selectedDraw, setSelectedDraw] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [approvedAmount, setApprovedAmount] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')
  const [holdReason, setHoldReason] = useState('')

  // Calculate summary stats
  const stats = {
    drawsThisMonth: mockDraws.filter(d => d.submissionDate.startsWith('2024-11')).length,
    totalApproved: mockDraws
      .filter(d => d.status === 'Approved' || d.status === 'Paid')
      .reduce((sum, d) => sum + (d.approvedAmount || 0), 0),
    avgApprovalTime: 3.2,
    drawsOnHold: mockDraws.filter(d => d.status === 'Held').length
  }

  // Filter draws based on status
  const filteredDraws = filterStatus === 'All'
    ? mockDraws
    : mockDraws.filter(d => d.status === filterStatus)

  const getStatusColor = status => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'Under Review':
        return 'warning'
      case 'Pending Inspection':
        return 'info'
      case 'Paid':
        return 'success'
      case 'Held':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleDrawClick = (draw) => {
    setSelectedDraw(draw)
    setApprovedAmount(draw.approvedAmount || draw.requestedAmount)
    setReviewNotes(draw.servicingNotes)
    setHoldReason(draw.holdReason)
    setReviewDialogOpen(true)
  }

  const handleApprove = () => {
    console.log('Approving draw:', selectedDraw.id, 'Amount:', approvedAmount)
    setReviewDialogOpen(false)
  }

  const handleHold = () => {
    console.log('Holding draw:', selectedDraw.id, 'Reason:', holdReason)
    setReviewDialogOpen(false)
  }

  const handleRequestInfo = () => {
    console.log('Requesting additional info for draw:', selectedDraw.id)
    setReviewDialogOpen(false)
  }

  return (
    <div>
      {/* Page Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold mb-2">
            Draw Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and process construction draw requests
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<i className="ri-add-line" />}>
          Create New Draw Set
        </Button>
      </Box>

      {/* Current Draw Set Header */}
      <Card className="mb-6">
        <CardContent>
          <Box className="flex justify-between items-start">
            <Box>
              <Typography variant="h6" className="font-semibold mb-1">
                {mockDrawSets[0].month} {mockDrawSets[0].year} Draw Set
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-3">
                ID: {mockDrawSets[0].id} • Created: {mockDrawSets[0].createdDate}
              </Typography>
              <Box className="flex gap-4">
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Draws</Typography>
                  <Typography variant="h6" className="font-bold">{mockDrawSets[0].totalDraws}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Requested</Typography>
                  <Typography variant="h6" className="font-bold">{mockDrawSets[0].totalRequested}</Typography>
                </Box>
              </Box>
            </Box>
            <Chip
              label={mockDrawSets[0].status}
              color={getStatusColor(mockDrawSets[0].status)}
              variant="tonal"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Draws This Month
              </Typography>
              <Typography variant="h4" className="font-bold">
                {stats.drawsThisMonth}
              </Typography>
              <Chip label="November 2024" size="small" color="info" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Total Amount Approved
              </Typography>
              <Typography variant="h4" className="font-bold">
                {formatCurrency(stats.totalApproved)}
              </Typography>
              <Chip label="Approved + Paid" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Average Approval Time
              </Typography>
              <Typography variant="h4" className="font-bold">
                {stats.avgApprovalTime} days
              </Typography>
              <Chip label="Target: 5 days" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Draws on Hold
              </Typography>
              <Typography variant="h4" className="font-bold">
                {stats.drawsOnHold}
              </Typography>
              <Chip label="Needs attention" size="small" color="error" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs */}
      <Card className="mb-4">
        <CardContent>
          <Tabs
            value={filterStatus}
            onChange={(e, newValue) => setFilterStatus(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All" value="All" />
            <Tab label="Pending Inspection" value="Pending Inspection" />
            <Tab label="Under Review" value="Under Review" />
            <Tab label="Approved" value="Approved" />
            <Tab label="Held" value="Held" />
            <Tab label="Paid" value="Paid" />
          </Tabs>
        </CardContent>
      </Card>

      {/* Draw List Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-4">
            Draw Requests ({filteredDraws.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Loan Number</TableCell>
                  <TableCell>Property Address</TableCell>
                  <TableCell>Builder</TableCell>
                  <TableCell>Draw #</TableCell>
                  <TableCell>Requested Amount</TableCell>
                  <TableCell>Inspection Date</TableCell>
                  <TableCell>Inspection Status</TableCell>
                  <TableCell>Conditions Met</TableCell>
                  <TableCell>Approved Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDraws.map(draw => {
                  const conditionsPassed = Object.values(draw.conditions).filter(c => c.status === 'pass').length
                  const totalConditions = Object.values(draw.conditions).length

                  return (
                    <TableRow
                      key={draw.id}
                      hover
                      onClick={() => handleDrawClick(draw)}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <Typography variant="body2" className="font-medium">
                          {draw.loanNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {draw.propertyAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {draw.builder}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="font-medium">
                          {draw.drawNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="font-bold">
                          {formatCurrency(draw.requestedAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {draw.inspectionDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={draw.inspectionStatus}
                          size="small"
                          color={draw.inspectionStatus === 'Complete' ? 'success' : 'info'}
                          variant="tonal"
                        />
                      </TableCell>
                      <TableCell>
                        <Box className="flex items-center gap-2">
                          <Typography variant="body2" className={conditionsPassed === totalConditions ? 'text-success' : 'text-warning'}>
                            {conditionsPassed}/{totalConditions}
                          </Typography>
                          {conditionsPassed === totalConditions ? (
                            <i className="ri-checkbox-circle-fill text-success" />
                          ) : (
                            <i className="ri-error-warning-fill text-warning" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="font-medium">
                          {draw.approvedAmount ? formatCurrency(draw.approvedAmount) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={draw.status}
                          size="small"
                          color={getStatusColor(draw.status)}
                          variant="tonal"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDrawClick(draw)
                          }}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Draw Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        {selectedDraw && (
          <>
            <DialogTitle>
              <Box className="flex justify-between items-start">
                <Box>
                  <Typography variant="h5" className="font-bold">
                    Draw Review - {selectedDraw.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Loan #{selectedDraw.loanNumber} • Draw #{selectedDraw.drawNumber}
                  </Typography>
                </Box>
                <Chip
                  label={selectedDraw.status}
                  color={getStatusColor(selectedDraw.status)}
                  variant="tonal"
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              {/* Draw Information */}
              <Card className="mb-4">
                <CardContent>
                  <Typography variant="h6" className="font-semibold mb-3">
                    Draw Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">Property Address</Typography>
                      <Typography variant="body1" className="font-medium">{selectedDraw.propertyAddress}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">Builder</Typography>
                      <Typography variant="body1" className="font-medium">{selectedDraw.builder}</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" color="text.secondary">Draw Number</Typography>
                      <Typography variant="body1" className="font-medium">#{selectedDraw.drawNumber}</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" color="text.secondary">Requested Amount</Typography>
                      <Typography variant="body1" className="font-bold">{formatCurrency(selectedDraw.requestedAmount)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" color="text.secondary">Submission Date</Typography>
                      <Typography variant="body1">{selectedDraw.submissionDate}</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" color="text.secondary">Completion</Typography>
                      <Box className="flex items-center gap-2">
                        <LinearProgress
                          variant="determinate"
                          value={selectedDraw.completionPercent}
                          className="flex-1"
                          color={selectedDraw.completionPercent >= 80 ? 'success' : selectedDraw.completionPercent >= 50 ? 'info' : 'warning'}
                        />
                        <Typography variant="body2" className="font-medium">{selectedDraw.completionPercent}%</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Inspection Results */}
              {selectedDraw.inspectionStatus === 'Complete' && (
                <Card className="mb-4">
                  <CardContent>
                    <Typography variant="h6" className="font-semibold mb-3">
                      Inspection Results
                    </Typography>
                    <Grid container spacing={3} className="mb-3">
                      <Grid item xs={12} md={4}>
                        <Typography variant="caption" color="text.secondary">Inspection Date</Typography>
                        <Typography variant="body1" className="font-medium">{selectedDraw.inspectionDate}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="caption" color="text.secondary">Inspector</Typography>
                        <Box className="flex items-center gap-2">
                          <Avatar className="w-8 h-8 text-xs">
                            {selectedDraw.inspector.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Typography variant="body1">{selectedDraw.inspector}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="caption" color="text.secondary">Completion Percentage</Typography>
                        <Typography variant="body1" className="font-bold">{selectedDraw.completionPercent}%</Typography>
                      </Grid>
                    </Grid>

                    {selectedDraw.inspectorNotes && (
                      <Box className="mb-3">
                        <Typography variant="caption" color="text.secondary">Inspector Notes</Typography>
                        <Typography variant="body2" className="mt-1">{selectedDraw.inspectorNotes}</Typography>
                      </Box>
                    )}

                    {selectedDraw.photos.length > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" className="mb-2 block">
                          Inspection Photos ({selectedDraw.photos.length})
                        </Typography>
                        <ImageList cols={4} gap={8}>
                          {selectedDraw.photos.map((photo, idx) => (
                            <ImageListItem key={idx}>
                              <Box
                                className="bg-gray-200 h-24 flex items-center justify-center rounded"
                                title={photo.caption}
                              >
                                <i className="ri-image-line text-4xl text-gray-400" />
                              </Box>
                              <Typography variant="caption" color="text.secondary" className="mt-1 block text-center">
                                {photo.caption}
                              </Typography>
                            </ImageListItem>
                          ))}
                        </ImageList>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Automated Condition Checks */}
              <Card className="mb-4">
                <CardContent>
                  <Typography variant="h6" className="font-semibold mb-3">
                    Automated Condition Checks
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Credit Report */}
                    <Grid item xs={12} md={6}>
                      <Alert
                        severity={selectedDraw.conditions.creditReport.status === 'pass' ? 'success' : 'error'}
                        icon={selectedDraw.conditions.creditReport.status === 'pass' ?
                          <i className="ri-checkbox-circle-line" /> :
                          <i className="ri-close-circle-line" />
                        }
                      >
                        <Typography variant="body2" className="font-semibold">
                          Credit Report Status
                        </Typography>
                        <Typography variant="caption">
                          {selectedDraw.conditions.creditReport.detail}
                        </Typography>
                      </Alert>
                    </Grid>

                    {/* Insurance Status */}
                    <Grid item xs={12} md={6}>
                      <Alert
                        severity={selectedDraw.conditions.insurance.status === 'pass' ? 'success' : 'error'}
                        icon={selectedDraw.conditions.insurance.status === 'pass' ?
                          <i className="ri-checkbox-circle-line" /> :
                          <i className="ri-close-circle-line" />
                        }
                      >
                        <Typography variant="body2" className="font-semibold">
                          Insurance Status
                        </Typography>
                        <Typography variant="caption">
                          {selectedDraw.conditions.insurance.detail}
                        </Typography>
                      </Alert>
                    </Grid>

                    {/* Lien Waivers */}
                    <Grid item xs={12} md={6}>
                      <Alert
                        severity={selectedDraw.conditions.lienWaivers.status === 'pass' ? 'success' : 'error'}
                        icon={selectedDraw.conditions.lienWaivers.status === 'pass' ?
                          <i className="ri-checkbox-circle-line" /> :
                          <i className="ri-close-circle-line" />
                        }
                      >
                        <Typography variant="body2" className="font-semibold">
                          Lien Waivers
                        </Typography>
                        <Typography variant="caption">
                          {selectedDraw.conditions.lienWaivers.detail}
                        </Typography>
                      </Alert>
                    </Grid>

                    {/* Previous Draw Status */}
                    <Grid item xs={12} md={6}>
                      <Alert
                        severity={selectedDraw.conditions.previousDraw.status === 'pass' ? 'success' : 'error'}
                        icon={selectedDraw.conditions.previousDraw.status === 'pass' ?
                          <i className="ri-checkbox-circle-line" /> :
                          <i className="ri-close-circle-line" />
                        }
                      >
                        <Typography variant="body2" className="font-semibold">
                          Previous Draw Status
                        </Typography>
                        <Typography variant="caption">
                          {selectedDraw.conditions.previousDraw.detail}
                        </Typography>
                      </Alert>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Manual Review */}
              <Card>
                <CardContent>
                  <Typography variant="h6" className="font-semibold mb-3">
                    Manual Review
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Servicing Associate Notes"
                        multiline
                        rows={3}
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Add notes about this draw review..."
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Approved Amount"
                        type="number"
                        value={approvedAmount}
                        onChange={(e) => setApprovedAmount(e.target.value)}
                        helperText={`Requested: ${formatCurrency(selectedDraw.requestedAmount)}`}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Hold Reason (if applicable)"
                        value={holdReason}
                        onChange={(e) => setHoldReason(e.target.value)}
                        placeholder="Reason for holding this draw..."
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContent>
            <DialogActions className="p-4">
              <Button onClick={() => setReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                color="info"
                onClick={handleRequestInfo}
                startIcon={<i className="ri-question-line" />}
              >
                Request Additional Info
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleHold}
                startIcon={<i className="ri-pause-circle-line" />}
              >
                Hold Draw
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleApprove}
                startIcon={<i className="ri-checkbox-circle-line" />}
              >
                Approve Draw
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  )
}
