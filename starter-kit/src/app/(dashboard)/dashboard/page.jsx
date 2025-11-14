'use client'

import { Card, CardContent, Grid, Typography, Box, Chip, LinearProgress } from '@mui/material'

export default function DashboardPage() {
  const kpis = [
    { title: 'Active Leads', value: '47', change: '+12%', trend: 'up', icon: 'ri-file-add-line', color: 'primary' },
    { title: 'Feasibility Projects', value: '23', change: '+5%', trend: 'up', icon: 'ri-search-line', color: 'success' },
    { title: 'Active Loans', value: '$142M', change: '+8%', trend: 'up', icon: 'ri-money-dollar-circle-line', color: 'warning' },
    { title: 'Pending Draws', value: '18', change: '-3%', trend: 'down', icon: 'ri-refresh-line', color: 'info' }
  ]

  const recentActivity = [
    { id: 1, type: 'lead', title: '1234 Maple Street, Seattle', status: 'In Review', time: '15 min ago' },
    { id: 2, type: 'feasibility', title: 'Park Place Development', status: 'Due Diligence', time: '1 hour ago' },
    { id: 3, type: 'loan', title: 'Greenwood Estates Loan #4523', status: 'Funded', time: '3 hours ago' },
    { id: 4, type: 'draw', title: 'Draw Request - Madison Park', status: 'Approved', time: '5 hours ago' }
  ]

  const pipelineData = [
    { stage: 'Leads', count: 47, total: 100 },
    { stage: 'Feasibility', count: 23, total: 47 },
    { stage: 'Entitlement', count: 15, total: 23 },
    { stage: 'Funded', count: 12, total: 15 }
  ]

  return (
    <div>
      {/* Page Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold mb-2">
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's what's happening with your projects today.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={4} className="mb-6">
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box className="flex justify-between items-start mb-2">
                  <Box>
                    <Typography variant="body2" color="text.secondary" className="mb-1">
                      {kpi.title}
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {kpi.value}
                    </Typography>
                  </Box>
                  <Box
                    className={`p-2 rounded bg-${kpi.color}/10`}
                    sx={{ backgroundColor: `var(--mui-palette-${kpi.color}-lightOpacity)` }}
                  >
                    <i className={`${kpi.icon} text-2xl text-${kpi.color}`} />
                  </Box>
                </Box>
                <Box className="flex items-center gap-2">
                  <Chip
                    label={kpi.change}
                    size="small"
                    color={kpi.trend === 'up' ? 'success' : 'error'}
                    variant="tonal"
                  />
                  <Typography variant="caption" color="text.secondary">
                    vs last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pipeline & Activity Row */}
      <Grid container spacing={4}>
        {/* Pipeline Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Deal Pipeline
              </Typography>
              <Box className="space-y-4">
                {pipelineData.map((item, index) => (
                  <Box key={index}>
                    <Box className="flex justify-between items-center mb-1">
                      <Typography variant="body2" className="font-medium">
                        {item.stage}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.count} / {item.total}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(item.count / item.total) * 100}
                      className="h-2 rounded"
                      color={index === 0 ? 'primary' : index === 1 ? 'success' : index === 2 ? 'warning' : 'info'}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Recent Activity
              </Typography>
              <Box className="space-y-3">
                {recentActivity.map(activity => (
                  <Box key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                    <Box
                      className="p-2 rounded"
                      sx={{
                        backgroundColor:
                          activity.type === 'lead'
                            ? 'var(--mui-palette-primary-lightOpacity)'
                            : activity.type === 'feasibility'
                              ? 'var(--mui-palette-success-lightOpacity)'
                              : activity.type === 'loan'
                                ? 'var(--mui-palette-warning-lightOpacity)'
                                : 'var(--mui-palette-info-lightOpacity)'
                      }}
                    >
                      <i
                        className={`${activity.type === 'lead' ? 'ri-file-add-line' : activity.type === 'feasibility' ? 'ri-search-line' : activity.type === 'loan' ? 'ri-money-dollar-circle-line' : 'ri-refresh-line'} text-lg`}
                      />
                    </Box>
                    <Box className="flex-1">
                      <Typography variant="body2" className="font-medium">
                        {activity.title}
                      </Typography>
                      <Box className="flex items-center gap-2 mt-1">
                        <Chip label={activity.status} size="small" variant="outlined" />
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Stats Row */}
      <Grid container spacing={4} className="mt-6">
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Performance Metrics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" className="mb-1">
                      Avg Feasibility Cycle Time
                    </Typography>
                    <Typography variant="h5" className="font-bold">
                      18 days
                    </Typography>
                    <Chip label="Target: 21 days" size="small" color="success" variant="tonal" className="mt-2" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" className="mb-1">
                      Avg Draw Turnaround
                    </Typography>
                    <Typography variant="h5" className="font-bold">
                      3.2 days
                    </Typography>
                    <Chip label="Target: 5 days" size="small" color="success" variant="tonal" className="mt-2" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" className="mb-1">
                      Lead Conversion Rate
                    </Typography>
                    <Typography variant="h5" className="font-bold">
                      32%
                    </Typography>
                    <Chip label="+4% vs Q3" size="small" color="info" variant="tonal" className="mt-2" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" className="mb-1">
                      Portfolio Yield
                    </Typography>
                    <Typography variant="h5" className="font-bold">
                      8.2%
                    </Typography>
                    <Chip label="0 Defaults" size="small" color="success" variant="tonal" className="mt-2" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
