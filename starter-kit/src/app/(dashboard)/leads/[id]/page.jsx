'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

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
  Avatar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab'

export default function LeadDetailPage({ params }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [internalNote, setInternalNote] = useState('')

  const [internalNotes, setInternalNotes] = useState([
    {
      id: 1,
      author: 'Mike Anderson',
      content: 'Good potential, needs zoning verification before moving forward.',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      author: 'Jessica Chen',
      content: 'Similar property in area closed for $2.8M last quarter. Pricing looks competitive.',
      timestamp: '1 hour ago'
    }
  ])

  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [showPassDialog, setShowPassDialog] = useState(false)

  const leadData = {
    id: params?.id || 1,
    address: '1234 Maple Street',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    purchasePrice: '$2,450,000',
    listPrice: '$2,750,000',
    propertyType: 'Single Family',
    lotSize: '12,000 sq ft',
    status: 'In Review',
    score: 85,
    agent: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@realestate.com',
      phone: '(206) 555-1234',
      company: 'Premier Realty'
    },
    dateSubmitted: '2024-11-14',
    assignedTo: 'Mike Anderson',
    notes:
      'Great location in desirable neighborhood. Property has existing single-family residence. Zoning allows for subdivision potential. Close to schools and parks.'
  }

  const activity = [
    {
      type: 'created',
      user: 'System',
      action: 'Lead submitted by Sarah Johnson',
      time: '2 hours ago',
      icon: 'ri-add-circle-line',
      color: 'primary'
    },
    {
      type: 'assigned',
      user: 'System',
      action: 'Automatically assigned to Mike Anderson',
      time: '2 hours ago',
      icon: 'ri-user-line',
      color: 'info'
    },
    {
      type: 'ai-scored',
      user: 'AI System',
      action: 'Priority score calculated: 85/100',
      time: '2 hours ago',
      icon: 'ri-lightbulb-line',
      color: 'success'
    },
    {
      type: 'reviewed',
      user: 'Mike Anderson',
      action: 'Reviewed property details',
      time: '1 hour ago',
      icon: 'ri-eye-line',
      color: 'primary'
    },
    {
      type: 'note',
      user: 'Mike Anderson',
      action: 'Added internal note',
      time: '1 hour ago',
      icon: 'ri-file-text-line',
      color: 'warning'
    },
    {
      type: 'note',
      user: 'Jessica Chen',
      action: 'Added market comparison note',
      time: '1 hour ago',
      icon: 'ri-file-text-line',
      color: 'warning'
    },
    {
      type: 'status',
      user: 'Mike Anderson',
      action: 'Status changed to "In Review"',
      time: '45 minutes ago',
      icon: 'ri-refresh-line',
      color: 'info'
    }
  ]

  const documents = [
    {
      id: 1,
      name: 'Property Photos.zip',
      size: '24 MB',
      type: 'image/zip',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2 hours ago'
    },
    {
      id: 2,
      name: 'Listing Sheet.pdf',
      size: '1.2 MB',
      type: 'application/pdf',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2 hours ago'
    },
    {
      id: 3,
      name: 'Preliminary Title Report.pdf',
      size: '856 KB',
      type: 'application/pdf',
      uploadedBy: 'Mike Anderson',
      uploadedAt: '1 hour ago'
    }
  ]

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

  const formatDate = dateString => {
    const date = new Date(dateString)

    
return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const handleAddNote = () => {
    if (internalNote.trim()) {
      const newNote = {
        id: internalNotes.length + 1,
        author: 'Mike Anderson',
        content: internalNote,
        timestamp: 'Just now'
      }

      setInternalNotes([newNote, ...internalNotes])
      setInternalNote('')
    }
  }

  const handleMoveToFeasibility = () => {
    console.log('Moving to Feasibility:', leadData.id)
    setShowMoveDialog(false)
    router.push('/feasibility')
  }

  const handlePass = () => {
    console.log('Passing on lead:', leadData.id)
    setShowPassDialog(false)
    router.push('/leads')
  }

  return (
    <div>
      {/* Move to Feasibility Dialog */}
      <Dialog open={showMoveDialog} onClose={() => setShowMoveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Move to Feasibility?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will move the lead to the Feasibility stage and create a new project. The acquisitions team will be
            notified.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMoveDialog(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleMoveToFeasibility}>
            Move to Feasibility
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pass Dialog */}
      <Dialog open={showPassDialog} onClose={() => setShowPassDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Pass on this Lead?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" className="mb-3">
            This will mark the lead as &quot;Passed&quot; and notify the agent. Are you sure?
          </Typography>
          <TextField fullWidth label="Reason (Optional)" multiline rows={3} placeholder="Enter reason for passing..." />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPassDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handlePass}>
            Pass on Lead
          </Button>
        </DialogActions>
      </Dialog>

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
        <Box className="flex justify-between items-start flex-wrap gap-4">
          <Box>
            <Box className="flex items-center gap-3 mb-2 flex-wrap">
              <Typography variant="h4" className="font-bold">
                {leadData.address}
              </Typography>
              <Chip label={leadData.status} color={getStatusColor(leadData.status)} variant="outlined" />
              <Chip label={`Score: ${leadData.score}`} color="success" variant="tonal" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {leadData.city}, {leadData.state} {leadData.zipCode} • Submitted {formatDate(leadData.dateSubmitted)}
            </Typography>
          </Box>
          <Box className="flex gap-2 flex-wrap">
            <Button variant="outlined" startIcon={<i className="ri-edit-line" />}>
              Edit
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<i className="ri-arrow-right-line" />}
              onClick={() => setShowMoveDialog(true)}
            >
              Move to Feasibility
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<i className="ri-close-line" />}
              onClick={() => setShowPassDialog(true)}
            >
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
                <Tab label="Overview" />
                <Tab label="Documents" />
                <Tab label="Activity" />
                <Tab label="Internal Notes" />
              </Tabs>
            </Box>

            <CardContent>
              {/* Overview Tab */}
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
                        Purchase Price
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {leadData.purchasePrice}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        List Price
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {leadData.listPrice}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Property Type
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {leadData.propertyType}
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

                  {/* Map Placeholder */}
                  <Box className="mb-6">
                    <Typography variant="h6" className="font-semibold mb-3">
                      Location
                    </Typography>
                    <Box
                      className="w-full h-64 bg-gray-200 rounded flex items-center justify-center"
                      sx={{ backgroundColor: 'var(--mui-palette-action-hover)' }}
                    >
                      <Box className="text-center">
                        <i className="ri-map-pin-line text-6xl text-gray-400 mb-2" />
                        <Typography variant="body2" color="text.secondary">
                          Map Preview
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {leadData.address}, {leadData.city}, {leadData.state}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

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
                        <a href={`mailto:${leadData.agent.email}`} className="text-primary no-underline hover:underline">
                          {leadData.agent.email}
                        </a>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        <a href={`tel:${leadData.agent.phone}`} className="text-primary no-underline hover:underline">
                          {leadData.agent.phone}
                        </a>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Documents Tab */}
              {activeTab === 1 && (
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
                        key={doc.id}
                        className="border-b border-gray-200 last:border-0"
                        secondaryAction={
                          <Box className="flex gap-2">
                            <IconButton size="small" title="Download">
                              <i className="ri-download-line" />
                            </IconButton>
                            <IconButton size="small" title="Preview">
                              <i className="ri-eye-line" />
                            </IconButton>
                            <IconButton size="small" title="More options">
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
                  {documents.length === 0 && (
                    <Box className="text-center py-8">
                      <i className="ri-file-line text-6xl text-gray-400 mb-2" />
                      <Typography variant="body2" color="text.secondary">
                        No documents uploaded yet
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Activity Tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" className="font-semibold mb-4">
                    Activity Timeline
                  </Typography>
                  <Timeline>
                    {activity.map((item, index) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator>
                          <TimelineDot color={item.color}>
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

              {/* Internal Notes Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" className="font-semibold mb-4">
                    Internal Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="mb-4">
                    These notes are only visible to internal team members and will not be shared with the agent.
                  </Typography>

                  {/* Add Note Form */}
                  <Card variant="outlined" className="mb-4">
                    <CardContent>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Add a note for your team..."
                        value={internalNote}
                        onChange={e => setInternalNote(e.target.value)}
                        className="mb-3"
                      />
                      <Box className="flex justify-end">
                        <Button variant="contained" onClick={handleAddNote} disabled={!internalNote.trim()}>
                          Add Note
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Notes List */}
                  <Box className="space-y-3">
                    {internalNotes.map(note => (
                      <Card key={note.id} variant="outlined">
                        <CardContent>
                          <Box className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">{note.author.split(' ').map(n => n[0]).join('')}</Avatar>
                            <Box className="flex-1">
                              <Box className="flex justify-between items-start mb-1">
                                <Typography variant="body2" className="font-medium">
                                  {note.author}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {note.timestamp}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {note.content}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
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
                    Priority Score
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
                    <Chip label="Prime Location" size="small" color="success" variant="outlined" className="mr-2" />
                    <Chip label="Good Price Point" size="small" color="success" variant="outlined" className="mr-2" />
                    <Chip label="Zoning Favorable" size="small" color="info" variant="outlined" className="mr-2" />
                    <Chip label="Strong Market" size="small" color="success" variant="outlined" />
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary" className="uppercase mb-2">
                    AI Insights
                  </Typography>
                  <Typography variant="body2" className="mt-2">
                    Similar properties in this area have sold for an average of $2.6M. The purchase price shows good
                    margin potential.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-3">
                Assignment
              </Typography>
              <Box className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12">MA</Avatar>
                <Box>
                  <Typography variant="body2" className="font-medium">
                    {leadData.assignedTo}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Acquisitions Specialist
                  </Typography>
                </Box>
              </Box>
              <Button fullWidth variant="outlined" size="small" startIcon={<i className="ri-user-line" />}>
                Reassign
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-3">
                Quick Actions
              </Typography>
              <Box className="space-y-2">
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<i className="ri-mail-line" />}
                  href={`mailto:${leadData.agent.email}`}
                >
                  Email Agent
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<i className="ri-phone-line" />}
                  href={`tel:${leadData.agent.phone}`}
                >
                  Call Agent
                </Button>
                <Button fullWidth variant="outlined" startIcon={<i className="ri-printer-line" />}>
                  Print Summary
                </Button>
                <Button fullWidth variant="outlined" startIcon={<i className="ri-share-line" />}>
                  Share
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
