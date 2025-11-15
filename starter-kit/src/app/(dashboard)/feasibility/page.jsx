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
  TextField,
  Paper,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  InputAdornment
} from '@mui/material'

// Mock data for feasibility projects
const mockProjects = [
  {
    id: 1,
    address: '1234 Maple Street, Seattle, WA 98101',
    status: 'In Progress',
    assignedConsultants: 4,
    dueDate: '2025-11-21',
    startDate: '2025-11-01',
    consultantTasks: [
      { id: 1, type: 'Survey', consultant: 'Pacific Survey Co.', status: 'Delivered', dueDate: '2025-11-10', deliveredDate: '2025-11-09', documentUrl: 'survey_1234_maple.pdf' },
      { id: 2, type: 'Title', consultant: 'First American Title', status: 'Delivered', dueDate: '2025-11-12', deliveredDate: '2025-11-11', documentUrl: 'title_1234_maple.pdf' },
      { id: 3, type: 'Arborist', consultant: 'Green Tree Consulting', status: 'In Progress', dueDate: '2025-11-18', deliveredDate: null, documentUrl: null },
      { id: 4, type: 'Civil', consultant: 'Northwest Engineering', status: 'Ordered', dueDate: '2025-11-20', deliveredDate: null, documentUrl: null }
    ],
    proforma: {
      purchasePrice: 450000,
      constructionCost: 380000,
      softCosts: 95000,
      expectedSalePrice: 1150000
    },
    decision: null,
    decisionNotes: ''
  },
  {
    id: 2,
    address: '5678 Oak Avenue, Bellevue, WA 98004',
    status: 'Pending',
    assignedConsultants: 3,
    dueDate: '2025-11-25',
    startDate: '2025-11-05',
    consultantTasks: [
      { id: 5, type: 'Survey', consultant: 'Eastside Survey Group', status: 'Ordered', dueDate: '2025-11-15', deliveredDate: null, documentUrl: null },
      { id: 6, type: 'Title', consultant: 'Chicago Title', status: 'In Progress', dueDate: '2025-11-16', deliveredDate: null, documentUrl: null },
      { id: 7, type: 'Arborist', consultant: 'Tree Solutions LLC', status: 'Ordered', dueDate: '2025-11-22', deliveredDate: null, documentUrl: null }
    ],
    proforma: {
      purchasePrice: 620000,
      constructionCost: 520000,
      softCosts: 125000,
      expectedSalePrice: 1580000
    },
    decision: null,
    decisionNotes: ''
  },
  {
    id: 3,
    address: '910 Pine Road, Seattle, WA 98102',
    status: 'Complete',
    assignedConsultants: 5,
    dueDate: '2025-11-08',
    startDate: '2025-10-18',
    consultantTasks: [
      { id: 8, type: 'Survey', consultant: 'Pacific Survey Co.', status: 'Approved', dueDate: '2025-10-25', deliveredDate: '2025-10-24', documentUrl: 'survey_910_pine.pdf' },
      { id: 9, type: 'Title', consultant: 'First American Title', status: 'Approved', dueDate: '2025-10-26', deliveredDate: '2025-10-26', documentUrl: 'title_910_pine.pdf' },
      { id: 10, type: 'Arborist', consultant: 'Green Tree Consulting', status: 'Approved', dueDate: '2025-11-01', deliveredDate: '2025-10-31', documentUrl: 'arborist_910_pine.pdf' },
      { id: 11, type: 'Civil', consultant: 'Seattle Civil Engineering', status: 'Approved', dueDate: '2025-11-05', deliveredDate: '2025-11-04', documentUrl: 'civil_910_pine.pdf' },
      { id: 12, type: 'Geotechnical', consultant: 'GeoTech Northwest', status: 'Approved', dueDate: '2025-11-07', deliveredDate: '2025-11-06', documentUrl: 'geotech_910_pine.pdf' }
    ],
    proforma: {
      purchasePrice: 380000,
      constructionCost: 320000,
      softCosts: 78000,
      expectedSalePrice: 950000
    },
    decision: 'GO',
    decisionNotes: 'Strong margins, excellent location, all consultants green-lit the project.',
    decisionDate: '2025-11-08'
  },
  {
    id: 4,
    address: '2468 Cedar Lane, Redmond, WA 98052',
    status: 'In Progress',
    assignedConsultants: 4,
    dueDate: '2025-11-28',
    startDate: '2025-11-08',
    consultantTasks: [
      { id: 13, type: 'Survey', consultant: 'Eastside Survey Group', status: 'In Progress', dueDate: '2025-11-17', deliveredDate: null, documentUrl: null },
      { id: 14, type: 'Title', consultant: 'First American Title', status: 'Delivered', dueDate: '2025-11-15', deliveredDate: '2025-11-14', documentUrl: 'title_2468_cedar.pdf' },
      { id: 15, type: 'Arborist', consultant: 'Eastside Tree Services', status: 'Ordered', dueDate: '2025-11-24', deliveredDate: null, documentUrl: null },
      { id: 16, type: 'Civil', consultant: 'Northwest Engineering', status: 'Ordered', dueDate: '2025-11-26', deliveredDate: null, documentUrl: null }
    ],
    proforma: {
      purchasePrice: 580000,
      constructionCost: 480000,
      softCosts: 118000,
      expectedSalePrice: 1480000
    },
    decision: null,
    decisionNotes: ''
  },
  {
    id: 5,
    address: '1357 Birch Street, Kirkland, WA 98033',
    status: 'Pending',
    assignedConsultants: 3,
    dueDate: '2025-12-02',
    startDate: '2025-11-12',
    consultantTasks: [
      { id: 17, type: 'Survey', consultant: 'Pacific Survey Co.', status: 'Ordered', dueDate: '2025-11-20', deliveredDate: null, documentUrl: null },
      { id: 18, type: 'Title', consultant: 'Chicago Title', status: 'Ordered', dueDate: '2025-11-21', deliveredDate: null, documentUrl: null },
      { id: 19, type: 'Arborist', consultant: 'Tree Solutions LLC', status: 'Ordered', dueDate: '2025-11-29', deliveredDate: null, documentUrl: null }
    ],
    proforma: {
      purchasePrice: 510000,
      constructionCost: 425000,
      softCosts: 104000,
      expectedSalePrice: 1290000
    },
    decision: null,
    decisionNotes: ''
  },
  {
    id: 6,
    address: '7890 Spruce Avenue, Sammamish, WA 98074',
    status: 'Complete',
    assignedConsultants: 4,
    dueDate: '2025-11-05',
    startDate: '2025-10-15',
    consultantTasks: [
      { id: 20, type: 'Survey', consultant: 'Eastside Survey Group', status: 'Approved', dueDate: '2025-10-22', deliveredDate: '2025-10-21', documentUrl: 'survey_7890_spruce.pdf' },
      { id: 21, type: 'Title', consultant: 'First American Title', status: 'Approved', dueDate: '2025-10-24', deliveredDate: '2025-10-23', documentUrl: 'title_7890_spruce.pdf' },
      { id: 22, type: 'Arborist', consultant: 'Green Tree Consulting', status: 'Approved', dueDate: '2025-10-29', deliveredDate: '2025-10-28', documentUrl: 'arborist_7890_spruce.pdf' },
      { id: 23, type: 'Civil', consultant: 'Seattle Civil Engineering', status: 'Approved', dueDate: '2025-11-03', deliveredDate: '2025-11-02', documentUrl: 'civil_7890_spruce.pdf' }
    ],
    proforma: {
      purchasePrice: 695000,
      constructionCost: 575000,
      softCosts: 142000,
      expectedSalePrice: 1750000
    },
    decision: 'PASS',
    decisionNotes: 'Civil engineer flagged significant drainage issues that would add $80K+ to soft costs. ROI drops below threshold.',
    decisionDate: '2025-11-05'
  },
  {
    id: 7,
    address: '3690 Elm Court, Bothell, WA 98011',
    status: 'In Progress',
    assignedConsultants: 5,
    dueDate: '2025-11-30',
    startDate: '2025-11-10',
    consultantTasks: [
      { id: 24, type: 'Survey', consultant: 'Pacific Survey Co.', status: 'Delivered', dueDate: '2025-11-16', deliveredDate: '2025-11-15', documentUrl: 'survey_3690_elm.pdf' },
      { id: 25, type: 'Title', consultant: 'Chicago Title', status: 'In Progress', dueDate: '2025-11-18', deliveredDate: null, documentUrl: null },
      { id: 26, type: 'Arborist', consultant: 'Eastside Tree Services', status: 'In Progress', dueDate: '2025-11-25', deliveredDate: null, documentUrl: null },
      { id: 27, type: 'Civil', consultant: 'Northwest Engineering', status: 'Ordered', dueDate: '2025-11-28', deliveredDate: null, documentUrl: null },
      { id: 28, type: 'Geotechnical', consultant: 'GeoTech Northwest', status: 'Ordered', dueDate: '2025-11-29', deliveredDate: null, documentUrl: null }
    ],
    proforma: {
      purchasePrice: 425000,
      constructionCost: 360000,
      softCosts: 88000,
      expectedSalePrice: 1085000
    },
    decision: null,
    decisionNotes: ''
  }
]

