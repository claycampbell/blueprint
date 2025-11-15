'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress
} from '@mui/material'

// Mock Data Generators
const generateLeadData = () => ({
  volumeOverTime: [
    { month: 'Jan', leads: 45 },
    { month: 'Feb', leads: 52 },
    { month: 'Mar', leads: 48 },
    { month: 'Apr', leads: 61 },
    { month: 'May', leads: 55 },
    { month: 'Jun', leads: 67 },
    { month: 'Jul', leads: 72 },
    { month: 'Aug', leads: 68 },
    { month: 'Sep', leads: 75 },
    { month: 'Oct', leads: 81 },
    { month: 'Nov', leads: 78 },
    { month: 'Dec', leads: 84 }
  ],
  conversionFunnel: [
    { stage: 'Submitted', count: 450, percentage: 100 },
    { stage: 'Reviewed', count: 380, percentage: 84 },
    { stage: 'Feasibility', count: 285, percentage: 63 },
    { stage: 'GO Decision', count: 195, percentage: 43 }
  ],
  leadSources: [
    { source: 'Website', count: 180, color: '#1976d2' },
    { source: 'Referral', count: 145, color: '#2e7d32' },
    { source: 'Direct', count: 95, color: '#ed6c02' },
    { source: 'Partner', count: 30, color: '#9c27b0' }
  ],
  averageTimeInStage: [
    { stage: 'Initial Review', days: 2.3 },
    { stage: 'Qualification', days: 4.1 },
    { stage: 'Feasibility Prep', days: 5.8 },
    { stage: 'Decision', days: 1.2 }
  ],
  topAgents: [
    { name: 'Sarah Johnson', leads: 124, converted: 52, rate: 42 },
    { name: 'Mike Anderson', leads: 118, converted: 48, rate: 41 },
    { name: 'Jennifer Lee', leads: 102, converted: 39, rate: 38 },
    { name: 'David Chen', leads: 95, converted: 35, rate: 37 },
    { name: 'Emily Rodriguez', leads: 89, converted: 31, rate: 35 }
  ]
})

const generateFeasibilityData = () => ({
  cycleTimeTrend: [
    { month: 'Jan', avgDays: 18.5 },
    { month: 'Feb', avgDays: 17.2 },
    { month: 'Mar', avgDays: 16.8 },
    { month: 'Apr', avgDays: 15.4 },
    { month: 'May', avgDays: 14.9 },
    { month: 'Jun', avgDays: 14.2 },
    { month: 'Jul', avgDays: 13.8 },
    { month: 'Aug', avgDays: 13.5 },
    { month: 'Sep', avgDays: 12.9 },
    { month: 'Oct', avgDays: 12.4 },
    { month: 'Nov', avgDays: 11.8 },
    { month: 'Dec', avgDays: 11.2 }
  ],
  consultantPerformance: [
    { name: 'Enviro Solutions', projects: 45, onTime: 42, rate: 93 },
    { name: 'GeoTech Partners', projects: 38, onTime: 34, rate: 89 },
    { name: 'Urban Analytics', projects: 31, onTime: 26, rate: 84 },
    { name: 'Site Assess Pro', projects: 28, onTime: 22, rate: 79 }
  ],
  goPassRate: [
    { month: 'Jan', go: 65, pass: 35 },
    { month: 'Feb', go: 68, pass: 32 },
    { month: 'Mar', go: 71, pass: 29 },
    { month: 'Apr', go: 69, pass: 31 },
    { month: 'May', go: 73, pass: 27 },
    { month: 'Jun', go: 75, pass: 25 }
  ],
  rejectionReasons: [
    { reason: 'Environmental Issues', count: 28, color: '#d32f2f' },
    { reason: 'Zoning Restrictions', count: 24, color: '#f57c00' },
    { reason: 'Site Constraints', count: 18, color: '#fbc02d' },
    { reason: 'Cost Overruns', count: 15, color: '#388e3c' },
    { reason: 'Market Conditions', count: 12, color: '#1976d2' }
  ]
})

