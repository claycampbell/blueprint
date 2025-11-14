'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Divider,
  Tab,
  Tabs,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Avatar,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material'
import { useRouter } from 'next/navigation'

export default function LeadDetailPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)

  const leadData = {
    id: 1,
    address: '1234 Maple Street',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    price: '$2,450,000',
    lotSize: '12,000 sq ft',
    status: 'In Review',
    score: 85,
    agent: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@realestate.com',
      phone: '(206) 555-1234',
      company: 'Premier Realty'
    },
    submitted: '2 hours ago',
    assignedTo: 'Mike Anderson',
    notes:
      'Great location in desirable neighborhood. Property has existing single-family residence. Zoning allows for subdivision potential.'
  }

  const activity = [
    { type: 'created', user: 'System', action: 'Lead submitted', time: '2 hours ago', icon: 'ri-add-circle-line' },
    {
      type: 'assigned',
      user: 'System',
      action: 'Assigned to Mike Anderson',
      time: '2 hours ago',
      icon: 'ri-user-line'
    },
    {
      type: 'reviewed',
      user: 'Mike Anderson',
      action: 'Reviewed property details',
      time: '1 hour ago',
      icon: 'ri-eye-line'
    },
    {
      type: 'note',
      user: 'Mike Anderson',
      action: 'Added internal note: "Good potential, needs zoning verification"',
      time: '1 hour ago',
      icon: 'ri-file-text-line'
    }
  ]

  const documents = [
    { name: 'Property Photos.zip', size: '24 MB', uploadedBy: 'Sarah Johnson', uploadedAt: '2 hours ago' },
    { name: 'Listing Sheet.pdf', size: '1.2 MB', uploadedBy: 'Sarah Johnson', uploadedAt: '2 hours ago' }
  ]

  return (
    <div>
      {/* Page Header */}
      <Box className="mb-6">
        <Box className="flex items-center gap-2 mb-2">
          <Button
            variant="text"
            size="small"
            startIcon={<i className="ri-arrow-left-line" />}
            onClick={() => router.back()}
          >
            Back to Leads
          </Button>
        </Box>
        <Box className="flex justify-between items-start">
          <Box>
            <Box className="flex items-center gap-3 mb-2">
              <Typography variant="h4" className="font-bold">
                {leadData.address}
              </Typography>
              <Chip label={leadData.status} color="warning" variant="outlined" />
              <Chip label={`Score: ${leadData.score}`} color="success" variant="tonal" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {leadData.city}, {leadData.state} {leadData.zipCode} • Submitted {leadData.submitted}
            </Typography>
          </Box>
          <Box className="flex gap-2">
            <Button variant="outlined" startIcon={<i className="ri-edit-line" />}>
              Edit
            </Button>
            <Button variant="contained" color="success" startIcon={<i className="ri-check-line" />}>
              Approve
            </Button>
            <Button variant="outlined" color="error" startIcon={<i className="ri-close-line" />}>
              Pass
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Card>
            <Box className="border-b border-gray-200">
              <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                <Tab label="Details" />
                <Tab label="Activity" />
                <Tab label="Documents" />
              </Tabs>
            </Box>

            <CardContent>
              {/* Details Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" className="font-semibold mb-4">
                    Property Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {leadData.address}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        City, State, Zip
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {leadData.city}, {leadData.state} {leadData.zipCode}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Asking Price
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {leadData.price}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Lot Size
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {leadData.lotSize}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        Notes
                      </Typography>
                      <Typography variant="body2">{leadData.notes}</Typography>
                    </Grid>
                  </Grid>

                  <Divider className="my-6" />

                  <Typography variant="h6" className="font-semibold mb-4">
                    Agent Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Agent Name
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {leadData.agent.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Company
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {leadData.agent.company}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {leadData.agent.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {leadData.agent.phone}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Activity Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" className="font-semibold mb-4">
                    Activity Timeline
                  </Typography>
                  <Timeline>
                    {activity.map((item, index) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator>
                          <TimelineDot color="primary">
                            <i className={item.icon} />
                          </TimelineDot>
                          {index < activity.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Box className="pb-4">
                            <Typography variant="body2" className="font-medium">
                              {item.action}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.user} • {item.time}
                            </Typography>
                          </Box>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Box>
              )}

              {/* Documents Tab */}
              {activeTab === 2 && (
                <Box>
                  <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-semibold">
                      Documents
                    </Typography>
                    <Button variant="contained" size="small" startIcon={<i className="ri-upload-line" />}>
                      Upload
                    </Button>
                  </Box>
                  <List>
                    {documents.map((doc, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <Box className="flex gap-2">
                            <IconButton size="small">
                              <i className="ri-download-line" />
                            </IconButton>
                            <IconButton size="small">
                              <i className="ri-more-2-line" />
                            </IconButton>
                          </Box>
                        }
                      >
                        <Box className="flex items-center gap-3 flex-1">
                          <Avatar variant="rounded" className="bg-primary-light">
                            <i className="ri-file-line" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" className="font-medium">
                              {doc.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {doc.size} • Uploaded by {doc.uploadedBy} • {doc.uploadedAt}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-3">
                AI Analysis
              </Typography>
              <Box className="space-y-3">
                <Box>
                  <Typography variant="body2" className="font-medium mb-1">
                    Viability Score
                  </Typography>
                  <Box className="flex items-center gap-2">
                    <Box className="flex-1 h-2 bg-gray-200 rounded">
                      <Box className="h-full bg-success rounded" style={{ width: '85%' }} />
                    </Box>
                    <Typography variant="body2" className="font-bold">
                      85/100
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary" className="uppercase">
                    Key Factors
                  </Typography>
                  <Box className="mt-2 space-y-2">
                    <Chip label="Prime Location" size="small" color="success" variant="outlined" />
                    <Chip label="Good Price Point" size="small" color="success" variant="outlined" />
                    <Chip label="Zoning Favorable" size="small" color="info" variant="outlined" />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-3">
                Assignment
              </Typography>
              <Box className="flex items-center gap-3 mb-3">
                <Avatar>MA</Avatar>
                <Box>
                  <Typography variant="body2" className="font-medium">
                    {leadData.assignedTo}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Acquisitions Specialist
                  </Typography>
                </Box>
              </Box>
              <Button fullWidth variant="outlined" size="small">
                Reassign
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
