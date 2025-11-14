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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment
} from '@mui/material'
import Link from 'next/link'

export default function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const leads = [
    {
      id: 1,
      address: '1234 Maple Street',
      city: 'Seattle',
      state: 'WA',
      price: '$2,450,000',
      agent: 'Sarah Johnson',
      status: 'In Review',
      score: 85,
      submitted: '2 hours ago'
    },
    {
      id: 2,
      address: '5678 Oak Avenue',
      city: 'Bellevue',
      state: 'WA',
      price: '$1,895,000',
      agent: 'Mike Anderson',
      status: 'Approved',
      score: 92,
      submitted: '1 day ago'
    },
    {
      id: 3,
      address: '910 Pine Road',
      city: 'Phoenix',
      state: 'AZ',
      price: '$1,250,000',
      agent: 'Jennifer Lee',
      status: 'Pending',
      score: 78,
      submitted: '3 hours ago'
    },
    {
      id: 4,
      address: '1122 Elm Court',
      city: 'Scottsdale',
      state: 'AZ',
      price: '$3,200,000',
      agent: 'David Martinez',
      status: 'Feasibility',
      score: 88,
      submitted: '2 days ago'
    },
    {
      id: 5,
      address: '3344 Cedar Lane',
      city: 'Seattle',
      state: 'WA',
      price: '$1,750,000',
      agent: 'Emily Chen',
      status: 'Passed',
      score: 42,
      submitted: '5 days ago'
    }
  ]

  const getStatusColor = status => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'In Review':
        return 'warning'
      case 'Pending':
        return 'info'
      case 'Feasibility':
        return 'primary'
      case 'Passed':
        return 'error'
      default:
        return 'default'
    }
  }

  const getScoreColor = score => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'error'
  }

  return (
    <div>
      {/* Page Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold mb-2">
            Lead Intake
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and review incoming project leads
          </Typography>
        </Box>
        <Link href="/leads/new" passHref>
          <Button variant="contained" startIcon={<i className="ri-add-line" />}>
            Submit New Lead
          </Button>
        </Link>
      </Box>

      {/* Filters and Search */}
      <Card className="mb-4">
        <CardContent>
          <Box className="flex gap-4 items-center flex-wrap">
            <TextField
              placeholder="Search by address, agent..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              size="small"
              className="flex-1 min-w-[250px]"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="ri-search-line" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" className="min-w-[150px]">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-review">In Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="feasibility">Feasibility</MenuItem>
                <MenuItem value="passed">Passed</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<i className="ri-filter-line" />}>
              More Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>AI Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map(lead => (
                <TableRow key={lead.id} hover className="cursor-pointer">
                  <TableCell>
                    <Link href={`/leads/${lead.id}`} className="no-underline">
                      <Typography variant="body2" className="font-medium hover:text-primary">
                        {lead.address}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lead.city}, {lead.state}
                      </Typography>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{lead.agent}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" className="font-medium">
                      {lead.price}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={lead.score} size="small" color={getScoreColor(lead.score)} variant="tonal" />
                  </TableCell>
                  <TableCell>
                    <Chip label={lead.status} size="small" color={getStatusColor(lead.status)} variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {lead.submitted}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <i className="ri-eye-line" />
                    </IconButton>
                    <IconButton size="small">
                      <i className="ri-more-2-line" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  )
}
