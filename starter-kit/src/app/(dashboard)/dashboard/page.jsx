'use client'

import Link from 'next/link'

import { Card, CardContent, Grid, Typography, Box, Chip, Button, Divider, IconButton } from '@mui/material'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

export default function DashboardPage() {
  // KPI Data
  const kpis = [
    {
      title: 'Total Deals in Pipeline',
      value: '142',
      change: '+12%',
      trend: 'up',
      icon: 'ri-briefcase-line',
      color: 'primary',
      subtitle: 'Across all stages'
    },
    {
      title: 'Active Loans',
      value: '$142M',
      change: '+8%',
      trend: 'up',
      icon: 'ri-money-dollar-circle-line',
      color: 'success',
      subtitle: '48 active loans'
    },
    {
      title: 'Conversion Rate',
      value: '32%',
      change: '+4%',
      trend: 'up',
      icon: 'ri-line-chart-line',
      color: 'warning',
      subtitle: 'Lead to funded'
    },
    {
      title: 'Average Cycle Time',
      value: '18 days',
      change: '-14%',
      trend: 'up',
      icon: 'ri-time-line',
      color: 'info',
      subtitle: 'Feasibility phase'
    }
  ]

  // Deal Funnel Data
  const funnelData = [
    { stage: 'Leads', count: 142, color: '#9C27B0' },
    { stage: 'Feasibility', count: 87, color: '#2196F3' },
    { stage: 'GO Decision', count: 54, color: '#FF9800' },
    { stage: 'Funded', count: 32, color: '#4CAF50' }
  ]

  // Monthly Volume Trend Data
  const volumeTrendData = [
    { month: 'Apr', leads: 45, funded: 12, amount: 18.5 },
    { month: 'May', leads: 52, funded: 15, amount: 22.3 },
    { month: 'Jun', leads: 48, funded: 18, amount: 28.7 },
    { month: 'Jul', leads: 61, funded: 14, amount: 19.8 },
    { month: 'Aug', leads: 58, funded: 20, amount: 31.2 },
    { month: 'Sep', leads: 67, funded: 22, amount: 35.6 },
    { month: 'Oct', leads: 72, funded: 25, amount: 38.4 }
  ]

  // Deals by Status Data
  const dealsByStatusData = [
    { name: 'In Review', value: 28, color: '#2196F3' },
    { name: 'Due Diligence', value: 35, color: '#FF9800' },
    { name: 'Approved', value: 42, color: '#4CAF50' },
    { name: 'On Hold', value: 12, color: '#F44336' },
    { name: 'Entitlement', value: 25, color: '#9C27B0' }
  ]

  // Recent Activity Data
  const recentActivity = [
    {
      id: 1,
      type: 'lead',
      title: '1234 Maple Street, Seattle',
      user: 'Sarah Johnson',
      action: 'submitted new lead',
      status: 'In Review',
      time: '15 min ago',
      icon: 'ri-file-add-line'
    },
    {
      id: 2,
      type: 'feasibility',
      title: 'Park Place Development',
      user: 'Mike Anderson',
      action: 'completed feasibility packet',
      status: 'Ready for Review',
      time: '1 hour ago',
      icon: 'ri-checkbox-circle-line'
    },
    {
      id: 3,
      type: 'loan',
      title: 'Greenwood Estates #4523',
      user: 'System',
      action: 'loan funded',
      status: 'Active',
      time: '2 hours ago',
      icon: 'ri-money-dollar-circle-line'
    },
    {
      id: 4,
      type: 'draw',
      title: 'Madison Park Phase 2',
      user: 'Jennifer Lee',
      action: 'approved draw request',
      status: '$125,000',
      time: '3 hours ago',
      icon: 'ri-check-double-line'
    },
    {
      id: 5,
      type: 'entitlement',
      title: 'Ballard Heights Project',
      user: 'David Martinez',
      action: 'submitted to city planning',
      status: 'Pending',
      time: '5 hours ago',
      icon: 'ri-file-text-line'
    },
    {
      id: 6,
      type: 'lead',
      title: '789 Oak Avenue, Phoenix',
      user: 'Emily Chen',
      action: 'updated builder score',
      status: 'Score: 92',
      time: '6 hours ago',
      icon: 'ri-star-line'
    },
    {
      id: 7,
      type: 'loan',
      title: 'Fremont Place #4521',
      user: 'System',
      action: 'document package generated',
      status: 'Ready',
      time: '8 hours ago',
      icon: 'ri-file-list-line'
    },
    {
      id: 8,
      type: 'feasibility',
      title: 'Capitol Hill Residences',
      user: 'Sarah Johnson',
      action: 'requested additional documentation',
      status: 'In Progress',
      time: '10 hours ago',
      icon: 'ri-questionnaire-line'
    },
    {
      id: 9,
      type: 'draw',
      title: 'Queen Anne Tower',
      user: 'Mike Anderson',
      action: 'inspection completed',
      status: 'Passed',
      time: '1 day ago',
      icon: 'ri-eye-line'
    },
    {
      id: 10,
      type: 'loan',
      title: 'Pioneer Square #4519',
      user: 'Jennifer Lee',
      action: 'loan paid off',
      status: 'Closed',
      time: '1 day ago',
      icon: 'ri-check-line'
    }
  ]

  const getActivityColor = type => {
    switch (type) {
      case 'lead':
        return 'primary'
      case 'feasibility':
        return 'success'
      case 'loan':
        return 'warning'
      case 'draw':
        return 'info'
      case 'entitlement':
        return 'secondary'
      default:
        return 'default'
    }
  }

  return (
    <div>
      {/* Page Header */}
      <Box className="mb-6">
        <Box className="flex justify-between items-start">
          <Box>
            <Typography variant="h4" className="font-bold mb-2">
              Executive Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back! Here&apos;s what&apos;s happening with your projects today.
            </Typography>
          </Box>
          <Box className="flex gap-2">
            <Button variant="outlined" startIcon={<i className="ri-filter-line" />}>
              Filter
            </Button>
            <Button variant="outlined" startIcon={<i className="ri-download-line" />}>
              Export
            </Button>
          </Box>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={4} className="mb-6">
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box className="flex justify-between items-start mb-3">
                  <Box>
                    <Typography variant="body2" color="text.secondary" className="mb-1">
                      {kpi.title}
                    </Typography>
                    <Typography variant="h4" className="font-bold mb-1">
                      {kpi.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {kpi.subtitle}
                    </Typography>
                  </Box>
                  <Box
                    className="p-2 rounded"
                    sx={{ backgroundColor: `var(--mui-palette-${kpi.color}-lightOpacity)` }}
                  >
                    <i className={`${kpi.icon} text-2xl`} style={{ color: `var(--mui-palette-${kpi.color}-main)` }} />
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

      {/* Charts Section */}
      <Grid container spacing={4} className="mb-6">
        {/* Deal Funnel Chart */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Deal Funnel
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Box className="mt-4 grid grid-cols-2 gap-3">
                {funnelData.map((item, idx) => (
                  <Box key={idx} className="flex items-center gap-2">
                    <Box className="w-3 h-3 rounded" sx={{ backgroundColor: item.color }} />
                    <Typography variant="body2">
                      {item.stage}: <strong>{item.count}</strong>
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Volume Trend */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Monthly Volume Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={volumeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="leads"
                    stackId="1"
                    stroke="#2196F3"
                    fill="#2196F3"
                    fillOpacity={0.6}
                    name="Leads"
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="funded"
                    stackId="2"
                    stroke="#4CAF50"
                    fill="#4CAF50"
                    fillOpacity={0.6}
                    name="Funded"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="amount"
                    stroke="#FF9800"
                    strokeWidth={2}
                    name="Volume ($M)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Deals by Status (Pie Chart) */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Deals by Status
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dealsByStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dealsByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box className="mt-4 space-y-2">
                {dealsByStatusData.map((item, idx) => (
                  <Box key={idx} className="flex items-center justify-between">
                    <Box className="flex items-center gap-2">
                      <Box className="w-3 h-3 rounded-full" sx={{ backgroundColor: item.color }} />
                      <Typography variant="body2">{item.name}</Typography>
                    </Box>
                    <Typography variant="body2" className="font-bold">
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Quick Actions
              </Typography>
              <Box className="space-y-3">
                <Link href="/leads/new" passHref>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<i className="ri-add-line" />}
                    className="justify-start"
                  >
                    Create New Lead
                  </Button>
                </Link>
                <Link href="/loans/new" passHref>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={<i className="ri-money-dollar-circle-line" />}
                    className="justify-start"
                  >
                    Create New Loan
                  </Button>
                </Link>
                <Divider className="my-3" />
                <Typography variant="subtitle2" className="font-semibold mb-2">
                  Key Reports
                </Typography>
                <Link href="/analytics" passHref>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<i className="ri-bar-chart-box-line" />}
                    className="justify-start"
                  >
                    Analytics Dashboard
                  </Button>
                </Link>
                <Link href="/reports/pipeline" passHref>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<i className="ri-file-chart-line" />}
                    className="justify-start"
                  >
                    Pipeline Report
                  </Button>
                </Link>
                <Link href="/reports/performance" passHref>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<i className="ri-dashboard-line" />}
                    className="justify-start"
                  >
                    Performance Metrics
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Snapshot */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Performance Snapshot
              </Typography>
              <Box className="space-y-4">
                <Box>
                  <Box className="flex justify-between items-center mb-1">
                    <Typography variant="body2" color="text.secondary">
                      Feasibility Cycle Time
                    </Typography>
                    <Typography variant="body2" className="font-bold">
                      18 days
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <Box className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                      <Box className="h-full bg-success" sx={{ width: '86%' }} />
                    </Box>
                    <Typography variant="caption" color="success.main">
                      Target: 21d
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Box className="flex justify-between items-center mb-1">
                    <Typography variant="body2" color="text.secondary">
                      Draw Turnaround
                    </Typography>
                    <Typography variant="body2" className="font-bold">
                      3.2 days
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <Box className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                      <Box className="h-full bg-success" sx={{ width: '64%' }} />
                    </Box>
                    <Typography variant="caption" color="success.main">
                      Target: 5d
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Box className="flex justify-between items-center mb-1">
                    <Typography variant="body2" color="text.secondary">
                      Portfolio Yield
                    </Typography>
                    <Typography variant="body2" className="font-bold">
                      8.2%
                    </Typography>
                  </Box>
                  <Chip label="Zero Defaults" size="small" color="success" variant="tonal" className="mt-1" />
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary" className="mb-2">
                    Market Distribution
                  </Typography>
                  <Box className="space-y-2">
                    <Box className="flex items-center justify-between">
                      <Box className="flex items-center gap-2">
                        <Box className="w-3 h-3 rounded-full bg-primary" />
                        <Typography variant="body2">Seattle</Typography>
                      </Box>
                      <Typography variant="body2" className="font-bold">
                        68%
                      </Typography>
                    </Box>
                    <Box className="flex items-center justify-between">
                      <Box className="flex items-center gap-2">
                        <Box className="w-3 h-3 rounded-full bg-success" />
                        <Typography variant="body2">Phoenix</Typography>
                      </Box>
                      <Typography variant="body2" className="font-bold">
                        32%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity Feed */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold">
                  Recent Activity
                </Typography>
                <Button variant="text" size="small" endIcon={<i className="ri-arrow-right-line" />}>
                  View All
                </Button>
              </Box>
              <Box className="space-y-3">
                {recentActivity.map(activity => (
                  <Box
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Box
                      className="p-2 rounded"
                      sx={{
                        backgroundColor: `var(--mui-palette-${getActivityColor(activity.type)}-lightOpacity)`
                      }}
                    >
                      <i
                        className={`${activity.icon} text-lg`}
                        style={{ color: `var(--mui-palette-${getActivityColor(activity.type)}-main)` }}
                      />
                    </Box>
                    <Box className="flex-1 min-w-0">
                      <Typography variant="body2" className="font-medium mb-1">
                        {activity.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" className="block mb-1">
                        <strong>{activity.user}</strong> {activity.action}
                      </Typography>
                      <Box className="flex items-center gap-2 flex-wrap">
                        <Chip label={activity.status} size="small" variant="outlined" />
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small">
                      <i className="ri-more-2-line" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
