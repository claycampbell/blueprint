'use client'

import { Card, CardContent, Typography, Box, Grid, Chip, Button } from '@mui/material'

export default function AnalyticsPage() {
  return (
    <div>
      {/* Page Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold mb-2">
            Analytics & Reporting
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Business intelligence and performance metrics
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<i className="ri-file-download-line" />}>
          Export Report
        </Button>
      </Box>

      {/* KPIs */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                YTD Originations
              </Typography>
              <Typography variant="h4" className="font-bold">
                $142M
              </Typography>
              <Chip label="+22% vs last year" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Lead Conversion
              </Typography>
              <Typography variant="h4" className="font-bold">
                32%
              </Typography>
              <Chip label="+4% vs Q3" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Portfolio Yield
              </Typography>
              <Typography variant="h4" className="font-bold">
                8.2%
              </Typography>
              <Chip label="0 Defaults" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Deals Closed
              </Typography>
              <Typography variant="h4" className="font-bold">
                124
              </Typography>
              <Chip label="28 active" size="small" color="info" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Placeholder */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Deal Pipeline Funnel
              </Typography>
              <Box className="h-[400px] flex items-center justify-center bg-gray-50 rounded">
                <Box className="text-center">
                  <i className="ri-bar-chart-box-line text-6xl text-gray-300 mb-4" />
                  <Typography variant="body1" color="text.secondary">
                    Chart Visualization
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ApexCharts integration for production
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Top Performing Agents
              </Typography>
              <Box className="space-y-3">
                {[
                  { name: 'Sarah Johnson', deals: 24, revenue: '$18.2M' },
                  { name: 'Mike Anderson', deals: 19, revenue: '$14.5M' },
                  { name: 'Jennifer Lee', deals: 16, revenue: '$12.8M' }
                ].map((agent, idx) => (
                  <Box key={idx} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0">
                    <Box>
                      <Typography variant="body2" className="font-medium">
                        {agent.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {agent.deals} deals closed
                      </Typography>
                    </Box>
                    <Typography variant="body2" className="font-bold">
                      {agent.revenue}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Market Distribution
              </Typography>
              <Box className="h-[200px] flex items-center justify-center bg-gray-50 rounded mb-3">
                <i className="ri-pie-chart-line text-4xl text-gray-300" />
              </Box>
              <Box className="space-y-2">
                <Box className="flex justify-between items-center">
                  <Box className="flex items-center gap-2">
                    <Box className="w-3 h-3 rounded-full bg-primary" />
                    <Typography variant="body2">Seattle</Typography>
                  </Box>
                  <Typography variant="body2" className="font-bold">
                    68%
                  </Typography>
                </Box>
                <Box className="flex justify-between items-center">
                  <Box className="flex items-center gap-2">
                    <Box className="w-3 h-3 rounded-full bg-success" />
                    <Typography variant="body2">Phoenix</Typography>
                  </Box>
                  <Typography variant="body2" className="font-bold">
                    32%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Monthly Origination Trend
              </Typography>
              <Box className="h-[300px] flex items-center justify-center bg-gray-50 rounded">
                <Box className="text-center">
                  <i className="ri-line-chart-line text-6xl text-gray-300 mb-4" />
                  <Typography variant="body1" color="text.secondary">
                    Time Series Chart
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Recharts or ApexCharts for line/area charts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
