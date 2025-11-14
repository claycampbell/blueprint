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
  Grid,
  Avatar,
  IconButton,
  InputAdornment
} from '@mui/material'

export default function ContactsPage() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const contacts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      type: 'Agent',
      company: 'Premier Realty',
      email: 'sarah.j@premierrealty.com',
      phone: '(206) 555-1234',
      location: 'Seattle, WA',
      activeDeals: 8,
      totalDeals: 24,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Premier Builders Inc',
      type: 'Builder',
      company: 'Premier Builders Inc',
      email: 'contact@premierbuilders.com',
      phone: '(206) 555-5678',
      location: 'Bellevue, WA',
      activeDeals: 5,
      totalDeals: 18,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Mike Anderson',
      type: 'Borrower',
      company: 'ABC Development LLC',
      email: 'mike@abcdev.com',
      phone: '(425) 555-9012',
      location: 'Seattle, WA',
      activeDeals: 2,
      totalDeals: 6,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Pacific Title Company',
      type: 'Consultant',
      company: 'Pacific Title Company',
      email: 'service@pactitle.com',
      phone: '(206) 555-3456',
      location: 'Seattle, WA',
      activeDeals: 12,
      totalDeals: 45,
      status: 'Active'
    },
    {
      id: 5,
      name: 'Jennifer Lee',
      type: 'Agent',
      company: 'Elite Realty Group',
      email: 'jlee@eliterealty.com',
      phone: '(602) 555-7890',
      location: 'Phoenix, AZ',
      activeDeals: 6,
      totalDeals: 19,
      status: 'Active'
    },
    {
      id: 6,
      name: 'Apex Construction',
      type: 'Builder',
      company: 'Apex Construction',
      email: 'info@apexconstruct.com',
      phone: '(425) 555-2345',
      location: 'Bellevue, WA',
      activeDeals: 3,
      totalDeals: 11,
      status: 'Active'
    }
  ]

  const getTypeColor = type => {
    switch (type) {
      case 'Agent':
        return 'primary'
      case 'Builder':
        return 'success'
      case 'Borrower':
        return 'warning'
      case 'Consultant':
        return 'info'
      default:
        return 'default'
    }
  }

  const getTypeIcon = type => {
    switch (type) {
      case 'Agent':
        return 'ri-user-line'
      case 'Builder':
        return 'ri-hammer-line'
      case 'Borrower':
        return 'ri-money-dollar-circle-line'
      case 'Consultant':
        return 'ri-briefcase-line'
      default:
        return 'ri-user-line'
    }
  }

  return (
    <div>
      {/* Page Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold mb-2">
            Contacts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage agents, builders, borrowers, and consultants
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<i className="ri-add-line" />}>
          Add Contact
        </Button>
      </Box>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent>
          <Box className="flex gap-4 items-center flex-wrap">
            <TextField
              placeholder="Search contacts..."
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
              <InputLabel>Type</InputLabel>
              <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} label="Type">
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="agent">Agents</MenuItem>
                <MenuItem value="builder">Builders</MenuItem>
                <MenuItem value="borrower">Borrowers</MenuItem>
                <MenuItem value="consultant">Consultants</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<i className="ri-filter-line" />}>
              More Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Contacts Grid */}
      <Grid container spacing={4}>
        {contacts.map(contact => (
          <Grid item xs={12} sm={6} lg={4} key={contact.id}>
            <Card className="h-full">
              <CardContent>
                <Box className="flex items-start justify-between mb-3">
                  <Box className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">{contact.name.split(' ').map(n => n[0]).join('')}</Avatar>
                    <Box>
                      <Typography variant="body1" className="font-semibold">
                        {contact.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contact.company}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="small">
                    <i className="ri-more-2-line" />
                  </IconButton>
                </Box>

                <Box className="mb-3">
                  <Chip
                    label={contact.type}
                    size="small"
                    color={getTypeColor(contact.type)}
                    variant="tonal"
                    icon={<i className={getTypeIcon(contact.type)} />}
                  />
                </Box>

                <Box className="space-y-2 mb-4">
                  <Box className="flex items-center gap-2">
                    <i className="ri-mail-line text-gray-500" />
                    <Typography variant="body2" color="text.secondary">
                      {contact.email}
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <i className="ri-phone-line text-gray-500" />
                    <Typography variant="body2" color="text.secondary">
                      {contact.phone}
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <i className="ri-map-pin-line text-gray-500" />
                    <Typography variant="body2" color="text.secondary">
                      {contact.location}
                    </Typography>
                  </Box>
                </Box>

                <Box className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Active Deals
                    </Typography>
                    <Typography variant="h6" className="font-bold">
                      {contact.activeDeals}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Deals
                    </Typography>
                    <Typography variant="h6" className="font-bold">
                      {contact.totalDeals}
                    </Typography>
                  </Box>
                  <Button variant="outlined" size="small">
                    View
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}
