'use client'

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
  LinearProgress
} from '@mui/material'

export default function DrawsPage() {
  const drawRequests = [
    {
      id: 'DR-2024-045',
      loanNumber: '4523',
      projectName: 'Greenwood Estates',
      borrower: 'ABC Development LLC',
      requestedAmount: '$425,000',
      inspectionDate: '11/25/2024',
      inspector: 'John Smith',
      completionPercent: 67,
      status: 'Under Review',
      daysInQueue: 2,
      conditions: [
        { item: 'Updated Insurance', status: 'Complete' },
        { item: 'Lien Waivers', status: 'Pending' },
        { item: 'Credit Report', status: 'Complete' }
      ]
    },
    {
      id: 'DR-2024-044',
      loanNumber: '4521',
      projectName: 'Madison Park Homes',
      borrower: 'Park Dev Partners',
      requestedAmount: '$380,000',
      inspectionDate: '11/23/2024',
      inspector: 'Sarah Lee',
      completionPercent: 83,
      status: 'Approved',
      daysInQueue: 4,
      conditions: [
        { item: 'Updated Insurance', status: 'Complete' },
        { item: 'Lien Waivers', status: 'Complete' },
        { item: 'Credit Report', status: 'Complete' }
      ]
    },
    {
      id: 'DR-2024-043',
      loanNumber: '4519',
      projectName: 'Capitol Hill Residences',
      borrower: 'Hill Properties LLC',
      requestedAmount: '$525,000',
      inspectionDate: '11/26/2024',
      inspector: 'Mike Chen',
      completionPercent: 24,
      status: 'Inspection Scheduled',
      daysInQueue: 1,
      conditions: [
        { item: 'Updated Insurance', status: 'Pending' },
        { item: 'Lien Waivers', status: 'Pending' },
        { item: 'Credit Report', status: 'Complete' }
      ]
    },
    {
      id: 'DR-2024-042',
      loanNumber: '4523',
      projectName: 'Greenwood Estates',
      borrower: 'ABC Development LLC',
      requestedAmount: '$395,000',
      inspectionDate: '11/15/2024',
      inspector: 'John Smith',
      completionPercent: 52,
      status: 'Funded',
      daysInQueue: 0,
      conditions: [
        { item: 'Updated Insurance', status: 'Complete' },
        { item: 'Lien Waivers', status: 'Complete' },
        { item: 'Credit Report', status: 'Complete' }
      ]
    }
  ]

  const getStatusColor = status => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'Under Review':
        return 'warning'
      case 'Inspection Scheduled':
        return 'info'
      case 'Funded':
        return 'success'
      case 'On Hold':
        return 'error'
      default:
        return 'default'
    }
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
          Create Draw Set
        </Button>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Pending Review
              </Typography>
              <Typography variant="h4" className="font-bold">
                18
              </Typography>
              <Chip label="$12.4M requested" size="small" color="warning" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Approved
              </Typography>
              <Typography variant="h4" className="font-bold">
                5
              </Typography>
              <Chip label="Ready for funding" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Avg Turnaround
              </Typography>
              <Typography variant="h4" className="font-bold">
                3.2 days
              </Typography>
              <Chip label="Target: 5 days" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                This Month
              </Typography>
              <Typography variant="h4" className="font-bold">
                $24.8M
              </Typography>
              <Chip label="64 draws funded" size="small" color="info" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Draw Requests Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-4">
            Recent Draw Requests
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Draw ID</TableCell>
                  <TableCell>Project / Loan</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Completion</TableCell>
                  <TableCell>Inspector</TableCell>
                  <TableCell>Conditions</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {drawRequests.map(draw => (
                  <TableRow key={draw.id} hover>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {draw.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Loan #{draw.loanNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {draw.projectName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {draw.borrower}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="font-bold">
                        {draw.requestedAmount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {draw.completionPercent}% complete
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className="min-w-[100px]">
                        <LinearProgress
                          variant="determinate"
                          value={draw.completionPercent}
                          className="h-2 rounded mb-1"
                          color={draw.completionPercent >= 80 ? 'success' : draw.completionPercent >= 50 ? 'info' : 'warning'}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {draw.completionPercent}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 text-xs">{draw.inspector.split(' ').map(n => n[0]).join('')}</Avatar>
                        <Box>
                          <Typography variant="body2">{draw.inspector}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {draw.inspectionDate}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1">
                        {draw.conditions.map((cond, idx) => (
                          <Chip
                            key={idx}
                            label={cond.status === 'Complete' ? '✓' : '•'}
                            size="small"
                            color={cond.status === 'Complete' ? 'success' : 'default'}
                            variant="tonal"
                            title={`${cond.item}: ${cond.status}`}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={draw.status} size="small" color={getStatusColor(draw.status)} variant="tonal" />
                      {draw.daysInQueue > 0 && (
                        <Typography variant="caption" color="text.secondary" className="block mt-1">
                          {draw.daysInQueue} days in queue
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" size="small">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  )
}
