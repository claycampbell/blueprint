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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Avatar,
  AvatarGroup,
  Paper
} from '@mui/material'

// Mock data for entitlement projects
const initialProjects = [
  {
    id: 1,
    address: '1234 Pine Street, Seattle, WA',
    permitNumber: 'SEA-2024-00156',
    status: 'Planning',
    daysInStage: 12,
    consultants: ['Smith Engineering', 'Green Architects'],
    submitDate: null,
    jurisdiction: 'City of Seattle',
    tasks: [
      { id: 1, name: 'Survey revisions', assignedTo: 'Smith Engineering', status: 'In Progress', dueDate: '2024-11-20' },
      { id: 2, name: 'Civil drawings', assignedTo: 'Smith Engineering', status: 'Pending', dueDate: '2024-11-25' }
    ],
    corrections: [],
    documents: ['Survey Report.pdf', 'Preliminary Site Plan.pdf'],
    timeline: [
      { date: '2024-11-02', event: 'Project initiated', type: 'status' },
      { date: '2024-11-05', event: 'Survey ordered from Smith Engineering', type: 'task' }
    ]
  },
  {
    id: 2,
    address: '5678 Oak Avenue, Bellevue, WA',
    permitNumber: 'BEL-2024-00289',
    status: 'Submitted',
    daysInStage: 8,
    consultants: ['West Coast Civil', 'Urban Design Group', 'Green Architects'],
    submitDate: '2024-11-06',
    jurisdiction: 'City of Bellevue',
    tasks: [
      { id: 1, name: 'Civil engineering drawings', assignedTo: 'West Coast Civil', status: 'Complete', dueDate: '2024-11-05' },
      { id: 2, name: 'Architectural plans', assignedTo: 'Green Architects', status: 'Complete', dueDate: '2024-11-05' }
    ],
    corrections: [],
    documents: ['Complete Permit Packet.pdf', 'Civil Drawings.pdf', 'Architectural Plans.pdf', 'SEPA Checklist.pdf'],
    timeline: [
      { date: '2024-10-15', event: 'Project initiated', type: 'status' },
      { date: '2024-10-20', event: 'All consultants assigned', type: 'task' },
      { date: '2024-11-05', event: 'All documents complete', type: 'document' },
      { date: '2024-11-06', event: 'Submitted to City of Bellevue', type: 'status' }
    ]
  },
  {
    id: 3,
    address: '910 Maple Drive, Seattle, WA',
    permitNumber: 'SEA-2024-00201',
    status: 'Under Review',
    daysInStage: 23,
    consultants: ['Pacific Engineering', 'Northwest Architects'],
    submitDate: '2024-10-22',
    jurisdiction: 'City of Seattle',
    tasks: [
      { id: 1, name: 'Civil engineering drawings', assignedTo: 'Pacific Engineering', status: 'Complete', dueDate: '2024-10-18' },
      { id: 2, name: 'Architectural plans', assignedTo: 'Northwest Architects', status: 'Complete', dueDate: '2024-10-20' }
    ],
    corrections: [],
    documents: ['Complete Permit Packet.pdf', 'Civil Drawings.pdf', 'Architectural Plans.pdf', 'Traffic Study.pdf'],
    timeline: [
      { date: '2024-10-01', event: 'Project initiated', type: 'status' },
      { date: '2024-10-22', event: 'Submitted to City of Seattle', type: 'status' },
      { date: '2024-10-25', event: 'Assigned to city reviewer', type: 'status' }
    ]
  },
  {
    id: 4,
    address: '2468 Cedar Lane, Redmond, WA',
    permitNumber: 'RED-2024-00145',
    status: 'Under Review',
    daysInStage: 35,
    consultants: ['Smith Engineering', 'Modern Design Studio'],
    submitDate: '2024-10-10',
    jurisdiction: 'City of Redmond',
    tasks: [
      { id: 1, name: 'Survey revisions', assignedTo: 'Smith Engineering', status: 'Complete', dueDate: '2024-10-08' },
      { id: 2, name: 'Landscape plans', assignedTo: 'Modern Design Studio', status: 'Complete', dueDate: '2024-10-09' }
    ],
    corrections: [],
    documents: ['Complete Permit Packet.pdf', 'Survey.pdf', 'Landscape Plans.pdf', 'Drainage Report.pdf'],
    timeline: [
      { date: '2024-09-20', event: 'Project initiated', type: 'status' },
      { date: '2024-10-10', event: 'Submitted to City of Redmond', type: 'status' },
      { date: '2024-10-15', event: 'Under review by planning department', type: 'status' }
    ]
  },
  {
    id: 5,
    address: '1357 Birch Court, Seattle, WA',
    permitNumber: 'SEA-2024-00178',
    status: 'Corrections',
    daysInStage: 14,
    consultants: ['West Coast Civil', 'Green Architects', 'Environmental Solutions'],
    submitDate: '2024-09-15',
    jurisdiction: 'City of Seattle',
    tasks: [
      { id: 1, name: 'Stormwater revisions', assignedTo: 'West Coast Civil', status: 'In Progress', dueDate: '2024-11-18' },
      { id: 2, name: 'Tree retention plan update', assignedTo: 'Environmental Solutions', status: 'In Progress', dueDate: '2024-11-20' },
      { id: 3, name: 'Updated elevations', assignedTo: 'Green Architects', status: 'Pending', dueDate: '2024-11-22' }
    ],
    corrections: [
      {
        id: 1,
        number: 1,
        dateReceived: '2024-10-01',
        cityFeedback: 'Stormwater management plan needs revision per code 22.805',
        actionItems: 'Update drainage calculations, revise detention pond sizing',
        status: 'In Progress',
        resolvedDate: null
      },
      {
        id: 2,
        number: 2,
        dateReceived: '2024-10-31',
        cityFeedback: 'Tree retention plan incomplete, missing tree #14-18',
        actionItems: 'Complete arborist report, update tree protection plan',
        status: 'In Progress',
        resolvedDate: null
      }
    ],
    documents: [
      'Original Permit Packet.pdf',
      'City Correction Letter - Round 1.pdf',
      'City Correction Letter - Round 2.pdf',
      'Stormwater Report - Rev A.pdf'
    ],
    timeline: [
      { date: '2024-09-01', event: 'Project initiated', type: 'status' },
      { date: '2024-09-15', event: 'Submitted to City of Seattle', type: 'status' },
      { date: '2024-10-01', event: 'Correction cycle 1 received', type: 'correction' },
      { date: '2024-10-31', event: 'Correction cycle 2 received', type: 'correction' }
    ]
  },
  {
    id: 6,
    address: '7890 Elm Street, Bellevue, WA',
    permitNumber: 'BEL-2024-00234',
    status: 'Corrections',
    daysInStage: 7,
    consultants: ['Pacific Engineering', 'Urban Design Group'],
    submitDate: '2024-10-01',
    jurisdiction: 'City of Bellevue',
    tasks: [
      { id: 1, name: 'Traffic study addendum', assignedTo: 'Pacific Engineering', status: 'In Progress', dueDate: '2024-11-16' }
    ],
    corrections: [
      {
        id: 1,
        number: 1,
        dateReceived: '2024-11-07',
        cityFeedback: 'Traffic study needs to include weekend peak hour analysis',
        actionItems: 'Conduct additional traffic counts, update TIA report',
        status: 'In Progress',
        resolvedDate: null
      }
    ],
    documents: ['Original Permit Packet.pdf', 'City Correction Letter.pdf', 'Traffic Impact Analysis.pdf'],
    timeline: [
      { date: '2024-09-15', event: 'Project initiated', type: 'status' },
      { date: '2024-10-01', event: 'Submitted to City of Bellevue', type: 'status' },
      { date: '2024-11-07', event: 'Correction cycle 1 received', type: 'correction' }
    ]
  },
  {
    id: 7,
    address: '3579 Willow Way, Kirkland, WA',
    permitNumber: 'KIR-2024-00092',
    status: 'Approved',
    daysInStage: 3,
    consultants: ['Smith Engineering', 'Northwest Architects'],
    submitDate: '2024-08-20',
    jurisdiction: 'City of Kirkland',
    tasks: [
      { id: 1, name: 'Civil engineering drawings', assignedTo: 'Smith Engineering', status: 'Complete', dueDate: '2024-08-15' },
      { id: 2, name: 'Architectural plans', assignedTo: 'Northwest Architects', status: 'Complete', dueDate: '2024-08-18' }
    ],
    corrections: [
      {
        id: 1,
        number: 1,
        dateReceived: '2024-09-10',
        cityFeedback: 'Minor grading plan adjustments needed',
        actionItems: 'Update grading to match city standards',
        status: 'Resolved',
        resolvedDate: '2024-09-18'
      }
    ],
    documents: ['Complete Permit Packet.pdf', 'Approval Letter.pdf', 'Issued Permits.pdf'],
    timeline: [
      { date: '2024-08-01', event: 'Project initiated', type: 'status' },
      { date: '2024-08-20', event: 'Submitted to City of Kirkland', type: 'status' },
      { date: '2024-09-10', event: 'Correction cycle 1 received', type: 'correction' },
      { date: '2024-09-20', event: 'Corrections resubmitted', type: 'status' },
      { date: '2024-11-11', event: 'Permit approved', type: 'status' }
    ]
  },
  {
    id: 8,
    address: '2468 Spruce Avenue, Seattle, WA',
    permitNumber: 'SEA-2024-00223',
    status: 'Approved',
    daysInStage: 5,
    consultants: ['West Coast Civil', 'Modern Design Studio'],
    submitDate: '2024-09-01',
    jurisdiction: 'City of Seattle',
    tasks: [
      { id: 1, name: 'Civil engineering drawings', assignedTo: 'West Coast Civil', status: 'Complete', dueDate: '2024-08-28' },
      { id: 2, name: 'Architectural plans', assignedTo: 'Modern Design Studio', status: 'Complete', dueDate: '2024-08-30' }
    ],
    corrections: [],
    documents: ['Complete Permit Packet.pdf', 'Approval Letter.pdf', 'Building Permits.pdf'],
    timeline: [
      { date: '2024-08-15', event: 'Project initiated', type: 'status' },
      { date: '2024-09-01', event: 'Submitted to City of Seattle', type: 'status' },
      { date: '2024-11-09', event: 'Permit approved', type: 'status' }
    ]
  }
]