export default function FeasibilityPage() {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0])
  const [statusFilter, setStatusFilter] = useState('All')
  const [projects, setProjects] = useState(mockProjects)

  // Calculate stats
  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Pending').length

  const pendingDeliverables = projects.reduce((sum, p) => {
    return sum + p.consultantTasks.filter(t => t.status === 'Ordered' || t.status === 'In Progress').length
  }, 0)

  const completedProjects = projects.filter(p => p.status === 'Complete')

  const avgCycleTime = completedProjects.length > 0
    ? Math.round(
        completedProjects.reduce((sum, p) => {
          const start = new Date(p.startDate)
          const end = new Date(p.decisionDate || p.dueDate)

          
return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        }, 0) / completedProjects.length
      )
    : 0

  const projectsToEntitlement = projects.filter(p => {
    if (p.decision !== 'GO') return false
    const decisionDate = new Date(p.decisionDate)
    const today = new Date()
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    
return decisionDate >= today && decisionDate <= endOfMonth
  }).length

  // Filter projects
  const filteredProjects = statusFilter === 'All'
    ? projects
    : projects.filter(p => {
        if (statusFilter === 'Pending') return p.status === 'Pending'
        if (statusFilter === 'In Progress') return p.status === 'In Progress'
        if (statusFilter === 'Complete') return p.status === 'Complete'
        
return true
      })

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ordered': return 'default'
      case 'In Progress': return 'warning'
      case 'Delivered': return 'info'
      case 'Approved': return 'success'
      case 'Complete': return 'success'
      case 'Pending': return 'default'
      default: return 'default'
    }
  }

  const calculateProforma = (proforma) => {
    const totalCost = proforma.purchasePrice + proforma.constructionCost + proforma.softCosts
    const profit = proforma.expectedSalePrice - totalCost
    const roi = ((profit / totalCost) * 100).toFixed(1)
    const margin = ((profit / proforma.expectedSalePrice) * 100).toFixed(1)

    
return { totalCost, profit, roi, margin }
  }

  const handleProjectClick = (project) => {
    setSelectedProject(project)
  }

  const handleDecision = (decision) => {
    const updatedProjects = projects.map(p =>
      p.id === selectedProject.id
        ? {
            ...p,
            decision,
            decisionDate: new Date().toISOString().split('T')[0],
            status: 'Complete'
          }
        : p
    )

    setProjects(updatedProjects)
    setSelectedProject({
      ...selectedProject,
      decision,
      decisionDate: new Date().toISOString().split('T')[0],
      status: 'Complete'
    })
  }

  const handleDecisionNotesChange = (e) => {
    const notes = e.target.value

    const updatedProjects = projects.map(p =>
      p.id === selectedProject.id ? { ...p, decisionNotes: notes } : p
    )

    setProjects(updatedProjects)
    setSelectedProject({ ...selectedProject, decisionNotes: notes })
  }

  const handleProformaChange = (field, value) => {
    const updatedProforma = { ...selectedProject.proforma, [field]: parseFloat(value) || 0 }

    const updatedProjects = projects.map(p =>
      p.id === selectedProject.id ? { ...p, proforma: updatedProforma } : p
    )

    setProjects(updatedProjects)
    setSelectedProject({ ...selectedProject, proforma: updatedProforma })
  }

  return (
    <div>
      {/* Page Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold mb-2">
            Feasibility Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track due diligence, consultant deliverables, and viability assessment
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<i className="ri-add-line" />}>
          New Feasibility Project
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Active Projects
              </Typography>
              <Typography variant="h4" className="font-bold">
                {activeProjects}
              </Typography>
              <Chip
                label={`${projects.length} total`}
                size="small"
                color="info"
                variant="tonal"
                className="mt-2"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Pending Consultant Deliverables
              </Typography>
              <Typography variant="h4" className="font-bold">
                {pendingDeliverables}
              </Typography>
              <Chip
                label={pendingDeliverables > 15 ? 'High volume' : 'On track'}
                size="small"
                color={pendingDeliverables > 15 ? 'warning' : 'success'}
                variant="tonal"
                className="mt-2"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Average Cycle Time
              </Typography>
              <Typography variant="h4" className="font-bold">
                {avgCycleTime} days
              </Typography>
              <Chip
                label={avgCycleTime <= 21 ? 'Below target' : 'Above target'}
                size="small"
                color={avgCycleTime <= 21 ? 'success' : 'warning'}
                variant="tonal"
                className="mt-2"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Projects Going to Entitlement This Month
              </Typography>
              <Typography variant="h4" className="font-bold">
                {projectsToEntitlement}
              </Typography>
              <Chip
                label={completedProjects.filter(p => p.decision === 'GO').length + ' approved total'}
                size="small"
                color="success"
                variant="tonal"
                className="mt-2"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content - Split View */}
      <Grid container spacing={3}>
        {/* Left Side - Project List */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold">
                  Projects
                </Typography>
                <Chip
                  label={`${filteredProjects.length} shown`}
                  size="small"
                  variant="outlined"
                />
              </Box>

              {/* Status Filter */}
              <Tabs
                value={statusFilter}
                onChange={(e, newValue) => setStatusFilter(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                className="mb-4"
              >
                <Tab label="All" value="All" />
                <Tab label="Pending" value="Pending" />
                <Tab label="In Progress" value="In Progress" />
                <Tab label="Complete" value="Complete" />
              </Tabs>

              <Divider className="mb-3" />

              {/* Project List */}
              <Box className="space-y-3" sx={{ maxHeight: '800px', overflowY: 'auto' }}>
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    variant={selectedProject?.id === project.id ? 'outlined' : 'elevation'}
                    sx={{
                      cursor: 'pointer',
                      borderWidth: selectedProject?.id === project.id ? 2 : 1,
                      borderColor: selectedProject?.id === project.id ? 'primary.main' : 'divider',
                      '&:hover': { boxShadow: 3 }
                    }}
                    onClick={() => handleProjectClick(project)}
                  >
                    <CardContent>
                      <Typography variant="subtitle2" className="font-semibold mb-1">
                        {project.address}
                      </Typography>
                      <Box className="flex gap-2 mb-2">
                        <Chip
                          label={project.status}
                          size="small"
                          color={getStatusColor(project.status)}
                          variant="outlined"
                        />
                      </Box>
                      <Box className="flex justify-between items-center">
                        <Typography variant="caption" color="text.secondary">
                          <i className="ri-team-line mr-1" />
                          {project.assignedConsultants} consultants
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <i className="ri-calendar-line mr-1" />
                          Due {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side - Project Detail */}
        <Grid item xs={12} md={8}>
          {selectedProject && (
            <Box className="space-y-4">
              {/* Project Header */}
              <Card>
                <CardContent>
                  <Box className="flex justify-between items-start mb-2">
                    <Box>
                      <Typography variant="h5" className="font-bold mb-1">
                        {selectedProject.address}
                      </Typography>
                      <Box className="flex gap-2">
                        <Chip
                          label={selectedProject.status}
                          size="small"
                          color={getStatusColor(selectedProject.status)}
                        />
                        {selectedProject.decision && (
                          <Chip
                            label={`Decision: ${selectedProject.decision}`}
                            size="small"
                            color={selectedProject.decision === 'GO' ? 'success' : 'error'}
                            variant="filled"
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <Grid container spacing={2} className="mt-3">
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Start Date
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {new Date(selectedProject.startDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Due Date
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {new Date(selectedProject.dueDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Consultant Tasks
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {selectedProject.consultantTasks.length}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Days Elapsed
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {Math.ceil((new Date() - new Date(selectedProject.startDate)) / (1000 * 60 * 60 * 24))}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Consultant Tasks Section */}
              <Card>
                <CardContent>
                  <Box className="flex justify-between items-center mb-3">
                    <Typography variant="h6" className="font-semibold">
                      Consultant Tasks
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<i className="ri-add-line" />}
                    >
                      Add Task
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Type</strong></TableCell>
                          <TableCell><strong>Consultant</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                          <TableCell><strong>Due Date</strong></TableCell>
                          <TableCell><strong>Delivered</strong></TableCell>
                          <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedProject.consultantTasks.map((task) => (
                          <TableRow key={task.id} hover>
                            <TableCell>
                              <Chip
                                label={task.type}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{task.consultant}</TableCell>
                            <TableCell>
                              <Chip
                                label={task.status}
                                size="small"
                                color={getStatusColor(task.status)}
                                variant="tonal"
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </TableCell>
                            <TableCell>
                              {task.deliveredDate ? (
                                <Typography variant="body2" color="success.main">
                                  {new Date(task.deliveredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Typography>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  -
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small" color="primary">
                                <i className="ri-edit-line text-lg" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

              {/* Documents Section */}
              <Card>
                <CardContent>
                  <Box className="flex justify-between items-center mb-3">
                    <Typography variant="h6" className="font-semibold">
                      Consultant Documents
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<i className="ri-upload-cloud-line" />}
                    >
                      Upload Document
                    </Button>
                  </Box>
                  <List>
                    {selectedProject.consultantTasks
                      .filter(task => task.documentUrl)
                      .map((task) => (
                        <ListItem
                          key={task.id}
                          secondaryAction={
                            <Box className="flex gap-1">
                              <Chip
                                label="AI Extraction: Pending"
                                size="small"
                                color="default"
                                variant="outlined"
                                icon={<i className="ri-robot-line" />}
                              />
                              <IconButton edge="end" size="small">
                                <i className="ri-download-line" />
                              </IconButton>
                            </Box>
                          }
                        >
                          <ListItemIcon>
                            <i className="ri-file-pdf-line text-2xl text-red-600" />
                          </ListItemIcon>
                          <ListItemText
                            primary={task.documentUrl}
                            secondary={`${task.type} - Delivered ${new Date(task.deliveredDate).toLocaleDateString()}`}
                          />
                        </ListItem>
                      ))}
                    {selectedProject.consultantTasks.filter(task => task.documentUrl).length === 0 && (
                      <ListItem>
                        <ListItemText
                          primary="No documents uploaded yet"
                          secondary="Documents will appear here as consultants deliver their reports"
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>

              {/* Proforma Section */}
              <Card>
                <CardContent>
                  <Typography variant="h6" className="font-semibold mb-3">
                    Financial Proforma
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Purchase Price"
                        type="number"
                        fullWidth
                        size="small"
                        value={selectedProject.proforma.purchasePrice}
                        onChange={(e) => handleProformaChange('purchasePrice', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Construction Cost"
                        type="number"
                        fullWidth
                        size="small"
                        value={selectedProject.proforma.constructionCost}
                        onChange={(e) => handleProformaChange('constructionCost', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Soft Costs"
                        type="number"
                        fullWidth
                        size="small"
                        value={selectedProject.proforma.softCosts}
                        onChange={(e) => handleProformaChange('softCosts', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Expected Sale Price"
                        type="number"
                        fullWidth
                        size="small"
                        value={selectedProject.proforma.expectedSalePrice}
                        onChange={(e) => handleProformaChange('expectedSalePrice', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Divider className="my-4" />

                  {/* Calculated Metrics */}
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Total Cost
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        ${calculateProforma(selectedProject.proforma).totalCost.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Profit
                      </Typography>
                      <Typography variant="h6" className="font-bold" color="success.main">
                        ${calculateProforma(selectedProject.proforma).profit.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        ROI
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        {calculateProforma(selectedProject.proforma).roi}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Margin
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        {calculateProforma(selectedProject.proforma).margin}%
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Decision Section */}
              <Card>
                <CardContent>
                  <Typography variant="h6" className="font-semibold mb-3">
                    Feasibility Decision
                  </Typography>

                  {selectedProject.decision ? (
                    <Box>
                      <Box className="flex gap-3 mb-3">
                        <Chip
                          label={`Decision: ${selectedProject.decision}`}
                          color={selectedProject.decision === 'GO' ? 'success' : 'error'}
                          size="large"
                        />
                        <Typography variant="body2" color="text.secondary">
                          Decided on {new Date(selectedProject.decisionDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Paper variant="outlined" className="p-4">
                        <Typography variant="body2" color="text.secondary" className="mb-1">
                          Decision Notes
                        </Typography>
                        <Typography variant="body1">
                          {selectedProject.decisionNotes || 'No notes provided'}
                        </Typography>
                      </Paper>
                    </Box>
                  ) : (
                    <Box>
                      <Box className="flex gap-3 mb-4">
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          startIcon={<i className="ri-check-line" />}
                          onClick={() => handleDecision('GO')}
                          sx={{ flex: 1 }}
                        >
                          GO - Proceed to Entitlement
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="large"
                          startIcon={<i className="ri-close-line" />}
                          onClick={() => handleDecision('PASS')}
                          sx={{ flex: 1 }}
                        >
                          PASS - Reject Project
                        </Button>
                      </Box>
                      <TextField
                        label="Decision Notes"
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Document the rationale for this decision, key findings from consultants, risk factors, or opportunities..."
                        value={selectedProject.decisionNotes}
                        onChange={handleDecisionNotesChange}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </Grid>
      </Grid>
    </div>
  )
}