const generateEntitlementData = () => ({
  avgDaysByJurisdiction: [
    { jurisdiction: 'Seattle', avgDays: 145 },
    { jurisdiction: 'Bellevue', avgDays: 132 },
    { jurisdiction: 'Tacoma', avgDays: 118 },
    { jurisdiction: 'Phoenix', avgDays: 98 },
    { jurisdiction: 'Scottsdale', avgDays: 112 },
    { jurisdiction: 'Tempe', avgDays: 95 }
  ],
  correctionCycles: [
    { month: 'Jan', avg: 1.8 },
    { month: 'Feb', avg: 1.6 },
    { month: 'Mar', avg: 1.5 },
    { month: 'Apr', avg: 1.7 },
    { month: 'May', avg: 1.4 },
    { month: 'Jun', avg: 1.3 }
  ],
  approvalRate: [
    { month: 'Jan', approved: 82, denied: 18 },
    { month: 'Feb', approved: 85, denied: 15 },
    { month: 'Mar', approved: 88, denied: 12 },
    { month: 'Apr', approved: 86, denied: 14 },
    { month: 'May', approved: 90, denied: 10 },
    { month: 'Jun', approved: 91, denied: 9 }
  ],
  forecastAccuracy: [
    { quarter: 'Q1 2024', accuracy: 78 },
    { quarter: 'Q2 2024', accuracy: 82 },
    { quarter: 'Q3 2024', accuracy: 85 },
    { quarter: 'Q4 2024', accuracy: 88 }
  ]
})

const generateLoanData = () => ({
  originationVolume: [
    { month: 'Jan', volume: 12.5, count: 8 },
    { month: 'Feb', volume: 14.2, count: 9 },
    { month: 'Mar', volume: 16.8, count: 11 },
    { month: 'Apr', volume: 13.5, count: 9 },
    { month: 'May', volume: 18.3, count: 12 },
    { month: 'Jun', volume: 21.7, count: 14 },
    { month: 'Jul', volume: 19.4, count: 13 },
    { month: 'Aug', volume: 22.1, count: 15 },
    { month: 'Sep', volume: 24.5, count: 16 },
    { month: 'Oct', volume: 20.8, count: 14 },
    { month: 'Nov', volume: 25.3, count: 17 },
    { month: 'Dec', volume: 23.9, count: 16 }
  ],
  portfolioValue: [
    { month: 'Jan', value: 142.5 },
    { month: 'Feb', value: 156.7 },
    { month: 'Mar', value: 173.5 },
    { month: 'Apr', value: 187.0 },
    { month: 'May', value: 205.3 },
    { month: 'Jun', value: 227.0 }
  ],
  avgLoanSize: [
    { quarter: 'Q1 2024', avg: 1.42 },
    { quarter: 'Q2 2024', avg: 1.48 },
    { quarter: 'Q3 2024', avg: 1.52 },
    { quarter: 'Q4 2024', avg: 1.58 }
  ],
  topBuilders: [
    { name: 'Summit Builders LLC', loans: 18, volume: 28.4 },
    { name: 'Pacific Construction', loans: 15, volume: 24.1 },
    { name: 'Urban Dev Partners', loans: 12, volume: 19.8 },
    { name: 'Northwest Homes', loans: 11, volume: 17.2 },
    { name: 'Phoenix Residential', loans: 9, volume: 14.5 }
  ]
})