const statusColumns = ['Planning', 'Submitted', 'Under Review', 'Corrections', 'Approved']

const getStatusColor = status => {
  switch (status) {
    case 'Approved':
      return 'success'
    case 'Under Review':
      return 'info'
    case 'Corrections':
      return 'warning'
    case 'Submitted':
      return 'primary'
    case 'Planning':
      return 'default'
    default:
      return 'default'
  }
}

const getTaskStatusColor = status => {
  switch (status) {
    case 'Complete':
      return 'success'
    case 'In Progress':
      return 'info'
    case 'Pending':
      return 'default'
    default:
      return 'default'
  }
}

const getCorrectionStatusColor = status => {
  switch (status) {
    case 'Resolved':
      return 'success'
    case 'In Progress':
      return 'warning'
    default:
      return 'default'
  }
}

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export default function EntitlementPage() {
  const [projects, setProjects] = useState(initialProjects)
  const [selectedProject, setSelectedProject] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [newTask, setNewTask] = useState({ name: '', assignedTo: '', dueDate: '' })

  const [newCorrection, setNewCorrection] = useState({
    dateReceived: '',
    cityFeedback: '',
    actionItems: '',
    status: 'In Progress'
  })

  // Calculate stats
  const totalActivePermits = projects.filter(p => p.status !== 'Approved').length
  const avgDaysToApproval = 68 // Mock calculation
  const permitsInCorrections = projects.filter(p => p.status === 'Corrections').length

  const approvedThisMonth = projects.filter(p => {
    if (p.status !== 'Approved') return false
    const lastEvent = p.timeline[p.timeline.length - 1]

    if (!lastEvent) return false
    const eventDate = new Date(lastEvent.date)
    const now = new Date()

    
return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
  }).length

  const handleProjectClick = project => {
    setSelectedProject(project)
    setDialogOpen(true)
    setActiveTab(0)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedProject(null)
    setNewTask({ name: '', assignedTo: '', dueDate: '' })
    setNewCorrection({ dateReceived: '', cityFeedback: '', actionItems: '', status: 'In Progress' })
  }

  const handleAddTask = () => {
    if (!selectedProject || !newTask.name || !newTask.assignedTo) return

    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        const updatedTasks = [
          ...p.tasks,
          {
            id: p.tasks.length + 1,
            name: newTask.name,
            assignedTo: newTask.assignedTo,
            status: 'Pending',
            dueDate: newTask.dueDate
          }
        ]

        
return { ...p, tasks: updatedTasks }
      }

      
return p
    })

    setProjects(updatedProjects)
    setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id))
    setNewTask({ name: '', assignedTo: '', dueDate: '' })
  }

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        const updatedTasks = p.tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))

        
return { ...p, tasks: updatedTasks }
      }

      
