'use client'

// MUI Imports
import { Grid, Card, CardContent, Typography, Box, Chip, Divider, List, ListItem, ListItemText } from '@mui/material'

export default function AboutPage() {
  const features = [
    {
      title: 'Lead Intake & Management',
      description: 'Streamlined lead submission and automated assignment with AI-powered prioritization',
      icon: 'ri-user-search-line',
      color: 'primary'
    },
    {
      title: 'Feasibility Analysis',
      description: 'Consultant coordination, document management, and automated proforma calculations',
      icon: 'ri-file-list-3-line',
      color: 'info'
    },
    {
      title: 'Entitlement Tracking',
      description: 'Permit management, correction cycle tracking, and municipal coordination',
      icon: 'ri-government-line',
      color: 'warning'
    },
    {
      title: 'Loan Origination',
      description: 'Automated loan creation, document generation, and compliance checks',
      icon: 'ri-money-dollar-circle-line',
      color: 'success'
    },
    {
      title: 'Construction Servicing',
      description: 'Draw management, inspection workflows, and automated condition checks',
      icon: 'ri-money-dollar-box-line',
      color: 'secondary'
    },
    {
      title: 'Contact Management',
      description: 'Comprehensive CRM with relationship mapping and activity tracking',
      icon: 'ri-contacts-line',
      color: 'error'
    }
  ]

  const techStack = [
    'Next.js 15.5.6 - React Framework',
    'Material-UI v6 - Component Library',
    'Recharts - Data Visualization',
    'React 18 - UI Library',
    'Tailwind CSS - Utility Styling'
  ]

  const metrics = [
    { label: 'Feasibility Cycle Time', target: '-50%', status: 'On Track' },
    { label: 'Entitlement Prep Time', target: '-50%', status: 'On Track' },
    { label: 'Deals per FTE', target: '2x', status: 'On Track' },
    { label: 'Draw Turnaround', target: '-60%', status: 'On Track' },
    { label: 'User Adoption', target: '≥85%', status: 'Target' },
    { label: 'System Uptime', target: '≥99.5%', status: 'Target' }
  ]

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display='flex' alignItems='center' gap={3} mb={2}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  borderRadius: 2
                }}
              >
                <svg width='50' height='50' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <rect x='4' y='4' width='32' height='32' rx='2' stroke='white' strokeWidth='2' fill='none' />
                  <line x1='20' y1='8' x2='20' y2='32' stroke='white' strokeWidth='1' opacity='0.4' />
                  <line x1='8' y1='20' x2='32' y2='20' stroke='white' strokeWidth='1' opacity='0.4' />
                  <path d='M20 12 L28 18 L28 28 L12 28 L12 18 Z' fill='white' opacity='0.8' />
                  <path d='M20 12 L28 18 L12 18 Z' fill='white' />
                  <rect x='18' y='23' width='4' height='5' fill='var(--mui-palette-primary-main)' rx='0.5' />
                  <rect x='14' y='20' width='3' height='3' fill='var(--mui-palette-primary-main)' rx='0.5' />
                  <rect x='23' y='20' width='3' height='3' fill='var(--mui-palette-primary-main)' rx='0.5' />
                </svg>
              </Box>
              <Box flex={1}>
                <Typography variant='h4' gutterBottom>
                  Connect 2.0
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  Next-generation platform for residential construction lending and development management
                </Typography>
              </Box>
              <Chip label='v2.0.0 MVP' color='primary' size='large' />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Product Vision */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Product Vision
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant='body1' paragraph>
              Connect 2.0 is an AI-native platform that transforms Blueprint&apos;s operations into a frontier firm while
              establishing Datapage&apos;s commercial platform strategy. It unifies lead intake, feasibility analysis,
              entitlement tracking, design coordination, lending, and servicing into a single, intelligent system.
            </Typography>
            <Typography variant='body1' paragraph>
              The platform enables <strong>30% revenue growth</strong> with modest headcount increases through
              technology, automation, and data leverage while maintaining Blueprint&apos;s{' '}
              <strong>zero-default track record</strong> across $3B+ in loans originated.
            </Typography>
            <Box mt={3}>
              <Typography variant='subtitle2' gutterBottom>
                Key Objectives
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary='Single Source of Truth'
                    secondary='Unified platform from lead intake through loan servicing'
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary='Automated Workflows'
                    secondary='Eliminate manual data entry and administrative burden'
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary='AI-Assisted Decisions'
                    secondary='Surface insights, flag risks, recommend actions'
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary='Scalable Operations'
                    secondary='2x throughput without 2x headcount through technology leverage'
                  />
                </ListItem>
              </List>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Success Metrics */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              180-Day Success Metrics
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <List dense>
              {metrics.map((metric, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                  <ListItemText
                    primary={metric.label}
                    secondary={metric.target}
                    secondaryTypographyProps={{
                      component: 'span',
                      variant: 'body2',
                      color: 'primary',
                      sx: { display: 'block', mt: 0.5 }
                    }}
                  />
                  <Chip label={metric.status} size='small' color='success' variant='outlined' />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Platform Modules */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Platform Modules
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      height: '100%',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      '&:hover': { borderColor: `${feature.color}.main`, boxShadow: 2 }
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        bgcolor: `${feature.color}.main`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                      }}
                    >
                      <i className={feature.icon} style={{ fontSize: '1.5rem', color: 'white' }} />
                    </Box>
                    <Typography variant='subtitle1' gutterBottom fontWeight={600}>
                      {feature.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Architecture & Technology */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Architecture Principles
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <List>
              <ListItem>
                <ListItemText
                  primary='Cloud-Native & API-First'
                  secondary='RESTful APIs, microservices architecture, stateless services for horizontal scaling'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='Experience-Led Development'
                  secondary='UX design informs backend architecture, unified interface replacing fragmented tools'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='Composable & Modular'
                  secondary='Independent modules that can be deployed, versioned, and swapped without touching others'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='Data-Centric Design'
                  secondary='Single source of truth with semantic layer and unified data model'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='Progressive Multi-Tenancy'
                  secondary='Foundation built for future commercialization via Datapage platform'
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Technology Stack */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Technology Stack
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <List>
              {techStack.map((tech, index) => (
                <ListItem key={index}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      mr: 2
                    }}
                  />
                  <ListItemText primary={tech} />
                </ListItem>
              ))}
            </List>
            <Box mt={3}>
              <Typography variant='subtitle2' gutterBottom>
                Blueprint as &quot;Client Zero&quot;
              </Typography>
              <Typography variant='body2' color='text.secondary' paragraph>
                Blueprint serves as the proving ground for Connect 2.0, testing under actual business conditions while
                providing immediate feedback to inform product design.
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Successful transformation becomes the sales story for Datapage&apos;s commercial platform strategy.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Footer Info */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant='subtitle2' gutterBottom>
                  Program Timeline
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  180-day phased delivery approach with decision gates at Days 30, 90, and 180
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant='subtitle2' gutterBottom>
                  Current Phase
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Days 1-90: Design & Entitlement Module MVP Pilot
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant='subtitle2' gutterBottom>
                  Markets Served
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Seattle & Phoenix metropolitan areas (Blueprint&apos;s operating markets)
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