const generateServicingData = () => ({
  drawCycleTime: [
    { month: 'Jan', avgDays: 5.2 },
    { month: 'Feb', avgDays: 4.8 },
    { month: 'Mar', avgDays: 4.5 },
    { month: 'Apr', avgDays: 4.2 },
    { month: 'May', avgDays: 3.9 },
    { month: 'Jun', avgDays: 3.6 }
  ],
  drawHoldReasons: [
    { reason: 'Missing Documentation', count: 45, color: '#d32f2f' },
    { reason: 'Inspection Pending', count: 38, color: '#f57c00' },
    { reason: 'Budget Verification', count: 22, color: '#fbc02d' },
    { reason: 'Lien Issues', count: 15, color: '#388e3c' },
    { reason: 'Other', count: 8, color: '#1976d2' }
  ],
  monthlyDrawVolume: [
    { month: 'Jan', volume: 45.2, count: 142 },
    { month: 'Feb', volume: 48.7, count: 156 },
    { month: 'Mar', volume: 52.3, count: 168 },
    { month: 'Apr', volume: 49.8, count: 161 },
    { month: 'May', volume: 55.1, count: 178 },
    { month: 'Jun', volume: 58.9, count: 189 }
  ],
  avgDrawAmount: [
    { quarter: 'Q1 2024', avg: 315000 },
    { quarter: 'Q2 2024', avg: 328000 },
    { quarter: 'Q3 2024', avg: 342000 },
    { quarter: 'Q4 2024', avg: 356000 }
  ]
})

const generateOverallMetrics = () => ({
  pipelineHealth: [
    { stage: 'Lead Intake', count: 84, value: 0 },
    { stage: 'Feasibility', count: 42, value: 0 },
    { stage: 'Entitlement', count: 28, value: 0 },
    { stage: 'Loan Origination', count: 15, value: 24.5 },
    { stage: 'Active Servicing', count: 124, value: 187.3 }
  ],
  conversionRates: [
    { funnel: 'Lead → Feasibility', rate: 63 },
    { funnel: 'Feasibility → GO', rate: 68 },
    { funnel: 'GO → Entitlement', rate: 72 },
    { funnel: 'Entitlement → Loan', rate: 89 }
  ],
  cycleTimeComparison: [
    { module: 'Lead Review', current: 2.3, target: 2.0, improvement: 15 },
    { module: 'Feasibility', current: 11.2, target: 8.5, improvement: 24 },
    { module: 'Entitlement', current: 125, target: 95, improvement: 24 },
    { module: 'Loan Origination', current: 18, target: 14, improvement: 22 },
    { module: 'Draw Processing', current: 3.6, target: 2.5, improvement: 31 }
  ]
})