return p
    })

    setProjects(updatedProjects)
    setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id))
  }

  const handleAddCorrection = () => {
    if (!selectedProject || !newCorrection.dateReceived || !newCorrection.cityFeedback) return

    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        const updatedCorrections = [
          ...p.corrections,
          {
            id: p.corrections.length + 1,
            number: p.corrections.length + 1,
            dateReceived: newCorrection.dateReceived,
            cityFeedback: newCorrection.cityFeedback,
            actionItems: newCorrection.actionItems,
            status: newCorrection.status,
            resolvedDate: null
          }
        ]

        
return { ...p, corrections: updatedCorrections }
      }

      
return p
    })

    setProjects(updatedProjects)
    setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id))
    setNewCorrection({ dateReceived: '', cityFeedback: '', actionItems: '', status: 'In Progress' })
  }

  const handleUpdateCorrectionStatus = (correctionId, newStatus) => {
    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        const updatedCorrections = p.corrections.map(c =>
          c.id === correctionId
            ? { ...c, status: newStatus, resolvedDate: newStatus === 'Resolved' ? new Date().toISOString().split('T')[0] : null }
            : c
        )

        
return { ...p, corrections: updatedCorrections }
      }

      
return p
    })

    setProjects(updatedProjects)
    setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id))
  }

  return (
    <div>
      {/* Page Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold mb-2">
            Entitlement & Permit Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track permit submissions, consultant tasks, and city review cycles
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<i className="ri-add-line" />}>
          New Permit Application
        </Button>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" className="mb-1">
                    Total Active Permits
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {totalActivePermits}
                  </Typography>
                </Box>
                <Box className="p-3 rounded bg-primary/10">
                  <i className="ri-file-list-3-line text-2xl text-primary" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" className="mb-1">
                    Average Days to Approval
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {avgDaysToApproval}
                  </Typography>
                </Box>
                <Box className="p-3 rounded bg-success/10">
                  <i className="ri-time-line text-2xl text-success" />
                </Box>
              </Box>
              <Chip label="Target: 90 days" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" className="mb-1">
                    Permits in Corrections
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {permitsInCorrections}
                  </Typography>
                </Box>
                <Box className="p-3 rounded bg-warning/10">
                  <i className="ri-error-warning-line text-2xl text-warning" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" className="mb-1">
                    Approved This Month
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {approvedThisMonth}
                  </Typography>
                </Box>
                <Box className="p-3 rounded bg-info/10">
                  <i className="ri-checkbox-circle-line text-2xl text-info" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Kanban Board */}
      <Box>
        <Typography variant="h6" className="font-semibold mb-4">
          Permit Pipeline
        </Typography>
        <Grid container spacing={2}>
          {statusColumns.map(status => {
            const statusProjects = projects.filter(p => p.status === status)

            
return (
              <Grid item xs={12} md={2.4} key={status}>
                <Paper elevation={0} className="p-3 bg-gray-50" sx={{ minHeight: '600px' }}>
                  <Box className="flex items-center justify-between mb-3">
                    <Typography variant="subtitle2" className="font-semibold">
                      {status}
                    </Typography>
                    <Chip label={statusProjects.length} size="small" color={getStatusColor(status)} />
                  </Box>
                  <Box className="space-y-2">
                    {statusProjects.map(project => (
                      <Card
                        key={project.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleProjectClick(project)}
                      >
                        <CardContent className="p-3">
                          <Typography variant="body2" className="font-medium mb-2 line-clamp-2">
                            {project.address}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" className="block mb-2">
                            {project.permitNumber}
                          </Typography>
                          <Box className="flex items-center justify-between mb-2">
                            <Chip
                              label={`${project.daysInStage} days`}
                              size="small"
                              variant="outlined"
                              className="text-xs"
                            />
                            <Chip
                              label={`${project.consultants.length} consultants`}
                              size="small"
                              variant="outlined"
                              className="text-xs"
                            />
                          </Box>
                          {project.corrections.length > 0 && (
                            <Chip
                              label={`${project.corrections.length} correction cycles`}
                              size="small"
                              color="warning"
                              variant="tonal"
                              className="text-xs"
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      </Box>

      {/* Project Detail Modal */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedProject && (
          <>
            <DialogTitle>
              <Box>
                <Typography variant="h6" className="font-bold">
                  {selectedProject.address}
                </Typography>
                <Box className="flex items-center gap-2 mt-2">
                  <Chip label={selectedProject.permitNumber} size="small" variant="outlined" />
                  <Chip label={selectedProject.status} size="small" color={getStatusColor(selectedProject.status)} />
                  <Chip label={selectedProject.jurisdiction} size="small" />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              {/* Permit Information Summary */}
              <Box className="mb-4 p-3 bg-gray-50 rounded">
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Submission Date
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {selectedProject.submitDate || 'Not submitted'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Days in {selectedProject.status}
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {selectedProject.daysInStage} days
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Consultants
                    </Typography>
                    <Box className="flex gap-1 mt-1 flex-wrap">
                      {selectedProject.consultants.map((consultant, idx) => (
                        <Chip key={idx} label={consultant} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Tabs */}
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} className="mb-3">
                <Tab label="Tasks" />
                <Tab label="Corrections" />
                <Tab label="Documents" />
                <Tab label="Timeline" />
              </Tabs>

              {/* Tab 1: Task Workflow */}
              <TabPanel value={activeTab} index={0}>
                <Box>
                  <Typography variant="subtitle2" className="font-semibold mb-3">
                    Consultant Tasks
                  </Typography>

                  {/* Task List */}
                  <List>
                    {selectedProject.tasks.map(task => (
                      <ListItem key={task.id} divider>
                        <ListItemText
                          primary={task.name}
                          secondary={
                            <span className="flex items-center gap-2 mt-1">
                              <Typography variant="caption" color="text.secondary" component="span">
                                {task.assignedTo}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" component="span">
                                • Due: {task.dueDate}
                              </Typography>
                            </span>
                          }
                        />
                        <ListItemSecondaryAction>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={task.status}
                              onChange={e => handleUpdateTaskStatus(task.id, e.target.value)}
                              size="small"
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="In Progress">In Progress</MenuItem>
                              <MenuItem value="Complete">Complete</MenuItem>
                            </Select>
                          </FormControl>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>

                  {/* Add New Task */}
                  <Box className="mt-4 p-3 border rounded">
                    <Typography variant="subtitle2" className="font-semibold mb-3">
                      Add New Task
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Task Name"
                          value={newTask.name}
                          onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Assign To"
                          value={newTask.assignedTo}
                          onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Due Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={newTask.dueDate}
                          onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button variant="outlined" size="small" onClick={handleAddTask}>
                          Add Task
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </TabPanel>

              {/* Tab 2: Correction Cycles */}
              <TabPanel value={activeTab} index={1}>
                <Box>
                  <Typography variant="subtitle2" className="font-semibold mb-3">
                    City Correction Cycles
                  </Typography>

                  {selectedProject.corrections.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" className="mb-4">
                      No correction cycles yet
                    </Typography>
                  ) : (
                    <TableContainer className="mb-4">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Cycle #</TableCell>
                            <TableCell>Date Received</TableCell>
                            <TableCell>City Feedback</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Resolved</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedProject.corrections.map(correction => (
                            <TableRow key={correction.id}>
                              <TableCell>{correction.number}</TableCell>
                              <TableCell>{correction.dateReceived}</TableCell>
                              <TableCell>
                                <Typography variant="body2" className="line-clamp-2">
                                  {correction.cityFeedback}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Action: {correction.actionItems}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <FormControl size="small" sx={{ minWidth: 100 }}>
                                  <Select
                                    value={correction.status}
                                    onChange={e => handleUpdateCorrectionStatus(correction.id, e.target.value)}
                                    size="small"
                                  >
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Resolved">Resolved</MenuItem>
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell>{correction.resolvedDate || '-'}</TableCell>
                              <TableCell>
                                <IconButton size="small">
                                  <i className="ri-more-2-fill" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* Add New Correction Cycle */}
                  <Box className="p-3 border rounded">
                    <Typography variant="subtitle2" className="font-semibold mb-3">
                      Add New Correction Cycle
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Date Received"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={newCorrection.dateReceived}
                          onChange={e => setNewCorrection({ ...newCorrection, dateReceived: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={newCorrection.status}
                            label="Status"
                            onChange={e => setNewCorrection({ ...newCorrection, status: e.target.value })}
                          >
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Resolved">Resolved</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="City Feedback"
                          multiline
                          rows={2}
                          value={newCorrection.cityFeedback}
                          onChange={e => setNewCorrection({ ...newCorrection, cityFeedback: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Action Items"
                          multiline
                          rows={2}
                          value={newCorrection.actionItems}
                          onChange={e => setNewCorrection({ ...newCorrection, actionItems: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button variant="outlined" size="small" onClick={handleAddCorrection}>
                          Add Correction Cycle
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </TabPanel>

              {/* Tab 3: Documents */}
              <TabPanel value={activeTab} index={2}>
                <Box>
                  <Box className="flex items-center justify-between mb-3">
                    <Typography variant="subtitle2" className="font-semibold">
                      Project Documents
                    </Typography>
                    <Button variant="outlined" size="small" startIcon={<i className="ri-upload-line" />}>
                      Upload Document
                    </Button>
                  </Box>

                  <List>
                    {selectedProject.documents.map((doc, idx) => (
                      <ListItem key={idx} divider>
                        <i className="ri-file-pdf-line text-xl text-error mr-3" />
                        <ListItemText primary={doc} secondary="Uploaded by System" />
                        <ListItemSecondaryAction>
                          <IconButton size="small">
                            <i className="ri-download-line" />
                          </IconButton>
                          <IconButton size="small">
                            <i className="ri-eye-line" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </TabPanel>

              {/* Tab 4: Timeline */}
              <TabPanel value={activeTab} index={3}>
                <Box>
                  <Typography variant="subtitle2" className="font-semibold mb-3">
                    Project Timeline
                  </Typography>

                  <Box className="space-y-3">
                    {selectedProject.timeline.map((event, idx) => (
                      <Box key={idx} className="flex gap-3">
                        <Box className="flex flex-col items-center">
                          <Box
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              event.type === 'status'
                                ? 'bg-primary/10'
                                : event.type === 'correction'
                                  ? 'bg-warning/10'
                                  : event.type === 'task'
                                    ? 'bg-info/10'
                                    : 'bg-success/10'
                            }`}
                          >
                            <i
                              className={`ri-${
                                event.type === 'status'
                                  ? 'checkbox-circle-line'
                                  : event.type === 'correction'
                                    ? 'error-warning-line'
                                    : event.type === 'task'
                                      ? 'task-line'
                                      : 'file-line'
                              } ${
                                event.type === 'status'
                                  ? 'text-primary'
                                  : event.type === 'correction'
                                    ? 'text-warning'
                                    : event.type === 'task'
                                      ? 'text-info'
                                      : 'text-success'
                              }`}
                            />
                          </Box>
                          {idx < selectedProject.timeline.length - 1 && (
                            <Box className="w-0.5 h-12 bg-gray-200 my-1" />
                          )}
                        </Box>
                        <Box className="flex-1">
                          <Typography variant="body2" className="font-medium">
                            {event.event}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {event.date}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </TabPanel>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button variant="contained" onClick={handleCloseDialog}>
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  )
}
