'use client'

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Avatar,
  AvatarGroup,
  List,
  ListItem
} from '@mui/material'

export default function FeasibilityPage() {
  const projects = [
    {
      id: 1,
      name: 'Park Place Development',
      address: '1234 Maple St, Seattle, WA',
      stage: 'Due Diligence',
      progress: 65,
      daysInStage: 12,
      targetDays: 21,
      pendingTasks: [
        { type: 'Survey', status: 'In Progress', dueIn: '3 days' },
        { type: 'Title Report', status: 'Completed', dueIn: '' },
        { type: 'Arborist Report', status: 'Pending', dueIn: '5 days' }
      ],
      team: ['JD', 'SM', 'AK']
    },
    {
      id: 2,
      name: 'Greenwood Estates',
      address: '5678 Oak Ave, Bellevue, WA',
      stage: 'Proforma Review',
      progress: 85,
      daysInStage: 8,
      targetDays: 10,
      pendingTasks: [
        { type: 'Financial Model', status: 'In Progress', dueIn: '1 day' },
        { type: 'Market Comp', status: 'Completed', dueIn: '' }
      ],
      team: ['JD', 'TL']
    },
    {
      id: 3,
      name: 'Madison Park Homes',
      address: '910 Pine Rd, Seattle, WA',
      stage: 'Consultant Ordering',
      progress: 30,
      daysInStage: 4,
      targetDays: 21,
      pendingTasks: [
        { type: 'Survey', status: 'Ordered', dueIn: '7 days' },
        { type: 'Title Report', status: 'Ordered', dueIn: '5 days' },
        { type: 'Arborist Report', status: 'Not Started', dueIn: '10 days' }
      ],
      team: ['SM']
    }
  ]

  const getStageColor = stage => {
    if (stage.includes('Consultant')) return 'info'
    if (stage.includes('Due Diligence')) return 'warning'
    if (stage.includes('Proforma')) return 'success'
    return 'default'
  }

  return (
    <div>
      {/* Page Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold mb-2">
            Feasibility Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track due diligence and viability assessment for active projects
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<i className="ri-add-line" />}>
          New Project
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Active Projects
              </Typography>
              <Typography variant="h4" className="font-bold">
                23
              </Typography>
              <Chip label="+3 this week" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Avg Cycle Time
              </Typography>
              <Typography variant="h4" className="font-bold">
                18 days
              </Typography>
              <Chip label="Target: 21 days" size="small" color="success" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Pending Reports
              </Typography>
              <Typography variant="h4" className="font-bold">
                12
              </Typography>
              <Chip label="2 overdue" size="small" color="error" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" className="mb-1">
                Go Rate
              </Typography>
              <Typography variant="h4" className="font-bold">
                68%
              </Typography>
              <Chip label="+5% vs Q3" size="small" color="info" variant="tonal" className="mt-2" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Projects List */}
      <Box className="space-y-4">
        {projects.map(project => (
          <Card key={project.id}>
            <CardContent>
              <Grid container spacing={3}>
                {/* Project Info */}
                <Grid item xs={12} md={4}>
                  <Box>
                    <Box className="flex items-start justify-between mb-2">
                      <Box>
                        <Typography variant="h6" className="font-semibold mb-1">
                          {project.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {project.address}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="flex items-center gap-2 mt-3">
                      <Chip label={project.stage} size="small" color={getStageColor(project.stage)} variant="outlined" />
                      <Typography variant="caption" color="text.secondary">
                        Day {project.daysInStage} of {project.targetDays}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Progress */}
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" className="font-medium mb-2">
                    Overall Progress
                  </Typography>
                  <Box className="flex items-center gap-2">
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      className="flex-1 h-2 rounded"
                      color={project.progress >= 80 ? 'success' : project.progress >= 50 ? 'warning' : 'info'}
                    />
                    <Typography variant="body2" className="font-bold">
                      {project.progress}%
                    </Typography>
                  </Box>
                  <Box className="mt-3">
                    <Typography variant="caption" color="text.secondary" className="mb-1 block">
                      Pending Tasks
                    </Typography>
                    <Box className="flex gap-1 flex-wrap">
                      {project.pendingTasks.map((task, idx) => (
                        <Chip
                          key={idx}
                          label={task.type}
                          size="small"
                          color={task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'warning' : 'default'}
                          variant="tonal"
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>

                {/* Team & Actions */}
                <Grid item xs={12} md={4}>
                  <Box className="flex flex-col h-full justify-between">
                    <Box>
                      <Typography variant="body2" className="font-medium mb-2">
                        Team
                      </Typography>
                      <AvatarGroup max={4} className="justify-start">
                        {project.team.map((member, idx) => (
                          <Avatar key={idx} className="w-8 h-8 text-sm">
                            {member}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </Box>
                    <Box className="flex gap-2 mt-3">
                      <Button variant="outlined" size="small" fullWidth>
                        View Details
                      </Button>
                      <Button variant="contained" size="small" fullWidth>
                        Update
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  )
}
