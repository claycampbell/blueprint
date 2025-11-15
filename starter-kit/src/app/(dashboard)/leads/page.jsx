'use client'

import { useState } from 'react'

import Link from 'next/link'

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

export default function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const leads = [
    {
      id: 1,
      address: '1234 Maple Street',
      city: 'Seattle',
      state: 'WA',
      price: '$2,450,000',
      agent: 'Sarah Johnson',
      assignedTo: 'Mike Anderson',
      status: 'In Review',
      score: 85,
      dateSubmitted: '2024-11-14'
    },
    {
      id: 2,
      address: '5678 Oak Avenue',
      city: 'Bellevue',
      state: 'WA',
      price: '$1,895,000',
      agent: 'Robert Williams',
      assignedTo: 'Jessica Chen',
      status: 'Approved',
      score: 92,
      dateSubmitted: '2024-11-13'
    },
    {
      id: 3,
      address: '910 Pine Road',
      city: 'Phoenix',
      state: 'AZ',
      price: '$1,250,000',
      agent: 'Jennifer Lee',
      assignedTo: 'Mike Anderson',
      status: 'New',
      score: 78,
      dateSubmitted: '2024-11-14'
    },
    {
      id: 4,
      address: '1122 Elm Court',
      city: 'Scottsdale',
      state: 'AZ',
      price: '$3,200,000',
      agent: 'David Martinez',
      assignedTo: 'Tom Rodriguez',
      status: 'In Review',
      score: 88,
      dateSubmitted: '2024-11-12'
    },
    {
      id: 5,
      address: '3344 Cedar Lane',
      city: 'Seattle',
      state: 'WA',
      price: '$1,750,000',
      agent: 'Emily Chen',
      assignedTo: 'Jessica Chen',
      status: 'Passed',
      score: 42,
      dateSubmitted: '2024-11-09'
    },
    {
      id: 6,
      address: '7890 Sunset Boulevard',
      city: 'Phoenix',
      state: 'AZ',
      price: '$2,950,000',
      agent: 'Marcus Johnson',
      assignedTo: 'Tom Rodriguez',
      status: 'Approved',
      score: 91,
      dateSubmitted: '2024-11-11'
    },
    {
      id: 7,
      address: '2468 Lake Drive',
      city: 'Bellevue',
      state: 'WA',
      price: '$3,450,000',
      agent: 'Sarah Johnson',
      assignedTo: 'Mike Anderson',
      status: 'In Review',
      score: 87,
      dateSubmitted: '2024-11-13'
    },
    {
      id: 8,
      address: '1357 Highland Avenue',
      city: 'Seattle',
      state: 'WA',
      price: '$1,675,000',
      agent: 'Amanda Davis',
      assignedTo: 'Jessica Chen',
      status: 'New',
      score: 76,
      dateSubmitted: '2024-11-14'
    },
    {
      id: 9,
      address: '9753 Desert Vista',
      city: 'Scottsdale',
      state: 'AZ',
      price: '$4,100,000',
      agent: 'Jennifer Lee',
      assignedTo: 'Tom Rodriguez',
      status: 'In Review',
      score: 94,
      dateSubmitted: '2024-11-10'
    },
    {
      id: 10,
      address: '8642 Park Place',
      city: 'Seattle',
      state: 'WA',
      price: '$2,100,000',
      agent: 'Robert Williams',
      assignedTo: 'Mike Anderson',
      status: 'New',
      score: 81,
      dateSubmitted: '2024-11-14'
    },
    {
      id: 11,
      address: '5531 Mountain View Road',
      city: 'Phoenix',
      state: 'AZ',
      price: '$1,550,000',
      agent: 'David Martinez',
      assignedTo: 'Tom Rodriguez',
      status: 'Passed',
      score: 53,
      dateSubmitted: '2024-11-08'
    },
    {
      id: 12,
      address: '3210 Harbor Lane',
      city: 'Bellevue',
      state: 'WA',
      price: '$2,800,000',
      agent: 'Emily Chen',
      assignedTo: 'Jessica Chen',
      status: 'Approved',
      score: 89,
      dateSubmitted: '2024-11-12'
    },
    {
      id: 13,
      address: '6543 Riverfront Drive',
      city: 'Seattle',
      state: 'WA',
      price: '$3,750,000',
      agent: 'Marcus Johnson',
      assignedTo: 'Mike Anderson',
      status: 'In Review',
      score: 93,
      dateSubmitted: '2024-11-11'
    },
    {
      id: 14,
      address: '4321 Canyon Road',
      city: 'Scottsdale',
      state: 'AZ',
      price: '$2,200,000',
      agent: 'Sarah Johnson',
      assignedTo: 'Tom Rodriguez',
      status: 'New',
      score: 79,
      dateSubmitted: '2024-11-14'
    },
    {
      id: 15,
      address: '7654 Woodland Court',
      city: 'Bellevue',
      state: 'WA',
      price: '$1,950,000',
      agent: 'Amanda Davis',
      assignedTo: 'Jessica Chen',
      status: 'Passed',
      score: 48,
      dateSubmitted: '2024-11-07'
    }
  ]

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || lead.status.toLowerCase().replace(' ', '-') === statusFilter
    const matchesCity = cityFilter === 'all' || lead.city === cityFilter

    return matchesSearch && matchesStatus && matchesCity
  })

  const getStatusColor = status => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'In Review':
        return 'warning'
      case 'New':
        return 'info'
      case 'Passed':
        return 'error'
      default:
        return 'default'
    }
  }

  const getScoreColor = score => {
    if (score >= 85) return 'success'
    if (score >= 70) return 'warning'
    
return 'error'
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="in-review">In Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="passed">Passed</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" className="min-w-[150px]">
              <InputLabel>City</InputLabel>
              <Select value={cityFilter} onChange={e => setCityFilter(e.target.value)} label="City">
                <MenuItem value="all">All Cities</MenuItem>
                <MenuItem value="Seattle">Seattle</MenuItem>
                <MenuItem value="Bellevue">Bellevue</MenuItem>
                <MenuItem value="Phoenix">Phoenix</MenuItem>
                <MenuItem value="Scottsdale">Scottsdale</MenuItem>
              </Select>
            </FormControl>
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
                <TableCell>City</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Date Submitted</TableCell>
                <TableCell>Priority Score</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" className="py-8">
                      No leads found matching your filters
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map(lead => (
                  <TableRow
                    key={lead.id}
                    hover
                    className="cursor-pointer"
                    onClick={() => (window.location.href = `/leads/${lead.id}`)}
                  >
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {lead.address}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lead.price}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {lead.city}, {lead.state}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={lead.status} size="small" color={getStatusColor(lead.status)} variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{lead.agent}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{lead.assignedTo}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(lead.dateSubmitted)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={lead.score} size="small" color={getScoreColor(lead.score)} variant="tonal" />
                    </TableCell>
                    <TableCell align="right" onClick={e => e.stopPropagation()}>
                      <IconButton size="small" color="primary" href={`/leads/${lead.id}`}>
                        <i className="ri-eye-line" />
                      </IconButton>
                      <IconButton size="small">
                        <i className="ri-more-2-line" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  )
}
