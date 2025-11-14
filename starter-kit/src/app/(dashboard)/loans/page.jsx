'use client'

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
  Avatar,
  LinearProgress,
  Grid
} from '@mui/material'

export default function LoansPage() {
  const loans = [
    {
      id: 4523,
      projectName: 'Greenwood Estates',
      borrower: 'ABC Development LLC',
      amount: '$4,200,000',
      funded: '$2,800,000',
      remaining: '$1,400,000',
      drawProgress: 67,
      status: 'Active',
      rate: '8.5%',
      maturity: '12/15/2025',
      nextDraw: '11/30/2024',
      builder: 'Premier Builders Inc'
    },
    {
      id: 4521,
      projectName: 'Madison Park Homes',
      borrower: 'Park Dev Partners',
      amount: '$3,850,000',
      funded: '$3,200,000',
      remaining: '$650,000',
      drawProgress: 83,
      status: 'Active',
      rate: '8.75%',
      maturity: '10/30/2025',
      nextDraw: '12/05/2024',
      builder: 'Apex Construction'
    },
    {
      id: 4519,
      projectName: 'Capitol Hill Residences',
      borrower: 'Hill Properties LLC',
      amount: '$5,100,000',
      funded: '$1,200,000',
      remaining: '$3,900,000',
      drawProgress: 24,
      status: 'Active',
      rate: '8.25%',
      maturity: '03/15/2026',
      nextDraw: '12/15/2024',
      builder: 'Skyline Builders'
    },
    {
      id: 4515,
      projectName: 'Ballard Commons',
      borrower: 'Ballard Dev Group',
      amount: '$2,950,000',
      funded: '$2,950,000',
      remaining: '$0',
      drawProgress: 100,
      status: 'Matured',
      rate: '8.0%',
      maturity: '11/01/2024',
      nextDraw: 'N/A',
      builder: 'Harbor Construction'
    }
  ]

  const getStatusColor = status => {
    switch (status) {
      case 'Active':
        return 'success'
      case 'Matured':
        return 'info'
      case 'Delinquent':
        return 'error'
      case 'Pending':
        return 'warning'
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
            Loan Portfolio
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage active construction loans and servicing
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<i className="ri-add-line" />}>
          New Loan
        </Button>
      </Box>

      {/* Portfolio Stats */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Total Portfolio
              </Typography>
              <Typography variant="h4" className="font-bold">
                $142M
              </Typography>
              <Chip label="28 Active Loans" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Outstanding Balance
              </Typography>
              <Typography variant="h4" className="font-bold">
                $94M
              </Typography>
              <Chip label="66% Funded" size="small" color="info" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Avg Yield
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
                Pending Draws
              </Typography>
              <Typography variant="h4" className="font-bold">
                18
              </Typography>
              <Chip label="$12.4M requested" size="small" color="warning" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loans Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-4">
            Active Loans
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Loan #</TableCell>
                  <TableCell>Project / Borrower</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Draw Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Maturity</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loans.map(loan => (
                  <TableRow key={loan.id} hover className="cursor-pointer">
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        #{loan.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Rate: {loan.rate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" className="font-medium">
                          {loan.projectName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {loan.borrower}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" className="font-bold">
                          {loan.amount}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Funded: {loan.funded}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="min-w-[150px]">
                        <Box className="flex items-center justify-between mb-1">
                          <Typography variant="caption">{loan.drawProgress}% complete</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {loan.remaining} left
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={loan.drawProgress}
                          className="h-2 rounded"
                          color={loan.drawProgress >= 80 ? 'success' : loan.drawProgress >= 50 ? 'info' : 'warning'}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={loan.status} size="small" color={getStatusColor(loan.status)} variant="tonal" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{loan.maturity}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Next draw: {loan.nextDraw}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" size="small">
                        View Details
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
