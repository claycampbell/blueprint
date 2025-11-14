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
  LinearProgress,
  Avatar
} from '@mui/material'

export default function EntitlementPage() {
  const projects = [
    {
      id: 1,
      name: 'Park Place Development',
      location: 'Seattle, WA',
      permitType: 'Subdivision',
      status: 'Under Review',
      submitDate: '2024-10-15',
      reviewCycle: 2,
      daysInReview: 45,
      targetDays: 90,
      coordinator: 'Alice Kim',
      nextAction: 'City feedback expected',
      actionDue: '3 days'
    },
    {
      id: 2,
      name: 'Greenwood Estates',
      location: 'Bellevue, WA',
      permitType: 'Site Plan',
      status: 'Approved',
      submitDate: '2024-09-01',
      reviewCycle: 1,
      daysInReview: 62,
      targetDays: 90,
      coordinator: 'Tom Li',
      nextAction: 'Issue permits',
      actionDue: 'Today'
    },
    {
      id: 3,
      name: 'Madison Park Homes',
      location: 'Seattle, WA',
      permitType: 'Rezone',
      status: 'Corrections Required',
      submitDate: '2024-10-01',
      reviewCycle: 1,
      daysInReview: 28,
      targetDays: 120,
      coordinator: 'Alice Kim',
      nextAction: 'Submit corrections',
      actionDue: '5 days'
    }
  ]

  const getStatusColor = status => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'Under Review':
        return 'info'
      case 'Corrections Required':
        return 'warning'
      case 'Submitted':
        return 'default'
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
            Entitlement Status Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track permit applications and municipal review processes
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<i className="ri-add-line" />}>
          New Submittal
        </Button>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" className="mb-1">
                    Active Projects
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    15
                  </Typography>
                </Box>
                <Box className="p-3 rounded bg-primary/10">
                  <i className="ri-government-line text-2xl text-primary" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" className="mb-1">
                    Under Review
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    8
                  </Typography>
                </Box>
                <Box className="p-3 rounded bg-info/10">
                  <i className="ri-search-line text-2xl text-info" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" className="mb-1">
                    Avg Approval Time
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    78 days
                  </Typography>
                </Box>
                <Box className="p-3 rounded bg-success/10">
                  <i className="ri-time-line text-2xl text-success" />
                </Box>
              </Box>
              <Chip label="Target: 90 days" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" className="mb-1">
                    Overdue Actions
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    2
                  </Typography>
                </Box>
                <Box className="p-3 rounded bg-error/10">
                  <i className="ri-alert-line text-2xl text-error" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Projects Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-4">
            Active Entitlement Projects
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Permit Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Coordinator</TableCell>
                  <TableCell>Next Action</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map(project => (
                  <TableRow key={project.id} hover>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {project.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {project.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={project.permitType} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip label={project.status} size="small" color={getStatusColor(project.status)} variant="tonal" />
                      <Typography variant="caption" color="text.secondary" className="block mt-1">
                        Cycle {project.reviewCycle}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className="min-w-[120px]">
                        <Box className="flex items-center gap-2 mb-1">
                          <Typography variant="caption" color="text.secondary">
                            {project.daysInReview} / {project.targetDays} days
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(project.daysInReview / project.targetDays) * 100}
                          className="h-1 rounded"
                          color={project.daysInReview < project.targetDays * 0.8 ? 'success' : 'warning'}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 text-xs">{project.coordinator.split(' ').map(n => n[0]).join('')}</Avatar>
                        <Typography variant="body2">{project.coordinator}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {project.nextAction}
                      </Typography>
                      <Typography variant="caption" color={project.actionDue === 'Today' ? 'error' : 'text.secondary'}>
                        Due: {project.actionDue}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" size="small">
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
    </div>
  )
}