// Simple Chart Components
const LineChart = ({ data, dataKey, height = 300 }) => {
  const max = Math.max(...data.map(d => d[dataKey]))
  const min = Math.min(...data.map(d => d[dataKey]))
  const range = max - min || 1

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - (((item[dataKey] - min) / range) * 80 + 10)

    
return `${x},${y}`
  }).join(' ')

  return (
    <Box sx={{ position: 'relative', height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="#1976d2"
          strokeWidth="0.5"
          points={points}
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = 100 - (((item[dataKey] - min) / range) * 80 + 10)

          
return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1"
              fill="#1976d2"
            />
          )
        })}
      </svg>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        {data.map((item, index) => (
          <Typography key={index} variant="caption" color="text.secondary">
            {item.month || item.quarter}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

const BarChart = ({ data, dataKey, height = 300, color = '#1976d2' }) => {
  const max = Math.max(...data.map(d => d[dataKey]))
  const barWidth = 80 / data.length

  return (
    <Box sx={{ position: 'relative', height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {data.map((item, index) => {
          const barHeight = (item[dataKey] / max) * 80
          const x = (index * 100) / data.length + 10
          const y = 90 - barHeight

          
return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth - 2}
              height={barHeight}
              fill={color}
              opacity={0.8}
            />
          )
        })}
      </svg>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
        {data.map((item, index) => (
          <Typography key={index} variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            {item.stage || item.jurisdiction || item.month}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

const PieChart = ({ data, height = 250 }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  let currentAngle = -90

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, height }}>
      <Box sx={{ position: 'relative', width: '50%', height: '100%' }}>
        <svg width="100%" height="100%" viewBox="-1 -1 2 2" style={{ transform: 'rotate(0deg)' }}>
          {data.map((item, index) => {
            const percentage = (item.count / total) * 100
            const angle = (percentage / 100) * 360
            const startAngle = currentAngle

            currentAngle += angle

            const startRad = (startAngle * Math.PI) / 180
            const endRad = (currentAngle * Math.PI) / 180

            const x1 = Math.cos(startRad)
            const y1 = Math.sin(startRad)
            const x2 = Math.cos(endRad)
            const y2 = Math.sin(endRad)

            const largeArc = angle > 180 ? 1 : 0

            const pathData = [
              `M 0 0`,
              `L ${x1} ${y1}`,
              `A 1 1 0 ${largeArc} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                opacity={0.8}
              />
            )
          })}
        </svg>
      </Box>
      <Box sx={{ flex: 1 }}>
        {data.map((item, index) => (
          <Box key={index} sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: item.color }} />
              <Typography variant="body2">{item.source || item.reason}</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {item.count} ({((item.count / total) * 100).toFixed(1)}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

const FunnelChart = ({ data, height = 300 }) => {
  return (
    <Box sx={{ height }}>
      {data.map((item, index) => {
        const widthPercentage = item.percentage

        
return (
          <Box key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" fontWeight="medium">{item.stage}</Typography>
              <Typography variant="body2" color="text.secondary">{item.count} ({item.percentage}%)</Typography>
            </Box>
            <Box
              sx={{
                width: `${widthPercentage}%`,
                height: 48,
                bgcolor: 'primary.main',
                opacity: 0.9 - (index * 0.15),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1
              }}
            >
              <Typography variant="h6" color="white" fontWeight="bold">
                {item.count}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default function AnalyticsPage() {
  const [selectedModule, setSelectedModule] = useState('all')
  const [dateRange, setDateRange] = useState('ytd')

  const leadData = generateLeadData()
  const feasibilityData = generateFeasibilityData()
  const entitlementData = generateEntitlementData()
  const loanData = generateLoanData()
  const servicingData = generateServicingData()
  const overallData = generateOverallMetrics()

  const renderModuleContent = () => {
    switch (selectedModule) {
      case 'leads':
        return <LeadAnalytics data={leadData} />
      case 'feasibility':
        return <FeasibilityAnalytics data={feasibilityData} />
      case 'entitlement':
        return <EntitlementAnalytics data={entitlementData} />
      case 'loans':
        return <LoanAnalytics data={loanData} />
      case 'servicing':
        return <ServicingAnalytics data={servicingData} />
      case 'all':
      default:
        return <OverallAnalytics data={overallData} />
    }
  }

  return (
    <div>
      {/* Page Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold mb-2">
            Analytics & Reporting
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Performance metrics and business intelligence across all modules
          </Typography>
        </Box>
        <Box className="flex gap-2">
          <TextField
            select
            size="small"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="mtd">Month to Date</MenuItem>
            <MenuItem value="qtd">Quarter to Date</MenuItem>
            <MenuItem value="ytd">Year to Date</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </TextField>
          <Button variant="contained" startIcon={<i className="ri-file-download-line" />}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Module Selector Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={selectedModule}
          onChange={(e, newValue) => setSelectedModule(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Modules" value="all" />
          <Tab label="Leads" value="leads" />
          <Tab label="Feasibility" value="feasibility" />
          <Tab label="Entitlement" value="entitlement" />
          <Tab label="Loans" value="loans" />
          <Tab label="Servicing" value="servicing" />
        </Tabs>
      </Box>

      {/* Module-Specific Content */}
      {renderModuleContent()}
    </div>
  )
}

// Lead Analytics Component
function LeadAnalytics({ data }) {
  return (
    <Grid container spacing={4}>
      {/* KPIs */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Total Leads (YTD)
            </Typography>
            <Typography variant="h4" className="font-bold">
              {data.volumeOverTime.reduce((sum, m) => sum + m.leads, 0)}
            </Typography>
            <Chip label="+18% vs last year" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Conversion Rate
            </Typography>
            <Typography variant="h4" className="font-bold">
              {data.conversionFunnel[data.conversionFunnel.length - 1].percentage}%
            </Typography>
            <Chip label="+5% vs Q3" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Avg Review Time
            </Typography>
            <Typography variant="h4" className="font-bold">
              2.3 days
            </Typography>
            <Chip label="-12% improvement" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Active Leads
            </Typography>
            <Typography variant="h4" className="font-bold">
              127
            </Typography>
            <Chip label="42 in review" size="small" color="info" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>

      {/* Lead Volume Over Time */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Lead Volume Over Time
            </Typography>
            <LineChart data={data.volumeOverTime} dataKey="leads" height={300} />
          </CardContent>
        </Card>
      </Grid>

      {/* Lead Sources */}
      <Grid item xs={12} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Lead Sources Breakdown
            </Typography>
            <PieChart data={data.leadSources} height={250} />
          </CardContent>
        </Card>
      </Grid>

      {/* Conversion Funnel */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Conversion Funnel
            </Typography>
            <FunnelChart data={data.conversionFunnel} height={320} />
          </CardContent>
        </Card>
      </Grid>

      {/* Average Time in Stage */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Average Time in Each Stage
            </Typography>
            <BarChart data={data.averageTimeInStage} dataKey="days" height={300} color="#2e7d32" />
            <Box sx={{ mt: 2 }}>
              {data.averageTimeInStage.map((stage, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{stage.stage}</Typography>
                  <Typography variant="body2" fontWeight="bold">{stage.days} days</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Performing Agents */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Top Performing Agents
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Agent Name</TableCell>
                    <TableCell align="right">Total Leads</TableCell>
                    <TableCell align="right">Converted</TableCell>
                    <TableCell align="right">Conversion Rate</TableCell>
                    <TableCell align="right">Performance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topAgents.map((agent, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">{agent.name}</Typography>
                      </TableCell>
                      <TableCell align="right">{agent.leads}</TableCell>
                      <TableCell align="right">{agent.converted}</TableCell>
                      <TableCell align="right">
                        <Chip label={`${agent.rate}%`} size="small" color="primary" variant="tonal" />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={agent.rate}
                            sx={{ flex: 1, height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

// Feasibility Analytics Component
function FeasibilityAnalytics({ data }) {
  return (
    <Grid container spacing={4}>
      {/* KPIs */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Avg Cycle Time
            </Typography>
            <Typography variant="h4" className="font-bold">
              11.2 days
            </Typography>
            <Chip label="-39% vs target" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              GO Rate
            </Typography>
            <Typography variant="h4" className="font-bold">
              75%
            </Typography>
            <Chip label="+8% vs Q3" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Active Projects
            </Typography>
            <Typography variant="h4" className="font-bold">
              42
            </Typography>
            <Chip label="28 awaiting reports" size="small" color="info" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Consultant On-Time %
            </Typography>
            <Typography variant="h4" className="font-bold">
              89%
            </Typography>
            <Chip label="Exceeds SLA" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>

      {/* Cycle Time Trend */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Feasibility Cycle Time Trend
            </Typography>
            <LineChart data={data.cycleTimeTrend} dataKey="avgDays" height={300} />
            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="success.dark">
                <i className="ri-arrow-down-line" /> 39% reduction in cycle time over the past year
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* GO vs PASS Rate */}
      <Grid item xs={12} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              GO vs PASS Rate (Last 6 Months)
            </Typography>
            <Box sx={{ height: 250 }}>
              {data.goPassRate.map((item, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {item.month}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, height: 24 }}>
                    <Box
                      sx={{
                        width: `${item.go}%`,
                        bgcolor: 'success.main',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="caption" color="white" fontWeight="bold">
                        {item.go}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: `${item.pass}%`,
                        bgcolor: 'error.main',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="caption" color="white" fontWeight="bold">
                        {item.pass}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Consultant Performance */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Consultant Performance
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Consultant</TableCell>
                    <TableCell align="right">Projects</TableCell>
                    <TableCell align="right">On-Time Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.consultantPerformance.map((consultant, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{consultant.name}</TableCell>
                      <TableCell align="right">{consultant.projects}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                          <LinearProgress
                            variant="determinate"
                            value={consultant.rate}
                            sx={{ width: 80, height: 6, borderRadius: 3 }}
                            color={consultant.rate >= 90 ? 'success' : consultant.rate >= 80 ? 'warning' : 'error'}
                          />
                          <Typography variant="body2" fontWeight="bold">
                            {consultant.rate}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Common Rejection Reasons */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Common PASS Reasons
            </Typography>
            <PieChart data={data.rejectionReasons} height={300} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

// Entitlement Analytics Component
function EntitlementAnalytics({ data }) {
  return (
    <Grid container spacing={4}>
      {/* KPIs */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Avg Days to Approval
            </Typography>
            <Typography variant="h4" className="font-bold">
              118 days
            </Typography>
            <Chip label="Seattle market" size="small" color="info" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Approval Rate
            </Typography>
            <Typography variant="h4" className="font-bold">
              91%
            </Typography>
            <Chip label="+6% improvement" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Avg Correction Cycles
            </Typography>
            <Typography variant="h4" className="font-bold">
              1.3
            </Typography>
            <Chip label="-28% vs Q3" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Active Permits
            </Typography>
            <Typography variant="h4" className="font-bold">
              28
            </Typography>
            <Chip label="15 pending review" size="small" color="info" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>

      {/* Average Days by Jurisdiction */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Average Days to Permit Approval by Jurisdiction
            </Typography>
            <BarChart data={data.avgDaysByJurisdiction} dataKey="avgDays" height={300} color="#1976d2" />
            <Box sx={{ mt: 3 }}>
              {data.avgDaysByJurisdiction.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="medium">{item.jurisdiction}</Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">{item.avgDays} days</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Forecast Accuracy */}
      <Grid item xs={12} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Timeline Forecast Accuracy
            </Typography>
            <Box sx={{ height: 250 }}>
              {data.forecastAccuracy.map((item, idx) => (
                <Box key={idx} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.quarter}</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {item.accuracy}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.accuracy}
                    sx={{ height: 12, borderRadius: 6 }}
                    color="success"
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="info.dark">
                <i className="ri-information-line" /> AI-powered forecasting improving accuracy
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Correction Cycle Frequency */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Correction Cycle Frequency Trend
            </Typography>
            <LineChart data={data.correctionCycles} dataKey="avg" height={250} />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              {data.correctionCycles.map((item, idx) => (
                <Box key={idx} sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">{item.month}</Typography>
                  <Typography variant="body2" fontWeight="bold">{item.avg}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Permits Approved vs Denied */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Permits Approved vs Denied (Last 6 Months)
            </Typography>
            <Box sx={{ height: 250 }}>
              {data.approvalRate.map((item, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {item.month}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, height: 28 }}>
                    <Box
                      sx={{
                        width: `${item.approved}%`,
                        bgcolor: 'success.main',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        pl: 2
                      }}
                    >
                      <Typography variant="caption" color="white" fontWeight="bold">
                        Approved {item.approved}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: `${item.denied}%`,
                        bgcolor: 'error.main',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="caption" color="white" fontWeight="bold">
                        {item.denied}%
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
  )
}

// Loan Analytics Component
function LoanAnalytics({ data }) {
  return (
    <Grid container spacing={4}>
      {/* KPIs */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              YTD Originations
            </Typography>
            <Typography variant="h4" className="font-bold">
              $233M
            </Typography>
            <Chip label="154 loans" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Portfolio Value
            </Typography>
            <Typography variant="h4" className="font-bold">
              $227M
            </Typography>
            <Chip label="124 active loans" size="small" color="info" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Avg Loan Size
            </Typography>
            <Typography variant="h4" className="font-bold">
              $1.58M
            </Typography>
            <Chip label="+11% vs Q3" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Default Rate
            </Typography>
            <Typography variant="h4" className="font-bold">
              0.0%
            </Typography>
            <Chip label="Zero defaults ever" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>

      {/* Loan Origination Volume */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Monthly Loan Origination Volume
            </Typography>
            <LineChart data={data.originationVolume} dataKey="volume" height={300} />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              {data.originationVolume.slice(-6).map((item, idx) => (
                <Box key={idx} sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">{item.month}</Typography>
                  <Typography variant="body2" fontWeight="bold">${item.volume}M</Typography>
                  <Typography variant="caption" color="text.secondary">{item.count} loans</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Average Loan Size Trend */}
      <Grid item xs={12} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Average Loan Size Trend
            </Typography>
            <Box sx={{ height: 250 }}>
              {data.avgLoanSize.map((item, idx) => (
                <Box key={idx} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.quarter}</Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      ${item.avg}M
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(item.avg / 2) * 100}
                    sx={{ height: 12, borderRadius: 6 }}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="success.dark">
                <i className="ri-arrow-up-line" /> Average loan size increasing 11% YoY
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Portfolio Value Over Time */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Portfolio Value Over Time
            </Typography>
            <LineChart data={data.portfolioValue} dataKey="value" height={250} />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              {data.portfolioValue.map((item, idx) => (
                <Box key={idx} sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">{item.month}</Typography>
                  <Typography variant="body2" fontWeight="bold">${item.value}M</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Builders */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Top Builders by Loan Volume
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Builder</TableCell>
                    <TableCell align="right">Loans</TableCell>
                    <TableCell align="right">Volume</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topBuilders.map((builder, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">{builder.name}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip label={builder.loans} size="small" variant="tonal" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          ${builder.volume}M
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

// Servicing Analytics Component
function ServicingAnalytics({ data }) {
  return (
    <Grid container spacing={4}>
      {/* KPIs */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Avg Draw Cycle Time
            </Typography>
            <Typography variant="h4" className="font-bold">
              3.6 days
            </Typography>
            <Chip label="-31% vs target" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Monthly Draw Volume
            </Typography>
            <Typography variant="h4" className="font-bold">
              $58.9M
            </Typography>
            <Chip label="189 draws" size="small" color="info" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Avg Draw Amount
            </Typography>
            <Typography variant="h4" className="font-bold">
              $356K
            </Typography>
            <Chip label="+8% vs Q3" size="small" color="success" variant="tonal" className="mt-2" />
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
              23
            </Typography>
            <Chip label="15 missing docs" size="small" color="warning" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>

      {/* Draw Approval Cycle Time */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Draw Approval Cycle Time Trend
            </Typography>
            <LineChart data={data.drawCycleTime} dataKey="avgDays" height={300} />
            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="success.dark">
                <i className="ri-arrow-down-line" /> 31% reduction in draw processing time over 6 months
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Draws on Hold Reasons */}
      <Grid item xs={12} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Draws on Hold - Reasons
            </Typography>
            <PieChart data={data.drawHoldReasons} height={280} />
          </CardContent>
        </Card>
      </Grid>

      {/* Monthly Draw Volume */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Monthly Draw Volume
            </Typography>
            <LineChart data={data.monthlyDrawVolume} dataKey="volume" height={250} />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              {data.monthlyDrawVolume.map((item, idx) => (
                <Box key={idx} sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">{item.month}</Typography>
                  <Typography variant="body2" fontWeight="bold">${item.volume}M</Typography>
                  <Typography variant="caption" color="text.secondary">{item.count} draws</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Average Draw Amount */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Average Draw Amount Trend
            </Typography>
            <Box sx={{ height: 250 }}>
              {data.avgDrawAmount.map((item, idx) => (
                <Box key={idx} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.quarter}</Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      ${(item.avg / 1000).toFixed(0)}K
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(item.avg / 500000) * 100}
                    sx={{ height: 12, borderRadius: 6 }}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="info.dark">
                <i className="ri-information-line" /> Draw amounts trending higher as project sizes increase
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

// Overall Analytics Component
function OverallAnalytics({ data }) {
  return (
    <Grid container spacing={4}>
      {/* Summary KPIs */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              YTD Originations
            </Typography>
            <Typography variant="h4" className="font-bold">
              $233M
            </Typography>
            <Chip label="+22% vs last year" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Portfolio Value
            </Typography>
            <Typography variant="h4" className="font-bold">
              $227M
            </Typography>
            <Chip label="0 Defaults" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Active Pipeline
            </Typography>
            <Typography variant="h4" className="font-bold">
              293
            </Typography>
            <Chip label="Across all stages" size="small" color="info" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" className="mb-1">
              Overall Efficiency
            </Typography>
            <Typography variant="h4" className="font-bold">
              +26%
            </Typography>
            <Chip label="Cycle time improvement" size="small" color="success" variant="tonal" className="mt-2" />
          </CardContent>
        </Card>
      </Grid>

      {/* Pipeline Health */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Pipeline Health - Deals by Stage
            </Typography>
            <Box sx={{ height: 300 }}>
              {data.pipelineHealth.map((stage, idx) => (
                <Box key={idx} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">{stage.stage}</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {stage.count} deals
                      </Typography>
                      {stage.value > 0 && (
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          ${stage.value}M
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(stage.count / 124) * 100}
                    sx={{ height: 16, borderRadius: 8 }}
                    color={idx === data.pipelineHealth.length - 1 ? 'success' : 'primary'}
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Conversion Rates */}
      <Grid item xs={12} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Conversion Rates Across Funnel
            </Typography>
            <Box sx={{ height: 300 }}>
              {data.conversionRates.map((item, idx) => (
                <Box key={idx} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.funnel}</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {item.rate}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.rate}
                    sx={{ height: 12, borderRadius: 6 }}
                    color="success"
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Cycle Time Comparison */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Cycle Time Performance vs Target
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Module</TableCell>
                    <TableCell align="right">Current Avg</TableCell>
                    <TableCell align="right">Target</TableCell>
                    <TableCell align="right">Improvement</TableCell>
                    <TableCell align="right">Progress</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.cycleTimeComparison.map((item, idx) => {
                    const progressToTarget = ((item.target / item.current) * 100)
                    const isAhead = item.current <= item.target

                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">{item.module}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {item.current} {item.module.includes('Entitlement') ? 'days' : item.current > 10 ? 'days' : 'days'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            {item.target} {item.module.includes('Entitlement') ? 'days' : item.target > 10 ? 'days' : 'days'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${item.improvement}%`}
                            size="small"
                            color="success"
                            variant="tonal"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ width: 200 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(progressToTarget, 100)}
                            sx={{ height: 8, borderRadius: 4 }}
                            color={isAhead ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={isAhead ? 'Ahead' : 'On Track'}
                            size="small"
                            color={isAhead ? 'success' : 'info'}
                            variant="tonal"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Key Insights */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Key Performance Insights
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 2, borderLeft: '4px solid', borderColor: 'success.main' }}>
                  <Typography variant="body2" fontWeight="bold" color="success.dark" className="mb-1">
                    Zero Default Track Record
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    $3B+ in originations with 0% default rate maintained across entire portfolio history
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 2, borderLeft: '4px solid', borderColor: 'info.main' }}>
                  <Typography variant="body2" fontWeight="bold" color="info.dark" className="mb-1">
                    Efficiency Gains
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    26% average cycle time reduction across all modules driven by process automation
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: 'warning.lighter', borderRadius: 2, borderLeft: '4px solid', borderColor: 'warning.main' }}>
                  <Typography variant="body2" fontWeight="bold" color="warning.dark" className="mb-1">
                    Growth Trajectory
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    22% YoY increase in originations with improved deal quality and larger average loan sizes
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
